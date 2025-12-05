'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Send, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Link as LinkIcon,
  Type,
  Layout
} from 'lucide-react';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    link: '',
    category: 'system'
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements?limit=50');
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Announcement broadcasted successfully!' });
        setFormData({ title: '', message: '', link: '', category: 'system' });
        fetchAnnouncements();
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send announcement' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-indigo-600" />
              Global Announcements
            </h1>
            <p className="mt-2 text-gray-600">
              Broadcast real-time messages to all active users.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900">Create New</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {status.message && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 text-sm ${
                    status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {status.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0" />
                    )}
                    {status.message}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., System Maintenance"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="relative">
                    <Layout className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="system">System</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="update">Update</option>
                      <option value="post">Post Promotion</option>
                      <option value="info">General Info</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your announcement message..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      placeholder="/post/123 or https://..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Broadcast Now
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* History List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full max-h-[800px]">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
                <span className="text-sm text-gray-500">{announcements.length} total</span>
              </div>

              <div className="overflow-y-auto flex-1 p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No announcements sent yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
                      >
                        <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          item.category === 'maintenance' ? 'bg-red-100 text-red-600' :
                          item.category === 'update' ? 'bg-blue-100 text-blue-600' :
                          'bg-indigo-100 text-indigo-600'
                        }`}>
                          <Megaphone className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.message}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="capitalize px-2 py-0.5 rounded-full bg-gray-100">
                              {item.category}
                            </span>
                            {item.link && (
                              <span className="flex items-center gap-1 text-indigo-600">
                                <LinkIcon className="h-3 w-3" />
                                {item.link}
                              </span>
                            )}
                            <span className="ml-auto">
                              By: {item.createdBy?.name || 'Admin'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
