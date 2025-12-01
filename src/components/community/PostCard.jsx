'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, MessageSquare, Eye, MoreHorizontal } from 'lucide-react';

// ... (inside component)

{/* Footer Actions - Reverted to Pill Style */ }
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
import { useDispatch } from 'react-redux';
import { toggleReaction } from '@/store/slices/communitySlice';
import { showSuccessToast, showErrorToast } from '@/utils/toast-helpers';
import { useState } from 'react';
import ImageModal from '@/components/ImageModal';

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

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

    const isLiked = Array.isArray(post.likes) && post.likes.includes('me'); // Assuming 'me' or user ID check logic exists
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
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 text-[15px] truncate">
                            <Link
                                href={post.author?.username ? `/profile/${post.author.username}` : '#'}
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold text-base-content hover:underline truncate"
                            >
                                {post.author?.name || 'Anonymous'}
                            </Link>
                            <span className="text-base-content/60 truncate">
                                @{post.author?.username || 'user'}
                            </span>
                            <span className="text-base-content/60">·</span>
                            <span className="text-base-content/60 hover:underline">
                                {formatDistanceToNow(new Date(post.createdAt))}
                            </span>
                        </div>
                        <button className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:bg-primary/10 hover:text-primary">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Text Content */}
                    <div className="text-[15px] text-base-content leading-normal whitespace-pre-wrap mb-3">
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

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between max-w-md text-base-content/60">
                        {/* Comment */}
                        <button className="flex items-center gap-2 group transition-colors hover:text-primary">
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <MessageCircle className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-medium">{post.commentsCount || 0}</span>
                        </button>

                        {/* Repost (Mock) */}
                        <button className="flex items-center gap-2 group transition-colors hover:text-success">
                            <div className="p-2 rounded-full group-hover:bg-success/10 transition-colors">
                                <Repeat2 className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-medium">0</span>
                        </button>

                        {/* Like */}
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 group transition-colors ${isLiked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-pink-600/10 transition-colors">
                                <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`} />
                            </div>
                            <span className="text-xs font-medium">{likeCount}</span>
                        </button>

                        {/* Views */}
                        <button className="flex items-center gap-2 group transition-colors hover:text-primary">
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <BarChart2 className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-medium">{post.views || 0}</span>
                        </button>

                        {/* Share */}
                        <button className="flex items-center gap-2 group transition-colors hover:text-primary">
                            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                <Share className="w-4.5 h-4.5" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <ImageModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                src={selectedImage}
            />
        </>
    );
};

export default PostCard;
