import React from 'react';

const SkillItem = ({ icon, name }) => {
  return (
    <div className="bg-[#0a0a0c] p-4 rounded-lg border border-white/10 text-white hover:translate-x-2 hover:border-[#b46f32]/50 transition-all duration-300">
      <span className="text-xl">{icon}</span> {name}
    </div>
  );
};

export default SkillItem;