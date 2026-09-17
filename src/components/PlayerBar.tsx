import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Download,
  Maximize2,
  Headphones,
  Zap,
} from 'lucide-react';
import { BeastModeSettings, PlayerState, Song, Sound8DSettings } from '../types';

interface PlayerBarProps {
  playerState: PlayerState;
  sound8D: Sound8DSettings;
  beastMode: BeastModeSettings;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleLike: (songId: string) => void;
  isLiked: boolean;
  onOpenDownloadModal: (song: Song) => void;
  onToggleBeastMode: () => void;
  onToggle8D: () => void;
  onOpenFullscreen: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  playerState,
  sound8D,
  beastMode,
  onTogglePlay,
  onPrev,
  onNext,
  onToggleShuffle,
  onCycleRepeat,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleLike,
  isLiked,
  onOpenDownloadModal,
  onToggleBeastMode,
  onToggle8D,
  onOpenFullscreen,
}) => {
  const { currentSong, isPlaying, currentTime, duration, volume, isMuted, shuffle, repeat } =
    playerState;

  const [isSeekingLocal, setIsSeekingLocal] = useState(false);
  const [localSeekValue, setLocalSeekValue] = useState(0);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentSec = isSeekingLocal ? localSeekValue : currentTime;
  const progressPercent = duration > 0 ? Math.min(100, (currentSec / duration) * 100) : 0;

  if (!currentSong) return null;

  return (
    <>
      {/* MOBILE MINI PLAYER (Floating just above the Mobile Bottom Nav) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 px-2 pb-1 pointer-events-none">
        <div
          className={`pointer-events-auto relative rounded-2xl overflow-hidden border backdrop-blur-2xl transition-all duration-300 shadow-2xl ${
            beastMode.active
              ? 'bg-[#12151e]/95 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
              : 'bg-[#121318]/95 border-white/10'
          }`}
        >
          {/* Top Edge Progress Line on Mobile */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-zinc-800">
            <div
              className={`h-full transition-all duration-150 ${
                beastMode.active
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                  : 'bg-white'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="px-3 py-2 flex items-center justify-between gap-2.5">
            {/* Tap to expand Now Playing */}
            <div
              onClick={onOpenFullscreen}
              className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-sm">
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
                {beastMode.active && (
                  <div className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-cyan-400 text-black">
                    <Zap className="w-2.5 h-2.5 fill-black" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                  <span className="truncate">{currentSong.title}</span>
                </div>
                <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
                  <span className="truncate">{currentSong.author}</span>
                  {sound8D.enabled && (
                    <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-400/20 text-emerald-300 shrink-0">
                      8D
                    </span>
                  )}
                  {beastMode.active && (
                    <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-cyan-400/20 text-cyan-300 shrink-0">
                      +15dB
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Action Controls (with 44px minimum touch target) */}
            <div className="flex items-center gap-0.5 shrink-0">
              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(currentSong.id);
                }}
                className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white active:scale-95 transition-transform"
                aria-label="Like track"
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? 'text-cyan-400 fill-current' : ''}`}
                />
              </button>

              {/* Beast Mode Quick Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBeastMode();
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  beastMode.active
                    ? 'text-cyan-400 bg-cyan-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
                aria-label="Toggle Beast Mode"
                title="Toggle Beast Mode"
              >
                <Zap className={`w-4 h-4 ${beastMode.active ? 'fill-current' : ''}`} />
              </button>

              {/* Play/Pause Button (Selector 3 & 4) */}
              <button
                id="mobile-play-pause-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlay();
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-md ${
                  beastMode.active
                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-[0_0_16px_rgba(6,182,212,0.7)] hover:brightness-110'
                    : 'bg-white text-black hover:bg-zinc-100'
                }`}
                aria-label={isPlaying ? 'Pause track' : 'Play track'}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current text-black shrink-0 transition-transform" />
                ) : (
                  <Play className="w-5 h-5 fill-current text-black ml-0.5 shrink-0 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP PLAYER BAR (Fixed at bottom on md and above screens) */}
      <footer className="hidden md:flex h-24 bg-[#0d0e12] border-t border-white/10 px-4 md:px-6 items-center justify-between gap-4 z-40 select-none relative shrink-0">
        {/* Beast Mode Subtle Top Glow Bar */}
        {beastMode.active && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
        )}

        {/* Left: Track Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-[180px]">
          <div
            onClick={onOpenFullscreen}
            className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 cursor-pointer group border border-white/10"
          >
            <img
              src={currentSong.thumbnail}
              alt={currentSong.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div
              onClick={onOpenFullscreen}
              className="text-sm font-semibold text-white truncate cursor-pointer hover:underline"
            >
              {currentSong.title}
            </div>
            <div className="text-xs text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
              <span>{currentSong.author}</span>
              {currentSong.is8D && (
                <span className="px-1 py-0.2 text-[9px] font-bold rounded bg-emerald-400/20 text-emerald-300">
                  8D
                </span>
              )}
            </div>
          </div>

          {/* Like and Download Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleLike(currentSong.id)}
              className={`p-2 rounded-full transition-colors ${
                isLiked
                  ? 'text-cyan-400 hover:text-cyan-300'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title={isLiked ? 'Remove from Liked' : 'Save to Liked'}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
              />
            </button>

            <button
              onClick={() => onOpenDownloadModal(currentSong)}
              className="p-2 text-zinc-400 hover:text-white rounded-full transition-colors"
              title="Download Track (MP3 / Offline)"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className="flex flex-col items-center gap-2 max-w-xl w-2/4">
          {/* Playback Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleShuffle}
              className={`p-1.5 transition-colors ${
                shuffle ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={onPrev}
              className="p-1.5 text-zinc-300 hover:text-white transition-colors"
              title="Previous"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={onTogglePlay}
              disabled={!currentSong}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                beastMode.active
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.6)] hover:scale-105'
                  : 'bg-white text-black hover:scale-105 shadow-md'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black" />
              ) : (
                <Play className="w-5 h-5 fill-black ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-1.5 text-zinc-300 hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={onCycleRepeat}
              className={`p-1.5 transition-colors ${
                repeat !== 'off' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
              }`}
              title={`Repeat: ${repeat}`}
            >
              {repeat === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Progress Time Slider */}
          <div className="w-full flex items-center gap-3 text-[11px] font-mono text-zinc-400">
            <span className="w-8 text-right">{formatTime(currentSec)}</span>

            <div className="relative flex-1 group flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentSec}
                onChange={(e) => {
                  setIsSeekingLocal(true);
                  setLocalSeekValue(parseFloat(e.target.value));
                }}
                onMouseUp={() => {
                  onSeek(localSeekValue);
                  setIsSeekingLocal(false);
                }}
                onTouchEnd={() => {
                  onSeek(localSeekValue);
                  setIsSeekingLocal(false);
                }}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer focus:outline-none accent-cyan-400"
              />
            </div>

            <span className="w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Sound Modes, Volume & Fullscreen */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
          {/* 8D Orbit Pill */}
          <button
            onClick={onToggle8D}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
              sound8D.enabled
                ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40 shadow-sm'
                : 'bg-zinc-800/80 text-zinc-400 border-white/5 hover:text-white'
            }`}
            title="Toggle 8D Rotating Spatial Sound"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>8D {sound8D.enabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Beast Mode Pill */}
          <button
            onClick={onToggleBeastMode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all ${
              beastMode.active
                ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Toggle EarPod Beast Mode (+15dB Bass)"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>BEAST</span>
          </button>

          {/* Volume Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleMute}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : volume < 50 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseInt(e.target.value, 10))}
              className="w-16 md:w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Maximize Now Playing */}
          <button
            onClick={onOpenFullscreen}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Open Fullscreen Visualizer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </>
  );
};
