import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLabStore } from '../stores/labStore';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { LabCard } from '../components/lab/LabComponents';
import { ModuleNavBar } from '../components/lab/ModuleNavBar';
import { Lock } from 'lucide-react';
import { MODULES } from '../data/modules';
import { 
    tokens, 
    Badge, 
    Card,
    Display,
    Label
} from '../components/ui/AshbornDesignSystem';

/**
 * LabsPage — Curriculum listing. Now organized by modules.
 */
const LabsPage: React.FC = () => {
    const navigate = useNavigate();
    const { moduleId } = useParams();
    const { labs, progress, startLab } = useLabStore();
    const features = useFeatureAccess();

    // Default to module 1 if none specified
    const activeModuleId = moduleId ? parseInt(moduleId) : 1;
    const activeModule = MODULES.find(m => m.id === activeModuleId);

    const labList = Object.values(labs).filter(lab => lab.module === activeModuleId);

    const getLabStatus = (labId: string): 'locked' | 'available' | 'in-progress' | 'completed' => {
        const lab = labs[labId];
        if (lab?.type === 'diy' && !features.diyLabs) return 'locked';

        const p = progress[labId];
        if (!p) return 'available';
        if (p.status === 'completed') return 'completed';
        return 'in-progress';
    };

    const getLabProgress = (labId: string): number => {
        const p = progress[labId];
        const lab = labs[labId];
        if (!p || !lab || !lab.steps) return 0;
        return Math.round((p.currentStepIndex / lab.steps.length) * 100);
    };

    const handleStartLab = (labId: string) => {
        startLab(labId);
        navigate(`/lab/${labId}`);
    };

    return (
        <div style={{ 
            display: 'flex', 
            height: '100%', 
            width: '100%', 
            overflow: 'hidden', 
            backgroundColor: tokens.color.bg.base 
        }}>
            {/* Context Panel (Secondary Sidebar) */}
            <div 
                style={{ 
                    width: 250, 
                    flexShrink: 0,
                    borderRight: `1px solid ${tokens.color.border.default}`,
                    display: 'var(--module-nav-display, block)'
                }}
                className="module-nav-container"
            >
                <ModuleNavBar />
            </div>

            {/* Main Lab Grid Area */}
            <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: tokens.space[8], 
                position: 'relative', 
                minWidth: 0 
            }}>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    marginBottom: 40, 
                    maxWidth: 1024, 
                    marginLeft: 'auto', 
                    marginRight: 'auto' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
                        <span style={{ fontSize: 48 }}>{activeModule?.icon}</span>
                        <div>
                            <Display size="lg" color={tokens.color.amber.base} data-testid="lab-module-title">
                                {activeModule?.title || 'Curriculum'}
                            </Display>
                            <div style={{ marginTop: 8 }}>
                                <Badge variant="lime">MODULE {activeModuleId.toString().padStart(2, '0')}</Badge>
                            </div>
                        </div>
                    </div>
                    <Label size="md" color={tokens.color.text.secondary} style={{ maxWidth: 700 }}>
                        {activeModule?.description || 'Choose a lab to begin. Each lab teaches Linux commands through hands-on practice.'}
                    </Label>
                </div>

                {labList.length === 0 ? (
                    <Card style={{ 
                        maxWidth: 1024, 
                        marginLeft: 'auto', 
                        marginRight: 'auto', 
                        padding: 64, 
                        textAlign: 'center', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: 16,
                        opacity: 0.5
                    }}>
                        <Lock size={48} style={{ color: tokens.color.text.tertiary }} />
                        <p style={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: tokens.letterSpacing.widest, color: tokens.color.text.secondary }}>
                            No labs found in this module yet.
                        </p>
                    </Card>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
                        gap: tokens.space[6], 
                        maxWidth: 1024, 
                        marginLeft: 'auto', 
                        marginRight: 'auto', 
                        paddingBottom: 48 
                    }}>
                        {labList.map((lab) => (
                            <LabCard
                                key={lab.id}
                                lab={lab}
                                status={getLabStatus(lab.id)}
                                progress={getLabProgress(lab.id)}
                                onStart={handleStartLab}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LabsPage;
