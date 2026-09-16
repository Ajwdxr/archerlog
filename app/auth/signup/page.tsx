'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-forest-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-sand-100 mb-3">Check your email</h2>
          <p className="text-sand-300/60 text-sm mb-8">
            We&apos;ve sent a confirmation link to <strong className="text-sand-300">{email}</strong>.
            Click it to activate your account.
          </p>
          <Link
            href="/auth/login"
            className="text-sand-400 hover:text-sand-300 font-medium text-sm"
          >
            Go to Sign In →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-forest-500/6 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-sand-100">
              ARROW<span className="text-sand-400">LOG</span>
            </h1>
          </Link>
          <p className="text-sand-300/60 text-sm">
            Create your organizer account
          </p>
        </div>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading || loading}
          className="flex items-center justify-center gap-3 w-full h-12 rounded-xl bg-surface border border-border-subtle text-sand-200 font-semibold text-sm hover:bg-surface-elevated hover:border-charcoal-600 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-sm mb-5"
        >
          <GoogleIcon />
          {googleLoading ? 'Redirecting to Google...' : 'Sign up with Google'}
        </button>

        {/* Divider */}
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-charcoal-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#121417] px-3 text-sand-300/40 font-semibold tracking-wider">
              Or with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <Input
            label="Display Name"
            type="text"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          {error && (
            <div className="px-4 py-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="mt-2"
          >
            CREATE ACCOUNT
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-charcoal-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-sand-400 hover:text-sand-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
