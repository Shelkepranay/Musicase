import React, { useEffect, useRef } from 'react';
import { Song } from '../types';

interface YouTubeEngineProps {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onSongEnd: () => void;
  onPlayerReady?: () => void;
  onError?: (err: any) => void;
  seekTime: number | null;
  onSeekComplete: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubeEngine: React.FC<YouTubeEngineProps> = ({
  currentSong,
  isPlaying,
  volume,
  isMuted,
  onTimeUpdate,
  onSongEnd,
  onPlayerReady,
  onError,
  seekTime,
  onSeekComplete,
}) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<any>(null);
  const isReadyRef = useRef<boolean>(false);

  // Initialize YT API if needed
  useEffect(() => {
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player || !containerRef.current) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId: currentSong ? currentSong.id : 'fHI8X4OXluQ',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            isReadyRef.current = true;
            event.target.setVolume(isMuted ? 0 : volume);
            if (isPlaying) {
              event.target.playVideo();
            }
            if (onPlayerReady) onPlayerReady();
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED = 0
            if (event.data === 0) {
              onSongEnd();
            }
          },
          onError: (event: any) => {
            console.warn('YouTube playback warning/error:', event.data);
            if (onError) onError(event.data);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (existingCallback) existingCallback();
        initPlayer();
      };
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, []);

  // Handle song change
  useEffect(() => {
    if (!currentSong || !playerRef.current || !isReadyRef.current) return;
    try {
      if (typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById(currentSong.id);
        if (isPlaying) {
          playerRef.current.playVideo();
        }
      }
    } catch (e) {
      console.warn('Error loading video by ID', e);
    }
  }, [currentSong?.id]);

  // Handle play/pause
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (e) {}
  }, [isPlaying]);

  // Handle volume & mute
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    } catch (e) {}
  }, [volume, isMuted]);

  // Handle seeking
  useEffect(() => {
    if (seekTime !== null && playerRef.current && isReadyRef.current) {
      try {
        playerRef.current.seekTo(seekTime, true);
        onSeekComplete();
      } catch (e) {}
    }
  }, [seekTime]);

  // Time tracking loop
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!playerRef.current || !isReadyRef.current) return;
      try {
        if (typeof playerRef.current.getCurrentTime === 'function') {
          const cur = playerRef.current.getCurrentTime() || 0;
          const dur = playerRef.current.getDuration() || 0;
          onTimeUpdate(cur, dur);
        }
      } catch (e) {}
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onTimeUpdate]);

  return (
    <div className="fixed bottom-[-9999px] left-[-9999px] w-[1px] h-[1px] opacity-0 pointer-events-none overflow-hidden">
      <div ref={containerRef} id="youtube-audio-player" />
    </div>
  );
};
