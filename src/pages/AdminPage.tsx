import React, { useState, useRef } from 'react';
import { 
  Shield, 
  Lock, 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  FolderKanban, 
  Activity, 
  Layers, 
  Sliders, 
  Image as ImageIcon,
  ExternalLink,
  Upload,
  Eye,
  CheckCircle2,
  Tag,
  Boxes,
  Compass,
  Inbox,
  MessageSquare,
  Clock,
  Archive,
  Check,
  CloudUpload,
  KeyRound,
  Database
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../context/ToastContext';
import { Project, CurrentProject, UpcomingProject, Service, Skill, Inquiry } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';

type AdminTab = 'works' | 'current' | 'upcoming' | 'services' | 'skills' | 'settings' | 'inquiries';

export const AdminPage: React.FC = () => {
  const {
    projects,
    currentProjects,
    upcomingProjects,
    services,
    skills,
    settings,
    inquiries,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    createProject,
    updateProject,
    deleteProject,
    createCurrentProject,
    updateCurrentProject,
    deleteCurrentProject,
    createUpcomingProject,
    updateUpcomingProject,
    deleteUpcomingProject,
    createService,
    updateService,
    deleteService,
    updateSkill,
    updateSettings,
    syncAllToFirebase,
    resetToDefaults,
    updateInquiryStatus,
    deleteInquiry,
  } = usePortfolio();

  const { showToast } = useToast();

  // Authentication State
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('works');

  // Modal / Editing states
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Edit / Add State for Works (3D Models)
  const [editingWork, setEditingWork] = useState<Partial<Project> | null>(null);
  const [isNewWork, setIsNewWork] = useState(false);
  const [workTagInput, setWorkTagInput] = useState('');
  const [workGalleryInput, setWorkGalleryInput] = useState('');

  // Edit / Add State for Current Projects (Active Games/Experiences)
  const [editingCurrent, setEditingCurrent] = useState<Partial<CurrentProject> | null>(null);
  const [isNewCurrent, setIsNewCurrent] = useState(false);
  const [currentFeatureInput, setCurrentFeatureInput] = useState('');

  // Edit / Add State for Upcoming Projects
  const [editingUpcoming, setEditingUpcoming] = useState<Partial<UpcomingProject> | null>(null);
  const [isNewUpcoming, setIsNewUpcoming] = useState(false);

  // Edit / Add State for Services
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isNewService, setIsNewService] = useState(false);
  const [serviceHighlightInput, setServiceHighlightInput] = useState('');

  // Settings local edit buffer
  const [localSettings, setLocalSettings] = useState(settings);

  // Image Upload helper ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setAuthLoading(true);
    await loginAdmin(password);
    setAuthLoading(false);
  };

  // Helper for image upload -> DataURL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'work' | 'current' | 'upcoming') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'File Too Large', 'Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (target === 'work' && editingWork) {
        setEditingWork({
          ...editingWork,
          image_url: dataUrl,
          gallery_images: editingWork.gallery_images ? [...editingWork.gallery_images, dataUrl] : [dataUrl],
        });
      } else if (target === 'current' && editingCurrent) {
        setEditingCurrent({
          ...editingCurrent,
          image_url: dataUrl,
          gallery_images: editingCurrent.gallery_images ? [...editingCurrent.gallery_images, dataUrl] : [dataUrl],
        });
      } else if (target === 'upcoming' && editingUpcoming) {
        setEditingUpcoming({
          ...editingUpcoming,
          image_url: dataUrl,
        });
      }
      showToast('success', 'Image Loaded', 'Image loaded successfully into preview!');
    };
    reader.readAsDataURL(file);
  };

  // --- Handlers for Works ---
  const handleSaveWork = async () => {
    if (!editingWork?.title || !editingWork?.category) {
      showToast('error', 'Missing Data', 'Project title and category are required.');
      return;
    }

    try {
      const slug = editingWork.slug || editingWork.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const workData = {
        title: editingWork.title,
        slug,
        description: editingWork.description || '',
        category: editingWork.category,
        image_url: editingWork.image_url || '/assets/banner.png',
        gallery_images: editingWork.gallery_images && editingWork.gallery_images.length > 0
          ? editingWork.gallery_images 
          : [editingWork.image_url || '/assets/banner.png'],
        tools: editingWork.tools && editingWork.tools.length > 0 ? editingWork.tools : ['Blender', 'Roblox Studio'],
        software: editingWork.software || 'Blender',
        poly_count: editingWork.poly_count || '1,200 Tris',
        featured: !!editingWork.featured,
        sort_order: editingWork.sort_order || 1,
        status: editingWork.status || 'Completed',
        roblox_url: editingWork.roblox_url || '',
        external_url: editingWork.external_url || '',
      };

      if (isNewWork) {
        await createProject(workData);
        showToast('success', 'Work Created', `"${workData.title}" has been added to showcase!`);
      } else if (editingWork.id) {
        await updateProject(editingWork.id, workData);
        showToast('success', 'Work Updated', `"${workData.title}" changes have been saved.`);
      }
      setEditingWork(null);
    } catch {
      showToast('error', 'Save Failed', 'Unable to save project changes.');
    }
  };

  // --- Handlers for Current Projects ---
  const handleSaveCurrent = async () => {
    if (!editingCurrent?.title || !editingCurrent?.category) {
      showToast('error', 'Missing Data', 'Title and category are required.');
      return;
    }

    try {
      const slug = editingCurrent.slug || editingCurrent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const currData = {
        title: editingCurrent.title,
        slug,
        description: editingCurrent.description || '',
        category: editingCurrent.category,
        status: editingCurrent.status || 'In Development',
        progress: Number(editingCurrent.progress) || 50,
        image_url: editingCurrent.image_url || '/assets/banner.png',
        gallery_images: editingCurrent.gallery_images || [editingCurrent.image_url || '/assets/banner.png'],
        features: editingCurrent.features || ['High Performance Mesh Optimization', 'Custom Animation Rigs'],
        roblox_url: editingCurrent.roblox_url || '',
        external_url: editingCurrent.external_url || '',
        featured: !!editingCurrent.featured,
        sort_order: editingCurrent.sort_order || 1,
      };

      if (isNewCurrent) {
        await createCurrentProject(currData);
        showToast('success', 'Active Project Created', `"${currData.title}" added to active builds!`);
      } else if (editingCurrent.id) {
        await updateCurrentProject(editingCurrent.id, currData);
        showToast('success', 'Active Project Updated', `"${currData.title}" saved.`);
      }
      setEditingCurrent(null);
    } catch {
      showToast('error', 'Save Failed', 'Unable to save active project.');
    }
  };

  // --- Handlers for Upcoming Projects ---
  const handleSaveUpcoming = async () => {
    if (!editingUpcoming?.title || !editingUpcoming?.category) {
      showToast('error', 'Missing Data', 'Title and category are required.');
      return;
    }

    try {
      const upcData = {
        title: editingUpcoming.title,
        description: editingUpcoming.description || '',
        category: editingUpcoming.category,
        status: editingUpcoming.status || 'Planning',
        image_url: editingUpcoming.image_url || '/assets/banner.png',
        estimated_date: editingUpcoming.estimated_date || '2026',
        featured: !!editingUpcoming.featured,
        sort_order: editingUpcoming.sort_order || 1,
      };

      if (isNewUpcoming) {
        await createUpcomingProject(upcData);
        showToast('success', 'Pipeline Project Added', `"${upcData.title}" added to pipeline!`);
      } else if (editingUpcoming.id) {
        await updateUpcomingProject(editingUpcoming.id, upcData);
        showToast('success', 'Pipeline Project Updated', `"${upcData.title}" saved.`);
      }
      setEditingUpcoming(null);
    } catch {
      showToast('error', 'Save Failed', 'Unable to save upcoming project.');
    }
  };

  // --- Handlers for Services ---
  const handleSaveService = async () => {
    if (!editingService?.title || !editingService?.description) {
      showToast('error', 'Missing Data', 'Title and description are required.');
      return;
    }

    try {
      const srvData = {
        title: editingService.title,
        description: editingService.description,
        icon: editingService.icon || 'Sparkles',
        sort_order: editingService.sort_order || 1,
        active: editingService.active !== false,
        highlights: editingService.highlights || [],
      };

      if (isNewService) {
        await createService(srvData);
        showToast('success', 'Service Created', `"${srvData.title}" added.`);
      } else if (editingService.id) {
        await updateService(editingService.id, srvData);
        showToast('success', 'Service Updated', `"${srvData.title}" saved.`);
      }
      setEditingService(null);
    } catch {
      showToast('error', 'Save Failed', 'Unable to save service.');
    }
  };

  // --- Handlers for Settings & Firestore Sync ---
  const handleSaveSettings = async () => {
    try {
      await updateSettings(localSettings);
      showToast('success', 'Settings Saved', 'Site configuration and admin settings synchronized.');
    } catch {
      showToast('error', 'Save Failed', 'Unable to save site settings.');
    }
  };

  const handleTriggerSyncAll = async () => {
    try {
      setIsSyncingFirebase(true);
      await syncAllToFirebase();
    } catch {
      showToast('error', 'Sync Error', 'Failed to synchronize all records to Firebase.');
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  // If not logged in, render authentication login box
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="w-full max-w-md p-8 md:p-10 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-display font-bold text-white tracking-wide">
              POG CMS Portal
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Enter the administrative password to manage portfolio assets, showcase works, active projects, and settings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl glass-input border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-display font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/30 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 interactive-hover"
            >
              <Shield className="w-4 h-4" />
              <span>{authLoading ? 'Verifying...' : 'Access Dashboard'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] font-mono text-slate-500">
              Admin password: <code className="text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">LollyistheGOAT6711</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with Admin status & Logout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CMS CONTROL PANEL & ASSET MANAGER</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide">
              Studio Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Reset all portfolio entries to default template data?')) {
                  resetToDefaults();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-mono transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* PROMINENT QUICK ACTIONS BAR: ADD WORK OR PROJECT */}
        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">Quick Content Creation</h3>
              <p className="text-[11px] font-mono text-slate-400">Add new 3D model showcase works, Roblox experience projects, or upcoming concepts in one click.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setActiveTab('works');
                setEditingWork({
                  title: '',
                  slug: '',
                  description: '',
                  category: 'Weapons',
                  image_url: '/assets/banner.png',
                  gallery_images: ['/assets/banner.png'],
                  tools: ['Blender', 'Roblox Studio'],
                  software: 'Blender',
                  poly_count: '1,200 Tris',
                  featured: true,
                  sort_order: projects.length + 1,
                  status: 'Completed',
                });
                setIsNewWork(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-cyan-500/20 interactive-hover"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add 3D Model Work</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('current');
                setEditingCurrent({
                  title: '',
                  slug: '',
                  description: '',
                  category: 'Roblox FPS Experience',
                  status: 'In Development',
                  progress: 60,
                  image_url: '/assets/banner.png',
                  gallery_images: ['/assets/banner.png'],
                  features: ['Smooth animation rigs', 'Optimized map meshes'],
                  roblox_url: 'https://www.roblox.com/games',
                  featured: true,
                  sort_order: currentProjects.length + 1,
                });
                setIsNewCurrent(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-purple-500/20 interactive-hover"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Active Project</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('upcoming');
                setEditingUpcoming({
                  title: '',
                  description: '',
                  category: 'Environment Kit',
                  status: 'Planning',
                  image_url: '/assets/banner.png',
                  estimated_date: 'Q3 2026',
                  featured: false,
                  sort_order: upcomingProjects.length + 1,
                });
                setIsNewUpcoming(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border border-white/20 hover:border-cyan-400 text-slate-200 hover:text-white font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Pipeline Item</span>
            </button>

            <button
              onClick={handleTriggerSyncAll}
              disabled={isSyncingFirebase}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-500/20 interactive-hover ${isSyncingFirebase ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Save all works, active projects, pipeline concepts, services, skills, and admin password directly to Firebase Firestore"
            >
              <CloudUpload className={`w-4 h-4 ${isSyncingFirebase ? 'animate-bounce' : ''}`} />
              <span>{isSyncingFirebase ? 'Saving to Cloud...' : 'Sync All to Firebase'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10">
          {[
            { id: 'works', label: 'Showcase Works', icon: FolderKanban, count: projects.length },
            { id: 'current', label: 'Active Projects', icon: Activity, count: currentProjects.length },
            { id: 'upcoming', label: 'Upcoming Pipeline', icon: Layers, count: upcomingProjects.length },
            { id: 'services', label: 'Services', icon: Sparkles, count: services.length },
            { id: 'skills', label: 'Skills & Proficiencies', icon: Sliders, count: skills.length },
            { id: 'inquiries', label: 'Inquiries & Briefs', icon: Inbox, count: inquiries.length },
            { id: 'settings', label: 'Site Settings', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    tab.id === 'inquiries' && inquiries.filter(i => i.status === 'New').length > 0
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-white/10 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* --- TAB 1: SHOWCASE WORKS --- */}
        {activeTab === 'works' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">Showcase Works & 3D Models</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage the 3D models shown on the Work, Home, and Model Detail pages</p>
              </div>

              <button
                onClick={() => {
                  setEditingWork({
                    title: '',
                    slug: '',
                    description: '',
                    category: 'Weapons',
                    image_url: '/assets/banner.png',
                    gallery_images: ['/assets/banner.png'],
                    tools: ['Blender', 'Roblox Studio'],
                    software: 'Blender',
                    poly_count: '1,200 Tris',
                    featured: true,
                    sort_order: projects.length + 1,
                    status: 'Completed',
                  });
                  setIsNewWork(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-cyan-500/20 interactive-hover"
              >
                <Plus className="w-4 h-4" />
                <span>Add Work</span>
              </button>
            </div>

            {/* List of works */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group card-shimmer"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                      <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {proj.featured && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono text-[9px] font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-white font-mono text-[10px] border border-white/10">
                        {proj.poly_count || 'Low Poly'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                        <span>{proj.category}</span>
                        <span>•</span>
                        <span>{proj.software || 'Blender'}</span>
                      </div>
                      <h3 className="font-display font-bold text-base text-white truncate mt-1 group-hover:text-cyan-400 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">Order #{proj.sort_order}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingWork(proj);
                          setIsNewWork(false);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                        title="Edit Work"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirm({
                            isOpen: true,
                            title: `Delete "${proj.title}"?`,
                            description: 'This will permanently remove this 3D model showcase entry from the portfolio.',
                            onConfirm: () => deleteProject(proj.id),
                          });
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Work"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit/Create Modal for Work */}
            {editingWork && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl shadow-cyan-950/60">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">
                        {isNewWork ? 'Add New Showcase 3D Model' : 'Edit Showcase Model'}
                      </h3>
                      <p className="text-xs font-mono text-cyan-400 mt-0.5">Define model specs, render preview, and polycount details</p>
                    </div>
                    <button
                      onClick={() => setEditingWork(null)}
                      className="text-slate-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  {/* Live Render Preview */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 border border-white/15">
                    <img
                      src={editingWork.image_url || '/assets/banner.png'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/banner.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                          {editingWork.category || 'Weapons'}
                        </span>
                        <h4 className="font-display font-bold text-white text-base mt-1">
                          {editingWork.title || 'Untitled Model'}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-slate-300 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
                        {editingWork.poly_count || '1,200 Tris'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-slate-300">Model Title *</label>
                      <input
                        type="text"
                        value={editingWork.title || ''}
                        onChange={(e) => setEditingWork({ ...editingWork, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="e.g. Tactical Combat Knife / Cyber Blade"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Category *</label>
                      <select
                        value={editingWork.category || 'Weapons'}
                        onChange={(e) => setEditingWork({ ...editingWork, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                      >
                        {['Weapons', 'Props', 'Environment', 'Vehicles', 'Stylized', 'Low Poly', 'Roblox', 'Other'].map(c => (
                          <option key={c} value={c} className="bg-slate-900">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Poly Count / Budget</label>
                      <input
                        type="text"
                        value={editingWork.poly_count || ''}
                        onChange={(e) => setEditingWork({ ...editingWork, poly_count: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="e.g. 1,420 Tris / < 2k"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Software / Engine</label>
                      <input
                        type="text"
                        value={editingWork.software || ''}
                        onChange={(e) => setEditingWork({ ...editingWork, software: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="Blender 4.x / Roblox Studio"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Sort Display Order</label>
                      <input
                        type="number"
                        value={editingWork.sort_order || 1}
                        onChange={(e) => setEditingWork({ ...editingWork, sort_order: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                      />
                    </div>

                    {/* Image URL & Upload controls */}
                    <div className="space-y-1.5 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-slate-300">Primary Render Image URL</label>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Local File</span>
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'work')}
                        className="hidden"
                      />

                      <input
                        type="text"
                        value={editingWork.image_url || ''}
                        onChange={(e) => setEditingWork({ ...editingWork, image_url: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="/assets/banner.png or https://..."
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-slate-300">Description & Optimization Notes</label>
                      <textarea
                        rows={3}
                        value={editingWork.description || ''}
                        onChange={(e) => setEditingWork({ ...editingWork, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm resize-none"
                        placeholder="Details regarding mesh geometry, UV unwrapping, topology, and in-game performance..."
                      />
                    </div>

                    {/* Tags / Tools Manager */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-slate-300">Tools / Tags</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(editingWork.tools || []).map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newTools = (editingWork.tools || []).filter((_, i) => i !== idx);
                                setEditingWork({ ...editingWork, tools: newTools });
                              }}
                              className="text-slate-400 hover:text-red-400 cursor-pointer ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={workTagInput}
                          onChange={(e) => setWorkTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && workTagInput.trim()) {
                              e.preventDefault();
                              const current = editingWork.tools || [];
                              if (!current.includes(workTagInput.trim())) {
                                setEditingWork({ ...editingWork, tools: [...current, workTagInput.trim()] });
                              }
                              setWorkTagInput('');
                            }
                          }}
                          placeholder="Type tag (e.g. 'Substance 3D') and press Enter..."
                          className="flex-1 px-3.5 py-2 rounded-xl glass-input text-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (workTagInput.trim()) {
                              const current = editingWork.tools || [];
                              if (!current.includes(workTagInput.trim())) {
                                setEditingWork({ ...editingWork, tools: [...current, workTagInput.trim()] });
                              }
                              setWorkTagInput('');
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-200 cursor-pointer"
                        >
                          Add Tag
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={!!editingWork.featured}
                        onChange={(e) => setEditingWork({ ...editingWork, featured: e.target.checked })}
                        className="w-4 h-4 rounded border-white/20 bg-slate-950 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                      />
                      <label htmlFor="featured" className="text-xs font-mono text-slate-300 cursor-pointer">
                        Feature this 3D model prominently on the homepage showcase
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setEditingWork(null)}
                      className="px-5 py-2.5 rounded-xl border border-white/20 text-slate-300 text-xs font-display uppercase tracking-wider hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveWork}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
                    >
                      Save Work
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: ACTIVE PROJECTS (CURRENT) --- */}
        {activeTab === 'current' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">Active Roblox Experiences & Builds</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage experiences in active development (such as the TRIGGER FPS project)</p>
              </div>

              <button
                onClick={() => {
                  setEditingCurrent({
                    title: '',
                    slug: '',
                    description: '',
                    category: 'Roblox FPS Experience',
                    status: 'In Development',
                    progress: 65,
                    image_url: '/assets/banner.png',
                    gallery_images: ['/assets/banner.png'],
                    features: ['Responsive gunplay handling', 'Custom animations & recoil', 'Low-draw-call map kit'],
                    roblox_url: 'https://www.roblox.com/games',
                    featured: true,
                    sort_order: currentProjects.length + 1,
                  });
                  setIsNewCurrent(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-purple-500/20 interactive-hover"
              >
                <Plus className="w-4 h-4" />
                <span>Add Active Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-purple-500/40 transition-all space-y-4 group card-shimmer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        {proj.status}
                      </span>
                      <h3 className="text-lg font-display font-bold text-white mt-1.5 group-hover:text-purple-300 transition-colors">{proj.title}</h3>
                      <span className="text-xs text-slate-400 font-mono">{proj.category}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-mono font-bold text-cyan-400">{proj.progress}%</span>
                      <span className="block text-[10px] font-mono text-slate-500">Completion</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full" style={{ width: `${proj.progress}%` }} />
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">{proj.description}</p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">Order #{proj.sort_order}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCurrent(proj);
                          setIsNewCurrent(false);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-purple-400 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirm({
                            isOpen: true,
                            title: `Delete "${proj.title}"?`,
                            description: 'This will permanently remove this active project entry from the studio pipeline.',
                            onConfirm: () => deleteCurrentProject(proj.id),
                          });
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Edit Modal */}
            {editingCurrent && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#0b0f19] border border-purple-500/30 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl shadow-purple-950/60">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">
                        {isNewCurrent ? 'Add New Active Project' : 'Edit Active Project'}
                      </h3>
                      <p className="text-xs font-mono text-purple-400 mt-0.5">Game experiences, weapon mechanics & testing links</p>
                    </div>
                    <button onClick={() => setEditingCurrent(null)} className="text-slate-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer">
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-slate-300">Project Title *</label>
                      <input
                        type="text"
                        value={editingCurrent.title || ''}
                        onChange={(e) => setEditingCurrent({ ...editingCurrent, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="TRIGGER"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Category</label>
                      <input
                        type="text"
                        value={editingCurrent.category || ''}
                        onChange={(e) => setEditingCurrent({ ...editingCurrent, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="Roblox FPS Experience"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Status Tag</label>
                      <input
                        type="text"
                        value={editingCurrent.status || ''}
                        onChange={(e) => setEditingCurrent({ ...editingCurrent, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="In Development / Closed Alpha"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <div className="flex justify-between text-xs font-mono text-slate-300">
                        <label>Development Progress</label>
                        <span className="text-cyan-400 font-bold">{editingCurrent.progress || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editingCurrent.progress || 0}
                        onChange={(e) => setEditingCurrent({ ...editingCurrent, progress: Number(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-slate-300">Banner / Teaser Image URL</label>
                      <input
                        type="text"
                        value={editingCurrent.image_url || ''}
                        onChange={(e) => setEditingCurrent({ ...editingCurrent, image_url: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="/assets/banner.png"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-slate-300">Roblox Place URL (Optional)</label>
                      <input
                        type="text"
                        value={editingCurrent.roblox_url || ''}
                        onChange={(e) => setEditingCurrent({ ...editingCurrent, roblox_url: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="https://www.roblox.com/games/..."
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-slate-300">Description</label>
                      <textarea
                        rows={3}
                        value={editingCurrent.description || ''}
                        onChange={(e) => setEditingCurrent({ ...editingCurrent, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm resize-none"
                        placeholder="Gameplay loop, art direction, and mechanics..."
                      />
                    </div>

                    {/* Features list */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-slate-300">Key Features</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(editingCurrent.features || []).map((feat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono"
                          >
                            <span>{feat}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newFeats = (editingCurrent.features || []).filter((_, i) => i !== idx);
                                setEditingCurrent({ ...editingCurrent, features: newFeats });
                              }}
                              className="text-slate-400 hover:text-red-400 cursor-pointer ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentFeatureInput}
                          onChange={(e) => setCurrentFeatureInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && currentFeatureInput.trim()) {
                              e.preventDefault();
                              const current = editingCurrent.features || [];
                              setEditingCurrent({ ...editingCurrent, features: [...current, currentFeatureInput.trim()] });
                              setCurrentFeatureInput('');
                            }
                          }}
                          placeholder="Type feature (e.g. 'Dynamic recoil rigs') and press Enter..."
                          className="flex-1 px-3.5 py-2 rounded-xl glass-input text-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (currentFeatureInput.trim()) {
                              const current = editingCurrent.features || [];
                              setEditingCurrent({ ...editingCurrent, features: [...current, currentFeatureInput.trim()] });
                              setCurrentFeatureInput('');
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-200 cursor-pointer"
                        >
                          Add Feature
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setEditingCurrent(null)}
                      className="px-5 py-2.5 rounded-xl border border-white/20 text-slate-300 text-xs font-display uppercase tracking-wider hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCurrent}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-purple-500/25"
                    >
                      Save Project
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: UPCOMING PIPELINE --- */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">Upcoming Asset Pipeline</h2>
                <p className="text-xs text-slate-400 mt-0.5">Planned asset packs and environment kits on the horizon</p>
              </div>

              <button
                onClick={() => {
                  setEditingUpcoming({
                    title: '',
                    description: '',
                    category: 'Environment Kit',
                    status: 'Planning',
                    image_url: '/assets/banner.png',
                    estimated_date: 'Q4 2026',
                    featured: false,
                    sort_order: upcomingProjects.length + 1,
                  });
                  setIsNewUpcoming(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Pipeline Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                      <span>{proj.category}</span>
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        {proj.estimated_date}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-white">{proj.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{proj.description}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">Status: {proj.status}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingUpcoming(proj);
                          setIsNewUpcoming(false);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirm({
                            isOpen: true,
                            title: `Delete "${proj.title}"?`,
                            description: 'This will remove this pipeline item.',
                            onConfirm: () => deleteUpcomingProject(proj.id),
                          });
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Edit Modal */}
            {editingUpcoming && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-xl font-display font-bold text-white">
                      {isNewUpcoming ? 'Add Pipeline Project' : 'Edit Pipeline Project'}
                    </h3>
                    <button onClick={() => setEditingUpcoming(null)} className="text-slate-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer">
                      Close
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Project Title *</label>
                      <input
                        type="text"
                        value={editingUpcoming.title || ''}
                        onChange={(e) => setEditingUpcoming({ ...editingUpcoming, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="Modular Sci-Fi Facility Kit"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300">Category</label>
                        <input
                          type="text"
                          value={editingUpcoming.category || ''}
                          onChange={(e) => setEditingUpcoming({ ...editingUpcoming, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                          placeholder="Environment Kit"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300">Target Timeline</label>
                        <input
                          type="text"
                          value={editingUpcoming.estimated_date || ''}
                          onChange={(e) => setEditingUpcoming({ ...editingUpcoming, estimated_date: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                          placeholder="Q3 2026"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Description</label>
                      <textarea
                        rows={3}
                        value={editingUpcoming.description || ''}
                        onChange={(e) => setEditingUpcoming({ ...editingUpcoming, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm resize-none"
                        placeholder="Concept and scope description..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setEditingUpcoming(null)}
                      className="px-5 py-2.5 rounded-xl border border-white/20 text-slate-300 text-xs font-display uppercase tracking-wider hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveUpcoming}
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                    >
                      Save Pipeline Item
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 4: SERVICES --- */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">Freelance Services</h2>
                <p className="text-xs text-slate-400 mt-0.5">Manage 3D modeling commission offerings</p>
              </div>

              <button
                onClick={() => {
                  setEditingService({
                    title: '',
                    description: '',
                    icon: 'Sparkles',
                    active: true,
                    highlights: ['Clean geometry', 'Subdivision optimized'],
                    sort_order: services.length + 1,
                  });
                  setIsNewService(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-base text-white">{srv.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-3">{srv.description}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">Order #{srv.sort_order}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingService(srv);
                          setIsNewService(false);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteConfirm({
                            isOpen: true,
                            title: `Delete "${srv.title}"?`,
                            description: 'This will remove this service from the commission list.',
                            onConfirm: () => deleteService(srv.id),
                          });
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Edit Modal */}
            {editingService && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-xl font-display font-bold text-white">
                      {isNewService ? 'Add Commission Service' : 'Edit Commission Service'}
                    </h3>
                    <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer">
                      Close
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Service Title *</label>
                      <input
                        type="text"
                        value={editingService.title || ''}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                        placeholder="Weapon Modeling & Rigging"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Description</label>
                      <textarea
                        rows={3}
                        value={editingService.description || ''}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm resize-none"
                        placeholder="Service offering description..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setEditingService(null)}
                      className="px-5 py-2.5 rounded-xl border border-white/20 text-slate-300 text-xs font-display uppercase tracking-wider hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveService}
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                    >
                      Save Service
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 5: SKILLS --- */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-white">Technical Skills & Proficiencies</h2>
              <p className="text-xs text-slate-400 mt-0.5">Adjust proficiency percentages shown on the About and Home pages</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">{skill.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400">{skill.category}</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-cyan-400">{skill.proficiency}%</span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={skill.proficiency}
                    onChange={(e) => {
                      updateSkill(skill.id, { proficiency: Number(e.target.value) });
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 6: SETTINGS --- */}
        {activeTab === 'settings' && (
          <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span>Global Site Configuration & Security</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Update contact handles, admin access password, and portfolio settings stored in Firebase</p>
              </div>

              <button
                onClick={handleTriggerSyncAll}
                disabled={isSyncingFirebase}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 text-xs font-display font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <CloudUpload className={`w-4 h-4 ${isSyncingFirebase ? 'animate-bounce' : ''}`} />
                <span>{isSyncingFirebase ? 'Syncing to Cloud...' : 'Sync All Data to Firestore'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Admin Password Field */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-300 flex items-center gap-1.5 font-bold">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span>Admin Panel Password (Saved to Firestore)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Current: LollyistheGOAT6711</span>
                </div>
                <input
                  type="text"
                  value={localSettings.admin_password || 'LollyistheGOAT6711'}
                  onChange={(e) => setLocalSettings({ ...localSettings, admin_password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm font-mono border-cyan-500/40 focus:border-cyan-400"
                  placeholder="LollyistheGOAT6711"
                />
                <p className="text-[11px] font-mono text-slate-400">
                  This credential is authenticated when accessing the POG Admin CMS.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Discord Handle</label>
                <input
                  type="text"
                  value={localSettings.discord || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, discord: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                  placeholder="pogger67_"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Roblox Username</label>
                <input
                  type="text"
                  value={localSettings.roblox || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, roblox: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                  placeholder="opmasteraarav1"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Roblox Profile URL</label>
                <input
                  type="text"
                  value={localSettings.roblox_profile_url || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, roblox_profile_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                  placeholder="https://www.roblox.com/users/profile?username=opmasteraarav1"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Site Name / Display Title</label>
                <input
                  type="text"
                  value={localSettings.site_name || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, site_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                  placeholder="POG"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Hero Tagline</label>
                <input
                  type="text"
                  value={localSettings.hero_tagline || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, hero_tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm"
                  placeholder="Roblox 3D Modeler & Digital Artist"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Commissions Availability</label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={localSettings.available_for_hire !== false}
                      onChange={(e) => setLocalSettings({ ...localSettings, available_for_hire: e.target.checked })}
                      className="w-4 h-4 rounded accent-cyan-400"
                    />
                    <span className="text-xs font-mono">Available for Hire & Commissions</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono text-slate-300">About Description & Bio</label>
                <textarea
                  rows={3}
                  value={localSettings.about_description || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, about_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-sm resize-none"
                  placeholder="Yo! I'm POG, a Roblox 3D modeler focused on creating clean, optimized, game-ready assets in Blender..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                Save Site Settings & Password
              </button>
            </div>
          </div>
        )}

        {/* --- TAB 7: INQUIRIES & CONTACT BRIEFS (FIREBASE) --- */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-cyan-400" />
                  <span>Client Commission Inquiries</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time briefs submitted through the Contact page and stored in Firebase Firestore.
                </p>
              </div>

              <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{inquiries.length} Total Messages</span>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-white text-base">No Inquiries Yet</h3>
                <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
                  When potential clients submit briefs through the Contact page form, they will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => {
                  const statusColors: Record<string, string> = {
                    New: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
                    'In Review': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                    Accepted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
                    Archived: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
                  };

                  return (
                    <div
                      key={inq.id}
                      className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/30 transition-all space-y-4 shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold font-display">
                            {inq.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display font-bold text-base text-white">{inq.name}</h3>
                              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${statusColors[inq.status] || statusColors.New}`}>
                                {inq.status}
                              </span>
                            </div>
                            <p className="text-xs font-mono text-slate-400">
                              Contact: <span className="text-cyan-400 font-semibold">{inq.handle}</span> • Service: <span className="text-slate-300">{inq.service}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) => updateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 focus:border-cyan-500 focus:outline-none cursor-pointer"
                          >
                            <option value="New">Status: New</option>
                            <option value="In Review">Status: In Review</option>
                            <option value="Accepted">Status: Accepted</option>
                            <option value="Archived">Status: Archived</option>
                          </select>

                          <button
                            onClick={() => {
                              setDeleteConfirm({
                                isOpen: true,
                                title: `Delete inquiry from "${inq.name}"?`,
                                description: 'This brief will be permanently removed from Firebase.',
                                onConfirm: () => deleteInquiry(inq.id),
                              });
                            }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono">
                        <div>
                          <span className="text-slate-500 block text-[10px]">POLY BUDGET</span>
                          <span className="text-slate-300 font-medium">{inq.polyBudget || 'Flexible'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">TIMELINE</span>
                          <span className="text-slate-300 font-medium">{inq.timeline || 'Flexible'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">PRICE / BUDGET</span>
                          <span className="text-slate-300 font-medium">{inq.budget || 'Quote Requested'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">SUBMITTED AT</span>
                          <span className="text-slate-400">{new Date(inq.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Project Brief & Details:</span>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {inq.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        description={deleteConfirm.description}
        confirmText="Delete Permanently"
        danger
        onConfirm={() => {
          deleteConfirm.onConfirm();
          setDeleteConfirm({ isOpen: false, title: '', description: '', onConfirm: () => {} });
        }}
        onCancel={() => setDeleteConfirm({ isOpen: false, title: '', description: '', onConfirm: () => {} })}
      />
    </div>
  );
};
