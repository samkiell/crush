'use client';

import { BarChart3, TrendingUp, Users, Activity, Clock } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto pb-24 md:pb-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-info" />
                    Platform Analytics
                </h1>
                <p className="text-base-content/60">Monitor system performance and usage statistics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="stats shadow border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <Users className="w-8 h-8 opacity-20" />
                        </div>
                        <div className="stat-title">Total Users</div>
                        <div className="stat-value text-primary">25.6K</div>
                        <div className="stat-desc">21% more than last month</div>
                    </div>
                </div>

                <div className="stats shadow border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <Activity className="w-8 h-8 opacity-20" />
                        </div>
                        <div className="stat-title">Active Sessions</div>
                        <div className="stat-value text-secondary">2,600</div>
                        <div className="stat-desc">Current active users</div>
                    </div>
                </div>

                <div className="stats shadow border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <TrendingUp className="w-8 h-8 opacity-20" />
                        </div>
                        <div className="stat-title">Exam Completion</div>
                        <div className="stat-value text-accent">86%</div>
                        <div className="stat-desc">Average completion rate</div>
                    </div>
                </div>

                <div className="stats shadow border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-info">
                            <Clock className="w-8 h-8 opacity-20" />
                        </div>
                        <div className="stat-title">Avg. Session</div>
                        <div className="stat-value text-info">42m</div>
                        <div className="stat-desc">Time spent per visit</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">User Growth</h3>
                        <div className="h-64 flex items-center justify-center bg-base-200/30 rounded-xl border border-dashed border-base-300">
                            <span className="text-base-content/40">Chart Visualization Placeholder</span>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Exam Performance</h3>
                        <div className="h-64 flex items-center justify-center bg-base-200/30 rounded-xl border border-dashed border-base-300">
                            <span className="text-base-content/40">Chart Visualization Placeholder</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
