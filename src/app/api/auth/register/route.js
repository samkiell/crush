import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, examType } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Abeg, fill all the boxes make we fit register you' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Email no correct, check am well' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password too short, do better. At least 6 characters abeg' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { message: 'This account already exist. You don try login?' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      examType: examType || 'JAMB',
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { message: 'Something no correct with the details you enter' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Register Error:', error);
    
    // Handle duplicate key error (MongoDB)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'This account already exist. You don try login?' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Network dey do strong head, try again' },
      { status: 500 }
    );
  }
}

