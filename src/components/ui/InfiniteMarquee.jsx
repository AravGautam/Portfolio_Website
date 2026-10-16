import React from 'react';
import { Zap, Server, Code, Cpu, Database, Globe, Layers, ShieldCheck } from 'lucide-react';

const MARQUEE_ITEMS = [
  { text: 'HIGH-THROUGHPUT REST APIS', icon: Zap },
  { text: 'DISTRIBUTED SYSTEMS', icon: Server },
  { text: '200+ DSA PROBLEMS SOLVED', icon: Code },
  { text: 'WEBSOCKETS & REAL-TIME STATE', icon: Cpu },
  { text: 'SCALABLE DATABASE SCHEMAS', icon: Database },
  { text: 'THREE.JS & 3D WEB GRAPHICS', icon: Globe },
  { text: 'MICROSERVICES ARCHITECTURE', icon: Layers },
  { text: 'JWT AUTH & SECURE ENDPOINTS', icon: ShieldCheck },
];

export const InfiniteMarquee = () => {
  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-[#0a0a0c]/60 backdrop-blur-md py-3.5 select-none z-20">
      {/* Left and Right Gradient Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-black to-transparent z-10" />

      {/* Marquee Track */}
      <div className="animate-marquee flex items-center gap-5">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 whitespace-nowrap text-xs font-mono font-medium text-gray-300 hover:text-white hover:border-blue-400/50 hover:bg-blue-500/10 transition-colors"
            >
              <Icon className="w-3.5 h-3.5 text-blue-400" />
              <span className="tracking-wider">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfiniteMarquee;
