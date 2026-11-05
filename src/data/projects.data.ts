export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: "Creative Technology" | "AI & Systems" | "Web Applications" | "Algorithms & Games";
  shortDescription: string;
  fullDescription: string;
  problemSolved: string;
  keyFeatures: string[];
  techStack: string[];
  githubRepoName: string;
  liveDemoUrl?: string;
  interactivePreviewType?: "pulse-visualizer" | "timetable-grid" | "snake-simulation" | "uno-preview";
  badge?: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "pulse-visualizer",
    title: "PULSE Music Visualizer",
    tagline: "Real-time browser audio analysis and dynamic visual reactive canvas",
    category: "Creative Technology",
    shortDescription:
      "A browser-based real-time music visualizer utilizing Web Audio API frequency analysis and Canvas 2D rendering across 6 custom visualization modes and 5 color palettes.",
    fullDescription:
      "PULSE transforms audio signals into responsive geometric and particle visual experiences directly in the browser. It features real-time fast Fourier transform (FFT) analysis, responsive beat detection, microphone input, system audio capture, and keyboard-driven controls.",
    problemSolved:
      "Delivering zero-latency real-time canvas visual effects without heavy external libraries or audio processing bottlenecks.",
    keyFeatures: [
      "Real-time audio frequency and time-domain analysis via Web Audio API",
      "Dynamic beat detection engine reacting to bass and transient peaks",
      "6 visualization modes: Circular Waveform, Frequency Bars, Orbiting Particles, Tunnel Rays, Radial Peaks, Sine Ribbon",
      "5 procedural color palettes including Cyberpunk, Deep Ocean, and Bioluminescent Violet",
      "Microphone input and system audio capture with responsive canvas scaling",
    ],
    techStack: ["HTML5", "CSS3", "JavaScript", "Web Audio API", "Canvas 2D API", "requestAnimationFrame"],
    githubRepoName: "pulse-music-visualizer",
    interactivePreviewType: "pulse-visualizer",
    badge: "Featured Experience",
  },
  {
    id: "ai-advisor",
    title: "AI Advisor for Students",
    tagline: "AI-powered academic command center and personalized study companion",
    category: "AI & Systems",
    shortDescription:
      "An AI-driven student command center bringing academic planning, personalized knowledge graphs, adaptive tutoring, and learning workflows into one cohesive application.",
    fullDescription:
      "Built with React, TypeScript, and Google's Gemini API, this application serves as an integrated academic workspace for university students. It combines structured academic planning with conversational assistance, citation verification, active recall quizzes, and project breakdown tools.",
    problemSolved:
      "Consolidating fragmented student tools—syllabi, scheduling, active recall practice, and tutoring—into a unified, context-aware command center.",
    keyFeatures: [
      "Personalized knowledge graph and syllabus companion",
      "Adaptive STEM tutoring assistant powered by Google Gemini API",
      "Daily focus, academic planning, and citation verification workflows",
      "Interactive active recall quiz generation and oral examination simulation",
      "State management using Zustand with Firebase Authentication and Firestore storage",
    ],
    techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Recharts", "Google Gemini API", "Firebase", "Zustand"],
    githubRepoName: "AI-Advisor-for-Student",
    badge: "AI & Systems",
  },
  {
    id: "timetabx",
    title: "SlotSync (timetabx)",
    tagline: "IIT Gandhinagar slot-based timetable generator and conflict resolver",
    category: "Web Applications",
    shortDescription:
      "A timetable generation and clash-detection tool designed to help IIT Gandhinagar students create personalized schedules from official semester slot spreadsheets.",
    fullDescription:
      "SlotSync parses official institute timetable spreadsheets to provide an intuitive interface for course selection, instant conflict detection, weekly schedule visualization, day timelines, and room occupancy browsing, complete with multi-format exports.",
    problemSolved:
      "Eliminating the manual friction and scheduling conflicts students face every semester when planning courses from multi-page institute timetable sheets.",
    keyFeatures: [
      "Official timetable spreadsheet parsing via SheetJS",
      "Instant course slot clash detection and color-coded conflict warnings",
      "Weekly grid schedule and chronological day timeline views",
      "Room occupancy browser for study and project group planning",
      "Export directly to PNG, PDF, CSV, and iCal calendar format invites",
    ],
    techStack: ["TanStack Start", "React 19", "TypeScript", "Tailwind CSS", "shadcn/ui", "Supabase", "SheetJS", "jsPDF", "ical.js"],
    githubRepoName: "timetabx",
    liveDemoUrl: "https://timetabx.lovable.app",
    badge: "Institute Utility",
  },
  {
    id: "campus-radar",
    title: "CampusRadar",
    tagline: "Source-first opportunity discovery platform for Indian college students",
    category: "Web Applications",
    shortDescription:
      "A student opportunity discovery platform focused on primary-source verification, eligibility transparency, and reliable tracking for research fellowships, hackathons, and scholarships.",
    fullDescription:
      "CampusRadar addresses the rampant clutter, expired listings, and misleading eligibility in student opportunity boards. Built with Next.js, TypeScript, and Supabase, it provides verified primary-source citations, transparent quality scoring, bookmarking, and email notifications.",
    problemSolved:
      "Preventing college students from wasting time on unverified, spammy, or expired internship and fellowship postings.",
    keyFeatures: [
      "Primary-source verification and eligibility clarity breakdown",
      "Coverage of research fellowships, national hackathons, scholarships, and internships",
      "Transparent opportunity quality scoring algorithm",
      "Personalized student bookmarking and application stage tracking",
      "PostgreSQL database with strict Row-Level Security (RLS) policies",
    ],
    techStack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Vitest", "Vercel Cron", "Resend"],
    githubRepoName: "CampusRadar",
    badge: "Platform Architecture",
  },
  {
    id: "alpha-snake",
    title: "AlphaSnake",
    tagline: "Competitive multi-layered heuristic decision engine for snake games",
    category: "Algorithms & Games",
    shortDescription:
      "A strategy-driven snake bot utilizing BFS flood fill, Voronoi territory control, competitive distance analysis, and opponent danger-zone prediction.",
    fullDescription:
      "Developed in Python 3.12 without external heavy dependencies, AlphaSnake uses a hierarchical decision tree. It evaluates immediate survival, calculates available space via flood fill, partitions the grid with Voronoi metrics to measure territory control against opponents, and employs fallback strategies during low-latency scenarios.",
    problemSolved:
      "Balancing aggressive food acquisition against long-term territory traps and opponent cut-off maneuvers in constrained competitive grid spaces.",
    keyFeatures: [
      "Breadth-First Search (BFS) flood fill for guaranteed enclosed-space survival checking",
      "Voronoi territory partitioning to quantify board control against competitors",
      "Weighted apple scoring factoring distance, border proximity, and path safety",
      "Opponent danger-zone prediction and proactive head-to-head collision avoidance",
      "Zero-dependency pure Python 3.12 implementation with microsecond evaluation loops",
    ],
    techStack: ["Python 3.12", "Graph Algorithms", "Heuristic Search", "Voronoi Partitioning", "Game AI"],
    githubRepoName: "AlphaSnake",
    badge: "Algorithmic AI",
  },
  {
    id: "uno-game",
    title: "UNO Card Game",
    tagline: "Interactive browser UNO with animated game loop and procedural audio",
    category: "Algorithms & Games",
    shortDescription:
      "A browser-based UNO card game with AI opponents, authentic 108-card rules, animated card dealing, and procedural sound synthesis via Web Audio API.",
    fullDescription:
      "A complete implementation of the classic UNO card game built with vanilla web technologies. It features responsive turn management, penalty and challenge handling, configurable AI bots, smooth card dealing animations, and procedural sound effects without relying on audio files.",
    problemSolved:
      "Building a complete, lightweight, dependency-free interactive card game with responsive AI logic and synthesized sound entirely within client-side Web APIs.",
    keyFeatures: [
      "Standard 108-card deck rules with Draw 2, Skip, Reverse, and Wild cards",
      "Configurable AI opponents with heuristic card selection logic",
      "UNO call verification and penalty enforcement rules",
      "Animated card dealing transitions and interactive play surface",
      "Custom synthesized procedural audio effects via Web Audio API oscillators",
    ],
    techStack: ["HTML5", "CSS3", "JavaScript", "Web Audio API", "Canvas", "State Machine"],
    githubRepoName: "uno-card-game",
    liveDemoUrl: "https://ashu999gold-dot.github.io/uno-card-game/",
    badge: "Interactive Game",
  },
  {
    id: "mess-menu",
    title: "IITGN Mess Menu",
    tagline: "Instant daily dining schedule companion for IIT Gandhinagar hostels",
    category: "Web Applications",
    shortDescription:
      "A fast, mobile-friendly dining schedule viewer built to help IIT Gandhinagar campus residents quickly check daily hostel mess menus.",
    fullDescription:
      "A clean student utility offering an instant view of breakfast, lunch, snacks, and dinner schedules across IITGN dining facilities, designed for quick access on mobile devices.",
    problemSolved:
      "Replacing clumsy PDF menu downloads with a fast, mobile-first daily dining guide for campus students.",
    keyFeatures: [
      "Fast daily meal schedule breakdown (Breakfast, Lunch, Snacks, Dinner)",
      "Mobile-first responsive design for quick on-the-go checks",
      "Lightweight bundle footprint for instantaneous loading",
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS"],
    githubRepoName: "iitgn-mess-menu",
    liveDemoUrl: "https://iitgn-mess-menu.lovable.app",
    badge: "Campus Utility",
  },
];
