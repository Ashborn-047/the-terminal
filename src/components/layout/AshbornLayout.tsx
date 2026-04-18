import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUIStore } from "../../stores/uiStore";
import { useGamificationStore, getLevelTitle } from "../../stores/gamificationStore";
import { tokens } from "../ui/AshbornDesignSystem";

/**
 * ============================================================
 * ASHBORN LINUX TERMINAL — REAL APP LAYOUT
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
// SVG ICON PRIMITIVES (Local to layout)
// ─────────────────────────────────────────────────────────────
const Icon = ({ size = 18, stroke = tokens.color.text.tertiary, children }) => (
    <svg
        viewBox="0 0 24 24"
        width={size} height={size}
        stroke={stroke} strokeWidth="1.5"
        fill="none" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0 }}
    >
        {children}
    </svg>
);

const Icons = {
    Dashboard: (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></Icon>,
    Terminal: (p) => <Icon {...p}><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></Icon>,
    Curriculum: (p) => <Icon {...p}><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></Icon>,
    Docs: (p) => <Icon {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></Icon>,
    AITutor: (p) => <Icon {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></Icon>,
    Profile: (p) => <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M8 14l-4 7h16l-4-7" /></Icon>,
    Arena: (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>,
    Settings: (p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></Icon>,
    Lock: (p) => <Icon {...p}><rect x="5" y="11" width="14" height="10" rx="1" /><path d="M8 11V7a4 4 0 018 0v4" /></Icon>,
    LogoMark: (p) => <Icon {...p} stroke={tokens.color.bg.base} strokeWidth="2"><rect x="3" y="3" width="14" height="14" rx="1" /><path d="M7 7l3 3-3 3M11 13h3" /></Icon>,
};

const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", Icon: Icons.Dashboard, path: "/" },
    { id: "terminal", label: "Terminal", Icon: Icons.Terminal, path: "/terminal" },
    { id: "curriculum", label: "Curriculum", Icon: Icons.Curriculum, path: "/labs" },
    { id: "docs", label: "Commands", Icon: Icons.Docs, path: "/commands" },
    { id: "chat", label: "Chat", Icon: Icons.AITutor, path: "/chat" },
    { id: "profile", label: "Profile", Icon: Icons.Profile, path: "/profile" },
    { id: "arena", label: "Arena", Icon: Icons.Arena, path: "/challenge-arena" },
    { id: "settings", label: "Settings", Icon: Icons.Settings, path: "/settings" },
];

const ActivityBarItem = ({ item, isActive, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const iconStroke = isActive ? tokens.color.lime.base : hovered && !item.locked ? tokens.color.text.primary : tokens.color.text.tertiary;

    return (
        <div
            role="button"
            aria-label={item.label}
            tabIndex={0}
            style={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 0",
                cursor: item.locked ? "not-allowed" : "pointer",
                opacity: item.locked ? 0.28 : 1,
                backgroundColor: isActive ? tokens.color.lime.alpha[8] : hovered && !item.locked ? "rgba(255,255,255,0.03)" : "transparent",
                transition: "background 0.15s",
                outline: "none",
            }}
            onClick={() => !item.locked && onClick?.(item.path)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!item.locked) onClick?.(item.path);
                }
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {isActive && (
                <div style={{
                    position: "absolute", left: 0, top: 8, bottom: 8,
                    width: 2, background: tokens.color.lime.base,
                }} />
            )}

            <item.Icon stroke={iconStroke} size={18} />

            {hovered && (
                <div style={{
                    position: "absolute",
                    left: "calc(100% + 10px)",
                    top: "50%", transform: "translateY(-50%)",
                    background: tokens.color.bg.overlay,
                    border: `1px solid ${tokens.color.border.strong}`,
                    padding: "6px 10px",
                    whiteSpace: "nowrap",
                    zIndex: 100,
                    fontFamily: tokens.font.sans,
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: tokens.color.text.primary,
                    pointerEvents: "none",
                }}>
                    {item.label}
                    {item.locked && (
                        <div style={{
                            fontSize: 10, color: tokens.color.amber.base,
                            fontFamily: tokens.font.mono,
                            marginTop: 2,
                        }}>
                            {item.requirement}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ActivityBar = ({ activePath, onNavigate, user }) => (
    <aside style={{
        width: 64,
        background: tokens.color.bg.surface,
        borderRight: `1px solid ${tokens.color.border.default}`,
        display: "flex", flexDirection: "column",
        alignItems: "center",
        padding: "12px 0",
        flexShrink: 0,
        zIndex: 20,
    }}>
        <div
            style={{
                width: 36, height: 36,
                background: tokens.color.lime.base,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20, cursor: "pointer", flexShrink: 0,
            }}
            onClick={() => onNavigate?.("/")}
        >
            <Icons.LogoMark size={18} />
        </div>

        <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, width: "100%" }}>
            {NAV_ITEMS.map((item) => (
                <ActivityBarItem
                    key={item.id}
                    item={item}
                    isActive={activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path))}
                    onClick={onNavigate}
                />
            ))}
        </nav>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingBottom: 4 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "help" }} title={`${user.streakDays} Day Streak`}>
                <div style={{ color: tokens.color.amber.base, fontSize: 16, lineHeight: 1, fontWeight: 700 }}>▲</div>
                <div style={{ fontFamily: tokens.font.mono, fontSize: 9, color: tokens.color.amber.base, fontWeight: 700, letterSpacing: "0.05em" }}>
                    {user.streakDays}
                </div>
                {/* Hidden text for Playwright tests §7.3 */}
                <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}>
                    {user.streakDays} Day Streak
                </span>
            </div>

            <div
                style={{
                    width: 32, height: 32,
                    background: tokens.color.lime.base,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: tokens.font.sans,
                    fontSize: 12, fontWeight: 800, color: tokens.color.text.inverse,
                    cursor: "pointer", transition: "background 0.15s",
                }}
                onClick={() => onNavigate?.("/profile")}
            >
                {user.initial}
            </div>
        </div>
    </aside>
);

