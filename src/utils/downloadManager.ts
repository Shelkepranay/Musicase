import { DownloadItem, Song } from '../types';

const STORAGE_KEY = 'beast_music_downloads_v1';
const LIKED_KEY = 'beast_music_liked_v1';

export const downloadManager = {
  getDownloads(): DownloadItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveDownloads(items: DownloadItem[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save downloads to localStorage', e);
    }
  },

  isSongDownloaded(songId: string): boolean {
    const list = this.getDownloads();
    return list.some((item) => item.song.id === songId && item.status === 'completed');
  },

  // Trigger browser file download (MP3/Audio)
  triggerFileDownload(song: Song, format: string = '320kbps MP3') {
    // Create a simulated high quality audio blob or link
    const cleanTitle = song.title.replace(/[^\w\s-]/gi, '').trim();
    const cleanAuthor = song.author.replace(/[^\w\s-]/gi, '').trim();
    const filename = `${cleanAuthor} - ${cleanTitle} [${format}].mp3`;

    // Generate simulated audio stream data or metadata container
    const headerData = `ID3v2.4.0\nTitle: ${song.title}\nArtist: ${song.author}\nSource: YouTube (${song.id})\nBitrate: 320kbps Stereo 8D\nEngine: Beast Mode Audio Engine\n`;
    const dummyAudioBuffer = new Uint8Array(1024 * 64); // mock audio chunk
    for (let i = 0; i < dummyAudioBuffer.length; i++) {
      dummyAudioBuffer[i] = Math.floor(Math.random() * 256);
    }
    const blob = new Blob([headerData, dummyAudioBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  // Add to in-app Offline library
  async downloadSong(
    song: Song,
    onProgress?: (progress: number) => void
  ): Promise<DownloadItem> {
    const downloads = this.getDownloads();
    const existing = downloads.find((d) => d.song.id === song.id);
    if (existing && existing.status === 'completed') {
      return existing;
    }

    const newItem: DownloadItem = {
      id: `dl_${song.id}_${Date.now()}`,
      song: { ...song, isDownloaded: true },
      format: 'MP3 (320kbps HQ)',
      quality: 'Lossless 8D Spatial Audio',
      size: `${(Math.random() * 4 + 6).toFixed(1)} MB`,
      downloadedAt: Date.now(),
      status: 'downloading',
      progress: 10,
    };

    const updated = [newItem, ...downloads.filter((d) => d.song.id !== song.id)];
    this.saveDownloads(updated);

    // Simulate progress smoothly
    return new Promise((resolve) => {
      let p = 20;
      const interval = setInterval(() => {
        p += 25;
        if (onProgress) onProgress(p);

        if (p >= 100) {
          clearInterval(interval);
          newItem.status = 'completed';
          newItem.progress = 100;
          this.saveDownloads(
            this.getDownloads().map((d) => (d.id === newItem.id ? newItem : d))
          );
          resolve(newItem);
        }
      }, 250);
    });
  },

  removeDownload(songId: string) {
    const list = this.getDownloads().filter((item) => item.song.id !== songId);
    this.saveDownloads(list);
  },

  // Liked songs persistence
  getLikedSongs(): string[] {
    try {
      const raw = localStorage.getItem(LIKED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  toggleLike(songId: string): boolean {
    const liked = this.getLikedSongs();
    let updated: string[];
    let isNowLiked = false;
    if (liked.includes(songId)) {
      updated = liked.filter((id) => id !== songId);
    } else {
      updated = [...liked, songId];
      isNowLiked = true;
    }
    localStorage.setItem(LIKED_KEY, JSON.stringify(updated));
    return isNowLiked;
  }
};
