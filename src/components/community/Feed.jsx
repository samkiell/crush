'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectCommunityPosts, selectCommunityLoading, selectCommunityError } from '@/store/slices/communitySlice';
import PostCard from './PostCard';
import SkeletonPostCard from './skeletons/SkeletonPostCard';
import { Loader2 } from 'lucide-react';

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

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <SkeletonPostCard key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>Error: {error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}

            {posts.length === 0 && !loading && (
                <div className="text-center py-10 text-base-content/60">
                    <p>No discussions yet. Be the first to start one!</p>
                </div>
            )}
        </div>
    );
};

export default Feed;
