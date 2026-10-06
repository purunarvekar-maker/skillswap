import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DEMO_USER } from '@/lib/constants';
import { PageHeader, PillTag, EmptyState, DoodleStar, DoodleCat } from '@/components/Doodles';

interface ProgressItem {
  id: string;
  skill_name: string;
  progress: number;
  total_milestones: number;
  completed_milestones: number;
  category: string | null;
  color: string;
}

export default function ProgressPage() {
  const [items, setItems] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('progress_items').select('*');
      if (data && data.length > 0) {
        setItems(data);
      } else {
        // Seed with demo data
        const seedData = [
          { skill_name: 'Watercolor Painting', progress: 75, total_milestones: 10, completed_milestones: 7, category: 'Visual Arts', color: '#800020' },
          { skill_name: 'Web Development', progress: 60, total_milestones: 12, completed_milestones: 7, category: 'Technology', color: '#5B0015' },
          { skill_name: 'Film Photography', progress: 40, total_milestones: 8, completed_milestones: 3, category: 'Photography', color: '#800020' },
          { skill_name: 'Sourdough Baking', progress: 25, total_milestones: 6, completed_milestones: 1, category: 'Culinary', color: '#5B0015' },
        ];
        for (const item of seedData) {
          const { data: inserted } = await supabase.from('progress_items').insert(item).select().single();
          if (inserted) setItems((prev) => [...prev, inserted]);
        }
      }
      setLoading(false);
    })();
  }, []);

  const overallProgress = items.length > 0
    ? Math.round(items.reduce((sum, item) => sum + item.progress, 0) / items.length)
    : 0;

  const totalMilestones = items.reduce((sum, item) => sum + item.completed_milestones, 0);
  const totalTargetMilestones = items.reduce((sum, item) => sum + item.total_milestones, 0);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Progress" subtitle="Track your skill development journey." emoji="📊" />
        <EmptyState emoji="🔄" title="Loading progress..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Progress" subtitle="Track your skill development journey." emoji="📊" />

      {/* Overall progress hero */}
      <div className="paper-card p-6 mb-6 relative overflow-hidden" style={{ transform: 'rotate(-0.5deg)' }}>
        <div className="halftone-bg absolute inset-0 opacity-30" />
        <div className="relative z-10 flex items-center gap-6">
          {/* Circular progress */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="#EDE5D8" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#800020"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallProgress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-cherry">{overallProgress}%</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-cherry">Overall Progress</h2>
            <p className="text-sm text-paper-500 mt-1">
              You've completed <span className="font-bold text-cherry">{totalMilestones}</span> out of{' '}
              <span className="font-bold text-cherry">{totalTargetMilestones}</span> milestones across{' '}
              {items.length} skills. Keep going! 🔥
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <PillTag color="cherry">🔥 {DEMO_USER.streak} day streak</PillTag>
              <PillTag color="mint">📈 {DEMO_USER.totalSessions} sessions</PillTag>
            </div>
          </div>
        </div>
      </div>

      {/* Skill progress bars */}
      <h2 className="font-display text-2xl font-bold text-cherry mb-4 flex items-center gap-2">
        <DoodleStar size={20} /> Skill Breakdown
      </h2>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="paper-card p-5"
            style={{ transform: `rotate(${i % 2 === 0 ? -0.3 : 0.3}deg)` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  📚
                </div>
                <div>
                  <h3 className="font-bold text-sm text-cherry">{item.skill_name}</h3>
                  {item.category && <p className="text-xs text-paper-400">{item.category}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-bold text-cherry">{item.progress}%</p>
                <p className="text-xs text-paper-400">{item.completed_milestones}/{item.total_milestones} milestones</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-paper-200 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-1000 relative"
                style={{
                  width: `${item.progress}%`,
                  backgroundColor: item.color,
                }}
              >
                <div className="absolute inset-0 halftone-bg opacity-20" />
              </div>
            </div>

            {/* Milestone dots */}
            <div className="flex gap-1.5 mt-3">
              {Array.from({ length: item.total_milestones }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: idx < item.completed_milestones ? item.color : '#EDE5D8',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="mt-8">
        <h2 className="font-display text-2xl font-bold text-cherry mb-4 flex items-center gap-2">
          🏆 Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEMO_USER.badges.map((badge, i) => (
            <div
              key={badge}
              className="paper-card p-4 text-center relative"
              style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
            >
              <div className="text-3xl mb-2 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                {['🏅', '🔥', '🌟', '💎'][i] || '🎖️'}
              </div>
              <p className="font-bold text-xs text-cherry">{badge}</p>
              <div className="absolute -top-2 -right-2 stamp text-[8px] text-cherry border-cherry" style={{ fontSize: '8px' }}>
                EARNED
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <div className="mt-8 paper-card p-5 text-center relative" style={{ transform: 'rotate(0.5deg)' }}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <DoodleCat size={40} />
          <p className="font-display text-xl text-cherry">You're doing amazing!</p>
        </div>
        <p className="text-sm text-paper-500">
          Every milestone is a step forward. The best skill you're building is the habit of learning itself. 🌱
        </p>
      </div>
    </div>
  );
}
