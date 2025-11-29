'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostDetails, selectCurrentPost, selectCommunityLoading, selectCommunityError, toggleReaction, deletePost } from '@/store/slices/communitySlice';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { ThumbsUp, Eye, MessageSquare, Share2, Flag, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { selectUser } from '@/store/slices/authSlice';
import CommentSection from './CommentSection';
import SkeletonPostDetails from './skeletons/SkeletonPostDetails';
import ReportModal from './ReportModal';
import { showSuccessToast, showErrorToast } from '@/utils/toast-helpers';

const PostDetails = ({ postId }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const post = useSelector(selectCurrentPost);
    const user = useSelector(selectUser);
    const loading = useSelector(selectCommunityLoading);
    const error = useSelector(selectCommunityError);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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
            <div className="flex flex-row items-center gap-1 sm:gap-2 shrink-0">
                <button
                    onClick={handleShare}
                    className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-base-200 mr-1 sm:mr-0"
                    title="Share"
                >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/70" />
                </button>
                <button
                    className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-error/10 hover:text-error"
                    title="Report"
                    onClick={() => setIsReportModalOpen(true)}
                >
                    <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/70" />
                </button>
                {user && (user._id === post.author?._id || user.role === 'admin') && (
                    <button
                        className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-error/10 hover:text-error ml-1 sm:ml-0"
                        title="Delete Post"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-error" />
                    </button>
                )}
            </div>
                    </div >
                </div >
            </div >

    {/* Comments Section */ }
    < CommentSection postId = { post._id } />

        {/* Report Modal */ }
        < ReportModal
isOpen = { isReportModalOpen }
onClose = {() => setIsReportModalOpen(false)}
targetType = "CommunityPost"
targetId = { post._id }
    />
        </div >
    );
};

export default PostDetails;
