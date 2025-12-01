'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import QuestionWorkspace from '@/components/study/QuestionWorkspace';

export default function StudySessionPage() {
    const params = useParams();
    const { sessionId } = params;

    // Parse sessionId: subject-year-topic
    const [subjectCode, year, ...topicParts] = sessionId.split('-');

    const SUBJECT_MAP = {
        math: 'Mathematics',
        eng: 'English Language',
        phy: 'Physics',
        chem: 'Chemistry',
        bio: 'Biology'
    };

    const subjectName = SUBJECT_MAP[subjectCode] || subjectCode;

    return (
        <div className="min-h-screen bg-base-100 pb-20 md:pb-8 pt-6 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Top Bar */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/study"
                        className="btn btn-circle btn-ghost btn-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold">Study Session</h1>
                        <p className="text-xs text-base-content/60 font-mono">JAMB {year}</p>
                    </div>
                </div>

                {/* Workspace */}
                <QuestionWorkspace
                    sessionId={sessionId}
                    subjectName={subjectName}
                    year={year}
                />
            </div>
        </div>
    );
}
