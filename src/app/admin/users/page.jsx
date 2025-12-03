'use client';

import { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, Shield, Trash2, Mail, Ban, CheckCircle, Edit, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // For actions modal

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleKillSession = async (sessionId, userName) => {
        if (!confirm(`Are you sure you want to KILL the active session for ${userName}? This will lock them out immediately.`)) return;

        try {
            const res = await fetch('/api/admin/cbt/kill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, reason: 'Terminated by Admin' }),
            });
            
            if (res.ok) {
                toast.success(`Session for ${userName} terminated.`);
                fetchUsers(); 
            } else {
                toast.error('Failed to kill session');
            }
        } catch (error) {
            console.error('Kill session error', error);
            toast.error('Error killing session');
        }
    };

    const handleUpdateUser = async (userId, updates) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                toast.success('User updated successfully');
                fetchUsers();
                setSelectedUser(null);
            } else {
                toast.error('Failed to update user');
            }
        } catch (error) {
            toast.error('Error updating user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to DELETE this user? This action cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('User deleted');
                fetchUsers();
                setSelectedUser(null);
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            toast.error('Error deleting user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto pb-24 md:pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        User Management
                    </h1>
                    <p className="text-base-content/60">Manage registered students and administrators</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input input-bordered pl-10 w-full md:w-64 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-base-200/50">
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="5" className="text-center py-4">
                                            <div className="h-8 bg-base-200 rounded animate-pulse w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-base-content/60">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-base-200/30 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                        <span className="text-xs">{user.name?.charAt(0) || 'U'}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        {user.name}
                                                        {user.isSuspended && <span className="text-error text-xs font-bold">(Suspended)</span>}
                                                    </div>
                                                    <div className="text-xs opacity-50">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'} badge-sm`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            {user.isSuspended ? (
                                                <span className="badge badge-error badge-sm">Suspended</span>
                                            ) : user.activeSession ? (
                                                user.activeSession.mode === 'cbt' ? (
                                                    <span className="badge badge-error badge-sm animate-pulse gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                        In Exam
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-info badge-sm gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                        Studying
                                                    </span>
                                                )
                                            ) : (
                                                <span className="badge badge-ghost badge-sm opacity-50">Idle</span>
                                            )}
                                        </td>
                                        <td className="text-sm font-mono opacity-70">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {user.activeSession && user.activeSession.mode === 'cbt' && (
                                                    <button 
                                                        onClick={() => handleKillSession(user.activeSession.sessionId, user.name)}
                                                        className="btn btn-error btn-xs text-white"
                                                        title="Kill Active Session"
                                                    >
                                                        <Shield className="w-3 h-3" /> Kill
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setSelectedUser(user)}
                                                    className="btn btn-ghost btn-xs"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actions Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                        <button 
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
                        >
                            <X size={20} />
                        </button>
                        
                        <h3 className="text-xl font-bold mb-1">Manage User</h3>
                        <p className="text-base-content/60 mb-6">{selectedUser.name} ({selectedUser.email})</p>

                        <div className="flex flex-col gap-3">
                            {/* Role Toggle */}
                            <div className="flex items-center justify-between p-3 bg-base-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-primary" />
                                    <div>
                                        <div className="font-bold">Admin Privileges</div>
                                        <div className="text-xs opacity-60">Grant full access to dashboard</div>
                                    </div>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="toggle toggle-primary"
                                    checked={selectedUser.role === 'admin'}
                                    onChange={(e) => handleUpdateUser(selectedUser._id, { role: e.target.checked ? 'admin' : 'student' })}
                                />
                            </div>

                            {/* Suspend Toggle */}
                            <div className="flex items-center justify-between p-3 bg-base-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Ban className="w-5 h-5 text-error" />
                                    <div>
                                        <div className="font-bold">Suspend Account</div>
                                        <div className="text-xs opacity-60">Prevent user from logging in</div>
                                    </div>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="toggle toggle-error"
                                    checked={selectedUser.isSuspended}
                                    onChange={(e) => handleUpdateUser(selectedUser._id, { isSuspended: e.target.checked })}
                                />
                            </div>

                            <div className="divider">DANGER ZONE</div>

                            <button 
                                onClick={() => handleDeleteUser(selectedUser._id)}
                                className="btn btn-error btn-outline w-full gap-2"
                            >
                                <Trash2 size={18} /> Delete User Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
