'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Flag, CheckCircle, XCircle, Filter, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, resolved

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
      }
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        toast.success(`Report marked as ${newStatus}`);
        setReports(reports.map(r => 
          r._id === id ? { ...r, status: newStatus } : r
        ));
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const filteredReports = reports.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Flag className="text-error" /> Reports & Issues
          </h1>
          
          <div className="flex w-full md:w-auto gap-2 md:gap-0 md:join">
            <button 
              className={`btn btn-sm flex-1 md:flex-none md:join-item ${filter === 'all' ? 'btn-active btn-neutral' : 'btn-ghost bg-base-200 md:bg-transparent'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`btn btn-sm flex-1 md:flex-none md:join-item ${filter === 'pending' ? 'btn-active btn-neutral' : 'btn-ghost bg-base-200 md:bg-transparent'}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`btn btn-sm flex-1 md:flex-none md:join-item ${filter === 'resolved' ? 'btn-active btn-neutral' : 'btn-ghost bg-base-200 md:bg-transparent'}`}
              onClick={() => setFilter('resolved')}
            >
              Resolved
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center p-12 bg-base-100 rounded-xl border border-base-200">
            <Flag className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
            <h3 className="text-lg font-bold opacity-60">No reports found</h3>
            <p className="text-sm opacity-40">Everything looks good!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredReports.map((report) => (
              <div key={report._id} className="bg-base-100 p-4 rounded-xl border border-base-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`badge ${
                        report.status === 'pending' ? 'badge-warning' : 
                        report.status === 'resolved' ? 'badge-success' : 'badge-ghost'
                      } badge-sm font-bold uppercase`}>
                        {report.status}
                      </span>
                      <span className="text-xs opacity-50">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-bold text-error bg-error/10 px-2 py-0.5 rounded-full">
                        {report.reason}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-1 break-words">
                      {report.targetType}: {report.subject} ({report.year}) - Q{report.qid}
                    </h3>
                    
                    {report.description && (
                      <p className="text-sm bg-base-200/50 p-3 rounded-lg mb-3 break-words">
                        "{report.description}"
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs opacity-60">
                      <span>Reported by:</span>
                      <span className="font-bold">{report.reporter?.name || 'Unknown User'}</span>
                      <span>({report.reporter?.email})</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                    {report.status !== 'resolved' && (
                      <button 
                        onClick={() => updateStatus(report._id, 'resolved')}
                        className="btn btn-sm btn-success btn-outline gap-2 flex-1 md:flex-none"
                      >
                        <CheckCircle size={16} /> Resolve
                      </button>
                    )}
                    {report.status !== 'dismissed' && (
                      <button 
                        onClick={() => updateStatus(report._id, 'dismissed')}
                        className="btn btn-sm btn-ghost gap-2 opacity-50 hover:opacity-100 flex-1 md:flex-none"
                      >
                        <XCircle size={16} /> Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
