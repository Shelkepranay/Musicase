export interface Song {
  id: string; // YouTube videoId or unique audio ID
  title: string;
  author: string;
  duration: string;
  thumbnail: string;
  is8D?: boolean;
  views?: string;
  category?: string;
  isDownloaded?: boolean;
  downloadDate?: string;
  fileSize?: string;
  audioUrl?: string; // Direct audio URL if available or synthesized
}

export type EarpodPreset = 'airpods_pro' | 'over_ear' | 'bass_cannon' | 'vocal_crisp';

export interface Sound8DSettings {
  enabled: boolean;
  orbitSpeed: number; // 0.1Hz to 2.0Hz (seconds per revolution: 10s down to 2s)
  reverbDepth: number; // 0 to 100%
  orbitAngle: number; // 0 to 360 degrees
  direction: 'clockwise' | 'counter-clockwise';
  panWidth: number; // 0 to 100%
}

export interface BeastModeSettings {
  active: boolean;
  subBassBoost: number; // 0 to +18 dB
  earpodClarity: number; // 0 to +10 dB
  punchCompressor: boolean;
  preset: EarpodPreset;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  queue: Song[];
  history: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  songs: Song[];
  isCustom?: boolean;
}

export interface DownloadItem {
  id: string;
  song: Song;
  format: string;
  quality: string;
  size: string;
  downloadedAt: number;
  status: 'completed' | 'downloading' | 'failed';
  progress: number;
}
