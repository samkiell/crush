'use client';

import { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, Shield, Trash2, Mail, Ban, CheckCircle, Edit, X, Crown, BookOpen, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // For actions modal

    useEffect(() => {
        fetchUsers();
        
        // Auto-refresh when back online
        const handleOnline = () => {
            toast.success('Connection restored. Refreshing users...');
            fetchUsers();
        };
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
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
                // Don't close modal immediately to allow multiple edits, or close if preferred
                // setSelectedUser(null); 
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

    // Stats Calculation
    const totalUsers = users.length;
    const premiumUsers = users.filter(u => u.plan === 'premium').length;
    const freeUsers = totalUsers - premiumUsers;
    const activeExams = users.filter(u => u.activeSession?.mode === 'cbt').length;

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto pb-24 md:pb-6 space-y-8">
            {/* Header & Stats */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Users className="w-8 h-8 text-primary" />
                            User Management
                        </h1>
                        <p className="text-base-content/60">Overview of all registered students and staff</p>
                    </div>
                    
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="input input-bordered pl-10 w-full md:w-72 rounded-xl shadow-sm focus:shadow-md transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stat bg-base-100 shadow-sm rounded-2xl border border-base-200 p-6 flex flex-col items-center text-center">
                        <div className="stat-figure text-primary mb-2">
                            <Users size={32} />
                        </div>
                        <div className="stat-title text-sm font-bold uppercase tracking-wider opacity-70">Total Users</div>
                        <div className="stat-value text-3xl">{totalUsers}</div>
                        <div className="stat-desc">Registered accounts</div>
                    </div>
                    
                    <div className="stat bg-base-100 shadow-sm rounded-2xl border border-base-200 p-6 flex flex-col items-center text-center">
                        <div className="stat-figure text-secondary mb-2">
                            <Crown size={32} />
                        </div>
                        <div className="stat-title text-sm font-bold uppercase tracking-wider opacity-70">Premium</div>
                        <div className="stat-value text-3xl">{premiumUsers}</div>
                        <div className="stat-desc">{((premiumUsers/totalUsers)*100 || 0).toFixed(1)}% of total</div>
                    </div>

                    <div className="stat bg-base-100 shadow-sm rounded-2xl border border-base-200 p-6 flex flex-col items-center text-center">
                        <div className="stat-figure text-accent mb-2">
                            <BookOpen size={32} />
                        </div>
                        <div className="stat-title text-sm font-bold uppercase tracking-wider opacity-70">Free Plan</div>
                        <div className="stat-value text-3xl">{freeUsers}</div>
                        <div className="stat-desc">Standard access</div>
                    </div>

                    <div className="stat bg-base-100 shadow-sm rounded-2xl border border-base-200 p-6 flex flex-col items-center text-center">
                        <div className="stat-figure text-error mb-2">
                            <Shield size={32} />
                        </div>
                        <div className="stat-title text-sm font-bold uppercase tracking-wider opacity-70">Active Exams</div>
                        <div className="stat-value text-3xl">{activeExams}</div>
                        <div className="stat-desc">Currently in session</div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-base-200/50 text-base-content/70 border-b border-base-200">
                                <th className="w-12 text-center border-r border-base-200/50">#</th>
                                <th className="py-4 pl-6 border-r border-base-200/50">User Identity</th>
                                <th className="hidden md:table-cell border-r border-base-200/50">Role</th>
                                <th className="border-r border-base-200/50">Current Plan</th>
                                <th className="border-r border-base-200/50">Live Status</th>
                                <th className="hidden lg:table-cell border-r border-base-200/50">Joined Date</th>
                                <th className="pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="7" className="text-center py-6">
                                            <div className="h-10 bg-base-200 rounded-lg animate-pulse w-full max-w-3xl mx-auto"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-base-content/60">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users size={32} className="opacity-20" />
                                            <p>No users found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-base-200/30 transition-colors group border-b border-base-100 last:border-0">
                                        <td className="text-center font-mono text-xs opacity-50 border-r border-base-200/50">
                                            {index + 1}
                                        </td>
                                        <td className="pl-6 border-r border-base-200/50">
                                            <div className="flex items-center gap-4">
                                                <div className={`avatar placeholder ${user.isSuspended ? 'grayscale opacity-50' : ''}`}>
                                                    <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 ring ring-base-200 ring-offset-1 flex items-center justify-center">
                                                        <span className="text-sm font-bold">{user.name?.charAt(0) || 'U'}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        {user.name}
                                                        {user.isSuspended && <span className="badge badge-xs badge-error">Suspended</span>}
                                                    </div>
                                                    <div className="text-xs opacity-50 font-mono">{user.email}</div>
                                                    {/* Mobile Only Details */}
                                                    <div className="flex md:hidden gap-2 mt-1">
                                                        <span className="text-[10px] uppercase font-bold opacity-70 bg-base-200 px-1 rounded">{user.role}</span>
                                                        <span className="text-[10px] uppercase font-bold opacity-70 bg-base-200 px-1 rounded">{user.plan}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell border-r border-base-200/50">
                                            <div className="flex flex-col gap-1">
                                                <span className={`badge ${user.role === 'admin' ? 'badge-primary' : user.role === 'tutor' ? 'badge-accent' : 'badge-ghost'} badge-sm font-bold uppercase tracking-wider`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="border-r border-base-200/50">
                                            <span className={`badge ${user.plan === 'premium' ? 'badge-secondary' : 'badge-outline'} badge-sm gap-1`}>
                                                {user.plan === 'premium' && <Crown size={10} />}
                                                {user.plan || 'Free'}
                                            </span>
                                        </td>
                                        <td className="border-r border-base-200/50">
                                            {user.isSuspended ? (
                                                <span className="text-error text-xs font-bold flex items-center gap-1">
                                                    <Ban size={12} /> Access Denied
                                                </span>
                                            ) : user.activeSession ? (
                                                user.activeSession.mode === 'cbt' ? (
                                                    <span className="badge badge-error badge-sm animate-pulse gap-2 shadow-lg shadow-error/20">
                                                        <span className="w-2 h-2 rounded-full bg-white"></span>
                                                        Taking Exam
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-info badge-sm gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-white"></span>
                                                        Studying
                                                    </span>
                                                )
                                            ) : (
                                                <span className="text-base-content/40 text-xs flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-base-content/20"></div>
                                                    Offline
                                                </span>
                                            )}
                                        </td>
                                        <td className="hidden lg:table-cell text-sm font-mono opacity-70 border-r border-base-200/50">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.activeSession && user.activeSession.mode === 'cbt' && (
                                                    <button 
                                                        onClick={() => handleKillSession(user.activeSession.sessionId, user.name)}
                                                        className="btn btn-error btn-xs text-white shadow-sm"
                                                        title="Kill Active Session"
                                                    >
                                                        <Shield className="w-3 h-3" /> Kill
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setSelectedUser(user)}
                                                    className="btn btn-ghost btn-sm btn-square"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh] border border-base-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-base-200 bg-base-100 flex justify-between items-start sticky top-0 z-10">
                            <div>
                                <h3 className="text-xl font-bold text-base-content">Manage User</h3>
                                <p className="text-base-content/60 text-sm mt-1">Update permissions and account status</p>
                            </div>
                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="btn btn-sm btn-circle btn-ghost hover:bg-base-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto space-y-8 bg-base-100">
                            {/* User Info */}
                            <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-2xl border border-base-200">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-14 h-14 flex items-center justify-center ring-2 ring-base-300 ring-offset-2 ring-offset-base-100">
                                        <span className="text-xl font-bold">{selectedUser.name?.charAt(0) || 'U'}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-base-content">{selectedUser.name}</div>
                                    <div className="text-sm opacity-60 font-mono">{selectedUser.email}</div>
                                    <div className="flex gap-2 mt-2">
                                         <span className="badge badge-sm badge-ghost font-mono text-xs">
                                            Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                                         </span>
                                    </div>
                                </div>
                            </div>

                            {/* Plan Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-50 ml-1 flex items-center gap-2">
                                    <BookOpen size={14} /> Subscription Plan
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Free Plan Option */}
                                    <button 
                                        onClick={() => handleUpdateUser(selectedUser._id, { plan: 'free' })}
                                        className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-3 hover:shadow-md ${
                                            selectedUser.plan === 'free' 
                                            ? 'border-neutral bg-neutral/5 ring-1 ring-neutral/20' 
                                            : 'border-base-200 hover:border-base-300 bg-base-100'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <div className={`p-2 rounded-xl ${selectedUser.plan === 'free' ? 'bg-neutral text-neutral-content' : 'bg-base-200 text-base-content/70'}`}>
                                                <BookOpen size={20} />
                                            </div>
                                            {selectedUser.plan === 'free' && (
                                                <div className="badge badge-neutral badge-sm font-bold">ACTIVE</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-base-content">Free Plan</div>
                                            <div className="text-xs text-base-content/60 mt-1">Standard access to basic features</div>
                                        </div>
                                    </button>

                                    {/* Premium Plan Option */}
                                    <button 
                                        onClick={() => handleUpdateUser(selectedUser._id, { plan: 'premium' })}
                                        className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-3 hover:shadow-md ${
                                            selectedUser.plan === 'premium' 
                                            ? 'border-secondary bg-secondary/5 ring-1 ring-secondary/20' 
                                            : 'border-base-200 hover:border-base-300 bg-base-100'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <div className={`p-2 rounded-xl ${selectedUser.plan === 'premium' ? 'bg-secondary text-secondary-content' : 'bg-base-200 text-base-content/70'}`}>
                                                <Crown size={20} />
                                            </div>
                                            {selectedUser.plan === 'premium' && (
                                                <div className="badge badge-secondary badge-sm font-bold">ACTIVE</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-base-content">Premium</div>
                                            <div className="text-xs text-base-content/60 mt-1">Full access to all features & exams</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-50 ml-1 flex items-center gap-2">
                                    <Shield size={14} /> User Role
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['student', 'tutor', 'admin'].map((role) => (
                                        <button 
                                            key={role}
                                            onClick={() => handleUpdateUser(selectedUser._id, { role })}
                                            className={`btn h-auto py-3 capitalize flex flex-col gap-1 border-2 ${
                                                selectedUser.role === role 
                                                ? role === 'admin' ? 'btn-neutral border-neutral' 
                                                  : role === 'tutor' ? 'btn-accent border-accent text-white'
                                                  : 'btn-primary border-primary'
                                                : 'btn-ghost bg-base-100 border-base-200 hover:border-base-300'
                                            }`}
                                        >
                                            {selectedUser.role === role && <CheckCircle size={16} className="mb-1" />}
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="space-y-4 pt-6 border-t border-base-200">
                                <label className="text-xs font-bold uppercase tracking-wider text-error ml-1 flex items-center gap-2">
                                    <Ban size={14} /> Danger Zone
                                </label>
                                
                                <div className="flex items-center justify-between p-4 bg-error/5 rounded-2xl border border-error/10 hover:border-error/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-error/10 rounded-xl text-error">
                                            <Ban size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-base-content">Suspend Account</div>
                                            <div className="text-xs text-base-content/60">Temporarily disable user access</div>
                                        </div>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="toggle toggle-error"
                                        checked={selectedUser.isSuspended}
                                        onChange={(e) => handleUpdateUser(selectedUser._id, { isSuspended: e.target.checked })}
                                    />
                                </div>

                                <button 
                                    onClick={() => handleDeleteUser(selectedUser._id)}
                                    className="btn btn-error btn-outline w-full gap-2 hover:bg-error hover:text-white transition-all"
                                >
                                    <Trash2 size={18} /> Delete User Permanently
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
