import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  INITIAL_SONGS,
  FEATURED_PLAYLISTS,
} from './data/defaultSongs';
import {
  BeastModeSettings,
  DownloadItem,
  PlayerState,
  Playlist,
  Song,
  Sound8DSettings,
} from './types';
import { audioEngine } from './utils/audioEngine';
import { downloadManager } from './utils/downloadManager';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PlayerBar } from './components/PlayerBar';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { BeastModeStation } from './components/BeastModeStation';
import { LibraryView } from './components/LibraryView';
import { DownloadsView } from './components/DownloadsView';
import { PlaylistDetailView } from './components/PlaylistDetailView';
import { YouTubeEngine } from './components/YouTubeEngine';
import { DownloadModal } from './components/DownloadModal';
import { YouTubeUrlModal } from './components/YouTubeUrlModal';
import { FullscreenPlayer } from './components/FullscreenPlayer';
import { MobileNav } from './components/MobileNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AndroidAppModal } from './components/AndroidAppModal';
import { useAndroidIntegration } from './hooks/useAndroidIntegration';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Playlists and Songs
  const [playlists, setPlaylists] = useState<Playlist[]>(FEATURED_PLAYLISTS);
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>(INITIAL_SONGS);
  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>(INITIAL_SONGS);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  // Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: INITIAL_SONGS[0],
    isPlaying: false,
    currentTime: 0,
    duration: 204,
    volume: 80,
    isMuted: false,
    shuffle: false,
    repeat: 'off',
    queue: INITIAL_SONGS,
    history: [],
  });

  // Seek Control
  const [seekTarget, setSeekTarget] = useState<number | null>(null);

  // 8D Audio Settings
  const [sound8D, setSound8D] = useState<Sound8DSettings>({
    enabled: true,
    orbitSpeed: 0.25, // 4-second rotation
    reverbDepth: 30,
    orbitAngle: 0,
    direction: 'clockwise',
    panWidth: 100,
  });

  // Beast Mode Settings (EarPods)
  const [beastMode, setBeastMode] = useState<BeastModeSettings>({
    active: true,
    subBassBoost: 14, // +14 dB Sub-Bass Boost
    earpodClarity: 6, // +6 dB Vocal Crisp
    punchCompressor: true,
    preset: 'airpods_pro',
  });

  // Modals
  const [downloadModalSong, setDownloadModalSong] = useState<Song | null>(null);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  // Initialize stored data & fetch from server
  useEffect(() => {
    setLikedSongIds(downloadManager.getLikedSongs());
    setDownloads(downloadManager.getDownloads());

    // Fetch initial featured from server
    fetch('/api/featured')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.songs && data.songs.length > 0) {
          setFeaturedSongs(data.songs);
        }
      })
      .catch(() => {});
  }, []);

  // Update Audio Engine when 8D or Beast Mode changes
  useEffect(() => {
    audioEngine.update8DSettings(sound8D);
  }, [sound8D]);

  useEffect(() => {
    audioEngine.updateBeastMode(beastMode);
  }, [beastMode]);

  // Handle YouTube Search with Debounce
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(featuredSongs);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data && data.results) {
          setSearchResults(data.results);
        }
      } catch (err) {
        // Fallback filter
        const filtered = featuredSongs.filter(
          (s) =>
            s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.author.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, [featuredSongs]);

  // Track playback controls
  const handlePlaySong = (song: Song) => {
    audioEngine.ensureContext();
    setPlayerState((prev) => {
      const isSame = prev.currentSong?.id === song.id;
      return {
        ...prev,
        currentSong: song,
        isPlaying: isSame ? !prev.isPlaying : true,
        history: prev.currentSong && !isSame ? [prev.currentSong, ...prev.history.slice(0, 15)] : prev.history,
      };
    });
  };

  const handlePlayAll = (songs: Song[]) => {
    if (songs.length === 0) return;
    audioEngine.ensureContext();
    setPlayerState((prev) => ({
      ...prev,
      currentSong: songs[0],
      isPlaying: true,
      queue: songs,
    }));
  };

  const handleTogglePlay = () => {
    audioEngine.ensureContext();
    setPlayerState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleNext = () => {
    setPlayerState((prev) => {
      const list = prev.queue.length > 0 ? prev.queue : featuredSongs;
      if (!prev.currentSong || list.length === 0) return prev;

      let nextIndex = 0;
      if (prev.shuffle) {
        nextIndex = Math.floor(Math.random() * list.length);
      } else {
        const curIdx = list.findIndex((s) => s.id === prev.currentSong?.id);
        nextIndex = (curIdx + 1) % list.length;
      }
      return {
        ...prev,
        currentSong: list[nextIndex],
        isPlaying: true,
        history: prev.currentSong ? [prev.currentSong, ...prev.history.slice(0, 15)] : prev.history,
      };
    });
  };

  const handlePrev = () => {
    setPlayerState((prev) => {
      if (prev.currentTime > 3) {
        setSeekTarget(0);
        return { ...prev, currentTime: 0 };
      }
      const list = prev.queue.length > 0 ? prev.queue : featuredSongs;
      if (!prev.currentSong || list.length === 0) return prev;
      const curIdx = list.findIndex((s) => s.id === prev.currentSong?.id);
      const prevIdx = (curIdx - 1 + list.length) % list.length;
      return {
        ...prev,
        currentSong: list[prevIdx],
        isPlaying: true,
      };
    });
  };

  const handleToggleShuffle = () => {
    setPlayerState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const handleCycleRepeat = () => {
    setPlayerState((prev) => {
      const nextRepeat =
        prev.repeat === 'off' ? 'all' : prev.repeat === 'all' ? 'one' : 'off';
      return { ...prev, repeat: nextRepeat };
    });
  };

  const handleSeek = (time: number) => {
    setSeekTarget(time);
    setPlayerState((prev) => ({ ...prev, currentTime: time }));
  };

  const handleVolumeChange = (vol: number) => {
    setPlayerState((prev) => ({ ...prev, volume: vol, isMuted: vol === 0 }));
  };

  const handleToggleMute = () => {
    setPlayerState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleToggleLike = (songId: string) => {
    downloadManager.toggleLike(songId);
    setLikedSongIds(downloadManager.getLikedSongs());
  };

  const isLiked = (songId: string) => likedSongIds.includes(songId);

  // Beast Mode & 8D Toggles
  const handleToggleBeastMode = () => {
    setBeastMode((prev) => ({ ...prev, active: !prev.active }));
  };

  const handleToggle8D = () => {
    setSound8D((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentTab('playlist-detail');
  };

  const handleCreatePlaylist = (name: string) => {
    const newPl: Playlist = {
      id: `pl_${Date.now()}`,
      name,
      description: 'Custom user created playlist',
      cover:
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      songs: [],
      isCustom: true,
    };
    setPlaylists((prev) => [...prev, newPl]);
  };

  // Build list of liked songs
  const likedSongsList = [
    ...featuredSongs,
    ...searchResults,
  ].filter((s, idx, self) => likedSongIds.includes(s.id) && self.findIndex(x => x.id === s.id) === idx);

  useAndroidIntegration({
    currentSong: playerState.currentSong,
    isPlaying: playerState.isPlaying,
    currentTime: playerState.currentTime,
    duration: playerState.duration,
    onTogglePlay: handleTogglePlay,
    onNext: handleNext,
    onPrev: handlePrev,
    onSeek: handleSeek,
    isFullscreenOpen,
    onCloseFullscreen: () => setIsFullscreenOpen(false),
    isDownloadModalOpen: !!downloadModalSong,
    onCloseDownloadModal: () => setDownloadModalSong(null),
    isUrlModalOpen,
    onCloseUrlModal: () => setIsUrlModalOpen(false),
    hasSelectedPlaylist: !!selectedPlaylist,
    onClosePlaylist: () => {
      setSelectedPlaylist(null);
      setCurrentTab('home');
    },
    currentTab,
    onSelectTab: setCurrentTab,
  });

  return (
    <div className="flex h-screen w-screen bg-[#08090c] text-[#f8fafc] overflow-hidden flex-col select-none">
      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />

      {/* Hidden YouTube Engine for Synchronized Playback */}
      <YouTubeEngine
        currentSong={playerState.currentSong}
        isPlaying={playerState.isPlaying}
        volume={playerState.volume}
        isMuted={playerState.isMuted}
        onTimeUpdate={(currentTime, duration) => {
          setPlayerState((prev) => ({
            ...prev,
            currentTime,
            duration: duration || prev.duration,
          }));
        }}
        onSongEnd={() => {
          if (playerState.repeat === 'one') {
            setSeekTarget(0);
          } else {
            handleNext();
          }
        }}
        seekTime={seekTarget}
        onSeekComplete={() => setSeekTarget(null)}
      />

      {/* Main App Layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Clean Simple Menu (Sidebar) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab !== 'playlist-detail') setSelectedPlaylist(null);
          }}
          beastMode={beastMode}
          sound8D={sound8D}
          onToggleBeastMode={handleToggleBeastMode}
          onToggle8D={handleToggle8D}
          playlists={playlists}
          onSelectPlaylist={handleSelectPlaylist}
          selectedPlaylistId={selectedPlaylist?.id}
          likedCount={likedSongIds.length}
          downloadCount={downloads.length}
          onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        />

        {/* Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-b from-[#0f1117] to-[#08090c]">
          {/* Header */}
          <Header
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              if (currentTab !== 'search') setCurrentTab('search');
              handleSearch(q);
            }}
            onSearchSubmit={(q) => {
              setCurrentTab('search');
              handleSearch(q);
            }}
            beastMode={beastMode}
            sound8D={sound8D}
            onToggleBeastMode={handleToggleBeastMode}
            onToggle8D={handleToggle8D}
            onOpenUrlModal={() => setIsUrlModalOpen(true)}
            onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
            isSearching={isSearching}
          />

          {/* Active View Container with mobile-friendly bottom spacing */}
          <main className="flex-1 overflow-y-auto pb-36 md:pb-6">
            {currentTab === 'home' && (
              <HomeView
                featuredSongs={featuredSongs}
                playlists={playlists}
                onPlaySong={handlePlaySong}
                onSelectPlaylist={handleSelectPlaylist}
                onToggleLike={handleToggleLike}
                isLiked={isLiked}
                onOpenDownloadModal={(song) => setDownloadModalSong(song)}
                currentSongId={playerState.currentSong?.id}
                isPlaying={playerState.isPlaying}
                onOpenBeastStation={() => setCurrentTab('beast-station')}
                isBeastActive={beastMode.active}
              />
            )}

            {currentTab === 'search' && (
              <SearchView
                searchQuery={searchQuery}
                onSearch={handleSearch}
                results={searchResults}
                isSearching={isSearching}
                onPlaySong={handlePlaySong}
                onToggleLike={handleToggleLike}
                isLiked={isLiked}
                onOpenDownloadModal={(song) => setDownloadModalSong(song)}
                currentSongId={playerState.currentSong?.id}
                isPlaying={playerState.isPlaying}
                onOpenUrlModal={() => setIsUrlModalOpen(true)}
              />
            )}

            {currentTab === 'beast-station' && (
              <BeastModeStation
                beastMode={beastMode}
                sound8D={sound8D}
                onUpdateBeastMode={(settings) =>
                  setBeastMode((prev) => ({ ...prev, ...settings }))
                }
                onUpdate8D={(settings) =>
                  setSound8D((prev) => ({ ...prev, ...settings }))
                }
                onPlaySong={handlePlaySong}
                beastSongs={featuredSongs.filter(
                  (s) => s.category === 'Beast Workout' || s.is8D
                )}
                isPlaying={playerState.isPlaying}
              />
            )}

            {currentTab === 'library' && (
              <LibraryView
                likedSongs={likedSongsList}
                playlists={playlists}
                history={playerState.history}
                onPlaySong={handlePlaySong}
                onToggleLike={handleToggleLike}
                onOpenDownloadModal={(song) => setDownloadModalSong(song)}
                currentSongId={playerState.currentSong?.id}
                isPlaying={playerState.isPlaying}
                onCreatePlaylist={handleCreatePlaylist}
                onSelectPlaylist={handleSelectPlaylist}
              />
            )}

            {currentTab === 'downloads' && (
              <DownloadsView
                downloads={downloads}
                onPlaySong={handlePlaySong}
                onRefreshDownloads={() => setDownloads(downloadManager.getDownloads())}
                currentSongId={playerState.currentSong?.id}
                isPlaying={playerState.isPlaying}
              />
            )}

            {currentTab === 'playlist-detail' && selectedPlaylist && (
              <PlaylistDetailView
                playlist={selectedPlaylist}
                onBack={() => setCurrentTab('home')}
                onPlaySong={handlePlaySong}
                onPlayAll={handlePlayAll}
                onToggleLike={handleToggleLike}
                isLiked={isLiked}
                onOpenDownloadModal={(song) => setDownloadModalSong(song)}
                currentSongId={playerState.currentSong?.id}
                isPlaying={playerState.isPlaying}
              />
            )}
          </main>
        </div>
      </div>

      {/* Persistent Spotify Bottom Player Bar */}
      <PlayerBar
        playerState={playerState}
        sound8D={sound8D}
        beastMode={beastMode}
        onTogglePlay={handleTogglePlay}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleShuffle={handleToggleShuffle}
        onCycleRepeat={handleCycleRepeat}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleLike={handleToggleLike}
        isLiked={playerState.currentSong ? isLiked(playerState.currentSong.id) : false}
        onOpenDownloadModal={(song) => setDownloadModalSong(song)}
        onToggleBeastMode={handleToggleBeastMode}
        onToggle8D={handleToggle8D}
        onOpenFullscreen={() => setIsFullscreenOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'playlist-detail') setSelectedPlaylist(null);
        }}
        beastMode={beastMode}
        sound8D={sound8D}
        likedCount={likedSongIds.length}
        downloadCount={downloads.length}
      />

      {/* Download Modal */}
      {downloadModalSong && (
        <DownloadModal
          song={downloadModalSong}
          onClose={() => setDownloadModalSong(null)}
          onDownloadComplete={() => setDownloads(downloadManager.getDownloads())}
        />
      )}

      {/* Paste YouTube URL Modal */}
      <YouTubeUrlModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        onPlaySong={(song) => {
          handlePlaySong(song);
          setSearchResults((prev) => [song, ...prev]);
        }}
      />

      <AndroidAppModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* Fullscreen 360° Binaural Visualizer Player */}
      <FullscreenPlayer
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        playerState={playerState}
        sound8D={sound8D}
        beastMode={beastMode}
        onTogglePlay={handleTogglePlay}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleShuffle={handleToggleShuffle}
        onCycleRepeat={handleCycleRepeat}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleLike={handleToggleLike}
        isLiked={playerState.currentSong ? isLiked(playerState.currentSong.id) : false}
        onOpenDownloadModal={(song) => setDownloadModalSong(song)}
        onUpdateBeastMode={(settings) =>
          setBeastMode((prev) => ({ ...prev, ...settings }))
        }
        onUpdate8D={(settings) =>
          setSound8D((prev) => ({ ...prev, ...settings }))
        }
      />
    </div>
  );
}
