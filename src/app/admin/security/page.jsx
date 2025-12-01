'use client';

import { ShieldAlert, AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';

export default function SecurityLogsPage() {
    const logs = [
        { id: 1, type: 'warning', message: 'Failed login attempt from IP 192.168.1.1', time: '10 mins ago', user: 'Unknown' },
        { id: 2, type: 'success', message: 'Admin login successful', time: '1 hour ago', user: 'admin@crush.edu' },
        { id: 3, type: 'info', message: 'System backup completed', time: '2 hours ago', user: 'System' },
        { id: 4, type: 'warning', message: 'Multiple failed password resets', time: '5 hours ago', user: 'user123' },
        { id: 5, type: 'success', message: 'New admin account created', time: '1 day ago', user: 'SuperAdmin' },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-success" />;
            default: return <ShieldAlert className="w-5 h-5 text-info" />;
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto pb-24 md:pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-error" />
                        Security Logs
                    </h1>
                    <p className="text-base-content/60">View access logs and security alerts</p>
                </div>

                <button className="btn btn-outline gap-2">
                    <Filter className="w-4 h-4" />
                    Filter Logs
                </button>
            </div>

            <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-base-200/50">
                                <th>Status</th>
                                <th>Event</th>
                                <th>User / Source</th>
                                <th>Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-base-200/30 transition-colors">
                                    <td>
                                        <div className="flex items-center gap-2">
                                            {getIcon(log.type)}
                                            <span className="capitalize text-sm font-medium">{log.type}</span>
                                        </div>
                                    </td>
                                    <td className="font-medium">{log.message}</td>
                                    <td className="font-mono text-xs opacity-70">{log.user}</td>
                                    <td className="text-sm opacity-70 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {log.time}
                                    </td>
                                    <td>
                                        <button className="btn btn-ghost btn-xs">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-base-200 flex justify-center">
                    <div className="join">
                        <button className="join-item btn btn-sm">«</button>
                        <button className="join-item btn btn-sm btn-active">1</button>
                        <button className="join-item btn btn-sm">2</button>
                        <button className="join-item btn btn-sm">3</button>
                        <button className="join-item btn btn-sm">»</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
