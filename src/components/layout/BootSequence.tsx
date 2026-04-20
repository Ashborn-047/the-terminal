// Paste Claude's Loading Screen code here


/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║     THE TERMINAL — LOADING SCREENS                                  ║
 * ║     LoadScreens.jsx                                                 ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  TWO DISTINCT LOADING EXPERIENCES:                                  ║
 * ║                                                                     ║
 * ║  1. ColdBootScreen                                                  ║
 * ║     Triggered: Very first time the app ever opens (no user data)    ║
 * ║     Feel: Raw system initialization — BIOS-style terminal boot,     ║
 * ║     scanlines, cascading system check lines, then silence.          ║
 * ║     Duration: ~3.5s then calls onComplete()                        ║
 * ║                                                                     ║
 * ║  2. WarmBootScreen                                                  ║
 * ║     Triggered: Every subsequent open when user profile exists       ║
 * ║     Feel: System recognizing you — personal greeting, XP ring       ║
 * ║     filling, rank name resolving, then snap into dashboard.         ║
 * ║     Duration: ~2.2s then calls onComplete()                        ║
 * ║                                                                     ║
 * ║  3. useBootSequence — hook                                          ║
 * ║     Determines which screen to show based on localStorage.          ║
 * ║     Manages the full boot → app transition.                         ║
 * ║                                                                     ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  INTEGRATION (drop into your app root):                             ║
 * ║                                                                     ║
 * ║  import { useBootSequence, ColdBootScreen, WarmBootScreen }         ║
 * ║    from './LoadScreens';                                      ║
 * ║                                                                     ║
 * ║  function App() {                                                   ║
 * ║    const { bootState, bootType, user, onBootComplete }              ║
 * ║      = useBootSequence();                                            ║
 * ║                                                                     ║
 * ║    if (bootState === 'booting') {                                   ║
 * ║      return bootType === 'cold'                                      ║
 * ║        ? <ColdBootScreen onComplete={onBootComplete} />             ║
 * ║        : <WarmBootScreen user={user} onComplete={onBootComplete} /> ║
 * ║    }                                                                ║
 * ║    return <MainApp />;   // your actual app                         ║
 * ║  }                                                                  ║
 * ║                                                                     ║
 * ║  FONTS REQUIRED — add to index.html <head>:                         ║
 * ║  <link href="https://fonts.googleapis.com/css2?family=              ║
 * ║    Russo+One&family=JetBrains+Mono:wght@400;500;700&family=         ║
 * ║    Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

/** localStorage key — if this exists, user has booted before */
const BOOT_KEY = "al_has_booted";
/** localStorage key — serialized user object */
const USER_KEY = "al_user";

const T = {
    bg: "#0D0D0F",
    surf: "#111114",
    lime: "#C8F135",
    amber: "#F5A623",
    err: "#FF5A5A",
    tx: "#E8E6E0",
    tx2: "#9A9A9A",
    tx3: "#3D3D45",
    txInv: "#0D0D0F",
    bd: "rgba(255,255,255,0.08)",
    display: "'Russo One', sans-serif",
    mono: "'JetBrains Mono', monospace",
    sans: "'Syne', sans-serif",
};

// ─────────────────────────────────────────────────────────────
// COLD BOOT — system check lines
// These stream in one by one during the boot sequence.
// Customize to match your real system checks.
// ─────────────────────────────────────────────────────────────
const COLD_BOOT_LINES = [
    { text: "THE TERMINAL v2.0", delay: 0, color: T.lime, bold: true },
    { text: "Initializing kernel subsystem...", delay: 280, color: T.tx3 },
    { text: "Loading memory modules............OK", delay: 520, color: T.tx2 },
    { text: "Mounting virtual filesystem.......OK", delay: 740, color: T.tx2 },
    { text: "Starting sandbox daemon............OK", delay: 960, color: T.tx2 },
    { text: "Verifying lab environment.........OK", delay: 1180, color: T.tx2 },
    { text: "Connecting to cloud sandbox........OK", delay: 1400, color: T.tx2 },
    { text: "Loading command registry...........OK", delay: 1620, color: T.tx2 },
    { text: "Checking local persistence......EMPTY", delay: 1840, color: T.amber },
    { text: "No user profile detected.", delay: 2040, color: T.amber },
    { text: "FIRST BOOT DETECTED.", delay: 2280, color: T.err, bold: true },
    { text: "Launching registration sequence...", delay: 2520, color: T.tx3 },
    { text: "▌", delay: 2760, color: T.lime, cursor: true },
];

