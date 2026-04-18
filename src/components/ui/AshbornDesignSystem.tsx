/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║          ASHBORN LINUX TERMINAL — DESIGN SYSTEM                 ║
 * ║          AshbornDesignSystem.jsx                                 ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  This file is the single source of truth for:                   ║
 * ║   1. Design Tokens  (colors, type, spacing, radius, shadows)    ║
 * ║   2. Typography     (scale, weights, font roles)                ║
 * ║   3. Color Palette  (full swatches + semantic mapping)          ║
 * ║   4. Spacing Scale  (4px base grid)                             ║
 * ║   5. UI Components  (Button, Badge, Input, Card, Tag, Toast,    ║
 * ║                      ProgressBar, Kbd, Tooltip, Avatar,         ║
 * ║                      Divider, StatCard, Alert)                  ║
 * ║   6. Motion Tokens  (duration, easing curves)                   ║
 * ║   7. Interactive Showcase (live demo of all components)         ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  FONTS REQUIRED — add to index.html <head>:                     ║
 * ║  <link href="https://fonts.googleapis.com/css2?family=          ║
 * ║    JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;        ║
 * ║    600;700;800&display=swap" rel="stylesheet" />                ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════════════════════
// SECTION 1 — DESIGN TOKENS
// Import this object anywhere in the codebase for consistent values.
// Never hardcode colors or spacing directly in components.
// ════════════════════════════════════════════════════════════════
export const tokens = {

    // ── COLOR: BACKGROUNDS ──────────────────────────────────────
    // Use in order from deepest to highest elevation
    color: {
        bg: {
            base: "#0D0D0F",   // App root background
            surface: "#111114",   // Sidebar, header, panels (elevation 1)
            raised: "#171719",   // Cards, dropdowns (elevation 2)
            overlay: "#1E1E22",   // Modals, popovers (elevation 3)
            input: "#0F0F12",   // Text inputs, tab bars (recessed)
        },

        // ── COLOR: BORDERS ──────────────────────────────────────
        border: {
            subtle: "rgba(255,255,255,0.05)",  // Dividers, separators
            default: "rgba(255,255,255,0.07)",  // Panel edges, cards
            strong: "rgba(255,255,255,0.12)",  // Focus rings, active borders
            inverse: "rgba(255,255,255,0.20)",  // High-contrast borders
        },

        // ── COLOR: TEXT ─────────────────────────────────────────
        text: {
            primary: "#E8E6E0",   // Main readable text
            secondary: "#9A9A9A",   // Supporting / output text
            tertiary: "#555555",   // Placeholders, prompts, dim labels
            disabled: "#333336",   // Locked / unavailable
            inverse: "#0D0D0F",   // Text on lime/amber backgrounds
        },

        // ── COLOR: ACCENT — LIME (System / Online / Active) ─────
        // Use for: active states, online indicators, system-ok, cursor, progress
        lime: {
            50: "#F4FDD4",
            100: "#E5FA9A",
            200: "#D4F55A",
            base: "#C8F135",   // Primary lime accent
            600: "#A0C420",
            800: "#607514",
            alpha: {
                8: "rgba(200,241,53,0.08)",
                12: "rgba(200,241,53,0.12)",
                20: "rgba(200,241,53,0.20)",
            },
        },

        // ── COLOR: ACCENT — AMBER (XP / Level / Streak / Warnings) ─
        // Use for: level badge, XP system, streak, root processes, warnings
        amber: {
            50: "#FFF4D4",
            100: "#FAD97A",
            200: "#F5BD3A",
            base: "#F5A623",   // Primary amber accent
            600: "#C47E0E",
            800: "#7A4E08",
            alpha: {
                8: "rgba(245,166,35,0.08)",
                12: "rgba(245,166,35,0.12)",
                20: "rgba(245,166,35,0.20)",
            },
        },

        // ── COLOR: SEMANTIC ─────────────────────────────────────
        // These are status colors — do not use decoratively
        semantic: {
            success: "#C8F135",   // Aliased to lime
            warning: "#F5A623",   // Aliased to amber
            error: "#FF5A5A",   // Critical errors, destructive actions
            info: "#5B8BFF",   // Info states, links
        },

        // ── COLOR: TERMINAL SYNTAX ──────────────────────────────
        // Only use inside .al-terminal-body elements
        terminal: {
            comment: "#3D3D45",   // Comments, annotations
            prompt: "#555555",   // User@host prompt
            command: "#8B8BFF",   // Typed commands (soft indigo)
            output: "#9A9A9A",   // Standard stdout
            highlight: "#C8F135",   // Anomalous / important lines
            root: "#F5A623",   // Root-owned processes
            cursor: "#C8F135",   // Blinking input cursor
            string: "#A8E6A3",   // String literals
            error: "#FF5A5A",   // Stderr / errors
        },
    },

    // ── TYPOGRAPHY ──────────────────────────────────────────────
    font: {
        sans: "'Syne', sans-serif",         // UI chrome: labels, headings, nav
        mono: "'JetBrains Mono', monospace", // Terminal: all code/data output
    },

    // Type scale — use these sizes, not arbitrary values
    fontSize: {
        "2xs": "9px",   // Streak number, tiny badges
        xs: "10px",  // Status bar, XP text, sub-labels
        sm: "11px",  // Objective steps, tooltip reqs, tab labels
        base: "12px",  // Terminal body text
        md: "13px",  // Header username, body copy
        lg: "15px",  // Card titles
        xl: "18px",  // Section headings
        "2xl": "22px",  // Display / hero values
        "3xl": "28px",  // Large stat numbers
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
    },

    lineHeight: {
        tight: 1.2,
        snug: 1.4,
        normal: 1.6,
        loose: 1.8,   // Terminal line height
    },

    // ── SPACING (4px base grid) ──────────────────────────────
    // Always use multiples of 4. Never use odd values like 3px or 7px.
    space: {
        0: "0px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
    },

    // ── BORDER RADIUS ────────────────────────────────────────
    // Sharp by default — this is a terminal OS aesthetic.
    // Round only when intentional (pills, avatars).
    radius: {
        none: "0px",    // Default for most UI elements
        sm: "2px",    // Subtle softening (code blocks)
        full: "9999px", // Pills and avatars only
    },

    // ── SIZING (fixed dimensions) ────────────────────────────
    size: {
        sidebar: "64px",   // Activity bar width
        header: "48px",   // Top header height
        statusBar: "22px",   // Bottom status bar height
        tabBar: "36px",   // Terminal tab bar height
        objPanel: "220px",  // Objective panel width
        navItem: "40px",   // Nav item height
        avatar: "32px",   // User avatar size
        avatarLg: "40px",   // Large avatar
        icon: "18px",   // Standard icon size
        iconSm: "12px",   // Small icon (status bar, badges)
        iconLg: "24px",   // Large icon (empty states)
        dot: "5px",    // Status indicator dot
        cursor: "7px",    // Terminal cursor width
        cursorH: "14px",   // Terminal cursor height
        activeLine: "2px",    // Active nav indicator width
        xpTrack: "100px",  // XP progress bar width
        xpHeight: "4px",    // XP progress bar height
    },

    // ── MOTION ───────────────────────────────────────────────
    motion: {
        duration: {
            instant: "80ms",
            fast: "150ms",   // Hover transitions, icon strokes
            normal: "250ms",   // Panel slides, tab switches
            slow: "400ms",   // XP bar fill, level-up
            crawl: "600ms",   // Page transitions
        },
        easing: {
            linear: "linear",
            ease: "ease",
            easeOut: "cubic-bezier(0.0, 0.0, 0.2, 1)",
            easeIn: "cubic-bezier(0.4, 0.0, 1, 1)",
            spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        },
        // Named animation keyframes (inject via globalStyles)
        animations: {
            pulse: "al-pulse 2s ease infinite",   // Status dot
            blink: "al-blink 1s step-end infinite", // Terminal cursor
            fadeIn: "al-fadeIn 0.15s ease",        // Tooltips, toasts
            slideUp: "al-slideUp 0.25s cubic-bezier(0.0,0.0,0.2,1)", // Panels
        },
    },

    // ── Z-INDEX SCALE ────────────────────────────────────────
    z: {
        base: 0,
        raised: 10,
        dropdown: 50,
        tooltip: 100,
        modal: 200,
        toast: 300,
    },
};

