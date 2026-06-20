import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AutoTransformerCompany from "../model/AutoTransformerCompany.js";
import AutoTransformer from "../model/AutoTransformer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: sanitize name for folder path (same logic as multer)
const sanitizeName = (name) => name.replace(/\s+/g, "_").replace(/[/\\]/g, "-");

// Helper: delete a folder and all its contents silently
const deleteFolder = (folderPath) => {
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`Deleted folder: ${folderPath}`);
    }
  } catch (err) {
    console.error(`Failed to delete folder ${folderPath}:`, err.message);
  }
};

const router = express.Router();

// Add a new AutoTransformerCompany
export const setNewCompanyData = async (req, res) => {
  try {
    const { companyName, companyDescription } = req.body;

    // Validate required fields
    if (!companyName || !companyDescription) {
      return res.status(400).json({ 
        message: "Company name and description are required" 
      });
    }

    // Check if company already exists
    const existingCompany = await AutoTransformerCompany.findOne({ companyName });
    if (existingCompany) {
      return res.status(400).json({ 
        message: "Company with this name already exists" 
      });
    }

    const newCompany = new AutoTransformerCompany({
      companyName,
      companyDescription,
    });
    
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    console.error("Error creating company:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Add a new project to exisiting AutoTransformerCompany
export const setCompanyData = async (req, res) => {
  try {
    const { companyName, projectName, companyProjects, userName } = req.body;
    const projectWithEvent = {
      ...companyProjects,
      lastEventUser: userName || "",
      lastEventAction: "Project Created",
      lastEventTimestamp: new Date(),
    };
    const updatedCompany = await AutoTransformerCompany.findOneAndUpdate(
      { companyName: companyName },
      { $push: { companyProjects: projectWithEvent }, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedCompany) {
      return res
        .status(404)
        .json({ message: `Project with name '${projectName}' not found.` });
    }
    res.status(200).json({
      message: `Project '${projectName}' added and linked to AutoTransformerCompany '${companyName}'.`,
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
      return res.status(400).json({ 
        message: "Company name and project name are required." 
      });
    }

    // Delete from the AutoTransformerCompany model
    const updatedCompany = await AutoTransformerCompany.findOneAndUpdate(
      { companyName },
      {
        $pull: { companyProjects: { name: projectName } },
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: `Company '${companyName}' not found or project '${projectName}' not deleted.`,
      });
    }

    // Also delete from AutoTransformer collection if it exists (case-insensitive)
    try {
      const deletedAutoTransformer = await AutoTransformer.findOneAndDelete({
        companyName: { $regex: new RegExp(`^${companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        projectName: { $regex: new RegExp(`^${projectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });

      if (deletedAutoTransformer) {
        console.log(`AutoTransformer data for project '${projectName}' in company '${companyName}' deleted successfully.`);
      }
    } catch (autoTransformerError) {
      console.error("Error deleting from AutoTransformer collection:", autoTransformerError.message);
      // Don't fail the entire operation if AutoTransformer deletion fails
    }

    // Delete photo folder for this project
    const projectFolder = path.join(
      __dirname, "..", "uploads", "AutoTransformer",
      sanitizeName(companyName), sanitizeName(projectName)
    );
    deleteFolder(projectFolder);

    res.status(200).json({
      message: `Project '${projectName}' deleted successfully from company '${companyName}' and associated AutoTransformer data.`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const deleteCompanyByName = async (req, res) => {
  try {
    const { companyName } = req.body;
    
    if (!companyName) {
      return res.status(400).json({ 
        message: "Company name is required." 
      });
    }

    const deletedCompany = await AutoTransformerCompany.findOneAndDelete({ companyName });

    if (!deletedCompany) {
      return res.status(404).json({
        message: `Company '${companyName}' not found.`,
      });
    }

    // Delete entire photo folder for this company
    const companyFolder = path.join(
      __dirname, "..", "uploads", "AutoTransformer",
      sanitizeName(companyName)
    );
    deleteFolder(companyFolder);

    res.status(200).json({
      message: `Company '${companyName}' deleted successfully.`,
      company: deletedCompany,
    });
  } catch (error) {
    console.error("Error deleting company:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

// Get all Company
export const getAllCompanyData = async (req, res) => {
  try {
    const companies = await AutoTransformerCompany.find();
    res.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const setapproveCompanyStage = async (req, res) => {
  try {
    const { companyName, projectName, stage } = req.body;
    const stageNumber = Number(stage);

    if (!companyName || !projectName || !stage) {
      return res.status(400).json({
        message: "Company name, project name, and stage are required."
      });
    }

    // ── Guard 1: Fetch current project state before approving ──
    const existingCompany = await AutoTransformerCompany.findOne({
      companyName,
      "companyProjects.name": projectName,
    });

    if (!existingCompany) {
      return res.status(404).json({
        message: `Company '${companyName}' or project '${projectName}' not found.`,
      });
    }

    const project = existingCompany.companyProjects.find(
      (p) => p.name === projectName
    );

    if (!project) {
      return res.status(404).json({
        message: `Project '${projectName}' not found in company '${companyName}'.`,
      });
    }

    // ── Guard 2: Ensure the stage was actually submitted before approving ──
    const isSubmitted = project.submittedStages?.get
      ? project.submittedStages.get(String(stageNumber))
      : project.submittedStages?.[String(stageNumber)];

    if (!isSubmitted) {
      return res.status(400).json({
        message: `Stage ${stageNumber} has not been submitted yet and cannot be approved.`,
      });
    }

    // ── Guard 3: Prevent double-approval ──
    const isAlreadyApproved = project.stageApprovals?.get
      ? project.stageApprovals.get(String(stageNumber))
      : project.stageApprovals?.[String(stageNumber)];

    if (isAlreadyApproved) {
      return res.status(400).json({
        message: `Stage ${stageNumber} has already been approved.`,
      });
    }

    // ── Build update operation ──
    const { userName: approveUserName } = req.body;
    const updateOperation = {
      $set: {
        [`companyProjects.$.stageApprovals.${stageNumber}`]: true,
        "companyProjects.$.formsCompleted": 0,
        "companyProjects.$.lastEventUser": approveUserName || (req.user?.name || ""),
        "companyProjects.$.lastEventAction": `Stage ${stageNumber} Approved`,
        "companyProjects.$.lastEventTimestamp": new Date(),
      },
    };

    if (stageNumber !== 6) {
      // Use $max to safely advance stage (prevents going backwards in race conditions)
      updateOperation.$max = {
        "companyProjects.$.stage": stageNumber + 1,
      };
      updateOperation.$set["companyProjects.$.status"] = "in-progress";
    } else {
      updateOperation.$set["companyProjects.$.status"] = "completed";
    }

    const updatedCompany = await AutoTransformerCompany.findOneAndUpdate(
      {
        companyName: companyName,
        "companyProjects.name": projectName,
      },
      updateOperation,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: `AutoTransformerCompany '${companyName}' or project '${projectName}' not found during update.`,
      });
    }

    res.status(200).json({
      message:
        stageNumber !== 6
          ? `Stage '${stageNumber}' for project '${projectName}' successfully approved.`
          : `Stage '${stageNumber}' for project '${projectName}' marked as completed.`,
      project: updatedCompany.companyProjects.find(
        (proj) => proj.name === projectName
      ),
    });
  } catch (error) {
    console.error("Error approving AutoTransformerCompany stage:", error.message);
    res.status(500).json({
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
};

export const rejectCompanyStage = async (req, res) => {
  try {
    const { companyName, projectName, stage, rejectionReason } = req.body;
    const stageNumber = Number(stage);

    if (!companyName || !projectName || !stage) {
      return res.status(400).json({
        message: "Company name, project name, and stage are required."
      });
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

    const updatedCompany = await AutoTransformerCompany.findOneAndUpdate(
      {
        companyName: companyName,
        "companyProjects.name": projectName,
      },
      updateOperation,
      {
        new: true, // return updated doc
      }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: `AutoTransformerCompany '${companyName}' or project '${projectName}' not found.`,
      });
    }

    res.status(200).json({
      message: `Stage '${stageNumber}' for project '${projectName}' has been rejected.`,
      project: updatedCompany.companyProjects.find(
        (proj) => proj.name === projectName
      ),
    });
  } catch (error) {
    console.error("Error rejecting AutoTransformerCompany stage:", error.message);
    res.status(500).json({
      message: "An internal server error occurred while rejecting the project stage.",
      error: error.message,
    });
  }
};

// Delete a AutoTransformerCompany by ID
export const deleteCompanyByID = async (req, res) => {
  try {
    await AutoTransformerCompany.findByIdAndDelete(req.params.id);
    res.json({ message: "AutoTransformerCompany deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit project name
export const editProjectName = async (req, res) => {
  try {
    const { companyName, oldProjectName, newProjectName } = req.body;

    // Validate required fields
    if (!companyName || !oldProjectName || !newProjectName) {
      return res.status(400).json({ 
        message: "Company name, old project name, and new project name are required" 
      });
    }

    // Check if the company exists
    const existingCompany = await AutoTransformerCompany.findOne({ companyName });
    if (!existingCompany) {
      return res.status(404).json({ 
        message: `Company with name '${companyName}' not found` 
      });
    }

    // Check if the old project exists in the company
    const projectExists = existingCompany.companyProjects.some(
      project => project.name === oldProjectName
    );
    if (!projectExists) {
      return res.status(404).json({ 
        message: `Project with name '${oldProjectName}' not found in company '${companyName}'` 
      });
    }

    // Check if the new project name already exists in the same company
    const duplicateProject = existingCompany.companyProjects.some(
      project => project.name === newProjectName
    );
    if (duplicateProject) {
      return res.status(400).json({ 
        message: `Project with name '${newProjectName}' already exists in company '${companyName}'` 
      });
    }

    // Update the project name in the company's projects array
    const { userName: renameUserName } = req.body;
    const updatedCompany = await AutoTransformerCompany.findOneAndUpdate(
      { 
        companyName: companyName,
        "companyProjects.name": oldProjectName 
      },
      { 
        $set: { 
          "companyProjects.$.name": newProjectName,
          "companyProjects.$.lastEventUser": renameUserName || "",
          "companyProjects.$.lastEventAction": "Project Renamed",
          "companyProjects.$.lastEventTimestamp": new Date(),
          updatedAt: Date.now() 
        } 
      },
      { new: true }
    );

    // Also update the project name in AutoTransformer collection if it exists
    try {
      await AutoTransformer.updateMany(
        { 
          companyName: { $regex: new RegExp(`^${companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
          projectName: { $regex: new RegExp(`^${oldProjectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        },
        { $set: { projectName: newProjectName } }
      );
    } catch (autoTransformerError) {
      console.error("Error updating AutoTransformer collection:", autoTransformerError.message);
      // Don't fail the entire operation if AutoTransformer update fails
    }

    res.status(200).json({
      message: `Project name updated successfully from '${oldProjectName}' to '${newProjectName}' in company '${companyName}'.`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error editing project name:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

// Edit company name
export const editCompanyName = async (req, res) => {
  try {
    const { oldCompanyName, newCompanyName } = req.body;

    // Validate required fields
    if (!oldCompanyName || !newCompanyName) {
      return res.status(400).json({ 
        message: "Both old company name and new company name are required" 
      });
    }

    // Check if the old company exists
    const existingCompany = await AutoTransformerCompany.findOne({ companyName: oldCompanyName });
    if (!existingCompany) {
      return res.status(404).json({ 
        message: `Company with name '${oldCompanyName}' not found` 
      });
    }

    // Check if the new company name already exists
    const duplicateCompany = await AutoTransformerCompany.findOne({ companyName: newCompanyName });
    if (duplicateCompany) {
      return res.status(400).json({ 
        message: `Company with name '${newCompanyName}' already exists` 
      });
    }

    // Update the company name
    const updatedCompany = await AutoTransformerCompany.findOneAndUpdate(
      { companyName: oldCompanyName },
      { 
        $set: { 
          companyName: newCompanyName,
          updatedAt: Date.now() 
        } 
      },
      { new: true }
    );

    // Also update the company name in AutoTransformer collection if any projects exist
    try {
      await AutoTransformer.updateMany(
        { companyName: { $regex: new RegExp(`^${oldCompanyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        { $set: { companyName: newCompanyName } }
      );
    } catch (autoTransformerError) {
      console.error("Error updating AutoTransformer collection:", autoTransformerError.message);
      // Don't fail the entire operation if AutoTransformer update fails
    }

    res.status(200).json({
      message: `Company name updated successfully from '${oldCompanyName}' to '${newCompanyName}'.`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error editing company name:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const setFormsCompleted = async (req, res) => {
  try {
    const { companyName, projectName, formsCompleted, status, stage } = req.body;
    const stageNumber = Number(stage);

    // ── Guard: Prevent re-submission of an already-approved stage ──
    if (stageNumber && status === "pending-approval") {
      const existingCompany = await AutoTransformerCompany.findOne({
        companyName,
        "companyProjects.name": projectName,
      });

      const project = existingCompany?.companyProjects.find(
        (p) => p.name === projectName
      );

      if (project) {
        const isAlreadyApproved = project.stageApprovals?.get
          ? project.stageApprovals.get(String(stageNumber))
          : project.stageApprovals?.[String(stageNumber)];

        if (isAlreadyApproved) {
          return res.status(400).json({
            message: `Stage ${stageNumber} is already approved and cannot be resubmitted.`,
          });
        }
      }
    }

    // ── Build update operation ──
    // Only set the specific stage flag — do NOT overwrite the entire map.
    const updateFields = {};
    const { userName, eventAction } = req.body;
    const updateSets = {
      "companyProjects.$.lastActivity": new Date(),
      "companyProjects.$.lastEventUser": userName || "",
      "companyProjects.$.lastEventAction": eventAction || (stageNumber ? `Stage ${stageNumber} Submitted` : "Forms Updated"),
      "companyProjects.$.lastEventTimestamp": new Date(),
    };

    updateFields["$max"] = {
      "companyProjects.$.formsCompleted": formsCompleted,
    };

    if (status) {
      updateSets["companyProjects.$.status"] = status;
    }

    // Set only the submitted stage flag (not the whole map)
    if (stageNumber) {
      updateSets[`companyProjects.$.submittedStages.${stageNumber}`] = true;
    }

    updateFields["$set"] = updateSets;

    const updatedCompany = await AutoTransformerCompany.findOneAndUpdate(
      {
        companyName: companyName,
        "companyProjects.name": projectName,
      },
      updateFields,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: `AutoTransformerCompany '${companyName}' or project '${projectName}' not found.`,
      });
    }

    res.status(200).json({
      message: `Forms completed and status for project '${projectName}' successfully updated.`,
      project: updatedCompany.companyProjects.find(
        (proj) => proj.name === projectName
      ),
    });
  } catch (error) {
    console.error("Error updating forms completed and status:", error.message);
    res.status(500).json({
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
};

export default router;
