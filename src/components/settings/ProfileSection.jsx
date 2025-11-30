'use client';

import { useState, useRef } from 'react';
import { Camera, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ProfileSection({ user, onUpdate }) {
    const [formData, setFormData] = useState({
        username: user?.profile?.username || '',
        firstName: user?.profile?.firstName || '',
        lastName: user?.profile?.lastName || '',
        email: user?.profile?.email || '',
        phone: user?.profile?.phone || '',
        bio: user?.profile?.bio || '',
    });
    const [avatar, setAvatar] = useState(user?.profile?.avatar || '');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            // 1. Get Signature
            const sigRes = await fetch('/api/media/signature');
            const sigData = await sigRes.json();

            if (!sigRes.ok) throw new Error(sigData.error);

            // 2. Upload to Cloudinary
            const data = new FormData();
            data.append('file', file);
            data.append('api_key', sigData.apiKey);
            data.append('timestamp', sigData.timestamp);
            data.append('signature', sigData.signature);
            data.append('folder', sigData.folder);
            // data.append('upload_preset', 'your_preset'); // If needed

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: data,
                }
            );
            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Upload failed');

            // 3. Update Backend
            const updateRes = await fetch('/api/settings/avatar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    avatarUrl: uploadData.secure_url,
                    publicId: uploadData.public_id,
                }),
            });

            if (!updateRes.ok) throw new Error('Failed to update profile picture');

            setAvatar(uploadData.secure_url);
            toast.success('Profile picture updated!');
            onUpdate(); // Refresh parent data
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/settings/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            toast.success('Profile updated successfully');
            onUpdate();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Avatar Column */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-base-200 shadow-lg relative bg-base-300">
                            {avatar ? (
                                <Image
                                    src={avatar}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-base-content/30">
                                    {formData.firstName?.[0]}{formData.lastName?.[0]}
                                </div>
                            )}

                            {/* Overlay */}
                            <div
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="text-white w-8 h-8" />
                            </div>
                        </div>

                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 rounded-full">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-sm btn-outline"
                        disabled={uploading}
                    >
                        Change Photo
                    </button>
                </div>

                {/* Form Column */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">First Name</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input input-bordered w-full focus:input-primary"
                                placeholder="John"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Last Name</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input input-bordered w-full focus:input-primary"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Username</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input input-bordered w-full focus:input-primary"
                                placeholder="johndoe"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered w-full focus:input-primary"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Phone Number</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="input input-bordered w-full focus:input-primary"
                            placeholder="+234..."
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Bio</span>
                            <span className="label-text-alt">{formData.bio.length}/160</span>
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="textarea textarea-bordered h-24 focus:textarea-primary resize-none"
                            placeholder="Tell us a bit about yourself..."
                            maxLength={160}
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="btn btn-primary px-8 gap-2"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
