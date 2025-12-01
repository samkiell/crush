'use client';

import { motion } from 'framer-motion';
import { Flame, Calendar, Play, BookOpen, BarChart2, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { stagger, variants } from '@/lib/motionConfig';

export default function MomentumLayer({ user, stats }) {
    const firstName = user?.name?.split(' ')[0] || 'Scholar';

    // Calculate days until JAMB (Main Exam: April 25, 2026)
    const examDate = new Date('2026-04-25');
    const today = new Date();
    const timeDiff = examDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    const quickActions = [
        { label: 'Start Test', icon: Play, href: '/cbt', color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Study Mode', icon: BookOpen, href: '/study', color: 'text-secondary', bg: 'bg-secondary/10' },
        { label: 'Community', icon: Users, href: '/community', color: 'text-accent', bg: 'bg-accent/10' },
        { label: 'Performance', icon: BarChart2, href: '/dashboard/performance', color: 'text-info', bg: 'bg-info/10' },
    ];

    return (
        <motion.div
            className="space-y-6"
            variants={stagger.container(0.1)}
            initial="initial"
            animate="animate"
        >
            {/* Greeting & Subtitle */}
            <motion.div variants={variants.fadeUp} className="px-1">
                <h1 className="text-3xl font-bold text-primary">
                    {(() => {
                        const hour = new Date().getHours();
                        if (hour < 12) return 'Good Morning';
                        if (hour < 18) return 'Good Afternoon';
                        if (hour < 22) return 'Good Evening';
                        return 'Good Night';
                    })()}, {firstName}
                </h1>
                <p className="text-base-content/70 font-medium">
                    Ready to crush your goals today? 🚀
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* JAMB Countdown Card */}
                <motion.div
                    variants={variants.scale}
                    className="md:col-span-7 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-content p-6 shadow-xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Calendar className="w-32 h-32" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                            <h2 className="text-lg font-semibold opacity-90">JAMB Countdown</h2>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-5xl font-bold font-display">{daysRemaining}</span>
                                <span className="text-xl opacity-80">days left</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="w-full bg-white/20 h-2 rounded-full mb-2">
                                <div
                                    className="bg-white h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.max(0, Math.min(100, 100 - (daysRemaining / 365) * 100))}%` }}
                                />
                            </div>
                            <p className="text-sm opacity-80">Main Exam: April 25 - May 5, 2026</p>
                        </div>
                    </div>
                </motion.div>

                {/* Streak Card */}
                <motion.div
                    variants={variants.scale}
                    className="md:col-span-5 relative overflow-hidden rounded-3xl bg-base-100 border border-base-200 p-6 shadow-lg group hover:shadow-xl transition-all"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col items-center text-center justify-center h-full">
                        <div className="p-3 bg-orange-500/10 rounded-full mb-3 relative">
                            <Flame className="w-8 h-8 text-orange-500" />
                            <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping opacity-20" />
                        </div>

                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-base-content">{stats?.streak || 0}</span>
                            <span className="text-base-content/60 font-medium">Day Streak</span>
                        </div>
                        <p className="text-xs text-base-content/50 mt-1">Don't break the chain!</p>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions Grid */}
            <motion.div
                variants={stagger.container(0.05)}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
                {quickActions.map((action) => (
                    <Link key={action.label} href={action.href} className="block">
                        <motion.div
                            variants={variants.fadeUp}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all h-full"
                        >
                            <div className={`p-3 rounded-xl ${action.bg} ${action.color} mb-2`}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-semibold text-base-content/80">{action.label}</span>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </motion.div>
    );
}
