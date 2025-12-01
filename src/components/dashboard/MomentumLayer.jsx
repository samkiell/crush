'use client';

import { motion } from 'framer-motion';
import { Flame, Calendar, Play, BookOpen, BarChart2, Users, ArrowRight, Wallet, Plus } from 'lucide-react';
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
                    className="md:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-content p-6 shadow-xl flex flex-col justify-between min-h-[200px]"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Calendar className="w-40 h-40" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-lg font-semibold opacity-90">JAMB Countdown</h2>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-6xl font-bold font-display">{daysRemaining}</span>
                            <span className="text-xl opacity-80">days left</span>
                        </div>
                    </div>

                    <div className="relative z-10 mt-4">
                        <div className="w-full bg-white/20 h-2 rounded-full mb-2">
                            <div
                                className="bg-white h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.max(0, Math.min(100, 100 - (daysRemaining / 365) * 100))}%` }}
                            />
                        </div>
                        <p className="text-sm opacity-80">Main Exam: April 25 - May 5, 2026</p>
                    </div>
                </motion.div>

                {/* Right Column: Balance & Streak */}
                <div className="md:col-span-4 flex flex-col gap-4">
                    {/* Balance Card */}
                    <motion.div
                        variants={variants.scale}
                        className="flex-1 bg-base-100 border border-base-200 rounded-3xl p-5 shadow-sm relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm text-base-content/60 font-medium mb-1">Wallet Balance</p>
                                <h3 className="text-3xl font-bold text-base-content">₦{user?.balance?.toLocaleString() || '0.00'}</h3>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                                <Wallet className="w-6 h-6" />
                            </div>
                        </div>
                        <button className="btn btn-sm btn-primary mt-4 w-full gap-2">
                            <Plus className="w-4 h-4" /> Top Up
                        </button>
                    </motion.div>

                    {/* Compact Streak Card */}
                    <motion.div
                        variants={variants.scale}
                        className="flex-1 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-3xl p-5 flex items-center justify-between shadow-sm"
                    >
                        <div>
                            <p className="text-sm text-base-content/60 font-medium">Daily Streak</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-orange-600">{stats?.streak || 0}</span>
                                <span className="text-sm text-orange-600/80">days</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="p-3 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-500/30">
                                <Flame className="w-6 h-6 fill-current" />
                            </div>
                            <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20" />
                        </div>
                    </motion.div>
                </div>
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
