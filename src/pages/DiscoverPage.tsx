import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SKILL_CATEGORIES } from '@/lib/constants';
import { PageHeader, PillTag, DoodleStar, DoodleHeart, EmptyState } from '@/components/Doodles';

interface Skill {
  id: string;
  student_name: string;
  student_avatar: string;
  skill_name: string;
  skill_category: string;
  description: string;
  tags: string[];
  level: string;
  color: string;
  rating: number;
  sessions_taught: number;
}

export default function DiscoverPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('skills_marketplace').select('*');
      if (data) setSkills(data);
      setLoading(false);
    })();
  }, []);

  const filtered = skills.filter((s) => {
    const matchesSearch =
      !search ||
      s.skill_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_name.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !activeCategory || s.skill_category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Discover Skills" subtitle="Browse the campus skill marketplace and find your next teacher." emoji="🧭" />

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills, students, or tags..."
          className="w-full px-5 py-3 rounded-xl border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`pill-tag transition-all ${!activeCategory ? 'bg-cherry text-white border border-cherry' : 'bg-paper-200 text-paper-500 border border-paper-300'}`}
        >
          All
        </button>
        {SKILL_CATEGORIES.map((cat) => (
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
        <EmptyState emoji="🔄" title="Loading skills..." />
      ) : filtered.length === 0 ? (
        <EmptyState emoji="🔍" title="No skills found" subtitle="Try a different search or category filter." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill, i) => (
            <div
              key={skill.id}
              className="paper-card paper-card-hover p-5 relative"
              style={{ transform: `rotate(${i % 3 === 0 ? -0.5 : i % 3 === 1 ? 0.5 : 0}deg)` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl bg-paper-200 border-2 border-paper-300">
                  {skill.student_avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-cherry">{skill.skill_name}</h3>
                  <p className="text-xs text-paper-400">by {skill.student_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold" style={{ color: skill.color }}>⭐ {skill.rating}</span>
                    <span className="text-xs text-paper-400">·</span>
                    <span className="text-xs text-paper-400">{skill.sessions_taught} sessions</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-paper-500 mb-3 line-clamp-2">{skill.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <PillTag color="cherry">{skill.skill_category}</PillTag>
                <PillTag color="mint">{skill.level}</PillTag>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {skill.tags.map((tag) => (
                  <span key={tag} className="text-[10px] text-paper-400 font-medium">#{tag}</span>
                ))}
              </div>

              <button className="btn-primary w-full text-sm">
                Request Session
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
