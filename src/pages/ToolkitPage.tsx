import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, PillTag, EmptyState, DoodleStar } from '@/components/Doodles';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  color: string;
  rating: number;
  link: string | null;
}

export default function ToolkitPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('toolkit_items').select('*');
      if (data) setTools(data);
      setLoading(false);
    })();
  }, []);

  const categories = [...new Set(tools.map((t) => t.category))];
  const filtered = tools.filter((t) => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Toolkit" subtitle="Curated tools and resources for your creative journey." emoji="🧰" />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tools..."
        className="w-full px-5 py-3 rounded-xl border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none transition-colors text-sm mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`pill-tag transition-all ${!activeCategory ? 'bg-cherry text-white border border-cherry' : 'bg-paper-200 text-paper-500 border border-paper-300'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`pill-tag transition-all ${activeCategory === cat ? 'bg-cherry text-white border border-cherry' : 'bg-paper-200 text-paper-500 border border-paper-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <EmptyState emoji="🔄" title="Loading toolkit..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool, i) => (
            <div
              key={tool.id}
              className="paper-card paper-card-hover p-5"
              style={{ transform: `rotate(${i % 3 === 0 ? -0.5 : i % 3 === 1 ? 0.5 : 0}deg)` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl flex-shrink-0"
                  style={{ backgroundColor: tool.color + '20' }}
                >
                  {tool.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-cherry truncate">{tool.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold" style={{ color: tool.color }}>⭐ {tool.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-paper-500 mb-3 line-clamp-2">{tool.description}</p>

              <div className="flex items-center justify-between">
                <PillTag color="mint">{tool.category}</PillTag>
                {tool.link && (
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-cherry hover:underline"
                  >
                    Visit →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip card */}
      <div className="mt-6 paper-card p-5 relative" style={{ transform: 'rotate(-0.5deg)' }}>
        <div className="flex items-start gap-3">
          <DoodleStar size={28} />
          <div>
            <h3 className="font-bold text-sm text-cherry mb-1">Pro Tip</h3>
            <p className="text-sm text-paper-500">
              Most tools here offer free student plans! Always check with your university email before subscribing. Ask in Community Chat if you need recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
