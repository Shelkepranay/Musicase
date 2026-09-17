import React, { useState } from 'react';
import { DownloadCloud, Smartphone, Check, X, Share2, PlusSquare, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If already running in standalone mode, suppress
  if (isInstalled && !installedSuccess) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 4000);
      }
    } else {
      // Show guided prompt modal (especially useful for iOS Safari or within iframe)
      setShowGuide(true);
    }
  };

  if (installedSuccess) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
        <Check className="w-3.5 h-3.5" />
        <span>Installed!</span>
      </div>
    );
  }

  const isSidebar = variant === 'sidebar';

  return (
    <>
      <button
        id="pwa-install-button"
        onClick={handleInstallClick}
        title="Install Music Player as Progressive Web App"
        aria-label="Install App as PWA"
        className={
          className ||
          (isSidebar
            ? 'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/15 via-emerald-500/15 to-transparent text-cyan-300 hover:text-white hover:from-cyan-500/25 border border-cyan-500/30 text-xs font-bold transition-all group shadow-sm min-h-[44px]'
            : 'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white text-xs font-semibold border border-cyan-500/30 transition-all min-h-[36px] shrink-0')
        }
      >
        <DownloadCloud className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span className="whitespace-nowrap">Install App</span>
        {isSidebar && (
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-mono">
            PWA
          </span>
        )}
      </button>

      {/* Guided Installation Modal (for iOS or non-automated prompt environments) */}
      {showGuide && (
        <div
          id="pwa-install-guide-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#12141a] border border-cyan-500/30 p-5 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-white select-none space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 p-0.5 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Install Music8D</h3>
                  <p className="text-[11px] text-zinc-400">Offline & Fast Audio PWA</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-3 bg-zinc-900/60 rounded-xl p-3.5 border border-white/5 text-xs text-zinc-300">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      Tap the <strong className="text-white">Share</strong> button in Safari's bottom toolbar.
                      <div className="inline-flex items-center gap-1 text-[11px] text-cyan-400 mt-0.5">
                        <Share2 className="w-3.5 h-3.5" /> (Square with arrow up)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.
                      <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-0.5">
                        <PlusSquare className="w-3.5 h-3.5" /> Quick Home Icon
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      If using Chrome or Edge, click the <strong className="text-white">Install</strong> icon in the address bar (or menu &gt; Install App).
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      Enjoy standalone offline playback, full lock-screen controls, and 8D spatial audio!
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Features badge list */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 font-medium">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero Browser Bars</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Offline MP3 Access</span>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
