import React from "react";
import { ExternalLink, ArrowUpRight, Sparkles, Terminal, Calendar, Award, Music, Gamepad2, Compass } from "lucide-react";
import type { ProjectItem } from "../data/projects.data";
import { PROJECT_PUBLICATION_CONFIG } from "../config/projects.config";

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const pubConfig = PROJECT_PUBLICATION_CONFIG[project.id];
  const hasLiveDemo = pubConfig?.displayLiveDemo && Boolean(project.liveDemoUrl);

  // Render stylized thumbnail visual preview for each project
  const renderVisualPreview = () => {
    switch (project.id) {
      case "pulse-visualizer":
        return (
          <div className="relative w-full h-36 bg-[#06080F] rounded-lg overflow-hidden flex items-center justify-center border border-[#8D83C9]/15 group-hover:border-[#8D83C9]/40 transition">
            <div className="absolute inset-0 radial-glow-cyan opacity-40" />
            <div className="flex items-center gap-1.5 z-10">
              {[32, 64, 48, 80, 52, 90, 68, 44, 76, 56, 84, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-[#8D83C9] to-[#38BDF8] rounded-full transition-all duration-300"
                  style={{ height: `${h * 0.7}%`, opacity: 0.6 + (i % 3) * 0.15 }}
                />
              ))}
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] font-mono text-[#38BDF8] bg-black/60 px-2 py-0.5 rounded border border-[#38BDF8]/20">
              <Music size={11} />
              <span>Interactive FFT Canvas</span>
            </div>
          </div>
        );

      case "ai-advisor":
        return (
          <div className="relative w-full h-36 bg-[#06080F] rounded-lg overflow-hidden flex items-center justify-center border border-[#8D83C9]/15 group-hover:border-[#8D83C9]/40 transition">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.18)_0%,transparent_70%)]" />
            {/* Visual Node Graph */}
            <div className="relative z-10 w-44 h-24">
              <div className="absolute top-2 left-4 px-2 py-1 rounded bg-[#25264A]/80 border border-[#8D83C9]/40 text-[10px] font-mono text-[#F1EBDD]">
                Knowledge Graph
              </div>
              <div className="absolute bottom-2 right-4 px-2 py-1 rounded bg-[#101522] border border-[#38BDF8]/40 text-[10px] font-mono text-[#38BDF8]">
                Gemini LLM API
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#8D83C9]/30 border border-[#8D83C9] flex items-center justify-center">
                <Sparkles size={14} className="text-[#F1EBDD]" />
              </div>
              {/* Connecting line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="45" y1="20" x2="88" y2="48" stroke="#8D83C9" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="88" y1="48" x2="135" y2="75" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-mono text-[#C084FC] bg-black/60 px-2 py-0.5 rounded border border-[#C084FC]/20">
              <Terminal size={11} />
              <span>Adaptive STEM Tutor</span>
            </div>
          </div>
        );

      case "timetabx":
        return (
          <div className="relative w-full h-36 bg-[#06080F] rounded-lg overflow-hidden flex flex-col justify-center p-3 border border-[#8D83C9]/15 group-hover:border-[#8D83C9]/40 transition">
            <div className="grid grid-cols-4 gap-1.5 text-[9px] font-mono text-[#A6A5AE] mb-1.5 opacity-70">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <div className="bg-[#25264A] border border-[#8D83C9]/40 rounded p-1.5 text-[9px] font-mono text-[#F1EBDD]">
                ES 112 [A1]
              </div>
              <div className="bg-[#38BDF8]/15 border border-[#38BDF8]/40 rounded p-1.5 text-[9px] font-mono text-[#38BDF8]">
                MA 201 [C2]
              </div>
              <div className="bg-[#34D399]/15 border border-[#34D399]/40 rounded p-1.5 text-[9px] font-mono text-[#34D399]">
                CS 201 [Lab]
              </div>
              <div className="bg-[#8D83C9]/20 border border-[#8D83C9]/40 rounded p-1.5 text-[9px] font-mono text-[#F1EBDD]">
                HS 301 [E]
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-mono text-[#34D399] bg-black/60 px-2 py-0.5 rounded border border-[#34D399]/20">
              <Calendar size={11} />
              <span>Slot Clash Detection</span>
            </div>
          </div>
        );

      case "campus-radar":
        return (
          <div className="relative w-full h-36 bg-[#06080F] rounded-lg overflow-hidden flex items-center justify-center border border-[#8D83C9]/15 group-hover:border-[#8D83C9]/40 transition">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)]" />
            <div className="flex flex-col gap-1.5 w-full max-w-[220px]">
              <div className="flex items-center justify-between bg-[#101522] border border-[#38BDF8]/30 px-2.5 py-1 rounded text-[10px] font-mono text-[#F1EBDD]">
                <span>Research Fellowships</span>
                <span className="text-[#34D399] text-[9px]">Verified ✓</span>
              </div>
              <div className="flex items-center justify-between bg-[#101522] border border-[#8D83C9]/30 px-2.5 py-1 rounded text-[10px] font-mono text-[#F1EBDD]">
                <span>National Hackathons</span>
                <span className="text-[#38BDF8] text-[9px]">Verified ✓</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-mono text-[#38BDF8] bg-black/60 px-2 py-0.5 rounded border border-[#38BDF8]/20">
              <Compass size={11} />
              <span>Primary-Source Verification</span>
            </div>
          </div>
        );

      case "alpha-snake":
        return (
          <div className="relative w-full h-36 bg-[#06080F] rounded-lg overflow-hidden flex items-center justify-center border border-[#8D83C9]/15 group-hover:border-[#8D83C9]/40 transition">
            <div className="grid grid-cols-6 gap-1 w-36 h-24 p-1 border border-white/5 bg-black/40 rounded">
              {Array.from({ length: 24 }).map((_, i) => {
                const isSnake = [7, 8, 9, 15, 21].includes(i);
                const isFood = i === 16;
                return (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      isSnake
                        ? "bg-[#34D399] shadow-sm shadow-[#34D399]"
                        : isFood
                        ? "bg-[#F472B6] animate-pulse"
                        : "bg-white/5"
                    }`}
                  />
                );
              })}
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-mono text-[#34D399] bg-black/60 px-2 py-0.5 rounded border border-[#34D399]/20">
              <Terminal size={11} />
              <span>BFS & Voronoi Heuristics</span>
            </div>
          </div>
        );

      case "uno-game":
        return (
          <div className="relative w-full h-36 bg-[#06080F] rounded-lg overflow-hidden flex items-center justify-center border border-[#8D83C9]/15 group-hover:border-[#8D83C9]/40 transition">
            <div className="flex items-center -space-x-3">
              <div className="w-12 h-18 bg-[#EF4444] rounded-md border border-white/40 shadow-lg transform -rotate-12 flex items-center justify-center text-white font-black text-xs">
                7
              </div>
              <div className="w-12 h-18 bg-[#3B82F6] rounded-md border border-white/40 shadow-lg transform -rotate-3 flex items-center justify-center text-white font-black text-xs">
                +2
              </div>
              <div className="w-12 h-18 bg-[#10B981] rounded-md border border-white/40 shadow-lg transform rotate-8 flex items-center justify-center text-white font-black text-xs">
                ⤾
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-mono text-[#F472B6] bg-black/60 px-2 py-0.5 rounded border border-[#F472B6]/20">
              <Gamepad2 size={11} />
              <span>AI Opponents & Audio Synth</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative w-full h-36 bg-[#06080F] rounded-lg overflow-hidden flex items-center justify-center border border-[#8D83C9]/15">
            <Award className="text-[#8D83C9]" size={28} />
          </div>
        );
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 border border-[#8D83C9]/15 flex flex-col justify-between group transition-all duration-300">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono text-[#8D83C9] bg-[#8D83C9]/10 px-2 py-0.5 rounded border border-[#8D83C9]/20">
            {project.category}
          </span>
          {project.badge && (
            <span className="text-[11px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
              {project.badge}
            </span>
          )}
        </div>

        {/* Visual Preview */}
        <div className="mb-4">{renderVisualPreview()}</div>

        {/* Title & Tagline */}
        <h3 className="font-display font-semibold text-lg text-[#F1EBDD] group-hover:text-[#F1EBDD] transition">
          {project.title}
        </h3>
        <p className="text-xs font-mono text-[#8D83C9] mt-0.5 mb-2.5">
          {project.tagline}
        </p>

        {/* Short Description */}
        <p className="text-xs sm:text-sm font-body text-[#A6A5AE] leading-relaxed mb-4 line-clamp-3">
          {project.shortDescription}
        </p>
      </div>

      <div>
        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono text-[#F1EBDD]/90 bg-[#101522]/90 border border-[#8D83C9]/20 px-2 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-[11px] font-mono text-[#8D83C9] bg-[#101522]/50 px-1.5 py-0.5 rounded">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#8D83C9]/10">
          <button
            onClick={() => onSelect(project)}
            className="flex items-center gap-1.5 text-xs font-mono text-[#F1EBDD] hover:text-[#38BDF8] transition cursor-pointer"
          >
            <span>Architecture & Details</span>
            <ArrowUpRight size={13} />
          </button>

          {hasLiveDemo && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#F1EBDD] hover:bg-white text-[#08090D] text-[11px] font-mono font-medium transition shadow"
            >
              <span>Live App</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
