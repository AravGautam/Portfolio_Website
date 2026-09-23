import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/layout/LoadingScreen';
import CustomCursor from './components/ui/CustomCursor';
import FilmGrain from './components/ui/FilmGrain';
import SpatialNavHUD from './components/layout/SpatialNavHUD';
import RouteLoader from './components/layout/RouteLoader';
import { useLenis } from './hooks/useLenis';
import { useGlobalHoverSound } from './hooks/useGlobalHoverSound';
import { soundEngine } from './audio/soundEngine';

// Hero renders immediately for zero FCP delay
import Hero from './components/home/Hero';

// Below-the-fold Single Page Sections (Lazy Loaded)
const Projects = lazy(() => import('./components/projects/Projects'));
const Experience = lazy(() => import('./components/experience/Experience'));
const SkillsConstellation = lazy(() => import('./components/about/SkillsConstellation'));
const About = lazy(() => import('./components/about/About'));
const Experiments = lazy(() => import('./components/experiments/Experiments'));
const Contact = lazy(() => import('./components/contact/Contact'));

// Dedicated Route Views (Lazy Loaded)
const HomeView = lazy(() => import('./components/home/HomeView'));
const WorkView = lazy(() => import('./components/projects/WorkView'));
const ExperienceView = lazy(() => import('./components/experience/ExperienceView'));
const ExperimentsView = lazy(() => import('./components/experiments/ExperimentsView'));
const AboutView = lazy(() => import('./components/about/AboutView'));
const ContactView = lazy(() => import('./components/contact/ContactView'));

const LazyFallback = () => (
  <div className="w-full min-h-[300px] flex items-center justify-center bg-[#070709] text-xs font-mono text-gray-500">
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#b46f32]" />
      <span>Loading...</span>
    </div>
  </div>
);

function AppContent({ initialLoading, showLoadingScreen, onInitialLoadComplete }) {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('arav_view_mode') || 'scroll'; // 'scroll' | 'routes'
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [currentRouteLabel, setCurrentRouteLabel] = useState('HOME');
  const isFirstMount = useRef(true);

  useLenis();
  useGlobalHoverSound();

  const handleToggleViewMode = () => {
    const nextMode = viewMode === 'scroll' ? 'routes' : 'scroll';
    setViewMode(nextMode);
    localStorage.setItem('arav_view_mode', nextMode);
    if (nextMode === 'scroll') {
      navigate('/');
    }
  };

  // Dynamic BGM Track Switching: Projects Section vs Default Ambient
  useEffect(() => {
    if (initialLoading) return;

    if (viewMode === 'routes') {
      if (location.pathname === '/work') {
        soundEngine.playBGM('projects');
      } else {
        soundEngine.playBGM('default');
      }
    } else {
      // Scroll Mode track detector
      const handleScrollTrack = () => {
        const projEl = document.getElementById('projects');
        if (projEl) {
          const rect = projEl.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.2) {
            if (soundEngine.currentTrack !== 'projects') {
              soundEngine.playBGM('projects');
            }
            return;
          }
        }
        if (soundEngine.currentTrack !== 'default') {
          soundEngine.playBGM('default');
        }
      };

      window.addEventListener('scroll', handleScrollTrack, { passive: true });
      return () => window.removeEventListener('scroll', handleScrollTrack);
    }
  }, [location.pathname, viewMode, initialLoading]);

  useEffect(() => {
    if (viewMode !== 'routes') return;

    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const routeMap = {
      '/': 'HOME',
      '/about': 'ABOUT',
      '/work': 'WORK',
      '/experience': 'EXPERIENCE',
      '/experiments': 'LABORATORY',
      '/contact': 'CONTACT'
    };

    const label = routeMap[location.pathname] || 'ARAV';
    setCurrentRouteLabel(label);
    setTransitioning(true);
  }, [location.pathname, viewMode]);

  const handleTransitionFinish = useCallback(() => {
    setTransitioning(false);
  }, []);

  return (
    <div className="bg-black min-h-screen text-[#f8fafc] relative selection:bg-[#b46f32]/30 selection:text-[#b46f32]">
      {/* Desktop Contextual Transparent Morphing Cursor */}
      <CustomCursor />

      {/* Analog Micro-Grain Texture Overlay */}
      <FilmGrain />

      {/* Cinematic Hindi & English Namaste Terminal Loader */}
      {showLoadingScreen && <LoadingScreen onComplete={onInitialLoadComplete} />}

      {/* Technical Text Scramble Route Transition Loader (only in Routes mode) */}
      {!initialLoading && viewMode === 'routes' && (
        <RouteLoader
          routeName={currentRouteLabel}
          isVisible={transitioning}
          onFinished={handleTransitionFinish}
        />
      )}

      {/* Main Experience Layout */}
      <div className={`transition-opacity duration-700 ${initialLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar viewMode={viewMode} onToggleViewMode={handleToggleViewMode} />

        {viewMode === 'scroll' ? (
          /* Single Page Continuous Scroll Mode: Home -> About -> Skills -> Work -> Experience -> Lab -> Contact */
          <>
            <SpatialNavHUD />
            <main>
              <Hero />
              <Suspense fallback={<LazyFallback />}>
                <About />
                <SkillsConstellation />
                <Projects />
                <Experience />
                <Experiments />
                <Contact />
              </Suspense>
            </main>
          </>
        ) : (
          /* Multi-Route Spatial Mode */
          <main className="relative z-10 min-h-screen">
            <Suspense fallback={<LazyFallback />}>
              <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/about" element={<AboutView />} />
                <Route path="/work" element={<WorkView />} />
                <Route path="/experience" element={<ExperienceView />} />
                <Route path="/experiments" element={<ExperimentsView />} />
                <Route path="/contact" element={<ContactView />} />
                <Route path="*" element={<HomeView />} />
              </Routes>
            </Suspense>
          </main>
        )}

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
    setTimeout(() => setShowLoadingScreen(false), 500);
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