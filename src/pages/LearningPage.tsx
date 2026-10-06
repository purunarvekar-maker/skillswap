import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DEMO_USER } from '@/lib/constants';
import { PageHeader, PillTag, EmptyState, DoodleStar } from '@/components/Doodles';

interface Session {
  id: string;
  partner_name: string;
  partner_avatar: string;
  skill: string;
  status: string;
  date: string | null;
  duration_minutes: number;
  notes: string | null;
}

export default function LearningPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'pending'>('all');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('learning_sessions').select('*').order('created_at', { ascending: false });
      if (data) setSessions(data);
      setLoading(false);
    })();
  }, []);

  const filtered = sessions.filter((s) => filter === 'all' || s.status === filter);

  const stats = {
    total: sessions.length,
    upcoming: sessions.filter((s) => s.status === 'upcoming').length,
    completed: sessions.filter((s) => s.status === 'completed').length,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Learning Hub" subtitle="Your skill exchange sessions and study journey." emoji="📚" />

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="paper-card p-4 text-center" style={{ transform: 'rotate(-0.5deg)' }}>
          <p className="font-display text-3xl font-bold text-cherry">{stats.total}</p>
          <p className="text-xs text-paper-400 font-bold uppercase">Total</p>
        </div>
        <div className="paper-card p-4 text-center" style={{ transform: 'rotate(0.5deg)' }}>
          <p className="font-display text-3xl font-bold text-cherry">{stats.upcoming}</p>
          <p className="text-xs text-paper-400 font-bold uppercase">Upcoming</p>
        </div>
        <div className="paper-card p-4 text-center" style={{ transform: 'rotate(-0.5deg)' }}>
          <p className="font-display text-3xl font-bold text-cherry">{stats.completed}</p>
          <p className="text-xs text-paper-400 font-bold uppercase">Completed</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'upcoming', 'completed', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pill-tag transition-all capitalize ${filter === f ? 'bg-cherry text-white border border-cherry' : 'bg-paper-200 text-paper-500 border border-paper-300'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <EmptyState emoji="🔄" title="Loading sessions..." />
      ) : filtered.length === 0 ? (
        <EmptyState emoji="📭" title="No sessions yet" subtitle="Head to SkillSwipe or Discover to find your first skill exchange!" />
      ) : (
        <div className="space-y-3">
          {filtered.map((session, i) => {
            const sessionDate = session.date ? new Date(session.date) : null;
            const statusColors: Record<string, { bg: string; text: string; label: string }> = {
              upcoming: { bg: 'bg-mint-light', text: 'text-green-800', label: 'Upcoming' },
              completed: { bg: 'bg-butter-light', text: 'text-yellow-800', label: 'Completed' },
              pending: { bg: 'bg-lavender-light', text: 'text-purple-800', label: 'Pending' },
            };
            const status = statusColors[session.status] || statusColors.pending;

            return (
              <div
                key={session.id}
                className="paper-card paper-card-hover p-4 flex items-center gap-4"
                style={{ transform: `rotate(${i % 2 === 0 ? -0.3 : 0.3}deg)` }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl bg-paper-200 border-2 border-paper-300 flex-shrink-0">
                  {session.partner_avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-cherry truncate">{session.skill}</h3>
                  <p className="text-xs text-paper-400">with {session.partner_name}</p>
                  {sessionDate && (
                    <p className="text-xs text-paper-500 mt-1">
                      📅 {sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  )}
                  {session.notes && (
                    <p className="text-xs text-paper-400 mt-1 italic line-clamp-1">"{session.notes}"</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`pill-tag ${status.bg} ${status.text} border border-current/20`}>{status.label}</span>
                  <span className="text-xs text-paper-400">{session.duration_minutes}min</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggested skills to learn */}
      <div className="mt-8">
        <h2 className="font-display text-2xl font-bold text-cherry mb-4 flex items-center gap-2">
          <DoodleStar size={20} /> Suggested for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_USER.skillsWanted.map((skill, i) => (
            <div key={skill} className="paper-card p-4" style={{ transform: `rotate(${i % 2 === 0 ? 0.5 : -0.5}deg)` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎯</span>
                <h3 className="font-bold text-sm text-cherry">{skill}</h3>
              </div>
              <p className="text-xs text-paper-400 mb-3">On your wishlist — find a mentor to start learning!</p>
              <PillTag color="lavender">Wanted</PillTag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
