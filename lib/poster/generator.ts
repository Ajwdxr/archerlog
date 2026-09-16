import type { IndividualCardData, SessionPosterData } from './share';
import { getMedalEmoji, getOrdinal } from '@/lib/ranking/service';

/**
 * Render 1080x1080 Square Individual Result Card onto a canvas element
 */
export function renderIndividualCard(
  canvas: HTMLCanvasElement,
  data: IndividualCardData,
  theme: 'dark' | 'forest' = 'dark'
) {
  const size = 1080;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  if (theme === 'forest') {
    bgGrad.addColorStop(0, '#0a1509');
    bgGrad.addColorStop(0.5, '#142b12');
    bgGrad.addColorStop(1, '#0d0d0d');
  } else {
    bgGrad.addColorStop(0, '#161616');
    bgGrad.addColorStop(0.4, '#111111');
    bgGrad.addColorStop(1, '#0a0a0a');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Concentric target ring background graphics (subtle watermark)
  ctx.save();
  ctx.strokeStyle = 'rgba(196, 167, 125, 0.05)';
  ctx.lineWidth = 1.5;
  const centerX = size / 2;
  const centerY = 520;
  for (let r = 80; r <= 480; r += 70) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Subtle crosshairs
  ctx.beginPath();
  ctx.moveTo(centerX - 500, centerY);
  ctx.lineTo(centerX + 500, centerY);
  ctx.moveTo(centerX, centerY - 500);
  ctx.lineTo(centerX, centerY + 500);
  ctx.strokeStyle = 'rgba(196, 167, 125, 0.03)';
  ctx.stroke();
  ctx.restore();

  // Outer border with bronze/sand corner accents
  ctx.strokeStyle = 'rgba(196, 167, 125, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, size - 80, size - 80);

  // Inner decorative border
  ctx.strokeStyle = 'rgba(196, 167, 125, 0.12)';
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, size - 104, size - 104);

  // Top header: Brand
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c4a77d';
  ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('🏹  A R R O W L O G', size / 2, 105);

  // Session Name
  ctx.fillStyle = '#f5f0e8';
  ctx.font = '800 38px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  const displaySession = (data.sessionName || 'ARCHERY SESSION').toUpperCase();
  ctx.fillText(displaySession, size / 2, 165);

  // Venue / Date subtitle
  if (data.venue || data.sessionDate) {
    const subtitle = [data.venue, data.sessionDate].filter(Boolean).join('  ·  ');
    ctx.fillStyle = 'rgba(212, 196, 168, 0.6)';
    ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(subtitle, size / 2, 205);
  }

  // Divider line
  ctx.strokeStyle = 'rgba(196, 167, 125, 0.2)';
  ctx.beginPath();
  ctx.moveTo(size / 2 - 120, 240);
  ctx.lineTo(size / 2 + 120, 240);
  ctx.stroke();

  // Archer Display Name
  ctx.fillStyle = '#f5f0e8';
  ctx.font = '800 52px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(data.archerName.toUpperCase(), size / 2, 330);

  // Large Hero Score
  const scoreGrad = ctx.createLinearGradient(0, 390, 0, 520);
  scoreGrad.addColorStop(0, '#ffd700');
  scoreGrad.addColorStop(0.5, '#f5f0e8');
  scoreGrad.addColorStop(1, '#c4a77d');
  ctx.fillStyle = scoreGrad;
  ctx.font = '900 148px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '-2px';
  ctx.fillText(String(data.totalScore), size / 2, 490);

  ctx.fillStyle = 'rgba(196, 167, 125, 0.8)';
  ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('POINTS', size / 2, 530);

  // Rank Badge (Pill)
  const medal = getMedalEmoji(data.rank);
  const ordinal = getOrdinal(data.rank);
  const rankText = `${medal ? `${medal}  ` : ''}${ordinal.toUpperCase()} PLACE`;

  ctx.save();
  const badgeWidth = 320;
  const badgeHeight = 56;
  const badgeX = (size - badgeWidth) / 2;
  const badgeY = 575;

  ctx.fillStyle = 'rgba(45, 90, 39, 0.35)';
  ctx.strokeStyle = '#3d7a36';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f5f0e8';
  ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(rankText, size / 2, badgeY + 36);
  ctx.restore();

  // 3-Column Stats Grid (Arrows, Average, Bow)
  const statBoxY = 675;
  const statBoxHeight = 130;
  const colWidth = 270;
  const startX = (size - colWidth * 3 - 40) / 2;

  const stats = [
    { label: 'ARROWS', val: String(data.totalArrows) },
    { label: 'AVERAGE', val: data.average.toFixed(2) },
    { label: 'BOW TYPE', val: (data.bowType || 'Horse Bow').toUpperCase() },
  ];

  stats.forEach((st, i) => {
    const x = startX + i * (colWidth + 20);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, statBoxY, colWidth, statBoxHeight, 16);
    ctx.fill();
    ctx.stroke();

    // Value
    ctx.fillStyle = '#f5f0e8';
    ctx.font = i === 2 ? '700 24px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif' : '800 38px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(st.val, x + colWidth / 2, statBoxY + (i === 2 ? 62 : 66));

    // Label
    ctx.fillStyle = 'rgba(196, 167, 125, 0.6)';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(st.label, x + colWidth / 2, statBoxY + 104);
  });

  // Footer: Community info & Motto
  ctx.fillStyle = '#c4a77d';
  ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '4px';
  const community = data.communityName || 'ALOR SETAR ARCHERY COMMUNITY';
  ctx.fillText(community.toUpperCase(), size / 2, 940);

  ctx.fillStyle = 'rgba(245, 240, 232, 0.4)';
  ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('SHOOT. SCORE. SHARE.', size / 2, 980);
}

