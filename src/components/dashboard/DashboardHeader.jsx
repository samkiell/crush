'use client';

import { Bell, Search, Flame, Settings } from 'lucide-react';
import { useState } from 'react';
import NotificationPanel from './NotificationPanel';

export default function DashboardHeader({ user }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Mock streak data - replace with real data from Redux
    const currentStreak = 12;
    const unreadNotifications = 3;

    return (
        <div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-xl border-b border-base-300">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block">
                            <h1 className="text-xl md:text-2xl font-bold text-base-content">
                                Dashboard
                            </h1>
                            <p className="text-sm text-base-content/60">
                                Welcome back, {user?.username || 'Student'}!
                            </p>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Search Button */}
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="btn btn-ghost btn-circle btn-sm md:btn-md"
                            title="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Streak Counter */}
                        <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                            <div className="flex flex-col">
                                <span className="text-xs text-base-content/60 leading-none">Streak</span>
                                <span className="font-bold text-orange-500 leading-none">{currentStreak} days</span>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="btn btn-ghost btn-circle btn-sm md:btn-md relative"
                                title="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowNotifications(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-80 md:w-96 z-50">
                                        <NotificationPanel onClose={() => setShowNotifications(false)} />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Settings */}
                        <button
                            className="btn btn-ghost btn-circle btn-sm md:btn-md"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        {/* User Avatar */}
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-8 h-8 md:w-10 md:h-10">
                                <span className="text-sm md:text-base font-semibold">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar (Expandable) */}
                {showSearch && (
                    <div className="mt-4 animate-fade-in">
                        <input
                            type="text"
                            placeholder="Search topics, exams, resources..."
                            className="input input-bordered w-full"
                            autoFocus
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
