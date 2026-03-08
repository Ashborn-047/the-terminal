import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTerminal } from '../useTerminal';
import { useVFSStore } from '../../stores/vfsStore';
import { useLabStore } from '../../stores/labStore';
import { useGamificationStore } from '../../stores/gamificationStore';

// Mock Zustand Stores
vi.mock('../../stores/vfsStore', () => ({
    useVFSStore: vi.fn(),
}));

vi.mock('../../stores/labStore', () => ({
    useLabStore: {
        getState: vi.fn(() => ({
            currentLabId: null,
            labs: {},
            progress: {},
            updateProgress: vi.fn(),
            completeLab: vi.fn(),
        }))
    }
}));

vi.mock('../../stores/gamificationStore', () => ({
    useGamificationStore: {
        getState: vi.fn(() => ({
            awardXP: vi.fn(),
            updateStreak: vi.fn(),
            incrementCounter: vi.fn(),
            checkAchievements: vi.fn(),
            updateQuestProgress: vi.fn(),
            counters: {},
        }))
    }
}));

const mockUseVFSStore = vi.mocked(useVFSStore);

describe('useTerminal', () => {
    let mockSetSnapshot: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockSetSnapshot = vi.fn();
        mockUseVFSStore.mockReturnValue({
            snapshot: null,
            setSnapshot: mockSetSnapshot,
            clearSnapshot: vi.fn(),
        } as any);
    });

    it('should initialize with default user and cwd', () => {
        const { result } = renderHook(() => useTerminal());

        expect(result.current.userId).toBe('Guest');
        expect(result.current.cwd).toBe('/home/Guest');
        expect(result.current.history).toEqual([]);
        expect(result.current.env.USER).toBe('Guest');
    });

    it('should add executed command to history', async () => {
        const { result } = renderHook(() => useTerminal('guest'));

        await act(async () => {
            await result.current.executeCommand('echo "hello"');
        });

        expect(result.current.history.length).toBe(1);
        expect(result.current.history[0].command).toBe('echo "hello"');
        expect(result.current.history[0].output).toBe('hello');
    });

    it('should clear history when "clear" command is executed', async () => {
        const { result } = renderHook(() => useTerminal('guest'));

        await act(async () => {
            await result.current.executeCommand('echo "test"');
            await result.current.executeCommand('clear');
        });

        expect(result.current.history.length).toBe(0);
    });

    it('should update cwd when "cd" is executed successfully', async () => {
        const { result } = renderHook(() => useTerminal('guest'));

        // First we need to create a directory to CD into or CD to root
        await act(async () => {
            await result.current.executeCommand('cd /');
        });

        expect(result.current.cwd).toBe('/');
    });

    it('should provide tab completion for generic commands', () => {
        const { result } = renderHook(() => useTerminal('guest'));

        let completed = '';
        act(() => {
            completed = result.current.handleTabComplete('mkd');
        });

        expect(completed).toBe('mkdir ');
    });

    it('should call setSnapshot to sync VFS on execution', async () => {
        const { result } = renderHook(() => useTerminal('guest'));

        await act(async () => {
            await result.current.executeCommand('touch test.txt');
        });

        expect(mockSetSnapshot).toHaveBeenCalled();
    });
});
