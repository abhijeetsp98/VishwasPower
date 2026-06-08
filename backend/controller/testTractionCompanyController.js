import express from "express";
import TestTractionCompany from "../model/TestTractionCompany.js";

const router = express.Router();

export const setNewCompanyData = async (req, res) => {
  try {
    const { companyName, companyDescription } = req.body;
    if (!companyName || !companyDescription) {
      return res.status(400).json({ message: "Company name and description are required" });
    }
    const existingCompany = await TestTractionCompany.findOne({ companyName });
    if (existingCompany) {
      return res.status(400).json({ message: "Company with this name already exists" });
    }
    const newCompany = new TestTractionCompany({ companyName, companyDescription });
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    console.error("Error creating test traction company:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const setCompanyData = async (req, res) => {
  try {
    const { companyName, projectName, companyProjects, userName } = req.body;
    const projectWithEvent = {
      ...companyProjects,
      lastEventUser: userName || "",
      lastEventAction: "Project Created",
      lastEventTimestamp: new Date(),
    };
    const updatedCompany = await TestTractionCompany.findOneAndUpdate(
      { companyName },
      { $push: { companyProjects: projectWithEvent }, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: `Project '${projectName}' not found.` });
    }
    res.status(200).json({
      message: `Project '${projectName}' added to TestTractionCompany '${companyName}'.`,
      project: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const deleteProjectByName = async (req, res) => {
  try {
    const { companyName, projectName } = req.body;
    if (!companyName || !projectName) {
      return res.status(400).json({ message: "Company name and project name are required." });
    }
    const updatedCompany = await TestTractionCompany.findOneAndUpdate(
      { companyName },
      { $pull: { companyProjects: { name: projectName } }, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: `Company '${companyName}' not found.` });
    }
    res.status(200).json({
      message: `Project '${projectName}' deleted from test traction company '${companyName}'.`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error deleting test traction project:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const deleteCompanyByName = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ message: "Company name is required." });
    }
    const deletedCompany = await TestTractionCompany.findOneAndDelete({ companyName });
    if (!deletedCompany) {
      return res.status(404).json({ message: `Company '${companyName}' not found.` });
    }
    res.status(200).json({
      message: `Test traction company '${companyName}' deleted successfully.`,
      company: deletedCompany,
    });
  } catch (error) {
    console.error("Error deleting test traction company:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const getAllCompanyData = async (req, res) => {
  try {
    const companies = await TestTractionCompany.find();
    res.json(companies);
  } catch (error) {
    console.error("Error fetching test traction companies:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const setapproveCompanyStage = async (req, res) => {
  try {
    const { companyName, projectName, stage } = req.body;
    const stageNumber = Number(stage);
    if (!companyName || !projectName || !stage) {
      return res.status(400).json({ message: "Company name, project name, and stage are required." });
    }
    const { userName: approveUserName } = req.body;
    const updateOperation = {
      $set: {
        [`companyProjects.$.stageApprovals.${stageNumber}`]: true,
        "companyProjects.$.formsCompleted": 0,
        "companyProjects.$.lastEventUser": approveUserName || "",
        "companyProjects.$.lastEventAction": `Stage ${stageNumber} Approved`,
        "companyProjects.$.lastEventTimestamp": new Date(),
      },
    };
    if (stageNumber !== 6) {
      updateOperation.$inc = { "companyProjects.$.stage": 1 };
      updateOperation.$set["companyProjects.$.status"] = "in-progress";
    } else {
      updateOperation.$set["companyProjects.$.status"] = "completed";
    }
    const updatedCompany = await TestTractionCompany.findOneAndUpdate(
      { companyName, "companyProjects.name": projectName },
      updateOperation,
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: `TestTractionCompany '${companyName}' or project '${projectName}' not found.` });
    }
    res.status(200).json({
      message: stageNumber !== 6
        ? `Stage '${stageNumber}' for project '${projectName}' approved.`
        : `Stage '${stageNumber}' for project '${projectName}' completed.`,
      project: updatedCompany.companyProjects.find((p) => p.name === projectName),
    });
  } catch (error) {
    console.error("Error approving TestTractionCompany stage:", error.message);
    res.status(500).json({ message: "An internal server error occurred.", error: error.message });
  }
};

export const rejectCompanyStage = async (req, res) => {
  try {
    const { companyName, projectName, stage, rejectionReason } = req.body;
    const stageNumber = Number(stage);
    if (!companyName || !projectName || !stage) {
      return res.status(400).json({ message: "Company name, project name, and stage are required." });
    }
    const { userName: rejectUserName } = req.body;
    const updateOperation = {
      $set: {
        [`companyProjects.$.stageApprovals.${stageNumber}`]: false,
        [`companyProjects.$.submittedStages.${stageNumber}`]: false,
        "companyProjects.$.status": "rejected",
        "companyProjects.$.rejectionReason": rejectionReason || "No reason provided",
        "companyProjects.$.lastEventUser": rejectUserName || "",
        "companyProjects.$.lastEventAction": `Stage ${stageNumber} Rejected`,
        "companyProjects.$.lastEventTimestamp": new Date(),
      },
    };
    const updatedCompany = await TestTractionCompany.findOneAndUpdate(
      { companyName, "companyProjects.name": projectName },
      updateOperation,
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: `TestTractionCompany '${companyName}' or project '${projectName}' not found.` });
    }
    res.status(200).json({
      message: `Stage '${stageNumber}' for project '${projectName}' rejected.`,
      project: updatedCompany.companyProjects.find((p) => p.name === projectName),
    });
  } catch (error) {
    console.error("Error rejecting TestTractionCompany stage:", error.message);
    res.status(500).json({ message: "An internal server error occurred.", error: error.message });
  }
};

export const editProjectName = async (req, res) => {
  try {
    const { companyName, oldProjectName, newProjectName } = req.body;
    if (!companyName || !oldProjectName || !newProjectName) {
      return res.status(400).json({ message: "Company name, old and new project names are required" });
    }
    const existingCompany = await TestTractionCompany.findOne({ companyName });
    if (!existingCompany) {
      return res.status(404).json({ message: `Company '${companyName}' not found` });
    }
    if (!existingCompany.companyProjects.some((p) => p.name === oldProjectName)) {
      return res.status(404).json({ message: `Project '${oldProjectName}' not found in company '${companyName}'` });
    }
    if (existingCompany.companyProjects.some((p) => p.name === newProjectName)) {
      return res.status(400).json({ message: `Project '${newProjectName}' already exists in company '${companyName}'` });
    }
    const { userName: renameUserName } = req.body;
    const updatedCompany = await TestTractionCompany.findOneAndUpdate(
      { companyName, "companyProjects.name": oldProjectName },
      { $set: {
          "companyProjects.$.name": newProjectName,
          "companyProjects.$.lastEventUser": renameUserName || "",
          "companyProjects.$.lastEventAction": "Project Renamed",
          "companyProjects.$.lastEventTimestamp": new Date(),
          updatedAt: Date.now()
        }
      },
      { new: true }
    );
    res.status(200).json({
      message: `Project name updated from '${oldProjectName}' to '${newProjectName}'.`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error editing test traction project name:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const editCompanyName = async (req, res) => {
  try {
    const { oldCompanyName, newCompanyName } = req.body;
    if (!oldCompanyName || !newCompanyName) {
      return res.status(400).json({ message: "Both old and new company names are required" });
    }
    if (!await TestTractionCompany.findOne({ companyName: oldCompanyName })) {
      return res.status(404).json({ message: `Company '${oldCompanyName}' not found` });
    }
    if (await TestTractionCompany.findOne({ companyName: newCompanyName })) {
      return res.status(400).json({ message: `Company '${newCompanyName}' already exists` });
    }
    const updatedCompany = await TestTractionCompany.findOneAndUpdate(
      { companyName: oldCompanyName },
      { $set: { companyName: newCompanyName, updatedAt: Date.now() } },
      { new: true }
    );
    res.status(200).json({
      message: `Company name updated from '${oldCompanyName}' to '${newCompanyName}'.`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error editing test traction company name:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const setFormsCompleted = async (req, res) => {
  try {
    const { companyName, projectName, formsCompleted, status, stage } = req.body;
    const updateFields = {};
    const { userName, eventAction } = req.body;
    const stageNum = Number(stage);
    const updateSets = {
      "companyProjects.$.lastActivity": new Date(),
      "companyProjects.$.lastEventUser": userName || "",
      "companyProjects.$.lastEventAction": eventAction || (stageNum ? `Stage ${stageNum} Submitted` : "Forms Updated"),
      "companyProjects.$.lastEventTimestamp": new Date(),
    };
    updateFields["$max"] = { "companyProjects.$.formsCompleted": formsCompleted };
    if (status) updateSets["companyProjects.$.status"] = status;
    if (Number(stage) && 6) {
      const submittedStagesMap = {};
      for (let i = 1; i <= 6; i++) submittedStagesMap[i.toString()] = i <= stage;
      updateSets["companyProjects.$.submittedStages"] = submittedStagesMap;
    }
    updateFields["$set"] = updateSets;
    const updatedCompany = await TestTractionCompany.findOneAndUpdate(
      { companyName, "companyProjects.name": projectName },
      updateFields,
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: `TestTractionCompany '${companyName}' or project '${projectName}' not found.` });
    }
    res.status(200).json({
      message: `Forms completed updated for project '${projectName}'.`,
      project: updatedCompany.companyProjects.find((p) => p.name === projectName),
    });
  } catch (error) {
    console.error("Error updating test traction forms completed:", error.message);
    res.status(500).json({ message: "An internal server error occurred.", error: error.message });
  }
};

export default router;
