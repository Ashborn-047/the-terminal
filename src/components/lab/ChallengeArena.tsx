import { useGamificationStore } from '../../stores/gamificationStore';
import { useLabStore } from '../../stores/labStore';
import { ArenaGate, tokens } from '../ui/AshbornDesignSystem';
import { useNavigate } from 'react-router-dom';
import { LabCard } from './LabComponents';

export const ChallengeArena: React.FC = () => {
    const navigate = useNavigate();
    const { level } = useGamificationStore();
    const { labs, progress, startLab } = useLabStore();
    
    // In V2 designers wanted a level 10 gate for premium feel
    const requiredLevel = 10;
    const isLocked = level < requiredLevel;

    // Mock challenges for the blurred preview in ArenaGate when locked
    const mockChallenges = [
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
                    challenges={mockChallenges}
                    onReturn={() => navigate('/labs')}
                />
            </div>
        );
    }

    // Extract actual arena labs
    const arenaLabs = Object.values(labs).filter(lab => lab.id.startsWith('arena-'));

    // Group by difficulty
    const groups = [
        { title: 'Novice', difficulty: 'NOVICE', color: tokens.color.semantic.info },
        { title: 'Adept', difficulty: 'ADEPT', color: tokens.color.lime.base },
        { title: 'Expert', difficulty: 'EXPERT', color: tokens.color.semantic.warning },
        { title: 'Master', difficulty: 'MASTER', color: tokens.color.semantic.error },
    ];

    return (
        <div className="h-full w-full overflow-y-auto al-grid p-8" style={{ background: tokens.color.bg.base }}>
            <h1 className="text-4xl font-heading text-white uppercase mb-4" style={{ fontFamily: tokens.font.display, color: tokens.color.text.primary }}>
                System Mastery Arena
            </h1>
            <p style={{ fontFamily: tokens.font.sans, color: tokens.color.text.secondary, marginBottom: 32, maxWidth: 600 }}>
                Welcome, Commander. You have the clearance to access advanced system scenarios.
                Select a challenge below to enter a simulated environment.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {groups.map(group => {
                    const groupLabs = arenaLabs.filter(lab => lab.difficulty === group.difficulty);
                    if (groupLabs.length === 0) return null;

                    return (
                        <div key={group.title}>
                            <h2 style={{
                                fontFamily: tokens.font.display,
                                fontSize: tokens.fontSize.lg,
                                color: group.color,
                                textTransform: 'uppercase',
                                marginBottom: 16,
                                paddingBottom: 8,
                                borderBottom: `1px solid ${tokens.color.border.default}`
                            }}>
                                {group.title} Tier
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: tokens.space[4]
                            }}>
                                {groupLabs.map(lab => {
                                    const labProgress = progress[lab.id];
                                    const status = labProgress?.status || 'available';

                                    return (
                                        <LabCard
                                            key={lab.id}
                                            lab={lab}
                                            status={status}
                                            onStart={(id) => {
                                                startLab(id);
                                                navigate(`/labs/${lab.module}/lab/${id}`);
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
