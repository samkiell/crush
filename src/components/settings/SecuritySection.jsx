'use client';

import { useState } from 'react';
import { Key, ShieldCheck, LogOut, Smartphone, Monitor, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function SecuritySection({ user }) {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/settings/security', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            toast.success('Password updated successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Password Change */}
            <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    Change Password
                </h3>
                <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-200/30 p-6 rounded-xl border border-base-200">
                    <div className="form-control md:col-span-2">
                        <label className="label">
                            <span className="label-text font-medium">Current Password</span>
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">New Password</span>
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Confirm New Password</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </section>

            <div className="divider" />

            {/* Login History */}
            <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Login Activity
                </h3>
                <div className="space-y-3">
                    {/* Current Session */}
                    <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
                                <Monitor size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-sm">Current Session</div>
                                <div className="text-xs opacity-70">Active now • {user?.security?.lastLogin ? format(new Date(user.security.lastLogin), 'PP p') : 'Just now'}</div>
                            </div>
                        </div>
                        <div className="badge badge-success badge-sm">Active</div>
                    </div>

                    {/* History List */}
                    {user?.security?.loginHistory?.length > 0 ? (
                        user.security.loginHistory.map((session, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center opacity-70">
                                        <Smartphone size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{session.device || 'Unknown Device'}</div>
                                        <div className="text-xs opacity-70">{session.ip} • {format(new Date(session.date), 'PP p')}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 opacity-50 text-sm">No other login history available.</div>
                    )}
                </div>
            </section>

            <div className="divider" />

            {/* Danger Zone */}
            <section>
                <h3 className="text-lg font-bold mb-4 text-error flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                </h3>
                <div className="border border-error/20 bg-error/5 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="font-bold text-error">Delete Account</div>
                        <div className="text-sm opacity-70">Permanently delete your account and all of your content.</div>
                    </div>
                    <button className="btn btn-error btn-outline btn-sm">Delete Account</button>
                </div>
            </section>
        </div>
    );
}
