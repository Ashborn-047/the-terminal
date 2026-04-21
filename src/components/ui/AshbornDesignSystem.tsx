// Paste Claude's Design System v.2 code here

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║        ASHBORN LINUX TERMINAL — DESIGN SYSTEM v2                    ║
 * ║        AshbornDesignSystem_v2.jsx                                   ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  WHAT CHANGED FROM v1:                                              ║
 * ║   • Typography overhaul — Russo One replaces Syne for display       ║
 * ║   • Onboarding modal component added                                ║
 * ║   • Tour step overlay component added                               ║
 * ║   • Achievement toast redesigned (unified, dismissible)             ║
 * ║   • ActivitySpark replaces full heatmap on dashboard                ║
 * ║   • SkillRadar component for Profile page                          ║
 * ║   • NavSidebar UX fix — bottom avatar now opens UserPopover         ║
 * ║     (duplicate profile nav icon removed, person slot = Leaderboard) ║
 * ║   • ArenaGate locked-state component (replaces padlock center)      ║
 * ║   • Settings expanded: keybindings, terminal prefs, notifications   ║
 * ║   • AchievementGrid replaces flat list                              ║
 * ║   • XPRing visual progress component                                ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  FONTS REQUIRED — add to index.html <head>:                         ║
 * ║  <link href="https://fonts.googleapis.com/css2?family=              ║
 * ║    Russo+One&family=JetBrains+Mono:wght@400;500;700&family=         ║
 * ║    Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════════════════════════════
// SECTION 1 — DESIGN TOKENS v2
// ════════════════════════════════════════════════════════════════════════
export const tokens = {

    color: {
        bg: {
            base: "#0D0D0F",   // App root — the deepest layer
            surface: "#111114",   // Sidebar, header, panels (elev 1)
            raised: "#171719",   // Cards, dropdowns (elev 2)
            overlay: "#1E1E22",   // Modals, popovers (elev 3)
            input: "#0F0F12",   // Inputs, tab bars (recessed)
            glass: "rgba(17,17,20,0.85)", // Backdrop blur surfaces
        },
        border: {
            subtle: "rgba(255,255,255,0.05)",
            default: "rgba(255,255,255,0.08)",
            strong: "rgba(255,255,255,0.14)",
            inverse: "rgba(255,255,255,0.22)",
            lime: "rgba(200,241,53,0.25)",
            amber: "rgba(245,166,35,0.25)",
            error: "rgba(255,90,90,0.25)",
        },
        text: {
            primary: "#E8E6E0",
            secondary: "#9A9A9A",
            tertiary: "#555555",
            disabled: "#333336",
            inverse: "#0D0D0F",
        },

        // PRIMARY ACCENT — Lime (system-green, online, active, verified)
        lime: {
            50: "#F4FDD4",
            100: "#E5FA9A",
            200: "#D4F55A",
            base: "#C8F135",
            600: "#A0C420",
            800: "#607514",
            alpha: { 6: "rgba(200,241,53,0.06)", 10: "rgba(200,241,53,0.10)", 18: "rgba(200,241,53,0.18)", 30: "rgba(200,241,53,0.30)" },
        },

        // SECONDARY ACCENT — Amber (XP, level, streak, warnings)
        amber: {
            50: "#FFF4D4",
            100: "#FAD97A",
            200: "#F5BD3A",
            base: "#F5A623",
            600: "#C47E0E",
            800: "#7A4E08",
            alpha: { 6: "rgba(245,166,35,0.06)", 10: "rgba(245,166,35,0.10)", 18: "rgba(245,166,35,0.18)", 30: "rgba(245,166,35,0.30)" },
        },

        semantic: {
            success: "#C8F135",
            warning: "#F5A623",
            error: "#FF5A5A",
            info: "#5B8BFF",
            errorBg: "rgba(255,90,90,0.06)",
            infoBg: "rgba(91,139,255,0.06)",
        },

        // Terminal syntax palette — only use inside terminal body elements
        terminal: {
            comment: "#3D3D45",
            prompt: "#555555",
            command: "#8B8BFF",
            output: "#9A9A9A",
            highlight: "#C8F135",
            root: "#F5A623",
            cursor: "#C8F135",
            string: "#A8E6A3",
            error: "#FF5A5A",
            number: "#7EC8E3",
        },

        // Skill category colors — used in radar chart and advancement tree
        skills: {
            filesystem: "#C8F135",  // lime
            permissions: "#F5A623",  // amber
            networking: "#5B8BFF",  // blue
            scripting: "#FF5A5A",  // red
            processes: "#A8E6A3",  // green
        },
    },

    // ── TYPOGRAPHY v2 ────────────────────────────────────────────────
    // KEY CHANGE: Russo One for all display/heading text.
    // Russo One is geometric, military-grade, 100% legible at all sizes.
    // Syne demoted to sub-labels and UI chrome only.
    font: {
        display: "'Russo One', sans-serif",      // PAGE TITLES, SECTION HEADERS, HERO TEXT
        sans: "'Syne', sans-serif",           // UI labels, nav, badges, sub-headings
        mono: "'JetBrains Mono', monospace",  // Terminal, code, data values, XP numbers
    },

    fontSize: {
        "2xs": "9px",
        xs: "10px",
        sm: "11px",
        base: "12px",
        md: "13px",
        lg: "15px",
        xl: "18px",
        "2xl": "24px",
        "3xl": "32px",
        "4xl": "42px",
        "5xl": "56px",
    },

    fontWeight: {
        regular: 400,
        medium: 600,
        bold: 700,
        black: 800,
    },

    letterSpacing: {
        tight: "-0.02em",
        normal: "0em",
        wide: "0.04em",
        wider: "0.08em",
        widest: "0.12em",
        display: "-0.01em", // Russo One looks best with very slight tightening
    },

    lineHeight: {
        tight: 1.1,
        snug: 1.3,
        normal: 1.6,
        loose: 1.8,
    },

    // ── SPACING (4px grid) ──────────────────────────────────────────
    space: {
        0: "0px", 1: "4px", 2: "8px", 3: "12px", 4: "16px",
        5: "20px", 6: "24px", 8: "32px", 10: "40px", 12: "48px", 16: "64px",
    },

    // ── FIXED DIMENSIONS ────────────────────────────────────────────
    size: {
        // Layout
        sidebar: "64px",
        header: "48px",
        statusBar: "22px",
        tabBar: "36px",
        objPanel: "220px",
        // Onboarding modal
        onboardModal: "480px",
        tourModal: "460px",
        // Components
        avatar: "32px",
        avatarLg: "48px",
        avatarXl: "80px",
        icon: "18px",
        iconSm: "12px",
        dot: "5px",
        cursor: "7px",
        cursorH: "14px",
        activeLine: "2px",
        xpTrack: "100px",
        xpHeight: "4px",
        // Activity spark (replaces heatmap)
        sparkHeight: "28px",
        sparkCell: "6px",
        // Radar chart
        radarSize: "220px",
    },

    radius: {
        none: "0px",
        sm: "2px",
        md: "6px",   // NEW — used for modal inner elements only
        full: "9999px",
    },

    motion: {
        duration: {
            instant: "80ms",
            fast: "150ms",
            normal: "250ms",
            slow: "400ms",
            crawl: "600ms",
        },
        easing: {
            easeOut: "cubic-bezier(0.0, 0.0, 0.2, 1)",
            spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            linear: "linear",
        },
    },

    shadow: {
        sm: "0 2px 4px rgba(0,0,0,0.1)",
        md: "0 4px 12px rgba(0,0,0,0.15)",
        lg: "0 12px 32px rgba(0,0,0,0.25)",
        glow: "0 0 20px rgba(200,241,53,0.15)",
    },
    z: {
        base: 0, raised: 10, dropdown: 50,
        tooltip: 100, modal: 200, toast: 300, critical: 400,
    },
};

