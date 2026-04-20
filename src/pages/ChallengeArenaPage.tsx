import React from 'react';
import { useGamificationStore } from '../stores/gamificationStore';
import { useNavigate } from 'react-router-dom';
import { 
    tokens, 
    Display, 
    Mono, 
    Label, 
    Button, 
    Badge 
} from '../components/ui/AshbornDesignSystem';

/**
 * ChallengeArenaPage — V2 Parity Reconstruction
 * Elite laboratory for high-stakes system troubleshooting.
 * Locked until Level 10.
 */
const CHALLENGES = [
    { 
        name: "Broken Bootloader", 
        diff: "Extreme", 
        cat: "System Recovery", 
        desc: "Fix a system that won't boot. Root cause unknown. Multiple stage failure." 
    },
    { 
        name: "Ghost Process", 
        diff: "Hard", 
        cat: "Process Management", 
        desc: "An undying zombie process consumes 100% CPU. Kill it permanently." 
    },
    { 
        name: "Corrupted FS", 
        diff: "Hard", 
        cat: "Filesystem", 
        desc: "Recover critical database files from a partially corrupted disk partition." 
    },
];

const ChallengeArenaPage: React.FC = () => {
    const navigate = useNavigate();
    const { level } = useGamificationStore();
    
    // V2 Logic: Lock until Level 10 (Hacker Rank)
    const requiredLevel = 10;
    const isLocked = level < requiredLevel;
    const unlockProgress = Math.min(100, (level / requiredLevel) * 100);

    return (
        <div style={{ 
            height: '100%', 
            overflowY: 'auto', 
            background: tokens.color.bg.base,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* ── ARENA HEADER ── */}
            <div style={{
                background: `linear-gradient(180deg, rgba(255,90,90,0.04) 0%, transparent 100%)`,
                borderBottom: `1px solid ${tokens.color.border.error}`,
                padding: "32px 32px 28px",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div className="animate-pulse" style={{ 
                        width: 8, height: 8, 
                        background: tokens.color.semantic.error, 
                        borderRadius: "50%",
                        boxShadow: `0 0 10px ${tokens.color.semantic.error}`
                    }} />
                    <Label color={tokens.color.semantic.error} style={{ fontWeight: 800 }}>
                        Terminal Mastery Required
                    </Label>
                </div>
                <Display size="xl" style={{ marginBottom: 12 }}>Challenge Arena</Display>
                <p style={{ 
                    fontFamily: tokens.font.mono, 
                    fontSize: "13px", 
                    color: tokens.color.text.secondary, 
                    lineHeight: 1.7, 
                    maxWidth: 600, 
                    borderLeft: `2px solid ${tokens.color.border.error}`, 
                    paddingLeft: 16 
                }}>
                    Elite laboratory for high-stakes system troubleshooting. Each scenario is a 
                    "Broken System" requiring authoritative outcome-based verification.
                </p>
            </div>

            <div style={{ padding: "32px" }}>
                {isLocked ? (
                    <>
                        {/* ── ACCESS DENIED INTEL CARD ── */}
                        <div style={{ 
                            background: tokens.color.semantic.errorBg, 
                            border: `1px solid ${tokens.color.border.error}`, 
                            padding: "20px 24px", 
                            marginBottom: 32, 
                            display: "flex", 
                            gap: 20 
                        }}>
                            <span style={{ fontSize: 24, flexShrink: 0 }}>⚠️</span>
                            <div>
                                <Display size="sm" color={tokens.color.semantic.error} style={{ marginBottom: 6 }}>
                                    Access Denied — Level {requiredLevel} Required
                                </Display>
                                <p style={{ fontFamily: tokens.font.sans, fontSize: "12px", color: tokens.color.text.secondary, lineHeight: 1.7 }}>
                                    Challenge Arena scenarios involve broken systems under real conditions. 
                                    Agents below Level {requiredLevel} (Hacker Rank) are not cleared for entry. 
                                    Complete fundamental training labs to earn clearance.
                                </p>
                            </div>
                        </div>

                        {/* ── CLEARANCE PROGRESS ── */}
                        <div style={{ 
                            background: tokens.color.bg.surface, 
                            border: `1px solid ${tokens.color.border.default}`, 
                            padding: "24px", 
                            marginBottom: 32 
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <Label color={tokens.color.text.secondary}>Clearance Progress to Level {requiredLevel}</Label>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <Display size="sm" color={tokens.color.text.tertiary}>Lv{level}</Display>
                                    <div style={{ width: 32, height: 1, background: tokens.color.border.strong }} />
                                    <Display size="sm" color={tokens.color.semantic.error}>Lv{requiredLevel}</Display>
                                </div>
                            </div>
                            
                            <div style={{ height: 8, background: "rgba(255,255,255,0.05)", position: "relative", marginBottom: 12 }}>
                                <div style={{ 
                                    height: "100%", 
                                    width: `${unlockProgress}%`, 
                                    background: `linear-gradient(90deg, ${tokens.color.lime.base}, ${tokens.color.amber.base})`, 
                                    transition: "width 1s ease-out",
                                    boxShadow: `0 0 15px ${tokens.color.lime.alpha[30]}`
                                }} />
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Mono size="xs" color={tokens.color.text.tertiary}>
                                    {Math.round(unlockProgress)}% to clearance
                                </Mono>
                                <Mono size="xs" color={tokens.color.semantic.error}>
                                    {requiredLevel - level} levels remaining
                                </Mono>
                            </div>
                        </div>

                        {/* ── RESTRICTED OPERATIONS ── */}
                        <Label style={{ marginBottom: 16, display: "block", color: tokens.color.text.tertiary, letterSpacing: tokens.letterSpacing.widest }}>
                            Restricted Operations — Preview Only
                        </Label>
                        <div style={{ 
                            display: "grid", 
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                            gap: 16, 
                            marginBottom: 32 
                        }}>
                            {CHALLENGES.map((c, i) => (
                                <div key={i} style={{ 
                                    position: "relative", 
                                    background: tokens.color.bg.surface, 
                                    border: `1px solid ${tokens.color.border.strong}`, 
                                    padding: "20px", 
                                    overflow: "hidden" 
                                }}>
                                    {/* Blur overlay */}
                                    <div style={{ 
                                        position: "absolute", 
                                        inset: 0, 
                                        backdropFilter: "blur(6px)", 
                                        background: "rgba(13,13,15,0.7)", 
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "center", 
                                        flexDirection: "column", 
                                        gap: 12, 
                                        zIndex: 10 
                                    }}>
                                        <span style={{ fontSize: 32 }}>🔒</span>
                                        <Mono size="xs" color={tokens.color.text.tertiary} style={{ letterSpacing: ".2em", fontWeight: 800 }}>
                                            RESTRICTED
                                        </Mono>
                                    </div>

                                    <Label color={tokens.color.semantic.error} style={{ marginBottom: 8, display: "block", fontSize: '10px' }}>
                                        {c.cat}
                                    </Label>
                                    <Display size="sm" style={{ marginBottom: 8 }}>{c.name}</Display>
                                    <p style={{ 
                                        fontFamily: tokens.font.sans, 
                                        fontSize: "12px", 
                                        color: tokens.color.text.secondary, 
                                        lineHeight: 1.6, 
                                        marginBottom: 16 
                                    }}>
                                        {c.desc}
                                    </p>
                                    <div style={{ 
                                        background: tokens.color.semantic.errorBg, 
                                        border: `1px solid ${tokens.color.border.error}`, 
                                        padding: "4px 10px", 
                                        display: "inline-block" 
                                    }}>
                                        <Mono size="2xs" color={tokens.color.semantic.error} style={{ fontWeight: 800 }}>
                                            DIFFICULTY: {c.diff}
                                        </Mono>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── CTA ── */}
                        <Button 
                            variant="outline_lime" 
                            size="lg" 
                            full 
                            onClick={() => navigate('/labs')}
                            style={{ height: 56 }}
                        >
                            ← Return to Training Labs
                        </Button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Display size="xl" color={tokens.color.lime.base}>Clearance Confirmed</Display>
                        <p style={{ fontFamily: tokens.font.sans, color: tokens.color.text.secondary, marginTop: 16 }}>
                            Arena protocols initialized. Scenarios loading...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChallengeArenaPage;
