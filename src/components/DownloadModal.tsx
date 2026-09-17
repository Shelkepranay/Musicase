import React, { useState } from 'react';
import {
  Download,
  X,
  CheckCircle2,
  HardDrive,
  Music,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Song } from '../types';
import { downloadManager } from '../utils/downloadManager';

interface DownloadModalProps {
  song: Song | null;
  onClose: () => void;
  onDownloadComplete?: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  song,
  onClose,
  onDownloadComplete,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!song) return null;

  const handleDeviceDownload = (format: string) => {
    setDownloadingFormat(format);
    setProgress(30);

    setTimeout(() => setProgress(70), 300);
    setTimeout(() => {
      setProgress(100);
      downloadManager.triggerFileDownload(song, format);
      setDownloadingFormat(null);
      setProgress(0);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  const handleOfflineSave = async () => {
    setDownloadingFormat('offline');
    setProgress(15);

    await downloadManager.downloadSong(song, (p) => setProgress(p));
    setDownloadingFormat(null);
    setSavedSuccess(true);
    if (onDownloadComplete) onDownloadComplete();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-[#12141a] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Download Track</h3>
            <p className="text-xs text-zinc-400">Save for offline listening or export MP3</p>
          </div>
        </div>

        {/* Track Snapshot */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900/80 border border-white/5">
          <img
            src={song.thumbnail}
            alt={song.title}
            className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">{song.title}</h4>
            <p className="text-xs text-zinc-400 truncate">{song.author}</p>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500 font-mono">
              <span>{song.duration}</span>
              <span>&bull;</span>
              <span>YouTube Audio Source</span>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-2.5">
          {/* Option 1: HQ 320kbps MP3 Download */}
          <button
            onClick={() => handleDeviceDownload('320kbps HQ')}
            disabled={downloadingFormat !== null}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-400/40 text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Export MP3 (320kbps High Quality)
                </span>
                <span className="text-[11px] text-zinc-400">
                  Save to your device's Downloads folder
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
          </button>

          {/* Option 2: Save to In-App Offline Library */}
          <button
            onClick={handleOfflineSave}
            disabled={downloadingFormat !== null}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-emerald-400/40 text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block flex items-center gap-1.5">
                  <span>Save to Offline Library</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300">
                    No Wi-Fi
                  </span>
                </span>
                <span className="text-[11px] text-zinc-400">
                  Play anytime inside this app without internet
                </span>
              </div>
            </div>
            <Zap className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
          </button>

          {/* Option 3: Direct YouTube Stream */}
          <a
            href={`https://www.youtube.com/watch?v=${song.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-white/5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <span>Open YouTube Video Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Progress bar when downloading */}
        {downloadingFormat && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Downloading track...</span>
              <span className="font-mono text-cyan-400">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success message */}
        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Track successfully downloaded and saved!</span>
          </div>
        )}
      </div>
    </div>
  );
};