// ════════════════════════════════════════════════════════════════
// SECTION 2 — GLOBAL CSS (inject once in your app root)
// ════════════════════════════════════════════════════════════════
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Map tokens to CSS custom properties for use in plain CSS files */
    --al-bg-base:      #0D0D0F;
    --al-bg-surface:   #111114;
    --al-bg-raised:    #171719;
    --al-bg-overlay:   #1E1E22;
    --al-bg-input:     #0F0F12;

    --al-border-subtle:  rgba(255,255,255,0.05);
    --al-border-default: rgba(255,255,255,0.07);
    --al-border-strong:  rgba(255,255,255,0.12);

    --al-text-primary:   #E8E6E0;
    --al-text-secondary: #9A9A9A;
    --al-text-tertiary:  #555555;
    --al-text-disabled:  #333336;

    --al-lime:        #C8F135;
    --al-lime-alpha:  rgba(200,241,53,0.12);
    --al-amber:       #F5A623;
    --al-amber-alpha: rgba(245,166,35,0.12);
    --al-error:       #FF5A5A;
    --al-info:        #5B8BFF;

    --al-font-sans: 'Syne', sans-serif;
    --al-font-mono: 'JetBrains Mono', monospace;
  }

  @keyframes al-pulse  { 0%,100%{opacity:1} 50%{opacity:0.35} }
  @keyframes al-blink  { 0%,100%{opacity:1} 50%{opacity:0}    }
  @keyframes al-fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  @keyframes al-slideUp{ from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes al-spin   { to{transform:rotate(360deg)} }
  @keyframes al-ping   { 0%{transform:scale(1);opacity:1} 75%,100%{transform:scale(1.8);opacity:0} }

  /* Scrollbars */
  ::-webkit-scrollbar         { width:4px; height:4px; }
  ::-webkit-scrollbar-track   { background:transparent; }
  ::-webkit-scrollbar-thumb   { background:rgba(255,255,255,0.1); border-radius:2px; }
  ::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.18); }

  /* Text selection */
  ::selection { background: rgba(200,241,53,0.25); color: #E8E6E0; }
`;

// ════════════════════════════════════════════════════════════════
// SECTION 3 — BASE COMPONENT PRIMITIVES
// ════════════════════════════════════════════════════════════════

// ── BUTTON ──────────────────────────────────────────────────────
/**
 * BUTTON
 * Variants: "primary" | "secondary" | "ghost" | "danger" | "lime"
 * Sizes:    "sm" | "md" | "lg"
 * Props:    variant, size, disabled, loading, icon, onClick, children
 *
 * Variant usage:
 *   primary   — amber fill. Main CTAs (Start Lab, Submit, Confirm)
 *   lime      — lime fill. System actions (Verify, Run, Connect)
 *   secondary — bordered, no fill. Secondary actions
 *   ghost     — no border or fill. Nav-adjacent actions
 *   danger    — red fill. Destructive actions (Delete, Reset)
 */
const buttonStyles = {
    base: {
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: "6px", cursor: "pointer", border: "none", outline: "none",
        fontFamily: tokens.font.sans, fontWeight: tokens.fontWeight.bold,
        letterSpacing: tokens.letterSpacing.wider, textTransform: "uppercase",
        transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.easeOut}`,
        userSelect: "none", position: "relative", overflow: "hidden",
        borderRadius: tokens.radius.none,
    },
    sizes: {
        sm: { padding: "5px 10px", fontSize: tokens.fontSize.xs },
        md: { padding: "8px 14px", fontSize: tokens.fontSize.sm },
        lg: { padding: "10px 20px", fontSize: tokens.fontSize.md },
    },
    variants: {
        primary: { background: tokens.color.amber.base, color: tokens.color.text.inverse },
        lime: { background: tokens.color.lime.base, color: tokens.color.text.inverse },
        secondary: { background: "transparent", color: tokens.color.text.primary, border: `1px solid ${tokens.color.border.strong}` },
        ghost: { background: "transparent", color: tokens.color.text.secondary, border: "none" },
        danger: { background: tokens.color.semantic.error, color: "#fff" },
    },
    hover: {
        primary: { filter: "brightness(1.1)" },
        lime: { filter: "brightness(1.08)" },
        secondary: { background: "rgba(255,255,255,0.05)", borderColor: tokens.color.border.inverse },
        ghost: { color: tokens.color.text.primary, background: "rgba(255,255,255,0.04)" },
        danger: { filter: "brightness(1.1)" },
    },
};

