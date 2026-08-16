import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Eye,
  Crosshair,
  Clock,
  Zap
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from '../components/TiltCard';

interface ProjectsPageProps {
  navigate: (path: string) => void;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ navigate, onOpenLightbox }) => {
  const { currentProjects, upcomingProjects } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming'>('current');

  return (
    <div className="pt-28 pb-24 min-h-screen relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Development Roadmap & Production</span>
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl text-white tracking-tight">
            Projects & Future Builds
          </h1>
          <p className="mt-4 text-slate-300 text-sm sm:text-base font-body leading-relaxed">
            Track active Roblox experiences and games in active production, alongside conceptual projects and asset pipeline milestones.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 w-fit mb-12">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-6 py-2.5 rounded-xl text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'current'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Currently Building ({currentProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2.5 rounded-xl text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming Pipeline ({upcomingProjects.length})
          </button>
        </div>

        {/* Tab 1: CURRENT PROJECTS */}
        {activeTab === 'current' && (
          <div className="space-y-12">
            {currentProjects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-3xl glass-panel border border-cyan-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl relative group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {/* Left Column */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {proj.status}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{proj.category}</span>
                    </div>

                    <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
                      {proj.title}
                    </h2>

                    <p className="text-base text-slate-300 font-body leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Current Production Progress</span>
                        <span className="text-cyan-400 font-semibold">{proj.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/10 p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Features checklist */}
                    {proj.features && proj.features.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                          Key Technical Milestones
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {proj.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-body text-slate-200">
                              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {proj.roblox_url && (
                      <div className="pt-4">
                        <a
                          href={proj.roblox_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display text-xs uppercase tracking-widest font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all border border-cyan-400/30"
                        >
                          <span>Experience on Roblox</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Column (Visual) */}
                  <div className="lg:col-span-6 space-y-3">
                    <div
                      onClick={() =>
                        onOpenLightbox(proj.gallery_images || [proj.image_url], 0, proj.title)
                      }
                      className="aspect-[16/10] rounded-2xl overflow-hidden glass-panel border border-white/15 cursor-pointer group/img relative shadow-2xl"
                    >
                      <img
                        src={proj.image_url}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover/img:opacity-20 transition-opacity" />
                      <div className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/15">
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>

                    {/* Gallery Thumbnails */}
                    {proj.gallery_images && proj.gallery_images.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {proj.gallery_images.map((img, i) => (
                          <div
                            key={i}
                            onClick={() => onOpenLightbox(proj.gallery_images || [], i, proj.title)}
                            className="w-20 h-14 rounded-lg overflow-hidden glass-panel border border-white/10 cursor-pointer opacity-70 hover:opacity-100 hover:border-cyan-400 transition-all shrink-0"
                          >
                            <img src={img} alt="Render" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: UPCOMING PROJECTS */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingProjects.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl glass-panel border border-white/10 p-6 flex flex-col justify-between space-y-6 hover:border-cyan-500/40 transition-all group"
              >
                <div>
                  <div className="aspect-[16/10] w-full rounded-xl overflow-hidden glass-panel border border-white/10 mb-5 bg-slate-950">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {item.status}
                    </span>
                    {item.estimated_date && (
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{item.estimated_date}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300 font-body leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Category: {item.category}</span>
                  <span className="text-cyan-400">In Pipeline</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
