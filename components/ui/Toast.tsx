'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const typeStyles = {
  success: 'bg-forest-600/90 border-forest-500 text-sand-100',
  error: 'bg-danger-500/90 border-danger-400 text-white',
  info: 'bg-charcoal-800/90 border-charcoal-600 text-sand-100',
};

const typeIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export default function Toast({
  message,
  type = 'success',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-2.5 px-5 py-3
        rounded-xl border backdrop-blur-md
        shadow-lg shadow-black/30
        transition-all duration-300 ease-out
        ${typeStyles[type]}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      <span className="text-lg font-bold">{typeIcons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
