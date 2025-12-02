'use client';
import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function OfflineSyncStatus({ isOnline }) {
  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-warning text-warning-content px-3 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium animate-pulse">
      <WifiOff size={16} />
      <span>Offline Mode</span>
    </div>
  );
}
