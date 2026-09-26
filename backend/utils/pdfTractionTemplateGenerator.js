import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to format labels
function formatLabel(raw) {
  if (raw === undefined || raw === null) return "";
  let s = String(raw);
  s = s.replace(/[_-]+/g, " ");
  s = s.replace(/([a-z])([A-Z])/g, "$1 $2");
  s = s.replace(/([A-Za-z])(\d)/g, "$1 $2").replace(/(\d)([A-Za-z])/g, "$1 $2");
  s = s.replace(/\s+/g, " ").trim();
  const lower = s.toLowerCase();
  if (lower === "srno" || lower === "sr no") return "Sr No";
  const ACRONYMS = /^(id|kv|kva|kvah|kvar|dc|ac)$/i;
  return s
    .split(" ")
    .map((w) => (ACRONYMS.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

// Generate photo thumbnails
function generatePhotoThumbnails(photos, baseUrl = "") {
  if (!photos || Object.keys(photos).length === 0) {
    return "";
  }

  const photoItems = Object.entries(photos)
    .map(([key, photoPath]) => {
      const fullPath = photoPath.startsWith("http") ? photoPath : `${baseUrl}/${photoPath}`;
      return `
        <div class="photo-upload-item">
          <label>${formatLabel(key)}</label>
          <img src="${fullPath}" 
               style="max-width: 150px; max-height: 150px; object-fit: cover; 
                      border-radius: 8px; border: 2px solid #e2e8f0;" 
               onerror="this.style.display='none'" />
        </div>
      `;
    })
    .join("");

  return `
    <div class="photo-upload-section" style="page-break-inside: avoid;">
      <h4>Attached Photos</h4>
      <div class="photo-upload-grid">
        ${photoItems}
      </div>
    </div>
  `;
}

// Generate signature section
function generateSignatureSection(signatures) {
  if (!signatures) return "";

  return `
    <div class="signature-section" style="page-break-inside: avoid;">
      <div class="signature-box">
        <label>VPES Representative</label>
        <p><strong>Name:</strong> ${signatures.vpesName || ""}</p>
        <p><strong>Designation:</strong> ${signatures.vpesDesignation || ""}</p>
        ${
          signatures.vpesSignature
            ? `<div style="margin: 15px 0;">
                 <img src="${signatures.vpesSignature}" 
                      style="max-width: 100px; height: 40px; border: 2px solid #e2e8f0; border-radius: 8px;" />
               </div>`
            : ""
        }
        <p><strong>Date:</strong> ${signatures.vpesDate || ""}</p>
      </div>
      
      <div class="signature-box">
        <label>Customer Representative</label>
        <p><strong>Name:</strong> ${signatures.customerName || ""}</p>
        <p><strong>Designation:</strong> ${signatures.customerDesignation || ""}</p>
        ${
          signatures.customerSignature
            ? `<div style="margin: 15px 0;">
                 <img src="${signatures.customerSignature}" 
                      style="max-width: 100px; height: 40px; border: 2px solid #e2e8f0; border-radius: 8px;" />
               </div>`
            : ""
        }
        <p><strong>Date:</strong> ${signatures.customerDate || ""}</p>
      </div>
    </div>
  `;
}

// Helper function to safely render any value type
function renderValue(value) {
  if (value === undefined || value === null) {
    return "";
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return "<em>Empty</em>";
    
    // Check if array contains objects
    if (value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
      return renderArrayOfObjects(value);
    }
    
    // Array of primitives - render as comma-separated list
    return value.map(v => String(v)).join(", ");
  }
  
  // Handle objects
  if (typeof value === "object") {
    return renderNestedObject(value);
  }
  
  // Handle booleans
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  
  // Handle primitives
  return String(value);
}

// Render array of objects as a nested table
function renderArrayOfObjects(array) {
  if (array.length === 0) return "<em>No data</em>";
  
  // Get all unique keys from all objects
  const allKeys = [...new Set(array.flatMap(obj => Object.keys(obj)))];
  
  const headerRow = allKeys.map(key => `<th>${formatLabel(key)}</th>`).join("");
  
  const dataRows = array.map(obj => {
    const cells = allKeys.map(key => {
      const value = obj[key];
      return `<td>${renderValue(value)}</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
  
  return `
    <table class="form-table" style="margin: 10px 0; width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
          ${headerRow}
        </tr>
      </thead>
      <tbody>
        ${dataRows}
      </tbody>
    </table>
  `;
}

// Render nested object as key-value pairs
function renderNestedObject(obj) {
  if (!obj || Object.keys(obj).length === 0) return "<em>Empty</em>";
  
  const rows = Object.entries(obj)
    .filter(([key]) => key !== "photos" && key !== "signatures")
    .map(([key, value]) => `
      <div style="margin: 5px 0; padding: 8px; background: #f7fafc; border-radius: 4px;">
        <strong>${formatLabel(key)}:</strong> ${renderValue(value)}
      </div>
    `).join("");
  
  return `<div style="margin: 10px 0;">${rows}</div>`;
}

// Generate a generic table from data
function generateDataTable(data, title = "") {
  if (!data || typeof data !== "object") return "";

  // Filter out photos and signatures
  const entries = Object.entries(data).filter(
    ([key]) => key !== "photos" && key !== "signatures"
  );

  if (entries.length === 0) return "";

  const rows = entries
    .map(
      ([key, value]) => `
    <tr>
      <td style="vertical-align: top; width: 30%;"><strong>${formatLabel(key)}</strong></td>
      <td style="vertical-align: top; width: 70%;">${renderValue(value)}</td>
    </tr>
  `
    )
    .join("");

  return `
    ${title ? `<h3 style="margin-top: 30px; color: #2d3748;">${title}</h3>` : ""}
    <table class="form-table" style="page-break-inside: avoid;">
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/**
 * Stage1Form1 (Traction) - Name Plate Details Transformer / Reactor
 * This is kept in sync with UI component `Stage1Form1` in:
 * `frontend/src/components/TractionTransformerForms.js`
 */
function generateStage1Form1(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>NAME PLATE DETAILS TRANSFORMER /REACTOR</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>MAKE</strong></td>
            <td>${formData.make || ""}</td>
            <td><strong>CURRENT HV (A)</strong></td>
            <td>${formData.currentHV || ""}</td>
          </tr>
          <tr>
            <td><strong>SR. NO.</strong></td>
            <td>${formData.srNo || ""}</td>
            <td><strong>LV (A)</strong></td>
            <td>${formData.currentLV || ""}</td>
          </tr>
          <tr>
            <td><strong>MVA Rating</strong></td>
            <td>${formData.mvaRating || ""}</td>
            <td><strong>Temp. Rise over amb. Oil in °C</strong></td>
            <td>${formData.tempRiseOilC || ""}</td>
          </tr>
          <tr>
            <td><strong>HV (KV)</strong></td>
            <td>${formData.hvKv || ""}</td>
            <td><strong>Winding in °C</strong></td>
            <td>${formData.windingC || ""}</td>
          </tr>
          <tr>
            <td><strong>LV (KV)</strong></td>
            <td>${formData.lvKv || ""}</td>
            <td><strong>Oil Quantity</strong></td>
            <td>${formData.oilQuantity || ""}</td>
          </tr>
          <tr>
            <td><strong>% Impedance</strong></td>
            <td>${formData.impedancePercent || ""}</td>
            <td><strong>Weight of Core & Wdg.</strong></td>
            <td>${formData.weightCoreWdg || ""}</td>
          </tr>
          <tr>
            <td><strong>Year of Mfg.</strong></td>
            <td>${formData.yearOfMfg || ""}</td>
            <td><strong>TRANSPORTING WEIGHT</strong></td>
            <td>${formData.transportingWeight || ""}</td>
          </tr>
          <tr>
            <td><strong>NO. OF COOLING FAN</strong></td>
            <td>${formData.noOfCoolingFan || ""}</td>
            <td><strong>Total Weight</strong></td>
            <td>${formData.totalWeight || ""}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td><strong>NO. OF RADIATORS</strong></td>
            <td>${formData.noOfRadiators || ""}</td>
          </tr>
          <tr>
            <td><strong>NO. OF TAPS</strong></td>
            <td>${formData.noOfTaps || ""}</td>
            <td><strong>MFG. OF OCTC</strong></td>
            <td>${formData.mfgOfOctc || ""}</td>
          </tr>
          <tr>
            <td><strong>TYPE OF OCTC</strong></td>
            <td>${formData.typeOfOctc || ""}</td>
            <td><strong>SR. NO. OCTC</strong></td>
            <td>${formData.srNoOctc || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage1Form2 (Traction) - Protocol for Accessories Checking
 * This is kept in sync with UI component `Stage1Form2` in:
 * `frontend/src/components/TractionTransformerForms.js`
 */
function generateStage1Form2(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  // Must match the exact rows in TractionTransformerForms.js Stage1Form2
  const accessoryItems = [
    { id: 1, description: "HV bushing" },
    { id: 2, description: "LV Bushing" },
    { id: 3, description: "Radiators" },
    { id: 4, description: "Buchholz" },
    { id: 5, description: "PRV" },
    { id: 6, description: "CPR" },
    { id: 7, description: "Breather" },
    { id: 8, description: "Bushing Connector" },
    { id: 9, description: "FAN" },
    { id: 10, description: "Turrents" },
    { id: 11, description: "Valves" },
  ];

  const accessoryRows = accessoryItems
    .map((item) => {
      const accessoryData = formData.accessories?.[item.id] || {};
      return `
        <tr>
          <td>${item.id}</td>
          <td>${accessoryData.packingCase || ""}</td>
          <td><strong>${item.description}</strong></td>
          <td>${accessoryData.qtyPerPL || ""}</td>
          <td>${accessoryData.qtyReceived || ""}</td>
          <td>${accessoryData.shortQty || ""}</td>
          <td>${accessoryData.damagedQty || ""}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>PROTOCOL FOR ACCESSORIES CHECKING.</h2>
      </div>

      <table class="form-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Packing case Number</th>
            <th>Material Description</th>
            <th>Qty as per P. L.</th>
            <th>Qty. Received</th>
            <th>Short Qty</th>
            <th>Damaged Qty.</th>
          </tr>
        </thead>
        <tbody>
          ${accessoryRows}
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

// Generate Stage 1 Form 3 - Core Insulation Check
function generateStage1Form3(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>CORE INSULATION CHECK: At 1KV &gt; 500 MΩ</h2>
      </div>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>Obtained Value (MΩ)</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Between Core - Frame</strong></td>
            <td>${formData.coreFrame_obtainedValue || ""}</td>
            <td>${formData.coreFrame_remarks || ""}</td>
          </tr>
          <tr>
            <td><strong>Between Frame - Tank</strong></td>
            <td>${formData.frameTank_obtainedValue || ""}</td>
            <td>${formData.frameTank_remarks || ""}</td>
          </tr>
          <tr>
            <td><strong>Between Core - Tank</strong></td>
            <td>${formData.coreTank_obtainedValue || ""}</td>
            <td>${formData.coreTank_remarks || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 30px;"><strong>CHECKLIST FOR CONFORMING AVAILABILITY OF EQUIPMENT AT SITE</strong></h4>
      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th style="width: 10%;"></th>
            <th style="width: 60%;">Description</th>
            <th style="width: 30%;">Rating/Capacity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1</strong></td>
            <td><strong>Whether the Filter Machine is Available</strong></td>
            <td>${formData.filterMachine || ""}</td>
          </tr>
          <tr>
            <td><strong>2</strong></td>
            <td><strong>Capacity of Filter Machine</strong></td>
            <td>${formData.filterMachineCapacity || ""}</td>
          </tr>
          <tr>
            <td><strong>3</strong></td>
            <td><strong>Capacity of the Vacuum Pump to be used.</strong></td>
            <td>${formData.vacuumPumpCapacity || ""}</td>
          </tr>
          <tr>
            <td><strong>4</strong></td>
            <td><strong>Whether the Reservoir is Available with valves and a breather.</strong></td>
            <td>${formData.reservoirAvailable || ""}</td>
          </tr>
          <tr>
            <td><strong>5</strong></td>
            <td><strong>Capacity of Reservoirs</strong></td>
            <td>${formData.reservoirCapacity || ""}</td>
          </tr>
          <tr>
            <td><strong>6</strong></td>
            <td><strong>Hose Pipes for the Filtration Process.</strong></td>
            <td>${formData.hosePipes || ""}</td>
          </tr>
          <tr>
            <td><strong>7</strong></td>
            <td><strong>Whether Crane is Available in good condition</strong></td>
            <td>${formData.craneAvailable || ""}</td>
          </tr>
          <tr>
            <td><strong>8</strong></td>
            <td><strong>Dry air</strong></td>
            <td>${formData.dryAir || ""}</td>
          </tr>
          <tr>
            <td><strong>9</strong></td>
            <td><strong>Dew point meter</strong></td>
            <td>${formData.dewPointMeter || ""}</td>
          </tr>
          <tr>
            <td><strong>10</strong></td>
            <td><strong>Mec Leod gauge</strong></td>
            <td>${formData.mecLeodGauge || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 30px;"><strong>SAFETY EQUIPMENT</strong></h4>
      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th style="width: 70%;">Description</th>
            <th style="width: 30%;">Confirmation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Fire extinguisher/Fire sand bucket</strong></td>
            <td>${formData.fireExtinguisher || ""}</td>
          </tr>
          <tr>
            <td><strong>First aid kit</strong></td>
            <td>${formData.firstAidKit || ""}</td>
          </tr>
          <tr>
            <td><strong>PPE for the working team of ETC agency, like - Safety shoes, Helmet, etc</strong></td>
            <td>${formData.ppeEquipment || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 1 Form 4 - Pre erection Ratio test of turret CTs
function generateStage1Form4(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Pre erection Ratio test of turret CTs</h2>
      </div>

      <h3 style="text-align: center; margin-top: 30px;">CT Ratio CORE - S1-S2,S1-S3 Phase 1.1</h3>

      <h4>CT Ratio Test</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Current %</th>
            <th>Applied primary Current (A) S1-S2</th>
            <th>Applied primary Current (A) S1-S3</th>
            <th>Measured secondary current (A) S1-S2</th>
            <th>Measured secondary current (A) S1-S3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20%</strong></td>
            <td>${formData.phase31_20percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_20percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase31_20percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_20percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>${formData.phase31_40percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_40percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase31_40percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_40percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>${formData.phase31_60percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_60percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase31_60percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_60percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>${formData.phase31_80percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_80percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase31_80percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_80percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>${formData.phase31_100percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_100percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase31_100percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_100percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4>Knee point Voltage</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Voltage %</th>
            <th>Applied voltage S1-S2</th>
            <th>Applied voltage S1-S3</th>
            <th>Measured current (mA) S1-S2</th>
            <th>Measured current (mA) S1-S3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20%</strong></td>
            <td>${formData.phase31_knee_20percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_20percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_20percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_20percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>${formData.phase31_knee_40percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_40percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_40percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_40percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>${formData.phase31_knee_60percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_60percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_60percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_60percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>${formData.phase31_knee_80percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_80percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_80percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_80percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>${formData.phase31_knee_100percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_100percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_100percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_100percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>110%</strong></td>
            <td>${formData.phase31_knee_110percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_110percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_110percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_110percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="text-align: center; margin-top: 40px;">Phase 1.2</h3>

      <h4>CT Ratio CORE – S1-S2, S1-S3</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Current %</th>
            <th>Applied primary Current (A) S1-S2</th>
            <th>Applied primary Current (A) S1-S3</th>
            <th>Measured secondary current (A) S1-S2</th>
            <th>Measured secondary current (A) S1-S3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20%</strong></td>
            <td>${formData.phase32_20percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_20percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase32_20percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_20percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>${formData.phase32_40percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_40percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase32_40percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_40percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>${formData.phase32_60percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_60percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase32_60percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_60percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>${formData.phase32_80percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_80percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase32_80percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_80percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>${formData.phase32_100percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_100percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase32_100percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_100percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4>Knee point Voltage</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Voltage %</th>
            <th>Applied voltage S1-S2</th>
            <th>Applied voltage S1-S3</th>
            <th>Measured current (mA) S1-S2</th>
            <th>Measured current (mA) S1-S3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20%</strong></td>
            <td>${formData.phase32_knee_20percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_20percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_20percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_20percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>${formData.phase32_knee_40percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_40percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_40percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_40percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>${formData.phase32_knee_60percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_60percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_60percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_60percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>${formData.phase32_knee_80percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_80percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_80percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_80percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>${formData.phase32_knee_100percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_100percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_100percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_100percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>110%</strong></td>
            <td>${formData.phase32_knee_110percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_110percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_110percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_110percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 1 Form 5 - Pre erection Ratio test of turret CTs (Phase 2.1, 2.2, and WTI)
function generateStage1Form5(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Pre erection Ratio test of turret CTs</h2>
      </div>

      {/* Phase 2.1 Section */}
      <h3 style="text-align: center; margin-top: 30px;">Phase 2.1</h3>

      <h4>CT Ratio CORE – S1-S2, S1-S3</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Current %</th>
            <th>Applied primary Current (A) S1-S2</th>
            <th>Applied primary Current (A) S1-S3</th>
            <th>Measured secondary current (A) S1-S2</th>
            <th>Measured secondary current (A) S1-S3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20%</strong></td>
            <td>${formData.phase31_20percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_20percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase31_20percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_20percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>${formData.phase31_40percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_40percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase31_40percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_40percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>${formData.phase31_60percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_60percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase31_60percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_60percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>${formData.phase31_80percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_80percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase31_80percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_80percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>${formData.phase31_100percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_100percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase31_100percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_100percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4>Knee point Voltage</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Voltage %</th>
            <th>Applied Voltage S1-S2</th>
            <th>Applied Voltage S1-S3</th>
            <th>Measured current (mA) S1-S2</th>
            <th>Measured current (mA) S1-S3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20%</strong></td>
            <td>${formData.phase31_knee_20percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_20percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_20percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_20percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>${formData.phase31_knee_40percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_40percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_40percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_40percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>${formData.phase31_knee_60percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_60percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_60percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_60percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>${formData.phase31_knee_80percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_80percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_80percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_80percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>${formData.phase31_knee_100percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_100percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_100percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_100percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>110%</strong></td>
            <td>${formData.phase31_knee_110percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase31_knee_110percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase31_knee_110percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase31_knee_110percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
        </tbody>
      </table>

      {/* Phase 2.2 Section */}
      <h3 style="text-align: center; margin-top: 40px;">Phase 2.2</h3>

      <h4>CT Ratio CORE – S1-S2, S1-S3</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Current %</th>
            <th>Applied primary Current (A) S1-S2</th>
            <th>Applied primary Current (A) S1-S3</th>
            <th>Measured secondary current (A) S1-S2</th>
            <th>Measured secondary current (A) S1-S3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20%</strong></td>
            <td>${formData.phase32_20percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_20percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase32_20percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_20percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>${formData.phase32_40percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_40percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase32_40percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_40percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>${formData.phase32_60percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_60percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase32_60percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_60percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>${formData.phase32_80percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_80percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase32_80percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_80percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>${formData.phase32_100percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_100percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.phase32_100percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_100percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4>Knee point Voltage</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Voltage %</th>
            <th>Applied voltage S1-S2</th>
            <th>Applied voltage S1-S3</th>
            <th>Measured current (mA) S1-S2</th>
            <th>Measured current (mA) S1-S3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20%</strong></td>
            <td>${formData.phase32_knee_20percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_20percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_20percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_20percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>${formData.phase32_knee_40percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_40percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_40percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_40percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>${formData.phase32_knee_60percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_60percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_60percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_60percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>${formData.phase32_knee_80percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_80percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_80percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_80percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>${formData.phase32_knee_100percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_100percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_100percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_100percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
          <tr>
            <td><strong>110%</strong></td>
            <td>${formData.phase32_knee_110percent_appliedVoltage_s1s2 || ""}</td>
            <td>${formData.phase32_knee_110percent_appliedVoltage_s1s3 || ""}</td>
            <td>${formData.phase32_knee_110percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.phase32_knee_110percent_measuredCurrent_s1s3 || ""}</td>
          </tr>
        </tbody>
      </table>

      {/* WTI Section */}
      <h3 style="text-align: center; margin-top: 40px;">WTI</h3>

      <h4>CT Ratio CORE - S1-S2, S1-S3, S1-S4, S1-S5, S1-S6, S1-S7</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Current %</th>
            <th>Applied primary Current (A) S1-S2</th>
            <th>Applied primary Current (A) S1-S3</th>
            <th>Applied primary Current (A) S1-S4</th>
            <th>Measured secondary current (A) S1-S2</th>
            <th>Measured secondary current (A) S1-S3</th>
            <th>Measured secondary current (A) S1-S4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20%</strong></td>
            <td>${formData.wti_20percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.wti_20percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.wti_20percent_appliedCurrent_s1s4 || ""}</td>
            <td>${formData.wti_20percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.wti_20percent_measuredCurrent_s1s3 || ""}</td>
            <td>${formData.wti_20percent_measuredCurrent_s1s4 || ""}</td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>${formData.wti_40percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.wti_40percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.wti_40percent_appliedCurrent_s1s4 || ""}</td>
            <td>${formData.wti_40percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.wti_40percent_measuredCurrent_s1s3 || ""}</td>
            <td>${formData.wti_40percent_measuredCurrent_s1s4 || ""}</td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>${formData.wti_60percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.wti_60percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.wti_60percent_appliedCurrent_s1s4 || ""}</td>
            <td>${formData.wti_60percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.wti_60percent_measuredCurrent_s1s3 || ""}</td>
            <td>${formData.wti_60percent_measuredCurrent_s1s4 || ""}</td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>${formData.wti_80percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.wti_80percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.wti_80percent_appliedCurrent_s1s4 || ""}</td>
            <td>${formData.wti_80percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.wti_80percent_measuredCurrent_s1s3 || ""}</td>
            <td>${formData.wti_80percent_measuredCurrent_s1s4 || ""}</td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>${formData.wti_100percent_appliedCurrent_s1s2 || ""}</td>
            <td>${formData.wti_100percent_appliedCurrent_s1s3 || ""}</td>
            <td>${formData.wti_100percent_appliedCurrent_s1s4 || ""}</td>
            <td>${formData.wti_100percent_measuredCurrent_s1s2 || ""}</td>
            <td>${formData.wti_100percent_measuredCurrent_s1s3 || ""}</td>
            <td>${formData.wti_100percent_measuredCurrent_s1s4 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4>CT Ratio CORE - S1-S2, S1-S3, S1-S4, S1-S5, S1-S6, S1-S7</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Current %</th>
            <th>Applied primary Current (A) S1-S5</th>
            <th>Applied primary Current (A) S1-S6</th>
            <th>Applied primary Current (A) S1-S7</th>
            <th>Measured secondary current (A) S1-S5</th>
            <th>Measured secondary current (A) S1-S6</th>
            <th>Measured secondary current (A) S1-S7</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>20%</strong></td>
            <td>${formData.wti_20percent_appliedCurrent_s1s5 || ""}</td>
            <td>${formData.wti_20percent_appliedCurrent_s1s6 || ""}</td>
            <td>${formData.wti_20percent_appliedCurrent_s1s7 || ""}</td>
            <td>${formData.wti_20percent_measuredCurrent_s1s5 || ""}</td>
            <td>${formData.wti_20percent_measuredCurrent_s1s6 || ""}</td>
            <td>${formData.wti_20percent_measuredCurrent_s1s7 || ""}</td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>${formData.wti_40percent_appliedCurrent_s1s5 || ""}</td>
            <td>${formData.wti_40percent_appliedCurrent_s1s6 || ""}</td>
            <td>${formData.wti_40percent_appliedCurrent_s1s7 || ""}</td>
            <td>${formData.wti_40percent_measuredCurrent_s1s5 || ""}</td>
            <td>${formData.wti_40percent_measuredCurrent_s1s6 || ""}</td>
            <td>${formData.wti_40percent_measuredCurrent_s1s7 || ""}</td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>${formData.wti_60percent_appliedCurrent_s1s5 || ""}</td>
            <td>${formData.wti_60percent_appliedCurrent_s1s6 || ""}</td>
            <td>${formData.wti_60percent_appliedCurrent_s1s7 || ""}</td>
            <td>${formData.wti_60percent_measuredCurrent_s1s5 || ""}</td>
            <td>${formData.wti_60percent_measuredCurrent_s1s6 || ""}</td>
            <td>${formData.wti_60percent_measuredCurrent_s1s7 || ""}</td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>${formData.wti_80percent_appliedCurrent_s1s5 || ""}</td>
            <td>${formData.wti_80percent_appliedCurrent_s1s6 || ""}</td>
            <td>${formData.wti_80percent_appliedCurrent_s1s7 || ""}</td>
            <td>${formData.wti_80percent_measuredCurrent_s1s5 || ""}</td>
            <td>${formData.wti_80percent_measuredCurrent_s1s6 || ""}</td>
            <td>${formData.wti_80percent_measuredCurrent_s1s7 || ""}</td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>${formData.wti_100percent_appliedCurrent_s1s5 || ""}</td>
            <td>${formData.wti_100percent_appliedCurrent_s1s6 || ""}</td>
            <td>${formData.wti_100percent_appliedCurrent_s1s7 || ""}</td>
            <td>${formData.wti_100percent_measuredCurrent_s1s5 || ""}</td>
            <td>${formData.wti_100percent_measuredCurrent_s1s6 || ""}</td>
            <td>${formData.wti_100percent_measuredCurrent_s1s7 || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 1 Form 6 - Tan Delta and Capacitance Test on Bushing
function generateStage1Form6(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TAN DELTA AND CAPACITANCE TEST ON BUSHING</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>METER USED</strong></td>
            <td>${formData.meterUsed || ""}</td>
            <td><strong>DATE</strong></td>
            <td>${formData.date || ""}</td>
            <td><strong>TIME</strong></td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td>${formData.modelSrNo || ""}</td>
            <td><strong>WTI</strong></td>
            <td>${formData.wti || ""}</td>
            <td><strong>OTI</strong></td>
            <td>${formData.oti || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table">
        <thead>
          <tr>
            <th></th>
            <th>1.1</th>
            <th>1.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>BUSHING SR. NO.HV</strong></td>
            <td>${formData.hvBushing11_srNo || ""}</td>
            <td>${formData.hvBushing12_srNo || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4>Status</h4>
      <table class="form-table">
        <thead>
          <tr>
            <th>AT 05 KV PHASE</th>
            <th>TAN DELTA in %</th>
            <th>CAPACITANCE (pF)</th>
            <th>EXCITATION CURRENT (mA)</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1.1</strong></td>
            <td>${formData.hvBushing11_05kv_tanDelta || ""}</td>
            <td>${formData.hvBushing11_05kv_capacitance || ""}</td>
            <td>${formData.hvBushing11_05kv_excitationCurrent || ""}</td>
            <td>${formData.hvBushing11_05kv_dielectricLoss || ""}</td>
          </tr>
          <tr>
            <td><strong>1.2</strong></td>
            <td>${formData.hvBushing12_05kv_tanDelta || ""}</td>
            <td>${formData.hvBushing12_05kv_capacitance || ""}</td>
            <td>${formData.hvBushing12_05kv_excitationCurrent || ""}</td>
            <td>${formData.hvBushing12_05kv_dielectricLoss || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table">
        <thead>
          <tr>
            <th>AT 10 KV PHASE</th>
            <th>TAN DELTA in %</th>
            <th>CAPACITANCE (pF)</th>
            <th>EXCITATION CURRENT (mA)</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1.1</strong></td>
            <td>${formData.hvBushing11_10kv_tanDelta || ""}</td>
            <td>${formData.hvBushing11_10kv_capacitance || ""}</td>
            <td>${formData.hvBushing11_10kv_excitationCurrent || ""}</td>
            <td>${formData.hvBushing11_10kv_dielectricLoss || ""}</td>
          </tr>
          <tr>
            <td><strong>1.2</strong></td>
            <td>${formData.hvBushing12_10kv_tanDelta || ""}</td>
            <td>${formData.hvBushing12_10kv_capacitance || ""}</td>
            <td>${formData.hvBushing12_10kv_excitationCurrent || ""}</td>
            <td>${formData.hvBushing12_10kv_dielectricLoss || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="text-align: center; margin-top: 40px;">TYPE OF TEST – TAN DELTA AND CAPACITANCE TEST ON LV BUSHING</h3>
      <table class="form-table">
        <thead>
          <tr>
            <th></th>
            <th>2.1</th>
            <th>2.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>BUSHING SR. NO.LV</strong></td>
            <td>${formData.lvBushing21_srNo || ""}</td>
            <td>${formData.lvBushing22_srNo || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4>Status</h4>
      <table class="form-table">
        <thead>
          <tr>
            <th>AT 05 KV PHASE</th>
            <th>TAN DELTA in %</th>
            <th>CAPACITANCE (pF)</th>
            <th>EXCITATION CURRENT (mA)</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>2.1</strong></td>
            <td>${formData.lvBushing21_05kv_tanDelta || ""}</td>
            <td>${formData.lvBushing21_05kv_capacitance || ""}</td>
            <td>${formData.lvBushing21_05kv_excitationCurrent || ""}</td>
            <td>${formData.lvBushing21_05kv_dielectricLoss || ""}</td>
          </tr>
          <tr>
            <td><strong>2.2</strong></td>
            <td>${formData.lvBushing22_05kv_tanDelta || ""}</td>
            <td>${formData.lvBushing22_05kv_capacitance || ""}</td>
            <td>${formData.lvBushing22_05kv_excitationCurrent || ""}</td>
            <td>${formData.lvBushing22_05kv_dielectricLoss || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table">
        <thead>
          <tr>
            <th>AT 10 KV PHASE</th>
            <th>TAN DELTA in %</th>
            <th>CAPACITANCE (pF)</th>
            <th>EXCITATION CURRENT (mA)</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>2.1</strong></td>
            <td>${formData.lvBushing21_10kv_tanDelta || ""}</td>
            <td>${formData.lvBushing21_10kv_capacitance || ""}</td>
            <td>${formData.lvBushing21_10kv_excitationCurrent || ""}</td>
            <td>${formData.lvBushing21_10kv_dielectricLoss || ""}</td>
          </tr>
          <tr>
            <td><strong>2.2</strong></td>
            <td>${formData.lvBushing22_10kv_tanDelta || ""}</td>
            <td>${formData.lvBushing22_10kv_capacitance || ""}</td>
            <td>${formData.lvBushing22_10kv_excitationCurrent || ""}</td>
            <td>${formData.lvBushing22_10kv_dielectricLoss || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 1 Form 7 - Record of Measurement of IR Values
function generateStage1Form7(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>RECORD OF MEASUREMENT OF IR VALUES</h2>
        <h3>Before Erection</h3>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Date</strong></td>
            <td>${formData.date || ""}</td>
            <td><strong>Time</strong></td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>Amb Temp:</strong></td>
            <td>${formData.ambTemp || ""}</td>
            <td><strong>Make:</strong></td>
            <td>${formData.make || ""}</td>
          </tr>
          <tr>
            <td><strong>Oil Temp:</strong></td>
            <td>${formData.oilTemp || ""}</td>
            <td><strong>Sr No:</strong></td>
            <td>${formData.srNo || ""}</td>
          </tr>
          <tr>
            <td><strong>Wdg. Temp:</strong></td>
            <td>${formData.wdgTemp || ""}</td>
            <td><strong>Range:</strong></td>
            <td>${formData.range || ""}</td>
          </tr>
          <tr>
            <td><strong>Relative Humidity</strong></td>
            <td>${formData.relativeHumidity || ""}</td>
            <td><strong>Voltage Level:</strong></td>
            <td>${formData.voltageLevel || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>10 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>Ratio of IR 60/IR 10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth_10sec || ""}</td>
            <td>${formData.hvEarth_60sec || ""}</td>
            <td>${formData.hvEarth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>LV-Earth</strong></td>
            <td>${formData.lvEarth_10sec || ""}</td>
            <td>${formData.lvEarth_60sec || ""}</td>
            <td>${formData.lvEarth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>HV-LV</strong></td>
            <td>${formData.hvLv_10sec || ""}</td>
            <td>${formData.hvLv_60sec || ""}</td>
            <td>${formData.hvLv_ratio || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 2 Form 1 - Record of Oil Handling
function generateStage2Form1(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  // Generate filtration records rows (15 rows to match frontend)
  const filtrationRows = (formData.filtrationRecords || Array(15).fill({})).map((record, index) => `
    <tr>
      <td>${record.date || ""}</td>
      <td>${record.time || ""}</td>
      <td>${record.vacuumLevel || ""}</td>
      <td>${record.inletTemp || ""}</td>
      <td>${record.outletTemp || ""}</td>
    </tr>
  `).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>RECORD OF OIL HANDLING</h2>
        <h3>TEST VALUES PRIOR TO FILTERATION</h3>
      </div>

      <h4>Record of Oil Filling in the Reservoirs Tank:</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>No of barrels</th>
            <th>Started on Date & time</th>
            <th>Completed on Date & time</th>
            <th>BDV</th>
            <th>PPM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tank1</strong></td>
            <td>${formData.tank1_noOfBarrels || ""}</td>
            <td>${formData.tank1_startedDate || ""} ${formData.tank1_startedTime || ""}</td>
            <td>${formData.tank1_completedDate || ""} ${formData.tank1_completedTime || ""}</td>
            <td>${formData.tank1_bdv || ""}</td>
            <td>${formData.tank1_ppm || ""}</td>
          </tr>
          <tr>
            <td><strong>Tank2</strong></td>
            <td>${formData.tank2_noOfBarrels || ""}</td>
            <td>${formData.tank2_startedDate || ""} ${formData.tank2_startedTime || ""}</td>
            <td>${formData.tank2_completedDate || ""} ${formData.tank2_completedTime || ""}</td>
            <td>${formData.tank2_bdv || ""}</td>
            <td>${formData.tank2_ppm || ""}</td>
          </tr>
          <tr>
            <td><strong>Tank3</strong></td>
            <td>${formData.tank3_noOfBarrels || ""}</td>
            <td>${formData.tank3_startedDate || ""} ${formData.tank3_startedTime || ""}</td>
            <td>${formData.tank3_completedDate || ""} ${formData.tank3_completedTime || ""}</td>
            <td>${formData.tank3_bdv || ""}</td>
            <td>${formData.tank3_ppm || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px;">Reservoir Tank Filtration</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level (mmHg or torr)</th>
            <th>Inlet Temp °C</th>
            <th>Outlet Temp °C</th>
          </tr>
        </thead>
        <tbody>
          ${filtrationRows}
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

// Generate Stage 2 Form 2 - Line Lead Clearance and IR After Erection
function generateStage2Form2(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Line Lead Clearance in mm :-</h2>
      </div>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>1.1</th>
            <th></th>
            <th>1.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV with respect to earth</strong></td>
            <td>${formData.hv_earth_11 || ""}</td>
            <td></td>
            <td>${formData.hv_earth_12 || ""}</td>
          </tr>
          <tr>
            <td><strong>LV 1 with respect to earth</strong></td>
            <td>${formData.lv1_earth_21 || ""}</td>
            <td></td>
            <td>${formData.lv1_earth_22 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 40px; text-align: center;">
        IR Values After erection Temp OTI .......°C WTI.............°C, AMB .............°C RANGE ONLY 1 KV
      </h3>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Temp OTI °C</strong></td>
            <td>${formData.tempOTI || ""}</td>
          </tr>
          <tr>
            <td><strong>Temp WTI °C</strong></td>
            <td>${formData.tempWTI || ""}</td>
          </tr>
          <tr>
            <td><strong>Temp AMB °C</strong></td>
            <td>${formData.tempAMB || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>10 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>Ratio of IR 60/IR 10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth_10sec || ""}</td>
            <td>${formData.hvEarth_60sec || ""}</td>
            <td>${formData.hvEarth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>LV-Earth</strong></td>
            <td>${formData.lvEarth_10sec || ""}</td>
            <td>${formData.lvEarth_60sec || ""}</td>
            <td>${formData.lvEarth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>HV-LV</strong></td>
            <td>${formData.hvLv_10sec || ""}</td>
            <td>${formData.hvLv_60sec || ""}</td>
            <td>${formData.hvLv_ratio || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px;">Before oil filling in main tank</h4>
      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>BDV (KV)</strong></td>
            <td>${formData.bdv || ""}</td>
          </tr>
          <tr>
            <td><strong>Water Content (PPM)</strong></td>
            <td>${formData.waterContent || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 3 Form 1 - Vacuum Cycle Recording
function generateStage3Form1(formData) {
  if (!formData) return "";

  // Generate vacuum records rows (15 rows to match frontend)
  const vacuumRows = (formData.vacuumRecords || Array(15).fill({})).map((record, index) => `
    <tr>
      <td>${record.date || ""}</td>
      <td>${record.time || ""}</td>
      <td>${record.vacuumLevelMic || ""}</td>
      <td>${record.vacuumLevelTransformer || ""}</td>
    </tr>
  `).join("");

  // Generate pressure test rows (5 rows to match frontend)
  const pressureTestRows = (formData.pressureTests || Array(5).fill({})).map((test, index) => `
    <tr>
      <td><strong>${index + 1}</strong></td>
      <td>${test.timeStarted || ""}</td>
      <td>${test.pressure || ""}</td>
      <td>${test.tempAmb || ""}</td>
      <td>${test.tempOti || ""}</td>
      <td>${test.tempWti || ""}</td>
    </tr>
  `).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>DETAILS FOR RECORDING OF VACUUM CYCLE</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Vacuum hose Checked By</strong></td>
            <td colspan="3">${formData.vacuumHoseCheckedBy || ""}</td>
          </tr>
          <tr>
            <td><strong>Vacuum hose Connected To</strong></td>
            <td colspan="3">${formData.vacuumHoseConnectedTo || ""} Valve.</td>
          </tr>
          <tr>
            <td><strong>Evacuation Started At</strong></td>
            <td>${formData.evacuationStartedAt || ""} Hrs. On ${formData.evacuationStartedOn || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>DATE</th>
            <th>TIME</th>
            <th>Vacuum Level (mmHg or torr)</th>
            <th>Vac. Level in Transformer Tank (torr)</th>
          </tr>
        </thead>
        <tbody>
          ${vacuumRows}
        </tbody>
      </table>

      <h3 style="margin-top: 40px; text-align: center;">
        IR After oil Topping up To Conservator Temp OTI ${formData.tempOTI || "......."}°C WTI ${formData.tempWTI || "............."}°C, AMB ${formData.tempAMB || "............."}°C RANGE ONLY 1 KV
      </h3>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Temp OTI °C</strong></td>
            <td>${formData.tempOTI || ""}</td>
          </tr>
          <tr>
            <td><strong>Temp WTI °C</strong></td>
            <td>${formData.tempWTI || ""}</td>
          </tr>
          <tr>
            <td><strong>Temp AMB °C</strong></td>
            <td>${formData.tempAMB || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>10 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>Ratio of IR 60/IR 10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth_10sec || ""}</td>
            <td>${formData.hvEarth_60sec || ""}</td>
            <td>${formData.hvEarth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>LV-Earth</strong></td>
            <td>${formData.lvEarth_10sec || ""}</td>
            <td>${formData.lvEarth_60sec || ""}</td>
            <td>${formData.lvEarth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>HV-LV</strong></td>
            <td>${formData.hvLv_10sec || ""}</td>
            <td>${formData.hvLv_60sec || ""}</td>
            <td>${formData.hvLv_ratio || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px; text-align: center;">PRESSURE TEST REPORT</h4>
      <div style="margin-bottom: 10px;">
        <strong>DATE: </strong>${formData.pressureTestDate || ""}
      </div>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Sr. No.</th>
            <th>TIME STARTED</th>
            <th>PRESSURE Kg/cm²</th>
            <th colspan="3">TEMP°C</th>
          </tr>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th></th>
            <th></th>
            <th>Amb.</th>
            <th>OTI</th>
            <th>WTI</th>
          </tr>
        </thead>
        <tbody>
          ${pressureTestRows}
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 4 Form 1 - Record for Oil Filtration (matching frontend UI exactly)
function generateStage4Form1(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  // Generate filtration records rows (30 rows to match frontend)
  const filtrationRows = (formData.filtrationRecords || Array(30).fill({})).map((record, index) => `
    <tr>
      <td>${record.date || ""}</td>
      <td>${record.time || ""}</td>
      <td>${record.vacuumLevel || ""}</td>
      <td>${record.mcOutletTemp || ""}</td>
      <td>${record.otiTemp || ""}</td>
      <td>${record.wtiTemp || ""}</td>
    </tr>
  `).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>RECORD FOR OIL FILTRATION</h2>
        <h3>Oil filtration of Main Tank</h3>
      </div>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level (mmHg or torr)</th>
            <th>M/C Outlet Temp °C</th>
            <th>OTI Temp °C</th>
            <th>WTI Temp °C</th>
          </tr>
        </thead>
        <tbody>
          ${filtrationRows}
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

// Generate Stage 4 Form 2 - IR Value before radiator/combine filtration & Oil filtration of Cooler Bank (matching frontend UI exactly)
function generateStage4Form2(formData) {
  if (!formData) return "";

  // Generate cooler bank filtration records (15 rows to match frontend)
  const coolerBankRows = (formData.coolerBankRecords || Array(15).fill({}))
    .map((record, index) => `
      <tr>
        <td>${record.date || ""}</td>
        <td>${record.time || ""}</td>
        <td>${record.vacuumLevel || ""}</td>
        <td>${record.mcOutletTemp || ""}</td>
        <td>${record.otiTemp || ""}</td>
        <td>${record.wtiTemp || ""}</td>
      </tr>
    `).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>IR Value before radiator/combine filtration Temp OTI .......°C WTI.............°C, AMB .............°C RANGE ONLY 1 KV</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Temp OTI °C</strong></td>
            <td>${formData.tempOTI || ""}</td>
          </tr>
          <tr>
            <td><strong>Temp WTI °C</strong></td>
            <td>${formData.tempWTI || ""}</td>
          </tr>
          <tr>
            <td><strong>Temp AMB °C</strong></td>
            <td>${formData.tempAMB || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>10 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>Ratio of IR 60/IR 10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth_15sec || ""}</td>
            <td>${formData.hvEarth_60sec || ""}</td>
            <td>${formData.hvEarth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>LV-Earth</strong></td>
            <td>${formData.lv1Earth_15sec || ""}</td>
            <td>${formData.lv1Earth_60sec || ""}</td>
            <td>${formData.lv1Earth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>HV-LV</strong></td>
            <td>${formData.hvLv1_15sec || ""}</td>
            <td>${formData.hvLv1_60sec || ""}</td>
            <td>${formData.hvLv1_ratio || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px; text-align: center;">Oil filtration of Cooler Bank</h4>
      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level (mmHg or torr)</th>
            <th>M/C Outlet Temp °C</th>
            <th>OTI Temp °C</th>
            <th>WTI Temp °C</th>
          </tr>
        </thead>
        <tbody>
          ${coolerBankRows}
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

/**
 * Stage4Form3 (Traction) - Oil filtration of Combine (Main Tank + Cooler bank)
 * This is kept in sync with UI component `Stage4Form3` in:
 * `frontend/src/components/TractionTransformerForms.js`
 */
function generateStage4Form3(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  // Match frontend: 15 combineRecords rows with same fields
  const combineRows = (formData.combineRecords || Array(15).fill({}))
    .map(
      (record) => `
        <tr>
          <td>${record.date || ""}</td>
          <td>${record.time || ""}</td>
          <td>${record.vacuumLevel || ""}</td>
          <td>${record.mcOutletTemp || ""}</td>
          <td>${record.otiTemp || ""}</td>
          <td>${record.wtiTemp || ""}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>RECORD FOR OIL FILTRATION</h2>
        <h3>Oil filtration of Combine (Main Tank + Cooler bank)</h3>
      </div>

      <table class="form-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level (mmHg or torr)</th>
            <th>M/C Outlet Temp °C</th>
            <th>OTI Temp °C</th>
            <th>WTI Temp °C</th>
          </tr>
        </thead>
        <tbody>
          ${combineRows}
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

// Generate Stage 4 Form 4 - IR & PI Value After Filtration (matching frontend UI exactly)
function generateStage4Form4(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>
          IR & PI Value after filtration Temp OTI ${formData.tempOTI || "......."}°C WTI ${formData.tempWTI || "............."}°C, AMB ${formData.tempAMB || "............."}°C RANGE ONLY 5 KV
        </h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Temp OTI °C</strong></td>
            <td>${formData.tempOTI || ""}</td>
          </tr>
          <tr>
            <td><strong>Temp WTI °C</strong></td>
            <td>${formData.tempWTI || ""}</td>
          </tr>
          <tr>
            <td><strong>Temp AMB °C</strong></td>
            <td>${formData.tempAMB || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>10 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>600 Sec (MΩ)</th>
            <th>PI 600/60 Sec</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth_10sec || ""}</td>
            <td>${formData.hvEarth_60sec || ""}</td>
            <td>${formData.hvEarth_600sec || ""}</td>
            <td>${formData.hvEarth_pi || ""}</td>
          </tr>
          <tr>
            <td><strong>LV1-Earth</strong></td>
            <td>${formData.lv1Earth_10sec || ""}</td>
            <td>${formData.lv1Earth_60sec || ""}</td>
            <td>${formData.lv1Earth_600sec || ""}</td>
            <td>${formData.lv1Earth_pi || ""}</td>
          </tr>
          <tr>
            <td><strong>HV-LV1</strong></td>
            <td>${formData.hvLv1_10sec || ""}</td>
            <td>${formData.hvLv1_60sec || ""}</td>
            <td>${formData.hvLv1_600sec || ""}</td>
            <td>${formData.hvLv1_pi || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px;">After Oil Filtration of main tank</h4>
      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>BDV (KV)</strong></td>
            <td>${formData.bdv || ""}</td>
          </tr>
          <tr>
            <td><strong>Water Content (PPM)</strong></td>
            <td>${formData.waterContent || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

// Generate Stage 5 Form 1 - Test Record of Erection for Traction Transformer
function generateStage5Form1(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Test Record of Erection for Traction Transformer</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>METER USED</strong></td>
            <td>${formData.makeOfMeter || ""}</td>
            <td><strong>DATE</strong></td>
            <td>${formData.date || ""}</td>
          </tr>
          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td>${formData.modelAndSrNo || formData.meterMakeSrNo || ""}</td>
            <td><strong>AMBIENT</strong></td>
            <td>${formData.ambient || ""}</td>
          </tr>
          <tr>
            <td><strong>OTI in ⁰C</strong></td>
            <td>${formData.oti || ""}</td>
            <td><strong>WTI in ⁰C</strong></td>
            <td>${formData.wti || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>TR Sr. No.</strong></td>
            <td>${formData.trSrNo || ""}</td>
            <td><strong>Location</strong></td>
            <td>${formData.location || ""}</td>
          </tr>
          <tr>
            <td><strong>Customer</strong></td>
            <td>${formData.customer || ""}</td>
            <td><strong>Date</strong></td>
            <td>${formData.testDate || ""}</td>
          </tr>
          <tr>
            <td><strong>Time</strong></td>
            <td>${formData.testTime || ""}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><strong>Amb. Temp ⁰C</strong></td>
            <td>${formData.ambTemp || ""}</td>
            <td><strong>Make</strong></td>
            <td>${formData.make || ""}</td>
          </tr>
          <tr>
            <td><strong>Oil. Temp ⁰C</strong></td>
            <td>${formData.oilTemp || ""}</td>
            <td><strong>Sr. No</strong></td>
            <td>${formData.srNo || ""}</td>
          </tr>
          <tr>
            <td><strong>Wdg. Temp ⁰C</strong></td>
            <td>${formData.wdgTemp || ""}</td>
            <td><strong>Voltage Level</strong></td>
            <td>${formData.voltageLevel || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>15 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>600 Sec (MΩ)</th>
            <th>Ratio of IR 60/15</th>
            <th>Ratio of IR 600/60</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth_15sec || ""}</td>
            <td>${formData.hvEarth_60sec || ""}</td>
            <td>${formData.hvEarth_600sec || ""}</td>
            <td>${formData.hvEarth_ratio60_15 || ""}</td>
            <td>${formData.hvEarth_ratio600_60 || ""}</td>
          </tr>
          <tr>
            <td><strong>LV-Earth</strong></td>
            <td>${formData.lvEarth_15sec || ""}</td>
            <td>${formData.lvEarth_60sec || ""}</td>
            <td>${formData.lvEarth_600sec || ""}</td>
            <td>${formData.lvEarth_ratio60_15 || ""}</td>
            <td>${formData.lvEarth_ratio600_60 || ""}</td>
          </tr>
          <tr>
            <td><strong>HV-LV</strong></td>
            <td>${formData.hvLv_15sec || ""}</td>
            <td>${formData.hvLv_60sec || ""}</td>
            <td>${formData.hvLv_600sec || ""}</td>
            <td>${formData.hvLv_ratio60_15 || ""}</td>
            <td>${formData.hvLv_ratio600_60 || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

// Generate Stage 5 Form 2 - Magnetic Balance Test
function generateStage5Form2(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Magnetic Balance Test</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>METER USED</strong></td>
            <td>${formData.meterUsed || ""}</td>
            <td><strong>DATE</strong></td>
            <td>${formData.date || ""}</td>
          </tr>
          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td>${formData.modelSrNo || ""}</td>
            <td><strong>TIME</strong></td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>OTI in ⁰C</strong></td>
            <td>${formData.oti || ""}</td>
            <td><strong>WTI in ⁰C</strong></td>
            <td>${formData.wti || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 30px; text-align: center;">Magnetic Balance Test</h3>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Tap Position</th>
            <th>Applied Voltage (V)</th>
            <th>Current 1.1 (A)</th>
            <th>Current 1.2 (A)</th>
            <th>% Unbalance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1</strong></td>
            <td>${formData.tap1_appliedVoltage || ""}</td>
            <td>${formData.tap1_current11 || ""}</td>
            <td>${formData.tap1_current12 || ""}</td>
            <td>${formData.tap1_unbalance || ""}</td>
          </tr>
          <tr>
            <td><strong>2</strong></td>
            <td>${formData.tap2_appliedVoltage || ""}</td>
            <td>${formData.tap2_current11 || ""}</td>
            <td>${formData.tap2_current12 || ""}</td>
            <td>${formData.tap2_unbalance || ""}</td>
          </tr>
          <tr>
            <td><strong>3</strong></td>
            <td>${formData.tap3_appliedVoltage || ""}</td>
            <td>${formData.tap3_current11 || ""}</td>
            <td>${formData.tap3_current12 || ""}</td>
            <td>${formData.tap3_unbalance || ""}</td>
          </tr>
          <tr>
            <td><strong>4</strong></td>
            <td>${formData.tap4_appliedVoltage || ""}</td>
            <td>${formData.tap4_current11 || ""}</td>
            <td>${formData.tap4_current12 || ""}</td>
            <td>${formData.tap4_unbalance || ""}</td>
          </tr>
          <tr>
            <td><strong>5</strong></td>
            <td>${formData.tap5_appliedVoltage || ""}</td>
            <td>${formData.tap5_current11 || ""}</td>
            <td>${formData.tap5_current12 || ""}</td>
            <td>${formData.tap5_unbalance || ""}</td>
          </tr>
          <tr>
            <td><strong>6</strong></td>
            <td>${formData.tap6_appliedVoltage || ""}</td>
            <td>${formData.tap6_current11 || ""}</td>
            <td>${formData.tap6_current12 || ""}</td>
            <td>${formData.tap6_unbalance || ""}</td>
          </tr>
          <tr>
            <td><strong>7</strong></td>
            <td>${formData.tap7_appliedVoltage || ""}</td>
            <td>${formData.tap7_current11 || ""}</td>
            <td>${formData.tap7_current12 || ""}</td>
            <td>${formData.tap7_unbalance || ""}</td>
          </tr>
          <tr>
            <td><strong>8</strong></td>
            <td>${formData.tap8_appliedVoltage || ""}</td>
            <td>${formData.tap8_current11 || ""}</td>
            <td>${formData.tap8_current12 || ""}</td>
            <td>${formData.tap8_unbalance || ""}</td>
          </tr>
          <tr>
            <td><strong>9</strong></td>
            <td>${formData.tap9_appliedVoltage || ""}</td>
            <td>${formData.tap9_current11 || ""}</td>
            <td>${formData.tap9_current12 || ""}</td>
            <td>${formData.tap9_unbalance || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 30px; text-align: center;">Remarks</h3>
      <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px; min-height: 100px; background: #f7fafc;">
        ${formData.remarks || ""}
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
      ${generateSignatureSection(formData.signatures)}
    </div>
  `;
}

// Generate Stage 5 Form 3 - Vector Group Test
function generateStage5Form3(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Vector Group Test</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>METER USED</strong></td>
            <td>${formData.meterUsed || ""}</td>
            <td><strong>DATE</strong></td>
            <td>${formData.date || ""}</td>
          </tr>
          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td>${formData.modelSrNo || ""}</td>
            <td><strong>TIME</strong></td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>OTI in ⁰C</strong></td>
            <td>${formData.oti || ""}</td>
            <td><strong>WTI in ⁰C</strong></td>
            <td>${formData.wti || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 30px; text-align: center;">Vector Group Test</h3>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Test</th>
            <th>Applied Voltage (V)</th>
            <th>Measured Voltage (V)</th>
            <th>Phase Angle (Degrees)</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-LV</strong></td>
            <td>${formData.hvlv_appliedVoltage || ""}</td>
            <td>${formData.hvlv_measuredVoltage || ""}</td>
            <td>${formData.hvlv_phaseAngle || ""}</td>
            <td>${formData.hvlv_result || ""}</td>
          </tr>
          <tr>
            <td><strong>HV Phase 1-2</strong></td>
            <td>${formData.hvPhase12_appliedVoltage || ""}</td>
            <td>${formData.hvPhase12_measuredVoltage || ""}</td>
            <td>${formData.hvPhase12_phaseAngle || ""}</td>
            <td>${formData.hvPhase12_result || ""}</td>
          </tr>
          <tr>
            <td><strong>LV Phase 1-2</strong></td>
            <td>${formData.lvPhase12_appliedVoltage || ""}</td>
            <td>${formData.lvPhase12_measuredVoltage || ""}</td>
            <td>${formData.lvPhase12_phaseAngle || ""}</td>
            <td>${formData.lvPhase12_result || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 30px; text-align: center;">Vector Group Verification</h3>
      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Specified Vector Group</strong></td>
            <td>${formData.specifiedVectorGroup || ""}</td>
          </tr>
          <tr>
            <td><strong>Measured Vector Group</strong></td>
            <td>${formData.measuredVectorGroup || ""}</td>
          </tr>
          <tr>
            <td><strong>Verification Result</strong></td>
            <td>${formData.verificationResult || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 30px; text-align: center;">Remarks</h3>
      <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px; min-height: 100px; background: #f7fafc;">
        ${formData.remarks || ""}
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
      ${generateSignatureSection(formData.signatures)}
    </div>
  `;
}

// Generate Stage 5 Form 4 - Winding Resistance Test
function generateStage5Form4(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Winding Resistance Test</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>METER USED</strong></td>
            <td>${formData.meterUsed || ""}</td>
            <td><strong>DATE</strong></td>
            <td>${formData.date || ""}</td>
          </tr>
          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td>${formData.modelSrNo || ""}</td>
            <td><strong>TIME</strong></td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>OTI in ⁰C</strong></td>
            <td>${formData.oti || ""}</td>
            <td><strong>WTI in ⁰C</strong></td>
            <td>${formData.wti || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 30px; text-align: center;">HV Winding Resistance</h3>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Tap Position</th>
            <th>Phase 1.1 (Ω)</th>
            <th>Phase 1.2 (Ω)</th>
            <th>% Deviation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1</strong></td>
            <td>${formData.hv_tap1_phase11 || ""}</td>
            <td>${formData.hv_tap1_phase12 || ""}</td>
            <td>${formData.hv_tap1_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>2</strong></td>
            <td>${formData.hv_tap2_phase11 || ""}</td>
            <td>${formData.hv_tap2_phase12 || ""}</td>
            <td>${formData.hv_tap2_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>3</strong></td>
            <td>${formData.hv_tap3_phase11 || ""}</td>
            <td>${formData.hv_tap3_phase12 || ""}</td>
            <td>${formData.hv_tap3_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>4</strong></td>
            <td>${formData.hv_tap4_phase11 || ""}</td>
            <td>${formData.hv_tap4_phase12 || ""}</td>
            <td>${formData.hv_tap4_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>5</strong></td>
            <td>${formData.hv_tap5_phase11 || ""}</td>
            <td>${formData.hv_tap5_phase12 || ""}</td>
            <td>${formData.hv_tap5_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>6</strong></td>
            <td>${formData.hv_tap6_phase11 || ""}</td>
            <td>${formData.hv_tap6_phase12 || ""}</td>
            <td>${formData.hv_tap6_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>7</strong></td>
            <td>${formData.hv_tap7_phase11 || ""}</td>
            <td>${formData.hv_tap7_phase12 || ""}</td>
            <td>${formData.hv_tap7_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>8</strong></td>
            <td>${formData.hv_tap8_phase11 || ""}</td>
            <td>${formData.hv_tap8_phase12 || ""}</td>
            <td>${formData.hv_tap8_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>9</strong></td>
            <td>${formData.hv_tap9_phase11 || ""}</td>
            <td>${formData.hv_tap9_phase12 || ""}</td>
            <td>${formData.hv_tap9_deviation || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 30px; text-align: center;">LV Winding Resistance</h3>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Phase</th>
            <th>Measured Resistance (Ω)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Phase 2.1</strong></td>
            <td>${formData.lv_phase21 || ""}</td>
          </tr>
          <tr>
            <td><strong>Phase 2.2</strong></td>
            <td>${formData.lv_phase22 || ""}</td>
          </tr>
          <tr>
            <td><strong>% Deviation</strong></td>
            <td>${formData.lv_deviation || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 30px; text-align: center;">Remarks</h3>
      <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px; min-height: 100px; background: #f7fafc;">
        ${formData.remarks || ""}
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
      ${generateSignatureSection(formData.signatures)}
    </div>
  `;
}

// Generate Stage 5 Form 5 - Transformer Turn Ratio Test
function generateStage5Form5(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Transformer Turn Ratio Test</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>METER USED</strong></td>
            <td>${formData.meterUsed || ""}</td>
            <td><strong>DATE</strong></td>
            <td>${formData.date || ""}</td>
          </tr>
          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td>${formData.modelSrNo || ""}</td>
            <td><strong>TIME</strong></td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>OTI in ⁰C</strong></td>
            <td>${formData.oti || ""}</td>
            <td><strong>WTI in ⁰C</strong></td>
            <td>${formData.wti || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 30px; text-align: center;">Transformer Turn Ratio Test</h3>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Tap Position</th>
            <th>Theoretical Ratio</th>
            <th>Measured Ratio</th>
            <th>% Deviation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1</strong></td>
            <td>${formData.tap1_theoreticalRatio || ""}</td>
            <td>${formData.tap1_measuredRatio || ""}</td>
            <td>${formData.tap1_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>2</strong></td>
            <td>${formData.tap2_theoreticalRatio || ""}</td>
            <td>${formData.tap2_measuredRatio || ""}</td>
            <td>${formData.tap2_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>3</strong></td>
            <td>${formData.tap3_theoreticalRatio || ""}</td>
            <td>${formData.tap3_measuredRatio || ""}</td>
            <td>${formData.tap3_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>4</strong></td>
            <td>${formData.tap4_theoreticalRatio || ""}</td>
            <td>${formData.tap4_measuredRatio || ""}</td>
            <td>${formData.tap4_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>5</strong></td>
            <td>${formData.tap5_theoreticalRatio || ""}</td>
            <td>${formData.tap5_measuredRatio || ""}</td>
            <td>${formData.tap5_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>6</strong></td>
            <td>${formData.tap6_theoreticalRatio || ""}</td>
            <td>${formData.tap6_measuredRatio || ""}</td>
            <td>${formData.tap6_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>7</strong></td>
            <td>${formData.tap7_theoreticalRatio || ""}</td>
            <td>${formData.tap7_measuredRatio || ""}</td>
            <td>${formData.tap7_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>8</strong></td>
            <td>${formData.tap8_theoreticalRatio || ""}</td>
            <td>${formData.tap8_measuredRatio || ""}</td>
            <td>${formData.tap8_deviation || ""}</td>
          </tr>
          <tr>
            <td><strong>9</strong></td>
            <td>${formData.tap9_theoreticalRatio || ""}</td>
            <td>${formData.tap9_measuredRatio || ""}</td>
            <td>${formData.tap9_deviation || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 30px; text-align: center;">Remarks</h3>
      <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px; min-height: 100px; background: #f7fafc;">
        ${formData.remarks || ""}
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
      ${generateSignatureSection(formData.signatures)}
    </div>
  `;
}

// Generate Stage 5 Form 6 - Winding Resistance Test
function generateStage5Form6(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  // Generate HV tap readings rows
  const hvTapRows = (formData.hvTapReadings || Array(6).fill({}))
    .map((row, index) => `
      <tr>
        <td style="text-align: center;"><strong>${row.tapNo || index + 1}</strong></td>
        <td>${row.value || ""}</td>
      </tr>
    `).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2 style="text-decoration: underline; text-underline-offset: 6px;">TYPE OF TEST – WINDING RESISTANCE TEST</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 35%;"><strong>METER USED</strong></td>
            <td style="width: 35%;"><input type="text" value="${formData.meterUsed || ""}" readonly></td>
            <td style="width: 15%;"><strong>DATE:</strong></td>
            <td style="width: 15%;"><input type="text" value="${formData.date || ""}" readonly></td>
          </tr>
          <tr>
            <td><strong>METER MAKE SR. NO.</strong></td>
            <td><input type="text" value="${formData.meterMakeSrNo || ""}" readonly></td>
            <td><strong>TIME:</strong></td>
            <td><input type="text" value="${formData.time || ""}" readonly></td>
          </tr>
          <tr>
            <td><strong>RANGE</strong></td>
            <td><input type="text" value="${formData.range1 || ""}" readonly></td>
            <td><strong>WTI:</strong></td>
            <td><input type="text" value="${formData.wti || ""}" readonly></td>
          </tr>
          <tr>
            <td><strong>RANGE</strong></td>
            <td><input type="text" value="${formData.range2 || ""}" readonly></td>
            <td><strong>OTI:</strong></td>
            <td><input type="text" value="${formData.oti || ""}" readonly></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td><strong>AMBIENT:</strong></td>
            <td><input type="text" value="${formData.ambient || ""}" readonly></td>
          </tr>
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; gap: 30px; margin-top: 30px;">
        <div style="width: 55%;">
          <h3 style="text-align: center; text-decoration: underline; text-underline-offset: 6px;">HV SIDE</h3>

          <table class="form-table" style="margin-top: 14px;">
            <thead>
              <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
                <th style="width: 25%;">TAP NO.</th>
                <th>${formData.hvHeader || "2.1 – 2.2 (Ω)"}</th>
              </tr>
            </thead>
            <tbody>
              ${hvTapRows}
            </tbody>
          </table>
        </div>

        <div style="width: 45%;">
          <h3 style="text-align: center; text-decoration: underline; text-underline-offset: 6px;">LV SIDE</h3>

          <table class="form-table" style="margin-top: 14px;">
            <thead>
              <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
                <th>${formData.lvHeader || "1.1 – 1.2 (Ω)"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" value="${formData.lvValue || ""}" readonly></td>
              </tr>
              <tr>
                <td><input type="text" value="${formData.lvValue2 || ""}" readonly></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

// Generate Stage 5 Form 7 - TAN DELTA AND CAPACITANCE TEST ON BUSHING
function generateStage5Form7(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const measurementTable = (rows = []) => `
    <table class="form-table" style="margin-top: 22px;">
      <thead>
        <tr>
          <th rowSpan="2" style="width: 14%;">VOLTAGE (KV)</th>
          <th rowSpan="2" style="width: 18%;">BUSHING &<br>SERIAL NO.</th>
          <th rowSpan="2" style="width: 12%;">TEST<br>MODE</th>
          <th colSpan="2" style="width: 26%;">CAPACITANCE (Pf)</th>
          <th colSpan="2" style="width: 30%;">TAN DELTA %</th>
        </tr>
        <tr>
          <th>FACTORY</th>
          <th>SITE</th>
          <th>FACTORY</th>
          <th>SITE</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
            <tr>
              <td>${row.voltageKv || ""}</td>
              <td style="font-weight: 700; text-align: center;">${row.label || ""}</td>
              <td>${row.testMode || ""}</td>
              <td>${row.capFactory || ""}</td>
              <td>${row.capSite || ""}</td>
              <td>${row.tdFactory || ""}</td>
              <td>${row.tdSite || ""}</td>
            </tr>
          `,
          )
          .join("")}
      </tbody>
    </table>
  `;

  const stage5Form7Photos = `
    ${formData.photos?.tanDeltaKit ? generatePhotoThumbnails({ tanDeltaKit: formData.photos.tanDeltaKit }, photoBaseUrl) : ""}
    ${formData.photos?.calibrationReport ? generatePhotoThumbnails({ calibrationReport: formData.photos.calibrationReport }, photoBaseUrl) : ""}
    ${formData.photos?.duringTanDelta ? generatePhotoThumbnails({ duringTanDelta: formData.photos.duringTanDelta }, photoBaseUrl) : ""}
  `;

  return `
    <div class="form-container">
      <div class="company-header">
        <h2 style="text-align: center; font-weight: 800; margin-bottom: 0;">TEST REPORT</h2>
        <h3 style="text-align: center; margin-top: 6px; text-decoration: underline; text-underline-offset: 6px;">
          TAN DELTA AND CAPACITANCE TEST ON BUSHING
        </h3>
      </div>

      <table class="form-table" style="margin-top: 10px;">
        <tbody>
          <tr>
            <td style="width: 25%;"><strong>BUSHING SR. NO. (HV)</strong></td>
            <td style="width: 25%;">${formData.bushingSrNoHv || ""}</td>
            <td style="width: 25%;"><strong></strong></td>
            <td style="width: 25%;">${formData.makeHv || ""}</td>
          </tr>
          <tr>
            <td><strong>BUSHING SR. NO. (LV)</strong></td>
            <td>${formData.bushingSrNoLv || ""}</td>
            <td><strong></strong></td>
            <td>${formData.makeLv || ""}</td>
          </tr>
          <tr>
            <td colspan="4" style="height: 22px;"></td>
          </tr>
          <tr>
            <td colspan="2"><strong>METER USED</strong></td>
            <td><strong>DATE:</strong></td>
            <td><strong>TIME :</strong></td>
          </tr>
          <tr>
            <td colspan="2">${formData.meterUsed || ""}</td>
            <td>${formData.date || ""}</td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>MODEL & S. NO.</strong></td>
            <td><strong>AMBIENT:</strong></td>
            <td></td>
          </tr>
          <tr>
            <td colspan="2">${formData.modelAndSrNo || ""}</td>
            <td>${formData.ambient || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td colspan="2"><strong>OTI............................°C</strong></td>
            <td colspan="2"><strong>WTI............................°C</strong></td>
          </tr>
          <tr>
            <td colspan="2">${formData.oti || ""}</td>
            <td colspan="2">${formData.wti || ""}</td>
          </tr>
        </tbody>
      </table>

      ${measurementTable(formData.rows || [])}
      ${measurementTable(formData.rows2 || [])}

      ${stage5Form7Photos}
    </div>
  `;
}

// Generate Stage 5 Form 8 - TAN DELTA AND CAPACITANCE MEASUREMENT OF WINDING
function generateStage5Form8(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  // Helper function to generate TanDelta table
  const generateTanDeltaTable = (title, currentUnit, rowsKey) => {
    if (!formData[rowsKey] || !Array.isArray(formData[rowsKey])) {
      return "";
    }

    const rows = formData[rowsKey].map(row => `
      <tr>
        <td style="font-weight: 700; text-align: center;">${row.between || ""}</td>
        <td style="font-weight: 700; text-align: center;">${row.mode || ""}</td>
        <td>${row.tanDelta || ""}</td>
        <td>${row.capacitance || ""}</td>
        <td>${row.excitationCurrent || ""}</td>
        <td>${row.dielectricLoss || ""}</td>
      </tr>
    `).join('');

    return `
      <table class="form-table" style="margin-top: 18px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th style="width: 14%;">${title}</th>
            <th style="width: 12%;">MODE</th>
            <th style="width: 16%;">TAN DELTA %</th>
            <th style="width: 16%;">CAPACITANCE<br>(Pf)</th>
            <th style="width: 20%;">EXCITATION CURRENT<br>(${currentUnit})</th>
            <th style="width: 22%;">DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  };

  // Generate IR Values table rows
  const generateIrRows = () => {
    if (!formData.ir || !formData.ir.rows || !Array.isArray(formData.ir.rows)) {
      return "";
    }

    return formData.ir.rows.map(row => `
      <tr>
        <td style="font-weight: 700;">${row.label || ""}</td>
        <td>${row.sec15 || ""}</td>
        <td>${row.sec60 || ""}</td>
        <td>${row.sec600 || ""}</td>
        <td>${row.ratio60_15 || ""}</td>
        <td>${row.ratio600_60 || ""}</td>
      </tr>
    `).join('');
  };

  return `
    <div class="form-container">
      <div class="company-header">
        <h2 style="text-align: center; font-weight: 800;">TAN DELTA AND CAPACITANCE MEASUREMENT OF WINDING</h2>
      </div>

      <!-- Header block -->
      <table class="form-table" style="margin-top: 10px;">
        <tbody>
          <tr>
            <td style="width: 45%;"><strong>METER USED</strong></td>
            <td style="width: 27%;"><strong>DATE:</strong></td>
            <td style="width: 28%;"><strong>TIME:</strong></td>
          </tr>
          <tr>
            <td>${formData.meterUsed || ""}</td>
            <td>${formData.date || ""}</td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td><strong>AMBIENT:</strong></td>
            <td></td>
          </tr>
          <tr>
            <td>${formData.modelAndSrNo || ""}</td>
            <td>${formData.ambient || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>OTI............................°C</strong></td>
            <td colspan="2"><strong>WTI............................°C</strong></td>
          </tr>
          <tr>
            <td>${formData.oti || ""}</td>
            <td colspan="2">${formData.wti || ""}</td>
          </tr>
        </tbody>
      </table>

      <!-- 05 KV TanDelta Table -->
      ${generateTanDeltaTable("AT 05 KV IN BETWEEN", "A", "kv5_rows")}

      <!-- 10 KV TanDelta Table -->
      ${generateTanDeltaTable("AT 10 KV IN BETWEEN", "mA", "kv10_rows")}

      <!-- IR VALUES section -->
      <div class="company-header" style="margin-top: 26px;">
        <h3 style="text-align: center; font-weight: 800; text-decoration: underline; text-underline-offset: 6px;">
          IR VALUES OF TRANSFORMER
        </h3>
      </div>

      <table class="form-table" style="margin-top: 10px;">
        <tbody>
          <tr>
            <td style="width: 25%;"><strong>Date:</strong></td>
            <td style="width: 25%;">${formData.ir?.date || ""}</td>
            <td style="width: 25%;"><strong>Time:</strong></td>
            <td style="width: 25%;">${formData.ir?.time || ""}</td>
          </tr>
          <tr>
            <td><strong>Amb. Temp:</strong></td>
            <td>${formData.ir?.ambTemp || ""}</td>
            <td><strong>Make:</strong></td>
            <td>${formData.ir?.make || ""}</td>
          </tr>
          <tr>
            <td><strong>Oil Temp.:</strong></td>
            <td>${formData.ir?.oilTemp || ""}</td>
            <td><strong>Sr. No.:</strong></td>
            <td>${formData.ir?.srNo || ""}</td>
          </tr>
          <tr>
            <td><strong>Wdg. Temp.:</strong></td>
            <td>${formData.ir?.wdgTemp || ""}</td>
            <td><strong>Range:</strong></td>
            <td>${formData.ir?.range || ""}</td>
          </tr>
          <tr>
            <td><strong>Relative Humidity:</strong></td>
            <td>${formData.ir?.relativeHumidity || ""}</td>
            <td><strong>Voltage Level:</strong></td>
            <td>${formData.ir?.voltageLevel || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 14px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th style="width: 20%;"></th>
            <th style="width: 14%;">15 Sec<br>(MΩ)</th>
            <th style="width: 14%;">60 Sec<br>(MΩ)</th>
            <th style="width: 14%;">600 Sec<br>(MΩ)</th>
            <th style="width: 19%;">Ratio of IR 60<br>IR 15</th>
            <th style="width: 19%;">Ratio of IR 600<br>IR 60</th>
          </tr>
        </thead>
        <tbody>
          ${generateIrRows()}
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

// Generate Stage 6 Form 1 - Work Completion Report (matching frontend UI exactly)
function generateStage6Form1(formData) {
  if (!formData) return "";

  return `
    <div class="form-container" style="background: white; padding: 40px; max-width: 800px; margin: 0 auto;">
      <!-- Header with logo and certifications -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 3px solid #C41E3A; padding-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <div>
            <div style="font-size: 1.5rem; font-weight: bold; color: #333;">VISHVAS POWER</div>
            <div style="font-size: 0.8rem; color: #666;">(A unit of M/s Vishvas Power Engineering Services Pvt Ltd)</div>
          </div>
        </div>

        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
            <!-- Stamp placeholder -->
          </div>
        </div>

        <div style="text-align: right;">
          <div style="background: #4CAF50; color: white; padding: 5px 10px; border-radius: 5px; margin-bottom: 5px; font-size: 0.8rem;">
            ISO CERTIFIED
          </div>
          <div style="font-size: 0.7rem; color: #333;">
            • 9001 Certified<br>
            • 14001 Certified<br>
            • 45001 Certified
          </div>
        </div>
      </div>

      <!-- Red banner -->
      <div style="background: linear-gradient(135deg, #C41E3A, #8B0000); color: white; padding: 10px 20px; margin-bottom: 30px; clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%);">
        <div style="font-size: 1.1rem; font-weight: 600;">Transformers upto 220 kV 250 MVA</div>
      </div>

      <!-- Title and Date -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 1.8rem; font-weight: bold; text-decoration: underline; margin: 0 0 10px 0;">
          Work completion report
        </h1>
        <div style="text-align: right; font-size: 1rem;">
          <strong>Date:-</strong> ${formData.completionDate || "___________"}
        </div>
      </div>

      <!-- Project Information -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 1.2rem; font-weight: bold; margin-bottom: 15px;">Project Information</h3>
        
        <div style="margin-bottom: 15px;">
          <strong>Customer Name:</strong> ${formData.customerName || "___________"}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong>Order Number:</strong> ${formData.orderNumber || "___________"}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong>Location:</strong> ${formData.location || "___________"} <strong style="margin-left: 20px;">TSS</strong>
        </div>
      </div>

      <!-- Transformer Details -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 1.2rem; font-weight: bold; margin-bottom: 15px;">Transformer Details</h3>
        
        <div style="margin-bottom: 10px;">
          <strong>Type: – auto Transformer</strong>
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong>Capacity:</strong> ${formData.capacity || "___________"} <strong>MVA</strong>
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong>Voltage Rating:</strong> ${formData.voltageRating || "___________"} <strong>kV</strong>
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong>Make:</strong> ${formData.make || "___________"}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong>Serial Number:</strong> ${formData.serialNumber || "___________"}
        </div>
      </div>

      <!-- Subject and Content -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 1.2rem; font-weight: bold; margin-bottom: 15px; text-decoration: underline;">
          Subject: <em>Completion of Transformer Erection, Testing and Commissioning Work</em>
        </h3>
        
        <p style="line-height: 1.6; margin-bottom: 15px;">
          This is to certify that the erection, Testing and commissioning of the above-mentioned transformer have been completed in accordance with the terms and conditions of the referenced order.
        </p>
        
        <p style="line-height: 1.6; margin-bottom: 15px;">
          The installation work has been jointly inspected and found satisfactory by the undersigned representatives. The transformer was successfully charged/commissioned on no-load at ${formData.chargingDate || "___________"} hrs on ${formData.commissioningDate || "___________"} (date).
        </p>
        
        <p style="line-height: 1.6; margin-bottom: 30px;">
          All works under the scope of the order have been completed, and no pending activities remain.
        </p>
      </div>

      <!-- Signatures -->
      <div style="display: flex; justify-content: space-between; margin-top: 50px;">
        <div style="width: 45%;">
          <h4 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 20px;">For VPES, Nagpur</h4>
          
          <div style="margin-bottom: 15px;">
            <strong>Name:</strong> ${formData.signatures?.vpesName || "___________"}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Designation:</strong> ${formData.signatures?.vpesDesignation || "___________"}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Signature:</strong>
            ${formData.signatures?.vpesSignature ? 
              `<div style="margin: 15px 0;">
                <img src="${formData.signatures.vpesSignature}" 
                     style="max-width: 100px; height: 40px; border: 2px solid #e2e8f0; border-radius: 8px;" />
              </div>` : 
              "<div style='border-bottom: 1px solid #333; width: 200px; margin: 15px 0;'></div>"
            }
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Date:</strong> ${formData.signatures?.vpesDate || "___________"}
          </div>
        </div>

        <div style="width: 45%;">
          <h4 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 20px;">For Customer</h4>
          
          <div style="margin-bottom: 15px;">
            <strong>Name:</strong> ${formData.signatures?.customerName || "___________"}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Designation:</strong> ${formData.signatures?.customerDesignation || "___________"}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Signature:</strong>
            ${formData.signatures?.customerSignature ? 
              `<div style="margin: 15px 0;">
                <img src="${formData.signatures.customerSignature}" 
                     style="max-width: 100px; height: 40px; border: 2px solid #e2e8f0; border-radius: 8px;" />
              </div>` : 
              "<div style='border-bottom: 1px solid #333; width: 200px; margin: 15px 0;'></div>"
            }
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Date:</strong> ${formData.signatures?.customerDate || "___________"}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ─── STAGE 0 — Unloading Checklist PDF Generators ────────────────────────────

function generateUnloadingCheckRow(label, rowData) {
  const d = rowData || {};
  return `
    <tr>
      <td style="border:1px solid #e5e7eb;padding:6px;font-weight:bold;">${label}</td>
      <td style="border:1px solid #e5e7eb;padding:6px;">${d.status || ""}</td>
      <td style="border:1px solid #e5e7eb;padding:6px;">${d.remarks || ""}</td>
      <td style="border:1px solid #e5e7eb;padding:6px;">${d.date || ""}</td>
      <td style="border:1px solid #e5e7eb;padding:6px;">${d.checkedBy || ""}</td>
    </tr>
  `;
}

function generateStage0Form1(formData) {
  if (!formData) return "";
  return `
    <div class="form-container">
      <div class="company-header"><h2>SITE CONDITION AT TIME OF UNLOADING</h2></div>
      <table class="form-table" style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tbody>
          <tr>
            <td style="border:1px solid #e5e7eb;padding:6px;font-weight:bold;">VPES Representative</td>
            <td style="border:1px solid #e5e7eb;padding:6px;">${formData.vpesRepresentative || ""}</td>
            <td style="border:1px solid #e5e7eb;padding:6px;font-weight:bold;">Date</td>
            <td style="border:1px solid #e5e7eb;padding:6px;">${formData.date || ""}</td>
          </tr>
          <tr>
            <td style="border:1px solid #e5e7eb;padding:6px;font-weight:bold;">Customer Representative</td>
            <td style="border:1px solid #e5e7eb;padding:6px;">${formData.customerRepresentative || ""}</td>
            <td style="border:1px solid #e5e7eb;padding:6px;font-weight:bold;">Contact No.</td>
            <td style="border:1px solid #e5e7eb;padding:6px;">${formData.contactNo || ""}</td>
          </tr>
        </tbody>
      </table>
      <h4 style="margin-bottom:8px;">Check Points</h4>
      <table class="form-table" style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Check Point</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Status</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Remarks</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Date</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Checked By</th>
          </tr>
        </thead>
        <tbody>
          ${generateUnloadingCheckRow("Route condition", formData.routeCondition)}
          ${generateUnloadingCheckRow("Site condition", formData.siteCondition)}
          ${generateUnloadingCheckRow("Approach road", formData.approachRoad)}
          ${generateUnloadingCheckRow("Boundary wall", formData.boundaryWall)}
          ${generateUnloadingCheckRow("Security guard", formData.securityGuard)}
        </tbody>
      </table>
      <div style="display:flex;gap:40px;margin-top:16px;">
        <div><strong>VPES Signature Date:</strong> ${formData.vpesSignatureDate || ""}</div>
        <div><strong>Customer Signature Date:</strong> ${formData.customerSignatureDate || ""}</div>
      </div>
      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

function generateStage0Form2(formData) {
  if (!formData) return "";
  const rows = [
    { label: "Entry to TSS/SP/SSP/SS", key: "entryToTSS" },
    { label: "Trailer Movement suitable or not", key: "trailerMovement" },
    { label: "Hydra/Boom Movement", key: "hydraBoomMovement" },
    { label: "Unloading Point", key: "unloadingPoint" },
    { label: "Date of Trailer Reached", key: "dateOfTrailerReached" },
    { label: "Date of Unloading", key: "dateOfUnloading" },
    { label: "Aesthetic / Any Remarks", key: "aestheticRemarks" },
    { label: "Wheel Locking", key: "wheelLocking" },
    { label: "All Seal Checks", key: "allSealChecks" },
    { label: "After unloading photos", key: "afterUnloadingPhotos" },
    { label: "TOG Level Check as per dispatch", key: "togLevelCheck" },
    { label: "After All check TRS Covering photo", key: "trsCoveringPhoto" },
    { label: "Sign and Stamp Copy of all documents as per dispatch", key: "signAndStampCopy" },
  ];
  return `
    <div class="form-container">
      <div class="company-header"><h2>MAIN TANK CHECKLIST</h2></div>
      <table class="form-table" style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Checklist Item</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Status</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Remarks</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Date</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Checked By</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => generateUnloadingCheckRow(r.label, formData[r.key])).join("")}
        </tbody>
      </table>
      <div style="display:flex;gap:40px;margin-top:16px;">
        <div><strong>VPES Signature Date:</strong> ${formData.vpesSignatureDate || ""}</div>
        <div><strong>Representative Signature Date:</strong> ${formData.representativeSignatureDate || ""}</div>
      </div>
      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

function generateStage0Form3(formData) {
  if (!formData) return "";
  const inventory = Array.isArray(formData.accessoriesInventory) ? formData.accessoriesInventory : [];
  return `
    <div class="form-container">
      <div class="company-header"><h2>PROTOCOL FOR ACCESSORIES CHECKING</h2></div>
      <table class="form-table" style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Checklist Item</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Status</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Remarks</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Date</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Checked By</th>
          </tr>
        </thead>
        <tbody>
          ${generateUnloadingCheckRow("Accessories unloading point", formData.accessoriesUnloadingPoint)}
          ${generateUnloadingCheckRow("Date of Unloading", formData.dateOfUnloading)}
          ${generateUnloadingCheckRow("Storage Photos", formData.storagePhotos)}
        </tbody>
      </table>
      <h4 style="margin-bottom:8px;">Accessories Inventory</h4>
      <table class="form-table" style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">No</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Packing Case No.</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Material Description</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Qty as per Challan</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Qty as Received</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Date</th>
            <th style="border:1px solid #e5e7eb;padding:6px;background:#f3f4f6;">Checked By</th>
          </tr>
        </thead>
        <tbody>
          ${inventory.map((row, i) => `
            <tr>
              <td style="border:1px solid #e5e7eb;padding:6px;text-align:center;">${i + 1}</td>
              <td style="border:1px solid #e5e7eb;padding:6px;">${row.packingCaseNumber || ""}</td>
              <td style="border:1px solid #e5e7eb;padding:6px;font-weight:bold;">${row.materialDescription || ""}</td>
              <td style="border:1px solid #e5e7eb;padding:6px;">${row.qtyAsPerChallan || ""}</td>
              <td style="border:1px solid #e5e7eb;padding:6px;">${row.qtyAsReceived || ""}</td>
              <td style="border:1px solid #e5e7eb;padding:6px;">${row.date || ""}</td>
              <td style="border:1px solid #e5e7eb;padding:6px;">${row.checkedBy || ""}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      ${formData.remark ? `<div style="margin-bottom:16px;"><strong>Remark:</strong> ${formData.remark}</div>` : ""}
      <div style="display:flex;gap:40px;margin-top:16px;">
        <div><strong>VPES Signature Date:</strong> ${formData.vpesSignatureDate || ""}</div>
        <div><strong>Customer Signature Date:</strong> ${formData.customerSignatureDate || ""}</div>
      </div>
      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────

// Generate forms for a stage dynamically
function generateStageContent(stageData, stageNumber, headerImage) {
  if (!stageData) return "";

  let content = "";

  Object.entries(stageData).forEach(([formKey, formData]) => {
    if (formData && typeof formData === "object") {
      // Add header image and page break for each form
      content += `
        <div class="content-page">
          ${headerImage ? `
          <div class="page-header">
            <img src="${headerImage}" alt="Header" />
            <div style="text-align:center;font-size:0.85rem;font-weight:bold;color:#333;margin-top:4px;letter-spacing:0.5px;">
              Vishvas Power Engineering Services (P) Ltd., Nagpur.
            </div>
          </div>
          ` : ''}
          
          <h2 style="text-align: center; color: #2d3748; margin: 20px 0;">Stage ${stageNumber === 0 ? "0 - Unloading Checklist" : stageNumber + " - " + formatLabel(formKey)}</h2>
      `;

      // Stage 0 Forms (Unloading Checklist)
      if (stageNumber === 0 && formKey === "form1") {
        content += generateStage0Form1(formData);
      }
      else if (stageNumber === 0 && formKey === "form2") {
        content += generateStage0Form2(formData);
      }
      else if (stageNumber === 0 && formKey === "form3") {
        content += generateStage0Form3(formData);
      }
      // Stage 1 Forms
      else if (stageNumber === 1 && formKey === "form1") {
        content += generateStage1Form1(formData);
      } 
      else if (stageNumber === 1 && formKey === "form2") {
        content += generateStage1Form2(formData);
      }
      else if (stageNumber === 1 && formKey === "form3") {
        content += generateStage1Form3(formData);
      }
      else if (stageNumber === 1 && formKey === "form4") {
        content += generateStage1Form4(formData);
      }
      else if (stageNumber === 1 && formKey === "form5") {
        content += generateStage1Form5(formData);
      }
      else if (stageNumber === 1 && formKey === "form6") {
        content += generateStage1Form6(formData);
      }
      else if (stageNumber === 1 && formKey === "form7") {
        content += generateStage1Form7(formData);
      }
      // Stage 2 Forms
      else if (stageNumber === 2 && formKey === "form1") {
        content += generateStage2Form1(formData);
      }
      else if (stageNumber === 2 && formKey === "form2") {
        content += generateStage2Form2(formData);
      }
      // Stage 3 Forms
      else if (stageNumber === 3 && formKey === "form1") {
        content += generateStage3Form1(formData);
      }
      else if (stageNumber === 4 && formKey === "form1") {
        content += generateStage4Form1(formData);
      }
      else if (stageNumber === 4 && formKey === "form2") {
        content += generateStage4Form2(formData);
      }
      else if (stageNumber === 4 && formKey === "form3") {
        content += generateStage4Form3(formData);
      }
      else if (stageNumber === 4 && formKey === "form4") {
        content += generateStage4Form4(formData);
      }
      // Stage 5 Forms
      else if (stageNumber === 5 && formKey === "form1") {
        content += generateStage5Form1(formData);
      }
      else if (stageNumber === 5 && formKey === "form2") {
        content += generateStage5Form2(formData);
      }
      else if (stageNumber === 5 && formKey === "form3") {
        content += generateStage5Form3(formData);
      }
      else if (stageNumber === 5 && formKey === "form4") {
        content += generateStage5Form4(formData);
      }
      else if (stageNumber === 5 && formKey === "form5") {
        content += generateStage5Form5(formData);
      }
      else if (stageNumber === 5 && formKey === "form6") {
        content += generateStage5Form6(formData);
      }
      else if (stageNumber === 5 && formKey === "form7") {
        content += generateStage5Form7(formData);
      }
      else if (stageNumber === 5 && formKey === "form8") {
        content += generateStage5Form8(formData);
      }
      // Stage 6 Forms - Skip form1 as it's handled in the last page overlay
      else if (stageNumber === 6 && formKey === "form1") {
        // Skip - Stage 6 Form 1 is handled as overlay on the last page
      }
      else {
        // Generic form rendering
        content += `
          <div class="form-container">
            <div class="company-header">
              <h2>${formatLabel(formKey)}</h2>
            </div>
            ${generateDataTable(formData)}
            ${generatePhotoThumbnails(formData.photos)}
            ${generateSignatureSection(formData.signatures)}
          </div>
        `;
      }

      content += `</div>`; // Close content-page div
    }
  });

  return content;
}

// Stage 0 only HTML template generator (for Unloading Checklist download)
export function generateStage0HTMLTemplate(stage0Data, projectName, companyName) {
  const cssPath = path.join(__dirname, "../public/form-styles.css");
  let cssContent = "";
  try {
    if (fs.existsSync(cssPath)) cssContent = fs.readFileSync(cssPath, "utf8");
  } catch (e) {}

  const getImageAsBase64 = (imagePath) => {
    try {
      const fullPath = path.join(__dirname, "../src", imagePath);
      if (fs.existsSync(fullPath)) {
        const buf = fs.readFileSync(fullPath);
        const mime = imagePath.toLowerCase().endsWith('.jpg') || imagePath.toLowerCase().endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
        return `data:${mime};base64,${buf.toString('base64')}`;
      }
    } catch (e) {}
    return null;
  };

  const headerImage = getImageAsBase64('Header.jpg');
  const form1 = stage0Data?.form1 ? generateStage0Form1(stage0Data.form1) : "";
  const form2 = stage0Data?.form2 ? generateStage0Form2(stage0Data.form2) : "";
  const form3 = stage0Data?.form3 ? generateStage0Form3(stage0Data.form3) : "";

  const headerHtml = headerImage ? `
    <div class="page-header">
      <img src="${headerImage}" alt="Header" />
      <div style="text-align:center;font-size:0.85rem;font-weight:bold;color:#333;margin-top:4px;letter-spacing:0.5px;">
        Vishvas Power Engineering Services (P) Ltd., Nagpur.
      </div>
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${projectName} - Unloading Checklist</title>
  <style>
    ${cssContent}
    body { background: white !important; padding: 0; margin: 0; }
    .form-container { background: white !important; box-shadow: none !important; margin-bottom: 40px; }
    .page-header { width: 100%; margin-bottom: 20px; }
    .page-header img { width: 100%; height: auto; max-height: 120px; object-fit: contain; }
    .content-page { padding: 20px; page-break-before: always; }
    .content-page:first-child { page-break-before: auto; }
    @media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
  </style>
</head>
<body>
  <div class="content-page">
    ${headerHtml}
    <h2 style="text-align:center;color:#1e3a8a;margin:20px 0;">Unloading Checklist — Stage 0</h2>
    <h3 style="text-align:center;color:#374151;margin-bottom:20px;">${projectName} — ${companyName}</h3>
    ${form1}
  </div>
  <div class="content-page">${headerHtml}${form2}</div>
  <div class="content-page">${headerHtml}${form3}</div>
</body>
</html>`;
}

// Main HTML template generator
export function generateHTMLTemplate(data, projectName, companyName) {
  // Read CSS file
  const cssPath = path.join(__dirname, "../public/form-styles.css");
  let cssContent = "";
  
  try {
    if (fs.existsSync(cssPath)) {
      cssContent = fs.readFileSync(cssPath, "utf8");
    }
  } catch (error) {
    console.error("Error reading CSS file:", error);
  }

  // Convert images to base64 for embedding
  const getImageAsBase64 = (imagePath) => {
    try {
      const fullPath = path.join(__dirname, "../src", imagePath);
      if (fs.existsSync(fullPath)) {
        const imageBuffer = fs.readFileSync(fullPath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = imagePath.toLowerCase().endsWith('.jpg') || imagePath.toLowerCase().endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
        return `data:${mimeType};base64,${base64Image}`;
      }
    } catch (error) {
      console.error(`Error reading image ${imagePath}:`, error);
    }
    return null;
  };

  const firstPageImage = getImageAsBase64('FirstPage.jpg');
  const lastPageImage = getImageAsBase64('LastPage.jpg');
  const headerImage = getImageAsBase64('Header.jpg');

  // Generate content for all stages (including stage 0 - Unloading Checklist)
  let stagesContent = "";
  if (data.TractionData) {
    for (let i = 0; i <= 7; i++) {
      const stageKey = `stage${i}`;
      if (data.TractionData[stageKey]) {
        stagesContent += generateStageContent(data.TractionData[stageKey], i, headerImage);
      }
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${projectName} - Complete Report</title>
      <style>
        ${cssContent}
        
        /* PDF-specific styles */
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .page-break {
            page-break-after: always;
          }
          
          .form-actions,
          .back-btn,
          input[type="file"],
          .clear-signature-btn,
          .upload-options,
          .camera-btn,
          .gallery-btn,
          .bulk-btn {
            display: none !important;
          }
          
          .form-table {
            page-break-inside: avoid;
          }
          
          .signature-section {
            page-break-inside: avoid;
          }
          
          .photo-upload-section {
            page-break-inside: avoid;
          }
        }
        
        body {
          background: white !important;
          padding: 0;
          margin: 0;
        }
        
        .form-stage-container {
          background: white !important;
          padding: 0;
        }
        
        .form-container {
          background: white !important;
          box-shadow: none !important;
          margin-bottom: 40px;
        }

        /* First page styles */
        .first-page {
          width: 100vw;
          height: 100vh;
          page-break-after: always;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .first-page img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Last page styles */
        .last-page {
          width: 100vw;
          height: 100vh;
          page-break-before: always;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .last-page img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Header styles for content pages */
        .page-header {
          width: 100%;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }

        .page-header img {
          width: 100%;
          height: auto;
          max-height: 120px;
          object-fit: contain;
        }

        /* Content pages with header */
        .content-page {
          padding: 20px;
          page-break-before: always;
        }

        .content-page:first-child {
          page-break-before: auto;
        }
      </style>
    </head>
    <body>
      <div class="form-stage-container">
        <!-- First Page -->
        ${firstPageImage ? `
        <div class="first-page">
          <img src="${firstPageImage}" alt="First Page" />
        </div>
        ` : ''}

        <!-- Content Pages with Header -->
        <div class="content-page">
          ${headerImage ? `
          <div class="page-header">
            <img src="${headerImage}" alt="Header" />
          </div>
          ` : ''}
          
          <!-- Cover Page Content -->
          <div style="text-align: center; padding: 100px 20px;">
            <h1 style="font-size: 3rem; color: #2d3748; margin-bottom: 30px;">
              Transformer Installation Report
            </h1>
            <h2 style="font-size: 2rem; color: #4a5568; margin-bottom: 20px;">
              ${projectName}
            </h2>
            <h3 style="font-size: 1.5rem; color: #718096;">
              ${companyName}
            </h3>
            <p style="margin-top: 50px; font-size: 1.2rem; color: #a0aec0;">
              Generated on: ${new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <!-- All Stages Content -->
        ${stagesContent}

        <!-- Last Page -->
        ${lastPageImage ? `
        <div class="last-page" style="position: relative;">
          <img src="${lastPageImage}" alt="Last Page" style="width: 100%; height: 100%; object-fit: cover;" />
          ${data.TractionData && data.TractionData.stage6 && data.TractionData.stage6.form1 ?
            (() => {
              const stage6Data = data.TractionData.stage6.form1;
              return `
                <!-- Overlay Stage 6 Form 1 data on LastPage.jpg -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; font-family: Helvetica, Arial, sans-serif; font-size: 10px; color: #000000;">
                  ${stage6Data.customerName ? `<div style="position: absolute; left: 128px; top: 315px; width: 200px;">${stage6Data.customerName}</div>` : ''}
                  ${stage6Data.orderNumber ? `<div style="position: absolute; left: 122px; top: 333px; width: 300px;">${stage6Data.orderNumber}</div>` : ''}
                  ${stage6Data.location ? `<div style="position: absolute; left: 80px; top: 351px; width: 150px;">${stage6Data.location}</div>` : ''}
                  ${stage6Data.type ? `<div style="position: absolute; left: 65px; top: 425px; width: 100px;">${stage6Data.type}</div>` : ''}
                  ${stage6Data.capacity ? `<div style="position: absolute; left: 90px; top: 440px; width: 100px;">${stage6Data.capacity}</div>` : ''}
                  ${stage6Data.voltageRating ? `<div style="position: absolute; left: 125px; top: 457px; width: 200px;">${stage6Data.voltageRating}</div>` : ''}
                  ${stage6Data.make ? `<div style="position: absolute; left: 73px; top: 477px; width: 150px;">${stage6Data.make}</div>` : ''}
                  ${stage6Data.serialNumber ? `<div style="position: absolute; left: 120px; top: 495px; width: 200px;">${stage6Data.serialNumber}</div>` : ''}
                  ${stage6Data.completionDate ? `<div style="position: absolute; left: 560px; top: 258px; width: 150px;">${stage6Data.completionDate}</div>` : ''}
                  ${stage6Data.chargingDate ? `<div style="position: absolute; left: 435px; top: 620px; width: 150px;">${stage6Data.chargingDate}</div>` : ''}
                  ${stage6Data.commissioningDate ? `<div style="position: absolute; left: 535px; top: 620px; width: 150px;">${stage6Data.commissioningDate}</div>` : ''}
                  
                  ${stage6Data.signatures ? (() => {
                    const signatures = stage6Data.signatures;
                    return `
                      ${signatures.vpesName ? `<div style="position: absolute; left: 70px; top: 730px; width: 150px;">${signatures.vpesName}</div>` : ''}
                      ${signatures.vpesDesignation ? `<div style="position: absolute; left: 103px; top: 750px; width: 150px;">${signatures.vpesDesignation}</div>` : ''}
                      ${signatures.vpesSignature && signatures.vpesSignature.startsWith('data:image/') ? 
                        `<img src="${signatures.vpesSignature}" style="position: absolute; left: 85px; top: 765px; width: 60px; height: 15px;" />` : ''}
                      ${signatures.vpesDate ? `<div style="position: absolute; left: 73px; top: 785px; width: 150px;">${signatures.vpesDate}</div>` : ''}
                      ${signatures.customerName ? `<div style="position: absolute; left: 465px; top: 730px; width: 150px;">${signatures.customerName}</div>` : ''}
                      ${signatures.customerDesignation ? `<div style="position: absolute; left: 505px; top: 750px; width: 150px;">${signatures.customerDesignation}</div>` : ''}
                      ${signatures.customerDate ? `<div style="position: absolute; left: 460px; top: 785px; width: 150px;">${signatures.customerDate}</div>` : ''}
                      ${signatures.customerSignature && signatures.customerSignature.startsWith('data:image/') ? 
                        `<img src="${signatures.customerSignature}" style="position: absolute; left: 485px; top: 762px; width: 60px; height: 15px;" />` : ''}
                    `;
                  })() : ''}
                </div>
              `;
            })() : ''
          }
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}
