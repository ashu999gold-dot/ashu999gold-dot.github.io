import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { CinematicLoader } from "./components/CinematicLoader";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { AcademicSection } from "./sections/AcademicSection";
import { AreasOfInterestSection } from "./sections/AreasOfInterestSection";
import { FeaturedProjectsSection } from "./sections/FeaturedProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { GitHubSection } from "./sections/GitHubSection";
import { ContactSection } from "./sections/ContactSection";
import { Footer } from "./sections/Footer";

export function App() {
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Normalize scroll progress based on hero height
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        const heroHeight = heroEl.offsetHeight || window.innerHeight;
        const progress = Math.min(1.5, Math.max(0, window.scrollY / heroHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#08090D] text-[#F1EBDD] font-body selection:bg-[#8D83C9]/40 selection:text-white">
      {/* Cinematic Loader */}
      <CinematicLoader isLoading={!isSceneLoaded} />

      {/* Persistent Navigation */}
      <Navbar />

      <main>
        {/* Hero Section with 3D Night Flower Valley */}
        <HeroSection
          onValleyLoaded={() => setIsSceneLoaded(true)}
          scrollProgress={scrollProgress}
        />

        {/* Section Divider Ethereal Light Line */}
        <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#8D83C9]/25 to-transparent my-4" />

        {/* About Section */}
        <AboutSection />

        <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#8D83C9]/20 to-transparent my-4" />

        {/* Academic Journey */}
        <AcademicSection />

        <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#8D83C9]/20 to-transparent my-4" />

        {/* Areas of Interest */}
        <AreasOfInterestSection />

        <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#8D83C9]/25 to-transparent my-4" />

        {/* Featured Projects Showcase with PULSE interactive simulator */}
        <FeaturedProjectsSection />

        <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#8D83C9]/20 to-transparent my-4" />

        {/* Skills Section */}
        <SkillsSection />

        <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#8D83C9]/20 to-transparent my-4" />

        {/* Live GitHub Explorer */}
        <GitHubSection />

        <div className="w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#8D83C9]/25 to-transparent my-4" />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
