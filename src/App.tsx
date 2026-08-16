import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './context/ToastContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { Lightbox } from './components/Lightbox';
import { AuroraBackground } from './components/AuroraBackground';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { WorkPage } from './pages/WorkPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

function PortfolioApp() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Lightbox State
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    images: string[];
    index: number;
    title: string;
  }>({
    isOpen: false,
    images: [],
    index: 0,
    title: '',
  });

  // Client-side Navigation Handler
  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser back / forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenLightbox = (images: string[], index: number = 0, title: string = 'Asset Showcase') => {
    setLightbox({
      isOpen: true,
      images,
      index,
      title,
    });
  };

  const handleCloseLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  // Route Resolver
  const renderCurrentPage = () => {
    // 1. Project Detail Page (/work/:id or /work/:slug or /project/:slug)
    if (currentPath.startsWith('/work/') && currentPath.length > 6) {
      const slugOrId = currentPath.substring(6);
      return (
        <ProjectDetailPage
          projectIdOrSlug={slugOrId}
          navigate={navigate}
          onOpenLightbox={handleOpenLightbox}
        />
      );
    }

    if (currentPath.startsWith('/project/') && currentPath.length > 9) {
      const slugOrId = currentPath.substring(9);
      return (
        <ProjectDetailPage
          projectIdOrSlug={slugOrId}
          navigate={navigate}
          onOpenLightbox={handleOpenLightbox}
        />
      );
    }

    // 2. Exact Path Matches
    switch (currentPath) {
      case '/about':
        return <AboutPage navigate={navigate} onOpenLightbox={handleOpenLightbox} />;
      case '/work':
        return <WorkPage navigate={navigate} onOpenLightbox={handleOpenLightbox} />;
      case '/projects':
        return <ProjectsPage navigate={navigate} onOpenLightbox={handleOpenLightbox} />;
      case '/services':
        return <ServicesPage navigate={navigate} />;
      case '/contact':
        return <ContactPage />;
      case '/admin':
        return <AdminPage />;
      case '/':
      default:
        return <HomePage navigate={navigate} onOpenLightbox={handleOpenLightbox} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Aurora / Star Canvas */}
      <AuroraBackground />

      {/* Persistent Global Navigation */}
      <Navbar currentPath={currentPath} navigate={navigate} />

      {/* Main Routed Content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer navigate={navigate} />

      {/* Floating Gemini AI Assistant: "Dudu Boi" */}
      <Chatbot />

      {/* Lightbox for High-Resolution Viewport Renders */}
      <Lightbox
        isOpen={lightbox.isOpen}
        images={lightbox.images}
        initialIndex={lightbox.index}
        title={lightbox.title}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <PortfolioProvider>
        <PortfolioApp />
      </PortfolioProvider>
    </ToastProvider>
  );
}
