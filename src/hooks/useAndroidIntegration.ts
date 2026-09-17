import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Song } from '../types';

interface AndroidIntegrationProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  // Modal & Navigation States for Hardware Back Button
  isFullscreenOpen: boolean;
  onCloseFullscreen: () => void;
  isDownloadModalOpen: boolean;
  onCloseDownloadModal: () => void;
  isUrlModalOpen: boolean;
  onCloseUrlModal: () => void;
  hasSelectedPlaylist: boolean;
  onClosePlaylist: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export function useAndroidIntegration({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  isFullscreenOpen,
  onCloseFullscreen,
  isDownloadModalOpen,
  onCloseDownloadModal,
  isUrlModalOpen,
  onCloseUrlModal,
  hasSelectedPlaylist,
  onClosePlaylist,
  currentTab,
  onSelectTab,
}: AndroidIntegrationProps) {
  // 1. Android Status Bar Styling
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#0b0c10' }).catch(() => {});
    }
  }, []);

  // 2. Android Hardware Back Button Handling
  useEffect(() => {
    const backListenerPromise = App.addListener('backButton', () => {
      if (isFullscreenOpen) {
        onCloseFullscreen();
        return;
      }
      if (isDownloadModalOpen) {
        onCloseDownloadModal();
        return;
      }
      if (isUrlModalOpen) {
        onCloseUrlModal();
        return;
      }
      if (hasSelectedPlaylist) {
        onClosePlaylist();
        return;
      }
      if (currentTab !== 'home') {
        onSelectTab('home');
        return;
      }
      // On root home view, exit or minimize app
      App.exitApp();
    });

    return () => {
      backListenerPromise.then((handle) => handle.remove()).catch(() => {});
    };
  }, [
    isFullscreenOpen,
    isDownloadModalOpen,
    isUrlModalOpen,
    hasSelectedPlaylist,
    currentTab,
    onCloseFullscreen,
    onCloseDownloadModal,
    onCloseUrlModal,
    onClosePlaylist,
    onSelectTab,
  ]);

  // 3. Android MediaSession API (Lock screen, Bluetooth car controls, Notification shade)
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return;

    try {
      const art = currentSong.thumbnail || '/pwa-512x512.png';
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.author,
        album: currentSong.genre ? `${currentSong.genre} • 8D Audio` : 'Music8D Android',
        artwork: [
          { src: art, sizes: '96x96', type: 'image/jpeg' },
          { src: art, sizes: '128x128', type: 'image/jpeg' },
          { src: art, sizes: '192x192', type: 'image/jpeg' },
          { src: art, sizes: '256x256', type: 'image/jpeg' },
          { src: art, sizes: '384x384', type: 'image/jpeg' },
          { src: art, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      // Media action handlers
      navigator.mediaSession.setActionHandler('play', () => {
        if (!isPlaying) onTogglePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (isPlaying) onTogglePlay();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        onPrev();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        onNext();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          onSeek(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const offset = details.seekOffset || 10;
        onSeek(Math.max(0, currentTime - offset));
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const offset = details.seekOffset || 10;
        onSeek(Math.min(duration, currentTime + offset));
      });

      // Update position state for scrub bar in Android notifications
      if ('setPositionState' in navigator.mediaSession && duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: Math.max(duration, 1),
          playbackRate: 1,
          position: Math.min(Math.max(currentTime, 0), duration),
        });
      }
    } catch (e) {
      console.warn('Android MediaSession update error:', e);
    }
  }, [currentSong, isPlaying, currentTime, duration, onTogglePlay, onNext, onPrev, onSeek]);
}
