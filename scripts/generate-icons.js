import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer: height rows, each row has 1 filter byte (0) + width * 4 bytes
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // Bit depth
  ihdr[9] = 6;  // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);
  const toCrc = Buffer.concat([typeBuf, data]);
  chunk.writeUInt32BE(crc32(toCrc), 8 + len);
  return chunk;
}

// Draw brand icon: dark background, headphones, sound waves, beast lightning
function drawAppIcon(isMaskable) {
  return function(x, y, w, h) {
    // Normalization
    const nx = x / w;
    const ny = y / h;

    // Corner rounding for regular icon
    if (!isMaskable) {
      const radius = 0.22;
      const dx = Math.max(0, Math.max(radius - nx, nx - (1 - radius)));
      const dy = Math.max(0, Math.max(radius - ny, ny - (1 - radius)));
      if (dx > 0 && dy > 0 && Math.sqrt(dx * dx + dy * dy) > radius) {
        return [0, 0, 0, 0]; // transparent outside rounded corner
      }
    }

    // Scale for safe zone if maskable
    let cx = (nx - 0.5);
    let cy = (ny - 0.5);
    if (isMaskable) {
      cx *= 1.35;
      cy *= 1.35;
    }

    // Base background: gradient from #0b0c10 to #111827
    let r = Math.round(11 + 6 * (nx + ny));
    let g = Math.round(12 + 12 * (nx + ny));
    let b = Math.round(16 + 23 * (nx + ny));

    const distFromCenter = Math.sqrt(cx * cx + cy * cy);

    // Orbit ring (8D Sound)
    const orbitR = 0.38;
    if (Math.abs(distFromCenter - orbitR) < 0.012) {
      // cyan/emerald ring
      const angle = Math.atan2(cy, cx);
      const factor = (Math.sin(angle) + 1) / 2;
      return [
        Math.round(6 * (1 - factor) + 16 * factor),
        Math.round(182 * (1 - factor) + 185 * factor),
        Math.round(212 * (1 - factor) + 129 * factor),
        255
      ];
    }

    // Headphone arc (upper half)
    const headR = 0.26;
    if (Math.abs(distFromCenter - headR) < 0.035 && cy < 0.05) {
      return [34, 211, 238, 255]; // cyan-400
    }

    // Headphone ear cups (left: cx in [-0.32, -0.22], cy in [-0.04, 0.16])
    if (cx >= -0.32 && cx <= -0.22 && cy >= -0.04 && cy <= 0.16) {
      return [34, 211, 238, 255];
    }
    // right ear cup:
    if (cx >= 0.22 && cx <= 0.32 && cy >= -0.04 && cy <= 0.16) {
      return [16, 185, 129, 255];
    }

    // Center Lightning Bolt (Beast Mode)
    // Points: (-0.02, -0.12) to (-0.08, 0.0) to (0.02, 0.0) to (-0.04, 0.15) to (0.08, -0.01) to (-0.01, -0.01)
    if (Math.abs(cx) < 0.14 && cy >= -0.15 && cy <= 0.15) {
      // Check if inside lightning polygon
      const inTopSegment = (cy >= -0.14 && cy <= 0.01 && cx >= (-0.08 + (cy + 0.14) * 0.4) && cx <= (0.04 + (cy + 0.14) * 0.2));
      const inBotSegment = (cy >= -0.01 && cy <= 0.15 && cx >= (-0.05 + (cy) * 0.6) && cx <= (0.09 - (cy) * 0.3));
      if (inTopSegment || inBotSegment) {
        // glowing bright cyan/emerald
        return [52, 211, 153, 255];
      }
    }

    // Sound wave vertical bars
    const barWidth = 0.02;
    // Bar 1: cx in [-0.16, -0.14], cy in [-0.06, 0.06]
    if (Math.abs(cx - (-0.14)) < barWidth / 2 && Math.abs(cy) < 0.08) {
      return [6, 182, 212, 230];
    }
    // Bar 2: cx in [0.14, 0.16], cy in [-0.06, 0.06]
    if (Math.abs(cx - 0.14) < barWidth / 2 && Math.abs(cy) < 0.08) {
      return [16, 185, 129, 230];
    }

    return [r, g, b, 255];
  };
}

fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192, drawAppIcon(false)));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512, drawAppIcon(false)));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180, drawAppIcon(false)));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512, drawAppIcon(true)));
fs.writeFileSync('public/favicon.ico', createPNG(32, 32, drawAppIcon(false)));

console.log('Successfully generated all PWA icons!');
