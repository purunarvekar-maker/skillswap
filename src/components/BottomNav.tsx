import type { TabId } from '@/lib/constants';
import { NAV_ITEMS, DEMO_USER } from '@/lib/constants';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenMenu: () => void;
}

const PRIMARY_TABS: TabId[] = ['home', 'discover', 'skillswipe', 'community'];

export default function BottomNav({ activeTab, onTabChange, onOpenMenu }: BottomNavProps) {
  const primaryItems = NAV_ITEMS.filter((item) => PRIMARY_TABS.includes(item.id));
  const isActive = activeTab === 'profile' || !PRIMARY_TABS.includes(activeTab);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-paper-50 border-t-2 border-paper-300 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {primaryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
              activeTab === item.id ? 'bg-cherry text-white scale-105' : 'text-paper-500'
            }`}
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
          </button>
        ))}

        {/* More button */}
        <button
          onClick={onOpenMenu}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
            isActive ? 'bg-cherry text-white scale-105' : 'text-paper-500'
          }`}
        >
          <span className="text-xl">{DEMO_USER.avatarEmoji}</span>
          <span className="text-[9px] font-bold uppercase tracking-wide">More</span>
        </button>
      </div>
    </div>
  );
}
