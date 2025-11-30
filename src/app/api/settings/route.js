import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db';

export async function GET(req) {
  try {
    const user = await protect(req);
    
    // Return structured settings data
    const settings = {
      profile: {
        username: user.username,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      },
      preferences: user.preferences || {
        theme: 'light',
        notifications: { email: true, push: true, marketing: false },
        language: 'en',
      },
      security: {
        lastLogin: user.security?.lastLogin || null,
        loginHistory: user.security?.loginHistory || [],
      },
      examType: user.examType || 'JAMB',
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings API Error:', error);
    const status = error.message.includes('Not authorized') ? 401 : 500;
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status });
  }
}
