import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Gamepad2,
  Crosshair,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Eye
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from '../components/TiltCard';
import { MagneticButton } from '../components/MagneticButton';
import { DynamicIcon } from '../components/DynamicIcon';
import { SkeletonCard } from '../components/SkeletonCard';

interface HomePageProps {
  navigate: (path: string) => void;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onOpenLightbox }) => {
  const { projects, currentProjects, services, skills, settings, isLoading } = usePortfolio();

  const featuredWorks = projects.filter((p) => p.featured).slice(0, 4);
  const displayWorks = featuredWorks.length > 0 ? featuredWorks : projects.slice(0, 4);
  const primaryCurrentProject = currentProjects[0];

  return (
    <div className="relative min-h-screen">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Banner with gradient masking and subtle blur */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-25">
          <img
            src="/assets/banner.png"
            alt="POG Banner Atmospheric"
            className="w-full h-full object-cover object-center filter blur-[2px] scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Gradients to blend banner seamlessly into near-black foundation */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-[#07090e]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-transparent to-[#07090e]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 text-center flex flex-col items-center">
          {/* Micro Label Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/40 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-8 shadow-lg shadow-cyan-950/40"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Roblox 3D Modeler & Digital Artist</span>
          </motion.div>

          {/* Cinematic Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-6xl sm:text-8xl lg:text-9xl tracking-tighter text-white leading-none uppercase"
          >
            <span className="text-gradient-cyan">{settings.hero_title || 'POG'}</span>
          </motion.h1>

          {/* Subtitle / Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base sm:text-xl text-slate-300 font-body leading-relaxed font-normal"
          >
            {settings.hero_description ||
              'Creating clean, optimized, game-ready assets for Roblox. Weapons, props, and environments built in Blender.'}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton
              variant="primary"
              onClick={() => navigate('/work')}
              className="px-8 py-4 text-xs uppercase tracking-widest"
            >
              <span className="flex items-center gap-2 font-semibold">
                <span>View Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              onClick={() => navigate('/contact')}
              className="px-8 py-4 text-xs uppercase tracking-widest"
            >
              <span>Contact Me</span>
            </MagneticButton>
          </motion.div>

          {/* Capability Highlights Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl"
          >
            {[
              { label: 'Topology', val: 'Clean Low-Poly' },
              { label: 'Primary Suite', val: 'Blender 4.x' },
              { label: 'Target Engine', val: 'Roblox Studio' },
              { label: 'Performance', val: '60 FPS Optimized' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-xl glass-panel border border-white/5 text-center flex flex-col items-center justify-center group hover:border-cyan-500/30 transition-colors"
              >
                <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest">
                  {stat.label}
                </span>
                <span className="mt-1 font-display font-semibold text-sm text-white">{stat.val}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CURRENTLY BUILDING (e.g. TRIGGER) */}
      {/* ========================================================================= */}
      {primaryCurrentProject && (
        <section className="py-24 border-t border-white/5 relative z-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="relative rounded-3xl glass-panel border border-cyan-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl shadow-cyan-950/40">
              {/* Background Glow */}
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Info */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Currently Building</span>
                  </div>

                  <div>
                    <h2 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight">
                      {primaryCurrentProject.title}
                    </h2>
                    <p className="text-sm font-mono text-cyan-400 mt-1 uppercase tracking-wider">
                      {primaryCurrentProject.category}
                    </p>
                  </div>

                  <p className="text-base text-slate-300 font-body leading-relaxed">
                    {primaryCurrentProject.description}
                  </p>

                  {/* Progress Indicator */}
                  {primaryCurrentProject.progress > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Production Milestone</span>
                        <span className="text-cyan-400 font-semibold">{primaryCurrentProject.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000 shadow-md shadow-cyan-500/50"
                          style={{ width: `${primaryCurrentProject.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Feature Highlights */}
                  {primaryCurrentProject.features && primaryCurrentProject.features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {primaryCurrentProject.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-body text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      onClick={() => navigate('/projects')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-display uppercase tracking-widest font-semibold transition-all cursor-pointer"
                    >
                      <span>Explore Active Projects</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Visual Frame */}
                <div className="lg:col-span-6">
                  <div
                    onClick={() =>
                      onOpenLightbox(
                        primaryCurrentProject.gallery_images || [primaryCurrentProject.image_url],
                        0,
                        primaryCurrentProject.title
                      )
                    }
                    className="group relative aspect-[16/10] rounded-2xl overflow-hidden glass-panel border border-white/15 cursor-pointer shadow-2xl"
                  >
                    <img
                      src={primaryCurrentProject.image_url}
                      alt={primaryCurrentProject.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    <div className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all border border-white/20">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. SELECTED WORK SHOWCASE */}
      {/* ========================================================================= */}
      <section className="py-24 border-t border-white/5 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
                Portfolio Showcase
              </p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
                Selected Works
              </h2>
            </div>

            <button
              onClick={() => navigate('/work')}
              className="inline-flex items-center gap-2 text-xs uppercase font-display tracking-widest text-slate-300 hover:text-cyan-400 transition-colors group cursor-pointer"
            >
              <span>View All Projects ({projects.length})</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <SkeletonCard key={n} variant="project" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayWorks.map((work) => (
                <TiltCard
                  key={work.id}
                  onClick={() => navigate(`/work/${work.slug || work.id}`)}
                  className="rounded-2xl glass-panel border border-white/10 flex flex-col cursor-pointer transition-all duration-300 hover:border-cyan-500/40"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={work.image_url}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-300 border border-white/10">
                      {work.category}
                    </div>
                    {work.poly_count && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
                        {work.poly_count}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {work.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-body line-clamp-2 mt-1 leading-relaxed">
                        {work.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
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
                      <span className="text-xs text-cyan-400 font-display font-medium group-hover:translate-x-0.5 transition-transform">
                        Explore →
                      </span>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SERVICES & WHAT I CAN BUILD */}
      {/* ========================================================================= */}
      <section className="py-24 border-t border-white/5 relative z-10 bg-[#06080e]/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              Capabilities & Offerings
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
              What I Can Build For You
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 font-body leading-relaxed">
              From competitive weapon balisongs and firearms to full modular sci-fi corridor environments and studio-grade presentation renders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="rounded-2xl glass-panel p-7 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                    <DynamicIcon name={srv.icon} className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-white group-hover:text-cyan-400 transition-colors">
                    {srv.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-slate-300 font-body leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                {srv.highlights && srv.highlights.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/5 space-y-1.5">
                    {srv.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 text-xs uppercase font-display tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <span>Learn More About Commission Rates & Specs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SKILLS & TOOLCHAIN */}
      {/* ========================================================================= */}
      <section className="py-24 border-t border-white/5 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Workflow & Precision
              </p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
                Mastered 3D Toolchain
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-body leading-relaxed">
                Specialized in the complete Blender-to-Roblox pipeline: hard-surface subdivision modeling, quad-dominant topology, modular mesh partitioning, and engine draw-call minimization.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/about')}
                  className="px-6 py-3 rounded-full glass-panel border border-white/15 text-xs uppercase font-display tracking-widest text-white hover:border-cyan-500/50 transition-all cursor-pointer"
                >
                  View Full Profile & Experience
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-center gap-2.5 text-cyan-400 mb-2">
                    <DynamicIcon name={skill.icon || 'Sparkles'} className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      {skill.category}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                    {skill.name}
                  </h4>
                  {skill.proficiency && (
                    <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Proficiency</span>
                      <span className="text-cyan-400">{skill.proficiency}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-24 border-t border-white/5 relative z-10 overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="p-10 sm:p-16 rounded-3xl glass-panel border border-cyan-500/40 relative overflow-hidden shadow-2xl shadow-cyan-950/40">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-indigo-600/10 to-purple-600/10 pointer-events-none" />

            <h2 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight">
              Let&apos;s Build Something
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-slate-300 font-body leading-relaxed">
              Open for freelance weapon commissions, studio environment contracts, and creative collaborations. Let&apos;s bring high fidelity to your Roblox project.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton
                variant="primary"
                onClick={() => navigate('/contact')}
                className="px-8 py-4 text-xs uppercase tracking-widest font-semibold"
              >
                <span>Initiate Contact</span>
              </MagneticButton>

              <button
                onClick={() => navigate('/projects')}
                className="px-8 py-4 rounded-full glass-panel border border-white/15 hover:border-cyan-500/40 text-xs font-display uppercase tracking-widest text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <span>View Roadmap</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
