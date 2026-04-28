import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUIStore } from "../../stores/uiStore";
import { useGamificationStore, getLevelTitle } from "../../stores/gamificationStore";
import { tokens, UserPopover, Display } from "../ui/AshbornDesignSystem";
import { OnboardingWalkthrough } from "../onboarding/OnboardingWalkthrough";
import { WelcomeModal } from "../onboarding/WelcomeModal";
import { useRef, useEffect } from "react";

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
    Book: (p) => <Icon {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></Icon>,
    AITutor: (p) => <Icon {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></Icon>,
    Profile: (p) => <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M8 14l-4 7h16l-4-7" /></Icon>,
    Arena: (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>,
    Settings: (p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></Icon>,
    Lock: (p) => <Icon {...p}><rect x="5" y="11" width="14" height="10" rx="1" /><path d="M8 11V7a4 4 0 018 0v4" /></Icon>,
    LogoMark: (p) => <Icon {...p} stroke={tokens.color.bg.base} strokeWidth="2"><rect x="3" y="3" width="14" height="14" rx="1" /><path d="M7 7l3 3-3 3M11 13h3" /></Icon>,
};

const NAV_ITEMS = [
    { id: "home", label: "Dashboard", Icon: Icons.Dashboard, path: "/" },
    { id: "terminal", label: "Terminal", Icon: Icons.Terminal, path: "/terminal" },
    { id: "curriculum", label: "Curriculum", Icon: Icons.Curriculum, path: "/labs" },
    { id: "docs", label: "Commands", Icon: Icons.Docs, path: "/commands" },
    { id: "chapters", label: "Chapters", Icon: Icons.Book, path: "/chapters", new: true },
    { id: "chat", label: "Chat", Icon: Icons.AITutor, path: "/chat" },
    // Profile and Settings removed from sidebar, accessible via UserPopover
    { id: "arena", label: "Arena", Icon: Icons.Arena, path: "/challenge-arena", new: true },
];
const MOBILE_NAV_ITEMS = [
    ...NAV_ITEMS,
    { id: "profile", label: "Profile", Icon: Icons.Profile, path: "/profile" },
    { id: "settings", label: "Settings", Icon: Icons.Settings, path: "/settings" },
];

const ActivityBarItem = ({ item, isActive, onClick, showTooltip = true, ...props }) => {
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
            {...props}
        >
            {isActive && (
                <div style={{
                    position: "absolute", left: 0, top: 8, bottom: 8,
                    width: 2, background: tokens.color.lime.base,
                }} />
            )}
            {item.new && !isActive && (
                <div style={{
                    position: "absolute", top: 10, right: 14,
                    width: 6, height: 6, borderRadius: "50%",
                    background: tokens.color.lime.base,
                    boxShadow: `0 0 8px ${tokens.color.lime.base}`,
                    animation: "al-pulse 2s infinite"
                }} />
            )}

            <item.Icon stroke={iconStroke} size={18} />

            {showTooltip && hovered && (
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

const ActivityBar = ({ activePath, onNavigate, user }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const popoverRef = useRef(null);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setPopoverOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <aside style={{
            width: 64,
            background: tokens.color.bg.surface,
            borderRight: `1px solid ${tokens.color.border.strong}`,
            display: "flex", flexDirection: "column",
            alignItems: "center",
            padding: "12px 0",
            flexShrink: 0,
            zIndex: 20,
            position: "relative",
        }}>
            <div
                style={{
                    width: 32, height: 32,
                    background: tokens.color.lime.base,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20, cursor: "pointer", flexShrink: 0,
                    fontFamily: tokens.font.display, fontSize: 13, fontWeight: 900,
                    color: tokens.color.text.inverse
                }}
                onClick={() => onNavigate?.("/")}
            >
                AL
            </div>

            <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, width: "100%" }}>
                {NAV_ITEMS.map((item) => (
                    <ActivityBarItem
                        key={item.id}
                        item={item}
                        isActive={activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path))}
                        onClick={onNavigate}
                        data-testid={`nav-item-${item.id}`}
                    />
                ))}
            </nav>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingBottom: 12, width: "100%", position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "help" }} title={`${user.streakDays} Day Streak`}>
                    <div style={{ color: tokens.color.amber.base, fontSize: 16, lineHeight: 1, fontWeight: 700 }}>▲</div>
                    <div style={{ fontFamily: tokens.font.mono, fontSize: 9, color: tokens.color.amber.base, fontWeight: 700, letterSpacing: "0.05em" }}>
                        {user.streakDays}
                    </div>
                    <span style={{ display: 'none' }}>{user.streakDays} Day Streak</span>
                </div>

                <div
                    style={{
                        width: 32, height: 32,
                        background: tokens.color.bg.overlay,
                        border: `1px solid ${popoverOpen ? tokens.color.lime.base : tokens.color.border.strong}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: tokens.font.mono,
                        fontSize: 12, fontWeight: 800, color: tokens.color.lime.base,
                        cursor: "pointer", transition: "all 0.15s",
                    }}
                    onClick={() => setPopoverOpen(!popoverOpen)}
                >
                    {user.initial}
                </div>

                {popoverOpen && (
                    <div ref={popoverRef}>
                        <UserPopover
                            user={user}
                            onProfile={() => onNavigate?.("/profile")}
                            onSettings={() => onNavigate?.("/settings")}
                            onLogout={() => {
                                // Simple logout for now, could be more involved
                                localStorage.clear();
                                window.location.reload();
                            }}
                            onClose={() => setPopoverOpen(false)}
                        />
                    </div>
                )}
            </div>
        </aside>
    );
};

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

const Header = ({ user, online, compact = false }) => {
    // Robust safety for progress values
    const xpPercent = user?.xpPercent || 0;
    const xpCurrent = user?.xpCurrent || 0;
    const xpNext = user?.xpNext || 150;

    return (
        <header style={{
            height: 48,
            background: tokens.color.bg.surface,
            borderBottom: `1px solid ${tokens.color.border.strong}`,
            display: "flex", alignItems: "center",
            padding: compact ? "0 10px" : "0 16px", gap: compact ? 8 : 16,
            flexShrink: 0,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Display size={compact ? "2xs" : "xs"} style={{ margin: 0, color: tokens.color.text.primary }}>
                    {user?.username || "GUEST"}
                </Display>
                <div style={{
                    padding: "2px 7px",
                    background: tokens.color.amber.base, color: tokens.color.text.inverse,
                    fontFamily: tokens.font.mono, fontSize: 10, fontWeight: 900, letterSpacing: "0.08em",
                }}>
                    LVL {user?.level || 1}
                </div>
            </div>

            {!compact && <div style={{ width: 1, height: 20, background: tokens.color.border.strong }} />}

            {!compact && (
                <span style={{ fontFamily: tokens.font.sans, fontSize: 11, color: tokens.color.text.tertiary, letterSpacing: "0.05em", fontWeight: 600, textTransform: "uppercase" }}>
                    {user?.rank || "NOVICE"}
                </span>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                    width: 100, height: 4,
                    background: "rgba(255,255,255,0.08)",
                    position: "relative", overflow: "hidden",
                }}>
                    <div style={{ height: "100%", background: tokens.color.lime.base, width: `${xpPercent}%`, transition: "width 0.6s ease" }} />
                </div>
                <span style={{ fontFamily: tokens.font.mono, fontSize: compact ? 9 : 10, color: tokens.color.text.tertiary }}>
                    {xpCurrent.toLocaleString()} / {xpNext.toLocaleString()} XP
                </span>
            </div>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: compact ? 6 : 12 }}>
                <ConnectionStatus online={online} />
            </div>
        </header>
    );
};

const MobileNav = ({ activePath, onNavigate }) => (
    <nav
        style={{
            height: 58,
            display: "grid",
            gridTemplateColumns: `repeat(${MOBILE_NAV_ITEMS.length}, minmax(0,1fr))`,
            borderTop: `1px solid ${tokens.color.border.strong}`,
            background: tokens.color.bg.surface,
            flexShrink: 0,
        }}
    >
        {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path));
            return (
                <button
                    key={item.id}
                    onClick={() => onNavigate?.(item.path)}
                    style={{
                        background: isActive ? tokens.color.lime.alpha[8] : "transparent",
                        border: "none",
                        borderRight: `1px solid ${tokens.color.border.subtle}`,
                        color: isActive ? tokens.color.lime.base : tokens.color.text.tertiary,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3,
                        fontFamily: tokens.font.sans,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        padding: "4px 2px",
                        cursor: "pointer",
                    }}
                >
                    <item.Icon stroke={isActive ? tokens.color.lime.base : tokens.color.text.tertiary} size={15} />
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                        {item.label}
                    </span>
                </button>
            );
        })}
    </nav>
);

export const AshbornLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username, onboardingStep, setUsername, setOnboardingStep } = useUIStore();
    const { level, streak, getXPProgress } = useGamificationStore();
    const { current: xpCurrent = 0, needed: xpNext = 150, percent: xpPercent = 0 } = getXPProgress?.() || {};
    const rank = level ? getLevelTitle(level) : "Terminal Novice";
    const getViewportWidth = () => {
        if (typeof window === "undefined") return 1280;
        return (
            window.visualViewport?.width ||
            document.documentElement?.clientWidth ||
            window.innerWidth
        );
    };
    const [viewportWidth, setViewportWidth] = useState(getViewportWidth);
    const [isLikelyTouchDevice, setIsLikelyTouchDevice] = useState(false);
    const isMobile = viewportWidth < 768 && isLikelyTouchDevice;
    const isCompactHeader = viewportWidth < 1024;

    useEffect(() => {
        const detectTouch = () => {
            if (typeof window === "undefined") return false;
            return Boolean(
                window.matchMedia?.("(pointer: coarse)").matches ||
                window.matchMedia?.("(hover: none)").matches ||
                navigator.maxTouchPoints > 0
            );
        };
        const onResize = () => {
            setViewportWidth(getViewportWidth());
            setIsLikelyTouchDevice(detectTouch());
        };
        setIsLikelyTouchDevice(detectTouch());
        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", onResize);
        window.visualViewport?.addEventListener("resize", onResize);
        // Ensure state heals after browser resize edge cases.
        const syncTick = window.setInterval(onResize, 400);
        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("orientationchange", onResize);
            window.visualViewport?.removeEventListener("resize", onResize);
            window.clearInterval(syncTick);
        };
    }, []);
    
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
        <div 
            className="al-grid"
            style={{
                display: "flex", height: "100%", minHeight: 0, width: "100%",
                background: tokens.color.bg.base, color: tokens.color.text.primary,
                overflow: "hidden",
                fontFamily: tokens.font.sans,
                position: "relative"
            }}
        >
            {/* INITIAL REGISTRATION — Full Screen Overlay */}
            {onboardingStep === 0 && (
                <WelcomeModal 
                    onComplete={(name) => {
                        setUsername(name);
                        setOnboardingStep(1);
                    }} 
                />
            )}

            {/* TOUR OVERLAY — Transparent Backdrop */}
            {onboardingStep === 1 && <OnboardingWalkthrough />}

            {/* MAIN APP SHELL — Blurred if onboarding */}
            <div style={{ 
                display: "flex", width: "100%", height: "100%",
                flexDirection: isMobile ? "column" : "row",
                filter: onboardingStep === 1 ? "blur(8px) brightness(0.4)" : "none",
                transition: "filter 0.5s ease",
                pointerEvents: onboardingStep === 1 ? "none" : "auto"
            }}>
                {!isMobile && (
                    <ActivityBar
                        activePath={location.pathname}
                        onNavigate={(p) => navigate(p)}
                        user={user}
                    />
                )}

                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <Header user={user} online={systemOnline} compact={isCompactHeader} />
                    <main style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", position: "relative", WebkitOverflowScrolling: "touch" }}>
                        {children}
                    </main>
                </div>
                {isMobile && (
                    <MobileNav
                        activePath={location.pathname}
                        onNavigate={(p) => navigate(p)}
                    />
                )}
            </div>
        </div>
    );
};

export default AshbornLayout;