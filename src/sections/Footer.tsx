import React from "react";
import { PORTFOLIO_CONFIG } from "../config/portfolio.config";
import { ArrowUp } from "lucide-react";
import { GithubIcon } from "../components/GithubIcon";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full glass-panel rounded-t-3xl border-t border-white/10 py-12 px-4 sm:px-6 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start">
          <span className="font-display font-bold text-base text-[#F1EBDD]">
            {PORTFOLIO_CONFIG.name}
          </span>
          <span className="text-xs font-mono text-[#A6A5AE] mt-0.5">
            IIT Gandhinagar · Mechanical Engineering & CSE Minor
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={PORTFOLIO_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill px-4 py-2 flex items-center gap-2 text-xs font-mono text-[#A6A5AE] hover:text-[#F1EBDD] hover:border-white/30 transition shadow-md"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={15} />
            <span>ashu999gold-dot</span>
          </a>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full glass-pill hover:bg-white/[0.1] text-[#A6A5AE] hover:text-[#F1EBDD] transition cursor-pointer shadow-md"
            aria-label="Scroll to top of page"
            title="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-white/5 text-center text-[11px] font-mono text-[#A6A5AE]/60">
        Continuous Night Flower Valley procedural 3D environment. Built with React, TypeScript & Three.js.
      </div>
    </footer>
  );
};
