'use client';

import { Bell, CheckCircle, AlertCircle, Info, Flame, MessageCircle, Trophy, Clock, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
    const [filter, setFilter] = useState('all'); // all, unread, important
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();
    const router = useRouter();

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (newNotification) => {
            // Add new notification to the top of the list
            // We need to ensure the structure matches what we expect
            const formatted = {
                ...newNotification,
                // Ensure ID is present (socket might send _id)
                _id: newNotification._id || Date.now().toString(),
                isRead: false,
                createdAt: new Date().toISOString()
            };
            setNotifications(prev => [formatted, ...prev]);
        };

        socket.on('notification:new', handleNewNotification);

        return () => {
            socket.off('notification:new', handleNewNotification);
        };
    }, [socket]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications?limit=50');
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        // Optimistic update
        setNotifications(notifications.map((n) =>
            n._id === id ? { ...n, isRead: true } : n
        ));

        try {
            await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId: id })
            });
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        // Optimistic update
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));

        try {
            await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAll: true })
            });
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = (id) => {
        // We don't have a delete API yet, so just hide it from UI for now
        // Or we could implement a DELETE endpoint. 
        // For now, let's just remove from state.
        setNotifications(notifications.filter((n) => n._id !== id));
    };

    const getIconInfo = (type) => {
        switch (type) {
            case 'streak_risk':
            case 'alert':
                return { icon: Flame, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning' };
            case 'exam_countdown':
            case 'critical':
                return { icon: AlertCircle, color: 'text-error', bg: 'bg-error/10', border: 'border-error' };
            case 'achievement':
                return { icon: Trophy, color: 'text-success', bg: 'bg-success/10', border: 'border-success' };
            case 'community_post':
            case 'community_reply':
                return { icon: MessageCircle, color: 'text-info', bg: 'bg-info/10', border: 'border-info' };
            case 'ai_recommendation':
                return { icon: Info, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary' };
            default:
                return { icon: Bell, color: 'text-base-content', bg: 'bg-base-200', border: 'border-base-300' };
        }
    };

    const filteredNotifications = notifications.filter((notif) => {
        if (filter === 'unread') return !notif.isRead;
        // Assume 'alert' and 'streak_risk' are important
        if (filter === 'important') return ['alert', 'streak_risk', 'exam_countdown'].includes(notif.type);
        return true;
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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
                            Important ({notifications.filter(n => ['alert', 'streak_risk', 'exam_countdown'].includes(n.type)).length})
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
                            const { icon: Icon, color, bg, border } = getIconInfo(notification.type);
                            const isUnread = !notification.isRead;
                            
                            return (
                                <div
                                    key={notification._id}
                                    className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                                        isUnread
                                            ? 'bg-base-100 border-primary/40 shadow-sm' // Highlight unread
                                            : 'bg-base-100 border-base-200 opacity-80'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`p-3 rounded-lg flex-shrink-0 ${bg} ${color}`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className={`font-semibold text-base-content ${isUnread ? 'font-bold' : ''}`}>
                                                    {notification.title}
                                                </h3>
                                                {isUnread && (
                                                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" title="Unread"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs text-base-content/50 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), {
                                                        addSuffix: true,
                                                    }) : 'Just now'}
                                                </span>

                                                <div className="flex items-center gap-2">
                                                    {isUnread && (
                                                        <button
                                                            onClick={() => markAsRead(notification._id)}
                                                            className="btn btn-xs btn-ghost"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                    {notification.link && (
                                                        <a
                                                            href={notification.link}
                                                            className="btn btn-xs btn-primary"
                                                            target={notification.link.startsWith('http') ? '_blank' : '_self'}
                                                        >
                                                            View
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete Button (Visual only for now) */}
                                        <button
                                            onClick={() => deleteNotification(notification._id)}
                                            className="btn btn-ghost btn-circle btn-xs flex-shrink-0 opacity-50 hover:opacity-100"
                                            title="Dismiss"
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
