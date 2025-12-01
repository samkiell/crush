'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Eye } from 'lucide-react';
import { themeConfig, motionVariants } from '@/lib/designTokens';

/**
 * ThemeToggle Component
 * 
 * A beautiful, animated theme switcher with support for Light, Dark, and Eye Care themes.
 * Features smooth transitions, Framer Motion animations, and persistent theme storage.
 * 
 * @param {Object} props
 * @param {Array<string>} props.availableThemes - Array of available themes for this page (default: ['light', 'dark'])
 * @param {boolean} props.showLabels - Whether to show theme labels (default: false)
 * @param {string} props.variant - Display variant: 'dropdown' | 'buttons' | 'compact' (default: 'compact')
 */
export default function ThemeToggle({
    availableThemes = ['light', 'dark'],
    showLabels = false,
    variant = 'compact'
}) {
    const [currentTheme, setCurrentTheme] = useState('light');
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initialize theme on mount
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem(themeConfig.storageKey) || themeConfig.defaultTheme;

        // Ensure saved theme is available on this page
        const theme = availableThemes.includes(savedTheme) ? savedTheme : availableThemes[0];

        setCurrentTheme(theme);
        applyTheme(theme);
    }, [availableThemes]);

    // Apply theme to document
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(themeConfig.storageKey, theme);
    };

    // Handle theme change
    const handleThemeChange = (theme) => {
        setCurrentTheme(theme);
        applyTheme(theme);
        setIsOpen(false);
    };

    // Cycle through themes (for compact variant)
    const cycleTheme = () => {
        const currentIndex = availableThemes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % availableThemes.length;
        const nextTheme = availableThemes[nextIndex];
        handleThemeChange(nextTheme);
    };

    // Theme icons
    const themeIcons = {
        light: Sun,
        dark: Moon,
        'eye-care': Eye,
    };

    // Theme labels
    const themeLabels = {
        light: 'Light',
        dark: 'Dark',
        'eye-care': 'Eye Care',
    };

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-lg bg-base-200 animate-pulse" />
        );
    }

    // Compact variant - single button that cycles through themes
    if (variant === 'compact') {
        const Icon = themeIcons[currentTheme];

        return (
            <motion.button
                onClick={cycleTheme}
                className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTheme}
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Icon className="w-5 h-5 text-base-content" />
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        );
    }

    // Buttons variant - horizontal row of theme buttons
    if (variant === 'buttons') {
        return (
            <div className="flex items-center gap-2 p-1 rounded-lg bg-base-200">
                {availableThemes.map((theme) => {
                    const Icon = themeIcons[theme];
                    const isActive = currentTheme === theme;

                    return (
                        <motion.button
                            key={theme}
                            onClick={() => handleThemeChange(theme)}
                            className={`relative flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                                    ? 'bg-primary text-primary-content'
                                    : 'hover:bg-base-300 text-base-content'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Switch to ${themeLabels[theme]} theme`}
                        >
                            <Icon className="w-4 h-4" />
                            {showLabels && (
                                <span className="text-sm font-medium">{themeLabels[theme]}</span>
                            )}

                            {isActive && (
                                <motion.div
                                    layoutId="activeTheme"
                                    className="absolute inset-0 bg-primary rounded-md -z-10"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        );
    }

    // Dropdown variant - dropdown menu with all themes
    if (variant === 'dropdown') {
        const Icon = themeIcons[currentTheme];

        return (
            <div className="relative">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Theme menu"
                >
                    <Icon className="w-5 h-5 text-base-content" />
                    {showLabels && (
                        <span className="text-sm font-medium text-base-content">
                            {themeLabels[currentTheme]}
                        </span>
                    )}
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsOpen(false)}
                                {...motionVariants.modalBackdrop}
                            />

                            {/* Dropdown Menu */}
                            <motion.div
                                className="absolute right-0 mt-2 w-48 rounded-lg bg-base-100 shadow-strong border border-base-300 overflow-hidden z-50"
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                {availableThemes.map((theme, index) => {
                                    const Icon = themeIcons[theme];
                                    const isActive = currentTheme === theme;

                                    return (
                                        <motion.button
                                            key={theme}
                                            onClick={() => handleThemeChange(theme)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${isActive
                                                    ? 'bg-primary text-primary-content'
                                                    : 'hover:bg-base-200 text-base-content'
                                                } ${index !== 0 ? 'border-t border-base-300' : ''}`}
                                            whileHover={{ x: 4 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="text-sm font-medium">{themeLabels[theme]}</span>

                                            {isActive && (
                                                <motion.div
                                                    className="ml-auto w-2 h-2 rounded-full bg-primary-content"
                                                    layoutId="activeIndicator"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return null;
}
