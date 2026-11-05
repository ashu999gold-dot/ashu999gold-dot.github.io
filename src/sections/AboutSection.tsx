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
        {/* Editorial Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <p className="font-display text-2xl sm:text-3xl text-[#F1EBDD] font-normal leading-relaxed">
            {PORTFOLIO_CONFIG.about.paragraphs[0]}
          </p>

          <p className="font-body text-[#A6A5AE] text-base sm:text-lg leading-relaxed">
            {PORTFOLIO_CONFIG.about.paragraphs[1]}
          </p>

          <div className="pt-4 border-t border-[#8D83C9]/15">
            <p className="text-xs font-mono text-[#8D83C9]">
              CURRENT BASE: Gandhinagar, Gujarat, India · BTech Sophomore
            </p>
          </div>
        </div>

        {/* Pillars / Core Drive Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card glass-card-hover rounded-xl p-5 border border-[#8D83C9]/15">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#25264A]/60 text-[#38BDF8]">
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

          <div className="glass-card glass-card-hover rounded-xl p-5 border border-[#8D83C9]/15">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#25264A]/60 text-[#C084FC]">
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

          <div className="glass-card glass-card-hover rounded-xl p-5 border border-[#8D83C9]/15">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#25264A]/60 text-[#34D399]">
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
