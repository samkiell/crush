'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, selectActionLoading } from '@/store/slices/communitySlice';
import { selectIsAuthenticated, selectToken } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2, Send, X, Hash, MessageSquare, HelpCircle, ImagePlus, FileText } from 'lucide-react';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from '@/utils/toast-helpers';

const RichEditor = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const actionLoading = useSelector(selectActionLoading);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectToken);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/community/create');
        }
    }, [isAuthenticated, router]);

    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [tags, setTags] = useState('');
    const [isQuestion, setIsQuestion] = useState(false);
    const [attachments, setAttachments] = useState([]);

    // Typing Animation Logic
    const phrases = [
        "Are you confused?",
        "Do you need help with a question?",
        "Have an idea to share?",
        "Found a useful resource?",
        "Stuck on a problem?",
        "What's on your mind?"
    ];
    const [placeholder, setPlaceholder] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];
        const typeSpeed = isDeleting ? 50 : 100;
        const pauseTime = 2000;

        const timeout = setTimeout(() => {
            if (!isDeleting && charIndex < currentPhrase.length) {
                setPlaceholder(currentPhrase.substring(0, charIndex + 1));
                setCharIndex(prev => prev + 1);
            } else if (isDeleting && charIndex > 0) {
                setPlaceholder(currentPhrase.substring(0, charIndex - 1));
                setCharIndex(prev => prev - 1);
            } else if (!isDeleting && charIndex === currentPhrase.length) {
                setTimeout(() => setIsDeleting(true), pauseTime);
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % phrases.length);
            }
        }, typeSpeed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, phraseIndex]);

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
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    uploadedAttachments.push(response.data);
                }
            }

            // Process tags
            const tagList = tags.split(',').map(t => t.trim()).filter(t => t);

            // Auto-generate title from content
            const generatedTitle = content.split('\n')[0].substring(0, 50) + (content.length > 50 ? '...' : '');

            await dispatch(createPost({
                title: generatedTitle,
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

    const contentLength = content.length;
    const categories = [
        'General', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
        'Literature', 'Government', 'Economics', 'CRS', 'IRS', 'Geography',
        'History', 'Commerce', 'Accounting'
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-base-content mb-2">
                        Create Post
                    </h1>
                </div>

                {/* Main Form Card */}
                <div className="bg-base-100 rounded-3xl shadow-xl shadow-base-content/5 border border-base-200 overflow-hidden mb-6">
                    <form id="create-post-form" onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Content Textarea with Integrated Media */}
                        <div className="space-y-6">
                            <div className="relative">
                                <textarea
                                    className="textarea w-full bg-transparent border-none focus:outline-none text-xl leading-relaxed resize-none min-h-[200px] !p-6 placeholder:text-base-content/30 text-base-content"
                                    placeholder={placeholder}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <div className="absolute top-6 left-6 pointer-events-none text-xl leading-relaxed text-transparent select-none">
                                    {placeholder}<span className="animate-pulse border-r-2 border-primary ml-0.5 h-5 inline-block align-middle"></span>
                                </div>
                            </div>

                            {/* Attachments Preview */}
                            {attachments.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4 px-6">
                                    {attachments.map((file, index) => (
                                        <div key={index} className="relative w-32 h-32 rounded-xl overflow-hidden border border-base-300 group">
                                            {file.type === 'image' || file.type.startsWith('image/') ? (
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
                                </div>
                            )}

                            {/* Media Button & Character Count */}
                            <div className="flex items-center justify-between pt-4 border-t border-base-content/5 px-2">
                                <label className="btn btn-ghost btn-sm gap-2 text-primary hover:bg-primary/10 rounded-full cursor-pointer">
                                    <ImagePlus className="w-5 h-5" />
                                    <span>Add Media</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*,application/pdf"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </label>
                                <span className="text-xs font-medium text-base-content/40">
                                    {contentLength} chars
                                </span>
                            </div>
                        </div>

                        {/* Category & Tags */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 pl-1">
                                    Category
                                </label>
                                <select
                                    className="select select-bordered w-full h-12 bg-base-200 rounded-xl focus:border-primary focus:outline-none px-4"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 pl-1">
                                    Tags
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                                    <input
                                        type="text"
                                        placeholder="jamb, maths (comma separated)"
                                        className="input input-bordered w-full h-12 bg-base-200 pl-12 rounded-xl focus:border-primary focus:outline-none"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Question Toggle */}
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-3">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary checkbox-sm"
                                    checked={isQuestion}
                                    onChange={(e) => setIsQuestion(e.target.checked)}
                                />
                                <span className="label-text font-medium flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-base-content/60" />
                                    Mark as Question
                                </span>
                            </label>
                        </div>

                    </form>
                </div>

                {/* Action Buttons - Moved Outside */}
                <div className="flex items-center justify-between gap-4 px-2">
                    <button
                        type="button"
                        className="btn btn-ghost text-base-content/60 hover:text-error hover:bg-error/10 rounded-xl gap-2 flex flex-row items-center"
                        onClick={() => router.back()}
                        disabled={actionLoading}
                    >
                        <X className="w-5 h-5" />
                        <span className="font-medium">Cancel</span>
                    </button>

                    <button
                        type="submit"
                        form="create-post-form"
                        className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/20 gap-2 flex flex-row items-center"
                        disabled={actionLoading || !content.trim()}
                    >
                        {actionLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Publishing...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Post</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RichEditor;
