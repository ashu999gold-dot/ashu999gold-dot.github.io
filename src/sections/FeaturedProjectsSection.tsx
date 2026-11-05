import React, { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectDetailModal } from "../components/ProjectDetailModal";
import { PROJECTS_DATA, type ProjectItem } from "../data/projects.data";
import { Filter } from "lucide-react";

export const FeaturedProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const categories = [
    "All",
    "Creative Technology",
    "AI & Systems",
    "Web Applications",
    "Algorithms & Games",
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <SectionHeader
          badge="04 // FEATURED WORK"
          title="Verified Projects & Systems"
          subtitle="A curated inventory of actual applications, algorithms, and interactive tools built across web, graphics, and AI."
        />

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap p-1.5 rounded-2xl bg-[#101522]/80 border border-[#8D83C9]/15 backdrop-blur-md self-start md:self-auto">
          <div className="px-2 text-xs font-mono text-[#8D83C9] flex items-center gap-1 hidden sm:flex">
            <Filter size={12} />
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#8D83C9]/30 text-[#F1EBDD] font-medium border border-[#8D83C9]/50 shadow"
                  : "text-[#A6A5AE] hover:text-[#F1EBDD] border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={(proj) => setActiveModalProject(proj)}
          />
        ))}
      </div>

      {/* Detail Modal */}
      <ProjectDetailModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
