import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Project, CurrentProject, UpcomingProject, Service, Skill, SiteSettings, Inquiry } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'pog_portfolio_projects',
  CURRENT_PROJECTS: 'pog_portfolio_current_projects',
  UPCOMING_PROJECTS: 'pog_portfolio_upcoming_projects',
  SERVICES: 'pog_portfolio_services',
  SKILLS: 'pog_portfolio_skills',
  SETTINGS: 'pog_portfolio_settings',
  INQUIRIES: 'pog_portfolio_inquiries',
  ADMIN_SESSION: 'pog_admin_session_auth',
  FIREBASE_SEEDED: 'pog_firebase_initial_seeded',
};

// Initial default data based on existing POG portfolio content & services
export const INITIAL_SETTINGS: SiteSettings = {
  id: 'main_config',
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
  admin_password: 'LollyistheGOAT6711',
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

// Helper to get and set local data safely
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

// Portfolio Service API utilizing Firebase Firestore
export const PortfolioService = {
  // --- DATABASE INITIAL SEEDING & SYNCHRONIZATION ---
  async seedInitialDataIfEmpty(): Promise<void> {
    if (!isFirebaseConfigured || !db) return;
    try {
      // Check if projects exists in Firestore
      const projSnap = await getDocs(collection(db, 'projects'));
      const settingsSnap = await getDoc(doc(db, 'site_settings', 'main_config'));

      if (projSnap.empty || !settingsSnap.exists()) {
        // Seed all works (3D models)
        for (const p of INITIAL_PROJECTS) {
          await setDoc(doc(db, 'projects', p.id), p, { merge: true });
        }
        // Seed current projects (active games like TRIGGER)
        for (const cp of INITIAL_CURRENT_PROJECTS) {
          await setDoc(doc(db, 'current_projects', cp.id), cp, { merge: true });
        }
        // Seed upcoming projects (pipeline concepts)
        for (const up of INITIAL_UPCOMING_PROJECTS) {
          await setDoc(doc(db, 'upcoming_projects', up.id), up, { merge: true });
        }
        // Seed services
        for (const s of INITIAL_SERVICES) {
          await setDoc(doc(db, 'services', s.id), s, { merge: true });
        }
        // Seed skills
        for (const sk of INITIAL_SKILLS) {
          await setDoc(doc(db, 'skills', sk.id), sk, { merge: true });
        }
        // Seed site settings with admin password
        await setDoc(doc(db, 'site_settings', 'main_config'), INITIAL_SETTINGS, { merge: true });
      }
      localStorage.setItem(STORAGE_KEYS.FIREBASE_SEEDED, 'true');
    } catch (e) {
      console.warn('Firebase auto-seed notice:', e);
    }
  },

  async syncAllToFirebase(): Promise<{ success: boolean; message: string }> {
    if (!isFirebaseConfigured || !db) {
      return { success: false, message: 'Firebase is not initialized or configured.' };
    }
    try {
      const projects = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
      const currentProjects = getLocalItem<CurrentProject[]>(STORAGE_KEYS.CURRENT_PROJECTS, INITIAL_CURRENT_PROJECTS);
      const upcomingProjects = getLocalItem<UpcomingProject[]>(STORAGE_KEYS.UPCOMING_PROJECTS, INITIAL_UPCOMING_PROJECTS);
      const services = getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
      const skills = getLocalItem<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
      const settings = getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);

      // Save all Works
      for (const p of projects) {
        await setDoc(doc(db, 'projects', p.id), p, { merge: true });
      }
      // Save all Current Projects (Active Games like TRIGGER)
      for (const cp of currentProjects) {
        await setDoc(doc(db, 'current_projects', cp.id), cp, { merge: true });
      }
      // Save all Upcoming Projects (Pipeline)
      for (const up of upcomingProjects) {
        await setDoc(doc(db, 'upcoming_projects', up.id), up, { merge: true });
      }
      // Save all Services
      for (const s of services) {
        await setDoc(doc(db, 'services', s.id), s, { merge: true });
      }
      // Save all Skills
      for (const sk of skills) {
        await setDoc(doc(db, 'skills', sk.id), sk, { merge: true });
      }
      // Save Site Settings including Admin Password
      const settingsToSave: SiteSettings = {
        ...settings,
        admin_password: settings.admin_password || 'LollyistheGOAT6711',
        updated_at: new Date().toISOString(),
      };
      await setDoc(doc(db, 'site_settings', 'main_config'), settingsToSave, { merge: true });
      setLocalItem(STORAGE_KEYS.SETTINGS, settingsToSave);

      localStorage.setItem(STORAGE_KEYS.FIREBASE_SEEDED, 'true');
      return {
        success: true,
        message: 'All works, upcoming projects, currently building projects, services, skills, and admin password successfully saved to Firebase Firestore!',
      };
    } catch (err: any) {
      console.error('Error syncing all data to Firestore:', err);
      throw err;
    }
  },

  // --- SITE SETTINGS ---
  async getSettings(): Promise<SiteSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'site_settings', 'main_config');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as SiteSettings;
          setLocalItem(STORAGE_KEYS.SETTINGS, data);
          return data;
        } else {
          // Initialize if document doesn't exist yet
          await setDoc(docRef, INITIAL_SETTINGS);
          return INITIAL_SETTINGS;
        }
      } catch (e) {
        console.warn('Firebase getSettings error, using cache:', e);
      }
    }
    return getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated: SiteSettings = { 
      ...current, 
      ...settings, 
      id: 'main_config',
      updated_at: new Date().toISOString() 
    };
    
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'site_settings', 'main_config');
        await setDoc(docRef, updated, { merge: true });
      } catch (e) {
        console.warn('Firebase updateSettings error:', e);
      }
    }
    setLocalItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // --- PROJECTS (WORKS & 3D MODELS) ---
  async getProjects(): Promise<Project[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'projects'), orderBy('sort_order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
          setLocalItem(STORAGE_KEYS.PROJECTS, list);
          return list;
        }
      } catch (e) {
        console.warn('Firebase getProjects query error, using local data:', e);
      }
    }
    return getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  },

  async getProjectByIdOrSlug(idOrSlug: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  },

  async createProject(project: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
    const newId = 'proj-' + Date.now();
    const newProj: Project = {
      ...project,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'projects', newId), newProj);
      } catch (e) {
        console.warn('Firebase createProject error:', e);
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
    const updatedProject: Project = { 
      ...(index !== -1 ? projects[index] : {} as Project), 
      ...updates, 
      id,
      updated_at: new Date().toISOString() 
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'projects', id), updatedProject, { merge: true });
      } catch (e) {
        console.warn('Firebase updateProject error:', e);
      }
    }

    if (index !== -1) {
      projects[index] = updatedProject;
      setLocalItem(STORAGE_KEYS.PROJECTS, projects);
    }
    return updatedProject;
  },

  async deleteProject(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (e) {
        console.warn('Firebase deleteProject error:', e);
      }
    }
    const projects = await this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    setLocalItem(STORAGE_KEYS.PROJECTS, filtered);
  },

  // --- CURRENT PROJECTS (ACTIVE GAMES LIKE TRIGGER) ---
  async getCurrentProjects(): Promise<CurrentProject[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'current_projects'), orderBy('sort_order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as CurrentProject));
          setLocalItem(STORAGE_KEYS.CURRENT_PROJECTS, list);
          return list;
        }
      } catch (e) {
        console.warn('Firebase getCurrentProjects error:', e);
      }
    }
    return getLocalItem<CurrentProject[]>(STORAGE_KEYS.CURRENT_PROJECTS, INITIAL_CURRENT_PROJECTS);
  },

  async createCurrentProject(proj: Omit<CurrentProject, 'id' | 'created_at'>): Promise<CurrentProject> {
    const newId = 'curr-' + Date.now();
    const newProj: CurrentProject = {
      ...proj,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'current_projects', newId), newProj);
      } catch (e) {
        console.warn('Firebase createCurrentProject error:', e);
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
    const updated: CurrentProject = { 
      ...(idx !== -1 ? list[idx] : {} as CurrentProject), 
      ...updates, 
      id,
      updated_at: new Date().toISOString() 
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'current_projects', id), updated, { merge: true });
      } catch (e) {
        console.warn('Firebase updateCurrentProject error:', e);
      }
    }

    if (idx !== -1) {
      list[idx] = updated;
      setLocalItem(STORAGE_KEYS.CURRENT_PROJECTS, list);
    }
    return updated;
  },

  async deleteCurrentProject(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'current_projects', id));
      } catch (e) {
        console.warn('Firebase deleteCurrentProject error:', e);
      }
    }
    const list = await this.getCurrentProjects();
    setLocalItem(STORAGE_KEYS.CURRENT_PROJECTS, list.filter(p => p.id !== id));
  },

  // --- UPCOMING PROJECTS (PIPELINE) ---
  async getUpcomingProjects(): Promise<UpcomingProject[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'upcoming_projects'), orderBy('sort_order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as UpcomingProject));
          setLocalItem(STORAGE_KEYS.UPCOMING_PROJECTS, list);
          return list;
        }
      } catch (e) {
        console.warn('Firebase getUpcomingProjects error:', e);
      }
    }
    return getLocalItem<UpcomingProject[]>(STORAGE_KEYS.UPCOMING_PROJECTS, INITIAL_UPCOMING_PROJECTS);
  },

  async createUpcomingProject(proj: Omit<UpcomingProject, 'id' | 'created_at'>): Promise<UpcomingProject> {
    const newId = 'upc-' + Date.now();
    const newProj: UpcomingProject = {
      ...proj,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'upcoming_projects', newId), newProj);
      } catch (e) {
        console.warn('Firebase createUpcomingProject error:', e);
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
    const updated: UpcomingProject = { 
      ...(idx !== -1 ? list[idx] : {} as UpcomingProject), 
      ...updates, 
      id,
      updated_at: new Date().toISOString() 
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'upcoming_projects', id), updated, { merge: true });
      } catch (e) {
        console.warn('Firebase updateUpcomingProject error:', e);
      }
    }

    if (idx !== -1) {
      list[idx] = updated;
      setLocalItem(STORAGE_KEYS.UPCOMING_PROJECTS, list);
    }
    return updated;
  },

  async deleteUpcomingProject(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'upcoming_projects', id));
      } catch (e) {
        console.warn('Firebase deleteUpcomingProject error:', e);
      }
    }
    const list = await this.getUpcomingProjects();
    setLocalItem(STORAGE_KEYS.UPCOMING_PROJECTS, list.filter(p => p.id !== id));
  },

  // --- SERVICES ---
  async getServices(): Promise<Service[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'services'), orderBy('sort_order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
          setLocalItem(STORAGE_KEYS.SERVICES, list);
          return list;
        }
      } catch (e) {
        console.warn('Firebase getServices error:', e);
      }
    }
    return getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },

  async createService(service: Omit<Service, 'id' | 'created_at'>): Promise<Service> {
    const newId = 'srv-' + Date.now();
    const newService: Service = {
      ...service,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'services', newId), newService);
      } catch (e) {
        console.warn('Firebase createService error:', e);
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
    const updated: Service = { 
      ...(idx !== -1 ? list[idx] : {} as Service), 
      ...updates, 
      id,
      updated_at: new Date().toISOString() 
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'services', id), updated, { merge: true });
      } catch (e) {
        console.warn('Firebase updateService error:', e);
      }
    }

    if (idx !== -1) {
      list[idx] = updated;
      setLocalItem(STORAGE_KEYS.SERVICES, list);
    }
    return updated;
  },

  async deleteService(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'services', id));
      } catch (e) {
        console.warn('Firebase deleteService error:', e);
      }
    }
    const list = await this.getServices();
    setLocalItem(STORAGE_KEYS.SERVICES, list.filter(s => s.id !== id));
  },

  // --- SKILLS ---
  async getSkills(): Promise<Skill[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'skills'), orderBy('sort_order', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
          setLocalItem(STORAGE_KEYS.SKILLS, list);
          return list;
        }
      } catch (e) {
        console.warn('Firebase getSkills error:', e);
      }
    }
    return getLocalItem<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    const list = await this.getSkills();
    const idx = list.findIndex(s => s.id === id);
    const updated: Skill = { 
      ...(idx !== -1 ? list[idx] : {} as Skill), 
      ...updates, 
      id 
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'skills', id), updated, { merge: true });
      } catch (e) {
        console.warn('Firebase updateSkill error:', e);
      }
    }

    if (idx !== -1) {
      list[idx] = updated;
      setLocalItem(STORAGE_KEYS.SKILLS, list);
    }
    return updated;
  },

  // --- INQUIRIES & CONTACT BRIEFS ---
  async submitInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at' | 'status'>): Promise<Inquiry> {
    const newId = 'inq-' + Date.now();
    const newInquiry: Inquiry = {
      ...inquiry,
      id: newId,
      status: 'New',
      created_at: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'inquiries', newId), newInquiry);
      } catch (e) {
        console.warn('Firebase submitInquiry error:', e);
      }
    }

    const current = getLocalItem<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
    const updated = [newInquiry, ...current];
    setLocalItem(STORAGE_KEYS.INQUIRIES, updated);
    return newInquiry;
  },

  async getInquiries(): Promise<Inquiry[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'inquiries'), orderBy('created_at', 'desc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry));
          setLocalItem(STORAGE_KEYS.INQUIRIES, list);
          return list;
        }
      } catch (e) {
        console.warn('Firebase getInquiries error:', e);
      }
    }
    return getLocalItem<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
  },

  async updateInquiryStatus(id: string, status: Inquiry['status']): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'inquiries', id), { status });
      } catch (e) {
        console.warn('Firebase updateInquiryStatus error:', e);
      }
    }
    const current = getLocalItem<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
    const updated = current.map(item => item.id === id ? { ...item, status } : item);
    setLocalItem(STORAGE_KEYS.INQUIRIES, updated);
  },

  async deleteInquiry(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'inquiries', id));
      } catch (e) {
        console.warn('Firebase deleteInquiry error:', e);
      }
    }
    const current = getLocalItem<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
    setLocalItem(STORAGE_KEYS.INQUIRIES, current.filter(item => item.id !== id));
  },

  // --- ASSET UPLOADER ---
  async uploadAsset(file: File): Promise<string> {
    // Read as optimized Data URL for instant rendering and persistence
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  },

  // --- RESET TO DEFAULTS ---
  async resetAllData(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECTS, JSON.stringify(INITIAL_CURRENT_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.UPCOMING_PROJECTS, JSON.stringify(INITIAL_UPCOMING_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(INITIAL_SKILLS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));

    if (isFirebaseConfigured && db) {
      try {
        for (const p of INITIAL_PROJECTS) {
          await setDoc(doc(db, 'projects', p.id), p);
        }
        for (const cp of INITIAL_CURRENT_PROJECTS) {
          await setDoc(doc(db, 'current_projects', cp.id), cp);
        }
        for (const up of INITIAL_UPCOMING_PROJECTS) {
          await setDoc(doc(db, 'upcoming_projects', up.id), up);
        }
        for (const s of INITIAL_SERVICES) {
          await setDoc(doc(db, 'services', s.id), s);
        }
        for (const sk of INITIAL_SKILLS) {
          await setDoc(doc(db, 'skills', sk.id), sk);
        }
        await setDoc(doc(db, 'site_settings', 'main_config'), INITIAL_SETTINGS);
      } catch (e) {
        console.warn('Firebase reset error:', e);
      }
    }
  }
};
