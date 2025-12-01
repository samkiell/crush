'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleReaction } from '@/store/slices/communitySlice';
import { showSuccessToast, showErrorToast } from '@/utils/toast-helpers';
import { useState } from 'react';
import ImageModal from '@/components/ImageModal';

const PostCard = ({ post }) => {
    const dispatch = useDispatch();

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
                showSuccessToast('Post liked! 👍');
            } else {
                showSuccessToast('Like removed');
            }
        } catch (error) {
            showErrorToast(error);
        }
    };

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (e, url) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedImage(url);
        setIsImageModalOpen(true);
    };

    const router = useRouter();

    const handleCardClick = (e) => {
        // Don't navigate if text is selected
        if (window.getSelection().toString().length > 0) return;
        router.push(`/community/${post._id}`);
    };

    return (
        <>
            <div onClick={handleCardClick} className="block group bg-base-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer relative">
                {/* Header: Author & Meta */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={post.author?.username ? `/profile/${post.author.username}` : '#'}
                            onClick={(e) => e.stopPropagation()}
                            className="avatar placeholder hover:opacity-80 transition-opacity relative z-10"
                        >
                            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-full w-12 h-12 shadow-md flex items-center justify-center overflow-hidden ring-2 ring-base-100">
                                {post.author?.avatar ? (
                                    <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-lg font-bold">{post.author?.name?.charAt(0) || 'U'}</span>
                                )}
                            </div>
                        </Link>
                        <div>
                            <Link
                                href={post.author?.username ? `/profile/${post.author.username}` : '#'}
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold text-base text-base-content flex items-center gap-2 hover:text-primary transition-colors relative z-10"
                            >
                                {post.author?.name || 'Anonymous'}
                                {post.author?.badges?.includes('Mentor') && (
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                        Mentor
                                    </span>
                                )}
                            </Link>
                            <p className="text-xs text-base-content/50 font-medium">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {post.isQuestion && (
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${post.isSolved
                                    ? 'bg-success/10 text-success'
                                    : 'bg-warning/10 text-warning'
                                    }`}
                            >
                                {post.isSolved ? 'SOLVED' : 'QUESTION'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6 pl-14">
                    <h3 className="text-xl font-bold text-base-content mb-3 leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-base-content/70 text-base leading-relaxed line-clamp-3 mb-4">
                        {post.content}
                    </p>

                    {/* Image Preview */}
                    {post.attachments && post.attachments.length > 0 && (
                        <div className="mb-4 relative z-10 rounded-2xl overflow-hidden shadow-sm">
                            {post.attachments.map((att, index) => {
                                if (att.type === 'image' || att.type.startsWith('image/')) {
                                    return (
                                        <div
                                            key={index}
                                            className="relative w-full h-64 cursor-zoom-in"
                                            onClick={(e) => handleImageClick(e, att.url)}
                                        >
                                            <img src={att.url} alt="Post attachment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                            {post.attachments.length > 1 && (
                                                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none">
                                                    +{post.attachments.length - 1} more
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })[0]}
                        </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 relative z-10">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.location.href = `/community/tags/${tag}`;
                                    }}
                                    className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors cursor-pointer"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer: Actions */}
                <div className="flex items-center justify-between pl-14 relative z-10">
                    <div className="flex gap-3">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 hover:bg-primary/10 hover:text-primary transition-all duration-200 group/like"
                        >
                            <ThumbsUp className={`w-4 h-4 ${Array.isArray(post.likes) && post.likes.includes('me') ? 'fill-primary text-primary' : ''}`} />
                            <span className="text-sm font-bold">{Array.isArray(post.likes) ? post.likes.length : (post.likes || 0)}</span>
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
        </>
    );
};

export default PostCard;
