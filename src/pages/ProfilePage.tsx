import { DEMO_USER } from '@/lib/constants';
import { DoodleCat, DoodleStar, DoodleFlower, DoodleSparkle, DoodleHeart, TapeStrip, PillTag, ScrapbookFrame } from '@/components/Doodles';

export default function ProfilePage() {
  const skillsOffered = DEMO_USER.skillsOffered;
  const skillsWanted = DEMO_USER.skillsWanted;

  const stats = [
    { label: 'Sessions', value: DEMO_USER.totalSessions, emoji: '📚' },
    { label: 'Day Streak', value: DEMO_USER.streak, emoji: '🔥' },
    { label: 'Rating', value: DEMO_USER.rating, emoji: '⭐' },
    { label: 'Badges', value: DEMO_USER.badges.length, emoji: '🏆' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Cover + profile header */}
      <div className="paper-card overflow-hidden mb-6 relative" style={{ transform: 'rotate(-0.5deg)' }}>
        {/* Cover */}
        <div
          className="h-40 relative overflow-hidden"
          style={{ backgroundColor: DEMO_USER.coverColor }}
        >
          <div className="halftone-bg absolute inset-0 opacity-20" />
          <DoodleStar className="absolute top-4 right-8 animate-float-slow" size={30} />
          <DoodleFlower className="absolute bottom-4 left-8 animate-float" size={28} color="rgba(255,253,245,0.4)" />
          <DoodleSparkle className="absolute top-8 left-20 animate-float" size={20} />
        </div>

        {/* Profile info */}
        <div className="px-6 pb-6 relative">
          <div className="flex items-end gap-4 -mt-12 mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-butter text-5xl border-4 border-paper-50 sticker relative">
              {DEMO_USER.avatarEmoji}
              <TapeStrip className="-top-2 left-1/2 -translate-x-1/2" style={{ transform: 'rotate(-8deg)' }} />
            </div>
            <div className="flex-1 mb-2">
              <h1 className="font-display text-3xl font-bold text-cherry">{DEMO_USER.fullName}</h1>
              <p className="text-sm text-paper-500">@{DEMO_USER.username}</p>
            </div>
            <div className="stamp text-cherry border-cherry mb-2 hidden md:block">
              {DEMO_USER.year}
            </div>
          </div>

          <p className="text-sm text-paper-600 mb-4 leading-relaxed">{DEMO_USER.bio}</p>

          <div className="flex flex-wrap gap-3 mb-4 text-xs">
            <span className="flex items-center gap-1.5 text-paper-500">
              🏫 {DEMO_USER.school}
            </span>
            <span className="flex items-center gap-1.5 text-paper-500">
              🎓 {DEMO_USER.guild}
            </span>
            <span className="flex items-center gap-1.5 text-paper-500">
              📅 {DEMO_USER.year}
            </span>
          </div>

          <div className="flex gap-2">
            <button className="btn-primary text-sm">Edit Profile</button>
            <button className="btn-ghost text-sm">Share Profile</button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="paper-card p-4 text-center"
            style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
          >
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <p className="font-display text-2xl font-bold text-cherry">{stat.value}</p>
            <p className="text-xs text-paper-400 font-bold uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills offered */}
        <div className="paper-card p-5">
          <h2 className="font-display text-2xl font-bold text-cherry mb-4 flex items-center gap-2">
            <DoodleHeart size={20} filled color="#800020" /> Skills I Offer
          </h2>
          <div className="space-y-2">
            {skillsOffered.map((skill, i) => (
              <div
                key={skill}
                className="flex items-center gap-3 p-3 rounded-xl bg-mint-light border border-mint-dark"
                style={{ transform: `rotate(${i * 0.3}deg)` }}
              >
                <span className="text-xl">🎨</span>
                <span className="font-bold text-sm text-green-800 flex-1">{skill}</span>
                <span className="stamp text-[8px] text-green-700 border-green-700" style={{ fontSize: '8px' }}>TEACHING</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills wanted */}
        <div className="paper-card p-5">
          <h2 className="font-display text-2xl font-bold text-cherry mb-4 flex items-center gap-2">
            <DoodleStar size={20} /> Skills I Want
          </h2>
          <div className="space-y-2">
            {skillsWanted.map((skill, i) => (
              <div
                key={skill}
                className="flex items-center gap-3 p-3 rounded-xl bg-lavender-light border border-lavender-dark"
                style={{ transform: `rotate(${i * -0.3}deg)` }}
              >
                <span className="text-xl">🎯</span>
                <span className="font-bold text-sm text-purple-800 flex-1">{skill}</span>
                <span className="stamp text-[8px] text-purple-700 border-purple-700" style={{ fontSize: '8px' }}>LEARNING</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-6">
        <h2 className="font-display text-2xl font-bold text-cherry mb-4 flex items-center gap-2">
          🏆 Badges & Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEMO_USER.badges.map((badge, i) => (
            <ScrapbookFrame key={badge} className="p-4 text-center" rotate={i % 2 === 0 ? -1 : 1}>
              <div className="text-3xl mb-2 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                {['🏅', '🔥', '🌟', '💎'][i] || '🎖️'}
              </div>
              <p className="font-bold text-xs text-cherry">{badge}</p>
            </ScrapbookFrame>
          ))}
        </div>
      </div>

      {/* Cute footer */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3">
          <DoodleCat size={48} />
          <p className="font-display text-xl text-cherry">Thanks for being part of SkillSwap!</p>
          <DoodleSparkle size={24} />
        </div>
      </div>
    </div>
  );
}
