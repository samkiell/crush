import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../lib/models/User.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'crusheduplaceintl@gmail.com';
    const adminPassword = 'Admin@crush';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin account already exists.');
      if (existingAdmin.role !== 'admin') {
        console.log('Updating existing user to admin role...');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('User updated to admin.');
      }
    } else {
      console.log('Creating admin account...');
      const newAdmin = await User.create({
        name: 'Crush Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        examType: 'JAMB', // Default required field
      });
      console.log('Admin account created successfully:', newAdmin.email);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