export const Button = ({ variant = "secondary", size = "md", disabled = false, loading = false, icon, onClick, children }) => {
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);

    const style = {
        ...buttonStyles.base,
        ...buttonStyles.sizes[size],
        ...buttonStyles.variants[variant],
        ...(hovered && !disabled ? buttonStyles.hover[variant] : {}),
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transform: pressed && !disabled ? "scale(0.97)" : "scale(1)",
    };

    return (
        <button
            style={style}
            disabled={disabled || loading}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setPressed(false); }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
        >
            {loading && (
                <span style={{ width: 10, height: 10, border: `2px solid currentColor`, borderTopColor: "transparent", borderRadius: "50%", animation: "al-spin 0.7s linear infinite", display: "inline-block" }} />
            )}
            {!loading && icon && <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span>}
            {children}
        </button>
    );
};

// ── BADGE ────────────────────────────────────────────────────────
/**
 * BADGE
 * Variants: "lime" | "amber" | "error" | "info" | "ghost" | "level"
 *
 * Usage:
 *   lime   — online status, active, verified, success states
 *   amber  — level indicators, XP, streak, warning
 *   error  — critical errors, offline, destructive
 *   info   — neutral info, tags, categories
 *   ghost  — subtle labels with no semantic urgency
 *   level  — special variant for the LVL badge (amber + mono font)
 */
const badgeConfig = {
    lime: { bg: tokens.color.lime.alpha[8], border: tokens.color.lime.alpha[12], color: tokens.color.lime.base },
    amber: { bg: tokens.color.amber.alpha[8], border: tokens.color.amber.alpha[12], color: tokens.color.amber.base },
    error: { bg: "rgba(255,90,90,0.08)", border: "rgba(255,90,90,0.15)", color: tokens.color.semantic.error },
    info: { bg: "rgba(91,139,255,0.08)", border: "rgba(91,139,255,0.15)", color: tokens.color.semantic.info },
    ghost: { bg: "rgba(255,255,255,0.04)", border: tokens.color.border.default, color: tokens.color.text.tertiary },
    level: { bg: tokens.color.amber.base, border: "none", color: tokens.color.text.inverse },
};

export const Badge = ({ variant = "ghost", children, dot = false }) => {
    const cfg = badgeConfig[variant];
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "2px 7px",
            background: cfg.bg,
            border: cfg.border !== "none" ? `1px solid ${cfg.border}` : "none",
            color: cfg.color,
            fontFamily: variant === "level" ? tokens.font.mono : tokens.font.sans,
            fontSize: tokens.fontSize.xs,
            fontWeight: tokens.fontWeight.black,
            letterSpacing: tokens.letterSpacing.wider,
            textTransform: "uppercase",
            borderRadius: tokens.radius.none,
        }}>
            {dot && (
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color, animation: "al-pulse 2s infinite", flexShrink: 0 }} />
            )}
            {children}
        </span>
    );
};

// ── INPUT ────────────────────────────────────────────────────────
/**
 * INPUT
 * Variants: "default" | "mono"
 *
 * mono variant — use inside terminal-adjacent contexts (e.g. command inputs)
 * default      — use in forms, settings, search fields
 *
 * Props: placeholder, value, onChange, prefix, suffix, disabled, error
 */
