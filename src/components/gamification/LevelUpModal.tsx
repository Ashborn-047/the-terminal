import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { getLevelTitle } from '../../stores/gamificationStore';
import { Award, Zap, ChevronRight } from 'lucide-react';
import { tokens, Card, Button, Badge } from '../ui/AshbornDesignSystem';

export const LevelUpModal: React.FC = () => {
    const { levelUpModalOpen, hideLevelUp, lastLeveledUpTo } = useUIStore();

    if (!levelUpModalOpen) return null;

    const title = getLevelTitle(lastLeveledUpTo);

    return (
        <div style={{
            position: "fixed", inset: 0,
            background: "rgba(13,13,15,0.92)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: tokens.z.modal,
            padding: tokens.space[4]
        }}>
            <Card 
                data-testid="level-up-modal"
                style={{ 
                    maxWidth: 400, width: "100%", padding: tokens.space[8],
                    border: `1px solid ${tokens.color.lime.base}`,
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    animation: "al-slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
            >
                {/* Decorative background glow */}
                <div style={{
                    position: "absolute", top: "-50%", left: "-50%",
                    width: "200%", height: "200%",
                    background: `radial-gradient(circle, ${tokens.color.lime.alpha[8]} 0%, transparent 70%)`,
                    pointerEvents: "none"
                }} />

                <div style={{ display: "flex", justifyContent: "center", marginBottom: tokens.space[6], position: "relative" }}>
                    <div style={{ 
                        background: tokens.color.lime.alpha[12], 
                        padding: tokens.space[4], 
                        border: `1px solid ${tokens.color.lime.base}`,
                        animation: "al-pulse 2s infinite"
                    }}>
                        <Award size={48} color={tokens.color.lime.base} />
                    </div>
                </div>

                <h2 style={{ 
                    fontFamily: tokens.font.sans, fontSize: tokens.fontSize["3xl"], 
                    fontWeight: 900, textTransform: "uppercase", italic: "true" as any,
                    color: tokens.color.text.primary, marginBottom: tokens.space[2],
                    letterSpacing: "-0.02em"
                }}>
                    Level Up!
                </h2>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: tokens.space[6] }}>
                    <span style={{ fontFamily: tokens.font.mono, color: tokens.color.text.tertiary, fontSize: 20, textDecoration: "line-through" }}>
                        LVL {lastLeveledUpTo - 1}
                    </span>
                    <ChevronRight size={24} color={tokens.color.text.tertiary} />
                    <Badge variant="level">
                        <span style={{ fontSize: 24, padding: "0 8px" }}>{lastLeveledUpTo}</span>
                    </Badge>
                </div>

                <div style={{ 
                    background: tokens.color.bg.input, 
                    border: `1px solid ${tokens.color.border.default}`,
                    padding: tokens.space[4], marginBottom: tokens.space[8] 
                }}>
                    <p style={{ 
                        color: tokens.color.lime.base, fontFamily: tokens.font.mono, 
                        uppercase: "true" as any, fontSize: 10, fontWeight: 700, 
                        marginBottom: 4, letterSpacing: tokens.letterSpacing.widest 
                    }}>
                        NEW TITLE UNLOCKED
                    </p>
                    <p style={{ 
                        fontFamily: tokens.font.sans, fontSize: tokens.fontSize.xl, 
                        fontWeight: 800, textTransform: "uppercase", color: tokens.color.text.primary 
                    }}>
                        {title}
                    </p>
                </div>

                <div style={{ spaceY: 16 }}>
                    <p style={{ 
                        fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, 
                        color: tokens.color.text.secondary, marginBottom: tokens.space[6],
                        lineHeight: 1.6
                    }}>
                        You're becoming a true Linux master. Keep exploring to unlock more features!
                    </p>

                    <Button
                        variant="lime"
                        size="lg"
                        onClick={hideLevelUp}
                        style={{ width: "100%", marginBottom: tokens.space[4] }}
                    >
                        Continue Journey
                    </Button>

                    <p style={{ 
                        fontFamily: tokens.font.mono, fontSize: 9, 
                        color: tokens.color.text.tertiary, textTransform: "uppercase", 
                        letterSpacing: tokens.letterSpacing.widest 
                    }}>
                        Next milestone at level {Math.ceil(lastLeveledUpTo / 5) * 5}
                    </p>
                </div>
            </Card>

            {/* Background elements */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                 {[...Array(12)].map((_, i) => (
                    <Zap
                        key={`zap-${i}`}
                        size={16}
                        style={{
                            color: tokens.color.lime.alpha[20],
                            position: "absolute",
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `al-pulse ${Math.random() * 2 + 1}s infinite`,
                            opacity: 0.3
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
