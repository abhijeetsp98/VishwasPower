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
 * Stage1Form1 (VConnect) - Name Plate Details Transformer / Reactor
 * Kept in sync with UI component `Stage1Form1` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage1Form1(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>NAME PLATE DETAILS TRANSFORMER /REACTOR</h2>
      </div>

      <table class="form-table" style="table-layout: fixed; width: 100%;">
       <tbody>
          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>MAKE</strong></td>
            <td style="width: 30%;">${formData.make || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>CURRENT HV</strong></td>
            <td style="width: 30%;">${formData.currentHV || ""}</td>
          </tr>

          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>SR. NO.</strong></td>
            <td style="width: 30%;">${formData.srNo || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>LV</strong></td>
            <td style="width: 30%;">${formData.currentLV || ""}</td>
          </tr>

          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>MVA Rating</strong></td>
            <td style="width: 30%;">${formData.mvaRating || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>Temp. Rise over amb. Oil (°C)</strong></td>
            <td style="width: 30%;">${formData.tempRiseOilC || ""}</td>
          </tr>

          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>HV (KV)</strong></td>
            <td style="width: 30%;">${formData.hvKv || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>Winding (°C)</strong></td>
            <td style="width: 30%;">${formData.windingC || ""}</td>
          </tr>

          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>LV (KV)</strong></td>
            <td style="width: 30%;">${formData.lvKv || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>Oil Quantity</strong></td>
            <td style="width: 30%;">${formData.oilQuantity || ""}</td>
          </tr>

          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>% Impedance</strong></td>
            <td style="width: 30%;">${formData.impedancePercent || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>Weight of Core & Wdg.</strong></td>
            <td style="width: 30%;">${formData.weightCoreWdg || ""}</td>
          </tr>

          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>Year of Mfg.</strong></td>
            <td style="width: 30%;">${formData.yearOfMfg || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>TRANSPORTING WEIGHT</strong></td>
            <td style="width: 30%;">${formData.transportingWeight || ""}</td>
          </tr>

          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>NO. OF COOLING FAN</strong></td>
            <td style="width: 30%;">${formData.noOfCoolingFan || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>Total Weight</strong></td>
            <td style="width: 30%;">${formData.totalWeight || ""}</td>
          </tr>

          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>NO OF OIL PUMP</strong></td>
            <td style="width: 30%;">${formData.noOfOilPump || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>NO. OF RADIATORS</strong></td>
            <td style="width: 30%;">${formData.noOfRadiators || ""}</td>
          </tr>

          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>NO. OF TAPS</strong></td>
            <td style="width: 30%;">${formData.noOfTaps || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>MFG. OF OCTC</strong></td>
            <td style="width: 30%;">${formData.mfgOfOctc || ""}</td>
          </tr>

          <tr>
            <td style="width: 20%; font-weight: 800;"><strong>TYPE OF OCTC</strong></td>
            <td style="width: 30%;">${formData.typeOfOctc || ""}</td>
            <td style="width: 20%; font-weight: 800;"><strong>SR. NO. OCTC</strong></td>
            <td style="width: 30%;">${formData.srNoOctc || ""}</td>
          </tr>
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          Transformer, Oil Level gauge, Wheel Locking, Transformer Foundation Level condition.
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage1Form2 (VConnect) - Accessories Checking
 * Kept in sync with UI component `Stage1Form2` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage1Form2(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const defaultRows = [
    { materialDescription: "HV bushing" },
    { materialDescription: "LV Bushing" },
    { materialDescription: "Radiators" },
    { materialDescription: "Buchholz" },
    { materialDescription: "PRV" },
    { materialDescription: "CPR" },
    { materialDescription: "Breather" },
    { materialDescription: "Bushing Connector" },
    { materialDescription: "Oil pump" },
    { materialDescription: "RFBD" },
    { materialDescription: "FAN" },
    { materialDescription: "turrets" },
    { materialDescription: "Valves" },
  ];

  const rows = Array.isArray(formData?.accessoriesRows) ? formData.accessoriesRows : [];

  const bodyRows = defaultRows
    .map((r, idx) => {
      const row = rows[idx] || {};
      return `
        <tr>
          <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
          <td>${row.packingCaseNumber || ""}</td>
          <td style="font-weight: 700; padding: 10px 12px;">${r.materialDescription}</td>
          <td>${row.qtyAsPerPL || ""}</td>
          <td>${row.qtyReceived || ""}</td>
          <td>${row.shortQty || ""}</td>
          <td>${row.damagedQty || ""}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>ACCESSORIES CHECKING</h2>
      </div>

      <table class="form-table" style="table-layout: fixed;">
        <thead>
          <tr>
            <th style="width: 6%;">No</th>
            <th style="width: 19%;">Packing case Number</th>
            <th style="width: 20%;">Material Description</th>
            <th style="width: 13%;">Qty as per P. L</th>
            <th style="width: 13%;">Qty. Received</th>
            <th style="width: 13%;">Short Qty</th>
            <th style="width: 16%;">Damaged Qty.</th>
          </tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">Accessories</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage1Form3 (VConnect) - Core Insulation + Equipment + Safety
 * Kept in sync with UI component `Stage1Form3` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage1Form3(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const defaultEquipmentItems = [
    { srNo: 2, description: "Whether the Filter Machine is Available", ratingHint: "(Yes/No)" },
    { srNo: 3, description: "Capacity of Filter Machine", ratingHint: "" },
    { srNo: 4, description: "Capacity of the Vacuum Pump to be used.", ratingHint: "" },
    { srNo: 5, description: "Whether the Reservoir is Available with valves and a breather.", ratingHint: "" },
    { srNo: 6, description: "Capacity of Reservoirs.", ratingHint: "" },
    { srNo: 8, description: "Hose Pipes for the Filtration Process.", ratingHint: "(Yes/No)" },
    { srNo: 9, description: "Whether Crane is Available in good condition", ratingHint: "" },
    { srNo: 10, description: "Dry air", ratingHint: "(Yes/No)" },
    { srNo: 11, description: "Dew point meter", ratingHint: "(Yes/No)" },
    { srNo: 12, description: "Mec Leod gauge", ratingHint: "(Yes/No)" },
  ];

  const defaultSafetyItems = [
    { description: "Fire extinguisher/ Fire sand bucket" },
    { description: "First aid kit" },
    { description: "PPE for the working team of ETC agency, like- Safety shoes, Helmet, etc..." },
  ];

  const equipmentRows = Array.isArray(formData?.equipment) ? formData.equipment : [];
  const safetyRows = Array.isArray(formData?.safety) ? formData.safety : [];

  const equipmentTableRows = defaultEquipmentItems
    .map((it, idx) => {
      const row = equipmentRows[idx] || {};
      return `
        <tr>
          <td style="text-align: center; font-weight: 800;">${it.srNo}.</td>
          <td style="font-weight: 800; padding: 10px 12px;">${it.description}</td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${it.ratingHint ? `<div style="font-weight: 700; color: #111;">${it.ratingHint}</div>` : ""}
              <div>${row.ratingCapacity || ""}</div>
            </div>
          </td>
          <td>${row.checkedBy || ""}</td>
        </tr>
      `;
    })
    .join("");

  const safetyTableRows = defaultSafetyItems
    .map((it, idx) => {
      const row = safetyRows[idx] || {};
      return `
        <tr>
          <td style="font-weight: 800; padding: 10px 12px;">${it.description}</td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="font-weight: 700;">(Yes/No)</div>
              <div>${row.confirmation || ""}</div>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="form-container">
      <div style="margin-top: 10px; text-align: center; font-weight: 900; font-size: 18px;">
        CORE INSULATION CHECK:&nbsp;&nbsp; At 1 KV > 500 MΩ
      </div>

      <table class="form-table" style="margin-top: 12px; table-layout: fixed;">
        <thead>
          <tr>
            <th style="width: 38%;"></th>
            <th style="width: 31%;">Obtained Value (MΩ)</th>
            <th style="width: 31%;">Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: 800;">Between Core – frame</td>
            <td>${formData?.coreInsulation?.coreToFrame?.obtainedValue || ""}</td>
            <td>${formData?.coreInsulation?.coreToFrame?.remarks || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Between Frame – tank</td>
            <td>${formData?.coreInsulation?.frameToTank?.obtainedValue || ""}</td>
            <td>${formData?.coreInsulation?.frameToTank?.remarks || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Between core – tank</td>
            <td>${formData?.coreInsulation?.coreToTank?.obtainedValue || ""}</td>
            <td>${formData?.coreInsulation?.coreToTank?.remarks || ""}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 28px; text-align: center; font-weight: 900; font-size: 16px;">
        CHECKLIST FOR CONFORMING AVAILABILITY OF EQUIPMENT AT SITE
      </div>

      <table class="form-table" style="margin-top: 12px; table-layout: fixed;">
        <thead>
          <tr>
            <th style="width: 7%;"></th>
            <th style="width: 48%;">Description</th>
            <th style="width: 25%;">Rating/capacity</th>
            <th style="width: 20%;">Checked by</th>
          </tr>
        </thead>
        <tbody>
          ${equipmentTableRows}
        </tbody>
      </table>

      <div style="margin-top: 18px; text-align: center; font-weight: 900;">SAFETY EQUIPMENT</div>

      <table class="form-table" style="margin-top: 10px; table-layout: fixed;">
        <thead>
          <tr>
            <th style="width: 70%;">Descriptions</th>
            <th style="width: 30%;">Confirmation</th>
          </tr>
        </thead>
        <tbody>
          ${safetyTableRows}
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          Note: - Photographs to be added of Above-mentioned point. Dry Air Arrangement, dew point meter, Mec Leod gauge
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage1Form4 (VConnect) - Pre erection Ratio test of turret CTs
 * Kept in sync with UI component `Stage1Form4` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage1Form4(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";
  const currentPercentRows = [20, 40, 60, 80, 100];
  const kneePercentRows = [20, 40, 60, 80, 100, 110];

  const renderPhaseBlock = (title, phaseKey) => {
    const ctRows = currentPercentRows
      .map(
        (p) => `
          <tr>
            <td style="font-weight: 700; text-align: center;">${p}%</td>
            <td>${formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.appliedPrimaryCurrentA || ""}</td>
            <td>${formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.measuredSecondaryCurrentA || ""}</td>
          </tr>
        `
      )
      .join("");

    const kneeRows = kneePercentRows
      .map(
        (p) => `
          <tr>
            <td style="font-weight: 700; text-align: center;">${p}%</td>
            <td>${formData?.[phaseKey]?.kneePointVoltage?.[p]?.appliedVoltage || ""}</td>
            <td>${formData?.[phaseKey]?.kneePointVoltage?.[p]?.measuredCurrentA || ""}</td>
          </tr>
        `
      )
      .join("");

    return `
      <div style="margin-top: 26px;">
        <table class="form-table">
          <thead>
            <tr>
              <th style="width: 40%; text-align: left;">CT Ratio CORE – S1-S2</th>
              <th style="width: 60%; text-align: center; font-size: 18px; font-weight: 900;">${title}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="2" style="padding: 0;">
                <table class="form-table" style="margin-top: 0; border: none;">
                  <thead>
                    <tr>
                      <th style="width: 20%;">Current %</th>
                      <th style="width: 40%;">Applied primary Current (A)</th>
                      <th style="width: 40%;">Measured secondary current (A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ctRows}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="font-weight: 900; font-size: 18px; margin-top: 10px; margin-bottom: 6px;">Knee point Voltage</div>

        <table class="form-table">
          <thead>
            <tr>
              <th style="width: 30%;">Voltage %</th>
              <th style="width: 35%;">Applied voltage</th>
              <th style="width: 35%;">Measured current (mA)</th>
            </tr>
          </thead>
          <tbody>
            ${kneeRows}
          </tbody>
        </table>
      </div>
    `;
  };

  return `
    <div class="form-container">
      <div class="company-header">
        <h2 style="font-weight: 900;">Pre erection Ratio test of turret CTs</h2>
      </div>

      ${renderPhaseBlock("Phase 1.1", "phase11")}
      ${renderPhaseBlock("Phase 1.2", "phase12")}

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">CT Ratio kit calibration</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage1Form5 (VConnect) - Pre erection Ratio test of turret CTs (Phase 2.1 & 2.2)
 * Kept in sync with UI component `Stage1Form5` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage1Form5(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";
  const currentPercentRows = [20, 40, 60, 80, 100];
  const kneePercentRows = [20, 40, 60, 80, 100, 110];

  const renderPhaseBlock = (title, phaseKey) => {
    const ctRows = currentPercentRows
      .map(
        (p) => `
          <tr>
            <td style="font-weight: 700; text-align: center;">${p}%</td>
            <td>${formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.appliedPrimaryCurrentA || ""}</td>
            <td>${formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.measuredSecondaryCurrentA || ""}</td>
          </tr>
        `
      )
      .join("");

    const kneeRows = kneePercentRows
      .map(
        (p) => `
          <tr>
            <td style="font-weight: 700; text-align: center;">${p}%</td>
            <td>${formData?.[phaseKey]?.kneePointVoltage?.[p]?.appliedVoltage || ""}</td>
            <td>${formData?.[phaseKey]?.kneePointVoltage?.[p]?.measuredCurrentA || ""}</td>
          </tr>
        `
      )
      .join("");

    return `
      <div style="margin-top: 26px;">
        <table class="form-table">
          <thead>
            <tr>
              <th style="width: 40%; text-align: left;">CT Ratio CORE – S1-S2</th>
              <th style="width: 60%; text-align: center; font-size: 18px; font-weight: 900;">${title}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="2" style="padding: 0;">
                <table class="form-table" style="margin-top: 0; border: none;">
                  <thead>
                    <tr>
                      <th style="width: 20%;">Current %</th>
                      <th style="width: 40%;">Applied primary Current (A)</th>
                      <th style="width: 40%;">Measured secondary current (A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ctRows}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="font-weight: 900; font-size: 18px; margin-top: 10px; margin-bottom: 6px;">Knee point Voltage</div>

        <table class="form-table">
          <thead>
            <tr>
              <th style="width: 30%;">Voltage %</th>
              <th style="width: 35%;">Applied voltage</th>
              <th style="width: 35%;">Measured current (mA)</th>
            </tr>
          </thead>
          <tbody>
            ${kneeRows}
          </tbody>
        </table>
      </div>
    `;
  };

  return `
    <div class="form-container">
      <div class="company-header">
        <h2 style="font-weight: 900;">Pre erection Ratio test of turret CTs</h2>
      </div>

      ${renderPhaseBlock("Phase 2.1", "phase21")}
      ${renderPhaseBlock("Phase 2.2", "phase22")}

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">CT Ratio kit calibration</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage1Form6 (VConnect) - Pre erection Ratio test of turret CTs (Phase 3.1, 3.2, WTI)
 * Kept in sync with UI component `Stage1Form6` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage1Form6(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";
  const currentPercentRows = [20, 40, 60, 80, 100];
  const kneePercentRows = [20, 40, 60, 80, 100, 110];

  const renderPhaseBlock = (title, phaseKey) => {
    const ctRows = currentPercentRows
      .map(
        (p) => `
          <tr>
            <td style="font-weight: 700; text-align: center;">${p}%</td>
            <td>${formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.appliedPrimaryCurrentA || ""}</td>
            <td>${formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.measuredSecondaryCurrentA || ""}</td>
          </tr>
        `
      )
      .join("");

    const kneeRows = kneePercentRows
      .map(
        (p) => `
          <tr>
            <td style="font-weight: 700; text-align: center;">${p}%</td>
            <td>${formData?.[phaseKey]?.kneePointVoltage?.[p]?.appliedVoltage || ""}</td>
            <td>${formData?.[phaseKey]?.kneePointVoltage?.[p]?.measuredCurrentA || ""}</td>
          </tr>
        `
      )
      .join("");

    return `
      <div style="margin-top: 18px;">
        <h3 style="text-align: center; margin-bottom: 8px; font-weight: 800;">${title}</h3>

        <div style="font-weight: 800; margin-top: 10px; margin-bottom: 6px;">Ratio test</div>

        <table class="form-table" style="margin-top: 8px;">
          <thead>
            <tr>
              <th colspan="3" style="text-align: left;">
                <span style="font-weight: 800;">CT Ratio CORE – S1-S2</span>
              </th>
            </tr>
            <tr>
              <th style="width: 20%;">Current %</th>
              <th style="width: 40%;">Applied primary Current (A)</th>
              <th style="width: 40%;">Measured secondary current (A)</th>
            </tr>
          </thead>
          <tbody>
            ${ctRows}
          </tbody>
        </table>

        <div style="font-weight: 900; font-size: 18px; margin-top: 10px; margin-bottom: 6px;">Knee point Voltage</div>

        <table class="form-table">
          <thead>
            <tr>
              <th style="width: 30%;">Voltage %</th>
              <th style="width: 35%;">Applied voltage</th>
              <th style="width: 35%;">Measured current (mA)</th>
            </tr>
          </thead>
          <tbody>
            ${kneeRows}
          </tbody>
        </table>
      </div>
    `;
  };

  const renderWTIBlock = () => {
    const rows = currentPercentRows
      .map(
        (p) => `
          <tr>
            <td style="font-weight: 700; text-align: center;">${p}%</td>
            <td>${formData?.wti?.[p]?.appliedPrimaryCurrentA || ""}</td>
            <td>${formData?.wti?.[p]?.measuredSecondaryCurrentS1S2A || ""}</td>
            <td>${formData?.wti?.[p]?.measuredSecondaryCurrentS1S3A || ""}</td>
            <td>${formData?.wti?.[p]?.measuredSecondaryCurrentS1S4A || ""}</td>
          </tr>
        `
      )
      .join("");

    return `
      <div style="margin-top: 18px;">
        <h3 style="text-align: center; margin-bottom: 8px; font-weight: 900;">WTI</h3>

        <table class="form-table" style="margin-top: 8px;">
          <thead>
            <tr>
              <th colspan="5" style="text-align: left;">
                <span style="font-weight: 800;">CT Ratio CORE - S1-S2, S1-S3, S1-S4</span>
              </th>
            </tr>
            <tr>
              <th style="width: 15%;">Current %</th>
              <th style="width: 30%;">Applied primary Current (A)</th>
              <th colspan="3" style="width: 55%;">Measured secondary current (A)</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th style="width: 18%;">S1-S2</th>
              <th style="width: 18%;">S1-S3</th>
              <th style="width: 19%;">S1-S4</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  };

  return `
    <div class="form-container">
      <div class="company-header">
        <h2 style="font-weight: 900;">Pre erection Ratio test of turret CTs</h2>
      </div>

      ${renderPhaseBlock("Phase 3.1", "phase31")}
      ${renderPhaseBlock("Phase 3.2", "phase32")}
      ${renderWTIBlock()}

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage1Form7 (VConnect) - TEST REPORT (Tan Delta & Capacitance Test on Bushing)
 * Kept in sync with UI component `Stage1Form7` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage1Form7(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const hvAt5kvRows = Array.isArray(formData.hvAt5kv) ? formData.hvAt5kv : [];
  const hvAt10kvRows = Array.isArray(formData.hvAt10kv) ? formData.hvAt10kv : [];
  const lvAt5kvRows = Array.isArray(formData.lvAt5kv) ? formData.lvAt5kv : [];
  const lvAt10kvRows = Array.isArray(formData.lvAt10kv) ? formData.lvAt10kv : [];

  const renderStatusRows = (rows) =>
    rows
      .map(
        (row) => `
          <tr>
            <td style="text-align: center; font-weight: 800;">${row.phase || ""}</td>
            <td>${row.tanDeltaPercent || ""}</td>
            <td>${row.capacitancePf || ""}</td>
            <td>${row.excitationCurrent || ""}</td>
            <td>${row.dielectricLoss || ""}</td>
          </tr>
        `
      )
      .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TEST REPORT</h2>
        <h3 style="margin-top: 6px; font-weight: 900;">TAN DELTA AND CAPACITANCE TEST ON BUSHING</h3>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 25%; font-weight: 800;">METER USED</td>
            <td style="width: 25%;">${formData.meterUsed || ""}</td>
            <td style="width: 25%; font-weight: 800;">DATE:</td>
            <td style="width: 25%;">${formData.date || ""}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">MODEL & S. NO.</td>
            <td>${formData.modelAndSerialNo || ""}</td>
            <td style="font-weight: 800;">TIME :</td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;"></td>
            <td></td>
            <td style="font-weight: 800;">WTI:</td>
            <td>${formData.wti || ""}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;"></td>
            <td></td>
            <td style="font-weight: 800;">OTI:</td>
            <td>${formData.oti || ""}</td>
          </tr>

          <tr>
            <td style="width: 25%; font-weight: 800;">BUSHING SR. NO. (HV)</td>
            <td style="width: 25%;">${formData.hvBushingSrNo || ""}</td>
            <td style="width: 25%; font-weight: 800;">MAKE</td>
            <td style="width: 25%;">${formData.hvBushingMake || ""}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">BUSHING SR. NO. (LV)</td>
            <td>${formData.lvBushingSrNo || ""}</td>
            <td></td>
            <td>${formData.lvBushingMake || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 14px;">
        <thead>
          <tr>
            <th style="width: 34%; text-align: left;">BUSHING SR. NO.HV</th>
            <th style="width: 33%;">1.1</th>
            <th style="width: 33%;">1.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${formData.bushingSrNoHv || ""}</td>
            <td>${formData.bushingSrNoHv_11 || ""}</td>
            <td>${formData.bushingSrNoHv_12 || ""}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 12px; font-weight: 900;">STATUS:</div>

      <table class="form-table" style="margin-top: 10px;">
        <thead>
          <tr>
            <th style="width: 16%;">AT 05 KV PHASE</th>
            <th style="width: 21%;">TAN DELTA in %</th>
            <th style="width: 21%;">CAPACITANCE (pF)</th>
            <th style="width: 21%;">EXCITATION CURRENT (mA)</th>
            <th style="width: 21%;">DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          ${renderStatusRows(hvAt5kvRows)}
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 10px;">
        <thead>
          <tr>
            <th style="width: 16%;">AT 10 KV PHASE</th>
            <th style="width: 21%;">TAN DELTA in %</th>
            <th style="width: 21%;">CAPACITANCE (pF)</th>
            <th style="width: 21%;">EXCITATION CURRENT (mA)</th>
            <th style="width: 21%;">DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          ${renderStatusRows(hvAt10kvRows)}
        </tbody>
      </table>

      <div style="margin-top: 26px; text-align: center; font-weight: 900; font-size: 16px;">
        TYPE OF TEST – TAN DELTA AND CAPACITANCE TEST ON LV BUSHING
      </div>

      <table class="form-table" style="margin-top: 14px;">
        <thead>
          <tr>
            <th style="width: 34%; text-align: left;">BUSHING SR. NO.LV</th>
            <th style="width: 16.5%;">2.1</th>
            <th style="width: 16.5%;">2.2</th>
            <th style="width: 16.5%;">3.1</th>
            <th style="width: 16.5%;">3.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${formData.bushingSrNoLv || ""}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 12px; font-weight: 900;">STATUS:</div>

      <table class="form-table" style="margin-top: 10px;">
        <thead>
          <tr>
            <th style="width: 16%;">AT 05 KV PHASE</th>
            <th style="width: 21%;">TAN DELTA in %</th>
            <th style="width: 21%;">CAPACITANCE (pF)</th>
            <th style="width: 21%;">EXCITATION CURRENT (mA)</th>
            <th style="width: 21%;">DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          ${renderStatusRows(lvAt5kvRows)}
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 10px;">
        <thead>
          <tr>
            <th style="width: 16%;">AT 10 KV PHASE</th>
            <th style="width: 21%;">TAN DELTA in %</th>
            <th style="width: 21%;">CAPACITANCE (pF)</th>
            <th style="width: 21%;">EXCITATION CURRENT (mA)</th>
            <th style="width: 21%;">DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          ${renderStatusRows(lvAt10kvRows)}
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          Ten delta kit, calibration report, during tendelta of bushing photo
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage1Form8 (VConnect) - RECORD OF MEASUREMENT OF IR VALUES (Before Erection)
 * Kept in sync with UI component `Stage1Form8` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage1Form8(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>RECORD OF MEASUREMENT OF IR VALUES</h2>
        <h3 style="margin-top: 6px; font-weight: 900;">Before Erection</h3>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 12%; font-weight: 800;">Date :</td>
            <td style="width: 20%;">${formData.date || ""}</td>
            <td style="width: 12%; font-weight: 800;">Time :</td>
            <td style="width: 20%;">${formData.time || ""}</td>
            <td style="width: 36%; font-weight: 800; text-align: center;">Details of Insulation tester</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Amb. Temp :</td>
            <td>${formData.ambTemp || ""}</td>
            <td style="font-weight: 800;">Make :</td>
            <td>${formData.make || ""}</td>
            <td rowspan="4">${formData.insulationTesterDetails || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Oil Temp. :</td>
            <td>${formData.oilTemp || ""}</td>
            <td style="font-weight: 800;">Sr. No. :</td>
            <td>${formData.srNo || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Wdg. Temp. :</td>
            <td>${formData.wdgTemp || ""}</td>
            <td style="font-weight: 800;">Range :</td>
            <td>${formData.range || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Relative Humidity :</td>
            <td>${formData.relativeHumidity || ""}</td>
            <td style="font-weight: 800;">Voltage Level :</td>
            <td>${formData.voltageLevel || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 26px;">
        <thead>
          <tr>
            <th style="width: 26%;"></th>
            <th style="width: 18%;">
              10 Sec <br />
              (MΩ)
            </th>
            <th style="width: 18%;">
              60 Sec <br />
              (MΩ)
            </th>
            <th style="width: 38%;">Ratio of IR 60/IR 10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: 800;">HV-Earth</td>
            <td>${formData.hvEarth_10sec || ""}</td>
            <td>${formData.hvEarth_60sec || ""}</td>
            <td>${formData.hvEarth_ratio || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">LV1-Earth</td>
            <td>${formData.lv1Earth_10sec || ""}</td>
            <td>${formData.lv1Earth_60sec || ""}</td>
            <td>${formData.lv1Earth_ratio || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">LV2-Earth</td>
            <td>${formData.lv2Earth_10sec || ""}</td>
            <td>${formData.lv2Earth_60sec || ""}</td>
            <td>${formData.lv2Earth_ratio || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">HV-LV1</td>
            <td>${formData.hvLv1_10sec || ""}</td>
            <td>${formData.hvLv1_60sec || ""}</td>
            <td>${formData.hvLv1_ratio || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">HV-LV2</td>
            <td>${formData.hvLv2_10sec || ""}</td>
            <td>${formData.hvLv2_60sec || ""}</td>
            <td>${formData.hvLv2_ratio || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">LV1-LV2</td>
            <td>${formData.lv1Lv2_10sec || ""}</td>
            <td>${formData.lv1Lv2_60sec || ""}</td>
            <td>${formData.lv1Lv2_ratio || ""}</td>
          </tr>
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          IR tester, calibration report, 60 sec IR value.
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage2Form1 (VConnect) - TEST VALUES PRIOR TO FILTERATION / Record of Oil Filling in the Reservoirs Tank
 * Kept in sync with UI component `Stage2Form1` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage2Form1(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const filtrationRecords = Array.isArray(formData?.filtrationRecords) ? formData.filtrationRecords : [];

  const tanks = ["tank1", "tank2", "tank3"].map((tankKey, idx) => {
    const label = idx === 0 ? "Tank1" : idx === 1 ? "Tank2" : "Tank3";
    const tank = formData?.reservoirTanks?.[tankKey] || {};
    return `
      <tr>
        <td style="font-weight: 800;">${label}</td>
        <td>${tank.noOfBarrels || ""}</td>
        <td>${tank.startedOn || ""}</td>
        <td>${tank.completedOn || ""}</td>
        <td>${tank.bdv || ""}</td>
        <td>${tank.ppm || ""}</td>
      </tr>
    `;
  }).join("");

  const filtrationRows = filtrationRecords
    .map((row) => `
      <tr>
        <td>${row.date || ""}</td>
        <td>${row.time || ""}</td>
        <td>${row.vacuumLevel || ""}</td>
        <td>${row.inletTemp || ""}</td>
        <td>${row.outletTemp || ""}</td>
      </tr>
    `)
    .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TEST VALUES PRIOR TO FILTERATION</h2>
        <h3 style="margin-top: 6px; font-weight: 900;">Record of Oil Filling in the Reservoirs Tank</h3>
      </div>

      <table class="form-table">
        <thead>
          <tr>
            <th style="width: 16%;"></th>
            <th style="width: 17%;">No of barrels</th>
            <th style="width: 22%;">Started on Date & time</th>
            <th style="width: 22%;">Completed on Date & time</th>
            <th style="width: 11%;">BDV</th>
            <th style="width: 12%;">PPM</th>
          </tr>
        </thead>
        <tbody>
          ${tanks}
        </tbody>
      </table>

      <div style="margin-top: 30px; text-align: center; font-weight: 900; font-size: 18px;">
        Reservoir Tank Filtration
      </div>

      <table class="form-table" style="margin-top: 10px;">
        <thead>
          <tr>
            <th style="width: 18%;">Date</th>
            <th style="width: 18%;">Time</th>
            <th style="width: 24%;">Vacuum Level (mmHg or torr)</th>
            <th style="width: 20%;">Inlet Temp °C</th>
            <th style="width: 20%;">Outlet Temp °C</th>
          </tr>
        </thead>
        <tbody>
          ${filtrationRows}
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          Internal condition of reservoir tank, calibration report of BDV & PPM kit, oil barrels checking by water pest,
          PPM Photo, Reading of BDV value.
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage2Form2 (VConnect) - Line Lead Clearance + IR Values After erection
 * Kept in sync with UI component `Stage2Form2` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage2Form2(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Line Lead Clearance in mm :-</h2>
      </div>

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
            <td><strong>HV with respect to earth</strong></td>
            <td>${formData.hv_earth_11 || ""}</td>
            <td>${formData.hv_earth_12 || ""}</td>
          </tr>
          <tr>
            <td><strong>LV 1 with respect to earth</strong></td>
            <td>${formData.lv1_earth_21 || ""}</td>
            <td>${formData.lv1_earth_22 || ""}</td>
          </tr>
          <tr>
            <td><strong>LV 2 with respect to earth</strong></td>
            <td>${formData.lv2_earth_31 || ""}</td>
            <td>${formData.lv2_earth_32 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 40px; text-align: center;">
        IR Values After erection Temp OTI .......°C WTI.............°C, AMB .............°C RANGE ONLY 1 KV
      </h3>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Date :</strong></td>
            <td>${formData.date || ""}</td>
            <td><strong>Time:</strong></td>
            <td>${formData.time || ""}</td>
            <td><strong>Details of Insulation tester</strong></td>
          </tr>

          <tr>
            <td><strong>Amb. Temp :</strong></td>
            <td>${formData.ambTemp || ""}</td>
            <td><strong>Make :</strong></td>
            <td>${formData.make || ""}</td>
            <td rowspan="4">${formData.insulationTesterDetails || ""}</td>
          </tr>

          <tr>
            <td><strong>Oil Temp. :</strong></td>
            <td>${formData.oilTemp || ""}</td>
            <td><strong>Sr. No. :</strong></td>
            <td>${formData.srNo || ""}</td>
          </tr>

          <tr>
            <td><strong>Wdg. Temp. :</strong></td>
            <td>${formData.wdgTemp || ""}</td>
            <td><strong>Range :</strong></td>
            <td>${formData.range || ""}</td>
          </tr>

          <tr>
            <td><strong>Relative Humidity :</strong></td>
            <td>${formData.relativeHumidity || ""}</td>
            <td><strong>Voltage Level :</strong></td>
            <td>${formData.voltageLevel || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr>
            <th></th>
            <th>15 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>Ratio of IR 60/IR 15</th>
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
            <td><strong>LV1-Earth</strong></td>
            <td>${formData.lv1Earth_15sec || ""}</td>
            <td>${formData.lv1Earth_60sec || ""}</td>
            <td>${formData.lv1Earth_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>LV2-Earth</strong></td>
            <td>${formData.lv2Earth_15sec || ""}</td>
            <td>${formData.lv2Earth_60sec || ""}</td>
            <td>${formData.lv2Earth_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>HV-LV1</strong></td>
            <td>${formData.hvLv1_15sec || ""}</td>
            <td>${formData.hvLv1_60sec || ""}</td>
            <td>${formData.hvLv1_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>HV-LV2</strong></td>
            <td>${formData.hvLv2_15sec || ""}</td>
            <td>${formData.hvLv2_60sec || ""}</td>
            <td>${formData.hvLv2_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>LV1-LV2</strong></td>
            <td>${formData.lv1Lv2_15sec || ""}</td>
            <td>${formData.lv1Lv2_60sec || ""}</td>
            <td>${formData.lv1Lv2_ratio || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px;">Before oil filling in main tank</h4>
      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>BDV: _______ KV</strong></td>
            <td>${formData.bdv || ""}</td>
          </tr>
          <tr>
            <td><strong>Water Content: _______ PPM</strong></td>
            <td>${formData.waterContent || ""}</td>
          </tr>
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          Dew Point, dry air attached photo on transformer, Lead clearances, anabond on both bushing's thimble,
          radiators, flashing, conservator internal inspection, full transformer photo.
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage3Form1 (VConnect) - DETAILS FOR RECORDING OF VACUUM CYCLE
 * Kept in sync with UI component `Stage3Form1` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage3Form1(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const vacuumRecords = Array.isArray(formData?.vacuumRecords) ? formData.vacuumRecords : [];
  const pressureTests = Array.isArray(formData?.pressureTests) ? formData.pressureTests : [];

  const vacuumRows = vacuumRecords
    .map(
      (r) => `
        <tr>
          <td>${r.date || ""}</td>
          <td>${r.time || ""}</td>
          <td>${r.vacuumLevelMic || ""}</td>
          <td>${r.vacuumLevelTransformer || ""}</td>
        </tr>
      `
    )
    .join("");

  const pressureRows = pressureTests
    .map(
      (t, idx) => `
        <tr>
          <td><strong>${idx + 1}</strong></td>
          <td>${t.timeStarted || ""}</td>
          <td>${t.pressure || ""}</td>
          <td>${t.tempAmb || ""}</td>
          <td>${t.tempOti || ""}</td>
          <td>${t.tempWti || ""}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>DETAILS FOR RECORDING OF VACUUM CYCLE</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Vacuum hose Checked By</strong></td>
            <td>${formData.vacuumHoseCheckedBy || ""}</td>
          </tr>
          <tr>
            <td><strong>Vacuum hose Connected To</strong></td>
            <td>${formData.vacuumHoseConnectedTo || ""} <span style="margin-left: 10px;">Valve.</span></td>
          </tr>
          <tr>
            <td><strong>Evacuation Started At</strong></td>
            <td>
              ${formData.evacuationStartedAt || ""} <span style="margin-left: 10px;">Hrs. On</span>
              <span style="margin-left: 10px;">${formData.evacuationStartedOn || ""}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr>
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
        IR After oil Topping up To Conservator Temp OTI .......°C WTI.............°C, AMB .............°C RANGE ONLY 1 KV
      </h3>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr>
            <th></th>
            <th>
              10 Sec <br />
              (MΩ)
            </th>
            <th>
              60 Sec <br />
              (MΩ)
            </th>
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
            <td><strong>LV1-Earth</strong></td>
            <td>${formData.lv1Earth_15sec || ""}</td>
            <td>${formData.lv1Earth_60sec || ""}</td>
            <td>${formData.lv1Earth_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>LV2-Earth</strong></td>
            <td>${formData.lv2Earth_15sec || ""}</td>
            <td>${formData.lv2Earth_60sec || ""}</td>
            <td>${formData.lv2Earth_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>HV-LV1</strong></td>
            <td>${formData.hvLv1_15sec || ""}</td>
            <td>${formData.hvLv1_60sec || ""}</td>
            <td>${formData.hvLv1_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>HV-LV2</strong></td>
            <td>${formData.hvLv2_15sec || ""}</td>
            <td>${formData.hvLv2_60sec || ""}</td>
            <td>${formData.hvLv2_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>LV1-LV2</strong></td>
            <td>${formData.lv1Lv2_15sec || ""}</td>
            <td>${formData.lv1Lv2_60sec || ""}</td>
            <td>${formData.lv1Lv2_ratio || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px; text-align: center;">PRESSURE TEST REPORT</h4>

      <div style="text-align: right; margin-bottom: 8px;">
        <strong>DATE :- </strong> ${formData.pressureTestDate || ""}
      </div>

      <table class="form-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>TIME STARTED</th>
            <th>PRESSURE Kg/cm²</th>
            <th colspan="3">TEMP°C</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th>Amb.</th>
            <th>OTI</th>
            <th>WTI</th>
          </tr>
        </thead>
        <tbody>
          ${pressureRows}
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          Mec Lead Gauge photo, vacuum gauge photo, pressure gauge
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage4Form1 (VConnect) - RECORD FOR OIL FILTRATION / Oil filtration of Main Tank
 * Kept in sync with UI component `Stage4Form1` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage4Form1(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";
  const filtrationRecords = Array.isArray(formData?.filtrationRecords) ? formData.filtrationRecords : [];

  const filtrationRows = filtrationRecords
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
        <h3>Oil filtration of Main Tank</h3>
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
          ${filtrationRows}
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">Oil Filtration Process</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage4Form2 (VConnect) - IR Value before radiator/combine filtration + Oil filtration of Cooler Bank
 * Kept in sync with UI component `Stage4Form2` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage4Form2(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";
  const coolerBankRecords = Array.isArray(formData?.coolerBankRecords) ? formData.coolerBankRecords : [];

  const coolerBankRows = coolerBankRecords
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
        <h2>
          IR Value before radiator/combine filtration Temp OTI .......°C WTI.............°C, AMB .............°C RANGE
          ONLY 1 KV
        </h2>
      </div>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr>
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
            <td><strong>LV1-Earth</strong></td>
            <td>${formData.lv1Earth_10sec || ""}</td>
            <td>${formData.lv1Earth_60sec || ""}</td>
            <td>${formData.lv1Earth_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>LV2-Earth</strong></td>
            <td>${formData.lv2Earth_10sec || ""}</td>
            <td>${formData.lv2Earth_60sec || ""}</td>
            <td>${formData.lv2Earth_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>HV-LV1</strong></td>
            <td>${formData.hvLv1_10sec || ""}</td>
            <td>${formData.hvLv1_60sec || ""}</td>
            <td>${formData.hvLv1_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>HV-LV2</strong></td>
            <td>${formData.hvLv2_10sec || ""}</td>
            <td>${formData.hvLv2_60sec || ""}</td>
            <td>${formData.hvLv2_ratio || ""}</td>
          </tr>

          <tr>
            <td><strong>LV1-LV2</strong></td>
            <td>${formData.lv1Lv2_10sec || ""}</td>
            <td>${formData.lv1Lv2_60sec || ""}</td>
            <td>${formData.lv1Lv2_ratio || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px; text-align: center;">Oil filtration of Cooler Bank</h4>

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
          ${coolerBankRows}
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">Cooler Bank Filtration Process</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage4Form3 (VConnect) - RECORD FOR OIL FILTRATION / Oil filtration of Combine (Main Tank + Cooler bank)
 * Kept in sync with UI component `Stage4Form3` in:
 * `frontend/src/components/VConnected63MVATransformerStageReviewPanel.js`
 */
function generateStage4Form3(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";
  const combineRecords = Array.isArray(formData?.combineRecords) ? formData.combineRecords : [];

  const combineRows = combineRecords
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

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">Combine Filtration Process</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage4Form4 (VConnect) - IR & PI Value after filtration
 * Kept in sync with UI component `Stage4Form4` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 */
function generateStage4Form4(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>
          IR & PI Value after filtration Temp OTI .......°C WTI.............°C, AMB .............°C RANGE ONLY 5 KV
        </h2>
      </div>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr>
            <th></th>
            <th>10 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>600 Sec (MΩ)</th>
            <th>PI 600/600 Sec</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth_10sec || ""}</td>
            <td>${formData.hvEarth_60sec || ""}</td>
            <td>${formData.hvEarth_600sec || ""}</td>
            <td>${formData.hvEarth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>LV1-Earth</strong></td>
            <td>${formData.lv1Earth_10sec || ""}</td>
            <td>${formData.lv1Earth_60sec || ""}</td>
            <td>${formData.lv1Earth_600sec || ""}</td>
            <td>${formData.lv1Earth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>LV2-Earth</strong></td>
            <td>${formData.lv2Earth_10sec || ""}</td>
            <td>${formData.lv2Earth_60sec || ""}</td>
            <td>${formData.lv2Earth_600sec || ""}</td>
            <td>${formData.lv2Earth_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>HV-LV1</strong></td>
            <td>${formData.hvLv1_10sec || ""}</td>
            <td>${formData.hvLv1_60sec || ""}</td>
            <td>${formData.hvLv1_600sec || ""}</td>
            <td>${formData.hvLv1_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>HV-LV2</strong></td>
            <td>${formData.hvLv2_10sec || ""}</td>
            <td>${formData.hvLv2_60sec || ""}</td>
            <td>${formData.hvLv2_600sec || ""}</td>
            <td>${formData.hvLv2_ratio || ""}</td>
          </tr>
          <tr>
            <td><strong>LV1-LV2</strong></td>
            <td>${formData.lv1Lv2_10sec || ""}</td>
            <td>${formData.lv1Lv2_60sec || ""}</td>
            <td>${formData.lv1Lv2_600sec || ""}</td>
            <td>${formData.lv1Lv2_ratio || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px;">After Oil Filtration of main tank</h4>
      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>BDV: _______ KV</strong></td>
            <td>${formData.bdv || ""}</td>
          </tr>
          <tr>
            <td><strong>Water Content: _______ PPM</strong></td>
            <td>${formData.waterContent || ""}</td>
          </tr>
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          PPM Photo, Reading of BDV values, Air cell, MOG, POG.
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form1 (VConnect) - SFRA TEST RECORD
 * Kept in sync with UI component `Stage5Form1` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 */
function generateStage5Form1(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>SFRA TEST RECORD</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>MAKE OF METER</strong></td>
            <td>${formData.makeOfMeter || ""}</td>
            <td><strong>DATE</strong></td>
            <td>${formData.date || ""}</td>
          </tr>

          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td>${formData.modelSrNo || ""}</td>
            <td><strong>AMBIENT:</strong></td>
            <td>${formData.ambient || ""}</td>
          </tr>

          <tr>
            <td><strong>OTI in °C</strong></td>
            <td>${formData.otiTemp || ""}</td>
            <td><strong>WTI in °C</strong></td>
            <td>${formData.wtiTemp || ""}</td>
          </tr>

          <tr>
            <td><strong>Test report reviewed by</strong></td>
            <td>${formData.testReportReviewedBy || ""}</td>
            <td><strong>Acceptance of the test</strong></td>
            <td>${formData.acceptanceOfTest || ""}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 40px; text-align: center; font-weight: 900;">
        RECORD OF MEASUREMENT OF IR VALUES
      </div>

      <table class="form-table" style="margin-top: 12px;">
        <tbody>
          <tr>
            <td style="width: 15%; font-weight: 800;">Date :</td>
            <td style="width: 20%;">${formData.irDate || ""}</td>
            <td style="width: 15%; font-weight: 800;">Time:</td>
            <td style="width: 20%;">${formData.irTime || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Amb. Temp :</td>
            <td>${formData.irAmbTemp || ""}</td>
            <td style="font-weight: 800;">Make :</td>
            <td>${formData.irMake || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Oil Temp. :</td>
            <td>${formData.irOilTemp || ""}</td>
            <td style="font-weight: 800;">Sr. No. :</td>
            <td>${formData.irSrNo || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Wdg. Temp. :</td>
            <td>${formData.irWdgTemp || ""}</td>
            <td style="font-weight: 800;">Range :</td>
            <td>${formData.irRange || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Relative Humidity :</td>
            <td>${formData.irRelativeHumidity || ""}</td>
            <td style="font-weight: 800;">Voltage Level :</td>
            <td>${formData.irVoltageLevel || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 26px;">
        <thead>
          <tr>
            <th style="width: 26%;"></th>
            <th style="width: 18%;">15 Sec (MΩ)</th>
            <th style="width: 18%;">60 Sec (MΩ)</th>
            <th style="width: 38%;">Ratio of IR 60/IR 15</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: 800;">HV-Earth</td>
            <td>${formData.hvEarth_15sec || ""}</td>
            <td>${formData.hvEarth_60sec || ""}</td>
            <td>${formData.hvEarth_ratio || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">LV1-Earth</td>
            <td>${formData.lv1Earth_15sec || ""}</td>
            <td>${formData.lv1Earth_60sec || ""}</td>
            <td>${formData.lv1Earth_ratio || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">LV2-Earth</td>
            <td>${formData.lv2Earth_15sec || ""}</td>
            <td>${formData.lv2Earth_60sec || ""}</td>
            <td>${formData.lv2Earth_ratio || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">HV-LV1</td>
            <td>${formData.hvLv1_15sec || ""}</td>
            <td>${formData.hvLv1_60sec || ""}</td>
            <td>${formData.hvLv1_ratio || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">HV-LV2</td>
            <td>${formData.hvLv2_15sec || ""}</td>
            <td>${formData.hvLv2_60sec || ""}</td>
            <td>${formData.hvLv2_ratio || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">LV1-LV2</td>
            <td>${formData.lv1Lv2_15sec || ""}</td>
            <td>${formData.lv1Lv2_60sec || ""}</td>
            <td>${formData.lv1Lv2_ratio || ""}</td>
          </tr>
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          IR tester, calibration report, 60 sec IR value.
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form2 (VConnect) - RATIO TEST
 * Kept in sync with UI component `Stage5Form2` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 */
function generateStage5Form2(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const safeTaps = (set) => (set && Array.isArray(set.taps) ? set.taps : []);

  const renderRatioBlock = (set, defaultHeaderText) => {
    const namePlateText = set?.namePlateText || defaultHeaderText;
    const measuredText = set?.measuredText || defaultHeaderText;

    const rows = safeTaps(set)
      .map((row, idx) => {
        const tapNo = row.tapNo ?? idx + 1;
        return `
          <tr>
            <td style="text-align: center; font-weight: 700;">${tapNo}</td>
            <td>${row.namePlateRatio || ""}</td>
            <td>${row.measuredRatio || ""}</td>
            <td>${row.deviationPercent || ""}</td>
          </tr>
        `;
      })
      .join("");

    return `
      <table class="form-table" style="margin-top: 18px;">
        <thead>
          <tr>
            <th style="width: 10%;">TAP NO</th>
            <th style="width: 30%;">Name Plate Ratio</th>
            <th style="width: 30%;">Measured ratio</th>
            <th style="width: 30%;">Deviation %</th>
          </tr>
          <tr>
            <th></th>
            <th style="font-weight: 700;">${namePlateText}</th>
            <th style="font-weight: 700;">${measuredText}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  };

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>RATIO TEST</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 20%; font-weight: 800;">METER USED</td>
            <td style="width: 30%;">${formData.meterUsed || ""}</td>
            <td style="width: 20%; font-weight: 800;">DATE:</td>
            <td style="width: 30%;">${formData.date || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">MODEL & S. NO.</td>
            <td>${formData.modelSrNo || ""}</td>
            <td style="font-weight: 800;">TIME :</td>
            <td>${formData.time || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">OTI (°C)</td>
            <td>${formData.oti || ""}</td>
            <td style="font-weight: 800;">WTI (°C)</td>
            <td>${formData.wti || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">AMBIENT:</td>
            <td>${formData.ambient || ""}</td>
            <td colspan="2" style="text-align: center; font-weight: 800;">
              VECTOR GROUP
              <span style="margin-left: 8px; display: inline-block; min-width: 120px; font-weight: 500;">
                ${formData.vectorGroup || ""}
              </span>
              &nbsp; M.F.
              <span style="margin-left: 8px; display: inline-block; min-width: 80px; font-weight: 500;">
                ${formData.mf || ""}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      ${renderRatioBlock(formData.ratioSet1, "1.1 – 1.2 in between 2.1 -2.2")}
      ${renderRatioBlock(formData.ratioSet2, "1.1 – 1.2 in between 3.1 -3.2")}

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          Ratio test – tap wise readings and setup.
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form3 (VConnect) - TYPE OF TEST – MAGNETISING CURRENT TEST LV and HV
 * Kept in sync with UI component `Stage5Form3` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 */
function generateStage5Form3(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";
  const hvRows = Array.isArray(formData.hvMeasurements) ? formData.hvMeasurements : [];

  const hvBody = hvRows
    .map((row, idx) => {
      const tapNo = row.tapNo ?? idx + 1;
      return `
        <tr>
          <td style="text-align: center; font-weight: 700;">${tapNo}</td>
          <td>${row.hvVoltage || ""}</td>
          <td>${row.hvCurrent || ""}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TYPE OF TEST – MAGNETISING CURRENT TEST LV and HV</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 18%;"><strong>APPLIED VOLTAGE :</strong></td>
            <td style="width: 18%;">${formData.appliedVoltage || ""}</td>
            <td style="width: 14%;"><strong>VOLTS</strong></td>
            <td style="width: 18%;"><strong>DATE:</strong></td>
            <td style="width: 16%;">${formData.date || ""}</td>
            <td style="width: 8%;"><strong>TIME :</strong></td>
            <td style="width: 18%;">${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>METER MAKE SR. NO.</strong></td>
            <td colspan="6">${formData.meterMakeSrNo || ""}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 16px; font-weight: 900; padding: 6px 8px; border: 1px solid #000;">
        Magnetizing current measurement in milliampere
      </div>

      <table class="form-table" style="margin-top: 10px;">
        <thead>
          <tr>
            <th style="width: 15%;">TAP NO.</th>
            <th style="width: 45%;">VOLTAGE APPLIED ON HV SIDE</th>
            <th style="width: 40%;">CURRENT MEASURED ON HV SIDE (mA)</th>
          </tr>
        </thead>
        <tbody>
          ${hvBody}
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th style="width: 50%;">VOLTAGE APPLIED ON LV1 SIDE</th>
            <th style="width: 50%;">CURRENT MEASURED ON LV1 SIDE (mA)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${formData.lv1Voltage || ""}</td>
            <td>${formData.lv1Current || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 10px;">
        <thead>
          <tr>
            <th style="width: 50%;">VOLTAGE APPLIED ON LV2 SIDE</th>
            <th style="width: 50%;">CURRENT MEASURED ON LV2 SIDE (mA)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${formData.lv2Voltage || ""}</td>
            <td>${formData.lv2Current || ""}</td>
          </tr>
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">Magnetizing Current Test</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form4 (VConnect) - TYPE OF TEST – POLARITY TEST
 * Kept in sync with UI component `Stage5Form4` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 */
function generateStage5Form4(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const renderConditionBlock = (title, rows) => {
    return `
      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th colspan="2" style="text-align: center; font-weight: 900;">${title}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="width: 55%; padding: 0; vertical-align: top;">
              <table class="form-table" style="margin-top: 0;">
                <tbody>
                  ${rows
                    .map(
                      (r) => `
                      <tr>
                        <td style="width: 55%; font-weight: 700;">${r.label}</td>
                        <td style="width: 45%;">${r.value || ""}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            </td>
            <td style="width: 45%; min-height: 160px;"></td>
          </tr>
        </tbody>
      </table>
    `;
  };

  const condition1_22 = renderConditionBlock("CONDITION 1", [
    { label: "1.1 – 1.2 =", value: formData.condition1_11_12_22 },
    { label: "2.1 – 2.2 =", value: formData.condition1_21_22_22 },
    { label: "1.1 – 2.2 =", value: formData.condition1_11_22_22 },
    { label: "(1.1 – 2.2) = (1.1 – 1.2) + (2.1 – 2.2)", value: formData.condition1_calc_22 },
  ]);

  const condition2_22 = renderConditionBlock("CONDITION 2", [
    { label: "1.1 – 1.2 =", value: formData.condition2_11_12_22 },
    { label: "2.1 – 2.2 =", value: formData.condition2_21_22_22 },
    { label: "1.1 – 2.1 =", value: formData.condition2_11_21_22 },
    { label: "(1.1 – 2.1) = (1.1 – 1.2) - (2.1 – 2.2)", value: formData.condition2_calc_22 },
  ]);

  const condition1_32 = renderConditionBlock("CONDITION 1", [
    { label: "1.1 – 1.2 =", value: formData.condition1_11_12_32 },
    { label: "3.1 – 3.2 =", value: formData.condition1_31_32_32 },
    { label: "1.1 – 3.2 =", value: formData.condition1_11_32_32 },
    { label: "(1.1 – 3.2) = (1.1 – 1.2) + (3.1 – 3.2)", value: formData.condition1_calc_32 },
  ]);

  const condition2_32 = renderConditionBlock("CONDITION 2", [
    { label: "1.1 – 1.2 =", value: formData.condition2_11_12_32 },
    { label: "3.1 – 3.2 =", value: formData.condition2_31_32_32 },
    { label: "1.1 – 3.1 =", value: formData.condition2_11_31_32 },
    { label: "(1.1 – 3.1) = (1.1 – 1.2) - (3.1 – 3.2)", value: formData.condition2_calc_32 },
  ]);

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TYPE OF TEST – POLARITY TEST</h2>
      </div>

      ${condition1_22}
      ${condition2_22}

      ${condition1_32}
      ${condition2_32}

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">Polarity Test</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form5 (VConnect) - TYPE OF TEST – SHORT CIRCUIT TEST I
 * Kept in sync with UI component `Stage5Form5` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 *
 * Note: frontend persists this form as Stage5Form9 (legacy).
 */
function generateStage5Form5(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";
  const taps = Array.isArray(formData.taps) ? formData.taps : [];

  const tapRows = taps
    .map((row, idx) => {
      const tapNo = row.tapNo ?? idx + 1;
      return `
        <tr>
          <td style="text-align: center; font-weight: 700;">${tapNo}</td>
          <td>${row.voltage || ""}</td>
          <td>${row.hvCurrent || ""}</td>
          <td>${row.lvCurrent || ""}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TYPE OF TEST – SHORT CIRCUIT TEST <span>I</span></h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 16%;"><strong>APPLIED VOLTAGE:</strong></td>
            <td style="width: 18%;">${formData.appliedVoltage || ""}</td>
            <td style="width: 10%;"><strong>DATE:</strong></td>
            <td style="width: 18%;">${formData.date || ""}</td>
            <td style="width: 10%;"><strong>TIME :</strong></td>
            <td style="width: 18%;">${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>METER MAKE SR. NO.</strong></td>
            <td colspan="5">${formData.meterMakeSrNo || ""}</td>
          </tr>
          <tr>
            <td><strong>LV 1 SHORT, LV2 OPEN</strong></td>
            <td colspan="5">${formData.lv1ShortLv2Open || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th style="width: 15%;">TAP NO.</th>
            <th style="width: 25%;">VOLTAGE</th>
            <th style="width: 30%;">HV CURRENT (Amp)</th>
            <th style="width: 30%;">LV CURRENT (Amp)</th>
          </tr>
        </thead>
        <tbody>
          ${tapRows}
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <tbody>
          <tr>
            <td rowspan="4" style="width: 25%;"><strong>Impedance calculation</strong></td>
            <td style="width: 37%;"><strong>Applied Voltage HV</strong></td>
            <td style="width: 38%;"><strong>Rated Current LV</strong></td>
          </tr>
          <tr>
            <td>${formData.appliedVoltageHV || ""}</td>
            <td>${formData.ratedCurrentLV || ""}</td>
          </tr>
          <tr>
            <td><strong>%Z = _____________ X _____________ X 100</strong></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <div style="min-width: 60px;">${formData.percentZ || ""}</div>
                <span style="font-weight: 800;">Rated voltage HV</span>
                <div style="min-width: 120px;">${formData.ratedVoltageHV || ""}</div>
                <span style="font-weight: 800;">Measured current LV</span>
                <div style="min-width: 120px;">${formData.measuredCurrentLV || ""}</div>
              </div>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">Short Circuit Test</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form6 (VConnect) - TYPE OF TEST – SHORT CIRCUIT TEST II
 * Kept in sync with UI component `Stage5Form6` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 *
 * Note: frontend persists this form as Stage5Form9 (legacy).
 */
function generateStage5Form6(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";
  const taps = Array.isArray(formData.taps) ? formData.taps : [];

  const tapRows = taps
    .map((row, idx) => {
      const tapNo = row.tapNo ?? idx + 1;
      return `
        <tr>
          <td style="text-align: center; font-weight: 700;">${tapNo}</td>
          <td>${row.voltage || ""}</td>
          <td>${row.hvCurrent || ""}</td>
          <td>${row.lvCurrent || ""}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TYPE OF TEST – SHORT CIRCUIT TEST <span>II</span></h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 16%;"><strong>APPLIED VOLTAGE:</strong></td>
            <td style="width: 18%;">${formData.appliedVoltage || ""}</td>
            <td style="width: 10%;"><strong>DATE:</strong></td>
            <td style="width: 18%;">${formData.date || ""}</td>
            <td style="width: 10%;"><strong>TIME :</strong></td>
            <td style="width: 18%;">${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>METER MAKE SR. NO.</strong></td>
            <td colspan="5">${formData.meterMakeSrNo || ""}</td>
          </tr>
          <tr>
            <td><strong>LV 1 OPEN, LV2 SHORT</strong></td>
            <td colspan="5">${formData.lv1OpenLv2Short || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th style="width: 15%;">TAP NO.</th>
            <th style="width: 25%;">VOLTAGE</th>
            <th style="width: 30%;">HV CURRENT (Amp)</th>
            <th style="width: 30%;">LV CURRENT (Amp)</th>
          </tr>
        </thead>
        <tbody>
          ${tapRows}
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <tbody>
          <tr>
            <td rowspan="4" style="width: 25%;"><strong>Impedance calculation</strong></td>
            <td style="width: 37%;"><strong>Applied Voltage HV</strong></td>
            <td style="width: 38%;"><strong>Rated Current LV</strong></td>
          </tr>
          <tr>
            <td>${formData.appliedVoltageHV || ""}</td>
            <td>${formData.ratedCurrentLV || ""}</td>
          </tr>
          <tr>
            <td><strong>%Z = _____________ X _____________ X 100</strong></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <div style="min-width: 60px;">${formData.percentZ || ""}</div>
                <span style="font-weight: 800;">Rated voltage HV</span>
                <div style="min-width: 120px;">${formData.ratedVoltageHV || ""}</div>
                <span style="font-weight: 800;">Measured current LV</span>
                <div style="min-width: 120px;">${formData.measuredCurrentLV || ""}</div>
              </div>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">Short Circuit Test</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form7 (VConnect) - TYPE OF TEST – SHORT CIRCUIT TEST III
 * Kept in sync with UI component `Stage5Form7` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 *
 * Note: frontend persists this form as Stage5Form9 (legacy).
 */
function generateStage5Form7(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";
  const taps = Array.isArray(formData.taps) ? formData.taps : [];

  const tapRows = taps
    .map((row, idx) => {
      const tapNo = row.tapNo ?? idx + 1;
      return `
        <tr>
          <td style="text-align: center; font-weight: 700;">${tapNo}</td>
          <td>${row.voltage || ""}</td>
          <td>${row.hvCurrent || ""}</td>
          <td>${row.lvCurrent || ""}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TYPE OF TEST – SHORT CIRCUIT TEST <span>III</span></h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 16%;"><strong>APPLIED VOLTAGE:</strong></td>
            <td style="width: 18%;">${formData.appliedVoltage || ""}</td>
            <td style="width: 10%;"><strong>DATE:</strong></td>
            <td style="width: 18%;">${formData.date || ""}</td>
            <td style="width: 10%;"><strong>TIME :</strong></td>
            <td style="width: 18%;">${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>METER MAKE SR. NO.</strong></td>
            <td colspan="5">${formData.meterMakeSrNo || ""}</td>
          </tr>
          <tr>
            <td><strong>LV1 AND LV2 SHORT</strong></td>
            <td colspan="5">${formData.lv1AndLv2Short || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th style="width: 15%;">TAP NO.</th>
            <th style="width: 25%;">VOLTAGE</th>
            <th style="width: 30%;">HV CURRENT (Amp)</th>
            <th style="width: 30%;">LV CURRENT (Amp)</th>
          </tr>
        </thead>
        <tbody>
          ${tapRows}
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <tbody>
          <tr>
            <td rowspan="4" style="width: 25%;"><strong>Impedance calculation</strong></td>
            <td style="width: 37%;"><strong>Applied Voltage HV</strong></td>
            <td style="width: 38%;"><strong>Rated Current LV</strong></td>
          </tr>
          <tr>
            <td>${formData.appliedVoltageHV || ""}</td>
            <td>${formData.ratedCurrentLV || ""}</td>
          </tr>
          <tr>
            <td><strong>%Z = _____________ X _____________ X 100</strong></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <div style="min-width: 60px;">${formData.percentZ || ""}</div>
                <span style="font-weight: 800;">Rated voltage HV</span>
                <div style="min-width: 120px;">${formData.ratedVoltageHV || ""}</div>
                <span style="font-weight: 800;">Measured current LV</span>
                <div style="min-width: 120px;">${formData.measuredCurrentLV || ""}</div>
              </div>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">Short Circuit Test</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form8 (VConnect) - TYPE OF TEST – WINDING RESISTANCE TEST
 * Kept in sync with UI component `Stage5Form8` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 *
 * Note: frontend persists this form as Stage5Form6 (legacy).
 */
function generateStage5Form8(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const hvSide = Array.isArray(formData.hvSide) ? formData.hvSide : [];
  const lvSide21_22 = Array.isArray(formData.lvSide21_22) ? formData.lvSide21_22 : [];
  const lvSide31_32 = Array.isArray(formData.lvSide31_32) ? formData.lvSide31_32 : [];

  const hvRows = hvSide
    .map((row, idx) => {
      const tapNo = row.tapNo ?? idx + 1;
      return `
        <tr>
          <td style="text-align: center; font-weight: 700;">${tapNo}</td>
          <td>${row.resistance_11_12 || ""}</td>
        </tr>
      `;
    })
    .join("");

  const lv21Rows = lvSide21_22
    .map((row, idx) => {
      const rowNo = row.rowNo ?? idx + 1;
      return `
        <tr>
          <td style="text-align: center; font-weight: 700;">${rowNo}</td>
          <td>${row.resistance_21_22 || ""}</td>
        </tr>
      `;
    })
    .join("");

  const lv31Rows = lvSide31_32
    .map((row, idx) => {
      const rowNo = row.rowNo ?? idx + 1;
      return `
        <tr>
          <td style="text-align: center; font-weight: 700;">${rowNo}</td>
          <td>${row.resistance_31_32 || ""}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TYPE OF TEST – WINDING RESISTANCE TEST</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 20%; font-weight: 800;">METER USED</td>
            <td style="width: 30%;">${formData.meterUsed || ""}</td>
            <td style="width: 20%; font-weight: 800;">DATE:</td>
            <td style="width: 30%;">${formData.date || ""}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">METER MAKE SR. NO.</td>
            <td>${formData.meterMakeSrNo || ""}</td>
            <td style="font-weight: 800;">TIME :</td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">RANGE</td>
            <td>${formData.range || ""}</td>
            <td style="font-weight: 800;">WTI:</td>
            <td>${formData.wti || ""}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">AMBIENT:</td>
            <td>${formData.ambient || ""}</td>
            <td style="font-weight: 800;">OTI:</td>
            <td>${formData.oti || ""}</td>
          </tr>
        </tbody>
      </table>

      <div style="display: flex; gap: 40px; margin-top: 30px; align-items: flex-start;">
        <div style="flex: 1;">
          <div style="text-align: center; font-weight: 900; margin-bottom: 8px;">HV SIDE</div>
          <table class="form-table">
            <thead>
              <tr>
                <th style="width: 30%;">TAP NO.</th>
                <th style="width: 70%;">1.1 – 1.2 (Ω)</th>
              </tr>
            </thead>
            <tbody>
              ${hvRows}
            </tbody>
          </table>
        </div>

        <div style="flex: 1;">
          <div style="text-align: center; font-weight: 900; margin-bottom: 8px;">LV SIDE</div>

          <table class="form-table">
            <thead>
              <tr>
                <th style="width: 40%;">ROW</th>
                <th style="width: 60%;">2.1 – 2.2 (Ω)</th>
              </tr>
            </thead>
            <tbody>
              ${lv21Rows}
            </tbody>
          </table>

          <table class="form-table" style="margin-top: 16px;">
            <thead>
              <tr>
                <th style="width: 40%;">ROW</th>
                <th style="width: 60%;">3.1 – 3.2 (Ω)</th>
              </tr>
            </thead>
            <tbody>
              ${lv31Rows}
            </tbody>
          </table>
        </div>
      </div>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">Winding resistance test – HV and LV side</p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form9 (VConnect) - TEST REPORT (Tan Delta & Capacitance Test on Bushing)
 * Kept in sync with UI component `Stage5Form9` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 */
function generateStage5Form9(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const bushingKeys = ["hv11", "hv12", "lv21", "lv22", "lv31", "lv32"];

  const renderRow = (key, labelVoltage) => {
    const row = formData?.rows?.[key] || {};
    return `
      <tr>
        <td>${row.voltageKv || ""}</td>
        <td style="font-weight: 700;">${labelVoltage}</td>
        <td>${row.testMode || ""}</td>
        <td>${row.capacitanceFactory || ""}</td>
        <td>${row.capacitanceSite || ""}</td>
        <td>${row.tanDeltaFactory || ""}</td>
        <td>${row.tanDeltaSite || ""}</td>
        <td>${row.remark || ""}</td>
      </tr>
    `;
  };

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TAN DELTA AND CAPACITANCE TEST ON BUSHING</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 20%; font-weight: 800;">Bushing Sr No. (HV)</td>
            <td style="width: 30%;">${formData.hvBushingSrNo || ""}</td>
            <td style="width: 20%; font-weight: 800;">Bushing Make (HV)</td>
            <td style="width: 30%;">${formData.hvBushingMake || ""}</td>
          </tr>
          <tr>
            <td style="width: 20%; font-weight: 800;">Bushing Sr No. (LV)</td>
            <td style="width: 30%;">${formData.lvBushingSrNo || ""}</td>
            <td style="width: 20%; font-weight: 800;">Bushing Make (LV)</td>
            <td style="width: 30%;">${formData.lvBushingMake || ""}</td>
          </tr>
          <tr>
            <td style="width: 20%; font-weight: 800;">METER USED</td>
            <td style="width: 30%;">${formData.meterUsed || ""}</td>
            <td style="width: 20%; font-weight: 800;">DATE:</td>
            <td style="width: 30%;">${formData.date || ""}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">MODEL & S. NO.</td>
            <td>${formData.modelAndSerialNo || ""}</td>
            <td style="font-weight: 800;">TIME :</td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">AMBIENT:</td>
            <td>${formData.ambient || ""}</td>
            <td style="font-weight: 800;">OTI (°C)</td>
            <td>${formData.oti || ""}</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">WTI (°C)</td>
            <td>${formData.wti || ""}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th style="width: 10%;">VOLTAGE (KV)</th>
            <th style="width: 18%;">BUSHING & SERIAL NO.</th>
            <th style="width: 10%;">TEST MODE</th>
            <th colspan="2" style="width: 24%;">CAPACITANCE</th>
            <th colspan="2" style="width: 24%;">TAN DELTA</th>
            <th style="width: 14%;">REMARK</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th style="font-weight: 700;">FACTORY</th>
            <th style="font-weight: 700;">SITE</th>
            <th style="font-weight: 700;">FACTORY</th>
            <th style="font-weight: 700;">SITE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${renderRow("hv11", "HV (1.1)")}
          ${renderRow("hv12", "HV (1.2)")}
          ${renderRow("lv21", "LV (2.1)")}
          ${renderRow("lv22", "LV (2.2)")}
          ${renderRow("lv31", "LV (3.1)")}
          ${renderRow("lv32", "LV (3.2)")}
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          Tan delta kit, calibration report, and bushing photographs during tan delta test.
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form10 (VConnect) - TAN DELTA AND CAPACITANCE MEASUREMENT OF WINDING
 * Kept in sync with UI component `Stage5Form10` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 */
function generateStage5Form10(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const defaultAt05kvRows = [
    { between: "HV – G", mode: "GST-GND" },
    { between: "HV – G", mode: "GSTg" },
    { between: "LV 1 – G", mode: "GSTg" },
    { between: "LV 1 – G", mode: "GST-GND" },
    { between: "HV – LV 1", mode: "UST-R" },
    { between: "HV – LV 2", mode: "UST-R" },
    { between: "LV 2 – G", mode: "GST-GND" },
    { between: "LV 2 – G", mode: "GSTg" },
    { between: "LV1-LV2", mode: "UST-R" },
  ];

  const defaultAt10kvRows = [
    { between: "HV – G", mode: "GST-GND" },
    { between: "HV – G", mode: "GSTg" },
    { between: "LV 1 – G", mode: "GSTg" },
    { between: "LV 1 – G", mode: "GST-GND" },
    { between: "HV – LV 1", mode: "UST-R" },
    { between: "HV – LV 2", mode: "UST-R" },
    { between: "LV 2 – G", mode: "GST-GND" },
    { between: "LV 2 – G", mode: "GSTg" },
    { between: "LV1-LV2", mode: "UST-R" },
  ];

  const normalizeRows = (incomingRows, defaults) => {
    const rows = Array.isArray(incomingRows) ? incomingRows : [];
    return defaults.map((def, idx) => {
      const src = rows[idx] || {};
      return {
        between: def.between,
        mode: def.mode,
        tanDelta: src.tanDelta ?? "",
        capacitance: src.capacitance ?? "",
        excitationCurrent: src.excitationCurrent ?? "",
        dielectricLoss: src.dielectricLoss ?? "",
      };
    });
  };

  const at05kvRows = normalizeRows(formData.at05kvRows, defaultAt05kvRows);
  const at10kvRows = normalizeRows(formData.at10kvRows, defaultAt10kvRows);

  const renderRows = (rows) =>
    rows
      .map(
        (row) => `
          <tr>
            <td style="font-weight: 800; text-align: center;">${row.between}</td>
            <td style="font-weight: 800; text-align: center;">${row.mode}</td>
            <td>${row.tanDelta}</td>
            <td>${row.capacitance}</td>
            <td>${row.excitationCurrent}</td>
            <td>${row.dielectricLoss}</td>
          </tr>
        `
      )
      .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TAN DELTA AND CAPACITANCE MEASUREMENT OF WINDING</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 22%; font-weight: 800;">METER USED</td>
            <td style="width: 28%;">${formData.meterUsed || ""}</td>
            <td style="width: 22%; font-weight: 800;">DATE:</td>
            <td style="width: 28%;">${formData.date || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">MODEL & S. NO.</td>
            <td>${formData.modelAndSerialNo || ""}</td>
            <td style="font-weight: 800;">TIME :</td>
            <td>${formData.time || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">OTI..................°C</td>
            <td>${formData.oti || ""}</td>
            <td style="font-weight: 800;">AMBIENT:</td>
            <td>${formData.ambient || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">WTI..................°C</td>
            <td>${formData.wti || ""}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 16px;">
        <thead>
          <tr>
            <th style="width: 18%;">AT 05 KV IN BETWEEN</th>
            <th style="width: 12%;">MODE</th>
            <th style="width: 17%;">TAN DELTA %</th>
            <th style="width: 16%;">CAPACITANCE (pF)</th>
            <th style="width: 19%;">EXCITATION CURRENT (mA)</th>
            <th style="width: 18%;">DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          ${renderRows(at05kvRows)}
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 18px;">
        <thead>
          <tr>
            <th style="width: 18%;">AT 10 KV IN BETWEEN</th>
            <th style="width: 12%;">MODE</th>
            <th style="width: 17%;">TAN DELTA %</th>
            <th style="width: 16%;">CAPACITANCE (pF)</th>
            <th style="width: 19%;">EXCITATION CURRENT (mA)</th>
            <th style="width: 18%;">DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          ${renderRows(at10kvRows)}
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          Ten delta kit, calibration report, during tendelta of winding photo
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
    </div>
  `;
}

/**
 * Stage5Form11 (VConnect) - PRE-COMMISSIONING CHECKLIST (as implemented in Stage5Form11 UI)
 * Kept in sync with UI component `Stage5Form11` in:
 * `frontend/src/components/VConnected63MVATransformerForms.js`
 */
function generateStage5Form11(formData) {
  if (!formData) return "";

  const photoBaseUrl = process.env.BACKEND_API_BASE_URL || "";

  const valveItems = [
    ["A", "Bucholz to Conservator", "bucholzToConservator"],
    ["B", "Main Tank to Bucholz", "mainTankToBucholz"],
    ["C", "Radiator Top Valves", "radiatorTopValves"],
    ["D", "Radiator Bottom Valves", "radiatorBottomValves"],
    ["E", "Top 200mm Pipeline", "top200mmPipeline"],
    ["F", "Top Header", "topHeader"],
    ["G", "Bottom Header", "bottomHeader"],
    ["H", "Main Tank to Radiator Bank", "mainTankToRadiatorBank"],
    ["I", "Oil Pump to R.F.B.D.", "oilPumpToRFBD"],
    ["J", "Oil Pump to Radiator Bank", "oilPumpToRadiatorBank"],
    ["K", "Top Filter Valve", "topFilterValve"],
    ["L", "Bottom Filter Valve", "bottomFilterValve"],
    ["M", "Drain Valve", "drainValve"],
  ];

  const airVentingSimple = [
    ["A", "Main Tank", "mainTank"],
    ["B", "Pipe Line Top", "pipeLineTop"],
    ["C", "Pipe Line Bottom", "pipeLineBottom"],
    ["D", "Radiator - Top", "radiatorTop"],
    ["E", "RFBD", "rfbd"],
    ["F", "Diverter Switch", "diverterSwitch"],
  ];

  const protectionRows = [
    ["A", "BUCHHOLZ", "ALARM", "buchholzAlarm"],
    ["", "", "TRIP", "buchholzTrip"],
    ["B", "MOG", "ALARM", "mogAlarm"],
    ["C", "PRV", "TRIP", "prvTrip"],
    ["D", "OTI", "ALARM", "otiAlarm"],
    ["", "", "TRIP", "otiTrip"],
    ["E", "WTI", "ALARM", "wtiAlarm"],
    ["", "", "TRIP", "wtiTrip"],
  ];

  const irRows = [
    ["HV-Earth", "hvEarth"],
    ["LV1-Earth", "lv1Earth"],
    ["LV2-Earth", "lv2Earth"],
    ["HV-LV1", "hvLv1"],
    ["HV-LV2", "hvLv2"],
    ["LV1-LV2", "lv1Lv2"],
  ];

  const renderValveRows = () =>
    valveItems
      .map(
        ([sr, label, key]) => `
          <tr>
            <td style="font-weight: 800;">${sr}</td>
            <td style="font-weight: 800;">${label}</td>
            <td></td>
            <td>${(formData.valveStatus || {})[key] || ""}</td>
            <td></td>
            <td></td>
          </tr>
        `
      )
      .join("");

  const renderAirVentingSimpleRows = () =>
    airVentingSimple
      .map(
        ([sr, label, key]) => `
          <tr>
            <td style="font-weight: 800;">${sr}</td>
            <td style="font-weight: 800;">${label}</td>
            <td></td>
            <td>${(formData.airVenting || {})[key] || ""}</td>
            <td></td>
            <td></td>
          </tr>
        `
      )
      .join("");

  const renderProtectionRows = () =>
    protectionRows
      .map(([sr, device, label, key]) => {
        const val = (formData.protectionTrails || {})[key] || "";
        const setTemp = (formData.protectionTrails || {}).otiSetTemperature || "";
        const isOtiAlarm = key === "otiAlarm";
        return `
          <tr>
            <td style="font-weight: 800;">${sr}</td>
            <td style="font-weight: 800;">${device}</td>
            <td style="font-weight: 800;">${label}</td>
            <td>${val}</td>
            <td style="font-weight: 800;">${isOtiAlarm ? "Set Temperature" : ""}</td>
            <td>${isOtiAlarm ? setTemp : ""}</td>
          </tr>
        `;
      })
      .join("");

  const renderIRTableRows = () =>
    irRows
      .map(([label, key]) => `
        <tr>
          <td style="font-weight: 800;">${label}</td>
          <td>${formData[`${key}_15sec`] || ""}</td>
          <td>${formData[`${key}_60sec`] || ""}</td>
          <td>${formData[`${key}_600sec`] || ""}</td>
          <td>${formData[`${key}_ratio_ir60`] || ""}</td>
          <td>${formData[`${key}_ratio_ir600`] || ""}</td>
        </tr>
      `)
      .join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>PRE-COMMISSIONING CHECKLIST</h3>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="font-weight: 800;">Name of end customer</td>
            <td>${formData.customerName || ""}</td>
            <td style="font-weight: 800;">Rating MVA</td>
            <td>${formData.ratingMVA || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Name of project company</td>
            <td>${formData.projectName || ""}</td>
            <td style="font-weight: 800;">Rating Voltage</td>
            <td>${formData.ratingVoltage || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Name of TSS</td>
            <td>${formData.nameTSS || ""}</td>
            <td style="font-weight: 800;">TSS Sr. no.</td>
            <td>${formData.tssSrNo || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">Manufacturer name</td>
            <td colspan="3">${formData.manufacturerName || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th style="width: 10%;">Sr.No.</th>
            <th style="width: 50%;">Particulars</th>
            <th style="width: 10%;">Qty</th>
            <th style="width: 10%;">Open</th>
            <th style="width: 10%;">Shut</th>
            <th style="width: 10%;">N/A</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: 900;">I</td>
            <td style="font-weight: 900;">Valve Status</td>
            <td></td><td></td><td></td><td></td>
          </tr>
          ${renderValveRows()}

          <tr>
            <td style="font-weight: 900;">II</td>
            <td style="font-weight: 900;">Air Venting</td>
            <td colspan="4" style="font-weight: 900;">Done from the Following Locations:</td>
            <td></td>
          </tr>
          ${renderAirVentingSimpleRows()}

          <tr>
            <td style="font-weight: 800;">G</td>
            <td style="font-weight: 800;">Bucholz Relay</td>
            <td style="font-weight: 800;">1</td>
            <td>${formData.airVenting?.bucholzRelay?.location1 || ""}</td>
            <td style="font-weight: 800;">2</td>
            <td>${formData.airVenting?.bucholzRelay?.location2 || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">H</td>
            <td style="font-weight: 800;">HV Bushing</td>
            <td style="font-weight: 800;">1.1</td>
            <td>${formData.airVenting?.hvBushing?.location11 || ""}</td>
            <td style="font-weight: 800;">1.2</td>
            <td>${formData.airVenting?.hvBushing?.location12 || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">I</td>
            <td style="font-weight: 800;">LV Bushing</td>
            <td style="font-weight: 800;">2.1</td>
            <td>${formData.airVenting?.lvBushing?.location21 || ""}</td>
            <td style="font-weight: 800;">2.2</td>
            <td>${formData.airVenting?.lvBushing?.location22 || ""}</td>
          </tr>

          <tr>
            <td></td>
            <td></td>
            <td style="font-weight: 800;">3.1</td>
            <td>${formData.airVenting?.lvBushing?.location31 || ""}</td>
            <td style="font-weight: 800;">3.2</td>
            <td>${formData.airVenting?.lvBushing?.location32 || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">J</td>
            <td style="font-weight: 800;">Header – Top</td>
            <td style="font-weight: 800;">1</td>
            <td>${formData.airVenting?.headerTop?.location1 || ""}</td>
            <td style="font-weight: 800;">2</td>
            <td>${formData.airVenting?.headerTop?.location2 || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">K</td>
            <td style="font-weight: 800;">Header – Bottom</td>
            <td style="font-weight: 800;">1</td>
            <td>${formData.airVenting?.headerBottom?.location1 || ""}</td>
            <td style="font-weight: 800;">2</td>
            <td>${formData.airVenting?.headerBottom?.location2 || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 800;">L</td>
            <td style="font-weight: 800;">Oil Pump</td>
            <td style="font-weight: 800;">1</td>
            <td>${formData.airVenting?.oilPump?.location1 || ""}</td>
            <td style="font-weight: 800;">2</td>
            <td>${formData.airVenting?.oilPump?.location2 || ""}</td>
          </tr>

          <tr>
            <td></td>
            <td></td>
            <td style="font-weight: 800;">3</td>
            <td>${formData.airVenting?.oilPump?.location3 || ""}</td>
            <td style="font-weight: 800;">4</td>
            <td>${formData.airVenting?.oilPump?.location4 || ""}</td>
          </tr>

          <tr>
            <td style="font-weight: 900;">III</td>
            <td style="font-weight: 900;">Protection Trails</td>
            <td colspan="4" style="font-weight: 900;">Checked</td>
            <td></td>
          </tr>
          ${renderProtectionRows()}
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <tbody>
          <tr>
            <td><strong>Date :</strong></td>
            <td>${formData.date || ""}</td>
            <td><strong>Time:</strong></td>
            <td>${formData.time || ""}</td>
            <td><strong>Details of Insulation tester</strong></td>
          </tr>
          <tr>
            <td><strong>Amb. Temp :</strong></td>
            <td>${formData.ambTemp || ""}</td>
            <td><strong>Make :</strong></td>
            <td>${formData.make || ""}</td>
            <td rowspan="4">${formData.insulationTesterDetails || ""}</td>
          </tr>
          <tr>
            <td><strong>Oil Temp. :</strong></td>
            <td>${formData.oilTemp || ""}</td>
            <td><strong>Sr. No. :</strong></td>
            <td>${formData.srNo || ""}</td>
          </tr>
          <tr>
            <td><strong>Wdg. Temp. :</strong></td>
            <td>${formData.wdgTemp || ""}</td>
            <td><strong>Range :</strong></td>
            <td>${formData.range || ""}</td>
          </tr>
          <tr>
            <td><strong>Relative Humidity :</strong></td>
            <td>${formData.relativeHumidity || ""}</td>
            <td><strong>Voltage Level :</strong></td>
            <td>${formData.voltageLevel || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 30px;">
        <thead>
          <tr>
            <th></th>
            <th>15 Sec (MΩ)</th>
            <th>60 Sec (MΩ)</th>
            <th>600 Sec (MΩ)</th>
            <th>Ratio of IR 60/IR 15</th>
            <th>Ratio of IR 600/IR 60</th>
          </tr>
        </thead>
        <tbody>
          ${renderIRTableRows()}
        </tbody>
      </table>

      <div class="photo-upload-section" style="page-break-inside: avoid;">
        <h4>Note: - Photographs to be added: -</h4>
        <p style="text-align: center; margin-bottom: 20px; font-weight: 600;">
          Earthing's of main tank & bushing, sealing of Cable gland, bushing test tap & thimble, Buchholz terminal plate, etc...., Full Photo of transformer
        </p>
      </div>

      ${generatePhotoThumbnails(formData.photos, photoBaseUrl)}
      ${generateSignatureSection(formData.signatures)}
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
          <strong>Location:</strong> ${formData.location || "___________"} <strong style="margin-left: 20px;">SP/SSP</strong>
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

  // Ensure deterministic order: form1, form2, ... formN (not lexicographic: form10 should not come before form2)
  const sortedForms = Object.entries(stageData).sort(([a], [b]) => {
    const aNum = parseInt(String(a).match(/\d+/)?.[0] || "0", 10);
    const bNum = parseInt(String(b).match(/\d+/)?.[0] || "0", 10);
    if (aNum !== bNum) return aNum - bNum;
    return String(a).localeCompare(String(b));
  });

  sortedForms.forEach(([formKey, formData]) => {
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
      else if (stageNumber === 1 && formKey === "form8") {
        content += generateStage1Form8(formData);
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
      else if (stageNumber === 5 && formKey === "form9") {
        content += generateStage5Form9(formData);
      }
      else if (stageNumber === 5 && formKey === "form10") {
        content += generateStage5Form10(formData);
      }
      else if (stageNumber === 5 && formKey === "form11") {
        content += generateStage5Form11(formData);
      }
      // Stage 6 Forms (render Work Completion Report in the normal Stage flow)
      else if (stageNumber === 6 && formKey === "form1") {
        content += generateStage6Form1(formData);
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
  // VConnect data is stored under `vConnectData` (NOT TractionData)
  if (data.vConnectData) {
    for (let i = 0; i <= 7; i++) {
      const stageKey = `stage${i}`;
      if (data.vConnectData[stageKey]) {
        stagesContent += generateStageContent(data.vConnectData[stageKey], i, headerImage);
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
          ${data.vConnectData && data.vConnectData.stage6 && data.vConnectData.stage6.form1 ?
            (() => {
              const stage6Data = data.vConnectData.stage6.form1;
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
