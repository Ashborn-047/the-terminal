import React, { useMemo } from 'react';
import { useLabStore } from '../../stores/labStore';
import { Network, Circle, CheckCircle2, Shield, FolderGit2, TerminalSquare, Globe } from 'lucide-react';
import { Lab } from '../../features/lab-engine/types';
import { 
    tokens, 
    Card, 
    Badge 
} from '../ui/AshbornDesignSystem';

const SKILL_BRANCHES = [
    {
        id: 'filesystem',
        name: 'Filesystem & Core',
        icon: <FolderGit2 style={{ color: tokens.color.lime.base }} size={24} />,
        modules: [1, 2, 3, 8],
        color: tokens.color.lime.base
    },
    {
        id: 'permissions',
        name: 'Permissions & Security',
        icon: <Shield style={{ color: tokens.color.amber.base }} size={24} />,
        modules: [4, 6, 15],
        color: tokens.color.amber.base
    },
    {
        id: 'networking',
        name: 'Networking & Services',
        icon: <Globe style={{ color: '#60A5FA' }} size={24} />,
        modules: [9, 10],
        color: '#60A5FA'
    },
    {
        id: 'scripting',
        name: 'Scripting & Automation',
        icon: <TerminalSquare style={{ color: '#F472B6' }} size={24} />,
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
        <Card variant="default" style={{ padding: tokens.space[6], backgroundColor: tokens.color.bg.surface, overflow: 'hidden', position: 'relative' }}>
            {/* Context Header */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: tokens.space[8],
                borderBottom: `1px solid ${tokens.color.border.default}`,
                paddingBottom: tokens.space[4]
            }}>
                <Network size={20} style={{ color: tokens.color.lime.base }} />
                <h2 style={{ 
                    fontFamily: tokens.font.sans, 
                    fontSize: tokens.fontSize.md, 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    color: tokens.color.text.primary,
                    margin: 0,
                    letterSpacing: tokens.letterSpacing.widest
                }}>
                    System Advancement Tree
                </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                {SKILL_BRANCHES.map((branch) => {
                    const branchModules = branch.modules.map(id => moduleData[id]);

                    return (
                        <div key={branch.id} style={{ position: 'relative' }}>
                            {/* Branch Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: tokens.space[6] }}>
                                {branch.icon}
                                <h3 style={{ 
                                    fontFamily: tokens.font.sans, 
                                    fontSize: tokens.fontSize.sm, 
                                    fontWeight: 700, 
                                    textTransform: 'uppercase', 
                                    color: tokens.color.text.secondary,
                                    margin: 0,
                                    letterSpacing: tokens.letterSpacing.wide
                                }}>
                                    {branch.name}
                                </h3>
                            </div>

                            {/* Node Path Container */}
                            <div style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 24, 
                                padding: tokens.space[6], 
                                borderLeft: `2px solid ${branch.color}`, 
                                backgroundColor: 'rgba(255,255,255,0.01)',
                                position: 'relative',
                                borderRadius: '0 4px 4px 0'
                            }}>
                                {branchModules.map((m, index) => {
                                    if (!m) return null;

                                    const isFullyCompleted = m.totalCount > 0 && m.completedCount === m.totalCount;
                                    const prevModuleIdx = index - 1;
                                    const prevModule = prevModuleIdx >= 0 ? branchModules[prevModuleIdx] : null;
                                    const isUnlocked = index === 0 || (prevModule && prevModule.completedCount > 0);
                                    const isBossNode = index === branchModules.length - 1;

                                    return (
                                        <div key={m.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    width: 96,
                                                    height: 96,
                                                    border: `1px solid ${
                                                        isFullyCompleted ? tokens.color.lime.base : 
                                                        isUnlocked ? (isBossNode ? tokens.color.amber.base : tokens.color.text.secondary) : 
                                                        tokens.color.border.default
                                                    }`,
                                                    background: isFullyCompleted ? tokens.color.lime.base : (isBossNode && isUnlocked ? tokens.color.amber.alpha[8] : 'transparent'),
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 6,
                                                    transition: 'all 0.3s ease',
                                                    opacity: isUnlocked ? 1 : 0.3,
                                                    boxShadow: (isBossNode && isUnlocked) ? `0 0 15px ${tokens.color.amber.alpha[16]}` : 'none',
                                                    zIndex: 10
                                                }}
                                            >
                                                <div style={{ 
                                                    fontSize: 8, 
                                                    fontFamily: tokens.font.mono, 
                                                    fontWeight: 700,
                                                    padding: '1px 4px',
                                                    background: isFullyCompleted ? 'rgba(0,0,0,0.8)' : tokens.color.bg.overlay,
                                                    color: isFullyCompleted ? tokens.color.lime.base : (isBossNode && isUnlocked ? tokens.color.amber.base : tokens.color.text.tertiary),
                                                    borderRadius: 2
                                                }}>
                                                    {isBossNode ? 'OS_CORE' : `M${m.id.toString().padStart(2, '0')}`}
                                                </div>
                                                
                                                {isFullyCompleted ? (
                                                    <CheckCircle2 size={24} style={{ color: '#000' }} />
                                                ) : (
                                                    <Circle size={24} style={{ 
                                                        color: isBossNode && isUnlocked ? tokens.color.amber.base : tokens.color.text.tertiary,
                                                        opacity: isUnlocked ? 1 : 0.5 
                                                    }} className={isBossNode && isUnlocked ? "animate-pulse" : ""} />
                                                )}

                                                <div style={{ 
                                                    fontSize: 9, 
                                                    fontFamily: tokens.font.sans, 
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    color: isFullyCompleted ? '#000' : tokens.color.text.tertiary,
                                                    textAlign: 'center'
                                                }}>
                                                    {m.completedCount} / {m.totalCount} labs
                                                </div>
                                            </div>

                                            {/* Branch Connector Line */}
                                            {index < branchModules.length - 1 && (
                                                <div style={{ 
                                                    width: 24, 
                                                    height: 1, 
                                                    background: isFullyCompleted ? tokens.color.lime.base : tokens.color.border.default,
                                                    opacity: isUnlocked ? 0.6 : 0.2
                                                }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div style={{ 
                marginTop: 40, 
                paddingTop: 20, 
                borderTop: `1px solid ${tokens.color.border.default}`,
                display: 'flex',
                gap: 24,
                fontSize: 9,
                fontFamily: tokens.font.mono,
                textTransform: 'uppercase',
                color: tokens.color.text.tertiary,
                letterSpacing: 0.5
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, backgroundColor: tokens.color.lime.base }} />
                    <span>Mastered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, border: `1px solid ${tokens.color.text.secondary}` }} />
                    <span>Active</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.4 }}>
                    <div style={{ width: 8, height: 8, border: `1px solid ${tokens.color.border.default}` }} />
                    <span>Locked</span>
                </div>
            </div>
        </Card>
    );
};
