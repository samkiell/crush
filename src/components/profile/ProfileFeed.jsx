import { useState, useEffect } from 'react';
import PostCard from '@/components/community/PostCard';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ProfileFeed({ username }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!username) return;

            try {
                setLoading(true);
                const response = await axios.get(`/api/community/posts?user=${username}`);
                setPosts(response.data.data);
            } catch (err) {
                console.error("Failed to fetch user posts:", err);
                setError("Failed to load posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [username]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-error">
                {error}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 text-base-content/60">
                <p className="text-lg">No posts yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    );
}
