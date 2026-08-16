import React from 'react';
import {
  Sparkles,
  Layers,
  Cpu,
  Workflow,
  CheckCircle,
  Terminal,
  Gamepad2,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  Maximize2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { DynamicIcon } from '../components/DynamicIcon';
import { MagneticButton } from '../components/MagneticButton';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { settings, skills, services } = usePortfolio();

  const workflowSteps = [
    {
      step: '01',
      title: 'Concept & Silhouette Blocking',
      desc: 'Form factor design, scale reference against standard Roblox R15 rigs, and edge flow planning in Blender.',
    },
    {
      step: '02',
      title: 'Hard-Surface & Sub-D Modeling',
      desc: 'Precision poly modeling with bevel modifiers, weighted normals, and non-destructive modifier stacks.',
    },
    {
      step: '03',
      title: 'UV Unwrapping & Material Baking',
      desc: 'Optimized UV packing with zero texture bleeding, normal map baking, and high-contrast stylized hand-painting.',
    },
    {
      step: '04',
      title: 'Rigging & Moon Animator Setup',
      desc: 'Motor6D hierarchy structuring, pivot placement for firearm slides/reloads, and in-viewport animation checking.',
    },
    {
      step: '05',
      title: 'Roblox Studio Integration & LOD',
      desc: 'Importing via Asset Manager, CollisionFidelity optimization, SurfaceAppearance tuning, and draw-call validation.',
    },
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* About Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
              <span>Artist Profile</span>
            </div>

            <h1 className="font-display font-bold text-5xl sm:text-6xl text-white tracking-tight">
              {settings.about_title || "Who's POG"}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-body leading-relaxed">
              {settings.about_description ||
                'I am a Roblox 3D modeler and asset creator specializing in clean, optimized, game-ready assets built in Blender. From weapons to props and environments, I build models that look great and run smoothly in Roblox.'}
            </p>

            <p className="text-sm sm:text-base text-slate-400 font-body leading-relaxed">
              {settings.about_bio ||
                'Focused on low-poly topology, stylized texturing, and performance optimization for Roblox Studio.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <MagneticButton
                variant="primary"
                onClick={() => navigate('/contact')}
                className="px-6 py-3 text-xs uppercase tracking-wider font-semibold"
              >
                <span>Hire / Commission</span>
              </MagneticButton>

              <button
                onClick={() => navigate('/work')}
                className="px-6 py-3 rounded-full glass-panel border border-white/10 hover:border-cyan-400 text-xs uppercase font-display tracking-widest text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <span>View Works</span>
              </button>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl glass-panel border border-cyan-500/30 p-8 shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 p-1 border border-cyan-500/40 overflow-hidden shadow-lg shadow-cyan-500/20">
                  <img
                    src="/assets/logo.png"
                    alt="POG"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">{settings.site_name || 'POG'}</h3>
                  <p className="text-xs font-mono text-cyan-400">Roblox 3D Modeler & Digital Artist</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">Specialization: Hard Surface & Game Assets</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Target Platform:</span>
                  <span className="text-white font-semibold">Roblox Studio (PC/Mobile/Console)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Primary Software:</span>
                  <span className="text-white font-semibold">Blender 4.x</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Animation Suite:</span>
                  <span className="text-white font-semibold">Moon Animator / Blender</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Direct Discord:</span>
                  <span className="text-cyan-300 font-semibold">{settings.discord || 'pogger67_'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Roblox User:</span>
                  <span className="text-cyan-300 font-semibold">{settings.roblox || 'opmasteraarav1'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D WORKFLOW PIPELINE */}
        <div className="py-16 border-t border-white/10">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              Engineering Excellence
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Blender to Roblox Pipeline
            </h2>
            <p className="mt-3 text-sm text-slate-300 font-body">
              How every asset transitions from concept into an engine-optimized, high-frame-rate Roblox mesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {workflowSteps.map((step, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="font-display font-bold text-2xl text-cyan-400/60 block mb-3">
                    {step.step}
                  </span>
                  <h4 className="font-display font-bold text-base text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-body leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SKILLS & PROFICIENCY MATRIX */}
        <div className="py-16 border-t border-white/10">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              Core Capabilities
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Skills & Technical Toolset
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-cyan-400">
                    <DynamicIcon name={skill.icon || 'Sparkles'} className="w-5 h-5" />
                    <span className="font-display font-bold text-base text-white">{skill.name}</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    {skill.proficiency}%
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 font-body leading-relaxed">
                  {skill.description || 'Specialized in Roblox mesh constraints and high aesthetic polish.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
