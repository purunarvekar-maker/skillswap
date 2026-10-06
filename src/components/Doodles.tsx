import { type ReactNode } from 'react';

export function TapeStrip({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`tape-strip ${className}`}
      style={{
        transform: 'rotate(-3deg)',
        ...style,
      }}
    />
  );
}

export function DoodleCat({ className = '', size = 60 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
    >
      <path d="M15 22 L10 12 L18 20" stroke="#800020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M45 22 L50 12 L42 20" stroke="#800020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx="30" cy="35" rx="18" ry="16" stroke="#800020" strokeWidth="2" fill="#FFFDF5" />
      <circle cx="23" cy="33" r="2.5" fill="#800020" />
      <circle cx="37" cy="33" r="2.5" fill="#800020" />
      <path d="M27 40 Q30 43 33 40" stroke="#800020" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M30 40 L30 42" stroke="#800020" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 38 L12 36 M18 39 L12 39" stroke="#800020" strokeWidth="1" strokeLinecap="round" />
      <path d="M42 38 L48 36 M42 39 L48 39" stroke="#800020" strokeWidth="1" strokeLinecap="round" />
      <path d="M30 51 Q25 56 20 53 M30 51 Q35 56 40 53" stroke="#800020" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function DoodleStar({ className = '', size = 24, color = '#FFE89A' }: { className?: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z"
        fill={color}
        stroke="#800020"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleHeart({ className = '', size = 20, filled = false, color = '#800020' }: { className?: string; size?: number; filled?: boolean; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} className={className}>
      <path
        d="M12 21 C12 21 4 14 4 8.5 C4 5.5 6 3 9 3 C10.5 3 12 4 12 5.5 C12 4 13.5 3 15 3 C18 3 20 5.5 20 8.5 C20 14 12 21 12 21 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleFlower({ className = '', size = 30, color = '#D6C7E8' }: { className?: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" className={className}>
      <circle cx="15" cy="8" r="5" fill={color} stroke="#800020" strokeWidth="1.5" />
      <circle cx="22" cy="15" r="5" fill={color} stroke="#800020" strokeWidth="1.5" />
      <circle cx="15" cy="22" r="5" fill={color} stroke="#800020" strokeWidth="1.5" />
      <circle cx="8" cy="15" r="5" fill={color} stroke="#800020" strokeWidth="1.5" />
      <circle cx="15" cy="15" r="3" fill="#FFE89A" stroke="#800020" strokeWidth="1.5" />
    </svg>
  );
}

export function DoodleSparkle({ className = '', size = 20, color = '#FFE89A' }: { className?: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 1 L11.5 7 L18 8.5 L11.5 10 L10 16 L8.5 10 L2 8.5 L8.5 7 Z" fill={color} stroke="#800020" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M16 14 L16.5 16 L18.5 16.5 L16.5 17 L16 19 L15.5 17 L13.5 16.5 L15.5 16 Z" fill={color} stroke="#800020" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

export function ScrapbookFrame({
  children,
  className = '',
  rotate = 0,
  tape = false,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  tape?: boolean;
}) {
  return (
    <div
      className={`paper-card relative ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {tape && (
        <>
          <TapeStrip className="-top-3 left-1/2 -translate-x-1/2" style={{ transform: 'rotate(-3deg)' }} />
        </>
      )}
      {children}
    </div>
  );
}

export function StickerBadge({ emoji, label, className = '' }: { emoji: string; label: string; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 sticker ${className}`}>
      <span className="text-lg">{emoji}</span>
      <span className="text-xs font-bold text-cherry uppercase tracking-wide">{label}</span>
    </div>
  );
}

export function PillTag({ children, color = 'cherry', className = '' }: { children: ReactNode; color?: 'cherry' | 'mint' | 'lavender' | 'butter' | 'cream'; className?: string }) {
  const colorMap: Record<string, string> = {
    cherry: 'bg-cherry-50 text-cherry border border-cherry-200',
    mint: 'bg-mint-light text-green-800 border border-mint-dark',
    lavender: 'bg-lavender-light text-purple-800 border border-lavender-dark',
    butter: 'bg-butter-light text-yellow-800 border border-butter-dark',
    cream: 'bg-cream-dark text-yellow-900 border border-cream',
  };
  return <span className={`pill-tag ${colorMap[color]} ${className}`}>{children}</span>;
}

export function PageHeader({ title, subtitle, emoji, accent = '#800020' }: { title: string; subtitle?: string; emoji?: string; accent?: string }) {
  return (
    <div className="mb-6 flex items-end gap-4">
      <div className="relative">
        {emoji && (
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl paper-card"
            style={{ borderColor: accent + '40' }}
          >
            {emoji}
          </div>
        )}
      </div>
      <div className="flex-1">
        <h1 className="font-display text-4xl font-bold text-cherry leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-paper-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export function LoadingDoodle() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-bounce-soft">
        <DoodleCat size={80} />
      </div>
      <p className="font-display text-2xl text-cherry mt-4">Doodling up your page...</p>
    </div>
  );
}

export function EmptyState({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4 animate-float">{emoji}</div>
      <h3 className="font-display text-2xl text-cherry">{title}</h3>
      {subtitle && <p className="text-sm text-paper-500 mt-2 max-w-xs">{subtitle}</p>}
    </div>
  );
}
