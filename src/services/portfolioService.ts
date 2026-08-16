import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project, CurrentProject, UpcomingProject, Service, Skill, SiteSettings } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'pog_portfolio_projects',
  CURRENT_PROJECTS: 'pog_portfolio_current_projects',
  UPCOMING_PROJECTS: 'pog_portfolio_upcoming_projects',
  SERVICES: 'pog_portfolio_services',
  SKILLS: 'pog_portfolio_skills',
  SETTINGS: 'pog_portfolio_settings',
  ADMIN_SESSION: 'pog_admin_session_auth',
};

// Initial data based on existing POG portfolio content & services
export const INITIAL_SETTINGS: SiteSettings = {
  id: 'site-config-default',
  site_name: 'POG',
  hero_title: 'POG',
  hero_tagline: 'Roblox 3D Modeler & Digital Artist',
  hero_description: 'Creating clean, optimized, game-ready assets for Roblox. Specialized in weapons, props, environments, and high-performance studio designs.',
  about_title: "Who's POG",
  about_description: "Yo! I'm POG, a Roblox 3D modeler focused on creating clean, optimized, game-ready assets in Blender. I enjoy making weapons, props, and stylized models while constantly pushing the envelope of Roblox engine fidelity.",
  about_bio: "Specializing in the intersection of high aesthetic impact and strict game engine optimization. Every asset is built with clean edge flow, minimal draw calls, and optimized polygon counts for seamless mobile and desktop performance.",
  discord: 'pogger67_',
  roblox: 'opmasteraarav1',
  roblox_profile_url: 'https://www.roblox.com/users/profile?username=opmasteraarav1',
  footer_description: 'Clean, optimized, game-ready assets for Roblox. Weapons, props, and environments built in Blender.',
  seo_title: 'POG — Roblox 3D Modeler & Digital Artist',
  seo_description: 'Clean, optimized, game-ready assets for Roblox. Weapons, props, and environments built in Blender.',
  available_for_hire: true,
  updated_at: new Date().toISOString(),
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Weapon Modeling',
    description: 'Melee and ranged weapons built with clean silhouettes, modular attachments, and game-ready topology.',
    icon: 'Sword',
    sort_order: 1,
    active: true,
    highlights: ['Melee blades & balisongs', 'Sci-fi & realistic firearms', 'Custom voxel & stylized weaponry', 'Modular attachments'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-2',
    title: 'Prop Modeling',
    description: 'Hand props and intricate set-dressing pieces engineered to hold up in high-intensity close-up gameplay.',
    icon: 'Box',
    sort_order: 2,
    active: true,
    highlights: ['Interactive equipment', 'Loot crates & cases', 'Character accessories & armor', 'Inventory icons'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-3',
    title: 'Environment Assets',
    description: 'Modular kit pieces and architecture for building out expansive levels, maps, and atmospheric arenas efficiently.',
    icon: 'Landmark',
    sort_order: 3,
    active: true,
    highlights: ['Modular building kits', 'Sci-fi corridors & interiors', 'Terrain props & foliage', 'Optimized collision meshes'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-4',
    title: 'Low Poly Assets',
    description: 'Ultra-lightweight models tuned for tight poly budgets without losing silhouette readability or stylistic appeal.',
    icon: 'Layers',
    sort_order: 4,
    active: true,
    highlights: ['Minimal polygon density', 'Sharp visual clarity', 'Ideal for massive multiplayer', 'High mobile framerates'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-5',
    title: 'Stylized Assets',
    description: 'Consistent, art-directed shapes, vivid proportions, and distinctive aesthetics matched precisely to your game identity.',
    icon: 'Sparkles',
    sort_order: 5,
    active: true,
    highlights: ['Anime & cartoon proportions', 'Custom edge bevelling', 'Consistent art direction', 'Expressive character gear'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-6',
    title: 'Roblox Optimization',
    description: 'Draw call, poly count, mesh splitting, and collision audits to ensure flawless 60 FPS performance across all hardware tiers.',
    icon: 'Cpu',
    sort_order: 6,
    active: true,
    highlights: ['Mesh part count reduction', 'Texture memory optimization', 'LOD & streaming configuration', 'Custom physics hulls'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-7',
    title: 'Studio Style Designs',
    description: 'Create professional visual assets, thumbnails, render layouts, and UI-ready showcase renders suitable for Roblox studio and project presentation workflows.',
    icon: 'Palette',
    sort_order: 7,
    active: true,
    highlights: ['High-resolution viewport renders', 'Custom lighting setups in Blender', 'Studio asset branding', 'Clean presentation cards'],
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_SKILLS: Skill[] = [
  { id: 'sk-1', name: 'Blender', category: 'Software', description: 'Primary 3D creation suite for subdivision modeling, UV unwrapping, and shading', proficiency: 98, icon: 'Flame', sort_order: 1, active: true },
  { id: 'sk-2', name: 'Roblox Studio', category: 'Engine', description: 'Engine import, materials, surface appearance, and performance profiling', proficiency: 95, icon: 'Boxes', sort_order: 2, active: true },
  { id: 'sk-3', name: 'Moon Animator', category: 'Animation', description: 'Roblox animation tool for inspect sequences and mechanical weapon animations', proficiency: 88, icon: 'Play', sort_order: 3, active: true },
  { id: 'sk-4', name: 'Low Poly Modeling', category: 'Technique', description: 'Tight poly-budget conservation and silhouette clarity', proficiency: 96, icon: 'Minimize2', sort_order: 4, active: true },
  { id: 'sk-5', name: 'Stylized Modeling', category: 'Art Direction', description: 'Exaggerated proportions and distinct artistic styling', proficiency: 92, icon: 'Palette', sort_order: 5, active: true },
  { id: 'sk-6', name: 'Weapon Modeling', category: 'Specialization', description: 'Melee and ranged firearms with realistic mechanical topology', proficiency: 97, icon: 'Crosshair', sort_order: 6, active: true },
  { id: 'sk-7', name: 'Game Optimization', category: 'Technical', description: 'Memory budgets, draw calls, and vertex cache optimization', proficiency: 94, icon: 'Zap', sort_order: 7, active: true },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-balisong',
    title: 'Custom Balisong Butterfly Knife',
    slug: 'custom-balisong-butterfly-knife',
    description: 'Precision-engineered tactical balisong knife with smooth beveling, ergonomic skeleton handles, and low-poly pivot points optimized for first-person inspect animations.',
    category: 'Weapons',
    status: 'Completed',
    image_url: '/assets/banner.png',
    gallery_images: ['/assets/banner.png', '/assets/logo.png'],
    tools: ['Blender', 'Roblox Studio', 'Substance Painter'],
    software: 'Blender 4.x',
    poly_count: '1,420 Tris',
    featured: true,
    sort_order: 1,
    created_at: '2026-02-10T12:00:00Z',
  },
  {
    id: 'proj-tactical-case',
    title: 'Reinforced Military Gear Crate',
    slug: 'reinforced-military-gear-crate',
    description: 'Heavy-duty sci-fi tactical supply crate with latch mechanisms, emissive power cells, and modular decals designed for loot discovery and environmental prop distribution.',
    category: 'Props',
    status: 'Completed',
    image_url: '/assets/banner.png',
    gallery_images: ['/assets/banner.png'],
    tools: ['Blender', 'Roblox Studio'],
    software: 'Blender',
    poly_count: '890 Tris',
    featured: true,
    sort_order: 2,
    created_at: '2026-01-20T14:00:00Z',
  },
  {
    id: 'proj-sci-fi-environment',
    title: 'Cyberpunk Facility Modular Kit',
    slug: 'cyberpunk-facility-modular-kit',
    description: 'Comprehensive modular environment pack featuring wall panels, security bulkheads, ceiling pipes, and glowing neon conduits built for high-throughput FPS maps.',
    category: 'Environment',
    status: 'Completed',
    image_url: '/assets/banner.png',
    gallery_images: ['/assets/banner.png'],
    tools: ['Blender', 'Roblox Studio', 'SurfaceAppearance'],
    software: 'Blender',
    poly_count: '4,600 Tris (Full Modular Set)',
    featured: true,
    sort_order: 3,
    created_at: '2026-01-05T10:00:00Z',
  },
  {
    id: 'proj-hero-armor',
    title: 'Vanguard Exosuit Armor Rig',
    slug: 'vanguard-exosuit-armor-rig',
    description: 'Stylized armored exosuit designed for Roblox R15 avatar scaling with zero clipping during combat animations and custom shoulder pauldron attachments.',
    category: 'Stylized',
    status: 'Completed',
    image_url: '/assets/banner.png',
    gallery_images: ['/assets/banner.png'],
    tools: ['Blender', 'Moon Animator'],
    software: 'Blender',
    poly_count: '2,850 Tris',
    featured: true,
    sort_order: 4,
    created_at: '2025-12-15T16:00:00Z',
  },
  {
    id: 'proj-voxel-sidearm',
    title: 'Hyperion Energy Sidearm',
    slug: 'hyperion-energy-sidearm',
    description: 'Futuristic handheld laser pistol with voxel-inspired cooling vents, custom holographic sights, and animated heat dispersion vents for rapid-fire Roblox mechanics.',
    category: 'Weapons',
    status: 'Completed',
    image_url: '/assets/banner.png',
    gallery_images: ['/assets/banner.png'],
    tools: ['Blender', 'Roblox Studio'],
    software: 'Blender',
    poly_count: '1,120 Tris',
    featured: false,
    sort_order: 5,
    created_at: '2025-11-28T09:00:00Z',
  },
  {
    id: 'proj-shop-stand',
    title: 'Stylized Egg Hatch Merchant Stand',
    slug: 'stylized-egg-hatch-merchant-stand',
    description: 'Charming low-poly marketplace asset with cartoon shading, wooden roof shingles, and dynamic lighting anchors designed for Roblox simulator hub areas.',
    category: 'Low Poly',
    status: 'Completed',
    image_url: '/assets/banner.png',
    gallery_images: ['/assets/banner.png'],
    tools: ['Blender', 'Roblox Studio'],
    software: 'Blender',
    poly_count: '980 Tris',
    featured: false,
    sort_order: 6,
    created_at: '2025-11-10T11:00:00Z',
  },
];

export const INITIAL_CURRENT_PROJECTS: CurrentProject[] = [
  {
    id: 'curr-trigger',
    title: 'TRIGGER',
    slug: 'trigger',
    description: 'A fast-paced Roblox FPS focused on satisfying gunplay, smooth animations, responsive hit registration, and meticulously polished weapons & environment kits.',
    category: 'Roblox FPS Experience',
    status: 'In Development',
    progress: 72,
    image_url: '/assets/banner.png',
    gallery_images: ['/assets/banner.png', '/assets/logo.png'],
    features: [
      'Custom weapon handling & recoil kinematics',
      'High-framerate animated first-person rigs',
      'Modular competitive arena maps',
      'Sub-5ms Roblox Studio network replication optimizations'
    ],
    roblox_url: 'https://www.roblox.com/games',
    featured: true,
    sort_order: 1,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'curr-weapon-arsenal-v2',
    title: 'Next-Gen Tactical Armory Kit',
    slug: 'next-gen-tactical-armory-kit',
    description: 'A complete collection of 15+ game-ready tactical weapon models with customizable attachments (suppressors, optics, stocks) for open-world Roblox experiences.',
    category: 'Asset Pack',
    status: 'Active',
    progress: 88,
    image_url: '/assets/banner.png',
    features: [
      'Modular Picatinny rail attachment system',
      'PBR SurfaceAppearance textures + vertex color fallback',
      'Clean low-poly meshes under 1,500 tris per firearm'
    ],
    featured: false,
    sort_order: 2,
    created_at: '2026-02-01T00:00:00Z',
  },
];

export const INITIAL_UPCOMING_PROJECTS: UpcomingProject[] = [
  {
    id: 'upc-cyber-mech',
    title: 'Modular Pilotable Mech Chassis',
    description: 'Articulated robotic mech asset pack with interchangeable weapon pods, cockpit interior, and damage state meshes for Roblox battlegrounds.',
    category: 'Roblox Vehicle / Rig',
    status: 'Planning',
    image_url: '/assets/banner.png',
    estimated_date: '2026-Q3',
    featured: true,
    sort_order: 1,
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'upc-dungeon-kit',
    title: 'Abyssal Catacombs Modular Dungeon',
    description: 'Dark fantasy stylized dungeon modular environment containing 40+ modular corridors, archways, braziers, and boss chamber focal props.',
    category: 'Environment Kit',
    status: 'Concept',
    image_url: '/assets/banner.png',
    estimated_date: '2026-Q4',
    featured: false,
    sort_order: 2,
    created_at: '2026-02-14T00:00:00Z',
  },
];

// Helper to get local data safely
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

// Portfolio Service API
export const PortfolioService = {
  // --- SITE SETTINGS ---
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase settings query error, using local data:', e);
      }
    }
    return getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('site_settings').upsert(updated);
      } catch (e) {
        console.warn('Supabase update error:', e);
      }
    }
    setLocalItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // --- PROJECTS (WORKS) ---
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase projects query error, using local data:', e);
      }
    }
    return getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  },

  async getProjectByIdOrSlug(idOrSlug: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  },

  async createProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
    const newProj: Project = {
      ...project,
      id: 'proj-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('projects').insert(newProj).select().single();
        if (!error && data) {
          const list = await this.getProjects();
          setLocalItem(STORAGE_KEYS.PROJECTS, [data, ...list]);
          return data;
        }
      } catch (e) {
        console.warn('Supabase insert error:', e);
      }
    }
    const current = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const updated = [newProj, ...current];
    setLocalItem(STORAGE_KEYS.PROJECTS, updated);
    return newProj;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const projects = await this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    
    const updatedProject = { ...projects[index], ...updates, updated_at: new Date().toISOString() };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').update(updatedProject).eq('id', id);
      } catch (e) {
        console.warn('Supabase update error:', e);
      }
    }
    projects[index] = updatedProject;
    setLocalItem(STORAGE_KEYS.PROJECTS, projects);
    return updatedProject;
  },

  async deleteProject(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete error:', e);
      }
    }
    const projects = await this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    setLocalItem(STORAGE_KEYS.PROJECTS, filtered);
  },

  // --- CURRENT PROJECTS ---
  async getCurrentProjects(): Promise<CurrentProject[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('current_projects').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase query error:', e);
      }
    }
    return getLocalItem<CurrentProject[]>(STORAGE_KEYS.CURRENT_PROJECTS, INITIAL_CURRENT_PROJECTS);
  },

  async createCurrentProject(proj: Omit<CurrentProject, 'id' | 'created_at'>): Promise<CurrentProject> {
    const newProj: CurrentProject = {
      ...proj,
      id: 'curr-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('current_projects').insert(newProj);
      } catch (e) {
        console.warn(e);
      }
    }
    const list = await this.getCurrentProjects();
    const updated = [...list, newProj];
    setLocalItem(STORAGE_KEYS.CURRENT_PROJECTS, updated);
    return newProj;
  },

  async updateCurrentProject(id: string, updates: Partial<CurrentProject>): Promise<CurrentProject> {
    const list = await this.getCurrentProjects();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Current project not found');
    const updated = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('current_projects').update(updated).eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    list[idx] = updated;
    setLocalItem(STORAGE_KEYS.CURRENT_PROJECTS, list);
    return updated;
  },

  async deleteCurrentProject(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('current_projects').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    const list = await this.getCurrentProjects();
    setLocalItem(STORAGE_KEYS.CURRENT_PROJECTS, list.filter(p => p.id !== id));
  },

  // --- UPCOMING PROJECTS ---
  async getUpcomingProjects(): Promise<UpcomingProject[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('upcoming_projects').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase query error:', e);
      }
    }
    return getLocalItem<UpcomingProject[]>(STORAGE_KEYS.UPCOMING_PROJECTS, INITIAL_UPCOMING_PROJECTS);
  },

  async createUpcomingProject(proj: Omit<UpcomingProject, 'id' | 'created_at'>): Promise<UpcomingProject> {
    const newProj: UpcomingProject = {
      ...proj,
      id: 'upc-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('upcoming_projects').insert(newProj);
      } catch (e) {
        console.warn(e);
      }
    }
    const list = await this.getUpcomingProjects();
    const updated = [...list, newProj];
    setLocalItem(STORAGE_KEYS.UPCOMING_PROJECTS, updated);
    return newProj;
  },

  async updateUpcomingProject(id: string, updates: Partial<UpcomingProject>): Promise<UpcomingProject> {
    const list = await this.getUpcomingProjects();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Upcoming project not found');
    const updated = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('upcoming_projects').update(updated).eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    list[idx] = updated;
    setLocalItem(STORAGE_KEYS.UPCOMING_PROJECTS, list);
    return updated;
  },

  async deleteUpcomingProject(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('upcoming_projects').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    const list = await this.getUpcomingProjects();
    setLocalItem(STORAGE_KEYS.UPCOMING_PROJECTS, list.filter(p => p.id !== id));
  },

  // --- SERVICES ---
  async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase query error:', e);
      }
    }
    return getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },

  async createService(service: Omit<Service, 'id' | 'created_at'>): Promise<Service> {
    const newService: Service = {
      ...service,
      id: 'srv-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('services').insert(newService);
      } catch (e) {
        console.warn(e);
      }
    }
    const list = await this.getServices();
    const updated = [...list, newService];
    setLocalItem(STORAGE_KEYS.SERVICES, updated);
    return newService;
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const list = await this.getServices();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Service not found');
    const updated = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('services').update(updated).eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    list[idx] = updated;
    setLocalItem(STORAGE_KEYS.SERVICES, list);
    return updated;
  },

  async deleteService(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    const list = await this.getServices();
    setLocalItem(STORAGE_KEYS.SERVICES, list.filter(s => s.id !== id));
  },

  // --- SKILLS ---
  async getSkills(): Promise<Skill[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase query error:', e);
      }
    }
    return getLocalItem<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    const list = await this.getSkills();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Skill not found');
    const updated = { ...list[idx], ...updates };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('skills').update(updated).eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    list[idx] = updated;
    setLocalItem(STORAGE_KEYS.SKILLS, list);
    return updated;
  },

  // --- ASSET UPLOADER ---
  async uploadAsset(file: File): Promise<string> {
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-assets')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (!uploadError) {
          const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch (e) {
        console.warn('Supabase storage upload failed, converting to optimized data URL:', e);
      }
    }

    // Fallback: Read as high quality Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  },

  // --- RESET TO DEFAULTS ---
  resetAllData(): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECTS, JSON.stringify(INITIAL_CURRENT_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.UPCOMING_PROJECTS, JSON.stringify(INITIAL_UPCOMING_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(INITIAL_SKILLS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
};
