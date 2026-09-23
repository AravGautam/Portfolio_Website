export const portfolioData = {
  personal: {
    name: "Arav Gautam",
    role: "Backend Engineer & Full-Stack Developer",
    tagline: "Backend Engineer Intern at Dream Filler Company. I build high-performance, resilient distributed systems and intuitive applications.",
    bio: "Backend Engineer Intern at Dream Filler Company and Computer Science student. Specialized in architecting high-throughput backend APIs, scalable database systems, machine learning workflows, and interactive 3D web experiences with clean, pragmatic engineering.",
    location: "Madhya Pradesh, India",
    status: "Backend Engineer Intern @ Dream Filler Company",
    resumeUrl: "https://drive.google.com/file/d/1URqmRAd0bKbM50Ez-6E2t2mRz1hW8Vz-/view?usp=sharing",
    email: "working.aravgautam@gmail.com",
    stats: [
      { value: "Backend", label: "Engineer Intern", sub: "Dream Filler Company" },
      { value: "200+", label: "DSA Solved", sub: "LeetCode & Codeforces" },
      { value: "7.8", label: "Current CGPA", sub: "B.Tech CSE (2023–2027)" },
      { value: "92%", label: "Model Accuracy", sub: "Fitness Prediction Engine" }
    ]
  },

  experience: [
    {
      id: "dream-filler",
      role: "Backend Engineer Intern",
      company: "Dream Filler Company",
      location: "Remote / Hybrid",
      duration: "Present",
      current: true,
      type: "Internship",
      description: "Engineering scalable backend architectures, high-performance RESTful APIs, and robust data management layers.",
      highlights: [
        "Architecting and optimizing high-throughput RESTful backend endpoints and API microservices",
        "Designing scalable database schemas, indexing strategies, and aggregation pipelines with Node.js, Express, and MongoDB",
        "Implementing authentication, JWT authorization, request validation, and resilient error-handling middleware",
        "Collaborating with cross-functional teams on distributed system design, code reviews, and API response latency optimization"
      ],
      skills: ["Node.js", "Express.js", "MongoDB", "REST APIs", "System Design", "JWT Auth", "Backend Engineering"]
    }
  ],

  education: {
    degree: "Bachelor of Technology in Computer Science & Engineering",
    institution: "Vindhya Institute of Technology and Science (VITS), RGPV",
    duration: "2023 — 2027",
    cgpa: "7.8",
    highlights: [
      "Rigorous core in Data Structures, Algorithms, Operating Systems, and DBMS",
      "Object-Oriented Software Design and REST API Architecture",
      "Active team leader in university hackathons and tech symposiums"
    ]
  },

  achievements: [
    {
      title: "Backend Engineer Intern @ Dream Filler",
      description: "Driving server-side service architecture, API performance tuning, and scalable database operations.",
      category: "Professional Experience"
    },
    {
      title: "200+ DSA Problems Solved",
      description: "Consistent problem-solving on LeetCode, Codeforces, GeeksforGeeks, and CodeChef focusing on Dynamic Programming, Trees, Graphs, and Greedy Algorithms.",
      category: "Problem Solving"
    },
    {
      title: "Hackathon Team Lead",
      description: "Led a 4-member developer team to design, build, and deploy functional prototypes during fast-paced 24-hour hackathons.",
      category: "Leadership"
    },
    {
      title: "Class Representative & Coordinator",
      description: "Organized collegiate technical workshops and departmental initiatives for over 100 students while serving as direct liaison with faculty.",
      category: "Community"
    }
  ],

  skillCategories: [
    {
      id: "languages",
      name: "Languages",
      skills: [
        { name: "Java", level: 88, tag: "OOP & Systems", desc: "Enterprise design, multithreading, data structures" },
        { name: "Python", level: 90, tag: "AI / ML & Scripting", desc: "Data processing, NumPy, Pandas, Scikit-learn" },
        { name: "C / C++", level: 85, tag: "Algorithms", desc: "Memory fundamentals, competitive programming" },
        { name: "JavaScript", level: 92, tag: "Full-Stack", desc: "Modern ES6+, async architectures, V8 runtime" },
        { name: "TypeScript", level: 82, tag: "Type Safety", desc: "Strict typing, maintainable codebases" }
      ]
    },
    {
      id: "frontend",
      name: "Frontend & WebGL",
      skills: [
        { name: "React", level: 92, tag: "UI Framework", desc: "State management, custom hooks, reusable components" },
        { name: "Next.js", level: 84, tag: "Full-Stack Web", desc: "Server components, routing, SSR/SSG" },
        { name: "Three.js / WebGL", level: 80, tag: "3D Graphics", desc: "Custom GLSL shaders, particle systems, scenes" },
        { name: "TailwindCSS", level: 94, tag: "Styling", desc: "Responsive layouts, sleek modern aesthetics" }
      ]
    },
    {
      id: "backend",
      name: "Backend & Systems",
      skills: [
        { name: "Node.js", level: 92, tag: "Runtime", desc: "Event-driven asynchronous backend services" },
        { name: "Express.js", level: 94, tag: "APIs", desc: "RESTful endpoints, middleware, authentication" },
        { name: "Socket.IO", level: 86, tag: "Real-Time", desc: "WebSockets, live game synchronization, rooms" },
        { name: "REST APIs", level: 95, tag: "Design", desc: "Clean contract design, pagination, error handling" }
      ]
    },
    {
      id: "database",
      name: "Database & Tools",
      skills: [
        { name: "MongoDB", level: 90, tag: "NoSQL", desc: "Mongoose schemas, indexing, aggregation" },
        { name: "MySQL", level: 84, tag: "SQL", desc: "Relational modeling, normalization, queries" },
        { name: "Git & GitHub", level: 92, tag: "Workflow", desc: "Version control, branching, PR collaboration" },
        { name: "Postman", level: 90, tag: "Testing", desc: "API testing, payload validation, mock servers" }
      ]
    },
    {
      id: "ai_data",
      name: "AI & Machine Learning",
      skills: [
        { name: "Scikit-Learn", level: 86, tag: "Models", desc: "RandomForest, regression analysis, evaluation" },
        { name: "NumPy & Pandas", level: 88, tag: "Data Analysis", desc: "Data wrangling, matrix manipulation" },
        { name: "Streamlit", level: 90, tag: "ML Deployment", desc: "Interactive dashboards for data applications" }
      ]
    }
  ],

  projects: [
    {
      id: "ai-fitness",
      index: "01",
      visualType: "neural",
      title: "AI-Powered Personal Fitness Tracker",
      category: "Machine Learning & Analytics",
      shortDesc: "End-to-end ML application achieving 92% calorie prediction accuracy with personalized feedback and health insights.",
      fullDesc: "Built an intelligent fitness platform using a trained RandomForest Regressor to predict calorie expenditure with 92% accuracy. Designed exploratory data analysis and feature engineering pipelines with NumPy and Pandas, deployed to Streamlit Cloud with an interactive analytics dashboard that increased simulated user adherence by 40%.",
      stats: [
        { label: "Prediction Accuracy", value: "92%" },
        { label: "User Adherence", value: "+40%" },
        { label: "Core Model", value: "RandomForest" }
      ],
      tags: ["Python", "Scikit-learn", "Streamlit", "NumPy", "Pandas", "Machine Learning"],
      githubLink: "https://github.com/CodeCosmonautArav/Internship_Project",
      liveLink: "https://personal-fitness-tracker-01.streamlit.app/",
      accentColor: "#00f0ff",
      features: [
        "Predictive calorie expenditure engine powered by Scikit-learn",
        "Interactive charts and personalized fitness metrics",
        "Automated data preprocessing & feature scaling pipeline",
        "Deployed to Streamlit Cloud for instant accessibility"
      ]
    },
    {
      id: "chess-platform",
      index: "02",
      visualType: "chess",
      title: "Real-Time Online Chess Platform",
      category: "Real-Time Web Application",
      shortDesc: "Multiplayer networked chess platform featuring sub-50ms move validation, room matchmaking, and synchronized board state.",
      fullDesc: "Engineered a low-latency multiplayer chess platform built with React, Node.js, Socket.IO, and Chess.js. Supports live room creation, spectator-ready WebSocket synchronization, strict move validation, and a responsive interface designed for fast-paced play across devices.",
      stats: [
        { label: "Sync Latency", value: "<50ms" },
        { label: "Protocol", value: "WebSockets" },
        { label: "Ruleset Engine", value: "Chess.js" }
      ],
      tags: ["React", "Node.js", "Socket.IO", "Chess.js", "Express", "TailwindCSS"],
      githubLink: "https://github.com/AravGautam/Chess-MinorProject",
      liveLink: "https://minorproject-chessmaster.vercel.app/",
      accentColor: "#ff3344",
      features: [
        "Instant bi-directional state synchronization via Socket.IO",
        "Full FIDE ruleset enforcement, checkmate detection & legal move indicators",
        "Custom room creation, invite codes, and live player clocks",
        "Responsive board layout with touch drag-and-drop support"
      ]
    },
    {
      id: "mern-collection",
      index: "03",
      visualType: "network",
      title: "Full-Stack MERN Application Suite",
      category: "Full-Stack Architecture",
      shortDesc: "Modular suite of full-stack services including Task Management, Notes Hub, Student Directory, and Climate Tracker.",
      fullDesc: "A production-tested collection of web services demonstrating robust REST API design, JWT authentication, and structured MongoDB data modeling. Features reactive React interfaces paired with modular Express services for predictable, resilient data management.",
      stats: [
        { label: "Core Modules", value: "4 Services" },
        { label: "Database", value: "MongoDB" },
        { label: "API Pattern", value: "RESTful" }
      ],
      tags: ["MongoDB", "Express.js", "React", "Node.js", "REST APIs", "Mongoose"],
      githubLink: "https://github.com/AravGautam/Clg_Training-Internship-MERN-Projects",
      liveLink: null,
      accentColor: "#3b82f6",
      features: [
        "Clean MVC backend architecture with request validation",
        "RESTful API endpoints with structured error handling",
        "Optimized MongoDB schemas and indexing for fast queries",
        "Reusable atomic React components with responsive design"
      ]
    }
  ],

  experiments: [
    {
      id: "lidar-portrait",
      title: "3D LiDAR Particle Portrait",
      category: "Point-Cloud / Depth",
      desc: "Sampling image luminance depth into 15,000+ interactive 3D particles with cursor repulsion and dispersion physics.",
      tags: ["Three.js", "Point Cloud", "Depth Map"],
      interactive: true
    },
    {
      id: "particle-vortex",
      title: "Interactive Particle Vortex",
      category: "WebGL / Compute",
      desc: "Simulating organic particle flows driven by harmonic trigonometric curves in a lightweight canvas pipeline.",
      tags: ["Three.js", "Particles", "Math"],
      interactive: true
    },
    {
      id: "matrix-manifold",
      title: "Generative Wave Topology",
      category: "Procedural Geometry",
      desc: "Real-time procedural vector terrain dynamically oscillating with smooth frequency modulation.",
      tags: ["Trigonometry", "Canvas", "Waveforms"],
      interactive: true
    },
    {
      id: "synaptic-mesh",
      title: "Interactive Neural Mesh",
      category: "Graph Visualization",
      desc: "Spatial graph simulation visualizing signal propagation across interconnected nodes.",
      tags: ["Graph Theory", "Spatial Nodes"],
      interactive: true
    }
  ],

  socialLinks: [
    {
      id: "email",
      label: "Email",
      handle: "working.aravgautam@gmail.com",
      href: "mailto:working.aravgautam@gmail.com",
      icon: "Mail"
    },
    {
      id: "github",
      label: "GitHub",
      handle: "AravGautam",
      href: "https://github.com/AravGautam/",
      icon: "Github"
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      handle: "Arav Gautam",
      href: "https://www.linkedin.com/in/arav-gautam-007swerty2024/",
      icon: "Linkedin"
    },
    {
      id: "twitter",
      label: "𝕏 (Twitter)",
      handle: "@_i_m_arav__",
      href: "https://x.com/_i_m_arav__",
      icon: "Twitter"
    },
    {
      id: "instagram",
      label: "Instagram",
      handle: "@_i_m_arav__",
      href: "https://www.instagram.com/_i_m_arav__/",
      icon: "Instagram"
    }
  ]
};
