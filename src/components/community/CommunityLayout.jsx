'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, MessageSquare, TrendingUp, Award, Search } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, selectCommunityStats } from '@/store/slices/communitySlice';

const CommunityLayout = ({ children }) => {
    const pathname = usePathname();

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
        <div className="drawer">
            <input id="community-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col min-h-screen bg-base-200">
                {/* Top Navigation */}
                <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="community-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div>
                    <div className="flex-1">
                        <Link href="/community" className="btn btn-ghost text-xl font-bold text-primary">
                            Community
                        </Link>
                    </div>
                    <div className="flex-none gap-2 flex items-center">
                        <div className="form-control hidden md:block">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search discussions..."
                                    className="input input-bordered w-auto md:w-64 pl-10 input-sm md:input-md"
                                />
                                <Search className="w-4 h-4 absolute left-3 top-3 md:top-3.5 text-base-content/50" />
                            </div>
                        </div>
                        <Link href="/community/create" className="btn btn-primary btn-sm md:btn-md whitespace-nowrap">
                            New Post
                        </Link>
                    </div>
                </div>

                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
                    {/* Sidebar (Desktop) */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="card bg-base-100 shadow-sm sticky top-20">
                            <div className="card-body p-5">
                                <SidebarContent navItems={navItems} pathname={pathname} />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 max-w-4xl">
                        {children}
                    </main>

                    {/* Right Sidebar (Trending/Stats) */}
                    <aside className="hidden xl:block w-80 shrink-0">
                        <div className="card bg-base-100 shadow-sm sticky top-20">
                            <div className="card-body p-5">
                                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-secondary" />
                                    Trending
                                </h3>
                                <ul className="list-none space-y-3">
                                    {trendingTopics && trendingTopics.length > 0 ? (
                                        trendingTopics.map((topic, index) => (
                                            <li key={index} className="text-sm hover:underline cursor-pointer">
                                                <Link href={`/community?search=${topic}`} className="block">
                                                    <span className="font-medium">#{topic}</span>
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-base-content/60">No trending topics yet.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <div className="drawer-side z-50">
                <label htmlFor="community-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content overflow-y-auto">
                    <SidebarContent navItems={navItems} pathname={pathname} />
                </div>
            </div>
        </div>
    );
};

const SidebarContent = ({ navItems, pathname }) => (
    <>
        <ul className="menu w-full rounded-box p-0 space-y-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <li key={item.href}>
                        <Link href={item.href} className={isActive ? 'active' : ''}>
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    </li>
                );
            })}
        </ul>

        <div className="divider my-3"></div>

        <h3 className="font-semibold text-sm px-4 mb-3 text-base-content/70">Categories</h3>
        <ul className="menu w-full rounded-box text-sm p-0 space-y-1">
            <li><Link href="/community?category=General">General</Link></li>
            <li><Link href="/community?category=Exam Help">Exam Help</Link></li>
            <li><Link href="/community?category=Study Tips">Study Tips</Link></li>
            <li><Link href="/community?category=Career">Career</Link></li>
        </ul>

        <div className="card bg-primary text-primary-content shadow-sm mt-6">
            <div className="card-body p-4">
                <h3 className="font-bold text-base sm:text-lg">Ace Your Exams!</h3>
                <p className="text-xs sm:text-sm opacity-90 mb-3">Get access to exclusive study materials and expert mentors.</p>
                <Link href="/pricing" className="btn btn-sm btn-white bg-base-100 text-primary hover:bg-base-200 border-none w-full">
                    Go Premium
                </Link>
            </div>
        </div>
    </>
);

export default CommunityLayout;
