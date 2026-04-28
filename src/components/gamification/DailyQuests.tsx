import React, { useEffect } from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';
import { Target, CheckCircle2, Gift } from 'lucide-react';
import { 
    tokens, 
    Card, 
    Display, 
    Label, 
    Mono, 
    Button,
    ProgressBar
} from '../ui/AshbornDesignSystem';

export const DailyQuests: React.FC = () => {
    const { dailyQuests, generateDailyQuests, claimQuestReward } = useGamificationStore();

    useEffect(() => {
        generateDailyQuests();
    }, [generateDailyQuests]);

    return (
        <Card variant="default" style={{ 
            padding: tokens.space[6], 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            background: tokens.color.bg.surface,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Subtle glow effect behind the target icon */}
            <div style={{
                position: 'absolute',
                top: -20,
                left: -20,
                width: 100,
                height: 100,
                background: tokens.color.amber.alpha[10],
                filter: 'blur(40px)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                gap: 12, 
                marginBottom: tokens.space[6],
                borderBottom: `1px solid ${tokens.color.border.subtle}`,
                paddingBottom: tokens.space[4]
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Target size={18} style={{ color: tokens.color.amber.base }} />
                    <Display size="xs" color={tokens.color.text.primary}>Daily Quests</Display>
                </div>
                <div style={{ 
                    fontSize: 9, 
                    fontFamily: tokens.font.mono, 
                    color: tokens.color.text.tertiary,
                    backgroundColor: tokens.color.bg.overlay,
                    padding: '2px 6px',
                    border: `1px solid ${tokens.color.border.subtle}`,
                    letterSpacing: tokens.letterSpacing.wider
                }}>
                    RESETS AT MIDNIGHT
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
                {dailyQuests.map((quest) => {
                    const percent = Math.min(100, (quest.progress / quest.target) * 100);

                    return (
                        <div
                            key={quest.id}
                            style={{
                                padding: tokens.space[4],
                                border: `1px solid ${
                                    quest.claimed 
                                        ? tokens.color.border.subtle 
                                        : quest.completed 
                                            ? tokens.color.lime.base 
                                            : tokens.color.border.subtle
                                }`,
                                background: quest.claimed 
                                    ? tokens.color.bg.base 
                                    : quest.completed 
                                        ? tokens.color.lime.alpha[6] 
                                        : tokens.color.bg.overlay,
                                opacity: quest.claimed ? 0.6 : 1,
                                transition: `all ${tokens.motion.duration.fast}`,
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <div>
                                    <Label 
                                        size="xs" 
                                        weight="bold" 
                                        uppercase 
                                        color={quest.claimed ? tokens.color.text.tertiary : tokens.color.text.primary}
                                    >
                                        {quest.title}
                                    </Label>
                                    <div style={{ marginTop: 4 }}>
                                        <Mono size="2xs" color={tokens.color.text.tertiary}>
                                            Reward: <span style={{ color: tokens.color.amber.base }}>+{quest.xpReward} XP</span>
                                        </Mono>
                                    </div>
                                </div>

                                {quest.claimed ? (
                                    <CheckCircle2 size={20} style={{ color: tokens.color.text.tertiary }} />
                                ) : quest.completed ? (
                                    <Button
                                        variant="lime"
                                        size="sm"
                                        onClick={() => claimQuestReward(quest.id)}
                                        style={{ height: 24, fontSize: 9, padding: '0 8px' }}
                                    >
                                        <Gift size={12} /> Claim
                                    </Button>
                                ) : (
                                    <Mono size="2xs" color={tokens.color.text.secondary}>
                                        {quest.progress} / {quest.target}
                                    </Mono>
                                )}
                            </div>

                            {!quest.claimed && (
                                <ProgressBar 
                                    value={percent} 
                                    height={3} 
                                    animate 
                                    variant={quest.completed ? "default" : "health"} 
                                />
                            )}
                        </div>
                    );
                })}

                {dailyQuests.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                        <Mono size="xs" color={tokens.color.text.tertiary}>Loading daily assignments...</Mono>
                    </div>
                )}
            </div>
        </Card>
    );
};
