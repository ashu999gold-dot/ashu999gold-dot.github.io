export interface NavItem {
  label: string;
  href: string;
}

export interface PortfolioConfig {
  name: string;
  role: string;
  institution: string;
  degree: string;
  minor: string;
  githubUrl: string;
  headline: {
    line1: string;
    line2: string;
  };
  supportingCopy: string;
  identityLine: string;
  navItems: NavItem[];
  about: {
    paragraphs: string[];
    focusAreas: {
      number: string;
      title: string;
      description: string;
      tags: string[];
    }[];
  };
}

export const PORTFOLIO_CONFIG: PortfolioConfig = {
  name: "Ashutosh Kumar",
  role: "Undergraduate Student & Creative Technologist",
  institution: "IIT Gandhinagar",
  degree: "BTech, Mechanical Engineering",
  minor: "Computer Science and Engineering",
  githubUrl: "https://github.com/ashu999gold-dot",
  headline: {
    line1: "Building ideas.",
    line2: "Exploring possibilities.",
  },
  supportingCopy: "Software, experiments, and things I've built along the way.",
  identityLine: "Mechanical Engineering @ IIT Gandhinagar · CSE Minor",
  navItems: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Academics", href: "#academics" },
    { label: "Focus", href: "#focus" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "GitHub", href: "#github" },
    { label: "Contact", href: "#contact" },
  ],
  about: {
    paragraphs: [
      "I am an undergraduate student at IIT Gandhinagar studying Mechanical Engineering, with a minor in Computer Science and Engineering.",
      "I enjoy exploring technology through building software, experimenting with interactive experiences, and working on projects that combine creativity and engineering.",
    ],
    focusAreas: [
      {
        number: "01",
        title: "Software & Web Development",
        description: "Web applications, frontend development, interfaces, and software projects built with modern frameworks and type-safe architectures.",
        tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "TanStack Start"],
      },
      {
        number: "02",
        title: "AI & Programming Experiments",
        description: "AI-powered applications, programming, algorithms, and technical experimentation combining LLM APIs, search strategies, and game bots.",
        tags: ["Python", "Gemini API", "Heuristics", "Search Algorithms", "Zustand"],
      },
      {
        number: "03",
        title: "Engineering & Creative Technology",
        description: "Engineering tools, simulations, CAD, real-time audio visualization, and technology-driven projects bridging physical and computational domains.",
        tags: ["Web Audio API", "Canvas 2D", "Three.js", "CAD", "Interactive Graphics"],
      },
    ],
  },
};