export const Input = ({ placeholder, value, onChange, prefix, suffix, disabled = false, error = false, mono = false }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            {prefix && (
                <span style={{
                    position: "absolute", left: 10,
                    fontFamily: mono ? tokens.font.mono : tokens.font.sans,
                    fontSize: tokens.fontSize.sm, color: tokens.color.text.tertiary,
                    pointerEvents: "none",
                }}>{prefix}</span>
            )}
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: "100%",
                    height: 36,
                    padding: `0 ${suffix ? "32px" : "10px"} 0 ${prefix ? "28px" : "10px"}`,
                    background: tokens.color.bg.input,
                    border: `1px solid ${error ? tokens.color.semantic.error : focused ? tokens.color.border.strong : tokens.color.border.default}`,
                    color: disabled ? tokens.color.text.disabled : tokens.color.text.primary,
                    fontFamily: mono ? tokens.font.mono : tokens.font.sans,
                    fontSize: tokens.fontSize.sm,
                    outline: "none",
                    transition: `border-color ${tokens.motion.duration.fast}`,
                    borderRadius: tokens.radius.none,
                    caretColor: tokens.color.lime.base,
                }}
            />
            {suffix && (
                <span style={{
                    position: "absolute", right: 10,
                    fontFamily: tokens.font.mono, fontSize: tokens.fontSize.sm,
                    color: tokens.color.text.tertiary, pointerEvents: "none",
                }}>{suffix}</span>
            )}
        </div>
    );
};

// ── CARD ─────────────────────────────────────────────────────────
/**
 * CARD
 * Variants: "default" | "active" | "locked" | "objective"
 *
 * default    — standard raised surface for content grouping
 * active     — lime-accented border, subtle lime background wash
 * locked     — greyed out, reduced opacity, lock indicator
 * objective  — amber-accented, used in objective/mission panels
 */
export const Card = ({ variant = "default", children, style: extraStyle }) => {
    const variants = {
        default: { bg: tokens.color.bg.raised, border: tokens.color.border.default, opacity: 1 },
        active: { bg: "rgba(200,241,53,0.04)", border: tokens.color.lime.alpha[20], opacity: 1 },
        locked: { bg: tokens.color.bg.surface, border: tokens.color.border.subtle, opacity: 0.45 },
        objective: { bg: "rgba(245,166,35,0.04)", border: tokens.color.amber.alpha[12], opacity: 1 },
    };
    const v = variants[variant];
    return (
        <div style={{
            background: v.bg,
            border: `1px solid ${v.border}`,
            opacity: v.opacity,
            padding: `${tokens.space[3]} ${tokens.space[4]}`,
            borderRadius: tokens.radius.none,
            ...extraStyle,
        }}>
            {children}
        </div>
    );
};

// ── PROGRESS BAR ─────────────────────────────────────────────────
/**
 * PROGRESS BAR
 * Variants: "xp" | "health" | "default"
 *
 * xp      — lime fill, used for XP/level progress in header
 * health  — amber→lime gradient fill, used for system resource meters
 * default — lime fill, generic progress
 *
 * Props: value (0–100), variant, label, showValue
 */
export const ProgressBar = ({ value = 0, variant = "default", label, showValue = false, height = 4 }) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    const fillColor = variant === "health"
        ? (value > 70 ? tokens.color.semantic.error : value > 40 ? tokens.color.amber.base : tokens.color.lime.base)
        : tokens.color.lime.base;

    return (
        <div>
            {(label || showValue) && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    {label && <span style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.xs, color: tokens.color.text.tertiary, textTransform: "uppercase", letterSpacing: tokens.letterSpacing.widest, fontWeight: tokens.fontWeight.bold }}>{label}</span>}
                    {showValue && <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, color: tokens.color.text.secondary }}>{Math.round(clampedValue)}%</span>}
                </div>
            )}
            <div style={{
                width: "100%", height,
                background: "rgba(255,255,255,0.07)",
                overflow: "hidden",
                borderRadius: tokens.radius.none,
            }}>
                <div style={{
                    height: "100%",
                    width: `${clampedValue}%`,
                    background: fillColor,
                    transition: `width ${tokens.motion.duration.slow} ${tokens.motion.easing.easeOut}`,
                }} />
            </div>
        </div>
    );
};

// ── STAT CARD ────────────────────────────────────────────────────
/**
 * STAT CARD
 * Used in dashboards, profile pages, and lab summary views.
 *
 * Props: label, value, unit, accent ("lime" | "amber" | "neutral"), delta
 * delta — optional string like "+12%" shown in accent color
 */
export const StatCard = ({ label, value, unit, accent = "neutral", delta }) => {
    const accentColor = accent === "lime" ? tokens.color.lime.base : accent === "amber" ? tokens.color.amber.base : tokens.color.text.secondary;
    return (
        <div style={{
            background: tokens.color.bg.surface,
            border: `1px solid ${tokens.color.border.default}`,
            padding: `${tokens.space[3]} ${tokens.space[4]}`,
            display: "flex", flexDirection: "column", gap: 6,
        }}>
            <span style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.xs, color: tokens.color.text.tertiary, textTransform: "uppercase", letterSpacing: tokens.letterSpacing.widest, fontWeight: tokens.fontWeight.bold }}>
                {label}
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize["3xl"], fontWeight: tokens.fontWeight.bold, color: accentColor, lineHeight: 1 }}>
                    {value}
                </span>
                {unit && <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.sm, color: tokens.color.text.tertiary }}>{unit}</span>}
                {delta && <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, color: accentColor, marginLeft: 4 }}>{delta}</span>}
            </div>
        </div>
    );
};

// ── KBD (Keyboard Key) ────────────────────────────────────────────
/**
 * KBD
 * Used to display keyboard shortcuts in tooltips, help text, and docs.
 * Renders a single key or combo. Pass children as the key label.
 *
 * Usage: <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>
 */
export const Kbd = ({ children }) => (
    <kbd style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "2px 6px",
        background: tokens.color.bg.raised,
        border: `1px solid ${tokens.color.border.strong}`,
        borderBottom: `2px solid ${tokens.color.border.strong}`,
        fontFamily: tokens.font.mono,
        fontSize: tokens.fontSize.xs,
        color: tokens.color.text.secondary,
        lineHeight: 1.4,
        borderRadius: tokens.radius.none,
        userSelect: "none",
    }}>
        {children}
    </kbd>
);

