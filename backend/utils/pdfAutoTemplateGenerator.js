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

// Generate Stage 1 Form 1 - Name Plate Details
function generateStage1Form1(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>NAME PLATE DETAILS TRANSFORMER</h2>
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
            <td><strong>Temp. Rise over amb. In Oil °C</strong></td>
            <td>${formData.tempRiseOil || ""}</td>
          </tr>
          <tr>
            <td><strong>HV (KV)</strong></td>
            <td>${formData.hvKv || ""}</td>
            <td><strong>Winding</strong></td>
            <td>${formData.winding || ""}</td>
          </tr>
          <tr>
            <td><strong>LV (KV)</strong></td>
            <td>${formData.lvKv || ""}</td>
            <td><strong>Transporting weight</strong></td>
            <td>${formData.transportingWeight || ""}</td>
          </tr>
          <tr>
            <td><strong>% Impedance</strong></td>
            <td>${formData.impedancePercent || ""}</td>
            <td><strong>No. Of radiators</strong></td>
            <td>${formData.noOfRadiators || ""}</td>
          </tr>
          <tr>
            <td><strong>Year of Mfg.</strong></td>
            <td>${formData.yearOfMfg || ""}</td>
            <td><strong>Weight of Core & Winding.</strong></td>
            <td>${formData.weightCoreWinding || ""}</td>
          </tr>
          <tr>
            <td><strong>Oil Quantity in liter</strong></td>
            <td>${formData.oilQuantityLiter || ""}</td>
            <td><strong>Total Weight</strong></td>
            <td>${formData.totalWeight || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 1 Form 2 - Protocol for Accessories Checking
function generateStage1Form2(formData) {
  if (!formData) return "";

  // Accessory items matching the form exactly
  const accessoryItems = [
    { id: 1, description: "HV bushing" },
    { id: 2, description: "LV Bushing" },
    { id: 3, description: "Neutral bushing" },
    { id: 4, description: "Buchholz" },
    { id: 5, description: "PRV" },
    { id: 6, description: "CPR" },
    { id: 7, description: "Breather" },
    { id: 8, description: "Bushing Connector" },
    { id: 9, description: "Radiators" },
  ];

  // Generate table rows for accessories
  const accessoryRows = accessoryItems.map(item => {
    const accessoryData = formData.accessories && formData.accessories[item.id] ? formData.accessories[item.id] : {};
    return `
      <tr>
        <td style="text-align: center;"><strong>${item.id}</strong></td>
        <td>${accessoryData.packingCase || ""}</td>
        <td><strong>${item.description}</strong></td>
        <td>${accessoryData.qtyPerPL || ""}</td>
        <td>${accessoryData.qtyReceived || ""}</td>
        <td>${accessoryData.shortQty || ""}</td>
        <td>${accessoryData.damagedQty || ""}</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>PROTOCOL FOR ACCESSORIES CHECKING</h2>
      </div>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th style="text-align: center;">No</th>
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

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 1 Form 3 - Core Insulation Check
function generateStage1Form3(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>CORE INSULATION CHECK: At 1 KV > 500 MΩ</h2>
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
            <td><strong>Between Core – frame</strong></td>
            <td>${formData.betweenCoreFrame || ""}</td>
            <td>${formData.betweenCoreFrameRemarks || ""}</td>
          </tr>
          <tr>
            <td><strong>Between Frame – tank</strong></td>
            <td>${formData.betweenFrameTank || ""}</td>
            <td>${formData.betweenFrameTankRemarks || ""}</td>
          </tr>
          <tr>
            <td><strong>Between core – tank</strong></td>
            <td>${formData.betweenCoreTank || ""}</td>
            <td>${formData.betweenCoreTankRemarks || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px; text-align: center;">CHECKLIST FOR CONFORMING AVAILABILITY OF EQUIPMENT AT SITE</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>Description</th>
            <th>Rating/capacity</th>
            <th>Checked by</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>2.</strong></td>
            <td><strong>Whether the Filter Machine is Available</strong></td>
            <td>${formData.filterMachine || ""}</td>
            <td>${formData.filterMachineChecked || ""}</td>
          </tr>
          <tr>
            <td><strong>3.</strong></td>
            <td><strong>Capacity of Filter Machine</strong></td>
            <td>${formData.filterCapacity || ""}</td>
            <td>${formData.filterCapacityChecked || ""}</td>
          </tr>
          <tr>
            <td><strong>4.</strong></td>
            <td><strong>Capacity of the Vacuum Pump to be used.</strong></td>
            <td>${formData.vacuumPumpCapacity || ""}</td>
            <td>${formData.vacuumPumpCapacityChecked || ""}</td>
          </tr>
          <tr>
            <td><strong>5.</strong></td>
            <td><strong>Whether the Reservoir is Available with valves and a breather.</strong></td>
            <td>${formData.reservoirAvailable || ""}</td>
            <td>${formData.reservoirAvailableChecked || ""}</td>
          </tr>
          <tr>
            <td><strong>6.</strong></td>
            <td><strong>Capacity of Reservoirs.</strong></td>
            <td>${formData.reservoirCapacity || ""}</td>
            <td>${formData.reservoirCapacityChecked || ""}</td>
          </tr>
          <tr>
            <td><strong>8.</strong></td>
            <td><strong>Hose Pipes for the Filtration Process.</strong></td>
            <td>${formData.hosePipes || ""}</td>
            <td>${formData.hosePipesChecked || ""}</td>
          </tr>
          <tr>
            <td><strong>9.</strong></td>
            <td><strong>Whether Crane is Available in good condition</strong></td>
            <td>${formData.craneAvailable || ""}</td>
            <td>${formData.craneAvailableChecked || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 30px; text-align: center;">SAFETY EQUIPMENT</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Descriptions</th>
            <th>Confirmation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Fire extinguisher/ Fire sand bucket</strong></td>
            <td>${formData.fireExtinguisher || ""}</td>
          </tr>
          <tr>
            <td><strong>First aid kit</strong></td>
            <td>${formData.firstAidKit || ""}</td>
          </tr>
          <tr>
            <td><strong>PPE for the working team of ETC agency, like- Safety shoes, Helmet, etc...</strong></td>
            <td>${formData.ppeEquipment || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 1 Form 4 - Pre-Erection Tan Delta and Capacitance Test on Bushing
function generateStage1Form4(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Pre-Erection Tan delta and capacitance test on bushing</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>METER USED:</strong></td>
            <td>${formData.meterUsed || ""}</td>
            <td><strong>DATE:</strong></td>
            <td>${formData.date || ""}</td>
            <td><strong>TIME:</strong></td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td>${formData.modelSrNo || ""}</td>
            <td><strong>WTI:</strong></td>
            <td>${formData.wti || ""}</td>
            <td><strong>OTI:</strong></td>
            <td>${formData.oti || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th rowspan="2">BUSHING SR.NO.</th>
            <th>1.1</th>
            <th>1.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>${formData.bushing11 || ""}</td>
            <td>${formData.bushing12 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 30px; text-align: center;">AT 05 KV PHASE</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>PHASE</th>
            <th>TAN DELTA %</th>
            <th>CAPACITANCE (pF)</th>
            <th>EXCITATION CURRENT (mA)</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1.1</strong></td>
            <td>${formData.bushing11_05kv_phase || ""}</td>
            <td>${formData.bushing11_05kv_tanDelta || ""}</td>
            <td>${formData.bushing11_05kv_capacitance || ""}</td>
            <td>${formData.bushing11_05kv_excitationCurrent || ""}</td>
            <td>${formData.bushing11_05kv_dielectricLoss || ""}</td>
          </tr>
          <tr>
            <td><strong>1.2</strong></td>
            <td>${formData.bushing12_05kv_phase || ""}</td>
            <td>${formData.bushing12_05kv_tanDelta || ""}</td>
            <td>${formData.bushing12_05kv_capacitance || ""}</td>
            <td>${formData.bushing12_05kv_excitationCurrent || ""}</td>
            <td>${formData.bushing12_05kv_dielectricLoss || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 30px; text-align: center;">AT 10 KV PHASE</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>PHASE</th>
            <th>TAN DELTA %</th>
            <th>CAPACITANCE (pF)</th>
            <th>EXCITATION CURRENT (mA)</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1.1</strong></td>
            <td>${formData.bushing11_10kv_phase || ""}</td>
            <td>${formData.bushing11_10kv_tanDelta || ""}</td>
            <td>${formData.bushing11_10kv_capacitance || ""}</td>
            <td>${formData.bushing11_10kv_excitationCurrent || ""}</td>
            <td>${formData.bushing11_10kv_dielectricLoss || ""}</td>
          </tr>
          <tr>
            <td><strong>1.2</strong></td>
            <td>${formData.bushing12_10kv_phase || ""}</td>
            <td>${formData.bushing12_10kv_tanDelta || ""}</td>
            <td>${formData.bushing12_10kv_capacitance || ""}</td>
            <td>${formData.bushing12_10kv_excitationCurrent || ""}</td>
            <td>${formData.bushing12_10kv_dielectricLoss || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 1 Form 5 - Record of Measurement of IR Values
function generateStage1Form5(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>RECORD OF MEASUREMENT OF IR VALUES</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Date :</strong></td>
            <td>${formData.date || ""}</td>
            <td><strong>Time:</strong></td>
            <td>${formData.time || ""}</td>
            <td colspan="2"><strong>Details of Insulation tester</strong></td>
          </tr>
          <tr>
            <td><strong>Amb. Temp :</strong></td>
            <td>${formData.ambTemp || ""}</td>
            <td><strong>Make :</strong></td>
            <td>${formData.make || ""}</td>
            <td rowspan="4"></td>
            <td rowspan="4"></td>
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

      <h4 style="margin-top: 30px;">IR Before erection - RANGE ONLY 1 KV</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>15 Sec MΩ</th>
            <th>60 Sec MΩ</th>
            <th>Ratio of IR 60/IR 15</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth15Sec || ""}</td>
            <td>${formData.hvEarth60Sec || ""}</td>
            <td>${formData.ratioIR60IR15 || ""}</td>
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

  // Generate filtration records rows
  const filtrationRows = (formData.filtrationRecords || Array(10).fill({})).map((record, index) => `
    <tr>
      <td>${record.date || ""}</td>
      <td>${record.time || ""}</td>
      <td>${record.vacuumLevel || ""}</td>
      <td>${record.inletTemp || ""}</td>
      <td>${record.outletTemp || ""}</td>
      <td>${record.remark || ""}</td>
    </tr>
  `).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>RECORD OF OIL HANDLING</h2>
        <h3>TEST VALUES PRIOR TO FILTERATION</h3>
      </div>

      <h4>Oil Filling in the Reservoirs Tank:</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>No of barrels</th>
            <th>Started on Date & time</th>
            <th>Completed on Date & time</th>
            <th>BDV</th>
            <th>MOISTURE CONTENT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tank1</strong></td>
            <td>${formData.tank1NoOfBarrels || ""}</td>
            <td>${formData.tank1StartedDateTime || ""}</td>
            <td>${formData.tank1CompletedDateTime || ""}</td>
            <td>${formData.tank1BDV || ""}</td>
            <td>${formData.tank1MoistureContent || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px;">RECORD FOR OIL FILTRATION IN RESERVOIR TANK</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level (mmHg or torr)</th>
            <th>Inlet Temp °C</th>
            <th>Outlet Temp °C</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          ${filtrationRows}
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 2 Form 2 - IR After Erection Stage 2 End
function generateStage2Form2(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>IR AFTER ERECTION TEMP OTI ........°C WTI............°C, AMB........°C</h2>
        <h3>RANGE ONLY 1 KV</h3>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td style="width: 33%;"><strong>OTI TEMPERATURE (°C):</strong></td>
            <td style="width: 33%;"><strong>WTI TEMPERATURE (°C):</strong></td>
            <td style="width: 33%;"><strong>AMB TEMPERATURE (°C):</strong></td>
          </tr>
          <tr>
            <td>${formData.tempOTI || ""}</td>
            <td>${formData.tempWTI || ""}</td>
            <td>${formData.tempAMB || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>15 Sec MΩ</th>
            <th>60 Sec MΩ</th>
            <th>Ratio of IR 60/IR 15</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth15Sec || ""}</td>
            <td>${formData.hvEarth60Sec || ""}</td>
            <td>${formData.ratioIR60IR15 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px;">Lead Clearance in mm:</h4>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>HV with respect to earth</strong></td>
            <td>${formData.hvWithRespectToEarth || ""}</td>
          </tr>
          <tr>
            <td><strong>LV with respect to earth</strong></td>
            <td>${formData.lvWithRespectToEarth || ""}</td>
          </tr>
          <tr>
            <td><strong>Neutral with respect to earth</strong></td>
            <td>${formData.neutralWithRespectToEarth || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 3 Form 1 - Before Oil Filling and Pressure Test Report
function generateStage3Form1(formData) {
  if (!formData) return "";

  // Generate pressure test records rows
  const pressureTestRows = (formData.pressureTestRecords || Array(6).fill({})).map((record, index) => `
    <tr>
      <td><strong>${index + 1}</strong></td>
      <td>${record.timeStarted || ""}</td>
      <td>${record.pressureKgCm2 || ""}</td>
      <td>${record.tempAmb || ""}</td>
      <td>${record.tempOTI || ""}</td>
      <td>${record.tempWTI || ""}</td>
    </tr>
  `).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Before oil filling of main tank</h2>
      </div>

      <div style="display: flex; gap: 20px; margin-bottom: 20px;">
        <div><strong>BDV:</strong> ${formData.bdvKV || "_____"} KV</div>
        <div><strong>Water Content:</strong> ${formData.waterContentPPM || "_______"} PPM</div>
      </div>

      <h4 style="margin-top: 40px;">IR After oil Toping up to conservator Temp OTI ${formData.tempOTI || "........"}°C WTI ${formData.tempWTI || "...."}°C, AMB ${formData.tempAMB || ".........."}°C, RANGE ONLY 1 KV</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>15 Sec MΩ</th>
            <th>60 Sec MΩ</th>
            <th>Ratio of IR 60/IR 15</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth15Sec || ""}</td>
            <td>${formData.hvEarth60Sec || ""}</td>
            <td>${formData.ratioIR60IR15 || ""}</td>
          </tr>
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: center; margin: 40px 0 20px 0;">
        <h4>PRESSURE TEST REPORT</h4>
        <div><strong>Date:</strong> ${formData.pressureTestDate || ""}</div>
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

// Generate Stage 3 Form 2 - Record for Oil Filtration Main Tank
function generateStage3Form2(formData) {
  if (!formData) return "";

  // Generate filtration records rows
  const filtrationRows = (formData.filtrationRecords || Array(15).fill({})).map((record, index) => `
    <tr>
      <td>${record.date || ""}</td>
      <td>${record.time || ""}</td>
      <td>${record.vacuumLevel || ""}</td>
      <td>${record.mcOutletTemp || ""}</td>
      <td>${record.otiTemp || ""}</td>
      <td>${record.wtiTemp || ""}</td>
      <td>${record.remark || ""}</td>
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
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          ${filtrationRows}
        </tbody>
      </table>

      <h4 style="margin-top: 40px;">IR Value before radiators/combine filtration, Temp OTI ${formData.tempOTI || "........"}°C WTI ${formData.tempWTI || "............"}°C, AMB ${formData.tempAMB || "........"}°C RANGE ONLY 1 KV</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>15 Sec MΩ</th>
            <th>60 Sec MΩ</th>
            <th>Ratio of IR 60/IR 15</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth15Sec || ""}</td>
            <td>${formData.hvEarth60Sec || ""}</td>
            <td>${formData.ratioIR60IR15 || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 3 Form 3 - Oil Filtration of Radiator and Combine
function generateStage3Form3(formData) {
  if (!formData) return "";

  // Generate radiator filtration records rows
  const radiatorRows = (formData.radiatorRecords || Array(5).fill({})).map((record, index) => `
    <tr>
      <td>${record.date || ""}</td>
      <td>${record.time || ""}</td>
      <td>${record.vacuumLevel || ""}</td>
      <td>${record.mcOutletTemp || ""}</td>
      <td>${record.otiTemp || ""}</td>
      <td>${record.wtiTemp || ""}</td>
      <td>${record.remark || ""}</td>
    </tr>
  `).join("");

  // Generate combine filtration records rows
  const combineRows = (formData.combineRecords || Array(5).fill({})).map((record, index) => `
    <tr>
      <td>${record.date || ""}</td>
      <td>${record.time || ""}</td>
      <td>${record.vacuumLevel || ""}</td>
      <td>${record.mcOutletTemp || ""}</td>
      <td>${record.otiTemp || ""}</td>
      <td>${record.wtiTemp || ""}</td>
      <td>${record.remark || ""}</td>
    </tr>
  `).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>Oil filtration of Radiator</h2>
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
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          ${radiatorRows}
        </tbody>
      </table>

      <h4 style="margin-top: 40px;">Oil filtration of Combine (Main Tank + Cooler bank)</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level (mmHg or torr)</th>
            <th>M/C Outlet Temp °C</th>
            <th>OTI Temp °C</th>
            <th>WTI Temp °C</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          ${combineRows}
        </tbody>
      </table>

      <h4 style="margin-top: 40px;">After Oil Filtration of main tank</h4>

      <div style="display: flex; gap: 20px; margin-bottom: 20px;">
        <div><strong>BDV:</strong> ${formData.bdvKV || "_____"} KV</div>
        <div><strong>Water Content:</strong> ${formData.waterContentPPM || "_______"} PPM</div>
      </div>

      <h4 style="margin-top: 40px;">PI Value after filteration, Temp OTI ${formData.tempOTI || "........"}°C WTI ${formData.tempWTI || "............"}°C, AMB ${formData.tempAMB || "........"}°C RANGE ONLY 5 KV</h4>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>15 Sec MΩ</th>
            <th>60 Sec MΩ</th>
            <th>600 sec MΩ</th>
            <th>600/60 sec MΩ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth15Sec || ""}</td>
            <td>${formData.hvEarth60Sec || ""}</td>
            <td>${formData.hvEarth600Sec || ""}</td>
            <td>${formData.hvEarth60600Sec || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 4 Form 1 - SFRA Test Record (matching frontend UI exactly)
function generateStage4Form1(formData) {
  if (!formData) return "";

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
            <td><strong>OTI</strong></td>
            <td>${formData.oti || ""}°C</td>
            <td><strong>WTI</strong></td>
            <td>${formData.wti || ""}°C</td>
          </tr>
          <tr>
            <td><strong>Test report reviewed by</strong></td>
            <td>${formData.testReportReviewed || ""}</td>
            <td><strong>Acceptance of the test</strong></td>
            <td>${formData.acceptanceOfTest || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px; text-align: center;">Tan delta and capacitance test on bushing</h4>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>METER USED</strong></td>
            <td>${formData.meterUsedBushing || ""}</td>
            <td><strong>DATE:</strong></td>
            <td>${formData.dateBushing || ""}</td>
            <td><strong>TIME :</strong></td>
            <td>${formData.timeBushing || ""}</td>
          </tr>
          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td>${formData.modelSrNoBushing || ""}</td>
            <td><strong>WTI:</strong></td>
            <td>${formData.wtiBushing || ""}</td>
            <td><strong>OTI:</strong></td>
            <td>${formData.otiBushing || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th rowspan="2"></th>
            <th rowspan="2">AT 05 KV PHASE</th>
            <th>TAN DELTA %</th>
            <th>CAPACITANCE (pF)</th>
            <th>EXCITATION CURRENT (mA)</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1.1</strong></td>
            <td>${formData.bushing11_05kv_phase || ""}</td>
            <td>${formData.bushing11_05kv_tanDelta || ""}</td>
            <td>${formData.bushing11_05kv_capacitance || ""}</td>
            <td>${formData.bushing11_05kv_excitationCurrent || ""}</td>
            <td>${formData.bushing11_05kv_dielectricLoss || ""}</td>
          </tr>
          <tr>
            <td><strong>1.2</strong></td>
            <td>${formData.bushing12_05kv_phase || ""}</td>
            <td>${formData.bushing12_05kv_tanDelta || ""}</td>
            <td>${formData.bushing12_05kv_capacitance || ""}</td>
            <td>${formData.bushing12_05kv_excitationCurrent || ""}</td>
            <td>${formData.bushing12_05kv_dielectricLoss || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th rowspan="2"></th>
            <th rowspan="2">AT 10 KV PHASE</th>
            <th>TAN DELTA %</th>
            <th>CAPACITANCE (pF)</th>
            <th>EXCITATION CURRENT (mA)</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1.1</strong></td>
            <td>${formData.bushing11_10kv_phase || ""}</td>
            <td>${formData.bushing11_10kv_tanDelta || ""}</td>
            <td>${formData.bushing11_10kv_capacitance || ""}</td>
            <td>${formData.bushing11_10kv_excitationCurrent || ""}</td>
            <td>${formData.bushing11_10kv_dielectricLoss || ""}</td>
          </tr>
          <tr>
            <td><strong>1.2</strong></td>
            <td>${formData.bushing12_10kv_phase || ""}</td>
            <td>${formData.bushing12_10kv_tanDelta || ""}</td>
            <td>${formData.bushing12_10kv_capacitance || ""}</td>
            <td>${formData.bushing12_10kv_excitationCurrent || ""}</td>
            <td>${formData.bushing12_10kv_dielectricLoss || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px; text-align: center;">Tan delta and capacitance test on winding</h4>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>METER USED</strong></td>
            <td>${formData.meterUsedWinding || ""}</td>
            <td><strong>DATE:</strong></td>
            <td>${formData.dateWinding || ""}</td>
            <td><strong>TIME :</strong></td>
            <td>${formData.timeWinding || ""}</td>
          </tr>
          <tr>
            <td><strong>MAKE & S. NO.</strong></td>
            <td>${formData.makeSrNoWinding || ""}</td>
            <td><strong>AMBIENT TEMP</strong></td>
            <td>${formData.ambientTempWinding || ""}</td>
            <td><strong>OIL TEMP</strong></td>
            <td>${formData.oilTempWinding || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>AT 05 KV IN BETWEEN</th>
            <th>TAN DELTA %</th>
            <th>CAPACITANCE (pF)</th>
            <th>EXCITATION CURRENT (mA)</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV – G</strong></td>
            <td>${formData.hvg_05kv_phase || ""}</td>
            <td>${formData.hvg_05kv_tanDelta || ""}</td>
            <td>${formData.hvg_05kv_capacitance || ""}</td>
            <td>${formData.hvg_05kv_excitationCurrent || ""}</td>
            <td>${formData.hvg_05kv_dielectricLoss || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>AT 10 KV IN BETWEEN</th>
            <th>TAN DELTA %</th>
            <th>CAPACITANCE (pF)</th>
            <th>EXCITATION CURRENT (mA)</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV – G</strong></td>
            <td>${formData.hvg_10kv_phase || ""}</td>
            <td>${formData.hvg_10kv_tanDelta || ""}</td>
            <td>${formData.hvg_10kv_capacitance || ""}</td>
            <td>${formData.hvg_10kv_excitationCurrent || ""}</td>
            <td>${formData.hvg_10kv_dielectricLoss || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 4 Form 2 - Record of Measurement of IR Values & Voltage Ratio Test (matching frontend UI exactly)
function generateStage4Form2(formData) {
  if (!formData) return "";

  // Generate voltage ratio test rows
  const voltageRatioRows = (formData.voltageRatioTests || [
    { appliedVoltage: "1.1 – 1.2", measuredVoltage11_21: "", measuredVoltage12_21: "" },
    { appliedVoltage: "1.1 – 2.1", measuredVoltage11_12: "", measuredVoltage12_21: "" },
    { appliedVoltage: "2.1 – 1.2", measuredVoltage11_12: "", measuredVoltage11_21: "" }
  ]).map((test, index) => `
    <tr>
      <td>${test.appliedVoltage || ""}</td>
      <td>${test.measuredVoltage11_21 || ""}</td>
      <td>${test.measuredVoltage12_21 || ""}</td>
    </tr>
  `).join("");

  // Generate magnetising test rows
  const magnetisingRows = (formData.magnetisingTests || [
    { appliedVoltage: "1.1 –1.2", appliedVoltageValue: "", measuredCurrent: "" },
    { appliedVoltage: "1.1 – 2.1", appliedVoltageValue: "", measuredCurrent: "" },
    { appliedVoltage: "2.1 – 1.2", appliedVoltageValue: "", measuredCurrent: "" }
  ]).map((test, index) => `
    <tr>
      <td><strong>${test.appliedVoltage}</strong></td>
      <td>${test.appliedVoltageValue || ""}</td>
      <td>${test.measuredCurrent || ""}</td>
    </tr>
  `).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>RECORD OF MEASUREMENT OF IR VALUES</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Date :</strong></td>
            <td>${formData.date || ""}</td>
            <td><strong>Time:</strong></td>
            <td>${formData.time || ""}</td>
            <td colspan="2"><strong>Details of Insulation tester</strong></td>
          </tr>
          <tr>
            <td><strong>Amb. Temp :</strong></td>
            <td>${formData.ambTemp || ""}</td>
            <td><strong>Make :</strong></td>
            <td>${formData.make || ""}</td>
            <td rowspan="4"></td>
            <td rowspan="4"></td>
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

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>15 Sec MΩ</th>
            <th>60 Sec MΩ</th>
            <th>Ratio of IR 60/10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth10Sec || ""}</td>
            <td>${formData.hvEarth60Sec || ""}</td>
            <td>${formData.ratioIR60IR10 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px; text-align: center;">VOLTAGE RATIO TEST</h4>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>1.1 - 1.2</th>
            <th>1.1 - 2.1</th>
            <th>1.2 - 2.1</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${formData.voltageRatioTest_table1_11_12 || ""}</td>
            <td>${formData.voltageRatioTest_table1_11_21 || ""}</td>
            <td>${formData.voltageRatioTest_table1_12_21 || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>1.1 - 2.1</th>
            <th>1.1 - 1.2</th>
            <th>2.1 - 1.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${formData.voltageRatioTest_table2_11_21_alt || ""}</td>
            <td>${formData.voltageRatioTest_table2_11_12_alt || ""}</td>
            <td>${formData.voltageRatioTest_table2_21_12 || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>2.1 - 1.2</th>
            <th>1.1 - 1.2</th>
            <th>1.1 - 2.1</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${formData.voltageRatioTest_table3_21_12_alt || ""}</td>
            <td>${formData.voltageRatioTest_table3_11_12_alt || ""}</td>
            <td>${formData.voltageRatioTest_table3_11_21_alt || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px; text-align: center;">TYPE OF TEST – MAGNETISING CURRENT TEST</h4>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>APPLIED VOLTAGE:</strong></td>
            <td>${formData.appliedVoltageMag || ""} VOLTS</td>
            <td><strong>DATE:</strong></td>
            <td>${formData.dateMag || ""}</td>
            <td><strong>TIME:</strong></td>
            <td>${formData.timeMag || ""}</td>
          </tr>
          <tr>
            <td><strong>METER MAKE SR. NO.</strong></td>
            <td colspan="5">${formData.meterMakeSrNoMag || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Connection</th>
            <th>Applied Voltage (V)</th>
            <th>Measured Current (mA)</th>
          </tr>
        </thead>
        <tbody>
          ${magnetisingRows}
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 4 Form 3 - Short Circuit Test (matching frontend UI exactly)
function generateStage4Form3(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TYPE OF TEST – SHORT CIRCUIT TEST</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>APPLIED VOLTAGE:</strong></td>
            <td>${formData.appliedVoltage || ""} VOLTS</td>
            <td><strong>DATE:</strong></td>
            <td>${formData.date || ""}</td>
            <td><strong>TIME :</strong></td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>METER MAKE SR. NO.</strong></td>
            <td colspan="5">${formData.meterMakeSrNo || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>APPLIED VOLTAGE</th>
            <th colspan="2">Measured Current (mA)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1.1 – 1.2</strong></td>
            <td><strong>1.1</strong></td>
            <td><strong>1.2 – 2.1 SHORTED</strong></td>
          </tr>
          <tr>
            <td>${formData.test11_12_measuredCurrent11_23 || ""}</td>
            <td>${formData.test11_12_measuredCurrent11 || ""}</td>
            <td>${formData.test11_12_measuredCurrent12_21 || ""}</td>
          </tr>
          <tr>
            <td><strong>1.2 – 2.1</strong></td>
            <td><strong>1.2</strong></td>
            <td><strong>1.1 – 2.1 SHORTED</strong></td>
          </tr>
          <tr>
            <td>${formData.test12_21_measuredCurrent12_21 || ""}</td>
            <td>${formData.test12_21_measuredCurrent12 || ""}</td>
            <td>${formData.test12_21_measuredCurrent11_21 || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <tbody>
          <tr>
            <td rowspan="4"><strong>Impedance calculation</strong></td>
            <td><strong>Applied Voltage HV</strong></td>
            <td><strong>Rated Current LV</strong></td>
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
              <div style="display: flex; align-items: center; gap: 10px;">
                <span><strong>Rated voltage HV</strong></span>
                <span>${formData.ratedVoltageHV || ""}</span>
                <span><strong>Measured current LV</strong></span>
                <span>${formData.measuredCurrentLV || ""}</span>
              </div>
              <div style="text-align: center; margin-top: 10px;">
                <strong>%Z = ${formData.percentZ || ""}</strong>
              </div>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 4 Form 4 - Winding Resistance Test and Record of Measurement of IR & PI Values (matching frontend UI exactly)
function generateStage4Form4(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>TYPE OF TEST – WINDING RESISTANCE TEST</h2>
      </div>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>METER USED</strong></td>
            <td>${formData.meterUsed || ""}</td>
            <td><strong>DATE:</strong></td>
            <td>${formData.date || ""}</td>
            <td><strong>TIME :</strong></td>
            <td>${formData.time || ""}</td>
          </tr>
          <tr>
            <td><strong>METER MAKE SR. NO.</strong></td>
            <td>${formData.meterMakeSrNo || ""}</td>
            <td><strong>WTI:</strong></td>
            <td>${formData.wti || ""}</td>
            <td><strong>OTI:</strong></td>
            <td>${formData.oti || ""}</td>
          </tr>
          <tr>
            <td><strong>RANGE</strong></td>
            <td>${formData.range || ""}</td>
            <td><strong>AMBIENT:</strong></td>
            <td colspan="3">${formData.ambient || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 30px; text-align: center;">ALL MEASUREMENT IN OHMS (Ω)</h4>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>1.1 – 1.2</strong></td>
            <td>${formData.winding11_12 || ""}</td>
          </tr>
          <tr>
            <td><strong>1.1 - 2.1</strong></td>
            <td>${formData.winding11_21 || ""}</td>
          </tr>
          <tr>
            <td><strong>2.1 – 1.2</strong></td>
            <td>${formData.winding21_12 || ""}</td>
          </tr>
        </tbody>
      </table>

      <h4 style="margin-top: 40px; text-align: center;">RECORD OF MEASUREMENT OF IR & PI VALUES</h4>

      <table class="form-table">
        <tbody>
          <tr>
            <td><strong>Date :</strong></td>
            <td>${formData.dateIR || ""}</td>
            <td><strong>Time:</strong></td>
            <td>${formData.timeIR || ""}</td>
            <td colspan="2"><strong>Details of Insulation tester</strong></td>
          </tr>
          <tr>
            <td><strong>Amb. Temp :</strong></td>
            <td>${formData.ambTempIR || ""}</td>
            <td><strong>Make :</strong></td>
            <td>${formData.makeIR || ""}</td>
            <td rowspan="4"></td>
            <td rowspan="4"></td>
          </tr>
          <tr>
            <td><strong>Oil Temp. :</strong></td>
            <td>${formData.oilTempIR || ""}</td>
            <td><strong>Sr. No. :</strong></td>
            <td>${formData.srNoIR || ""}</td>
          </tr>
          <tr>
            <td><strong>Wdg. Temp. :</strong></td>
            <td>${formData.wdgTempIR || ""}</td>
            <td><strong>Range :</strong></td>
            <td>${formData.rangeIR || ""}</td>
          </tr>
          <tr>
            <td><strong>Relative Humidity :</strong></td>
            <td>${formData.relativeHumidityIR || ""}</td>
            <td><strong>Voltage Level :</strong></td>
            <td>${formData.voltageLevelIR || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>10 Sec MΩ</th>
            <th>60 Sec MΩ</th>
            <th>600 Sec MΩ</th>
            <th>Ratio of IR 60/IR 10</th>
            <th>Ratio of IR 600/60</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HV-Earth</strong></td>
            <td>${formData.hvEarth10Sec || ""}</td>
            <td>${formData.hvEarth60Sec || ""}</td>
            <td>${formData.hvEarth600Sec || ""}</td>
            <td>${formData.ratioIR60IR10 || ""}</td>
            <td>${formData.ratioIR600IR60 || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
      ${generateSignatureSection(formData.signatures)}
    </div>
  `;
}

// Generate Stage 5 Form 1 - Pre-Charging Check List (matching frontend UI exactly)
function generateStage5Form1(formData) {
  if (!formData) return "";

  // Valve Status Items (matching UI exactly)
  const valveStatusItems = [
    { id: "I", description: "Valve Status" },
    { id: "A", description: "Bucholz to Conservator" },
    { id: "B", description: "Main Tank to Bucholz" },
    { id: "C", description: "Radiator Top Valves" },
    { id: "D", description: "Radiator Bottom Valves" },
    { id: "E", description: "Top Filter Valve" },
    { id: "F", description: "Bottom Filter Valve" },
    { id: "G", description: "Drain Valve" },
  ];

  // Air Venting Items (matching UI exactly)
  const airVentingItems = [
    { id: "1", description: "Main Tank" },
    { id: "2", description: "Bucholz Relay" },
    { id: "3", description: "HV Bushing" },
    { id: "4", description: "LV Bushing" },
    { id: "5", description: "Neutral Bushing" },
    { id: "6", description: "Radiator – Top" },
  ];

  // Protection Trails Items (matching UI exactly)
  const protectionTrailsItems = [
    { id: "1", description: "Buchholz checked by oil draining", type: "ALARM" },
    { id: "1b", description: "Buchholz checked by oil draining", type: "TRIP" },
    { id: "2", description: "MOG", type: "ALARM" },
    { id: "3", description: "PRV MAIN TANK", type: "TRIP" },
    { id: "4", description: "OTI", type: "ALARM" },
    { id: "4b", description: "OTI", type: "TRIP" },
    { id: "5", description: "WTI", type: "ALARM" },
    { id: "5b", description: "WTI", type: "TRIP" },
  ];

  // Generate Valve Status rows
  const valveStatusRows = valveStatusItems.map(item => {
    const qty = formData.valveStatus?.[item.id]?.qty || "";
    const status = formData.valveStatus?.[item.id]?.status || "";
    return `
      <tr>
        <td><strong>${item.id}</strong></td>
        <td><strong>${item.description}</strong></td>
        <td>${qty}</td>
        <td>${status}</td>
        <td></td>
      </tr>
    `;
  }).join("");

  // Generate Air Venting rows
  const airVentingRows = airVentingItems.map(item => {
    const qty = formData.airVenting?.[item.id]?.qty || "";
    const status = formData.airVenting?.[item.id]?.status || "";
    return `
      <tr>
        <td><strong>${item.id}</strong></td>
        <td><strong>${item.description}</strong></td>
        <td>${qty}</td>
        <td>${status}</td>
        <td></td>
      </tr>
    `;
  }).join("");

  // Generate Protection Trails rows
  const protectionTrailsRows = protectionTrailsItems.map(item => {
    const checked = formData.protectionTrails?.[`${item.id}-${item.type}`]?.checked || "";
    return `
      <tr>
        <td><strong>${item.id}</strong></td>
        <td><strong>${item.description}</strong></td>
        <td><strong>${item.type}</strong></td>
        <td>${checked}</td>
        <td></td>
      </tr>
    `;
  }).join("");

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>PRE-CHARGING CHECK LIST</h2>
      </div>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th>Sr.N.</th>
            <th>Particulars</th>
            <th>Qty.</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${valveStatusRows}
          <tr>
            <td><strong>II</strong></td>
            <td><strong>Air Venting Done from Following Locations:</strong></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          ${airVentingRows}
          <tr>
            <td><strong>III</strong></td>
            <td><strong>Protection Trails</strong></td>
            <td></td>
            <td><strong>Checked</strong></td>
            <td></td>
          </tr>
          ${protectionTrailsRows}
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <tbody>
          <tr>
            <td></td>
            <td><strong>TRIP</strong></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><strong>IV</strong></td>
            <td><strong>Bushing Test Tap</strong></td>
            <td><strong>HV</strong></td>
            <td><strong>LV</strong></td>
          </tr>
          <tr>
            <td></td>
            <td><strong>Test Cap Earthed</strong></td>
            <td>${formData.bushingTestTap?.hvTestCapEarthed || ""}</td>
            <td>${formData.bushingTestTap?.lvTestCapEarthed || ""}</td>
          </tr>
        </tbody>
      </table>

      ${generatePhotoThumbnails(formData.photos)}
    </div>
  `;
}

// Generate Stage 5 Form 2 - Pre-Charging Check List Part 2 (matching frontend UI exactly)
function generateStage5Form2(formData) {
  if (!formData) return "";

  return `
    <div class="form-container">
      <div class="company-header">
        <h2>PRE-CHARGING CHECK LIST - PART 2</h2>
      </div>

      <table class="form-table">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>Oil Values</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>V</strong></td>
            <td><strong>BDV</strong></td>
            <td>${formData.bdvKV || ""}</td>
            <td><strong>KV</strong></td>
          </tr>
          <tr>
            <td><strong>2</strong></td>
            <td><strong>Moisture Content</strong></td>
            <td>${formData.moistureContentPPM || ""}</td>
            <td><strong>PPM</strong></td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white;">
            <th></th>
            <th>Final IR Values</th>
            <th>15 sec MΩ</th>
            <th>60 sec MΩ</th>
            <th>600 sec MΩ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>VI</strong></td>
            <td><strong>HV – E</strong></td>
            <td>${formData.hvEarth15Sec || ""}</td>
            <td>${formData.hvEarth60Sec || ""}</td>
            <td>${formData.hvEarth600Sec || ""}</td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <tbody>
          <tr>
            <td><strong>VII</strong></td>
            <td><strong>Oil Level of conservator</strong></td>
            <td>${formData.oilLevelConservator || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>VIII</strong></td>
            <td><strong>HV Jumpers connected</strong></td>
            <td>${formData.hvJumpersConnected || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>IX</strong></td>
            <td><strong>LV Jumpers connected</strong></td>
            <td>${formData.lvJumpersConnected || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>X</strong></td>
            <td><strong>Incoming LA Counter</strong></td>
            <td>${formData.incomingLACounter || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>XI</strong></td>
            <td><strong>Outgoing LA Counter</strong></td>
            <td>${formData.outgoingLACounter || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>XII</strong></td>
            <td><strong>All CT Cable Terminated and Glands Sealed</strong></td>
            <td>${formData.allCTCableTerminated || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>XIII</strong></td>
            <td><strong>Protection relays checked through breaker tripping</strong></td>
            <td>${formData.protectionRelaysChecked || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>1</strong></td>
            <td><strong>Anabond applied to HV Bushings</strong></td>
            <td>${formData.anabondAppliedHVBushings || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>2</strong></td>
            <td><strong>All joints properly sealed against Water Ingress</strong></td>
            <td>${formData.allJointsSealed || ""}</td>
            <td></td>
          </tr>
          <tr>
            <td><strong>3</strong></td>
            <td><strong>All Foreign material cleared from Transformer</strong></td>
            <td>${formData.allForeignMaterialCleared || ""}</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table class="form-table" style="margin-top: 20px;">
        <tbody>
          <tr>
            <td><strong>Temperature of</strong></td>
            <td><strong>°C</strong></td>
            <td><strong>WTI</strong></td>
            <td>${formData.temperatureWTI || ""}</td>
            <td><strong>OTI</strong></td>
            <td>${formData.temperatureOTI || ""}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 30px;">
        <h4><strong>Remarks:</strong></h4>
        <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px; min-height: 100px; background: #f7fafc;">
          ${formData.remarks || "The Transformer as mentioned above has been jointly cleared for charging. All the necessary pre-commissioning checks and protection trials have been found satisfactory. Transformer has been cleared from all foreign material and is ready for charging."}
        </div>
      </div>

      ${generatePhotoThumbnails(formData.photos)}
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
      else if (stageNumber === 3 && formKey === "form2") {
        content += generateStage3Form2(formData);
      }
      else if (stageNumber === 3 && formKey === "form3") {
        content += generateStage3Form3(formData);
      }
      // Stage 4 Forms
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
    @media print {
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .form-table { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="content-page">
    ${headerHtml}
    <h2 style="text-align:center;color:#1e3a8a;margin:20px 0;">Unloading Checklist — Stage 0</h2>
    <h3 style="text-align:center;color:#374151;margin-bottom:20px;">${projectName} — ${companyName}</h3>
    ${form1}
  </div>
  <div class="content-page">
    ${headerHtml}
    ${form2}
  </div>
  <div class="content-page">
    ${headerHtml}
    ${form3}
  </div>
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
  if (data.autoTransformerData) {
    for (let i = 0; i <= 7; i++) {
      const stageKey = `stage${i}`;
      if (data.autoTransformerData[stageKey]) {
        stagesContent += generateStageContent(data.autoTransformerData[stageKey], i, headerImage);
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
          ${data.autoTransformerData && data.autoTransformerData.stage6 && data.autoTransformerData.stage6.form1 ? 
            (() => {
              const stage6Data = data.autoTransformerData.stage6.form1;
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
