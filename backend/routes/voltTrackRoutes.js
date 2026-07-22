import express from "express";
import {
  getAllJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
  updateTest,
} from "../controller/voltTrackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All VoltTrack routes require authentication
router.get("/jobs", protect, getAllJobs);
router.post("/jobs", protect, createJob);
router.get("/jobs/:id", protect, getJobById);
router.put("/jobs/:id", protect, updateJob);
router.delete("/jobs/:id", protect, deleteJob);
router.put("/jobs/:id/tests/:testId", protect, updateTest);

export default router;