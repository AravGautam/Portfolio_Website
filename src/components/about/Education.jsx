import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';

const Education = () => {
  const { education } = portfolioData;

  return (
    <div className="p-7 sm:p-8 rounded-3xl bg-[#0a0a0c]/80 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Education</span>
        </div>
        <div className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full font-semibold">
          CGPA: 7.85 / 10.0
        </div>
      </div>

      <h4 className="font-display font-bold text-xl sm:text-2xl text-white mb-1.5">
        {education.degree}
      </h4>

      <p className="text-sm text-gray-300 mb-4 font-medium">
        {education.institution}
      </p>

      <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-5 font-normal">
        <Calendar className="w-3.5 h-3.5 text-gray-400" />
        <span>{education.duration}</span>
      </div>

      <div className="space-y-2.5 pt-4 border-t border-white/5">
        {education.highlights.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <span className="text-xs text-gray-300 leading-relaxed font-normal">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;