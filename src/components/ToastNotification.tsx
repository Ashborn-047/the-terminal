import React, { useState, useEffect, useCallback } from 'react';

/**
 * Toast Notification System — per development_plan.md §6.2.4
 * Shows achievement unlocks, XP gains, level-ups, and general notifications.
 */
export interface Toast {
    id: string;
    type: 'achievement' | 'xp' | 'level-up' | 'info' | 'error';
    title: string;
    message?: string;
    icon?: string;
    duration?: number; // ms, default 3000
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export const useToast = () => {
    const ctx = React.useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

// Singleton event emitter for toasts (so stores can fire toasts without React context)
type ToastListener = (toast: Omit<Toast, 'id'>) => void;
const listeners: ToastListener[] = [];

export const toastEmitter = {
    emit: (toast: Omit<Toast, 'id'>) => listeners.forEach(fn => fn(toast)),
    subscribe: (fn: ToastListener) => { listeners.push(fn); return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        const newToast: Toast = { ...toast, id };
        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, toast.duration || 3500);
    }, []);

    // Listen to emitter so Zustand stores can fire toasts
    useEffect(() => {
        return toastEmitter.subscribe(addToast);
    }, [addToast]);

    const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 max-w-sm pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto border-3 p-4 shadow-brutal animate-slide-in ${getToastStyle(toast.type)}`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <div className="flex items-center gap-3">
                            {toast.icon && <span className="text-2xl">{toast.icon}</span>}
                            <div className="flex-1 min-w-0">
                                <p className="font-heading uppercase text-sm">{toast.title}</p>
                                {toast.message && (
                                    <p className="text-xs mt-1 opacity-80">{toast.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

function getToastStyle(type: Toast['type']): string {
    switch (type) {
        case 'achievement':
            return 'bg-brutal-dark border-brutal-yellow text-brutal-yellow achievement-glitch';
        case 'xp':
            return 'bg-brutal-dark border-brutal-green text-brutal-green';
        case 'level-up':
            return 'bg-brutal-yellow border-brutal-black text-brutal-black';
        case 'error':
            return 'bg-brutal-dark border-brutal-red text-brutal-red';
        default:
            return 'bg-brutal-dark border-brutal-white text-brutal-white';
    }
}
