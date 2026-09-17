import React, { useState } from 'react';
import {
  Smartphone,
  Check,
  Copy,
  DownloadCloud,
  Terminal,
  X,
  Sparkles,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidAppModal: React.FC<AndroidAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, install } = usePWAInstall();
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
      }
    }
  };

  const copyBuildCommand = () => {
    navigator.clipboard.writeText('npm run build && npx cap sync android');
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2500);
  };

  return (
    <div
      id="android-app-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        id="android-app-modal-card"
        className="w-full max-w-lg rounded-2xl bg-[#0f1117] border border-emerald-500/30 p-5 sm:p-6 shadow-[0_0_60px_rgba(16,185,129,0.25)] text-white space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Music8D Android App
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">
                  Ready
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Native Android project &amp; standalone WebAPK support
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Native MediaSession</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Lock screen scrubber &amp; notification drawer controls with album art.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Hardware Back Button</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Android back button closes modals and navigates tabs naturally.
            </p>
          </div>
        </div>

        {/* Section 1: 1-Tap Android Install */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-cyan-500/10 border border-emerald-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Option 1: 1-Tap Install (WebAPK)
              </h4>
            </div>
          </div>
          <p className="text-xs text-zinc-300">
            Install directly on any Android device via Chrome, Brave, or Samsung Internet.
            Adds a native app icon to your home screen and app drawer with no Play Store download required.
          </p>
          <button
            onClick={handleInstallClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98]"
          >
            {installSuccess ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Installed on Android!</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4 text-black" />
                <span>Install App on Android Device</span>
              </>
            )}
          </button>
        </div>

        {/* Section 2: Native Android Studio & APK */}
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Option 2: Native Android Studio (APK / AAB)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
              ./android
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            The native Android project is generated in the <code className="text-cyan-300">android/</code> directory.
            You can export the project via Settings &gt; Export ZIP or GitHub, then open in Android Studio to build a release APK.
          </p>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-zinc-300">
            <span className="truncate mr-2">npm run build &amp;&amp; npx cap sync android</span>
            <button
              onClick={copyBuildCommand}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white shrink-0 transition-colors"
            >
              {copiedCommand ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
