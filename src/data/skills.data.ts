export interface SkillCategory {
  title: string;
  subtitle: string;
  skills: {
    name: string;
    description: string;
    usedIn: string[];
    isPrimary?: boolean;
  }[];
}

export const SKILLS_DATA: SkillCategory[] = [
  {
    title: "Programming Languages",
    subtitle: "Core languages used across software, algorithms, and experiments",
    skills: [
      { name: "TypeScript", description: "Strict type safety for large-scale web applications and interfaces", usedIn: ["CampusRadar", "timetabx", "AI Advisor"], isPrimary: true },
      { name: "JavaScript (ES6+)", description: "Modern web standard, asynchronous programming, and Web APIs", usedIn: ["PULSE Visualizer", "UNO Card Game"], isPrimary: true },
      { name: "Python 3.12", description: "Algorithm development, data structures, and heuristic game bots", usedIn: ["AlphaSnake", "Academic Coursework"], isPrimary: true },
      { name: "C / C++", description: "Systems foundation, algorithmic efficiency, and low-level concepts", usedIn: ["Engineering Computing Coursework"] },
      { name: "HTML5 & CSS3", description: "Semantic markup, modern layout, custom CSS properties, and animations", usedIn: ["All Web Projects"], isPrimary: true },
      { name: "SQL", description: "Relational queries, schema design, and row-level security policies", usedIn: ["CampusRadar", "Supabase PostgreSQL"] },
    ],
  },
  {
    title: "Frontend & Creative Technology",
    subtitle: "Modern client-side frameworks, interactive rendering, and audio",
    skills: [
      { name: "React", description: "Component-driven architecture, custom hooks, and concurrent features", usedIn: ["AI Advisor", "timetabx", "Portfolio"], isPrimary: true },
      { name: "Next.js", description: "Server-side rendering, routing, and modern full-stack web patterns", usedIn: ["CampusRadar"], isPrimary: true },
      { name: "Tailwind CSS", description: "Utility-first design systems, responsive layouts, and dark theme palettes", usedIn: ["All Applications"], isPrimary: true },
      { name: "Three.js / WebGL", description: "3D scene composition, procedural instanced geometry, and shaders", usedIn: ["Night Flower Valley Hero", "Portfolio"] },
      { name: "Web Audio API", description: "Real-time FFT audio frequency analysis, sound synthesis, and oscillators", usedIn: ["PULSE Visualizer", "UNO Card Game"], isPrimary: true },
      { name: "Canvas 2D API", description: "High-frame-rate pixel drawing, particle systems, and wave visualizers", usedIn: ["PULSE Visualizer", "UNO Card Game"] },
      { name: "TanStack Start / Query", description: "Modern routing and server-state synchronization", usedIn: ["timetabx"] },
    ],
  },
  {
    title: "Backend, Cloud & Data",
    subtitle: "Database management, authentication, and API integrations",
    skills: [
      { name: "Supabase & PostgreSQL", description: "Relational data modeling, table schemas, and Row-Level Security (RLS)", usedIn: ["CampusRadar", "timetabx"], isPrimary: true },
      { name: "Firebase", description: "Authentication flows and Firestore NoSQL document storage", usedIn: ["AI Advisor for Students"] },
      { name: "Google Gemini API", description: "Prompt engineering, structured JSON outputs, and conversational context", usedIn: ["AI Advisor for Students"], isPrimary: true },
      { name: "RESTful APIs & Fetch", description: "Asynchronous HTTP integration, rate-limiting, and error handling", usedIn: ["GitHub Explorer", "CampusRadar"] },
      { name: "Zustand", description: "Lightweight reactive client-side store management without boilerplate", usedIn: ["AI Advisor for Students"] },
    ],
  },
  {
    title: "Engineering & Developer Tools",
    subtitle: "Engineering foundations, testing, and development workflows",
    skills: [
      { name: "Git & GitHub", description: "Branching strategies, version control, and repository management", usedIn: ["All Projects"], isPrimary: true },
      { name: "Vite", description: "Fast HMR, optimized production bundling, and asset pipelines", usedIn: ["AI Advisor", "Portfolio"], isPrimary: true },
      { name: "Vitest", description: "Unit and integration testing for TypeScript and React logic", usedIn: ["CampusRadar"] },
      { name: "Computer-Aided Design (CAD)", description: "3D parametric modeling, mechanical assemblies, and engineering drawings", usedIn: ["Mechanical Engineering Coursework"] },
      { name: "SheetJS & jsPDF & iCal", description: "Client-side document parsing, report generation, and calendar feeds", usedIn: ["timetabx"] },
    ],
  },
];
