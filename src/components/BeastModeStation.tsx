import React from 'react';
import {
  Zap,
  Headphones,
  Sliders,
  Radio,
  Play,
  Volume2,
  RefreshCw,
  Sparkles,
  Flame,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { BeastModeSettings, EarpodPreset, Song, Sound8DSettings } from '../types';
import { BinauralRadar } from './BinauralRadar';
import { audioEngine } from '../utils/audioEngine';

interface BeastModeStationProps {
  beastMode: BeastModeSettings;
  sound8D: Sound8DSettings;
  onUpdateBeastMode: (settings: Partial<BeastModeSettings>) => void;
  onUpdate8D: (settings: Partial<Sound8DSettings>) => void;
  onPlaySong: (song: Song) => void;
  beastSongs: Song[];
  isPlaying: boolean;
}

export const BeastModeStation: React.FC<BeastModeStationProps> = ({
  beastMode,
  sound8D,
  onUpdateBeastMode,
  onUpdate8D,
  onPlaySong,
  beastSongs,
  isPlaying,
}) => {
  const speedPresets = [
    { label: 'Chill Orbit', speed: 0.15, desc: '6.6s slow rotation' },
    { label: 'Standard 8D', speed: 0.25, desc: '4.0s natural stage' },
    { label: 'Gym Beast', speed: 0.45, desc: '2.2s high energy' },
    { label: 'Hyper 8D', speed: 0.8, desc: '1.2s rapid spin' },
  ];

  const earpodModels: { id: EarpodPreset; name: string; desc: string; tag: string }[] = [
    {
      id: 'airpods_pro',
      name: 'AirPods Pro / Max',
      desc: 'Optimized for spatial driver response and transparent highs.',
      tag: 'Recommended',
    },
    {
      id: 'bass_cannon',
      name: 'Beast Bass In-Ear',
      desc: 'Sub-bass punch amplified to 75Hz for maximum gym drive.',
      tag: 'Heavy Bass',
    },
    {
      id: 'over_ear',
      name: 'Studio Over-Ear',
      desc: 'Wide acoustic stage with balanced 360-degree diffusion.',
      tag: 'Neutral Hi-Fi',
    },
    {
      id: 'vocal_crisp',
      name: 'Vocal Presence',
      desc: '3.5kHz upper-mid lift for crystal clear lyrics and instruments.',
      tag: 'Crisp Treble',
    },
  ];

  const handleTestTone = () => {
    audioEngine.playEarPodTestTone();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-40 md:pb-12 max-w-6xl mx-auto space-y-6 sm:space-y-8 select-none">
      {/* Hero Beast Mode Header */}
      <div
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 md:p-8 border transition-all duration-500 ${
          beastMode.active
            ? 'bg-gradient-to-br from-[#0c131a] via-[#091720] to-[#0a0d12] border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)]'
            : 'bg-zinc-900/70 border-white/10'
        }`}
      >
        {/* Glowing background highlights */}
        {beastMode.active && (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          </>
        )}

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>EARPOD & HEADPHONE ACOUSTIC ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              BEAST MODE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">8D SOUND</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-xl">
              Turn your standard EarPods or headphones into a 360° binaural soundstage with +15dB sub-bass boost, continuous orbital rotation, and dynamic club punch.
            </p>
          </div>

          {/* Master Beast Mode Switch */}
          <div className="flex flex-col items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onUpdateBeastMode({ active: !beastMode.active })}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2.5 transition-all transform duration-200 cursor-pointer min-h-[48px] ${
                beastMode.active
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-[0_0_30px_rgba(6,182,212,0.6)] scale-[1.02] sm:scale-105 hover:scale-108'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-white/10'
              }`}
            >
              <Zap className={`w-5 h-5 ${beastMode.active ? 'fill-black' : ''}`} />
              <span>{beastMode.active ? 'BEAST MODE ACTIVE' : 'ACTIVATE BEAST MODE'}</span>
            </button>

            <button
              onClick={handleTestTone}
              className="text-xs text-zinc-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors min-h-[36px]"
              title="Play quick audio pulse to test left/right stereo separation"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test EarPod 8D Pulse</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 360° Binaural Spatializer & Orbit Speed */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">360° Binaural Radar</span>
            </div>
            <button
              onClick={() => onUpdate8D({ enabled: !sound8D.enabled })}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                sound8D.enabled
                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {sound8D.enabled ? '8D Orbit Active' : 'Enable 8D'}
            </button>
          </div>

          {/* Interactive Radar */}
          <div className="my-6">
            <BinauralRadar
              sound8D={sound8D}
              beastMode={beastMode}
              isPlaying={isPlaying}
              size="lg"
            />
          </div>

          {/* Orbit Direction & Width */}
          <div className="w-full space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Rotation Direction</span>
              <button
                onClick={() =>
                  onUpdate8D({
                    direction:
                      sound8D.direction === 'clockwise'
                        ? 'counter-clockwise'
                        : 'clockwise',
                  })
                }
                className="flex items-center gap-1 text-cyan-400 hover:underline font-mono text-xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{sound8D.direction === 'clockwise' ? 'Clockwise' : 'Counter-Clock'}</span>
              </button>
            </div>

            {/* Orbit Speed Buttons */}
            <div>
              <span className="text-xs text-zinc-400 block mb-2 font-medium">
                Rotation Speed
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {speedPresets.map((preset) => {
                  const isSelected = Math.abs(sound8D.orbitSpeed - preset.speed) < 0.05;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => onUpdate8D({ orbitSpeed: preset.speed, enabled: true })}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        isSelected && sound8D.enabled
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-zinc-800/60 border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs">{preset.label}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        {preset.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audio Equalizer & EarPod Optimization */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub-Bass and Treble Sliders */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">Sub-Bass & EarPod Punch</span>
              </div>
              <span className="text-xs text-cyan-300 font-mono">
                +{beastMode.subBassBoost} dB Boost
              </span>
            </div>

            {/* Sub-Bass Boost Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Sub-Bass (60Hz - 80Hz Low-End)</span>
                <span className="text-white font-mono font-bold">
                  {beastMode.subBassBoost} dB
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={18}
                step={1}
                value={beastMode.subBassBoost}
                onChange={(e) =>
                  onUpdateBeastMode({ subBassBoost: parseInt(e.target.value, 10) })
                }
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Flat (0dB)</span>
                <span>Gym Workout (+10dB)</span>
                <span>Max Beast (+18dB)</span>
              </div>
            </div>

            {/* EarPod Clarity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>EarPod Vocal Clarity (3.5kHz Treble)</span>
                <span className="text-white font-mono font-bold">
                  +{beastMode.earpodClarity} dB
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={beastMode.earpodClarity}
                onChange={(e) =>
                  onUpdateBeastMode({ earpodClarity: parseInt(e.target.value, 10) })
                }
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Dynamic Compressor Toggle */}
            <div className="pt-2 flex items-center justify-between border-t border-white/5">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Club Punch Compressor
                </span>
                <span className="text-[11px] text-zinc-400">
                  Prevents harsh clipping while maximizing low-frequency slam
                </span>
              </div>
              <button
                onClick={() =>
                  onUpdateBeastMode({ punchCompressor: !beastMode.punchCompressor })
                }
                className={`w-9 h-5 rounded-full relative transition-colors ${
                  beastMode.punchCompressor ? 'bg-cyan-400' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black absolute top-0.5 left-0.5 transition-transform ${
                    beastMode.punchCompressor ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* EarPod Hardware Profile Presets */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">
                  EarPod & Headphone Profiles
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">Acoustic EQ Curve</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {earpodModels.map((model) => {
                const isSelected = beastMode.preset === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      onUpdateBeastMode({ preset: model.id });
                      if (model.id === 'bass_cannon') {
                        onUpdateBeastMode({ subBassBoost: 16, earpodClarity: 4 });
                      } else if (model.id === 'airpods_pro') {
                        onUpdateBeastMode({ subBassBoost: 14, earpodClarity: 7 });
                      } else if (model.id === 'vocal_crisp') {
                        onUpdateBeastMode({ subBassBoost: 8, earpodClarity: 10 });
                      } else {
                        onUpdateBeastMode({ subBassBoost: 10, earpodClarity: 5 });
                      }
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-zinc-800/40 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{model.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-cyan-400 text-black'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {model.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-tight">
                      {model.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended 8D Beast Tracks Quick Playlist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Recommended 8D & Beast Audio Tracks
            </h2>
          </div>
          <span className="text-xs text-zinc-400">Curated for EarPods</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {beastSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => onPlaySong(song)}
              className="group p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-cyan-400/40 cursor-pointer transition-all duration-200"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2.5 border border-white/10">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  </div>
                </div>
                {song.is8D && (
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 text-cyan-300 border border-cyan-400/30">
                    8D BINAURAL
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                {song.title}
              </div>
              <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                {song.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
