import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '@/store/slices/authSlice';
import { X, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditProfileModal({ isOpen, onClose, user }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                bio: user.bio || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateProfile(formData)).unwrap();
            toast.success('Profile updated successfully!');
            onClose();
        } catch (error) {
            toast.error(error || 'Failed to update profile');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-base-100 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-base-200">
                    <h2 className="text-lg font-bold">Edit Profile</h2>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Full Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input input-bordered w-full focus:input-primary"
                            placeholder="Your Name"
                            required
                        />
                    </div>

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
                            placeholder="username"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Bio</span>
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="textarea textarea-bordered h-24 w-full focus:textarea-primary resize-none"
                            placeholder="Tell us about yourself..."
                            maxLength={160}
                        ></textarea>
                        <label className="label">
                            <span className="label-text-alt text-base-content/50">
                                {formData.bio.length}/160 characters
                            </span>
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
