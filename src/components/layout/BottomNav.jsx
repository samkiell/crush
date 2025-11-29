'use client';

import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { Home, FileText, MessageCircle, Users, User } from 'lucide-react';

const BottomNav = () => {
    const pathname = usePathname();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { activeRoom } = useSelector((state) => state.chat);

    // Don't render if user is not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Don't render on chat page if a room is active (immersive mode)
    if (pathname === '/chat' && activeRoom) {
        return null;
    }

    const navItems = [
        {
            name: 'Home',
            href: '/dashboard',
            icon: Home,
            badge: 0
        },
        {
            name: 'Past Questions',
            href: '/past-questions',
            icon: FileText,
            badge: 0
        },
        {
            name: 'Chat',
            href: '/chat',
            icon: MessageCircle,
            badge: 3 // Example: unread messages
        },
        {
            name: 'Community',
            href: '/community',
            icon: Users,
            badge: 12 // Example: unread posts
        },
        {
            name: 'Profile',
            href: '/profile',
            icon: User,
            badge: 0
        }
    ];

    const isActive = (href) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard' || pathname === '/';
        }
        return pathname?.startsWith(href);
    };

    return (
        <nav
            role="navigation"
            aria-label="Main Navigation"
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
            {/* Main Navigation Container */}
            <div className="h-16 bg-base-100/95 backdrop-blur-xl border-t border-base-300 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_-2px_12px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-around h-full max-w-screen-xl mx-auto px-2">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex flex-col items-center justify-center flex-1 h-full
                                    transition-all duration-200 ease-out
                                    active:scale-95
                                    hover:opacity-100
                                    ${active ? 'opacity-100' : 'opacity-70'}
                                `}
                                aria-label={`${item.name} - Navigate to ${item.name.toLowerCase()}`}
                                aria-current={active ? 'page' : undefined}
                            >
                                {/* Icon Container with Badge */}
                                <div className="relative">
                                    <Icon
                                        className={`
                                            w-6 h-6 transition-all duration-200
                                            ${active
                                                ? 'text-primary -translate-y-0.5'
                                                : 'text-base-content/60'
                                            }
                                        `}
                                        fill={active ? 'currentColor' : 'none'}
                                        strokeWidth={2}
                                    />

                                    {/* Notification Badge */}
                                    {item.badge > 0 && (
                                        <span
                                            className="absolute -top-2 -right-2 z-10 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[10px] font-bold text-white bg-red-500 border-[2px] border-base-100 rounded-full shadow-sm"
                                            aria-label={`${item.badge} unread notifications`}
                                        >
                                            {item.badge > 99 ? '99+' : item.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={`
                                        mt-1 text-[10px] transition-all duration-150
                                        ${active
                                            ? 'text-primary font-semibold'
                                            : 'text-base-content/60 font-medium'
                                        }
                                    `}
                                >
                                    {item.name === 'Past Questions' ? 'Questions' : item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* iOS Safe Area Bottom Padding */}
            <div className="h-[env(safe-area-inset-bottom)] bg-base-100" />
        </nav>
    );
};

export default BottomNav;
