import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getTableData,
  setTableData,
  getCompleteTableData,
  getStageTableData,
  generatePDF,
} from "../controller/vConnectDataController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Multer storage with nested folder: uploads/VConnectTransformer/{Company}/{Project}/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const companyName = (req.body.companyName || "Company")
      .replace(/\s+/g, "_").replace(/[/\\]/g, "-");
    const projectName = (req.body.projectName || "Project")
      .replace(/\s+/g, "_").replace(/[/\\]/g, "-");
    const uploadPath = `uploads/VConnectTransformer/${companyName}/${projectName}/`;
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const match = file.fieldname.match(/photos\[(.+)\]/);
    const photoKey = match ? match[1] : "Photo";
    const stage = req.body.stage ? `Stage${req.body.stage}` : "Stage";
    const formNumber = req.body.formNumber ? `Form${req.body.formNumber}` : "Form";
    const ext = path.extname(file.originalname);
    cb(null, `${stage}_${formNumber}_${photoKey}${ext}`);
  },
});

const upload = multer({ storage });

// ========== ROUTES ==========
router.post("/getTable", getTableData);
router.post("/getStageTable", getStageTableData);
router.post("/getCompleteTable", getCompleteTableData);
router.post("/setTable", upload.any(), setTableData);
router.post("/download-all-forms", generatePDF);

export default router;
