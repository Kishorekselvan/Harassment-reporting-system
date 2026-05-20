import mongoose from "mongoose";
import dotenv from "dotenv";
import Station from "./models/Station.js"

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

// 🔑 Coordinates map (ONLY what you want to add)
const stationCoords = {
  "T Nagar Police Station": [80.2337, 13.0418],
  "Velachery Police Station": [80.2211, 12.9759],
  "Adyar Police Station": [80.2570, 13.0067]
};

for (const [name, coordinates] of Object.entries(stationCoords)) {
  const result = await Station.updateOne(
    { name }, // 🔍 find existing doc
    {
      $set: {
        location: {
          type: "Point",
          coordinates // [lng, lat]
        }
      }
    }
  );

  if (result.matchedCount === 0) {
    console.log(`⚠️ Station not found: ${name}`);
  } else {
    console.log(`✅ Updated coordinates for: ${name}`);
  }
}

console.log("🎉 Coordinate migration completed");
process.exit();
