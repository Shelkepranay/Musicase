import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-500/90 text-black px-3.5 py-1 text-xs font-bold shadow-lg border border-amber-300/40 backdrop-blur-md transition-all animate-bounce"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode &bull; Cached and downloaded music available</span>
    </div>
  );
};
