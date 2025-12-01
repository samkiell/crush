'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Eye } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/utils/theme';

export default function ThemeToggle({
    availableThemes = ['light', 'dark', 'eye-care'],
    variant = 'compact'
}) {
    const { theme: currentTheme, setTheme: setCurrentTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    const isStudyOrExam = pathname?.startsWith('/study') || pathname?.startsWith('/cbt');
    const filteredThemes = availableThemes.filter(t => t !== 'eye-care' || isStudyOrExam);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleThemeChange = (theme) => {
        setCurrentTheme(theme);
        // The ThemeProvider will handle localStorage and DOM updates
    };

    const cycleTheme = () => {
        // If current theme is not in filtered list (e.g. eye-care on dashboard), start from beginning of filtered list
        const currentIndex = filteredThemes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % filteredThemes.length;
        const nextTheme = filteredThemes[nextIndex] || filteredThemes[0];
        handleThemeChange(nextTheme);
    };

    if (!mounted) return <div className="w-10 h-10" />;

    const icons = {
        light: Sun,
        dark: Moon,
        'eye-care': Eye,
    };

    const Icon = icons[currentTheme] || Sun;

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
            {filteredThemes.map((theme) => {
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
