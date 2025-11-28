import CommunityLayout from '@/components/community/CommunityLayout';
import HeroSection from '@/components/community/HeroSection';
import Feed from '@/components/community/Feed';
import FilterBar from '@/components/community/FilterBar';

export const metadata = {
  title: 'Community | CrushEdu',
  description: 'Join the discussion, ask questions, and learn from peers.',
};

export default function CommunityPage() {
  return (
    <CommunityLayout>
      <div className="w-full">
        <HeroSection />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-base-content to-base-content/70">
            Latest Discussions
          </h2>
          <FilterBar />
        </div>

        <Feed />
      </div>
    </CommunityLayout>
  );
}
