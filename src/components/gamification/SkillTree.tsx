import React, { useMemo } from 'react';
import { useLabStore } from '../../stores/labStore';
import { Network, Circle, CheckCircle2, Shield, FolderGit2, TerminalSquare, Globe } from 'lucide-react';
import { Lab } from '../../features/lab-engine/types';
import { 
    tokens, 
    Card, 
    Badge,
    Display,
    Label,
    Mono
} from '../ui/AshbornDesignSystem';

const SKILL_BRANCHES = [
    {
        id: 'filesystem',
        name: 'Filesystem & Core',
        icon: <FolderGit2 size={18} />,
        modules: [1, 2, 3, 8],
        color: tokens.color.lime.base
    },
    {
        id: 'permissions',
        name: 'Permissions & Security',
        icon: <Shield size={18} />,
        modules: [4, 6, 15],
        color: tokens.color.amber.base
    },
    {
        id: 'networking',
        name: 'Networking & Services',
        icon: <Globe size={18} />,
        modules: [9, 10],
        color: '#60A5FA'
    },
    {
        id: 'scripting',
        name: 'Scripting & Automation',
        icon: <TerminalSquare size={18} />,
        modules: [5, 7, 11, 12, 13, 14],
        color: '#F472B6'
    }
];

export const SkillTree: React.FC = () => {
    const { labs, progress } = useLabStore();

    const processModules = () => {
        const moduleMap: Record<number, { id: number, name: string, labs: Lab[], completedCount: number, totalCount: number }> = {};

        for (let i = 1; i <= 18; i++) {
            const moduleLabs = Object.values(labs).filter(l => l.id.startsWith(`M${i}-`) || l.module === i);
            const completedLabs = moduleLabs.filter(l => progress[l.id]?.status === 'completed');

            moduleMap[i] = {
                id: i,
                name: `Module ${i}`,
                labs: moduleLabs,
                completedCount: completedLabs.length,
                totalCount: moduleLabs.length
            };
        }
        return moduleMap;
    };

    const moduleData = useMemo(() => processModules(), [labs, progress]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space[6] }}>
            {/* Legend / Info Bar */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                padding: '12px 16px',
                background: tokens.color.bg.surface,
                border: `1px solid ${tokens.color.border.default}`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Network size={16} style={{ color: tokens.color.lime.base }} />
                    <Display size="xs">System Advancement Tree</Display>
                </div>
                
                <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, backgroundColor: tokens.color.lime.base }} />
                        <Mono size="2xs">MASTERED</Mono>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, border: `1px solid ${tokens.color.text.secondary}` }} />
                        <Mono size="2xs">ACTIVE</Mono>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.5 }}>
                        <div style={{ width: 8, height: 8, border: `1px solid ${tokens.color.border.default}` }} />
                        <Mono size="2xs">LOCKED</Mono>
                    </div>
                </div>
            </div>

            {/* Horizontal Branch Layout - Scrollable on smaller screens, row on larger */}
            <div style={{ 
                display: 'flex', 
                gap: tokens.space[4],
                overflowX: 'auto',
                paddingBottom: tokens.space[4],
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}>
                <style>{`
                    .skill-tree-scroll::-webkit-scrollbar { display: none; }
                `}</style>
                {SKILL_BRANCHES.map((branch) => {
                    const branchModules = branch.modules.map(id => moduleData[id]).filter(Boolean);

                    return (
                        <Card 
                            key={branch.id} 
                            variant="default" 
                            style={{ 
                                padding: 16, 
                                borderLeft: `4px solid ${branch.color}`,
                                minWidth: 280,
                                flex: 1
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <div style={{ color: branch.color }}>{branch.icon}</div>
                                <Label size="xs" weight="bold" uppercase color={tokens.color.text.secondary}>{branch.name}</Label>
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 12,
                                position: 'relative'
                            }}>
                                {branchModules.map((m, index) => {
                                    if (!m) return null;

                                    const isFullyCompleted = m.totalCount > 0 && m.completedCount === m.totalCount;
                                    const prevModuleIdx = index - 1;
                                    const prevModule = prevModuleIdx >= 0 ? branchModules[prevModuleIdx] : null;
                                    const isUnlocked = index === 0 || (prevModule && prevModule.completedCount > 0);
                                    const isBossNode = index === branchModules.length - 1;

                                    return (
                                        <div
                                            key={m.id}
                                            style={{
                                                position: 'relative',
                                                width: 70,
                                                height: 70,
                                                border: `1px solid ${
                                                    isFullyCompleted ? tokens.color.lime.base : 
                                                    isUnlocked ? (isBossNode ? tokens.color.amber.base : tokens.color.text.secondary) : 
                                                    tokens.color.border.default
                                                }`,
                                                background: isFullyCompleted ? tokens.color.lime.base : (isBossNode && isUnlocked ? tokens.color.amber.alpha[8] : tokens.color.bg.overlay),
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 4,
                                                transition: 'all 0.2s ease',
                                                opacity: isUnlocked ? 1 : 0.4,
                                                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                                zIndex: 10
                                            }}
                                        >
                                            <Mono size="2xs" color={isFullyCompleted ? '#000' : (isBossNode && isUnlocked ? tokens.color.amber.base : tokens.color.text.tertiary)}>
                                                {isBossNode ? 'CORE' : `M${m.id}`}
                                            </Mono>
                                            
                                            {isFullyCompleted ? (
                                                <CheckCircle2 size={16} style={{ color: '#000' }} />
                                            ) : (
                                                <Circle size={16} style={{ 
                                                    color: isBossNode && isUnlocked ? tokens.color.amber.base : tokens.color.text.tertiary,
                                                }} />
                                            )}

                                            <div style={{ 
                                                fontSize: 8, 
                                                fontFamily: tokens.font.mono, 
                                                color: isFullyCompleted ? '#000' : tokens.color.text.tertiary,
                                            }}>
                                                {m.completedCount}/{m.totalCount}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