// ── TAG ───────────────────────────────────────────────────────────
/**
 * TAG
 * Inline labels for categories, difficulty levels, and filters.
 * Variants: "lime" | "amber" | "error" | "info" | "ghost"
 *
 * Smaller and less prominent than Badge.
 * Tags label content; Badges label status.
 */
export const Tag = ({ variant = "ghost", children, onRemove }) => {
    const cfg = badgeConfig[variant];
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "1px 6px",
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            color: cfg.color,
            fontFamily: tokens.font.mono,
            fontSize: tokens.fontSize.xs,
            borderRadius: tokens.radius.none,
        }}>
            {children}
            {onRemove && (
                <span onClick={onRemove} style={{ cursor: "pointer", opacity: 0.6, fontSize: 10, lineHeight: 1 }}>×</span>
            )}
        </span>
    );
};

// ── ALERT ─────────────────────────────────────────────────────────
/**
 * ALERT
 * Full-width notification panel for system messages.
 * Variants: "success" | "warning" | "error" | "info"
 *
 * Props: variant, title, description, onDismiss
 */
export const Alert = ({ variant = "info", title, description, onDismiss }) => {
    const configs = {
        success: { bg: "rgba(200,241,53,0.05)", border: "rgba(200,241,53,0.15)", color: tokens.color.lime.base, icon: "▲" },
        warning: { bg: "rgba(245,166,35,0.05)", border: "rgba(245,166,35,0.18)", color: tokens.color.amber.base, icon: "!" },
        error: { bg: "rgba(255,90,90,0.05)", border: "rgba(255,90,90,0.18)", color: tokens.color.semantic.error, icon: "×" },
        info: { bg: "rgba(91,139,255,0.05)", border: "rgba(91,139,255,0.18)", color: tokens.color.semantic.info, icon: "i" },
    };
    const cfg = configs[variant];
    return (
        <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: `${tokens.space[3]} ${tokens.space[4]}`,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            animation: "al-fadeIn 0.2s ease",
        }}>
            <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: cfg.color, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
                {cfg.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
                {title && <div style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, fontWeight: tokens.fontWeight.bold, color: tokens.color.text.primary, marginBottom: 2 }}>{title}</div>}
                {description && <div style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, color: tokens.color.text.secondary, lineHeight: 1.5 }}>{description}</div>}
            </div>
            {onDismiss && (
                <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: tokens.color.text.tertiary, fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
            )}
        </div>
    );
};

// ── DIVIDER ───────────────────────────────────────────────────────
/**
 * DIVIDER
 * Horizontal or vertical rule for separating sections.
 * direction: "horizontal" | "vertical"
 * label: optional centered text label
 */
export const Divider = ({ label, direction = "horizontal" }) => {
    if (direction === "vertical") {
        return <div style={{ width: 1, height: "100%", background: tokens.color.border.default, flexShrink: 0 }} />;
    }
    if (label) {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: tokens.color.border.subtle }} />
                <span style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize["2xs"], color: tokens.color.text.tertiary, textTransform: "uppercase", letterSpacing: tokens.letterSpacing.widest, fontWeight: tokens.fontWeight.bold, whiteSpace: "nowrap" }}>{label}</span>
                <div style={{ flex: 1, height: 1, background: tokens.color.border.subtle }} />
            </div>
        );
    }
    return <div style={{ width: "100%", height: 1, background: tokens.color.border.subtle }} />;
};

// ── AVATAR ────────────────────────────────────────────────────────
/**
 * AVATAR
 * Sizes: "sm" (24px) | "md" (32px) | "lg" (40px)
 * Shows user initials. Optionally show online/offline dot.
 *
 * Props: initials, size, online, onClick
 */
export const Avatar = ({ initials = "?", size = "md", online, onClick }) => {
    const sizeMap = { sm: 24, md: 32, lg: 40 };
    const px = sizeMap[size];
    return (
        <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
            <div
                onClick={onClick}
                style={{
                    width: px, height: px,
                    background: tokens.color.lime.base,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: tokens.font.sans,
                    fontSize: size === "sm" ? 9 : size === "md" ? 12 : 14,
                    fontWeight: tokens.fontWeight.black,
                    color: tokens.color.text.inverse,
                    cursor: onClick ? "pointer" : "default",
                    userSelect: "none",
                }}
            >
                {initials}
            </div>
            {online !== undefined && (
                <span style={{
                    position: "absolute", bottom: 1, right: 1,
                    width: 7, height: 7,
                    background: online ? tokens.color.lime.base : tokens.color.text.tertiary,
                    borderRadius: "50%",
                    border: `1.5px solid ${tokens.color.bg.base}`,
                }} />
            )}
        </div>
    );
};

// ── TOAST ─────────────────────────────────────────────────────────
/**
 * TOAST
 * Transient notification. Auto-dismisses after `duration` ms.
 * variants: "success" | "warning" | "error" | "info"
 *
 * Use the useToast() hook to trigger toasts from anywhere.
 */
