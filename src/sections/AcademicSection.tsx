import React from "react";
import { SectionHeader } from "../components/SectionHeader";
import { GraduationCap, BookOpen, Binary, Award } from "lucide-react";

export const AcademicSection: React.FC = () => {
  return (
    <section id="academics" className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <SectionHeader
        badge="02 // ACADEMIC PROFILE"
        title="Foundation at IIT Gandhinagar"
        subtitle="Pursuing rigorous mechanical engineering fundamentals paired with a computer science minor."
      />

      {/* Academic Profile Hero Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-10 border border-[#8D83C9]/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 radial-glow-cyan opacity-25 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#8D83C9]/15">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#101522] border-2 border-[#8D83C9]/40 flex items-center justify-center flex-shrink-0 shadow-lg">
              <GraduationCap className="text-[#38BDF8]" size={36} />
            </div>
            <div>
              <span className="text-xs font-mono text-[#8D83C9] uppercase tracking-wider">
                Institute of Technology
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F1EBDD]">
                Indian Institute of Technology Gandhinagar
              </h3>
              <p className="text-sm font-body text-[#A6A5AE] mt-0.5">
                Gandhinagar, Gujarat, India
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-[#25264A]/70 border border-[#8D83C9]/30 text-xs font-mono text-[#F1EBDD]">
              Undergraduate Degree
            </span>
          </div>
        </div>

        {/* Dual Disciplines Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {/* Major */}
          <div className="p-5 rounded-xl bg-[#08090D]/60 border border-[#8D83C9]/15 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-[#25264A]/60 text-[#38BDF8]">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-wider">
                Major Discipline
              </span>
              <h4 className="font-display font-semibold text-lg text-[#F1EBDD] mt-0.5">
                BTech in Mechanical Engineering
              </h4>
              <p className="text-xs sm:text-sm text-[#A6A5AE] font-body mt-2 leading-relaxed">
                Core engineering principles including mechanics, thermodynamics, fluid dynamics, manufacturing processes, and computer-aided design (CAD).
              </p>
            </div>
          </div>

          {/* Minor */}
          <div className="p-5 rounded-xl bg-[#08090D]/60 border border-[#8D83C9]/15 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-[#25264A]/60 text-[#C084FC]">
              <Binary size={20} />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#C084FC] tracking-wider">
                Minor Specialization
              </span>
              <h4 className="font-display font-semibold text-lg text-[#F1EBDD] mt-0.5">
                Computer Science and Engineering
              </h4>
              <p className="text-xs sm:text-sm text-[#A6A5AE] font-body mt-2 leading-relaxed">
                Foundations in data structures, algorithms, computational theory, operating systems, and software design principles.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#8D83C9]/10 flex items-center justify-between text-xs font-mono text-[#A6A5AE]">
          <span className="flex items-center gap-1.5">
            <Award size={13} className="text-[#34D399]" />
            Verified Academic Profile · IITGN
          </span>
          <span className="text-[#8D83C9]">Dual Mechanical & Computing Focus</span>
        </div>
      </div>
    </section>
  );
};
