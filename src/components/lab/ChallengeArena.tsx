import { useGamificationStore } from '../../stores/gamificationStore';
import { ArenaGate } from '../ui/AshbornDesignSystem';
import { useNavigate } from 'react-router-dom';

export const ChallengeArena: React.FC = () => {
    const navigate = useNavigate();
    const { level } = useGamificationStore();
    
    // In V2 designers wanted a level 10 gate for premium feel
    const requiredLevel = 10;
    const isLocked = level < requiredLevel;

    // Mock challenges for the blurred preview in ArenaGate
    const challenges = [
        { name: "Broken Bootloader", difficulty: "hard", category: "system" },
        { name: "Ghost Process", difficulty: "hard", category: "processes" },
        { name: "Corrupted Filesystem", difficulty: "extreme", category: "filesystem" },
        { name: "Network Hijack", difficulty: "hard", category: "networking" },
        { name: "Permission Cascade", difficulty: "medium", category: "security" },
        { name: "Kernel Panic Fix", difficulty: "extreme", category: "kernel" },
    ];

    if (isLocked) {
        return (
            <div className="h-full w-full overflow-y-auto al-grid">
                <ArenaGate 
                    userLevel={level} 
                    requiredLevel={requiredLevel}
                    challenges={challenges}
                    onReturn={() => navigate('/labs')}
                />
            </div>
        );
    }

    // Fallback for when developer unlocks it or for high level users
    return (
        <div className="h-full w-full overflow-y-auto al-grid p-8">
            <h1 className="text-4xl font-heading text-white uppercase mb-8">System Mastery Arena</h1>
            <p className="text-gray-400">Welcome, Commander. You have the clearance to access advanced system scenarios.</p>
            {/* Future implementation of real challenges list when unlocked */}
        </div>
    );
};