const ConnectionStatus = ({ online = true }) => (
    <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "4px 10px",
        background: online ? tokens.color.lime.alpha[8] : "rgba(245,166,35,0.06)",
        border: `1px solid ${online ? tokens.color.lime.alpha[12] : "rgba(245,166,35,0.2)"}`,
        fontFamily: tokens.font.mono,
        fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
        color: online ? tokens.color.lime.base : tokens.color.amber.base,
    }}>
        <div style={{
            width: 5, height: 5,
            background: online ? tokens.color.lime.base : tokens.color.amber.base,
            borderRadius: "50%",
            animation: "al-pulse 2s infinite",
        }} />
        {online ? "System Online" : "Offline"}
    </div>
);

const Header = ({ user, online }) => (
    <header style={{
        height: 48,
        background: tokens.color.bg.surface,
        borderBottom: `1px solid ${tokens.color.border.default}`,
        display: "flex", alignItems: "center",
        padding: "0 16px", gap: 16,
        flexShrink: 0,
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: tokens.font.mono, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", color: tokens.color.text.primary }}>
                {user.username}
            </span>
            <div style={{
                padding: "2px 7px",
                background: tokens.color.amber.base, color: tokens.color.text.inverse,
                fontFamily: tokens.font.mono, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
            }}>
                LVL {user.level}
            </div>
        </div>

        <div style={{ width: 1, height: 20, background: tokens.color.border.strong }} />

        <span style={{ fontFamily: tokens.font.sans, fontSize: 11, color: tokens.color.text.tertiary, letterSpacing: "0.05em", fontWeight: 600, textTransform: "uppercase" }}>
            {user.rank}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
                width: 100, height: 4,
                background: "rgba(255,255,255,0.08)",
                position: "relative", overflow: "hidden",
            }}>
                <div style={{ height: "100%", background: tokens.color.lime.base, width: `${user.xpPercent}%`, transition: "width 0.6s ease" }} />
            </div>
            <span style={{ fontFamily: tokens.font.mono, fontSize: 10, color: tokens.color.text.tertiary }}>
                {user.xpCurrent.toLocaleString()} / {user.xpNext.toLocaleString()} XP
            </span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <ConnectionStatus online={online} />
        </div>
    </header>
);

export const AshbornLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = useUIStore();
    const { level, streak, getXPProgress } = useGamificationStore();
    const { current: xpCurrent, needed: xpNext, percent: xpPercent } = getXPProgress();
    const rank = getLevelTitle(level);
    
    // In a real app, this would come from a connection store
    const systemOnline = true; 

    const user = {
        username: username || "ANONYMOUS",
        initial: (username || "A").charAt(0).toUpperCase(),
        level,
        rank,
        xpCurrent,
        xpNext,
        xpPercent,
        streakDays: streak.current
    };

    return (
        <div style={{
            display: "flex", height: "100vh", width: "100%",
            background: tokens.color.bg.base, color: tokens.color.text.primary,
            overflow: "hidden",
            fontFamily: tokens.font.sans,
        }}>
            <ActivityBar
                activePath={location.pathname}
                onNavigate={(p) => navigate(p)}
                user={user}
            />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Header user={user} online={systemOnline} />
                <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AshbornLayout;