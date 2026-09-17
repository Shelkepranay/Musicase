import React, { useState } from 'react';
import {
  Heart,
  Music,
  Plus,
  Play,
  Download,
  Trash2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Playlist, Song } from '../types';

interface LibraryViewProps {
  likedSongs: Song[];
  playlists: Playlist[];
  history: Song[];
  onPlaySong: (song: Song) => void;
  onToggleLike: (id: string) => void;
  onOpenDownloadModal: (song: Song) => void;
  currentSongId?: string;
  isPlaying: boolean;
  onCreatePlaylist: (name: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  likedSongs,
  playlists,
  history,
  onPlaySong,
  onToggleLike,
  onOpenDownloadModal,
  currentSongId,
  isPlaying,
  onCreatePlaylist,
  onSelectPlaylist,
}) => {
  const [activeTab, setActiveTab] = useState<'liked' | 'playlists' | 'history'>('liked');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    onCreatePlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Your Library
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Your saved 8D tracks, liked songs, and workout collections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>New Playlist</span>
          </button>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'liked'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Liked Songs ({likedSongs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'playlists'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Playlists ({playlists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Recent History</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'liked' && (
        <div className="space-y-3">
          {likedSongs.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 mx-auto flex items-center justify-center text-zinc-500 border border-white/5">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-zinc-400 text-sm">No liked songs yet.</p>
              <p className="text-xs text-zinc-500">
                Click the heart icon on any song to save it here for fast access!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {likedSongs.map((song) => {
                const isThisPlaying = currentSongId === song.id && isPlaying;
                return (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-white/5 hover:border-cyan-400/30 transition-all group"
                  >
                    <div
                      onClick={() => onPlaySong(song)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <img
                          src={song.thumbnail}
                          alt={song.title}
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
                          {song.title}
                        </div>
                        <div className="text-xs text-zinc-400 truncate flex items-center gap-2 mt-0.5">
                          <span>{song.author}</span>
                          {song.is8D && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-400/20 text-emerald-300">
                              8D
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-3">
                      <span className="text-xs font-mono text-zinc-400 hidden sm:inline w-12 text-right">
                        {song.duration}
                      </span>
                      <button
                        onClick={() => onToggleLike(song.id)}
                        className="p-2 text-cyan-400 hover:text-red-400 transition-colors"
                        title="Remove from Liked"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => onOpenDownloadModal(song)}
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className="group p-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 border border-white/10 shadow-md">
                <img
                  src={pl.cover}
                  alt={pl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <div className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-xl">
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-sm text-white truncate">{pl.name}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{pl.songs.length} tracks</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="py-20 text-center text-zinc-400 text-sm">
              No recent listening history yet.
            </div>
          ) : (
            history.map((song, i) => (
              <div
                key={song.id + '_' + i}
                onClick={() => onPlaySong(song)}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/80 border border-white/5 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                      {song.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate">{song.author}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-zinc-500">{song.duration}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-sm bg-[#12141a] border border-white/10 rounded-3xl p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-white">Create New Playlist</h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name (e.g. Gym Beast Workout)"
              className="w-full px-4 py-2.5 bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:border-cyan-400 focus:outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-400 text-black hover:bg-cyan-300"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