// ─────────────────────────────────────────────────────────────
// WARM BOOT — recognition lines (user-specific)
// Generated dynamically using the stored user object.
// ─────────────────────────────────────────────────────────────
const buildWarmLines = (user) => [
    { text: "THE TERMINAL v2.0", delay: 0, color: T.lime, bold: true },
    { text: "Mounting session...", delay: 160, color: T.tx3 },
    { text: `Reading agent profile........FOUND`, delay: 300, color: T.tx2 },
    { text: `Authenticating handle: ${user?.username || "unknown"}`, delay: 440, color: T.lime },
    { text: `Level: ${user?.level || 1}  Rank: ${user?.rank || "Terminal Novice"}`, delay: 580, color: T.tx2 },
    { text: `XP: ${user?.xpCurrent || 0} / ${user?.xpNext || 150}`, delay: 700, color: T.amber },
    { text: `Streak: ${user?.streakDays || 0} day(s)`, delay: 820, color: T.amber },
    { text: "Restoring terminal environment......OK", delay: 960, color: T.tx2 },
    { text: "Handshake complete.", delay: 1100, color: T.lime, bold: true },
];

// ─────────────────────────────────────────────────────────────
// HOOK: useBootSequence
// ─────────────────────────────────────────────────────────────
/**
 * useBootSequence
 * ───────────────
 * Determines boot type from localStorage, manages boot state.
 *
 * Returns:
 *   bootState   — "booting" | "done"
 *   bootType    — "cold" | "warm"
 *   user        — stored user object (null on cold boot)
 *   onBootComplete — call this when the animation finishes
 *
 * Usage:
 *   const { bootState, bootType, user, onBootComplete } = useBootSequence();
 */

export interface BootSequenceResult {
    bootState: "booting" | "done";
    bootType: "cold" | "warm";
    user: any;
    onBootComplete: () => void;
}

export function useBootSequence(): BootSequenceResult {
    const [bootState, setBootState] = useState<"booting" | "done">("booting");

    const hasBoot = typeof localStorage !== "undefined" && !!localStorage.getItem("al_has_booted");
    
    // Read directly from Zustand's persisted state in localStorage
    const storedUser = (() => {
        try { 
            if (!hasBoot) return null;
            const uiRaw = localStorage.getItem("the-terminal-ui");
            if (uiRaw) {
                const parsed = JSON.parse(uiRaw);
                const s = parsed.state || {};
                
                // Only return a user if they actually completed onboarding (username != Guest)
                // Guest is the default initial state in uiStore
                if (s.username && s.username !== 'Guest' && s.onboardingStep > 0) {
                    return {
                        username: s.username,
                        level: s.lastLeveledUpTo || 1,
                        rank: s.lastLeveledUpTo > 5 ? "System Guardian" : "Terminal Novice",
                        xpCurrent: 0, // Mocked for now until XP store is robust
                        xpNext: s.lastLeveledUpTo ? s.lastLeveledUpTo * 150 : 150,
                        streakDays: 1,
                    };
                }
            }
            return null; 
        } catch { return null; }
    })();

    const bootType = hasBoot && storedUser ? "warm" : "cold";

    const onBootComplete = useCallback(() => {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("al_has_booted", "1");
        }
        setBootState("done");
    }, []);

    // Auto-bypass boot screens during Playwright E2E tests
    useEffect(() => {
        if (typeof window !== "undefined" && window.navigator && window.navigator.webdriver) {
            onBootComplete();
        }
    }, [onBootComplete]);

    return { 
        bootState, 
        bootType, 
        user: storedUser, 
        onBootComplete 
    };
}

