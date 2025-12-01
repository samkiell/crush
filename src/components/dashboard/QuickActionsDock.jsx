'use client';

import { motion } from 'framer-motion';
import { Play, BookOpen, BarChart2, Users } from 'lucide-react';
import Link from 'next/link';
import { hover, stagger } from '@/lib/motionConfig';

export default function QuickActionsDock() {
    const actions = [
        {
            label: 'Start Test',
            icon: Play,
            href: '/cbt',
            gradient: 'from-primary to-primary-focus',
            textClass: 'text-primary',
            contentClass: 'text-primary-content'
        },
        {
            label: 'Study Mode',
            icon: BookOpen,
            href: '/study',
            gradient: 'from-secondary to-secondary-focus',
            textClass: 'text-secondary',
            contentClass: 'text-secondary-content'
        },
        {
            label: 'Performance',
            icon: BarChart2,
            href: '/dashboard/performance',
            gradient: 'from-accent to-accent-focus',
            textClass: 'text-accent',
            contentClass: 'text-accent-content'
        },
        {
            label: 'Community',
            icon: Users,
            href: '/community',
            gradient: 'from-info to-info',
            textClass: 'text-info',
            contentClass: 'text-info-content'
        },
    ];

    return (
        <div className="bg-base-100/80 backdrop-blur-md border border-base-200 rounded-2xl p-4 shadow-lg">
            <h3 className="text-sm font-semibold text-base-content/70 mb-4 uppercase tracking-wider px-2">
                Quick Actions
            </h3>

            <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                variants={stagger.container(0.05)}
                initial="initial"
                animate="animate"
            >
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <Link key={action.label} href={action.href}>
                            <motion.div
                                className="group relative overflow-hidden rounded-xl bg-base-100 border border-base-200 p-4 hover:border-transparent transition-colors"
                                variants={stagger.item}
                                {...hover.lift}
                            >
                                {/* Hover Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className={`
                    p-3 rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110
                    bg-gradient-to-br ${action.gradient}
                  `}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <span className="font-medium text-base-content group-hover:text-primary transition-colors">
                                        {action.label}
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.div>
        </div>
    );
}