/**
 * Render 1080x1080 Square Session Results Poster onto a canvas element
 */
export function renderSessionPoster(
  canvas: HTMLCanvasElement,
  data: SessionPosterData,
  theme: 'dark' | 'forest' = 'dark'
) {
  const size = 1080;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  if (theme === 'forest') {
    bgGrad.addColorStop(0, '#0a1509');
    bgGrad.addColorStop(0.6, '#142b12');
    bgGrad.addColorStop(1, '#0d0d0d');
  } else {
    bgGrad.addColorStop(0, '#161616');
    bgGrad.addColorStop(0.5, '#101010');
    bgGrad.addColorStop(1, '#080808');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Target ring background accents
  ctx.save();
  ctx.strokeStyle = 'rgba(196, 167, 125, 0.04)';
  ctx.lineWidth = 1.5;
  for (let r = 100; r <= 500; r += 80) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Frames
  ctx.strokeStyle = 'rgba(196, 167, 125, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, size - 80, size - 80);

  ctx.strokeStyle = 'rgba(196, 167, 125, 0.12)';
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, size - 104, size - 104);

  // Top header: Brand
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c4a77d';
  ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('🏹  A R R O W L O G', size / 2, 95);

  // Title: Session Name
  ctx.fillStyle = '#f5f0e8';
  ctx.font = '800 42px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(data.sessionName.toUpperCase(), size / 2, 155);

  // Session details
  const details = [
    data.venue,
    data.sessionDate,
    data.bowType || 'Horse Bow',
    `${data.totalArrows} Arrows`,
  ]
    .filter(Boolean)
    .join('  ·  ');

  ctx.fillStyle = 'rgba(212, 196, 168, 0.6)';
  ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(details.toUpperCase(), size / 2, 195);

  // Badge: FINAL RESULTS
  ctx.fillStyle = 'rgba(196, 167, 125, 0.85)';
  ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('🏆  F I N A L   R E S U L T S', size / 2, 255);

  // Table header
  const tableY = 300;
  const tableX = 90;
  const tableW = size - 180;

  ctx.fillStyle = 'rgba(196, 167, 125, 0.5)';
  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'left';
  ctx.fillText('RANK', tableX + 20, tableY);
  ctx.fillText('ARCHER', tableX + 110, tableY);
  ctx.textAlign = 'right';
  ctx.fillText('AVG', tableX + tableW - 140, tableY);
  ctx.fillText('SCORE', tableX + tableW - 20, tableY);

  // Row line
  ctx.strokeStyle = 'rgba(196, 167, 125, 0.2)';
  ctx.beginPath();
  ctx.moveTo(tableX, tableY + 15);
  ctx.lineTo(tableX + tableW, tableY + 15);
  ctx.stroke();

  // Render Top 8 archers
  const maxRows = 7;
  const rowHeight = 72;
  const displayed = data.archers.slice(0, maxRows);

  displayed.forEach((archer, i) => {
    const y = tableY + 30 + i * rowHeight;
    const isTop1 = archer.rank === 1;
    const isTop3 = archer.rank <= 3;

    // Row background highlight for top 3
    if (isTop3) {
      ctx.fillStyle = isTop1 ? 'rgba(255, 215, 0, 0.08)' : 'rgba(255, 255, 255, 0.03)';
      ctx.beginPath();
      ctx.roundRect(tableX, y, tableW, rowHeight - 8, 12);
      ctx.fill();

      if (isTop1) {
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const medal = getMedalEmoji(archer.rank);

    // Rank
    ctx.textAlign = 'left';
    ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    if (medal) {
      ctx.fillText(medal, tableX + 20, y + 42);
    } else {
      ctx.fillStyle = 'rgba(245, 240, 232, 0.4)';
      ctx.fillText(String(archer.rank), tableX + 28, y + 42);
    }

    // Name
    ctx.fillStyle = isTop3 ? '#f5f0e8' : 'rgba(245, 240, 232, 0.8)';
    ctx.font = isTop3 ? '800 24px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif' : '600 22px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(archer.displayName.toUpperCase(), tableX + 110, y + 42);

    // Average
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(196, 167, 125, 0.6)';
    ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillText(archer.average.toFixed(2), tableX + tableW - 140, y + 42);

    // Total Score
    ctx.fillStyle = isTop1 ? '#ffd700' : isTop3 ? '#f5f0e8' : '#c4a77d';
    ctx.font = '800 30px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(String(archer.totalScore), tableX + tableW - 20, y + 42);
  });

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c4a77d';
  ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('SHOOT. SCORE. SHARE.', size / 2, 960);

  ctx.fillStyle = 'rgba(245, 240, 232, 0.3)';
  ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('POWERED BY ARROWLOG · WWW.ARROWLOG.APP', size / 2, 995);
}
