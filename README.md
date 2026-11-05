# Ashutosh Kumar — Personal Portfolio

A personal portfolio website for **Ashutosh Kumar**, undergraduate student at **IIT Gandhinagar** (BTech in Mechanical Engineering with a Minor in Computer Science and Engineering).

The portfolio combines a **Fernhollow-inspired Night Flower Valley 3D Hero** with an editorial dark visual design system, verified project showcase, interactive in-browser audio visualizer simulation, and a live GitHub API explorer.

---

## 🌌 Visual Direction & Key Features

### 1. Hero — Night Flower Valley (Procedural 3D Environment)
- **High-Performance GPU Instancing**: Thousands of glowing flowers (Lantern Bell Lilies, Radiant Star Lilies, Luminescent Spire Reeds, Whispering Meadow Fern Blades) rendered via `THREE.InstancedMesh` with unique scales, rotations, and bioluminescent colors.
- **Cinematic Depth & Lighting**: Procedural rolling terrain valley, atmospheric midnight fog (`#08090D`), floating spores, and shifting point lights.
- **Pointer & Scroll Interactivity**: Flowers react with subtle organic displacement and wind sway when the pointer passes over them. Camera smoothly glides forward down the valley as the user scrolls.
- **Accessibility & Fallback**: Automatic `prefers-reduced-motion` detection and graceful SVG twilight fallback for devices without WebGL.

### 2. Verified Project Showcase
Every project is fact-checked against real repository source code and documentation:
- **PULSE Music Visualizer**: Browser-based real-time audio analysis with an **interactive in-app Canvas 2D FFT visualizer** allowing visitors to switch between 6 visualization modes (Circular, Bars, Particles, Tunnel, Radial, Ribbon) and 5 color palettes.
- **AI Advisor for Students**: Academic command center powered by Google's Gemini API, Firebase Firestore, and Zustand for syllabus navigation, active recall quizzes, and tutoring.
- **SlotSync (timetabx)**: IIT Gandhinagar slot timetable generator with spreadsheet parsing (SheetJS), clash detection, and calendar/PDF export. Live app verified active.
- **CampusRadar**: Source-first opportunity discovery platform for Indian college students with primary-source verification and PostgreSQL RLS.
- **AlphaSnake**: Competitive snake bot with BFS flood fill, Voronoi territory partitioning, and opponent prediction in Python 3.12 standard library.
- **UNO Card Game**: Interactive browser UNO game with AI opponents and procedural Web Audio API synthesis. Live app verified active.
- **IITGN Mess Menu**: Fast hostel dining companion for IIT Gandhinagar campus residents. Live app verified active.

### 3. Centralized Publication & Privacy Controls (`src/config/projects.config.ts`)
- Controls public visibility, description display, repository link exposure, and approved assets.
- Protects private repository code and private account data while showcasing verified technical architecture.

### 4. Live GitHub API Explorer
- Real-time client-side query to `api.github.com/users/ashu999gold-dot`.
- Displays verified profile metadata (Ashutosh Kumar, Sophomore at IIT Gandhinagar, Gandhinagar location).
- Respectfully shows an honest empty state for private development repos with search and filter toolbar ready to populate automatically whenever any repository is made public.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8 with optimized vendor chunking
- **Styling**: Tailwind CSS v4 + Custom Design Tokens (Midnight Black `#08090D`, Deep Navy `#101522`, Indigo `#25264A`, Muted Violet `#8D83C9`, Warm Cream `#F1EBDD`)
- **3D & Graphics**: Three.js (Instanced Geometry, ACES Filmic Tone Mapping, Exponential Fog, BufferGeometry Spores)
- **Interactive Audio Visualizer**: Web Audio API / Canvas 2D Fast Fourier Transform
- **Icons**: Lucide React + Custom Octocat SVG

---

## 📁 Directory Structure

```text
src/
├── assets/                  # Static assets & icons
├── components/              # Modular UI components
│   ├── CinematicLoader.tsx   # Smooth atmospheric initial loader
│   ├── GitHubExplorer.tsx    # Live public GitHub API explorer & filter
│   ├── GithubIcon.tsx        # Octocat SVG brand component
│   ├── Navbar.tsx            # Sticky blur navigation & mobile drawer
│   ├── ProjectCard.tsx       # Verified project card with custom thumbnail
│   ├── ProjectDetailModal.tsx# Architecture breakdown modal
│   ├── PulsePreview.tsx      # Interactive Canvas 2D FFT music visualizer
│   └── SectionHeader.tsx     # Editorial section title & badges
├── config/
│   ├── portfolio.config.ts   # Personal identity, navigation, and text tokens
│   └── projects.config.ts    # Central project publication & privacy controls
├── data/
│   ├── projects.data.ts      # Fact-checked project details & feature lists
│   └── skills.data.ts        # Evidence-grounded technical capabilities
├── experience/
│   └── NightFlowerValley.tsx # Three.js procedural flower valley canvas
├── sections/
│   ├── HeroSection.tsx       # Night Flower Valley Hero
│   ├── AboutSection.tsx      # Editorial student profile
│   ├── AcademicSection.tsx   # IIT Gandhinagar dual discipline profile
│   ├── AreasOfInterestSection.tsx # 3 core exploration domains
│   ├── FeaturedProjectsSection.tsx# Project catalog with category filters
│   ├── SkillsSection.tsx     # Categorized skills list
│   ├── GitHubSection.tsx     # Live GitHub integration
│   ├── ContactSection.tsx    # Contact & collaboration call-to-action
│   └── Footer.tsx            # Bottom links & back-to-top button
├── App.tsx                   # Main layout & scroll progress tracking
├── main.tsx                  # Application root
└── index.css                 # Tailwind v4 theme, fonts & styling
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; developed with Node.js v24)
- npm or pnpm

### Installation

```bash
git clone https://github.com/ashu999gold-dot/ashu999gold-dot.github.io.git
cd ashu999gold-dot.github.io
npm install
```

### Development Server

```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```
Generates an optimized, code-split production bundle in `dist/`.

### Preview Production Build

```bash
npm run preview
```

---

## 🚢 Deployment (GitHub Pages)

The project includes `base: './'` in `vite.config.ts` for full compatibility with GitHub Pages, Vercel, Netlify, or any static hosting service.

To deploy to GitHub Pages:
1. Build the distribution: `npm run build`
2. Push the contents of `dist/` to the `gh-pages` branch or configure GitHub Actions workflow to build on push to `main`.
