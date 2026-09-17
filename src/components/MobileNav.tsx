import React from 'react';
import { Home, Search, Zap, Library, DownloadCloud } from 'lucide-react';
import { BeastModeSettings, Sound8DSettings } from '../types';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  beastMode: BeastModeSettings;
  sound8D: Sound8DSettings;
  likedCount: number;
  downloadCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  beastMode,
  sound8D,
  likedCount,
  downloadCount,
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    {
      id: 'beast-station',
      label: 'Beast 8D',
      icon: Zap,
      isBeast: true,
    },
    {
      id: 'library',
      label: 'Library',
      icon: Library,
      badge: likedCount > 0 ? likedCount : undefined,
    },
    {
      id: 'downloads',
      label: 'Downloads',
      icon: DownloadCloud,
      badge: downloadCount > 0 ? downloadCount : undefined,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0b0e]/95 backdrop-blur-xl border-t border-white/10 z-40 flex items-center justify-around px-1 select-none safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 relative group"
            style={{ minWidth: '44px' }}
            aria-label={tab.label}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive
                    ? tab.isBeast && beastMode.active
                      ? 'text-cyan-400 scale-110'
                      : 'text-white scale-105'
                    : tab.isBeast && beastMode.active
                    ? 'text-cyan-400/80 animate-pulse'
                    : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              />

              {/* Beast Mode Active Glow Dot */}
              {tab.isBeast && beastMode.active && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
              )}

              {/* Count Badge */}
              {tab.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[14px] h-3.5 rounded-full bg-cyan-500 text-black text-[9px] font-bold flex items-center justify-center font-mono">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] tracking-tight mt-1 transition-colors ${
                isActive
                  ? tab.isBeast && beastMode.active
                    ? 'text-cyan-300 font-extrabold'
                    : 'text-white font-bold'
                  : 'text-zinc-400'
              }`}
            >
              {tab.label}
            </span>

            {/* Active Indicator Bar */}
            {isActive && (
              <span
                className={`absolute top-0 w-8 h-0.5 rounded-full ${
                  tab.isBeast && beastMode.active ? 'bg-cyan-400' : 'bg-white'
                }`}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
