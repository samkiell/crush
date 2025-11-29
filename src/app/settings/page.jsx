'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectUser, selectIsAuthenticated, updateProfile } from '@/store/slices/authSlice';
import { Loader2, Camera, Save, User, Mail, BookOpen, Shield } from 'lucide-react';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from '@/utils/toast-helpers';
import axios from 'axios';

export default function SettingsPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [examType, setExamType] = useState('JAMB');
    const [avatar, setAvatar] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        } else if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setExamType(user.examType || 'JAMB');
            setAvatar(user.avatar || '');
        }
    }, [isAuthenticated, user, router]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showErrorToast('File is too large (Max 5MB)');
            return;
        }

        setAvatarFile(file);

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = showLoadingToast('Updating profile...');

        try {
            let avatarUrl = avatar;
            let avatarPublicId = user?.avatarPublicId;

            // Upload new avatar if selected
            if (avatarFile) {
                const formData = new FormData();
                formData.append('file', avatarFile);
                formData.append('type', 'profiles');

                const uploadRes = await axios.post('/api/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                avatarUrl = uploadRes.data.url;
                avatarPublicId = uploadRes.data.publicId;
            }

            // Update user profile
            await dispatch(updateProfile({
                name,
                email,
                examType,
                avatar: avatarUrl,
                avatarPublicId
            })).unwrap();

            dismissToast(toastId);
            showSuccessToast('Profile updated successfully!');
            setAvatarFile(null);
        } catch (error) {
            dismissToast(toastId);
            showErrorToast(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || !user) return null;

    return (
        <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-base-content">Account Settings</h1>
                    <p className="mt-2 text-base-content/60">Manage your profile and preferences</p>
                </div>

                <div className="bg-base-100 rounded-3xl shadow-xl border border-base-200 overflow-hidden">
                    {/* Header / Banner */}
                    <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10 w-full"></div>

                    <div className="px-8 pb-8">
                        {/* Avatar Upload */}
                        <div className="relative -mt-16 mb-8 flex justify-center">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full ring-4 ring-base-100 overflow-hidden bg-base-200 shadow-lg">
                                    {avatar ? (
                                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-content text-4xl font-bold">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:bg-primary-focus transition-colors ring-2 ring-base-100">
                                    <Camera className="w-5 h-5" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Name */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2">
                                            <User className="w-4 h-4" /> Full Name
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input input-bordered w-full rounded-xl focus:input-primary"
                                        placeholder="Your Name"
                                    />
                                </div>

                                {/* Email */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email Address
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input input-bordered w-full rounded-xl focus:input-primary"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                {/* Exam Type */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" /> Exam Focus
                                        </span>
                                    </label>
                                    <select
                                        value={examType}
                                        onChange={(e) => setExamType(e.target.value)}
                                        className="select select-bordered w-full rounded-xl focus:select-primary"
                                    >
                                        <option value="JAMB">JAMB</option>
                                        <option value="WAEC">WAEC</option>
                                        <option value="NECO">NECO</option>
                                        <option value="PUTME">Post-UTME</option>
                                        <option value="DE">Direct Entry</option>
                                    </select>
                                </div>

                                {/* Role (Read Only) */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-2">
                                            <Shield className="w-4 h-4" /> Account Type
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={user.role || 'Student'}
                                        readOnly
                                        className="input input-bordered w-full rounded-xl bg-base-200/50 text-base-content/60"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary w-full rounded-xl shadow-lg hover:shadow-xl transition-all h-12 text-lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
