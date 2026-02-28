import React from 'react';
import { TerminalComponent } from '../components/terminal/Terminal';
import { ErrorBoundary } from '../components/ErrorBoundary';

/**
 * TerminalPage — Standalone free-roam terminal, not tied to any lab.
 * Users can explore the VFS, practice commands, and experiment freely.
 */
const TerminalPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b-3 border-brutal-green bg-brutal-black p-3 shrink-0">
                <div>
                    <h2 className="font-heading uppercase text-sm text-brutal-green">Free Terminal</h2>
                    <span className="text-[10px] text-brutal-gray">Sandbox mode — explore freely, no lab objectives</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 border border-brutal-green text-[10px] font-heading uppercase text-brutal-green">
                        sandbox
                    </span>
                </div>
            </div>

            {/* Full Terminal */}
            <div className="flex-1 min-h-0">
                <ErrorBoundary section="Terminal">
                    <TerminalComponent />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default TerminalPage;
