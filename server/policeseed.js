// policeSeed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Police from './models/Police.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");


const officers = [
  { email: 'officer1@tnagar.com', password: 'password123' },
  { email: 'officer2@tnagar.com', password: 'password123' },
  { email: 'officer1@adyar.com', password: 'password123' },
  { email: 'officer2@adyar.com', password: 'password123' },
  { email: 'officer1@velachery.com', password: 'password123' }
];


for (let officer of officers) {
  const hashed = await bcrypt.hash(officer.password, 10);
  const newOfficer = new Police({ email: officer.email, password: hashed });
  await newOfficer.save();
  console.log(`Inserted: ${officer.email}`);
}

mongoose.disconnect();