// ════════════════════════════════════════════════════════════════════════
// SECTION 2 — GLOBAL STYLES v2
// ════════════════════════════════════════════════════════════════════════
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --al-bg-base:      #0D0D0F;
    --al-bg-surface:   #111114;
    --al-bg-raised:    #171719;
    --al-bg-overlay:   #1E1E22;
    --al-bg-input:     #0F0F12;
    --al-bg-glass:     rgba(17,17,20,0.85);

    --al-bd-sub:    rgba(255,255,255,0.05);
    --al-bd:        rgba(255,255,255,0.08);
    --al-bd-str:    rgba(255,255,255,0.14);
    --al-bd-inv:    rgba(255,255,255,0.22);
    --al-bd-lime:   rgba(200,241,53,0.25);
    --al-bd-amber:  rgba(245,166,35,0.25);
    --al-bd-err:    rgba(255,90,90,0.25);

    --al-tx:     #E8E6E0;
    --al-tx2:    #9A9A9A;
    --al-tx3:    #555555;
    --al-tx-dis: #333336;
    --al-tx-inv: #0D0D0F;

    --al-lime:   #C8F135;
    --al-amber:  #F5A623;
    --al-err:    #FF5A5A;
    --al-info:   #5B8BFF;

    --al-lime-a6:  rgba(200,241,53,0.06);
    --al-lime-a10: rgba(200,241,53,0.10);
    --al-lime-a18: rgba(200,241,53,0.18);
    --al-lime-a30: rgba(200,241,53,0.30);
    --al-amb-a6:   rgba(245,166,35,0.06);
    --al-amb-a10:  rgba(245,166,35,0.10);
    --al-amb-a18:  rgba(245,166,35,0.18);

    --al-font-display: 'Russo One', sans-serif;
    --al-font-sans:    'Syne', sans-serif;
    --al-font-mono:    'JetBrains Mono', monospace;
  }

  @keyframes al-pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes al-blink   { 0%,100%{opacity:1} 50%{opacity:0}   }
  @keyframes al-fadeIn  { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  @keyframes al-slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes al-slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes al-scaleIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
  @keyframes al-ping    { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
  @keyframes al-drawBar { from{width:0} to{width:100%} }
  @keyframes al-glitch  {
    0%,100%{clip-path:inset(0 0 100% 0)}
    10%{clip-path:inset(10% 0 60% 0);transform:translateX(-2px)}
    20%{clip-path:inset(40% 0 20% 0);transform:translateX(2px)}
    30%{clip-path:inset(70% 0 5% 0)}
    40%{clip-path:inset(0 0 0 0)}
  }

  body {
    background-color: var(--al-bg-base);
    background-image: 
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  ::-webkit-scrollbar       { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.10); border-radius:2px; }
  ::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.18); }

  ::selection { background:rgba(200,241,53,0.22); color:#E8E6E0; }
`;

// ════════════════════════════════════════════════════════════════════════
// SECTION 3 — TYPOGRAPHY COMPONENTS
// ════════════════════════════════════════════════════════════════════════

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    size?: keyof typeof tokens.fontSize;
    color?: string;
    weight?: keyof typeof tokens.fontWeight;
    uppercase?: boolean;
}

export const Display = ({ as: Component = "div", size = "lg", color = tokens.color.text.primary, weight = 700, uppercase = true, style, children, ...props }: TypographyProps) => (
    <Component {...props} style={{
        fontFamily: tokens.font.display,
        fontSize: tokens.fontSize[size] || size,
        color,
        fontWeight: weight,
        textTransform: uppercase ? "uppercase" : "none",
        letterSpacing: tokens.letterSpacing.display,
        lineHeight: tokens.lineHeight.tight,
        ...style
    }}>
        {children}
    </Component>
);

export const Label = ({ as: Component = "div", size = "base", color = tokens.color.text.secondary, weight = 600, uppercase = false, style, children, ...props }: TypographyProps) => (
    <Component {...props} style={{
        fontFamily: tokens.font.sans,
        fontSize: tokens.fontSize[size] || size,
        color,
        fontWeight: weight,
        textTransform: uppercase ? "uppercase" : "none",
        letterSpacing: tokens.letterSpacing.normal,
        lineHeight: tokens.lineHeight.snug,
        ...style
    }}>
        {children}
    </Component>
);

export const Mono = ({ as: Component = "div", size = "base", color = tokens.color.terminal.output, weight = 400, style, children, ...props }: TypographyProps) => (
    <Component {...props} style={{
        fontFamily: tokens.font.mono,
        fontSize: tokens.fontSize[size] || size,
        color,
        fontWeight: weight,
        lineHeight: tokens.lineHeight.normal,
        ...style
    }}>
        {children}
    </Component>
);

// ════════════════════════════════════════════════════════════════════════
// SECTION 4 — BASE COMPONENTS
// ════════════════════════════════════════════════════════════════════════

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "lime" | "amber" | "error" | "secondary" | "outline";
}

export const Badge = ({ variant = "default", children, ...props }: BadgeProps) => {
    // Robust variant mapping to prevent undefined crashes
    const variantColors = {
        default: tokens.color.lime,
        lime: tokens.color.lime,
        amber: tokens.color.amber,
        error: tokens.color.semantic.error,
        secondary: { base: tokens.color.text.tertiary, alpha: { 10: "rgba(255,255,255,0.1)" } }
    };
    
    const v = (variantColors[variant] || tokens.color.lime) as any;
    
    return (
        <span {...props} style={{
            display: "inline-flex", alignItems: "center",
            padding: "2px 8px", background: variant === "outline" ? "transparent" : (v.alpha?.[10] || "rgba(200,241,53,0.1)"),
            border: `1px solid ${variant === "outline" ? tokens.color.border.default : (v.base || tokens.color.lime.base)}`,
            borderRadius: "2px", fontFamily: tokens.font.mono, fontSize: "10px", fontWeight: 700,
            color: v.base || tokens.color.lime.base, textTransform: "uppercase", letterSpacing: "0.05em",
            ...props.style
        }}>
            {children}
        </span>
    );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
}

export const Button = ({ variant = "primary", size = "md", style, children, ...props }: ButtonProps) => {
    const isDanger = variant === "danger";
    const isSecondary = variant === "secondary";
    const isGhost = variant === "ghost";
    const isOutline = variant === "outline" || variant === "outline_lime";
    const isLime = variant === "lime" || variant === "outline_lime";

    const bg = isDanger ? tokens.color.semantic.error : isSecondary ? tokens.color.bg.overlay : isGhost || isOutline ? "transparent" : tokens.color.lime.base;
    const tx = isDanger || (!isSecondary && !isGhost && !isOutline) ? tokens.color.text.inverse : isSecondary ? tokens.color.text.primary : tokens.color.lime.base;
    const bd = variant === "outline" ? `1px solid ${tokens.color.border.strong}` : variant === "outline_lime" ? `1px solid ${tokens.color.border.lime}` : isSecondary ? `1px solid ${tokens.color.border.default}` : "none";

    return (
        <button {...props} style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: size === "sm" ? "6px 12px" : size === "lg" ? "14px 28px" : "10px 20px",
            background: bg,
            color: tx,
            border: bd,
            fontFamily: tokens.font.sans,
            fontSize: size === "lg" ? tokens.fontSize.md : tokens.fontSize.sm,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: ".06em",
            cursor: "pointer",
            transition: `all ${tokens.motion.duration.fast} ease`,
            ...style
        }}>
            {children}
        </button>
    );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    elevated?: boolean;
}

export const Card = ({ elevated = false, style, children, ...props }: CardProps) => (
    <div {...props} style={{
        background: elevated ? tokens.color.bg.raised : tokens.color.bg.surface,
        border: `1px solid ${tokens.color.border.default}`,
        boxShadow: elevated ? tokens.shadow.lg : "none",
        ...style
    }}>
        {children}
    </div>
);

export const Input = ({ placeholder, value, onChange, prefix, suffix, disabled, error, mono, style: s, ...props }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ position: "relative", display: "flex", alignItems: "center", ...s }}>
            {prefix && <span style={{ position: "absolute", left: 10, fontFamily: tokens.font.mono, fontSize: "11px", color: tokens.color.text.tertiary, pointerEvents: "none" }}>{prefix}</span>}
            <input
                value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{
                    width: "100%", height: 38,
                    padding: `0 ${suffix ? "32px" : "12px"} 0 ${prefix ? "26px" : "12px"}`,
                    background: tokens.color.bg.input,
                    border: `1px solid ${error ? tokens.color.semantic.error : focused ? tokens.color.border.strong : tokens.color.border.default}`,
                    color: disabled ? tokens.color.text.disabled : tokens.color.text.primary,
                    fontFamily: mono ? tokens.font.mono : tokens.font.sans,
                    fontSize: "12px", outline: "none",
                    transition: `border-color ${tokens.motion.duration.fast}`,
                    caretColor: tokens.color.lime.base,
                }}
                {...props}
            />
            {suffix && <span style={{ position: "absolute", right: 10, fontFamily: tokens.font.mono, fontSize: "11px", color: tokens.color.text.tertiary, pointerEvents: "none" }}>{suffix}</span>}
        </div>
    );
};

export const ProgressBar = ({ value = 0, variant = "default", label, showValue, height = 4, animate = true }) => {
    const c = value > 70 && variant === "health" ? tokens.color.semantic.error : variant === "health" && value > 40 ? tokens.color.amber.base : tokens.color.lime.base;
    return (
        <div>
            {(label || showValue) && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    {label && <Label>{label}</Label>}
                    {showValue && <Mono size="xs" color={tokens.color.text.secondary}>{Math.round(value)}%</Mono>}
                </div>
            )}
            <div style={{ width: "100%", height, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, value))}%`, background: c, transition: animate ? `width ${tokens.motion.duration.slow} ${tokens.motion.easing.easeOut}` : "none" }} />
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// UTILITY COMPONENTS
// ─────────────────────────────────────────────────────────────

