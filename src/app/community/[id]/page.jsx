import CommunityLayout from '@/components/community/CommunityLayout';
import PostDetails from '@/components/community/PostDetails';

export async function generateMetadata({ params }) {
    // Await params in Next.js 14+
    const { id } = await params;
    return {
        title: 'Discussion | CrushEdu',
    };
}

export default async function PostPage({ params }) {
    // Await params in Next.js 14+
    const { id } = await params;

    return (
        <CommunityLayout>
            <div className="max-w-4xl mx-auto pb-10 px-4">
                <PostDetails postId={id} />
            </div>
        </CommunityLayout>
    );
}
