import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import dbConnect from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  try {
    const user = await protect(req);
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Please provide both current and new passwords' }, { status: 400 });
    }

    await dbConnect();

    // We need to fetch the user again with password selected, as protect() excludes it
    // Actually protect() uses select('-password'), so we can't check password on `user` object directly if we didn't select it.
    // But `user` is a mongoose document. We can't re-select on an already fetched doc easily without re-fetching.
    // Let's re-fetch the user with password.
    const userWithPassword = await user.constructor.findById(user._id).select('+password');

    const isMatch = await userWithPassword.matchPassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
    }

    userWithPassword.password = newPassword;
    await userWithPassword.save();

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
