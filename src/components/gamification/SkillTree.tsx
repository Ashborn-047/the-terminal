import React from 'react';
import { useLabStore } from '../../stores/labStore';
import { Network, Circle, CheckCircle2 } from 'lucide-react';

/**
 * SkillTree — per Doc 3 §6.5
 * Visual tech tree for curriculum modules.
 */
export const SkillTree: React.FC = () => {
    const { labs, progress } = useLabStore();

    // Group labs by module (assuming lab IDs start with M1-, M2-, etc.)
    const modules = Array.from({ length: 18 }, (_, i) => {
        const moduleId = i + 1;
        const moduleLabs = Object.values(labs).filter(l => l.id.startsWith(`M${moduleId}-`));
        const completedLabs = moduleLabs.filter(l => progress[l.id]?.status === 'completed');

        return {
            id: moduleId,
            name: `Module ${moduleId}`,
            labs: moduleLabs,
            completedCount: completedLabs.length,
            totalCount: moduleLabs.length
        };
    });

    return (
        <div className="bg-brutal-black border-3 border-brutal-white p-6 shadow-brutal overflow-hidden">
            <div className="flex items-center gap-3 mb-6 border-b-2 border-brutal-white pb-4">
                <Network className="text-brutal-green" />
                <h2 className="font-heading text-xl uppercase text-brutal-white">System Skill Tree</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {modules.map((m) => {
                    const isFullyCompleted = m.totalCount > 0 && m.completedCount === m.totalCount;
                    const isUnlocked = m.id === 1 || modules[m.id - 2].completedCount > 0;

                    return (
                        <div
                            key={m.id}
                            className={`relative p-3 border-2 flex flex-col items-center justify-center transition-all ${isFullyCompleted
                                ? 'bg-brutal-green border-brutal-black text-brutal-black scale-105 shadow-brutal'
                                : isUnlocked
                                    ? 'bg-brutal-dark border-brutal-white text-brutal-white'
                                    : 'bg-brutal-dark border-brutal-gray text-brutal-gray opacity-40'
                                }`}
                        >
                            <div className="text-[10px] font-mono mb-1">M{m.id}</div>
                            {isFullyCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            <div className="mt-2 text-[8px] font-heading uppercase text-center leading-tight">
                                {m.completedCount}/{m.totalCount} Labs
                            </div>

                            {/* Connector line (simplified) */}
                            {m.id % 6 !== 0 && m.id < 18 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 w-4 h-[2px] bg-brutal-white z-0" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex gap-4 text-[10px] font-mono uppercase">
                <div className="flex items-center gap-1 text-brutal-green">
                    <div className="w-2 h-2 bg-brutal-green border border-brutal-black" />
                    <span>Completed</span>
                </div>
                <div className="flex items-center gap-1 text-brutal-white">
                    <div className="w-2 h-2 bg-brutal-dark border border-brutal-white" />
                    <span>Unlocked</span>
                </div>
                <div className="flex items-center gap-1 text-brutal-gray">
                    <div className="w-2 h-2 bg-brutal-dark border border-brutal-gray opacity-40" />
                    <span>Locked</span>
                </div>
            </div>
        </div>
    );
};
