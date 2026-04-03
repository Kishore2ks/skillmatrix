import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Preload images on module load for faster display
const imageUrls = [
  '/icons/career-path.png',
  '/icons/skilling.png',
  '/icons/dashboard.png',
  '/icons/learner-request.png',
  '/icons/my-profile.png',
  '/icons/tenant-admin.png',
  '/icons/community.png',
  '/icons/skill-matrix.png',
];

// Preload all images immediately when this module loads
if (typeof window !== 'undefined') {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

interface FeatureCardProps {
  title: string;
  description: string;
  iconImage: string;
  gradientFrom: string;
  gradientTo: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = memo(({
  title,
  description,
  iconImage,
  gradientFrom,
  gradientTo,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  // Memoize styles to prevent recalculation on every render
  const iconStyle = useMemo(() => ({
    boxShadow: isHovered 
      ? `0 20px 50px rgba(0,0,0,0.2), 0 0 60px ${gradientFrom}60, 0 0 80px ${gradientTo}40`
      : '0 10px 30px rgba(0,0,0,0.1)',
    transform: isHovered ? 'scale(1.1) translateY(-8px)' : 'scale(1) translateY(0)',
    filter: isHovered ? 'brightness(1.15) saturate(1.2)' : 'brightness(1)',
  }), [isHovered, gradientFrom, gradientTo]);

  return (
    <div 
      className="flex flex-col items-center pt-10 lg:pt-12 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Large Floating Icon Circle */}
      <div
        className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full flex items-center justify-center mb-[-56px] sm:mb-[-64px] lg:mb-[-72px] z-10 transition-all duration-500 overflow-hidden"
        style={iconStyle}
      >
        {/* Skeleton placeholder while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse rounded-full" />
        )}
        <img 
          src={iconImage} 
          alt={title} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          decoding="async"
          width={144}
          height={144}
          onLoad={handleImageLoad}
        />
      </div>

      {/* Card Body */}
      <div
        className={`flex flex-col items-center text-center px-3 pt-[72px] sm:pt-[80px] lg:pt-[88px] pb-4 rounded-3xl w-full transition-all duration-500 backdrop-blur-md dark:backdrop-blur-lg ${isHovered ? 'card-body-hovered' : 'card-body-default'}`}
        style={useMemo(() => ({
          background: isHovered 
            ? 'rgba(255,255,255,0.95)' 
            : 'rgba(255,255,255,0.75)',
          boxShadow: isHovered
            ? `0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px ${gradientFrom}30`
            : '0 8px 32px rgba(0,0,0,0.08)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }), [isHovered, gradientFrom])}
      >
        {/* Title */}
        <h3 className="text-sm lg:text-base font-bold text-gray-800 mb-1">
          {title}
        </h3>

        {/* Gradient Line */}
        <div
          className="h-0.5 rounded-full mb-2 transition-all duration-500"
          style={{
            width: isHovered ? '3rem' : '2rem',
            background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
          }}
        />

        {/* Description */}
        <p className="text-[11px] lg:text-xs text-gray-600 leading-snug line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
});

// Display name for debugging
FeatureCard.displayName = 'FeatureCard';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Memoize features data to prevent recreation on every render
  const featuresData = useMemo(() => [
    {
      title: 'Career Path',
      description: 'Plan your growth with curated learning journeys aligned to your career goals.',
      iconImage: '/icons/career-path.png',
      gradientFrom: '#8B5CF6',
      gradientTo: '#EC4899',
      route: '/setup/roles',
    },
    {
      title: 'Skilling',
      description: 'Learn skills that match your career goals through interactive learning paths.',
      iconImage: '/icons/skilling.png',
      gradientFrom: '#06B6D4',
      gradientTo: '#10B981',
      route: '/setup/skills',
    },
    {
      title: 'Dashboard',
      description: 'Get insights and analytics tailored to your learning performance.',
      iconImage: '/icons/dashboard.png',
      gradientFrom: '#F97316',
      gradientTo: '#EF4444',
      route: '/dashboard',
    },
    {
      title: 'Learner Request',
      description: 'Manage course access, support tickets, and personalized learning requests.',
      iconImage: '/icons/learner-request.png',
      gradientFrom: '#EC4899',
      gradientTo: '#F472B6',
      route: '/setup/other-settings',
    },
    {
      title: 'My Profile',
      description: 'View and update your profile, preferences, and learning journey details.',
      iconImage: '/icons/my-profile.png',
      gradientFrom: '#8B5CF6',
      gradientTo: '#6366F1',
      route: '/users/manage',
    },
    {
      title: 'Tenant Admin',
      description: 'Configure tenant-level settings, manage users, and customize platform access.',
      iconImage: '/icons/tenant-admin.png',
      gradientFrom: '#14B8A6',
      gradientTo: '#06B6D4',
      route: '/users',
    },
    {
      title: 'Community',
      description: 'Connect with peers, share knowledge, and collaborate on learning goals.',
      iconImage: '/icons/community.png',
      gradientFrom: '#3B82F6',
      gradientTo: '#8B5CF6',
      route: '/setup/organization-units',
    },
    {
      title: 'Skill Matrix AI',
      description: 'AI-powered skill assessments and intelligent learning recommendations.',
      iconImage: '/icons/skill-matrix.png',
      gradientFrom: '#A855F7',
      gradientTo: '#EC4899',
      route: '/setup/skill-matrix',
    },
  ], []);

  // Memoize click handler to prevent recreation on every render
  const handleCardClick = useCallback((route: string) => {
    if (route !== '#') {
      navigate(route);
    }
  }, [navigate]);

  return (
    <section className="relative min-h-[calc(100vh-56px)] overflow-y-auto overflow-x-hidden pb-8">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-100 via-purple-50 to-cyan-100 dark:from-slate-900 dark:via-purple-950/50 dark:to-slate-900 -z-10" />
      
      {/* Animated blobs */}
      <div className="fixed top-0 -left-40 w-80 h-80 bg-purple-400/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob -z-10" />
      <div className="fixed top-0 -right-40 w-80 h-80 bg-cyan-400/30 dark:bg-cyan-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-2000 -z-10" />
      <div className="fixed -bottom-40 left-1/2 w-80 h-80 bg-pink-400/30 dark:bg-pink-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-4000 -z-10" />

      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] dark:opacity-[0.05] -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Cards Grid */}
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuresData.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                iconImage={feature.iconImage}
                gradientFrom={feature.gradientFrom}
                gradientTo={feature.gradientTo}
                onClick={() => handleCardClick(feature.route)}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default memo(LandingPage);
