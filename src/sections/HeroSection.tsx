import React from "react";
import { ArrowDown, FolderGit2, Mail } from "lucide-react";
import { NightFlowerValley } from "../experience/NightFlowerValley";
import { PORTFOLIO_CONFIG } from "../config/portfolio.config";

interface HeroSectionProps {
  onValleyLoaded?: () => void;
  scrollProgress?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onValleyLoaded,
  scrollProgress = 0,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-24 pb-8 overflow-hidden select-none"
    >
      {/* 3D Night Flower Valley Canvas */}
      <NightFlowerValley onLoaded={onValleyLoaded} scrollProgress={scrollProgress} />

      {/* Minimal Top & Bottom Transitions (Keep flowers 100% visible, no heavy darkening overlays) */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#06080E]/80 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#06080E] to-transparent pointer-events-none z-10" />

      {/* Minimal Identity Line */}
      <div className="relative z-20 pt-2 mb-2">
        <p className="font-mono text-[11px] sm:text-xs tracking-wider uppercase text-[#8D83C9]/90 drop-shadow">
          <span>{PORTFOLIO_CONFIG.name}</span>
          <span className="mx-2 text-[#F1EBDD]/40">·</span>
          <span className="text-[#A6A5AE]">{PORTFOLIO_CONFIG.identityLine}</span>
        </p>
      </div>

      {/* Main Center Typography (Large Condensed Cream Editorial Typography) */}
      <div className="relative z-20 max-w-5xl mx-auto my-auto py-2">
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tight text-[#F1EBDD] leading-[0.98] mb-6 drop-shadow-2xl">
          <span className="block text-[#F1EBDD]">
            {PORTFOLIO_CONFIG.headline.line1}
          </span>
          <span className="block text-[#EDE8DC]">
            {PORTFOLIO_CONFIG.headline.line2}
          </span>
        </h1>

        <p className="font-body text-[#D4CFBE] text-base sm:text-xl max-w-xl mx-auto font-normal leading-relaxed mb-8 drop-shadow-lg">
          {PORTFOLIO_CONFIG.supportingCopy}
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#F1EBDD] hover:bg-white text-[#06080E] font-mono font-medium text-xs sm:text-sm transition-all duration-300 shadow-xl shadow-black/60 hover:scale-105 active:scale-95"
          >
            <FolderGit2 size={16} />
            <span>Explore Projects</span>
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#101522]/70 hover:bg-[#1E1B4B]/80 text-[#F1EBDD] font-mono text-xs sm:text-sm border border-[#8D83C9]/30 transition-all duration-300 backdrop-blur-md hover:border-[#8D83C9]/60 hover:scale-105 active:scale-95"
          >
            <Mail size={16} className="text-[#8D83C9]" />
            <span>Get in Touch</span>
          </a>
        </div>
      </div>

      {/* Minimal Scroll Down Indicator */}
      <div className="relative z-20 flex flex-col items-center gap-1.5 text-[#A6A5AE]/80 hover:text-[#F1EBDD] transition">
        <a href="#about" className="flex flex-col items-center gap-1.5 text-xs font-mono group" aria-label="Scroll to About section">
          <span className="tracking-widest uppercase text-[10px] text-[#8D83C9]">Scroll to Enter Valley</span>
          <ArrowDown size={14} className="animate-bounce opacity-70 group-hover:opacity-100 transition" />
        </a>
      </div>
    </section>
  );
};
