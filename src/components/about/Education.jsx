import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';

const Education = () => {
  const { education } = portfolioData;

  return (
    <div className="p-8 rounded-3xl bg-[#0e0e14]/70 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00f0ff] uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Education</span>
        </div>
        <div className="text-xs text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-3 py-1 rounded-full font-semibold">
          CGPA: {education.cgpa} / 10.0
        </div>
      </div>

      <h4 className="font-display font-bold text-xl sm:text-2xl text-white mb-1">
        {education.degree}
      </h4>

      <p className="text-sm text-gray-300 mb-4 font-medium">
        {education.institution}
      </p>

      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-normal">
        <Calendar className="w-3.5 h-3.5 text-gray-400" />
        <span>{education.duration}</span>
      </div>

      <div className="space-y-2.5 pt-4 border-t border-white/5">
        {education.highlights.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00f0ff] shrink-0 mt-0.5" />
            <span className="text-xs text-gray-400 leading-relaxed font-normal">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;