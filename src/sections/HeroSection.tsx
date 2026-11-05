import React from "react";
import { ArrowDown, Sparkles, FolderGit2, Mail } from "lucide-react";
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
      className="relative min-h-screen w-full flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-28 pb-12 overflow-hidden select-none"
    >
      {/* 3D Night Flower Valley Canvas */}
      <NightFlowerValley onLoaded={onValleyLoaded} scrollProgress={scrollProgress} />

      {/* Atmospheric Vignette & Contrast Overlay (preserves 3D flower visuals while keeping typography readable) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090D]/75 via-transparent to-[#08090D] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,9,13,0.35)_0%,rgba(8,9,13,0.85)_80%)] pointer-events-none z-10" />

      {/* Top Identity Tag */}
      <div className="relative z-20 pt-4">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#101522]/85 backdrop-blur-md border border-[#8D83C9]/30 text-xs font-mono text-[#F1EBDD] shadow-lg shadow-black/40">
          <Sparkles size={13} className="text-[#38BDF8]" />
          <span>{PORTFOLIO_CONFIG.name}</span>
          <span className="text-[#8D83C9]">•</span>
          <span className="text-[#A6A5AE]">{PORTFOLIO_CONFIG.identityLine}</span>
        </div>
      </div>

      {/* Main Center Typography */}
      <div className="relative z-20 max-w-4xl mx-auto my-auto py-8">
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#F1EBDD] leading-[1.08] mb-6 drop-shadow-2xl">
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#F1EBDD] via-[#F1EBDD] to-[#D5CFC0]">
            {PORTFOLIO_CONFIG.headline.line1}
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8D83C9] via-[#C084FC] to-[#38BDF8]">
            {PORTFOLIO_CONFIG.headline.line2}
          </span>
        </h1>

        <p className="font-body text-[#A6A5AE] text-base sm:text-xl max-w-xl mx-auto font-light leading-relaxed mb-8 drop-shadow">
          {PORTFOLIO_CONFIG.supportingCopy}
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#F1EBDD] hover:bg-white text-[#08090D] font-mono font-medium text-xs sm:text-sm transition-all duration-300 shadow-xl shadow-[#8D83C9]/20 hover:scale-105 active:scale-95"
          >
            <FolderGit2 size={16} />
            <span>Explore Projects</span>
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#101522]/80 hover:bg-[#25264A] text-[#F1EBDD] font-mono text-xs sm:text-sm border border-[#8D83C9]/30 transition-all duration-300 backdrop-blur-md hover:border-[#8D83C9]/60 hover:scale-105 active:scale-95"
          >
            <Mail size={16} className="text-[#8D83C9]" />
            <span>Get in Touch</span>
          </a>
        </div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <div className="relative z-20 flex flex-col items-center gap-2 text-[#A6A5AE] hover:text-[#F1EBDD] transition">
        <a href="#about" className="flex flex-col items-center gap-2 text-xs font-mono group" aria-label="Scroll to About section">
          <span className="tracking-widest uppercase text-[10px] text-[#8D83C9]">Explore Valley</span>
          <div className="w-6 h-10 rounded-full border border-[#8D83C9]/40 flex items-start justify-center p-1 group-hover:border-[#38BDF8] transition">
            <span className="w-1 h-2 rounded-full bg-[#38BDF8] animate-bounce mt-1" />
          </div>
          <ArrowDown size={14} className="opacity-60 group-hover:opacity-100 transition" />
        </a>
      </div>
    </section>
  );
};
