import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { CinematicLoader } from "./components/CinematicLoader";
import { NightFlowerValley } from "./experience/NightFlowerValley";
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

  return (
    <div className="relative min-h-screen bg-[#04060A] text-[#F1EBDD] font-body selection:bg-[#8D83C9]/40 selection:text-white overflow-x-hidden">
      {/* Cinematic Loader */}
      <CinematicLoader isLoading={!isSceneLoaded} />

      {/* Persistent Continuous 3D Night Flower Valley Background (Mounted Once for the Entire Site) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <NightFlowerValley onLoaded={() => setIsSceneLoaded(true)} />
      </div>

      {/* Persistent Floating Glass Navigation */}
      <Navbar />

      {/* Main Content Layer Scrolling Smoothly over the Continuous 3D Flower World */}
      <main className="relative z-10 pointer-events-auto">
        {/* Hero Section */}
        <HeroSection />

        {/* Section Divider Ethereal Glowing Line */}
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
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default App;
