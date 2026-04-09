import Resume from "../models/Resume.js";
import mongoose from "mongoose";

// ✅ CREATE
export const creteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });

    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ DELETE
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });

    return res.status(200).json({
      message: "Resume deleted successfully",
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ GET (🔥 FIXED)
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params; // ✅ FIXED

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ PUBLIC
export const getResumeByIdPublic = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ UPDATE (FINAL CLEAN)
export const updateResume = async (req, res) => {
  try {
    console.log("🔥 BODY RECEIVED:", req.body);

    const userId = req.userId;

    let resumeId = null;
    let updateData = {};

    // 🔥 Full update
    if (req.body.resumeId && req.body.resumeData) {
      resumeId = req.body.resumeId;

      let parsedData;

      try {
        parsedData =
          typeof req.body.resumeData === "string"
            ? JSON.parse(req.body.resumeData)
            : req.body.resumeData;
      } catch (err) {
        return res.status(400).json({ message: "Invalid resumeData JSON" });
      }

      updateData = { $set: parsedData };
    }

    // 🔥 Title only
    else if (req.body.id) {
      resumeId = req.body.id;

      updateData = {
        $set: {
          title: req.body.title,
        },
      };
    }

    // ❌ No ID
    if (!resumeId) {
      return res.status(400).json({ message: "Resume ID required" });
    }

    // ❌ Invalid ID
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid Resume ID" });
    }

    console.log("🛠 Updating Resume ID:", resumeId);
    console.log("📦 Update Data:", updateData);

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      updateData,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Resume updated successfully",
      resume: updatedResume,
    });

  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};