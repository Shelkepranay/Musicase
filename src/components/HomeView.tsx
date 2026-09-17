import React from 'react';
import { Play, Heart, Download, Zap, Headphones, Flame, Sparkles } from 'lucide-react';
import { Playlist, Song } from '../types';

interface HomeViewProps {
  featuredSongs: Song[];
  playlists: Playlist[];
  onPlaySong: (song: Song) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onToggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  onOpenDownloadModal: (song: Song) => void;
  currentSongId?: string;
  isPlaying: boolean;
  onOpenBeastStation: () => void;
  isBeastActive: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  featuredSongs,
  playlists,
  onPlaySong,
  onSelectPlaylist,
  onToggleLike,
  isLiked,
  onOpenDownloadModal,
  currentSongId,
  isPlaying,
  onOpenBeastStation,
  isBeastActive,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const beastTracks = featuredSongs.filter(
    (s) => s.category === 'Beast Workout' || s.is8D
  );
  const hotHits = featuredSongs.slice(0, 6);

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-40 md:pb-12 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none">
      {/* Top Banner & Quick Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
            {getGreeting()}
          </h1>

          {/* Quick Beast Station Link */}
          <button
            onClick={onOpenBeastStation}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all min-h-[36px] shrink-0 ${
              isBeastActive
                ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-zinc-900 text-zinc-300 hover:text-white border border-white/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden xs:inline">EarPod</span>
            <span>8D Station</span>
          </button>
        </div>

        {/* 6-Card Quick Start Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {hotHits.map((song) => {
            const isThisPlaying = currentSongId === song.id && isPlaying;
            return (
              <div
                key={song.id}
                onClick={() => onPlaySong(song)}
                className="group relative flex items-center gap-3 bg-zinc-900/60 hover:bg-zinc-800/80 active:bg-zinc-800 rounded-xl overflow-hidden cursor-pointer transition-all border border-white/5 hover:border-white/20 p-2 pr-3 sm:pr-4 shadow-sm min-h-[60px]"
              >
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg shrink-0 border border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {song.author}
                  </p>
                </div>

                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-all ${
                    isThisPlaying
                      ? 'bg-cyan-400 text-black scale-100'
                      : 'bg-white text-black opacity-90 sm:opacity-0 sm:group-hover:opacity-100 scale-95 sm:scale-90 sm:group-hover:scale-100'
                  }`}
                >
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Playlists Carousel / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Made For You</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className="group p-3 sm:p-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-800/60 active:bg-zinc-800 border border-white/5 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 sm:mb-3 border border-white/10 shadow-md">
                <img
                  src={pl.cover}
                  alt={pl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-2.5 right-2.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-xl">
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-white truncate">{pl.name}</h3>
              <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-2 mt-0.5">
                {pl.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 8D Beast Mode Workout Audio Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Headphones className="w-5 h-5 text-emerald-400 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
              8D EarPod Dimension
            </h2>
          </div>
          <span className="text-[10px] sm:text-xs text-zinc-400 shrink-0">360° rotation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
          {beastTracks.slice(0, 6).map((song) => {
            const isThisPlaying = currentSongId === song.id && isPlaying;
            return (
              <div
                key={song.id}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 active:bg-zinc-800/90 border border-white/5 hover:border-cyan-400/30 transition-all group"
              >
                <div
                  onClick={() => onPlaySong(song)}
                  className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                        isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Play className="w-4 h-4 text-cyan-400 fill-cyan-400 ml-0.5" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {song.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
                      <span className="truncate">{song.author}</span>
                      <span className="text-emerald-400 font-bold text-[9px] px-1 py-0.2 rounded bg-emerald-400/10 shrink-0">
                        8D
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 pl-2 shrink-0">
                  <span className="text-xs font-mono text-zinc-500 hidden sm:inline mr-1">
                    {song.duration}
                  </span>
                  <button
                    onClick={() => onToggleLike(song.id)}
                    className={`w-11 h-11 flex items-center justify-center rounded-full transition-colors ${
                      isLiked(song.id)
                        ? 'text-cyan-400'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                    aria-label="Like"
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked(song.id) ? 'fill-current' : ''}`}
                    />
                  </button>
                  <button
                    onClick={() => onOpenDownloadModal(song)}
                    className="w-11 h-11 flex items-center justify-center rounded-full text-zinc-500 hover:text-white transition-colors"
                    aria-label="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
