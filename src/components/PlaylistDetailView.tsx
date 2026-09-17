import React from 'react';
import {
  Play,
  Heart,
  Download,
  Clock,
  ArrowLeft,
  Music,
  Headphones,
  Zap,
} from 'lucide-react';
import { Playlist, Song } from '../types';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  onBack: () => void;
  onPlaySong: (song: Song) => void;
  onPlayAll: (songs: Song[]) => void;
  onToggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  onOpenDownloadModal: (song: Song) => void;
  currentSongId?: string;
  isPlaying: boolean;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  onBack,
  onPlaySong,
  onPlayAll,
  onToggleLike,
  isLiked,
  onOpenDownloadModal,
  currentSongId,
  isPlaying,
}) => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Playlist Hero Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-6 border-b border-white/10">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-2xl shrink-0 border border-white/10">
          <img
            src={playlist.cover}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 text-center md:text-left min-w-0 flex-1">
          <span className="text-[11px] font-extrabold tracking-widest text-cyan-400 uppercase">
            PLAYLIST
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {playlist.name}
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl">
            {playlist.description}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <button
              onClick={() => onPlayAll(playlist.songs)}
              className="px-8 py-3.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>PLAY ALL</span>
            </button>
            <span className="text-xs text-zinc-400 font-mono">
              {playlist.songs.length} tracks
            </span>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 text-xs font-bold text-zinc-500 uppercase tracking-wider px-4 pb-2 border-b border-white/5">
          <span className="col-span-1">#</span>
          <span className="col-span-7 sm:col-span-6">Title</span>
          <span className="col-span-2 hidden sm:inline">Artist</span>
          <span className="col-span-4 sm:col-span-3 text-right">Duration</span>
        </div>

        <div className="space-y-1">
          {playlist.songs.map((song, idx) => {
            const isThisPlaying = currentSongId === song.id && isPlaying;
            return (
              <div
                key={song.id + '_' + idx}
                className="grid grid-cols-12 items-center p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/80 border border-transparent hover:border-white/5 transition-all group"
              >
                {/* Index / Play */}
                <div
                  onClick={() => onPlaySong(song)}
                  className="col-span-1 text-xs font-mono text-zinc-500 cursor-pointer"
                >
                  <span className="group-hover:hidden">{idx + 1}</span>
                  <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 hidden group-hover:block" />
                </div>

                {/* Title & thumbnail */}
                <div
                  onClick={() => onPlaySong(song)}
                  className="col-span-7 sm:col-span-6 flex items-center gap-3 min-w-0 cursor-pointer"
                >
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="text-xs font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {song.title}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate sm:hidden">
                      {song.author}
                    </div>
                  </div>
                </div>

                {/* Artist */}
                <div className="col-span-2 hidden sm:block text-xs text-zinc-400 truncate">
                  {song.author}
                </div>

                {/* Duration & Actions */}
                <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-2 text-xs font-mono text-zinc-400">
                  <span>{song.duration}</span>
                  <button
                    onClick={() => onToggleLike(song.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      isLiked(song.id) ? 'text-cyan-400' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${isLiked(song.id) ? 'fill-current' : ''}`}
                    />
                  </button>
                  <button
                    onClick={() => onOpenDownloadModal(song)}
                    className="p-1.5 rounded-full text-zinc-500 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
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
