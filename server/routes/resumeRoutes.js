import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  creteResume,
  deleteResume,
  getResumeById,
  updateResume,
  getResumeByIdPublic
} from "../controllers/resumeController.js";

import Resume from "../models/Resume.js"; // 👈 ADD THIS

const ResumeRouter = express.Router();

ResumeRouter.post("/create", protect, creteResume);
ResumeRouter.delete("/delete/:resumeId", protect, deleteResume);
ResumeRouter.get("/get/:resumeId", protect, getResumeById);
ResumeRouter.get("/public/:resumeId", getResumeByIdPublic);
ResumeRouter.put("/update", protect, updateResume);


ResumeRouter.get("/all", protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId });
    res.status(200).json({ resumes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default ResumeRouter;