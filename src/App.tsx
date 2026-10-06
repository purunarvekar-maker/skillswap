import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { TabId, ViewMode } from '@/lib/constants';
import { DEMO_USER } from '@/lib/constants';
import LoginScreen from '@/screens/LoginScreen';
import ViewModeSelector from '@/screens/ViewModeSelector';
import SidebarNav from '@/components/SidebarNav';
import BottomNav from '@/components/BottomNav';
import MoreMenu from '@/components/MoreMenu';

import HomePage from '@/pages/HomePage';
import DiscoverPage from '@/pages/DiscoverPage';
import SkillSwipePage from '@/pages/SkillSwipePage';
import LearningPage from '@/pages/LearningPage';
import CommunityPage from '@/pages/CommunityPage';
import EventsPage from '@/pages/EventsPage';
import ChatPage from '@/pages/ChatPage';
import ToolkitPage from '@/pages/ToolkitPage';
import CalendarPage from '@/pages/CalendarPage';
import NotesPage from '@/pages/NotesPage';
import ProgressPage from '@/pages/ProgressPage';
import ProfilePage from '@/pages/ProfilePage';
import ArchivePage from '@/pages/ArchivePage';

type AppStage = 'login' | 'viewMode' | 'app';

export default function App() {
  const [stage, setStage] = useState<AppStage>('login');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    setStage('login');
    setActiveTab('home');
  }

  function handleSwitchView() {
    setStage('viewMode');
    setShowMoreMenu(false);
  }

  function renderPage() {
    switch (activeTab) {
      case 'home': return <HomePage onNavigate={setActiveTab} viewMode={viewMode} />;
      case 'discover': return <DiscoverPage />;
      case 'skillswipe': return <SkillSwipePage />;
      case 'learning': return <LearningPage />;
      case 'community': return <CommunityPage />;
      case 'events': return <EventsPage />;
      case 'chat': return <ChatPage />;
      case 'toolkit': return <ToolkitPage />;
      case 'calendar': return <CalendarPage />;
      case 'notes': return <NotesPage />;
      case 'progress': return <ProgressPage />;
      case 'profile': return <ProfilePage />;
      case 'archive': return <ArchivePage />;
      default: return <HomePage onNavigate={setActiveTab} viewMode={viewMode} />;
    }
  }

  if (stage === 'login') {
    return <LoginScreen onLoggedIn={() => setStage('viewMode')} />;
  }

  if (stage === 'viewMode') {
    return (
      <ViewModeSelector
        onSelect={(mode) => {
          setViewMode(mode);
          setStage('app');
        }}
      />
    );
  }

  if (viewMode === 'mobile') {
    return (
      <div className="paper-texture min-h-screen">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 bg-paper-50/90 backdrop-blur-sm border-b-2 border-paper-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎴</span>
            <span className="font-display text-xl font-bold text-cherry">SkillSwap</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cherry bg-cherry-50 px-2 py-1 rounded-full">🔥{DEMO_USER.streak}</span>
            <button
              onClick={() => setActiveTab('profile')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-butter text-base border border-cherry-200"
            >
              {DEMO_USER.avatarEmoji}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 pt-4 pb-24 max-w-md mx-auto">
          {renderPage()}
        </main>

        {/* Bottom nav */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenMenu={() => setShowMoreMenu(true)}
        />

        {/* More menu sheet */}
        {showMoreMenu && (
          <MoreMenu
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={() => setShowMoreMenu(false)}
            onLogout={handleLogout}
            onSwitchView={handleSwitchView}
          />
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="paper-texture min-h-screen flex">
      <SidebarNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        onSwitchView={handleSwitchView}
      />
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
