'use client';

import { PlayCircle, Bookmark, MessageCircle, HelpCircle, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuickActionsDock() {
    const router = useRouter();

    const actions = [
        {
            id: 'resume',
            icon: PlayCircle,
            label: 'Resume',
            sublabel: 'Math Practice',
            color: 'text-primary',
            bgColor: 'bg-primary',
            pulse: true,
            onClick: () => router.push('/practice'),
        },
        {
            id: 'bookmarks',
            icon: Bookmark,
            label: 'Bookmarks',
            badge: 5,
            color: 'text-warning',
            bgColor: 'bg-warning',
            onClick: () => router.push('/bookmarks'),
        },
        {
            id: 'community',
            icon: MessageCircle,
            label: 'Community',
            badge: 2,
            color: 'text-info',
            bgColor: 'bg-info',
            onClick: () => router.push('/community'),
        },
        {
            id: 'practice',
            icon: Target,
            label: 'Practice',
            color: 'text-success',
            bgColor: 'bg-success',
            onClick: () => router.push('/practice'),
        },
    ];

    return (
        <>
            {/* Mobile Floating Dock */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-base-100/90 backdrop-blur-xl border-t border-base-300 safe-area-inset-bottom">
                <div className="flex items-center justify-around px-4 py-3">
                    {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={action.id}
                                onClick={action.onClick}
                                className="relative flex flex-col items-center gap-1 min-w-0"
                            >
                                <div className={`relative p-2 rounded-full ${action.pulse ? 'animate-pulse' : ''
                                    }`}>
                                    <Icon className={`w-6 h-6 ${action.color}`} />
                                    {action.badge && (
                                        <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {action.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-base-content/60 truncate max-w-[60px]">
                                    {action.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Sidebar Quick Actions */}
            <div className="hidden lg:block fixed right-6 bottom-6 z-40">
                <div className="flex flex-col gap-3">
                    {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={action.id}
                                onClick={action.onClick}
                                className={`group relative flex items-center gap-3 p-4 ${action.bgColor} text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all ${action.pulse ? 'animate-pulse' : ''
                                    }`}
                                title={action.label}
                            >
                                {/* Tooltip */}
                                <div className="absolute right-full mr-3 px-3 py-2 bg-base-content text-base-100 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {action.label}
                                    {action.sublabel && (
                                        <div className="text-xs opacity-75">{action.sublabel}</div>
                                    )}
                                </div>

                                {/* Icon */}
                                <div className="relative">
                                    <Icon className="w-6 h-6" />
                                    {action.badge && (
                                        <span className="absolute -top-2 -right-2 bg-error text-error-content text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {action.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Expandable Label (Desktop only) */}
                                <span className="font-semibold whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-xs transition-all">
                                    {action.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
