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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="modal-box relative">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

                <h3 className="font-bold text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Report Content
                </h3>

                {success ? (
                    <div className="py-8 text-center text-success">
                        <p className="font-bold">Report submitted successfully.</p>
                        <p className="text-sm">Thank you for helping keep our community safe.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="py-4 space-y-4">
                        {error && <div className="alert alert-error text-sm py-2">{error}</div>}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Reason</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
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
                            <label className="label">
                                <span className="label-text">Description (Optional)</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                placeholder="Please provide more details..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="modal-action">
                            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                            <button type="submit" className="btn btn-error" disabled={loading}>
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
