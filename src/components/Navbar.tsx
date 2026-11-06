import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { GithubIcon } from "./GithubIcon";
import { PORTFOLIO_CONFIG } from "../config/portfolio.config";

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Detect active section
      const sections = PORTFOLIO_CONFIG.navItems.map((item) =>
        item.href.replace("#", "")
      );
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 pb-2 pointer-events-none transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Logo / Identity Glass Pill */}
        <a
          href="#hero"
          className="glass-pill px-3.5 py-1.5 flex items-center gap-2.5 group hover:border-white/30 transition shadow-lg"
          aria-label="Ashutosh Kumar Home"
        >
          <div className="w-6 h-6 rounded-full bg-white/[0.08] border border-white/20 flex items-center justify-center text-[#F1EBDD] font-display font-bold text-[11px] group-hover:border-[#38BDF8] transition">
            AK
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-semibold text-xs tracking-wide text-[#F1EBDD] group-hover:text-white transition">
              {PORTFOLIO_CONFIG.name}
            </span>
            <span className="text-[9px] font-mono text-[#A6A5AE] hidden sm:inline leading-none">
              IIT Gandhinagar
            </span>
          </div>
        </a>

        {/* Center Desktop Floating Glass Pill Nav */}
        <nav className="hidden md:flex items-center gap-1 glass-pill px-3 py-1.5 shadow-xl">
          {PORTFOLIO_CONFIG.navItems.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`relative px-3.5 py-1 rounded-full text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? "text-[#F1EBDD] font-semibold bg-white/[0.12] border border-white/25 shadow-sm"
                    : "text-[#A6A5AE] hover:text-[#F1EBDD] hover:bg-white/[0.05] border border-transparent"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action Glass Pill */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href={PORTFOLIO_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-mono text-[#F1EBDD] hover:border-white/30 hover:bg-white/[0.08] transition shadow-lg"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={13} />
            <span>GitHub</span>
          </a>
        </div>

        {/* Mobile Hamburger Button Glass Pill */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden glass-pill p-2 text-[#F1EBDD] cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Dropdown Glass Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-sm mx-auto glass-panel rounded-2xl p-4 shadow-2xl border border-white/15 pointer-events-auto">
          <nav className="flex flex-col gap-1">
            {PORTFOLIO_CONFIG.navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono transition ${
                    isActive
                      ? "bg-white/[0.14] text-[#F1EBDD] font-semibold border border-white/20"
                      : "text-[#A6A5AE] hover:text-[#F1EBDD] hover:bg-white/[0.06]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-2 mt-2 border-t border-white/10 flex justify-center">
              <a
                href={PORTFOLIO_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.1] text-xs font-mono text-[#F1EBDD] border border-white/15"
              >
                <GithubIcon size={14} />
                <span>Visit GitHub Profile</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
