import React from "react";
import { X, ExternalLink, ShieldCheck, Cpu, Layers } from "lucide-react";
import type { ProjectItem } from "../data/projects.data";
import { PROJECT_PUBLICATION_CONFIG } from "../config/projects.config";
import { PulsePreview } from "./PulsePreview";

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  if (!project) return null;

  const pubConfig = PROJECT_PUBLICATION_CONFIG[project.id];
  const hasLiveDemo = pubConfig?.displayLiveDemo && Boolean(project.liveDemoUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl glass-panel glass-specular rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full glass-pill hover:bg-white/[0.15] text-[#A6A5AE] hover:text-[#F1EBDD] transition cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[#8D83C9] glass-pill px-3 py-0.5">
              {project.category}
            </span>
            {project.badge && (
              <span className="text-xs font-mono text-[#38BDF8] glass-pill border-[#38BDF8]/30 px-3 py-0.5">
                {project.badge}
              </span>
            )}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F1EBDD]">
            {project.title}
          </h2>
          <p className="text-sm font-body text-[#A6A5AE] mt-1">
            {project.tagline}
          </p>
        </div>

        {/* Embedded Interactive Preview for PULSE */}
        {project.id === "pulse-visualizer" && (
          <div className="mb-6">
            <PulsePreview />
          </div>
        )}

        {/* Overview */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#F1EBDD] mb-2 flex items-center gap-1.5">
            <Layers size={14} className="text-[#8D83C9]" />
            Project Overview
          </h3>
          <p className="text-sm font-body text-[#A6A5AE] leading-relaxed">
            {project.fullDescription}
          </p>
        </div>

        {/* Problem Solved */}
        <div className="mb-6 p-5 rounded-2xl bg-white/[0.04] border border-white/10">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] mb-1.5 flex items-center gap-1.5">
            <Cpu size={14} />
            Engineering Problem & Objective
          </h3>
          <p className="text-sm font-body text-[#F1EBDD]/90 leading-relaxed">
            {project.problemSolved}
          </p>
        </div>

        {/* Implemented Features */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#F1EBDD] mb-3 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#34D399]" />
            Verified Capabilities & Implemented Features
          </h3>
          <ul className="space-y-2">
            {project.keyFeatures.map((feat, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm font-body text-[#A6A5AE] flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#8D83C9] mt-2 flex-shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Chips */}
        <div className="mb-8">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#A6A5AE] mb-2.5">
            Technologies & APIs
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono text-[#F1EBDD] bg-white/[0.06] border border-white/10 px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Footers */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-xs font-mono text-[#A6A5AE]/80">
            Repository: <code className="text-[#8D83C9] font-mono">{project.githubRepoName}</code> (Private)
          </span>

          <div className="flex items-center gap-3">
            {hasLiveDemo && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F1EBDD] hover:bg-white text-[#04060A] text-xs font-mono font-semibold transition shadow-lg hover:scale-105"
              >
                <span>Launch Live App</span>
                <ExternalLink size={13} />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full glass-pill hover:bg-white/[0.1] text-[#F1EBDD] text-xs font-mono transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
