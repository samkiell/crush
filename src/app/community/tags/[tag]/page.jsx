import CommunityLayout from '@/components/community/CommunityLayout';
import TagFeed from '@/components/community/TagFeed';

export async function generateMetadata({ params }) {
    const { tag } = await params;
    return {
        title: `#${tag} | CrushEdu Community`,
        description: `Browse all discussions tagged with #${tag}`,
    };
}

export default async function TagPage({ params }) {
    const { tag } = await params;

    return (
        <CommunityLayout>
            <div className="w-full px-4">
                <TagFeed tag={tag} />
            </div>
        </CommunityLayout>
    );
}
