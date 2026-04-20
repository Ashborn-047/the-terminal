import React from 'react';
import { Target, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { spacetime } from '../../lib/spacetime';
import { useGamificationStore } from '../../stores/gamificationStore';
import { 
    tokens, 
    Card, 
    Badge, 
    Button, 
    Divider,
    Display
} from '../ui/AshbornDesignSystem';

export const QuestList: React.FC = () => {
    const userQuests = spacetime.getUserQuests();
    const allQuests = spacetime.getQuests(); 
    const { level } = useGamificationStore();

    if (!userQuests) {
        return (
            <Card id="quest-empty-card" variant="default" style={{ textAlign: 'center', padding: tokens.space[6], opacity: 0.5 }}>
                <Target size={48} style={{ margin: '0 auto 20px', color: tokens.color.text.tertiary }} />
                <Display size="sm" style={{ marginBottom: 4 }}>No Active Missions</Display>
                <p style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, textTransform: 'uppercase', color: tokens.color.text.tertiary }}>
                    System Idle
                </p>
            </Card>
        );
    }

    const activeQuests = allQuests.filter((q: any) => userQuests.activeQuestIds.includes(q.id));
    const completedQuests = allQuests.filter((q: any) => userQuests.completedQuestIds.includes(q.id));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space[4] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Display size="sm" style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    margin: 0
                }}>
                    <Target style={{ color: tokens.color.lime.base }} size={20} /> Terminal Missions
                </Display>
                <Badge variant="lime">LEVEL {level}</Badge>
            </div>

            {/* Active Quests */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} role="list" aria-label="Active Missions">
                {activeQuests.length === 0 && (
                    <div id="quest-sync-msg" style={{ 
                        padding: tokens.space[6], 
                        border: `1px dashed ${tokens.color.border.default}`, 
                        color: tokens.color.text.tertiary,
                        fontFamily: tokens.font.mono,
                        fontSize: tokens.fontSize.xs,
                        textAlign: 'center'
                    }}>
                        All daily missions complete. Checking for new transmissions...
                    </div>
                )}
                {activeQuests.map((quest: any) => (
                    <Card
                        key={quest.id.toString()}
                        variant="default"
                        id={`quest-active-${quest.id}`}
                        style={{ position: 'relative', overflow: 'hidden', padding: tokens.space[6] }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <Display size="sm" color={tokens.color.lime.base} style={{ margin: 0, lineHeight: 1.2 }}>
                                {quest.title}
                            </Display>
                            <Badge variant="amber" style={{ marginLeft: 12 }}>
                                <Sparkles size={10} style={{ marginRight: 4 }} /> +{quest.xpReward.toString()} XP
                            </Badge>
                        </div>
                        
                        <p style={{ 
                            fontFamily: tokens.font.mono, 
                            fontSize: tokens.fontSize.xs, 
                            color: tokens.color.text.secondary,
                            marginBottom: 16,
                            lineHeight: 1.5
                        }}>
                            {quest.description}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => spacetime.completeQuest(quest.id)}
                                icon={<ChevronRight size={14} />}
                            >
                                Complete Objective
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Completed Section */}
            {completedQuests.length > 0 && (
                <div style={{ marginTop: 8 }}>
                    <h3 style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: 10, 
                        fontWeight: 700,
                        textTransform: 'uppercase', 
                        color: tokens.color.text.tertiary,
                        marginBottom: 12,
                        letterSpacing: tokens.letterSpacing.widest
                    }}>
                        Transmissions Received
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {completedQuests.slice(0, 3).map((quest: any) => (
                            <div 
                                key={quest.id.toString()} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 12, 
                                    padding: tokens.space[6],
                                    background: tokens.color.bg.surface,
                                    border: `1px solid ${tokens.color.border.strong}`,
                                    opacity: 0.6
                                }}
                            >
                                <CheckCircle2 size={14} style={{ color: tokens.color.lime.base }} />
                                <span style={{ fontFamily: tokens.font.display, fontSize: 10, color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {quest.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
