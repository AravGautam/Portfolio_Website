import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.3, once: true });
  const [cardsRef, cardsVisible] = useScrollAnimation({ threshold: 0.1, once: true });

  const projects = [
    {
      emoji: '🤖',
      title: 'AI-Powered Personal Fitness Tracker',
      description: 'Developed an AI-based fitness application achieving 92% calorie prediction accuracy using RandomForest Regressor. Designed data pipelines with NumPy, Pandas, Matplotlib, and Scikit-learn for model training and analytics. Deployed via Streamlit Cloud, improving accessibility and interactivity. Improved user adherence by 40% through personalized feedback.',
      tags: ['Python', 'Machine Learning', 'Scikit-learn', 'Streamlit', 'NumPy', 'Pandas'],
      githubLink: 'https://github.com/CodeCosmonautArav/Internship_Project',
      liveLink: 'https://personal-fitness-tracker-01.streamlit.app/'
    },
    {
      emoji: '♟️',
      title: 'Real-Time Online Chess Platform',
      description: 'Built a multiplayer chess web application using React, Node.js, Socket.IO, and Chess.js. Implemented real-time gameplay with move validation and socket-based synchronization. Added authentication, room management, and responsive UI for seamless user experience across devices.',
      tags: ['React', 'Node.js', 'Socket.IO', 'Chess.js', 'Real-time'],
      githubLink: 'https://github.com/AravGautam/Chess-MinorProject',
      liveLink: 'https://minorproject-chessmaster.vercel.app/'
    },
    {
      emoji: '📦',
      title: 'MERN Stack Mini Projects Collection',
      description: 'Comprehensive collection of MERN-based applications including To-Do List, Notes Organizer, Student Lister, and Climate App. Demonstrated CRUD operations, REST API design, and seamless frontend-backend integration using MongoDB, Express, React, and Node.js.',
      tags: ['MongoDB', 'Express', 'React', 'Node.js', 'REST API'],
      githubLink: 'https://github.com/AravGautam/Clg_Training-Internship-MERN-Projects',
      liveLink: null
    }
  ];

  return (
    <section id="projects" className="py-24 px-[5%] bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
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
          <h2 className="text-5xl font-bold text-white text-center mb-4">
            Featured <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            A showcase of my technical projects spanning AI/ML, full-stack development, and real-time applications
          </p>
        </div>

        {/* Project Cards with Sequential Animation */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              style={{
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                transition: `all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${index * 0.2}s`,
              }}
            >
              <ProjectCard {...project} />
            </div>
          ))}
        </div>

        {/* View More Button (Optional) */}
        <div
          className="text-center mt-12"
          style={{
            opacity: cardsVisible ? 1 : 0,
            transform: cardsVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 0.8s',
          }}
        >
          <a
            href="https://github.com/AravGautam"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 border-2 border-purple-500/50 text-white font-semibold rounded-full hover:bg-purple-500/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 backdrop-blur-sm group"
          >
            <span className="mr-2">View All Projects</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;