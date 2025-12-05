'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {

    LayoutDashboard,
    Users,
    BookOpen,
    MessageSquare,
    Settings,
    FileText,
    LogIn,
    Home,
    Monitor,
    Map,
    Bookmark,
    Phone,
    HelpCircle,
    FileQuestion,
    ShieldAlert,
    Database,
    BarChart3,
    Flag,
    Upload,
    Activity
} from 'lucide-react';

const ROUTE_GROUPS = [
    {
        title: 'Public Pages',
        routes: [
            { name: 'Landing Page', path: '/', icon: Home },
            { name: 'Login', path: '/login', icon: LogIn },
            { name: 'Register', path: '/register', icon: Users },
        ]
    },
    {
        title: 'Student Portal',
        routes: [
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { name: 'Study Mode', path: '/study', icon: BookOpen },
            { name: 'CBT Exam', path: '/cbt', icon: Monitor },
            { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
            { name: 'Community', path: '/community', icon: Users },
            { name: 'Chat', path: '/chat', icon: MessageSquare },
            { name: 'Profile', path: '/profile', icon: Users },
            { name: 'Settings', path: '/settings', icon: Settings },
        ]
    },
    {
        title: 'Admin Portal',
        routes: [
            { name: 'User Management', path: '/admin/users', icon: Users },
            { name: 'Manage Questions', path: '/admin/questions/manage', icon: Database },
            { name: 'Upload Questions', path: '/admin/questions/upload', icon: Upload },
            { name: 'Content', path: '/admin/content', icon: FileText },
            { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
            { name: 'Reports', path: '/admin/reports', icon: Flag },
            { name: 'Security', path: '/admin/security', icon: ShieldAlert },
            { name: 'Admin Settings', path: '/admin/settings', icon: Settings },
        ]
    },
    {
        title: 'Support & Legal',
        routes: [
            { name: 'Help Center', path: '/help', icon: HelpCircle },
            { name: 'Contact Us', path: '/contact', icon: Phone },
            { name: 'FAQ', path: '/faq', icon: FileQuestion },
            { name: 'Terms of Service', path: '/terms', icon: FileText },
            { name: 'Privacy Policy', path: '/privacy', icon: ShieldAlert },
        ]
    },
    {
        title: 'Utilities',
        routes: [
            { name: 'Site Map', path: '/routes', icon: Map },
            { name: 'Offline Fallback', path: '/offline', icon: Activity },
        ]
    }
];

export default function RoutesPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Site Navigation Map</h1>
                <p className="text-base-content/60">Quick access to all available routes in the application.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ROUTE_GROUPS.map((group, groupIndex) => (
                    <motion.div
                        key={group.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-base-200 pb-2">
                            {group.title}
                        </h2>
                        <div className="grid gap-3">
                            {group.routes.map((route) => {
                                const Icon = route.icon;
                                return (
                                    <Link
                                        key={route.path}
                                        href={route.path}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-base-100 border border-base-200 hover:border-primary hover:shadow-md transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium group-hover:text-primary transition-colors">
                                                {route.name}
                                            </div>
                                            <div className="text-xs text-base-content/50 font-mono">
                                                {route.path}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
