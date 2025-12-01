import CommunityLayout from '@/components/community/CommunityLayout';
import HeroSection from '@/components/community/HeroSection';
import Feed from '@/components/community/Feed';
import FilterBar from '@/components/community/FilterBar';

export const metadata = {
  title: 'Community | CrushEdu',
  description: 'Join the discussion, ask questions, and learn from peers.',
};

import CreatePostFAB from '@/components/community/CreatePostFAB';

export default function CommunityPage() {
  return (
    <CommunityLayout>
      <div className="w-full relative">
        <HeroSection />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <FilterBar />
        </div>

        <Feed />
        <CreatePostFAB />
      </div>
    </CommunityLayout>
  );
}
