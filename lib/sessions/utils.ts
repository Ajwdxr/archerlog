/**
 * Generate a random alphanumeric join code for sessions.
 * Uses uppercase letters + digits, avoiding confusable characters (0/O, 1/I/L).
 */
export function generateJoinCode(length: number = 6): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  const array = new Uint8Array(length);
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without Web Crypto
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  for (let i = 0; i < length; i++) {
    code += chars[array[i] % chars.length];
  }
  return code;
}

/**
 * Build the full join URL for a session.
 */
export function getJoinUrl(joinCode: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${base}/join/${joinCode}`;
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-MY', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time string for display (HH:MM).
 */
export function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';
  // Handles both "HH:MM:SS" and "HH:MM" formats
  const parts = timeStr.split(':');
  return `${parts[0]}:${parts[1]}`;
}
