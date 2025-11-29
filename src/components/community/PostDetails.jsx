'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostDetails, selectCurrentPost, selectCommunityLoading, selectCommunityError, toggleReaction, deletePost } from '@/store/slices/communitySlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, Eye, MessageSquare, Share2, Flag, FileText, Trash2, ArrowLeft, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { selectUser } from '@/store/slices/authSlice';
import CommentSection from './CommentSection';
import SkeletonPostDetails from './skeletons/SkeletonPostDetails';
import ReportModal from './ReportModal';
import ImageModal from '@/components/ImageModal';
import { showSuccessToast, showErrorToast } from '@/utils/toast-helpers';

const PostDetails = ({ postId }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const post = useSelector(selectCurrentPost);
    const user = useSelector(selectUser);
    const loading = useSelector(selectCommunityLoading);
    const error = useSelector(selectCommunityError);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (url) => {
        setSelectedImage(url);
        setIsImageModalOpen(true);
    };

    useEffect(() => {
        if (postId) {
            dispatch(fetchPostDetails(postId));

            const interval = setInterval(() => {
                dispatch(fetchPostDetails({ id: postId, isPolling: true }));
            }, 15000);

            return () => clearInterval(interval);
        }
    }, [dispatch, postId]);

    const handleLike = async () => {
        if (post) {
            try {
                const result = await dispatch(toggleReaction({
                    id: post._id,
                    targetType: 'CommunityPost',
                    type: 'like',
                    targetId: post._id
                })).unwrap();

                if (result.action === 'added') {
                    showSuccessToast('Post liked! 👍');
                } else {
                    showSuccessToast('Like removed');
                }
            } catch (error) {
                showErrorToast(error);
            }
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.content.substring(0, 100) + '...',
                url: window.location.href,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showSuccessToast('Link copied to clipboard!');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

        try {
            await dispatch(deletePost(post._id)).unwrap();
            showSuccessToast('Post deleted successfully');
            router.push('/community');
        } catch (error) {
            showErrorToast(error);
        }
    };

    const handleReport = () => {
        setIsReportModalOpen(true);
    };

    if (loading) {
        return <SkeletonPostDetails />;
    }

    if (error) {
        // Error is handled by global toast interceptor
        // We just show a generic fallback or return null to avoid breaking layout
        return (
            <div className="bg-base-200 rounded-2xl p-8 text-center">
                <p className="text-base-content/60 font-medium mb-3">Unable to load content.</p>
                <Link href="/community" className="btn btn-primary rounded-xl">
                    ← Back to Community
                </Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="bg-base-200 rounded-2xl p-8 text-center">
                <p className="text-base-content/60 font-medium mb-3">Post not found</p>
                <Link href="/community" className="btn btn-primary rounded-xl">
                    ← Back to Community
                </Link>
            </div>
        );
    }

    const hasLiked = Array.isArray(post.likes) && post.likes.includes(user?._id);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
                href="/community"
                className="inline-flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Feed
            </Link>

            {/* Main Post Content */}
            {/* Main Post Content */}
            <article className="bg-base-100 rounded-2xl shadow-sm border border-base-300 mb-8">
                {/* Post Header */}
                <div className="p-6 sm:p-8 border-b border-base-300 bg-base-200/30 rounded-t-2xl">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="avatar placeholder">
                                <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl w-12 h-12 shadow-md flex items-center justify-center text-xl font-bold">
                                    {post.author?.avatar ? (
                                        <img src={post.author.avatar} alt={post.author.name} />
                                    ) : (
                                        <span>{post.author?.name?.charAt(0) || 'U'}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-base-content flex items-center gap-2">
                                    {post.author?.name || 'Anonymous'}
                                    {post.author?.badges?.includes('Mentor') && (
                                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                            Mentor
                                        </span>
                                    )}
                                </h1>
                                <div className="flex items-center gap-2 text-xs text-base-content/60 font-medium mt-1">
                                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                    <span>•</span>
                                    <span>{post.views} views</span>
                                </div>
                            </div>
                        </div>

                        <details className="dropdown dropdown-end">
                            <summary className="m-1 btn bg-transparent border-none shadow-none hover:bg-transparent p-0 h-auto min-h-0">
                                <MoreHorizontal className="w-6 h-6 text-base-content/60" />
                            </summary>
                            <ul
                                className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
                                onClick={(e) => {
                                    const details = e.currentTarget.closest('details');
                                    if (details) details.removeAttribute('open');
                                }}
                            >
                                <li>
                                    <button onClick={handleShare} className="flex items-center gap-2">
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                </li>
                                <li>
                                    <button onClick={handleReport} className="flex items-center gap-2 text-warning">
                                        <Flag className="w-4 h-4" /> Report
                                    </button>
                                </li>
                                {(user?._id === post.author?._id || user?.role === 'admin') && (
                                    <li>
                                        <button onClick={handleDelete} className="flex items-center gap-2 text-error">
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </details>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap gap-2">
                        {post.isQuestion && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${post.isSolved ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                {post.isSolved ? 'Solved' : 'Question'}
                            </span>
                        )}
                        <span className="px-3 py-1 rounded-full bg-base-200 text-base-content/70 text-xs font-medium">
                            {post.category}
                        </span>
                        {post.tags?.map((tag, index) => (
                            <span key={index} className="px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium border border-primary/10">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Post Body */}
                <div className="p-6 sm:p-8 rounded-b-2xl">
                    <div className="prose prose-base max-w-none text-base-content/80 mb-8">
                        <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
                    </div>

                    {/* Attachments */}
                    {post.attachments && post.attachments.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {post.attachments.map((att, index) => (
                                <div key={index} className="rounded-xl overflow-hidden border border-base-300 bg-base-200/50">
                                    {att.type === 'image' || att.type.startsWith('image/') ? (
                                        <div
                                            className="relative h-64 cursor-zoom-in group"
                                            onClick={() => handleImageClick(att.url)}
                                        >
                                            <img
                                                src={att.url}
                                                alt="Attachment"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 15 6 6" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 flex items-center gap-3">
                                            <div className="p-3 bg-base-100 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate text-sm">{att.filename || 'Document'}</p>
                                                <p className="text-xs text-base-content/60 uppercase">{att.type.split('/')[1]}</p>
                                            </div>
                                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-circle">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-6 border-t border-base-300">
                        <button
                            onClick={handleLike}
                            className={`btn gap-2 ${hasLiked ? 'btn-primary' : 'btn-ghost bg-base-200/50 hover:bg-base-200'}`}
                        >
                            <ThumbsUp className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                            {hasLiked ? 'Liked' : 'Like'}
                            <span className="badge badge-sm bg-base-100/20 border-0">{Array.isArray(post.likes) ? post.likes.length : (post.likes || 0)}</span>
                        </button>

                        <div className="flex items-center gap-2 text-base-content/60 px-2">
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-medium">{post.commentsCount} Comments</span>
                        </div>
                    </div>
                </div>
            </article>

            {/* Comments Section */}
            <CommentSection postId={post._id} />

            {/* Report Modal */}
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                targetType="CommunityPost"
                targetId={post._id}
            />

            <ImageModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                src={selectedImage}
            />
        </div>
    );
};

export default PostDetails;
