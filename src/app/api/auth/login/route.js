import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Abeg, enter your email and password' },
        { status: 400 }
      );
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: 'We no fit find this account. You don register?' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Email or password no correct. Check am well' },
        { status: 401 }
      );
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { message: 'Network dey do strong head, try again' },
      { status: 500 }
    );
  }
}

