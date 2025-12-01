'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Eye } from 'lucide-react';
import { themeConfig } from '@/lib/designTokens';

export default function ThemeToggle({
    availableThemes = ['light', 'dark'],
    variant = 'compact'
}) {
    const [currentTheme, setCurrentTheme] = useState('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem(themeConfig.storageKey) || 'light';
        const theme = availableThemes.includes(savedTheme) ? savedTheme : availableThemes[0];
        setCurrentTheme(theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [availableThemes]);

    const handleThemeChange = (theme) => {
        setCurrentTheme(theme);
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(themeConfig.storageKey, theme);
    };

    const cycleTheme = () => {
        const currentIndex = availableThemes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % availableThemes.length;
        const nextTheme = availableThemes[nextIndex];
        handleThemeChange(nextTheme);
    };

    if (!mounted) return <div className="w-10 h-10" />;

    const icons = {
        light: Sun,
        dark: Moon,
        'eye-care': Eye,
    };

    const Icon = icons[currentTheme];

    if (variant === 'compact') {
        return (
            <motion.button
                onClick={cycleTheme}
                className="p-2 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTheme}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Icon className="w-5 h-5" />
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        );
    }

    return (
        <div className="flex gap-2 p-1 bg-base-200 rounded-lg">
            {availableThemes.map((theme) => {
                const ThemeIcon = icons[theme];
                const isActive = currentTheme === theme;

                return (
                    <button
                        key={theme}
                        onClick={() => handleThemeChange(theme)}
                        className={`p-2 rounded-md transition-all ${isActive ? 'bg-primary text-primary-content shadow-sm' : 'hover:bg-base-300'
                            }`}
                    >
                        <ThemeIcon className="w-4 h-4" />
                    </button>
                );
            })}
        </div>
    );
}
