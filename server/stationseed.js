// stationSeed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Police from './models/Police.js';
import Station from './models/Station.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

// Get officers
const tnagarOfficers = await Police.find({ email: /@tnagar.com$/ });
const adyarOfficers = await Police.find({ email: /@adyar.com$/ });
const velacheryOfficers = await Police.find({ email: /@velachery.com$/ });

const stations = [
  {
    name: 'T Nagar Police Station',
    location: 'T Nagar',
    officers: tnagarOfficers.map(o => o._id)
  },
  {
    name: 'Adyar Police Station',
    location: 'Adyar',
    officers: adyarOfficers.map(o => o._id)
  },
  {
    name: 'Velachery Police Station',
    location: 'Velachery',
    officers: velacheryOfficers.map(o => o._id)
  }
];

await Station.insertMany(stations);
console.log('Stations inserted.');

mongoose.disconnect();
