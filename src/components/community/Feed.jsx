'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectCommunityPosts, selectCommunityLoading, selectCommunityError } from '@/store/slices/communitySlice';
import PostCard from './PostCard';
import SkeletonPostCard from './skeletons/SkeletonPostCard';
import { showErrorToast } from '@/utils/toast-helpers';

const Feed = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectCommunityPosts);
    const loading = useSelector(selectCommunityLoading);
    const error = useSelector(selectCommunityError);

    const searchParams = useSearchParams();
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'latest';
    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        const fetchArgs = { page, category, search, sort };
        dispatch(fetchPosts(fetchArgs));

        const interval = setInterval(() => {
            dispatch(fetchPosts({ ...fetchArgs, isPolling: true }));
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, [dispatch, page, category, search, sort]);

    // Show error toast when error occurs
    useEffect(() => {
        if (error) {
            showErrorToast(error);
        }
    }, [error]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <SkeletonPostCard key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}

            {posts.length === 0 && !loading && (
                <div className="text-center py-16 bg-base-100 rounded-2xl shadow-sm shadow-base-content/5 border border-base-200">
                    <div className="max-w-md mx-auto px-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-2xl flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-base-content/40"
                            >
                                <path d="M12 2h9" />
                                <path d="M6 8h8" />
                                <path d="M3 12h5" />
                                <path d="M3 16h11" />
                                <path d="M3 20h11" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-base-content mb-2">No discussions yet</h3>
                        <p className="text-sm text-base-content/60">
                            Be the first to start a conversation in the community!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feed;
