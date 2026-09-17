import React, { useState } from 'react';
import { Link2, X, Play, Youtube, AlertCircle } from 'lucide-react';
import { Song } from '../types';

interface YouTubeUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaySong: (song: Song) => void;
}

export const YouTubeUrlModal: React.FC<YouTubeUrlModalProps> = ({
  isOpen,
  onClose,
  onPlaySong,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const extractVideoId = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Direct 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    // YouTube URL patterns
    const regExp =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = trimmed.match(regExp);

    return match && match[1].length === 11 ? match[1] : null;
  };

  const handlePlay = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const videoId = extractVideoId(urlInput);
    if (!videoId) {
      setError('Please enter a valid YouTube URL (e.g., https://youtu.be/... or video ID)');
      return;
    }

    const customSong: Song = {
      id: videoId,
      title: `YouTube Song (${videoId})`,
      author: 'YouTube Streaming Track',
      duration: 'Stream',
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      is8D: true,
      category: 'Custom YouTube',
    };

    onPlaySong(customSong);
    setUrlInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-[#12141a] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Paste YouTube Link</h3>
            <p className="text-xs text-zinc-400">Play any song directly from YouTube</p>
          </div>
        </div>

        <form onSubmit={handlePlay} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              YouTube Video Link or ID
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="https://www.youtube.com/watch?v=... or ID"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:border-cyan-400 focus:outline-none"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-400 text-black hover:bg-cyan-300 shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Play Track</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
