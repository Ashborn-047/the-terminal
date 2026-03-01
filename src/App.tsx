import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { WelcomeModal } from './components/onboarding/WelcomeModal';
import { useUIStore } from './stores/uiStore';
import { useLabStore } from './stores/labStore';
import { INITIAL_LABS } from './data/labs/initial';
import { logger } from './utils/logger';
import { ToastProvider } from './components/ToastNotification';
import { OnboardingWalkthrough } from './components/onboarding/OnboardingWalkthrough';
import { LevelUpModal } from './components/gamification/LevelUpModal';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Lazy-loaded pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LabsPage = React.lazy(() => import('./pages/LabsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const LabView = React.lazy(() => import('./pages/LabView'));
const TerminalPage = React.lazy(() => import('./pages/TerminalPage'));
const CommandReferencePage = React.lazy(() => import('./pages/CommandReferencePage'));
const ChatPage = React.lazy(() => import('./pages/ChatPage.tsx'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage.tsx'));

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '60vh', color: '#00FF9D', fontFamily: 'JetBrains Mono, monospace',
    fontSize: '1rem',
  }}>
    Loading...
  </div>
);

function AppContent() {
  const { onboardingComplete, completeOnboarding, setActiveView, onboardingStep, setOnboardingStep, setUsername, username } = useUIStore();
  const { setLabs, labs } = useLabStore();

  // Load initial labs if not already loaded
  React.useEffect(() => {
    if (Object.keys(labs).length === 0) {
      setLabs(INITIAL_LABS);
      logger.info('Loaded initial labs:', Object.keys(INITIAL_LABS).length);
    }
  }, []);

  const handleOnboardingComplete = (name: string) => {
    logger.info('Onboarding complete for user:', name);
    setUsername(name);
    // Advance to walkthrough phase (step 2)
    setOnboardingStep(2);
  };

  return (
    <>
      {onboardingStep === 0 && (
        <WelcomeModal onComplete={handleOnboardingComplete} />
      )}
      <MainLayout>
        <ErrorBoundary section="Main Content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/terminal" element={<ProtectedRoute><TerminalPage /></ProtectedRoute>} />
              <Route path="/labs" element={<ProtectedRoute><LabsPage /></ProtectedRoute>} />
              <Route path="/lab/:labId" element={<ProtectedRoute><LabView /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/commands" element={<CommandReferencePage />} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <OnboardingWalkthrough />
        <LevelUpModal />
      </MainLayout>
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
