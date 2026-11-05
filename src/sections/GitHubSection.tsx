import React from "react";
import { SectionHeader } from "../components/SectionHeader";
import { GitHubExplorer } from "../components/GitHubExplorer";

export const GitHubSection: React.FC = () => {
  return (
    <section id="github" className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <SectionHeader
        badge="06 // LIVE GITHUB ACTIVITY"
        title="Open Repositories & Activity"
        subtitle="Live integration with the GitHub API. Automatically queries public repositories and profile activity for @ashu999gold-dot."
      />

      <GitHubExplorer />
    </section>
  );
};
