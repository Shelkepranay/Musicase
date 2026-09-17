var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var FEATURED_SONGS = [
  {
    id: "fHI8X4OXluQ",
    title: "The Weeknd - Blinding Lights",
    author: "The Weeknd",
    duration: "3:24",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    category: "Hits",
    is8D: true
  },
  {
    id: "4NRXx6U8ABQ",
    title: "Starboy (8D Audio / Beast Edition)",
    author: "The Weeknd ft. Daft Punk",
    duration: "3:50",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    category: "8D Audio",
    is8D: true
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Luis Fonsi - Despacito (Bass Boosted 8D)",
    author: "Luis Fonsi",
    duration: "4:42",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
    category: "Hits",
    is8D: true
  },
  {
    id: "OPf0YbXqDm0",
    title: "Mark Ronson - Uptown Funk ft. Bruno Mars",
    author: "Mark Ronson",
    duration: "4:30",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    category: "Workout",
    is8D: false
  },
  {
    id: "JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You (8D Surround Sound)",
    author: "Ed Sheeran",
    duration: "3:53",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80",
    category: "8D Audio",
    is8D: true
  },
  {
    id: "pAgnJDJN4VA",
    title: "AC/DC - Back In Black (Gym Beast Mode)",
    author: "AC/DC",
    duration: "4:15",
    thumbnail: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80",
    category: "Beast Workout",
    is8D: true
  },
  {
    id: "kXYiU_JCYtU",
    title: "Numb / Encore - Linkin Park & Jay-Z",
    author: "Linkin Park",
    duration: "3:25",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    category: "Beast Workout",
    is8D: true
  },
  {
    id: "YykjpeuMNEk",
    title: "Hymn for the Weekend (Seeb Remix 8D)",
    author: "Coldplay",
    duration: "3:32",
    thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80",
    category: "8D Audio",
    is8D: true
  },
  {
    id: "09R8_2nJtjg",
    title: "Maroon 5 - Sugar (Ultra Bass 8D)",
    author: "Maroon 5",
    duration: "3:55",
    thumbnail: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
    category: "Hits",
    is8D: true
  },
  {
    id: "fJ9rUzIMcZQ",
    title: "Queen - Bohemian Rhapsody (360 Spatial Audio)",
    author: "Queen",
    duration: "5:55",
    thumbnail: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500&auto=format&fit=crop&q=80",
    category: "Hits",
    is8D: true
  },
  {
    id: "SlPhMPnQ58k",
    title: "Memories - Maroon 5 (Chill Lo-Fi / 8D)",
    author: "Maroon 5",
    duration: "3:09",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80",
    category: "Lo-Fi",
    is8D: true
  },
  {
    id: "nYh-n7EOtMA",
    title: "Sia - Chandelier (Acoustic 8D Orbit)",
    author: "Sia",
    duration: "3:51",
    thumbnail: "https://images.unsplash.com/photo-1445985543470-41fdd5c31447?w=500&auto=format&fit=crop&q=80",
    category: "Hits",
    is8D: true
  }
];
async function searchYouTube(query) {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    const html = await response.text();
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/s) || html.match(/ytInitialData\s*=\s*({.+?});/s);
    if (!match) {
      return [];
    }
    const data = JSON.parse(match[1]);
    const sections = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
    const results = [];
    for (const section of sections) {
      const items = section?.itemSectionRenderer?.contents || [];
      for (const item of items) {
        const v = item.videoRenderer;
        if (v && v.videoId) {
          const title = v.title?.runs?.map((r) => r.text).join("") || v.title?.simpleText || "Unknown Track";
          const author = v.ownerText?.runs?.[0]?.text || v.shortBylineText?.runs?.[0]?.text || "YouTube Music";
          const duration = v.lengthText?.simpleText || "3:30";
          const thumbnail = v.thumbnail?.thumbnails?.[v.thumbnail.thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;
          const viewCount = v.viewCountText?.simpleText || "";
          results.push({
            id: v.videoId,
            title,
            author,
            duration,
            thumbnail,
            views: viewCount,
            is8D: title.toLowerCase().includes("8d") || query.toLowerCase().includes("8d")
          });
          if (results.length >= 25) break;
        }
      }
      if (results.length >= 25) break;
    }
    return results;
  } catch (error) {
    console.error("YouTube search error:", error);
    return [];
  }
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});
app.get("/api/featured", (req, res) => {
  res.json({ songs: FEATURED_SONGS });
});
app.get("/api/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) {
    return res.json({ results: FEATURED_SONGS });
  }
  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const directMatch = q.match(ytRegex);
  const directId = directMatch ? directMatch[1] : q.length === 11 && !q.includes(" ") ? q : null;
  if (directId) {
    return res.json({
      results: [
        {
          id: directId,
          title: `YouTube Track (${directId})`,
          author: "YouTube Creator",
          duration: "Stream",
          thumbnail: `https://i.ytimg.com/vi/${directId}/hqdefault.jpg`,
          is8D: false
        }
      ]
    });
  }
  const scraped = await searchYouTube(q);
  if (scraped.length > 0) {
    return res.json({ results: scraped });
  }
  const filtered = FEATURED_SONGS.filter(
    (s) => s.title.toLowerCase().includes(q.toLowerCase()) || s.author.toLowerCase().includes(q.toLowerCase()) || s.category.toLowerCase().includes(q.toLowerCase())
  );
  return res.json({ results: filtered.length > 0 ? filtered : FEATURED_SONGS });
});
app.get("/api/download-info", (req, res) => {
  const { id, title, author } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Missing song id" });
  }
  res.json({
    id,
    title: title || "Song",
    author: author || "Artist",
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
    // Audio conversion / download partners & client synthesis
    downloadOptions: [
      {
        format: "MP3 320kbps (HQ)",
        quality: "320 kbps",
        type: "audio/mp3",
        name: `${title || "Track"}.mp3`
      },
      {
        format: "MP3 192kbps (Standard)",
        quality: "192 kbps",
        type: "audio/mp3",
        name: `${title || "Track"}.mp3`
      },
      {
        format: "Offline Cache",
        quality: "Lossless EarPod Beast Cache",
        type: "offline-cache",
        name: `${title || "Track"}`
      }
    ]
  });
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
start();
//# sourceMappingURL=server.cjs.map
