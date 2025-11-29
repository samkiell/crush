'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, MessageSquare, TrendingUp, Award, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, selectCommunityStats } from '@/store/slices/communitySlice';
import SearchBar from './SearchBar';

const CommunityLayout = ({ children }) => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: 'Feed', href: '/community', icon: MessageSquare },
        { label: 'My Posts', href: '/community/my-posts', icon: Users },
        { label: 'Leaderboard', href: '/community/leaderboard', icon: Award },
    ];

    const dispatch = useDispatch();
    const { trendingTopics } = useSelector(selectCommunityStats);

    useEffect(() => {
        dispatch(fetchStats());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-base-200/50 relative">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[100px]"></div>
            </div>

            {/* Top Navigation */}
            <div className="sticky top-0 z-30 bg-base-100/80 backdrop-blur-md border-b border-base-300 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden btn btn-ghost btn-circle btn-sm relative z-[70]"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                        <Link href="/community" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Community
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="flex-1 max-w-xl hidden md:block">
                        <SearchBar />
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/community/create"
                            className="btn btn-primary rounded-xl border-none"
                        >
                            New Post
                        </Link>
                    </div>
                </div>

                {/* Mobile Search - Below nav */}
                <div className="md:hidden border-t border-base-300 px-4 py-3 bg-base-100/80 backdrop-blur-md z-10 relative">
                    <SearchBar />
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Sidebar (Desktop) */}
                <aside className={`
                    fixed inset-y-0 left-0 z-[60] w-72 bg-base-100/95 backdrop-blur-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:bg-transparent lg:backdrop-blur-none lg:w-64 shrink-0
                    ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
                `}>
                    <div className="h-full overflow-y-auto p-6 lg:p-0 lg:sticky lg:top-24 scrollbar-none">
                        <div className="lg:bg-base-100/40 lg:backdrop-blur-md lg:rounded-3xl lg:p-6 lg:border lg:border-base-300">
                            <SidebarContent navItems={navItems} pathname={pathname} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>

                {/* Right Sidebar (Trending/Stats) */}
                <aside className="hidden xl:block w-80 shrink-0">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-base-100/40 backdrop-blur-md rounded-3xl p-6 border border-base-300 shadow-sm">
                            <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-base-content">
                                <TrendingUp className="w-5 h-5 text-secondary" />
                                Trending Topics
                            </h3>
                            <ul className="space-y-2">
                                {trendingTopics && trendingTopics.length > 0 ? (
                                    trendingTopics.map((topic, index) => (
                                        <li key={index}>
                                            <Link
                                                href={`/community?search=${topic}`}
                                                className="block p-3 rounded-xl hover:bg-base-200 transition-colors group"
                                            >
                                                <span className="font-medium text-base-content/80 group-hover:text-primary transition-colors">#{topic}</span>
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-base-content/60 italic">No trending topics yet.</li>
                                )}
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="font-bold text-xl mb-2 relative z-10">Ace Your Exams!</h3>
                            <p className="text-white/90 text-sm mb-4 relative z-10">Get access to exclusive study materials and expert mentors.</p>
                            <Link
                                href="/pricing"
                                className="btn btn-sm bg-white/20 hover:bg-white/30 border-none text-white w-full backdrop-blur-md relative z-10"
                            >
                                Go Premium
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const SidebarContent = ({ navItems, pathname, setIsMobileMenuOpen }) => (
    <div className="space-y-8">
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end mb-2">
            <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-ghost btn-circle btn-sm"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/40 mb-4 px-3">Menu</h3>
            <ul className="space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium
                                    ${isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-base-content/70 hover:bg-base-200/50 hover:text-primary'
                                    }
                                `}
                                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>

        <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/40 mb-4 px-3">Categories</h3>
            <ul className="space-y-1">
                {['General', 'Exam Help', 'Study Tips', 'Career'].map((cat) => (
                    <li key={cat}>
                        <Link
                            href={`/community?category=${cat}`}
                            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-base-content/70 hover:bg-base-200/50 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                        >
                            {cat}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export default CommunityLayout;
