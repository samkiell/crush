'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    HomeIcon as HomeOutline,
    DocumentTextIcon as DocumentOutline,
    UserGroupIcon as CommunityOutline,
    ChatBubbleLeftRightIcon as ChatOutline,
    UserCircleIcon as ProfileOutline
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeFilled,
    DocumentTextIcon as DocumentFilled,
    UserGroupIcon as CommunityFilled,
    ChatBubbleLeftRightIcon as ChatFilled,
    UserCircleIcon as ProfileFilled
} from '@heroicons/react/24/solid';

const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        {
            name: 'Home',
            href: '/dashboard',
            iconOutline: HomeOutline,
            iconFilled: HomeFilled,
            badge: 0
        },
        {
            name: 'Past Questions',
            href: '/past-questions',
            iconOutline: DocumentOutline,
            iconFilled: DocumentFilled,
            badge: 0
        },
        {
            name: 'Community',
            href: '/community',
            iconOutline: CommunityOutline,
            iconFilled: CommunityFilled,
            badge: 12 // Example: unread posts
        },
        {
            name: 'Chat',
            href: '/chat',
            iconOutline: ChatOutline,
            iconFilled: ChatFilled,
            badge: 3 // Example: unread messages
        },
        {
            name: 'Profile',
            href: '/profile',
            iconOutline: ProfileOutline,
            iconFilled: ProfileFilled,
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
                        const IconOutline = item.iconOutline;
                        const IconFilled = item.iconFilled;
                        const Icon = active ? IconFilled : IconOutline;

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
                                    />

                                    {/* Notification Badge */}
                                    {item.badge > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-bold text-white bg-error rounded-full animate-pulse"
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
