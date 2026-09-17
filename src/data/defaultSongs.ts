import { Playlist, Song } from '../types';

export const INITIAL_SONGS: Song[] = [
  {
    id: "fHI8X4OXluQ",
    title: "Blinding Lights",
    author: "The Weeknd",
    duration: "3:24",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    category: "Hits",
    is8D: true,
    views: "2.8B views"
  },
  {
    id: "4NRXx6U8ABQ",
    title: "Starboy (8D Audio Beast Edition)",
    author: "The Weeknd ft. Daft Punk",
    duration: "3:50",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    category: "8D Audio",
    is8D: true,
    views: "1.4B views"
  },
  {
    id: "JGwWNGJdvx8",
    title: "Shape of You (360° Binaural Orbit)",
    author: "Ed Sheeran",
    duration: "3:53",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80",
    category: "8D Audio",
    is8D: true,
    views: "6.1B views"
  },
  {
    id: "pAgnJDJN4VA",
    title: "Back In Black (Gym Heavy Bass)",
    author: "AC/DC",
    duration: "4:15",
    thumbnail: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80",
    category: "Beast Workout",
    is8D: true,
    views: "980M views"
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Despacito (8D Ultra Panning)",
    author: "Luis Fonsi ft. Daddy Yankee",
    duration: "4:42",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
    category: "Hits",
    is8D: true,
    views: "8.4B views"
  },
  {
    id: "kXYiU_JCYtU",
    title: "Numb / Encore (Aggressive Beast Mix)",
    author: "Linkin Park & Jay-Z",
    duration: "3:25",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    category: "Beast Workout",
    is8D: true,
    views: "520M views"
  },
  {
    id: "OPf0YbXqDm0",
    title: "Uptown Funk",
    author: "Mark Ronson ft. Bruno Mars",
    duration: "4:30",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    category: "Workout",
    is8D: false,
    views: "5.1B views"
  },
  {
    id: "YykjpeuMNEk",
    title: "Hymn For The Weekend (8D Headphone Trip)",
    author: "Coldplay (Seeb Remix)",
    duration: "3:32",
    thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    category: "8D Audio",
    is8D: true,
    views: "2.1B views"
  },
  {
    id: "09R8_2nJtjg",
    title: "Sugar (EarPod Sub-Bass Boost)",
    author: "Maroon 5",
    duration: "3:55",
    thumbnail: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
    category: "Hits",
    is8D: true,
    views: "3.9B views"
  },
  {
    id: "fJ9rUzIMcZQ",
    title: "Bohemian Rhapsody (Acoustic 8D Sphere)",
    author: "Queen",
    duration: "5:55",
    thumbnail: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=600&auto=format&fit=crop&q=80",
    category: "Hits",
    is8D: true,
    views: "1.7B views"
  },
  {
    id: "SlPhMPnQ58k",
    title: "Memories (Lo-Fi Late Night 8D)",
    author: "Maroon 5",
    duration: "3:09",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
    category: "Lo-Fi",
    is8D: true,
    views: "920M views"
  },
  {
    id: "nYh-n7EOtMA",
    title: "Chandelier (360° Vocal Hall)",
    author: "Sia",
    duration: "3:51",
    thumbnail: "https://images.unsplash.com/photo-1445985543470-41fdd5c31447?w=600&auto=format&fit=crop&q=80",
    category: "Hits",
    is8D: true,
    views: "2.6B views"
  }
];

export const FEATURED_PLAYLISTS: Playlist[] = [
  {
    id: "beast-mode-gym",
    name: "⚡ Beast Mode Workout",
    description: "High-voltage adrenaline, +15dB sub-bass and phonk designed for EarPods & max reps.",
    cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    songs: INITIAL_SONGS.filter(s => s.category === "Beast Workout" || s.is8D)
  },
  {
    id: "8d-spatial-orbit",
    name: "🎧 8D EarPod Dimension",
    description: "Put on your earphones. Feel the sound rotating 360 degrees around your mind.",
    cover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    songs: INITIAL_SONGS.filter(s => s.is8D)
  },
  {
    id: "global-top-hits",
    name: "🔥 Global Hot 50",
    description: "The most streamed songs on YouTube, ready to stream or download instantly.",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    songs: INITIAL_SONGS
  },
  {
    id: "late-night-lofi",
    name: "🌙 Midnight Lo-Fi & Chill",
    description: "Slow reverb, gentle 8D panning, cozy beats for study, work, or sleep.",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    songs: INITIAL_SONGS.filter(s => s.category === "Lo-Fi" || s.category === "Hits")
  }
];

export const GENRE_TAGS = [
  "All Songs",
  "8D Audio",
  "Beast Workout",
  "Gym Phonk",
  "Hip-Hop",
  "Pop Hits",
  "EDM & Bass",
  "Rock",
  "Lo-Fi Chill",
  "Motivation"
];
