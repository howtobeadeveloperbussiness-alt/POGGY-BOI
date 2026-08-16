import React from 'react';
import { ArrowUpRight, MessageSquare, Gamepad2, Layers, ShieldCheck, Sparkles, Crown } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../context/ToastContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings, services } = usePortfolio();
  const { showToast } = useToast();

  return (
    <footer className="relative border-t border-white/10 bg-[#06080d] overflow-hidden pt-20 pb-12">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-40 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden glass-panel border border-cyan-500/30 p-1 flex items-center justify-center bg-slate-950">
                <img
                  src="/assets/logo.png"
                  alt="POG"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="font-display font-bold text-xs text-cyan-400">POG</span>
              </div>
              <div>
                <span className="font-display font-bold text-2xl tracking-widest text-white">
                  {settings.site_name || 'POG'}
                </span>
                <p className="font-mono text-xs text-cyan-400 uppercase tracking-widest">
                  Roblox 3D Modeler & Asset Designer
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed font-body max-w-md">
              {settings.footer_description ||
                'Creating clean, optimized, game-ready assets for Roblox. Weapons, props, and environments built in Blender.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available For Freelance & Studios</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-body">
              {['Home', 'About', 'Work', 'Projects', 'Services', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                      navigate(path);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
                    <span>{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialized Services */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-sm text-slate-400 font-body">
              {services.slice(0, 5).map((srv) => (
                <li key={srv.id} className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400/70 shrink-0" />
                  <span className="truncate">{srv.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Social Connect */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Direct Connect
            </h4>
            <div className="space-y-2.5">
              <a
                href="#discord"
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(settings.discord || 'pogger67_');
                  showToast('success', 'Copied Discord Handle', `Copied "${settings.discord || 'pogger67_'}" to clipboard!`);
                }}
                className="flex items-center justify-between p-3 rounded-xl glass-panel border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-mono text-slate-400">Discord</p>
                    <p className="text-xs font-semibold text-white">{settings.discord || 'pogger67_'}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>

              <a
                href={settings.roblox_profile_url || 'https://www.roblox.com/users/profile?username=opmasteraarav1'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl glass-panel border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Gamepad2 className="w-4 h-4 text-rose-400" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-mono text-slate-400">Roblox</p>
                    <p className="text-xs font-semibold text-white">{settings.roblox || 'opmasteraarav1'}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-white font-display font-semibold tracking-wider">POG STUDIO</span>
            <span>/</span>
            <span>Blender to Roblox Pipeline</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/admin')}
              className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
            <p>© {new Date().getFullYear()} POG. All rights reserved.</p>
          </div>
        </div>

        {/* Made by ARSHH Watermark with Jumping Crown */}
        <div className="pt-8 pb-2 flex items-center justify-center">
          <div 
            id="arshh-watermark"
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass-panel border border-cyan-500/30 bg-slate-950/80 shadow-[0_0_25px_rgba(0,240,255,0.15)] hover:shadow-[0_0_35px_rgba(0,240,255,0.35)] hover:border-cyan-400/60 transition-all duration-300 select-none"
          >
            {/* Subtle backlight glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-50 group-hover:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-2 text-sm sm:text-base font-mono">
              <span className="text-slate-300 font-semibold tracking-wider uppercase text-xs sm:text-sm">
                Made by
              </span>
              
              <div className="relative inline-flex items-center">
                {/* Jumping Crown centered directly over ARSHH */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-300 animate-crown-jump drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                </div>

                {/* Bold Glowing ARSHH Text */}
                <span className="font-display font-black tracking-widest text-base sm:text-lg bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent animate-glow-pulse-text font-extrabold uppercase">
                  ARSHH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
