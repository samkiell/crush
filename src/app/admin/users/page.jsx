'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, Shield, User as UserIcon, Mail, Calendar } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            setUsers(response.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold">User Management</h1>
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-base-content/50" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input input-bordered w-full pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden border border-base-200">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-10 h-10">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} />
                                                    ) : (
                                                        <span className="text-xs">{user.name?.charAt(0) || 'U'}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-sm opacity-50">{user.email}</div>
                                                <div className="text-xs opacity-50">@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'} gap-2`}>
                                            {user.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar size={14} className="opacity-50" />
                                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success badge-sm">Active</span>
                                    </td>
                                    <td>
                                        <Link href={`/profile/${user.username}`} className="btn btn-ghost btn-xs">
                                            View Profile
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-base-content/50">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-sm text-base-content/50 text-right">
                Total Users: {users.length}
            </div>
        </div>
    );
}
