import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProfileForm from './ProfileForm';
import BottomNav from '@/components/ui/BottomNav';
import Button from '@/components/ui/Button';
import { ArrowLeft, User, LogIn, Trophy } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    profile = data as any;
  }

  return (
    <main className="min-h-dvh pb-28 pt-4 px-4 max-w-lg mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <Link
          href={user ? '/dashboard' : '/'}
          className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-sand-300 hover:bg-charcoal-700 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-lg font-bold text-sand-100 flex items-center gap-2">
          <User size={18} className="text-sand-400" />
          Archer Profile
        </h1>
        <div className="w-10" />
      </div>

      {!user && (
        <div className="mb-6 p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-sand-200">Not signed in</p>
            <p className="text-[11px] text-sand-300/40">Sign in to save scores to your cloud account</p>
          </div>
          <Link href="/auth/login">
            <Button variant="secondary" size="sm" icon={<LogIn size={14} />}>
              Log In
            </Button>
          </Link>
        </div>
      )}

      {/* Profile Form */}
      <ProfileForm
        initialProfile={profile}
        email={user?.email}
        isLoggedIn={!!user}
      />

      <BottomNav role={user ? 'organizer' : 'archer'} />
    </main>
  );
}
