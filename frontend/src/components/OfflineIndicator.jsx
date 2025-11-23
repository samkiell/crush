'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Set initial state
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            toast.success('You are back online! 🌐', {
                duration: 3000,
            });
        };

        const handleOffline = () => {
            setIsOnline(false);
            toast.error('You are offline. Some features may be limited.', {
                duration: 5000,
            });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-error text-error-content py-2 px-4 text-center text-sm font-medium">
            <span className="inline-flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-error-content rounded-full animate-pulse"></span>
                Offline Mode - Some features may be limited
            </span>
        </div>
    );
}
