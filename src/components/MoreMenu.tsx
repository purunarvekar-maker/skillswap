import type { TabId } from '@/lib/constants';
import { NAV_ITEMS, DEMO_USER } from '@/lib/constants';

interface MoreMenuProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onClose: () => void;
  onLogout: () => void;
  onSwitchView: () => void;
}

const PRIMARY_TABS: TabId[] = ['home', 'discover', 'skillswipe', 'community'];

export default function MoreMenu({ activeTab, onTabChange, onClose, onLogout, onSwitchView }: MoreMenuProps) {
  const moreItems = NAV_ITEMS.filter((item) => !PRIMARY_TABS.includes(item.id));

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-md bg-paper-50 rounded-t-3xl border-t-2 border-paper-300 p-5 pb-8 animate-slide-up max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-paper-300 rounded-full mx-auto mb-4" />

        <div className="flex items-center gap-3 mb-5 paper-card p-3" style={{ transform: 'rotate(-0.5deg)' }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-butter text-2xl border-2 border-cherry-200">
            {DEMO_USER.avatarEmoji}
          </div>
          <div className="flex-1">
            <p className="font-bold text-cherry text-sm">{DEMO_USER.fullName}</p>
            <p className="text-[10px] text-paper-400">{DEMO_USER.guild}</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-cherry bg-cherry-50 px-2 py-1 rounded-full">
            🔥{DEMO_USER.streak}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {moreItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onClose();
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                activeTab === item.id
                  ? 'bg-cherry text-white'
                  : 'paper-card-hover bg-white'
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-[10px] font-bold text-center leading-tight">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onSwitchView}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-cherry border-2 border-cherry-200 hover:bg-cherry-50 transition-all"
          >
            📱 Switch View
          </button>
          <button
            onClick={onLogout}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-paper-400 border-2 border-paper-300 hover:text-cherry hover:border-cherry-200 transition-all"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
