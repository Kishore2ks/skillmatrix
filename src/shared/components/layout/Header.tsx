import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, MessageSquare, Bookmark, Settings, KeyRound, LogOut, Menu, Moon, Sun, AlignLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { useTheme } from '@/shared/services/ThemeContext';
import { api } from '@/shared/utils/api';

interface HeaderProps {
  onToggleSidebar: () => void;
  showSidebar?: boolean;
}

export default function Header({ onToggleSidebar, showSidebar = true }: HeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notificationCount] = useState(5);

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  // Mock user data - replace with actual auth context
  const user = {
    name: 'Rajasekaran Moorthy',
    email: 'rajasekaran@skillsalpha.com',
  };

  const userInitials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="fixed top-0 left-0 right-0 h-[55px] bg-card border-b border-border z-50 shadow-sm">
      <div className="h-full px-2 md:px-6 flex items-center justify-between">
        {/* Logo with Toggle */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle - Mobile Friendly */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="w-9 h-9 hover:bg-accent rounded-lg"
            aria-label="Toggle sidebar"
          >
            <AlignLeft className="h-5 w-5" />
          </Button>
          
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/home')}
          >
            <img 
              src="/icons/skills-alpha-logo.png" 
              alt="SkillsAlpha" 
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-xl group relative overflow-hidden transition-all duration-300 hover:scale-105"
                onClick={toggleTheme}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-[2px] rounded-[10px] bg-white/20 backdrop-blur-sm"></div>
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-white relative z-10 drop-shadow-lg transition-all duration-300 group-hover:rotate-45" />
                ) : (
                  <Moon className="h-4 w-4 text-white relative z-10 drop-shadow-lg transition-all duration-300 group-hover:-rotate-12" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Feedback */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-xl group relative overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-[2px] rounded-[10px] bg-white/20 backdrop-blur-sm"></div>
                <MessageSquare className="h-4 w-4 text-white relative z-10 drop-shadow-lg transition-all duration-300 group-hover:scale-110" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Global Feedback / Surveys</p>
            </TooltipContent>
          </Tooltip>

          {/* Calendar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-xl group relative overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-[2px] rounded-[10px] bg-white/20 backdrop-blur-sm"></div>
                <Calendar className="h-4 w-4 text-white relative z-10 drop-shadow-lg transition-all duration-300 group-hover:scale-110" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Calendar</p>
            </TooltipContent>
          </Tooltip>

          {/* Wishlist */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-xl group relative overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-500 to-red-500 opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-[2px] rounded-[10px] bg-white/20 backdrop-blur-sm"></div>
                <Bookmark className="h-4 w-4 text-white relative z-10 drop-shadow-lg transition-all duration-300 group-hover:scale-110" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Wishlist</p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-xl group relative overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-600 opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute inset-[2px] rounded-[10px] bg-white/20 backdrop-blur-sm"></div>
                  <Bell className="h-4 w-4 text-white relative z-10 drop-shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
            {notificationCount > 0 && (
              <Badge 
                variant="default" 
                className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[9px] px-1 bg-red-500 text-white border-2 border-white dark:border-slate-800 shadow-lg"
              >
                {notificationCount}
              </Badge>
            )}
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 md:gap-3 hover:bg-accent rounded-lg px-2 py-1 transition-colors">
                <Avatar className="w-[30px] h-[30px]">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-medium text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/change-password')}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
