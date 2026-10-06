import type { TabId } from '@/lib/constants';
import { NAV_ITEMS, DEMO_USER } from '@/lib/constants';
import { DoodleCat, DoodleSparkle } from '@/components/Doodles';

interface SidebarNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onLogout: () => void;
  onSwitchView: () => void;
}

export default function SidebarNav({ activeTab, onTabChange, onLogout, onSwitchView }: SidebarNavProps) {
  return (
    <aside className="w-64 bg-paper-50 border-r-2 border-paper-300 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b-2 border-paper-200">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cherry text-white text-xl sticker">
            🎴
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-cherry leading-none">SkillSwap</h1>
            <p className="text-[10px] text-paper-400 font-medium">Campus Skill Exchange</p>
          </div>
        </div>
      </div>

      {/* User mini-card */}
      <div className="mx-3 mt-3 paper-card p-3 flex items-center gap-3 relative" style={{ transform: 'rotate(-0.5deg)' }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-butter text-xl border-2 border-cherry-200">
          {DEMO_USER.avatarEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-cherry truncate">{DEMO_USER.fullName}</p>
          <p className="text-[10px] text-paper-400 truncate">{DEMO_USER.guild}</p>
        </div>
        <div className="flex items-center gap-0.5 text-xs font-bold text-cherry bg-cherry-50 px-2 py-1 rounded-full">
          🔥{DEMO_USER.streak}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === item.id
                ? 'bg-cherry text-white shadow-md translate-x-1'
                : 'text-paper-500 hover:bg-paper-200 hover:translate-x-0.5'
            }`}
          >
            <span className="text-lg">{item.emoji}</span>
            <span>{item.label}</span>
            {activeTab === item.id && <DoodleSparkle size={14} className="ml-auto" />}
          </button>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-3 border-t-2 border-paper-200 space-y-2">
        <button
          onClick={onSwitchView}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-cherry border-2 border-cherry-200 hover:bg-cherry-50 transition-all"
        >
          📱 Switch View Mode
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-paper-400 hover:text-cherry transition-all"
        >
          Log Out
        </button>
        <div className="flex items-center justify-center pt-1">
          <DoodleCat size={32} className="opacity-50" />
        </div>
      </div>
    </aside>
  );
}
