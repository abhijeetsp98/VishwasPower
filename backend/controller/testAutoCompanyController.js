import express from "express";
import TestAutoTransformerCompany from "../model/TestAutoTransformerCompany.js";

const router = express.Router();

// Add a new TestAutoTransformerCompany
export const setNewCompanyData = async (req, res) => {
  try {
    const { companyName, companyDescription } = req.body;

    if (!companyName || !companyDescription) {
      return res.status(400).json({
        message: "Company name and description are required",
      });
    }

    const existingCompany = await TestAutoTransformerCompany.findOne({ companyName });
    if (existingCompany) {
      return res.status(400).json({
        message: "Company with this name already exists",
      });
    }

    const newCompany = new TestAutoTransformerCompany({
      companyName,
      companyDescription,
    });

    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    console.error("Error creating test company:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Add a new project to existing TestAutoTransformerCompany
export const setCompanyData = async (req, res) => {
  try {
    const { companyName, projectName, companyProjects, userName } = req.body;
    const projectWithEvent = {
      ...companyProjects,
      lastEventUser: userName || "",
      lastEventAction: "Project Created",
      lastEventTimestamp: new Date(),
    };
    const updatedCompany = await TestAutoTransformerCompany.findOneAndUpdate(
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
      message: `Project '${projectName}' added and linked to TestAutoTransformerCompany '${companyName}'.`,
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
        message: "Company name and project name are required.",
      });
    }

    const updatedCompany = await TestAutoTransformerCompany.findOneAndUpdate(
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

    res.status(200).json({
      message: `Project '${projectName}' deleted successfully from test company '${companyName}'.`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error deleting test project:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const deleteCompanyByName = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
      });
    }

    const deletedCompany = await TestAutoTransformerCompany.findOneAndDelete({ companyName });

    if (!deletedCompany) {
      return res.status(404).json({
        message: `Company '${companyName}' not found.`,
      });
    }

    res.status(200).json({
      message: `Test company '${companyName}' deleted successfully.`,
      company: deletedCompany,
    });
  } catch (error) {
    console.error("Error deleting test company:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

// Get all TestAutoTransformerCompany
export const getAllCompanyData = async (req, res) => {
  try {
    const companies = await TestAutoTransformerCompany.find();
    res.json(companies);
  } catch (error) {
    console.error("Error fetching test companies:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const setapproveCompanyStage = async (req, res) => {
  try {
    const { companyName, projectName, stage } = req.body;
    const stageNumber = Number(stage);

    if (!companyName || !projectName || !stage) {
      return res.status(400).json({
        message: "Company name, project name, and stage are required.",
      });
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

    const updatedCompany = await TestAutoTransformerCompany.findOneAndUpdate(
      {
        companyName: companyName,
        "companyProjects.name": projectName,
      },
      updateOperation,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: `TestAutoTransformerCompany '${companyName}' or project '${projectName}' not found.`,
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
    console.error("Error approving TestAutoTransformerCompany stage:", error.message);
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
        message: "Company name, project name, and stage are required.",
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

    const updatedCompany = await TestAutoTransformerCompany.findOneAndUpdate(
      {
        companyName: companyName,
        "companyProjects.name": projectName,
      },
      updateOperation,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: `TestAutoTransformerCompany '${companyName}' or project '${projectName}' not found.`,
      });
    }

    res.status(200).json({
      message: `Stage '${stageNumber}' for project '${projectName}' has been rejected.`,
      project: updatedCompany.companyProjects.find(
        (proj) => proj.name === projectName
      ),
    });
  } catch (error) {
    console.error("Error rejecting TestAutoTransformerCompany stage:", error.message);
    res.status(500).json({
      message: "An internal server error occurred while rejecting the project stage.",
      error: error.message,
    });
  }
};

// Edit project name
export const editProjectName = async (req, res) => {
  try {
    const { companyName, oldProjectName, newProjectName } = req.body;

    if (!companyName || !oldProjectName || !newProjectName) {
      return res.status(400).json({
        message: "Company name, old project name, and new project name are required",
      });
    }

    const existingCompany = await TestAutoTransformerCompany.findOne({ companyName });
    if (!existingCompany) {
      return res.status(404).json({
        message: `Company with name '${companyName}' not found`,
      });
    }

    const projectExists = existingCompany.companyProjects.some(
      (project) => project.name === oldProjectName
    );
    if (!projectExists) {
      return res.status(404).json({
        message: `Project with name '${oldProjectName}' not found in company '${companyName}'`,
      });
    }

    const duplicateProject = existingCompany.companyProjects.some(
      (project) => project.name === newProjectName
    );
    if (duplicateProject) {
      return res.status(400).json({
        message: `Project with name '${newProjectName}' already exists in company '${companyName}'`,
      });
    }

    const { userName: renameUserName } = req.body;
    const updatedCompany = await TestAutoTransformerCompany.findOneAndUpdate(
      {
        companyName: companyName,
        "companyProjects.name": oldProjectName,
      },
      {
        $set: {
          "companyProjects.$.name": newProjectName,
          "companyProjects.$.lastEventUser": renameUserName || "",
          "companyProjects.$.lastEventAction": "Project Renamed",
          "companyProjects.$.lastEventTimestamp": new Date(),
          updatedAt: Date.now(),
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: `Project name updated from '${oldProjectName}' to '${newProjectName}' in company '${companyName}'.`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error editing test project name:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

// Edit company name
export const editCompanyName = async (req, res) => {
  try {
    const { oldCompanyName, newCompanyName } = req.body;

    if (!oldCompanyName || !newCompanyName) {
      return res.status(400).json({
        message: "Both old company name and new company name are required",
      });
    }

    const existingCompany = await TestAutoTransformerCompany.findOne({ companyName: oldCompanyName });
    if (!existingCompany) {
      return res.status(404).json({
        message: `Company with name '${oldCompanyName}' not found`,
      });
    }

    const duplicateCompany = await TestAutoTransformerCompany.findOne({ companyName: newCompanyName });
    if (duplicateCompany) {
      return res.status(400).json({
        message: `Company with name '${newCompanyName}' already exists`,
      });
    }

    const updatedCompany = await TestAutoTransformerCompany.findOneAndUpdate(
      { companyName: oldCompanyName },
      {
        $set: {
          companyName: newCompanyName,
          updatedAt: Date.now(),
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: `Company name updated from '${oldCompanyName}' to '${newCompanyName}'.`,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error editing test company name:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const setFormsCompleted = async (req, res) => {
  try {
    const { companyName, projectName, formsCompleted, status, stage } = req.body;

    const updateFields = {};
    const { userName, eventAction } = req.body;
    const stageNumber = Number(stage);
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

    if (Number(stage) && 6) {
      const submittedStagesMap = {};
      for (let i = 1; i <= 6; i++) {
        submittedStagesMap[i.toString()] = i <= stage;
      }
      updateSets["companyProjects.$.submittedStages"] = submittedStagesMap;
    }

    updateFields["$set"] = updateSets;

    const updatedCompany = await TestAutoTransformerCompany.findOneAndUpdate(
      {
        companyName: companyName,
        "companyProjects.name": projectName,
      },
      updateFields,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: `TestAutoTransformerCompany '${companyName}' or project '${projectName}' not found.`,
      });
    }

    res.status(200).json({
      message: `Forms completed and status for project '${projectName}' successfully updated.`,
      project: updatedCompany.companyProjects.find(
        (proj) => proj.name === projectName
      ),
    });
  } catch (error) {
    console.error("Error updating test forms completed:", error.message);
    res.status(500).json({
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
};

export default router;
