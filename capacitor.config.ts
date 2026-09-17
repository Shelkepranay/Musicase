import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.music8d.player',
  appName: 'Music8D',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      backgroundColor: '#0b0c10',
      style: 'DARK',
    },
  },
};

export default config;
