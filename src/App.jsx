import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import Introduction from './components/about/Introduction';
import Projects from './components/projects/Projects';
import SkillsConstellation from './components/about/SkillsConstellation';
import About from './components/about/About';
import Experiments from './components/experiments/Experiments';
import Contact from './components/contact/Contact';
import LoadingScreen from './components/layout/LoadingScreen';
import CustomCursor from './components/ui/CustomCursor';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [loading]);

  const handleLoadingComplete = () => {
    setLoading(false);
    setTimeout(() => setShowLoadingScreen(false), 600);
  };

  return (
    <div className="bg-[#07070a] min-h-screen text-[#f4f4f6] relative selection:bg-[#00f0ff]/30 selection:text-[#00f0ff]">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* High-Tech Terminal Fast Loader */}
      {showLoadingScreen && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Main Experience Layout */}
      <div className={`transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
        <main>
          <Hero />
          <Introduction />
          <Projects />
          <SkillsConstellation />
          <About />
          <Experiments />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}