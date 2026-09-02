import React from 'react';
import { BACKEND_API_BASE_URL, BACKEND_IMG_API_BASE_URL } from './constant';

// ─── STAGE 0 — Unloading Checklist Review ────────────────────────────────────

const UNLOADING_STATUS_OPTIONS_REVIEW = ["", "OK", "Not OK", "NA"];

// Helper: render a single checklist row in read-only mode
const UnloadingRowReview = ({ label, rowData }) => {
  const d = rowData || {};
  return (
    <tr>
      <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{label}</td>
      <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
        <input type="text" value={d.status || ""} disabled className="form-input disabled preview" />
      </td>
      <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
        <input type="text" value={d.remarks || ""} disabled className="form-input disabled preview" />
      </td>
      <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
        <input type="date" value={d.date || ""} disabled className="form-input disabled preview" />
      </td>
      <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
        <input type="text" value={d.checkedBy || ""} disabled className="form-input disabled preview" />
      </td>
    </tr>
  );
};

// Stage 0 Form 1: Site Condition at Time of Unloading
const Stage0Form1 = ({ formData }) => (
  <div>
    <h4 style={{ marginBottom: "12px" }}>SITE CONDITION AT TIME OF UNLOADING</h4>
    <table className="form-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>VPES Representative</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.vpesRepresentative || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Date</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Customer Representative</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.customerRepresentative || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Contact No.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.contactNo || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>
    <h5 style={{ marginBottom: "8px" }}>Check Points</h5>
    <table className="form-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Check Point</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Status</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Remarks</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Date</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Checked By</th>
        </tr>
      </thead>
      <tbody>
        <UnloadingRowReview label="Route condition" rowData={formData.routeCondition} />
        <UnloadingRowReview label="Site condition" rowData={formData.siteCondition} />
        <UnloadingRowReview label="Approach road" rowData={formData.approachRoad} />
        <UnloadingRowReview label="Boundary wall" rowData={formData.boundaryWall} />
        <UnloadingRowReview label="Security guard" rowData={formData.securityGuard} />
      </tbody>
    </table>
    <div style={{ display: "flex", gap: "40px", marginTop: "16px" }}>
      <div>
        <strong>VPES Signature Date:</strong>{" "}
        <input type="date" value={formData.vpesSignatureDate || ""} disabled className="form-input disabled preview" />
      </div>
      <div>
        <strong>Customer Signature Date:</strong>{" "}
        <input type="date" value={formData.customerSignatureDate || ""} disabled className="form-input disabled preview" />
      </div>
    </div>
  </div>
);

// Stage 0 Form 2: Main Tank Checklist
const Stage0Form2 = ({ formData }) => {
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
  return (
    <div>
      <h4 style={{ marginBottom: "12px" }}>MAIN TANK CHECKLIST</h4>
      <table className="form-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Checklist Item</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Status</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Remarks</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Date</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Checked By</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, key }) => (
            <UnloadingRowReview key={key} label={label} rowData={formData[key]} />
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: "40px", marginTop: "16px" }}>
        <div>
          <strong>VPES Signature Date:</strong>{" "}
          <input type="date" value={formData.vpesSignatureDate || ""} disabled className="form-input disabled preview" />
        </div>
        <div>
          <strong>Representative Signature Date:</strong>{" "}
          <input type="date" value={formData.representativeSignatureDate || ""} disabled className="form-input disabled preview" />
        </div>
      </div>
    </div>
  );
};

// Stage 0 Form 3: Protocol for Accessories Checking
const Stage0Form3 = ({ formData }) => {
  const FIXED_ACCESSORIES = [
    "TR Wheels", "HV Bushings", "LV Bushings", "Neutral Bushings",
    "Turrets", "Radiators", "Conservator", "Conservator Frame",
    "Pipelines/RFBD", "Fan Frame", "Fan Frame Support", "Accessories Boxes",
  ];
  const inventory = formData.accessoriesInventory || [];
  return (
    <div>
      <h4 style={{ marginBottom: "12px" }}>PROTOCOL FOR ACCESSORIES CHECKING</h4>
      <table className="form-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Checklist Item</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Status</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Remarks</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Date</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Checked By</th>
          </tr>
        </thead>
        <tbody>
          <UnloadingRowReview label="Accessories unloading point" rowData={formData.accessoriesUnloadingPoint} />
          <UnloadingRowReview label="Date of Unloading" rowData={formData.dateOfUnloading} />
          <UnloadingRowReview label="Storage Photos" rowData={formData.storagePhotos} />
        </tbody>
      </table>
      <h5 style={{ marginBottom: "8px" }}>Accessories Inventory</h5>
      <table className="form-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>No</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Packing Case No.</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Material Description</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Qty as per Challan</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Qty as Received</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Date</th>
            <th style={{ border: "1px solid #e5e7eb", padding: "8px", background: "#f3f4f6" }}>Checked By</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((row, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #e5e7eb", padding: "8px", textAlign: "center" }}>{i + 1}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                <input type="text" value={row.packingCaseNumber || ""} disabled className="form-input disabled preview" />
              </td>
              <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                <strong>{row.materialDescription || ""}</strong>
              </td>
              <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                <input type="text" value={row.qtyAsPerChallan || ""} disabled className="form-input disabled preview" />
              </td>
              <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                <input type="text" value={row.qtyAsReceived || ""} disabled className="form-input disabled preview" />
              </td>
              <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                <input type="date" value={row.date || ""} disabled className="form-input disabled preview" />
              </td>
              <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
                <input type="text" value={row.checkedBy || ""} disabled className="form-input disabled preview" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {formData.remark && (
        <div style={{ marginBottom: "16px" }}>
          <strong>Remark:</strong>
          <p style={{ marginTop: "4px", padding: "8px", background: "#f9fafb", borderRadius: "4px" }}>{formData.remark}</p>
        </div>
      )}
      <div style={{ display: "flex", gap: "40px", marginTop: "16px" }}>
        <div>
          <strong>VPES Signature Date:</strong>{" "}
          <input type="date" value={formData.vpesSignatureDate || ""} disabled className="form-input disabled preview" />
        </div>
        <div>
          <strong>Customer Signature Date:</strong>{" "}
          <input type="date" value={formData.customerSignatureDate || ""} disabled className="form-input disabled preview" />
        </div>
      </div>
    </div>
  );
};

// Stage 0 Review Renderer
const Stage0ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage0Forms = [
    { title: "Form 1 — Site Condition at Time of Unloading", Component: Stage0Form1, key: "form1" },
    { title: "Form 2 — Main Tank Checklist", Component: Stage0Form2, key: "form2" },
    { title: "Form 3 — Protocol for Accessories Checking", Component: Stage0Form3, key: "form3" },
  ];
  return (
    <div>
      <h3 style={{ marginBottom: "20px", color: "#1e3a8a" }}>Unloading Checklist — Stage 0 Review</h3>
      {stage0Forms.map(({ title, Component, key }) => {
        const formData = formDataFromDB?.[key] || {};
        return (
          <div key={key} style={{ marginBottom: "32px", padding: "20px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
            <h4 style={{ marginBottom: "16px", color: "#374151", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>{title}</h4>
            <Component formData={formData} />
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

// Stage 1 Form 1: Name Plate Details Transformer
const Stage1Form1 = ({ formData }) => (
  <table className="form-table" style={{
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px"
  }}>
    <tbody>
      <tr>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>MAKE</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.make || ""} disabled className="form-input disabled preview" />
        </td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>CURRENT HV (A)</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.currentHV || ""} disabled className="form-input disabled preview" />
        </td>
      </tr>
      <tr>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>SR. NO.</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.srNo || ""} disabled className="form-input disabled preview" />
        </td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>LV (A)</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.currentLV || ""} disabled className="form-input disabled preview" />
        </td>
      </tr>
      <tr>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>MVA Rating</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.mvaRating || ""} disabled className="form-input disabled preview" />
        </td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Temp. Rise over amb. In Oil °C</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.tempRiseOil || ""} disabled className="form-input disabled preview" />
        </td>
      </tr>
      <tr>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV (KV)</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.hvKv || ""} disabled className="form-input disabled preview" />
        </td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Winding</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.winding || ""} disabled className="form-input disabled preview" />
        </td>
      </tr>
      <tr>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>LV (KV)</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.lvKv || ""} disabled className="form-input disabled preview" />
        </td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Transporting weight</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.transportingWeight || ""} disabled className="form-input disabled preview" />
        </td>
      </tr>
      <tr>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>% Impedance</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.impedancePercent || ""} disabled className="form-input disabled preview" />
        </td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>No. Of radiators</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.noOfRadiators || ""} disabled className="form-input disabled preview" />
        </td>
      </tr>
      <tr>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Year of Mfg.</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.yearOfMfg || ""} disabled className="form-input disabled preview" />
        </td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Weight of Core & Winding.</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.weightCoreWinding || ""} disabled className="form-input disabled preview" />
        </td>
      </tr>
      <tr>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Oil Quantity in liter</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.oilQuantityLiter || ""} disabled className="form-input disabled preview" />
        </td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Total Weight</td>
        <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
          <input type="text" value={formData.totalWeight || ""} disabled className="form-input disabled preview" />
        </td>
      </tr>
    </tbody>
  </table>
);

