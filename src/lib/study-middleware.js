import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';

const FREE_QUESTION_LIMIT = 3;

export async function verifyStudyAccess(req, body) {
    try {
        // 1. Verify User
        const user = await protect(req);

        // 2. Check Premium Status
        if (user.isPremium || user.plan === 'premium') {
            return { allowed: true, user };
        }

        // 3. Check Limits for Free Users
        // We expect 'questionIndex' in the body or query params
        // If not present, we might default to allowing (or blocking, depending on strictness)
        // For this implementation, we'll check the body.
        
        const questionIndex = body?.questionIndex;

        if (questionIndex !== undefined && questionIndex >= FREE_QUESTION_LIMIT) {
            return {
                allowed: false,
                response: NextResponse.json({
                    message: 'Free limit reached',
                    code: 'PREMIUM_REQUIRED',
                    upgradeUrl: '/pricing'
                }, { status: 403 })
            };
        }

        return { allowed: true, user };

    } catch (error) {
        return {
            allowed: false,
            response: NextResponse.json({
                message: error.message || 'Unauthorized'
            }, { status: 401 })
        };
    }
}
