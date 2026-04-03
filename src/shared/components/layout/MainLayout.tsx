import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '@/styles/layout.css';

export default function MainLayout() {
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check if current route should show sidebar
  const noSidebarRoutes = ['/login', '/', '/home'];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth <= 992) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname]);

  // Auto-close sidebar on mobile when clicking outside
  useEffect(() => {
    if (!showSidebar) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger-menu');
      
      if (window.innerWidth <= 992 && !isSidebarCollapsed) {
        if (sidebar && !sidebar.contains(target) && hamburger && !hamburger.contains(target)) {
          setSidebarCollapsed(true);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSidebarCollapsed, showSidebar]);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} showSidebar={showSidebar} />
      {showSidebar && <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />}
      <main className={cn('main-content', isSidebarCollapsed && 'collapsed')}>
        <Outlet />
      </main>
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
