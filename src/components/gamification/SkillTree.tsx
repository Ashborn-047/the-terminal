import React, { useMemo } from 'react';
import { useLabStore } from '../../stores/labStore';
import { Network, Circle, CheckCircle2, Shield, FolderGit2, TerminalSquare, Globe } from 'lucide-react';
import { Lab } from '../../features/lab-engine/types';

const SKILL_BRANCHES = [
    {
        id: 'filesystem',
        name: 'Filesystem & Core',
        icon: <FolderGit2 className="text-brutal-green" size={24} />,
        modules: [1, 2, 3, 8],
        color: 'border-brutal-green'
    },
    {
        id: 'permissions',
        name: 'Permissions & Security',
        icon: <Shield className="text-brutal-yellow" size={24} />,
        modules: [4, 6, 15],
        color: 'border-brutal-yellow'
    },
    {
        id: 'networking',
        name: 'Networking & Services',
        icon: <Globe className="text-brutal-blue" size={24} />,
        modules: [9, 10],
        color: 'border-brutal-blue'
    },
    {
        id: 'scripting',
        name: 'Scripting & Automation',
        icon: <TerminalSquare className="text-brutal-pink" size={24} />,
        modules: [5, 7, 11, 12, 13, 14],
        color: 'border-brutal-pink'
    }
];

export const SkillTree: React.FC = () => {
    const { labs, progress } = useLabStore();

    // Group labs by module (assuming lab IDs start with M1-, M2-, etc.)
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
        <div className="bg-brutal-black border-3 border-brutal-white p-6 shadow-brutal overflow-hidden">
            <div className="flex items-center gap-3 mb-6 border-b-2 border-brutal-white pb-4">
                <Network className="text-brutal-green" />
                <h2 className="font-heading text-xl uppercase text-brutal-white">System Skill Tree</h2>
            </div>

            <div className="space-y-8">
                {SKILL_BRANCHES.map((branch) => {
                    const branchModules = branch.modules.map(id => moduleData[id]);

                    return (
                        <div key={branch.id} className="relative">
                            {/* Branch Info */}
                            <div className="flex items-center gap-3 mb-4">
                                {branch.icon}
                                <h3 className="font-heading text-lg uppercase text-brutal-white">{branch.name}</h3>
                            </div>

                            {/* Node Path Container */}
                            <div className={`flex flex-wrap gap-4 p-4 border-l-4 ${branch.color} bg-brutal-dark/50 relative overflow-hidden backdrop-blur-sm`}>
                                {/* Grid background effect */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(var(--color-brutal-white) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                {branchModules.map((m, index) => {
                                    if (!m) return null;

                                    const isFullyCompleted = m.totalCount > 0 && m.completedCount === m.totalCount;
                                    // Unlock condition: First module in branch is unlocked, or previous module in branch is completed/started.
                                    // For simplicity, unlocking if previous module in the same branch has at least 1 completion.
                                    const prevModuleIdx = index - 1;
                                    const prevModule = prevModuleIdx >= 0 ? branchModules[prevModuleIdx] : null;
                                    const isUnlocked = index === 0 || (prevModule && prevModule.completedCount > 0);

                                    const isBossNode = index === branchModules.length - 1;

                                    return (
                                        <div key={m.id} className="relative flex items-center">
                                            <div
                                                className={`relative p-3 w-28 h-28 border-2 flex flex-col items-center justify-center transition-all z-10 ${isBossNode
                                                        ? (isFullyCompleted ? 'bg-brutal-yellow border-brutal-black text-brutal-black scale-110 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-3' : isUnlocked ? 'bg-brutal-dark border-brutal-yellow text-brutal-yellow' : 'bg-brutal-dark border-brutal-gray text-brutal-gray opacity-40')
                                                        : (isFullyCompleted
                                                            ? 'bg-brutal-green border-brutal-black text-brutal-black scale-105 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                                            : isUnlocked
                                                                ? 'bg-brutal-dark border-brutal-white text-brutal-white'
                                                                : 'bg-brutal-dark border-brutal-gray text-brutal-gray opacity-40')
                                                    }`}
                                            >
                                                <div className={`text-[10px] font-mono mb-1 bg-brutal-black px-1 ${isBossNode && !isFullyCompleted ? 'text-brutal-yellow border-brutal-yellow/50' : 'text-brutal-white border-brutal-gray/30'} border`}>
                                                    {isBossNode ? 'BOSS' : `M${m.id}`}
                                                </div>
                                                {isFullyCompleted ? <CheckCircle2 size={isBossNode ? 28 : 24} className="text-brutal-black" /> : <Circle size={isBossNode ? 28 : 24} className={isBossNode && isUnlocked ? "text-brutal-yellow animate-pulse" : ""} />}
                                                <div className="mt-2 text-[10px] font-heading uppercase text-center leading-tight">
                                                    {m.completedCount}/{m.totalCount} Labs
                                                </div>
                                            </div>

                                            {/* Branch Connector Line */}
                                            {index < branchModules.length - 1 && (
                                                <div className={`w-8 h-[2px] z-0 ${isFullyCompleted ? 'bg-brutal-green' : 'bg-brutal-gray opacity-40'}`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-4 border-t-2 border-brutal-white/20 flex gap-4 text-[10px] font-mono uppercase text-brutal-white/80">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brutal-green border-2 border-brutal-black" />
                    <span>Mastered</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brutal-dark border-2 border-brutal-white" />
                    <span>Active</span>
                </div>
                <div className="flex items-center gap-2 opacity-40">
                    <div className="w-3 h-3 bg-brutal-dark border-2 border-brutal-gray" />
                    <span>Locked</span>
                </div>
            </div>
        </div>
    );
};

