import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useVFSStore } from '../stores/vfsStore';
import { useLabStore } from '../stores/labStore';
import { useUIStore } from '../stores/uiStore';
import { useTerminalStore } from '../stores/terminalStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { VFS } from '../features/vfs/vfs';
import { Lexer } from '../features/command-engine/shell/lexer';
import { Parser } from '../features/command-engine/shell/parser';
import { ShellExecutor } from '../features/command-engine/shell/executor';
import { ShellEnvironment } from '../features/command-engine/shell/environment';
import { CommandRegistry } from '../features/command-engine/registry';
import { CommandContext, CommandResult, Signal } from '../features/command-engine/types';
import { VerificationEngine } from '../features/lab-engine/verification';
import { TerminalEntry } from '../types/terminal';
import '../features/command-engine/commands';

export function useTerminal() {
    const { username: uiUsername } = useUIStore();
    const { snapshot, setSnapshot } = useVFSStore();
    const [history, setHistory] = useState<TerminalEntry[]>([]);
    const historyRef = useRef<TerminalEntry[]>([]); // Ref for stable access in callbacks
    const [cwd, setCwd] = useState<string>('/home/' + uiUsername);
    const cwdRef = useRef<string>('/home/' + uiUsername); // Ref to avoid closure issues in executeCommand
    const [userId, setUserId] = useState<string>(uiUsername);
    const [env, setEnv] = useState<Record<string, string>>({
        USER: uiUsername,
        PWD: '/home/' + uiUsername,
        HOME: '/home/' + uiUsername,
        PATH: '/usr/bin:/bin',
        TERM: 'xterm-256color',
        SHELL: '/bin/bash',
    });
    const { processes, setProcesses, jobs, setJobs } = useTerminalStore();

    // Sync terminal identity when Zustand hydrates the persisted username
    useEffect(() => {
        if (uiUsername && uiUsername !== userId) {
            const newHome = '/home/' + uiUsername;
            setUserId(uiUsername);
            cwdRef.current = newHome;
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

    // Ensure home directory exists whenever username is set — per doc 2 §3.3
    // We do this here (idempotently) to ensure it exists before any command executes
    useEffect(() => {
        if (uiUsername) {
            vfsRef.current.ensureUserHome(uiUsername);
        }
    }, [uiUsername]);

    // Seed processes from snapshot - per advanced-scenarios requirements
    useEffect(() => {
        // Find if the current VFS contains the cryptominer - indicating we should seed it
        // We look for the file directly in the VFS instead of checking snapshot name
        // because snapshot name isn't easily accessible here yet (it's inside setSnapshot call)
        const hasMiner = vfsRef.current.resolve('/home/guest/cryptominer', uiUsername);
        if (typeof hasMiner !== 'string') {
            const alreadyRunning = processes.some(p => p.name === 'cryptominer');
            if (!alreadyRunning) {
                setProcesses([
                    {
                        pid: Math.floor(Math.random() * 9000) + 1000,
                        name: 'cryptominer',
                        user: 'guest',
                        startTime: Date.now() - 60000, // Started 1 min ago
                        status: 'R'
                    }
                ]);
            }
        } else {
            // If miner file is GONE (e.g., reset/new lab), but processes still has it, clear it
            if (processes.length > 0) {
                setProcesses([]);
            }
        }
    }, [snapshot, uiUsername]);

    useEffect(() => {
        if (vfsRef.current) {
            vfsRef.current.setProcessProvider(() => processes);
        }
    }, [processes]);

    const jobManagerRef = useRef<JobManager>(new JobManager((jobs) => setJobs(jobs)));
    const executorRef = useRef<ShellExecutor>(new ShellExecutor(vfsRef.current));
    const shellEnvRef = useRef<ShellEnvironment>(new ShellEnvironment(env));

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

    const executeCommand = useCallback(async (input: string, abortController?: AbortController) => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;
        console.log(`[Terminal] Executing: ${trimmedInput} in ${cwd} as ${userId}`);

        const currentCwd = cwdRef.current;
        const currentUserId = userId; // still stable enough
        const outputs: string[] = [];
        let result: CommandResult = { output: '', exitCode: 0 };

        const lexer = new Lexer(trimmedInput);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();

        const context: CommandContext = {
            cwd: currentCwd,
            updateCwd: (path) => {
                context.cwd = path;
            },
            userId: currentUserId,
            groups: currentUserId === 'root' ? ['root'] : [currentUserId, 'users'], 
            vfs: vfsRef.current,
            env,
            history: historyRef.current.map(h => h.command),
            processes,
            jobManager: jobManagerRef.current,
            resolvePath: (path: string) => {
                if (path.startsWith('/')) return path;
                const base = context.cwd === '/' ? '/' : context.cwd + '/';
                return base + path;
            }
        };

        result = await executorRef.current.execute(ast, context, shellEnvRef.current);
        console.log(`[Terminal] Result: exitCode=${result.exitCode}, outputLen=${result.output?.length}, error=${result.error}`);

        // Lab Verification Logic
        const { currentLabId, labs, progress, updateProgress } = useLabStore.getState();
        const { incrementCounter, checkAchievements, updateQuestProgress } = useGamificationStore.getState();

        if (currentLabId && labs[currentLabId]) {
            const lab = labs[currentLabId];
            const labProgress = progress[currentLabId];

            if (lab.type === 'guided' && lab.steps && labProgress) {
                const step = lab.steps[labProgress.currentStepIndex];

                if (step?.requiredSequence && step.requiredSequence.length > 0) {
                    // Multi-command sequence step
                    const seqIdx = labProgress.sequenceIndex || 0;
                    const newSeqIdx = VerificationEngine.verifyGuidedSequenceStep(
                        lab, labProgress.currentStepIndex, trimmedInput, seqIdx
                    );
                    if (newSeqIdx > 0) {
                        if (newSeqIdx >= step.requiredSequence.length) {
                            // Sequence complete — advance to next step
                            updateProgress(currentLabId, {
                                currentStepIndex: labProgress.currentStepIndex + 1,
                                sequenceIndex: 0
                            });
                        } else {
                            // Partial progress in sequence
                            updateProgress(currentLabId, { sequenceIndex: newSeqIdx });
                        }
                    }
                } else {
                    // Single command or alternative commands step
                    const isCorrect = VerificationEngine.verifyGuidedStep(lab, labProgress.currentStepIndex, trimmedInput);
                    if (isCorrect) {
                        updateProgress(currentLabId, {
                            currentStepIndex: labProgress.currentStepIndex + 1,
                            sequenceIndex: 0
                        });
                    }
                }
            }
        }

        // Achievement Counter Tracking — per gamification_framework.md §2.4
        incrementCounter('commands-executed');
        updateQuestProgress('execute_commands', 1);
        
        // Use AST for command detection
        const getFirstCmdName = (node: any): string | null => {
            if (node.type === 0) return node.name; // NodeType.COMMAND
            if (node.type === 1) return getFirstCmdName(node.commands[0]); // NodeType.PIPELINE
            if (node.type === 2 || node.type === 3) return getFirstCmdName(node.left); // LOGICAL
            if (node.type === 7) return getFirstCmdName(node.nodes[0]); // SEQUENCE
            return null;
        };
        const cmdName = getFirstCmdName(ast);

        // Phase 3.3: Sudden Death (Hardcore Mode)
        if (cmdName === 'kill' && trimmedInput.match(/-9|-KILL/)) {
            const targets = trimmedInput.split(' ').slice(1).filter(a => !a.startsWith('-'));
            // If killing init (1), current shell (501), or any job (%)
            const isEssentialKill = targets.some(t => t === '1' || t === '501' || t.startsWith('%'));
            
            if (isEssentialKill) {
                const { triggerDeath } = useGamificationStore.getState();
                triggerDeath("Kernel panic: Essential system process terminated with SIGKILL.");
                return result; // Stop further processing for this command
            }
        }

        if (cmdName === 'chmod') incrementCounter('chmod-count');
        if (cmdName === 'grep') incrementCounter('grep-count');
        if (cmdName === 'kill') incrementCounter('kill-count');
        if (cmdName === 'man') incrementCounter('man-pages-read');
        if (cmdName === 'cd') incrementCounter('cd-count');
        if (cmdName === 'touch' || cmdName === 'tee') incrementCounter('files-created');

        // Track pipe usage for Pipe Wizard achievement
        if (ast.type === 1) incrementCounter('pipe-count'); // NodeType.PIPELINE

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

                // Module Completion Logic — per gamification_framework.md §2.4
                const currentLab = labs[currentLabId];
                if (typeof currentLab.module === 'number') {
                    const moduleLabs = Object.values(labs).filter(l => l.module === currentLab.module);
                    const completedInModule = moduleLabs.filter(l => progress[l.id]?.status === 'completed');
                    if (completedInModule.length === moduleLabs.length) {
                        incrementCounter('modules-completed');
                    }
                }
            }
        }

        // Run achievement check after every command
        checkAchievements();

        // Synchronize CWD from context (handles cd changes, including compound commands)
        if (context.cwd !== currentCwd) {
            cwdRef.current = context.cwd;
            setCwd(context.cwd);
        }

        // Add to history

        const entry: TerminalEntry = {
            id: uuidv4(),
            userId: userId,
            command: trimmedInput + (result.exitCode === 130 ? '^C' : ''),
            output: cmdName === 'cd' ? '' : result.output,
            error: result.error,
            cwd: currentCwd, // record the CWD where it was executed
            timestamp: Date.now(),
        };

        if (trimmedInput === 'clear') {
            setHistory([]);
            historyRef.current = [];
        } else {
            setHistory(prev => {
                const next = [...prev, entry];
                historyRef.current = next;
                return next;
            });
        }

        syncVFS();
        return result;
    }, [syncVFS, userId, cwd]);

    return {
        history,
        cwd,
        userId,
        env,
        processes,
        vfs: vfsRef.current,
        executeCommand,
        handleTabComplete,
        jobManager: jobManagerRef.current,
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
