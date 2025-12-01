'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function StudySessionPage() {
    const params = useParams();
    const { sessionId } = params;

    return (
        <div className="min-h-screen bg-base-100 p-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/study" className="btn btn-ghost gap-2 mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Setup
                </Link>

                <div className="bg-base-200 rounded-3xl p-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">Study Session</h1>
                    <p className="text-base-content/70 mb-8">Session ID: <span className="font-mono bg-base-300 px-2 py-1 rounded">{sessionId}</span></p>
                    <div className="alert alert-info max-w-md mx-auto">
                        <span>Study content for this session will appear here.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
