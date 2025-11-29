'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const SUBJECTS = [
    'General', 'Mathematics', 'English', 'Physics', 'Chemistry',
    'Biology', 'Commerce', 'Economics', 'Government', 'Literature',
    'CRK', 'Arabic', 'French'
];

const ROOM_TYPES = [
    { value: 'public', label: 'Public', description: 'Anyone can join' },
    { value: 'study-group', label: 'Study Group', description: 'Collaborative learning' },
    { value: 'subject', label: 'Subject Room', description: 'Focused on specific subject' },
];

export default function CreateRoomModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'public',
        subject: 'General',
        maxMembers: 100,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                ...formData,
                settings: {
                    maxMembers: parseInt(formData.maxMembers),
                    allowImages: true,
                    allowFiles: false,
                },
            });

            // Reset form
            setFormData({
                name: '',
                description: '',
                type: 'public',
                subject: 'General',
                maxMembers: 100,
            });
        } catch (error) {
            console.error('Failed to create room:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-2xl">Create Chat Room</h3>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Room Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Room Name *</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., JAMB 2025 Study Group"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Description</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the room..."
                            className="textarea textarea-bordered w-full"
                            rows={3}
                        />
                    </div>

                    {/* Room Type */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Room Type *</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {ROOM_TYPES.map((type) => (
                                <label
                                    key={type.value}
                                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${formData.type === type.value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-base-300 hover:border-primary/50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type.value}
                                        checked={formData.type === type.value}
                                        onChange={handleChange}
                                        className="radio radio-primary radio-sm"
                                    />
                                    <div className="ml-2">
                                        <p className="font-semibold text-sm">{type.label}</p>
                                        <p className="text-xs text-base-content/60">{type.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Subject *</span>
                        </label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                            required
                        >
                            {SUBJECTS.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Max Members */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Max Members</span>
                        </label>
                        <input
                            type="number"
                            name="maxMembers"
                            value={formData.maxMembers}
                            onChange={handleChange}
                            min="2"
                            max="500"
                            className="input input-bordered w-full"
                        />
                        <label className="label">
                            <span className="label-text-alt text-base-content/60">
                                Maximum number of members allowed in this room
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="modal-action">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting || !formData.name.trim()}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Creating...
                                </>
                            ) : (
                                'Create Room'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}
