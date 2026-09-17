import React, { useState } from 'react';
import {
  Search,
  Zap,
  Headphones,
  Link as LinkIcon,
  X,
  Smartphone,
} from 'lucide-react';
import { BeastModeSettings, Sound8DSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  beastMode: BeastModeSettings;
  sound8D: Sound8DSettings;
  onToggleBeastMode: () => void;
  onToggle8D: () => void;
  onOpenUrlModal: () => void;
  onOpenAndroidModal?: () => void;
  isSearching?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  beastMode,
  sound8D,
  onToggleBeastMode,
  onToggle8D,
  onOpenUrlModal,
  onOpenAndroidModal,
  isSearching,
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
  };

  return (
    <header className="h-14 sm:h-16 px-3 sm:px-6 bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 select-none shrink-0">
      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 max-w-xl relative flex items-center min-w-0"
      >
        <div className="relative w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="header-search-input"
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              onSearchChange(e.target.value);
            }}
            placeholder="Search song, artist, 8D audio..."
            className="w-full pl-9 pr-9 py-2 sm:py-2.5 bg-zinc-900/90 hover:bg-zinc-900 text-xs sm:text-sm text-white placeholder-zinc-500 rounded-full border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 focus:outline-none transition-all shadow-inner"
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {isSearching && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </form>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Android App Info & Install Button */}
        {onOpenAndroidModal && (
          <button
            id="header-android-app-btn"
            onClick={onOpenAndroidModal}
            title="Music8D Android App & APK Build"
            aria-label="Android App Details"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all min-h-[36px] shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="whitespace-nowrap">Android</span>
          </button>
        )}

        {/* In-App PWA Install Button */}
        <PWAInstallButton variant="header" />

        {/* Paste YouTube URL direct loader */}
        <button
          onClick={onOpenUrlModal}
          title="Play from YouTube Link / Video ID"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium border border-white/10 transition-colors min-h-[36px]"
        >
          <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>YouTube URL</span>
        </button>

        {/* 8D Spatial Audio Quick Toggle */}
        <button
          id="header-8d-toggle-btn"
          onClick={onToggle8D}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-all min-h-[38px] ${
            sound8D.enabled
              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
              : 'bg-zinc-900 text-zinc-400 border border-white/10 hover:text-white hover:bg-zinc-800'
          }`}
          aria-label="Toggle 8D Audio"
        >
          <Headphones className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold tracking-wider whitespace-nowrap">8D AUDIO</span>
        </button>

        {/* Beast Mode Button with High-Voltage Glow */}
        <button
          id="header-beast-mode-btn"
          onClick={onToggleBeastMode}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full transition-all min-h-[38px] ${
            beastMode.active
              ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-[1.02]'
              : 'bg-zinc-900 text-zinc-300 hover:text-white border border-white/10 hover:border-cyan-500/40 hover:bg-zinc-800'
          }`}
          aria-label="Toggle Beast Mode"
        >
          <Zap
            className={`w-3.5 h-3.5 shrink-0 ${
              beastMode.active ? 'fill-black' : 'text-cyan-400'
            }`}
          />
          <span className="text-[11px] sm:text-xs font-black tracking-wider whitespace-nowrap">BEAST MODE</span>
        </button>
      </div>
    </header>
  );
};
