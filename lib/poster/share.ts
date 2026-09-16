import { getMedalEmoji, getOrdinal } from '@/lib/ranking/service';

export interface IndividualCardData {
  sessionName: string;
  venue?: string | null;
  sessionDate?: string;
  archerName: string;
  totalScore: number;
  rank: number;
  totalArrows: number;
  average: number;
  bowType?: string | null;
  communityName?: string | null;
}

export interface SessionPosterData {
  sessionName: string;
  venue?: string | null;
  sessionDate?: string;
  bowType?: string | null;
  endsCount: number;
  arrowsPerEnd: number;
  totalArrows: number;
  archers: {
    rank: number;
    displayName: string;
    totalScore: number;
    average: number;
  }[];
}

/**
 * Generate WhatsApp share text per PRD §59
 */
export function generateIndividualShareText(data: IndividualCardData): string {
  const medal = getMedalEmoji(data.rank);
  const ordinal = getOrdinal(data.rank);

  return [
    `🏹 *ARROWLOG RESULT*`,
    ``,
    `*${data.sessionName}*`,
    data.venue ? `📍 ${data.venue}` : '',
    ``,
    `👤 *${data.archerName}*`,
    `🎯 *${data.totalScore} Points*`,
    `${medal ? `${medal} ` : ''}${ordinal.toUpperCase()} PLACE`,
    ``,
    `🏹 ${data.bowType || 'Horse Bow'}`,
    `🔢 ${data.totalArrows} Arrows`,
    `📊 Average ${data.average.toFixed(2)}`,
    data.communityName ? `🤝 ${data.communityName}` : '',
    ``,
    `_Shoot. Score. Share._ 🎯`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Generate WhatsApp share text for full session leaderboard
 */
export function generateSessionShareText(data: SessionPosterData): string {
  const topList = data.archers
    .slice(0, 10)
    .map((a) => {
      const medal = getMedalEmoji(a.rank);
      const prefix = medal ? `${medal} ` : `${a.rank}. `;
      return `${prefix}${a.displayName} — ${a.totalScore} pts (avg ${a.average.toFixed(2)})`;
    })
    .join('\n');

  return [
    `🏹 *ARROWLOG — SESSION RESULTS*`,
    ``,
    `🏆 *${data.sessionName}*`,
    data.venue ? `📍 ${data.venue}` : '',
    data.sessionDate ? `📅 ${data.sessionDate}` : '',
    `🏹 ${data.bowType || 'Horse Bow'} · ${data.totalArrows} Arrows`,
    ``,
    `*LEADERBOARD:*`,
    topList,
    ``,
    `_Shoot. Score. Share._ 🎯`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Share image and/or text via Web Share API with clipboard and download fallbacks
 */
export async function shareResult({
  title,
  text,
  canvas,
  filename = 'arrowlog-result.png',
}: {
  title: string;
  text: string;
  canvas?: HTMLCanvasElement | null;
  filename?: string;
}): Promise<{ shared: boolean; method: 'native' | 'download' | 'clipboard' }> {
  // If canvas provided and Web Share supports files
  if (canvas && typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (blob) {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title,
            text,
            files: [file],
          });
          return { shared: true, method: 'native' };
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.warn('File share failed, falling back to download/copy', e);
      } else {
        return { shared: false, method: 'native' };
      }
    }
  }

  // If text-only native share is available
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text });
      return { shared: true, method: 'native' };
    } catch (e: any) {
      if (e.name === 'AbortError') {
        return { shared: false, method: 'native' };
      }
    }
  }

  // Fallback: download canvas if present
  if (canvas) {
    downloadCanvas(canvas, filename);
    return { shared: true, method: 'download' };
  }

  // Fallback: copy text to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return { shared: true, method: 'clipboard' };
  }

  return { shared: false, method: 'clipboard' };
}

/**
 * Download canvas as PNG file
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string = 'arrowlog-result.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
