'use client';

import { X, Clock, AlertCircle, CheckCircle, Info, Flame, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationPanel({ onClose }) {
    // Mock notifications - replace with real data
    const notifications = [
        {
            id: 1,
            type: 'streak_risk',
            icon: Flame,
            title: 'Streak at Risk!',
            message: 'Your 12-day streak expires in 2 hours. Study now to keep it alive!',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
            priority: 'high',
            actionLabel: 'Study Now',
            actionUrl: '/practice',
            unread: true,
        },
        {
            id: 2,
            type: 'exam_countdown',
            icon: AlertCircle,
            title: 'JAMB Exam Countdown',
            message: '3 days until your exam! Complete your final review.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            priority: 'critical',
            unread: true,
        },
        {
            id: 3,
            type: 'achievement',
            icon: CheckCircle,
            title: 'Achievement Unlocked!',
            message: '"Week Warrior" - You maintained a 7-day streak!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            priority: 'medium',
            unread: true,
        },
        {
            id: 4,
            type: 'community',
            icon: MessageCircle,
            title: 'New Reply',
            message: 'AdewaleJAMB replied to your question about Organic Chemistry',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            priority: 'low',
            actionLabel: 'View Reply',
            actionUrl: '/community',
            unread: false,
        },
        {
            id: 5,
            type: 'ai_recommendation',
            icon: Info,
            title: 'AI Recommendation',
            message: 'Focus on Calculus today based on your upcoming exam schedule',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            priority: 'medium',
            unread: false,
        },
    ];

    const getPriorityColor = (priority) => {
        const colors = {
            critical: 'border-error bg-error/10',
            high: 'border-warning bg-warning/10',
            medium: 'border-info bg-info/10',
            low: 'border-base-300 bg-base-100',
        };
        return colors[priority] || colors.low;
    };

    const getIconColor = (type) => {
        const colors = {
            streak_risk: 'text-warning',
            exam_countdown: 'text-error',
            achievement: 'text-success',
            community: 'text-info',
            ai_recommendation: 'text-primary',
        };
        return colors[type] || 'text-base-content';
    };

    return (
        <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
                <div>
                    <h3 className="font-bold text-lg text-base-content">Notifications</h3>
                    <p className="text-xs text-base-content/60">
                        {notifications.filter(n => n.unread).length} unread
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn btn-ghost btn-sm">Mark all read</button>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-circle btn-sm"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-2 border-b border-base-300 overflow-x-auto">
                <button className="btn btn-sm btn-primary">All</button>
                <button className="btn btn-sm btn-ghost">Unread</button>
                <button className="btn btn-sm btn-ghost">Important</button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-base-content/40" />
                        </div>
                        <p className="text-base-content/60">You're all caught up!</p>
                        <p className="text-sm text-base-content/40 mt-1">No new notifications</p>
                    </div>
                ) : (
                    notifications.map((notification) => {
                        const Icon = notification.icon;
                        return (
                            <div
                                key={notification.id}
                                className={`p-3 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${notification.unread ? 'bg-primary/5 border-primary/20' : 'bg-base-100 border-base-300'
                                    } ${getPriorityColor(notification.priority)}`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className={`p-2 rounded-lg bg-base-200 flex-shrink-0 ${getIconColor(notification.type)}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-semibold text-sm text-base-content">
                                                {notification.title}
                                            </h4>
                                            {notification.unread && (
                                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                                            )}
                                        </div>
                                        <p className="text-sm text-base-content/70 mb-2">
                                            {notification.message}
                                        </p>

                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs text-base-content/50 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                            </span>

                                            {notification.actionLabel && (
                                                <button className="btn btn-xs btn-primary">
                                                    {notification.actionLabel}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dismiss */}
                                    <button className="btn btn-ghost btn-circle btn-xs flex-shrink-0">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-base-300 text-center">
                <button className="btn btn-link btn-sm">
                    View All Notifications
                </button>
            </div>
        </div>
    );
}
