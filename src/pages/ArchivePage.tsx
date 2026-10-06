import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, EmptyState, PillTag, DoodleStar, TapeStrip } from '@/components/Doodles';

interface ArchiveItem {
  id: string;
  title: string;
  type: string;
  content: string | null;
  emoji: string;
  color: string;
  created_at: string;
}

const TYPE_FILTERS = ['all', 'session', 'note', 'post', 'event', 'skill'];

export default function ArchivePage() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('session');
  const [newContent, setNewContent] = useState('');
  const [newEmoji, setNewEmoji] = useState('📦');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('archive_items').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setItems(data);
      } else {
        // Seed with demo data
        const seedData = [
          { title: 'Watercolor Workshop Recap', type: 'session', content: 'Amazing session with Aria! Learned wet-on-wet technique and color theory basics.', emoji: '🎨', color: '#800020' },
          { title: 'First Guitar Chord Practice', type: 'note', content: 'Finally got G, C, D, and Em down. Next: fingerpicking patterns!', emoji: '🎸', color: '#5B0015' },
          { title: 'Hackathon 2025 — Team Alpha', type: 'event', content: 'Built a study companion app in 24 hours. Won 2nd place!', emoji: '⚡', color: '#800020' },
          { title: 'Sourdough Attempt #1', type: 'skill', content: 'Too dense, underproofed. Feeding schedule needs adjustment.', emoji: '🍞', color: '#5B0015' },
          { title: 'Community Post: 30-Day Challenge', type: 'post', content: 'Completed the 30-day watercolor challenge! 30 paintings, zero skipped days.', emoji: '🏆', color: '#800020' },
        ];
        for (const item of seedData) {
          const { data: inserted } = await supabase.from('archive_items').insert(item).select().single();
          if (inserted) setItems((prev) => [...prev, inserted]);
        }
      }
      setLoading(false);
    })();
  }, []);

  async function addItem() {
    if (!newTitle.trim()) return;
    const typeEmojis: Record<string, string> = {
      session: '🎨', note: '📝', post: '💬', event: '📌', skill: '🎯',
    };
    const typeColors: Record<string, string> = {
      session: '#800020', note: '#5B0015', post: '#D6C7E8', event: '#FFE89A', skill: '#C8E6D5',
    };
    const { data } = await supabase
      .from('archive_items')
      .insert({
        title: newTitle.trim(),
        type: newType,
        content: newContent.trim() || null,
        emoji: newEmoji || typeEmojis[newType],
        color: typeColors[newType] || '#800020',
      })
      .select()
      .single();

    if (data) {
      setItems((prev) => [data, ...prev]);
      setNewTitle('');
      setNewContent('');
      setNewEmoji('📦');
      setShowAdd(false);
    }
  }

  async function deleteItem(id: string) {
    await supabase.from('archive_items').delete().eq('id', id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const filtered = items.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.content?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Archive" subtitle="Your saved sessions, notes, and memories." emoji="🗄️" />
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm whitespace-nowrap">
          + Archive Item
        </button>
      </div>

      {showAdd && (
        <div className="paper-card p-5 mb-6 animate-slide-up relative" style={{ transform: 'rotate(-0.5deg)' }}>
          <TapeStrip className="-top-3 left-6" style={{ transform: 'rotate(-8deg)' }} />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title..."
            className="w-full px-3 py-2 rounded-lg border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none text-sm mb-3"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Description / content..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none text-sm mb-3 resize-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1.5">
              {['session', 'note', 'post', 'event', 'skill'].map((t) => (
                <button
                  key={t}
                  onClick={() => setNewType(t)}
                  className={`pill-tag capitalize ${newType === t ? 'bg-cherry text-white border border-cherry' : 'bg-paper-200 text-paper-500 border border-paper-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              placeholder="emoji"
              maxLength={2}
              className="w-16 px-2 py-1.5 rounded-lg border-2 border-paper-300 bg-white/60 focus:outline-none text-sm text-center"
            />
            <button onClick={addItem} className="btn-primary text-sm ml-auto">Save</button>
          </div>
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search archive..."
        className="w-full px-5 py-3 rounded-xl border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none transition-colors text-sm mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`pill-tag capitalize transition-all ${filter === t ? 'bg-cherry text-white border border-cherry' : 'bg-paper-200 text-paper-500 border border-paper-300'}`}
          >
            {t === 'all' ? 'All Items' : t}
          </button>
        ))}
      </div>

      {loading ? (
        <EmptyState emoji="🔄" title="Loading archive..." />
      ) : filtered.length === 0 ? (
        <EmptyState emoji="🗄️" title="Archive is empty" subtitle="Save memories and completed sessions here for later!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="paper-card paper-card-hover p-5 relative group"
              style={{ transform: `rotate(${i % 3 === 0 ? -1 : i % 3 === 1 ? 1 : -0.5}deg)` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl flex-shrink-0"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-cherry">{item.title}</h3>
                  <PillTag color="cherry" className="mt-1">{item.type}</PillTag>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-paper-300 hover:text-cherry text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  🗑️
                </button>
              </div>
              {item.content && (
                <p className="text-xs text-paper-500 line-clamp-3 mb-2">{item.content}</p>
              )}
              <p className="text-[10px] text-paper-400">
                {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Memory count */}
      <div className="mt-6 paper-card p-4 text-center" style={{ transform: 'rotate(0.5deg)' }}>
        <div className="flex items-center justify-center gap-2">
          <DoodleStar size={18} />
          <p className="text-sm text-paper-500">
            <span className="font-bold text-cherry">{items.length}</span> memories archived and counting!
          </p>
        </div>
      </div>
    </div>
  );
}
