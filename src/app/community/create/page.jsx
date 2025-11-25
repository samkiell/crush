import CommunityLayout from '@/components/community/CommunityLayout';
import RichEditor from '@/components/community/RichEditor';

export const metadata = {
    title: 'Start a Discussion | CrushEdu',
};

export default function CreatePostPage() {
    return (
        <CommunityLayout>
            <div className="max-w-4xl mx-auto pb-10">
                <RichEditor />
            </div>
        </CommunityLayout>
    );
}
