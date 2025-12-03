'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(true);
    const [wasOffline, setWasOffline] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Set initial state
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Handle reconnection sync
    useEffect(() => {
        if (!isOnline) {
            setWasOffline(true);
        } else if (wasOffline) {
            toast.success("Back online! Updating content...", {
                icon: <Wifi className="w-4 h-4 text-success" />,
                duration: 3000
            });
            router.refresh(); // Re-fetch server data
            setWasOffline(false);
        }
    }, [isOnline, wasOffline, router]);

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[100]"
                >
                    <div className="bg-error/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium border border-white/10">
                        <WifiOff className="w-4 h-4" />
                        <span>You are offline</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
