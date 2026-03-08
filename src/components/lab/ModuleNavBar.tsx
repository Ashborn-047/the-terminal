import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MODULES } from '../../data/modules';
import { cn } from '../../utils/cn';

interface ModuleNavBarProps {
    className?: string;
}

export const ModuleNavBar: React.FC<ModuleNavBarProps> = ({ className }) => {
    const navigate = useNavigate();
    const { moduleId } = useParams();
    const currentModuleId = moduleId ? parseInt(moduleId) : 1;

    return (
        <div className={cn("flex flex-col gap-2 p-4 bg-brutal-dark border-r-3 border-brutal-white w-64 h-full overflow-y-auto", className)}>
            <h2 className="text-xl font-heading mb-4 text-brutal-white uppercase tracking-tighter">Modules</h2>
            <div className="flex flex-col gap-2">
                {MODULES.map((module) => {
                    const isActive = currentModuleId === module.id;
                    return (
                        <button
                            key={module.id}
                            onClick={() => navigate(`/labs/${module.id}`)}
                            className={cn(
                                "flex items-center gap-3 p-3 text-left border-3 transition-all",
                                isActive
                                    ? "bg-brutal-white text-brutal-dark border-brutal-white translate-x-1"
                                    : "bg-transparent text-brutal-white border-transparent hover:border-brutal-white/30"
                            )}
                        >
                            <span className="text-xl">{module.icon}</span>
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-heading text-sm uppercase leading-tight truncate">
                                    {module.title}
                                </span>
                                <span className={cn(
                                    "text-[10px] leading-tight truncate",
                                    isActive ? "text-brutal-dark/70" : "text-brutal-gray"
                                )}>
                                    Module {module.id}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