// Stage 1 Form 2: Protocol for Accessories Checking
const Stage1Form2 = ({ formData }) => (
  <table className="form-table" style={{
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px"
  }}>
    <thead>
      <tr>
        <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>No</th>
        <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Packing case Number</th>
        <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Material Description</th>
        <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Qty as per P. L.</th>
        <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Qty. Received</th>
        <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Short Qty</th>
        <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Damaged Qty.</th>
      </tr>
    </thead>
    <tbody>
      {[
        { id: 1, description: "HV bushing" },
        { id: 2, description: "LV Bushing" },
        { id: 3, description: "Neutral bushing" },
        { id: 4, description: "Buchholz" },
        { id: 5, description: "PRV" },
        { id: 6, description: "CPR" },
        { id: 7, description: "Breather" },
        { id: 8, description: "Bushing Connector" },
        { id: 9, description: "Radiators" },
      ].map((item) => (
        <tr key={item.id}>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{item.id}</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input 
              type="text" 
              value={formData.accessories?.[item.id]?.packingCase || ""} 
              disabled 
              className="form-input disabled preview" 
            />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{item.description}</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input 
              type="text" 
              value={formData.accessories?.[item.id]?.qtyPerPL || ""} 
              disabled 
              className="form-input disabled preview" 
            />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input 
              type="text" 
              value={formData.accessories?.[item.id]?.qtyReceived || ""} 
              disabled 
              className="form-input disabled preview" 
            />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input 
              type="text" 
              value={formData.accessories?.[item.id]?.shortQty || ""} 
              disabled 
              className="form-input disabled preview" 
            />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input 
              type="text" 
              value={formData.accessories?.[item.id]?.damagedQty || ""} 
              disabled 
              className="form-input disabled preview" 
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Stage 1 Form 3: Core Insulation Check
const Stage1Form3 = ({ formData }) => (
  <div>
    {/* Core Insulation Check Table */}
    <h4 style={{ textAlign: "center", margin: "20px 0" }}>CORE INSULATION CHECK: At 1 KV &gt; 500 MΩ</h4>
    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Obtained Value (MΩ)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Remarks</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Between Core – frame</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.betweenCoreFrame || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.betweenCoreFrameRemarks || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Between Frame – tank</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.betweenFrameTank || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.betweenFrameTankRemarks || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Between core – tank</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.betweenCoreTank || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.betweenCoreTankRemarks || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Checklist for Equipment Table */}
    <h4 style={{ textAlign: "center", margin: "40px 0 20px 0" }}>CHECKLIST FOR CONFORMING AVAILABILITY OF EQUIPMENT AT SITE</h4>
    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Description</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Rating/capacity</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Checked by</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>2.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Whether the Filter Machine is Available</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.filterMachine || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.filterMachineChecked || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>3.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Capacity of Filter Machine</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.filterCapacity || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.filterCapacityChecked || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>4.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Capacity of the Vacuum Pump to be used.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.vacuumPumpCapacity || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.vacuumPumpCapacityChecked || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>5.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Whether the Reservoir is Available with valves and a breather.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.reservoirAvailable || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.reservoirAvailableChecked || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>6.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Capacity of Reservoirs.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.reservoirCapacity || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.reservoirCapacityChecked || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>8.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Hose Pipes for the Filtration Process.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hosePipes || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hosePipesChecked || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>9.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Whether Crane is Available in good condition</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.craneAvailable || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.craneAvailableChecked || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Safety Equipment Table */}
    <h4 style={{ textAlign: "center", margin: "30px 0 20px 0" }}>SAFETY EQUIPMENT</h4>
    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Descriptions</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Confirmation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Fire extinguisher/ Fire sand bucket</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.fireExtinguisher || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>First aid kit</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.firstAidKit || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>PPE for the working team of ETC agency, like- Safety shoes, Helmet, etc...</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ppeEquipment || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Stage 1 Form 4: Pre-Erection Tan Delta and Capacitance Test on Bushing
const Stage1Form4 = ({ formData }) => (
  <div>
    {/* Basic Information Table */}
    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>METER USED:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.meterUsed || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>DATE:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>TIME:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="time" value={formData.time || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>MODEL & S. NO.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.modelSrNo || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>WTI:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.wti || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>OTI:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.oti || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Bushing Serial Numbers Table */}
    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} rowSpan="2">BUSHING SR.NO.</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>1.1</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>1.2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11 || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    {/* AT 05 KV PHASE Table */}
    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} rowSpan="2"></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} rowSpan="2">AT 05 KV PHASE</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>TAN DELTA %</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>CAPACITANCE (pF)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>EXCITATION CURRENT (mA)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>DIELECTRIC LOSS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.1</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_05kv_phase || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_05kv_tanDelta || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_05kv_capacitance || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_05kv_excitationCurrent || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_05kv_dielectricLoss || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.2</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_05kv_phase || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_05kv_tanDelta || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_05kv_capacitance || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_05kv_excitationCurrent || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_05kv_dielectricLoss || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    {/* AT 10 KV PHASE Table */}
    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} rowSpan="2"></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} rowSpan="2">AT 10 KV PHASE</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>TAN DELTA %</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>CAPACITANCE (pF)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>EXCITATION CURRENT (mA)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>DIELECTRIC LOSS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.1</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_10kv_phase || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_10kv_tanDelta || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_10kv_capacitance || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_10kv_excitationCurrent || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_10kv_dielectricLoss || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.2</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_10kv_phase || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_10kv_tanDelta || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_10kv_capacitance || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_10kv_excitationCurrent || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_10kv_dielectricLoss || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Stage 1 Form 5: Record of Measurement of IR Values
