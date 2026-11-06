import React from "react";
import { MessageSquare, ExternalLink, Sparkles } from "lucide-react";
import { GithubIcon } from "../components/GithubIcon";
import { PORTFOLIO_CONFIG } from "../config/portfolio.config";

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 max-w-5xl mx-auto text-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 radial-glow-cyan opacity-25 pointer-events-none" />

      <div className="relative z-10 glass-panel glass-specular rounded-3xl p-8 sm:p-14 border border-white/14 shadow-2xl overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-mono text-[#8D83C9] mb-6 shadow-sm">
          <Sparkles size={13} className="text-[#38BDF8]" />
          <span>LET'S CONNECT</span>
        </div>

        <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#F1EBDD] tracking-tight mb-6">
          Have an idea worth building?
        </h2>

        <p className="font-body text-[#A6A5AE] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
          Whether you want to discuss software ideas, explore interactive experiments, or collaborate on creative technology, I am always excited to connect.
        </p>

        {/* Primary Contact Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={PORTFOLIO_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#F1EBDD] hover:bg-white text-[#04060A] font-mono font-semibold text-sm transition-all duration-300 shadow-xl shadow-black/40 hover:scale-105 active:scale-95"
          >
            <GithubIcon size={18} />
            <span>Connect on GitHub (@ashu999gold-dot)</span>
            <ExternalLink size={14} />
          </a>

          <a
            href="https://github.com/ashu999gold-dot?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full glass-pill hover:bg-white/[0.1] text-[#F1EBDD] font-mono text-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:border-white/30"
          >
            <MessageSquare size={16} className="text-[#8D83C9]" />
            <span>Start a Discussion / Issue</span>
          </a>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#A6A5AE] gap-3">
          <span>Based at IIT Gandhinagar, Gujarat, India</span>
          <span className="text-[#8D83C9]">Mechanical Engineering & CSE Minor</span>
        </div>
      </div>
    </section>
  );
};
