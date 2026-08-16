import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  ArrowUpRight,
  ExternalLink,
  MessageSquare,
  FileCheck
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../context/ToastContext';
import { MagneticButton } from '../components/MagneticButton';
import { TiltCard } from '../components/TiltCard';

export const ContactPage: React.FC = () => {
  const { settings, services } = usePortfolio();
  const { showToast } = useToast();

  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [copiedRoblox, setCopiedRoblox] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    service: 'Weapon Modeling',
    polyBudget: 'Under 1.5k Tris (Low Poly)',
    timeline: '1-2 Weeks',
    budget: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopy = (text: string, type: 'discord' | 'roblox') => {
    navigator.clipboard.writeText(text);
    if (type === 'discord') {
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2000);
      showToast('success', 'Copied Discord Handle', `Copied "${text}" to clipboard!`);
    } else {
      setCopiedRoblox(true);
      setTimeout(() => setCopiedRoblox(false), 2000);
      showToast('success', 'Copied Roblox Handle', `Copied "${text}" to clipboard!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.handle || !formData.description) {
      showToast('warning', 'Missing Details', 'Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('success', 'Inquiry Prepared!', 'Your commission brief is ready. You can also DM directly on Discord.');
    }, 800);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      handle: '',
      service: 'Weapon Modeling',
      polyBudget: 'Under 1.5k Tris (Low Poly)',
      timeline: '1-2 Weeks',
      budget: '',
      description: '',
    });
    setSubmitted(false);
  };

  const faqs = [
    {
      q: 'What formats do you provide for delivered models?',
      a: 'All 3D assets are delivered in standard FBX and OBJ formats, alongside ready-to-import Roblox Studio files (.RBXL / .RBXM) with optimized SurfaceAppearance textures and properly configured collision hulls.'
    },
    {
      q: 'What is your typical turnaround time?',
      a: 'Individual weapons and props typically take 2-4 business days. Larger environment packs or custom multi-asset kits take 1-3 weeks depending on asset count and level of detail.'
    },
    {
      q: 'How do you handle revisions?',
      a: 'Every commission includes 2 rounds of structural silhouette revisions at the blockout stage, followed by texture/material refinement prior to final delivery.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'Payments are accepted in Robux (via group payouts or gamepasses with tax covered) as well as USD (via PayPal or Stripe invoice).'
    }
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>COMMISSIONS {settings.available_for_hire ? 'OPEN' : 'BUSY'}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Touch</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Have a Roblox experience or 3D asset project in mind? Reach out directly via Discord or send a structured commission brief below.
          </p>
        </div>

        {/* Primary Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Discord Card */}
          <TiltCard maxTilt={5}>
            <div className="p-8 rounded-2xl glass-panel border border-cyan-500/30 flex flex-col justify-between h-full group hover:border-cyan-400/60 transition-all shadow-xl shadow-cyan-950/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Fastest Response
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Discord Direct Message
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Send a friend request or direct message for rapid project quotes and feedback.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
                  <span className="font-mono text-cyan-400 font-semibold text-sm">
                    {settings.discord || 'pogger67_'}
                  </span>
                  <button
                    onClick={() => handleCopy(settings.discord || 'pogger67_', 'discord')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    {copiedDiscord ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDiscord ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Typical reply: &lt; 2 hours
                </span>
                <span className="text-emerald-400">Online Daily</span>
              </div>
            </div>
          </TiltCard>

          {/* Roblox Card */}
          <TiltCard maxTilt={5}>
            <div className="p-8 rounded-2xl glass-panel border border-white/15 flex flex-col justify-between h-full group hover:border-blue-400/60 transition-all shadow-xl shadow-blue-950/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    Verified Creator
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-blue-400 transition-colors">
                    Roblox Profile
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Follow or inspect created experiences, models, and dev group collaborations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
                  <span className="font-mono text-blue-400 font-semibold text-sm">
                    {settings.roblox || 'opmasteraarav1'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(settings.roblox || 'opmasteraarav1', 'roblox')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      {copiedRoblox ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRoblox ? 'Copied' : 'Copy'}</span>
                    </button>

                    <a
                      href={settings.roblox_profile_url || `https://www.roblox.com/users/profile?username=${settings.roblox}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                      title="Open Profile"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                  DevForum Verified
                </span>
                <a 
                  href={settings.roblox_profile_url || `https://www.roblox.com/users/profile?username=${settings.roblox}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  View Profile <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </TiltCard>

        </div>

        {/* Commission Brief Form & Information */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel border border-white/15 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {submitted ? (
            <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-white">Inquiry Brief Compiled!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Your project specifications have been noted. For immediate processing, feel free to send a DM on Discord citing your brief summary:
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 text-left max-w-lg mx-auto space-y-3 font-mono text-xs text-slate-300">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Client / Handle:</span>
                  <span className="text-cyan-400 font-semibold">{formData.name} ({formData.handle})</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Service:</span>
                  <span className="text-white">{formData.service}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Poly Target:</span>
                  <span className="text-white">{formData.polyBudget}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Timeline:</span>
                  <span className="text-white">{formData.timeline}</span>
                </div>
                <div className="pt-1 text-slate-400">
                  <span className="block mb-1 text-slate-500 uppercase tracking-widest text-[10px]">Overview:</span>
                  <p className="text-slate-200">{formData.description}</p>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => handleCopy(`[POG 3D Commission Brief]\nClient: ${formData.name} (${formData.handle})\nService: ${formData.service}\nPoly Target: ${formData.polyBudget}\nTimeline: ${formData.timeline}\nDetails: ${formData.description}`, 'discord')}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Copy Summary For Discord
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl glass-panel border border-white/20 text-white font-display text-xs uppercase tracking-wider hover:bg-white/5 transition-all cursor-pointer"
                >
                  New Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="border-b border-white/10 pb-6">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Project Planner</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                  Commission Specification Form
                </h2>
                <p className="text-slate-400 text-xs md:text-sm mt-1">
                  Fill out your project requirements to formulate an accurate estimate and asset scope.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Your Name / Studio <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex / Vortex Studios"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                {/* Handle */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Discord Tag or Roblox User <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. dev_alex#0001 or @AlexDev"
                    value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                {/* Service Needed */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Service Scope
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                  >
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.title} className="bg-slate-900 text-white">
                        {srv.title}
                      </option>
                    ))}
                    <option value="Custom Project Pack" className="bg-slate-900 text-white">Custom Project Pack</option>
                  </select>
                </div>

                {/* Poly Budget */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Target Poly Budget
                  </label>
                  <select
                    value={formData.polyBudget}
                    onChange={(e) => setFormData({ ...formData, polyBudget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                  >
                    <option value="Under 500 Tris (Ultra Low Poly)" className="bg-slate-900 text-white">Under 500 Tris (Ultra Low Poly)</option>
                    <option value="Under 1.5k Tris (Standard Roblox)" className="bg-slate-900 text-white">Under 1.5k Tris (Standard Roblox)</option>
                    <option value="1.5k - 4k Tris (High Detail / Inspect)" className="bg-slate-900 text-white">1.5k - 4k Tris (High Detail / Inspect)</option>
                    <option value="Flexible / As Needed" className="bg-slate-900 text-white">Flexible / As Needed</option>
                  </select>
                </div>

                {/* Timeline */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Expected Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                  >
                    <option value="Rush (< 3 Days)" className="bg-slate-900 text-white">Rush (&lt; 3 Days)</option>
                    <option value="1-2 Weeks" className="bg-slate-900 text-white">1-2 Weeks</option>
                    <option value="3-4 Weeks" className="bg-slate-900 text-white">3-4 Weeks</option>
                    <option value="Flexible" className="bg-slate-900 text-white">Flexible</option>
                  </select>
                </div>

                {/* Budget Range */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Budget (Robux or USD)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15,000 R$ or $120 USD"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Project Scope & Reference Links <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the assets needed, art style, reference images (Imgur, Pinterest), and any specific mechanic/rigging constraints..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="text-xs text-slate-400 font-mono text-center sm:text-left">
                  <span>Fast delivery & 100% Roblox Studio compatibility guaranteed</span>
                </div>

                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  className="flex items-center gap-2.5 px-8 py-3.5 text-xs uppercase tracking-widest font-bold shadow-lg shadow-cyan-500/25"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Submit Brief</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </MagneticButton>
              </div>
            </form>
          )}
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono">
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all space-y-2"
              >
                <h4 className="text-sm font-display font-bold text-cyan-300">
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
