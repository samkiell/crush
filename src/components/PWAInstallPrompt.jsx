'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();

            // Check if user dismissed the prompt recently
            const dismissedAt = localStorage.getItem('pwa_prompt_dismissed');
            if (dismissedAt) {
                const timeSinceDismissal = Date.now() - parseInt(dismissedAt, 10);
                if (timeSinceDismissal < COOLDOWN_PERIOD) {
                    return;
                }
            }

            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show install button
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowInstallButton(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            toast.success('App installed successfully! 🎉');
        } else {
            toast.info('You can install the app anytime from your browser menu');
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowInstallButton(false);
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
        setShowInstallButton(false);
    };

    if (!showInstallButton) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
            <div className="bg-base-800 rounded-xl shadow-xl p-4 border border-base-300">
                <div className="flex items-start gap-3">
                    <div className="text-3xl">📱</div>
                    <div className="flex-1">
                        <h3 className="font-bold text-base-content mb-1">Install D2C App</h3>
                        <p className="text-sm text-base-content/70 mb-3">
                            Install our app for offline access and a better experience!
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="btn btn-primary btn-sm rounded-lg border-none"
                            >
                                Install
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="btn btn-ghost btn-sm rounded-lg text-neutral-content hover:bg-neutral-focus"
                            >
                                Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
