import { submitEnd } from '@/lib/scoring/actions';
import type { ArrowScore } from '@/types/database';

export interface QueuedEnd {
  id: string;
  session_id: string;
  session_archer_id: string;
  end_number: number;
  arrows: ArrowScore[];
  timestamp: number;
}

const STORAGE_KEY = 'arrowlog_offline_queue';

export function getOfflineQueue(): QueuedEnd[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToOfflineQueue(item: Omit<QueuedEnd, 'id' | 'timestamp'>) {
  const queue = getOfflineQueue();
  const newItem: QueuedEnd = {
    ...item,
    id: `${item.session_archer_id}_end_${item.end_number}_${Date.now()}`,
    timestamp: Date.now(),
  };
  queue.push(newItem);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.warn('Failed to save to localStorage', e);
  }
  return newItem;
}

export async function flushOfflineQueue(
  onSynced?: (endNumber: number) => void
): Promise<{ synced: number; failed: number }> {
  if (typeof window === 'undefined' || !navigator.onLine) return { synced: 0, failed: 0 };
  const queue = getOfflineQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  const remaining: QueuedEnd[] = [];
  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      const res = await submitEnd({
        session_id: item.session_id,
        session_archer_id: item.session_archer_id,
        end_number: item.end_number,
        arrows: item.arrows,
      });

      if (!res.error || res.error.includes('already been submitted')) {
        synced++;
        if (onSynced) onSynced(item.end_number);
      } else {
        remaining.push(item);
        failed++;
      }
    } catch {
      remaining.push(item);
      failed++;
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  } catch {
    // ignore
  }

  return { synced, failed };
}
