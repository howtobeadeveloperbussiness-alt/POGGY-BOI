import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Cpu,
  ExternalLink,
  Gamepad2,
  Maximize2,
  Sparkles,
  CheckCircle,
  Share2,
  ChevronRight
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../context/ToastContext';

interface ProjectDetailPageProps {
  projectIdOrSlug: string;
  navigate: (path: string) => void;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectIdOrSlug,
  navigate,
  onOpenLightbox,
}) => {
  const { projects } = usePortfolio();
  const { showToast } = useToast();

  const project = projects.find(
    (p) => p.id === projectIdOrSlug || p.slug === projectIdOrSlug
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) {
    return (
      <div className="pt-36 pb-24 min-h-screen text-center px-6">
        <div className="max-w-md mx-auto rounded-3xl glass-panel p-8 border border-white/10">
          <h2 className="font-display font-bold text-2xl text-white">Project Not Found</h2>
          <p className="text-sm text-slate-400 mt-2 font-body">
            The requested 3D asset showcase does not exist or was relocated.
          </p>
          <button
            onClick={() => navigate('/work')}
            className="mt-6 px-6 py-3 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 text-xs font-mono uppercase tracking-widest cursor-pointer hover:bg-cyan-500/30 transition-all"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const allImages = project.gallery_images && project.gallery_images.length > 0
    ? project.gallery_images
    : [project.image_url];

  const relatedProjects = projects
    .filter((p) => p.id !== project.id && (p.category === project.category || p.featured))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('success', 'Link Copied', 'Project URL copied to clipboard.');
  };

  return (
    <div className="pt-28 pb-24 min-h-screen relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <button
            onClick={() => navigate('/work')}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Works</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Share project link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Header Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {project.category}
              </span>
              {project.status && (
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {project.status}
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-body leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>

          {/* Technical Specs Card */}
          <div className="lg:col-span-4 rounded-2xl glass-panel p-6 border border-white/10 space-y-4 h-fit">
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-cyan-400 border-b border-white/5 pb-3">
              Technical Specifications
            </h3>

            <div className="space-y-3 text-xs font-mono">
              {project.poly_count && (
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Polygon Budget:</span>
                  <span className="text-cyan-300 font-semibold">{project.poly_count}</span>
                </div>
              )}
              {project.software && (
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Creation Suite:</span>
                  <span className="text-white">{project.software}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Target Engine:</span>
                <span className="text-white">Roblox Studio</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Publication:</span>
                <span className="text-white">
                  {new Date(project.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Tools Used Badges */}
            <div className="pt-3 border-t border-white/5">
              <span className="text-[11px] font-mono text-slate-400 block mb-2">Pipeline Stack:</span>
              <div className="flex flex-wrap gap-1.5">
                {project.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Links if available */}
            {project.roblox_url && (
              <a
                href={project.roblox_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display text-xs uppercase tracking-widest font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all border border-cyan-400/30"
              >
                <span>View on Roblox</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Hero Interactive Gallery */}
        <div className="space-y-4 mb-20">
          <div
            onClick={() => onOpenLightbox(allImages, activeImageIndex, project.title)}
            className="group relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden glass-panel border border-white/15 cursor-pointer shadow-2xl shadow-cyan-950/30"
          >
            <img
              src={allImages[activeImageIndex]}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-mono border border-white/15 group-hover:border-cyan-400 transition-all">
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Viewport Lightbox</span>
            </div>
          </div>

          {/* Thumbnail Selector */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden glass-panel border transition-all cursor-pointer shrink-0 ${
                    index === activeImageIndex
                      ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/30'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="border-t border-white/10 pt-16">
            <h3 className="font-display font-bold text-2xl text-white mb-8">
              Explore Related 3D Assets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProjects.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    navigate(`/work/${rel.slug || rel.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-2xl glass-panel border border-white/10 overflow-hidden group cursor-pointer hover:border-cyan-500/40 transition-all"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-950">
                    <img
                      src={rel.image_url}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{rel.category}</span>
                    <h4 className="font-display font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mt-0.5">
                      {rel.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
