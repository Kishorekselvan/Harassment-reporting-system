// stationSeed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Police from "./models/Police.js";
import Station from "./models/Station.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("Connected to MongoDB");

// Get officers based on stationName
const tnagarOfficers = await Police.find({
  stationName: "T Nagar Police Station"
});

const adyarOfficers = await Police.find({
  stationName: "Adyar Police Station"
});

const velacheryOfficers = await Police.find({
  stationName: "Velachery Police Station"
});

const stations = [
  {
    name: "T Nagar Police Station",
    address: "T Nagar, Chennai",
    location: {
      type: "Point",
      coordinates: [80.2341, 13.0418] // [longitude, latitude]
    },
    officers: tnagarOfficers.map((o) => o._id)
  },

  {
    name: "Adyar Police Station",
    address: "Adyar, Chennai",
    location: {
      type: "Point",
      coordinates: [80.2574, 13.0012]
    },
    officers: adyarOfficers.map((o) => o._id)
  },

  {
    name: "Velachery Police Station",
    address: "Velachery, Chennai",
    location: {
      type: "Point",
      coordinates: [80.2209, 12.9759]
    },
    officers: velacheryOfficers.map((o) => o._id)
  }
];

// Optional: clear existing stations before inserting
await Station.deleteMany();

await Station.insertMany(stations);

console.log("Stations inserted successfully.");

mongoose.disconnect();