'use server';

import { createClient } from '@/lib/supabase/server';
import type { BowType } from '@/types/database';

export async function updateProfile(data: {
  display_name: string;
  bow_type?: BowType | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      display_name: data.display_name,
      bow_type: data.bow_type || null,
    } as any);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
