'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { updateProfile, signOutAction } from '@/lib/profile/actions';
import type { BowType } from '@/types/database';
import { User, LogOut, Check, Save } from 'lucide-react';

interface Props {
  initialProfile: {
    display_name: string;
    bow_type?: BowType | null;
  } | null;
  email?: string;
  isLoggedIn: boolean;
}

const bowOptions = [
  { value: 'Horse Bow', label: 'Horse Bow (Traditional)' },
  { value: 'Traditional Bow', label: 'Traditional Bow' },
  { value: 'Recurve', label: 'Barebow / Recurve' },
  { value: 'Longbow', label: 'Longbow' },
  { value: 'Compound', label: 'Compound Bow' },
  { value: 'Other', label: 'Other' },
];

export default function ProfileForm({ initialProfile, email, isLoggedIn }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialProfile?.display_name || '');
  const [bowType, setBowType] = useState<BowType>(initialProfile?.bow_type || 'Horse Bow');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      // Save to localStorage for guest
      localStorage.setItem('archerlog_guest_name', displayName);
      localStorage.setItem('archerlog_guest_bow', bowType);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      return;
    }

    setIsSaving(true);
    setError(null);

    const res = await updateProfile({
      display_name: displayName,
      bow_type: bowType,
    });

    setIsSaving(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    }
  };

  const handleSignOut = async () => {
    await signOutAction();
    router.push('/');
    router.refresh();
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      {error && (
        <div className="p-3.5 rounded-xl bg-danger-500/10 border border-danger-500/30 text-danger-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Profile Avatar & Identity */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-500 flex items-center justify-center text-2xl font-bold text-sand-100 shadow-md">
          {displayName ? displayName.charAt(0).toUpperCase() : <User size={24} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sand-100 text-base truncate">
            {displayName || 'Archer'}
          </p>
          <p className="text-xs text-sand-300/40 truncate">
            {email ? email : 'Guest Archer'}
          </p>
        </div>
      </div>

      {/* Display Name Input */}
      <Input
        label="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="e.g. Ajwad or Amir"
        required
      />

      {/* Preferred Bow Type */}
      <Select
        label="Preferred Bow Type"
        value={bowType}
        onChange={(e) => setBowType(e.target.value as BowType)}
        options={bowOptions}
      />

      {/* Community Info (read-only / default for v1) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-sand-300/60 uppercase tracking-wider">
          Community Affiliation
        </label>
        <div className="px-4 py-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 text-sm font-medium text-sand-200">
          Alor Setar Archery Community
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSaving}
          icon={saved ? <Check size={18} /> : <Save size={18} />}
        >
          {saved ? 'CHANGES SAVED ✓' : 'SAVE PROFILE'}
        </Button>
      </div>

      {/* Log Out Button if logged in */}
      {isLoggedIn && (
        <div className="pt-4 border-t border-charcoal-800">
          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth
            onClick={handleSignOut}
            icon={<LogOut size={16} />}
            className="text-danger-400 hover:text-danger-400 hover:bg-danger-500/10"
          >
            Sign Out
          </Button>
        </div>
      )}
    </form>
  );
}
