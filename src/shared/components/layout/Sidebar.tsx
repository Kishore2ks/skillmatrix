import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Shield, 
  Wrench, 
  FolderOpen, 
  Network, 
  SlidersHorizontal, 
  Lightbulb, 
  Users, 
  Cpu, 
  IdCard,
  Monitor,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Building,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { useAuthStore } from '@/shared/stores/authStore';

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: MenuItem[];
  header?: boolean;
  iconColor?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Import / Manage']);
  const isSuperAdmin = useAuthStore((state) => state.isSuperAdmin());

  // Sample menu structure - customize based on your needs
  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: Home,
      path: '/home',
      iconColor: 'text-blue-500',
    },
    ...(isSuperAdmin ? [{
      label: 'Super Admin',
      icon: Shield,
      path: '/super-admin/dashboard',
      iconColor: 'text-purple-500',
    }] : []),
    {
      label: 'Career Path',
      icon: TrendingUp,
      path: '/career-path',
      iconColor: 'text-green-500',
    },
    {
      label: 'General Setup',
      icon: Wrench,
      path: '/setup/general',
      iconColor: 'text-orange-500',
    },
    {
      label: 'Import / Manage',
      icon: FolderOpen,
      iconColor: 'text-pink-500',
      children: [
        {
          label: 'Organization Unit',
          icon: Network,
          path: '/setup/organization-units',
          iconColor: 'text-cyan-500',
        },
        {
          label: 'Skill Levels',
          icon: SlidersHorizontal,
          path: '/setup/skill-levels',
          iconColor: 'text-emerald-500',
        },
        {
          label: 'Skills',
          icon: Lightbulb,
          path: '/setup/skills',
          iconColor: 'text-yellow-500',
        },
        {
          label: 'Roles',
          icon: Users,
          path: '/setup/roles',
          iconColor: 'text-purple-500',
        },
        {
          label: 'Organization Roles',
          icon: Building,
          path: '/organization-roles',
          iconColor: 'text-violet-500',
        },
        {
          label: 'Skill Matrix',
          icon: Cpu,
          path: '/setup/skill-matrix',
          iconColor: 'text-indigo-500',
        },
        {
          label: 'User List',
          icon: IdCard,
          path: '/users',
          iconColor: 'text-rose-500',
        },
      ],
    },
    {
      label: 'System Config',
      icon: Monitor,
      iconColor: 'text-teal-500',
      children: [
        {
          label: 'Other Settings',
          icon: Settings,
          path: '/setup/other-settings',
          iconColor: 'text-amber-500',
        },
      ],
    },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const hasActiveChild = (children?: MenuItem[]) => {
    return children?.some(child => child.path && isActive(child.path));
  };

  return (
    <>
      <aside className={cn('sidebar', isCollapsed && 'collapsed')}>
        <nav className="sidebar-nav">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const indexKey = `${idx}`;
          
          return (
            <div key={indexKey} className="sidebar-menu-item">
              {item.header ? (
                <div className="sidebar-header">
                  <Icon className={cn("w-3.5 h-3.5", item.iconColor)} />
                  <span>{item.label}</span>
                </div>
              ) : item.children ? (
                <div className="sidebar-group">
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      'sidebar-link sidebar-parent',
                      hasActiveChild(item.children) && 'active',
                      expandedMenus.includes(item.label) && 'expanded'
                    )}
                  >
                    <div className="sidebar-link-content">
                      <Icon className={cn("w-[18px] h-[18px]", item.iconColor)} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        'sidebar-chevron w-4 h-4 transition-transform duration-200',
                        expandedMenus.includes(item.label) && 'rotate-90'
                      )}
                    />
                  </button>

                  {expandedMenus.includes(item.label) && (
                    <div className="sidebar-submenu">
                      {item.children.map(child => {
                        const ChildIcon = child.icon;
                        return (
                          <NavLink
                            key={child.label}
                            to={child.path!}
                            className={({ isActive }) =>
                              cn('sidebar-link sidebar-child', isActive && 'active')
                            }
                          >
                            <ChildIcon className={cn("w-4 h-4", child.iconColor)} />
                            <span>{child.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path!}
                  className={({ isActive }) =>
                    cn('sidebar-link', isActive && 'active')
                  }
                >
                  <Icon className={cn("w-[18px] h-[18px]", item.iconColor)} />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
    </>
  );
}
