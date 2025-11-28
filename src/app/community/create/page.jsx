import CommunityLayout from '@/components/community/CommunityLayout';
import RichEditor from '@/components/community/RichEditor';

export const metadata = {
    title: 'Start a Discussion | CrushEdu',
    description: 'Share your knowledge, ask questions, or start a debate in the CrushEdu community.',
};

export default function CreatePostPage() {
    return (
        <CommunityLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <RichEditor />
            </div>
        </CommunityLayout>
    );
}