export const Divider = ({ label, vertical, style, ...props }) => {
    if (vertical) return <div {...props} style={{ width: 1, height: "100%", background: tokens.color.border.subtle, flexShrink: 0, ...style }} />;
    if (label) return (
        <div {...props} style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0", ...style }}>
            <div style={{ flex: 1, height: 1, background: tokens.color.border.subtle }} />
            <Label size="2xs" color={tokens.color.text.tertiary}>{label}</Label>
            <div style={{ flex: 1, height: 1, background: tokens.color.border.subtle }} />
        </div>
    );
    return <div {...props} style={{ width: "100%", height: 1, background: tokens.color.border.subtle, margin: "14px 0", ...style }} />;
};

export const Kbd = ({ children }) => (
    <kbd style={{ display: "inline-flex", alignItems: "center", padding: "2px 6px", background: tokens.color.bg.raised, border: `1px solid ${tokens.color.border.strong}`, borderBottomWidth: 2, fontFamily: tokens.font.mono, fontSize: "10px", color: tokens.color.text.secondary, borderRadius: 0, userSelect: "none" }}>
        {children}
    </kbd>
);

// ════════════════════════════════════════════════════════════════════════
// SECTION 5 — NEW COMPONENTS (v2 additions)
// ════════════════════════════════════════════════════════════════════════

/**
 * XP RING — Circular progress indicator
 * ─────────────────────────────────────
 * Shows level + XP progress as an SVG arc ring.
 * Use on: Dashboard hero, Profile hero
 *
 * Props:
 *   level      — current level number
 *   xpCurrent  — current XP in this level
 *   xpNext     — XP needed for next level
 *   size       — diameter in px (default 96)
 *   accent     — "lime" | "amber" (default "lime")
 */
export const XPRing = ({ level = 1, xpCurrent = 0, xpNext = 150, size = 96, accent = "lime" }) => {
    const r = (size / 2) - 8;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(1, xpCurrent / xpNext);
    const dash = pct * circ;
    const color = accent === "amber" ? tokens.color.amber.base : tokens.color.lime.base;

    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={4} />
                <circle
                    cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke={color} strokeWidth={4}
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="square"
                    style={{ transition: `stroke-dasharray ${tokens.motion.duration.slow} ${tokens.motion.easing.easeOut}` }}
                />
            </svg>
            <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 0,
            }}>
                <span style={{ fontFamily: tokens.font.display, fontSize: size > 80 ? "22px" : "16px", color: tokens.color.text.primary, lineHeight: 1 }}>{level}</span>
                <Label size="2xs" color={tokens.color.text.tertiary} style={{ marginTop: 2 }}>LVL</Label>
            </div>
        </div>
    );
};

/**
 * ACTIVITY SPARK — 30-day compact activity bar
 * ─────────────────────────────────────────────
 * Replaces the full heatmap on Dashboard.
 * Single row of 30 bars, height = activity intensity.
 * Much more space-efficient and readable at a glance.
 *
 * Props:
 *   data — array of 30 numbers (0-4, activity intensity per day)
 *   streak — current streak count
 */
export const ActivitySpark = ({ data = [], streak = 0 }) => {
    const days = Array.from({ length: 30 }, (_, i) => data[i] || 0);
    const max = Math.max(...days, 1);
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <Label color={tokens.color.text.tertiary}>30-day activity</Label>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: tokens.color.amber.base, fontSize: 12 }}>▲</span>
                    <Mono size="xs" color={tokens.color.amber.base}>{streak} day streak</Mono>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 28 }}>
                {days.map((v, i) => {
                    const h = v === 0 ? 3 : Math.max(6, (v / max) * 28);
                    const opacity = v === 0 ? 0.12 : 0.4 + (v / max) * 0.6;
                    return (
                        <div key={i} title={`Day ${i + 1}: ${v} commands`} style={{
                            flex: 1, height: h, background: tokens.color.lime.base,
                            opacity, transition: "height .3s ease",
                            cursor: "default",
                        }} />
                    );
                })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <Mono size="2xs" color={tokens.color.text.tertiary}>30 days ago</Mono>
                <Mono size="2xs" color={tokens.color.text.tertiary}>today</Mono>
            </div>
        </div>
    );
};

/**
 * SKILL RADAR — SVG spider/radar chart for skill categories
 * ──────────────────────────────────────────────────────────
 * Profile-page identity component. Shows progress across
 * 5 skill domains. Much more identity-forward than a heatmap.
 *
 * Props:
 *   skills — object: { filesystem:0-100, permissions:0-100, networking:0-100, scripting:0-100, processes:0-100 }
 *   size   — chart diameter in px (default 220)
 */
