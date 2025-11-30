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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-base-100 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-base-200 flex-shrink-0">
                    <h3 className="font-bold text-lg">Create New Room</h3>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
                        {/* Room Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Room Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., JAMB 2025 Study Group"
                                className="input input-bordered w-full"
                                required
                                autoFocus
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="What is this room for?"
                                className="textarea textarea-bordered w-full h-20 resize-none"
                            />
                        </div>

                        {/* Room Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Room Type</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {ROOM_TYPES.map((type) => (
                                    <label
                                        key={type.value}
                                        className={`
                                            cursor-pointer border rounded-xl p-3 flex flex-col gap-1 transition-all
                                            ${formData.type === type.value
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                : 'border-base-200 hover:border-base-300'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm">{type.label}</span>
                                            <input
                                                type="radio"
                                                name="type"
                                                value={type.value}
                                                checked={formData.type === type.value}
                                                onChange={handleChange}
                                                className="radio radio-primary radio-xs"
                                            />
                                        </div>
                                        <span className="text-xs text-base-content/60 leading-tight">
                                            {type.description}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Subject & Max Members Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Subject</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                >
                                    {SUBJECTS.map((subject) => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Max Members</label>
                                <input
                                    type="number"
                                    name="maxMembers"
                                    value={formData.maxMembers}
                                    onChange={handleChange}
                                    min="2"
                                    max="500"
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-base-100 pb-2">
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
                                className="btn btn-primary px-8"
                                disabled={isSubmitting || !formData.name.trim()}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Room'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
