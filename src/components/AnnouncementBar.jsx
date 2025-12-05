'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, ExternalLink, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AnnouncementBar() {
  const socket = useSocket();
  const router = useRouter();
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch latest active announcement on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/announcements?limit=1');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setAnnouncement(data.data[0]);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    };

    fetchLatest();
  }, []);

  // Listen for real-time announcements
  useEffect(() => {
    if (!socket) return;

    const handleNewAnnouncement = (newAnnouncement) => {
      setAnnouncement(newAnnouncement);
      setIsVisible(true);
      
      // Play a subtle notification sound if desired
      // try {
      //   const audio = new Audio('/sounds/notification.mp3'); 
      //   audio.play().catch(() => {}); 
      // } catch (e) {}
    };

    socket.on('announcement:new', handleNewAnnouncement);

    return () => {
      socket.off('announcement:new', handleNewAnnouncement);
    };
  }, [socket]);

  if (!announcement || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    // Optional: Save dismissed ID to localStorage to prevent showing again in this session
    sessionStorage.setItem('dismissed_announcement', announcement._id);
  };

  // Check if already dismissed in this session
  if (typeof window !== 'undefined' && sessionStorage.getItem('dismissed_announcement') === announcement._id) {
    return null;
  }

  const handleClick = () => {
    if (announcement.link) {
      if (announcement.link.startsWith('http')) {
        window.open(announcement.link, '_blank');
      } else {
        router.push(announcement.link);
      }
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'maintenance': return 'bg-red-500';
      case 'update': return 'bg-blue-500';
      case 'system': return 'bg-amber-500';
      default: return 'bg-indigo-500';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative z-50 w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center flex-1 cursor-pointer" onClick={handleClick}>
              <span className={`flex p-2 rounded-lg ${getCategoryColor(announcement.category)}`}>
                <Megaphone className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <div className="ml-3 font-medium truncate">
                <span className="md:hidden">{announcement.title}</span>
                <span className="hidden md:inline">
                  <span className="font-bold mr-2">{announcement.title}:</span>
                  {announcement.message}
                </span>
              </div>
              {announcement.link && (
                <span className="ml-2 hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-colors">
                  View <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              )}
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
              <button
                type="button"
                className="-mr-1 flex p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                onClick={handleDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
