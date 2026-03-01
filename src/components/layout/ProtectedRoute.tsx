import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';

/**
 * ProtectedRoute — per Doc 3 §4.1
 * Ensures the user has completed initial onboarding (username set) before accessing certain routes.
 */
interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { onboardingStep } = useUIStore();
    const location = useLocation();

    // If onboarding hasn't started (step 0), they shouldn't see protected content
    // They will be handled by the WelcomeModal overlay in App.tsx, 
    // but this guard provides extra safety and logic for future auth.
    if (onboardingStep === 0) {
        // Technically App.tsx handles the overlay, but if we navigate directly:
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
