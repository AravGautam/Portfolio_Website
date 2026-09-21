import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Mail, Github, Linkedin, Twitter, Instagram, Copy, Check, Send } from 'lucide-react';

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getSocialIcon = (id) => {
    switch (id) {
      case 'github': return <Github className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      default: return <Mail className="w-5 h-5" />;
    }
  };

  return (
    <section id="contact" className="relative py-28 px-6 md:px-12 bg-[#07070a] border-t border-white/5 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#00f0ff]/10 via-[#8b5cf6]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {/* Top Tagline */}
        <div className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff] mb-6">
          Get In Touch
        </div>

        {/* Big Impact Typography */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tight leading-tight mb-8 uppercase">
          LET'S BUILD <br />
          <span className="bg-gradient-to-r from-white via-gray-200 to-[#00f0ff] bg-clip-text text-transparent">
            SOMETHING.
          </span>
        </h2>

        <p className="text-gray-300 text-base sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
          I'm always open to discussing new opportunities, full-stack software roles, or creative collaborations.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href={`mailto:${portfolioData.personal.email}`}
            className="w-full sm:w-auto text-xs sm:text-sm font-semibold px-8 py-4 rounded-full bg-white text-black hover:bg-[#00f0ff] hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Send an Email</span>
          </a>

          <button
            onClick={copyEmail}
            className="w-full sm:w-auto text-xs sm:text-sm font-medium px-7 py-4 rounded-full border border-white/15 bg-[#0e0e14]/80 text-gray-200 hover:border-white/40 hover:text-white backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#00f0ff]" />
                <span className="text-[#00f0ff]">Email Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-400" />
                <span>{portfolioData.personal.email}</span>
              </>
            )}
          </button>
        </div>

        {/* Social Matrix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {portfolioData.socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-[#0e0e14]/60 border border-white/5 hover:border-[#00f0ff]/40 hover:bg-[#0e0e14] transition-all duration-300 flex flex-col items-center justify-center gap-2 group backdrop-blur-md"
            >
              <div className="text-gray-400 group-hover:text-[#00f0ff] transition-colors">
                {getSocialIcon(link.id)}
              </div>
              <span className="font-display font-bold text-xs text-white group-hover:text-[#00f0ff] transition-colors">
                {link.label}
              </span>
              <span className="text-[11px] text-gray-400 font-normal">
                {link.handle}
              </span>
            </a>
          ))}
        </div>

        {/* Location Note */}
        <div className="mt-16 pt-8 border-t border-white/5 text-xs text-gray-400 flex flex-wrap items-center justify-center gap-3 font-normal">
          <span>📍 Satna, Madhya Pradesh, India</span>
          <span className="text-white/20">•</span>
          <span>DM open on 𝕏 & Instagram</span>
        </div>
      </div>
    </section>
  );
};

export default Contact;