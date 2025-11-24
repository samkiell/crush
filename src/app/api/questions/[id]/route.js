import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';

export async function GET(req, { params }) {
  try {
    await protect(req);
    await dbConnect();
    
    const { id } = await params;
    const question = await Question.findById(id);

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await protect(req);
    if (user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;
    const data = await req.json();

    const question = await Question.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await protect(req);
    if (user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;
    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Question removed' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
