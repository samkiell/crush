'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, selectCommunityError } from '@/store/slices/communitySlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const RichEditor = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const error = useSelector(selectCommunityError);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/community/create');
        }
    }, [isAuthenticated, router]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [tags, setTags] = useState('');
    const [isQuestion, setIsQuestion] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    if (!isAuthenticated) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setSubmitting(true);

        // Process tags
        const tagList = tags.split(',').map(t => t.trim()).filter(t => t);

        const result = await dispatch(createPost({
            title,
            content,
            category,
            tags: tagList,
            isQuestion,
        }));

        setSubmitting(false);

        if (!result.error) {
            router.push('/community');
        }
    };

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 max-w-3xl mx-auto">
            <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Start a New Discussion</h2>

                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Title</span>
                        </label>
                        <input
                            type="text"
                            placeholder="What's on your mind?"
                            className="input input-bordered w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={150}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Category</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
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
                            <span className="label-text font-semibold">Content</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-40 text-base"
                            placeholder="Share your thoughts, questions, or tips..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Tags (comma separated)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. jamb, physics, admission"
                            className="input input-bordered w-full"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary"
                                checked={isQuestion}
                                onChange={(e) => setIsQuestion(e.target.checked)}
                            />
                            <span className="label-text font-medium">This is a question asking for help</span>
                        </label>
                    </div>

                    <div className="card-actions justify-end mt-6">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary min-w-[120px]"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Post Discussion'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RichEditor;
