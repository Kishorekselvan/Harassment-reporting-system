import Report from "../models/Report.js";
import Police from "../models/Police.js"; 
import Station from "../models/Station.js";
import User from "../models/User.js";
import multer from "multer";
import ResolvedReport from "../models/ResolvedReport.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
// export const submitReport = async (req, res) => {
//   try {
//     console.log("Incoming body:", req.body);
    
//     const { description, location } = req.body;
//     const userId = req.user.id;  // Assuming user is authenticated and middleware set req.user

//     if (!description || !location) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     console.log("Location received:", location);

//     const station = await Station.findOne({ location }).populate("officers");

//     if (!station) {
//       return res.status(404).json({ message: "No station found for this location" });
//     }

//     console.log("Populated officers:", station.officers);

//     const officerIds = station.officers.map(officer => officer._id);  // Always map to IDs
//     console.log("Assigned officer IDs:", officerIds);

//     const report = new Report({
//       description,
//       location,
//       assignedStation: station._id,
//       assignedOfficers: officerIds,
//     });

//     await report.save();

//     // Link report to the user
//     await User.findByIdAndUpdate(userId, {
//       $push: { reports: report._id },
//     });


//     res.status(201).json({ message: "Report submitted successfully", report });
//   } catch (err) {
//     console.error("Error submitting report:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kishorekselvan2005@gmail.com',
    pass: 'rzvm bqyy nnte djjp',
  },
});


export const submitReport = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    
    const { description, location } = req.body;
    const userId = req.user.id; 

    if (!description || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Location received:", location);

    
    const station = await Station.findOne({ location }).populate("officers");

    if (!station) {
      return res.status(404).json({ message: "No station found for this location" });
    }

    console.log("Populated officers:", station.officers);

    const officerIds = station.officers.map(officer => officer._id);
    console.log("Assigned officer IDs:", officerIds);

    const report = new Report({
      description,
      location,
      assignedStation: station._id,
      assignedOfficers: officerIds,
    });

    await report.save();

    
    await User.findByIdAndUpdate(userId, {
      $push: { reports: report._id },
    });

    
    const emailPromises = station.officers.map(officer => {
      const mailOptions = {
        from: `"Harassment Reporting System" <kishorekselvan2005@gmail.com>`,
        to: officer.email,
        subject: 'New Report Assigned',
        text: `Dear Officer ${officer.name},\n\nA new harassment report has been submitted for your station (${station.name}).\n\nDescription: ${description}\nLocation: ${location}\n\nPlease take the necessary action.\n\nThank you.`,
      };

      return transporter.sendMail(mailOptions);
    });

   
    await Promise.all(emailPromises);

    res.status(201).json({ message: "Report submitted and officers notified successfully", report });
    
  } catch (err) {
    console.error("Error submitting report:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReportStatus = async (req, res) => {
  const { reportId, status } = req.body;

  try {
    
    const report = await Report.findById(reportId);
    
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    
    report.status = status;
    await report.save();
    
    res.status(200).json({ message: "Report status updated", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const assignReport = async (req, res) => {
  const { reportId, policeId } = req.body;

  try {
    
    const report = await Report.findById(reportId);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

   
    const policeOfficer = await Police.findById(policeId);
    if (!policeOfficer) {
      return res.status(404).json({ message: "Police officer not found" });
    }

    
    report.assignedTo = policeId;
    await report.save();

    res.status(200).json({ message: "Report assigned successfully", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteReport = async (req, res) => {
  const { reportId } = req.body;

  try {
    const report = await Report.findByIdAndDelete(reportId);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const searchReports = async (req, res) => {
  const { status, location, date } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (location) query.location = location;
  if (date) query.createdAt = { $gte: new Date(date) };

  try {
    const reports = await Report.find(query);
    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "reports",
        populate: [
          { path: "assignedStation" },  // Populate assignedStation details
          { path: "assignedOfficers" }, // Populate assignedOfficers details
        ],
      });

    res.status(200).json(user.reports);
  } catch (err) {
    console.error("Error fetching user reports:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// export const respondToReport = async (req, res) => {
//   const { reportId } = req.params;
//   const { response } = req.body;

//   try {
//     const report = await Report.findById(reportId);

//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }

//     report.response = response;
//     report.status = "Responded";
//     await report.save();

//     res.status(200).json({ message: "Response added successfully", report });
//   } catch (error) {
//     console.error("Error responding to report:", error);
//     res.status(500).json({ message: "Server error in responding" });
//   }
// };

// export const getReportById = async (req, res) => {
//   try {
//     console.log("Fetching report with ID:", req.params.id); // Log the ID for debugging
//     const report = await Report.findById(req.params.id);

//     if (!report) {
//       return res.status(404).json({ message: 'Report not found' });
//     }

//     res.status(200).json(report);
//   } catch (error) {
//     console.error('Error fetching report by ID:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


export const getResolvedReports=async (req, res) => {
  try {
    console.log("Inside getResolvedReports")
    const resolved = await ResolvedReport.findOne({ reportId: req.params.reportId });
    // const resolved = await ResolvedReport.findOne({ reportId: req.params.reportId });
    if (!resolved) return res.status(404).json({ message: "No case history found" });
    console.log("Resolved",resolved);
    res.download(resolved.fileUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



















export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id)
      .populate('assignedStation', 'name location')
      .populate('assignedOfficers', 'name email rank badgeNumber');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const respondToReport = async (req, res) => {
  const { reportId } = req.params;
  const { response } = req.body;

  try {
   
    const report = await Report.findById(reportId)
      .populate('assignedStation')  
      .populate('assignedOfficers');

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

   
    report.response = response;
    report.status = "Responded";

    
    await report.save();

    
    res.status(200).json({ message: "Response added successfully", report });
  } catch (error) {
    console.error("Error responding to report:", error);
    res.status(500).json({ message: "Server error in responding" });
  }
};