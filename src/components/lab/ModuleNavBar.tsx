import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MODULES } from '../../data/modules';
import { tokens } from '../ui/AshbornDesignSystem';

interface ModuleNavBarProps {
    className?: string;
}

export const ModuleNavBar: React.FC<ModuleNavBarProps> = () => {
    const navigate = useNavigate();
    const { moduleId } = useParams();
    const currentModuleId = moduleId ? parseInt(moduleId) : 1;

    return (
        <div 
            className="module-navbar"
            style={{ 
                display: 'flex', 
                flexDirection: 'var(--module-nav-dir, column)', 
                height: '100%',
                backgroundColor: tokens.color.bg.surface,
                borderRight: `var(--module-nav-border-r, 1px solid ${tokens.color.border.default})`,
                borderBottom: `var(--module-nav-border-b, none)`,
                padding: tokens.space[4],
                overflowY: 'auto',
                overflowX: 'var(--module-nav-overflow-x, hidden)'
            }}
        >
            <style>{`
                @media (max-width: ${tokens.breakpoint.lg}) {
                    .module-navbar {
                        --module-nav-dir: row;
                        --module-nav-border-r: none;
                        --module-nav-border-b: 1px solid ${tokens.color.border.default};
                        --module-nav-overflow-x: auto;
                    }
                    .module-navbar h2 { display: none; }
                    .module-navbar .module-list { 
                        flex-direction: row !important; 
                        width: auto !important;
                    }
                    .module-navbar .module-item {
                        width: auto !important;
                        min-width: 140px;
                        border-left: none !important;
                        border-bottom: 2px solid var(--border-color, transparent);
                    }
                }
            `}</style>
            <h2 style={{ 
                fontFamily: tokens.font.sans,
                fontSize: tokens.fontSize.xs,
                fontWeight: 700,
                textTransform: 'uppercase',
                color: tokens.color.text.tertiary,
                marginBottom: tokens.space[6],
                letterSpacing: tokens.letterSpacing.widest,
                paddingLeft: 4
            }}>
                Modules
            </h2>
            
            <div className="module-list" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {MODULES.map((module) => {
                    const isActive = currentModuleId === module.id;
                    return (
                        <button
                            key={module.id}
                            className="module-item"
                            onClick={() => navigate(`/labs/${module.id}`)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 12px',
                                textAlign: 'left',
                                background: isActive ? tokens.color.lime.alpha[8] : 'transparent',
                                border: 'none',
                                borderLeft: `2px solid ${isActive ? tokens.color.lime.base : 'transparent'}`,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                width: '100%',
                                ['--border-color' as any]: isActive ? tokens.color.lime.base : 'transparent'
                            }}
                        >
                            <span style={{ fontSize: 20 }}>{module.icon}</span>
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <span style={{ 
                                    fontFamily: tokens.font.sans, 
                                    fontSize: tokens.fontSize.xs, 
                                    fontWeight: isActive ? 700 : 500,
                                    textTransform: 'uppercase', 
                                    color: isActive ? tokens.color.text.primary : tokens.color.text.secondary,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {module.title}
                                </span>
                                <span style={{ 
                                    fontFamily: tokens.font.mono, 
                                    fontSize: 9, 
                                    color: tokens.color.text.tertiary,
                                    marginTop: 2
                                }}>
                                    MOD {module.id}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