export const SkillRadar = ({ skills = {}, size = 220 }) => {
    const cx = size / 2, cy = size / 2, r = size / 2 - 24;
    const axes = [
        { key: "filesystem", label: "Filesystem", color: tokens.color.skills.filesystem },
        { key: "permissions", label: "Permissions", color: tokens.color.skills.permissions },
        { key: "networking", label: "Networking", color: tokens.color.skills.networking },
        { key: "scripting", label: "Scripting", color: tokens.color.skills.scripting },
        { key: "processes", label: "Processes", color: tokens.color.skills.processes },
    ];
    const n = axes.length;
    const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

    const gridLevels = [0.25, 0.5, 0.75, 1];
    const skillPts = axes.map((a, i) => {
        const val = (skills[a.key] || 0) / 100;
        return { x: cx + Math.cos(angle(i)) * r * val, y: cy + Math.sin(angle(i)) * r * val };
    });
    const areaPath = skillPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg width={size} height={size}>
                {/* Grid rings */}
                {gridLevels.map((lv, gi) => (
                    <polygon key={gi}
                        points={axes.map((_, i) => `${cx + Math.cos(angle(i)) * r * lv},${cy + Math.sin(angle(i)) * r * lv}`).join(" ")}
                        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1}
                    />
                ))}
                {/* Axis lines */}
                {axes.map((_, i) => (
                    <line key={i}
                        x1={cx} y1={cy}
                        x2={cx + Math.cos(angle(i)) * r} y2={cy + Math.sin(angle(i)) * r}
                        stroke="rgba(255,255,255,0.06)" strokeWidth={1}
                    />
                ))}
                {/* Filled skill area */}
                <path d={areaPath} fill="rgba(200,241,53,0.10)" stroke={tokens.color.lime.base} strokeWidth={1.5} />
                {/* Data points */}
                {skillPts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={3} fill={axes[i].color} />
                ))}
                {/* Axis labels */}
                {axes.map((a, i) => {
                    const lx = cx + Math.cos(angle(i)) * (r + 16);
                    const ly = cy + Math.sin(angle(i)) * (r + 16);
                    return (
                        <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                            fill={a.color} fontSize={9} fontFamily={tokens.font.sans} fontWeight={700}
                            letterSpacing=".08em" style={{ textTransform: "uppercase" }}>
                            {a.label}
                        </text>
                    );
                })}
            </svg>
            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", justifyContent: "center", marginTop: 4 }}>
                {axes.map((a) => (
                    <div key={a.key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 6, height: 6, background: a.color }} />
                        <Mono size="2xs" color={tokens.color.text.tertiary}>{a.label} {skills[a.key] || 0}%</Mono>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * ACHIEVEMENT GRID — 3-column grid with earned/progress/locked states
 * ────────────────────────────────────────────────────────────────────
 * Replaces the flat achievement list on Profile.
 *
 * Props:
 *   achievements — array of { id, icon, name, desc, earned, progress(0-100), xp }
 */
export const AchievementGrid = ({ achievements = [] }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 8 }}>
        {achievements.map((a) => (
            <div key={a.id} style={{
                background: a.earned ? tokens.color.amber.alpha[6] : tokens.color.bg.surface,
                border: `1px solid ${a.earned ? tokens.color.border.amber : tokens.color.border.subtle}`,
                padding: "12px",
                opacity: a.earned || a.progress > 0 ? 1 : 0.45,
                position: "relative", overflow: "hidden",
            }}>
                {/* Progress bar behind — subtle */}
                {!a.earned && a.progress > 0 && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: `${a.progress}%`, background: tokens.color.lime.base, transition: "width .5s ease" }} />
                )}
                <div style={{ fontSize: 20, marginBottom: 8, lineHeight: 1 }}>{a.icon}</div>
                <div style={{ fontFamily: tokens.font.sans, fontSize: "11px", fontWeight: 700, color: a.earned ? tokens.color.amber.base : tokens.color.text.primary, marginBottom: 3, lineHeight: 1.3 }}>
                    {a.name}
                </div>
                <div style={{ fontFamily: tokens.font.sans, fontSize: "10px", color: tokens.color.text.tertiary, lineHeight: 1.4, marginBottom: 6 }}>{a.desc}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Mono size="2xs" color={a.earned ? tokens.color.amber.base : tokens.color.text.tertiary}>+{a.xp} XP</Mono>
                    {a.earned && <span style={{ fontSize: 9, color: tokens.color.amber.base, fontFamily: tokens.font.mono, fontWeight: 700 }}>EARNED</span>}
                    {!a.earned && a.progress > 0 && <Mono size="2xs" color={tokens.color.lime.base}>{a.progress}%</Mono>}
                </div>
            </div>
        ))}
    </div>
);

/**
 * ONBOARDING MODAL — Welcome screen overlay
 * ──────────────────────────────────────────
 * Shown on first visit. Full-screen backdrop + centered card.
 * Props:
 *   onSubmit — (username: string) => void
 */
