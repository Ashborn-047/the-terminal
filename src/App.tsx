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

// Lazy-loaded pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LabsPage = React.lazy(() => import('./pages/LabsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const LabView = React.lazy(() => import('./pages/LabView'));
const TerminalPage = React.lazy(() => import('./pages/TerminalPage'));
const CommandReferencePage = React.lazy(() => import('./pages/CommandReferencePage'));

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
  const { onboardingComplete, completeOnboarding, setActiveView, onboardingStep, setOnboardingStep } = useUIStore();
  const { setLabs, labs } = useLabStore();

  // Load initial labs if not already loaded
  React.useEffect(() => {
    if (Object.keys(labs).length === 0) {
      setLabs(INITIAL_LABS);
      logger.info('Loaded initial labs:', Object.keys(INITIAL_LABS).length);
    }
  }, []);

  const handleOnboardingComplete = (username: string) => {
    logger.info('Onboarding complete for user:', username);
    // Save username
    localStorage.setItem('the-terminal-username', username);
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
              <Route path="/terminal" element={<TerminalPage />} />
              <Route path="/labs" element={<LabsPage />} />
              <Route path="/lab/:labId" element={<LabView />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/commands" element={<CommandReferencePage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <OnboardingWalkthrough />
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
