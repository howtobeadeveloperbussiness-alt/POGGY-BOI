import React from 'react';
import {
  Sparkles,
  Sword,
  Box,
  Landmark,
  Layers,
  Cpu,
  Palette,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Zap,
  HelpCircle
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { DynamicIcon } from '../components/DynamicIcon';
import { MagneticButton } from '../components/MagneticButton';

interface ServicesPageProps {
  navigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const { services, settings } = usePortfolio();

  const commissionFaq = [
    {
      q: 'How are asset poly counts determined?',
      a: 'Poly counts are tailored to your game type. Melee weapons & props are typically 500–1,500 tris. Modular environmental sets are kept under strict budgets with instancing to ensure smooth 60 FPS on mobile and low-end devices.',
    },
    {
      q: 'How do you deliver assets to clients?',
      a: 'Assets can be delivered as .blend files, exported .FBX/.OBJ with embedded materials/textures, or directly uploaded into a Roblox Studio .RBXL place file with SurfaceAppearance PBR configurations ready.',
    },
    {
      q: 'Do you offer Moon Animator rig setups?',
      a: 'Yes. For weapon inspects, firearm slide actions, and magazine reloads, Motor6D joint hierarchies and rig pivots can be pre-configured for seamless animation.',
    },
    {
      q: 'What are Studio Style Designs?',
      a: 'Studio Style Designs include high-fidelity presentation renders, custom Blender lighting showcases, UI-ready icon renders, and visual asset packages specifically formatted for Roblox Studio game developers and studio branding.',
    },
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Commission Offerings & Deliverables</span>
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl text-white tracking-tight">
            Services & Capabilities
          </h1>
          <p className="mt-4 text-slate-300 text-sm sm:text-base font-body leading-relaxed">
            Professional 3D modeling, low-poly optimization, weapon mechanics, and studio-grade renders engineered specifically for the Roblox engine ecosystem.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="rounded-3xl glass-panel p-8 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-cyan-950/20"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                  <DynamicIcon name={srv.icon} className="w-7 h-7" />
                </div>

                <h3 className="font-display font-bold text-2xl text-white group-hover:text-cyan-400 transition-colors">
                  {srv.title}
                </h3>

                <p className="mt-3 text-sm text-slate-300 font-body leading-relaxed">
                  {srv.description}
                </p>
              </div>

              {srv.highlights && srv.highlights.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-2.5">
                  <h4 className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-3">
                    Deliverables & Features
                  </h4>
                  {srv.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-body text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="py-16 border-t border-white/10">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              Common Questions
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Commission & Technical FAQ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commissionFaq.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
              >
                <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{item.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center p-12 rounded-3xl glass-panel border border-cyan-500/30">
          <h3 className="font-display font-bold text-3xl text-white">
            Ready to commission custom 3D assets?
          </h3>
          <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
            Reach out with your asset list, poly budget, or reference moodboard to get started.
          </p>
          <div className="mt-6 flex justify-center">
            <MagneticButton
              variant="primary"
              onClick={() => navigate('/contact')}
              className="px-8 py-3.5 text-xs uppercase tracking-widest font-semibold"
            >
              <span>Get In Touch</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
};
