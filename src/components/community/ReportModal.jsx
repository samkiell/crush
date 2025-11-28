'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reportContent } from '@/store/slices/communitySlice';
import { AlertTriangle } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, targetType, targetId }) => {
    const dispatch = useDispatch();
    const [reason, setReason] = useState('Spam');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await dispatch(reportContent({ targetType, targetId, reason, description })).unwrap();
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setDescription('');
                setReason('Spam');
            }, 2000);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 w-full max-w-md p-6 relative">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>

                <h3 className="font-bold text-xl flex items-center gap-2 mb-6 text-base-content">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                    Report Content
                </h3>

                {success ? (
                    <div className="py-8 text-center text-success">
                        <p className="font-bold text-lg">Report submitted successfully.</p>
                        <p className="text-base-content/70 mt-2">Thank you for helping keep our community safe.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="alert alert-error text-sm py-2 rounded-xl">{error}</div>}

                        <div className="form-control">
                            <label className="label pl-1">
                                <span className="label-text font-bold text-base-content/70">Reason</span>
                            </label>
                            <select
                                className="select select-bordered w-full bg-base-200/50 rounded-xl focus:border-primary focus:outline-none"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <option value="Spam">Spam</option>
                                <option value="Harassment">Harassment</option>
                                <option value="Inappropriate Content">Inappropriate Content</option>
                                <option value="Misinformation">Misinformation</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label pl-1">
                                <span className="label-text font-bold text-base-content/70">Description (Optional)</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24 bg-base-200/50 rounded-xl focus:border-primary focus:outline-none resize-none"
                                placeholder="Please provide more details..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={onClose} className="btn btn-ghost rounded-xl">Cancel</button>
                            <button type="submit" className="btn btn-error rounded-xl shadow-lg shadow-error/20" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
