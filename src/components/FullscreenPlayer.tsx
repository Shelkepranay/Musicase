import React, { useState } from 'react';
import {
  ChevronDown,
  Heart,
  Download,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Headphones,
  Zap,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
} from 'lucide-react';
import { BeastModeSettings, PlayerState, Song, Sound8DSettings } from '../types';
import { BinauralRadar } from './BinauralRadar';

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  playerState: PlayerState;
  sound8D: Sound8DSettings;
  beastMode: BeastModeSettings;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleLike: (id: string) => void;
  isLiked: boolean;
  onOpenDownloadModal: (song: Song) => void;
  onUpdateBeastMode: (settings: Partial<BeastModeSettings>) => void;
  onUpdate8D: (settings: Partial<Sound8DSettings>) => void;
}

export const FullscreenPlayer: React.FC<FullscreenPlayerProps> = ({
  isOpen,
  onClose,
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
  onUpdateBeastMode,
  onUpdate8D,
}) => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'radar' | 'lyrics'>('radar');

  if (!isOpen || !playerState.currentSong) return null;

  const { currentSong, isPlaying, currentTime, duration, volume, isMuted, shuffle, repeat } =
    playerState;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#08090c] text-white flex flex-col justify-between p-6 md:p-12 overflow-y-auto select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center">
          <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 block">
            NOW PLAYING &bull; 8D BEAST MODE
          </span>
          <span className="text-xs text-cyan-400 font-mono">
            {beastMode.active ? 'EARPOD +15dB SUB-BASS ACTIVE' : 'STANDARD STEREO'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleLike(currentSong.id)}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
              isLiked ? 'text-cyan-400' : 'text-zinc-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onOpenDownloadModal(currentSong)}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Stage */}
      <div className="my-auto py-6 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Artwork / Vinyl */}
        <div className="flex flex-col items-center">
          <div
            className={`relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 ${
              beastMode.active
                ? 'border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]'
                : 'border-white/10'
            }`}
          >
            <img
              src={currentSong.thumbnail}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            {beastMode.active && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-[10px] font-extrabold flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current text-cyan-400" />
                <span>BEAST ON</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: 360° Binaural Radar & Controls */}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900 border border-white/5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'radar'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              360° Binaural Radar
            </button>
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'visualizer'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Beast Equalizer
            </button>
          </div>

          {activeTab === 'radar' ? (
            <div className="p-4 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col items-center">
              <BinauralRadar
                sound8D={sound8D}
                beastMode={beastMode}
                isPlaying={isPlaying}
                size="md"
              />

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => onUpdate8D({ enabled: !sound8D.enabled })}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    sound8D.enabled
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  8D Orbit: {sound8D.enabled ? 'ACTIVE' : 'BYPASS'}
                </button>
                <button
                  onClick={() => onUpdateBeastMode({ active: !beastMode.active })}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    beastMode.active
                      ? 'bg-cyan-400 text-black shadow-md'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  Sub-Bass: {beastMode.active ? `+${beastMode.subBassBoost}dB` : 'OFF'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 w-full space-y-4 text-center">
              <span className="text-xs text-zinc-400">Gym Workout Mode Active</span>
              <p className="text-sm font-semibold text-zinc-300 italic">
                "Push past the limit. Your EarPods are locked in 8D Beast Mode."
              </p>
              {/* Simulated visualizer bars */}
              <div className="flex items-end justify-center gap-1.5 h-20 pt-4">
                {[45, 80, 60, 95, 70, 90, 85, 60, 75, 100, 85, 65, 50].map(
                  (val, idx) => (
                    <div
                      key={idx}
                      className={`w-2 rounded-t-full transition-all duration-150 ${
                        beastMode.active ? 'bg-cyan-400' : 'bg-emerald-400'
                      }`}
                      style={{
                        height: isPlaying ? `${val * (beastMode.active ? 1.0 : 0.65)}%` : '15%',
                      }}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* Song Meta info */}
          <div className="text-center">
            <h2 className="text-2xl font-black text-white">{currentSong.title}</h2>
            <p className="text-sm text-zinc-400 mt-1">{currentSong.author}</p>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar in Fullscreen */}
      <div className="max-w-2xl mx-auto w-full space-y-4">
        {/* Scrubber */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onToggleShuffle}
            className={`p-2 transition-colors ${
              shuffle ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={onPrev}
            className="p-2 text-zinc-300 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${
              beastMode.active
                ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                : 'bg-white text-black'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-2 text-zinc-300 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={onCycleRepeat}
            className={`p-2 transition-colors ${
              repeat !== 'off' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {repeat === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