export const OnboardingModal = ({ onSubmit }) => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const valid = username.length >= 2 && /^[a-z0-9_]+$/i.test(username);

    const handleSubmit = () => {
        if (!valid) { setError("2–16 chars, letters/numbers/underscores only"); return; }
        onSubmit?.(username);
    };

    return (
        // BACKDROP — full screen, dark with subtle scanlines texture
        <div style={{
            position: "fixed", inset: 0, zIndex: tokens.z.modal,
            background: "rgba(10,10,12,0.98)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)",
            // Add grid background to modal backdrop
            backgroundImage: `
                linear-gradient(rgba(200,241,53,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200,241,53,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
        }}>
            {/* MODAL CARD */}
            <div style={{
                width: "100%", maxWidth: 460,
                background: tokens.color.bg.surface,
                border: `1px solid ${tokens.color.border.strong}`,
                padding: "40px 36px",
                animation: `al-scaleIn ${tokens.motion.duration.normal} ${tokens.motion.easing.spring}`,
            }}>
                {/* LOGO WORDMARK */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                    <div style={{ width: 28, height: 28, background: tokens.color.lime.base, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: tokens.font.mono, fontSize: "11px", fontWeight: 700, color: tokens.color.text.inverse }}>AL</span>
                    </div>
                    <Label size="xs" color={tokens.color.lime.base}>Ashborn Linux</Label>
                </div>

                {/* HERO TITLE — Russo One, large */}
                <Display size="xl" color={tokens.color.lime.base} style={{ marginBottom: 8 }}>The Terminal</Display>
                <Display size="md" style={{ marginBottom: 16 }}>Welcome, Learner</Display>

                <p style={{ fontFamily: tokens.font.sans, fontSize: "13px", color: tokens.color.text.secondary, lineHeight: 1.6, marginBottom: 28 }}>
                    You're about to begin your journey to Linux mastery. Choose a handle to get started.
                </p>

                {/* USERNAME INPUT */}
                <Label style={{ marginBottom: 6 }}>Choose your handle</Label>
                <Input
                    placeholder="enter_username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value.toLowerCase()); setError(""); }}
                    mono
                    error={!!error}
                    style={{ marginBottom: error ? 6 : 16 }}
                />
                {error && <p style={{ fontFamily: tokens.font.mono, fontSize: "10px", color: tokens.color.semantic.error, marginBottom: 10 }}>{error}</p>}

                {/* SUBMIT */}
                <Button variant="lime" size="lg" onClick={handleSubmit} style={{ width: "100%" }}>
                    Initialize Session →
                </Button>

                <p style={{ fontFamily: tokens.font.mono, fontSize: "9px", color: tokens.color.text.tertiary, textAlign: "center", marginTop: 16, letterSpacing: ".08em" }}>
                    PROGRESS SAVED LOCALLY · NO ACCOUNT REQUIRED
                </p>
            </div>
        </div>
    );
};

/**
 * TOUR STEP OVERLAY — Guided tour modal
 * ──────────────────────────────────────
 * Appears after onboarding. Steps through key UI concepts.
 * Props:
 *   step      — { title, body, prompt } current step object
 *   stepNum   — current step (1-indexed)
 *   totalSteps— total number of steps
 *   onSkip    — () => void
 *   onNext    — (command: string) => void
 */
export const TourOverlay = ({ step, stepNum, totalSteps, onSkip, onNext }) => {
    const [cmd, setCmd] = useState("");

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: tokens.z.modal,
            background: "rgba(10,10,12,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(2px)",
        }}>
            <div style={{
                width: "100%", maxWidth: 440,
                background: tokens.color.bg.surface,
                border: `1px solid ${tokens.color.lime.alpha[30]}`,
                animation: `al-slideUp ${tokens.motion.duration.normal}`,
            }}>
                {/* STEP HEADER */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    borderBottom: `1px solid ${tokens.color.border.subtle}`,
                    background: tokens.color.lime.alpha[6],
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ display: "flex", gap: 3 }}>
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div key={i} style={{ width: i < stepNum ? 16 : 8, height: 3, background: i < stepNum ? tokens.color.lime.base : "rgba(255,255,255,0.15)", transition: "width .3s" }} />
                            ))}
                        </div>
                        <Mono size="xs" color={tokens.color.lime.base}>{stepNum}/{totalSteps}</Mono>
                    </div>
                    <button onClick={onSkip} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: tokens.font.sans, fontSize: "10px", color: tokens.color.text.tertiary, letterSpacing: ".06em", textTransform: "uppercase" }}>
                        Skip Tour
                    </button>
                </div>

                {/* STEP BODY */}
                <div style={{ padding: "24px 20px 20px" }}>
                    <Display size="sm" style={{ marginBottom: 10 }}>{step.title}</Display>
                    <p style={{ fontFamily: tokens.font.sans, fontSize: "13px", color: tokens.color.text.secondary, lineHeight: 1.6, marginBottom: 20 }}>
                        {step.body}
                    </p>

                    {step.prompt && (
                        <>
                            <Label style={{ marginBottom: 6 }}>Interactive Prompt</Label>
                            <Input
                                prefix="$"
                                placeholder={step.prompt}
                                value={cmd}
                                onChange={(e) => setCmd(e.target.value)}
                                mono
                                style={{ marginBottom: 6 }}
                            />
                            <p style={{ fontFamily: tokens.font.mono, fontSize: "9px", color: tokens.color.text.tertiary, marginBottom: 16 }}>
                                Type command and press Enter
                            </p>
                        </>
                    )}

                    <div style={{ display: "flex", gap: 8 }}>
                        <Button variant="lime" size="md" onClick={() => { onNext?.(cmd); setCmd(""); }} style={{ flex: 1 }}>
                            {stepNum < totalSteps ? "Next →" : "Enter Terminal"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * ACHIEVEMENT TOAST — Unified XP + achievement notification
 * ──────────────────────────────────────────────────────────
 * FIXED: Was two separate disconnected components.
 * Now: Single unified toast with XP flash + achievement name.
 * Auto-dismisses after 4s. Can stack.
 *
 * Props:
 *   xp          — XP gained (number)
 *   achievement — { icon, name, desc } (optional, null for XP-only)
 *   onDone      — () => void — callback after dismiss
 */
export const AchievementToast = ({ xp, achievement, onDone }) => {
    useEffect(() => {
        const t = setTimeout(onDone, 4000);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <div style={{
            background: tokens.color.bg.overlay,
            border: `1px solid ${tokens.color.border.amber}`,
            borderLeft: `3px solid ${tokens.color.amber.base}`,
            overflow: "hidden",
            width: 280,
            animation: `al-slideUp ${tokens.motion.duration.normal}`,
        }}>
            {/* XP FLASH ROW */}
            <div style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                borderBottom: achievement ? `1px solid ${tokens.color.border.subtle}` : "none",
                background: tokens.color.amber.alpha[6],
            }}>
                <span style={{ fontSize: 14, color: tokens.color.lime.base }}>⚡</span>
                <span style={{ fontFamily: tokens.font.display, fontSize: "18px", color: tokens.color.lime.base, letterSpacing: "-0.01em" }}>+{xp} XP</span>
                {/* Dismiss */}
                <button onClick={onDone} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: tokens.color.text.tertiary, fontSize: 14, lineHeight: 1 }}>×</button>
            </div>
            {/* ACHIEVEMENT ROW */}
            {achievement && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px" }}>
                    <div style={{ width: 28, height: 28, background: tokens.color.amber.alpha[10], border: `1px solid ${tokens.color.border.amber}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                        {achievement.icon}
                    </div>
                    <div>
                        <div style={{ fontFamily: tokens.font.sans, fontSize: "11px", fontWeight: 700, color: tokens.color.amber.base, letterSpacing: ".04em", marginBottom: 2 }}>
                            {achievement.name}
                        </div>
                        <div style={{ fontFamily: tokens.font.sans, fontSize: "10px", color: tokens.color.text.secondary }}>{achievement.desc}</div>
                    </div>
                </div>
            )}
            {/* Countdown bar */}
            <div style={{ height: 2, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ height: "100%", background: tokens.color.amber.base, animation: "al-drawBar 4s linear forwards", "--target-w": "100%" }} />
            </div>
        </div>
    );
};

/**
 * USER POPOVER — Bottom avatar click target
 * ──────────────────────────────────────────
 * NAVIGATION FIX: Bottom avatar no longer hard-links to /profile.
 * Instead it opens this popover with quick stats + nav options.
 * The person icon in the nav sidebar routes to /profile directly.
 *
 * Props:
 *   user       — { username, level, rank, xpCurrent, xpNext, streakDays }
 *   onProfile  — () => void → goes to /profile
 *   onSettings — () => void → goes to /settings
 *   onLogout   — () => void (optional — clear local data)
 *   onClose    — () => void
 */
export const UserPopover = ({ user, onProfile, onSettings, onLogout, onClose }) => (
    <div style={{
        position: "absolute", bottom: "calc(100% + 8px)", left: "calc(100% + 8px)",
        width: 220,
        background: tokens.color.bg.overlay,
        border: `1px solid ${tokens.color.border.strong}`,
        zIndex: tokens.z.dropdown,
        animation: `al-fadeIn ${tokens.motion.duration.fast}`,
    }}>
        {/* User identity */}
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${tokens.color.border.subtle}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, background: tokens.color.lime.base, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: tokens.font.sans, fontSize: "14px", fontWeight: 800, color: tokens.color.text.inverse, flexShrink: 0 }}>
                    {user?.initial || "?"}
                </div>
                <div>
                    <div style={{ fontFamily: tokens.font.mono, fontSize: "12px", fontWeight: 700, color: tokens.color.text.primary }}>{user?.username}</div>
                    <Badge variant="level">LVL {user?.level}</Badge>
                </div>
            </div>
            <ProgressBar value={user ? (user.xpCurrent / user.xpNext) * 100 : 0} height={3} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <Mono size="2xs" color={tokens.color.text.tertiary}>{user?.rank}</Mono>
                <Mono size="2xs" color={tokens.color.lime.base}>{user?.xpCurrent}/{user?.xpNext} XP</Mono>
            </div>
        </div>
        {/* Quick links */}
        {[
            { label: "View Profile", action: onProfile },
            { label: "System Settings", action: onSettings },
        ].map((item) => (
            <button key={item.label} onClick={() => { item.action?.(); onClose?.(); }} style={{
                width: "100%", display: "block", padding: "10px 14px",
                background: "none", border: "none", borderBottom: `1px solid ${tokens.color.border.subtle}`,
                cursor: "pointer", textAlign: "left",
                fontFamily: tokens.font.sans, fontSize: "11px", fontWeight: 600,
                color: tokens.color.text.secondary, letterSpacing: ".04em",
                transition: `background ${tokens.motion.duration.fast}`,
            }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
                {item.label}
            </button>
        ))}
        {onLogout && (
            <button onClick={() => { onLogout(); onClose?.(); }} style={{
                width: "100%", display: "block", padding: "10px 14px",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                fontFamily: tokens.font.sans, fontSize: "11px", fontWeight: 600,
                color: tokens.color.semantic.error, letterSpacing: ".04em",
            }}>
                Clear Local Data
            </button>
        )}
    </div>
);

