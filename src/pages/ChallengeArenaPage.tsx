import React from 'react';
import { useGamificationStore } from '../stores/gamificationStore';
import { brokenSystemLabs } from '../data/labs/broken_systems';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';
import { Shield, Trophy, AlertTriangle, Terminal as TerminalIcon } from 'lucide-react';

const ChallengeArenaPage: React.FC = () => {
    const navigate = useNavigate();
    const { level, masteryBadge } = useGamificationStore();
    
    // Unlock arena at Level 10 (Hacker Rank)
    const isLocked = level < 10;

    return (
        <div className="flex flex-col gap-8 p-10 bg-brutal-dark h-full overflow-y-auto selection:bg-brutal-red selection:text-brutal-white">
            {/* Header section with Rank indicator */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-6 border-brutal-white pb-6 gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-brutal-red" size={32} />
                        <span className="font-mono text-xs uppercase tracking-[0.3em] text-brutal-red font-bold">Terminal Mastery Required</span>
                    </div>
                    <h1 className="text-6xl font-heading text-brutal-white uppercase tracking-tighter italic leading-none">
                        Challenge Arena
                    </h1>
                    <p className="text-brutal-gray mt-4 max-w-xl font-mono text-sm leading-relaxed border-l-4 border-brutal-red pl-4">
                        Elite laboratory for high-stakes system troubleshooting. 
                        Each scenario is a "Broken System" requiring authoritative outcome-based verification.
                    </p>
                </div>
                
                <div className="flex flex-col gap-1 items-end">
                    <span className="text-xs uppercase font-mono text-brutal-gray tracking-widest">Mastery Status</span>
                    <div className={cn(
                        "flex items-center gap-3 p-4 border-4",
                        masteryBadge === 'kernel_master' ? "bg-brutal-purple border-brutal-white text-brutal-white shadow-brutal" :
                        masteryBadge === 'sysad' ? "bg-brutal-red border-brutal-white text-brutal-white shadow-brutal" :
                        masteryBadge === 'hacker' ? "bg-brutal-green border-brutal-black text-brutal-dark shadow-brutal" :
                        "bg-brutal-white border-brutal-black text-brutal-dark"
                    )}>
                        <Trophy size={24} />
                        <span className="text-2xl font-heading uppercase tracking-tighter">
                            {masteryBadge === 'kernel_master' ? 'Kernel Master' : masteryBadge}
                        </span>
                    </div>
                </div>
            </div>

            {isLocked ? (
                <div className="flex-1 flex flex-col items-center justify-center border-6 border-dashed border-brutal-white/10 p-20 text-center bg-brutal-black/30">
                    <div className="relative mb-8">
                        <TerminalIcon size={120} className="text-brutal-gray opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-7xl">🔒</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-heading text-brutal-white uppercase tracking-tighter">Arena Restricted</h2>
                    <p className="text-brutal-gray mt-4 max-w-md font-mono text-sm">
                        You must achieve <span className="text-brutal-green font-bold underline">Level 10 (Hacker Rank)</span> to survive these scenarios. 
                        Return after completing more fundamental training labs.
                    </p>
                    <button 
                        onClick={() => navigate('/labs')}
                        className="mt-10 bg-brutal-white text-brutal-dark font-heading px-10 py-4 uppercase border-4 border-brutal-black shadow-brutal hover:bg-brutal-green hover:shadow-none transition-all"
                    >
                        Return to Training
                    </button>
                    
                    <div className="mt-12 flex gap-4 grayscale opacity-30 select-none pointer-events-none">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-64 h-40 bg-brutal-dark border-4 border-white/10 flex flex-col p-4">
                                <div className="h-4 w-2/3 bg-white/10 mb-2" />
                                <div className="h-4 w-full bg-white/10 mb-2" />
                                <div className="h-24 w-full bg-white/5 mt-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {brokenSystemLabs.map((lab) => (
                        <div
                            key={lab.id}
                            className="group relative flex flex-col bg-brutal-black border-4 border-brutal-white p-8 transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-brutal-red/10 border-2 border-brutal-red text-brutal-red group-hover:bg-brutal-red group-hover:text-brutal-white transition-colors">
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-mono text-brutal-green bg-brutal-green/10 px-2 py-1 border border-brutal-green/30 font-bold">
                                        REWARD: {lab.xpReward} XP
                                    </span>
                                    <span className="text-[10px] uppercase font-mono text-brutal-gray mt-1">Difficulty: Hard</span>
                                </div>
                            </div>
                            
                            <h3 className="text-3xl font-heading text-brutal-white uppercase tracking-tighter mb-4 group-hover:text-brutal-red transition-colors leading-tight">
                                {lab.title}
                            </h3>
                            
                            <p className="text-sm font-mono text-brutal-gray mb-8 line-clamp-4 leading-relaxed border-l-2 border-brutal-white/20 pl-4">
                                {lab.description}
                            </p>
                            
                            <div className="mt-auto flex flex-col gap-6">
                                <div className="flex flex-wrap gap-2">
                                    {lab.tags?.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 bg-brutal-dark border border-brutal-white/20 text-brutal-gray group-hover:border-brutal-white/40">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                
                                <button
                                    onClick={() => navigate(`/lab/${lab.id}`)}
                                    className="w-full bg-brutal-white text-brutal-dark font-heading py-4 uppercase border-4 border-brutal-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-brutal-red hover:text-white hover:shadow-none transition-all active:translate-y-1"
                                >
                                    Initialize Scenario
                                </button>
                            </div>
                            
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                                <div className="absolute top-0 right-0 border-t-8 border-r-8 border-brutal-white w-full h-full" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChallengeArenaPage;
