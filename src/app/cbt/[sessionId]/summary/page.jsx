import CbtSummary from '@/components/CbtSummary.client';

export default async function SummaryPage({ params }) {
    const { sessionId } = await params;
    return <CbtSummary sessionId={sessionId} />;
}
