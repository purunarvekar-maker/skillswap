import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { TabId, ViewMode } from '@/lib/constants';
import { DEMO_USER } from '@/lib/constants';
import { PageHeader, DoodleCat, DoodleSparkle, DoodleStar, DoodleHeart, TapeStrip, PillTag, ScrapbookFrame } from '@/components/Doodles';

interface SkillCard {
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

interface Event {
  id: string;
  title: string;
  emoji: string;
  date: string;
  color: string;
  registered: number;
  capacity: number;
}

interface Post {
  id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  likes: number;
}

export default function HomePage({ onNavigate, viewMode }: { onNavigate: (tab: TabId) => void; viewMode: ViewMode }) {
  const [skills, setSkills] = useState<SkillCard[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: skillsData }, { data: eventsData }, { data: postsData }] = await Promise.all([
        supabase.from('skills_marketplace').select('*').limit(4),
        supabase.from('events').select('*').order('date', { ascending: true }).limit(4),
        supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(3),
      ]);
      if (skillsData) setSkills(skillsData);
      if (eventsData) setEvents(eventsData);
      if (postsData) setPosts(postsData);
    })();
  }, []);

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const quickActions: { label: string; emoji: string; tab: TabId; color: string }[] = [
    { label: 'Find a Skill', emoji: '🧭', tab: 'discover', color: '#C8E6D5' },
    { label: 'SkillSwipe', emoji: '🎴', tab: 'skillswipe', color: '#FFE89A' },
    { label: 'My Sessions', emoji: '📚', tab: 'learning', color: '#D6C7E8' },
    { label: 'Community', emoji: '💬', tab: 'community', color: '#FFE5EB' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero banner */}
      <ScrapbookFrame className="p-6 mb-6 relative overflow-hidden" tape rotate={-0.5}>
        <div className="halftone-bg absolute inset-0 opacity-40" />
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <DoodleSparkle size={18} />
              <span className="text-xs font-bold uppercase tracking-widest text-cherry-600">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-cherry">
              {greeting}, {DEMO_USER.fullName.split(' ')[0]}! 🎨
            </h1>
            <p className="text-sm text-paper-500 mt-2 max-w-md">
              You're on a <span className="font-bold text-cherry">{DEMO_USER.streak}-day streak</span>! Keep the momentum going — your next skill exchange is just a swipe away.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <PillTag color="cherry">🔥 {DEMO_USER.streak} day streak</PillTag>
              <PillTag color="mint">📚 {DEMO_USER.totalSessions} sessions</PillTag>
              <PillTag color="butter">⭐ {DEMO_USER.rating} rating</PillTag>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="animate-float">
              <DoodleCat size={90} />
            </div>
          </div>
        </div>
      </ScrapbookFrame>

      {/* Quick actions */}
      <div className={`grid gap-3 mb-6 ${viewMode === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {quickActions.map((action, i) => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.tab)}
            className="paper-card paper-card-hover p-4 text-left relative"
            style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl" style={{ backgroundColor: action.color + '80' }}>
                {action.emoji}
              </div>
              <span className="font-bold text-sm text-cherry">{action.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className={`grid gap-6 ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
        {/* Trending skills */}
        <div className={viewMode === 'mobile' ? '' : 'col-span-2'}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-bold text-cherry flex items-center gap-2">
              <DoodleStar size={20} /> Trending Skills
            </h2>
            <button onClick={() => onNavigate('discover')} className="text-xs font-bold text-cherry hover:underline">
              See all →
            </button>
          </div>
          <div className={`grid gap-4 ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {skills.map((skill, i) => (
              <button
                key={skill.id}
                onClick={() => onNavigate('skillswipe')}
                className="paper-card paper-card-hover p-4 text-left relative"
                style={{ transform: `rotate(${i % 2 === 0 ? 0.5 : -0.5}deg)` }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl bg-paper-200">
                    {skill.student_avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-cherry truncate">{skill.skill_name}</h3>
                    <p className="text-xs text-paper-400">by {skill.student_name}</p>
                  </div>
                </div>
                <p className="text-xs text-paper-500 line-clamp-2 mb-3">{skill.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {skill.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="pill-tag bg-paper-200 text-paper-500">#{tag}</span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-cherry flex items-center gap-1">
                    <DoodleHeart size={12} filled color={skill.color} /> {skill.sessions_taught}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar: events + posts */}
        <div className="space-y-6">
          {/* Upcoming events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold text-cherry flex items-center gap-2">
                📌 Soon
              </h2>
              <button onClick={() => onNavigate('events')} className="text-xs font-bold text-cherry hover:underline">
                All →
              </button>
            </div>
            <div className="space-y-2">
              {events.map((event, i) => {
                const eventDate = new Date(event.date);
                return (
                  <button
                    key={event.id}
                    onClick={() => onNavigate('events')}
                    className="paper-card paper-card-hover p-3 w-full text-left flex items-center gap-3"
                    style={{ transform: `rotate(${i % 2 === 0 ? -0.3 : 0.3}deg)` }}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-white font-bold" style={{ backgroundColor: event.color }}>
                      <span className="text-[10px] uppercase">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-base leading-none">{eventDate.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-cherry truncate">{event.emoji} {event.title}</p>
                      <p className="text-[10px] text-paper-400">{event.registered}/{event.capacity} registered</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Community buzz */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold text-cherry flex items-center gap-2">
                💬 Buzz
              </h2>
              <button onClick={() => onNavigate('community')} className="text-xs font-bold text-cherry hover:underline">
                More →
              </button>
            </div>
            <div className="space-y-2">
              {posts.map((post) => (
                <div key={post.id} className="paper-card p-3" style={{ transform: 'rotate(-0.3deg)' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{post.author_avatar}</span>
                    <span className="text-xs font-bold text-cherry">{post.author_name}</span>
                  </div>
                  <p className="text-xs text-paper-500 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-paper-400">
                    <DoodleHeart size={12} filled color="#800020" /> {post.likes} likes
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
