import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../../lib/spacetime/index', () => ({
    spacetime: {
        completeLab: vi.fn().mockResolvedValue({}),
        createFile: vi.fn().mockResolvedValue({}),
        writeFile: vi.fn().mockResolvedValue({}),
        deleteFile: vi.fn().mockResolvedValue({}),
        moveFile: vi.fn().mockResolvedValue({}),
        chmod: vi.fn().mockResolvedValue({}),
    }
}));

import { spacetime } from '../../../../lib/spacetime/index';
import { useLabStore } from '../../../../stores/labStore';
import { useGamificationStore } from '../../../../stores/gamificationStore';
import { useVFSStore } from '../../../../stores/vfsStore';
import { useUIStore } from '../../../../stores/uiStore';
import { renderHook, act } from '@testing-library/react';
import { useTerminal } from '../../../../hooks/useTerminal';
import { Lab } from '../../types';
import { VerificationEngine } from '../../verification';
import { VFS } from '../../../vfs/vfs';

// Create a mock guided lab
const mockGuidedLab: Lab = {
    id: 'guided-test-1',
    title: 'Test Guided',
    description: 'Test lab',
    type: 'guided',
    module: 1,
    difficulty: 'NOVICE',
    prerequisites: [],
    xpReward: 50,
    tags: [],
    author: 'Test',
    completionMessage: 'Done!',
    steps: [
        {
            id: 'step-1',
            instruction: 'Create a directory called "test"',
            expectedCommand: 'mkdir test'
        },
        {
            id: 'step-2',
            instruction: 'Enter the directory',
            expectedCommand: 'cd test'
        }
    ]
};

// Create a mock DIY lab
const mockDIYLab: Lab = {
    id: 'diy-test-1',
    title: 'Test DIY',
    description: 'Test lab',
    type: 'diy',
    module: 1,
    difficulty: 'ADEPT',
    prerequisites: [],
    xpReward: 100,
    tags: [],
    author: 'Test',
    completionMessage: 'Done!',
    verification: {
        conditions: [
            {
                type: 'directory_exists',
                path: '/home/guest/workspace',
                message: 'Workspace not found'
            }
        ]
    }
};

describe('Lab + VFS + SpacetimeDB Integration', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset stores
        useLabStore.setState({
            labs: {
                'guided-test-1': mockGuidedLab,
                'diy-test-1': mockDIYLab
            },
            currentLabId: null,
            progress: {}
        });

        useVFSStore.setState({
            snapshot: null,
        });

        useUIStore.setState({
            username: 'guest',
        });

        useGamificationStore.setState({
            xp: 0,
            level: 1,
            totalXpEarned: 0,
            labsCompleted: 0,
            streak: { current: 0, longest: 0, lastActivityDate: null, freezesRemaining: 0 },
            counters: {},
            dailyQuests: [],
            unlockedAchievements: [],
            hintsUsed: 0,
            lastQuestGenerationDate: null,
            labCompletionHistory: {},
            masteryBadge: 'novice'
        });
    });

    it('should complete a guided lab flow end-to-end and sync to SpacetimeDB', async () => {
        // Spy on the completeLab method in our SpacetimeService instance
        const completeLabSpy = vi.spyOn(spacetime, 'completeLab').mockResolvedValue(undefined as any);

        // 1. Start the lab
        act(() => {
            useLabStore.getState().startLab('guided-test-1');
        });

        let progress = useLabStore.getState().progress['guided-test-1'];
        expect(progress.status).toBe('in-progress');
        expect(progress.currentStepIndex).toBe(0);

        // 2. Initialize terminal hook
        const { result } = renderHook(() => useTerminal());

        // 3. User executes the first step
        await act(async () => {
            await result.current.executeCommand('mkdir test');
        });

        // 4. Verify progress advanced
        progress = useLabStore.getState().progress['guided-test-1'];
        expect(progress.currentStepIndex).toBe(1);

        // 5. User executes the second step
        await act(async () => {
            await result.current.executeCommand('cd test');
        });

        // 6. Verify progress advanced, then complete lab manually like the UI would
        progress = useLabStore.getState().progress['guided-test-1'];
        expect(progress.currentStepIndex).toBe(2);

        act(() => {
            useLabStore.getState().completeLab('guided-test-1');
        });

        progress = useLabStore.getState().progress['guided-test-1'];
        expect(progress.status).toBe('completed');

        // Simulate UI reward granting
        await act(async () => {
            useGamificationStore.getState().processLabCompletion('guided-test-1', mockGuidedLab, result.current.vfs);
        });

        // 7. Verify Gamification Store updated
        const gamification = useGamificationStore.getState();
        expect(gamification.labsCompleted).toBe(1);
        expect(gamification.xp).toBeGreaterThan(0); // Awarded base XP

        // 8. Verify SpacetimeDB Sync was called
        expect(completeLabSpy).toHaveBeenCalledWith('guided-test-1', expect.any(BigInt));
    });

    it('should complete a DIY lab flow end-to-end and sync to SpacetimeDB', async () => {
        const completeLabSpy = vi.spyOn(spacetime, 'completeLab').mockResolvedValue(undefined as any);

        act(() => {
            useLabStore.getState().startLab('diy-test-1');
        });

        const { result } = renderHook(() => useTerminal());

        // User executes commands to fulfill DIY criteria
        await act(async () => {
            await result.current.executeCommand('mkdir workspace');
        });

        // In DIY labs, verification is triggered by the UI (Verify button), which calls verifyDIYLab.
        // We simulate that UI call here.
        let isVerified = false;
        await act(async () => {
            const resultDIY = VerificationEngine.verifyDIYLab(mockDIYLab, result.current.vfs, 'guest', []);
            isVerified = resultDIY.success;
            if (isVerified) {
                useLabStore.getState().completeLab('diy-test-1');
            }
        });

        expect(isVerified).toBe(true);

        const progress = useLabStore.getState().progress['diy-test-1'];
        expect(progress.status).toBe('completed');

        // Simulate UI reward granting
        await act(async () => {
            useGamificationStore.getState().processLabCompletion('diy-test-1', mockDIYLab, result.current.vfs);
        });

        const gamification = useGamificationStore.getState();
        expect(gamification.labsCompleted).toBe(1);
        expect(gamification.xp).toBeGreaterThan(0);

        expect(completeLabSpy).toHaveBeenCalledWith('diy-test-1', expect.any(BigInt));
    });
});
