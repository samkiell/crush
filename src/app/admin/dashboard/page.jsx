'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, selectCommunityStats } from '@/store/slices/communitySlice';
import { fetchReports, selectReports } from '@/store/slices/adminSlice';
import { Users, MessageSquare, Flag, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { activeUsers, discussions, trendingTopics } = useSelector(selectCommunityStats);
    const reports = useSelector(selectReports);

    useEffect(() => {
        dispatch(fetchStats());
        dispatch(fetchReports());
    }, [dispatch]);

    const pendingReports = reports.filter(r => r.status === 'pending').length;

    const stats = [
        { label: 'Active Users', value: activeUsers, icon: Users, color: 'text-primary' },
        { label: 'Total Discussions', value: discussions, icon: MessageSquare, color: 'text-secondary' },
        { label: 'Pending Reports', value: pendingReports, icon: Flag, color: 'text-error' },
        { label: 'Trending Topics', value: trendingTopics.length, icon: TrendingUp, color: 'text-accent' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card bg-base-100 shadow-sm border border-base-200">
                            <div className="card-body p-6 flex flex-row items-center justify-between">
                                <div>
                                    <p className="text-sm text-base-content/60">{stat.label}</p>
                                    <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-3 bg-base-200 rounded-full ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body">
                        <h3 className="card-title text-lg">Recent Activity</h3>
                        <p className="text-base-content/60">No recent activity to show.</p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body">
                        <h3 className="card-title text-lg">System Health</h3>
                        <div className="flex items-center gap-2 text-success">
                            <div className="w-2 h-2 rounded-full bg-success"></div>
                            <span>All systems operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
