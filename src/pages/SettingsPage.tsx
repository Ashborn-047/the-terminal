import React, { useState } from 'react';
import { useUIStore } from '../stores/uiStore';
import { 
    tokens, 
    Card, 
    Button, 
    Badge, 
    Divider 
} from '../components/ui/AshbornDesignSystem';
import { User, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * SettingsPage — User preferences: username, theme, notification settings.
 */
export const SettingsPage: React.FC = () => {
    const { username, setUsername, highContrast, toggleHighContrast, setOnboardingStep } = useUIStore();
    const [tempUsername, setTempUsername] = useState(username);
    const [isEditing, setIsEditing] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleSaveUsername = () => {
        const trimmed = tempUsername.trim();
        if (trimmed.length >= 3 && trimmed.length <= 20 && /^[a-zA-Z0-9_]+$/.test(trimmed)) {
            setUsername(trimmed);
            setIsEditing(false);
            setSaveMessage('Identity Updated');
            setTimeout(() => setSaveMessage(''), 3000);
        } else {
            alert('Invalid username. 3-20 chars, alphanumeric + underscores.');
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure? This will terminate your current session and wipe all progress data (Labs & XP).")) {
            localStorage.clear();
            setOnboardingStep(0);
            window.location.href = '/the-terminal/';
        }
    };

    return (
        <div style={{ 
            padding: tokens.space[8], 
            maxWidth: 1024, 
            margin: '0 auto', 
            height: '100%', 
            overflowY: 'auto',
            backgroundColor: tokens.color.bg.base,
            color: tokens.color.text.primary
        }}>
            <h1 style={{ 
                fontFamily: tokens.font.sans, 
                fontSize: tokens.fontSize['3xl'], 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                color: tokens.color.text.primary, 
                marginBottom: tokens.space[8],
                letterSpacing: tokens.letterSpacing.widest,
                fontStyle: 'italic'
            }}>
                System Settings
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space[6] }}>
                {/* Profile Section */}
                <Card variant="default" style={{ padding: tokens.space[6] }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: tokens.space[6] }}>
                        <User size={20} style={{ color: tokens.color.lime.base }} />
                        <h2 style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.md, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>User Identity</h2>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ 
                            width: 64, 
                            height: 64, 
                            background: tokens.color.bg.overlay, 
                            border: `1px solid ${tokens.color.border.default}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 32,
                            borderRadius: 4
                        }}>
                            👤
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 9, fontFamily: tokens.font.mono, color: tokens.color.text.tertiary, textTransform: 'uppercase', marginBottom: 4 }}>Current Node Handle</div>
                            {isEditing ? (
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        value={tempUsername}
                                        onChange={(e) => setTempUsername(e.target.value)}
                                        style={{ 
                                            backgroundColor: tokens.color.bg.base,
                                            border: `1px solid ${tokens.color.lime.base}`,
                                            padding: '8px 12px',
                                            color: tokens.color.lime.base,
                                            fontFamily: tokens.font.mono,
                                            fontSize: tokens.fontSize.lg,
                                            outline: 'none',
                                            borderRadius: 2
                                        }}
                                        autoFocus
                                    />
                                    <Button variant="lime" size="sm" onClick={handleSaveUsername}>UPDATE</Button>
                                    <button 
                                        onClick={() => { setIsEditing(false); setTempUsername(username); }}
                                        style={{ background: 'none', border: 'none', color: tokens.color.text.tertiary, fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.xl, fontWeight: 800 }}>{username}</div>
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        style={{ background: 'none', border: 'none', color: tokens.color.lime.base, fontSize: 10, cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                                    >
                                        [REMAP_IDENTITY]
                                    </button>
                                </div>
                            )}
                            {saveMessage && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: tokens.color.lime.base, fontSize: 11, marginTop: 8, fontFamily: tokens.font.mono }}>
                                    <CheckCircle size={12} /> {saveMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Appearance Section */}
                <Card variant="default" style={{ padding: tokens.space[6] }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: tokens.space[6] }}>
                        <Monitor size={20} style={{ color: tokens.color.amber.base }} />
                        <h2 style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.md, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Visual Output</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ 
                            padding: tokens.space[4], 
                            background: tokens.color.bg.overlay, 
                            border: `1px solid ${tokens.color.border.default}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: tokens.font.sans }}>Workstation Theme</div>
                                <div style={{ fontSize: 10, color: tokens.color.text.tertiary, fontFamily: tokens.font.mono }}>ACTIVE_PROFILE: ASHBORN_V1.0</div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ width: 16, height: 16, background: tokens.color.lime.base, borderRadius: 2 }}></div>
                                <div style={{ width: 16, height: 16, background: tokens.color.amber.base, borderRadius: 2 }}></div>
                                <div style={{ width: 16, height: 16, background: tokens.color.bg.base, border: `1px solid ${tokens.color.border.default}`, borderRadius: 2 }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={toggleHighContrast}>
                            <div style={{ 
                                width: 36, 
                                height: 18, 
                                background: highContrast ? tokens.color.lime.base : tokens.color.bg.overlay, 
                                border: `1px solid ${tokens.color.border.default}`,
                                borderRadius: 10,
                                position: 'relative',
                                transition: 'all 0.2s'
                            }}>
                                <div style={{ 
                                    position: 'absolute', 
                                    top: 2, 
                                    left: highContrast ? 18 : 2, 
                                    width: 12, 
                                    height: 12, 
                                    background: highContrast ? tokens.color.bg.base : tokens.color.text.tertiary, 
                                    borderRadius: '50%',
                                    transition: 'all 0.2s'
                                }}></div>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: tokens.font.sans, textTransform: 'uppercase' }}>High Contrast Telemetry</span>
                        </div>
                    </div>
                </Card>

                {/* System Section */}
                <Card variant="default" style={{ padding: tokens.space[6], border: `1px solid rgba(239, 68, 68, 0.3)` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: tokens.space[6] }}>
                        <AlertTriangle size={20} style={{ color: 'rgb(239, 68, 68)' }} />
                        <h2 style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.md, fontWeight: 800, textTransform: 'uppercase', margin: 0, color: 'rgb(239, 68, 68)' }}>Danger Zone</h2>
                    </div>
                    
                    <p style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: tokens.fontSize.xs, 
                        color: tokens.color.text.secondary, 
                        marginBottom: tokens.space[6],
                        maxWidth: 600,
                        lineHeight: 1.5
                    }}>
                        Purging your workstation will permanently delete all local cache, laboratory progress, and accumulated XP. This action is irreversible.
                    </p>
                    
                    <Button 
                        variant="outline" 
                        onClick={handleReset}
                        style={{ 
                            borderColor: 'rgb(239, 68, 68)', 
                            color: 'rgb(239, 68, 68)',
                            fontSize: 10
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        UNINSTALL SYSTEM PROFILE
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