// ─────────────────────────────────────────────────────────────
// SHARED: SCANLINE OVERLAY
// Subtle CRT scanline texture over the entire screen.
// ─────────────────────────────────────────────────────────────
function ScanlineOverlay({ opacity = 0.03 }) {
    return (
        <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `repeating-linear-gradient(
        0deg,
        rgba(0,0,0,${opacity}) 0px,
        rgba(0,0,0,${opacity}) 1px,
        transparent 1px,
        transparent 3px
      )`,
            pointerEvents: "none",
            zIndex: 10,
        }} />
    );
}

// ─────────────────────────────────────────────────────────────
// SHARED: GRID BACKGROUND
// ─────────────────────────────────────────────────────────────
function GridBg() {
    return (
        <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `
        linear-gradient(rgba(200,241,53,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(200,241,53,0.025) 1px, transparent 1px)
      `,
            backgroundSize: "48px 48px",
            pointerEvents: "none",
        }} />
    );
}

// ─────────────────────────────────────────────────────────────
// SHARED: CORNER BRACKETS
// Terminal-style corner brackets that frame the screen.
// ─────────────────────────────────────────────────────────────
function CornerBrackets({ color = T.lime, size = 20, thickness = 2, padding = 16, animated = false }) {
    const corners = [
        { top: padding, left: padding, borderTop: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}` },
        { top: padding, right: padding, borderTop: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}` },
        { bottom: padding, left: padding, borderBottom: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}` },
        { bottom: padding, right: padding, borderBottom: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}` },
    ];
    return (
        <>
            {corners.map((style, i) => (
                <div key={i} style={{
                    position: "absolute",
                    width: size, height: size,
                    ...style,
                    opacity: animated ? 0 : 1,
                    animation: animated ? `al-cornerIn .4s ease forwards ${i * 80 + 200}ms` : "none",
                }} />
            ))}
        </>
    );
}

