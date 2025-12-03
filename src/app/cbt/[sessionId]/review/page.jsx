import CbtReview from '@/components/CbtReview.client';

export default async function ReviewPage({ params }) {
    const { sessionId } = await params;
    return <CbtReview sessionId={sessionId} />;
}
