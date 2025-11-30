import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '@/lib/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  try {
    // Verify user is authenticated
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timestamp = Math.round((new Date).getTime() / 1000);
    const folder = `crush/users/${user.id}`;

    // Parameters to sign
    const params = {
      timestamp: timestamp,
      folder: folder,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET, // Optional if using signed upload without preset, but usually good to have
      // We can also specify transformations here if we want to enforce them in the signature
      // transformation: 'w_400,h_400,c_fill,g_face', 
    };
    
    // If using a preset, we might not need to sign all params depending on config, 
    // but for signed uploads we usually sign timestamp, folder, etc.
    // Let's stick to a simple signature for now.
    
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: folder,
    }, process.env.CLOUDINARY_API_SECRET);

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    console.error('Cloudinary Signature Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
