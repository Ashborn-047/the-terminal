import { useParams, useNavigate } from 'react-router-dom';
import { useLabStore } from '../stores/labStore';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { LabCard } from '../components/lab/LabComponents';
import { ModuleNavBar } from '../components/lab/ModuleNavBar';
import { Lock } from 'lucide-react';
import { MODULES } from '../data/modules';

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
        <div className="flex h-full w-full overflow-hidden absolute inset-0 bg-brutal-black">
            {/* Context Panel (Secondary Sidebar) - 250px exactly as per Stitch Mockup */}
            <div className="w-[250px] shrink-0 border-r-3 border-brutal-white/20 bg-brutal-black h-full relative z-10 hidden md:block">
                <ModuleNavBar className="w-full h-full border-r-0 border-brutal-white/20 bg-transparent" />
            </div>

            {/* Main Lab Grid Area */}
            <div className="flex-1 overflow-y-auto p-8 bg-brutal-dark relative min-w-0">
                <div className="flex flex-col mb-10 max-w-4xl mx-auto">
                    <div className="flex items-center gap-6 mb-4">
                        <span className="text-5xl">{activeModule?.icon}</span>
                        <div>
                            <h1 className="font-heading text-4xl text-brutal-yellow uppercase leading-none tracking-tight">
                                {activeModule?.title || 'Curriculum'}
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-brutal-green font-mono text-xs uppercase tracking-widest px-2 py-0.5 border border-brutal-green">
                                    Module {activeModuleId}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-brutal-white/80 text-lg max-w-2xl font-body leading-relaxed">
                        {activeModule?.description || 'Choose a lab to begin. Each lab teaches Linux commands through hands-on practice.'}
                    </p>
                </div>

                {labList.length === 0 ? (
                    <div className="max-w-4xl mx-auto bg-brutal-black border-2 border-brutal-white/20 p-12 text-center flex flex-col items-center justify-center gap-4">
                        <Lock size={48} className="text-brutal-gray/50" />
                        <p className="text-brutal-gray font-mono uppercase tracking-widest">No labs found in this module yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-4xl mx-auto pb-12">
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
