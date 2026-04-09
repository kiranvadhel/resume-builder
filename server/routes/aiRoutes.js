import express from "express";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
  updateResume
} from "../controllers/aiController.js";

import protect from "../middlewares/authMiddleware.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);

aiRouter.put("/update-resume/:id", protect, updateResume);

console.log("AI ROUTES LOADED 🔥");

export default aiRouter;