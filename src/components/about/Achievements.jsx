import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Award, Code2, Users, Trophy } from 'lucide-react';

const Achievements = () => {
  const getIcon = (cat) => {
    if (cat.includes('Problem')) return <Code2 className="w-4 h-4 text-[#00f0ff]" />;
    if (cat.includes('Leadership')) return <Trophy className="w-4 h-4 text-[#8b5cf6]" />;
    return <Users className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="p-8 rounded-3xl bg-[#0e0e14]/70 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 uppercase tracking-wider">
        <Award className="w-4 h-4" />
        <span>Key Milestones & Leadership</span>
      </div>

      <div className="space-y-4">
        {portfolioData.achievements.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getIcon(item.category)}
                <span className="text-xs font-medium text-[#00f0ff]">
                  {item.category}
                </span>
              </div>
            </div>

            <h5 className="font-display font-bold text-white text-base mb-1.5">
              {item.title}
            </h5>

            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;