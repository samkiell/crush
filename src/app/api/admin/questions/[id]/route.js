import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';
import { isAdmin } from '@/lib/adminAuth';

export async function PUT(req, { params }) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;
    const data = await req.json();

    // Ensure answer is handled correctly (optional)
    if (!data.answer) {
        data.answer = undefined;
    } else {
        data.answer = data.answer.toUpperCase();
    }

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
    if (!isAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Question deleted' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
