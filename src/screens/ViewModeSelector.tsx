import { useState } from 'react';
import type { ViewMode } from '@/lib/constants';
import { DoodleStar, DoodleSparkle, DoodleFlower, TapeStrip } from '@/components/Doodles';

interface ViewModeSelectorProps {
  onSelect: (mode: ViewMode) => void;
}

export default function ViewModeSelector({ onSelect }: ViewModeSelectorProps) {
  const [hovered, setHovered] = useState<ViewMode | null>(null);

  return (
    <div className="paper-texture min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <DoodleStar className="absolute top-12 left-12 animate-float-slow" size={36} />
      <DoodleFlower className="absolute bottom-16 right-16 animate-float" size={44} />
      <DoodleSparkle className="absolute top-24 right-20 animate-float" size={24} />

      <div className="halftone-bg-light absolute inset-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cherry text-white text-3xl mb-3 sticker animate-bounce-soft">
            👋
          </div>
          <h1 className="font-display text-4xl font-bold text-cherry">Welcome to SkillSwap!</h1>
          <p className="text-sm text-paper-500 mt-2">Pick how you'd like to explore your campus skill community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Desktop */}
          <button
            onClick={() => onSelect('desktop')}
            onMouseEnter={() => setHovered('desktop')}
            onMouseLeave={() => setHovered(null)}
            className="paper-card p-6 text-left transition-all hover:translate-y-[-4px] hover:rotate-[-1deg] relative group animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <TapeStrip className="-top-3 left-1/2 -translate-x-1/2" />

            <div className="mb-4 rounded-xl overflow-hidden border-2 border-paper-300 bg-paper-200 p-3 h-32 flex items-center justify-center">
              {/* Mini desktop layout preview */}
              <div className="flex gap-1.5 w-full h-full">
                <div className="w-1/5 bg-cherry rounded-lg flex items-center justify-center text-white text-xs">📋</div>
                <div className="flex-1 grid grid-cols-2 gap-1.5">
                  <div className="bg-mint rounded-lg" />
                  <div className="bg-lavender rounded-lg" />
                  <div className="bg-butter rounded-lg" />
                  <div className="bg-cherry-50 rounded-lg" />
                </div>
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold text-cherry">Desktop Visual Workspace</h2>
            <p className="text-sm text-paper-500 mt-1">
              Spacious multi-column editorial grid with a left sidebar for navigating between all your tools.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill-tag bg-mint-light text-green-800 border border-mint-dark">Multi-column grid</span>
              <span className="pill-tag bg-lavender-light text-purple-800 border border-lavender-dark">Sidebar nav</span>
            </div>

            <div className={`mt-4 text-sm font-bold transition-all ${hovered === 'desktop' ? 'text-cherry translate-x-1' : 'text-paper-400'}`}>
              Select this view →
            </div>
          </button>

          {/* Mobile */}
          <button
            onClick={() => onSelect('mobile')}
            onMouseEnter={() => setHovered('mobile')}
            onMouseLeave={() => setHovered(null)}
            className="paper-card p-6 text-left transition-all hover:translate-y-[-4px] hover:rotate-[1deg] relative group animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <TapeStrip className="-top-3 left-1/2 -translate-x-1/2" style={{ background: 'rgba(200, 230, 213, 0.6)' }} />

            <div className="mb-4 rounded-xl overflow-hidden border-2 border-paper-300 bg-paper-200 p-3 h-32 flex items-center justify-center">
              {/* Mini mobile layout preview */}
              <div className="flex flex-col gap-1.5 w-20 h-full">
                <div className="flex-1 bg-butter rounded-lg" />
                <div className="flex-1 bg-cherry-50 rounded-lg" />
                <div className="flex gap-1 h-5">
                  <div className="flex-1 bg-cherry rounded-lg" />
                  <div className="flex-1 bg-mint rounded-lg" />
                  <div className="flex-1 bg-lavender rounded-lg" />
                  <div className="flex-1 bg-butter rounded-lg" />
                </div>
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold text-cherry">Mobile Pinterest Feed</h2>
            <p className="text-sm text-paper-500 mt-1">
              Touch-first layout with bottom tab navigation, compact action sheets, and full-bleed visual cards.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill-tag bg-butter-light text-yellow-800 border border-butter-dark">Bottom tab nav</span>
              <span className="pill-tag bg-cherry-50 text-cherry border border-cherry-200">Full-bleed cards</span>
            </div>

            <div className={`mt-4 text-sm font-bold transition-all ${hovered === 'mobile' ? 'text-cherry translate-x-1' : 'text-paper-400'}`}>
              Select this view →
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-paper-400 mt-6 animate-fade-in">
          You can switch between views anytime from the top bar. ✨
        </p>
      </div>
    </div>
  );
}
