'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationToast() {
  const socket = useSocket();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      // Add new notification to the list
      const id = Date.now();
      setNotifications(prev => [...prev, { ...notification, id }]);

      // Play sound
      try {
        // const audio = new Audio('/sounds/notification.mp3');
        // audio.play().catch(() => {});
      } catch (e) {}

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClick = (notification) => {
    if (notification.link) {
      if (notification.link.startsWith('http')) {
        window.open(notification.link, '_blank');
      } else {
        router.push(notification.link);
      }
    }
    removeNotification(notification.id);
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            layout
            className="pointer-events-auto w-80 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
            onClick={() => handleClick(notification)}
          >
            <div className="p-4 flex gap-3">
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                notification.type === 'alert' ? 'bg-red-100 text-red-600' :
                notification.type === 'community_post' ? 'bg-indigo-100 text-indigo-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                  {notification.message}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {notification.link && (
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                View Details <ExternalLink className="w-3 h-3" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
