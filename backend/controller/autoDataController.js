import AutoTransformer from "../model/AutoTransformer.js"
import multer from "multer"
import path from "path"
import fs from "fs"
import PDFDocument from "pdfkit"
import puppeteer from "puppeteer"
import { generateHTMLTemplate } from "../utils/pdfAutoTemplateGenerator.js"

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // save into /uploads folder
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
})

const upload = multer({ storage })

// Function to format labels
function formatLabel(raw) {
  if (raw === undefined || raw === null) return ""
  let s = String(raw)
  s = s.replace(/[_-]+/g, " ")
  s = s.replace(/([a-z])([A-Z])/g, "$1 $2")
  s = s.replace(/([A-Za-z])(\d)/g, "$1 $2").replace(/(\d)([A-Za-z])/g, "$1 $2")
  s = s.replace(/\s+/g, " ").trim()
  const lower = s.toLowerCase()
  if (lower === "srno" || lower === "sr no") return "Sr No"
  const ACRONYMS = /^(id|kv|kva|kvah|kvar|dc|ac)$/i
  return s
    .split(" ")
    .map((w) => (ACRONYMS.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ")
}

export const getStageTableData = async (req, res) => {
  try {
    const { projectName, companyName, stage } = req.body;
    
    if (!projectName || !companyName || !stage) {
      return res.status(400).json({ 
        message: "Project name, company name, and stage are required." 
      });
    }

    const queryPath = `autoTransformerData.stage${stage}`;
    const document = await AutoTransformer.findOne(
      { projectName, companyName },
      { [queryPath]: 1, projectName: 1, companyName: 1 },
    ).lean();

    if (!document) {
      return res.status(404).json({ message: "Project document not found." });
    }

    const getNestedObject = (obj, path) => {
      return path.split(".").reduce((acc, part) => acc && acc[part], obj)
    }
    const nestedData = getNestedObject(document, queryPath)
    if (!nestedData) {
      return res.status(404).json({
        message: `Data for stage ${stage} not found.`,
      })
    }
    // 🔹 Build base URL dynamically (use x-forwarded-proto for nginx/SSL proxy)
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const baseUrl = `${protocol}://${req.get("host")}`;

    // 🔹 Recursively convert any "photos" map values to full URLs
    const convertPhotoPathsToUrls = (data) => {
      if (!data || typeof data !== "object") return data

      if (data.photos && typeof data.photos === "object") {
        const newPhotos = {}
        for (const [key, value] of Object.entries(data.photos)) {
          if (typeof value === "string") {
            // Only prepend baseUrl if the value doesn't already start with http/https
            if (value.startsWith("http://") || value.startsWith("https://")) {
              newPhotos[key] = value; // Use the URL as-is
            } else {
              newPhotos[key] = `${baseUrl}/${value}`;
            }
          } else if (Array.isArray(value)) {
            newPhotos[key] = value.map((v) => {
              if (typeof v === "string") {
                if (v.startsWith("http://") || v.startsWith("https://")) {
                  return v; // Use the URL as-is
                } else {
                  return `${baseUrl}/${v}`;
                }
              }
              return v;
            });
          }
        }
        data.photos = newPhotos
      }

      // also check nested sub-objects
      for (const [k, v] of Object.entries(data)) {
        if (v && typeof v === "object") {
          data[k] = convertPhotoPathsToUrls(v)
        }
      }

      return data
    }

    const responseData = convertPhotoPathsToUrls(nestedData)

    res.status(200).json({
      message: `Data for stage ${stage} retrieved successfully`,
      data: responseData,
    })
  } catch (error) {
    console.error("Error retrieving stage table data:", error.message);
    res.status(500).json({
      message: "Failed to retrieve form data",
      error: error.message,
    });
  }
}

export const getTableData = async (req, res) => {
  try {
    const { projectName, companyName, stage, formNumber } = req.body;
    
    if (!projectName || !companyName || !stage || !formNumber) {
      return res.status(400).json({ 
        message: "Project name, company name, stage, and form number are required." 
      });
    }

    const queryPath = `autoTransformerData.stage${stage}.form${formNumber}`;
    const document = await AutoTransformer.findOne({ projectName, companyName }, { [queryPath]: 1 }).lean();

    if (!document) {
      return res.status(404).json({ message: "Project document not found." });
    }

    const getNestedObject = (obj, path) => {
      return path.split(".").reduce((acc, part) => acc && acc[part], obj)
    }
    const nestedData = getNestedObject(document, queryPath)
    if (!nestedData) {
      return res.status(404).json({
        message: `Data for stage ${stage}, form ${formNumber} not found.`,
      })
    }

    res.status(200).json({
      message: `Data for stage ${stage}, form ${formNumber} retrieved successfully`,
      data: nestedData,
    })
  } catch (error) {
    console.error("Error retrieving table data:", error.message);
    res.status(500).json({
      message: "Failed to retrieve form data",
      error: error.message,
    });
  }
}

export const getCompleteTableData = async (req, res) => {
  try {
    const { projectName, companyName } = req.body;

    if (!projectName || !companyName) {
      return res.status(400).json({ 
        message: "Project name and company name are required." 
      });
    }

    const document = await AutoTransformer.findOne({
      projectName,
      companyName,
    }).lean();

    if (!document) {
      return res.status(404).json({
        message: "Project document not found.",
      });
    }

    // Send the retrieved data back to the client.
    res.status(200).json({
      message: `Data for stage ${projectName}, form ${companyName} retrieved successfully`,
      data: document,
    })
  } catch (error) {
    console.error("Error retrieving complete table data:", error.message);
    res.status(500).json({
      message: "Failed to retrieve form data",
      error: error.message,
    });
  }
}

export const setTableData = async (req, res) => {
  try {
    const { projectName, companyName, formNumber, stage } = req.body;

    if (!projectName || !companyName || !formNumber || !stage) {
      return res.status(400).json({ 
        message: "Project name, company name, form number, and stage are required." 
      });
    }

    const parsedData = {};

    // ✅ parse all body fields
    for (const [key, value] of Object.entries(req.body)) {
      if (["projectName", "companyName", "stage", "formNumber"].includes(key)) {
        parsedData[key] = value
      } else {
        if (typeof value === "string") {
          try {
            const parsed = JSON.parse(value)
            parsedData[key] = parsed
          } catch {
            parsedData[key] = value
          }
        } else {
          parsedData[key] = value
        }
      }
    }

    // ✅ process uploaded photos
    const photos = {}
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const match = file.fieldname.match(/photos\[(.+)\]/)
        if (match) {
          const key = match[1]
          // Use file.path which includes the full relative path (e.g. uploads/AutoTransformer/Company/Project/filename.jpg)
          photos[key] = file.path.replace(/\\/g, '/')
        }
      })
    }

    if (Object.keys(photos).length > 0) {
      parsedData.photos = {
        ...(parsedData.photos || {}),
        ...photos,
      }
    }

    // ✅ Save into Mongo
    const updatedForm = await AutoTransformer.findOneAndUpdate(
      { projectName, companyName },
      {
        $set: {
          [`autoTransformerData.stage${stage}.form${formNumber}`]: parsedData,
        },
      },
      { new: true, upsert: true, runValidators: true },
    )

    res.status(201).json({
      message: "Form data saved successfully",
      data: updatedForm,
    })
  } catch (error) {
    console.error("Error saving form data:", error.message);
    res.status(500).json({
      message: "Failed to save form data",
      error: error.message,
    });
  }
}

