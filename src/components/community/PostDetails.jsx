'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostDetails, selectCurrentPost, selectCommunityLoading, selectCommunityError, toggleReaction, deletePost } from '@/store/slices/communitySlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, Eye, MessageSquare, Share2, Flag, FileText, Trash2, ArrowLeft, MoreHorizontal, X } from 'lucide-react';
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        setIsMenuOpen(false);
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
        setIsMenuOpen(false);
    };

    if (loading) {
        return <SkeletonPostDetails />;
    }

    if (error) {
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
    const likeCount = Array.isArray(post.likes) ? post.likes.length : (post.likes || 0);

    return (
        <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <div className="flex items-center gap-4 mb-4 px-4 sm:px-0">
                <Link
                    href="/community"
                    className="btn btn-ghost btn-circle btn-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-bold">Post</h1>
            </div>

            {/* Main Post Content - X Style */}
            <article className="bg-base-100 border-b border-base-content/10 pb-4 mb-4">
                <div className="flex gap-4 p-4">
                    {/* Left: Avatar */}
                    <div className="shrink-0">
                        <Link href={post.author?.username ? `/profile/${post.author.username}` : '#'} className="avatar placeholder">
                            <div className="w-12 h-12 rounded-full bg-base-300 ring-1 ring-base-content/5 overflow-hidden">
                                {post.author?.avatar ? (
                                    <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl font-bold text-base-content/50">{post.author?.name?.charAt(0) || 'U'}</span>
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex flex-col">
                                <Link
                                    href={post.author?.username ? `/profile/${post.author.username}` : '#'}
                                    className="font-bold text-base-content hover:underline leading-tight text-lg"
                                >
                                    {post.author?.name || 'Anonymous'}
                                </Link>
                                <div className="flex items-center gap-2 text-sm text-base-content/60">
                                    <span>@{post.author?.username || 'user'}</span>
                                    <span>·</span>
                                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                </div>
                            </div>

                            {/* Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:bg-primary/10 hover:text-primary"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>

                                {isMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                                        <ul className="absolute right-0 top-full mt-1 z-20 menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-content/10">
                                            <li><button onClick={handleShare} className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</button></li>
                                            <li><button onClick={handleReport} className="flex items-center gap-2 text-warning"><Flag className="w-4 h-4" /> Report</button></li>
                                            {(user?._id === post.author?._id || user?.role === 'admin') && (
                                                <li><button onClick={handleDelete} className="flex items-center gap-2 text-error"><Trash2 className="w-4 h-4" /> Delete</button></li>
                                            )}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-[16px] text-base-content leading-relaxed whitespace-pre-wrap mb-4 break-words">
                            {post.content}
                        </div>

                        {/* Attachments */}
                        {post.attachments && post.attachments.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                {post.attachments.map((att, index) => (
                                    <div key={index} className="rounded-2xl overflow-hidden border border-base-content/10 max-h-[500px]">
                                        {att.type === 'image' || att.type.startsWith('image/') ? (
                                            <img
                                                src={att.url}
                                                alt="Attachment"
                                                className="w-full h-full object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                                                onClick={() => handleImageClick(att.url)}
                                            />
                                        ) : (
                                            <div className="p-4 flex items-center gap-3 bg-base-200/50">
                                                <FileText className="w-8 h-8 text-primary" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate text-sm">{att.filename || 'Document'}</p>
                                                    <p className="text-xs text-base-content/60 uppercase">{att.type.split('/')[1]}</p>
                                                </div>
                                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-circle">
                                                    <Share2 className="w-4 h-4" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tags & Category */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-base-200 text-base-content/70 text-xs font-medium">
                                {post.category}
                            </span>
                            {post.tags?.map((tag, index) => (
                                <span key={index} className="px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium border border-primary/10">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Footer Actions - Pill Style */}
                        <div className="flex items-center gap-3 pt-2 border-t border-base-content/5">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 hover:bg-primary/10 hover:text-primary transition-all duration-200 group/like"
                            >
                                <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-primary text-primary' : ''}`} />
                                <span className="text-sm font-bold leading-none">{likeCount}</span>
                            </button>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 text-base-content/70">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-bold leading-none">{post.commentsCount}</span>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 text-base-content/70">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-bold leading-none">{post.views}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Comments Section */}
            <div className="px-4 sm:px-0">
                <CommentSection postId={post._id} />
            </div>

            {/* Modals */}
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
