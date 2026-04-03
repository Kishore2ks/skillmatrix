import Header from './Header';
import '@/styles/layout.css';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  // Empty function since we don't need sidebar toggle on landing page
  const handleToggleSidebar = () => {};

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header onToggleSidebar={handleToggleSidebar} showSidebar={false} />
      <main className="pt-[55px] min-h-[calc(100vh-55px)] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
