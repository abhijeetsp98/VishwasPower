import React from 'react';
import { BACKEND_API_BASE_URL, BACKEND_IMG_API_BASE_URL } from './constant';
import { Stage0ReviewRenderer } from './AutoTransformerStageReviewPanel';

// Stage 1 Form 1: Name Plate Details Transformer
const Stage1Form1 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>NAME PLATE DETAILS TRANSFORMER /REACTOR</h2>
    </div>

    <table className="form-table">
      <tbody>
        <tr>
          <td>
            <strong>MAKE</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.make || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>CURRENT HV (A)</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.currentHV || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>SR. NO.</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.srNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>LV (A)</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.currentLV || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>MVA Rating</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.mvaRating || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Temp. Rise over amb. Oil in °C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.tempRiseOilC || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>HV (KV)</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hvKv || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Winding in °C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.windingC || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>LV (KV)</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lvKv || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Oil Quantity</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.oilQuantity || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>% Impedance</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.impedancePercent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Weight of Core & Wdg.</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.weightCoreWdg || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Year of Mfg.</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.yearOfMfg || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>TRANSPORTING WEIGHT</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.transportingWeight || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>NO. OF COOLING FAN</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.noOfCoolingFan || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Total Weight</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.totalWeight || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            {/* <strong>NO OF OIL PUMP</strong> */}
          </td>
          <td>
            {/* <input
              type="text"
              value={formData.noOfOilPump || ""}
              disabled
              className="form-input disabled preview"
            /> */}
          </td>
          <td>
            <strong>NO. OF RADIATORS</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.noOfRadiators || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>NO. OF TAPS</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.noOfTaps || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>MFG. OF OCTC</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.mfgOfOctc || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>TYPE OF OCTC</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.typeOfOctc || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>SR. NO. OCTC</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.srNoOctc || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Photo Upload Section for Review */}
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
        Transformer, Oil Level gauge, Wheel Locking, Transformer Foundation Level condition.
      </p>

      {formData.photos && (
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(formData.photos).map(([photoKey, url]) => {
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
      )}
    </div>
  </div>
);

// Stage 1 Form 2: Protocol for Accessories Checking
const Stage1Form2 = ({ formData }) => {
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

  return (
    <div className="form-container">
      <div className="company-header">
        <h2>PROTOCOL FOR ACCESSORIES CHECKING.</h2>
      </div>

      <table className="form-table">
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
          {accessoryItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <input
                  type="text"
                  value={formData?.accessories?.[item.id]?.packingCase || ""}
                  disabled
                  className="form-input disabled preview"
                />
              </td>
              <td>
                <strong>{item.description}</strong>
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.accessories?.[item.id]?.qtyPerPL || ""}
                  disabled
                  className="form-input disabled preview"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.accessories?.[item.id]?.qtyReceived || ""}
                  disabled
                  className="form-input disabled preview"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.accessories?.[item.id]?.shortQty || ""}
                  disabled
                  className="form-input disabled preview"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.accessories?.[item.id]?.damagedQty || ""}
                  disabled
                  className="form-input disabled preview"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Photo Upload Section for Review */}
      <div className="photo-upload-section">
        <h4>Note: - Photographs to be added: -</h4>
        <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
          Transformer Accessories
        </p>

        {formData.photos && (
          <div className="photo-display-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "10px"
          }}>
            {Object.entries(formData.photos).map(([photoKey, url]) => {
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
        )}
      </div>
    </div>
  );
};

