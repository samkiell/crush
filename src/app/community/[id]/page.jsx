import CommunityLayout from '@/components/community/CommunityLayout';
import PostDetails from '@/components/community/PostDetails';

export async function generateMetadata({ params }) {
    // Ideally fetch post title here for dynamic metadata
    return {
        title: 'Discussion | CrushEdu',
    };
}

export default function PostPage({ params }) {
    const { id } = params;

    return (
        <CommunityLayout>
            <div className="max-w-4xl mx-auto pb-10">
                <PostDetails postId={id} />
            </div>
        </CommunityLayout>
    );
}
