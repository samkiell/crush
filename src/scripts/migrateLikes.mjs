import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: join(__dirname, '../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function migrateLikes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the raw collection to bypass schema validation
    const postsCollection = mongoose.connection.collection('communityposts');
    const commentsCollection = mongoose.connection.collection('comments');

    // Find posts with numeric likes
    const postsWithNumericLikes = await postsCollection.find({ likes: { $type: "number" } }).toArray();
    console.log(`Found ${postsWithNumericLikes.length} posts with numeric likes.`);

    for (const post of postsWithNumericLikes) {
      // Since we can't know WHO liked it, we have to reset it to an empty array or keep it as 0?
      // But the schema expects an array of ObjectIds.
      // If we want to be strict, we should reset to [].
      // If we want to preserve the COUNT, we can't easily do that with the new schema unless we add a separate 'likesCount' field.
      // For now, let's reset to [] to prevent crashes.
      
      await postsCollection.updateOne(
        { _id: post._id },
        { $set: { likes: [] } }
      );
      console.log(`Updated post ${post._id}: likes reset to []`);
    }

    // Find comments with numeric likes
    const commentsWithNumericLikes = await commentsCollection.find({ likes: { $type: "number" } }).toArray();
    console.log(`Found ${commentsWithNumericLikes.length} comments with numeric likes.`);

    for (const comment of commentsWithNumericLikes) {
      await commentsCollection.updateOne(
        { _id: comment._id },
        { $set: { likes: [] } }
      );
      console.log(`Updated comment ${comment._id}: likes reset to []`);
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateLikes();
