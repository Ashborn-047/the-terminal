import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AshbornLayout as MainLayout } from './components/layout/AshbornLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OnboardingModal } from './components/ui/AshbornDesignSystem';
import { useUIStore } from './stores/uiStore';
import { useLabStore } from './stores/labStore';
import { INITIAL_LABS } from './data/labs/initial';
import { logger } from './utils/logger';
import { ToastProvider } from './components/ToastNotification';
import { LevelUpModal } from './components/gamification/LevelUpModal';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ConnectionBanner } from './components/ui/ConnectionBanner';
import { spacetime } from './lib/spacetime';
import { initSpacetimeSync } from './lib/spacetime/sync';
import { globalStyles, tokens } from './components/ui/AshbornDesignSystem';
import { useBootSequence, ColdBootScreen, WarmBootScreen } from './components/layout/BootSequence';
// Lazy-loaded pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LabsPage = React.lazy(() => import('./pages/LabsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const LabView = React.lazy(() => import('./pages/LabView'));
const TerminalPage = React.lazy(() => import('./pages/TerminalPage'));
const CommandReferencePage = React.lazy(() => import('./pages/CommandReferencePage'));
const ChatPage = React.lazy(() => import('./pages/ChatPage.tsx'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage.tsx'));
const ChallengeArenaPage = React.lazy(() => import('./pages/ChallengeArenaPage.tsx'));

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', width: '100vw', 
    backgroundColor: tokens.color.bg.base,
    color: tokens.color.lime.base, 
    fontFamily: tokens.font.mono,
    fontSize: tokens.fontSize.md,
    letterSpacing: tokens.letterSpacing.widest,
    textTransform: 'uppercase'
  }}>
    <div style={{ display: 'flex', flexDir: 'column', alignItems: 'center', gap: 16 }}>
       <div className="animate-pulse">Initializing System...</div>
       <div style={{ width: 200, height: 2, background: 'rgba(0, 255, 157, 0.1)' }}>
          <div className="animate-shimmer" style={{ height: '100%', background: tokens.color.lime.base }} />
       </div>
    </div>
  </div>
);

function AppContent() {
  const { setOnboardingStep, setUsername, username, highContrast, themePreset } = useUIStore();
  const { setLabs, labs } = useLabStore();
  const [isAppReady, setIsAppReady] = React.useState(false);
  const [isServicesStarted, setIsServicesStarted] = React.useState(false);
  const { bootState, bootType, user, onBootComplete } = useBootSequence();

  // Initialize SpacetimeDB subscription
  React.useEffect(() => {
    initSpacetimeSync();
    spacetime.onConnect(() => {
      spacetime.subscribeToAll();
      setIsServicesStarted(true);
    });
    
    // In MOCK mode (CI), services are nearly instantaneous, but we still wait
    if (import.meta.env.VITE_MOCK_SPACETIME === 'true') {
        setTimeout(() => setIsServicesStarted(true), 500);
    }
  }, []);

  // Inject Ashborn Design System Global Styles
  React.useEffect(() => {
    const styleId = 'ashborn-design-system-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = globalStyles;
      document.head.appendChild(style);
    }
  }, []);

  // Apply global theme + accessibility overlays
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-al-theme', themePreset);
    root.setAttribute('data-al-contrast', highContrast ? 'high' : 'normal');

    const styleId = 'ashborn-ui-overrides';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        html[data-al-theme="mono"] body {
          filter: saturate(0.35) contrast(1.05);
        }
        html[data-al-theme="acid"] body {
          filter: hue-rotate(-28deg) saturate(1.2) contrast(1.03);
        }
        html[data-al-contrast="high"] body {
          filter: contrast(1.16) brightness(1.06);
        }
        html[data-al-theme="mono"][data-al-contrast="high"] body,
        html[data-al-theme="acid"][data-al-contrast="high"] body {
          filter: contrast(1.16) brightness(1.06) saturate(0.9);
        }
      `;
      document.head.appendChild(style);
    }
  }, [themePreset, highContrast]);

  // Heartbeat & Registration synchronization
  React.useEffect(() => {
    if (!isServicesStarted) return;

    const startWork = async () => {
        // If we have a username, ensure they are registered/tracked
        if (username) {
            try {
                await spacetime.registerUser(username);
            } catch (err) {
                logger.error('Failed to register user in SpacetimeDB', { err });
            }
        }
        
        // Wait for VFS to settle (briefly)
        setIsAppReady(true);
        (window as any).__APP_READY__ = true;
    };

    startWork();

    const interval = setInterval(() => {
      if (spacetime.getIsConnected()) {
        spacetime.heartbeat(undefined).catch(err =>
          logger.error('Heartbeat failed', { err })
        );
      }
    }, 30000); // 30s heartbeat

    return () => clearInterval(interval);
  }, [username, isServicesStarted]);

  // Load initial labs if not already loaded
  React.useEffect(() => {
    if (Object.keys(labs).length === 0) {
      setLabs(INITIAL_LABS);
      logger.info('Loaded initial labs:', Object.keys(INITIAL_LABS).length);
    }
  }, [labs, setLabs]);

  // The Boot Sequence comes first and overtakes the screen
  if (bootState === 'booting') {
    return bootType === 'cold'
      ? <ColdBootScreen onComplete={onBootComplete} />
      : <WarmBootScreen user={user} onComplete={onBootComplete} />;
  }

  // Readiness Gate — ensuring the "Healing" architecture is strictly respected
  if (!isAppReady) {
    return <PageLoader />;
  }

  return (
    <div style={{ height: '100dvh', width: '100%', backgroundColor: tokens.color.bg.base, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <ConnectionBanner />
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <MainLayout>
        <ErrorBoundary section="Main Content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/terminal" element={<ProtectedRoute><TerminalPage /></ProtectedRoute>} />
              <Route path="/labs" element={<ProtectedRoute><LabsPage /></ProtectedRoute>} />
              <Route path="/labs/:moduleId" element={<ProtectedRoute><LabsPage /></ProtectedRoute>} />
              <Route path="/lab/:labId" element={<ProtectedRoute><LabView /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/commands" element={<CommandReferencePage />} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/challenge-arena" element={<ProtectedRoute><ChallengeArenaPage /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <LevelUpModal />
      </MainLayout>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter basename="/the-terminal">
        <AppContent />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
