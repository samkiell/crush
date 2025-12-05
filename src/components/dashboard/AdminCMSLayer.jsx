'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Upload, Users, BarChart3, Settings, FileText, ShieldAlert, Database, Activity, TrendingUp, Flag, Bell } from 'lucide-react';
import Link from 'next/link';
import { stagger, variants } from '@/lib/motionConfig';
import api from '@/services/api';

export default function AdminCMSLayer() {
    const [statsData, setStatsData] = useState({
        totalUsers: 0,
        totalQuestions: 0,
        activeNow: 0,
        dailyExams: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStatsData(res.data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Total Users', value: statsData.totalUsers.toLocaleString(), change: 'Total', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Questions', value: statsData.totalQuestions.toLocaleString(), change: 'Total', icon: Database, color: 'text-secondary', bg: 'bg-secondary/10' },
        { label: 'Active Now', value: statsData.activeNow.toLocaleString(), change: 'Online', icon: Activity, color: 'text-success', bg: 'bg-success/10' },
        { label: 'Daily Exams', value: statsData.dailyExams.toLocaleString(), change: 'Last 24h', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
    ];

    const adminActions = [
        {
            title: 'Notifications',
            description: 'Send global push notifications',
            icon: Bell,
            href: '/admin/notifications',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
        },
        {
            title: 'Upload Questions',
            description: 'Bulk upload exam questions via JSON',
            icon: Upload,
            href: '/admin/questions/upload',
            color: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/20',
        },
        {
            title: 'Manage Questions',
            description: 'Edit, delete, and manage existing questions',
            icon: Database,
            href: '/admin/questions/manage',
            color: 'text-success',
            bg: 'bg-success/10',
            border: 'border-success/20',
        },
        {
            title: 'User Management',
            description: 'View and manage registered students',
            icon: Users,
            href: '/admin/users',
            color: 'text-secondary',
            bg: 'bg-secondary/10',
            border: 'border-secondary/20',
        },
        {
            title: 'Content Overview',
            description: 'Manage subjects, exams, and resources',
            icon: FileText,
            href: '/admin/content',
            color: 'text-accent',
            bg: 'bg-accent/10',
            border: 'border-accent/20',
        },
        {
            title: 'Platform Analytics',
            description: 'Monitor system performance and usage',
            icon: BarChart3,
            href: '/admin/analytics',
            color: 'text-info',
            bg: 'bg-info/10',
            border: 'border-info/20',
        },
        {
            title: 'System Settings',
            description: 'Configure global application settings',
            icon: Settings,
            href: '/admin/settings',
            color: 'text-warning',
            bg: 'bg-warning/10',
            border: 'border-warning/20',
        },
        {
            title: 'Reports',
            description: 'View and manage user reports',
            icon: Flag,
            href: '/admin/reports',
            color: 'text-error',
            bg: 'bg-error/10',
            border: 'border-error/20',
        },
        {
            title: 'Security Logs',
            description: 'View access logs and security alerts',
            icon: ShieldAlert,
            href: '/admin/security',
            color: 'text-error',
            bg: 'bg-error/10',
            border: 'border-error/20',
        },
    ];

    return (
        <motion.div
            variants={stagger.container(0.1)}
            initial="initial"
            animate="animate"
            className="space-y-8"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-base-content">Admin Console</h2>
                <span className="badge badge-primary badge-outline">v2.0.0</span>
            </div>

            {/* CMS Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={variants.fadeUp}
                        className="bg-base-100 border border-base-200 p-4 rounded-2xl shadow-sm flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-base-content/60 font-medium">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-lg font-bold">{stat.value}</h4>
                                <span className="text-xs text-success font-medium">{stat.change}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminActions.map((action, index) => (
                    <Link key={index} href={action.href} className="block group">
                        <motion.div
                            variants={variants.fadeUp}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`h-full p-6 rounded-2xl bg-base-100 border ${action.border} shadow-sm hover:shadow-md transition-all duration-300`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${action.bg} ${action.color}`}>
                                    <action.icon size={24} />
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-base-content/40">
                                    <ArrowUpRightIcon />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                                {action.title}
                            </h3>
                            <p className="text-sm text-base-content/60">
                                {action.description}
                            </p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}

function ArrowUpRightIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
        </svg>
    );
}
