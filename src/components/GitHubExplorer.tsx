import React, { useEffect, useState, useMemo } from "react";
import { Search, ExternalLink, GitFork, Star, RefreshCw, Lock, Sparkles } from "lucide-react";
import { GithubIcon } from "./GithubIcon";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  private: boolean;
  visibility?: string;
  topics?: string[];
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
}

export const GitHubExplorer: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [userInfo, setUserInfo] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [sortBy, setSortBy] = useState<"updated" | "stars">("updated");

  const fetchGitHubData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch public user profile
      const userRes = await fetch("https://api.github.com/users/ashu999gold-dot", {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!userRes.ok) {
        throw new Error(`GitHub API responded with status ${userRes.status}`);
      }

      const userData: GitHubUser = await userRes.json();
      setUserInfo(userData);

      // 2. Fetch public repositories
      const reposRes = await fetch(
        "https://api.github.com/users/ashu999gold-dot/repos?sort=updated&per_page=100",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!reposRes.ok) {
        throw new Error(`GitHub Repos API responded with status ${reposRes.status}`);
      }

      const reposData: GitHubRepo[] = await reposRes.json();
      const strictlyPublic = reposData.filter(
        (r) => !r.private && (r.visibility ? r.visibility === "public" : true)
      );
      setRepos(strictlyPublic);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load GitHub data";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  // Filter languages
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => {
      if (r.language) langs.add(r.language);
    });
    return Array.from(langs);
  }, [repos]);

  // Filtered & sorted repos
  const filteredRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        const matchesQuery =
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description &&
            repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesLang =
          selectedLanguage === "all" || repo.language === selectedLanguage;
        return matchesQuery && matchesLang;
      })
      .sort((a, b) => {
        if (sortBy === "stars") {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, [repos, searchQuery, selectedLanguage, sortBy]);

  return (
    <div className="space-y-6">
      {/* Live Profile Overview Glass Panel */}
      <div className="glass-panel glass-specular rounded-3xl p-6 sm:p-8 border border-white/12 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {userInfo?.avatar_url ? (
                <img
                  src={userInfo.avatar_url}
                  alt={userInfo.name || "Ashutosh Kumar"}
                  className="w-16 h-16 rounded-full border-2 border-white/20 object-cover shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/[0.08] border-2 border-white/20 flex items-center justify-center shadow-lg">
                  <GithubIcon className="text-[#8D83C9]" size={28} />
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#34D399] border-2 border-[#04060A]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-lg text-[#F1EBDD]">
                  {userInfo?.name || "Ashutosh Kumar"}
                </h3>
                <span className="glass-pill text-xs font-mono text-[#8D83C9] px-2.5 py-0.5">
                  @{userInfo?.login || "ashu999gold-dot"}
                </span>
              </div>
              <p className="text-sm text-[#A6A5AE] mt-1 font-body">
                {userInfo?.bio || "Sophomore at IIT Gandhinagar · Mechanical Engineering & CSE Minor"}
              </p>
              {userInfo?.location && (
                <span className="text-xs font-mono text-[#8D83C9]/80 mt-1 inline-block">
                  📍 {userInfo.location}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-3 text-center">
              <div className="glass-pill px-3.5 py-1.5 rounded-2xl">
                <span className="block font-mono text-base font-semibold text-[#F1EBDD]">
                  {userInfo ? userInfo.public_repos : 0}
                </span>
                <span className="text-[10px] font-mono text-[#A6A5AE] uppercase">Public Repos</span>
              </div>
              <div className="glass-pill px-3.5 py-1.5 rounded-2xl">
                <span className="block font-mono text-base font-semibold text-[#F1EBDD]">
                  {userInfo ? userInfo.followers : 2}
                </span>
                <span className="text-[10px] font-mono text-[#A6A5AE] uppercase">Followers</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchGitHubData}
                disabled={loading}
                className="p-2.5 rounded-full glass-pill hover:bg-white/[0.1] text-[#F1EBDD] transition cursor-pointer disabled:opacity-50"
                title="Refresh live GitHub API"
                aria-label="Refresh GitHub Data"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
              <a
                href="https://github.com/ashu999gold-dot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F1EBDD] hover:bg-white text-[#04060A] font-medium text-xs font-mono transition shadow-lg hover:scale-105"
              >
                <GithubIcon size={14} />
                <span>Profile</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Repository Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <label htmlFor="github-repo-search" className="sr-only">Filter public repositories</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A5AE]" size={16} />
          <input
            id="github-repo-search"
            name="repoSearch"
            type="text"
            placeholder="Filter public repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-pill rounded-full pl-10 pr-4 py-2.5 text-sm text-[#F1EBDD] placeholder-[#A6A5AE]/60 focus:outline-none focus:border-white/30 font-mono transition"
          />
        </div>

        {availableLanguages.length > 0 && (
          <select
            id="github-language-filter"
            name="languageFilter"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="glass-pill rounded-full px-4 py-2.5 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-white/30 cursor-pointer"
          >
            <option value="all" className="bg-[#0D1220]">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang} className="bg-[#0D1220]">
                {lang}
              </option>
            ))}
          </select>
        )}

        <select
          id="github-sort-filter"
          name="sortFilter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "updated" | "stars")}
          className="glass-pill rounded-full px-4 py-2.5 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-white/30 cursor-pointer"
        >
          <option value="updated" className="bg-[#0D1220]">Recently Updated</option>
          <option value="stars" className="bg-[#0D1220]">Most Stars</option>
        </select>
      </div>

      {/* Explorer Results Container */}
      {loading ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/12 shadow-xl">
          <RefreshCw className="animate-spin mx-auto text-[#8D83C9] mb-3" size={24} />
          <p className="font-mono text-sm text-[#A6A5AE]">Querying live GitHub API for @ashu999gold-dot...</p>
        </div>
      ) : error ? (
        <div className="glass-panel rounded-3xl p-8 text-center border border-red-500/20 bg-red-950/20 shadow-xl">
          <p className="font-mono text-sm text-red-300 mb-2">GitHub API Notice: {error}</p>
          <p className="text-xs text-[#A6A5AE] font-body">
            Public rate limits may apply. Please explore the verified project showcase above.
          </p>
        </div>
      ) : filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="glass-panel glass-panel-hover glass-specular rounded-2xl p-5 border border-white/12 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-mono font-semibold text-base text-[#F1EBDD] hover:text-[#38BDF8] transition flex items-center gap-2">
                    <GithubIcon size={16} className="text-[#8D83C9]" />
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>
                  </h4>
                  <span className="text-[10px] font-mono uppercase bg-[#34D399]/15 text-[#34D399] px-2 py-0.5 rounded-full border border-[#34D399]/30">
                    Public
                  </span>
                </div>
                <p className="text-sm text-[#A6A5AE] font-body line-clamp-2 mb-4">
                  {repo.description || "No public description provided."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono text-[#A6A5AE]">
                <div className="flex items-center gap-3">
                  {repo.language && (
                    <span className="flex items-center gap-1 text-[#F1EBDD]">
                      <span className="w-2 h-2 rounded-full bg-[#8D83C9]" />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star size={12} />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={12} />
                    {repo.forks_count}
                  </span>
                </div>

                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#8D83C9] hover:text-[#F1EBDD] transition"
                >
                  <span>Code</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Honest, Respectful Empty State */
        <div className="glass-panel rounded-3xl p-8 md:p-12 text-center border border-white/12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 radial-glow-cyan opacity-40 pointer-events-none" />
          <div className="max-w-md mx-auto relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center mx-auto mb-4 text-[#8D83C9] shadow-lg">
              <Lock size={22} />
            </div>
            <h4 className="font-display text-lg font-semibold text-[#F1EBDD] mb-2">
              Repositories Currently in Private Development
            </h4>
            <p className="text-sm text-[#A6A5AE] font-body leading-relaxed mb-6">
              Live GitHub API returned <span className="font-mono text-[#F1EBDD]">0 public repositories</span> for{" "}
              <span className="font-mono text-[#8D83C9]">@ashu999gold-dot</span>. Active student projects (including AI Advisor, PULSE, CampusRadar, and SlotSync) are maintained in private development repositories.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs font-mono text-[#8D83C9]">
              <Sparkles size={13} className="text-[#38BDF8]" />
              <span>Explore verified technical architecture in the Featured Projects section above</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
