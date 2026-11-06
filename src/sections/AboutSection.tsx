import React from "react";
import { SectionHeader } from "../components/SectionHeader";
import { PORTFOLIO_CONFIG } from "../config/portfolio.config";
import { Compass, Lightbulb, Code2 } from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto">
      <SectionHeader
        badge="01 // ABOUT"
        title="Curiosity at the intersection of engineering and code."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Editorial Narrative - Sitting Directly on Atmospheric Valley Background */}
        <div className="lg:col-span-7 space-y-6">
          <p className="font-display text-2xl sm:text-3xl text-[#F1EBDD] font-normal leading-relaxed drop-shadow-md">
            {PORTFOLIO_CONFIG.about.paragraphs[0]}
          </p>

          <p className="font-body text-[#A6A5AE] text-base sm:text-lg leading-relaxed drop-shadow">
            {PORTFOLIO_CONFIG.about.paragraphs[1]}
          </p>

          <div className="pt-4 border-t border-white/10">
            <span className="glass-pill px-3 py-1 text-xs font-mono text-[#8D83C9]">
              CURRENT BASE: Gandhinagar, Gujarat, India · BTech Sophomore
            </span>
          </div>
        </div>

        {/* Pillars / Core Drive Cards - Refined Glassmorphism */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel glass-panel-hover glass-specular rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8]">
                <Code2 size={18} />
              </div>
              <h3 className="font-display font-semibold text-base text-[#F1EBDD]">
                Interactive Software
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#A6A5AE] font-body leading-relaxed">
              Crafting responsive web tools, real-time graphics, and canvas interfaces that turn complex data into intuitive, enjoyable interactions.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover glass-specular rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-[#C084FC]/10 border border-[#C084FC]/20 text-[#C084FC]">
                <Lightbulb size={18} />
              </div>
              <h3 className="font-display font-semibold text-base text-[#F1EBDD]">
                Curiosity-Driven Experiments
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#A6A5AE] font-body leading-relaxed">
              Tackling problems across AI models, search heuristics, game simulations, and audio analysis simply to discover what is possible.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover glass-specular rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 text-[#34D399]">
                <Compass size={18} />
              </div>
              <h3 className="font-display font-semibold text-base text-[#F1EBDD]">
                Multidisciplinary Engineering
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#A6A5AE] font-body leading-relaxed">
              Blending mechanical principles, physical problem solving, and computer science abstractions into cohesive computational projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
