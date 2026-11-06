import React from "react";
import { SectionHeader } from "../components/SectionHeader";
import { PORTFOLIO_CONFIG } from "../config/portfolio.config";
import { Code, Bot, Wrench, Sparkles, ArrowRight } from "lucide-react";

export const AreasOfInterestSection: React.FC = () => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Code className="text-[#38BDF8]" size={22} />;
      case 1:
        return <Bot className="text-[#C084FC]" size={22} />;
      case 2:
        return <Wrench className="text-[#34D399]" size={22} />;
      default:
        return <Sparkles className="text-[#F1EBDD]" size={22} />;
    }
  };

  return (
    <section id="focus" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <SectionHeader
        badge="03 // AREAS OF INTEREST"
        title="Domains of exploration & technical curiosity."
        subtitle="Focused technical interests cultivated through coursework, open experiments, and personal software builds."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PORTFOLIO_CONFIG.about.focusAreas.map((area, idx) => (
          <div
            key={area.number}
            className="glass-panel glass-panel-hover glass-specular rounded-3xl p-6 sm:p-7 border border-white/12 flex flex-col justify-between group transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="glass-pill px-3 py-1 text-xs font-mono text-[#8D83C9]">
                  {area.number}
                </span>
                <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/15 group-hover:border-white/30 transition">
                  {getIcon(idx)}
                </div>
              </div>

              <h3 className="font-display font-bold text-xl text-[#F1EBDD] mb-3 group-hover:text-white transition">
                {area.title}
              </h3>

              <p className="text-sm font-body text-[#A6A5AE] leading-relaxed mb-6">
                {area.description}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                {area.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-[#F1EBDD]/90 bg-white/[0.05] border border-white/10 px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="#projects"
                className="mt-5 flex items-center gap-1.5 text-xs font-mono text-[#8D83C9] group-hover:text-[#38BDF8] transition"
              >
                <span>View related builds</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
