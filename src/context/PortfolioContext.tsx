import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Project, CurrentProject, UpcomingProject, Service, Skill, SiteSettings } from '../types';
import { PortfolioService, INITIAL_SETTINGS } from '../services/portfolioService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useToast } from './ToastContext';

interface PortfolioContextType {
  projects: Project[];
  currentProjects: CurrentProject[];
  upcomingProjects: UpcomingProject[];
  services: Service[];
  skills: Skill[];
  settings: SiteSettings;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  
  // Navigation & Filter State
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  refreshData: () => Promise<void>;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;

  // CRUD for Works (Projects)
  createProject: (project: Omit<Project, 'id' | 'created_at'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;

  // CRUD for Current Projects
  createCurrentProject: (proj: Omit<CurrentProject, 'id' | 'created_at'>) => Promise<CurrentProject>;
  updateCurrentProject: (id: string, updates: Partial<CurrentProject>) => Promise<CurrentProject>;
  deleteCurrentProject: (id: string) => Promise<void>;

  // CRUD for Upcoming Projects
  createUpcomingProject: (proj: Omit<UpcomingProject, 'id' | 'created_at'>) => Promise<UpcomingProject>;
  updateUpcomingProject: (id: string, updates: Partial<UpcomingProject>) => Promise<UpcomingProject>;
  deleteUpcomingProject: (id: string) => Promise<void>;

  // CRUD for Services
  createService: (service: Omit<Service, 'id' | 'created_at'>) => Promise<Service>;
  updateService: (id: string, updates: Partial<Service>) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;

  // CRUD for Skills & Settings
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<Skill>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<SiteSettings>;
  resetToDefaults: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjects, setCurrentProjects] = useState<CurrentProject[]>([]);
  const [upcomingProjects, setUpcomingProjects] = useState<UpcomingProject[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('pog_admin_session_auth') === 'true';
  });

  const { showToast } = useToast();

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [p, cp, up, s, sk, st] = await Promise.all([
        PortfolioService.getProjects(),
        PortfolioService.getCurrentProjects(),
        PortfolioService.getUpcomingProjects(),
        PortfolioService.getServices(),
        PortfolioService.getSkills(),
        PortfolioService.getSettings(),
      ]);
      setProjects(p);
      setCurrentProjects(cp);
      setUpcomingProjects(up);
      setServices(s);
      setSkills(sk);
      setSettings(st);
    } catch (err: unknown) {
      console.error('Failed to load portfolio data:', err);
      setError('Unable to load full portfolio dataset. Using synchronized local cache.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Setup Supabase Realtime listeners if Supabase is connected
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('portfolio_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => refreshData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'current_projects' }, () => refreshData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'upcoming_projects' }, () => refreshData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => refreshData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => refreshData())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [refreshData]);

  // Auth Functions
  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      // First verify against server API
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdmin(true);
        localStorage.setItem('pog_admin_session_auth', 'true');
        showToast('success', 'Admin Authenticated', 'Welcome back to POG Studio CMS');
        return true;
      }

      // If Supabase Auth is enabled, attempt auth signin
      if (isSupabaseConfigured && supabase) {
        const { error: sbError } = await supabase.auth.signInWithPassword({
          email: 'admin@pog3d.dev',
          password,
        });
        if (!sbError) {
          setIsAdmin(true);
          localStorage.setItem('pog_admin_session_auth', 'true');
          showToast('success', 'Admin Authenticated', 'Welcome back to POG Studio CMS');
          return true;
        }
      }

      showToast('error', 'Access Denied', 'The administrative credential provided is incorrect.');
      return false;
    } catch {
      showToast('error', 'Authentication Failed', 'Unable to verify administrative credential.');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('pog_admin_session_auth');
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    showToast('info', 'Logged Out', 'Administrative session ended securely.');
  };

  // CRUD Implementations
  const createProject = async (proj: Omit<Project, 'id' | 'created_at'>) => {
    const created = await PortfolioService.createProject(proj);
    await refreshData();
    showToast('success', 'Work Published', `"${created.title}" was added to your portfolio.`);
    return created;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updated = await PortfolioService.updateProject(id, updates);
    await refreshData();
    showToast('success', 'Work Updated', `"${updated.title}" changes have been saved.`);
    return updated;
  };

  const deleteProject = async (id: string) => {
    await PortfolioService.deleteProject(id);
    await refreshData();
    showToast('info', 'Work Deleted', 'Project was permanently removed.');
  };

  const createCurrentProject = async (proj: Omit<CurrentProject, 'id' | 'created_at'>) => {
    const created = await PortfolioService.createCurrentProject(proj);
    await refreshData();
    showToast('success', 'Active Project Added', `"${created.title}" is now showcased.`);
    return created;
  };

  const updateCurrentProject = async (id: string, updates: Partial<CurrentProject>) => {
    const updated = await PortfolioService.updateCurrentProject(id, updates);
    await refreshData();
    showToast('success', 'Project Updated', `"${updated.title}" progress was updated.`);
    return updated;
  };

  const deleteCurrentProject = async (id: string) => {
    await PortfolioService.deleteCurrentProject(id);
    await refreshData();
    showToast('info', 'Project Removed', 'Active project was deleted.');
  };

  const createUpcomingProject = async (proj: Omit<UpcomingProject, 'id' | 'created_at'>) => {
    const created = await PortfolioService.createUpcomingProject(proj);
    await refreshData();
    showToast('success', 'Pipeline Project Added', `"${created.title}" added to upcoming list.`);
    return created;
  };

  const updateUpcomingProject = async (id: string, updates: Partial<UpcomingProject>) => {
    const updated = await PortfolioService.updateUpcomingProject(id, updates);
    await refreshData();
    showToast('success', 'Upcoming Project Updated', `"${updated.title}" updated.`);
    return updated;
  };

  const deleteUpcomingProject = async (id: string) => {
    await PortfolioService.deleteUpcomingProject(id);
    await refreshData();
    showToast('info', 'Project Removed', 'Upcoming project was removed.');
  };

  const createService = async (srv: Omit<Service, 'id' | 'created_at'>) => {
    const created = await PortfolioService.createService(srv);
    await refreshData();
    showToast('success', 'Service Created', `"${created.title}" is now available.`);
    return created;
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    const updated = await PortfolioService.updateService(id, updates);
    await refreshData();
    showToast('success', 'Service Updated', `"${updated.title}" details updated.`);
    return updated;
  };

  const deleteService = async (id: string) => {
    await PortfolioService.deleteService(id);
    await refreshData();
    showToast('info', 'Service Removed', 'Service item deleted.');
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    const updated = await PortfolioService.updateSkill(id, updates);
    await refreshData();
    showToast('success', 'Skill Updated', `${updated.name} proficiency updated.`);
    return updated;
  };

  const updateSettings = async (st: Partial<SiteSettings>) => {
    const updated = await PortfolioService.updateSettings(st);
    setSettings(updated);
    showToast('success', 'Site Settings Saved', 'Global portfolio metadata updated.');
    return updated;
  };

  const resetToDefaults = () => {
    PortfolioService.resetAllData();
    refreshData();
    showToast('info', 'Reset Complete', 'Portfolio data reset to initial showcase standards.');
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        currentProjects,
        upcomingProjects,
        services,
        skills,
        settings,
        isLoading,
        error,
        isAdmin,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        refreshData,
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
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
