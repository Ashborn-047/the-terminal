import React from 'react';
import { TerminalComponent } from '../components/terminal/Terminal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { 
    tokens, 
    Badge 
} from '../components/ui/AshbornDesignSystem';

/**
 * TerminalPage — Standalone free-roam terminal.
 */
const TerminalPage: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: tokens.color.bg.base }}>
            {/* Header */}
            <header style={{ 
                height: 48, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '0 16px', 
                background: tokens.color.bg.surface, 
                borderBottom: `1px solid ${tokens.color.border.default}`,
                flexShrink: 0 
            }}>
                <div>
                    <h2 style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: tokens.fontSize.sm, 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        color: tokens.color.lime.base, 
                        margin: 0,
                        letterSpacing: tokens.letterSpacing.wide
                    }}>
                        Free Terminal
                    </h2>
                    <span style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: 10, 
                        color: tokens.color.text.tertiary,
                        textTransform: 'uppercase',
                        fontWeight: 500
                    }}>
                        Sandbox Mode — no active lab objectives
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Badge variant="lime">SANDBOX</Badge>
                </div>
            </header>

            {/* Full Terminal */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <ErrorBoundary section="Terminal">
                    <TerminalComponent />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default TerminalPage;
