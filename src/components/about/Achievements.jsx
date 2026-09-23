import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Award, Code2, Users, Trophy } from 'lucide-react';

const Achievements = () => {
  const getIcon = (cat) => {
    if (cat.includes('Problem')) return <Code2 className="w-4 h-4 text-[#b46f32]" />;
    if (cat.includes('Leadership')) return <Trophy className="w-4 h-4 text-[#c27a3c]" />;
    return <Users className="w-4 h-4 text-emerald-400" />;
  };

  // Display the 3 distinct milestones (excluding the internship which has its own primary section)
  const items = portfolioData.achievements.filter(a => a.category !== 'Professional Experience');

  return (
    <div className="p-7 sm:p-8 rounded-3xl bg-[#0a0a0c] border border-white/10 shadow-2xl space-y-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#b46f32] uppercase tracking-wider mb-4">
          <Award className="w-4 h-4" />
          <span>Key Milestones & Leadership</span>
        </div>

        <div className="space-y-3.5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#b46f32]/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {getIcon(item.category)}
                  <span className="text-xs font-mono font-medium text-[#b46f32]">
                    {item.category}
                  </span>
                </div>
              </div>

              <h5 className="font-display font-bold text-white text-sm sm:text-base mb-1">
                {item.title}
              </h5>

              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;