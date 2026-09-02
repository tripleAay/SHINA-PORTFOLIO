'use client';

import { FormEvent, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '@/app/contexts/ThemeContext';
import { createClient } from '@/app/lib/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const { lightMode } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      // IMPORTANT:
      // Create the Supabase client only when the user submits the form.
      // Do NOT create it at component render time.
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error('Admin login error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-500 ${
        lightMode
          ? 'bg-[#f7f3ec] text-zinc-900'
          : 'bg-zinc-950 text-zinc-100'
      }`}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border text-sm font-semibold tracking-tight transition-colors ${
              lightMode
                ? 'border-zinc-300 bg-white text-zinc-900'
                : 'border-zinc-800 bg-zinc-900 text-white'
            }`}
          >
            AA
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Login
          </h1>

          <p
            className={`mt-2 text-sm ${
              lightMode ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            Sign in to manage your portfolio.
          </p>
        </div>

        {/* Login Card */}
        <div
          className={`rounded-2xl border p-6 shadow-xl transition-colors duration-500 ${
            lightMode
              ? 'border-zinc-200 bg-white'
              : 'border-zinc-800 bg-zinc-900/80'
          }`}
        >
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className={`mb-2 block text-sm font-medium ${
                  lightMode ? 'text-zinc-700' : 'text-zinc-300'
                }`}
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${
                  lightMode
                    ? 'border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20'
                    : 'border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                } ${loading ? 'cursor-not-allowed opacity-60' : ''}`}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className={`mb-2 block text-sm font-medium ${
                  lightMode ? 'text-zinc-700' : 'text-zinc-300'
                }`}
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${
                  lightMode
                    ? 'border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20'
                    : 'border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                } ${loading ? 'cursor-not-allowed opacity-60' : ''}`}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className={`rounded-xl border px-4 py-3 text-sm ${
                  lightMode
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-red-900/50 bg-red-950/30 text-red-400'
                }`}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                loading
                  ? 'cursor-not-allowed opacity-60'
                  : 'hover:-translate-y-0.5 hover:shadow-lg'
              } bg-yellow-400 text-zinc-950 hover:bg-yellow-300`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          className={`mt-6 text-center text-xs ${
            lightMode ? 'text-zinc-400' : 'text-zinc-600'
          }`}
        >
          Shina Adedokun · Portfolio Administration
        </p>
      </div>
    </main>
  );
}