'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLoader,
} from 'react-icons/fi';
import { createClient } from '@/app/lib/client';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      /*
       * IMPORTANT:
       *
       * Create the Supabase browser client only when the
       * user actually submits the login form.
       *
       * Do NOT create it at component render time.
       */
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please try again.'
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">

        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Subtle glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/[0.035] blur-[120px]" />

        <div className="relative z-10 w-full max-w-[400px]">

          {/* Logo */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
              AA
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Sign in to your dashboard
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-white/[0.09] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-zinc-500 transition hover:text-yellow-400"
                    onClick={() => {
                      // Password reset will be implemented later.
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-white/[0.09] bg-black/20 px-4 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-zinc-500 transition hover:text-zinc-200"
                  >
                    {showPassword ? (
                      <FiEyeOff size={17} />
                    ) : (
                      <FiEye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 text-sm font-semibold text-black transition hover:bg-yellow-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <FiLoader
                      className="animate-spin"
                      size={17}
                    />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>

          {/* Back to portfolio */}
          <div className="mt-7 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-yellow-400"
            >
              <FiArrowLeft size={15} />
              Back to portfolio
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-10 text-center text-[11px] tracking-wide text-zinc-700">
            SHINA ADEKOKUN · ADMIN
          </p>
        </div>
      </div>
    </main>
  );
}