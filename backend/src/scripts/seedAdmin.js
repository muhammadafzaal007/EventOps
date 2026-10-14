// Creates the first admin account: npm run seed:admin
// Reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from backend/.env
import mongoose from 'mongoose';
import env from '../config/env.js';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const { ADMIN_NAME = 'Admin', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const run = async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env');
    process.exit(1);
  }
  await connectDB();

  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`User ${email} already exists (role: ${existing.role})`);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isVerified: true,
    });
    console.log(`Admin created: ${email}`);
  }
  await mongoose.disconnect();
};

run();
