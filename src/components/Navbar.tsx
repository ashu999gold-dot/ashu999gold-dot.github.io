import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { GithubIcon } from "./GithubIcon";
import { PORTFOLIO_CONFIG } from "../config/portfolio.config";

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Detect active section
      const sections = PORTFOLIO_CONFIG.navItems.map((item) =>
        item.href.replace("#", "")
      );
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-[#08090D]/85 backdrop-blur-md border-b border-[#8D83C9]/15 shadow-xl shadow-black/40"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo / Identity */}
          <a
            href="#hero"
            className="flex items-center gap-2 group text-left"
            aria-label="Ashutosh Kumar Home"
          >
            <div className="w-8 h-8 rounded-full bg-[#101522] border border-[#8D83C9]/40 flex items-center justify-center text-[#F1EBDD] font-display font-bold text-xs group-hover:border-[#38BDF8] transition">
              AK
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-sm tracking-wide text-[#F1EBDD] group-hover:text-white transition">
                {PORTFOLIO_CONFIG.name}
              </span>
              <span className="text-[10px] font-mono text-[#A6A5AE] hidden sm:inline">
                IIT Gandhinagar
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-[#101522]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#8D83C9]/15">
            {PORTFOLIO_CONFIG.navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? "bg-[#8D83C9]/25 text-[#F1EBDD] font-semibold border border-[#8D83C9]/40"
                      : "text-[#A6A5AE] hover:text-[#F1EBDD] border border-transparent"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={PORTFOLIO_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#101522]/80 hover:bg-[#25264A] text-[#F1EBDD] text-xs font-mono border border-[#8D83C9]/20 transition"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={13} />
              <span>GitHub</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#101522]/80 border border-[#8D83C9]/20 text-[#F1EBDD] cursor-pointer"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#08090D]/95 backdrop-blur-xl flex flex-col justify-between p-6">
          <div className="flex items-center justify-between border-b border-[#8D83C9]/15 pb-4">
            <span className="font-display font-bold text-base text-[#F1EBDD]">
              {PORTFOLIO_CONFIG.name}
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-[#101522] border border-[#8D83C9]/20 text-[#F1EBDD]"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-col gap-3 my-auto">
            {PORTFOLIO_CONFIG.navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-xl text-[#F1EBDD] hover:text-[#38BDF8] transition py-2 border-b border-white/5"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#8D83C9]/15 flex items-center justify-between">
            <span className="text-xs font-mono text-[#A6A5AE]">
              IIT Gandhinagar · ME & CSE
            </span>
            <a
              href={PORTFOLIO_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25264A] text-xs font-mono text-[#F1EBDD]"
            >
              <GithubIcon size={13} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
