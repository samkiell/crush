import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';

export async function GET() {
  try {
    await dbConnect();

    // Aggregate to find distinct subjects and years
    const metadata = await Question.aggregate([
      {
        $group: {
          _id: { subject: "$subject", year: "$year" }
        }
      },
      {
        $group: {
          _id: "$_id.subject",
          years: { $push: "$_id.year" }
        }
      },
      {
        $project: {
          _id: 0,
          subject: "$_id",
          years: 1
        }
      }
    ]);

    // Transform into a more usable format for the frontend
    // e.g., { "mathematics": [1978, 1979], "english": [2000] }
    const formattedMetadata = metadata.reduce((acc, item) => {
        acc[item.subject] = item.years.sort((a, b) => b - a); // Sort years descending
        return acc;
    }, {});

    return NextResponse.json({ metadata: formattedMetadata });
  } catch (error) {
    console.error('Metadata Fetch Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
