import CommunityLayout from '@/components/community/CommunityLayout';
import TagFeed from '@/components/community/TagFeed';

export async function generateMetadata({ params }) {
    const { tag } = params;
    return {
        title: `#${tag} | CrushEdu Community`,
        description: `Browse all discussions tagged with #${tag}`,
    };
}

export default function TagPage({ params }) {
    const { tag } = params;

    return (
        <CommunityLayout>
            <div className="w-full">
                <TagFeed tag={tag} />
            </div>
        </CommunityLayout>
    );
}
