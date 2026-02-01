import React from 'react';
import { useScrollAnimation, animations } from '../hooks/useScrollAnimation';
import SkillItem from './SkillItem';
import Education from './Education';
import Achievements from './Achievements';

const About = () => {
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.3, once: true });
  const [contentRef, contentVisible] = useScrollAnimation({ threshold: 0.2, once: true });
  const [skillsRef, skillsVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  const skills = [
    { icon: '☕', name: 'Java, Python, C/C++' },
    { icon: '⚛️', name: 'MERN Stack & Next.js' },
    { icon: '🔧', name: 'Node.js & Express' },
    { icon: '💾', name: 'MongoDB & MySQL' },
    { icon: '🤖', name: 'AI/ML & Data Science' },
    { icon: '🛠️', name: 'Git, VS Code, Postman' }
  ];

  return (
    <section id="about" className="py-24 px-[5%] bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Animated Title */}
        <div
          ref={titleRef}
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1)',
          }}
        >
          <h2 className="text-5xl font-bold text-white text-center mb-12">
            About <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">Me</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left Column - Content (Slide in from left) */}
          <div
            ref={contentRef}
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'all 1s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s',
            }}
          >
            <div className="text-gray-300 text-lg leading-relaxed">
              <h3 className="text-white text-2xl font-semibold mb-4">Career Objective</h3>
              <p className="mb-6">
                Enthusiastic Computer Science student with hands-on experience in MERN stack development, algorithms, and AI concepts. Passionate about building efficient, user-focused applications and solving challenging technical problems through innovative software solutions.
              </p>
              
              <Education />
              <Achievements />

              <a 
                href="https://drive.google.com/file/d/1URqmRAd0bKbM50Ez-6E2t2mRz1hW8Vz-/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300"
              >
                📄 View Résumé
              </a>
            </div>
          </div>

          {/* Right Column - Skills (Slide in from right with stagger) */}
          <div
            ref={skillsRef}
            style={{
              opacity: skillsVisible ? 1 : 0,
              transform: skillsVisible ? 'translateX(0)' : 'translateX(60px)',
              transition: 'all 1s cubic-bezier(0.17, 0.55, 0.55, 1) 0.4s',
            }}
          >
            <h3 className="text-white text-xl font-semibold mb-4">Technical Skills</h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  style={{
                    opacity: skillsVisible ? 1 : 0,
                    transform: skillsVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) ${0.6 + index * 0.1}s`,
                  }}
                >
                  <SkillItem icon={skill.icon} name={skill.name} />
                </div>
              ))}
            </div>
            
            <div 
              className="mt-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/20 backdrop-blur-sm"
              style={{
                opacity: skillsVisible ? 1 : 0,
                transform: skillsVisible ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 1.2s',
              }}
            >
              <h4 className="text-white font-semibold mb-2">Core Competencies</h4>
              <p className="text-gray-300 text-sm">Data Structures & Algorithms, Operating Systems, DBMS, REST APIs, Object-Oriented Programming, Algorithm Analysis & Design</p>
            </div>

            <div 
              className="mt-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/20 backdrop-blur-sm"
              style={{
                opacity: skillsVisible ? 1 : 0,
                transform: skillsVisible ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 1.4s',
              }}
            >
              <h4 className="text-white font-semibold mb-2">Soft Skills</h4>
              <p className="text-gray-300 text-sm">Problem-solving, Team Leadership, Time Management, Adaptability, Fast Learning, Communication</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;