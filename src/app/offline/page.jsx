'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, Home, BookOpen } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-6 text-center">
      <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <WifiOff className="w-12 h-12 text-error" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2 text-base-content">You are Offline</h1>
      <p className="text-base-content/70 mb-8 max-w-md">
        It seems you've lost your internet connection. Don't worry, you can still access your downloaded study materials and cached exams.
      </p>

      <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary w-full gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Reconnecting
        </button>

        <Link href="/dashboard" className="btn btn-outline w-full gap-2">
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>

        <Link href="/study" className="btn btn-ghost w-full gap-2">
          <BookOpen className="w-4 h-4" />
          Access Offline Study
        </Link>
      </div>

      <div className="mt-12 text-sm text-base-content/50">
        <p>Your progress will be synced when you're back online.</p>
      </div>
    </div>
  );
}
