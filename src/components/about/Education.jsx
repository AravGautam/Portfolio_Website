import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';

const Education = () => {
  const { education } = portfolioData;

  return (
    <div className="p-7 sm:p-8 rounded-3xl bg-[#0a0a0c] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-[#b46f32]/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#b46f32] uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Formal Education</span>
        </div>
        <div className="text-xs font-mono text-[#b46f32] bg-[#b46f32]/10 border border-[#b46f32]/30 px-3 py-1 rounded-full font-semibold">
          CGPA: 7.8 / 10.0
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
            <CheckCircle2 className="w-3.5 h-3.5 text-[#b46f32] shrink-0 mt-0.5" />
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