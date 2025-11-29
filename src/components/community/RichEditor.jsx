'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, selectActionLoading } from '@/store/slices/communitySlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2, Send, X, Hash, FileText, MessageSquare, HelpCircle, ImagePlus } from 'lucide-react';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from '@/utils/toast-helpers';

const RichEditor = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const actionLoading = useSelector(selectActionLoading);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/community/create');
        }
    }, [isAuthenticated, router]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [tags, setTags] = useState('');
    const [isQuestion, setIsQuestion] = useState(false);
    const [attachments, setAttachments] = useState([]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        files.forEach(file => {
            if (file.size > MAX_SIZE) {
                showErrorToast(`File ${file.name} is too large (Max 5MB)`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachments(prev => [...prev, {
                    file,
                    preview: reader.result,
                    type: file.type,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    if (!isAuthenticated) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            showErrorToast('Please enter a title for your post');
            return;
        }
        if (!content.trim()) {
            showErrorToast('Please add some content to your post');
            return;
        }

        const toastId = showLoadingToast('Creating your post...');

        try {
            // Upload attachments first
            const uploadedAttachments = [];
            if (attachments.length > 0) {
                for (const att of attachments) {
                    const formData = new FormData();
                    formData.append('file', att.file);
                    formData.append('type', 'posts');

                    const response = await axios.post('/api/media/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    uploadedAttachments.push(response.data);
                }
            }

            // Process tags
            const tagList = tags.split(',').map(t => t.trim()).filter(t => t);

            await dispatch(createPost({
                title,
                content,
                category,
                tags: tagList,
                isQuestion,
                attachments: uploadedAttachments
            })).unwrap();

            dismissToast(toastId);
            showSuccessToast('Post created successfully! 🎉');
            router.push('/community');
        } catch (error) {
            dismissToast(toastId);
            showErrorToast(error);
        }
    };

    const titleLength = title.length;
    const contentLength = content.length;
    const titleMax = 150;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-3">
                        Create a Post
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Share your knowledge, ask questions, or start a discussion with the community.
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-lg shadow-black/10 border border-gray-100 dark:border-neutral-800 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-base-content flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Title
                                </span>
                                <span className={`text-xs font-medium ${titleLength > titleMax * 0.9 ? 'text-warning' : 'text-gray-500'}`}>
                                    {titleLength}/{titleMax}
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="What's your post about?"
                                className="input w-full bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 rounded-xl text-lg transition-all p-4 sm:p-6 h-auto"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                maxLength={titleMax}
                            />
                        </div>

                        {/* Category & Tags Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-base-content flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Category
                                </label>
                                <select
                                    className="select w-full bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 rounded-xl transition-all px-4 sm:px-6 h-12 sm:h-14"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="General">General</option>
                                    <option value="Exam Help">Exam Help</option>
                                    <option value="Study Tips">Study Tips</option>
                                    <option value="Career">Career</option>
                                    <option value="Off-Topic">Off-Topic</option>
                                </select>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-base-content flex items-center gap-2">
                                    <Hash className="w-4 h-4" />
                                    Tags
                                    <span className="text-xs font-normal text-gray-500">(comma separated)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="jamb, physics, mathematics"
                                    className="input w-full bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 rounded-xl transition-all px-4 sm:px-6 h-12 sm:h-14"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Content Textarea */}
                        <div className="space-y-2">
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-base-content">Content</span>
                                <span className="text-xs font-medium text-gray-500">
                                    {contentLength} characters
                                </span>
                            </label>
                            <textarea
                                className="textarea w-full bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 rounded-xl transition-all min-h-[250px] text-base leading-relaxed resize-y p-4 sm:p-6"
                                placeholder="Share your thoughts, questions, or tips in detail..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        {/* Question Toggle */}
                        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-5 border border-primary/10">
                            <label className="flex items-start gap-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary mt-1"
                                    checked={isQuestion}
                                    onChange={(e) => setIsQuestion(e.target.checked)}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <HelpCircle className="w-5 h-5 text-primary" />
                                        <span className="font-semibold text-base-content">Mark as Question</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Enable this if you're asking for help or need specific answers from the community.
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Media Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-base-content flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Attachments
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {attachments.map((file, index) => (
                                    <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-base-300 group">
                                        {file.type.startsWith('image/') ? (
                                            <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-base-200 text-base-content/50">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(index)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-base-300 hover:border-primary hover:bg-base-200/50 flex flex-col items-center justify-center cursor-pointer transition-all group">
                                    <div className="p-2 rounded-full bg-base-200 group-hover:bg-primary/10 text-base-content/50 group-hover:text-primary transition-colors">
                                        <ImagePlus className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs mt-1 text-base-content/60 font-medium">Add Media</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*,application/pdf"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-base-content/60">
                                Supported: Images, Videos, PDF (Max 5MB each)
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 sm:pt-4 border-t border-gray-200 dark:border-neutral-800">
                            <button
                                type="button"
                                className="btn btn-ghost rounded-xl hover:bg-base-200 gap-2 order-2 sm:order-1 flex items-center justify-center"
                                onClick={() => router.back()}
                                disabled={actionLoading}
                            >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary rounded-xl shadow-lg hover:shadow-xl gap-2 min-w-[160px] order-1 sm:order-2 flex items-center justify-center"
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Publishing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Publish Post</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tips Card */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Tips for a Great Post
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>Use a clear, descriptive title that summarizes your post</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>Add relevant tags to help others find your post</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>Be respectful and constructive in your discussions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>Check for similar posts before creating a new one</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RichEditor;
