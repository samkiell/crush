import CommunityLayout from '@/components/community/CommunityLayout';
import HeroSection from '@/components/community/HeroSection';
import Feed from '@/components/community/Feed';

export const metadata = {
  title: 'Community | CrushEdu',
  description: 'Join the discussion, ask questions, and learn from peers.',
};

export default function CommunityPage() {
  return (
    <CommunityLayout>
      <div className="w-full">
        <HeroSection />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Latest Discussions</h2>
          <div className="join join-horizontal w-full sm:w-auto">
            <button className="join-item btn btn-sm flex-1 sm:flex-none btn-active">Latest</button>
            <button className="join-item btn btn-sm flex-1 sm:flex-none">Popular</button>
            <button className="join-item btn btn-sm flex-1 sm:flex-none">Unsolved</button>
          </div>
        </div>

        <Feed />
      </div>
    </CommunityLayout>
  );
}
