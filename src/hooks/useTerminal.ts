import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useVFSStore } from '../stores/vfsStore';
import { useLabStore } from '../stores/labStore';
import { useUIStore } from '../stores/uiStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { VFS } from '../features/vfs/vfs';
import { CommandParser } from '../features/command-engine/parser';
import { CommandExecutor } from '../features/command-engine/executor';
import { CommandRegistry } from '../features/command-engine/registry';
import { CommandContext, CommandResult } from '../features/command-engine/types';
import { VerificationEngine } from '../features/lab-engine/verification';
import { TerminalEntry } from '../types/terminal';
import '../features/command-engine/commands';

export function useTerminal() {
    const { username: uiUsername } = useUIStore();
    const { snapshot, setSnapshot } = useVFSStore();
    const [history, setHistory] = useState<TerminalEntry[]>([]);
    const [cwd, setCwd] = useState<string>('/home/' + uiUsername);
    const [userId, setUserId] = useState<string>(uiUsername);
    const [env, setEnv] = useState<Record<string, string>>({
        USER: uiUsername,
        PWD: '/home/' + uiUsername,
        HOME: '/home/' + uiUsername,
        PATH: '/usr/bin:/bin',
        TERM: 'xterm-256color',
        SHELL: '/bin/bash',
    });
    const [processes, setProcesses] = useState<{ pid: number; name: string; user: string; startTime: number }[]>([]);

    // Sync terminal identity when Zustand hydrates the persisted username
    useEffect(() => {
        if (uiUsername && uiUsername !== userId) {
            const newHome = '/home/' + uiUsername;
            setUserId(uiUsername);
            setCwd(newHome);
            setEnv(prev => ({
                ...prev,
                USER: uiUsername,
                PWD: newHome,
                HOME: newHome,
            }));
        }
    }, [uiUsername]);
    const [pendingPrompt, setPendingPrompt] = useState<{ message: string; resolve: (val: string) => void } | null>(null);

    // Initialize VFS from snapshot or default
    const vfsRef = useRef<VFS>(new VFS(snapshot || undefined));
    const executorRef = useRef<CommandExecutor>(new CommandExecutor(vfsRef.current));

    useEffect(() => {
        if (processes.length === 0) {
            setProcesses([
                { pid: 1, name: 'systemd', user: 'root', startTime: Date.now() - 3600000 },
                { pid: 142, name: 'sshd', user: 'root', startTime: Date.now() - 3000000 },
                { pid: 501, name: 'bash', user: userId, startTime: Date.now() - 600000 },
            ]);
        }
    }, [userId]);

    // Sync VFS back to store on changes
    const syncVFS = useCallback(() => {
        setSnapshot(vfsRef.current.getSnapshot());
    }, [setSnapshot]);

    const handleTabComplete = useCallback((currentInput: string): string => {
        const parts = currentInput.split(' ');
        const lastPart = parts[parts.length - 1];
        const isFirstWord = parts.length === 1;

        if (isFirstWord) {
            // Complete command names
            const cmds = CommandRegistry.list();
            const matches = cmds.filter((c: string) => c.startsWith(lastPart));
            if (matches.length === 1) return matches[0] + ' ';
            return currentInput; // TODO: handle multiple matches (show list?)
        }

        if (lastPart.startsWith('-')) {
            // Complete common flags
            const commonFlags = ['-i', '-f', '-r', '-R', '-p', '-m', '-n', '-v', '-l', '-a'];
            const matches = commonFlags.filter(f => f.startsWith(lastPart));
            if (matches.length === 1) {
                parts[parts.length - 1] = matches[0];
                return parts.join(' ') + ' ';
            }
            return currentInput;
        }

        // Complete paths
        const lastSlash = lastPart.lastIndexOf('/');
        let dirPath = lastSlash === -1 ? '.' : lastPart.substring(0, lastSlash) || '/';
        let search = lastSlash === -1 ? lastPart : lastPart.substring(lastSlash + 1);

        const absoluteDirPath = dirPath === '.' ? cwd : (dirPath.startsWith('/') ? dirPath : cwd + '/' + dirPath);
        const children = vfsRef.current.listChildren(absoluteDirPath, userId);

        if (Array.isArray(children)) {
            const matches = children.filter(c => c.name.startsWith(search));
            if (matches.length === 1) {
                const matchName = matches[0].name + (matches[0].type === 'directory' ? '/' : ' ');
                if (lastSlash === -1) {
                    parts[parts.length - 1] = matchName;
                } else {
                    parts[parts.length - 1] = lastPart.substring(0, lastSlash + 1) + matchName;
                }
                return parts.join(' ');
            }
        }

        return currentInput;
    }, [cwd, userId]);

    const executeCommand = useCallback(async (input: string) => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        const segments = CommandParser.parseCompound(trimmedInput);
        const context: CommandContext = {
            cwd,
            userId,
            vfs: vfsRef.current,
            env: { ...env, PWD: cwd, USER: userId },
            history: history.map(h => h.command),
            processes,
            updateEnv: (newEnv: Record<string, string>) => setEnv(prev => ({ ...prev, ...newEnv })),
            updateProcesses: (newProcs: any[]) => setProcesses(newProcs),
            prompt: (message: string) => new Promise<string>((resolve) => {
                setPendingPrompt({ message, resolve });
            }),
        };

        // Execute compound commands (;, &&, ||)
        let result: CommandResult = { output: '', exitCode: 0 };
        const outputs: string[] = [];

        for (const segment of segments) {
            const pipeline = segment.pipeline;
            if (pipeline.actions.length === 0) continue;

            result = await executorRef.current.execute(pipeline, context);
            if (result.output) outputs.push(result.output);
            if (result.error) outputs.push(result.error);

            // Handle && (continue only on success) and || (continue only on failure)
            if (segment.operator === '&&' && result.exitCode !== 0) break;
            if (segment.operator === '||' && result.exitCode === 0) break;
            // ; always continues
        }

        // Merge outputs
        result = { ...result, output: outputs.join('\n') };

        // Lab Verification Logic
        const { currentLabId, labs, progress, updateProgress } = useLabStore.getState();
        const { incrementCounter, checkAchievements, updateQuestProgress } = useGamificationStore.getState();

        if (currentLabId && labs[currentLabId]) {
            const lab = labs[currentLabId];
            const labProgress = progress[currentLabId];

            if (lab.type === 'guided' && lab.steps && labProgress) {
                const isCorrect = VerificationEngine.verifyGuidedStep(lab, labProgress.currentStepIndex, trimmedInput);
                if (isCorrect) {
                    const nextIndex = labProgress.currentStepIndex + 1;

                    updateProgress(currentLabId, {
                        currentStepIndex: nextIndex
                    });

                    // Rewards, streaks, and setting status to 'completed' are handled
                    // by the LabView component's useEffect when it detects currentStepIndex >= total steps.
                }
            }
        }

        // Achievement Counter Tracking — per gamification_framework.md §2.4
        incrementCounter('commands-executed');
        updateQuestProgress('execute_commands', 1);
        const firstPipeline = segments[0]?.pipeline;
        const cmdName = firstPipeline?.actions[0]?.name;
        if (cmdName === 'chmod') incrementCounter('chmod-count');
        if (cmdName === 'grep') incrementCounter('grep-count');
        if (cmdName === 'kill') incrementCounter('kill-count');
        if (cmdName === 'man') incrementCounter('man-pages-read');
        if (cmdName === 'cd') incrementCounter('cd-count');
        if (cmdName === 'touch' || cmdName === 'tee') incrementCounter('files-created');

        // Track pipe usage for Pipe Wizard achievement
        if (firstPipeline && firstPipeline.actions.length > 1) incrementCounter('pipe-count');

        // Track unique commands for Command Master achievement
        const uniqueKey = `__unique_cmd_${cmdName}`;
        const { counters } = useGamificationStore.getState();
        if (cmdName && !counters[uniqueKey]) {
            incrementCounter(uniqueKey); // mark this command as seen
            incrementCounter('unique-commands');
        }

        if (currentLabId && labs[currentLabId]) {
            const labProgress = progress[currentLabId];
            if (labProgress?.status === 'completed') {
                const hour = new Date().getHours();
                if (hour >= 0 && hour < 5) incrementCounter('night-owl');
                if (hour >= 5 && hour < 8) incrementCounter('early-bird');
            }
        }

        // Run achievement check after every command
        checkAchievements();

        // Handle special case: cd updates CWD
        if (firstPipeline && firstPipeline.actions.length === 1 && firstPipeline.actions[0].name === 'cd' && result.exitCode === 0) {
            setCwd(result.output || '/');
        }

        // Add to history
        const entry: TerminalEntry = {
            id: uuidv4(),
            command: trimmedInput,
            output: result.output,
            error: result.error,
            cwd, // record the CWD where it was executed
            timestamp: Date.now(),
        };

        if (trimmedInput === 'clear') {
            setHistory([]);
        } else {
            setHistory(prev => [...prev, entry]);
        }

        syncVFS();
        return result;
    }, [cwd, userId, syncVFS]);

    return {
        history,
        cwd,
        userId,
        env,
        processes,
        vfs: vfsRef.current,
        executeCommand,
        handleTabComplete,
        setUserId,
        pendingPrompt,
        resolvePrompt: (answer: string) => {
            if (pendingPrompt) {
                pendingPrompt.resolve(answer);
                setPendingPrompt(null);
            }
        },
    };
}