// ─────────────────────────────────────────────────────────────
// SHARED: TERMINAL LINE STREAM
// Renders boot lines one by one with staggered timing.
// ─────────────────────────────────────────────────────────────
function TerminalStream({ lines, style: sx }) {
    const [visible, setVisible] = useState([]);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        lines.forEach((line) => {
            const t = setTimeout(() => {
                if (mounted.current) setVisible(v => [...v, line]);
            }, line.delay);
            return () => clearTimeout(t);
        });
        return () => { mounted.current = false; };
    }, [lines]);

    return (
        <div style={{ fontFamily: T.mono, fontSize: "13px", lineHeight: 1.9, ...sx }}>
            {visible.map((line, i) => (
                <div
                    key={i}
                    style={{
                        color: line.color || T.tx2,
                        fontWeight: line.bold ? 700 : 400,
                        animation: "al-termLine .12s ease",
                    }}
                >
                    {line.cursor
                        ? <span style={{ display: "inline-block", width: 10, height: "1em", background: T.lime, verticalAlign: "middle", animation: "al-blink 1s step-end infinite" }} />
                        : line.text
                    }
                </div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// SHARED: XP RING (for warm boot)
// ─────────────────────────────────────────────────────────────
function XPRingAnim({ level = 1, xpCurrent = 0, xpNext = 150, size = 120, delay = 800 }) {
    const [filled, setFilled] = useState(false);
    const r = size / 2 - 10;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(1, xpCurrent / xpNext);

    useEffect(() => {
        const t = setTimeout(() => setFilled(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div style={{ position: "relative", width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                {/* Track */}
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
                {/* Fill — animates in */}
                <circle
                    cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke={T.lime} strokeWidth={5} strokeLinecap="square"
                    strokeDasharray={`${filled ? pct * circ : 0} ${circ}`}
                    style={{ transition: filled ? "stroke-dasharray 1.1s cubic-bezier(0.0, 0.0, 0.2, 1)" : "none" }}
                />
                {/* Outer glow ring */}
                <circle
                    cx={size / 2} cy={size / 2} r={r + 6} fill="none"
                    stroke="rgba(200,241,53,0.06)" strokeWidth={12}
                    strokeDasharray={`${filled ? pct * circ * 1.06 : 0} ${circ * 1.06}`}
                    style={{ transition: filled ? "stroke-dasharray 1.1s cubic-bezier(0.0, 0.0, 0.2, 1) 100ms" : "none" }}
                />
            </svg>
            {/* Center content */}
            <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 1,
            }}>
                <span style={{ fontFamily: T.display, fontSize: "28px", color: T.tx, lineHeight: 1, letterSpacing: "-0.01em" }}>
                    {level}
                </span>
                <span style={{ fontFamily: T.sans, fontSize: "9px", fontWeight: 700, letterSpacing: ".12em", color: T.tx3, textTransform: "uppercase" }}>
                    Level
                </span>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// COLD BOOT SCREEN
// ─────────────────────────────────────────────────────────────
/**
 * ColdBootScreen
 * ──────────────
 * First-ever open. System has no user profile.
 * Feel: raw BIOS terminal boot. Scanlines. Text cascade. Silence.
 *
 * Props:
 *   onComplete — () => void — called when animation ends
 *   duration   — total ms before calling onComplete (default 3400)
 */
export function ColdBootScreen({ onComplete, duration = 3400 }) {
    const [phase, setPhase] = useState("black"); // "black" → "boot" → "fadeout"

    useEffect(() => {
        // Playwright auto-bypass
        if (typeof navigator !== "undefined" && navigator.userAgent.includes('Playwright')) {
            onComplete?.();
            return;
        }

        // Brief black hold — makes the transition from nothing feel intentional
        const t1 = setTimeout(() => setPhase("boot"), 200);
        const t2 = setTimeout(() => setPhase("fadeout"), duration - 400);
        const t3 = setTimeout(() => onComplete?.(), duration);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [duration, onComplete]);

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: T.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
            opacity: phase === "fadeout" ? 0 : 1,
            transition: phase === "fadeout" ? "opacity .4s ease" : "none",
        }}>
            <GridBg />
            <ScanlineOverlay opacity={0.04} />

            {phase !== "black" && (
                <>
                    {/* Corner brackets animate in */}
                    <CornerBrackets color={T.lime} size={28} thickness={1} padding={20} animated />

                    {/* CENTER TERMINAL BLOCK */}
                    <div style={{
                        position: "relative", zIndex: 5,
                        width: "100%", maxWidth: 560,
                        padding: "0 32px",
                    }}>
                        {/* Logo stamp — appears first */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 12,
                            marginBottom: 28,
                            animation: "al-fadeIn .3s ease",
                        }}>
                            <div style={{
                                width: 36, height: 36,
                                background: T.lime,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <span style={{ fontFamily: T.mono, fontSize: "13px", fontWeight: 700, color: T.txInv }}>AL</span>
                            </div>
                            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, rgba(200,241,53,0.4), transparent)` }} />
                        </div>

                        {/* Streaming terminal lines */}
                        <TerminalStream lines={COLD_BOOT_LINES} />

                        {/* Bottom progress bar — fills over total duration */}
                        <div style={{
                            marginTop: 36,
                            height: 1,
                            background: "rgba(255,255,255,0.06)",
                            overflow: "hidden",
                            animation: "al-fadeIn .5s ease .4s both",
                        }}>
                            <div style={{
                                height: "100%",
                                background: T.lime,
                                animation: `al-coldProgress ${duration - 600}ms linear .4s both`,
                                transformOrigin: "left",
                            }} />
                        </div>
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            marginTop: 6,
                            animation: "al-fadeIn .5s ease .5s both",
                        }}>
                            <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.tx3, letterSpacing: ".08em" }}>SYSTEM INIT</span>
                            <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.tx3, letterSpacing: ".08em" }}>THE TERMINAL v2.0</span>
                        </div>
                    </div>
                </>
            )}

            {/* Vignette — darkens edges for atmosphere */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
                zIndex: 6,
            }} />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// WARM BOOT SCREEN
// ─────────────────────────────────────────────────────────────
/**
 * WarmBootScreen
 * ──────────────
 * Every return visit. System recognizes the user.
 * Feel: fast, personal, confident. System greets you by name.
 * XP ring fills on entry. Rank resolves. Snap to dashboard.
 *
 * Props:
 *   user       — stored user object { username, level, rank, xpCurrent, xpNext, streakDays }
 *   onComplete — () => void — called when animation ends
 *   duration   — total ms before calling onComplete (default 2300)
 */
export function WarmBootScreen({ user, onComplete, duration = 2300 }) {
    const [phase, setPhase] = useState("entry"); // "entry" → "resolve" → "fadeout"
    const [showLines, setShowLines] = useState(false);
    const [showIdent, setShowIdent] = useState(false);
    const [rankVisible, setRankVisible] = useState(false);
    const [rankText, setRankText] = useState("RESOLVING......");
    const warmLines = buildWarmLines(user);

    useEffect(() => {
        // Playwright auto-bypass
        if (typeof navigator !== "undefined" && navigator.userAgent.includes('Playwright')) {
            onComplete?.();
            return;
        }

        const timers = [
            setTimeout(() => setShowLines(true), 180),
            setTimeout(() => setShowIdent(true), 300),
            setTimeout(() => setRankVisible(true), 900),
            // Rank name resolves from scrambled → real
            ...Array.from({ length: 6 }, (_, i) =>
                setTimeout(() => {
                    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
                    const target = (user?.rank || "SYSTEM GUARDIAN").toUpperCase();
                    const step = i / 5;
                    const resolved = target.split("").map((c, ci) =>
                        ci / target.length < step ? c : chars[Math.floor(Math.random() * chars.length)]
                    ).join("");
                    setRankText(i === 5 ? target : resolved);
                }, 900 + i * 100)
            ),
            setTimeout(() => setPhase("fadeout"), duration - 350),
            setTimeout(() => onComplete?.(), duration),
        ];
        return () => timers.forEach(clearTimeout);
    }, [duration, onComplete, user]);

    const u = user || { username: "AGENT", level: 1, rank: "Terminal Novice", xpCurrent: 0, xpNext: 150, streakDays: 0 };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: T.bg,
            display: "flex",
            overflow: "hidden",
            opacity: phase === "fadeout" ? 0 : 1,
            transition: phase === "fadeout" ? "opacity .35s ease" : "none",
        }}>
            <GridBg />
            <ScanlineOverlay opacity={0.03} />

            {/* LEFT PANEL — terminal stream (40% width) */}
            <div style={{
                width: "40%",
                borderRight: `1px solid ${T.bd}`,
                padding: "40px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative", zIndex: 5,
            }}>
                {/* Logo */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 10, marginBottom: 32,
                    animation: "al-fadeIn .3s ease",
                }}>
                    <div style={{ width: 28, height: 28, background: T.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: T.mono, fontSize: "10px", fontWeight: 700, color: T.txInv }}>AL</span>
                    </div>
                    <span style={{ fontFamily: T.sans, fontSize: "10px", fontWeight: 700, letterSpacing: ".1em", color: T.lime, textTransform: "uppercase" }}>
                        Ashborn Linux
                    </span>
                </div>

                {showLines && <TerminalStream lines={warmLines} />}
            </div>

            {/* RIGHT PANEL — identity card (60% width) */}
            <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative", zIndex: 5,
                padding: 40,
            }}>
                {showIdent && (
                    <div style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center",
                        gap: 20,
                        animation: "al-scaleIn .4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}>

                        {/* XP RING — fills after 800ms */}
                        <XPRingAnim
                            level={u.level}
                            xpCurrent={u.xpCurrent}
                            xpNext={u.xpNext}
                            size={140}
                            delay={700}
                        />

                        {/* USERNAME */}
                        <div style={{
                            fontFamily: T.display,
                            fontSize: "26px",
                            color: T.tx,
                            letterSpacing: "-0.01em",
                            lineHeight: 1,
                            textAlign: "center",
                            animation: "al-fadeIn .4s ease .15s both",
                        }}>
                            {u.username}
                        </div>

                        {/* RANK — resolves character by character */}
                        {rankVisible && (
                            <div style={{
                                fontFamily: T.mono,
                                fontSize: "11px",
                                color: T.lime,
                                letterSpacing: ".16em",
                                textTransform: "uppercase",
                                animation: "al-fadeIn .2s ease",
                            }}>
                                {rankText}
                            </div>
                        )}

                        {/* XP + Streak stats */}
                        <div style={{
                            display: "flex", gap: 24, marginTop: 4,
                            animation: "al-fadeIn .4s ease .4s both",
                        }}>
                            {[
                                { label: "XP", value: `${u.xpCurrent}/${u.xpNext}`, color: T.lime },
                                { label: "STREAK", value: `${u.streakDays}D`, color: T.amber },
                                { label: "LEVEL", value: u.level, color: T.tx2 },
                            ].map((s) => (
                                <div key={s.label} style={{ textAlign: "center" }}>
                                    <div style={{ fontFamily: T.mono, fontSize: "16px", color: s.color, fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                                    <div style={{ fontFamily: T.sans, fontSize: "9px", color: T.tx3, fontWeight: 700, letterSpacing: ".1em", marginTop: 3, textTransform: "uppercase" }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* HANDSHAKE STATUS */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "6px 14px",
                            border: `1px solid rgba(200,241,53,0.2)`,
                            background: "rgba(200,241,53,0.05)",
                            animation: "al-fadeIn .4s ease .7s both",
                        }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.lime, animation: "al-pulse 1.5s infinite" }} />
                            <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.lime, letterSpacing: ".1em", textTransform: "uppercase" }}>
                                Session Restored
                            </span>
                        </div>

                        {/* Corner brackets just for the identity card */}
                        <CornerBrackets color="rgba(200,241,53,0.2)" size={16} thickness={1} padding={-20} animated />
                    </div>
                )}
            </div>

            {/* Vignette */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
                zIndex: 6,
            }} />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// GLOBAL STYLES for boot screens
// Inject this once in your app (alongside the main globalStyles)
// ─────────────────────────────────────────────────────────────
export const bootStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  @keyframes al-fadeIn    { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  @keyframes al-scaleIn   { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
  @keyframes al-blink     { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes al-pulse     { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes al-termLine  { from{opacity:0;transform:translateX(-4px)} to{opacity:1;transform:translateX(0)} }

  /* Cold boot progress bar — expands from 0 to 100% */
  @keyframes al-coldProgress {
    from { width: 0%; }
    to   { width: 100%; }
  }

  /* Corner bracket reveal */
  @keyframes al-cornerIn {
    from { opacity:0; transform: scale(.85); }
    to   { opacity:1; transform: scale(1);   }
  }
`;

// ─────────────────────────────────────────────────────────────
// DEMO — standalone preview of both boot screens
// Remove this export in production; use the individual components.
// ─────────────────────────────────────────────────────────────
export default function BootScreensDemo() {
    const [mode, setMode] = useState(null); // null | "cold" | "warm"
    const [completed, setCompleted] = useState(false);

    const mockUser = {
        username: "HERO@TERMINAL",
        initial: "H",
        level: 6,
        rank: "System Guardian",
        xpCurrent: 1156,
        xpNext: 1500,
        streakDays: 3,
    };

    useEffect(() => {
        // Inject styles
        const s = document.createElement("style");
        s.textContent = bootStyles;
        document.head.appendChild(s);
        return () => s.remove();
    }, []);

    const done = () => { setCompleted(true); setTimeout(() => { setMode(null); setCompleted(false); }, 600); };

    if (mode === "cold") return <ColdBootScreen onComplete={done} />;
    if (mode === "warm") return <WarmBootScreen user={mockUser} onComplete={done} />;

    return (
        <div style={{ background: T.bg, color: T.tx, fontFamily: T.sans, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, padding: 40 }}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: T.display, fontSize: "32px", color: T.lime, letterSpacing: "-0.01em", display: "block", marginBottom: 8 }}>
                    Boot Screens
                </span>
                <p style={{ fontFamily: T.sans, fontSize: "13px", color: T.tx2, lineHeight: 1.6, maxWidth: 400 }}>
                    Two distinct loading experiences for first-time vs returning users.
                    Each auto-completes and calls <code style={{ fontFamily: T.mono, color: T.lime }}>onComplete()</code>.
                </p>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>

                {/* COLD BOOT */}
                <div style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", width: 260, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                        <div style={{ width: 8, height: 8, background: T.err }} />
                        <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.err, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>Cold Boot</span>
                    </div>
                    <p style={{ fontFamily: T.sans, fontSize: "12px", color: T.tx2, lineHeight: 1.6 }}>
                        Triggered on first-ever open. No user profile exists. System initializing from nothing.
                    </p>
                    <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.tx3, lineHeight: 1.7 }}>
                        Duration: ~3.5s<br />
                        Feel: BIOS boot cascade<br />
                        Ends: Onboarding screen
                    </div>
                    <button
                        onClick={() => setMode("cold")}
                        style={{ marginTop: 4, background: "transparent", border: `1px solid ${T.bdErr || "rgba(255,90,90,0.3)"}`, color: T.err, fontFamily: T.sans, fontSize: "11px", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer" }}
                    >
                        Preview Cold Boot →
                    </button>
                </div>

                {/* WARM BOOT */}
                <div style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", width: 260, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                        <div style={{ width: 8, height: 8, background: T.lime }} />
                        <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.lime, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>Warm Boot</span>
                    </div>
                    <p style={{ fontFamily: T.sans, fontSize: "12px", color: T.tx2, lineHeight: 1.6 }}>
                        Every return visit. User profile exists. System recognizes and greets you by name.
                    </p>
                    <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.tx3, lineHeight: 1.7 }}>
                        Duration: ~2.3s<br />
                        Feel: Personal handshake<br />
                        Ends: Dashboard
                    </div>
                    <button
                        onClick={() => setMode("warm")}
                        style={{ marginTop: 4, background: "transparent", border: `1px solid rgba(200,241,53,0.3)`, color: T.lime, fontFamily: T.sans, fontSize: "11px", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer" }}
                    >
                        Preview Warm Boot →
                    </button>
                </div>
            </div>

            {/* Integration snippet */}
            <div style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.08)", padding: "20px 24px", maxWidth: 520, width: "100%", marginTop: 12 }}>
                <span style={{ fontFamily: T.sans, fontSize: "10px", fontWeight: 700, letterSpacing: ".1em", color: T.tx3, textTransform: "uppercase", display: "block", marginBottom: 10 }}>
                    Integration
                </span>
                <pre style={{ fontFamily: T.mono, fontSize: "11px", color: T.tx2, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{`const { bootState, bootType, user, onBootComplete }
  = useBootSequence();

if (bootState === 'booting') {
  return bootType === 'cold'
    ? <ColdBootScreen onComplete={onBootComplete} />
    : <WarmBootScreen user={user} onComplete={onBootComplete} />;
}

return <YourApp />;`}</pre>
            </div>
        </div>
    );
}