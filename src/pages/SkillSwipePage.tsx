import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { DEMO_USER } from '@/lib/constants';
import { DoodleHeart, DoodleStar, DoodleSparkle, DoodleCat } from '@/components/Doodles';

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

export default function SkillSwipePage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [matches, setMatches] = useState<Skill[]>([]);
  const [passed, setPassed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('skills_marketplace').select('*');
      if (data) setSkills(data);
      setLoading(false);
    })();
  }, []);

  const handleSwipe = useCallback((dir: 'left' | 'right' | 'up') => {
    setDirection(dir);
    const current = skills[index];
    if (!current) return;
    if (dir === 'right' || dir === 'up') {
      setMatches((prev) => [...prev, current]);
    } else {
      setPassed((prev) => prev + 1);
    }
    setTimeout(() => {
      setDirection(null);
      setIndex((prev) => prev + 1);
    }, 300);
  }, [skills, index]);

  const current = skills[index];
  const next = skills[index + 1];
  const isFinished = index >= skills.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <DoodleCat size={80} />
        <p className="font-display text-2xl text-cherry mt-4">Shuffling the deck...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-12">
        <div className="paper-card p-8 text-center max-w-md relative" style={{ transform: 'rotate(-1deg)' }} >
          <div className="animate-bounce-soft mb-4">
            <DoodleStar size={50} />
          </div>
          <h2 className="font-display text-3xl font-bold text-cherry mb-2">That's the deck!</h2>
          <p className="text-sm text-paper-500 mb-6">
            You matched with <span className="font-bold text-cherry">{matches.length}</span> skills
            and passed on {passed}. Check your Learning page to follow up!
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {matches.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5 bg-mint-light border border-mint-dark rounded-full px-3 py-1">
                <span>{m.student_avatar}</span>
                <span className="text-xs font-bold text-green-800">{m.skill_name}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setIndex(0); setMatches([]); setPassed(0); }}
            className="btn-primary text-sm"
          >
            Shuffle Again 🔄
          </button>
        </div>
      </div>
    );
  }

  const swipeStyle = direction === 'right'
    ? { transform: 'translateX(150%) rotate(20deg)', opacity: 0, transition: 'all 0.3s ease' }
    : direction === 'left'
    ? { transform: 'translateX(-150%) rotate(-20deg)', opacity: 0, transition: 'all 0.3s ease' }
    : direction === 'up'
    ? { transform: 'translateY(-150%) rotate(10deg)', opacity: 0, transition: 'all 0.3s ease' }
    : {};

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="font-display text-4xl font-bold text-cherry">SkillSwipe 🎴</h1>
        <p className="text-sm text-paper-500 mt-1">Swipe right to match, left to pass, up to super-like!</p>
      </div>

      {/* Card stack */}
      <div className="relative max-w-sm mx-auto" style={{ height: '480px' }}>
        {next && (
          <div className="absolute inset-0 paper-card p-6" style={{ transform: 'scale(0.95) translateY(12px)', opacity: 0.6 }}>
            <div className="flex h-40 items-center justify-center rounded-2xl text-6xl" style={{ backgroundColor: next.color + '20' }}>
              {next.student_avatar}
            </div>
          </div>
        )}

        {current && (
          <div
            className="absolute inset-0 paper-card p-6 flex flex-col cursor-grab active:cursor-grabbing"
            style={swipeStyle}
          >
            {/* Color header */}
            <div className="flex h-36 items-center justify-center rounded-2xl text-6xl mb-4 relative overflow-hidden" style={{ backgroundColor: current.color + '20' }}>
              <div className="halftone-bg absolute inset-0 opacity-30" />
              <span className="relative z-10">{current.student_avatar}</span>
              <div className="absolute top-3 right-3 stamp" style={{ color: current.color }}>
                {current.level}
              </div>
            </div>

            <h3 className="font-display text-2xl font-bold text-cherry">{current.skill_name}</h3>
            <p className="text-xs text-paper-400 mb-3">taught by {current.student_name}</p>

            <p className="text-sm text-paper-500 flex-1 line-clamp-3 mb-4">{current.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {current.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="pill-tag bg-paper-200 text-paper-500">#{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs mb-4">
              <span className="font-bold text-cherry">⭐ {current.rating}</span>
              <span className="text-paper-400">{current.sessions_taught} sessions taught</span>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => handleSwipe('left')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-50 border-2 border-paper-400 text-2xl hover:scale-110 hover:border-cherry transition-all"
        >
          ✕
        </button>
        <button
          onClick={() => handleSwipe('up')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-butter border-2 border-butter-dark text-xl hover:scale-110 transition-all"
        >
          <DoodleStar size={20} />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-cherry-50 border-2 border-cherry text-2xl hover:scale-110 transition-all"
        >
          <DoodleHeart size={24} filled color="#800020" />
        </button>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <span className="flex items-center gap-1 text-paper-400">
          <DoodleHeart size={14} filled color="#800020" /> {matches.length} matched
        </span>
        <span className="text-paper-400">✕ {passed} passed</span>
        <span className="text-paper-400">{index + 1}/{skills.length}</span>
      </div>

      {/* Match notification */}
      {direction === 'right' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-stamp-in">
          <div className="stamp text-2xl text-cherry border-cherry" style={{ fontSize: '24px' }}>
            MATCH!
          </div>
        </div>
      )}
      {direction === 'up' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-stamp-in">
          <div className="stamp text-2xl text-butter-dark border-butter-dark" style={{ fontSize: '20px' }}>
            SUPER LIKE!
          </div>
        </div>
      )}
    </div>
  );
}
