import { NextResponse } from 'next/server';
import { generateExplanation } from '@/lib/llm';
import { verifyStudyAccess } from '@/lib/study-middleware';

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Verify access permissions
        const accessCheck = await verifyStudyAccess(request, body);
        if (!accessCheck.allowed) {
            return accessCheck.response;
        }

        const { question, options, selectedAnswer, correctOption } = body;

        if (!question || !selectedAnswer) {
            return NextResponse.json(
                { message: 'Missing required fields: question, selectedAnswer' },
                { status: 400 }
            );
        }

        // Call the LLM service
        const result = await generateExplanation(question, options, selectedAnswer, correctOption);

        return NextResponse.json(result);
    } catch (error) {
        console.error('AI Explanation Error:', error);
        return NextResponse.json(
            { message: 'Failed to generate explanation' },
            { status: 500 }
        );
    }
}
