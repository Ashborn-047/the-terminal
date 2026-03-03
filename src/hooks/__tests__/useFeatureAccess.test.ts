import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFeatureAccess } from '../useFeatureAccess';
import { useGamificationStore } from '../../stores/gamificationStore';

// Mock the store
vi.mock('../../stores/gamificationStore', () => ({
    useGamificationStore: vi.fn()
}));

const mockUseGamificationStore = vi.mocked(useGamificationStore);

describe('useFeatureAccess', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should lock most features for a completely new user (Level 1, 0 Labs)', () => {
        mockUseGamificationStore.mockReturnValue({
            labsCompleted: 0,
            level: 1,
            // Mock other required fields if needed, but the hook only reads these two
        } as any);

        const { result } = renderHook(() => useFeatureAccess());

        expect(result.current).toEqual({
            terminal: true,
            curriculum: true,
            achievements: false,
            chat: false,
            commandReference: false,
            diyLabs: false,
            settings: false,
            labReset: false,
            hints: true,
        });
    });

    it('should unlock labReset after 1 lab', () => {
        mockUseGamificationStore.mockReturnValue({ labsCompleted: 1, level: 1 } as any);
        const { result } = renderHook(() => useFeatureAccess());
        expect(result.current.labReset).toBe(true);
        expect(result.current.achievements).toBe(false);
    });

    it('should unlock achievements after 2 labs', () => {
        mockUseGamificationStore.mockReturnValue({ labsCompleted: 2, level: 1 } as any);
        const { result } = renderHook(() => useFeatureAccess());
        expect(result.current.achievements).toBe(true);
        expect(result.current.chat).toBe(false);
    });

    it('should unlock chat after 3 labs', () => {
        mockUseGamificationStore.mockReturnValue({ labsCompleted: 3, level: 1 } as any);
        const { result } = renderHook(() => useFeatureAccess());
        expect(result.current.chat).toBe(true);
        expect(result.current.commandReference).toBe(false);
    });

    it('should unlock commandReference after 5 labs', () => {
        mockUseGamificationStore.mockReturnValue({ labsCompleted: 5, level: 1 } as any);
        const { result } = renderHook(() => useFeatureAccess());
        expect(result.current.commandReference).toBe(true);
        expect(result.current.diyLabs).toBe(false);
    });

    it('should unlock diyLabs after 10 labs', () => {
        mockUseGamificationStore.mockReturnValue({ labsCompleted: 10, level: 1 } as any);
        const { result } = renderHook(() => useFeatureAccess());
        expect(result.current.diyLabs).toBe(true);
    });

    it('should unlock settings at level 3 regardless of lab count', () => {
        mockUseGamificationStore.mockReturnValue({ labsCompleted: 0, level: 3 } as any);
        const { result } = renderHook(() => useFeatureAccess());
        expect(result.current.settings).toBe(true);

        // At level 3 but 0 labs, achievements should still be false
        expect(result.current.achievements).toBe(false);
    });

    it('should unlock entirely for an advanced user', () => {
        mockUseGamificationStore.mockReturnValue({ labsCompleted: 50, level: 10 } as any);
        const { result } = renderHook(() => useFeatureAccess());

        expect(result.current).toEqual({
            terminal: true,
            curriculum: true,
            achievements: true,
            chat: true,
            commandReference: true,
            diyLabs: true,
            settings: true,
            labReset: true,
            hints: true,
        });
    });
});
