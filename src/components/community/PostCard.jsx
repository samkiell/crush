'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, MessageSquare, Eye, MoreHorizontal } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleReaction } from '@/store/slices/communitySlice';
import { showSuccessToast, showErrorToast } from '@/utils/toast-helpers';
import { useState } from 'react';
import ImageModal from '@/components/ImageModal';
import ReportModal from './ReportModal';

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const result = await dispatch(toggleReaction({
                id: post._id,
                targetType: 'CommunityPost',
                type: 'like',
                targetId: post._id
            })).unwrap();

            if (result.action === 'added') {
                showSuccessToast('Post liked!');
            }
        } catch (error) {
            showErrorToast(error);
        }
    };

    const handleImageClick = (e, url) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedImage(url);
        setIsImageModalOpen(true);
    };

    const handleCardClick = (e) => {
        if (window.getSelection().toString().length > 0) return;
        router.push(`/community/${post._id}`);
    };

    const handleCopyLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/community/${post._id}`;
        navigator.clipboard.writeText(url);
        showSuccessToast('Link copied to clipboard!');
        setIsMenuOpen(false);
    };

    const handleReportClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsReportModalOpen(true);
        setIsMenuOpen(false);
    };

    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const isLiked = Array.isArray(post.likes) && post.likes.includes('me');
    const likeCount = Array.isArray(post.likes) ? post.likes.length : (post.likes || 0);

    return (
        <>
            <div
                onClick={handleCardClick}
                className="flex gap-4 p-4 border-b border-base-content/10 hover:bg-base-content/[0.02] transition-colors cursor-pointer"
            >
                {/* Left: Avatar */}
                <div className="shrink-0">
                    <Link
                        href={post.author?.username ? `/profile/${post.author.username}` : '#'}
                        onClick={(e) => e.stopPropagation()}
                        className="avatar placeholder"
                    >
                        <div className="w-10 h-10 rounded-full bg-base-300 ring-1 ring-base-content/5 overflow-hidden">
                            {post.author?.avatar ? (
                                <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-lg font-bold text-base-content/50">{post.author?.name?.charAt(0) || 'U'}</span>
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
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold text-base-content hover:underline leading-tight"
                            >
                                {post.author?.name || 'Anonymous'}
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-base-content/60">
                                <span>@{post.author?.username || 'user'}</span>
                                <span>·</span>
                                <span>{formatDistanceToNow(new Date(post.createdAt))}</span>
                            </div>
                        </div>

                        {/* Functional Three Dots Menu */}
                        <div className="relative">
                            <button
                                onClick={toggleMenu}
                                className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:bg-primary/10 hover:text-primary"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} />
                                    <ul className="absolute right-0 top-full mt-1 z-20 menu p-2 shadow-lg bg-base-100 rounded-box w-40 border border-base-content/10">
                                        <li><button onClick={handleCopyLink} className="text-sm font-medium">Copy Link</button></li>
                                        <li><button onClick={handleReportClick} className="text-sm font-medium text-error hover:bg-error/10 hover:text-error">Report Post</button></li>
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-[15px] text-base-content leading-normal whitespace-pre-wrap mb-3 break-words line-clamp-4">
                        {post.title && <h3 className="font-bold mb-1">{post.title}</h3>}
                        {post.content}
                    </div>

                    {/* Image Attachments */}
                    {post.attachments && post.attachments.length > 0 && (
                        <div className="mb-3">
                            {post.attachments.map((att, index) => {
                                if (att.type === 'image' || att.type.startsWith('image/')) {
                                    return (
                                        <div
                                            key={index}
                                            className="rounded-2xl overflow-hidden border border-base-content/10 max-h-[500px]"
                                            onClick={(e) => handleImageClick(e, att.url)}
                                        >
                                            <img src={att.url} alt="Post attachment" className="w-full h-full object-cover" />
                                        </div>
                                    );
                                }
                                return null;
                            })[0]}
                        </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.location.href = `/community/tags/${tag}`;
                                    }}
                                    className="text-primary hover:underline text-[15px]"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Footer Actions - Pill Style */}
                    <div className="flex items-center gap-3 mt-3">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 hover:bg-primary/10 hover:text-primary transition-all duration-200 group/like"
                        >
                            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-primary text-primary' : ''}`} />
                            <span className="text-sm font-bold">{likeCount}</span>
                        </button>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 text-base-content/70">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm font-bold">{post.commentsCount}</span>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 text-base-content/70">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-bold">{post.views}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ImageModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                src={selectedImage}
            />
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                targetType="CommunityPost"
                targetId={post._id}
            />
        </>
    );
};

export default PostCard;
