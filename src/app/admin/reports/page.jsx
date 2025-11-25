'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports, updateReportStatus, selectReports, selectAdminLoading, selectAdminError } from '@/store/slices/adminSlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { AlertCircle, CheckCircle, XCircle, ExternalLink, Filter } from 'lucide-react';
import Link from 'next/link';

const ReportsPage = () => {
    const dispatch = useDispatch();
    const reports = useSelector(selectReports);
    const loading = useSelector(selectAdminLoading);
    const error = useSelector(selectAdminError);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchReports());
    }, [dispatch]);

    const handleStatusUpdate = (id, status) => {
        if (confirm(`Are you sure you want to mark this report as ${status}?`)) {
            dispatch(updateReportStatus({ id, status }));
        }
    };

    const filteredReports = reports.filter(report => {
        if (filter === 'all') return true;
        return report.status === filter;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="badge badge-warning">Pending</span>;
            case 'resolved': return <span className="badge badge-success">Resolved</span>;
            case 'dismissed': return <span className="badge badge-ghost">Dismissed</span>;
            default: return <span className="badge">Unknown</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Moderation Queue</h1>

                <div className="join">
                    <button
                        className={`join-item btn btn-sm ${filter === 'all' ? 'btn-active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`join-item btn btn-sm ${filter === 'pending' ? 'btn-active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`join-item btn btn-sm ${filter === 'resolved' ? 'btn-active' : ''}`}
                        onClick={() => setFilter('resolved')}
                    >
                        Resolved
                    </button>
                    <button
                        className={`join-item btn btn-sm ${filter === 'dismissed' ? 'btn-active' : ''}`}
                        onClick={() => setFilter('dismissed')}
                    >
                        Dismissed
                    </button>
                </div>
            </div>

            {loading && <div className="text-center py-10"><span className="loading loading-spinner loading-lg"></span></div>}

            {error && (
                <div className="alert alert-error">
                    <AlertCircle className="w-6 h-6" />
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && filteredReports.length === 0 && (
                <div className="text-center py-10 bg-base-100 rounded-box shadow-sm">
                    <p className="text-base-content/60">No reports found matching this filter.</p>
                </div>
            )}

            <div className="grid gap-4">
                {filteredReports.map((report) => (
                    <div key={report._id} className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body p-6">
                            <div className="flex flex-col md:flex-row gap-6 justify-between">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getStatusBadge(report.status)}
                                        <span className="text-xs text-base-content/50">
                                            Reported {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        {report.reason}
                                        <span className="badge badge-outline text-xs">{report.targetType}</span>
                                    </h3>

                                    {report.description && (
                                        <p className="text-sm bg-base-200 p-2 rounded italic">"{report.description}"</p>
                                    )}

                                    <div className="text-sm text-base-content/70">
                                        Reported by: <span className="font-medium">{report.reporter?.name || 'Unknown'}</span>
                                    </div>

                                    <div className="mt-4">
                                        <Link
                                            href={`/community/${report.targetType === 'CommunityPost' ? report.targetId._id : report.targetId.post}`}
                                            className="btn btn-xs btn-outline gap-1"
                                            target="_blank"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            View Content
                                        </Link>
                                    </div>
                                </div>

                                {report.status === 'pending' && (
                                    <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-base-200 pt-4 md:pt-0 md:pl-6">
                                        <button
                                            onClick={() => handleStatusUpdate(report._id, 'resolved')}
                                            className="btn btn-sm btn-success text-white w-full md:w-auto"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Resolve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(report._id, 'dismissed')}
                                            className="btn btn-sm btn-ghost text-base-content/70 w-full md:w-auto"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportsPage;
