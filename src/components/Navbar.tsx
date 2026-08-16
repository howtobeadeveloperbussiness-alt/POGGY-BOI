import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, isAdmin } = usePortfolio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Work', path: '/work' },
    { label: 'Projects', path: '/projects' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'glass-panel border-b border-white/10 shadow-2xl shadow-cyan-950/20 py-3.5'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="relative w-9 h-9 rounded-xl overflow-hidden glass-panel border border-cyan-500/30 group-hover:border-cyan-400 transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center bg-slate-950">
            <img
              src="/assets/logo.png"
              alt="POG Logo"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                // Fallback text if image not ready
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-display font-bold text-xs text-cyan-400 tracking-wider">POG</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-widest text-white group-hover:text-cyan-400 transition-colors">
              {settings.site_name || 'POG'}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-400/80">
              3D Modeler
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 rounded-full p-1.5 glass-panel border border-white/10">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`relative px-5 py-2 text-xs uppercase tracking-widest font-display transition-all rounded-full cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 font-semibold border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right CTA / Admin link */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => handleNavClick('/admin')}
              className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg glass-panel border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick('/contact')}
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs uppercase tracking-widest font-display font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] border border-cyan-400/30 cursor-pointer"
          >
            <span>Contact Me</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl glass-panel border border-white/10 text-white md:hidden hover:border-cyan-500/40 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-50 rounded-2xl glass-panel border border-white/15 p-6 shadow-2xl shadow-black/80 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-display uppercase tracking-widest transition-all text-left ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                </button>
              );
            })}

            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
              {isAdmin && (
                <button
                  onClick={() => handleNavClick('/admin')}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs font-mono"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              )}
              <button
                onClick={() => handleNavClick('/contact')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display text-xs uppercase tracking-widest font-semibold text-center border border-cyan-400/30"
              >
                Contact Me
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
