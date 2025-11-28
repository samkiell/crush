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

        <div className="relative bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-black/10 border border-white/20 dark:border-white/5 max-w-3xl mx-auto overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>

            <div className="p-8 sm:p-10">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block">
                        Start a Discussion
                    </h2>
                    <p className="text-base-content/60 mt-2">
                        Share your knowledge, ask questions, or start a debate.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error mb-6 rounded-2xl shadow-sm">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label className="label pl-1">
                            <span className="label-text font-bold text-base-content/70">Title</span>
                        </label>
                        <input
                            type="text"
                            placeholder="What's on your mind?"
                            className="input input-lg bg-white/50 dark:bg-black/20 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black/40 rounded-2xl transition-all duration-200 shadow-inner"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={150}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label pl-1">
                                <span className="label-text font-bold text-base-content/70">Category</span>
                            </label>
                            <select
                                className="select select-lg bg-white/50 dark:bg-black/20 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black/40 rounded-2xl transition-all duration-200 shadow-inner w-full"
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
                            <label className="label pl-1">
                                <span className="label-text font-bold text-base-content/70">Tags</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. jamb, physics"
                                className="input input-lg bg-white/50 dark:bg-black/20 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black/40 rounded-2xl transition-all duration-200 shadow-inner w-full"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label pl-1">
                            <span className="label-text font-bold text-base-content/70">Content</span>
                        </label>
                        <textarea
                            className="textarea textarea-lg bg-white/50 dark:bg-black/20 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black/40 rounded-2xl transition-all duration-200 shadow-inner min-h-[200px] text-base leading-relaxed"
                            placeholder="Share your thoughts, questions, or tips..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4 p-4 rounded-2xl bg-base-200/30 hover:bg-base-200/50 transition-colors border border-transparent hover:border-primary/20">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary rounded-lg"
                                checked={isQuestion}
                                onChange={(e) => setIsQuestion(e.target.checked)}
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-base-content">Ask for Help</span>
                                <span className="text-xs text-base-content/60">Mark this post as a question to get specific answers</span>
                            </div>
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            className="btn btn-ghost rounded-xl hover:bg-base-200/50"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 min-w-[160px]"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
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
