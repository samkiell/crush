'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, MessageSquare, TrendingUp, Award, Search } from 'lucide-react';

const CommunityLayout = ({ children }) => {
    const pathname = usePathname();

    const navItems = [
        { label: 'Feed', href: '/community', icon: MessageSquare },
        { label: 'My Posts', href: '/community/my-posts', icon: Users },
        { label: 'Leaderboard', href: '/community/leaderboard', icon: Award },
    ];

    return (
        <div className="min-h-screen bg-base-200">
            {/* Top Navigation */}
            <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
                <div className="flex-1">
                    <Link href="/community" className="btn btn-ghost text-xl font-bold text-primary">
                        Community
                    </Link>
                </div>
                <div className="flex-none gap-2">
                    <div className="form-control hidden sm:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search discussions..."
                                className="input input-bordered w-24 md:w-auto pl-10"
                            />
                            <Search className="w-4 h-4 absolute left-3 top-3.5 text-base-content/50" />
                        </div>
                    </div>
                    <Link href="/community/create" className="btn btn-primary btn-sm">
                        New Post
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
                {/* Sidebar (Desktop) */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <div className="card bg-base-100 shadow-sm sticky top-20">
                        <div className="card-body p-4">
                            <ul className="menu bg-base-100 w-full rounded-box">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <li key={item.href}>
                                            <Link href={item.href} className={isActive ? 'active' : ''}>
                                                <Icon className="w-4 h-4" />
                                                {item.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="divider my-2"></div>

                            <h3 className="font-semibold text-sm px-4 mb-2 text-base-content/70">Categories</h3>
                            <ul className="menu bg-base-100 w-full rounded-box text-sm">
                                <li><Link href="/community?category=General">General</Link></li>
                                <li><Link href="/community?category=Exam Help">Exam Help</Link></li>
                                <li><Link href="/community?category=Study Tips">Study Tips</Link></li>
                                <li><Link href="/community?category=Career">Career</Link></li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>

                {/* Right Sidebar (Trending/Stats) - Optional, can be part of Hero or separate */}
                <aside className="hidden xl:block w-72 shrink-0">
                    <div className="card bg-base-100 shadow-sm sticky top-20">
                        <div className="card-body p-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-secondary" />
                                Trending
                            </h3>
                            <ul className="list-none space-y-3 mt-4">
                                {/* Placeholder for trending topics */}
                                <li className="text-sm hover:underline cursor-pointer">
                                    <span className="font-medium">#JAMB2025</span>
                                    <p className="text-xs text-base-content/60">1.2k discussions</p>
                                </li>
                                <li className="text-sm hover:underline cursor-pointer">
                                    <span className="font-medium">#PhysicsHelp</span>
                                    <p className="text-xs text-base-content/60">850 discussions</p>
                                </li>
                                <li className="text-sm hover:underline cursor-pointer">
                                    <span className="font-medium">#AdmissionCutoff</span>
                                    <p className="text-xs text-base-content/60">500 discussions</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CommunityLayout;
