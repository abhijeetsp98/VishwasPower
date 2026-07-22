import VoltTrackJob from "../model/VoltTrackJob.js";
import { randomUUID } from "crypto";

// @desc   Get all jobs
// @route  GET /api/volttrack/jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await VoltTrackJob.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching VoltTrack jobs:", error.message);
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// @desc   Create a new job
// @route  POST /api/volttrack/jobs
export const createJob = async (req, res) => {
  try {
    const { name, capacity, type, tests } = req.body;

    if (!name || !capacity || !type) {
      return res.status(400).json({ message: "name, capacity, and type are required." });
    }

    const id = randomUUID();

    const defaultTests = [
      "CT TEST",
      "BUSHING TEST",
      "2 KV TEST",
      "PRE-CONNECTION TEST",
      "POST-CONNECTION TEST",
      "PRE & POST VPD SERVICING",
      "OIL SOAKING SERVICING PLANNING",
      "POST-TANKING TEST",
      "FINAL LV TEST REPORT",
      "Checklist for TFR BEFORE HV",
      "List of HV Test",
    ].map((testName) => ({
      id: randomUUID(),
      name: testName,
      stage: "Not Started",
      updatedAt: Date.now(),
      observationData: {},
      accepted: false,
    }));

    const job = await VoltTrackJob.create({
      id,
      name,
      capacity,
      type,
      createdAt: Date.now(),
      status: "Processing",
      ratingData: req.body.ratingData || {},
      tests: tests || defaultTests,
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating VoltTrack job:", error.message);
    res.status(500).json({ message: "Failed to create job", error: error.message });
  }
};

// @desc   Get a single job by id
// @route  GET /api/volttrack/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await VoltTrackJob.findOne({ id: req.params.id });
    if (!job) {
      return res.status(404).json({ message: `Job '${req.params.id}' not found.` });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching VoltTrack job:", error.message);
    res.status(500).json({ message: "Failed to fetch job", error: error.message });
  }
};

// @desc   Update a job (name, status, ratingData)
// @route  PUT /api/volttrack/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const { name, status, ratingData, tests } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (status !== undefined) updateFields.status = status;
    if (ratingData !== undefined) updateFields.ratingData = ratingData;
    if (tests !== undefined) updateFields.tests = tests;

    const job = await VoltTrackJob.findOneAndUpdate(
      { id: req.params.id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: `Job '${req.params.id}' not found.` });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error updating VoltTrack job:", error.message);
    res.status(500).json({ message: "Failed to update job", error: error.message });
  }
};

// @desc   Delete a job
// @route  DELETE /api/volttrack/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await VoltTrackJob.findOneAndDelete({ id: req.params.id });
    if (!job) {
      return res.status(404).json({ message: `Job '${req.params.id}' not found.` });
    }
    res.status(200).json({ message: `Job '${job.name}' deleted successfully.` });
  } catch (error) {
    console.error("Error deleting VoltTrack job:", error.message);
    res.status(500).json({ message: "Failed to delete job", error: error.message });
  }
};

// @desc   Update a specific test within a job
// @route  PUT /api/volttrack/jobs/:id/tests/:testId
export const updateTest = async (req, res) => {
  try {
    const { stage, observationData, accepted } = req.body;

    const job = await VoltTrackJob.findOne({ id: req.params.id });
    if (!job) {
      return res.status(404).json({ message: `Job '${req.params.id}' not found.` });
    }

    const testIndex = job.tests.findIndex((t) => t.id === req.params.testId);
    if (testIndex === -1) {
      return res.status(404).json({ message: `Test '${req.params.testId}' not found in job.` });
    }

    if (stage !== undefined) job.tests[testIndex].stage = stage;
    if (observationData !== undefined) job.tests[testIndex].observationData = observationData;
    if (accepted !== undefined) job.tests[testIndex].accepted = accepted;
    job.tests[testIndex].updatedAt = Date.now();

    await job.save();

    res.status(200).json(job);
  } catch (error) {
    console.error("Error updating VoltTrack test:", error.message);
    res.status(500).json({ message: "Failed to update test", error: error.message });
  }
};