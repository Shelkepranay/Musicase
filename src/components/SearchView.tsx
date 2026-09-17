import React, { useState } from 'react';
import {
  Search,
  Play,
  Heart,
  Download,
  Headphones,
  Zap,
  Sparkles,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { GENRE_TAGS } from '../data/defaultSongs';
import { Song } from '../types';

interface SearchViewProps {
  searchQuery: string;
  onSearch: (q: string) => void;
  results: Song[];
  isSearching: boolean;
  onPlaySong: (song: Song) => void;
  onToggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  onOpenDownloadModal: (song: Song) => void;
  currentSongId?: string;
  isPlaying: boolean;
  onOpenUrlModal: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onSearch,
  results,
  isSearching,
  onPlaySong,
  onToggleLike,
  isLiked,
  onOpenDownloadModal,
  currentSongId,
  isPlaying,
  onOpenUrlModal,
}) => {
  const [activeTag, setActiveTag] = useState('All Songs');

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    if (tag === 'All Songs') {
      onSearch('');
    } else {
      onSearch(tag);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-40 md:pb-12 max-w-7xl mx-auto space-y-5 sm:space-y-6 select-none">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Search YouTube</span>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold border border-red-500/30">
              LIVE YOUTUBE
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Access every song, phonk remix, gym workout mix, and 8D track on YouTube
          </p>
        </div>

        <button
          onClick={onOpenUrlModal}
          className="self-start sm:self-auto px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors min-h-[44px]"
        >
          <ExternalLink className="w-4 h-4 text-cyan-400" />
          <span>Paste YouTube URL</span>
        </button>
      </div>

      {/* Genre Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {GENRE_TAGS.map((tag) => {
          const isSelected = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold shrink-0 min-h-[38px] transition-all ${
                isSelected
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Loading state or Search Results List */}
      {isSearching ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-mono">Searching YouTube library...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <p className="text-zinc-400 text-sm">No songs found for "{searchQuery}"</p>
          <button
            onClick={() => onSearch('8D Audio')}
            className="text-xs text-cyan-400 hover:underline font-bold"
          >
            Explore Trending 8D Audio
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2 sm:px-3 pb-1 flex justify-between">
            <span>Results ({results.length} tracks found)</span>
            <span className="hidden sm:inline">Duration & Actions</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {results.map((song, index) => {
              const isThisPlaying = currentSongId === song.id && isPlaying;
              return (
                <div
                  key={song.id + '_' + index}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/80 active:bg-zinc-800 border border-white/5 hover:border-cyan-400/30 transition-all group"
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
                          isThisPlaying
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Play className="w-4 h-4 text-cyan-400 fill-cyan-400 ml-0.5" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {song.title}
                      </div>
                      <div className="text-[11px] sm:text-xs text-zinc-400 truncate flex items-center gap-1.5 mt-0.5">
                        <span className="truncate">{song.author}</span>
                        {song.views && (
                          <>
                            <span className="text-zinc-600 hidden sm:inline">&bull;</span>
                            <span className="text-[10px] sm:text-[11px] text-zinc-500 font-mono hidden sm:inline">
                              {song.views}
                            </span>
                          </>
                        )}
                        {song.is8D && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-400/20 text-emerald-300 shrink-0">
                            8D
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 pl-2 shrink-0">
                    <span className="text-xs font-mono text-zinc-400 hidden sm:inline w-12 text-right mr-1">
                      {song.duration}
                    </span>

                    <button
                      onClick={() => onToggleLike(song.id)}
                      className={`w-11 h-11 flex items-center justify-center rounded-full transition-colors ${
                        isLiked(song.id)
                          ? 'text-cyan-400'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                      title="Like song"
                      aria-label="Like song"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked(song.id) ? 'fill-current' : ''
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => onOpenDownloadModal(song)}
                      className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white rounded-full transition-colors"
                      title="Download song (MP3 / Offline)"
                      aria-label="Download song"
                    >
                      <Download className="w-4 h-4" />
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
