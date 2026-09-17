import React, { useState } from 'react';
import {
  DownloadCloud,
  Play,
  Trash2,
  HardDrive,
  FileAudio,
  CheckCircle2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { DownloadItem, Song } from '../types';
import { downloadManager } from '../utils/downloadManager';

interface DownloadsViewProps {
  downloads: DownloadItem[];
  onPlaySong: (song: Song) => void;
  onRefreshDownloads: () => void;
  currentSongId?: string;
  isPlaying: boolean;
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({
  downloads,
  onPlaySong,
  onRefreshDownloads,
  currentSongId,
  isPlaying,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadManager.removeDownload(songId);
    onRefreshDownloads();
  };

  const handleExportToDevice = (item: DownloadItem, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadManager.triggerFileDownload(item.song, item.format);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const totalSize = downloads.reduce((acc, curr) => {
    const num = parseFloat(curr.size) || 0;
    return acc + num;
  }, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Offline & Downloads</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
              OFFLINE READY
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Listen to your songs anytime without internet connection or Wi-Fi
          </p>
        </div>

        {/* Storage stats */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-900 border border-white/10 text-xs">
          <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="font-bold text-white">
              {downloads.length} {downloads.length === 1 ? 'Track' : 'Tracks'} Cached
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">
              {totalSize.toFixed(1)} MB In-App Storage
            </div>
          </div>
        </div>
      </div>

      {/* Downloads List */}
      {downloads.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/5 mx-auto flex items-center justify-center text-zinc-500">
            <DownloadCloud className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No downloaded songs yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Click the download button on any song or search result to save it for offline listening and MP3 export!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-3 pb-1 flex justify-between">
            <span>Saved Offline Tracks</span>
            <span className="hidden sm:inline">Format & Export</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {downloads.map((item) => {
              const isThisPlaying = currentSongId === item.song.id && isPlaying;
              return (
                <div
                  key={item.id}
                  onClick={() => onPlaySong(item.song)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-white/5 hover:border-cyan-400/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={item.song.thumbnail}
                        alt={item.song.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                          isThisPlaying
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Play className="w-4 h-4 text-cyan-400 fill-cyan-400 ml-0.5" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {item.song.title}
                      </div>
                      <div className="text-xs text-zinc-400 truncate flex items-center gap-2 mt-0.5">
                        <span>{item.song.author}</span>
                        <span className="text-zinc-600">&bull;</span>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          {item.size}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold px-1 py-0.2 rounded bg-emerald-400/10 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Saved</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pl-3">
                    <button
                      onClick={(e) => handleExportToDevice(item, e)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/5"
                      title="Export as MP3 to computer/phone"
                    >
                      <FileAudio className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">
                        {copiedId === item.id ? 'Exported!' : 'Export MP3'}
                      </span>
                    </button>

                    <button
                      onClick={(e) => handleDelete(item.song.id, e)}
                      className="p-2 text-zinc-500 hover:text-red-400 rounded-full transition-colors"
                      title="Remove from offline storage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