/**
 * ARENA GATE — Locked challenge arena state
 * ──────────────────────────────────────────
 * Replaces the empty padlock-center screen.
 * Shows: urgency intel brief + locked challenge previews + real CTA.
 *
 * Props:
 *   userLevel     — current user level
 *   requiredLevel — level needed (default 10)
 *   challenges    — array of { name, difficulty, category } (blurred previews)
 *   onReturn      — () => void — CTA handler
 */
export const ArenaGate = ({ userLevel = 1, requiredLevel = 10, challenges = [], onReturn }) => {
    const pct = Math.min(100, (userLevel / requiredLevel) * 100);
    return (
        <div style={{ padding: "32px 24px" }}>
            {/* INTEL BRIEF */}
            <div style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: `1px solid ${tokens.color.semantic.error}`,
                borderLeft: `3px solid ${tokens.color.semantic.error}`,
                padding: "20px 24px", marginBottom: 24,
                display: "flex", alignItems: "flex-start", gap: 16,
            }}>
                <span style={{ fontSize: 24, flexShrink: 0, color: tokens.color.semantic.error }}>⚠</span>
                <div>
                    <div style={{ fontFamily: tokens.font.display, fontSize: "16px", color: tokens.color.semantic.error, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Access Denied — Clearance Level {requiredLevel} Required
                    </div>
                    <p style={{ fontFamily: tokens.font.sans, fontSize: "12px", color: tokens.color.text.secondary, lineHeight: 1.7, maxWidth: 500 }}>
                        Challenge Arena scenarios involve broken systems under simulated combat conditions. Agents below Level {requiredLevel} (Hacker Rank) are not cleared for entry. 
                        Complete fundamental labs to earn required cryptographic clearance.
                    </p>
                </div>
            </div>

            {/* PROGRESS TO UNLOCK */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <Label color={tokens.color.text.secondary}>Clearance Progress</Label>
                    <Mono size="xs" color={tokens.color.text.secondary}>Level {userLevel} / {requiredLevel}</Mono>
                </div>
                <ProgressBar value={pct} height={6} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <Mono size="2xs" color={tokens.color.text.tertiary}>Current: {userLevel}</Mono>
                    <Mono size="2xs" color={tokens.color.semantic.error}>Required: {requiredLevel}</Mono>
                </div>
            </div>

            {/* BLURRED CHALLENGE PREVIEWS */}
            {challenges.length > 0 && (
                <>
                    <Label style={{ marginBottom: 10 }}>Restricted Operations</Label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 8, marginBottom: 24 }}>
                        {challenges.map((c, i) => (
                            <div key={i} style={{
                                background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.subtle}`,
                                padding: "14px", filter: "blur(3px)", userSelect: "none", pointerEvents: "none",
                                position: "relative", overflow: "hidden",
                            }}>
                                <div style={{ position: "absolute", inset: 0, background: "rgba(13,13,15,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: 18 }}>🔒</span>
                                </div>
                                <div style={{ fontFamily: tokens.font.display, fontSize: "12px", color: tokens.color.text.primary, marginBottom: 4 }}>{c.name}</div>
                                <Badge variant={c.difficulty === "hard" ? "error" : "amber"}>{c.difficulty}</Badge>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* CTA */}
            <Button variant="outline_lime" size="lg" onClick={onReturn} style={{ width: "100%" }}>
                ← Return to Training Labs
            </Button>
        </div>
    );
};

/**
 * STAT CARD — Dashboard metric display
 */
export const StatCard = ({ label, value, unit, accent = "neutral", color, delta, icon, ...props }) => {
    const c = color || (accent === "lime" ? tokens.color.lime.base : accent === "amber" ? tokens.color.amber.base : tokens.color.text.secondary);
    return (
        <div {...props} style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.strong}`, padding: tokens.space[6] }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <Label size="2xs" uppercase>{label}</Label>
                {icon && <span style={{ fontSize: 12, opacity: .5 }}>{icon}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: tokens.font.display, fontSize: "28px", color: c, lineHeight: 1, letterSpacing: "-0.01em" }}>{value}</span>
                {unit && <Mono size="sm" color={tokens.color.text.tertiary}>{unit}</Mono>}
                {delta && <Mono size="xs" color={c} style={{ marginLeft: 4 }}>{delta}</Mono>}
            </div>
        </div>
    );
};

/**
 * SETTINGS SECTION CARD
 * ─────────────────────
 * Wrapper for settings page sections.
 * accent: "default" | "danger" | "lime"
 */
export const SettingsSection = ({ title, subtitle, icon, accent = "default", children }) => {
    const borderColors = { default: tokens.color.border.default, danger: tokens.color.border.error, lime: tokens.color.border.lime };
    const titleColors = { default: tokens.color.text.primary, danger: tokens.color.semantic.error, lime: tokens.color.lime.base };
    return (
        <div style={{
            border: `1px solid ${borderColors[accent]}`,
            background: accent === "danger" ? tokens.color.semantic.errorBg : tokens.color.bg.surface,
            marginBottom: 16,
        }}>
            {/* Section header */}
            <div style={{ padding: "18px 24px", borderBottom: `1px solid ${borderColors[accent]}`, display: "flex", alignItems: "center", gap: 12 }}>
                {icon && <span style={{ fontSize: 16, opacity: .8 }}>{icon}</span>}
                <div>
                    <Display size="sm" color={titleColors[accent]}>{title}</Display>
                    {subtitle && <p style={{ fontFamily: tokens.font.sans, fontSize: "11px", color: tokens.color.text.tertiary, marginTop: 3 }}>{subtitle}</p>}
                </div>
            </div>
            <div style={{ padding: "24px" }}>{children}</div>
        </div>
    );
};

/**
 * SETTINGS TOGGLE ROW
 */
export const ToggleRow = ({ label, description, value, onChange }) => {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${tokens.color.border.subtle}` }}>
            <div>
                <div style={{ fontFamily: tokens.font.sans, fontSize: "12px", fontWeight: 600, color: tokens.color.text.primary, marginBottom: 2 }}>{label}</div>
                {description && <div style={{ fontFamily: tokens.font.sans, fontSize: "10px", color: tokens.color.text.tertiary }}>{description}</div>}
            </div>
            <div
                onClick={() => onChange?.(!value)}
                style={{
                    width: 36, height: 20, borderRadius: "10px", flexShrink: 0,
                    background: value ? tokens.color.lime.base : "rgba(255,255,255,0.1)",
                    position: "relative", cursor: "pointer",
                    transition: `background ${tokens.motion.duration.fast}`,
                }}
            >
                <div style={{
                    width: 14, height: 14, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3, left: value ? 19 : 3,
                    transition: `left ${tokens.motion.duration.fast}`,
                }} />
            </div>
        </div>
    );
};

/**
 * KEYBINDING ROW — Settings page keybinding display
 */
export const KeybindRow = ({ action, keys }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${tokens.color.border.subtle}` }}>
        <span style={{ fontFamily: tokens.font.sans, fontSize: "11px", color: tokens.color.text.secondary }}>{action}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            {keys.map((k, i) => (
                <span key={i}>
                    <Kbd>{k}</Kbd>
                    {i < keys.length - 1 && <span style={{ fontFamily: tokens.font.mono, fontSize: "10px", color: tokens.color.text.tertiary, margin: "0 2px" }}>+</span>}
                </span>
            ))}
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════
// SECTION 6 — NAVIGATION UX FIX DOCUMENTATION
// ════════════════════════════════════════════════════════════════════════
/**
 * NAV ARCHITECTURE — BEFORE vs AFTER
 * ────────────────────────────────────
 * BEFORE (broken):
 *   Sidebar nav item [person icon]  → /profile
 *   Sidebar bottom [avatar button]  → /profile
 *   = Two separate paths to the same destination = confusion
 *
 * AFTER (fixed):
 *   Sidebar nav item [person icon]  → REMOVED or repurposed to Leaderboard (/leaderboard)
 *   Sidebar bottom [avatar button]  → opens UserPopover (inline quick-access)
 *   UserPopover → "View Profile"    → /profile
 *   UserPopover → "System Settings" → /settings
 *   = Single purposeful path per destination
 *
 * IMPLEMENTATION NOTES for agent:
 *   1. Remove the "Profile & Medals" item from NAV_ITEMS array
 *      (or change its path to "/leaderboard" and update icon + label)
 *   2. Bottom avatar onClick → toggle `popoverOpen` state (NOT router.push)
 *   3. Render <UserPopover> inside the sidebar, positioned absolute
 *      above the avatar, when popoverOpen === true
 *   4. Close popover on click-outside (use useClickOutside hook)
 *   5. UserPopover's "View Profile" → router.push("/profile")
 *   6. UserPopover's "System Settings" → router.push("/settings")
 */
export const NAV_ARCHITECTURE_NOTES = "See JSDoc above for full nav fix documentation";

// ════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT — Design System v2 Documentation Page
// ════════════════════════════════════════════════════════════════════════
export default function AshbornDesignSystemV2() {
    const [toasts, setToasts] = useState([]);
    const [showOnboard, setShowOnboard] = useState(false);
    const [showTour, setShowTour] = useState(false);
    const [toggles, setToggles] = useState({ notifications: true, highContrast: false, sounds: true, animations: true });
    const [xp, setXp] = useState(65);

    useEffect(() => {
        const s = document.createElement("style");
        s.textContent = globalStyles;
        document.head.appendChild(s);
        return () => s.remove();
    }, []);

    const mockUser = { username: "HERO@TERMINAL", initial: "H", level: 6, rank: "System Guardian", xpCurrent: 1156, xpNext: 1500, streakDays: 3 };
    const mockSkills = { filesystem: 72, permissions: 45, networking: 30, scripting: 18, processes: 60 };
    const mockActivity = [0, 0, 1, 0, 2, 1, 0, 0, 3, 2, 1, 0, 0, 2, 4, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 0, 2, 3, 4];
    const mockAchievements = [
        { id: 1, icon: "⚡", name: "First Command", desc: "Execute your first command", earned: true, xp: 100, progress: 100 },
        { id: 2, icon: "📁", name: "Navigator", desc: "Use cd to move 10 directories", earned: false, xp: 75, progress: 40 },
        { id: 3, icon: "🔑", name: "Key Holder", desc: "Change file permissions", earned: false, xp: 150, progress: 0 },
        { id: 4, icon: "🔥", name: "On Fire", desc: "3-day activity streak", earned: true, xp: 200, progress: 100 },
        { id: 5, icon: "🌐", name: "Networker", desc: "Connect to a remote host", earned: false, xp: 250, progress: 0 },
        { id: 6, icon: "📜", name: "Scriptor", desc: "Write your first shell script", earned: false, xp: 300, progress: 10 },
    ];

    return (
        <div style={{ background: tokens.color.bg.base, color: tokens.color.text.primary, fontFamily: tokens.font.sans, minHeight: "100vh", padding: "32px 24px", maxWidth: 900 }}>

            {/* SYSTEM HEADER */}
            <div style={{ marginBottom: 40, paddingBottom: 24, borderBottom: `1px solid ${tokens.color.border.default}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 22, height: 22, background: tokens.color.lime.base, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: tokens.font.mono, fontSize: "9px", fontWeight: 700, color: tokens.color.text.inverse }}>AL</span>
                    </div>
                    <Label color={tokens.color.lime.base}>Ashborn Linux</Label>
                </div>
                <Display size="xl" style={{ marginBottom: 6 }}>Design System v2</Display>
                <p style={{ fontFamily: tokens.font.sans, fontSize: "13px", color: tokens.color.text.secondary, lineHeight: 1.6 }}>
                    Full overhaul addressing UX bottlenecks. New typography, new components, nav architecture fix.
                </p>
            </div>

            {/* ── TYPOGRAPHY v2 ── */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 2, height: 14, background: tokens.color.lime.base }} /><Label color={tokens.color.lime.base}>Typography v2</Label></div>
                <div style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.default}`, padding: 20, marginBottom: 8 }}>
                    <Label style={{ marginBottom: 12 }}>Russo One — Display / Headings</Label>
                    {[["2xl", "56px"], ["xl", "42px"], ["lg", "32px"], ["md", "24px"], ["sm", "18px"]].map(([s, px]) => (
                        <div key={s} style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10, borderBottom: `1px solid ${tokens.color.border.subtle}`, paddingBottom: 10 }}>
                            <Mono size="xs" color={tokens.color.text.tertiary} style={{ minWidth: 50 }}>{px}</Mono>
                            <Display size={s}>The Terminal</Display>
                        </div>
                    ))}
                </div>
                <div style={{ background: tokens.color.bg.input, border: `1px solid ${tokens.color.border.default}`, padding: 20 }}>
                    <Label style={{ marginBottom: 12 }}>JetBrains Mono — Code / Data</Label>
                    <div style={{ fontFamily: tokens.font.mono, fontSize: "12px", color: tokens.color.terminal.prompt, lineHeight: 2 }}>
                        <span style={{ color: tokens.color.terminal.prompt }}>[novice] hero@linux-lab:~$ </span>
                        <span style={{ color: tokens.color.terminal.command }}>ps aux</span><br />
                        <span style={{ color: tokens.color.terminal.output }}>hero   156   8.9   rogue_proc</span><br />
                        <span style={{ color: tokens.color.terminal.highlight }}>hero   189   0.0   bash</span>
                    </div>
                </div>
            </div>

            {/* ── XP RING ── */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 2, height: 14, background: tokens.color.lime.base }} /><Label color={tokens.color.lime.base}>XP Ring</Label></div>
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                    <XPRing level={6} xpCurrent={1156} xpNext={1500} size={96} accent="lime" />
                    <XPRing level={6} xpCurrent={1156} xpNext={1500} size={120} accent="amber" />
                    <XPRing level={1} xpCurrent={10} xpNext={150} size={64} accent="lime" />
                </div>
            </div>

            {/* ── ACTIVITY SPARK ── */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 2, height: 14, background: tokens.color.lime.base }} /><Label color={tokens.color.lime.base}>Activity Spark (replaces heatmap)</Label></div>
                <div style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.default}`, padding: "16px 20px", maxWidth: 500 }}>
                    <ActivitySpark data={mockActivity} streak={3} />
                </div>
                <p style={{ fontFamily: tokens.font.sans, fontSize: "11px", color: tokens.color.text.tertiary, marginTop: 8 }}>
                    Space used: ~56px total height (vs ~180px for the old heatmap grid)
                </p>
            </div>

            {/* ── SKILL RADAR ── */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 2, height: 14, background: tokens.color.lime.base }} /><Label color={tokens.color.lime.base}>Skill Radar (Profile page)</Label></div>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.default}`, padding: 20 }}>
                        <SkillRadar skills={mockSkills} size={220} />
                    </div>
                    <div style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.default}`, padding: 16 }}>
                        <SkillRadar skills={{ filesystem: 5, permissions: 0, networking: 0, scripting: 0, processes: 10 }} size={180} />
                        <p style={{ fontFamily: tokens.font.sans, fontSize: "10px", color: tokens.color.text.tertiary, marginTop: 8, textAlign: "center" }}>New user state</p>
                    </div>
                </div>
            </div>

            {/* ── ACHIEVEMENT GRID ── */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 2, height: 14, background: tokens.color.lime.base }} /><Label color={tokens.color.lime.base}>Achievement Grid (replaces flat list)</Label></div>
                <AchievementGrid achievements={mockAchievements} />
            </div>

            {/* ── ACHIEVEMENT TOAST (FIXED) ── */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 2, height: 14, background: tokens.color.lime.base }} /><Label color={tokens.color.lime.base}>Achievement Toast (unified, fixed)</Label></div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                    <Button variant="secondary" size="sm" onClick={() => setToasts(t => [...t, { id: Date.now(), xp: 10, achievement: { icon: "⚡", name: "First Command!", desc: "Execute your first command" } }])}>
                        Fire XP + Achievement
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setToasts(t => [...t, { id: Date.now(), xp: 50, achievement: null }])}>
                        XP Only Toast
                    </Button>
                </div>
            </div>

            {/* ── ARENA GATE ── */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 2, height: 14, background: tokens.color.lime.base }} /><Label color={tokens.color.lime.base}>Arena Gate (locked state redesign)</Label></div>
                <div style={{ border: `1px solid ${tokens.color.border.default}`, maxWidth: 600 }}>
                    <ArenaGate
                        userLevel={1}
                        requiredLevel={10}
                        challenges={[
                            { name: "Broken Bootloader", difficulty: "hard", category: "system" },
                            { name: "Ghost Process", difficulty: "hard", category: "processes" },
                            { name: "Corrupted Filesystem", difficulty: "extreme", category: "filesystem" },
                        ]}
                        onReturn={() => { }}
                    />
                </div>
            </div>

            {/* ── SETTINGS COMPONENTS ── */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 2, height: 14, background: tokens.color.lime.base }} /><Label color={tokens.color.lime.base}>Settings Components (expanded)</Label></div>
                <SettingsSection title="User Identity" icon="👤" subtitle="Your node handle and authentication">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, background: tokens.color.lime.base, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: tokens.font.sans, fontSize: "18px", fontWeight: 800, color: tokens.color.text.inverse, flexShrink: 0 }}>H</div>
                        <div>
                            <Display size="sm">hero</Display>
                            <Label style={{ marginTop: 2 }}>Current node handle</Label>
                        </div>
                        <Button variant="ghost" size="sm" style={{ marginLeft: "auto" }}>Remap Identity</Button>
                    </div>
                </SettingsSection>
                <SettingsSection title="Notifications" icon="🔔">
                    <ToggleRow label="Achievement alerts" description="Show toast when earning achievements" value={toggles.notifications} onChange={(v) => setToggles(t => ({ ...t, notifications: v }))} />
                    <ToggleRow label="Audio feedback" description="Play sounds on commands and XP gain" value={toggles.sounds} onChange={(v) => setToggles(t => ({ ...t, sounds: v }))} />
                    <ToggleRow label="Animations" description="Enable UI transitions and effects" value={toggles.animations} onChange={(v) => setToggles(t => ({ ...t, animations: v }))} />
                </SettingsSection>
                <SettingsSection title="Keybindings" icon="⌨️" subtitle="Default keyboard shortcuts">
                    <KeybindRow action="Open terminal" keys={["Ctrl", "T"]} />
                    <KeybindRow action="Toggle sidebar" keys={["Ctrl", "B"]} />
                    <KeybindRow action="Next lab" keys={["Ctrl", "→"]} />
                    <KeybindRow action="Verify step" keys={["Ctrl", "Enter"]} />
                    <KeybindRow action="Command history up" keys={["↑"]} />
                </SettingsSection>
                <SettingsSection title="Danger Zone" accent="danger" icon="⚠" subtitle="Irreversible actions — proceed with caution">
                    <p style={{ fontFamily: tokens.font.sans, fontSize: "12px", color: tokens.color.text.secondary, lineHeight: 1.6, marginBottom: 16 }}>
                        Purging your workstation will permanently delete all local lab progress, XP, and accumulated data. This action cannot be undone.
                    </p>
                    <Button variant="danger" size="md">Uninstall System Profile</Button>
                </SettingsSection>
            </div>

            {/* ── NAV UX FIX DOC ── */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 2, height: 14, background: tokens.color.lime.base }} /><Label color={tokens.color.lime.base}>Nav Architecture Fix</Label></div>
                <div style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.default}`, padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <Badge variant="error" style={{ marginBottom: 12 }}>BEFORE — broken</Badge>
                            <div style={{ marginTop: 8 }}>
                                {["Nav: Person icon → /profile", "Bottom: Avatar button → /profile", "= Two routes, same dest = confusion"].map((t, i) => (
                                    <div key={i} style={{ fontFamily: tokens.font.mono, fontSize: "10px", color: i < 2 ? tokens.color.semantic.error : tokens.color.text.tertiary, marginBottom: 4 }}>{t}</div>
                                ))}
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <Badge variant="lime" style={{ marginBottom: 12 }}>AFTER — fixed</Badge>
                            <div style={{ marginTop: 8 }}>
                                {["Nav: Person icon → /leaderboard", "Bottom: Avatar → UserPopover (inline)", "Popover: 'View Profile' → /profile", "Popover: 'Settings' → /settings"].map((t, i) => (
                                    <div key={i} style={{ fontFamily: tokens.font.mono, fontSize: "10px", color: tokens.color.lime.base, marginBottom: 4 }}>{t}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {showOnboard && <OnboardingModal onSubmit={(u) => { console.log(u); setShowOnboard(false); }} />}
            {showTour && (
                <TourOverlay
                    step={{ title: "The Command Line", body: "This is your terminal. You type commands here and the system responds. Let's try your first command!", prompt: "pwd" }}
                    stepNum={1} totalSteps={4}
                    onSkip={() => setShowTour(false)}
                    onNext={() => setShowTour(false)}
                />
            )}
            <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", marginBottom: 8 }}><div style={{ width: 2, height: 14, background: tokens.color.lime.base }} /><Label color={tokens.color.lime.base}>Modal Components</Label></div>
                <Button variant="secondary" size="sm" onClick={() => setShowOnboard(true)}>Preview Onboarding Modal</Button>
                <Button variant="secondary" size="sm" onClick={() => setShowTour(true)}>Preview Tour Overlay</Button>
            </div>

            {/* TOAST CONTAINER */}
            <div style={{ position: "fixed", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 8, zIndex: tokens.z.toast }}>
                {toasts.map((t) => (
                    <AchievementToast key={t.id} xp={t.xp} achievement={t.achievement} onDone={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
                ))}
            </div>
        </div>
    );
}