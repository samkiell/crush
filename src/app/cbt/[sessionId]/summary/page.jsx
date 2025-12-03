import CbtSummary from '@/components/CbtSummary.client';
import dbConnect from '@/lib/db';
import CbtSession from '@/lib/models/CbtSession';
import { notFound } from 'next/navigation';

export default async function SummaryPage({ params }) {
    const { sessionId } = await params;
    
    await dbConnect();
    const session = await CbtSession.findOne({ sessionId }).lean();

    if (!session || !session.summary) {
        // If session exists but no summary, maybe redirect to submit? 
        // Or just show loading/empty. For now, 404 if not found.
        if (!session) notFound();
    }

    // Serialize for client component
    const serializedSession = {
        ...session,
        _id: session._id.toString(),
        userId: session.userId.toString(),
        startTime: session.startTime?.toISOString(),
        endTime: session.endTime?.toISOString(),
        createdAt: session.createdAt?.toISOString(),
        updatedAt: session.updatedAt?.toISOString(),
        questions: session.questions.map(q => ({ ...q, _id: q._id?.toString() }))
    };

    return <CbtSummary summary={session.summary} session={serializedSession} />;
}
