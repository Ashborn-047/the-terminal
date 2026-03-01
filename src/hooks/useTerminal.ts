import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useVFSStore } from '../stores/vfsStore';
import { useLabStore } from '../stores/labStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { VFS } from '../features/vfs/vfs';
import { CommandParser } from '../features/command-engine/parser';
import { CommandExecutor } from '../features/command-engine/executor';
import { CommandContext, CommandResult } from '../features/command-engine/types';
import { VerificationEngine } from '../features/lab-engine/verification';
import { TerminalEntry } from '../types/terminal';
import '../features/command-engine/commands';

export function useTerminal(initialUserId: string = 'guest') {
    const { snapshot, setSnapshot } = useVFSStore();
    const [history, setHistory] = useState<TerminalEntry[]>([]);
    const [cwd, setCwd] = useState<string>('/home/' + initialUserId);
    const [userId, setUserId] = useState<string>(initialUserId);

    // Initialize VFS from snapshot or default
    const vfsRef = useRef<VFS>(new VFS(snapshot || undefined));
    const executorRef = useRef<CommandExecutor>(new CommandExecutor(vfsRef.current));

    // Sync VFS back to store on changes
    const syncVFS = useCallback(() => {
        setSnapshot(vfsRef.current.getSnapshot());
    }, [setSnapshot]);

    const executeCommand = useCallback(async (input: string) => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        const pipeline = CommandParser.parse(trimmedInput);
        const context: CommandContext = {
            cwd,
            userId,
            vfs: vfsRef.current,
            env: { USER: userId, PWD: cwd, HOME: '/home/' + userId },
            history: history.map(h => h.command),
        };

        const result = await executorRef.current.execute(pipeline, context);

        // Lab Verification Logic
        const { currentLabId, labs, progress, updateProgress, completeLab: completeLabInStore } = useLabStore.getState();
        const { awardXP, updateStreak, incrementCounter, checkAchievements } = useGamificationStore.getState();

        if (currentLabId && labs[currentLabId]) {
            const lab = labs[currentLabId];
            const labProgress = progress[currentLabId];

            if (lab.type === 'guided' && lab.steps && labProgress) {
                const isCorrect = VerificationEngine.verifyGuidedStep(lab, labProgress.currentStepIndex, trimmedInput);
                if (isCorrect) {
                    const nextIndex = labProgress.currentStepIndex + 1;
                    const isComplete = nextIndex >= lab.steps.length;

                    updateProgress(currentLabId, {
                        currentStepIndex: nextIndex,
                        status: isComplete ? 'completed' : 'in-progress'
                    });

                    if (isComplete) {
                        completeLabInStore(currentLabId);
                        awardXP(lab.xpReward);
                        updateStreak();
                        useGamificationStore.setState((s) => ({ labsCompleted: s.labsCompleted + 1 }));
                    }
                }
            }
        }

        // Achievement Counter Tracking — per gamification_framework.md §2.4
        incrementCounter('commands-executed');
        const cmdName = pipeline.actions[0]?.name;
        if (cmdName === 'chmod') incrementCounter('chmod-count');
        if (cmdName === 'grep') incrementCounter('grep-count');
        if (cmdName === 'kill') incrementCounter('kill-count');
        if (cmdName === 'man') incrementCounter('man-pages-read');
        if (cmdName === 'cd') incrementCounter('cd-count');
        if (cmdName === 'touch' || cmdName === 'tee') incrementCounter('files-created');

        // Track pipe usage for Pipe Wizard achievement
        if (pipeline.actions.length > 1) incrementCounter('pipe-count');

        // Track unique commands for Command Master achievement
        const uniqueKey = `__unique_cmd_${cmdName}`;
        const { counters } = useGamificationStore.getState();
        if (cmdName && !counters[uniqueKey]) {
            incrementCounter(uniqueKey); // mark this command as seen
            incrementCounter('unique-commands');
        }

        // Time-based achievements (Night Owl, Early Bird) — fire on lab completion
        if (currentLabId && labs[currentLabId]) {
            const lab = labs[currentLabId];
            const labProgress = progress[currentLabId];
            if (labProgress?.status === 'completed') {
                const hour = new Date().getHours();
                if (hour >= 0 && hour < 5) incrementCounter('night-owl');
                if (hour >= 5 && hour < 8) incrementCounter('early-bird');
            }
        }

        checkAchievements();

        // Handle special case: cd updates CWD
        if (pipeline.actions.length === 1 && pipeline.actions[0].name === 'cd' && result.exitCode === 0) {
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
        vfs: vfsRef.current,
        executeCommand,
        setUserId,
    };
}
