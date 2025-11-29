import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: join(__dirname, '../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

const ChatRoomSchema = new mongoose.Schema({
  name: String,
  members: [mongoose.Schema.Types.ObjectId],
}, { strict: false });

const ChatRoom = mongoose.models.ChatRoom || mongoose.model('ChatRoom', ChatRoomSchema);

async function checkRoom() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const id = '692b478e6300e303444513bf';
    console.log(`Checking room with ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ObjectId format');
        return;
    }

    const room = await ChatRoom.findById(id);
    
    if (room) {
      console.log('Room found:', room);
    } else {
      console.log('Room NOT found');
      
      // List all rooms to see what's there
      const rooms = await ChatRoom.find({}, '_id name');
      console.log('Available rooms:', rooms);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkRoom();
