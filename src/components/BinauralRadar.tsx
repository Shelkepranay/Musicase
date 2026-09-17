import React, { useEffect, useState } from 'react';
import { Headphones, Zap, Radio } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { BeastModeSettings, Sound8DSettings } from '../types';

interface BinauralRadarProps {
  sound8D: Sound8DSettings;
  beastMode: BeastModeSettings;
  isPlaying: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BinauralRadar: React.FC<BinauralRadarProps> = ({
  sound8D,
  beastMode,
  isPlaying,
  size = 'md',
}) => {
  const [angle, setAngle] = useState(0);
  const [pan, setPan] = useState(0);

  useEffect(() => {
    const unsub = audioEngine.onAngleUpdate((deg, panVal) => {
      setAngle(deg);
      setPan(panVal);
    });
    return unsub;
  }, []);

  const dimensions = {
    sm: { box: 'w-32 h-32', radius: 50, icon: 'w-6 h-6' },
    md: { box: 'w-56 h-56', radius: 90, icon: 'w-9 h-9' },
    lg: { box: 'w-72 h-72', radius: 118, icon: 'w-12 h-12' },
  }[size];

  const rad = (angle * Math.PI) / 180;
  const orbX = Math.sin(rad) * dimensions.radius;
  const orbY = -Math.cos(rad) * dimensions.radius;

  // Position label
  const getSpatialPositionLabel = () => {
    if (!sound8D.enabled) return 'Center Stereo';
    const norm = (angle + 360) % 360;
    if (norm >= 337.5 || norm < 22.5) return 'Front Stage';
    if (norm >= 22.5 && norm < 67.5) return 'Front-Right Orbit';
    if (norm >= 67.5 && norm < 112.5) return 'Right Ear (100%)';
    if (norm >= 112.5 && norm < 157.5) return 'Back-Right Chamber';
    if (norm >= 157.5 && norm < 202.5) return 'Behind Head (Surround)';
    if (norm >= 202.5 && norm < 247.5) return 'Back-Left Chamber';
    if (norm >= 247.5 && norm < 292.5) return 'Left Ear (100%)';
    return 'Front-Left Orbit';
  };

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className={`relative ${dimensions.box} flex items-center justify-center`}>
        {/* Outer Orbit Ring */}
        <div
          className={`absolute inset-0 rounded-full border border-white/10 transition-colors duration-500 ${
            beastMode.active
              ? 'border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
              : 'border-white/10'
          }`}
        />

        {/* Middle Pulse Ring */}
        <div
          className={`absolute inset-4 rounded-full border border-dashed transition-all duration-700 ${
            sound8D.enabled
              ? 'border-emerald-400/30'
              : 'border-white/5'
          } ${isPlaying && sound8D.enabled ? 'animate-spin' : ''}`}
          style={{ animationDuration: '24s' }}
        />

        {/* Inner Sub-Bass Chamber Ring */}
        <div
          className={`absolute inset-10 rounded-full border transition-all duration-300 ${
            beastMode.active && isPlaying
              ? 'border-cyan-400/60 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
              : 'border-white/5'
          }`}
        />

        {/* Ear Labels */}
        <span className="absolute left-1 text-[10px] font-bold tracking-wider text-slate-500">
          LEFT
        </span>
        <span className="absolute right-1 text-[10px] font-bold tracking-wider text-slate-500">
          RIGHT
        </span>
        <span className="absolute top-1 text-[9px] font-semibold text-slate-600">
          FRONT
        </span>
        <span className="absolute bottom-1 text-[9px] font-semibold text-slate-600">
          REAR
        </span>

        {/* Central Head with EarPods */}
        <div
          className={`relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
            beastMode.active
              ? 'bg-gradient-to-b from-slate-900 to-cyan-950 text-cyan-300 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
              : 'bg-zinc-900 text-slate-300 border border-white/10'
          }`}
        >
          <Headphones className={dimensions.icon} />
          {beastMode.active && (
            <div className="absolute -top-1 -right-1 bg-cyan-400 text-black rounded-full p-0.5 shadow-md">
              <Zap className="w-3 h-3 fill-black" />
            </div>
          )}
        </div>

        {/* 8D Orbiting Sound Satellite Node */}
        {sound8D.enabled ? (
          <div
            className="absolute z-20 transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${orbX}px, ${orbY}px)`,
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* Satellite Pulse aura */}
              <div
                className={`absolute w-7 h-7 rounded-full animate-ping opacity-60 ${
                  beastMode.active ? 'bg-cyan-400' : 'bg-emerald-400'
                }`}
              />
              {/* Satellite Core */}
              <div
                className={`w-4 h-4 rounded-full shadow-lg flex items-center justify-center ${
                  beastMode.active
                    ? 'bg-gradient-to-tr from-cyan-400 to-emerald-300 shadow-[0_0_12px_rgba(6,182,212,0.9)]'
                    : 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                }`}
              >
                <Radio className="w-2.5 h-2.5 text-black" />
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-zinc-500">
            Stereo
          </div>
        )}
      </div>

      {/* Real-time spatial readout badge */}
      <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-mono">
        <span
          className={`w-2 h-2 rounded-full ${
            sound8D.enabled
              ? beastMode.active
                ? 'bg-cyan-400 animate-pulse'
                : 'bg-emerald-400'
              : 'bg-zinc-600'
          }`}
        />
        <span className="text-slate-300 font-semibold">{getSpatialPositionLabel()}</span>
        {sound8D.enabled && (
          <span className="text-slate-500 text-[10px]">
            {pan > 0 ? `+${(pan * 100).toFixed(0)}% R` : `${(pan * 100).toFixed(0)}% L`}
          </span>
        )}
      </div>
    </div>
  );
};
