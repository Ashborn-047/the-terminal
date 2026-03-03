import React from 'react';
import { Shield, Timer, BookOpen, AlertCircle, CheckCircle2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLabStore } from '../stores/labStore';
import { useGamificationStore } from '../stores/gamificationStore';

const CertificationDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { labs, progress } = useLabStore();
    const { level } = useGamificationStore();

    const rhcsaLabs = Object.values(labs).filter(l => l.tags?.includes('rhcsa') || l.id.startsWith('M15') || l.id.startsWith('M18'));
    const completedRhcsa = rhcsaLabs.filter(l => progress[l.id]?.status === 'completed').length;
    const locked = level < 5;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-12 relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-brutal-green/10 border-2 border-brutal-green/20 -rotate-12 pointer-events-none" />
                <div className="flex items-center gap-4 mb-2">
                    <Shield size={32} className="text-brutal-green" />
                    <h1 className="font-heading text-5xl uppercase tracking-tighter italic text-brutal-white">
                        RHCSA Prep Zone
                    </h1>
                </div>
                <p className="text-brutal-gray font-mono uppercase text-sm tracking-widest max-w-2xl">
                    Red Hat Certified System Administrator (RHCSA) simulation environment.
                    Master real-world sysadmin tasks under pressure.
                </p>
                <div className="mt-6 flex gap-8">
                    <div className="flex flex-col">
                        <span className="text-xs font-mono uppercase text-brutal-gray">Training Progress</span>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-48 bg-brutal-black border border-brutal-gray/30 overflow-hidden">
                                <div
                                    className="h-full bg-brutal-green brutal-stripes"
                                    style={{ width: `${(completedRhcsa / Math.max(1, rhcsaLabs.length)) * 100}%` }}
                                />
                            </div>
                            <span className="font-heading text-brutal-green">{completedRhcsa}/{rhcsaLabs.length}</span>
                        </div>
                    </div>
                </div>
            </header>

            {locked ? (
                <div className="bg-brutal-black border-4 border-brutal-red p-12 text-center shadow-brutal rotate-1">
                    <AlertCircle size={64} className="text-brutal-red mx-auto mb-6 animate-pulse" />
                    <h2 className="font-heading text-3xl uppercase text-brutal-white mb-4">Access Denied: Level 5 Required</h2>
                    <p className="text-brutal-gray font-mono max-w-md mx-auto mb-8">
                        The certification preparation environment contains high-stakes challenges.
                        Reach level 5 or complete 10 fundamental labs to unlock.
                    </p>
                    <button
                        onClick={() => navigate('/labs')}
                        className="bg-brutal-white text-brutal-black border-3 border-brutal-black px-8 py-4 font-heading text-xl uppercase shadow-brutal hover:bg-brutal-yellow transition-all active:translate-y-1 active:shadow-none"
                    >
                        Back to Training
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Survival Mode Card */}
                    <div className="bg-brutal-dark border-3 border-brutal-white p-6 shadow-brutal flex flex-col group hover:-rotate-1 transition-transform">
                        <div className="bg-brutal-red p-3 border-2 border-brutal-black w-fit mb-4 group-hover:scale-110 transition-transform">
                            <Timer size={28} className="text-brutal-white" />
                        </div>
                        <h3 className="font-heading text-xl uppercase text-brutal-white mb-2 italic">Survival Mode</h3>
                        <p className="text-xs text-brutal-gray font-mono flex-1 mb-6">
                            Fix a broken system with multiple issues under a 10-minute time limit.
                            Failure correlates to system downtime!
                        </p>
                        <button className="w-full bg-brutal-red text-brutal-white border-2 border-brutal-black py-3 font-heading uppercase hover:bg-brutal-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                            Enter Simulation
                        </button>
                    </div>

                    {/* Mock Exam Card */}
                    <div className="bg-brutal-dark border-3 border-brutal-white p-6 shadow-brutal flex flex-col group hover:rotate-1 transition-transform">
                        <div className="bg-brutal-blue p-3 border-2 border-brutal-black w-fit mb-4 group-hover:scale-110 transition-transform">
                            <Trophy size={28} className="text-brutal-white" />
                        </div>
                        <h3 className="font-heading text-xl uppercase text-brutal-white mb-2 italic">Mock EX200 Exam</h3>
                        <p className="text-xs text-brutal-gray font-mono flex-1 mb-6">
                            Complete 15 specific sysadmin tasks in one session. No hints allowed.
                            The ultimate test of your terminal mastery.
                        </p>
                        <button className="w-full bg-brutal-blue text-brutal-white border-2 border-brutal-black py-3 font-heading uppercase hover:bg-brutal-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                            Start Exam
                        </button>
                    </div>

                    {/* Study Guide Card */}
                    <div className="bg-brutal-dark border-3 border-brutal-white p-6 shadow-brutal flex flex-col group hover:scale-[1.02] transition-transform">
                        <div className="bg-brutal-yellow p-3 border-2 border-brutal-black w-fit mb-4 group-hover:scale-110 transition-transform">
                            <BookOpen size={28} className="text-brutal-black" />
                        </div>
                        <h3 className="font-heading text-xl uppercase text-brutal-white mb-2 italic">Study Guides</h3>
                        <p className="text-xs text-brutal-gray font-mono flex-1 mb-6">
                            Theoretic breakdowns of key RHCSA domains. Link concepts directly to their
                            practical lab counterparts.
                        </p>
                        <button className="w-full bg-brutal-yellow text-brutal-black border-2 border-brutal-black py-3 font-heading uppercase hover:bg-brutal-black hover:text-brutal-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                            Open Grimoire
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-12 p-6 border-2 border-brutal-gray/30 bg-brutal-black/50 backdrop-blur-sm">
                <h4 className="font-heading text-sm uppercase text-brutal-green mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Key RHCSA Domains Tracked
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-mono text-brutal-gray uppercase">
                    <div className="flex items-center gap-2 italic">
                        <div className="w-1.5 h-1.5 bg-brutal-green" /> User/Group Management
                    </div>
                    <div className="flex items-center gap-2 italic">
                        <div className="w-1.5 h-1.5 bg-brutal-blue" /> Storage & Filesystems
                    </div>
                    <div className="flex items-center gap-2 italic">
                        <div className="w-1.5 h-1.5 bg-brutal-pink" /> Security (SELinux/Firewall)
                    </div>
                    <div className="flex items-center gap-2 italic">
                        <div className="w-1.5 h-1.5 bg-brutal-yellow" /> Services & Systemd
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificationDashboard;
