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
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            backgroundColor: tokens.color.bg.surface,
            borderRight: `1px solid ${tokens.color.border.default}`,
            padding: tokens.space[4],
            overflowY: 'auto'
        }}>
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
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {MODULES.map((module) => {
                    const isActive = currentModuleId === module.id;
                    return (
                        <button
                            key={module.id}
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
                                width: '100%'
                            }}
                            onMouseOver={(e) => {
                                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                            }}
                            onMouseOut={(e) => {
                                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
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
                                    MODULE {module.id.toString().padStart(2, '0')}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
