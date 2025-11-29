'use client';

import { Bell, CheckCircle, AlertCircle, Info, Flame, MessageCircle, Trophy, Clock, X } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
    const [filter, setFilter] = useState('all'); // all, unread, important

    // Mock notifications - replace with Redux/API data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'streak_risk',
            icon: Flame,
            title: 'Streak at Risk!',
            message: 'Your 12-day streak expires in 2 hours. Study now to keep it alive!',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
            priority: 'high',
            unread: true,
            actionUrl: '/practice',
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
            icon: Trophy,
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
            unread: false,
            actionUrl: '/community',
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
    ]);

    const filteredNotifications = notifications.filter((notif) => {
        if (filter === 'unread') return notif.unread;
        if (filter === 'important') return notif.priority === 'critical' || notif.priority === 'high';
        return true;
    });

    const unreadCount = notifications.filter((n) => n.unread).length;

    const markAsRead = (id) => {
        setNotifications(notifications.map((n) =>
            n.id === id ? { ...n, unread: false } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter((n) => n.id !== id));
    };

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
        <div className="min-h-screen bg-base-100">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-base-content">Notifications</h1>
                            <p className="text-sm text-base-content/60 mt-1">
                                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="btn btn-outline btn-sm"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            Unread ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilter('important')}
                            className={`btn btn-sm ${filter === 'important' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            Important ({notifications.filter(n => n.priority === 'critical' || n.priority === 'high').length})
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-base-content/40" />
                            </div>
                            <h3 className="text-lg font-semibold text-base-content mb-2">
                                You're all caught up!
                            </h3>
                            <p className="text-base-content/60">No new notifications</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => {
                            const Icon = notification.icon;
                            return (
                                <div
                                    key={notification.id}
                                    className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md ${notification.unread
                                            ? 'bg-primary/5 border-primary/20'
                                            : 'bg-base-100 border-base-300'
                                        } ${getPriorityColor(notification.priority)}`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`p-3 rounded-lg bg-base-200 flex-shrink-0 ${getIconColor(
                                                notification.type
                                            )}`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-semibold text-base-content">
                                                    {notification.title}
                                                </h3>
                                                {notification.unread && (
                                                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-base-content/70 mb-3">
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs text-base-content/50 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDistanceToNow(notification.timestamp, {
                                                        addSuffix: true,
                                                    })}
                                                </span>

                                                <div className="flex items-center gap-2">
                                                    {notification.unread && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="btn btn-xs btn-ghost"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                    {notification.actionUrl && (
                                                        <a
                                                            href={notification.actionUrl}
                                                            className="btn btn-xs btn-primary"
                                                        >
                                                            View
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="btn btn-ghost btn-circle btn-xs flex-shrink-0"
                                            title="Delete notification"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
