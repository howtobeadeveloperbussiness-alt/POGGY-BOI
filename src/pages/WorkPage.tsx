import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Eye, ArrowRight, Layers } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from '../components/TiltCard';
import { SkeletonCard } from '../components/SkeletonCard';

interface WorkPageProps {
  navigate: (path: string) => void;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({ navigate, onOpenLightbox }) => {
  const { projects, activeCategory, setActiveCategory, searchQuery, setSearchQuery, isLoading } = usePortfolio();
  const [sortBy, setSortBy] = useState<'newest' | 'poly' | 'title'>('newest');

  // Derive unique categories from existing projects + standard list
  const categories = useMemo(() => {
    const defaultCats = ['All', 'Weapons', 'Props', 'Environment', 'Stylized', 'Low Poly', 'Roblox'];
    const projectCats = projects.map((p) => p.category);
    return Array.from(new Set([...defaultCats, ...projectCats]));
  }, [projects]);

  // Filter and sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesCat = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesSearch =
          !searchQuery.trim() ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.poly_count && p.poly_count.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'poly') {
          const aPoly = parseInt(a.poly_count?.replace(/[^0-9]/g, '') || '0', 10);
          const bPoly = parseInt(b.poly_count?.replace(/[^0-9]/g, '') || '0', 10);
          return aPoly - bPoly;
        }
        return 0;
      });
  }, [projects, activeCategory, searchQuery, sortBy]);

  return (
    <div className="pt-28 pb-24 min-h-screen relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Page Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
            <span>Portfolio Archive</span>
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl text-white tracking-tight">
            Complete Showcase
          </h1>
          <p className="mt-4 text-slate-300 text-sm sm:text-base font-body leading-relaxed">
            Explore 3D weapons, props, modular environments, and stylized assets created in Blender and optimized for low-latency Roblox Studio performance.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl glass-panel border border-white/10 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search weapons, poly count, tools, props..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-body"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'poly' | 'title')}
              className="px-3 py-2 rounded-xl glass-input text-xs font-mono bg-slate-900 border border-white/10 text-white cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="poly">Poly Count (Low to High)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                    : 'glass-panel text-slate-300 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Works Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} variant="project" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center rounded-3xl glass-panel border border-white/5 p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">No Matching Works Found</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 font-body">
              Try modifying your search keywords or switching category filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-6 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-mono uppercase tracking-widest border border-white/10 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((work) => (
              <TiltCard
                key={work.id}
                onClick={() => navigate(`/work/${work.slug || work.id}`)}
                className="rounded-2xl glass-panel border border-white/10 flex flex-col cursor-pointer transition-all duration-300 hover:border-cyan-500/40"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 group">
                  <img
                    src={work.image_url}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10">
                    {work.category}
                  </div>

                  {work.poly_count && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                      {work.poly_count}
                    </div>
                  )}

                  {/* Quick Zoom Lightbox Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLightbox(work.gallery_images || [work.image_url], 0, work.title);
                    }}
                    title="Expand Viewport Render"
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/70 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all border border-white/20 hover:border-cyan-400"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {work.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-body line-clamp-2 mt-1.5 leading-relaxed">
                      {work.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {work.tools.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-cyan-400 font-display font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
