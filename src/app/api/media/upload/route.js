import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '@/lib/auth';

cloudinary.config({
  cloud_name: 'djifnbupv',
  api_key: '138197394728676',
  api_secret: 'PywJZPFhMXpWmDQhkl1p2Hq1yJY',
});

export async function POST(req) {
  try {
    // Authenticate user
    await protect(req);

    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'posts'; // posts, comments, replies, profiles

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate type to prevent arbitrary folder creation
    const validTypes = ['posts', 'comments', 'replies', 'profiles'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `crush/${type}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      type: result.resource_type,
      format: result.format,
      size: result.bytes,
      filename: file.name
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
