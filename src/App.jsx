import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/layout/LoadingScreen';
import CustomCursor from './components/ui/CustomCursor';
import FilmGrain from './components/ui/FilmGrain';
import BottomHUD from './components/layout/BottomHUD';
import RouteLoader from './components/layout/RouteLoader';
import { useLenis } from './hooks/useLenis';
import { useGlobalHoverSound } from './hooks/useGlobalHoverSound';
import { soundEngine } from './audio/soundEngine';
import AuroraBackground from './components/ui/AuroraBackground';
import ToastContainer from './components/ui/Toast';

// Dedicated Route Views (Lazy Loaded)
const HomeView = lazy(() => import('./components/home/HomeView'));
const WorkView = lazy(() => import('./components/projects/WorkView'));
const ExperienceView = lazy(() => import('./components/experience/ExperienceView'));
const ExperimentsView = lazy(() => import('./components/experiments/ExperimentsView'));
const AboutView = lazy(() => import('./components/about/AboutView'));
const ContactView = lazy(() => import('./components/contact/ContactView'));

const LazyFallback = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center bg-transparent text-xs font-mono text-gray-500">
    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10">
      <span className="w-2 h-2 rounded-full bg-[#0781ff] animate-ping" />
      <span>Loading View...</span>
    </div>
  </div>
);

function AppContent({ initialLoading, showLoadingScreen, onInitialLoadComplete }) {
  const location = useLocation();
  const [transitioning, setTransitioning] = useState(false);
  const [currentRouteLabel, setCurrentRouteLabel] = useState('HOME');
  const isFirstMount = useRef(true);

  useLenis();
  useGlobalHoverSound();

  // Dynamic BGM Track Switching: Projects Section vs Contact/Connection vs Default
  useEffect(() => {
    if (initialLoading) return;

    if (location.pathname === '/work' || location.pathname === '/projects') {
      soundEngine.playBGM('projects');
    } else if (location.pathname === '/contact') {
      soundEngine.playBGM('contact');
    } else {
      soundEngine.playBGM('default');
    }
  }, [location.pathname, initialLoading]);

  // Route transition loader & scroll-to-top on route change
  useEffect(() => {
    window.scrollTo(0, 0);

    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const routeMap = {
      '/': 'HOME',
      '/about': 'ABOUT',
      '/work': 'WORK',
      '/projects': 'WORK',
      '/experience': 'EXPERIENCE',
      '/experiments': 'LABORATORY',
      '/contact': 'CONTACT'
    };

    const label = routeMap[location.pathname] || 'ARAV';
    setCurrentRouteLabel(label);
    setTransitioning(true);
  }, [location.pathname]);

  const handleTransitionFinish = useCallback(() => {
    setTransitioning(false);
  }, []);

  return (
    <div className="bg-[#030308] min-h-screen text-[#f8fafc] relative selection:bg-[#0781ff]/30 selection:text-white">
      {/* 3D WebGL Fluid Mesh Gradient Background (Advait Nair / Stripe Aurora) */}
      <AuroraBackground />

      {/* Desktop Contextual Transparent Morphing Cursor */}
      <CustomCursor />

      {/* Analog Micro-Grain Texture Overlay */}
      <FilmGrain />

      {/* Cinematic Hindi & English Namaste Terminal Loader */}
      {showLoadingScreen && <LoadingScreen onComplete={onInitialLoadComplete} />}

      {/* Route Transition Loader */}
      {!initialLoading && (
        <RouteLoader
          routeName={currentRouteLabel}
          isVisible={transitioning}
          onFinished={handleTransitionFinish}
        />
      )}

      {/* Main Experience Layout */}
      <div className={`transition-opacity duration-1000 ease-out ${initialLoading ? 'opacity-0' : 'opacity-100'} relative z-10`}>
        <Navbar />

        {/* Pure Multi-Route View Main Content */}
        <main className="relative z-10 min-h-screen">
          <Suspense fallback={<LazyFallback />}>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/about" element={<AboutView />} />
              <Route path="/work" element={<WorkView />} />
              <Route path="/projects" element={<WorkView />} />
              <Route path="/experience" element={<ExperienceView />} />
              <Route path="/experiments" element={<ExperimentsView />} />
              <Route path="/contact" element={<ContactView />} />
              <Route path="*" element={<HomeView />} />
            </Routes>
          </Suspense>
        </main>

        {/* Global Toast Notifications */}
        <ToastContainer />

        {/* Fixed Bottom Left Audio & Credits */}
        <BottomHUD />

        {/* Page Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    if (initialLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [initialLoading]);

  const handleInitialLoadComplete = () => {
    setInitialLoading(false);
    setTimeout(() => setShowLoadingScreen(false), 900);
  };

  return (
    <BrowserRouter>
      <AppContent
        initialLoading={initialLoading}
        showLoadingScreen={showLoadingScreen}
        onInitialLoadComplete={handleInitialLoadComplete}
      />
    </BrowserRouter>
  );
}