const Stage1Form5 = ({ formData }) => (
  <div>
    {/* Basic Information Table */}
    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Date</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Time</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="time" value={formData.time || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Amb. Temp</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ambTemp || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Make</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.make || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Oil Temp.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.oilTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Sr. No.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.srNo || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Wdg. Temp.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.wdgTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Range</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.range || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Relative Humidity</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.relativeHumidity || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Voltage Level</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }} colSpan="5">
            <input type="text" value={formData.voltageLevel || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    {/* IR Values Measurement Table */}
    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>15 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>60 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Ratio of IR 60/IR 15</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV-Earth</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth15Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth60Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ratioIR60IR15 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Stage 2 Form 1: Record of Oil Handling
const Stage2Form1 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>RECORD OF OIL HANDLING</h2>
      <h2>TEST VALUES PRIOR TO FILTERATION</h2>
    </div>

    <h4>Oil Filling in the Reservoirs Tank:</h4>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>No of barrels</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Started on Date & time</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Completed on Date & time</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>BDV</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>MOISTURE CONTENT</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <strong>Tank1</strong>
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.tank1NoOfBarrels || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="datetime-local" value={formData.tank1StartedDateTime || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="datetime-local" value={formData.tank1CompletedDateTime || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.tank1BDV || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.tank1MoistureContent || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px" }}>
      RECORD FOR OIL FILTRATION IN RESERVOIR TANK
    </h4>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Date</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Time</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Vacuum Level (mmHg or torr)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Inlet Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Outlet Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Remark</th>
        </tr>
      </thead>
      <tbody>
        {formData.filtrationRecords && formData.filtrationRecords.map((record, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="date" value={record.date || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="time" value={record.time || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.vacuumLevel || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.inletTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.outletTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.remark || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Stage 2 Form 2: IR After Erection - Stage 2 End
const Stage2Form2 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>
        IR after erection Temp OTI ........°C WTI............°C, AMB........°C
        &nbsp;&nbsp;&nbsp;&nbsp; RANGE ONLY 1 KV
      </h2>
    </div>

    <div className="form-grid" style={{ marginBottom: "20px" }}>
      <div className="form-group">
        <label>OTI Temperature (°C):</label>
        <input
          type="text"
          value={formData.tempOTI || ""}
          disabled
          className="form-input disabled preview"
        />
      </div>
      <div className="form-group">
        <label>WTI Temperature (°C):</label>
        <input
          type="text"
          value={formData.tempWTI || ""}
          disabled
          className="form-input disabled preview"
        />
      </div>
      <div className="form-group">
        <label>AMB Temperature (°C):</label>
        <input
          type="text"
          value={formData.tempAMB || ""}
          disabled
          className="form-input disabled preview"
        />
      </div>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>15 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>60 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Ratio of IR 60/IR 15</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV-Earth</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth15Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth60Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ratioIR60IR15 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px" }}>Lead Clearance in mm: -</h4>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV with respect to earth</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input
              type="text"
              value={formData.hvWithRespectToEarth || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>LV with respect to earth</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input
              type="text"
              value={formData.lvWithRespectToEarth || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Neutral with respect to earth</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input
              type="text"
              value={formData.neutralWithRespectToEarth || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);


// Stage 3 Form 1: Before Oil Filling and Pressure Test Report
const Stage3Form1 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>Before oil filling of main tank</h2>
    </div>

    <div className="form-grid" style={{ marginBottom: "20px" }}>
      <div className="form-group">
        <label><strong>BDV: _____ KV</strong></label>
        <input type="text" value={formData.bdvKV || ""} disabled className="form-input disabled preview" />
      </div>
      <div className="form-group">
        <label><strong>Water Content: _______ PPM</strong></label>
        <input type="text" value={formData.waterContentPPM || ""} disabled className="form-input disabled preview" />
      </div>
    </div>

    <h4 style={{ marginTop: "40px" }}>
      IR After oil Toping up to conservator Temp OTI ........°C WTI....°C, AMB..........°C, RANGE ONLY 1 KV
    </h4>

    <div className="form-grid" style={{ marginBottom: "20px" }}>
      <div className="form-group">
        <label>OTI Temperature (°C):</label>
        <input type="text" value={formData.tempOTI || ""} disabled className="form-input disabled preview" />
      </div>
      <div className="form-group">
        <label>WTI Temperature (°C):</label>
        <input type="text" value={formData.tempWTI || ""} disabled className="form-input disabled preview" />
      </div>
      <div className="form-group">
        <label>AMB Temperature (°C):</label>
        <input type="text" value={formData.tempAMB || ""} disabled className="form-input disabled preview" />
      </div>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>15 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>60 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Ratio of IR 60/IR 15</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV-Earth</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth15Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth60Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ratioIR60IR15 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "40px 0 20px 0",
    }}>
      <h4>PRESSURE TEST REPORT</h4>
      <div className="form-group" style={{ margin: 0 }}>
        <label><strong>Date: -</strong></label>
        <input type="date" value={formData.pressureTestDate || ""} disabled className="form-input disabled preview" />
      </div>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Sr. No.</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>TIME STARTED</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>PRESSURE Kg/cm²</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} colSpan="3">TEMP°C</th>
        </tr>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Amb.</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>OTI</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>WTI</th>
        </tr>
      </thead>
      <tbody>
        {formData.pressureTestRecords && formData.pressureTestRecords.map((record, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{index + 1}</td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="time" value={record.timeStarted || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.pressureKgCm2 || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.tempAmb || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.tempOTI || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.tempWTI || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Stage 3 Form 2: Record for Oil Filtration - Main Tank
const Stage3Form2 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>RECORD FOR OIL FILTRATION</h2>
      <h2>Oil filtration of Main Tank</h2>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Date</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Time</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Vacuum Level (mmHg or torr)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>M/C Outlet Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>OTI Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>WTI Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Remark</th>
        </tr>
      </thead>
      <tbody>
        {formData.filtrationRecords && formData.filtrationRecords.map((record, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="date" value={record.date || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="time" value={record.time || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.vacuumLevel || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.mcOutletTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.otiTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.wtiTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.remark || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px" }}>
      IR Value before radiators/combine filtration , Temp OTI ........°C WTI............°C, AMB........°C RANGE ONLY 1 KV
    </h4>

    <div className="form-grid" style={{ marginBottom: "20px" }}>
      <div className="form-group">
        <label>OTI Temperature (°C):</label>
        <input type="text" value={formData.tempOTI || ""} disabled className="form-input disabled preview" />
      </div>
      <div className="form-group">
        <label>WTI Temperature (°C):</label>
        <input type="text" value={formData.tempWTI || ""} disabled className="form-input disabled preview" />
      </div>
      <div className="form-group">
        <label>AMB Temperature (°C):</label>
        <input type="text" value={formData.tempAMB || ""} disabled className="form-input disabled preview" />
      </div>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>15 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>60 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Ratio of IR 60/IR 15</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV-Earth</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth15Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth60Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ratioIR60IR15 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Stage 3 Form 3: Oil Filtration of Radiator and Combine
const Stage3Form3 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>Oil filtration of Radiator</h2>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Date</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Time</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Vacuum Level (mmHg or torr)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>M/C Outlet Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>OTI Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>WTI Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Remark</th>
        </tr>
      </thead>
      <tbody>
        {formData.radiatorRecords && formData.radiatorRecords.map((record, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="date" value={record.date || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="time" value={record.time || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.vacuumLevel || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.mcOutletTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.otiTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.wtiTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.remark || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px" }}>
      Oil filtration of Combine (Main Tank + Cooler bank)
    </h4>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Date</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Time</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Vacuum Level (mmHg or torr)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>M/C Outlet Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>OTI Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>WTI Temp°C</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Remark</th>
        </tr>
      </thead>
      <tbody>
        {formData.combineRecords && formData.combineRecords.map((record, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="date" value={record.date || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="time" value={record.time || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.vacuumLevel || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.mcOutletTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.otiTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.wtiTemp || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={record.remark || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px" }}>After Oil Filtration of main tank</h4>

    <div className="form-grid" style={{ marginBottom: "20px" }}>
      <div className="form-group">
        <label><strong>BDV: _____ KV</strong></label>
        <input type="text" value={formData.bdvKV || ""} disabled className="form-input disabled preview" />
      </div>
      <div className="form-group">
        <label><strong>Water Content: _______ PPM</strong></label>
        <input type="text" value={formData.waterContentPPM || ""} disabled className="form-input disabled preview" />
      </div>
    </div>

    <h4 style={{ marginTop: "40px" }}>
      PI Value after filteration, Temp OTI ........°C WTI............°C, AMB........°C RANGE ONLY 5 KV
    </h4>

    <div className="form-grid" style={{ marginBottom: "20px" }}>
      <div className="form-group">
        <label>OTI Temperature (°C):</label>
        <input type="text" value={formData.tempOTI || ""} disabled className="form-input disabled preview" />
      </div>
      <div className="form-group">
        <label>WTI Temperature (°C):</label>
        <input type="text" value={formData.tempWTI || ""} disabled className="form-input disabled preview" />
      </div>
      <div className="form-group">
        <label>AMB Temperature (°C):</label>
        <input type="text" value={formData.tempAMB || ""} disabled className="form-input disabled preview" />
      </div>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>15 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>60 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>600 sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>600/60 sec MΩ</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV-Earth</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth15Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth60Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth600Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth60600Sec || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Stage 4 Form Components (for review display)
const Stage4Form1 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>SFRA TEST RECORD</h2>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>MAKE OF METER</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.makeOfMeter || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>DATE</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>MODEL & S. NO.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.modelSrNo || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>AMBIENT:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ambient || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>OTI</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.oti || ""} disabled className="form-input disabled preview" placeholder="°C" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>WTI</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.wti || ""} disabled className="form-input disabled preview" placeholder="°C" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Test report reviewed by</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.testReportReviewed || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Acceptance of the test</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.acceptanceOfTest || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px", textAlign: "center" }}>
      Tan delta and capacitance test on bushing
    </h4>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>METER USED</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.meterUsedBushing || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>DATE:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.dateBushing || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>TIME :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="time" value={formData.timeBushing || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>MODEL & S. NO.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.modelSrNoBushing || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>WTI:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.wtiBushing || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>OTI:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.otiBushing || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} rowSpan="2"></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} rowSpan="2">AT 05 KV PHASE</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>TAN DELTA %</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>CAPACITANCE (pF)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>EXCITATION CURRENT (mA)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>DIELECTRIC LOSS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.1</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_05kv_phase || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_05kv_tanDelta || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_05kv_capacitance || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_05kv_excitationCurrent || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_05kv_dielectricLoss || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.2</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_05kv_phase || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_05kv_tanDelta || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_05kv_capacitance || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_05kv_excitationCurrent || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_05kv_dielectricLoss || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} rowSpan="2"></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} rowSpan="2">AT 10 KV PHASE</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>TAN DELTA %</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>CAPACITANCE (pF)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>EXCITATION CURRENT (mA)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>DIELECTRIC LOSS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.1</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_10kv_phase || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_10kv_tanDelta || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_10kv_capacitance || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_10kv_excitationCurrent || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing11_10kv_dielectricLoss || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.2</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_10kv_phase || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_10kv_tanDelta || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_10kv_capacitance || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_10kv_excitationCurrent || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushing12_10kv_dielectricLoss || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px", textAlign: "center" }}>
      Tan delta and capacitance test on winding
    </h4>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>METER USED</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.meterUsedWinding || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>DATE:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.dateWinding || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>TIME :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="time" value={formData.timeWinding || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>MAKE & S. NO.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.makeSrNoWinding || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>AMBIENT TEMP</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ambientTempWinding || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>OIL TEMP</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.oilTempWinding || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>AT 05 KV IN BETWEEN</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>TAN DELTA %</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>CAPACITANCE (pF)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>EXCITATION CURRENT (mA)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>DIELECTRIC LOSS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV – G</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvg_05kv_phase || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvg_05kv_tanDelta || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvg_05kv_capacitance || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvg_05kv_excitationCurrent || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvg_05kv_dielectricLoss || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>AT 10 KV IN BETWEEN</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>TAN DELTA %</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>CAPACITANCE (pF)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>EXCITATION CURRENT (mA)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>DIELECTRIC LOSS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV – G</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvg_10kv_phase || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvg_10kv_tanDelta || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvg_10kv_capacitance || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvg_10kv_excitationCurrent || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvg_10kv_dielectricLoss || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Stage4Form2 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>RECORD OF MEASUREMENT OF IR VALUES</h2>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Date :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Time:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="time" value={formData.time || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Details of Insulation tester</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Amb. Temp :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ambTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Make :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.make || ""} disabled className="form-input disabled preview" />
          </td>
          <td rowSpan="4" style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td rowSpan="4" style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Oil Temp. :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.oilTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Sr. No. :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.srNo || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Wdg. Temp. :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.wdgTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Range :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.range || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Relative Humidity :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.relativeHumidity || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Voltage Level :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageLevel || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>15 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>60 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Ratio of IR 60/10</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV-Earth</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth10Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth60Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ratioIR60IR10 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px", textAlign: "center" }}>VOLTAGE RATIO TEST</h4>
    
    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>1.1 - 1.2</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>1.1 - 2.1</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>1.2 - 2.1</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageRatioTest_table1_11_12 || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageRatioTest_table1_11_21 || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageRatioTest_table1_12_21 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>1.1 - 2.1</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>1.1 - 1.2</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>2.1 - 1.2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageRatioTest_table2_11_21_alt || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageRatioTest_table2_11_12_alt || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageRatioTest_table2_21_12 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>2.1 - 1.2</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>1.1 - 1.2</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>1.1 - 2.1</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageRatioTest_table3_21_12_alt || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageRatioTest_table3_11_12_alt || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageRatioTest_table3_11_21_alt || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px", textAlign: "center" }}>TYPE OF TEST – MAGNETISING CURRENT TEST</h4>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>APPLIED VOLTAGE:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.appliedVoltageMag || ""} disabled className="form-input disabled preview" placeholder="VOLTS" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>DATE:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.dateMag || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>TIME:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="time" value={formData.timeMag || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>METER MAKE SR. NO.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }} colSpan="5">
            <input type="text" value={formData.meterMakeSrNoMag || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Connection</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Applied Voltage (V)</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Measured Current (mA)</th>
        </tr>
      </thead>
      <tbody>
        {formData.magnetisingTests && formData.magnetisingTests.map((test, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{test.appliedVoltage}</td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={test.appliedVoltageValue || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={test.measuredCurrent || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Stage4Form3 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>TYPE OF TEST – SHORT CIRCUIT TEST</h2>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>APPLIED VOLTAGE:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.appliedVoltage || ""} disabled className="form-input disabled preview" placeholder="VOLTS" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>DATE:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>TIME :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="time" value={formData.time || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>METER MAKE SR. NO.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }} colSpan="5">
            <input type="text" value={formData.meterMakeSrNo || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>APPLIED VOLTAGE</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }} colSpan="2">Measured Current (mA)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.1 – 1.2</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.1</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.2 – 2.1 SHORTED</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.test11_12_measuredCurrent11_23 || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.test11_12_measuredCurrent11 || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.test11_12_measuredCurrent12_21 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.2 – 2.1</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.2</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.1 – 2.1 SHORTED</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.test12_21_measuredCurrent12_21 || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.test12_21_measuredCurrent12 || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.test12_21_measuredCurrent11_21 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }} rowSpan="4">Impedance calculation</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Applied Voltage HV</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Rated Current LV</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.appliedVoltageHV || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ratedCurrentLV || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>%Z = _____________ X _____________ X 100</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span><strong>Rated voltage HV</strong></span>
              <input type="text" value={formData.ratedVoltageHV || ""} disabled className="form-input disabled preview" style={{ width: "120px" }} />
              <span><strong>Measured current LV</strong></span>
              <input type="text" value={formData.measuredCurrentLV || ""} disabled className="form-input disabled preview" style={{ width: "120px" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
              <input type="text" value={formData.percentZ || ""} disabled className="form-input disabled preview" placeholder="%Z =" style={{ width: "80px" }} />
            </div>
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Stage4Form4 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>TYPE OF TEST – WINDING RESISTANCE TEST</h2>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>METER USED</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.meterUsed || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>DATE:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>TIME :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="time" value={formData.time || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>METER MAKE SR. NO.</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.meterMakeSrNo || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>WTI:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.wti || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>OTI:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.oti || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>RANGE</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.range || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>AMBIENT:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }} colSpan="3">
            <input type="text" value={formData.ambient || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "30px", textAlign: "center" }}>ALL MEASUREMENT IN OHMS / MΩ</h4>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.1 – 1.2</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.winding11_12 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1.1 - 2.1</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.winding11_21 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>2.1 – 1.2</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.winding21_12 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px", textAlign: "center" }}>RECORD OF MEASUREMENT OF IR & PI VALUES</h4>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Date :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="date" value={formData.dateIR || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Time:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="time" value={formData.timeIR || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Details of Insulation tester</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Amb. Temp :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ambTempIR || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Make :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.makeIR || ""} disabled className="form-input disabled preview" />
          </td>
          <td rowSpan="4" style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td rowSpan="4" style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Oil Temp. :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.oilTempIR || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Sr. No. :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.srNoIR || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Wdg. Temp. :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.wdgTempIR || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Range :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.rangeIR || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Relative Humidity :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.relativeHumidityIR || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Voltage Level :</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.voltageLevelIR || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>10 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>60 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>600 Sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Ratio of IR 60/IR 10</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Ratio of IR 600/60</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV-Earth</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth10Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth60Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth600Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ratioIR60IR10 || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.ratioIR600IR60 || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Stage 4 Review Renderer Component
const Stage4ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage4Forms = [
    {
      id: "sfra-test-record",
      title: "SFRA Test Record",
      fields: [
        { name: "makeOfMeter", label: "MAKE OF METER", type: "text" },
        { name: "date", label: "DATE", type: "date" },
        { name: "modelSrNo", label: "MODEL & S. NO.", type: "text" },
        { name: "ambient", label: "AMBIENT", type: "text" },
        { name: "oti", label: "OTI", type: "text" },
        { name: "wti", label: "WTI", type: "text" },
        { name: "testReportReviewed", label: "Test report reviewed by", type: "text" },
        { name: "acceptanceOfTest", label: "Acceptance of the test", type: "text" }
      ]
    },
    {
      id: "ir-voltage-ratio-magnetising-test",
      title: "Record of Measurement of IR Values & Voltage Ratio Test",
      fields: [
        { name: "date", label: "Date", type: "date" },
        { name: "time", label: "Time", type: "time" },
        { name: "ambTemp", label: "Amb. Temp", type: "text" },
        { name: "make", label: "Make", type: "text" },
        { name: "oilTemp", label: "Oil Temp.", type: "text" },
        { name: "srNo", label: "Sr. No.", type: "text" },
        { name: "voltageRatioTest_table1_11_12", label: "Voltage Ratio 1.1-1.2", type: "text" },
        { name: "voltageRatioTest_table1_11_21", label: "Voltage Ratio 1.1-2.1", type: "text" },
        { name: "voltageRatioTest_table1_12_21", label: "Voltage Ratio 1.2-2.1", type: "text" }
      ]
    },
    {
      id: "short-circuit-test",
      title: "Short Circuit Test",
      fields: [
        { name: "appliedVoltage", label: "APPLIED VOLTAGE", type: "text" },
        { name: "date", label: "DATE", type: "date" },
        { name: "time", label: "TIME", type: "time" },
        { name: "meterMakeSrNo", label: "METER MAKE SR. NO.", type: "text" },
        { name: "appliedVoltageHV", label: "Applied Voltage HV", type: "text" },
        { name: "ratedCurrentLV", label: "Rated Current LV", type: "text" },
        { name: "percentZ", label: "%Z", type: "text" },
        { name: "ratedVoltageHV", label: "Rated voltage HV", type: "text" }
      ]
    },
    {
      id: "winding-resistance-ir-pi-test",
      title: "Winding Resistance Test and Record of Measurement of IR & PI Values",
      fields: [
        { name: "meterUsed", label: "METER USED", type: "text" },
        { name: "date", label: "DATE", type: "date" },
        { name: "time", label: "TIME", type: "time" },
        { name: "winding11_12", label: "1.1 – 1.2", type: "text" },
        { name: "winding11_21", label: "1.1 - 2.1", type: "text" },
        { name: "winding21_12", label: "2.1 – 1.2", type: "text" },
        { name: "hvEarth10Sec", label: "HV-Earth 10 Sec MΩ", type: "text" },
        { name: "hvEarth60Sec", label: "HV-Earth 60 Sec MΩ", type: "text" },
        { name: "hvEarth600Sec", label: "HV-Earth 600 Sec MΩ", type: "text" },
        { name: "ratioIR60IR10", label: "Ratio of IR 60/IR 10", type: "text" },
        { name: "ratioIR600IR60", label: "Ratio of IR 600/60", type: "text" }
      ]
    }
  ];

  const renderPhotos = (photos, formKey) => {
    if (!photos || typeof photos !== "object") return null;

    return (
      <div key={`${formKey}-photos`} className="form-group-preview photo-group" style={{ width: "100%" }}>
        <label className="form-label-preview">
          📸 Photos
        </label>
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === 'string') {
              if (url.startsWith("data:image/")) {
                fullUrl = url;
              } else if (url.startsWith("http")) {
                fullUrl = url;
              } else if (url.includes("cloudinary.com") || url.startsWith("v1")) {
                fullUrl = `${BACKEND_IMG_API_BASE_URL}${url}`;
              } else if (url.startsWith("/")) {
                fullUrl = `${BACKEND_API_BASE_URL}${url}`;
              } else {
                fullUrl = `${BACKEND_API_BASE_URL}/${url}`;
              }
            } else {
              fullUrl = "/placeholder.svg";
            }

            return (
              <div key={photoKey} className="photo-item" style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#f9fafb"
              }}>
                <span className="photo-label" style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                  textAlign: "center"
                }}>
                  {photoKey}
                </span>
                <img
                  src={fullUrl}
                  alt={photoKey}
                  className="photo-preview-img"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    cursor: "pointer"
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, '_blank');
                  }}
                />
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                  <a
                    href={fullUrl}
                    download={`${photoKey}.jpg`}
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontSize: "0.75rem"
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="stage4-review-container">
      {stage4Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        
        return (
          <div key={form.id} className="form-review-card" style={{
            marginBottom: "30px",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            background: "white",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}>
            <div className="company-header" style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>
                {form.title}
              </h2>
            </div>

            {/* Use the organized form components */}
            {form.id === "sfra-test-record" ? (
              <Stage4Form1 formData={formData} />
            ) : form.id === "ir-voltage-ratio-magnetising-test" ? (
              <Stage4Form2 formData={formData} />
            ) : form.id === "short-circuit-test" ? (
              <Stage4Form3 formData={formData} />
            ) : form.id === "winding-resistance-ir-pi-test" ? (
              <Stage4Form4 formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {form.fields.map((field) => (
                  <div key={`${form.id}-${field.name}`} className="form-group-preview">
                    <label className="form-label-preview">
                      {formatLabel(field.label)}
                    </label>
                    <div className="form-input-display">
                      <input
                        type={field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
                        value={formData[field.name] || ""}
                        disabled
                        className="form-input disabled preview"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render photos if they exist */}
            {formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

// Stage 5 Form Components (for review display)
const Stage5Form1 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>PRE-CHARGING CHECK LIST</h2>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Sr.N.</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Particulars</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Qty.</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Status</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>I</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Valve Status</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        {[
          { id: "A", description: "Bucholz to Conservator" },
          { id: "B", description: "Main Tank to Bucholz" },
          { id: "C", description: "Radiator Top Valves" },
          { id: "D", description: "Radiator Bottom Valves" },
          { id: "E", description: "Top Filter Valve" },
          { id: "F", description: "Bottom Filter Valve" },
          { id: "G", description: "Drain Valve" },
        ].map((item) => (
          <tr key={item.id}>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{item.id}</td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{item.description}</td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={formData.valveStatus?.[item.id]?.qty || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={formData.valveStatus?.[item.id]?.status || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          </tr>
        ))}
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>II</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Air Venting Done from Following Locations:</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        {[
          { id: "1", description: "Main Tank" },
          { id: "2", description: "Bucholz Relay" },
          { id: "3", description: "HV Bushing" },
          { id: "4", description: "LV Bushing" },
          { id: "5", description: "Neutral Bushing" },
          { id: "6", description: "Radiator – Top" },
        ].map((item) => (
          <tr key={item.id}>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{item.id}</td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{item.description}</td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={formData.airVenting?.[item.id]?.qty || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={formData.airVenting?.[item.id]?.status || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          </tr>
        ))}
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>III</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Protection Trails</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Checked</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        {[
          { id: "1", description: "Buchholz checked by oil draining", type: "ALARM" },
          { id: "1b", description: "Buchholz checked by oil draining", type: "TRIP" },
          { id: "2", description: "MOG", type: "ALARM" },
          { id: "3", description: "PRV MAIN TANK", type: "TRIP" },
          { id: "4", description: "OTI", type: "ALARM" },
          { id: "4b", description: "OTI", type: "TRIP" },
          { id: "5", description: "WTI", type: "ALARM" },
          { id: "5b", description: "WTI", type: "TRIP" },
        ].map((item) => (
          <tr key={`${item.id}-${item.type}`}>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{item.id}</td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{item.description}</td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>{item.type}</td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
              <input type="text" value={formData.protectionTrails?.[`${item.id}-${item.type}`]?.checked || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          </tr>
        ))}
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>TRIP</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>IV</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Bushing Test Tap</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>LV</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Test Cap Earthed</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushingTestTap?.hvTestCapEarthed || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bushingTestTap?.lvTestCapEarthed || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Stage5Form2 = ({ formData }) => (
  <div>
    <div className="company-header">
      <h2>PRE-CHARGING CHECK LIST - PART 2</h2>
    </div>

    <table className="form-table" style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Oil Values</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>V</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>BDV</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.bdvKV || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>KV</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>2</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Moisture Content</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.moistureContentPPM || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>PPM</td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}></th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>Final IR Values</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>15 sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>60 sec MΩ</th>
          <th style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>600 sec MΩ</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>VI</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV – E</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth15Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth60Sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvEarth600Sec || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>VII</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Oil Level of conservator</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.oilLevelConservator || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>VIII</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>HV Jumpers connected</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.hvJumpersConnected || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>IX</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>LV Jumpers connected</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.lvJumpersConnected || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>X</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Incoming LA Counter</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.incomingLACounter || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>XI</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Outgoing LA Counter</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.outgoingLACounter || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>XII</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>All CT Cable Terminated and Glands Sealed</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.allCTCableTerminated || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>XIII</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Protection relays checked through breaker tripping</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.protectionRelaysChecked || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>1</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Anabond applied to HV Bushings</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.anabondAppliedHVBushings || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>2</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>All joints properly sealed against Water Ingress</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.allJointsSealed || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>3</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>All Foreign material cleared from Transformer</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.allForeignMaterialCleared || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}></td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>Temperature of</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>°C</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>WTI</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.temperatureWTI || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px", fontWeight: "bold" }}>OTI</td>
          <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
            <input type="text" value={formData.temperatureOTI || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <div style={{ marginTop: "30px" }}>
      <h4><strong>Remarks:</strong></h4>
      <div style={{ border: "1px solid #e5e7eb", padding: "10px", borderRadius: "4px", backgroundColor: "#f9fafb" }}>
        <p style={{ margin: 0, lineHeight: "1.6" }}>
          {formData.remarks || "The Transformer as mentioned above has been jointly cleared for charging as on _____. All the necessary pre-commissioning checks and protection trials have been found satisfactory. Transformer has been cleared from all foreign material and is ready for charging."}
        </p>
      </div>
    </div>
  </div>
);

// Stage 5 Review Renderer Component
const Stage5ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage5Forms = [
    {
      id: "pre-charging-checklist",
      title: "Pre-Charging Check List",
      fields: [
        { name: "valveStatus", label: "Valve Status", type: "nested-object" },
        { name: "airVenting", label: "Air Venting", type: "nested-object" },
        { name: "protectionTrails", label: "Protection Trails", type: "nested-object" },
        { name: "bushingTestTap", label: "Bushing Test Tap", type: "nested-object" }
      ]
    },
    {
      id: "pre-charging-checklist-part2",
      title: "Pre-Charging Check List - Part 2",
      fields: [
        { name: "bdvKV", label: "BDV (KV)", type: "text" },
        { name: "moistureContentPPM", label: "Moisture Content (PPM)", type: "text" },
        { name: "hvEarth15Sec", label: "HV-Earth 15 Sec MΩ", type: "text" },
        { name: "hvEarth60Sec", label: "HV-Earth 60 Sec MΩ", type: "text" },
        { name: "hvEarth600Sec", label: "HV-Earth 600 Sec MΩ", type: "text" },
        { name: "oilLevelConservator", label: "Oil Level of conservator", type: "text" },
        { name: "hvJumpersConnected", label: "HV Jumpers connected", type: "text" },
        { name: "lvJumpersConnected", label: "LV Jumpers connected", type: "text" },
        { name: "incomingLACounter", label: "Incoming LA Counter", type: "text" },
        { name: "outgoingLACounter", label: "Outgoing LA Counter", type: "text" },
        { name: "temperatureWTI", label: "Temperature WTI", type: "text" },
        { name: "temperatureOTI", label: "Temperature OTI", type: "text" },
        { name: "remarks", label: "Remarks", type: "textarea" }
      ]
    }
  ];

  const renderPhotos = (photos, formKey) => {
    if (!photos || typeof photos !== "object") return null;

    return (
      <div key={`${formKey}-photos`} className="form-group-preview photo-group" style={{ width: "100%" }}>
        <label className="form-label-preview">
          📸 Photos
        </label>
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === 'string') {
              if (url.startsWith("data:image/")) {
                fullUrl = url;
              } else if (url.startsWith("http")) {
                fullUrl = url;
              } else if (url.includes("cloudinary.com") || url.startsWith("v1")) {
                fullUrl = `${BACKEND_IMG_API_BASE_URL}${url}`;
              } else if (url.startsWith("/")) {
                fullUrl = `${BACKEND_API_BASE_URL}${url}`;
              } else {
                fullUrl = `${BACKEND_API_BASE_URL}/${url}`;
              }
            } else {
              fullUrl = "/placeholder.svg";
            }

            return (
              <div key={photoKey} className="photo-item" style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#f9fafb"
              }}>
                <span className="photo-label" style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                  textAlign: "center"
                }}>
                  {photoKey}
                </span>
                <img
                  src={fullUrl}
                  alt={photoKey}
                  className="photo-preview-img"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    cursor: "pointer"
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, '_blank');
                  }}
                />
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                  <a
                    href={fullUrl}
                    download={`${photoKey}.jpg`}
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontSize: "0.75rem"
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFormField = (field, value, formKey) => {
    if (field.type === "nested-object" && typeof value === "object" && value !== null) {
      return (
        <div key={`${formKey}-${field.name}`} className="form-group-preview nested-object-group">
          <label className="form-label-preview">
            📋 {formatLabel(field.label)}
          </label>
          <div className="nested-object-display" style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "15px",
            marginTop: "10px",
          }}>
            {Object.entries(value).map(([nestedKey, nestedValue]) => (
              <div key={`${field.name}-${nestedKey}`} className="nested-item" style={{
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "#f9fafb",
              }}>
                <h5 style={{
                  margin: "0 0 10px 0",
                  color: "#374151",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}>
                  {formatLabel(field.label)} - {nestedKey}
                </h5>
                {typeof nestedValue === "object" && nestedValue !== null ? (
                  <div className="nested-fields-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "10px",
                  }}>
                    {Object.entries(nestedValue).map(([subKey, subValue]) => (
                      <div key={`${nestedKey}-${subKey}`} className="nested-field">
                        <label className="nested-field-label" style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          fontWeight: "500",
                        }}>
                          {formatLabel(subKey)}:
                        </label>
                        <div className="nested-field-value">
                          <input
                            type="text"
                            value={subValue || ""}
                            disabled
                            className="form-input disabled preview"
                            style={{
                              fontSize: "0.85rem",
                              padding: "6px 8px",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="form-input-display">
                    <input
                      type="text"
                      value={nestedValue || ""}
                      disabled
                      className="form-input disabled preview"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={`${formKey}-${field.name}`} className="form-group-preview">
          <label className="form-label-preview">
            {formatLabel(field.label)}
          </label>
          <div className="form-input-display">
            <textarea
              value={value || ""}
              disabled
              className="form-input disabled preview"
              rows="4"
              style={{ resize: "vertical" }}
            />
          </div>
        </div>
      );
    }

    return (
      <div key={`${formKey}-${field.name}`} className="form-group-preview">
        <label className="form-label-preview">
          {formatLabel(field.label)}
        </label>
        <div className="form-input-display">
          <input
            type={field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
            value={value || ""}
            disabled
            className="form-input disabled preview"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="stage5-review-container">
      {stage5Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        
        return (
          <div key={form.id} className="form-review-card" style={{
            marginBottom: "30px",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            background: "white",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}>
            <div className="company-header" style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>
                {form.title}
              </h2>
            </div>

            {/* Use the organized form components */}
            {form.id === "pre-charging-checklist" ? (
              <Stage5Form1 formData={formData} />
            ) : form.id === "pre-charging-checklist-part2" ? (
              <Stage5Form2 formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {form.fields.map((field) => 
                  renderFormField(field, formData[field.name], form.id)
                )}
              </div>
            )}

            {/* Render photos if they exist */}
            {formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

// Stage 3 Review Renderer Component
const Stage3ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage3Forms = [
    {
      id: "before-oil-filling-pressure-test",
      title: "Before Oil Filling and Pressure Test Report",
      fields: [
        { name: "bdvKV", label: "BDV (KV)", type: "text" },
        { name: "waterContentPPM", label: "Water Content (PPM)", type: "text" },
        { name: "tempOTI", label: "OTI Temperature (°C)", type: "text" },
        { name: "tempWTI", label: "WTI Temperature (°C)", type: "text" },
        { name: "tempAMB", label: "AMB Temperature (°C)", type: "text" },
        { name: "hvEarth15Sec", label: "HV-Earth 15 Sec MΩ", type: "text" },
        { name: "hvEarth60Sec", label: "HV-Earth 60 Sec MΩ", type: "text" },
        { name: "ratioIR60IR15", label: "Ratio of IR 60/IR 15", type: "text" },
        { name: "pressureTestDate", label: "Pressure Test Date", type: "date" },
        { name: "pressureTestRecords", label: "Pressure Test Records", type: "array" }
      ]
    },
    {
      id: "record-oil-filtration-main-tank",
      title: "Record for Oil Filtration - Main Tank",
      fields: [
        { name: "filtrationRecords", label: "Filtration Records", type: "array" },
        { name: "tempOTI", label: "OTI Temperature (°C)", type: "text" },
        { name: "tempWTI", label: "WTI Temperature (°C)", type: "text" },
        { name: "tempAMB", label: "AMB Temperature (°C)", type: "text" },
        { name: "hvEarth15Sec", label: "HV-Earth 15 Sec MΩ", type: "text" },
        { name: "hvEarth60Sec", label: "HV-Earth 60 Sec MΩ", type: "text" },
        { name: "ratioIR60IR15", label: "Ratio of IR 60/IR 15", type: "text" }
      ]
    },
    {
      id: "oil-filtration-radiator-combine",
      title: "Oil Filtration of Radiator and Combine",
      fields: [
        { name: "radiatorRecords", label: "Radiator Records", type: "array" },
        { name: "combineRecords", label: "Combine Records", type: "array" },
        { name: "bdvKV", label: "BDV (KV)", type: "text" },
        { name: "waterContentPPM", label: "Water Content (PPM)", type: "text" },
        { name: "tempOTI", label: "OTI Temperature (°C)", type: "text" },
        { name: "tempWTI", label: "WTI Temperature (°C)", type: "text" },
        { name: "tempAMB", label: "AMB Temperature (°C)", type: "text" },
        { name: "hvEarth15Sec", label: "HV-Earth 15 Sec MΩ", type: "text" },
        { name: "hvEarth60Sec", label: "HV-Earth 60 Sec MΩ", type: "text" },
        { name: "hvEarth600Sec", label: "HV-Earth 600 sec MΩ", type: "text" },
        { name: "hvEarth60600Sec", label: "HV-Earth 600/60 sec MΩ", type: "text" }
      ]
    }
  ];

  const renderPhotos = (photos, formKey) => {
    if (!photos || typeof photos !== "object") return null;

    return (
      <div key={`${formKey}-photos`} className="form-group-preview photo-group" style={{ width: "100%" }}>
        <label className="form-label-preview">
          📸 Photos
        </label>
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === 'string') {
              if (url.startsWith("data:image/")) {
                fullUrl = url;
              } else if (url.startsWith("http")) {
                fullUrl = url;
              } else if (url.includes("cloudinary.com") || url.startsWith("v1")) {
                fullUrl = `${BACKEND_IMG_API_BASE_URL}${url}`;
              } else if (url.startsWith("/")) {
                fullUrl = `${BACKEND_API_BASE_URL}${url}`;
              } else {
                fullUrl = `${BACKEND_API_BASE_URL}/${url}`;
              }
            } else {
              fullUrl = "/placeholder.svg";
            }

            return (
              <div key={photoKey} className="photo-item" style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#f9fafb"
              }}>
                <span className="photo-label" style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                  textAlign: "center"
                }}>
                  {photoKey}
                </span>
                <img
                  src={fullUrl}
                  alt={photoKey}
                  className="photo-preview-img"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    cursor: "pointer"
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, '_blank');
                  }}
                />
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                  <a
                    href={fullUrl}
                    download={`${photoKey}.jpg`}
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontSize: "0.75rem"
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="stage3-review-container">
      {stage3Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        
        return (
          <div key={form.id} className="form-review-card" style={{
            marginBottom: "30px",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            background: "white",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}>
            <div className="company-header" style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>
                {form.title}
              </h2>
            </div>

            {/* Use the organized form components */}
            {form.id === "before-oil-filling-pressure-test" ? (
              <Stage3Form1 formData={formData} />
            ) : form.id === "record-oil-filtration-main-tank" ? (
              <Stage3Form2 formData={formData} />
            ) : form.id === "oil-filtration-radiator-combine" ? (
              <Stage3Form3 formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {form.fields.map((field) => (
                  <div key={`${form.id}-${field.name}`} className="form-group-preview">
                    <label className="form-label-preview">
                      {formatLabel(field.label)}
                    </label>
                    <div className="form-input-display">
                      <input
                        type={field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
                        value={formData[field.name] || ""}
                        disabled
                        className="form-input disabled preview"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render photos if they exist */}
            {formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

// Stage 2 Review Renderer Component
const Stage2ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage2Forms = [
    {
      id: "record-oil-handling",
      title: "Record of Oil Handling - Test Values Prior to Filteration",
      fields: [
        { name: "tank1StartedDateTime", label: "Tank1 Started Date & Time", type: "datetime-local" },
        { name: "tank1CompletedDateTime", label: "Tank1 Completed Date & Time", type: "datetime-local" },
        { name: "oilTemperature", label: "Oil Temperature", type: "text" },
        { name: "ambientTemperature", label: "Ambient Temperature", type: "text" },
        { name: "oilLevel", label: "Oil Level", type: "text" },
        { name: "filtrationMethod", label: "Filtration Method", type: "text" },
        { name: "remarks", label: "Remarks", type: "textarea" }
      ]
    },
    {
      id: "ir-after-erection-stage2",
      title: "IR After Erection - Stage 2 End",
      fields: [
        { name: "date", label: "Date", type: "date" },
        { name: "time", label: "Time", type: "time" },
        { name: "ambTemp", label: "Amb. Temp", type: "text" },
        { name: "make", label: "Make", type: "text" },
        { name: "oilTemp", label: "Oil Temp.", type: "text" },
        { name: "srNo", label: "Sr. No.", type: "text" },
        { name: "wdgTemp", label: "Wdg. Temp.", type: "text" },
        { name: "range", label: "Range", type: "text" },
        { name: "relativeHumidity", label: "Relative Humidity", type: "text" },
        { name: "voltageLevel", label: "Voltage Level", type: "text" },
        { name: "hvEarth15Sec", label: "HV-Earth 15 Sec MΩ", type: "text" },
        { name: "hvEarth60Sec", label: "HV-Earth 60 Sec MΩ", type: "text" },
        { name: "hvEarthRatio", label: "HV-Earth Ratio", type: "text" },
        { name: "lvEarth15Sec", label: "LV-Earth 15 Sec MΩ", type: "text" },
        { name: "lvEarth60Sec", label: "LV-Earth 60 Sec MΩ", type: "text" },
        { name: "lvEarthRatio", label: "LV-Earth Ratio", type: "text" },
        { name: "hvLv15Sec", label: "HV-LV 15 Sec MΩ", type: "text" },
        { name: "hvLv60Sec", label: "HV-LV 60 Sec MΩ", type: "text" },
        { name: "hvLvRatio", label: "HV-LV Ratio", type: "text" }
      ]
    }
  ];

  const renderFormField = (field, value, formKey) => {
    if (field.type === "nested-object" && typeof value === "object" && value !== null) {
      return (
        <div key={`${formKey}-${field.name}`} className="form-group-preview nested-object-group">
          <label className="form-label-preview">
            📋 {formatLabel(field.label)}
          </label>
          <div className="nested-object-display" style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "15px",
            marginTop: "10px",
          }}>
            {Object.entries(value).map(([nestedKey, nestedValue]) => (
              <div key={`${field.name}-${nestedKey}`} className="nested-item" style={{
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "#f9fafb",
              }}>
                <h5 style={{
                  margin: "0 0 10px 0",
                  color: "#374151",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}>
                  {formatLabel(field.label)} - {nestedKey}
                </h5>
                {typeof nestedValue === "object" && nestedValue !== null ? (
                  <div className="nested-fields-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "10px",
                  }}>
                    {Object.entries(nestedValue).map(([subKey, subValue]) => (
                      <div key={`${nestedKey}-${subKey}`} className="nested-field">
                        <label className="nested-field-label" style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          fontWeight: "500",
                        }}>
                          {formatLabel(subKey)}:
                        </label>
                        <div className="nested-field-value">
                          <input
                            type="text"
                            value={subValue || ""}
                            disabled
                            className="form-input disabled preview"
                            style={{
                              fontSize: "0.85rem",
                              padding: "6px 8px",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="form-input-display">
                    <input
                      type="text"
                      value={nestedValue || ""}
                      disabled
                      className="form-input disabled preview"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={`${formKey}-${field.name}`} className="form-group-preview">
        <label className="form-label-preview">
          {formatLabel(field.label)}
        </label>
        <div className="form-input-display">
          <input
            type={field.type === "date" ? "date" : field.type === "time" ? "time" : field.type === "datetime-local" ? "datetime-local" : "text"}
            value={value || ""}
            disabled
            className="form-input disabled preview"
          />
        </div>
      </div>
    );
  };

  const renderPhotos = (photos, formKey) => {
    if (!photos || typeof photos !== "object") return null;

    return (
      <div key={`${formKey}-photos`} className="form-group-preview photo-group" style={{ width: "100%" }}>
        <label className="form-label-preview">
          📸 Photos
        </label>
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === 'string') {
              if (url.startsWith("data:image/")) {
                fullUrl = url;
              } else if (url.startsWith("http")) {
                fullUrl = url;
              } else if (url.includes("cloudinary.com") || url.startsWith("v1")) {
                fullUrl = `${BACKEND_IMG_API_BASE_URL}${url}`;
              } else if (url.startsWith("/")) {
                fullUrl = `${BACKEND_API_BASE_URL}${url}`;
              } else {
                fullUrl = `${BACKEND_API_BASE_URL}/${url}`;
              }
            } else {
              fullUrl = "/placeholder.svg";
            }

            return (
              <div key={photoKey} className="photo-item" style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#f9fafb"
              }}>
                <span className="photo-label" style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                  textAlign: "center"
                }}>
                  {photoKey}
                </span>
                <img
                  src={fullUrl}
                  alt={photoKey}
                  className="photo-preview-img"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    cursor: "pointer"
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, '_blank');
                  }}
                />
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                  <a
                    href={fullUrl}
                    download={`${photoKey}.jpg`}
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontSize: "0.75rem"
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="stage2-review-container">
      {stage2Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        
        return (
          <div key={form.id} className="form-review-card" style={{
            marginBottom: "30px",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            background: "white",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}>
            <div className="company-header" style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>
                {form.title}
              </h2>
            </div>

            {/* Use the organized form components */}
            {form.id === "record-oil-handling" ? (
              <Stage2Form1 formData={formData} />
            ) : form.id === "ir-after-erection-stage2" ? (
              <Stage2Form2 formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {form.fields.map((field) => 
                  renderFormField(field, formData[field.name], form.id)
                )}
              </div>
            )}

            {/* Render photos if they exist */}
            {formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

// Stage 1 Review Renderer Component
const Stage1ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage1Forms = [
    {
      id: "name-plate-details",
      title: "Name Plate Details Transformer",
      fields: [
        { name: "make", label: "MAKE", type: "text" },
        { name: "currentHV", label: "CURRENT HV (A)", type: "text" },
        { name: "srNo", label: "SR. NO.", type: "text" },
        { name: "currentLV", label: "LV (A)", type: "text" },
        { name: "mvaRating", label: "MVA Rating", type: "text" },
        { name: "tempRiseOil", label: "Temp. Rise over amb. In Oil °C", type: "text" },
        { name: "hvKv", label: "HV (KV)", type: "text" },
        { name: "winding", label: "Winding", type: "text" },
        { name: "lvKv", label: "LV (KV)", type: "text" },
        { name: "transportingWeight", label: "Transporting weight", type: "text" },
        { name: "impedancePercent", label: "% Impedance", type: "text" },
        { name: "noOfRadiators", label: "No. Of radiators", type: "text" },
        { name: "yearOfMfg", label: "Year of Mfg.", type: "text" },
        { name: "weightCoreWinding", label: "Weight of Core & Winding.", type: "text" },
        { name: "oilQuantityLiter", label: "Oil Quantity in liter", type: "text" },
        { name: "totalWeight", label: "Total Weight", type: "text" }
      ]
    },
    {
      id: "protocol-accessories-checking",
      title: "Protocol for Accessories Checking",
      fields: [
        { name: "accessories", label: "Accessories", type: "nested-object" }
      ]
    },
    {
      id: "core-insulation-check",
      title: "Core Insulation Check",
      fields: [
        { name: "betweenCoreFrame", label: "Between Core – frame", type: "text" },
        { name: "betweenCoreFrameRemarks", label: "Remarks", type: "text" },
        { name: "betweenFrameTank", label: "Between Frame – tank", type: "text" },
        { name: "betweenFrameTankRemarks", label: "Remarks", type: "text" },
        { name: "betweenCoreTank", label: "Between core – tank", type: "text" },
        { name: "betweenCoreTankRemarks", label: "Remarks", type: "text" },
        { name: "filterMachine", label: "Whether the Filter Machine is Available", type: "select" },
        { name: "filterCapacity", label: "Capacity of Filter Machine", type: "text" },
        { name: "vacuumPumpCapacity", label: "Capacity of the Vacuum Pump to be used.", type: "text" },
        { name: "reservoirAvailable", label: "Whether the Reservoir is Available with valves and a breather.", type: "select" },
        { name: "reservoirCapacity", label: "Capacity of Reservoirs.", type: "text" },
        { name: "hosePipes", label: "Hose Pipes for the Filtration Process.", type: "select" },
        { name: "craneAvailable", label: "Whether Crane is Available in good condition", type: "select" },
        { name: "fireExtinguisher", label: "Fire extinguisher/ Fire sand bucket", type: "select" },
        { name: "firstAidKit", label: "First aid kit", type: "select" },
        { name: "ppeEquipment", label: "PPE for the working team of ETC agency, like- Safety shoes, Helmet, etc...", type: "select" }
      ]
    },
    {
      id: "pre-erection-tan-delta-test",
      title: "Pre-Erection Tan Delta and Capacitance Test on Bushing",
      fields: [
        { name: "meterUsed", label: "METER USED", type: "text" },
        { name: "date", label: "DATE", type: "date" },
        { name: "time", label: "TIME", type: "time" },
        { name: "modelSrNo", label: "MODEL & S. NO.", type: "text" },
        { name: "wti", label: "WTI", type: "text" },
        { name: "oti", label: "OTI", type: "text" },
        { name: "bushing11", label: "Bushing 1.1", type: "text" },
        { name: "bushing12", label: "Bushing 1.2", type: "text" }
      ]
    },
    {
      id: "record-measurement-ir-values",
      title: "Record of Measurement of IR Values",
      fields: [
        { name: "date", label: "Date", type: "date" },
        { name: "time", label: "Time", type: "time" },
        { name: "ambTemp", label: "Amb. Temp", type: "text" },
        { name: "make", label: "Make", type: "text" },
        { name: "oilTemp", label: "Oil Temp.", type: "text" },
        { name: "srNo", label: "Sr. No.", type: "text" },
        { name: "wdgTemp", label: "Wdg. Temp.", type: "text" },
        { name: "range", label: "Range", type: "text" },
        { name: "relativeHumidity", label: "Relative Humidity", type: "text" },
        { name: "voltageLevel", label: "Voltage Level", type: "text" },
        { name: "hvEarth15Sec", label: "HV-Earth 15 Sec MΩ", type: "text" },
        { name: "hvEarth60Sec", label: "HV-Earth 60 Sec MΩ", type: "text" },
        { name: "ratioIR60IR15", label: "Ratio of IR 60/IR 15", type: "text" }
      ]
    }
  ];

  const renderFormField = (field, value, formKey) => {
    if (field.type === "nested-object" && typeof value === "object" && value !== null) {
      return (
        <div key={`${formKey}-${field.name}`} className="form-group-preview nested-object-group">
          <label className="form-label-preview">
            📋 {formatLabel(field.label)}
          </label>
          <div className="nested-object-display" style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "15px",
            marginTop: "10px",
          }}>
            {Object.entries(value).map(([nestedKey, nestedValue]) => (
              <div key={`${field.name}-${nestedKey}`} className="nested-item" style={{
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "#f9fafb",
              }}>
                <h5 style={{
                  margin: "0 0 10px 0",
                  color: "#374151",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}>
                  {formatLabel(field.label)} - {nestedKey}
                </h5>
                {typeof nestedValue === "object" && nestedValue !== null ? (
                  <div className="nested-fields-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "10px",
                  }}>
                    {Object.entries(nestedValue).map(([subKey, subValue]) => (
                      <div key={`${nestedKey}-${subKey}`} className="nested-field">
                        <label className="nested-field-label" style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          fontWeight: "500",
                        }}>
                          {formatLabel(subKey)}:
                        </label>
                        <div className="nested-field-value">
                          <input
                            type="text"
                            value={subValue || ""}
                            disabled
                            className="form-input disabled preview"
                            style={{
                              fontSize: "0.85rem",
                              padding: "6px 8px",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="form-input-display">
                    <input
                      type="text"
                      value={nestedValue || ""}
                      disabled
                      className="form-input disabled preview"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={`${formKey}-${field.name}`} className="form-group-preview">
        <label className="form-label-preview">
          {formatLabel(field.label)}
        </label>
        <div className="form-input-display">
          <input
            type={field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
            value={value || ""}
            disabled
            className="form-input disabled preview"
          />
        </div>
      </div>
    );
  };

  const renderPhotos = (photos, formKey) => {
    if (!photos || typeof photos !== "object") return null;

    return (
      <div key={`${formKey}-photos`} className="form-group-preview photo-group" style={{ width: "100%" }}>
        <label className="form-label-preview">
          📸 Photos
        </label>
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === 'string') {
              if (url.startsWith("data:image/")) {
                fullUrl = url;
              } else if (url.startsWith("http")) {
                fullUrl = url;
              } else if (url.includes("cloudinary.com") || url.startsWith("v1")) {
                fullUrl = `${BACKEND_IMG_API_BASE_URL}${url}`;
              } else if (url.startsWith("/")) {
                fullUrl = `${BACKEND_API_BASE_URL}${url}`;
              } else {
                fullUrl = `${BACKEND_API_BASE_URL}/${url}`;
              }
            } else {
              fullUrl = "/placeholder.svg";
            }

            return (
              <div key={photoKey} className="photo-item" style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#f9fafb"
              }}>
                <span className="photo-label" style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                  textAlign: "center"
                }}>
                  {photoKey}
                </span>
                <img
                  src={fullUrl}
                  alt={photoKey}
                  className="photo-preview-img"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    cursor: "pointer"
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, '_blank');
                  }}
                />
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                  <a
                    href={fullUrl}
                    download={`${photoKey}.jpg`}
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontSize: "0.75rem"
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="stage1-review-container">
      {stage1Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        
        return (
          <div key={form.id} className="form-review-card" style={{
            marginBottom: "30px",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            background: "white",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}>
            <div className="company-header" style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>
                {form.title}
              </h2>
            </div>

            {/* Use the organized form components */}
            {form.id === "name-plate-details" ? (
              <Stage1Form1 formData={formData} />
            ) : form.id === "protocol-accessories-checking" ? (
              <Stage1Form2 formData={formData} />
            ) : form.id === "core-insulation-check" ? (
              <Stage1Form3 formData={formData} />
            ) : form.id === "pre-erection-tan-delta-test" ? (
              <Stage1Form4 formData={formData} />
            ) : form.id === "record-measurement-ir-values" ? (
              <Stage1Form5 formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {form.fields.map((field) => 
                  renderFormField(field, formData[field.name], form.id)
                )}
              </div>
            )}

            {/* Render photos if they exist */}
            {formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

// Stage 6 Form Component (for review display)
const Stage6Form1 = ({ formData }) => (
  <div
    className="form-container"
    style={{
      background: "white",
      padding: "40px",
      maxWidth: "800px",
      margin: "0 auto",
    }}
  >
    {/* Header with logo and certifications */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        borderBottom: "3px solid #C41E3A",
        paddingBottom: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div
          style={{ fontSize: "2rem", fontWeight: "bold", color: "#C41E3A" }}
        >
          
        </div>
        <div>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}
          >
            
             <img src="/logo.png" alt="Vishvas Power" className="logo" />
          </div>
          <div
            style={{
              fontSize: "1.2rem",
              color: "#666",
              letterSpacing: "2px",
            }}
          >
          
          </div>
          <div style={{ fontSize: "0.8rem", color: "#666" }}>
            (A unit of M/s Vishvas Power Engineering Services Pvt Ltd)
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
           
            color: "white",
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
          }}
        >
          <div>
             <div
            style={{ fontSize: "1.5rem", fontWeight: "bold",  color: "#333" }}
          >
            
             <img src="/stamp.png" alt="Vishvas Power" className="logo" />
          </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div
          style={{
            background: "#4CAF50",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            marginBottom: "5px",
            fontSize: "0.8rem",
          }}
        >
          ISO CERTIFIED
        </div>
        <div style={{ fontSize: "0.7rem", color: "#333" }}>
          • 9001 Certified
          <br />• 14001 Certified
          <br />• 45001 Certified
        </div>
      </div>
    </div>

    {/* Red banner */}
    <div
      style={{
        background: "linear-gradient(135deg, #C41E3A, #8B0000)",
        color: "white",
        padding: "10px 20px",
        marginBottom: "30px",
        clipPath: "polygon(0 0, 100% 0, 95% 100%, 0% 100%)",
      }}
    >
      <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>
        Transformers upto 220 kV 250 MVA
      </div>
    </div>

    <div>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            textDecoration: "underline",
            margin: "0 0 10px 0",
          }}
        >
          Work completion report
        </h1>
        <div style={{ textAlign: "right", fontSize: "1rem" }}>
          <strong>Date:-</strong>
          <input
            type="date"
            value={formData.completionDate || ""}
            disabled
            style={{
              marginLeft: "10px",
              border: "none",
              borderBottom: "1px solid #333",
              background: "transparent",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          Project Information
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <strong>Customer Name: </strong>
          <input
            type="text"
            value={formData.customerName || ""}
            disabled
            style={{
              border: "none",
              borderBottom: "1px solid #333",
              background: "transparent",
              width: "300px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Order Number: </strong>
          <input
            type="text"
            value={formData.orderNumber || ""}
            disabled
            style={{
              border: "none",
              borderBottom: "1px solid #333",
              background: "transparent",
              width: "300px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Location: </strong>
          <input
            type="text"
            value={formData.location || ""}
            disabled
            style={{
              border: "none",
              borderBottom: "1px solid #333",
              background: "transparent",
              width: "200px",
            }}
          />
          <strong style={{ marginLeft: "20px" }}>SP/SSP</strong>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          Transformer Details
        </h3>

        <div style={{ marginBottom: "10px" }}>
          <strong>Type: – auto Transformer</strong>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <strong>Capacity: </strong>
          <input
            type="text"
            value={formData.capacity || ""}
            disabled
            style={{
              border: "none",
              borderBottom: "1px solid #333",
              background: "transparent",
              width: "100px",
            }}
          />
          <strong>MVA</strong>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <strong>Voltage Rating: </strong>
          <input
            type="text"
            value={formData.voltageRating || ""}
            disabled
            style={{
              border: "none",
              borderBottom: "1px solid #333",
              background: "transparent",
              width: "100px",
            }}
          />
          <strong>kV</strong>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <strong>Make: </strong>
          <input
            type="text"
            value={formData.make || ""}
            disabled
            style={{
              border: "none",
              borderBottom: "1px solid #333",
              background: "transparent",
              width: "200px",
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <strong>Serial Number: </strong>
          <input
            type="text"
            value={formData.serialNumber || ""}
            disabled
            style={{
              border: "none",
              borderBottom: "1px solid #333",
              background: "transparent",
              width: "200px",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "15px",
            textDecoration: "underline",
          }}
        >
          Subject:{" "}
          <em>
            Completion of Transformer Erection, Testing and Commissioning Work
          </em>
        </h3>

        <p style={{ lineHeight: "1.6", marginBottom: "15px" }}>
          This is to certify that the erection, Testing and commissioning of
          the above-mentioned transformer has been completed in accordance
          with the terms and conditions of the referenced order.
        </p>

        <p style={{ lineHeight: "1.6", marginBottom: "15px" }}>
          The installation work has been jointly inspected and found
          satisfactory by the undersigned representatives. The transformer was
          successfully charged/commissioned on no-load at
          <input
            type="time"
            value={formData.chargingDate || ""}
            disabled
            style={{
              border: "none",
              borderBottom: "1px solid #333",
              background: "transparent",
              margin: "0 5px",
            }}
          />
          hrs on
          <input
            type="date"
            value={formData.commissioningDate || ""}
            disabled
            style={{
              border: "none",
              borderBottom: "1px solid #333",
              background: "transparent",
              margin: "0 5px",
            }}
          />
          (date).
        </p>

        <p style={{ lineHeight: "1.6", marginBottom: "30px" }}>
          All works under the scope of the order has been completed.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "50px",
        }}
      >
        <div style={{ width: "45%" }}>
          <h4
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            For VPES, Nagpur
          </h4>

          <div style={{ marginBottom: "15px" }}>
            <strong>Name: </strong>
            <input
              type="text"
              value={formData.signatures?.vpesName || ""}
              disabled
              style={{
                border: "none",
                borderBottom: "1px solid #333",
                background: "transparent",
                width: "150px",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Designation: </strong>
            <input
              type="text"
              value={formData.signatures?.vpesDesignation || ""}
              disabled
              style={{
                border: "none",
                borderBottom: "1px solid #333",
                background: "transparent",
                width: "120px",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Signature: </strong>
            {formData.signatures?.vpesSignature && (
              <img 
                src={formData.signatures.vpesSignature} 
                alt="VPES Signature" 
                style={{ maxWidth: "200px", maxHeight: "100px", border: "1px solid #ccc", marginTop: "5px", display: "block" }}
              />
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Date: </strong>
            <input
              type="date"
              value={formData.signatures?.vpesDate || ""}
              disabled
              style={{
                border: "none",
                borderBottom: "1px solid #333",
                background: "transparent",
                width: "150px",
              }}
            />
          </div>
        </div>

        <div style={{ width: "45%" }}>
          <h4
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            For Customer
          </h4>

          <div style={{ marginBottom: "15px" }}>
            <strong>Name: </strong>
            <input
              type="text"
              value={formData.signatures?.customerName || ""}
              disabled
              style={{
                border: "none",
                borderBottom: "1px solid #333",
                background: "transparent",
                width: "150px",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Designation: </strong>
            <input
              type="text"
              value={formData.signatures?.customerDesignation || ""}
              disabled
              style={{
                border: "none",
                borderBottom: "1px solid #333",
                background: "transparent",
                width: "120px",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Signature: </strong>
            {formData.signatures?.customerSignature && (
              <img 
                src={formData.signatures.customerSignature} 
                alt="Customer Signature" 
                style={{ maxWidth: "200px", maxHeight: "100px", border: "1px solid #ccc", marginTop: "5px", display: "block" }}
              />
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Date: </strong>
            <input
              type="date"
              value={formData.signatures?.customerDate || ""}
              disabled
              style={{
                border: "none",
                borderBottom: "1px solid #333",
                background: "transparent",
                width: "150px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Stage 6 Review Renderer Component
const Stage6ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage6Forms = [
    {
      id: "work-completion-report",
      title: "Work Completion Report",
      fields: [
        { name: "customerName", label: "Customer Name", type: "text" },
        { name: "orderNumber", label: "Order Number", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "type", label: "Type", type: "text" },
        { name: "capacity", label: "Capacity", type: "text" },
        { name: "voltageRating", label: "Voltage Rating", type: "text" },
        { name: "make", label: "Make", type: "text" },
        { name: "serialNumber", label: "Serial Number", type: "text" },
        { name: "completionDate", label: "Completion Date", type: "date" },
        { name: "chargingDate", label: "Charging Date", type: "time" },
        { name: "commissioningDate", label: "Commissioning Date", type: "date" },
        { name: "signatures", label: "Signatures", type: "nested-object" }
      ]
    }
  ];

  const renderPhotos = (photos, formKey) => {
    if (!photos || typeof photos !== "object") return null;

    return (
      <div key={`${formKey}-photos`} className="form-group-preview photo-group" style={{ width: "100%" }}>
        <label className="form-label-preview">
          📸 Photos
        </label>
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === 'string') {
              if (url.startsWith("data:image/")) {
                fullUrl = url;
              } else if (url.startsWith("http")) {
                fullUrl = url;
              } else if (url.includes("cloudinary.com") || url.startsWith("v1")) {
                fullUrl = `${BACKEND_IMG_API_BASE_URL}${url}`;
              } else if (url.startsWith("/")) {
                fullUrl = `${BACKEND_API_BASE_URL}${url}`;
              } else {
                fullUrl = `${BACKEND_API_BASE_URL}/${url}`;
              }
            } else {
              fullUrl = "/placeholder.svg";
            }

            return (
              <div key={photoKey} className="photo-item" style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#f9fafb"
              }}>
                <span className="photo-label" style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                  textAlign: "center"
                }}>
                  {photoKey}
                </span>
                <img
                  src={fullUrl}
                  alt={photoKey}
                  className="photo-preview-img"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    cursor: "pointer"
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, '_blank');
                  }}
                />
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                  <a
                    href={fullUrl}
                    download={`${photoKey}.jpg`}
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontSize: "0.75rem"
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="stage6-review-container">
      {stage6Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        
        return (
          <div key={form.id} className="form-review-card" style={{
            marginBottom: "30px",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            background: "white",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}>
            <div className="company-header" style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>
                {form.title}
              </h2>
            </div>

            {/* Use the organized form component */}
            <Stage6Form1 formData={formData} />

            {/* Render photos if they exist */}
            {formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

const AutoTransformerStageReviewPanel = ({
  currentStageReview,
  selectedProjectForReview,
  currentStageForms,
  formDataFromDB,
  getStageStatus,
  formatLabel,
  handleApproveStage,
  handleRejectStage,
  onBackToCompanies
}) => {
  const renderStageSpecificUI = () => {
    switch(currentStageReview) {
      case 0:
        return <Stage0ReviewRenderer
          formDataFromDB={formDataFromDB}
          formatLabel={formatLabel}
        />;
      case 1:
        return <Stage1ReviewRenderer 
          formDataFromDB={formDataFromDB} 
          formatLabel={formatLabel}
        />;
      case 2:
        return <Stage2ReviewRenderer 
          formDataFromDB={formDataFromDB} 
          formatLabel={formatLabel}
        />;
      case 3:
        return <Stage3ReviewRenderer 
          formDataFromDB={formDataFromDB} 
          formatLabel={formatLabel}
        />;
      case 4:
        return <Stage4ReviewRenderer 
          formDataFromDB={formDataFromDB} 
          formatLabel={formatLabel}
        />;
      case 5:
        return <Stage5ReviewRenderer 
          formDataFromDB={formDataFromDB} 
          formatLabel={formatLabel}
        />;
      case 6:
        return <Stage6ReviewRenderer 
          formDataFromDB={formDataFromDB} 
          formatLabel={formatLabel}
        />;
      default:
        // Fallback to generic rendering for other stages
        return renderGenericFormReview();
    }
  };

  const renderGenericFormReview = () => {
    return (
      <>
        <div className="stage-review-summary">
          <div className="stage-info-card">
            <h3>Stage {currentStageReview} Information</h3>
            <p>
              <strong>Project:</strong> {selectedProjectForReview?.name}
            </p>
            <p>
              <strong>Total Forms:</strong> {currentStageForms.length}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {getStageStatus(selectedProjectForReview, currentStageReview)}
            </p>
          </div>
        </div>

        <div className="forms-review-grid">
          {Object.entries(formDataFromDB).map(([formKey, formData]) => (
            <div
              key={`${1}-${formKey}`}
              className={`form-review-card ${selectedProjectForReview?.status}`}
            >
              <div className="form-review-header">
                <h3>{formKey.replace("form", "Form ")}</h3>
                <span
                  className={`status-badge ${
                    selectedProjectForReview?.status === "approved"
                      ? "status-completed"
                      : selectedProjectForReview?.status === "rejected"
                      ? "status-pending"
                      : "status-progress"
                  }`}
                >
                  {selectedProjectForReview?.status === "approved" &&
                    "✅ Approved"}
                  {selectedProjectForReview?.status === "rejected" &&
                    "❌ Rejected"}
                  {selectedProjectForReview?.status === "pending-review" &&
                    "⏳ Pending Review"}
                </span>
              </div>

              <div className="form-layout-preview">
                <div
                  className="form-grid-preview"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "20px",
                  }}
                >
                  {Object.entries(formData).map(
                    ([fieldKey, fieldValue]) => {
                      // Handle photos specially
                      if (
                        fieldKey === "photos" &&
                        fieldValue &&
                        typeof fieldValue === "object"
                      ) {
                        return (
                          <div
                            key={`photos-${fieldKey}`}
                            className="form-group-preview photo-group"
                            style={{
                              width: "100%",
                            }}
                          >
                            <label className="form-label-preview">
                              📸{" "}
                              {fieldKey.charAt(0).toUpperCase() +
                                fieldKey.slice(1)}
                            </label>
                            <div className="photo-display-grid" style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                              gap: "15px",
                              marginTop: "10px"
                            }}>
                              {Object.entries(fieldValue).map(
                                ([photoKey, url]) => {
                                  // Handle different URL formats
                                  let fullUrl;
                                  if (typeof url === 'string') {
                                    if (url.startsWith("data:image/")) {
                                      // Base64 image
                                      fullUrl = url;
                                    } else if (url.startsWith("http")) {
                                      // Full URL (already complete)
                                      fullUrl = url;
                                    } else if (url.includes("cloudinary.com") || url.startsWith("v1")) {
                                      // Cloudinary image path - use BACKEND_IMG_API_BASE_URL
                                      fullUrl = `${BACKEND_IMG_API_BASE_URL}${url}`;
                                    } else if (url.startsWith("/")) {
                                      // Absolute path for local files
                                      fullUrl = `${BACKEND_API_BASE_URL}${url}`;
                                    } else {
                                      // Relative path for local files
                                      fullUrl = `${BACKEND_API_BASE_URL}/${url}`;
                                    }
                                  } else {
                                    fullUrl = "/placeholder.svg";
                                  }

                                  return (
                                    <div
                                      key={photoKey}
                                      className="photo-item"
                                      style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        backgroundColor: "#f9fafb"
                                      }}
                                    >
                                      <span className="photo-label" style={{
                                        display: "block",
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        color: "#374151",
                                        marginBottom: "8px",
                                        textAlign: "center"
                                      }}>
                                        {photoKey}
                                      </span>
                                      <img
                                        src={fullUrl}
                                        alt={photoKey}
                                        className="photo-preview-img"
                                        style={{
                                          width: "100%",
                                          height: "150px",
                                          objectFit: "cover",
                                          borderRadius: "6px",
                                          border: "1px solid #d1d5db",
                                          cursor: "pointer"
                                        }}
                                        onError={(e) => {
                                          console.error(`Failed to load image: ${fullUrl}`);
                                          e.target.src = "/placeholder.svg";
                                        }}
                                        onClick={() => {
                                          // Open image in new tab for better viewing
                                          window.open(fullUrl, '_blank');
                                        }}
                                      />
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        );
                      }

                      // Handle strings & numbers with form input styling
                      if (
                        typeof fieldValue === "string" ||
                        typeof fieldValue === "number"
                      ) {
                        return (
                          <div
                            key={`field-${fieldKey}`}
                            className="form-group-preview"
                          >
                            <label className="form-label-preview">
                              {formatLabel(fieldKey)}
                            </label>
                            <div className="form-input-display">
                              <input
                                type="text"
                                value={fieldValue}
                                disabled
                                className="form-input disabled preview"
                              />
                            </div>
                          </div>
                        );
                      }

                      // Handle nested objects (like accessories)
                      if (
                        typeof fieldValue === "object" &&
                        fieldValue !== null &&
                        !Array.isArray(fieldValue) &&
                        fieldKey !== "photos"
                      ) {
                        return (
                          <div
                            key={`nested-${fieldKey}`}
                            className="form-group-preview nested-object-group"
                          >
                            <label className="form-label-preview">
                              📋 {formatLabel(fieldKey)}
                            </label>
                            <div
                              className="nested-object-display"
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "15px",
                                marginTop: "10px",
                              }}
                            >
                              {Object.entries(fieldValue).map(
                                ([nestedKey, nestedValue]) => (
                                  <div
                                    key={`${fieldKey}-${nestedKey}`}
                                    className="nested-item"
                                    style={{
                                      padding: "12px",
                                      border: "1px solid #e5e7eb",
                                      borderRadius: "8px",
                                      backgroundColor: "#f9fafb",
                                    }}
                                  >
                                    <h5
                                      style={{
                                        margin: "0 0 10px 0",
                                        color: "#374151",
                                        fontSize: "0.9rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {formatLabel(fieldKey)} - {nestedKey}
                                    </h5>
                                    {typeof nestedValue === "object" &&
                                    nestedValue !== null ? (
                                      <div
                                        className="nested-fields-grid"
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns:
                                            "repeat(auto-fit, minmax(200px, 1fr))",
                                          gap: "10px",
                                        }}
                                      >
                                        {Object.entries(nestedValue).map(
                                          ([subKey, subValue]) => (
                                            <div
                                              key={`${nestedKey}-${subKey}`}
                                              className="nested-field"
                                            >
                                              <label
                                                className="nested-field-label"
                                                style={{
                                                  fontSize: "0.8rem",
                                                  color: "#6b7280",
                                                  fontWeight: "500",
                                                }}
                                              >
                                                {formatLabel(subKey)}:
                                              </label>
                                              <div className="nested-field-value">
                                                <input
                                                  type="text"
                                                  value={subValue || ""}
                                                  disabled
                                                  className="form-input disabled preview"
                                                  style={{
                                                    fontSize: "0.85rem",
                                                    padding: "6px 8px",
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <div className="form-input-display">
                                        <input
                                          type="text"
                                          value={nestedValue || ""}
                                          disabled
                                          className="form-input disabled preview"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        );
                      }

                      // Handle arrays
                      if (Array.isArray(fieldValue)) {
                        return (
                          <div
                            key={`array-${fieldKey}`}
                            className="form-group-preview array-group"
                          >
                            <label className="form-label-preview">
                              📝 {formatLabel(fieldKey)}
                            </label>
                            <div className="array-display">
                              {fieldValue.length === 0 ? (
                                <div className="form-input-display">
                                  <input
                                    type="text"
                                    value="No data"
                                    disabled
                                    className="form-input disabled preview"
                                  />
                                </div>
                              ) : (
                                fieldValue.map((item, index) => (
                                  <div
                                    key={`${fieldKey}-${index}`}
                                    className="array-item"
                                    style={{
                                      marginBottom: "10px",
                                      padding: "10px",
                                      border: "1px solid #e5e7eb",
                                      borderRadius: "6px",
                                      backgroundColor: "#f9fafb",
                                    }}
                                  >
                                    {typeof item === "object" &&
                                    item !== null ? (
                                      <div>
                                        <h6
                                          style={{
                                            margin: "0 0 8px 0",
                                            fontSize: "0.85rem",
                                          }}
                                        >
                                          Item {index + 1}
                                        </h6>
                                        {Object.entries(item).map(
                                          ([itemKey, itemValue]) => (
                                            <div
                                              key={itemKey}
                                              style={{
                                                marginBottom: "5px",
                                              }}
                                            >
                                              <span
                                                style={{
                                                  fontSize: "0.8rem",
                                                  color: "#6b7280",
                                                }}
                                              >
                                                {formatLabel(itemKey)}:
                                              </span>
                                              <input
                                                type="text"
                                                value={itemValue || ""}
                                                disabled
                                                className="form-input disabled preview"
                                                style={{
                                                  marginLeft: "8px",
                                                  fontSize: "0.8rem",
                                                }}
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <input
                                        type="text"
                                        value={item || ""}
                                        disabled
                                        className="form-input disabled preview"
                                      />
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    }
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      {/* Section Header */}
      <div className="section-header">
        <div>
          <h2>Stage {currentStageReview} Forms Review</h2>
          <p>Review all forms submitted for Stage {currentStageReview}</p>
        </div>
        <button onClick={onBackToCompanies} className="back-btn">
          ← Back to Companies
        </button>
      </div>

      {/* Stage Review Summary */}
      <div className="stage-review-summary">
        <div className="stage-info-card">
          <h3>Stage {currentStageReview} Information</h3>
          <p>
            <strong>Project:</strong> {selectedProjectForReview?.name}
          </p>
          <p>
            <strong>Total Forms:</strong> {currentStageForms.length}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {getStageStatus(selectedProjectForReview, currentStageReview)}
          </p>
        </div>
      </div>

      {/* Render Stage-Specific UI */}
      {renderStageSpecificUI()}

      {/* Stage Approval Actions */}
      <div className="stage-approval-actions">
        <button
          onClick={() => handleApproveStage(selectedProjectForReview)}
          className="approve-stage-btn"
          disabled={selectedProjectForReview.length === 0}
        >
          ✅ Approve Stage {currentStageReview}
        </button>
        <button
          onClick={() => handleRejectStage(selectedProjectForReview)}
          className="reject-stage-btn"
          disabled={selectedProjectForReview.length === 0}
        >
          ❌ Reject Stage {currentStageReview}
        </button>
      </div>
    </>
  );
};

// Export form components for reuse in other files
export {
  Stage0ReviewRenderer,
  Stage1Form1,
  Stage1Form2,
  Stage1Form3,
  Stage1Form4,
  Stage1Form5,
  Stage2Form1,
  Stage2Form2,
  Stage3Form1,
  Stage3Form2,
  Stage3Form3,
  Stage4Form1,
  Stage4Form2,
  Stage4Form3,
  Stage4Form4,
  Stage5Form1,
  Stage5Form2,
  Stage6Form1,
  Stage1ReviewRenderer,
  Stage2ReviewRenderer,
  Stage3ReviewRenderer,
  Stage4ReviewRenderer,
  Stage5ReviewRenderer,
  Stage6ReviewRenderer
};

export default AutoTransformerStageReviewPanel;
