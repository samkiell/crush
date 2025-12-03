'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { AlertTriangle, Lock } from 'lucide-react';

export default function CBTIntegrityGuard({ sessionId, children }) {
  const router = useRouter();
  const [warnings, setWarnings] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  // --- Socket Connection ---
  // --- Socket Connection ---
  useEffect(() => {
    const initSocket = async () => {
      await fetch('/api/socket/io'); // Ensure server is running
      
      const socket = io({ 
        path: '/api/socket/io',
        addTrailingSlash: false,
      });
      
      socket.on('connect', () => {
          socket.emit('join-session', sessionId);
      });

      socket.on('sessionLocked', (data) => {
        setIsLocked(true);
        setLockReason(data.reason);
      });

      return socket;
    };

    let socketInstance;
    initSocket().then(s => { socketInstance = s; });

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, [sessionId]);

  // --- Integrity Logger ---
  const logIntegrityEvent = useCallback(async (eventType, details = {}) => {
    try {
      const res = await fetch(`/api/cbt/${sessionId}/integrity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, details }),
      });
      const data = await res.json();
      
      if (data.locked) {
        setIsLocked(true);
        setLockReason(data.reason);
      }
      if (data.warnings) {
        setWarnings(data.warnings);
      }
    } catch (err) {
      console.error("Failed to log integrity event", err);
    }
  }, [sessionId]);

  // --- Event Listeners ---
  useEffect(() => {
    if (isLocked) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowOverlay(true);
        logIntegrityEvent('visibilitychange', { hidden: true });
      } else {
        setShowOverlay(false);
      }
    };

    const handleBlur = () => {
        // Optional: Blur can be annoying if user clicks outside iframe or something. 
        // Use with caution.
        logIntegrityEvent('blur');
    };

    const handleResize = () => {
        // Debounce this in production
        logIntegrityEvent('resize', { 
            width: window.innerWidth, 
            height: window.innerHeight 
        });
    };

    // Mobile Shake (Experimental - requires devicemotion permission usually)
    // Skipping complex implementation for brevity, but placeholder:
    // window.addEventListener('devicemotion', handleShake);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('resize', handleResize);
    
    // Prevent context menu
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isLocked, logIntegrityEvent]);

  // --- Render Locked State ---
  if (isLocked) {
    return (
      <div className="fixed z-50 bg-base-100 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-12 h-12 text-error" />
        </div>
        <h1 className="text-3xl font-bold text-error mb-4">Session Locked</h1>
        <p className="text-lg text-base-content/70 max-w-md mb-8">
          {lockReason || "Your session has been terminated due to integrity violations."}
        </p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="btn btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Watermark */}
      <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03] flex items-center justify-center overflow-hidden select-none">
         <div className="transform -rotate-45 text-4xl font-black whitespace-nowrap">
            {Array(20).fill(`Crush EduPlace Intl `).join(' ')}
         </div>
      </div>

      {/* Warning Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center text-white">
          <AlertTriangle className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold">Exam Paused</h2>
          <p className="mt-2 text-xl">Switch back immediately!</p>
        </div>
      )}

      {children}
    </div>
  );
}
