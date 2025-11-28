'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, selectActionLoading } from '@/store/slices/communitySlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Loader2, Send, X } from 'lucide-react';
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

    if (!isAuthenticated) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            showErrorToast('Please fill in both title and content');
            return;
        }

        const toastId = showLoadingToast('Creating your post...');

        try {
            // Process tags
            const tagList = tags.split(',').map(t => t.trim()).filter(t => t);

            await dispatch(createPost({
                title,
                content,
                category,
                tags: tagList,
                isQuestion,
            })).unwrap();

            dismissToast(toastId);
            showSuccessToast('Post created successfully! 🎉');
            router.push('/community');
        } catch (error) {
            dismissToast(toastId);
            showErrorToast(error);
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-lg shadow-black/10 border border-gray-100 dark:border-neutral-800 max-w-3xl mx-auto overflow-hidden">
            <div className="p-8 sm:p-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-base-content mb-2">
                        Start a Discussion
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Share your knowledge, ask questions, or start a debate.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">Title</span>
                            <span className="label-text-alt text-gray-500">{title.length}/150</span>
                        </label>
                        <input
                            type="text"
                            placeholder="What's on your mind?"
                            className="input input-lg bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 rounded-xl transition-all"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={150}
                        />
                    </div>

                    {/* Category and Tags */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content">Category</span>
                            </label>
                            <select
                                className="select select-lg bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 rounded-xl transition-all w-full"
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

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content">Tags</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. jamb, physics"
                                className="input input-lg bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 rounded-xl transition-all w-full"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">Content</span>
                            <span className="label-text-alt text-gray-500">{content.length} characters</span>
                        </label>
                        <textarea
                            className="textarea textarea-lg bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 rounded-xl transition-all min-h-[200px] text-base leading-relaxed resize-y"
                            placeholder="Share your thoughts, questions, or tips..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    {/* Question Checkbox */}
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary rounded-lg"
                                checked={isQuestion}
                                onChange={(e) => setIsQuestion(e.target.checked)}
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-base-content">Ask for Help</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Mark this post as a question to get specific answers
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            className="btn btn-ghost rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 gap-2"
                            onClick={() => router.back()}
                            disabled={actionLoading}
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary rounded-xl shadow-sm hover:shadow-lg gap-2 min-w-[140px]"
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Post</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RichEditor;
