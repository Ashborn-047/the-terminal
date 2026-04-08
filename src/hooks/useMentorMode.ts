import { useUIStore } from '../stores/uiStore';
import { useGamificationStore } from '../stores/gamificationStore';

export const useMentorMode = () => {
    const { username: userId } = useUIStore();
    const { level } = useGamificationStore();

    const canMentor = level >= 10;

    const shareSession = async () => {
        const sessionId = `${userId}-${Date.now().toString(36)}`;
        // In a real SpacetimeDB app, we would call a reducer to create a session entry
        console.log('Session shared:', sessionId);
        return sessionId;
    };

    return {
        canMentor,
        shareSession
    };
};
