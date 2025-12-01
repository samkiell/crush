'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, MessageSquare, Users, ClipboardList } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            label: 'Home',
            href: '/dashboard',
            icon: Home,
        },
        {
            label: 'Study',
            href: '/study',
            icon: BookOpen,
        },
        {
            label: 'Chat',
            href: '/chat',
            icon: MessageSquare,
        },
        {
            label: 'Community',
            href: '/community',
            icon: Users,
        },
        {
            label: 'CBT',
            href: '/cbt',
            icon: ClipboardList,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-base-100/80 backdrop-blur-lg border-t border-base-300 shadow-strong-lg" />

            <div className="relative flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center w-full h-full"
                        >
                            {/* Active Indicator (Top Border) */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute top-0 w-8 h-0.5 bg-primary rounded-b-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            <motion.div
                                className={`flex flex-col items-center gap-1 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-base-content/60 hover:text-base-content/80'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="relative">
                                    <Icon
                                        className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`}
                                    />
                                    {/* Optional: Notification dot example for Chat */}
                                    {item.label === 'Chat' && (
                                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full ring-2 ring-base-100 hidden" />
                                    )}
                                </div>

                                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                                    {item.label}
                                </span>
                            </motion.div>

                            {/* Active Glow Effect (Subtle) */}
                            {isActive && (
                                <div className="absolute inset-0 bg-primary/5 rounded-lg -z-10 blur-sm" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
