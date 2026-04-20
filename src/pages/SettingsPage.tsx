import React, { useState } from 'react';
import { useUIStore } from '../stores/uiStore';
import { 
    tokens, 
    Button, 
    SettingsSection,
    ToggleRow,
    KeybindRow,
    Display,
    Label
} from '../components/ui/AshbornDesignSystem';
import { CheckCircle } from 'lucide-react';

/**
 * SettingsPage — User preferences: username, theme, notification settings.
 */
export const SettingsPage: React.FC = () => {
    const { 
        username, 
        setUsername, 
        highContrast, 
        toggleHighContrast, 
        setOnboardingStep,
        themePreset,
        setThemePreset
    } = useUIStore();
    const [tempUsername, setTempUsername] = useState(username);
    const [isEditing, setIsEditing] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [uiAnimations, setUiAnimations] = useState(true);
    const [autoVerifyObjectives, setAutoVerifyObjectives] = useState(true);

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
            maxWidth: 800, 
            margin: '0 auto', 
            height: '100%', 
            overflowY: 'auto',
            background: tokens.color.bg.base,
            color: tokens.color.text.primary
        }}>
            <Label color={tokens.color.lime.base} style={{ marginBottom: 6 }}>System Configuration</Label>
            <Display size="lg" style={{ marginBottom: 28 }}>System Settings</Display>

            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space[4] }}>
                {/* User Identity Section */}
                <SettingsSection title="User Identity" icon="👤" subtitle="Your node handle and agent credentials">
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                        <div style={{ 
                            width: 52, height: 52, 
                            background: tokens.color.lime.base, 
                            display: "flex", alignItems: "center", justifyContent: "center", 
                            fontFamily: tokens.font.sans, fontSize: "20px", fontWeight: 800, 
                            color: tokens.color.text.inverse, flexShrink: 0 
                        }}>
                            {username?.[0]?.toUpperCase() || 'H'}
                        </div>
                        <div style={{ flex: 1 }}>
                            {isEditing ? (
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        value={tempUsername}
                                        onChange={(e) => setTempUsername(e.target.value.toLowerCase())}
                                        style={{ 
                                            background: tokens.color.bg.overlay,
                                            border: `1px solid ${tokens.color.lime.base}`,
                                            padding: '8px 12px',
                                            color: tokens.color.text.primary,
                                            fontFamily: tokens.font.mono,
                                            fontSize: tokens.fontSize.md,
                                            outline: 'none',
                                            width: '100%'
                                        }}
                                        autoFocus
                                    />
                                    <Button variant="lime" size="sm" onClick={handleSaveUsername}>UPDATE</Button>
                                    <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setTempUsername(username); }}>Cancel</Button>
                                </div>
                            ) : (
                                <>
                                    <Display size="sm" style={{ marginBottom: 2 }}>{username}</Display>
                                    <Label style={{ marginBottom: 0 }}>Current node handle</Label>
                                </>
                            )}
                        </div>
                        {!isEditing && <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Remap Identity</Button>}
                    </div>
                    {saveMessage && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: tokens.color.lime.base, fontSize: 11, marginTop: 8, fontFamily: tokens.font.mono }}>
                            <CheckCircle size={12} /> {saveMessage}
                        </div>
                    )}
                    <div style={{ background: tokens.color.bg.base, border: `1px solid ${tokens.color.border.default}`, padding: "8px 12px", display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                        <Label>Data stored locally</Label>
                        <span style={{ fontFamily: tokens.font.mono, fontSize: "10px", color: tokens.color.lime.base }}>No account required</span>
                    </div>
                </SettingsSection>

                {/* Visual Output Section */}
                <SettingsSection title="Visual Output" icon="🖥" subtitle="Appearance and display preferences">
                    <div style={{ marginBottom: 14 }}>
                        <Label style={{ marginBottom: 8 }}>Workstation Theme</Label>
                        <div style={{ display: "flex", gap: 6 }}>
                            {[
                                { id: 'ashborn', label: "ASHBORN_V2.0", colors: [tokens.color.lime.base, tokens.color.amber.base] },
                                { id: 'mono', label: "MONO_DARK", colors: ["#9A9A9A", "#555555"] },
                                { id: 'acid', label: "ACID_RED", colors: ["#FF5A5A", "#F5A623"] },
                            ].map((th) => (
                                <button
                                    key={th.id}
                                    onClick={() => setThemePreset(th.id as 'ashborn' | 'mono' | 'acid')}
                                    style={{ 
                                    display: "flex", alignItems: "center", gap: 6, 
                                    padding: "6px 10px", 
                                    background: themePreset === th.id ? tokens.color.lime.alpha[6] : tokens.color.bg.base, 
                                    border: `1px solid ${themePreset === th.id ? tokens.color.border.lime : tokens.color.border.default}`, 
                                    cursor: "pointer",
                                    color: 'inherit'
                                }}>
                                    <div style={{ display: "flex", gap: 3 }}>
                                        {th.colors.map((c, i) => <div key={i} style={{ width: 10, height: 10, background: c }} />)}
                                    </div>
                                    <span style={{ fontFamily: tokens.font.mono, fontSize: "9px", color: themePreset === th.id ? tokens.color.lime.base : tokens.color.text.tertiary }}>{th.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <ToggleRow 
                        label="High Contrast Telemetry" 
                        description="Increase border and accent contrast for accessibility" 
                        value={highContrast} 
                        onChange={toggleHighContrast} 
                    />
                    <ToggleRow 
                        label="UI Animations" 
                        description="Smooth transitions and micro-interactions" 
                        value={uiAnimations} 
                        onChange={setUiAnimations} 
                    />
                </SettingsSection>

                {/* Terminal Preferences Section */}
                <SettingsSection title="Terminal Preferences" icon="⌨" subtitle="Configure your shell environment">
                    <ToggleRow 
                        label="Auto-verify Objectives" 
                        description="Automatically check labs when commands match targets" 
                        value={autoVerifyObjectives} 
                        onChange={setAutoVerifyObjectives} 
                    />
                    <div style={{ marginTop: 12, background: tokens.color.bg.base, border: `1px solid ${tokens.color.border.default}`, padding: "10px 12px" }}>
                        <Label style={{ marginBottom: 6 }}>Terminal Preview</Label>
                        <div style={{ fontFamily: tokens.font.mono, fontSize: `12px`, lineHeight: 1.8, color: tokens.color.text.secondary }}>
                            <span style={{ color: tokens.color.text.tertiary }}>[agent] hero@ashborn:~$ </span>
                            <span style={{ color: "#8B8BFF" }}>ls -la</span><br />
                            <span>total 48</span><br />
                            <span style={{ color: tokens.color.lime.base }}>drwxr-xr-x  2 hero hero 4096 /home/hero</span>
                        </div>
                    </div>
                </SettingsSection>

                {/* Keybindings Section */}
                <SettingsSection title="Keybindings" icon="⌨️" subtitle="Default system keyboard shortcuts">
                    <KeybindRow action="Open terminal" keys={["Ctrl", "T"]} />
                    <KeybindRow action="Toggle sidebar" keys={["Ctrl", "B"]} />
                    <KeybindRow action="Next lab step" keys={["Ctrl", "→"]} />
                    <KeybindRow action="Verify step" keys={["Ctrl", "Enter"]} />
                </SettingsSection>

                {/* Danger Zone Section */}
                <SettingsSection title="Danger Zone" accent="danger" icon="⚠" subtitle="Irreversible system actions">
                    <p style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: "12px", 
                        color: tokens.color.text.secondary, 
                        lineHeight: 1.7, 
                        marginBottom: 16 
                    }}>
                        Purging your workstation permanently deletes all local lab progress, XP, and achievement data. This action cannot be undone.
                    </p>
                    <Button variant="danger" size="md" onClick={handleReset}>UNINSTALL SYSTEM PROFILE</Button>
                </SettingsSection>
            </div>
        </div>
    );
};

export default SettingsPage;
