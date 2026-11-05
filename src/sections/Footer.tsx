import React from "react";
import { PORTFOLIO_CONFIG } from "../config/portfolio.config";
import { ArrowUp } from "lucide-react";
import { GithubIcon } from "../components/GithubIcon";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-[#8D83C9]/15 bg-[#05060A] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start">
          <span className="font-display font-bold text-base text-[#F1EBDD]">
            {PORTFOLIO_CONFIG.name}
          </span>
          <span className="text-xs font-mono text-[#A6A5AE] mt-0.5">
            IIT Gandhinagar · Mechanical Engineering & CSE Minor
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={PORTFOLIO_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-[#A6A5AE] hover:text-[#F1EBDD] transition"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={15} />
            <span>ashu999gold-dot</span>
          </a>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-[#101522] hover:bg-[#25264A] text-[#A6A5AE] hover:text-[#F1EBDD] transition border border-[#8D83C9]/20 cursor-pointer"
            aria-label="Scroll to top of page"
            title="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-white/5 text-center text-[11px] font-mono text-[#A6A5AE]/60">
        Designed with Night Flower Valley procedural 3D aesthetics. Built with React, TypeScript & Three.js.
      </div>
    </footer>
  );
};
