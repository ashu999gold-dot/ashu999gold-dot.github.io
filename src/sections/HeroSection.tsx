import React, { useState } from "react";
import { ArrowDown, FolderGit2, Mail, Volume2, VolumeX } from "lucide-react";
import { PORTFOLIO_CONFIG } from "../config/portfolio.config";

export const HeroSection: React.FC = () => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioToggle = () => {
    const toggleFn = (window as unknown as { __toggleValleyAudio?: () => boolean }).__toggleValleyAudio;
    if (toggleFn) {
      const playing = toggleFn();
      setIsPlayingAudio(playing);
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-24 pb-8 overflow-hidden select-none"
    >
      {/* Subtle Top Header Vignette (Soft atmospheric gradient only) */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#04060A]/80 via-[#04060A]/30 to-transparent pointer-events-none z-10" />

      {/* Identity Pill Line */}
      <div className="relative z-20 pt-2 mb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-[11px] sm:text-xs font-mono text-[#8D83C9] drop-shadow">
          <span>{PORTFOLIO_CONFIG.name}</span>
          <span className="text-[#F1EBDD]/40">·</span>
          <span className="text-[#A6A5AE]">{PORTFOLIO_CONFIG.identityLine}</span>
        </div>
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

        {/* Primary Call to Actions with Glassmorphism & Valley Dispersal Hook */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            data-valley-hover="true"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#F1EBDD] hover:bg-white text-[#04060A] font-mono font-medium text-xs sm:text-sm transition-all duration-300 shadow-xl shadow-black/50 hover:scale-105 active:scale-95"
          >
            <FolderGit2 size={16} />
            <span>Explore Projects</span>
          </a>

          <a
            href="#contact"
            data-valley-hover="true"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full glass-pill hover:bg-white/[0.1] text-[#F1EBDD] font-mono text-xs sm:text-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:border-white/30"
          >
            <Mail size={16} className="text-[#8D83C9]" />
            <span>Get in Touch</span>
          </a>
        </div>
      </div>

      {/* Bottom Corner Bar (Scroll to Wander & Ambient Sound Toggle - HeroPage Architecture) */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 flex items-center justify-between text-[#A6A5AE]/80 font-mono text-xs">
        {/* Scroll Indicator Pill */}
        <a
          href="#about"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill hover:text-[#F1EBDD] transition group"
          aria-label="Scroll to explore"
        >
          <span className="tracking-widest uppercase text-[10px] text-[#8D83C9]">Scroll to wander</span>
          <ArrowDown size={13} className="animate-bounce opacity-70 group-hover:opacity-100 transition" />
        </a>

        {/* Ambient Sound Toggle Button */}
        <button
          onClick={handleAudioToggle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill hover:border-[#8D83C9]/50 text-[#F1EBDD] transition-all cursor-pointer hover:scale-105"
          aria-label={isPlayingAudio ? "Mute ambient valley soundtrack" : "Play ambient valley soundtrack"}
          title={isPlayingAudio ? "Mute ambient sound" : "Play ambient sound"}
        >
          {isPlayingAudio ? (
            <>
              <Volume2 size={13} className="text-[#38BDF8]" />
              <span className="text-[10px] uppercase tracking-wider text-[#38BDF8]">Sound on</span>
              <span className="flex items-center gap-0.5 ml-1">
                <span className="w-0.5 h-2.5 bg-[#38BDF8] rounded-full animate-pulse" />
                <span className="w-0.5 h-3.5 bg-[#38BDF8] rounded-full animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-[#38BDF8] rounded-full animate-pulse delay-150" />
              </span>
            </>
          ) : (
            <>
              <VolumeX size={13} className="text-[#A6A5AE]" />
              <span className="text-[10px] uppercase tracking-wider text-[#A6A5AE]">Sound off</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
