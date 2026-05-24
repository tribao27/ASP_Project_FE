import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import AppHeader from '../components/AppHeader.jsx';

/**
 * Layout wrapper — High-end Apple Minimalist Light theme.
 * Completely static viewport architecture with isolated scrolling containers.
 * Soft light background (#f5f5f7) for a warm premium Apple aesthetic.
 * Header is PERMANENTLY visible on all views to prevent unmounting/layout shift bugs.
 * Supports sidebar collapse/expand on desktop.
 */
export default function MainLayout({
  currentView,
  onNavigate,
  onLogout,
  currentUser,
  storagePercentage,
  documentsCount,
  deletedDocsCount = 0,
  searchTerm,
  onSearchChange,
  avatarUrl,
  accentColor,
  isAdmin,
  children,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sidebarMargin = isSidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[260px]';

  return (
    <div className="w-full min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-row font-sans relative overflow-hidden grid-mesh animate-fade-in">
      {/* Background soft ambient lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ff5c00]/2 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[8s]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#007aff]/1 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[10s]" />

      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Modern Bright Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        onLogout={onLogout}
        currentUser={currentUser}
        storagePercentage={storagePercentage}
        documentsCount={documentsCount}
        deletedDocsCount={deletedDocsCount}
        avatarUrl={avatarUrl}
        accentColor={accentColor}
        isAdmin={isAdmin}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Central Content Panel - Immersive & Premium */}
      <div className={`flex-1 flex flex-col h-screen max-h-screen ml-0 ${sidebarMargin} overflow-hidden relative z-10 bg-[#f5f5f7] sidebar-transition`}>
        
        {/* App Header (Static at the top) */}
        <div className="px-3 sm:px-5 md:px-8 pt-4 sm:pt-5 pb-2 sm:pb-3 bg-[#f5f5f7] z-30 flex-shrink-0">
          <AppHeader 
            searchTerm={searchTerm} 
            onSearchChange={onSearchChange}
            avatarUrl={avatarUrl}
            accentColor={accentColor}
            onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
            onNavigate={onNavigate}
          />
        </div>

        {/* Independent Page Viewport Container - The "Khung" (Frame) */}
        <div className="flex-1 overflow-hidden relative flex flex-col w-full h-full px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4 pt-1">
          <div className="flex-1 bg-white/60 backdrop-blur-3xl rounded-[16px] sm:rounded-[22px] md:rounded-[28px] border border-black/[0.04] shadow-sm overflow-hidden relative flex flex-col ring-1 ring-white/50">
            <div
              key={currentView}
              className="flex-1 flex flex-col w-full h-full overflow-hidden animate-fade-in"
            >
              {children}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
