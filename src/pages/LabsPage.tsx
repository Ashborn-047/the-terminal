import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabStore } from '../stores/labStore';
import { LabCard } from '../components/lab/LabComponents';

/**
 * LabsPage — Curriculum listing. Clicking Start navigates to /lab/:labId.
 */
const LabsPage: React.FC = () => {
    const navigate = useNavigate();
    const { labs, progress, startLab } = useLabStore();
    const labList = Object.values(labs);

    const getLabStatus = (labId: string): 'locked' | 'available' | 'in-progress' | 'completed' => {
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
        <div className="h-full overflow-y-auto p-6">
            <h1 className="font-heading text-3xl uppercase mb-2 text-brutal-white">Curriculum</h1>
            <p className="text-brutal-gray text-sm mb-6">Choose a lab to begin. Each lab teaches Linux commands through hands-on practice.</p>

            {labList.length === 0 ? (
                <div className="bg-brutal-dark border-3 border-brutal-white p-8 text-center">
                    <p className="text-brutal-gray">No labs available yet. Check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    );
};

export default LabsPage;
