import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db';

export async function PUT(req) {
  try {
    const user = await protect(req);
    const { username, firstName, lastName, email, phone, bio } = await req.json();

    await dbConnect();

    // Check if username is taken (if changed)
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
      user.username = username;
    }

    // Check if email is taken (if changed)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already taken' }, { status: 400 });
      }
      user.email = email;
    }

    if (firstName || lastName) {
      user.name = `${firstName || user.name.split(' ')[0]} ${lastName || user.name.split(' ').slice(1).join(' ')}`.trim();
    }

    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
      }
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
