import React from 'react';
import { Layers, Zap, Cpu, Sparkles } from 'lucide-react';

const Introduction = () => {
  const pillars = [
    {
      icon: <Layers className="w-5 h-5 text-[#00f0ff]" />,
      title: "Full-Stack Development",
      desc: "Architecting responsive frontends with React & Next.js backed by decoupled, scalable Node.js services."
    },
    {
      icon: <Zap className="w-5 h-5 text-[#8b5cf6]" />,
      title: "Real-Time Systems",
      desc: "Building low-latency WebSocket communication pipelines with Socket.IO for multiplayer and live data."
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#3b82f6]" />,
      title: "Machine Learning & AI",
      desc: "Training predictive models with Scikit-learn, building data pipelines, and deploying interactive ML apps."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      title: "Creative Web & WebGL",
      desc: "Leveraging Three.js and custom GLSL shaders to design memorable, high-performance visual experiences."
    }
  ];

  return (
    <section className="relative py-28 px-6 md:px-12 bg-[#07070a] border-y border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Statement */}
        <div className="mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff] mb-4">
            Engineering & Design Philosophy
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-white tracking-tight leading-tight max-w-4xl mb-6">
            "I build software that <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-gray-200 to-[#00f0ff] bg-clip-text text-transparent">
              does more than work.
            </span>"
          </h2>

          <p className="text-gray-400 text-base sm:text-xl max-w-3xl leading-relaxed font-normal">
            Blending computer science fundamentals with modern interactive web technologies to build performant, visually striking, and reliable digital systems.
          </p>
        </div>

        {/* 4 Architectural Focus Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0e0e14]/70 border border-white/5 hover:border-white/20 backdrop-blur-md transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Introduction;