// Stage 1 Form 3: Core Insulation Check
const Stage1Form3 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>CORE INSULATION CHECK: At 1KV &gt; 500 MΩ </h2>
    </div>

    <table className="form-table">
      <thead>
        <tr>
          <th> </th>
          <th>Obtained Value (MΩ)</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Between Core - Frame</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.coreFrame_obtainedValue || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.coreFrame_remarks || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Between Frame - Tank</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.frameTank_obtainedValue || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.frameTank_remarks || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Between Core - Tank</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.coreTank_obtainedValue || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.coreTank_remarks || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <strong>CHECKLIST FOR CONFORMING AVAILABILITY OF EQUIPMENT AT SITE</strong>
    <table className="form-table" style={{ marginTop: "20px" }}>
      <thead>
        <tr>
          <th> </th>
          <th>Decription</th>
          <th>Rating/Capacity</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>1</strong>
          </td>
          <td>
            <strong>Whether the Filter Machine is Available </strong>
          </td>
          
          <td>
            <select
              value={formData.filterMachine || ""}
              disabled
              className="form-input disabled preview"
            >
              <option value="">(Yes/No)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <strong>2</strong>
          </td>
          <td>
            <strong>Capacity of Filter Machine</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.filterMachineCapacity || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>3</strong>
          </td>
          <td>
            <strong>Capacity of the Vacuum Pump to be used. </strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.vacuumPumpCapacity || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>4</strong>
          </td>
          <td>
            <strong>Whether the Reservoir is Available with valves and a breather. </strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.reservoirAvailable || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>5</strong>
          </td>
          <td>
            <strong>Capacity of Reservoirs </strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.reservoirCapacity || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>6</strong>
          </td>
          <td>
            <strong>Hose Pipes for the Filtration Process.  </strong>
          </td>
          <td>
            <select
              value={formData.hosePipes || ""}
              disabled
              className="form-input disabled preview"
            >
              <option value="">(Yes/No)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <strong>7</strong>
          </td>
          <td>
            <strong>Whether Crane is Available in good condition </strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.craneAvailable || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>8</strong>
          </td>
          <td>
            <strong>Dry air  </strong>
          </td>
          <td>
            <select
              value={formData.dryAir || ""}
              disabled
              className="form-input disabled preview"
            >
              <option value="">(Yes/No)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <strong>9</strong>
          </td>
          <td>
            <strong>Dew point meter </strong>
          </td>
          <td>
            <select
              value={formData.dewPointMeter || ""}
              disabled
              className="form-input disabled preview"
            >
              <option value="">(Yes/No)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <strong>10</strong>
          </td>
          <td>
            <strong>Mec Leod gauge  </strong>
          </td>
          <td>
            <select
              value={formData.mecLeodGauge || ""}
              disabled
              className="form-input disabled preview"
            >
              <option value="">(Yes/No)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </td>
        </tr>

      </tbody>
    </table>

    <strong>SAFETY EQUIPMENT</strong>
    <table className="form-table" style={{ marginTop: "20px" }}>
      <thead>
        <tr>
          <th>Decription</th>
          <th>Confirmation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Fire extinguisher/Fire sand bucket</strong>
          </td>
          
          <td>
            <select
              value={formData.fireExtinguisher || ""}
              disabled
              className="form-input disabled preview"
            >
              <option value="">(Yes/No)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <strong>First aid kit</strong>
          </td>
          <td>
            <select
              value={formData.firstAidKit || ""}
              disabled
              className="form-input disabled preview"
            >
              <option value="">(Yes/No)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <strong>PPE for the working team of ETC agency, like - Safety shoes, Helmet, etc</strong>
          </td>
         <td>
            <select
              value={formData.ppeEquipment || ""}
              disabled
              className="form-input disabled preview"
            >
              <option value="">(Yes/No)</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    {/* Photo Upload Section for Review */}
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
        Ten delta kit, calibration report, during ten delta of bushing photo
      </p>

      {formData.photos && (
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(formData.photos).map(([photoKey, url]) => {
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
      )}
    </div>
  </div>
);

// Stage 1 Form 4: Pre erection Ratio test of turret CTs
const Stage1Form4 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>Pre erection Ratio test of turret CTs</h2>
    </div>

    {/* Phase 1.1 Section */}
    <h3 style={{ textAlign: "center", marginTop: "30px" }}>CT Ratio CORE - S1-S2,S1-S3 Phase 1.1</h3>

    <h4>CT Ratio Test</h4>
    <table className="form-table">
      <thead>
        <tr>
          <th>Current %</th>
          <th>Applied primary Current (A) S1-S2</th>
          <th>Applied primary Current (A) S1-S3</th>
          <th>Measured secondary current (A) S1-S2</th>
          <th>Measured secondary current (A) S1-S3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>20%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_20percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_20percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_20percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_20percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>40%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_40percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_40percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_40percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_40percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>60%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_60percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_60percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_60percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_60percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>80%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_80percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_80percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_80percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_80percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>100%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_100percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_100percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_100percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_100percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4>Knee point Voltage</h4>
    <table className="form-table">
      <thead>
        <tr>
          <th>Voltage %</th>
          <th>Applied voltage S1-S2</th>
          <th>Applied voltage S1-S3</th>
          <th>Measured current (mA) S1-S2</th>
          <th>Measured current (mA) S1-S3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>20%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_20percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_20percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_20percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_20percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>40%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_40percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_40percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_40percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_40percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>60%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_60percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_60percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_60percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_60percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>80%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_80percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_80percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_80percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_80percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>100%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_100percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_100percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_100percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_100percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>110%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_110percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_110percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_110percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_110percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Phase 1.2 Section */}
    <h3 style={{ textAlign: "center", marginTop: "40px" }}>Phase 1.2</h3>

    <h4>CT Ratio CORE – S1-S2, S1-S3</h4>
    <table className="form-table">
      <thead>
        <tr>
          <th>Current %</th>
          <th>Applied primary Current (A) S1-S2</th>
          <th>Applied primary Current (A) S1-S3</th>
          <th>Measured secondary current (A) S1-S2</th>
          <th>Measured secondary current (A) S1-S3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>20%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_20percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_20percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_20percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_20percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>40%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_40percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_40percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_40percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_40percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>60%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_60percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_60percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_60percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_60percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>80%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_80percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_80percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_80percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_80percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>100%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_100percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_100percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_100percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_100percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4>Knee point Voltage</h4>
    <table className="form-table">
      <thead>
        <tr>
          <th>Voltage %</th>
          <th>Applied voltage S1-S2</th>
          <th>Applied voltage S1-S3</th>
          <th>Measured current (mA) S1-S2</th>
          <th>Measured current (mA) S1-S3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>20%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_20percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_20percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_20percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_20percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>40%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_40percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_40percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_40percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_40percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>60%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_60percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_60percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_60percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_60percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>80%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_80percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_80percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_80percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_80percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>100%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_100percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_100percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_100percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_100percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>110%</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_110percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_110percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_110percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_110percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Photo Upload Section for Review */}
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
        CT Ratio kit calibration
      </p>

      {formData.photos && (
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(formData.photos).map(([photoKey, url]) => {
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
      )}
    </div>
  </div>
);

// Stage 1 Form 5: Pre erection Ratio test of turret CTs
const Stage1Form5 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>Pre erection Ratio test of turret CTs</h2>
    </div>

    {/* Phase 2.1 Section */}
    <h3 style={{ textAlign: "center", marginTop: "30px" }}>Phase 2.1</h3>

    <h4>CT Ratio CORE – S1-S2, S1-S3</h4>
    <table className="form-table">
      <thead>
        <tr>
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
          <td>
            <input
              type="text"
              value={formData.phase31_20percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_20percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_20percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_20percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>40%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase31_40percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_40percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_40percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_40percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>60%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase31_60percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_60percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_60percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_60percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>80%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase31_80percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_80percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_80percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_80percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>100%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase31_100percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_100percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_100percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_100percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4>Knee point Voltage</h4>
    <table className="form-table">
      <thead>
        <tr>
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
          <td>
            <input
              type="text"
              value={formData.phase31_knee_20percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_20percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_20percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_20percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>40%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_40percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_40percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_40percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_40percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>60%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_60percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_60percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_60percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_60percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>80%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_80percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_80percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_80percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_80percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>100%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_100percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_100percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_100percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_100percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>110%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_110percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_110percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_110percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase31_knee_110percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Phase 2.2 Section */}
    <h3 style={{ textAlign: "center", marginTop: "40px" }}>Phase 2.2</h3>

    <h4>CT Ratio CORE – S1-S2, S1-S3</h4>
    <table className="form-table">
      <thead>
        <tr>
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
          <td>
            <input
              type="text"
              value={formData.phase32_20percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_20percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_20percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_20percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>40%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase32_40percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_40percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_40percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_40percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>60%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase32_60percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_60percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_60percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_60percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>80%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase32_80percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_80percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_80percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_80percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>100%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase32_100percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_100percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_100percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_100percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4>Knee point Voltage</h4>
    <table className="form-table">
      <thead>
        <tr>
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
          <td>
            <input
              type="text"
              value={formData.phase32_knee_20percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_20percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_20percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_20percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>40%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_40percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_40percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_40percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_40percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>60%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_60percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_60percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_60percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_60percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>80%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_80percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_80percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_80percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_80percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>100%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_100percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_100percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_100percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_100percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>110%</strong></td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_110percent_appliedVoltage_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_110percent_appliedVoltage_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_110percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.phase32_knee_110percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    {/* WTI Section */}
    <h3 style={{ textAlign: "center", marginTop: "40px" }}>WTI</h3>

    <h4>CT Ratio CORE - S1-S2, S1-S3, S1-S4, S1-S5, S1-S6, S1-S7</h4>
    <table className="form-table">
      <thead>
        <tr>
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
          <td>
            <input
              type="text"
              value={formData.wti_20percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_20percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_20percent_appliedCurrent_s1s4 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_20percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_20percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_20percent_measuredCurrent_s1s4 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>40%</strong></td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_appliedCurrent_s1s4 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_measuredCurrent_s1s4 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>60%</strong></td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_appliedCurrent_s1s4 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_measuredCurrent_s1s4 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>80%</strong></td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_appliedCurrent_s1s4 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_measuredCurrent_s1s4 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>100%</strong></td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_appliedCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_appliedCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_appliedCurrent_s1s4 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_measuredCurrent_s1s2 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_measuredCurrent_s1s3 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_measuredCurrent_s1s4 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4>CT Ratio CORE - S1-S2, S1-S3, S1-S4, S1-S5, S1-S6, S1-S7</h4>
    <table className="form-table">
      <thead>
        <tr>
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
          <td>
            <input
              type="text"
              value={formData.wti_20percent_appliedCurrent_s1s5 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_20percent_appliedCurrent_s1s6 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_20percent_appliedCurrent_s1s7 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_20percent_measuredCurrent_s1s5 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_20percent_measuredCurrent_s1s6 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_20percent_measuredCurrent_s1s7 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>40%</strong></td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_appliedCurrent_s1s5 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_appliedCurrent_s1s6 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_appliedCurrent_s1s7 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_measuredCurrent_s1s5 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_measuredCurrent_s1s6 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_40percent_measuredCurrent_s1s7 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>60%</strong></td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_appliedCurrent_s1s5 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_appliedCurrent_s1s6 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_appliedCurrent_s1s7 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_measuredCurrent_s1s5 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_measuredCurrent_s1s6 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_60percent_measuredCurrent_s1s7 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>80%</strong></td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_appliedCurrent_s1s5 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_appliedCurrent_s1s6 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_appliedCurrent_s1s7 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_measuredCurrent_s1s5 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_measuredCurrent_s1s6 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_80percent_measuredCurrent_s1s7 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>100%</strong></td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_appliedCurrent_s1s5 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_appliedCurrent_s1s6 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_appliedCurrent_s1s7 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_measuredCurrent_s1s5 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_measuredCurrent_s1s6 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.wti_100percent_measuredCurrent_s1s7 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Photo Upload Section for Review */}
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
        CT Ratio kit calibration
      </p>

      {formData.photos && (
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(formData.photos).map(([photoKey, url]) => {
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
      )}
    </div>
  </div>
);

const Stage1Form6 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>TAN DELTA AND CAPACITANCE TEST ON BUSHING</h2>
    </div>

    <table className="form-table">
      <tbody>
        <tr>
          <td><strong>METER USED</strong></td>
          <td>
            <input
              type="text"
              value={formData.meterUsed || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td><strong>DATE</strong></td>
          <td>
            <input
              type="text"
              value={formData.date || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td><strong>TIME</strong></td>
          <td>
            <input
              type="text"
              value={formData.time || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>MODEL & S. NO.</strong></td>
          <td>
            <input
              type="text"
              value={formData.modelSrNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td><strong>WTI</strong></td>
          <td>
            <input
              type="text"
              value={formData.wti || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td><strong>OTI</strong></td>
          <td>
            <input
              type="text"
              value={formData.oti || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table">
      <thead>
        <tr>
          <th> </th>
          <th>1.1</th>
          <th>1.2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>BUSHING SR. NO.HV</strong></td>
          <td>
            <input
              type="text"
              value={formData.hvBushing11_srNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing12_srNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4>Status</h4>
    <table className="form-table">
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
          <td>
            <input
              type="text"
              value={formData.hvBushing11_05kv_tanDelta || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing11_05kv_capacitance || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing11_05kv_excitationCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing11_05kv_dielectricLoss || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>1.2</strong></td>
          <td>
            <input
              type="text"
              value={formData.hvBushing12_05kv_tanDelta || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing12_05kv_capacitance || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing12_05kv_excitationCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing12_05kv_dielectricLoss || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table">
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
          <td>
            <input
              type="text"
              value={formData.hvBushing11_10kv_tanDelta || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing11_10kv_capacitance || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing11_10kv_excitationCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing11_10kv_dielectricLoss || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>1.2</strong></td>
          <td>
            <input
              type="text"
              value={formData.hvBushing12_10kv_tanDelta || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing12_10kv_capacitance || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing12_10kv_excitationCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvBushing12_10kv_dielectricLoss || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h3 style={{ textAlign: "center", marginTop: "40px" }}>TYPE OF TEST – TAN DELTA AND CAPACITANCE TEST ON LV BUSHING</h3>
    <table className="form-table">
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
          <td>
            <input
              type="text"
              value={formData.lvBushing21_srNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing22_srNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4>Status</h4>
    <table className="form-table">
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
          <td>
            <input
              type="text"
              value={formData.lvBushing21_05kv_tanDelta || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing21_05kv_capacitance || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing21_05kv_excitationCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing21_05kv_dielectricLoss || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>2.2</strong></td>
          <td>
            <input
              type="text"
              value={formData.lvBushing22_05kv_tanDelta || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing22_05kv_capacitance || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing22_05kv_excitationCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing22_05kv_dielectricLoss || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table">
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
          <td>
            <input
              type="text"
              value={formData.lvBushing21_10kv_tanDelta || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing21_10kv_capacitance || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing21_10kv_excitationCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing21_10kv_dielectricLoss || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td><strong>2.2</strong></td>
          <td>
            <input
              type="text"
              value={formData.lvBushing22_10kv_tanDelta || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing22_10kv_capacitance || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing22_10kv_excitationCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvBushing22_10kv_dielectricLoss || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Photo Upload Section for Review */}
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
        Tan Delta Kit, Calibration Report, During Tan Delta of bushing photo
      </p>

      {formData.photos && (
        <div className="photo-display-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px"
        }}>
          {Object.entries(formData.photos).map(([photoKey, url]) => {
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
      )}
    </div>
  </div>
);


const Stage1Form7 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>RECORD OF MEASUREMENT OF IR VALUES</h2>
    </div>
    <h3>Before Erection</h3>

    <table className="form-table">
      <tbody>
        <tr>
          <td><strong>Date</strong></td>
          <td>
            <input type="text" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td><strong>Time</strong></td>
          <td>
            <input type="text" value={formData.time || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td><strong>Amb Temp:</strong></td>
          <td>
            <input type="text" value={formData.ambTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td><strong>Make:</strong></td>
          <td>
            <input type="text" value={formData.make || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td><strong>Oil Temp:</strong></td>
          <td>
            <input type="text" value={formData.oilTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td><strong>Sr No:</strong></td>
          <td>
            <input type="text" value={formData.srNo || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td><strong>Wdg. Temp:</strong></td>
          <td>
            <input type="text" value={formData.wdgTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td><strong>Range:</strong></td>
          <td>
            <input type="text" value={formData.range || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td><strong>Relative Humidity</strong></td>
          <td>
            <input
              type="text"
              value={formData.relativeHumidity || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td><strong>Voltage Level:</strong></td>
          <td>
            <input
              type="text"
              value={formData.voltageLevel || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table">
      <thead>
        <tr>
          <th> </th>
          <th>10 Sec (MΩ)</th>
          <th>60 Sec (MΩ)</th>
          <th>Ratio of IR 60/IR 10</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>HV-Earth</strong></td>
          <td>
            <input type="text" value={formData.hvEarth_10sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvEarth_60sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvEarth_ratio || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td><strong>LV-Earth</strong></td>
          <td>
            <input type="text" value={formData.lvEarth_10sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.lvEarth_60sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.lvEarth_ratio || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td><strong>HV-LV</strong></td>
          <td>
            <input type="text" value={formData.hvLv_10sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvLv_60sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvLv_ratio || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Photo Upload Section for Review */}
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>

      {formData.photos && (
        <div
          className="photo-display-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          {Object.entries(formData.photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === "string") {
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
              <div
                key={photoKey}
                className="photo-item"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "10px",
                  backgroundColor: "#f9fafb",
                }}
              >
                <span
                  className="photo-label"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
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
                    cursor: "pointer",
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, "_blank");
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
                      fontSize: "0.75rem",
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

// Stage 2 Form 1: Record of Oil Handling
const Stage2Form1 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>RECORD OF OIL HANDLING</h2>
      <h3>TEST VALUES PRIOR TO FILTERATION</h3>
    </div>

    <h4>Record of Oil Filling in the Reservoirs Tank:</h4>
    <table className="form-table">
      <thead>
        <tr>
          <th></th>
          <th>No of barrels</th>
          <th>Started on Date & time</th>
          <th>Completed on Date & time</th>
          <th>BDV</th>
          <th>PPM</th>
        </tr>
      </thead>
      <tbody>
        {[
          { label: "Tank1", prefix: "tank1" },
          { label: "Tank2", prefix: "tank2" },
          { label: "Tank3", prefix: "tank3" },
        ].map(({ label, prefix }) => (
          <tr key={prefix}>
            <td>
              <strong>{label}</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData?.[`${prefix}_noOfBarrels`] || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="date"
                  value={formData?.[`${prefix}_startedDate`] || ""}
                  disabled
                  className="form-input disabled preview"
                  style={{ width: "50%" }}
                />
                <input
                  type="time"
                  value={formData?.[`${prefix}_startedTime`] || ""}
                  disabled
                  className="form-input disabled preview"
                  style={{ width: "50%" }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="date"
                  value={formData?.[`${prefix}_completedDate`] || ""}
                  disabled
                  className="form-input disabled preview"
                  style={{ width: "50%" }}
                />
                <input
                  type="time"
                  value={formData?.[`${prefix}_completedTime`] || ""}
                  disabled
                  className="form-input disabled preview"
                  style={{ width: "50%" }}
                />
              </div>
            </td>
            <td>
              <input
                type="text"
                value={formData?.[`${prefix}_bdv`] || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={formData?.[`${prefix}_ppm`] || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px" }}>Reservoir Tank Filtration</h4>
    <table className="form-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Vacuum Level (mmHg or torr)</th>
          <th>Inlet Temp °C</th>
          <th>Outlet Temp °C</th>
        </tr>
      </thead>
      <tbody>
        {formData.filtrationRecords &&
          formData.filtrationRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={record.date || ""}
                  disabled
                  className="form-input disabled preview"
                />
              </td>
              <td>
                <input
                  type="time"
                  value={record.time || ""}
                  disabled
                  className="form-input disabled preview"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevel || ""}
                  disabled
                  className="form-input disabled preview"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.inletTemp || ""}
                  disabled
                  className="form-input disabled preview"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.outletTemp || ""}
                  disabled
                  className="form-input disabled preview"
                />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

const Stage2Form2 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>Line Lead Clearance in mm :-</h2>
    </div>

    <table className="form-table">
      <thead>
        <tr>
          <th></th>
          <th>1.1</th>
          <th></th>
          <th>1.2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>HV with respect to earth</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hv_earth_11 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td></td>
          <td>
            <input
              type="text"
              value={formData.hv_earth_12 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>LV 1 with respect to earth</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lv1_earth_21 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td></td>
          <td>
            <input
              type="text"
              value={formData.lv1_earth_22 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h3 style={{ marginTop: "40px", textAlign: "center" }}>
      IR Values After erection Temp OTI .......°C WTI.............°C, AMB .............°C RANGE ONLY 1 KV
    </h3>

    <table className="form-table">
      <tbody>
        <tr>
          <td>
            <strong>Temp OTI °C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.tempOTI || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Temp WTI °C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.tempWTI || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Temp AMB °C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.tempAMB || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "30px" }}>
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
          <td>
            <strong>HV-Earth</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_10sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_60sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_ratio || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>LV-Earth</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lvEarth_10sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvEarth_60sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvEarth_ratio || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>HV-LV</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv_10sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv_60sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv_ratio || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px" }}>Before oil filling in main tank</h4>
    <table className="form-table">
      <tbody>
        <tr>
          <td>
            <strong>BDV (KV)</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.bdv || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Water Content (PPM)</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.waterContent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);


const Stage3Form1 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>DETAILS FOR RECORDING OF VACUUM CYCLE</h2>
    </div>

    <table className="form-table">
      <tbody>
        <tr>
          <td><strong>Vacuum hose Checked By</strong></td>
          <td>
            <input
              type="text"
              value={formData.vacuumHoseCheckedBy || ""}
              disabled
              className="form-input disabled preview"
              style={{ width: "100%" }}
            />
          </td>
        </tr>
        <tr>
          <td><strong>Vacuum hose Connected To</strong></td>
          <td>
            <input
              type="text"
              value={formData.vacuumHoseConnectedTo || ""}
              disabled
              className="form-input disabled preview"
              style={{ width: "100%" }}
            />
            <span style={{ marginLeft: "10px" }}>Valve.</span>
          </td>
        </tr>
        <tr>
          <td><strong>Evacuation Started At</strong></td>
          <td>
            <input
              type="time"
              value={formData.evacuationStartedAt || ""}
              disabled
              className="form-input disabled preview"
              style={{ marginRight: "10px" }}
            />
            <span>Hrs. On</span>
            <input
              type="date"
              value={formData.evacuationStartedOn || ""}
              disabled
              className="form-input disabled preview"
              style={{ marginLeft: "10px" }}
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "30px" }}>
      <thead>
        <tr>
          <th>DATE</th>
          <th>TIME</th>
          <th>Vacuum Level (mmHg or torr)</th>
          <th>Vac. Level in Transformer Tank (torr)</th>
        </tr>
      </thead>
      <tbody>
        {(formData.vacuumRecords || []).map((record, index) => (
          <tr key={index}>
            <td>
              <input type="date" value={record.date || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="time" value={record.time || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input
                type="text"
                value={record.vacuumLevelMic || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.vacuumLevelTransformer || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3 style={{ marginTop: "40px", textAlign: "center" }}>
      IR After oil Topping up To Conservator Temp OTI .......°C WTI.............°C, AMB .............°C RANGE ONLY 1 KV
    </h3>

    <table className="form-table">
      <tbody>
        <tr>
          <td><strong>Temp OTI °C</strong></td>
          <td>
            <input type="text" value={formData.tempOTI || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td><strong>Temp WTI °C</strong></td>
          <td>
            <input type="text" value={formData.tempWTI || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td><strong>Temp AMB °C</strong></td>
          <td>
            <input type="text" value={formData.tempAMB || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "30px" }}>
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
          <td>
            <input type="text" value={formData.hvEarth_10sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvEarth_60sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvEarth_ratio || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td><strong>LV-Earth</strong></td>
          <td>
            <input type="text" value={formData.lvEarth_10sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.lvEarth_60sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.lvEarth_ratio || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td><strong>HV-LV</strong></td>
          <td>
            <input type="text" value={formData.hvLv_10sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvLv_60sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvLv_ratio || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px", textAlign: "center" }}>PRESSURE TEST REPORT</h4>

    <table className="form-table">
      <tbody>
        <tr>
          <td><strong>DATE</strong></td>
          <td>
            <input
              type="date"
              value={formData.pressureTestDate || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table">
      <thead>
        <tr>
          <th>Sr. No.</th>
          <th>TIME STARTED</th>
          <th>PRESSURE Kg/cm²</th>
          <th colSpan="3">TEMP°C</th>
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
        {(formData.pressureTests || []).map((test, index) => (
          <tr key={index}>
            <td><strong>{index + 1}</strong></td>
            <td>
              <input
                type="time"
                value={test.timeStarted || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={test.pressure || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={test.tempAmb || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={test.tempOti || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={test.tempWti || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


// Stage 4 Form Components (for review display)
const Stage4Form1 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>RECORD FOR OIL FILTRATION</h2>
      <h3>Oil filtration of Main Tank</h3>
    </div>

    <table className="form-table">
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
        {(formData.filtrationRecords || []).map((record, index) => (
          <tr key={index}>
            <td>
              <input
                type="date"
                value={record.date || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="time"
                value={record.time || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.vacuumLevel || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.mcOutletTemp || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.otiTemp || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.wtiTemp || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Photo Upload Section for Review */}
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
        Oil Filtration Process
      </p>

      {formData.photos && (
        <div
          className="photo-display-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          {Object.entries(formData.photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === "string") {
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
              <div
                key={photoKey}
                className="photo-item"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "10px",
                  backgroundColor: "#f9fafb",
                }}
              >
                <span
                  className="photo-label"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
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
                    cursor: "pointer",
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, "_blank");
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
                      fontSize: "0.75rem",
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

const Stage4Form2 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>
        IR Value before radiator/combine filtration Temp OTI .......°C WTI.............°C, AMB .............°C RANGE
        ONLY 1 KV
      </h2>
    </div>

    <table className="form-table">
      <tbody>
        <tr>
          <td>
            <strong>Temp OTI °C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.tempOTI || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Temp WTI °C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.tempWTI || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Temp AMB °C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.tempAMB || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "30px" }}>
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
          <td>
            <strong>HV-Earth</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_15sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_60sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_ratio || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>LV-Earth</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lv1Earth_15sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lv1Earth_60sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lv1Earth_ratio || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>HV-LV</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv1_15sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv1_60sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv1_ratio || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px", textAlign: "center" }}>Oil filtration of Cooler Bank</h4>
    <table className="form-table">
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
        {(formData.coolerBankRecords || []).map((record, index) => (
          <tr key={index}>
            <td>
              <input
                type="date"
                value={record.date || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="time"
                value={record.time || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.vacuumLevel || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.mcOutletTemp || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.otiTemp || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.wtiTemp || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Photo Upload Section for Review */}
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
        Cooler Bank Filtration Process
      </p>

      {formData.photos && (
        <div
          className="photo-display-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          {Object.entries(formData.photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === "string") {
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
              <div
                key={photoKey}
                className="photo-item"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "10px",
                  backgroundColor: "#f9fafb",
                }}
              >
                <span
                  className="photo-label"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
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
                    cursor: "pointer",
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, "_blank");
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
                      fontSize: "0.75rem",
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

const Stage4Form3 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>RECORD FOR OIL FILTRATION</h2>
      <h3>Oil filtration of Combine (Main Tank + Cooler bank)</h3>
    </div>

    <table className="form-table">
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
        {(formData.combineRecords || []).map((record, index) => (
          <tr key={index}>
            <td>
              <input
                type="date"
                value={record.date || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="time"
                value={record.time || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.vacuumLevel || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.mcOutletTemp || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.otiTemp || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={record.wtiTemp || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Photo Upload Section for Review */}
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
        Combine Filtration Process
      </p>

      {formData.photos && (
        <div
          className="photo-display-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          {Object.entries(formData.photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === "string") {
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
              <div
                key={photoKey}
                className="photo-item"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "10px",
                  backgroundColor: "#f9fafb",
                }}
              >
                <span
                  className="photo-label"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
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
                    cursor: "pointer",
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, "_blank");
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
                      fontSize: "0.75rem",
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

const Stage4Form4 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>
        IR & PI Value after filtration Temp OTI .......°C WTI.............°C, AMB .............°C RANGE ONLY 5 KV
      </h2>
    </div>

    <table className="form-table">
      <tbody>
        <tr>
          <td>
            <strong>Temp OTI °C</strong>
          </td>
          <td>
            <input type="text" value={formData.tempOTI || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Temp WTI °C</strong>
          </td>
          <td>
            <input type="text" value={formData.tempWTI || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Temp AMB °C</strong>
          </td>
          <td>
            <input type="text" value={formData.tempAMB || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "30px" }}>
      <thead>
        <tr>
          <th></th>
          <th>10 Sec (MΩ)</th>
          <th>60 Sec (MΩ)</th>
          <th>600 Sec (MΩ)</th>
          <th>PI 600/60 Sec</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>HV-Earth</strong>
          </td>
          <td>
            <input type="text" value={formData.hvEarth_10sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvEarth_60sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvEarth_600sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvEarth_pi || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td>
            <strong>LV1-Earth</strong>
          </td>
          <td>
            <input type="text" value={formData.lv1Earth_10sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.lv1Earth_60sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.lv1Earth_600sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.lv1Earth_pi || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td>
            <strong>HV-LV1</strong>
          </td>
          <td>
            <input type="text" value={formData.hvLv1_10sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvLv1_60sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvLv1_600sec || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="text" value={formData.hvLv1_pi || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 style={{ marginTop: "40px" }}>After Oil Filtration of main tank</h4>
    <table className="form-table">
      <tbody>
        <tr>
          <td>
            <strong>BDV (KV)</strong>
          </td>
          <td>
            <input type="text" value={formData.bdv || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Water Content (PPM)</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.waterContent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    {/* Photo Upload Section for Review */}
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>
        PPM Photo, Reading of BDV values, Air cell, MOG, POG.
      </p>

      {formData.photos && (
        <div
          className="photo-display-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          {Object.entries(formData.photos).map(([photoKey, url]) => {
            let fullUrl;
            if (typeof url === "string") {
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
              <div
                key={photoKey}
                className="photo-item"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "10px",
                  backgroundColor: "#f9fafb",
                }}
              >
                <span
                  className="photo-label"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
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
                    cursor: "pointer",
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image: ${fullUrl}`);
                    e.target.src = "/placeholder.svg";
                  }}
                  onClick={() => {
                    window.open(fullUrl, "_blank");
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
                      fontSize: "0.75rem",
                    }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

/**
 * Stage 4 review UI should match TractionTransformerForms.js input UI.
 * Stage 4 has 4 forms:
 * - Stage4Form1: Record Oil Filtration Main Tank
 * - Stage4Form2: IR Value Before Radiator Filtration
 * - Stage4Form3: Oil Filtration Combine
 * - Stage4Form4: IR & PI Value After Filtration
 */
const Stage4ReviewRenderer = ({ formDataFromDB }) => {
  const stage4Forms = [
    { id: "stage4-form1", title: "Record Oil Filtration Main Tank", component: Stage4Form1 },
    { id: "stage4-form2", title: "IR Value Before Radiator Filtration", component: Stage4Form2 },
    { id: "stage4-form3", title: "Oil Filtration Combine", component: Stage4Form3 },
    { id: "stage4-form4", title: "IR & PI Value After Filtration", component: Stage4Form4 },
  ];

  return (
    <div className="stage4-review-container">
      {stage4Forms.map((form, formIndex) => {
        const formData = formDataFromDB?.[`form${formIndex + 1}`] || {};
        const FormComponent = form.component;

        return (
          <div
            key={form.id}
            className="form-review-card"
            style={{
              marginBottom: "30px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              background: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="company-header"
              style={{
                textAlign: "center",
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>
                {form.title}
              </h2>
            </div>

            {FormComponent ? <FormComponent formData={formData} /> : null}
          </div>
        );
      })}
    </div>
  );
};

/**
 * NOTE:
 * Stage 5 review UI should match TractionTransformerForms.js input UI.
 * Hence Stage5Form3..Stage5Form8 below mirror the same table/layout UI but with disabled inputs.
 */

// shared photo renderer (used by new Stage5 generic forms)
const renderPhotos = (photos) => {
  if (!photos || typeof photos !== "object") return null;

  return (
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <div
        className="photo-display-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "10px",
        }}
      >
        {Object.entries(photos).map(([photoKey, url]) => {
          let fullUrl;
          if (typeof url === "string") {
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
            <div
              key={photoKey}
              className="photo-item"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#f9fafb",
              }}
            >
              <span
                className="photo-label"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                  textAlign: "center",
                }}
              >
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
                  cursor: "pointer",
                }}
                onError={(e) => {
                  console.error(`Failed to load image: ${fullUrl}`);
                  e.target.src = "/placeholder.svg";
                }}
                onClick={() => window.open(fullUrl, "_blank")}
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
                    fontSize: "0.75rem",
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

// Stage 5 Form Components (for review display)
const Stage5Form1 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>Test Record of Erection for Traction Transformer</h2>
    </div>

    <table className="form-table">
      <tbody>
        <tr>
          <td>
            <strong>Make Of Meter</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.makeOfMeter || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Date</strong>
          </td>
          <td>
            <input
              type="date"
              value={formData.date || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Model & S. No.</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.modelSrNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Ambient</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.ambient || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>OTI in ⁰C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.oti || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>WTI in ⁰C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.wti || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Test report reviewed by</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.testReportReviewedBy || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Acceptance of the test</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.acceptanceOfTest || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table">
      <tbody>
        <tr>
          <td>
            <strong>TR Sr. No.</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.trSrNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Location</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.location || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Customer</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.customer || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Date</strong>
          </td>
          <td>
            <input
              type="date"
              value={formData.testDate || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Time</strong>
          </td>
          <td>
            <input
              type="time"
              value={formData.testTime || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Amb. Temp ⁰C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.ambTemp || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Make</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.make || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Oil. Temp ⁰C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.oilTemp || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Sr. No</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.srNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>Wdg. Temp ⁰C</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.wdgTemp || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Voltage Level</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.voltageLevel || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "30px" }}>
      <thead>
        <tr>
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
          <td>
            <strong>HV-Earth</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_15sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_60sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_600sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_ratio60_15 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvEarth_ratio600_60 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>LV-Earth</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lvEarth_15sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvEarth_60sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvEarth_600sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvEarth_ratio60_15 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvEarth_ratio600_60 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>HV-LV</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv_15sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv_60sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv_600sec || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv_ratio60_15 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvLv_ratio600_60 || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    {formData.photos ? renderPhotos(formData.photos) : null}
  </div>
);

const Stage5Form2 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        RATIO TEST
      </h2>
    </div>

    {/* Header with Meter Sr. NO. and TIME */}
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <strong>Meter Sr. NO.: </strong>
        <input
          type="text"
          value={formData.meterSrNo || ""}
          disabled
          className="form-input disabled preview"
          style={{ marginLeft: "10px", padding: "5px", border: "1px solid #ccc" }}
        />
      </div>
      <div>
        <strong>TIME: </strong>
        <input
          type="time"
          value={formData.time || ""}
          disabled
          className="form-input disabled preview"
          style={{ marginLeft: "10px", padding: "5px", border: "1px solid #ccc" }}
        />
      </div>
    </div>

    {/* Main Ratio Test Table */}
    <table className="form-table" style={{ marginTop: "30px" }}>
      <thead>
        <tr>
          <th>TAP NO</th>
          <th>Applied Voltage in HV</th>
          <th>Measured Voltage in LV</th>
          <th>Calculated Ratio</th>
          <th>Deviation in %</th>
          <th>NAME PLATE RATIO</th>
        </tr>
      </thead>
      <tbody>
        {(formData.ratioTestData || []).map((row, index) => (
          <tr key={index}>
            <td>
              <strong>{row.tapNo || index + 1}</strong>
            </td>
            <td>
              <input
                type="text"
                value={row.appliedVoltageHV || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={row.measuredVoltageLV || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={row.calculatedRatio || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={row.deviationPercent || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
            <td>
              <input
                type="text"
                value={row.namePlateRatio || ""}
                disabled
                className="form-input disabled preview"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {formData.photos ? renderPhotos(formData.photos) : null}
  </div>
);

const Stage5Form3 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>MAGNETISING CURRENT TEST</h2>
    </div>

     <table className="form-table" style={{ marginTop: "10px" }}>
      <thead>
        <tr>
          <th colSpan="3" style={{ textAlign: "center" }}>
            MAGNETISING CURRENT TEST
          </th>
        </tr>
        <tr>
          <th style={{ width: "15%" }}>TAP NO.</th>
          <th>VOLTAGE APPLIED ON PRIMARY/HVSIDE OF POWER TRANSFORMER</th>
          <th>MEASURED CURRENT ON PRIMARY/HV SIDE IN milliamp.</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>1</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hvTap1_voltageApplied || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvTap1_measuredCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>2</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hvTap3_voltageApplied || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvTap3_measuredCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>3</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.hvTap6_voltageApplied || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.hvTap6_measuredCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "30px" }}>
      <thead>
        <tr>
          <th style={{ width: "15%" }}>TAP NO.</th>
          <th>VOLTAGE APPLIED ON SECONDARY/LVSIDE OF POWER TRANSFORMER</th>
          <th>MEASURED CURRENT ON SECONDARY/LV SIDE IN milliamp.</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>1</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap1_voltageApplied || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap1_measuredCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>2</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap2_voltageApplied || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap2_measuredCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>3</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap3_voltageApplied || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap3_measuredCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>4</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap4_voltageApplied || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap4_measuredCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>5</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap5_voltageApplied || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap5_measuredCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>6</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap6_voltageApplied || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input
              type="text"
              value={formData.lvTap6_measuredCurrent || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    {formData.photos ? renderPhotos(formData.photos) : null}
  </div>
);

// Stage 5 Form 4: TYPE OF TEST – POLARITY TEST (matches TractionTransformerForms.js Stage5Form4 UI)
const Stage5Form4 = ({ formData }) => {
  const DiagramImage = ({ variant }) => {
    const commonTextStyle = { fontFamily: "Arial, sans-serif", fontSize: 12, fill: "#111" };
    const commonLineStyle = { stroke: "#111", strokeWidth: 2, strokeLinecap: "round" };
    const commonThinLineStyle = { stroke: "#111", strokeWidth: 1.5, strokeLinecap: "round" };
    const commonRectStyle = { fill: "#111" };

    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <svg
          viewBox="0 0 240 220"
          width="220"
          height="200"
          role="img"
          aria-label="Polarity test diagram"
          style={{ maxWidth: "220px", width: "100%", height: "auto" }}
        >
          <text x="78" y="36" style={commonTextStyle}>
            1.1
          </text>
          <text x="148" y="36" style={commonTextStyle}>
            2.1
          </text>

          {variant === "condition2" ? (
            <>
              <line x1="60" y1="48" x2="180" y2="48" style={commonLineStyle} />
              <circle cx="90" cy="48" r="4" fill="#111" />
              <circle cx="150" cy="48" r="4" fill="#111" />
            </>
          ) : (
            <>
              <line x1="60" y1="48" x2="105" y2="48" style={commonLineStyle} />
              <line x1="135" y1="48" x2="180" y2="48" style={commonLineStyle} />
              <circle cx="90" cy="48" r="4" fill="#111" />
              <circle cx="150" cy="48" r="4" fill="#111" />
            </>
          )}

          <rect x="82" y="70" width="12" height="78" style={commonRectStyle} />
          <rect x="142" y="70" width="12" height="78" style={commonRectStyle} />

          <line x1="90" y1="48" x2="90" y2="70" style={commonLineStyle} />
          <line x1="150" y1="48" x2="150" y2="70" style={commonLineStyle} />

          <circle cx="90" cy="160" r="4" fill="#111" />
          <circle cx="150" cy="160" r="4" fill="#111" />

          <text x="66" y="196" style={commonTextStyle}>
            1.2
          </text>
          <text x="156" y="196" style={commonTextStyle}>
            2.2
          </text>

          <line x1="48" y1="176" x2="90" y2="176" style={commonThinLineStyle} />
          <line x1="150" y1="176" x2="192" y2="176" style={commonThinLineStyle} />

          <line x1="90" y1="160" x2="90" y2="176" style={commonThinLineStyle} />
          <line x1="150" y1="160" x2="150" y2="176" style={commonThinLineStyle} />
        </svg>
      </div>
    );
  };

  const ConditionBlock = ({ title, rows, equation, eqLhsKey, eqRhs1Key, eqRhs2Key, eqOperator, eqCheckLhsKey, eqCheckRhsKey }) => (
    <table className="form-table" style={{ marginTop: "16px" }}>
      <thead>
        <tr>
          <th colSpan={2} style={{ textAlign: "center" }}>
            {title}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ width: "55%" }}>
            <table className="form-table" style={{ margin: 0 }}>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key}>
                    <td style={{ width: "35%" }}>
                      <strong>{r.label} =</strong>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData?.[r.key] || ""}
                        disabled
                        className="form-input disabled preview"
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2} style={{ paddingTop: "14px" }}>
                    <strong>{equation}</strong>
                  </td>
                </tr>
                {/* Equation result input boxes */}
                <tr>
                  <td colSpan={2} style={{ paddingTop: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="text"
                        value={formData?.[eqLhsKey] || ""}
                        disabled
                        className="form-input disabled preview"
                        style={{ flex: 2 }}
                      />
                      <strong>=</strong>
                      <input
                        type="text"
                        value={formData?.[eqRhs1Key] || ""}
                        disabled
                        className="form-input disabled preview"
                        style={{ flex: 1 }}
                      />
                      <strong>{eqOperator}</strong>
                      <input
                        type="text"
                        value={formData?.[eqRhs2Key] || ""}
                        disabled
                        className="form-input disabled preview"
                        style={{ flex: 2 }}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ paddingTop: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="text"
                        value={formData?.[eqCheckLhsKey] || ""}
                        disabled
                        className="form-input disabled preview"
                        style={{ flex: 2 }}
                      />
                      <strong>=</strong>
                      <input
                        type="text"
                        value={formData?.[eqCheckRhsKey] || ""}
                        disabled
                        className="form-input disabled preview"
                        style={{ flex: 3 }}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style={{ width: "45%", verticalAlign: "middle" }}>
            <DiagramImage variant={title === "CONDITION 2" ? "condition2" : "condition1"} />
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div className="form-container">
      <div className="company-header">
        <h2>TYPE OF TEST – POLARITY TEST</h2>
      </div>

      <ConditionBlock
        title="CONDITION 1"
        rows={[
          { label: "1.1-1.2", key: "cond1_11_12" },
          { label: "2.1-2.2", key: "cond1_21_22" },
          { label: "1.1-2.2", key: "cond1_11_22" },
        ]}
        equation="(1.1-2.2) = (1.1-1.2) + (2.1-2.2)"
        eqLhsKey="cond1_eq_lhs"
        eqRhs1Key="cond1_eq_rhs1"
        eqRhs2Key="cond1_eq_rhs2"
        eqOperator="+"
        eqCheckLhsKey="cond1_eq_check_lhs"
        eqCheckRhsKey="cond1_eq_check_rhs"
      />

      <ConditionBlock
        title="CONDITION 2"
        rows={[
          { label: "1.1-1.2", key: "cond2_11_12" },
          { label: "2.1-2.2", key: "cond2_21_22" },
          { label: "1.1-2.1", key: "cond2_11_21" },
        ]}
        equation="(1.2-2.1) = (1.1-1.2) - (2.1-2.2)"
        eqLhsKey="cond2_eq_lhs"
        eqRhs1Key="cond2_eq_rhs1"
        eqRhs2Key="cond2_eq_rhs2"
        eqOperator="-"
        eqCheckLhsKey="cond2_eq_check_lhs"
        eqCheckRhsKey="cond2_eq_check_rhs"
      />

      {formData.photos ? renderPhotos(formData.photos) : null}
    </div>
  );
};

const Stage5Form5 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2>TYPE OF TEST – SHORT CIRCUIT TEST</h2>
    </div>

    <table className="form-table">
      <tbody>
        <tr>
          <td style={{ width: "40%" }}>
            <strong>APPLIED VOLTAGE :</strong>
          </td>
          <td style={{ width: "25%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="text" value={formData.appliedVoltage || ""} disabled className="form-input disabled preview" />
              <strong style={{ whiteSpace: "nowrap" }}>VOLTS</strong>
            </div>
          </td>
          <td style={{ width: "17%" }}>
            <strong>DATE:</strong>
          </td>
          <td style={{ width: "18%" }}>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ width: "12%" }}>
            <strong>TIME :</strong>
          </td>
          <td style={{ width: "18%" }}>
            <input type="time" value={formData.time || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <strong>METER MAKE SR. NO.</strong>
          </td>
          <td colSpan={4}>
            <input
              type="text"
              value={formData.meterMakeSrNo || ""}
              disabled
              className="form-input disabled preview"
              style={{ width: "100%" }}
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: "20px" }}>
      <thead>
        <tr>
          <th style={{ width: "14%" }}>TAP NO.</th>
          <th style={{ width: "28%" }}>VOLTAGE</th>
          <th style={{ width: "29%" }}>HV CURRENT (Amp)</th>
          <th style={{ width: "29%" }}>LV CURRENT (Amp)</th>
        </tr>
      </thead>
      <tbody>
        {((formData.tapReadings && formData.tapReadings.length ? formData.tapReadings : Array(6).fill(null)) || []).map(
          (row, idx) => (
            <tr key={idx}>
              <td style={{ textAlign: "center" }}>
                <strong>{row?.tapNo || idx + 1}</strong>
              </td>
              <td>
                <input type="text" value={row?.voltage || ""} disabled className="form-input disabled preview" />
              </td>
              <td>
                <input type="text" value={row?.hvCurrent || ""} disabled className="form-input disabled preview" />
              </td>
              <td>
                <input type="text" value={row?.lvCurrent || ""} disabled className="form-input disabled preview" />
              </td>
            </tr>
          ),
        )}

        <tr>
          <td style={{ fontWeight: "700", textAlign: "center" }}>Impedance calculation</td>
          <td colSpan={3} style={{ padding: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>%Z =</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Applied Voltage HV</div>
                    <input
                      type="text"
                      value={formData.impedance_appliedVoltageHV || ""}
                      disabled
                      className="form-input disabled preview"
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Rated voltage HV</div>
                    <input
                      type="text"
                      value={formData.impedance_ratedVoltageHV || ""}
                      disabled
                      className="form-input disabled preview"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8, visibility: "hidden" }}>%Z =</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Rated Current LV</div>
                    <input
                      type="text"
                      value={formData.impedance_ratedCurrentLV || ""}
                      disabled
                      className="form-input disabled preview"
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Measured current LV</div>
                    <input
                      type="text"
                      value={formData.impedance_measuredCurrentLV || ""}
                      disabled
                      className="form-input disabled preview"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, fontWeight: 700 }}>
              %Z = (Applied Voltage HV / Rated voltage HV) × (Rated Current LV / Measured current LV) × 100
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    {formData.photos ? renderPhotos(formData.photos) : null}
  </div>
);

// Stage 5 Form 6: Winding Resistance Test (matches TractionTransformerForms.js Stage5Form6 UI)
const Stage5Form6 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2 style={{ textDecoration: "underline", textUnderlineOffset: "6px" }}>
        TYPE OF TEST – WINDING RESISTANCE TEST
      </h2>
    </div>

    {/* Top info block (matches TractionTransformerForms.js Stage5Form6 exactly) */}
    <table className="form-table" style={{ marginTop: "10px" }}>
      <tbody>
        <tr>
          <td style={{ width: "35%" }}>
            <strong>METER USED</strong>
          </td>
          <td style={{ width: "35%" }}>
            <input type="text" value={formData.meterUsed || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ width: "15%" }}>
            <strong>DATE:</strong>
          </td>
          <td style={{ width: "15%" }}>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ width: "15%" }}>
            <strong>TIME :</strong>
          </td>
          <td style={{ width: "15%" }}>
            <input type="time" value={formData.time || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>

        <tr>
          <td>
            <strong>METER MAKE SR. NO.</strong>
          </td>
          <td>
            <input type="text" value={formData.meterMakeSrNo || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <strong>WTI:</strong>
          </td>
          <td>
            <input type="text" value={formData.wti || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <strong>OTI:</strong>
          </td>
          <td>
            <input type="text" value={formData.oti || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>

        <tr>
          <td>
            <strong>RANGE</strong>
          </td>
          <td>
            <input type="text" value={formData.range1 || ""} disabled className="form-input disabled preview" />
          </td>
          <td colSpan={2}>
            <strong>AMBIENT:</strong>
            <input
              type="text"
              value={formData.ambient || ""}
              disabled
              className="form-input disabled preview"
              style={{ marginLeft: 10, width: "70%" }}
            />
          </td>
          <td colSpan={2}></td>
        </tr>

        <tr>
          <td>
            <strong>RANGE</strong>
          </td>
          <td colSpan={5}>
            <input
              type="text"
              value={formData.range2 || ""}
              disabled
              className="form-input disabled preview"
              style={{ width: "100%" }}
            />
          </td>
        </tr>
      </tbody>
    </table>

    {/* HV/LV tables: use the same structure and row counts as TractionTransformerForms.js */}
    <div style={{ display: "flex", justifyContent: "space-between", gap: 30, marginTop: 30 }}>
      <div style={{ width: "55%" }}>
        <h3 style={{ textAlign: "center", textDecoration: "underline", textUnderlineOffset: 6 }}>LV SIDE</h3>

        <table className="form-table" style={{ marginTop: 14 }}>
          <thead>
            <tr>
              <th style={{ width: "25%" }}>TAP NO.</th>
              <th>{formData.hvHeader || "2.1 – 2.2 (Ω)"}</th>
            </tr>
          </thead>
          <tbody>
            {((formData.hvTapReadings && formData.hvTapReadings.length ? formData.hvTapReadings : Array(6).fill(null)) || []).map(
              (row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "center" }}>
                    <strong>{row?.tapNo || idx + 1}</strong>
                  </td>
                  <td>
                    <input type="text" value={row?.value || ""} disabled className="form-input disabled preview" />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <div style={{ width: "45%" }}>
        <h3 style={{ textAlign: "center", textDecoration: "underline", textUnderlineOffset: 6 }}>HV SIDE</h3>

        <table className="form-table" style={{ marginTop: 14 }}>
          <thead>
            <tr>
              <th>{formData.lvHeader || "1.1 – 1.2 ((Ω)"}</th>
            </tr>
          </thead>
          <tbody>
            {/* TractionTransformerForms.js LV has 2 rows: lvValue and lvValue2 */}
            <tr>
              <td>
                <input type="text" value={formData.lvValue || ""} disabled className="form-input disabled preview" />
              </td>
            </tr>
            <tr>
              <td>
                <input type="text" value={formData.lvValue2 || ""} disabled className="form-input disabled preview" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {formData.photos ? renderPhotos(formData.photos) : null}
  </div>
);

const Stage5Form7 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2 style={{ textAlign: "center", fontWeight: 800, marginBottom: 0 }}>TEST REPORT</h2>
      <h3 style={{ textAlign: "center", marginTop: 6, textDecoration: "underline", textUnderlineOffset: 6 }}>
        TAN DELTA AND CAPACITANCE TEST ON BUSHING
      </h3>
    </div>

    <table className="form-table" style={{ marginTop: 10 }}>
      <tbody>
        <tr>
          <td style={{ width: "25%" }}>
            <strong>BUSHING SR. NO. (HV)</strong>
          </td>
          <td style={{ width: "25%" }}>
            <input
              type="text"
              value={formData.bushingSrNoHv || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td style={{ width: "25%" }}>
            <strong></strong>
          </td>
          <td style={{ width: "25%" }}>
            <input
              type="text"
              value={formData.makeHv || ""}
              disabled
              className="form-input disabled preview"
              placeholder="MAKE"
            />
          </td>
        </tr>

        <tr>
          <td>
            <strong>BUSHING SR. NO. (LV)</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.bushingSrNoLv || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong></strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.makeLv || ""}
              disabled
              className="form-input disabled preview"
              placeholder="MAKE"
            />
          </td>
        </tr>

        <tr>
          <td colSpan={4} style={{ height: 22 }}></td>
        </tr>

        <tr>
          <td colSpan={2}>
            <strong>METER USED</strong>
          </td>
          <td>
            <strong>DATE:</strong>
          </td>
          <td>
            <strong>TIME :</strong>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <input type="text" value={formData.meterUsed || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="time" value={formData.time || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>

        <tr>
          <td colSpan={2}>
            <strong>MODEL & S. NO.</strong>
          </td>
          <td>
            <strong>AMBIENT:</strong>
          </td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={2}>
            <input
              type="text"
              value={formData.modelAndSrNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input type="text" value={formData.ambient || ""} disabled className="form-input disabled preview" />
          </td>
          <td></td>
        </tr>

        <tr>
          <td colSpan={2}>
            <strong>OTI............................°C</strong>
          </td>
          <td colSpan={2}>
            <strong>WTI............................°C</strong>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <input type="text" value={formData.oti || ""} disabled className="form-input disabled preview" />
          </td>
          <td colSpan={2}>
            <input type="text" value={formData.wti || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: 22 }}>
      <thead>
        <tr>
          <th rowSpan={2} style={{ width: "14%" }}>
            VOLTAGE (KV)
          </th>
          <th rowSpan={2} style={{ width: "18%" }}>
            BUSHING &
            <br />
            SERIAL NO.
          </th>
          <th rowSpan={2} style={{ width: "12%" }}>
            TEST
            <br />
            MODE
          </th>
          <th colSpan={2} style={{ width: "26%" }}>
            CAPACITANCE ( Pf )
          </th>
          <th colSpan={2} style={{ width: "30%" }}>
            TAN DELTA %
          </th>
        </tr>
        <tr>
          <th>FACTORY</th>
          <th>SITE</th>
          <th>FACTORY</th>
          <th>SITE</th>
        </tr>
      </thead>
      <tbody>
        {(formData.rows || []).map((row) => (
          <tr key={row.id}>
            <td>
              <input type="text" value={row.voltageKv || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ fontWeight: 700, textAlign: "center" }}>{row.label}</td>
            <td>
              <input type="text" value={row.testMode || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={row.capFactory || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={row.capSite || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={row.tdFactory || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={row.tdSite || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: 22 }}>
      <thead>
        <tr>
          <th rowSpan={2} style={{ width: "14%" }}>
            VOLTAGE (KV)
          </th>
          <th rowSpan={2} style={{ width: "18%" }}>
            BUSHING &
            <br />
            SERIAL NO.
          </th>
          <th rowSpan={2} style={{ width: "12%" }}>
            TEST
            <br />
            MODE
          </th>
          <th colSpan={2} style={{ width: "26%" }}>
            CAPACITANCE ( Pf )
          </th>
          <th colSpan={2} style={{ width: "30%" }}>
            TAN DELTA %
          </th>
        </tr>
        <tr>
          <th>FACTORY</th>
          <th>SITE</th>
          <th>FACTORY</th>
          <th>SITE</th>
        </tr>
      </thead>
      <tbody>
        {(formData.rows2 || []).map((row) => (
          <tr key={row.id}>
            <td>
              <input type="text" value={row.voltageKv || ""} disabled className="form-input disabled preview" />
            </td>
            <td style={{ fontWeight: 700, textAlign: "center" }}>{row.label}</td>
            <td>
              <input type="text" value={row.testMode || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={row.capFactory || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={row.capSite || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={row.tdFactory || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={row.tdSite || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {formData.photos && (
      <>
        {renderPhotos({ tanDeltaKit: formData.photos.tanDeltaKit })}
        {renderPhotos({ calibrationReport: formData.photos.calibrationReport })}
        {renderPhotos({ duringTanDelta: formData.photos.duringTanDelta })}
      </>
    )}
  </div>
);

// Stage 5 Form 8: Tan Delta & IR Values of Transformer (matches TractionTransformerForms.js Stage5Form8 UI)
const Stage5Form8 = ({ formData }) => (
  <div className="form-container">
    <div className="company-header">
      <h2 style={{ textAlign: "center", fontWeight: 800 }}>TAN DELTA AND CAPACITANCE MEASUREMENT OF WINDING</h2>
    </div>

    {/* Header block (as per TractionTransformerForms.js Stage5Form8) */}
    <table className="form-table" style={{ marginTop: 10 }}>
      <tbody>
        <tr>
          <td style={{ width: "45%" }}>
            <strong>METER USED</strong>
          </td>
          <td style={{ width: "27%" }}>
            <strong>DATE:</strong>
          </td>
          <td style={{ width: "28%" }}>
            <strong>TIME :</strong>
          </td>
        </tr>
        <tr>
          <td>
            <input type="text" value={formData.meterUsed || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="date" value={formData.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <input type="time" value={formData.time || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>

        <tr>
          <td>
            <strong>MODEL & S. NO.</strong>
          </td>
          <td>
            <strong>AMBIENT:</strong>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <input
              type="text"
              value={formData.modelAndSrNo || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <input type="text" value={formData.ambient || ""} disabled className="form-input disabled preview" />
          </td>
          <td></td>
        </tr>

        <tr>
          <td>
            <strong>OTI............................°C</strong>
          </td>
          <td colSpan={2}>
            <strong>WTI............................°C</strong>
          </td>
        </tr>
        <tr>
          <td>
            <input type="text" value={formData.oti || ""} disabled className="form-input disabled preview" />
          </td>
          <td colSpan={2}>
            <input type="text" value={formData.wti || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: 18 }}>
      <thead>
        <tr>
          <th style={{ width: "14%" }}>AT 05 KV IN BETWEEN</th>
          <th style={{ width: "12%" }}>MODE</th>
          <th style={{ width: "16%" }}>TAN DELTA %</th>
          <th style={{ width: "16%" }}>
            CAPACITANCE
            <br />
            (Pf)
          </th>
          <th style={{ width: "20%" }}>
            EXCITATION CURRENT (mA)
            <br />
            (A)
          </th>
          <th style={{ width: "22%" }}>DIELECTRIC LOSS</th>
        </tr>
      </thead>
      <tbody>
        {(formData.kv5_rows || []).map((r) => (
          <tr key={r.id}>
            <td style={{ fontWeight: 700, textAlign: "center" }}>{r.between}</td>
            <td style={{ fontWeight: 700, textAlign: "center" }}>{r.mode}</td>
            <td>
              <input type="text" value={r.tanDelta || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={r.capacitance || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={r.excitationCurrent || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={r.dielectricLoss || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: 18 }}>
      <thead>
        <tr>
          <th style={{ width: "14%" }}>AT 10 KV IN BETWEEN</th>
          <th style={{ width: "12%" }}>MODE</th>
          <th style={{ width: "16%" }}>TAN DELTA %</th>
          <th style={{ width: "16%" }}>
            CAPACITANCE
            <br />
            (Pf)
          </th>
          <th style={{ width: "20%" }}>
            EXCITATION CURRENT (mA)
            <br />
            (mA)
          </th>
          <th style={{ width: "22%" }}>DIELECTRIC LOSS</th>
        </tr>
      </thead>
      <tbody>
        {(formData.kv10_rows || []).map((r) => (
          <tr key={r.id}>
            <td style={{ fontWeight: 700, textAlign: "center" }}>{r.between}</td>
            <td style={{ fontWeight: 700, textAlign: "center" }}>{r.mode}</td>
            <td>
              <input type="text" value={r.tanDelta || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={r.capacitance || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={r.excitationCurrent || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={r.dielectricLoss || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    <div className="company-header" style={{ marginTop: 26 }}>
      <h3 style={{ textAlign: "center", fontWeight: 800, textDecoration: "underline", textUnderlineOffset: 6 }}>
        IR VALUES OF TRANSFORMER
      </h3>
    </div>

    <table className="form-table" style={{ marginTop: 10 }}>
      <tbody>
        <tr>
          <td style={{ width: "25%" }}>
            <strong>Date :</strong>
          </td>
          <td style={{ width: "25%" }}>
            <input type="date" value={formData.ir?.date || ""} disabled className="form-input disabled preview" />
          </td>
          <td style={{ width: "25%" }}>
            <strong>Time:</strong>
          </td>
          <td style={{ width: "25%" }}>
            <input type="time" value={formData.ir?.time || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>

        <tr>
          <td>
            <strong>Amb. Temp :</strong>
          </td>
          <td>
            <input type="text" value={formData.ir?.ambTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <strong>Make :</strong>
          </td>
          <td>
            <input type="text" value={formData.ir?.make || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>

        <tr>
          <td>
            <strong>Oil Temp. :</strong>
          </td>
          <td>
            <input type="text" value={formData.ir?.oilTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <strong>Sr. No. :</strong>
          </td>
          <td>
            <input type="text" value={formData.ir?.srNo || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>

        <tr>
          <td>
            <strong>Wdg. Temp. :</strong>
          </td>
          <td>
            <input type="text" value={formData.ir?.wdgTemp || ""} disabled className="form-input disabled preview" />
          </td>
          <td>
            <strong>Range :</strong>
          </td>
          <td>
            <input type="text" value={formData.ir?.range || ""} disabled className="form-input disabled preview" />
          </td>
        </tr>

        <tr>
          <td>
            <strong>Relative Humidity :</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.ir?.relativeHumidity || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
          <td>
            <strong>Voltage Level :</strong>
          </td>
          <td>
            <input
              type="text"
              value={formData.ir?.voltageLevel || ""}
              disabled
              className="form-input disabled preview"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <table className="form-table" style={{ marginTop: 14 }}>
      <thead>
        <tr>
          <th style={{ width: "20%" }}></th>
          <th style={{ width: "14%" }}>
            15 Sec
            <br />
            (MΩ)
          </th>
          <th style={{ width: "14%" }}>
            60 Sec
            <br />
            (MΩ)
          </th>
          <th style={{ width: "14%" }}>
            600 Sec
            <br />
            (MΩ)
          </th>
          <th style={{ width: "19%" }}>
            Ratio of IR 60
            <br />
            IR 15
          </th>
          <th style={{ width: "19%" }}>
            Ratio of IR 600
            <br />
            IR 60
          </th>
        </tr>
      </thead>
      <tbody>
        {(formData.ir?.rows || []).map((r) => (
          <tr key={r.id}>
            <td style={{ fontWeight: 700 }}>{r.label}</td>
            <td>
              <input type="text" value={r.sec15 || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={r.sec60 || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={r.sec600 || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={r.ratio60_15 || ""} disabled className="form-input disabled preview" />
            </td>
            <td>
              <input type="text" value={r.ratio600_60 || ""} disabled className="form-input disabled preview" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {formData.photos ? renderPhotos(formData.photos) : null}
  </div>
);

// Stage 5 Review Renderer Component
const Stage5ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage5Forms = [
    { id: "stage5-form1", title: "Magnetizing Current Test", component: Stage5Form1 },
    { id: "stage5-form2", title: "Polarity Test", component: Stage5Form2 },
    { id: "stage5-form3", title: "MAGNETISING CURRENT TEST", component: Stage5Form3 },
    { id: "stage5-form4", title: "Type of Test - Polarity Test", component: Stage5Form4 },
    { id: "stage5-form5", title: "IR Values of Transformer (Form 5)", component: Stage5Form5 },
    { id: "stage5-form6", title: "IR Values of Transformer (Form 6)", component: Stage5Form6 },
    { id: "stage5-form7", title: "IR Values of Transformer (Form 7)", component: Stage5Form7 },
    { id: "stage5-form8", title: "IR Values of Transformer (Form 8)", component: Stage5Form8 }
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
        const formData = formDataFromDB?.[`form${formIndex + 1}`] || {};
        const FormComponent = form.component;

        return (
          <div
            key={form.id}
            className="form-review-card"
            style={{
              marginBottom: "30px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              background: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="company-header"
              style={{
                textAlign: "center",
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>
                {form.title}
              </h2>
            </div>

            {FormComponent ? <FormComponent formData={formData} /> : null}

            {formData.photos && renderPhotos(formData.photos)}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Stage 3 (Traction) has ONLY ONE form in TractionTransformerForms.js:
 * Stage3Form1 (Vacuum cycle + IR + Pressure test).
 * The previous Stage3ReviewRenderer incorrectly rendered oil-filtration forms (belongs to Stage 4).
 */
const Stage3ReviewRenderer = ({ formDataFromDB }) => {
  const formData = formDataFromDB?.form1 || {};

  return (
    <div className="stage3-review-container">
      <div
        className="form-review-card"
        style={{
          marginBottom: "30px",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
          background: "white",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          className="company-header"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>
            Vacuum Cycle Recording (Stage 3 - Form 1)
          </h2>
        </div>

        <Stage3Form1 formData={formData} />
      </div>
    </div>
  );
};

// Stage 2 Review Renderer Component
const Stage2ReviewRenderer = ({ formDataFromDB }) => {
  const stage2Forms = [
    { id: "stage2-form1", title: "Record of Oil Handling", component: Stage2Form1 },
    { id: "stage2-form2", title: "IR After Erection", component: Stage2Form2 },
  ];

  return (
    <div className="stage2-review-container">
      {stage2Forms.map((form, formIndex) => {
        const formData = formDataFromDB?.[`form${formIndex + 1}`] || {};
        const FormComponent = form.component;

        return (
          <div
            key={form.id}
            className="form-review-card"
            style={{
              marginBottom: "30px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              background: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="company-header"
              style={{
                textAlign: "center",
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>{form.title}</h2>
            </div>

            {FormComponent ? <FormComponent formData={formData} /> : null}
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
      id: "pre-erection-ratio-test-turret-cts",
      title: "Pre erection Ratio test of turret CTs",
      fields: [
        { name: "phase31_20percent_appliedCurrent_s1s2", label: "Phase 1.1 - 20% Applied Current S1-S2", type: "text" },
        { name: "phase31_20percent_appliedCurrent_s1s3", label: "Phase 1.1 - 20% Applied Current S1-S3", type: "text" },
        { name: "phase31_20percent_measuredCurrent_s1s2", label: "Phase 1.1 - 20% Measured Current S1-S2", type: "text" },
        { name: "phase31_20percent_measuredCurrent_s1s3", label: "Phase 1.1 - 20% Measured Current S1-S3", type: "text" }
      ]
    },
    {
      id: "pre-erection-ratio-test-phase2",
      title: "Pre erection Ratio test of turret CTs - Phase 2",
      fields: [
        { name: "phase31_20percent_appliedCurrent_s1s2", label: "Phase 2.1 - 20% Applied Current S1-S2", type: "text" },
        { name: "phase31_20percent_appliedCurrent_s1s3", label: "Phase 2.1 - 20% Applied Current S1-S3", type: "text" },
        { name: "phase31_20percent_measuredCurrent_s1s2", label: "Phase 2.1 - 20% Measured Current S1-S2", type: "text" },
        { name: "phase31_20percent_measuredCurrent_s1s3", label: "Phase 2.1 - 20% Measured Current S1-S3", type: "text" }
      ]
    },
    {
      id: "tan-delta-capacitance-test-bushing",
      title: "TAN DELTA AND CAPACITANCE TEST ON BUSHING",
      fields: [
        { name: "meterUsed", label: "METER USED", type: "text" },
        { name: "date", label: "DATE", type: "date" },
        { name: "time", label: "TIME", type: "time" },
        { name: "modelSrNo", label: "MODEL & S. NO.", type: "text" },
        { name: "wti", label: "WTI", type: "text" },
        { name: "oti", label: "OTI", type: "text" },
        { name: "hvBushing11_srNo", label: "HV Bushing 1.1 Sr. No.", type: "text" },
        { name: "hvBushing12_srNo", label: "HV Bushing 1.2 Sr. No.", type: "text" },
        { name: "lvBushing21_srNo", label: "LV Bushing 2.1 Sr. No.", type: "text" },
        { name: "lvBushing22_srNo", label: "LV Bushing 2.2 Sr. No.", type: "text" }
      ]
    },
    {
      id: "record-of-measurement-of-ir-values",
      title: "RECORD OF MEASUREMENT OF IR VALUES",
      fields: [
        { name: "date", label: "Date", type: "text" },
        { name: "time", label: "Time", type: "text" },
        { name: "ambTemp", label: "Amb Temp", type: "text" },
        { name: "make", label: "Make", type: "text" },
        { name: "oilTemp", label: "Oil Temp", type: "text" },
        { name: "srNo", label: "Sr No", type: "text" },
        { name: "wdgTemp", label: "Wdg Temp", type: "text" },
        { name: "range", label: "Range", type: "text" },
        { name: "relativeHumidity", label: "Relative Humidity", type: "text" },
        { name: "voltageLevel", label: "Voltage Level", type: "text" }
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
            ) : form.id === "pre-erection-ratio-test-turret-cts" ? (
              <Stage1Form4 formData={formData} />
            ) : form.id === "pre-erection-ratio-test-phase2" ? (
              <Stage1Form5 formData={formData} />
            ) : form.id === "tan-delta-capacitance-test-bushing" ? (
              <Stage1Form6 formData={formData} />
            ) : form.id === "record-of-measurement-of-ir-values" ? (
              <Stage1Form7 formData={formData} />
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

// Stage 6 Form 1: Pre-Commissioning Checklist (matches TractionTransformerForms.js Stage6Form1)
const Stage6Form1 = ({ formData }) => {
  const disabledInput = (path, style = {}) => {
    const value = path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), formData) || "";
    return (
      <input
        type="text"
        value={value}
        disabled
        className="form-input disabled preview"
        style={{ width: "100%", minWidth: 70, ...style }}
      />
    );
  };

  return (
    <div className="form-container">
      <div className="company-header" style={{ marginBottom: 10 }}>
        <h2 style={{ textAlign: "left", textDecoration: "underline", textUnderlineOffset: 6 }}>
          PRE-COMMISSIONING CHECKLIST
        </h2>
      </div>

      <table className="form-table" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th style={{ width: "10%" }}>Sr.No.</th>
            <th style={{ width: "40%" }}>Particulars</th>
            <th style={{ width: "10%" }}>Qty</th>
            <th colSpan={3} style={{ width: "40%" }}>Status</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th style={{ width: "13%" }}>Open</th>
            <th style={{ width: "13%" }}>Shut</th>
            <th style={{ width: "14%" }}>N/A</th>
          </tr>
        </thead>
        <tbody>
          {/* I - Valve Status */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>I</td>
            <td style={{ fontWeight: 700 }}>Valve Status</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          {[
            { code: "A", label: "Bucholz to Conservator" },
            { code: "B", label: "Main Tank to Bucholz" },
            { code: "C", label: "Radiator Top Valves" },
            { code: "D", label: "Radiator Bottom Valves" },
            { code: "F", label: "Top Header" },
            { code: "G", label: "Bottom Header" },
            { code: "H", label: "Main Tank to Radiator Bank" },
            { code: "K", label: "Top Filter Valve" },
            { code: "L", label: "Bottom Filter Valve" },
            { code: "M", label: "Drain Valve" },
          ].map((row) => (
            <tr key={`valve-${row.code}`}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{row.code}</td>
              <td style={{ fontWeight: 700 }}>{row.label}</td>
              <td></td>
              <td>{disabledInput(["valveStatus", row.code, "open"])}</td>
              <td>{disabledInput(["valveStatus", row.code, "shut"])}</td>
              <td>{disabledInput(["valveStatus", row.code, "na"])}</td>
            </tr>
          ))}

          {/* II - Air Venting */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>II</td>
            <td style={{ fontWeight: 700 }}>Air Venting</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td style={{ fontWeight: 700 }}>Done from the Following Locations:</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          {[
            { code: "A", label: "Main Tank" },
            { code: "B", label: "Bucholz Relay" },
            { code: "C", label: "HV Bushing" },
            { code: "D", label: "LV Bushing" },
            { code: "G", label: "Header – Top" },
            { code: "H", label: "Header – Bottom" },
            { code: "I", label: "Radiator – Top" },
            { code: "L", label: "Diverter Switch" },
          ].map((row) => (
            <tr key={`air-${row.code}`}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{row.code}</td>
              <td style={{ fontWeight: 700 }}>{row.label}</td>
              <td>
                <input
                  type="text"
                  value={formData?.airVenting?.[row.code]?.qty || ""}
                  disabled
                  className="form-input disabled preview"
                  style={{ width: "100%", minWidth: 60 }}
                />
              </td>
              <td>{disabledInput(["airVenting", row.code, "open"])}</td>
              <td>{disabledInput(["airVenting", row.code, "shut"])}</td>
              <td>{disabledInput(["airVenting", row.code, "na"])}</td>
            </tr>
          ))}

          {/* III - Protection Trials */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>III</td>
            <td style={{ fontWeight: 700 }}>Protection Trails</td>
            <td></td>
            <td colSpan={3} style={{ textAlign: "center", fontWeight: 700 }}>Checked</td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>A</td>
            <td style={{ fontWeight: 700 }}>BUCHHOLZ</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>ALARM</td>
            <td colSpan={3}>
              <input type="text" value={formData?.protectionTrials?.buchholzAlarm || ""} disabled className="form-input disabled preview" style={{ width: "100%" }} />
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>TRIP</td>
            <td colSpan={3}>
              <input type="text" value={formData?.protectionTrials?.buchholzTrip || ""} disabled className="form-input disabled preview" style={{ width: "100%" }} />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>B</td>
            <td style={{ fontWeight: 700 }}>MOG</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>ALARM</td>
            <td colSpan={3}>
              <input type="text" value={formData?.protectionTrials?.mogAlarm || ""} disabled className="form-input disabled preview" style={{ width: "100%" }} />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>C</td>
            <td style={{ fontWeight: 700 }}>PRV</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>TRIP</td>
            <td colSpan={3}>
              <input type="text" value={formData?.protectionTrials?.prvTrip || ""} disabled className="form-input disabled preview" style={{ width: "100%" }} />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>D</td>
            <td style={{ fontWeight: 700 }}>OTI</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>ALARM</td>
            <td colSpan={3} style={{ textAlign: "center" }}>
              <strong>Set Temperature</strong>
              <input type="text" value={formData?.protectionTrials?.setTemperature || ""} disabled className="form-input disabled preview" style={{ width: "100%", marginTop: 6 }} />
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>TRIP</td>
            <td colSpan={3}>
              <input type="text" value={formData?.protectionTrials?.otiTrip || ""} disabled className="form-input disabled preview" style={{ width: "100%" }} />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>E</td>
            <td style={{ fontWeight: 700 }}>WTI</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>ALARM</td>
            <td colSpan={3}>
              <input type="text" value={formData?.protectionTrials?.wtiAlarm || ""} disabled className="form-input disabled preview" style={{ width: "100%" }} />
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>TRIP</td>
            <td colSpan={3}>
              <input type="text" value={formData?.protectionTrials?.wtiTrip || ""} disabled className="form-input disabled preview" style={{ width: "100%" }} />
            </td>
          </tr>
        </tbody>
      </table>

      {formData.photos ? renderPhotos(formData.photos) : null}
    </div>
  );
};

// Stage 7 Form 1: Work Completion Report (for review display)
const Stage7Form1 = ({ formData }) => (
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
          <strong style={{ marginLeft: "20px" }}>TSS</strong>
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

// Stage 6 Form 2: Pre-Commissioning Checklist (Cont.) - review UI mirrors TractionTransformerForms.js Stage6Form2
const Stage6Form2 = ({ formData }) => {
  const valueAt = (path) => path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), formData) || "";

  const disabledInput = (path, style = {}) => (
    <input
      type="text"
      value={valueAt(path)}
      disabled
      className="form-input disabled preview"
      style={{ width: "100%", minWidth: 70, ...style }}
    />
  );

  return (
    <div className="form-container">
      <div className="company-header" style={{ marginBottom: 10 }}>
        <h2 style={{ textAlign: "left", textDecoration: "underline", textUnderlineOffset: 6 }}>
          PRE-COMMISSIONING CHECKLIST (CONT.)
        </h2>
      </div>

      <table className="form-table" style={{ marginTop: 22 }}>
        <tbody>
          <tr>
            <td style={{ width: "6%", textAlign: "center", fontWeight: 700 }}>IV</td>
            <td style={{ width: "38%", fontWeight: 700 }}>Transformer Protection relay</td>
            <td style={{ width: "14%", textAlign: "center", fontWeight: 700 }}>Make</td>
            <td style={{ width: "14%", textAlign: "center", fontWeight: 700 }}>sr.no.</td>
            <td style={{ width: "14%", textAlign: "center", fontWeight: 700 }}>last tested date.</td>
            <td style={{ width: "14%", textAlign: "center", fontWeight: 700 }}>Remark</td>
          </tr>

          {[
            { code: "A", label: "Over-current relay" },
            { code: "B", label: "Restricted Earth fault Relay" },
            { code: "C", label: "Differential  Relay" },
            { code: "D", label: "Master Trip Relay" },
          ].map((r) => (
            <tr key={`pr-${r.code}`}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{r.code}</td>
              <td style={{ fontWeight: 700 }}>{r.label}</td>
              <td>{disabledInput(["protectionRelay", r.code, "make"])}</td>
              <td>{disabledInput(["protectionRelay", r.code, "srNo"])}</td>
              <td>{disabledInput(["protectionRelay", r.code, "lastTested"])}</td>
              <td>{disabledInput(["protectionRelay", r.code, "remark"])}</td>
            </tr>
          ))}

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>E</td>
            <td style={{ fontWeight: 700 }}>Separate earth pit for neutral earthling</td>
            <td></td>
            <td>{disabledInput(["protectionRelay", "E", "yesNo"], { minWidth: 90 })}</td>
            <td>{disabledInput(["protectionRelay", "E", "lastTested"])}</td>
            <td>{disabledInput(["protectionRelay", "E", "remark"])}</td>
          </tr>

          {[
            { code: "F", label: "Neutral earth pit resistance values" },
            { code: "G", label: "Grid earth resistance values" },
            { code: "H", label: "Cleaning & Checking for the main tank Earthing" },
          ].map((r) => (
            <tr key={`pr-${r.code}`}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{r.code}</td>
              <td style={{ fontWeight: 700 }}>{r.label}</td>
              <td>{disabledInput(["protectionRelay", r.code, "make"])}</td>
              <td>{disabledInput(["protectionRelay", r.code, "srNo"])}</td>
              <td>{disabledInput(["protectionRelay", r.code, "lastTested"])}</td>
              <td>{disabledInput(["protectionRelay", r.code, "remark"])}</td>
            </tr>
          ))}

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }} rowSpan={2}>I</td>
            <td style={{ fontWeight: 700 }} rowSpan={2}>LA Counter reading</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>1.1</td>
            <td>{disabledInput(["protectionRelay", "I", "srNo", "1.1"])}</td>
            <td>{disabledInput(["protectionRelay", "I", "lastTested", "1.1"])}</td>
            <td rowSpan={2}>{disabledInput(["protectionRelay", "I", "remark"])}</td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>1.2</td>
            <td>{disabledInput(["protectionRelay", "I", "srNo", "1.2"])}</td>
            <td>{disabledInput(["protectionRelay", "I", "lastTested", "1.2"])}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>2.1</td>
            <td>{disabledInput(["protectionRelay", "I", "srNo", "2.1"])}</td>
            <td>{disabledInput(["protectionRelay", "I", "lastTested", "2.1"])}</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>2.2</td>
            <td>{disabledInput(["protectionRelay", "I", "srNo", "2.2"])}</td>
            <td>{disabledInput(["protectionRelay", "I", "lastTested", "2.2"])}</td>
            <td></td>
          </tr>

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>J</td>
            <td style={{ fontWeight: 700 }}>Whether LA Earthing checked</td>
            <td>{disabledInput(["protectionRelay", "J", "make"])}</td>
            <td>{disabledInput(["protectionRelay", "J", "srNo"])}</td>
            <td>{disabledInput(["protectionRelay", "J", "lastTested"])}</td>
            <td>{disabledInput(["protectionRelay", "J", "remark"])}</td>
          </tr>

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>K</td>
            <td style={{ fontWeight: 700 }}>IR Value of LA</td>
            <td>{disabledInput(["protectionRelay", "K", "make"])}</td>
            <td>{disabledInput(["protectionRelay", "K", "srNo"])}</td>
            <td>{disabledInput(["protectionRelay", "K", "lastTested"])}</td>
            <td>{disabledInput(["protectionRelay", "K", "remark"])}</td>
          </tr>

          {[
            { code: "L", label: "Phase 1.1" },
            { code: "M", label: "Phase 1.2" },
            { code: "N", label: "Phase 2.1" },
            { code: "O", label: "Phase 2.2" },
          ].map((r) => (
            <tr key={`pr-${r.code}`}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{r.code}</td>
              <td style={{ fontWeight: 700 }}>{r.label}</td>
              <td>{disabledInput(["protectionRelay", r.code, "make"])}</td>
              <td>{disabledInput(["protectionRelay", r.code, "srNo"])}</td>
              <td>{disabledInput(["protectionRelay", r.code, "lastTested"])}</td>
              <td>{disabledInput(["protectionRelay", r.code, "remark"])}</td>
            </tr>
          ))}

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>IV</td>
            <td style={{ fontWeight: 700 }}>Accessories&nbsp;&nbsp;Checking</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>SET Temp.</td>
            <td style={{ textAlign: "center", fontWeight: 700 }} colSpan={2}>Checked</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>No. of Hrs. RUN</td>
          </tr>

          {[
            { code: "A", label: "FAN START" },
            { code: "B", label: "FAN STOP" },
            { code: "C", label: "PUMP START" },
            { code: "D", label: "PUMP START" },
          ].map((r) => (
            <tr key={`ac-${r.code}`}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{r.code}</td>
              <td style={{ fontWeight: 700 }}>{r.label}</td>
              <td>{disabledInput(["accessoriesChecking", r.code, "setTemp"])}</td>
              <td colSpan={2}>{disabledInput(["accessoriesChecking", r.code, "checked"])}</td>
              <td>{disabledInput(["accessoriesChecking", r.code, "hrsRun"])}</td>
            </tr>
          ))}

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>V</td>
            <td style={{ fontWeight: 700 }}>OCTC TAP Position</td>
            <td colSpan={4}></td>
          </tr>
          {[
            { code: "A", label: "DIVERTER SWITCH" },
            { code: "B", label: "DRIVE MECHANISM" },
            { code: "C", label: "TPI - (RTCC)" },
          ].map((r) => (
            <tr key={`octc-${r.code}`}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{r.code}</td>
              <td style={{ fontWeight: 700 }}>{r.label}</td>
              <td colSpan={4}>{disabledInput(["octcTapPosition", r.code])}</td>
            </tr>
          ))}

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>VI</td>
            <td style={{ fontWeight: 700 }}>Bushing Test Tap Earthed</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>HV Checked</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>1.1</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>1.2</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>{disabledInput(["bushingTestTapEarthed", "hvChecked", "1.1"])}</td>
            <td>{disabledInput(["bushingTestTapEarthed", "hvChecked", "1.2"])}</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>LV Checked</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>2.1</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>2.2</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>{disabledInput(["bushingTestTapEarthed", "lvChecked", "2.1"])}</td>
            <td>{disabledInput(["bushingTestTapEarthed", "lvChecked", "2.2"])}</td>
            <td></td>
          </tr>

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>VII</td>
            <td style={{ fontWeight: 700 }}>Oil Values</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>BDV</td>
            <td colSpan={2} style={{ textAlign: "center", fontWeight: 700 }}>KV</td>
            <td></td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>A</td>
            <td style={{ fontWeight: 700 }}>BDV</td>
            <td colSpan={3}>{disabledInput(["oilValues", "bdvKV"])}</td>
            <td></td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>B</td>
            <td style={{ fontWeight: 700 }}>Moisture Content</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>PPM</td>
            <td colSpan={2}>{disabledInput(["oilValues", "moisturePPM"])}</td>
            <td></td>
          </tr>

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>VIII</td>
            <td style={{ fontWeight: 700 }}>Final IR Values in MΩ</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>10</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>60</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>600</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>P.I</td>
          </tr>

          {[
            { key: "hvEarth", label: "HV-Earth" },
            { key: "lvEarth", label: "LV-Earth" },
            { key: "hvLv", label: "HV-LV" },
          ].map((r) => (
            <tr key={`ir-${r.key}`}>
              <td></td>
              <td style={{ fontWeight: 700 }}>{r.label}</td>
              <td>{disabledInput(["finalIR", r.key, "10"])}</td>
              <td>{disabledInput(["finalIR", r.key, "60"])}</td>
              <td>{disabledInput(["finalIR", r.key, "600"])}</td>
              <td>{disabledInput(["finalIR", r.key, "pi"])}</td>
            </tr>
          ))}

          <tr>
            <td></td>
            <td style={{ fontWeight: 700 }}>Core to frame</td>
            <td colSpan={4}>{disabledInput(["finalIR", "coreToFrame"])}</td>
          </tr>
          <tr>
            <td></td>
            <td style={{ fontWeight: 700 }}>Frame to Tank</td>
            <td colSpan={4}>{disabledInput(["finalIR", "frameToTank"])}</td>
          </tr>
          <tr>
            <td></td>
            <td style={{ fontWeight: 700 }}>Removal link again tightens and check zero megger</td>
            <td colSpan={4}>{disabledInput(["finalIR", "removalLinkTightensAndCheckZeroMegger"])}</td>
          </tr>

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>IX</td>
            <td style={{ fontWeight: 700 }}>Oil Level in Conservator</td>
            <td colSpan={4}>{disabledInput(["oilLevelInConservator"])}</td>
          </tr>

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>X</td>
            <td style={{ fontWeight: 700 }}>Connectors</td>
            <td style={{ textAlign: "center", fontWeight: 700 }} colSpan={2}>Conditions</td>
            <td colSpan={2} style={{ fontWeight: 700 }}>HV Jumpers</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td colSpan={2}>{disabledInput(["connectors", "conditions"])}</td>
            <td colSpan={2}>{disabledInput(["connectors", "hvJumpers", "1.1"])}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td colSpan={2}></td>
            <td colSpan={2}>{disabledInput(["connectors", "hvJumpers", "1.2"])}</td>
          </tr>

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>XI</td>
            <td style={{ fontWeight: 700 }}>Connectors</td>
            <td colSpan={2} style={{ fontWeight: 700 }}>
              LV Jumpers
              <br />
              2.1
              <br />
              2.2
            </td>
            <td colSpan={2}>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8, alignItems: "center" }}>
                  <strong>2.1</strong>
                  {disabledInput(["connectorsLvJumpers", "2.1"])}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8, alignItems: "center" }}>
                  <strong>2.2</strong>
                  {disabledInput(["connectorsLvJumpers", "2.2"])}
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>XII</td>
            <td style={{ fontWeight: 700 }} colSpan={5}>
              All CT Cable Terminated and Glands Sealed
              {disabledInput(["ctCableAndGlandsSealed"], { marginTop: 6 })}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>1</td>
            <td style={{ fontWeight: 700 }} colSpan={5}>
              Anabond applied to HV Bushings
              {disabledInput(["anabondAppliedHvBushings"], { marginTop: 6 })}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>2</td>
            <td style={{ fontWeight: 700 }} colSpan={5}>
              All joints properly sealed against Water Ingress
              {disabledInput(["allJointsSealedAgainstWaterIngress"], { marginTop: 6 })}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>3</td>
            <td style={{ fontWeight: 700 }} colSpan={5}>
              All Foreign material cleared from Transformer
              {disabledInput(["foreignMaterialCleared"], { marginTop: 6 })}
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 700 }} colSpan={2}>
              Temperature of&nbsp;&nbsp;&nbsp;&nbsp;°C
            </td>
            <td style={{ fontWeight: 700, textAlign: "center" }}>WTI</td>
            <td>{disabledInput(["temperature", "wti"])}</td>
            <td style={{ fontWeight: 700, textAlign: "center" }}>OTI</td>
            <td>{disabledInput(["temperature", "oti"])}</td>
          </tr>

          <tr>
            <td colSpan={6} style={{ padding: 14, lineHeight: 1.6 }}>
              <strong>Remarks:</strong> The Transformer as mentioned above has been jointly cleared for charging as on{" "}
              {disabledInput(["remarksChargingAsOn"], { display: "inline-block", width: 140, marginLeft: 6, marginRight: 6 })}
              . {disabledInput(["remarksText"], { marginTop: 8 })}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 18, marginTop: 18, justifyContent: "space-between" }}>
        <table className="form-table" style={{ width: "50%", margin: 0 }}>
          <tbody>
            <tr>
              <td style={{ width: "45%", fontWeight: 700 }}>Checked By :</td>
              <td>{disabledInput(["checkedBy", "name"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Signature :</td>
              <td>{disabledInput(["checkedBy", "signature"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Date :</td>
              <td>{disabledInput(["checkedBy", "date"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Reviewed By :</td>
              <td>{disabledInput(["reviewedBy", "name"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Signature :</td>
              <td>{disabledInput(["reviewedBy", "signature"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Date :</td>
              <td>{disabledInput(["reviewedBy", "date"])}</td>
            </tr>
          </tbody>
        </table>

        <table className="form-table" style={{ width: "50%", margin: 0 }}>
          <tbody>
            <tr>
              <td style={{ width: "45%", fontWeight: 700 }}>Witnessed By :</td>
              <td>{disabledInput(["witnessedBy", "name"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Signature :</td>
              <td>{disabledInput(["witnessedBy", "signature"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Date :</td>
              <td>{disabledInput(["witnessedBy", "date"])}</td>
            </tr>
            <tr>
              <td style={{ width: "45%", fontWeight: 700 }}>Witnessed By :</td>
              <td>{disabledInput(["witnessedBy2", "name"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Signature :</td>
              <td>{disabledInput(["witnessedBy2", "signature"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Date :</td>
              <td>{disabledInput(["witnessedBy2", "date"])}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 18, fontWeight: 700 }}>
        Note :- Photographs to be added:-
        <div style={{ marginTop: 6, fontWeight: 600 }}>
          Earthing’s of main tank & bushing, sealing of Cable gland, bushing test tap & thimble, Buchholz terminal
          plate, etc....
        </div>
      </div>

      {formData.photos ? renderPhotos(formData.photos) : null}
    </div>
  );
};

// Stage 7 Review Renderer Component - Work Completion Report
const Stage7ReviewRenderer = ({ formDataFromDB }) => {
  const formData = formDataFromDB?.form1 || {};

  return (
    <div className="stage7-review-container">
      <div
        className="form-review-card"
        style={{
          marginBottom: "30px",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
          background: "white",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          className="company-header"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.25rem" }}>
            Work Completion Report (Stage 7 - Form 1)
          </h2>
        </div>
        <Stage7Form1 formData={formData} />
        {formData.photos ? renderPhotos(formData.photos) : null}
      </div>
    </div>
  );
};

// Stage 6 Review Renderer Component
const Stage6ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage6Forms = [
    {
      id: "stage6-form1",
      title: "Pre-Commissioning Checklist",
      component: Stage6Form1
    },
    {
      id: "stage6-form2",
      title: "Pre-Commissioning Checklist (Cont.)",
      component: Stage6Form2
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
            <form.component formData={formData} />

            {/* Render photos if they exist */}
            {formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

const TractionTransformerStageReviewPanel = ({
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
          projectName={selectedProjectForReview?.name}
          companyName={selectedProjectForReview?.companyName}
          apiEndpoint="tractionData"
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
      case 7:
        return <Stage7ReviewRenderer 
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
  Stage1Form1,
  Stage1Form2,
  Stage1Form3,
  Stage1Form4,
  Stage1Form5,
  Stage1Form6,
  Stage1Form7,
  Stage2Form1,
  Stage2Form2,
  Stage3Form1,
  Stage4Form1,
  Stage4Form2,
  Stage4Form3,
  Stage4Form4,
  Stage5Form1,
  Stage5Form2,
  Stage5Form3,
  Stage5Form4,
  Stage5Form5,
  Stage5Form6,
  Stage5Form7,
  Stage5Form8,
  Stage6Form1,
  Stage6Form2,
  Stage7Form1,
  Stage1ReviewRenderer,
  Stage2ReviewRenderer,
  Stage3ReviewRenderer,
  Stage4ReviewRenderer,
  Stage5ReviewRenderer,
  Stage6ReviewRenderer,
  Stage7ReviewRenderer
};

export default TractionTransformerStageReviewPanel;