export const Toast = ({ variant = "success", message, onDone }) => {
    useEffect(() => {
        const t = setTimeout(onDone, 3000);
        return () => clearTimeout(t);
    }, [onDone]);

    const colors = {
        success: tokens.color.lime.base,
        warning: tokens.color.amber.base,
        error: tokens.color.semantic.error,
        info: tokens.color.semantic.info,
    };

    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px",
            background: tokens.color.bg.overlay,
            border: `1px solid ${colors[variant]}`,
            borderLeft: `3px solid ${colors[variant]}`,
            fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm,
            color: tokens.color.text.primary,
            animation: "al-slideUp 0.25s ease",
            minWidth: 240,
        }}>
            <span style={{ color: colors[variant], fontFamily: tokens.font.mono, fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
                {variant === "success" ? "OK" : variant === "warning" ? "!" : variant === "error" ? "ERR" : "i"}
            </span>
            {message}
        </div>
    );
};

// ════════════════════════════════════════════════════════════════
// SECTION 4 — INTERACTIVE DESIGN SYSTEM SHOWCASE
// This is the default export — a living documentation page
// that renders all components with their variants.
// Remove this in production and import individual components.
// ════════════════════════════════════════════════════════════════
const Section = ({ title, children }) => (
    <div style={{ marginBottom: tokens.space[8] }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: tokens.space[4] }}>
            <div style={{ width: 2, height: 14, background: tokens.color.lime.base, flexShrink: 0 }} />
            <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, color: tokens.color.lime.base, fontWeight: tokens.fontWeight.bold, textTransform: "uppercase", letterSpacing: tokens.letterSpacing.widest }}>
                {title}
            </span>
        </div>
        {children}
    </div>
);

const Row = ({ children, gap = 8 }) => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap }}>
        {children}
    </div>
);

const Label = ({ children }) => (
    <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize["2xs"], color: tokens.color.text.tertiary, textTransform: "uppercase", letterSpacing: tokens.letterSpacing.widest, marginBottom: 6 }}>
        {children}
    </div>
);

const ColorSwatch = ({ name, value, textColor = "#E8E6E0" }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 80 }}>
        <div style={{ width: "100%", height: 36, background: value, border: `1px solid rgba(255,255,255,0.08)` }} />
        <div style={{ fontFamily: tokens.font.mono, fontSize: 9, color: tokens.color.text.tertiary, lineHeight: 1.4 }}>
            <div style={{ color: tokens.color.text.secondary, fontWeight: 700 }}>{name}</div>
            <div>{value}</div>
        </div>
    </div>
);

const TypeSample = ({ label, style: s, sample = "The quick terminal" }) => (
    <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: tokens.font.mono, fontSize: 9, color: tokens.color.text.tertiary, marginBottom: 4, textTransform: "uppercase", letterSpacing: tokens.letterSpacing.widest }}>{label}</div>
        <div style={s}>{sample}</div>
    </div>
);

