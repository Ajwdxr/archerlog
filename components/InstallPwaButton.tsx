'use client';

import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Smartphone } from 'lucide-react';
import InstallPwaModal from './InstallPwaModal';

interface InstallPwaButtonProps {
  variant?: 'primary' | 'secondary' | 'compact';
  className?: string;
  showText?: boolean;
}

export default function InstallPwaButton({
  variant = 'secondary',
  className = '',
  showText = true,
}: InstallPwaButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Listen for beforeinstallprompt event (Chromium browsers)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsStandalone(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
        setIsModalOpen(true);
      }
    } else {
      // If iOS, desktop without prompt, or already installed, open instructions modal
      setIsModalOpen(true);
    }
  };

  const triggerDirectInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsStandalone(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }
  };

  // Compact badge style (e.g. for header or profile)
  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
            bg-charcoal-800/80 border border-charcoal-700
            text-xs font-semibold text-sand-300 hover:text-sand-100 hover:bg-charcoal-700
            active:scale-[0.97] transition-all
            ${className}
          `}
          title={isStandalone ? 'Aplikasi Dipasang' : 'Pasang PWA'}
        >
          {isStandalone ? (
            <>
              <CheckCircle2 size={14} className="text-forest-400" />
              {showText && <span>Aplikasi Dipasang</span>}
            </>
          ) : (
            <>
              <Download size={14} className="text-sand-400" />
              {showText && <span>Pasang PWA</span>}
            </>
          )}
        </button>

        <InstallPwaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isIOS={isIOS}
          isStandalone={isStandalone}
          onTriggerInstall={triggerDirectInstall}
          canInstallDirectly={Boolean(deferredPrompt)}
        />
      </>
    );
  }

  // Full action button
  return (
    <>
      <button
        onClick={handleClick}
        className={`
          flex items-center justify-center gap-2 h-14 rounded-2xl
          font-semibold text-base transition-all duration-200
          active:scale-[0.98]
          ${
            isStandalone
              ? 'bg-charcoal-850 border border-forest-500/40 text-sand-200 hover:bg-charcoal-800'
              : variant === 'primary'
              ? 'bg-gradient-to-r from-forest-500 to-forest-400 text-sand-100 shadow-lg shadow-forest-500/25 hover:shadow-forest-500/40 hover:scale-[1.02]'
              : 'bg-charcoal-800 border border-charcoal-700 text-sand-300 hover:bg-charcoal-700 hover:border-charcoal-600 hover:text-sand-100'
          }
          ${className}
        `}
      >
        {isStandalone ? (
          <>
            <CheckCircle2 size={19} className="text-forest-400 shrink-0" />
            <span>Aplikasi Dipasang (PWA)</span>
          </>
        ) : (
          <>
            <Download size={19} className="text-sand-400 shrink-0" />
            <span>Pasang Aplikasi (PWA)</span>
          </>
        )}
      </button>

      <InstallPwaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isIOS={isIOS}
        isStandalone={isStandalone}
        onTriggerInstall={triggerDirectInstall}
        canInstallDirectly={Boolean(deferredPrompt)}
      />
    </>
  );
}
