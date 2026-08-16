export type ProjectCategory = 
  | 'All'
  | 'Weapons'
  | 'Props'
  | 'Environment'
  | 'Stylized'
  | 'Low Poly'
  | 'Roblox'
  | 'Other';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status?: string;
  image_url: string;
  gallery_images?: string[];
  tools: string[];
  external_url?: string;
  roblox_url?: string;
  client?: string;
  software?: string;
  poly_count?: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export type ProjectStatus = 
  | 'Planning'
  | 'Concept'
  | 'In Development'
  | 'Almost Ready'
  | 'Coming Soon'
  | 'Active'
  | 'Completed';

export interface CurrentProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  progress: number; // 0 to 100
  image_url: string;
  gallery_images?: string[];
  features?: string[];
  roblox_url?: string;
  external_url?: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface UpcomingProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  image_url: string;
  estimated_date?: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  sort_order: number;
  active: boolean;
  highlights?: string[];
  created_at: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  proficiency?: number; // 0-100
  icon?: string;
  sort_order: number;
  active: boolean;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  hero_title: string;
  hero_tagline: string;
  hero_description: string;
  about_title: string;
  about_description: string;
  about_bio: string;
  discord: string;
  roblox: string;
  roblox_profile_url: string;
  footer_description: string;
  seo_title: string;
  seo_description: string;
  available_for_hire: boolean;
  admin_password?: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  handle: string;
  service: string;
  polyBudget?: string;
  timeline?: string;
  budget?: string;
  description: string;
  status: 'New' | 'In Review' | 'Accepted' | 'Archived';
  created_at: string;
}

