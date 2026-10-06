import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DEMO_USER } from '@/lib/constants';
import { DoodleCat, DoodleStar, DoodleFlower, DoodleSparkle, DoodleHeart, TapeStrip } from '@/components/Doodles';

interface LoginScreenProps {
  onLoggedIn: () => void;
}

export default function LoginScreen({ onLoggedIn }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const email = username.includes('@') ? username : `${username}@skillswap.edu`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        onLoggedIn();
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError('Invalid credentials. Try the 1-Click Demo Login below!');
        setLoading(false);
        return;
      }
      onLoggedIn();
    }
  }

  async function handleDemoLogin() {
    setError('');
    setLoading(true);

    const demoEmail = `${DEMO_USER.username}@skillswap.edu`;
    const demoPassword = 'skillswapdemo2026';

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    if (signInError) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
      });
      if (signUpError) {
        setError('Could not start demo session. Please try again.');
        setLoading(false);
        return;
      }
    }

    onLoggedIn();
  }

  return (
    <div className="paper-texture min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating doodles */}
      <DoodleStar className="absolute top-10 left-10 animate-float-slow" size={40} />
      <DoodleFlower className="absolute top-20 right-16 animate-float" size={50} />
      <DoodleSparkle className="absolute bottom-20 left-20 animate-float-slow" size={28} />
      <DoodleHeart className="absolute bottom-32 right-12 animate-float" size={24} filled color="#800020" />
      <DoodleCat className="absolute bottom-4 right-4 animate-float-slow opacity-30" size={80} />

      <div className="halftone-bg-light absolute inset-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="paper-card p-8 relative animate-pop-in" style={{ transform: 'rotate(-1deg)' }}>
          <TapeStrip className="-top-3 left-6" style={{ transform: 'rotate(-8deg)' }} />
          <TapeStrip className="-top-3 right-6" style={{ transform: 'rotate(6deg)', background: 'rgba(200, 230, 213, 0.6)' }} />

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cherry text-white text-4xl mb-3 sticker animate-bounce-soft">
              🎴
            </div>
            <h1 className="font-display text-5xl font-bold text-cherry">SkillSwap</h1>
            <p className="text-sm text-paper-500 mt-1">Trade skills, not grades. Learn together. 🌱</p>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-5 p-1 bg-paper-200 rounded-xl">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'login' ? 'bg-cherry text-white shadow-md' : 'text-paper-500'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'signup' ? 'bg-cherry text-white shadow-md' : 'text-paper-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-paper-500 uppercase tracking-wide mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                className="w-full px-4 py-3 rounded-xl border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-paper-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none transition-colors text-sm"
              />
            </div>

            {error && (
              <div className="text-xs text-cherry-700 bg-cherry-50 border border-cherry-100 rounded-lg px-3 py-2 animate-slide-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'One sec...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-paper-300" />
            <span className="text-xs text-paper-400 font-bold uppercase">or</span>
            <div className="flex-1 h-px bg-paper-300" />
          </div>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-butter border-2 border-butter-dark text-cherry-800 font-bold text-sm transition-all hover:translate-y-[-1px] hover:shadow-lg disabled:opacity-50 relative overflow-hidden group"
          >
            <span className="flex items-center justify-center gap-2">
              <DoodleSparkle size={18} />
              1-Click Demo Login
              <DoodleSparkle size={18} />
            </span>
            <span className="block text-xs font-medium mt-0.5 text-cherry-600">
              as Poorva Narvekar · Senior @ Design & Engineering Guild
            </span>
          </button>

          <p className="text-center text-xs text-paper-400 mt-4">
            By continuing, you agree to be awesome and kind. 💜
          </p>
        </div>
      </div>
    </div>
  );
}