export default function AshbornDesignSystem() {
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const [progress, setProgress] = useState(65);
    const [alerts, setAlerts] = useState(["warning", "error"]);

    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = globalStyles;
        document.head.appendChild(style);
        return () => style.remove();
    }, []);

    const addToast = (variant) => {
        const messages = { success: "Lab verified successfully.", warning: "CPU usage above 80%.", error: "Connection lost to sandbox.", info: "New lab available: Networking II." };
        const id = Date.now();
        setToasts((t) => [...t, { id, variant, message: messages[variant] }]);
    };

    const handleLoadingDemo = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div style={{ background: tokens.color.bg.base, color: tokens.color.text.primary, fontFamily: tokens.font.sans, minHeight: "100vh", padding: `${tokens.space[8]} ${tokens.space[6]}`, maxWidth: 900 }}>

            {/* HEADER */}
            <div style={{ marginBottom: tokens.space[10], borderBottom: `1px solid ${tokens.color.border.default}`, paddingBottom: tokens.space[6] }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 20, height: 20, background: tokens.color.lime.base, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: tokens.font.mono, fontSize: 10, fontWeight: 800, color: "#0D0D0F" }}>AL</span>
                    </div>
                    <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, color: tokens.color.lime.base, letterSpacing: tokens.letterSpacing.widest, textTransform: "uppercase" }}>Ashborn Linux</span>
                </div>
                <h1 style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize["3xl"], fontWeight: tokens.fontWeight.black, color: tokens.color.text.primary, lineHeight: 1.1, marginBottom: 8 }}>Design System</h1>
                <p style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.md, color: tokens.color.text.secondary, lineHeight: 1.6 }}>
                    Single source of truth for colors, typography, spacing, and UI components.
                </p>
            </div>

            {/* ── COLOR PALETTE ── */}
            <Section title="Color Palette">
                <Label>Backgrounds — elevation order</Label>
                <Row gap={8}>
                    {Object.entries(tokens.color.bg).map(([k, v]) => <ColorSwatch key={k} name={k} value={v} />)}
                </Row>
                <div style={{ marginTop: 16 }} />
                <Label>Accent — Lime (system / online / active)</Label>
                <Row gap={8}>
                    {["50", "100", "200", "base", "600", "800"].map((k) => <ColorSwatch key={k} name={k} value={tokens.color.lime[k] || tokens.color.lime.base} />)}
                </Row>
                <div style={{ marginTop: 16 }} />
                <Label>Accent — Amber (XP / level / streak)</Label>
                <Row gap={8}>
                    {["50", "100", "200", "base", "600", "800"].map((k) => <ColorSwatch key={k} name={k} value={tokens.color.amber[k] || tokens.color.amber.base} />)}
                </Row>
                <div style={{ marginTop: 16 }} />
                <Label>Semantic</Label>
                <Row gap={8}>
                    {Object.entries(tokens.color.semantic).map(([k, v]) => <ColorSwatch key={k} name={k} value={v} />)}
                </Row>
                <div style={{ marginTop: 16 }} />
                <Label>Terminal Syntax</Label>
                <div style={{ background: tokens.color.bg.input, padding: 16, border: `1px solid ${tokens.color.border.default}` }}>
                    {Object.entries(tokens.color.terminal).map(([k, v]) => (
                        <span key={k} style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.sm, color: v, marginRight: 16, display: "inline-block", marginBottom: 4 }}>{k}</span>
                    ))}
                </div>
            </Section>

            {/* ── TYPOGRAPHY ── */}
            <Section title="Typography">
                <Label>Sans — Syne (UI chrome)</Label>
                <TypeSample label="3xl / 800 — Display" style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize["3xl"], fontWeight: 800, color: tokens.color.text.primary, lineHeight: 1.1 }} sample="System Guardian" />
                <TypeSample label="xl / 700 — Heading" style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.xl, fontWeight: 700, color: tokens.color.text.primary }} sample="Lab 7: Process Management" />
                <TypeSample label="md / 600 — Body Bold" style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.md, fontWeight: 600, color: tokens.color.text.primary }} sample="Current Objective" />
                <TypeSample label="sm / 400 — Body" style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, fontWeight: 400, color: tokens.color.text.secondary, lineHeight: 1.6 }} sample="Use the kill command to terminate the rogue process on PID 156." />
                <TypeSample label="xs / 700 — Label" style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.xs, fontWeight: 700, color: tokens.color.text.tertiary, textTransform: "uppercase", letterSpacing: tokens.letterSpacing.widest }} sample="Verifier Status" />
                <Divider label="mono" />
                <div style={{ marginTop: 16 }} />
                <Label>Mono — JetBrains Mono (terminal / data)</Label>
                <div style={{ background: tokens.color.bg.input, padding: 16, border: `1px solid ${tokens.color.border.default}` }}>
                    <TypeSample label="base / terminal output" style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.base, color: tokens.color.terminal.output, lineHeight: 1.8 }} sample="hero@linux-lab:~$ ps aux" />
                    <TypeSample label="sm / command" style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.sm, color: tokens.color.terminal.command }} sample="kill -9 156" />
                    <TypeSample label="xs / status bar" style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, color: tokens.color.terminal.highlight }} sample="1156 / 1500 XP" />
                </div>
            </Section>

            {/* ── BUTTONS ── */}
            <Section title="Buttons">
                <Label>Variants</Label>
                <Row gap={8}>
                    <Button variant="primary">Start Lab</Button>
                    <Button variant="lime">Verify</Button>
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="ghost">Skip</Button>
                    <Button variant="danger">Reset VM</Button>
                </Row>
                <div style={{ marginTop: 12 }} />
                <Label>Sizes</Label>
                <Row gap={8}>
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="md">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                </Row>
                <div style={{ marginTop: 12 }} />
                <Label>States</Label>
                <Row gap={8}>
                    <Button variant="primary" disabled>Disabled</Button>
                    <Button variant="lime" loading={loading} onClick={handleLoadingDemo}>{loading ? "Running..." : "Run Command"}</Button>
                    <Button variant="secondary" icon="▲">With Icon</Button>
                </Row>
            </Section>

            {/* ── BADGES ── */}
            <Section title="Badges">
                <Row gap={8}>
                    <Badge variant="lime" dot>Online</Badge>
                    <Badge variant="amber" dot>Streak Active</Badge>
                    <Badge variant="level">LVL 6</Badge>
                    <Badge variant="error">Offline</Badge>
                    <Badge variant="info">Novice</Badge>
                    <Badge variant="ghost">Draft</Badge>
                </Row>
            </Section>

            {/* ── TAGS ── */}
            <Section title="Tags">
                <Row gap={6}>
                    <Tag variant="lime">bash</Tag>
                    <Tag variant="amber">root</Tag>
                    <Tag variant="error">deprecated</Tag>
                    <Tag variant="info">networking</Tag>
                    <Tag variant="ghost">lab-7</Tag>
                    <Tag variant="ghost" onRemove={() => { }}>removable</Tag>
                </Row>
            </Section>

            {/* ── PROGRESS ── */}
            <Section title="Progress Bars">
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
                    <div>
                        <ProgressBar value={progress} label="XP Progress" showValue />
                    </div>
                    <div>
                        <ProgressBar value={82} variant="health" label="CPU Usage" showValue height={6} />
                    </div>
                    <div>
                        <ProgressBar value={34} variant="health" label="Memory" showValue height={6} />
                    </div>
                    <Row gap={8}>
                        <Button variant="secondary" size="sm" onClick={() => setProgress((p) => Math.max(0, p - 10))}>−10%</Button>
                        <Button variant="secondary" size="sm" onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10%</Button>
                    </Row>
                </div>
            </Section>

            {/* ── INPUT ── */}
            <Section title="Input">
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 340 }}>
                    <Input placeholder="Search commands..." value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
                    <Input placeholder="$ enter command" mono prefix="$" />
                    <Input placeholder="Find PID..." suffix="PID" />
                    <Input placeholder="Error state" error />
                    <Input placeholder="Disabled input" disabled />
                </div>
            </Section>

            {/* ── KEYBOARD SHORTCUTS ── */}
            <Section title="Keyboard">
                <Row gap={6}>
                    <Kbd>Ctrl</Kbd><span style={{ color: tokens.color.text.tertiary }}>+</span>
                    <Kbd>C</Kbd>
                    <span style={{ color: tokens.color.text.tertiary, margin: "0 8px" }}>kill process</span>
                    <Kbd>Tab</Kbd>
                    <span style={{ color: tokens.color.text.tertiary, margin: "0 8px" }}>autocomplete</span>
                    <Kbd>↑</Kbd>
                    <span style={{ color: tokens.color.text.tertiary, margin: "0 8px" }}>history</span>
                </Row>
            </Section>

            {/* ── STAT CARDS ── */}
            <Section title="Stat Cards">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
                    <StatCard label="Total XP" value="4,821" accent="lime" delta="+120" />
                    <StatCard label="Current Level" value="6" accent="amber" />
                    <StatCard label="Labs Done" value="18" accent="neutral" unit="/ 40" />
                    <StatCard label="Streak" value="3" accent="amber" unit="days" />
                </div>
            </Section>

            {/* ── CARDS ── */}
            <Section title="Cards">
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
                    <Card variant="default">
                        <Label>Default Card</Label>
                        <p style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, color: tokens.color.text.secondary }}>Standard raised surface for content grouping.</p>
                    </Card>
                    <Card variant="active">
                        <Label>Active / Selected Card</Label>
                        <p style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, color: tokens.color.text.secondary }}>Lime-accented. Use for currently selected labs or active states.</p>
                    </Card>
                    <Card variant="objective">
                        <Label>Objective Card</Label>
                        <p style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, color: tokens.color.text.secondary }}>Amber-accented. Use in mission/objective/task panels.</p>
                    </Card>
                    <Card variant="locked">
                        <Label>Locked Card</Label>
                        <p style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, color: tokens.color.text.secondary }}>Greyed out. Used for content gated behind level/progress requirements.</p>
                    </Card>
                </div>
            </Section>

            {/* ── ALERTS ── */}
            <Section title="Alerts">
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
                    <Alert variant="success" title="Lab Verified" description="All steps completed successfully. +120 XP awarded." />
                    {alerts.includes("warning") && (
                        <Alert variant="warning" title="High CPU Usage" description="Process consuming 89% CPU. Consider terminating." onDismiss={() => setAlerts((a) => a.filter((x) => x !== "warning"))} />
                    )}
                    {alerts.includes("error") && (
                        <Alert variant="error" title="Connection Lost" description="Sandbox connection dropped. Attempting to reconnect..." onDismiss={() => setAlerts((a) => a.filter((x) => x !== "error"))} />
                    )}
                    <Alert variant="info" title="New Lab Available" description="Networking II has been unlocked. Start when ready." />
                    {(!alerts.includes("warning") || !alerts.includes("error")) && (
                        <Button variant="ghost" size="sm" onClick={() => setAlerts(["warning", "error"])}>Restore dismissed alerts</Button>
                    )}
                </div>
            </Section>

            {/* ── AVATARS ── */}
            <Section title="Avatars">
                <Row gap={12}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <Avatar initials="H" size="sm" online={true} />
                        <Label>sm / online</Label>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <Avatar initials="H" size="md" online={true} />
                        <Label>md / online</Label>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <Avatar initials="H" size="lg" online={false} />
                        <Label>lg / offline</Label>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <Avatar initials="H" size="lg" />
                        <Label>lg / no status</Label>
                    </div>
                </Row>
            </Section>

            {/* ── DIVIDERS ── */}
            <Section title="Dividers">
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
                    <Divider />
                    <Divider label="or continue with" />
                    <div style={{ display: "flex", alignItems: "center", height: 40, gap: 12 }}>
                        <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.sm, color: tokens.color.text.secondary }}>left</span>
                        <Divider direction="vertical" />
                        <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.sm, color: tokens.color.text.secondary }}>right</span>
                    </div>
                </div>
            </Section>

            {/* ── TOASTS ── */}
            <Section title="Toasts">
                <Row gap={8}>
                    <Button variant="secondary" size="sm" onClick={() => addToast("success")}>Success Toast</Button>
                    <Button variant="secondary" size="sm" onClick={() => addToast("warning")}>Warning Toast</Button>
                    <Button variant="secondary" size="sm" onClick={() => addToast("error")}>Error Toast</Button>
                    <Button variant="secondary" size="sm" onClick={() => addToast("info")}>Info Toast</Button>
                </Row>
            </Section>

            {/* ── MOTION TOKENS ── */}
            <Section title="Motion Tokens">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 500 }}>
                    {Object.entries(tokens.motion.duration).map(([k, v]) => (
                        <div key={k} style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.default}`, padding: "10px 12px", display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.xs, color: tokens.color.text.secondary, textTransform: "uppercase", letterSpacing: tokens.letterSpacing.wider }}>{k}</span>
                            <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, color: tokens.color.lime.base }}>{v}</span>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── SPACING SCALE ── */}
            <Section title="Spacing Scale (4px grid)">
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 8 }}>
                    {Object.entries(tokens.space).map(([k, v]) => (
                        <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{ width: parseInt(v) > 0 ? v : "4px", height: v === "0px" ? "4px" : v, background: tokens.color.lime.alpha[12], border: `1px solid ${tokens.color.lime.alpha[20]}`, maxWidth: 80 }} />
                            <span style={{ fontFamily: tokens.font.mono, fontSize: 8, color: tokens.color.text.tertiary }}>{v}</span>
                        </div>
                    ))}
                </div>
            </Section>

            {/* TOAST CONTAINER — fixed bottom right */}
            {toasts.length > 0 && (
                <div style={{ position: "fixed", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 8, zIndex: tokens.z.toast }}>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} variant={toast.variant} message={toast.message} onDone={() => setToasts((t) => t.filter((x) => x.id !== toast.id))} />
                    ))}
                </div>
            )}
        </div>
    );
}