export const generatePDF = async (req, res) => {
  try {
    console.log("=== PDF Generation Request received ===");
    
    // Try different possible field names
    const projectName = req.body.projectName || req.body.ProjectName || req.body.project_name;
    const companyName = req.body.companyName || req.body.CompanyName || req.body.company_name;

    console.log("Extracted values:");
    console.log("  projectName:", projectName);
    console.log("  companyName:", companyName);

    if (!projectName || !companyName) {
      console.error("❌ Missing required fields!");
      console.error("  projectName:", projectName);
      console.error("  companyName:", companyName);
      console.error("  Available keys in body:", Object.keys(req.body));
      console.error("  Full body:", req.body);
      return res.status(400).json({ 
        message: "Project name and company name are required.",
        received: { projectName, companyName },
        availableKeys: Object.keys(req.body),
        fullBody: req.body
      });
    }

    console.log(`Generating PDF for project: ${projectName}, company: ${companyName}`);

    // Fetch complete data from MongoDB
    console.log("Fetching data from MongoDB...");
    const completeData = await AutoTransformer.findOne({
      projectName,
      companyName,
    }).lean();

    if (!completeData) {
      console.error("No data found in MongoDB for:", { projectName, companyName });
      return res.status(404).json({
        message: "Project data not found.",
        searchedFor: { projectName, companyName }
      });
    }

    console.log("Data fetched successfully from MongoDB");

    // Generate HTML with exact UI styling
    console.log("Generating HTML template...");
    const html = generateHTMLTemplate(completeData, projectName, companyName);
    console.log("HTML template generated successfully");

    // Launch Puppeteer with configuration for Render.com
    console.log("Launching Puppeteer browser...");
    
    let launchOptions = {
      headless: true,
      executablePath: '/usr/bin/google-chrome-stable',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-web-security',
        '--no-first-run',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-ipc-flooding-protection',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-pings',
        '--password-store=basic',
        '--use-mock-keychain',
        '--disable-blink-features=AutomationControlled',
        // Memory optimization flags for Render's 512MB limit
        '--memory-pressure-off',
        '--max_old_space_size=256',
        '--disable-background-mode',
        '--disable-plugins',
        '--disable-plugins-discovery',
        '--disable-preconnect',
        '--disable-prefetch',
        '--no-zygote',
        '--single-process'
      ],
      timeout: 30000,
      ignoreDefaultArgs: ['--disable-extensions'],
      handleSIGINT: false,
      handleSIGTERM: false,
      handleSIGHUP: false
    };

    // Let Puppeteer handle Chrome detection automatically
    console.log("✅ Using Puppeteer's automatic Chrome detection");
    // Don't set executablePath - let Puppeteer find its downloaded Chrome
    
    console.log("Launching browser with options:", { 
      executablePath: 'default (Puppeteer auto-detect)',
      headless: launchOptions.headless 
    });
    
    const browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    console.log("Browser page created");
    
    // Set content and wait for resources to load
    console.log("Setting HTML content...");
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    console.log("HTML content loaded");

    // Generate PDF with styling preserved
    console.log("Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      preferCSSPageSize: false
    });

    console.log("PDF generated successfully");
    await browser.close();
    console.log("Browser closed");

    // Send PDF to client
    const filename = `${projectName}_complete_report_${new Date().toISOString().split("T")[0]}.pdf`;
    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");
    console.log("Sending PDF to client...");
    res.send(pdfBuffer);
    console.log("PDF sent successfully");

  } catch (err) {
    console.error("Error generating PDF:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      error: "Failed to generate PDF",
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};
