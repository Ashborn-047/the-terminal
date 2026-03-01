import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { getLevelTitle } from '../../stores/gamificationStore';
import { Award, Zap, ChevronRight } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
    const { levelUpModalOpen, hideLevelUp, lastLeveledUpTo } = useUIStore();

    if (!levelUpModalOpen) return null;

    const title = getLevelTitle(lastLeveledUpTo);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brutal-black/80 backdrop-blur-sm p-4">
            <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal max-w-md w-full p-8 text-center animate-in zoom-in duration-300">
                <div className="flex justify-center mb-6">
                    <div className="bg-brutal-yellow p-4 border-3 border-brutal-black animate-bounce">
                        <Award size={64} className="text-brutal-black" />
                    </div>
                </div>

                <h2 className="font-heading text-4xl mb-2 text-brutal-black uppercase italic">
                    Level Up!
                </h2>

                <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-brutal-gray text-2xl line-through">LVL {lastLeveledUpTo - 1}</span>
                    <ChevronRight size={32} className="text-brutal-black" />
                    <span className="text-brutal-green text-5xl font-heading bg-brutal-black px-4 py-1 border-2 border-brutal-white">
                        {lastLeveledUpTo}
                    </span>
                </div>

                <div className="bg-brutal-black text-brutal-white p-4 border-3 border-brutal-gray mb-8">
                    <p className="text-brutal-green font-mono uppercase text-sm mb-1 tracking-widest">New Title Unlocked</p>
                    <p className="text-2xl font-heading uppercase">{title}</p>
                </div>

                <div className="space-y-4">
                    <p className="text-brutal-black font-medium">
                        You're becoming a true Linux master. Keep exploring to unlock more features!
                    </p>

                    <button
                        onClick={hideLevelUp}
                        className="w-full bg-brutal-black text-brutal-white border-3 border-brutal-black py-4 font-heading text-xl uppercase hover:bg-brutal-green hover:text-brutal-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                        Continue Journey
                    </button>

                    <p className="text-xs text-brutal-gray uppercase tracking-tighter">
                        Next milestone at level {Math.ceil(lastLeveledUpTo / 5) * 5}
                    </p>
                </div>
            </div>

            {/* Background particles/decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <Zap
                        key={i}
                        size={24}
                        className="text-brutal-yellow absolute animate-pulse opacity-50"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
