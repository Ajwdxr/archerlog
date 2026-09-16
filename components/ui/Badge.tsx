import React from 'react';
import type { SessionStatus } from '@/types/database';

interface BadgeProps {
  status: SessionStatus;
  className?: string;
}

const statusConfig: Record<SessionStatus, { label: string; className: string; dot?: boolean }> = {
  draft: { label: 'Draft', className: 'badge-draft' },
  open: { label: 'Open', className: 'badge-open' },
  live: { label: 'Live', className: 'badge-live', dot: true },
  completed: { label: 'Completed', className: 'badge-completed' },
  cancelled: { label: 'Cancelled', className: 'badge-cancelled' },
};

export default function Badge({ status, className = '' }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        text-xs font-semibold uppercase tracking-wider rounded-full
        ${config.className}
        ${className}
      `}
    >
      {config.dot && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {config.label}
    </span>
  );
}
