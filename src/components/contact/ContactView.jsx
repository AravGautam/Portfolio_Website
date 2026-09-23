import React, { useState, useCallback } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { GlobeScene } from '../webgl/GlobeScene';
import { Send, Check, Copy, ExternalLink, Radio, Mail, Github, Linkedin, Twitter, Instagram, RefreshCw } from 'lucide-react';
import MagneticWrapper from '../ui/MagneticWrapper';
import { soundEngine } from '../../audio/soundEngine';
import AudioCreditsModal from '../ui/AudioCreditsModal';

export const ContactView = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'success'
  const [copied, setCopied] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const createGlobeScene = useCallback((container) => {
    return new GlobeScene(container);
  }, []);

  const copyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundEngine.playClick();

    if (formData.honeypot) {
      setFormStatus('success');
      return;
    }

    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
    }, 800);
  };

  const getSocialIcon = (id) => {
    switch (id) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-black flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#b46f32] mb-3 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5" />
              <span>GLOBAL REACH & DIRECT CONTACT</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight uppercase">
              LET'S BUILD SOMETHING GREAT.
            </h1>
          </div>

          <div className="font-mono text-xs text-gray-300 bg-[#0a0a0c] border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md">
            <span className="text-[#b46f32] font-bold">LOCATION:</span> Madhya Pradesh, India <br />
            <span className="text-gray-400">STATUS: OPEN FOR NEW OPPORTUNITIES</span>
          </div>
        </div>

        {/* 3D Earth Globe (Left) + Contact Form & Channels (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3D Earth Globe (7 cols) */}
          <div
            className="lg:col-span-7 relative h-[420px] sm:h-[540px] rounded-3xl bg-[#0a0a0c] border border-white/10 overflow-hidden flex flex-col justify-between p-6 shadow-2xl"
            data-cursor="DRAG"
          >
            {/* Top Overlay */}
            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 text-xs bg-black/80 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-200 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b46f32]" />
                <span>Madhya Pradesh, India</span>
              </div>
              <span className="font-mono text-xs text-gray-400">3D Earth</span>
            </div>

            {/* 3D Globe WebGL Canvas */}
            <div className="absolute inset-0 z-0">
              <WebGLCanvas createScene={createGlobeScene} className="w-full h-full" />
            </div>

            {/* Bottom Geospatial Info */}
            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/5 font-mono text-[11px] text-gray-400 pointer-events-none">
              <span>Drag to rotate</span>
              <span className="text-[#b46f32]">Open for Worldwide Roles</span>
            </div>
          </div>

          {/* Right Column: Contact Action Form + Social Matrix (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Form Card */}
            <div className="p-7 rounded-3xl bg-[#0a0a0c] border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#b46f32] uppercase tracking-wider font-bold">
                  GET IN TOUCH
                </span>
                <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ONLINE
                </span>
              </div>

              {formStatus === 'success' ? (
                <div className="py-6 text-center space-y-3 animate-in fade-in duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#b46f32]/15 border border-[#b46f32]/40 text-[#b46f32] mx-auto flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-white">Message Sent</h4>
                  <p className="text-xs text-gray-300 font-normal">
                    Thank you! Your message has been delivered to Arav's inbox.
                  </p>
                  <button
                    onClick={() => {
                      setFormStatus('idle');
                      setFormData({ name: '', email: '', message: '', honeypot: '' });
                    }}
                    className="px-5 py-2 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-white hover:border-[#b46f32] transition-colors flex items-center gap-1.5 mx-auto mt-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Send Another</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  <div>
                    <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                      NAME
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name or organization"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-[#b46f32] focus:outline-none text-white text-xs font-mono placeholder:text-gray-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-[#b46f32] focus:outline-none text-white text-xs font-mono placeholder:text-gray-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                      MESSAGE
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message or project scope..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-[#b46f32] focus:outline-none text-white text-xs font-mono placeholder:text-gray-600 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="flex-1 py-3 rounded-full bg-[#b46f32] text-white font-mono font-bold text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      {formStatus === 'sending' ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>TRANSMITTING...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>SEND MESSAGE</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={copyEmail}
                      className="px-4 py-3 rounded-full border border-white/15 bg-white/5 text-gray-300 hover:border-[#b46f32] hover:text-[#b46f32] transition-all text-xs font-mono flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#b46f32]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Connected Signal Matrix Channels */}
            <div className="p-6 rounded-3xl bg-[#0a0a0c] border border-white/10 backdrop-blur-xl shadow-xl space-y-3">
              <div className="font-mono text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                CONNECTED SIGNAL CHANNELS
              </div>

              <div className="space-y-2">
                {portfolioData.socialLinks.map((link) => (
                  <MagneticWrapper key={link.id} strength={0.2} className="w-full">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#b46f32]/40 hover:bg-[#b46f32]/5 transition-all duration-200 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="text-gray-400 group-hover:text-[#b46f32] transition-colors">
                          {getSocialIcon(link.id)}
                        </div>
                        <span className="font-display font-bold text-xs text-white group-hover:text-[#b46f32] transition-colors">
                          {link.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-gray-400">
                          {link.handle}
                        </span>
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#b46f32] transition-colors" />
                      </div>
                    </a>
                  </MagneticWrapper>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clean Minimal Footer & Audio Credits Link */}
        <div className="pt-16 mt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div>
            © {new Date().getFullYear()} Arav Gautam • Handcrafted with React & Three.js
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowCredits(true);
            }}
            className="hover:text-[#b46f32] transition-colors flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
          >
            <span>Audio & Asset Credits</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Audio Credits Modal */}
      <AudioCreditsModal isOpen={showCredits} onClose={() => setShowCredits(false)} />
    </div>
  );
};

export default ContactView;
