import Report from "../models/Report.js"; // Keep this import only once
import Police from "../models/Police.js";
import Station from "../models/Station.js";
import bcrypt from "bcryptjs";




export const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;  // Get the reportId from the route parameter

    // Find the report by ID and populate "assignedStation" if needed
    const report = await Report.findById(reportId).populate("assignedStation");

    // Check if the report exists
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Return the report data as the response
    res.status(200).json(report);
  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllStations = async (req, res) => {
  try {
    const stations = await Station.find(); // Fetch all stations
    if (!stations || stations.length === 0) {
      return res.status(404).json({ message: "No stations found" });
    }
    res.status(200).json({ stations });
  } catch (err) {
    console.error("Error fetching stations:", err);
    res.status(500).json({ message: "Error fetching stations" });
  }
};


export const getAllReports = async (req, res) => {
  try {
    console.log("Request received for fetching reports");  // Log the request

    // Fetch the reports and populate both assignedStation and assignedOfficers
    const reports = await Report.find()
      .populate("assignedStation")        // Populate the assignedStation field with station details
      .populate("assignedOfficers", "-password");     // Populate the assignedOfficers field with officer details (exclude password)

    console.log("Fetched reports:", reports);  // Log the reports data

    if (!reports || reports.length === 0) {
      return res.status(200).json({ reports: [] });
    }

    // Send the fetched reports as a response
    res.status(200).json({ reports });
  } catch (err) {
    console.error("Error fetching reports:", err);  // Log any errors
    res.status(500).json({ message: "Server error" });
  }
};



export const getAllPolice = async (req, res) => {
  try {
    const police = await Police.find({}, '-password'); // exclude passwords
    res.status(200).json(police);
  } catch (err) {
    res.status(500).json({ message: "Error fetching police officers" });
  }
};

export const getPoliceByStation = async (req, res) => {
  try {
    const { stationName } = req.query;

    const station = await Station.findOne({ name: stationName });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const police = await Police.find({ stationId: station._id }).populate(
      "stationId", "name location"
    );

    res.status(200).json(police);
  } catch (err) {
    res.status(500).json({ message: "Error fetching police from station" });
  }
};

export const addPoliceOfficer = async (req, res) => {
  try {
    const { name, email, password, stationName, rank, badgeNumber, department } = req.body;

    if (!email || !password || !stationName || !name || !rank || !badgeNumber || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingPolice = await Police.findOne({ email });
    if (existingPolice) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const station = await Station.findOne({
      name: { $regex: new RegExp(`^${stationName.trim()}$`, "i") }
    });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPolice = new Police({
      name,
      email,
      password: hashedPassword,
      stationId: station._id,
      stationName,
      rank,
      badgeNumber,
      department,
    });

    await newPolice.save();

    await Station.findByIdAndUpdate(
      station._id,
      { $addToSet: { officers: newPolice._id } },
      { new: true }
    );

    res.status(201).json({ message: "Police officer added successfully", police: newPolice });
  } catch (err) {
    console.error("Error adding police officer:", err);
    res.status(500).json({ message: "Error adding police officer" });
  }
};



export const deletePoliceOfficer = async (req, res) => {
  const policeId = req.params.id;

  try {
    const police = await Police.findById(policeId);
    if (!police) {
      return res.status(404).json({ message: "Police officer not found" });
    }

    const stationName = police.stationName;

    await Police.findByIdAndDelete(policeId);

    await Station.findOneAndUpdate(
      { name: stationName },
      { $pull: { officers: policeId } }
    );

    res.status(200).json({ message: "Police officer deleted successfully" });
  } catch (err) {
    console.error("Error deleting police officer:", err);
    res.status(500).json({ message: "Server error" });
  }
};
