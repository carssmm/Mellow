'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch failed')) {
          setError('Connection failed: Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your Vercel Project Settings and trigger a Redeploy.');
        } else {
          setError(error.message);
        }
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      if (msg.includes('Failed to fetch') || msg.includes('fetch failed')) {
        setError('Connection failed: Please ensure NEXT_PUBLIC_SUPABASE_URL is set in Vercel Project Settings and trigger a Redeploy.');
      } else {
        setError(msg);
      }
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full max-w-[480px] relative">
      {/* Decorative Blob */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-surface-container-low rounded-full opacity-50 blur-2xl -z-10 pointer-events-none"></div>
      
      <div className="bg-surface-container-lowest border border-[#E6E1DA] rounded-[16px] p-8 md:p-10 shadow-ambient">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/login.png"
            alt="Login Logo"
            className="w-full max-w-[320px] md:max-w-[420px] h-auto object-contain mb-2 drop-shadow-md"
          />
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-label-md text-on-surface-variant" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70">
                mail
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-[52px] pl-12 pr-4 bg-[#FAFAFA] border border-transparent focus:border-[#D4A359] focus:bg-white rounded-[10px] outline-none transition-colors text-body-md"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-label-md text-on-surface-variant" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-[52px] pl-12 pr-12 bg-[#FAFAFA] border border-transparent focus:border-[#D4A359] focus:bg-white rounded-[10px] outline-none transition-colors text-body-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-on-surface focus:outline-none flex items-center justify-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="text-error text-label-md pt-1">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] mt-2 bg-primary-container hover:bg-primary-container/90 text-surface-container-lowest rounded-[10px] font-nav-link flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <>
                Sign In to Dashboard
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
          <p className="text-[13px] text-on-surface-variant/70 font-body-md">
            Protected single-user access • Mellow Café ☕
          </p>
        </div>
      </div>
    </div>
  );
}
