import React from "react";
import { SectionHeader } from "../components/SectionHeader";
import { SKILLS_DATA } from "../data/skills.data";
import { CheckCircle2, Terminal } from "lucide-react";

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <SectionHeader
        badge="05 // TECHNICAL CAPABILITIES"
        title="Skills & Technologies"
        subtitle="Grounded in actual project implementations, dependencies, and engineering coursework. No arbitrary percentages or fabricated radar scores."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SKILLS_DATA.map((category) => (
          <div
            key={category.title}
            className="glass-panel glass-specular rounded-3xl p-6 sm:p-8 border border-white/12 flex flex-col justify-between shadow-2xl"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={16} className="text-[#8D83C9]" />
                <h3 className="font-display font-bold text-xl text-[#F1EBDD]">
                  {category.title}
                </h3>
              </div>
              <p className="text-xs font-mono text-[#A6A5AE] mb-6">
                {category.subtitle}
              </p>

              {/* Skills Items List */}
              <div className="space-y-3.5">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/25 transition group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-semibold text-[#F1EBDD] group-hover:text-[#38BDF8] transition flex items-center gap-1.5">
                        {skill.isPrimary && (
                          <CheckCircle2 size={13} className="text-[#34D399]" />
                        )}
                        {skill.name}
                      </span>

                      <div className="flex items-center gap-1">
                        {skill.usedIn.slice(0, 2).map((proj) => (
                          <span
                            key={proj}
                            className="text-[10px] font-mono text-[#8D83C9] glass-pill px-2 py-0.5 rounded-full"
                          >
                            {proj}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs font-body text-[#A6A5AE] leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#A6A5AE]/70">
              <span className="glass-pill px-3 py-1 text-[#F1EBDD]/80">{category.skills.length} Documented Skills</span>
              <span className="glass-pill px-3 py-1 text-[#34D399]">Evidence-Verified</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
