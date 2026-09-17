import React from 'react';
import {
  Home,
  Search,
  Headphones,
  Zap,
  Library,
  DownloadCloud,
  Heart,
  Music2,
  Volume2,
  Smartphone,
} from 'lucide-react';
import { BeastModeSettings, Playlist, Sound8DSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  beastMode: BeastModeSettings;
  sound8D: Sound8DSettings;
  onToggleBeastMode: () => void;
  onToggle8D: () => void;
  playlists: Playlist[];
  onSelectPlaylist: (playlist: Playlist) => void;
  selectedPlaylistId?: string;
  likedCount: number;
  downloadCount: number;
  onOpenAndroidModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  beastMode,
  sound8D,
  onToggleBeastMode,
  onToggle8D,
  playlists,
  onSelectPlaylist,
  selectedPlaylistId,
  likedCount,
  downloadCount,
  onOpenAndroidModal,
}) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search YouTube', icon: Search },
    {
      id: 'beast-station',
      label: 'Beast 8D Station',
      icon: Zap,
      badge: 'EarPods',
      highlight: beastMode.active,
    },
    {
      id: 'library',
      label: 'Your Library',
      icon: Library,
      count: likedCount,
    },
    {
      id: 'downloads',
      label: 'Downloads & Offline',
      icon: DownloadCloud,
      count: downloadCount,
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 bg-[#0d0e12] border-r border-white/5 flex-col h-full select-none shrink-0">
      {/* Brand Header */}
      <div className="p-5 pb-3 flex items-center justify-between">
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Headphones className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
              BEAST<span className="text-cyan-400">8D</span>
            </span>
            <p className="text-[10px] text-zinc-400 font-mono">SPOTIFY &bull; YOUTUBE</p>
          </div>
        </div>

        {/* Mini 8D Active Indicator */}
        <div
          onClick={onToggle8D}
          title="Toggle 8D Audio Mode"
          className={`cursor-pointer px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider transition-all ${
            sound8D.enabled
              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          8D {sound8D.enabled ? 'ON' : 'OFF'}
        </div>
      </div>

      {/* Primary Clean Navigation */}
      <nav className="px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? item.id === 'beast-station' && beastMode.active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? item.id === 'beast-station' && beastMode.active
                        ? 'text-cyan-400'
                        : 'text-black'
                      : item.id === 'beast-station' && beastMode.active
                      ? 'text-cyan-400 animate-pulse'
                      : 'text-zinc-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    beastMode.active
                      ? 'bg-cyan-400 text-black shadow-sm'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {typeof item.count === 'number' && item.count > 0 && (
                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-zinc-300">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="px-5 py-2">
        <div className="h-px bg-white/5" />
      </div>

      {/* Curated Playlists / Sections */}
      <div className="px-3 flex-1 overflow-y-auto space-y-1">
        <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          <span>Curated Playlists</span>
          <Music2 className="w-3 h-3 text-zinc-600" />
        </div>

        {playlists.map((pl) => {
          const isSelected = selectedPlaylistId === pl.id;
          return (
            <button
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors text-left truncate ${
                isSelected
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <img
                src={pl.cover}
                alt={pl.name}
                className="w-7 h-7 rounded-md object-cover shrink-0 border border-white/10"
              />
              <span className="truncate">{pl.name}</span>
            </button>
          );
        })}
      </div>

      {/* Beast Mode Quick Widget for EarPod Users & PWA Installation */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {onOpenAndroidModal && (
          <button
            id="sidebar-android-app-btn"
            onClick={onOpenAndroidModal}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all group shadow-sm min-h-[40px]"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Android App</span>
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-mono uppercase">
              APK
            </span>
          </button>
        )}

        <PWAInstallButton variant="sidebar" />

        <div
          className={`p-3.5 rounded-2xl transition-all duration-300 ${
            beastMode.active
              ? 'bg-gradient-to-br from-cyan-950/60 to-zinc-900 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
              : 'bg-zinc-900/60 border border-white/5'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg ${
                  beastMode.active
                    ? 'bg-cyan-400 text-black shadow-sm'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">BEAST MODE</span>
                <span className="text-[10px] text-zinc-400">EarPod +15dB Sub-Bass</span>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={onToggleBeastMode}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
                beastMode.active ? 'bg-cyan-400' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform duration-200 ${
                  beastMode.active ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-white/5">
            <span className="flex items-center gap-1 font-mono">
              <Headphones className="w-2.5 h-2.5 text-cyan-400" />
              {beastMode.preset === 'airpods_pro' ? 'AirPods Pro' : 'Stereo 8D'}
            </span>
            <span className="text-cyan-300 font-bold">
              {beastMode.active ? '+15dB BASS' : 'NORMAL'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
