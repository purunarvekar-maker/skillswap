export type TabId =
  | 'home'
  | 'discover'
  | 'skillswipe'
  | 'learning'
  | 'community'
  | 'events'
  | 'chat'
  | 'toolkit'
  | 'calendar'
  | 'notes'
  | 'progress'
  | 'profile'
  | 'archive';

export type ViewMode = 'desktop' | 'mobile';

export interface DemoUser {
  username: string;
  fullName: string;
  bio: string;
  school: string;
  year: string;
  guild: string;
  avatarEmoji: string;
  coverColor: string;
  skillsOffered: string[];
  skillsWanted: string[];
  badges: string[];
  streak: number;
  totalSessions: number;
  rating: number;
}

export const DEMO_USER: DemoUser = {
  username: 'poorva.n',
  fullName: 'Poorva Narvekar',
  bio: 'Senior at the Design & Engineering Guild. Passionate about blending traditional art with digital tools. Always learning, always sharing!',
  school: 'Creative Arts University',
  year: 'Senior',
  guild: 'Design & Engineering Guild',
  avatarEmoji: '✨',
  coverColor: '#800020',
  skillsOffered: ['UI/UX Design', 'Brand Identity', 'Watercolor', 'Sketching'],
  skillsWanted: ['Film Photography', 'Sourdough Baking', 'Game Design'],
  badges: ['Top Mentor', '30-Day Streak', 'Community Builder', 'Fast Learner'],
  streak: 34,
  totalSessions: 47,
  rating: 4.9,
};

export const NAV_ITEMS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'home', label: 'Home', emoji: '🏡' },
  { id: 'discover', label: 'Discover', emoji: '🧭' },
  { id: 'skillswipe', label: 'SkillSwipe', emoji: '🎴' },
  { id: 'learning', label: 'Learning', emoji: '📚' },
  { id: 'community', label: 'Community', emoji: '💬' },
  { id: 'events', label: 'Events', emoji: '📌' },
  { id: 'chat', label: 'Chat', emoji: '💭' },
  { id: 'toolkit', label: 'Toolkit', emoji: '🧰' },
  { id: 'calendar', label: 'Calendar', emoji: '🗓️' },
  { id: 'notes', label: 'Notes', emoji: '📝' },
  { id: 'progress', label: 'Progress', emoji: '📊' },
  { id: 'profile', label: 'Profile', emoji: '🪪' },
  { id: 'archive', label: 'Archive', emoji: '🗄️' },
];

export const SKILL_CATEGORIES = [
  'Visual Arts',
  'Music',
  'Photography',
  'Culinary',
  'Technology',
  'Wellness',
  'Language',
  'Performance',
  'Life Skills',
];

export const NOTE_COLORS = ['#FFF9E6', '#E8F5EF', '#F0EBF7', '#FFE5EB', '#FFFDF5'];
