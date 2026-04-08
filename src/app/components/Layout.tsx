import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { TutorialOverlay } from './TutorialOverlay';
import { OnboardingModal } from './modals/OnboardingModal';
import { DevTools } from './DevTools';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { isOnboarded } = useAuth();

  return (
    <div 
      className="min-h-screen transition-colors"
      style={{
        background: 'var(--color-background)',
      }}
    >
      <div className="max-w-md mx-auto relative pb-24 lg:max-w-4xl">
        <TopBar />
        <main className="px-4 lg:px-8">
          <Outlet />
        </main>
        <BottomNav />
        <TutorialOverlay />
        {!isOnboarded && <OnboardingModal open={true} />}
        <DevTools />
      </div>
    </div>
  );
}