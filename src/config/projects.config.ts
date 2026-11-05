export interface ProjectPublicationConfig {
  id: string;
  isPubliclyVisible: boolean;
  displayDescription: boolean;
  displayRepoLink: boolean;
  displayLiveDemo: boolean;
  allowSourceInspection: boolean;
  approvedScreenshots: string[];
}

/**
 * Central configuration for project publication decisions.
 * Follows strict privacy guidelines:
 * - Only verified public links are displayed.
 * - Private repositories do not expose repository source links.
 * - Live demos are only displayed when verified active.
 */
export const PROJECT_PUBLICATION_CONFIG: Record<string, ProjectPublicationConfig> = {
  "ai-advisor": {
    id: "ai-advisor",
    isPubliclyVisible: true,
    displayDescription: true,
    displayRepoLink: false, // Private repository
    displayLiveDemo: false,
    allowSourceInspection: false,
    approvedScreenshots: [],
  },
  "pulse-visualizer": {
    id: "pulse-visualizer",
    isPubliclyVisible: true,
    displayDescription: true,
    displayRepoLink: false, // Private repository
    displayLiveDemo: true, // Interactive embedded simulator provided in-app
    allowSourceInspection: false,
    approvedScreenshots: [],
  },
  "timetabx": {
    id: "timetabx",
    isPubliclyVisible: true,
    displayDescription: true,
    displayRepoLink: false, // Private repository
    displayLiveDemo: true, // https://timetabx.lovable.app verified HTTP 200
    allowSourceInspection: false,
    approvedScreenshots: [],
  },
  "campus-radar": {
    id: "campus-radar",
    isPubliclyVisible: true,
    displayDescription: true,
    displayRepoLink: false, // Private repository
    displayLiveDemo: false,
    allowSourceInspection: false,
    approvedScreenshots: [],
  },
  "alpha-snake": {
    id: "alpha-snake",
    isPubliclyVisible: true,
    displayDescription: true,
    displayRepoLink: false, // Private repository
    displayLiveDemo: false,
    allowSourceInspection: false,
    approvedScreenshots: [],
  },
  "uno-game": {
    id: "uno-game",
    isPubliclyVisible: true,
    displayDescription: true,
    displayRepoLink: false, // Private repository
    displayLiveDemo: true, // https://ashu999gold-dot.github.io/uno-card-game/ verified HTTP 200
    allowSourceInspection: false,
    approvedScreenshots: [],
  },
  "mess-menu": {
    id: "mess-menu",
    isPubliclyVisible: true,
    displayDescription: true,
    displayRepoLink: false, // Private repository
    displayLiveDemo: true, // https://iitgn-mess-menu.lovable.app verified HTTP 200
    allowSourceInspection: false,
    approvedScreenshots: [],
  },
};
