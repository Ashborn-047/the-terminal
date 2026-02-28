import React from 'react';
import { TerminalComponent } from '../components/terminal/Terminal';
import { useLabStore } from '../stores/labStore';
import { useGamificationStore, getLevelTitle } from '../stores/gamificationStore';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { GuidedLabInstructions, DIYLabInstructions } from '../components/lab/LabComponents';

/**
 * HomePage — per frontend_architecture.md §5: the main view
 * Shows terminal + active lab instructions side by side (60/40 split per ui_ux_documentation.md §6)
 */
const HomePage: React.FC = () => {
    const { currentLabId, labs, progress } = useLabStore();
    const currentLab = currentLabId ? labs[currentLabId] : null;
    const currentProgress = currentLabId ? progress[currentLabId] : null;
    const { awardXP, updateStreak, labsCompleted } = useGamificationStore();

    const handleDIYComplete = () => {
        if (currentLab) {
            useLabStore.getState().completeLab(currentLab.id);
            awardXP(currentLab.xpReward);
            updateStreak();
            useGamificationStore.setState((s) => ({ labsCompleted: s.labsCompleted + 1 }));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-full">
            {/* Terminal Area — 60% */}
            <div className="lg:col-span-3 h-full">
                <ErrorBoundary section="Terminal">
                    <TerminalComponent />
                </ErrorBoundary>
            </div>

            {/* Lab/Info Area — 40% */}
            <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto">
                {currentLab && currentProgress ? (
                    <ErrorBoundary section="Lab Instructions">
                        {currentLab.type === 'guided' ? (
                            <GuidedLabInstructions
                                lab={currentLab}
                                currentStepIndex={currentProgress.currentStepIndex}
                            />
                        ) : (
                            <DIYLabInstructions
                                lab={currentLab}
                                vfs={null as any} // Will be passed via context
                                userId="guest"
                                onComplete={handleDIYComplete}
                            />
                        )}
                    </ErrorBoundary>
                ) : (
                    <div className="bg-brutal-white text-brutal-black p-6 border-3 border-brutal-black shadow-brutal">
                        <h2 className="font-heading text-xl uppercase mb-3">Welcome, Learner</h2>
                        <p className="text-sm mb-4">
                            Ready to master the Linux command line? Head to the <strong>Curriculum</strong> tab to start your first lab.
                        </p>
                        <div className="space-y-2 text-xs">
                            <p>💡 Try typing <code className="bg-brutal-dark text-brutal-green px-1">help</code> to see available commands</p>
                            <p>💡 Use <code className="bg-brutal-dark text-brutal-green px-1">man ls</code> to read the manual for any command</p>
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="bg-brutal-yellow text-brutal-black p-4 border-3 border-brutal-black shadow-brutal">
                    <h3 className="font-heading uppercase text-sm mb-2">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="font-heading uppercase text-[10px] text-black/60">Labs Done</span>
                            <p className="font-heading text-lg">{labsCompleted}</p>
                        </div>
                        <div>
                            <span className="font-heading uppercase text-[10px] text-black/60">Title</span>
                            <p className="font-heading text-sm">{getLevelTitle(useGamificationStore.getState().level)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
