import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tokens, Display, Label, Button, Card, Mono } from '../ui/AshbornDesignSystem';
import { BookOpen, Zap, ArrowRight, Play, RefreshCw } from 'lucide-react';

interface PreAssessmentModalProps {
    isOpen: boolean;
    chapterTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const PreAssessmentModal: React.FC<PreAssessmentModalProps> = ({
    isOpen,
    chapterTitle,
    onConfirm,
    onCancel
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: tokens.z.modal,
                    background: 'rgba(10, 10, 12, 0.9)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: tokens.space[4]
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    >
                        <Card style={{
                            maxWidth: 500,
                            width: '100%',
                            padding: tokens.space[8],
                            border: `1px solid ${tokens.color.border.lime}`,
                            background: tokens.color.bg.overlay,
                            textAlign: 'center'
                        }}>
                            <div style={{ 
                                width: 64, 
                                height: 64, 
                                background: tokens.color.lime.alpha[10], 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '0 auto 24px'
                            }}>
                                <Zap size={32} style={{ color: tokens.color.lime.base }} />
                            </div>

                            <Display size="md" color={tokens.color.lime.base} style={{ marginBottom: 8 }}>
                                Knowledge Check
                            </Display>
                            
                            <p style={{ 
                                fontFamily: tokens.font.sans, 
                                color: tokens.color.text.secondary, 
                                marginBottom: 32,
                                lineHeight: 1.6 
                            }}>
                                You've finished reading <strong>{chapterTitle}</strong>. 
                                Would you like to participate in a quick MCQ assessment to test your knowledge and earn XP?
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <Button variant="lime" size="lg" onClick={onConfirm} style={{ width: '100%' }}>
                                    Start Assessment <ArrowRight size={18} />
                                </Button>
                                <Button variant="ghost" onClick={onCancel} style={{ width: '100%', color: tokens.color.text.tertiary }}>
                                    Maybe Later
                                </Button>
                            </div>

                            <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${tokens.color.border.subtle}` }}>
                                <Mono size="2xs" color={tokens.color.text.tertiary}>
                                    ESTIMATED TIME: 2-3 MINUTES | 5-10 QUESTIONS
                                </Mono>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

interface ChapterReentryModalProps {
    isOpen: boolean;
    chapterTitle: string;
    onRead: () => void;
    onJumpToMCQ: () => void;
    onCancel: () => void;
}

export const ChapterReentryModal: React.FC<ChapterReentryModalProps> = ({
    isOpen,
    chapterTitle,
    onRead,
    onJumpToMCQ,
    onCancel
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: tokens.z.modal,
                    background: 'rgba(10, 10, 12, 0.9)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: tokens.space[4]
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    >
                        <Card style={{
                            maxWidth: 500,
                            width: '100%',
                            padding: tokens.space[8],
                            border: `1px solid ${tokens.color.border.strong}`,
                            background: tokens.color.bg.overlay,
                            textAlign: 'center'
                        }}>
                            <Display size="md" color={tokens.color.lime.base} style={{ marginBottom: 8 }}>
                                Welcome Back
                            </Display>
                            
                            <p style={{ 
                                fontFamily: tokens.font.sans, 
                                color: tokens.color.text.secondary, 
                                marginBottom: 32,
                                lineHeight: 1.6 
                            }}>
                                You have already completed <strong>{chapterTitle}</strong>. 
                                What would you like to do?
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <Card 
                                    variant="interactive" 
                                    onClick={onRead}
                                    style={{ 
                                        padding: tokens.space[6], 
                                        cursor: 'pointer',
                                        background: tokens.color.bg.surface,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 12
                                    }}
                                >
                                    <BookOpen size={24} style={{ color: tokens.color.lime.base }} />
                                    <Label size="sm" weight="bold">Review Content</Label>
                                </Card>

                                <Card 
                                    variant="interactive" 
                                    onClick={onJumpToMCQ}
                                    style={{ 
                                        padding: tokens.space[6], 
                                        cursor: 'pointer',
                                        background: tokens.color.bg.surface,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 12
                                    }}
                                >
                                    <RefreshCw size={24} style={{ color: tokens.color.amber.base }} />
                                    <Label size="sm" weight="bold">Jump to MCQ</Label>
                                </Card>
                            </div>

                            <Button variant="ghost" onClick={onCancel} style={{ width: '100%', color: tokens.color.text.tertiary }}>
                                Cancel
                            </Button>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
