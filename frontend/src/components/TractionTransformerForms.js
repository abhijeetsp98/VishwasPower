"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import "./form-styles.css"
import axios from "axios"
import { BACKEND_API_BASE_URL } from "./constant"

// Signature Canvas Hook
const useSignatureCanvas = (initialDataUrl) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureDataUrl, setSignatureDataUrl] = useState(initialDataUrl || "")
  const lastX = useRef(0)
  const lastY = useRef(0)

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setSignatureDataUrl("")
    }
  }, [])

  const getSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      return canvas.toDataURL("image/png")
    }
    return ""
  }, [])

  const draw = useCallback(
    (e) => {
      // Prevent default touch behavior to stop page scrolling
      e.preventDefault()
      
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const rect = canvas.getBoundingClientRect()

      let clientX, clientY
      if (e.touches) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const currentX = clientX - rect.left
      const currentY = clientY - rect.top

      ctx.beginPath()
      ctx.moveTo(lastX.current, lastY.current)
      ctx.lineTo(currentX, currentY)
      ctx.stroke()

      lastX.current = currentX
      lastY.current = currentY
    },
    [isDrawing]
  )

  const startDrawing = useCallback((e) => {
    // Prevent default touch behavior to stop page scrolling
    e.preventDefault()
    
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY
    if (e.touches) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    lastX.current = clientX - rect.left
    lastY.current = clientY - rect.top
  }, [])

  const stopDrawing = useCallback((e) => {
    // Prevent default touch behavior to stop page scrolling
    if (e) {
      e.preventDefault()
    }
    
    setIsDrawing(false)
    setSignatureDataUrl(getSignature())
  }, [getSignature])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.strokeStyle = "#000"

      if (initialDataUrl) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = initialDataUrl
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
      }
    }
  }, [initialDataUrl])

  // Additional touch event handling to prevent page scrolling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const preventTouch = (e) => {
      e.preventDefault()
    }

    // Add passive: false to ensure preventDefault works
    canvas.addEventListener('touchstart', preventTouch, { passive: false })
    canvas.addEventListener('touchmove', preventTouch, { passive: false })
    canvas.addEventListener('touchend', preventTouch, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', preventTouch)
      canvas.removeEventListener('touchmove', preventTouch)
      canvas.removeEventListener('touchend', preventTouch)
    }
  }, [])

  return {
    canvasRef,
    signatureDataUrl,
    clearCanvas,
    startDrawing,
    draw,
    stopDrawing,
  }
}

// Enhanced Photo Upload Component
const PhotoUploadSection = ({ title, photos, onPhotoChange, allowMultiple = false }) => {
  const [cameraStream, setCameraStream] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setCameraStream(stream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
      setShowCamera(false)
    }
  }

  const capturePhoto = (photoKey) => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
              type: "image/jpeg",
            })
            onPhotoChange(photoKey, file)
            stopCamera()
          }
        },
        "image/jpeg",
        0.8,
      )
    }
  }

  const handleFileSelect = (photoKey, files) => {
    if (allowMultiple && files.length > 1) {
      Array.from(files).forEach((file, index) => {
        onPhotoChange(`${photoKey}_${index}`, file)
      })
    } else {
      onPhotoChange(photoKey, files[0])
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>{title}</p>

      {showCamera && (
        <div
          className="camera-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video ref={videoRef} autoPlay playsInline style={{ maxWidth: "90%", maxHeight: "70%" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => capturePhoto(photos[0]?.key)}
              className="capture-btn"
              style={{
                padding: "10px 20px",
                margin: "0 10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              📷 Capture Photo
            </button>
            <button
              onClick={stopCamera}
              style={{
                padding: "10px 20px",
                margin: "0 10px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      <div className="photo-upload-grid">
        {photos.map((photo, index) => (
          <div key={index} className="photo-upload-item">
            <label>{photo.label}</label>

            <div className="upload-options" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="button"
                onClick={startCamera}
                className="camera-btn"
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                📷 Camera
              </button>

              <label
                className="gallery-btn"
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#FF9800",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                🖼️ Gallery
                <input
                  type="file"
                  accept="image/*"
                  multiple={allowMultiple}
                  onChange={(e) => handleFileSelect(photo.key, e.target.files)}
                  style={{ display: "none" }}
                />
              </label>

              {allowMultiple && (
                <label
                  className="bulk-btn"
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#9C27B0",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  📁 Bulk
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileSelect(photo.key, e.target.files)}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => onPhotoChange(photo.key, e.target.files[0])}
              style={{ marginTop: "10px", width: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Individual Signature Box Component
const SignatureBox = ({
  label,
  nameValue,
  onNameChange,
  onSignatureChange,
  initialSignature,
}) => {
  const {
    canvasRef,
    signatureDataUrl,
    clearCanvas,
    startDrawing,
    draw,
    stopDrawing,
  } = useSignatureCanvas(initialSignature);

  useEffect(() => {
    if (signatureDataUrl) {
      onSignatureChange(signatureDataUrl);
    }
  }, [signatureDataUrl, onSignatureChange]);

  return (
    <div className="signature-box">
      <label>{label}</label>
      <input
        type="text"
        placeholder="Enter name"
        value={nameValue}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
        style={{ 
          border: "1px solid #ccc", 
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none"
        }}
      />
      <button
        type="button"
        onClick={clearCanvas}
        className="clear-signature-btn"
      >
        Clear Signature
      </button>
      <small>Sign above</small>
    </div>
  );
};

// V Connected 63 MVA Transformer Forms

// Stage 1 Forms
export function Stage1Form1({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyData,
  stage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    make: "",
    currentHV: "",
    srNo: "",
    currentLV: "",
    mvaRating: "",
    tempRiseOilC: "",
    hvKv: "",
    windingC: "",
    lvKv: "",
    oilQuantity: "",
    impedancePercent: "",
    weightCoreWdg: "",
    yearOfMfg: "",
    transportingWeight: "",
    noOfCoolingFan: "",
    totalWeight: "",
    noOfRadiators: "",
    noOfTaps: "",
    mfgOfOctc: "",
    typeOfOctc: "",
    srNoOctc: "",
    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage1Form1`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage1Form1")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "transformer", label: "Transformer" },
    { key: "oilLevelGauge", label: "Oil Level Gauge" },
    { key: "wheelLocking", label: "Wheel Locking" },
    {
      key: "transformerFoundation",
      label: "Transformer Foundation Level condition",
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </td>
            <td>
              <strong>CURRENT HV (A)</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.currentHV}
                onChange={(e) => setFormData({ ...formData, currentHV: e.target.value })}
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
                value={formData.srNo}
                onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
              />
            </td>
            <td>
              <strong>LV (A)</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.currentLV}
                onChange={(e) => setFormData({ ...formData, currentLV: e.target.value })}
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
                value={formData.mvaRating}
                onChange={(e) => setFormData({ ...formData, mvaRating: e.target.value })}
              />
            </td>
            <td>
              <strong>Temp. Rise over amb. Oil in °C</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.tempRiseOilC}
                onChange={(e) => setFormData({ ...formData, tempRiseOilC: e.target.value })}
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
                value={formData.hvKv}
                onChange={(e) => setFormData({ ...formData, hvKv: e.target.value })}
              />
            </td>
            <td>
              <strong>Winding in °C</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.windingC}
                onChange={(e) => setFormData({ ...formData, windingC: e.target.value })}
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
                value={formData.lvKv}
                onChange={(e) => setFormData({ ...formData, lvKv: e.target.value })}
              />
            </td>
            <td>
              <strong>Oil Quantity</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oilQuantity}
                onChange={(e) => setFormData({ ...formData, oilQuantity: e.target.value })}
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
                value={formData.impedancePercent}
                onChange={(e) => setFormData({ ...formData, impedancePercent: e.target.value })}
              />
            </td>
            <td>
              <strong>Weight of Core & Wdg.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.weightCoreWdg}
                onChange={(e) => setFormData({ ...formData, weightCoreWdg: e.target.value })}
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
                value={formData.yearOfMfg}
                onChange={(e) => setFormData({ ...formData, yearOfMfg: e.target.value })}
              />
            </td>
            <td>
              <strong>TRANSPORTING WEIGHT</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.transportingWeight}
                onChange={(e) => setFormData({ ...formData, transportingWeight: e.target.value })}
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
                value={formData.noOfCoolingFan}
                onChange={(e) => setFormData({ ...formData, noOfCoolingFan: e.target.value })}
              />
            </td>
            <td>
              <strong>Total Weight</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.totalWeight}
                onChange={(e) => setFormData({ ...formData, totalWeight: e.target.value })}
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
                value={formData.noOfOilPump}
                onChange={(e) => setFormData({ ...formData, noOfOilPump: e.target.value })}
              /> */}
            </td>
            <td>
              <strong>NO. OF RADIATORS</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.noOfRadiators}
                onChange={(e) => setFormData({ ...formData, noOfRadiators: e.target.value })}
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
                value={formData.noOfTaps}
                onChange={(e) => setFormData({ ...formData, noOfTaps: e.target.value })}
              />
            </td>
            <td>
              <strong>MFG. OF OCTC</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.mfgOfOctc}
                onChange={(e) => setFormData({ ...formData, mfgOfOctc: e.target.value })}
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
                value={formData.typeOfOctc}
                onChange={(e) => setFormData({ ...formData, typeOfOctc: e.target.value })}
              />
            </td>
            <td>
              <strong>SR. NO. OCTC</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.srNoOctc}
                onChange={(e) => setFormData({ ...formData, srNoOctc: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="Transformer, Oil Level gauge, Wheel Locking, Transformer Foundation Level condition."
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function Stage1Form2({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    accessories: {},
    photos: {},
    ...initialData,
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_API_BASE_URL}/api/autoData/getTable`,
          {
            companyName: companyName,
            projectName: projectName,
            stage: 1,
            formNumber: 2,
          }
        );
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage1Form2");
          console.log(response.data.data);
          setFormData(response.data.data);
        } else {
          console.log("There is no data in DB.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchFormData();
  }, [projectName, companyName]);

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

  const handleAccessoryChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [id]: {
          ...prev.accessories[id],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }));
  };

  const photoRequirements = [
    { key: "transformerAccessories", label: "Transformer Accessories" },
  ];

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
                  value={formData?.accessories[item.id]?.packingCase || ""}
                  onChange={(e) =>
                    handleAccessoryChange(
                      item.id,
                      "packingCase",
                      e.target.value
                    )
                  }
                />
              </td>
              <td>
                <strong>{item.description}</strong>
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.accessories[item.id]?.qtyPerPL || ""}
                  onChange={(e) =>
                    handleAccessoryChange(item.id, "qtyPerPL", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.accessories[item.id]?.qtyReceived || ""}
                  onChange={(e) =>
                    handleAccessoryChange(
                      item.id,
                      "qtyReceived",
                      e.target.value
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.accessories[item.id]?.shortQty || ""}
                  onChange={(e) =>
                    handleAccessoryChange(item.id, "shortQty", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.accessories[item.id]?.damagedQty || ""}
                  onChange={(e) =>
                    handleAccessoryChange(item.id, "damagedQty", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Transformer Accessories"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  );
}

function Stage1Form3({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Core Insulation Check fields (Between Core-Frame, Frame-Tank, Core-Tank)
    coreFrame_obtainedValue: "",
    coreFrame_remarks: "",
    frameTank_obtainedValue: "",
    frameTank_remarks: "",
    coreTank_obtainedValue: "",
    coreTank_remarks: "",
    // Equipment checklist fields
    filterMachine: "",
    filterMachineCapacity: "",
    vacuumPumpCapacity: "",
    reservoirAvailable: "",
    reservoirCapacity: "",
    hosePipes: "",
    craneAvailable: "",
    dryAir: "",
    dewPointMeter: "",
    mecLeodGauge: "",
    // Safety equipment fields
    fireExtinguisher: "",
    firstAidKit: "",
    ppeEquipment: "",
    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage1Form3`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage1Form3")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "tenDeltaKit", label: "Ten delta kit" },
    { key: "calibrationReport", label: "calibration report" },
    { key: "duringTenDeltaBushing", label: "during tendelta of bushing photo" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>CORE INSULATION CHECK: At 1KV &gt; 500 MΩ </h2>
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
                value={formData.coreFrame_obtainedValue}
                onChange={(e) => setFormData({ ...formData, coreFrame_obtainedValue: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.coreFrame_remarks}
                onChange={(e) => setFormData({ ...formData, coreFrame_remarks: e.target.value })}
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
                value={formData.frameTank_obtainedValue}
                onChange={(e) => setFormData({ ...formData, frameTank_obtainedValue: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.frameTank_remarks}
                onChange={(e) => setFormData({ ...formData, frameTank_remarks: e.target.value })}
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
                value={formData.coreTank_obtainedValue}
                onChange={(e) => setFormData({ ...formData, coreTank_obtainedValue: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.coreTank_remarks}
                onChange={(e) => setFormData({ ...formData, coreTank_remarks: e.target.value })}
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
                value={formData.filterMachine}
                onChange={(e) =>
                  setFormData({ ...formData, filterMachine: e.target.value })
                }
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
                value={formData.filterMachineCapacity}
                onChange={(e) => setFormData({ ...formData, filterMachineCapacity: e.target.value })}
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
                value={formData.vacuumPumpCapacity}
                onChange={(e) => setFormData({ ...formData, vacuumPumpCapacity: e.target.value })}
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
                value={formData.reservoirAvailable}
                onChange={(e) => setFormData({ ...formData, reservoirAvailable: e.target.value })}
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
                value={formData.reservoirCapacity}
                onChange={(e) => setFormData({ ...formData, reservoirCapacity: e.target.value })}
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
                value={formData.hosePipes}
                onChange={(e) =>
                  setFormData({ ...formData, hosePipes: e.target.value })
                }
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
                value={formData.craneAvailable}
                onChange={(e) => setFormData({ ...formData, craneAvailable: e.target.value })}
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
                value={formData.dryAir}
                onChange={(e) =>
                  setFormData({ ...formData, dryAir: e.target.value })
                }
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
                value={formData.dewPointMeter}
                onChange={(e) =>
                  setFormData({ ...formData, dewPointMeter: e.target.value })
                }
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
                value={formData.mecLeodGauge}
                onChange={(e) =>
                  setFormData({ ...formData, mecLeodGauge: e.target.value })
                }
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
                value={formData.fireExtinguisher}
                onChange={(e) =>
                  setFormData({ ...formData, fireExtinguisher: e.target.value })
                }
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
                value={formData.firstAidKit}
                onChange={(e) =>
                  setFormData({ ...formData, firstAidKit: e.target.value })
                }
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
                value={formData.ppeEquipment}
                onChange={(e) =>
                  setFormData({ ...formData, ppeEquipment: e.target.value })
                }
              >
                <option value="">(Yes/No)</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="Ten delta kit, calibration report, during ten delta of bushing photo"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function Stage1Form4({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    makeOfMeter: "",
    modelSrNo: "",
    date: "",
    ambient: "",
    wtiTemp: "",
    testReportReviewedBy: "",
    acceptanceOfTest: "",

    // Phase 1.1 - CT Ratio test fields (S1-S2)
    phase31_20percent_appliedCurrent_s1s2: "",
    phase31_20percent_measuredCurrent_s1s2: "",
    phase31_40percent_appliedCurrent_s1s2: "",
    phase31_40percent_measuredCurrent_s1s2: "",
    phase31_60percent_appliedCurrent_s1s2: "",
    phase31_60percent_measuredCurrent_s1s2: "",
    phase31_80percent_appliedCurrent_s1s2: "",
    phase31_80percent_measuredCurrent_s1s2: "",
    phase31_100percent_appliedCurrent_s1s2: "",
    phase31_100percent_measuredCurrent_s1s2: "",

    // Phase 1.1 - CT Ratio test fields (S1-S3)
    phase31_20percent_appliedCurrent_s1s3: "",
    phase31_20percent_measuredCurrent_s1s3: "",
    phase31_40percent_appliedCurrent_s1s3: "",
    phase31_40percent_measuredCurrent_s1s3: "",
    phase31_60percent_appliedCurrent_s1s3: "",
    phase31_60percent_measuredCurrent_s1s3: "",
    phase31_80percent_appliedCurrent_s1s3: "",
    phase31_80percent_measuredCurrent_s1s3: "",
    phase31_100percent_appliedCurrent_s1s3: "",
    phase31_100percent_measuredCurrent_s1s3: "",

    // Phase 1.1 - Knee point voltage fields (S1-S2)
    phase31_knee_20percent_appliedVoltage_s1s2: "",
    phase31_knee_20percent_measuredCurrent_s1s2: "",
    phase31_knee_40percent_appliedVoltage_s1s2: "",
    phase31_knee_40percent_measuredCurrent_s1s2: "",
    phase31_knee_60percent_appliedVoltage_s1s2: "",
    phase31_knee_60percent_measuredCurrent_s1s2: "",
    phase31_knee_80percent_appliedVoltage_s1s2: "",
    phase31_knee_80percent_measuredCurrent_s1s2: "",
    phase31_knee_100percent_appliedVoltage_s1s2: "",
    phase31_knee_100percent_measuredCurrent_s1s2: "",
    phase31_knee_110percent_appliedVoltage_s1s2: "",
    phase31_knee_110percent_measuredCurrent_s1s2: "",

    // Phase 1.1 - Knee point voltage fields (S1-S3)
    phase31_knee_20percent_appliedVoltage_s1s3: "",
    phase31_knee_20percent_measuredCurrent_s1s3: "",
    phase31_knee_40percent_appliedVoltage_s1s3: "",
    phase31_knee_40percent_measuredCurrent_s1s3: "",
    phase31_knee_60percent_appliedVoltage_s1s3: "",
    phase31_knee_60percent_measuredCurrent_s1s3: "",
    phase31_knee_80percent_appliedVoltage_s1s3: "",
    phase31_knee_80percent_measuredCurrent_s1s3: "",
    phase31_knee_100percent_appliedVoltage_s1s3: "",
    phase31_knee_100percent_measuredCurrent_s1s3: "",
    phase31_knee_110percent_appliedVoltage_s1s3: "",
    phase31_knee_110percent_measuredCurrent_s1s3: "",

    // Phase 1.2 - CT Ratio test fields (S1-S2)
    phase32_20percent_appliedCurrent_s1s2: "",
    phase32_20percent_measuredCurrent_s1s2: "",
    phase32_40percent_appliedCurrent_s1s2: "",
    phase32_40percent_measuredCurrent_s1s2: "",
    phase32_60percent_appliedCurrent_s1s2: "",
    phase32_60percent_measuredCurrent_s1s2: "",
    phase32_80percent_appliedCurrent_s1s2: "",
    phase32_80percent_measuredCurrent_s1s2: "",
    phase32_100percent_appliedCurrent_s1s2: "",
    phase32_100percent_measuredCurrent_s1s2: "",

    // Phase 1.2 - CT Ratio test fields (S1-S3)
    phase32_20percent_appliedCurrent_s1s3: "",
    phase32_20percent_measuredCurrent_s1s3: "",
    phase32_40percent_appliedCurrent_s1s3: "",
    phase32_40percent_measuredCurrent_s1s3: "",
    phase32_60percent_appliedCurrent_s1s3: "",
    phase32_60percent_measuredCurrent_s1s3: "",
    phase32_80percent_appliedCurrent_s1s3: "",
    phase32_80percent_measuredCurrent_s1s3: "",
    phase32_100percent_appliedCurrent_s1s3: "",
    phase32_100percent_measuredCurrent_s1s3: "",

    // Phase 1.2 - Knee point voltage fields (S1-S2)
    phase32_knee_20percent_appliedVoltage_s1s2: "",
    phase32_knee_20percent_measuredCurrent_s1s2: "",
    phase32_knee_40percent_appliedVoltage_s1s2: "",
    phase32_knee_40percent_measuredCurrent_s1s2: "",
    phase32_knee_60percent_appliedVoltage_s1s2: "",
    phase32_knee_60percent_measuredCurrent_s1s2: "",
    phase32_knee_80percent_appliedVoltage_s1s2: "",
    phase32_knee_80percent_measuredCurrent_s1s2: "",
    phase32_knee_100percent_appliedVoltage_s1s2: "",
    phase32_knee_100percent_measuredCurrent_s1s2: "",
    phase32_knee_110percent_appliedVoltage_s1s2: "",
    phase32_knee_110percent_measuredCurrent_s1s2: "",

    // Phase 1.2 - Knee point voltage fields (S1-S3)
    phase32_knee_20percent_appliedVoltage_s1s3: "",
    phase32_knee_20percent_measuredCurrent_s1s3: "",
    phase32_knee_40percent_appliedVoltage_s1s3: "",
    phase32_knee_40percent_measuredCurrent_s1s3: "",
    phase32_knee_60percent_appliedVoltage_s1s3: "",
    phase32_knee_60percent_measuredCurrent_s1s3: "",
    phase32_knee_80percent_appliedVoltage_s1s3: "",
    phase32_knee_80percent_measuredCurrent_s1s3: "",
    phase32_knee_100percent_appliedVoltage_s1s3: "",
    phase32_knee_100percent_measuredCurrent_s1s3: "",
    phase32_knee_110percent_appliedVoltage_s1s3: "",
    phase32_knee_110percent_measuredCurrent_s1s3: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage1Form4`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage1Form4")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "ctRatioKit", label: "CT Ratio kit calibration" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
                value={formData.phase31_20percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_20percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_20percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_20percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_20percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_20percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_20percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_20percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_40percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_40percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_40percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_40percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_40percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_40percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_40percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_40percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_60percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_60percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_60percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_60percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_60percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_60percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_60percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_60percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_80percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_80percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_80percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_80percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_80percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_80percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_80percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_80percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_100percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_100percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_100percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_100percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_100percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_100percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_100percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_100percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_knee_20percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_20percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_20percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_20percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_20percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_20percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_20percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_20percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_knee_40percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_40percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_40percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_40percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_40percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_40percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_40percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_40percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_knee_60percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_60percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_60percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_60percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_60percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_60percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_60percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_60percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_knee_80percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_80percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_80percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_80percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_80percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_80percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_80percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_80percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_knee_100percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_100percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_100percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_100percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_100percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_100percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_100percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_100percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_knee_110percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_110percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_110percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_110percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_110percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_110percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_110percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_110percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_20percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_20percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_20percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_20percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_20percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_20percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_20percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_20percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_40percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_40percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_40percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_40percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_40percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_40percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_40percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_40percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_60percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_60percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_60percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_60percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_60percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_60percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_60percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_60percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_80percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_80percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_80percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_80percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_80percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_80percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_80percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_80percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_100percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_100percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_100percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_100percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_100percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_100percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_100percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_100percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_knee_20percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_20percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_20percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_20percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_20percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_20percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_20percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_20percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_knee_40percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_40percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_40percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_40percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_40percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_40percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_40percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_40percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_knee_60percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_60percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_60percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_60percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_60percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_60percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_60percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_60percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_knee_80percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_80percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_80percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_80percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_80percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_80percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_80percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_80percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_knee_100percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_100percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_100percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_100percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_100percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_100percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_100percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_100percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_knee_110percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_110percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_110percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_110percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_110percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_110percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_110percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_110percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="CT Ratio kit calibration"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function Stage1Form5({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    // Phase 2.1 CT Ratio measurements
    phase31_20percent_appliedCurrent_s1s2: "",
    phase31_20percent_appliedCurrent_s1s3: "",
    phase31_20percent_measuredCurrent_s1s2: "",
    phase31_20percent_measuredCurrent_s1s3: "",
    phase31_40percent_appliedCurrent_s1s2: "",
    phase31_40percent_appliedCurrent_s1s3: "",
    phase31_40percent_measuredCurrent_s1s2: "",
    phase31_40percent_measuredCurrent_s1s3: "",
    phase31_60percent_appliedCurrent_s1s2: "",
    phase31_60percent_appliedCurrent_s1s3: "",
    phase31_60percent_measuredCurrent_s1s2: "",
    phase31_60percent_measuredCurrent_s1s3: "",
    phase31_80percent_appliedCurrent_s1s2: "",
    phase31_80percent_appliedCurrent_s1s3: "",
    phase31_80percent_measuredCurrent_s1s2: "",
    phase31_80percent_measuredCurrent_s1s3: "",
    phase31_100percent_appliedCurrent_s1s2: "",
    phase31_100percent_appliedCurrent_s1s3: "",
    phase31_100percent_measuredCurrent_s1s2: "",
    phase31_100percent_measuredCurrent_s1s3: "",

    // Phase 2.1 Knee point voltage measurements
    phase31_knee_20percent_appliedVoltage_s1s2: "",
    phase31_knee_20percent_appliedVoltage_s1s3: "",
    phase31_knee_20percent_measuredCurrent_s1s2: "",
    phase31_knee_20percent_measuredCurrent_s1s3: "",
    phase31_knee_40percent_appliedVoltage_s1s2: "",
    phase31_knee_40percent_appliedVoltage_s1s3: "",
    phase31_knee_40percent_measuredCurrent_s1s2: "",
    phase31_knee_40percent_measuredCurrent_s1s3: "",
    phase31_knee_60percent_appliedVoltage_s1s2: "",
    phase31_knee_60percent_appliedVoltage_s1s3: "",
    phase31_knee_60percent_measuredCurrent_s1s2: "",
    phase31_knee_60percent_measuredCurrent_s1s3: "",
    phase31_knee_80percent_appliedVoltage_s1s2: "",
    phase31_knee_80percent_appliedVoltage_s1s3: "",
    phase31_knee_80percent_measuredCurrent_s1s2: "",
    phase31_knee_80percent_measuredCurrent_s1s3: "",
    phase31_knee_100percent_appliedVoltage_s1s2: "",
    phase31_knee_100percent_appliedVoltage_s1s3: "",
    phase31_knee_100percent_measuredCurrent_s1s2: "",
    phase31_knee_100percent_measuredCurrent_s1s3: "",
    phase31_knee_110percent_appliedVoltage_s1s2: "",
    phase31_knee_110percent_appliedVoltage_s1s3: "",
    phase31_knee_110percent_measuredCurrent_s1s2: "",
    phase31_knee_110percent_measuredCurrent_s1s3: "",

    // Phase 2.2 CT Ratio measurements
    phase32_20percent_appliedCurrent_s1s2: "",
    phase32_20percent_appliedCurrent_s1s3: "",
    phase32_20percent_measuredCurrent_s1s2: "",
    phase32_20percent_measuredCurrent_s1s3: "",
    phase32_40percent_appliedCurrent_s1s2: "",
    phase32_40percent_appliedCurrent_s1s3: "",
    phase32_40percent_measuredCurrent_s1s2: "",
    phase32_40percent_measuredCurrent_s1s3: "",
    phase32_60percent_appliedCurrent_s1s2: "",
    phase32_60percent_appliedCurrent_s1s3: "",
    phase32_60percent_measuredCurrent_s1s2: "",
    phase32_60percent_measuredCurrent_s1s3: "",
    phase32_80percent_appliedCurrent_s1s2: "",
    phase32_80percent_appliedCurrent_s1s3: "",
    phase32_80percent_measuredCurrent_s1s2: "",
    phase32_80percent_measuredCurrent_s1s3: "",
    phase32_100percent_appliedCurrent_s1s2: "",
    phase32_100percent_appliedCurrent_s1s3: "",
    phase32_100percent_measuredCurrent_s1s2: "",
    phase32_100percent_measuredCurrent_s1s3: "",

    // Phase 2.2 Knee point voltage measurements
    phase32_knee_20percent_appliedVoltage_s1s2: "",
    phase32_knee_20percent_appliedVoltage_s1s3: "",
    phase32_knee_20percent_measuredCurrent_s1s2: "",
    phase32_knee_20percent_measuredCurrent_s1s3: "",
    phase32_knee_40percent_appliedVoltage_s1s2: "",
    phase32_knee_40percent_appliedVoltage_s1s3: "",
    phase32_knee_40percent_measuredCurrent_s1s2: "",
    phase32_knee_40percent_measuredCurrent_s1s3: "",
    phase32_knee_60percent_appliedVoltage_s1s2: "",
    phase32_knee_60percent_appliedVoltage_s1s3: "",
    phase32_knee_60percent_measuredCurrent_s1s2: "",
    phase32_knee_60percent_measuredCurrent_s1s3: "",
    phase32_knee_80percent_appliedVoltage_s1s2: "",
    phase32_knee_80percent_appliedVoltage_s1s3: "",
    phase32_knee_80percent_measuredCurrent_s1s2: "",
    phase32_knee_80percent_measuredCurrent_s1s3: "",
    phase32_knee_100percent_appliedVoltage_s1s2: "",
    phase32_knee_100percent_appliedVoltage_s1s3: "",
    phase32_knee_100percent_measuredCurrent_s1s2: "",
    phase32_knee_100percent_measuredCurrent_s1s3: "",
    phase32_knee_110percent_appliedVoltage_s1s2: "",
    phase32_knee_110percent_appliedVoltage_s1s3: "",
    phase32_knee_110percent_measuredCurrent_s1s2: "",
    phase32_knee_110percent_measuredCurrent_s1s3: "",

    // WTI CT Ratio measurements (S1-S2, S1-S3, S1-S4)
    wti_20percent_appliedCurrent_s1s2: "",
    wti_20percent_appliedCurrent_s1s3: "",
    wti_20percent_appliedCurrent_s1s4: "",
    wti_20percent_measuredCurrent_s1s2: "",
    wti_20percent_measuredCurrent_s1s3: "",
    wti_20percent_measuredCurrent_s1s4: "",
    wti_40percent_appliedCurrent_s1s2: "",
    wti_40percent_appliedCurrent_s1s3: "",
    wti_40percent_appliedCurrent_s1s4: "",
    wti_40percent_measuredCurrent_s1s2: "",
    wti_40percent_measuredCurrent_s1s3: "",
    wti_40percent_measuredCurrent_s1s4: "",
    wti_60percent_appliedCurrent_s1s2: "",
    wti_60percent_appliedCurrent_s1s3: "",
    wti_60percent_appliedCurrent_s1s4: "",
    wti_60percent_measuredCurrent_s1s2: "",
    wti_60percent_measuredCurrent_s1s3: "",
    wti_60percent_measuredCurrent_s1s4: "",
    wti_80percent_appliedCurrent_s1s2: "",
    wti_80percent_appliedCurrent_s1s3: "",
    wti_80percent_appliedCurrent_s1s4: "",
    wti_80percent_measuredCurrent_s1s2: "",
    wti_80percent_measuredCurrent_s1s3: "",
    wti_80percent_measuredCurrent_s1s4: "",
    wti_100percent_appliedCurrent_s1s2: "",
    wti_100percent_appliedCurrent_s1s3: "",
    wti_100percent_appliedCurrent_s1s4: "",
    wti_100percent_measuredCurrent_s1s2: "",
    wti_100percent_measuredCurrent_s1s3: "",
    wti_100percent_measuredCurrent_s1s4: "",

    // WTI CT Ratio measurements (S1-S5, S1-S6, S1-S7)
    wti_20percent_appliedCurrent_s1s5: "",
    wti_20percent_appliedCurrent_s1s6: "",
    wti_20percent_appliedCurrent_s1s7: "",
    wti_20percent_measuredCurrent_s1s5: "",
    wti_20percent_measuredCurrent_s1s6: "",
    wti_20percent_measuredCurrent_s1s7: "",
    wti_40percent_appliedCurrent_s1s5: "",
    wti_40percent_appliedCurrent_s1s6: "",
    wti_40percent_appliedCurrent_s1s7: "",
    wti_40percent_measuredCurrent_s1s5: "",
    wti_40percent_measuredCurrent_s1s6: "",
    wti_40percent_measuredCurrent_s1s7: "",
    wti_60percent_appliedCurrent_s1s5: "",
    wti_60percent_appliedCurrent_s1s6: "",
    wti_60percent_appliedCurrent_s1s7: "",
    wti_60percent_measuredCurrent_s1s5: "",
    wti_60percent_measuredCurrent_s1s6: "",
    wti_60percent_measuredCurrent_s1s7: "",
    wti_80percent_appliedCurrent_s1s5: "",
    wti_80percent_appliedCurrent_s1s6: "",
    wti_80percent_appliedCurrent_s1s7: "",
    wti_80percent_measuredCurrent_s1s5: "",
    wti_80percent_measuredCurrent_s1s6: "",
    wti_80percent_measuredCurrent_s1s7: "",
    wti_100percent_appliedCurrent_s1s5: "",
    wti_100percent_appliedCurrent_s1s6: "",
    wti_100percent_appliedCurrent_s1s7: "",
    wti_100percent_measuredCurrent_s1s5: "",
    wti_100percent_measuredCurrent_s1s6: "",
    wti_100percent_measuredCurrent_s1s7: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage5Form1`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage5Form1")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "ctRatioKit", label: "CT Ratio kit calibration" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
                value={formData.phase31_20percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_20percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_20percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_20percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_20percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_20percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_20percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_20percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase31_40percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_40percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_40percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_40percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_40percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_40percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_40percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_40percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase31_60percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_60percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_60percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_60percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_60percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_60percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_60percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_60percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase31_80percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_80percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_80percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_80percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_80percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_80percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_80percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_80percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase31_100percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_100percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_100percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_100percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_100percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_100percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_100percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_100percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase31_knee_20percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_20percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_20percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_20percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_20percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_20percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_20percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_20percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_40percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_40percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_40percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_40percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_40percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_40percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_40percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_40percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_60percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_60percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_60percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_60percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_60percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_60percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_60percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_60percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_80percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_80percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_80percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_80percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_80percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_80percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_80percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_80percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_100percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_100percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_100percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_100percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_100percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_100percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_100percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_100percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>110%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_110percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_110percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_110percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_110percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_110percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase31_knee_110percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase31_knee_110percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase31_knee_110percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_20percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_20percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_20percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_20percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_20percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_20percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_20percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_20percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase32_40percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_40percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_40percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_40percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_40percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_40percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_40percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_40percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase32_60percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_60percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_60percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_60percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_60percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_60percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_60percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_60percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase32_80percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_80percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_80percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_80percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_80percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_80percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_80percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_80percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase32_100percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_100percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_100percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_100percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_100percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_100percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_100percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_100percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.phase32_knee_20percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_20percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_20percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_20percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_20percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_20percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_20percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_20percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_40percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_40percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_40percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_40percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_40percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_40percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_40percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_40percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_60percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_60percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_60percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_60percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_60percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_60percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_60percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_60percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_80percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_80percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_80percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_80percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_80percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_80percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_80percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_80percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_100percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_100percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_100percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_100percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_100percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_100percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_100percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_100percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>110%</strong></td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_110percent_appliedVoltage_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_110percent_appliedVoltage_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_110percent_appliedVoltage_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_110percent_appliedVoltage_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_110percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, phase32_knee_110percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.phase32_knee_110percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, phase32_knee_110percent_measuredCurrent_s1s3: e.target.value })}
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
                value={formData.wti_20percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, wti_20percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_20percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, wti_20percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_20percent_appliedCurrent_s1s4}
                onChange={(e) => setFormData({ ...formData, wti_20percent_appliedCurrent_s1s4: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_20percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, wti_20percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_20percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, wti_20percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_20percent_measuredCurrent_s1s4}
                onChange={(e) => setFormData({ ...formData, wti_20percent_measuredCurrent_s1s4: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, wti_40percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, wti_40percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_appliedCurrent_s1s4}
                onChange={(e) => setFormData({ ...formData, wti_40percent_appliedCurrent_s1s4: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, wti_40percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, wti_40percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_measuredCurrent_s1s4}
                onChange={(e) => setFormData({ ...formData, wti_40percent_measuredCurrent_s1s4: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, wti_60percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, wti_60percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_appliedCurrent_s1s4}
                onChange={(e) => setFormData({ ...formData, wti_60percent_appliedCurrent_s1s4: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, wti_60percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, wti_60percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_measuredCurrent_s1s4}
                onChange={(e) => setFormData({ ...formData, wti_60percent_measuredCurrent_s1s4: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, wti_80percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, wti_80percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_appliedCurrent_s1s4}
                onChange={(e) => setFormData({ ...formData, wti_80percent_appliedCurrent_s1s4: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, wti_80percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, wti_80percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_measuredCurrent_s1s4}
                onChange={(e) => setFormData({ ...formData, wti_80percent_measuredCurrent_s1s4: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_appliedCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, wti_100percent_appliedCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_appliedCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, wti_100percent_appliedCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_appliedCurrent_s1s4}
                onChange={(e) => setFormData({ ...formData, wti_100percent_appliedCurrent_s1s4: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_measuredCurrent_s1s2}
                onChange={(e) => setFormData({ ...formData, wti_100percent_measuredCurrent_s1s2: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_measuredCurrent_s1s3}
                onChange={(e) => setFormData({ ...formData, wti_100percent_measuredCurrent_s1s3: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_measuredCurrent_s1s4}
                onChange={(e) => setFormData({ ...formData, wti_100percent_measuredCurrent_s1s4: e.target.value })}
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
                value={formData.wti_20percent_appliedCurrent_s1s5}
                onChange={(e) => setFormData({ ...formData, wti_20percent_appliedCurrent_s1s5: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_20percent_appliedCurrent_s1s6}
                onChange={(e) => setFormData({ ...formData, wti_20percent_appliedCurrent_s1s6: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_20percent_appliedCurrent_s1s7}
                onChange={(e) => setFormData({ ...formData, wti_20percent_appliedCurrent_s1s7: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_20percent_measuredCurrent_s1s5}
                onChange={(e) => setFormData({ ...formData, wti_20percent_measuredCurrent_s1s5: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_20percent_measuredCurrent_s1s6}
                onChange={(e) => setFormData({ ...formData, wti_20percent_measuredCurrent_s1s6: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_20percent_measuredCurrent_s1s7}
                onChange={(e) => setFormData({ ...formData, wti_20percent_measuredCurrent_s1s7: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>40%</strong></td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_appliedCurrent_s1s5}
                onChange={(e) => setFormData({ ...formData, wti_40percent_appliedCurrent_s1s5: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_appliedCurrent_s1s6}
                onChange={(e) => setFormData({ ...formData, wti_40percent_appliedCurrent_s1s6: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_appliedCurrent_s1s7}
                onChange={(e) => setFormData({ ...formData, wti_40percent_appliedCurrent_s1s7: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_measuredCurrent_s1s5}
                onChange={(e) => setFormData({ ...formData, wti_40percent_measuredCurrent_s1s5: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_measuredCurrent_s1s6}
                onChange={(e) => setFormData({ ...formData, wti_40percent_measuredCurrent_s1s6: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_40percent_measuredCurrent_s1s7}
                onChange={(e) => setFormData({ ...formData, wti_40percent_measuredCurrent_s1s7: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>60%</strong></td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_appliedCurrent_s1s5}
                onChange={(e) => setFormData({ ...formData, wti_60percent_appliedCurrent_s1s5: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_appliedCurrent_s1s6}
                onChange={(e) => setFormData({ ...formData, wti_60percent_appliedCurrent_s1s6: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_appliedCurrent_s1s7}
                onChange={(e) => setFormData({ ...formData, wti_60percent_appliedCurrent_s1s7: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_measuredCurrent_s1s5}
                onChange={(e) => setFormData({ ...formData, wti_60percent_measuredCurrent_s1s5: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_measuredCurrent_s1s6}
                onChange={(e) => setFormData({ ...formData, wti_60percent_measuredCurrent_s1s6: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_60percent_measuredCurrent_s1s7}
                onChange={(e) => setFormData({ ...formData, wti_60percent_measuredCurrent_s1s7: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>80%</strong></td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_appliedCurrent_s1s5}
                onChange={(e) => setFormData({ ...formData, wti_80percent_appliedCurrent_s1s5: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_appliedCurrent_s1s6}
                onChange={(e) => setFormData({ ...formData, wti_80percent_appliedCurrent_s1s6: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_appliedCurrent_s1s7}
                onChange={(e) => setFormData({ ...formData, wti_80percent_appliedCurrent_s1s7: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_measuredCurrent_s1s5}
                onChange={(e) => setFormData({ ...formData, wti_80percent_measuredCurrent_s1s5: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_measuredCurrent_s1s6}
                onChange={(e) => setFormData({ ...formData, wti_80percent_measuredCurrent_s1s6: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_80percent_measuredCurrent_s1s7}
                onChange={(e) => setFormData({ ...formData, wti_80percent_measuredCurrent_s1s7: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>100%</strong></td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_appliedCurrent_s1s5}
                onChange={(e) => setFormData({ ...formData, wti_100percent_appliedCurrent_s1s5: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_appliedCurrent_s1s6}
                onChange={(e) => setFormData({ ...formData, wti_100percent_appliedCurrent_s1s6: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_appliedCurrent_s1s7}
                onChange={(e) => setFormData({ ...formData, wti_100percent_appliedCurrent_s1s7: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_measuredCurrent_s1s5}
                onChange={(e) => setFormData({ ...formData, wti_100percent_measuredCurrent_s1s5: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_measuredCurrent_s1s6}
                onChange={(e) => setFormData({ ...formData, wti_100percent_measuredCurrent_s1s6: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.wti_100percent_measuredCurrent_s1s7}
                onChange={(e) => setFormData({ ...formData, wti_100percent_measuredCurrent_s1s7: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="CT Ratio kit calibration"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function Stage1Form6({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    // Basic test information
    meterUsed: "",
    date: "",
    time: "",
    modelSrNo: "",
    wti: "",
    oti: "",

    // HV Bushing Serial Numbers
    hvBushing11_srNo: "",
    hvBushing12_srNo: "",

    // HV Bushing 1.1 - 05 KV Phase measurements
    hvBushing11_05kv_tanDelta: "",
    hvBushing11_05kv_capacitance: "",
    hvBushing11_05kv_excitationCurrent: "",
    hvBushing11_05kv_dielectricLoss: "",

    // HV Bushing 1.2 - 05 KV Phase measurements
    hvBushing12_05kv_tanDelta: "",
    hvBushing12_05kv_capacitance: "",
    hvBushing12_05kv_excitationCurrent: "",
    hvBushing12_05kv_dielectricLoss: "",

    // HV Bushing 1.1 - 10 KV Phase measurements
    hvBushing11_10kv_tanDelta: "",
    hvBushing11_10kv_capacitance: "",
    hvBushing11_10kv_excitationCurrent: "",
    hvBushing11_10kv_dielectricLoss: "",

    // HV Bushing 1.2 - 10 KV Phase measurements
    hvBushing12_10kv_tanDelta: "",
    hvBushing12_10kv_capacitance: "",
    hvBushing12_10kv_excitationCurrent: "",
    hvBushing12_10kv_dielectricLoss: "",

    // LV Bushing Serial Numbers
    lvBushing21_srNo: "",
    lvBushing22_srNo: "",

    // LV Bushing 2.1 - 05 KV Phase measurements
    lvBushing21_05kv_tanDelta: "",
    lvBushing21_05kv_capacitance: "",
    lvBushing21_05kv_excitationCurrent: "",
    lvBushing21_05kv_dielectricLoss: "",

    // LV Bushing 2.2 - 05 KV Phase measurements
    lvBushing22_05kv_tanDelta: "",
    lvBushing22_05kv_capacitance: "",
    lvBushing22_05kv_excitationCurrent: "",
    lvBushing22_05kv_dielectricLoss: "",

    // LV Bushing 2.1 - 10 KV Phase measurements
    lvBushing21_10kv_tanDelta: "",
    lvBushing21_10kv_capacitance: "",
    lvBushing21_10kv_excitationCurrent: "",
    lvBushing21_10kv_dielectricLoss: "",

    // LV Bushing 2.2 - 10 KV Phase measurements
    lvBushing22_10kv_tanDelta: "",
    lvBushing22_10kv_capacitance: "",
    lvBushing22_10kv_excitationCurrent: "",
    lvBushing22_10kv_dielectricLoss: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage1Form6`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage1Form6")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "tanDeltaKit", label: "Tan Delta Kit" },
    { key: "calibrationReport", label: "Calibration Report" },
    { key: "duringTanDelta", label: "During Tan Delta of bushing photo" }
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
                value={formData.meterUsed}
                onChange={(e) => setFormData({ ...formData, meterUsed: e.target.value })}
              />
            </td>
            <td><strong>DATE</strong></td>
            <td>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td><strong>TIME</strong></td>
            <td>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>MODEL & S. NO.</strong></td>
            <td>
              <input
                type="text"
                value={formData.modelSrNo}
                onChange={(e) => setFormData({ ...formData, modelSrNo: e.target.value })}
              />
            </td>
            <td><strong>WTI</strong></td>
            <td>
              <input
                type="text"
                value={formData.wti}
                onChange={(e) => setFormData({ ...formData, wti: e.target.value })}
              />
            </td>
            <td><strong>OTI</strong></td>
            <td>
              <input
                type="text"
                value={formData.oti}
                onChange={(e) => setFormData({ ...formData, oti: e.target.value })}
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
                value={formData.hvBushing11_srNo}
                onChange={(e) => setFormData({ ...formData, hvBushing11_srNo: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing12_srNo}
                onChange={(e) => setFormData({ ...formData, hvBushing12_srNo: e.target.value })}
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
                value={formData.hvBushing11_05kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, hvBushing11_05kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing11_05kv_capacitance}
                onChange={(e) => setFormData({ ...formData, hvBushing11_05kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing11_05kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, hvBushing11_05kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing11_05kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, hvBushing11_05kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>1.2</strong></td>
            <td>
              <input
                type="text"
                value={formData.hvBushing12_05kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, hvBushing12_05kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing12_05kv_capacitance}
                onChange={(e) => setFormData({ ...formData, hvBushing12_05kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing12_05kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, hvBushing12_05kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing12_05kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, hvBushing12_05kv_dielectricLoss: e.target.value })}
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
                value={formData.hvBushing11_10kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, hvBushing11_10kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing11_10kv_capacitance}
                onChange={(e) => setFormData({ ...formData, hvBushing11_10kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing11_10kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, hvBushing11_10kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, hvBushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>1.2</strong></td>
            <td>
              <input
                type="text"
                value={formData.hvBushing12_10kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, hvBushing12_10kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing12_10kv_capacitance}
                onChange={(e) => setFormData({ ...formData, hvBushing12_10kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing12_10kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, hvBushing12_10kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvBushing12_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, hvBushing12_10kv_dielectricLoss: e.target.value })}
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
                value={formData.lvBushing21_srNo}
                onChange={(e) => setFormData({ ...formData, lvBushing21_srNo: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing22_srNo}
                onChange={(e) => setFormData({ ...formData, lvBushing22_srNo: e.target.value })}
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
                value={formData.lvBushing21_05kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, lvBushing21_05kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing21_05kv_capacitance}
                onChange={(e) => setFormData({ ...formData, lvBushing21_05kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing21_05kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, lvBushing21_05kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing21_05kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, lvBushing21_05kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>2.2</strong></td>
            <td>
              <input
                type="text"
                value={formData.lvBushing22_05kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, lvBushing22_05kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing22_05kv_capacitance}
                onChange={(e) => setFormData({ ...formData, lvBushing22_05kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing22_05kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, lvBushing22_05kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing22_05kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, lvBushing22_05kv_dielectricLoss: e.target.value })}
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
                value={formData.lvBushing21_10kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, lvBushing21_10kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing21_10kv_capacitance}
                onChange={(e) => setFormData({ ...formData, lvBushing21_10kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing21_10kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, lvBushing21_10kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing21_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, lvBushing21_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>2.2</strong></td>
            <td>
              <input
                type="text"
                value={formData.lvBushing22_10kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, lvBushing22_10kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing22_10kv_capacitance}
                onChange={(e) => setFormData({ ...formData, lvBushing22_10kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing22_10kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, lvBushing22_10kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvBushing22_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, lvBushing22_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="Tan Delta Kit"
        photos={[photoRequirements[0]]}
        onPhotoChange={handlePhotoChange}
      />
      <PhotoUploadSection
        title="Calibration Report"
        photos={[photoRequirements[1]]}
        onPhotoChange={handlePhotoChange}
      />
      <PhotoUploadSection
        title="During Tan Delta of bushing photo"
        photos={[photoRequirements[2]]}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

function Stage1Form7({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    // Basic test information
    date: "",
    time: "",
    ambTemp: "",
    make: "",
    oilTemp: "",
    srNo: "",
    wdgTemp: "",
    range: "",
    relativeHumidity: "",
    voltageLevel: "",

    // IR measurements
    hvEarth_10sec: "",
    hvEarth_60sec: "",
    hvEarth_ratio: "",
    lvEarth_10sec: "",
    lvEarth_60sec: "",
    lvEarth_ratio: "",
    hvLv_10sec: "",
    hvLv_60sec: "",
    hvLv_ratio: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage1Form7`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage1Form7")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "irTester", label: "IR tester" },
    { key: "calibrationReport", label: "Calibration Report" },
    { key: "irValue60sec", label: "60 sec IR value" }
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>RECORD OF MEASUREMENT OF IR VALUES</h2>
      </div>
      <h3>Before Erection</h3>
      <table className="form-table">
        <tbody>
          <tr>
            <td><strong>Date</strong></td>
            <td>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td><strong>Time</strong></td>
            <td>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Amb Temp:</strong></td>
            <td>
              <input
                type="text"
                value={formData.ambTemp}
                onChange={(e) => setFormData({ ...formData, ambTemp: e.target.value })}
              />
            </td>
            <td><strong>Make:</strong></td>
            <td>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Oil Temp:</strong></td>
            <td>
              <input
                type="text"
                value={formData.oilTemp}
                onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
              />
            </td>
            <td><strong>Sr No:</strong></td>
            <td>
              <input
                type="text"
                value={formData.srNo}
                onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Wdg. Temp:</strong></td>
            <td>
              <input
                type="text"
                value={formData.wdgTemp}
                onChange={(e) => setFormData({ ...formData, wdgTemp: e.target.value })}
              />
            </td>
            <td><strong>Range:</strong></td>
            <td>
              <input
                type="text"
                value={formData.range}
                onChange={(e) => setFormData({ ...formData, range: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Relative Humidity</strong></td>
            <td>
              <input
                type="text"
                value={formData.relativeHumidity}
                onChange={(e) => setFormData({ ...formData, relativeHumidity: e.target.value })}
              />
            </td>
            <td><strong>Voltage Level:</strong></td>
            <td>
              <input
                type="text"
                value={formData.voltageLevel}
                onChange={(e) => setFormData({ ...formData, voltageLevel: e.target.value })}
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
              <input
                type="text"
                value={formData.hvEarth_10sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_60sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_ratio}
                onChange={(e) => setFormData({ ...formData, hvEarth_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>LV-Earth</strong></td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_10sec}
                onChange={(e) => setFormData({ ...formData, lvEarth_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_60sec}
                onChange={(e) => setFormData({ ...formData, lvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_ratio}
                onChange={(e) => setFormData({ ...formData, lvEarth_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>HV-LV</strong></td>
            <td>
              <input
                type="text"
                value={formData.hvLv_10sec}
                onChange={(e) => setFormData({ ...formData, hvLv_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv_60sec}
                onChange={(e) => setFormData({ ...formData, hvLv_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv_ratio}
                onChange={(e) => setFormData({ ...formData, hvLv_ratio: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="IR tester"
        photos={[photoRequirements[0]]}
        onPhotoChange={handlePhotoChange}
      />
      <PhotoUploadSection
        title="Calibration Report"
        photos={[photoRequirements[1]]}
        onPhotoChange={handlePhotoChange}
      />
      <PhotoUploadSection
        title="60 sec IR value"
        photos={[photoRequirements[2]]}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}


// Stage 2 Forms
export function Stage2Form1({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Tank 1 data
    tank1_noOfBarrels: "",
    tank1_startedDate: "",
    tank1_startedTime: "",
    tank1_completedDate: "",
    tank1_completedTime: "",
    tank1_bdv: "",
    tank1_ppm: "",

    // Tank 2 data
    tank2_noOfBarrels: "",
    tank2_startedDate: "",
    tank2_startedTime: "",
    tank2_completedDate: "",
    tank2_completedTime: "",
    tank2_bdv: "",
    tank2_ppm: "",

    // Tank 3 data
    tank3_noOfBarrels: "",
    tank3_startedDate: "",
    tank3_startedTime: "",
    tank3_completedDate: "",
    tank3_completedTime: "",
    tank3_bdv: "",
    tank3_ppm: "",

    // Reservoir Tank Filtration
    filtrationRecords: Array(15)
      .fill()
      .map(() => ({
        date: "",
        time: "",
        vacuumLevel: "",
        inletTemp: "",
        outletTemp: "",
      })),

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage2Form1`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage2Form1")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleFiltrationRecordChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      filtrationRecords: prev.filtrationRecords.map((record, i) =>
        i === index ? { ...record, [field]: value } : record,
      ),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "reservoirCondition", label: "Internal condition of reservoir tank" },
    { key: "calibrationReport", label: "Calibration report of BDV & PPM kit" },
    { key: "oilBarrelsChecking", label: "Oil barrels checking by water pest" },
    { key: "ppmPhoto", label: "PPM Photo" },
    { key: "bdvReading", label: "Reading of BDV value" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
          <tr>
            <td><strong>Tank1</strong></td>
            <td>
              <input
                type="text"
                value={formData.tank1_noOfBarrels}
                onChange={(e) => setFormData({ ...formData, tank1_noOfBarrels: e.target.value })}
              />
            </td>
            <td>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="date"
                  value={formData.tank1_startedDate}
                  onChange={(e) => setFormData({ ...formData, tank1_startedDate: e.target.value })}
                  style={{ width: "50%" }}
                />
                <input
                  type="time"
                  value={formData.tank1_startedTime}
                  onChange={(e) => setFormData({ ...formData, tank1_startedTime: e.target.value })}
                  style={{ width: "50%" }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="date"
                  value={formData.tank1_completedDate}
                  onChange={(e) => setFormData({ ...formData, tank1_completedDate: e.target.value })}
                  style={{ width: "50%" }}
                />
                <input
                  type="time"
                  value={formData.tank1_completedTime}
                  onChange={(e) => setFormData({ ...formData, tank1_completedTime: e.target.value })}
                  style={{ width: "50%" }}
                />
              </div>
            </td>
            <td>
              <input
                type="text"
                value={formData.tank1_bdv}
                onChange={(e) => setFormData({ ...formData, tank1_bdv: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.tank1_ppm}
                onChange={(e) => setFormData({ ...formData, tank1_ppm: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Tank2</strong></td>
            <td>
              <input
                type="text"
                value={formData.tank2_noOfBarrels}
                onChange={(e) => setFormData({ ...formData, tank2_noOfBarrels: e.target.value })}
              />
            </td>
            <td>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="date"
                  value={formData.tank2_startedDate}
                  onChange={(e) => setFormData({ ...formData, tank2_startedDate: e.target.value })}
                  style={{ width: "50%" }}
                />
                <input
                  type="time"
                  value={formData.tank2_startedTime}
                  onChange={(e) => setFormData({ ...formData, tank2_startedTime: e.target.value })}
                  style={{ width: "50%" }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="date"
                  value={formData.tank2_completedDate}
                  onChange={(e) => setFormData({ ...formData, tank2_completedDate: e.target.value })}
                  style={{ width: "50%" }}
                />
                <input
                  type="time"
                  value={formData.tank2_completedTime}
                  onChange={(e) => setFormData({ ...formData, tank2_completedTime: e.target.value })}
                  style={{ width: "50%" }}
                />
              </div>
            </td>
            <td>
              <input
                type="text"
                value={formData.tank2_bdv}
                onChange={(e) => setFormData({ ...formData, tank2_bdv: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.tank2_ppm}
                onChange={(e) => setFormData({ ...formData, tank2_ppm: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Tank3</strong></td>
            <td>
              <input
                type="text"
                value={formData.tank3_noOfBarrels}
                onChange={(e) => setFormData({ ...formData, tank3_noOfBarrels: e.target.value })}
              />
            </td>
            <td>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="date"
                  value={formData.tank3_startedDate}
                  onChange={(e) => setFormData({ ...formData, tank3_startedDate: e.target.value })}
                  style={{ width: "50%" }}
                />
                <input
                  type="time"
                  value={formData.tank3_startedTime}
                  onChange={(e) => setFormData({ ...formData, tank3_startedTime: e.target.value })}
                  style={{ width: "50%" }}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="date"
                  value={formData.tank3_completedDate}
                  onChange={(e) => setFormData({ ...formData, tank3_completedDate: e.target.value })}
                  style={{ width: "50%" }}
                />
                <input
                  type="time"
                  value={formData.tank3_completedTime}
                  onChange={(e) => setFormData({ ...formData, tank3_completedTime: e.target.value })}
                  style={{ width: "50%" }}
                />
              </div>
            </td>
            <td>
              <input
                type="text"
                value={formData.tank3_bdv}
                onChange={(e) => setFormData({ ...formData, tank3_bdv: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.tank3_ppm}
                onChange={(e) => setFormData({ ...formData, tank3_ppm: e.target.value })}
              />
            </td>
          </tr>
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
          {formData.filtrationRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={record.date}
                  onChange={(e) => handleFiltrationRecordChange(index, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={record.time}
                  onChange={(e) => handleFiltrationRecordChange(index, "time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevel}
                  onChange={(e) => handleFiltrationRecordChange(index, "vacuumLevel", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.inletTemp}
                  onChange={(e) => handleFiltrationRecordChange(index, "inletTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.outletTemp}
                  onChange={(e) => handleFiltrationRecordChange(index, "outletTemp", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Internal condition of reservoir tank, Calibration report of BDV & PPM kit, Oil barrels checking by water pest, PPM Photo, Reading of BDV value."
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

export function Stage2Form2({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Line Lead Clearance in mm
    hv_earth_11: "",
    hv_earth_12: "",
    lv1_earth_21: "",
    lv1_earth_22: "",
    lv2_earth_31: "",
    lv2_earth_32: "",

    // Temperature readings
    tempOTI: "",
    tempWTI: "",
    tempAMB: "",

    // IR measurements (15sec and 60sec)
    hvEarth_15sec: "",
    hvEarth_60sec: "",
    hvEarth_ratio: "",
    lv1Earth_15sec: "",
    lv1Earth_60sec: "",
    lv1Earth_ratio: "",
    lv2Earth_15sec: "",
    lv2Earth_60sec: "",
    lv2Earth_ratio: "",
    hvLv1_15sec: "",
    hvLv1_60sec: "",
    hvLv1_ratio: "",
    hvLv2_15sec: "",
    hvLv2_60sec: "",
    hvLv2_ratio: "",
    lv1Lv2_15sec: "",
    lv1Lv2_60sec: "",
    lv1Lv2_ratio: "",

    // Before oil filling in main tank
    bdv: "",
    waterContent: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage2Form2`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage2Form2")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "dewPoint", label: "Dew Point" },
    { key: "dryAirAttached", label: "dry air attached photo on transformer" },
    { key: "leadClearances", label: "Lead clearances" },
    { key: "anabond", label: "anabond on both bushing's thimble" },
    { key: "radiators", label: "radiators" },
    { key: "flashing", label: "flashing" },
    { key: "conservator", label: "conservator internal inspection" },
    { key: "fullTransformer", label: "full transformer photo" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
            <td><strong>HV with respect to earth</strong></td>
            <td>
              <input
                type="text"
                value={formData.hv_earth_11}
                onChange={(e) => setFormData({ ...formData, hv_earth_11: e.target.value })}
              />
            </td>
            <td></td>
            <td>
              <input
                type="text"
                value={formData.hv_earth_12}
                onChange={(e) => setFormData({ ...formData, hv_earth_12: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>LV 1 with respect to earth</strong></td>
            <td>
              <input
                type="text"
                value={formData.lv1_earth_21}
                onChange={(e) => setFormData({ ...formData, lv1_earth_21: e.target.value })}
              />
            </td>
            <td></td>
            <td>
              <input
                type="text"
                value={formData.lv1_earth_22}
                onChange={(e) => setFormData({ ...formData, lv1_earth_22: e.target.value })}
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
            <td><strong>Temp OTI °C</strong></td>
            <td>
              <input
                type="text"
                value={formData.tempOTI}
                onChange={(e) => setFormData({ ...formData, tempOTI: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Temp WTI °C</strong></td>
            <td>
              <input
                type="text"
                value={formData.tempWTI}
                onChange={(e) => setFormData({ ...formData, tempWTI: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Temp AMB °C</strong></td>
            <td>
              <input
                type="text"
                value={formData.tempAMB}
                onChange={(e) => setFormData({ ...formData, tempAMB: e.target.value })}
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
            <td><strong>HV-Earth</strong></td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_10sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_60sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_ratio}
                onChange={(e) => setFormData({ ...formData, hvEarth_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>LV-Earth</strong></td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_10sec}
                onChange={(e) => setFormData({ ...formData, lvEarth_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_60sec}
                onChange={(e) => setFormData({ ...formData, lvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_ratio}
                onChange={(e) => setFormData({ ...formData, lvEarth_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>HV-LV</strong></td>
            <td>
              <input
                type="text"
                value={formData.hvLv_10sec}
                onChange={(e) => setFormData({ ...formData, hvLv_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv_60sec}
                onChange={(e) => setFormData({ ...formData, hvLv_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv_ratio}
                onChange={(e) => setFormData({ ...formData, hvLv_ratio: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px" }}>Before oil filling in main tank</h4>
      <table className="form-table">
        <tbody>
          <tr>
            <td><strong>BDV (KV)</strong></td>
            <td>
              <input
                type="text"
                value={formData.bdv}
                onChange={(e) => setFormData({ ...formData, bdv: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Water Content (PPM)</strong></td>
            <td>
              <input
                type="text"
                value={formData.waterContent}
                onChange={(e) => setFormData({ ...formData, waterContent: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="Dew Point, dry air attached photo on transformer, Lead clearances, anabond on both bushing's thimble, radiators, flashing, conservator internal inspection, full transformer photo."
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 2
        </button>
      </div>
    </form>
  )
}

// Stage 3 Forms
export function Stage3Form1({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Vacuum cycle details
    vacuumHoseCheckedBy: "",
    vacuumHoseConnectedTo: "",
    evacuationStartedAt: "",
    evacuationStartedOn: "",

    // Vacuum cycle records
    vacuumRecords: Array(15)
      .fill()
      .map(() => ({
        date: "",
        time: "",
        vacuumLevelMic: "",
        vacuumLevelTransformer: "",
      })),

    // Temperature readings for IR test
    tempOTI: "",
    tempWTI: "",
    tempAMB: "",

    // IR measurements (15sec and 60sec)
    hvEarth_15sec: "",
    hvEarth_60sec: "",
    hvEarth_ratio: "",
    lv1Earth_15sec: "",
    lv1Earth_60sec: "",
    lv1Earth_ratio: "",
    lv2Earth_15sec: "",
    lv2Earth_60sec: "",
    lv2Earth_ratio: "",
    hvLv1_15sec: "",
    hvLv1_60sec: "",
    hvLv1_ratio: "",
    hvLv2_15sec: "",
    hvLv2_60sec: "",
    hvLv2_ratio: "",
    lv1Lv2_15sec: "",
    lv1Lv2_60sec: "",
    lv1Lv2_ratio: "",

    // Pressure Test Report
    pressureTestDate: "",
    pressureTests: Array(5)
      .fill()
      .map(() => ({
        timeStarted: "",
        pressure: "",
        tempAmb: "",
        tempOti: "",
        tempWti: "",
      })),

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage3Form1`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage3Form1")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleVacuumRecordChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      vacuumRecords: prev.vacuumRecords.map((record, i) => (i === index ? { ...record, [field]: value } : record)),
    }))
  }

  const handlePressureTestChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      pressureTests: prev.pressureTests.map((test, i) => (i === index ? { ...test, [field]: value } : test)),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "mecLeadGauge", label: "Mec Lead Gauge photo" },
    { key: "vacuumGauge", label: "vacuum gauge photo" },
    { key: "pressureGauge", label: "pressure gauge" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
                value={formData.vacuumHoseCheckedBy}
                onChange={(e) => setFormData({ ...formData, vacuumHoseCheckedBy: e.target.value })}
                style={{ width: "100%" }}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Vacuum hose Connected To</strong></td>
            <td>
              <input
                type="text"
                value={formData.vacuumHoseConnectedTo}
                onChange={(e) => setFormData({ ...formData, vacuumHoseConnectedTo: e.target.value })}
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
                value={formData.evacuationStartedAt}
                onChange={(e) => setFormData({ ...formData, evacuationStartedAt: e.target.value })}
                style={{ marginRight: "10px" }}
              />
              <span>Hrs. On</span>
              <input
                type="date"
                value={formData.evacuationStartedOn}
                onChange={(e) => setFormData({ ...formData, evacuationStartedOn: e.target.value })}
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
          {formData.vacuumRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={record.date}
                  onChange={(e) => handleVacuumRecordChange(index, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={record.time}
                  onChange={(e) => handleVacuumRecordChange(index, "time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevelMic}
                  onChange={(e) => handleVacuumRecordChange(index, "vacuumLevelMic", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevelTransformer}
                  onChange={(e) => handleVacuumRecordChange(index, "vacuumLevelTransformer", e.target.value)}
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
              <input
                type="text"
                value={formData.tempOTI}
                onChange={(e) => setFormData({ ...formData, tempOTI: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Temp WTI °C</strong></td>
            <td>
              <input
                type="text"
                value={formData.tempWTI}
                onChange={(e) => setFormData({ ...formData, tempWTI: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>Temp AMB °C</strong></td>
            <td>
              <input
                type="text"
                value={formData.tempAMB}
                onChange={(e) => setFormData({ ...formData, tempAMB: e.target.value })}
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
            <td><strong>HV-Earth</strong></td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_10sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_60sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_ratio}
                onChange={(e) => setFormData({ ...formData, hvEarth_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>LV-Earth</strong></td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_10sec}
                onChange={(e) => setFormData({ ...formData, lvEarth_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_60sec}
                onChange={(e) => setFormData({ ...formData, lvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_ratio}
                onChange={(e) => setFormData({ ...formData, lvEarth_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td><strong>HV-LV</strong></td>
            <td>
              <input
                type="text"
                value={formData.hvLv_10sec}
                onChange={(e) => setFormData({ ...formData, hvLv_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv_60sec}
                onChange={(e) => setFormData({ ...formData, hvLv_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv_ratio}
                onChange={(e) => setFormData({ ...formData, hvLv_ratio: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px", textAlign: "center" }}>PRESSURE TEST REPORT</h4>
      <div style={{ marginBottom: "10px" }}>
        <strong>DATE: </strong>
        <input
          type="date"
          value={formData.pressureTestDate}
          onChange={(e) => setFormData({ ...formData, pressureTestDate: e.target.value })}
        />
      </div>
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
          {formData.pressureTests.map((test, index) => (
            <tr key={index}>
              <td><strong>{index + 1}</strong></td>
              <td>
                <input
                  type="time"
                  value={test.timeStarted}
                  onChange={(e) => handlePressureTestChange(index, "timeStarted", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={test.pressure}
                  onChange={(e) => handlePressureTestChange(index, "pressure", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={test.tempAmb}
                  onChange={(e) => handlePressureTestChange(index, "tempAmb", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={test.tempOti}
                  onChange={(e) => handlePressureTestChange(index, "tempOti", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={test.tempWti}
                  onChange={(e) => handlePressureTestChange(index, "tempWti", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Mec Lead Gauge photo, vacuum gauge photo, pressure gauge"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Stage 4 Forms
export function Stage4Form1({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Oil filtration records
    filtrationRecords: Array(30)
      .fill()
      .map(() => ({
        date: "",
        time: "",
        vacuumLevel: "",
        mcOutletTemp: "",
        otiTemp: "",
        wtiTemp: "",
      })),

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage4Form1`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage4Form1")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleFiltrationRecordChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      filtrationRecords: prev.filtrationRecords.map((record, i) =>
        i === index ? { ...record, [field]: value } : record,
      ),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "oilFiltrationProcess", label: "Oil Filtration Process" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
          {formData.filtrationRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={record.date}
                  onChange={(e) => handleFiltrationRecordChange(index, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={record.time}
                  onChange={(e) => handleFiltrationRecordChange(index, "time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevel}
                  onChange={(e) => handleFiltrationRecordChange(index, "vacuumLevel", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.mcOutletTemp}
                  onChange={(e) => handleFiltrationRecordChange(index, "mcOutletTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.otiTemp}
                  onChange={(e) => handleFiltrationRecordChange(index, "otiTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.wtiTemp}
                  onChange={(e) => handleFiltrationRecordChange(index, "wtiTemp", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection title="Oil Filtration Process" photos={photoRequirements} onPhotoChange={handlePhotoChange} />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

export function Stage4Form2({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // IR Value before radiator/combine filtration
    date: "",
    time: "",
    insulationTesterDetails: "",
    ambTemp: "",
    make: "",
    oilTemp: "",
    srNo: "",
    wdgTemp: "",
    range: "",
    relativeHumidity: "",
    voltageLevel: "",

    // Temperature readings
    tempOTI: "",
    tempWTI: "",
    tempAMB: "",

    // IR measurements (15sec and 60sec)
    hvEarth_15sec: "",
    hvEarth_60sec: "",
    hvEarth_ratio: "",
    lv1Earth_15sec: "",
    lv1Earth_60sec: "",
    lv1Earth_ratio: "",
    lv2Earth_15sec: "",
    lv2Earth_60sec: "",
    lv2Earth_ratio: "",
    hvLv1_15sec: "",
    hvLv1_60sec: "",
    hvLv1_ratio: "",
    hvLv2_15sec: "",
    hvLv2_60sec: "",
    hvLv2_ratio: "",
    lv1Lv2_15sec: "",
    lv1Lv2_60sec: "",
    lv1Lv2_ratio: "",

    // Oil filtration of Cooler Bank
    coolerBankRecords: Array(15)
      .fill()
      .map(() => ({
        date: "",
        time: "",
        vacuumLevel: "",
        mcOutletTemp: "",
        otiTemp: "",
        wtiTemp: "",
      })),

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage4Form2`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage4Form2")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleCoolerBankRecordChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      coolerBankRecords: prev.coolerBankRecords.map((record, i) =>
        i === index ? { ...record, [field]: value } : record,
      ),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "coolerBankFiltration", label: "Cooler Bank Filtration Process" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
                value={formData.tempOTI}
                onChange={(e) => setFormData({ ...formData, tempOTI: e.target.value })}
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
                value={formData.tempWTI}
                onChange={(e) => setFormData({ ...formData, tempWTI: e.target.value })}
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
                value={formData.tempAMB}
                onChange={(e) => setFormData({ ...formData, tempAMB: e.target.value })}
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
                value={formData.hvEarth_15sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_60sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_ratio}
                onChange={(e) => setFormData({ ...formData, hvEarth_ratio: e.target.value })}
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
                value={formData.lv1Earth_15sec}
                onChange={(e) => setFormData({ ...formData, lv1Earth_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Earth_60sec}
                onChange={(e) => setFormData({ ...formData, lv1Earth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Earth_ratio}
                onChange={(e) => setFormData({ ...formData, lv1Earth_ratio: e.target.value })}
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
                value={formData.hvLv1_15sec}
                onChange={(e) => setFormData({ ...formData, hvLv1_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv1_60sec}
                onChange={(e) => setFormData({ ...formData, hvLv1_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv1_ratio}
                onChange={(e) => setFormData({ ...formData, hvLv1_ratio: e.target.value })}
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
          {formData.coolerBankRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={record.date}
                  onChange={(e) => handleCoolerBankRecordChange(index, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={record.time}
                  onChange={(e) => handleCoolerBankRecordChange(index, "time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevel}
                  onChange={(e) => handleCoolerBankRecordChange(index, "vacuumLevel", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.mcOutletTemp}
                  onChange={(e) => handleCoolerBankRecordChange(index, "mcOutletTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.otiTemp}
                  onChange={(e) => handleCoolerBankRecordChange(index, "otiTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.wtiTemp}
                  onChange={(e) => handleCoolerBankRecordChange(index, "wtiTemp", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Cooler Bank Filtration Process"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

export function Stage4Form3({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Oil filtration of Combine (Main Tank + Cooler bank)
    combineRecords: Array(15)
      .fill()
      .map(() => ({
        date: "",
        time: "",
        vacuumLevel: "",
        mcOutletTemp: "",
        otiTemp: "",
        wtiTemp: "",
      })),

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage4Form3`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage4Form3")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleCombineRecordChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      combineRecords: prev.combineRecords.map((record, i) => (i === index ? { ...record, [field]: value } : record)),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "combineFiltration", label: "Combine Filtration Process" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
          {formData.combineRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={record.date}
                  onChange={(e) => handleCombineRecordChange(index, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={record.time}
                  onChange={(e) => handleCombineRecordChange(index, "time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevel}
                  onChange={(e) => handleCombineRecordChange(index, "vacuumLevel", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.mcOutletTemp}
                  onChange={(e) => handleCombineRecordChange(index, "mcOutletTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.otiTemp}
                  onChange={(e) => handleCombineRecordChange(index, "otiTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.wtiTemp}
                  onChange={(e) => handleCombineRecordChange(index, "wtiTemp", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Combine Filtration Process"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

export function Stage4Form4({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // IR & PI Value after filtration
    date: "",
    time: "",
    insulationTesterDetails: "",
    ambTemp: "",
    make: "",
    oilTemp: "",
    srNo: "",
    wdgTemp: "",
    range: "",
    relativeHumidity: "",
    voltageLevel: "",

    // Temperature readings
    tempOTI: "",
    tempWTI: "",
    tempAMB: "",

    // IR measurements (10sec, 60sec, 600sec, and PI)
    hvEarth_10sec: "",
    hvEarth_60sec: "",
    hvEarth_600sec: "",
    hvEarth_pi: "",
    lv1Earth_10sec: "",
    lv1Earth_60sec: "",
    lv1Earth_600sec: "",
    lv1Earth_pi: "",
    lv2Earth_10sec: "",
    lv2Earth_60sec: "",
    lv2Earth_600sec: "",
    lv2Earth_pi: "",
    hvLv1_10sec: "",
    hvLv1_60sec: "",
    hvLv1_600sec: "",
    hvLv1_pi: "",
    hvLv2_10sec: "",
    hvLv2_60sec: "",
    hvLv2_600sec: "",
    hvLv2_pi: "",
    lv1Lv2_10sec: "",
    lv1Lv2_60sec: "",
    lv1Lv2_600sec: "",
    lv1Lv2_pi: "",

    // After Oil Filtration of main tank
    bdv: "",
    waterContent: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage4Form4`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage4Form4")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "ppmPhoto", label: "PPM Photo" },
    { key: "bdvReading", label: "Reading of BDV values" },
    { key: "airCell", label: "Air cell" },
    { key: "mog", label: "MOG" },
    { key: "pog", label: "POG" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
              <input
                type="text"
                value={formData.tempOTI}
                onChange={(e) => setFormData({ ...formData, tempOTI: e.target.value })}
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
                value={formData.tempWTI}
                onChange={(e) => setFormData({ ...formData, tempWTI: e.target.value })}
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
                value={formData.tempAMB}
                onChange={(e) => setFormData({ ...formData, tempAMB: e.target.value })}
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
              <input
                type="text"
                value={formData.hvEarth_10sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_60sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_600sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_600sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_pi}
                onChange={(e) => setFormData({ ...formData, hvEarth_pi: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV1-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Earth_10sec}
                onChange={(e) => setFormData({ ...formData, lv1Earth_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Earth_60sec}
                onChange={(e) => setFormData({ ...formData, lv1Earth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Earth_600sec}
                onChange={(e) => setFormData({ ...formData, lv1Earth_600sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Earth_pi}
                onChange={(e) => setFormData({ ...formData, lv1Earth_pi: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>HV-LV1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv1_10sec}
                onChange={(e) => setFormData({ ...formData, hvLv1_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv1_60sec}
                onChange={(e) => setFormData({ ...formData, hvLv1_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv1_600sec}
                onChange={(e) => setFormData({ ...formData, hvLv1_600sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv1_pi}
                onChange={(e) => setFormData({ ...formData, hvLv1_pi: e.target.value })}
              />
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
              <input
                type="text"
                value={formData.bdv}
                onChange={(e) => setFormData({ ...formData, bdv: e.target.value })}
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
                value={formData.waterContent}
                onChange={(e) => setFormData({ ...formData, waterContent: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="PPM Photo, Reading of BDV values, Air cell, MOG, POG."
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 4
        </button>
      </div>
    </form>
  )
}

export function Stage5Form1({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Test equipment details
    makeOfMeter: "",
    date: "",
    modelSrNo: "",
    ambient: "",
    oti: "",
    wti: "",
    testReportReviewedBy: "",
    acceptanceOfTest: "",

    // Transformer details
    trSrNo: "",
    location: "",
    customer: "",
    testDate: "",
    testTime: "",

    // Test conditions
    ambTemp: "",
    make: "",
    oilTemp: "",
    srNo: "",
    wdgTemp: "",
    voltageLevel: "",

    // IR measurements (15sec, 60sec, 600sec, and ratios)
    hvEarth_15sec: "",
    hvEarth_60sec: "",
    hvEarth_600sec: "",
    hvEarth_ratio60_15: "",
    hvEarth_ratio600_60: "",
    lvEarth_15sec: "",
    lvEarth_60sec: "",
    lvEarth_600sec: "",
    lvEarth_ratio60_15: "",
    lvEarth_ratio600_60: "",
    hvLv_15sec: "",
    hvLv_60sec: "",
    hvLv_600sec: "",
    hvLv_ratio60_15: "",
    hvLv_ratio600_60: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage5Form1`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form1")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "testRecord", label: "Test Record of Erection" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
                value={formData.makeOfMeter}
                onChange={(e) => setFormData({ ...formData, makeOfMeter: e.target.value })}
              />
            </td>
            <td>
              <strong>Date</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                value={formData.modelSrNo}
                onChange={(e) => setFormData({ ...formData, modelSrNo: e.target.value })}
              />
            </td>
            <td>
              <strong>Ambient</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ambient}
                onChange={(e) => setFormData({ ...formData, ambient: e.target.value })}
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
                value={formData.oti}
                onChange={(e) => setFormData({ ...formData, oti: e.target.value })}
              />
            </td>
            <td>
              <strong>WTI in ⁰C</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wti}
                onChange={(e) => setFormData({ ...formData, wti: e.target.value })}
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
                value={formData.testReportReviewedBy}
                onChange={(e) => setFormData({ ...formData, testReportReviewedBy: e.target.value })}
              />
            </td>
            <td>
              <strong>Acceptance of the test</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.acceptanceOfTest}
                onChange={(e) => setFormData({ ...formData, acceptanceOfTest: e.target.value })}
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
                value={formData.trSrNo}
                onChange={(e) => setFormData({ ...formData, trSrNo: e.target.value })}
              />
            </td>
            <td>
              <strong>Location</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              />
            </td>
            <td>
              <strong>Date</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.testDate}
                onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
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
                value={formData.testTime}
                onChange={(e) => setFormData({ ...formData, testTime: e.target.value })}
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
                value={formData.ambTemp}
                onChange={(e) => setFormData({ ...formData, ambTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Make</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
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
                value={formData.oilTemp}
                onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Sr. No</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.srNo}
                onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
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
                value={formData.wdgTemp}
                onChange={(e) => setFormData({ ...formData, wdgTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Voltage Level</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageLevel}
                onChange={(e) => setFormData({ ...formData, voltageLevel: e.target.value })}
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
                value={formData.hvEarth_15sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_60sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_600sec}
                onChange={(e) => setFormData({ ...formData, hvEarth_600sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_ratio60_15}
                onChange={(e) => setFormData({ ...formData, hvEarth_ratio60_15: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_ratio600_60}
                onChange={(e) => setFormData({ ...formData, hvEarth_ratio600_60: e.target.value })}
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
                value={formData.lvEarth_15sec}
                onChange={(e) => setFormData({ ...formData, lvEarth_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_60sec}
                onChange={(e) => setFormData({ ...formData, lvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_600sec}
                onChange={(e) => setFormData({ ...formData, lvEarth_600sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_ratio60_15}
                onChange={(e) => setFormData({ ...formData, lvEarth_ratio60_15: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvEarth_ratio600_60}
                onChange={(e) => setFormData({ ...formData, lvEarth_ratio600_60: e.target.value })}
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
                value={formData.hvLv_15sec}
                onChange={(e) => setFormData({ ...formData, hvLv_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv_60sec}
                onChange={(e) => setFormData({ ...formData, hvLv_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv_600sec}
                onChange={(e) => setFormData({ ...formData, hvLv_600sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv_ratio60_15}
                onChange={(e) => setFormData({ ...formData, hvLv_ratio60_15: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv_ratio600_60}
                onChange={(e) => setFormData({ ...formData, hvLv_ratio600_60: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="Test Record of Erection"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

export function Stage5Form2({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    // Meter Sr. NO. and TIME
    meterSrNo: "",
    time: "",

    // Ratio test data for 6 tap positions
    ratioTestData: Array(6).fill().map((_, index) => ({
      tapNo: index + 1,
      appliedVoltageHV: "",
      measuredVoltageLV: "",
      calculatedRatio: "",
      deviationPercent: "",
      namePlateRatio: "",
    })),

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage5Form2`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form2")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleRatioTestChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      ratioTestData: prev.ratioTestData.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "ratioTest", label: "Ratio Test" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "30px" }}>
          RATIO TEST
        </h2>
      </div>

      {/* Header with Meter Sr. NO. and TIME */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong>Meter Sr. NO.: </strong>
          <input
            type="text"
            value={formData.meterSrNo}
            onChange={(e) => setFormData({ ...formData, meterSrNo: e.target.value })}
            style={{ marginLeft: "10px", padding: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div>
          <strong>TIME: </strong>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
          {formData.ratioTestData.map((row, index) => (
            <tr key={index}>
              <td>
                <strong>{row.tapNo}</strong>
              </td>
              <td>
                <input
                  type="text"
                  value={row.appliedVoltageHV}
                  onChange={(e) => handleRatioTestChange(index, "appliedVoltageHV", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.measuredVoltageLV}
                  onChange={(e) => handleRatioTestChange(index, "measuredVoltageLV", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.calculatedRatio}
                  onChange={(e) => handleRatioTestChange(index, "calculatedRatio", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.deviationPercent}
                  onChange={(e) => handleRatioTestChange(index, "deviationPercent", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.namePlateRatio}
                  onChange={(e) => handleRatioTestChange(index, "namePlateRatio", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection title="Ratio Test" photos={photoRequirements} onPhotoChange={handlePhotoChange} />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

export function Stage5Form3({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    // HV side table
    hvTap1_voltageApplied: "",
    hvTap1_measuredCurrent: "",
    hvTap3_voltageApplied: "",
    hvTap3_measuredCurrent: "",
    hvTap6_voltageApplied: "",
    hvTap6_measuredCurrent: "",

    // LV side table
    lvTap1_voltageApplied: "",
    lvTap1_measuredCurrent: "",
    lvTap2_voltageApplied: "",
    lvTap2_measuredCurrent: "",
    lvTap3_voltageApplied: "",
    lvTap3_measuredCurrent: "",
    lvTap4_voltageApplied: "",
    lvTap4_measuredCurrent: "",
    lvTap5_voltageApplied: "",
    lvTap5_measuredCurrent: "",
    lvTap6_voltageApplied: "",
    lvTap6_measuredCurrent: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage5Form3`, {
          params: {
            companyName: companyName,
            projectName: projectName,
          },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form3")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "magnetisingCurrentTest", label: "Magnetising Current Test" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
                value={formData.hvTap1_voltageApplied}
                onChange={(e) => setFormData({ ...formData, hvTap1_voltageApplied: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvTap1_measuredCurrent}
                onChange={(e) => setFormData({ ...formData, hvTap1_measuredCurrent: e.target.value })}
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
                value={formData.hvTap3_voltageApplied}
                onChange={(e) => setFormData({ ...formData, hvTap3_voltageApplied: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvTap3_measuredCurrent}
                onChange={(e) => setFormData({ ...formData, hvTap3_measuredCurrent: e.target.value })}
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
                value={formData.hvTap6_voltageApplied}
                onChange={(e) => setFormData({ ...formData, hvTap6_voltageApplied: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvTap6_measuredCurrent}
                onChange={(e) => setFormData({ ...formData, hvTap6_measuredCurrent: e.target.value })}
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
                value={formData.lvTap1_voltageApplied}
                onChange={(e) => setFormData({ ...formData, lvTap1_voltageApplied: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvTap1_measuredCurrent}
                onChange={(e) => setFormData({ ...formData, lvTap1_measuredCurrent: e.target.value })}
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
                value={formData.lvTap2_voltageApplied}
                onChange={(e) => setFormData({ ...formData, lvTap2_voltageApplied: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvTap2_measuredCurrent}
                onChange={(e) => setFormData({ ...formData, lvTap2_measuredCurrent: e.target.value })}
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
                value={formData.lvTap3_voltageApplied}
                onChange={(e) => setFormData({ ...formData, lvTap3_voltageApplied: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvTap3_measuredCurrent}
                onChange={(e) => setFormData({ ...formData, lvTap3_measuredCurrent: e.target.value })}
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
                value={formData.lvTap4_voltageApplied}
                onChange={(e) => setFormData({ ...formData, lvTap4_voltageApplied: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvTap4_measuredCurrent}
                onChange={(e) => setFormData({ ...formData, lvTap4_measuredCurrent: e.target.value })}
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
                value={formData.lvTap5_voltageApplied}
                onChange={(e) => setFormData({ ...formData, lvTap5_voltageApplied: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvTap5_measuredCurrent}
                onChange={(e) => setFormData({ ...formData, lvTap5_measuredCurrent: e.target.value })}
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
                value={formData.lvTap6_voltageApplied}
                onChange={(e) => setFormData({ ...formData, lvTap6_voltageApplied: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lvTap6_measuredCurrent}
                onChange={(e) => setFormData({ ...formData, lvTap6_measuredCurrent: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection title="Magnetising Current Test" photos={photoRequirements} onPhotoChange={handlePhotoChange} />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// DiagramImage and ConditionBlock are defined OUTSIDE Stage5Form4
// to prevent re-creation on every keystroke (which causes focus loss)
const PolarityDiagramImage = ({ variant }) => {
  const commonTextStyle = { fontFamily: "Arial, sans-serif", fontSize: 12, fill: "#111" };
  const commonLineStyle = { stroke: "#111", strokeWidth: 2, strokeLinecap: "round" };
  const commonThinLineStyle = { stroke: "#111", strokeWidth: 1.5, strokeLinecap: "round" };
  const commonRectStyle = { fill: "#111" };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 240 220" width="220" height="200" role="img" aria-label="Polarity test diagram" style={{ maxWidth: "220px", width: "100%", height: "auto" }}>
        <text x="78" y="36" style={commonTextStyle}>1.1</text>
        <text x="148" y="36" style={commonTextStyle}>2.1</text>
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
        <text x="66" y="196" style={commonTextStyle}>1.2</text>
        <text x="156" y="196" style={commonTextStyle}>2.2</text>
        <line x1="48" y1="176" x2="90" y2="176" style={commonThinLineStyle} />
        <line x1="150" y1="176" x2="192" y2="176" style={commonThinLineStyle} />
        <line x1="90" y1="160" x2="90" y2="176" style={commonThinLineStyle} />
        <line x1="150" y1="160" x2="150" y2="176" style={commonThinLineStyle} />
      </svg>
    </div>
  );
};

const PolarityConditionBlock = ({ title, rows, equation, eqLhsKey, eqRhs1Key, eqRhs2Key, eqOperator, eqCheckLhsKey, eqCheckRhsKey, formData, setFormData }) => (
  <table className="form-table" style={{ marginTop: "16px" }}>
    <thead>
      <tr>
        <th colSpan={2} style={{ textAlign: "center" }}>{title}</th>
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
                      value={formData[r.key]}
                      onChange={(e) => setFormData({ ...formData, [r.key]: e.target.value })}
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
                      value={formData[eqLhsKey] || ""}
                      onChange={(e) => setFormData({ ...formData, [eqLhsKey]: e.target.value })}
                      style={{ flex: 2 }}
                    />
                    <strong>=</strong>
                    <input
                      type="text"
                      value={formData[eqRhs1Key] || ""}
                      onChange={(e) => setFormData({ ...formData, [eqRhs1Key]: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <strong>{eqOperator}</strong>
                    <input
                      type="text"
                      value={formData[eqRhs2Key] || ""}
                      onChange={(e) => setFormData({ ...formData, [eqRhs2Key]: e.target.value })}
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
                      value={formData[eqCheckLhsKey] || ""}
                      onChange={(e) => setFormData({ ...formData, [eqCheckLhsKey]: e.target.value })}
                      style={{ flex: 2 }}
                    />
                    <strong>=</strong>
                    <input
                      type="text"
                      value={formData[eqCheckRhsKey] || ""}
                      onChange={(e) => setFormData({ ...formData, [eqCheckRhsKey]: e.target.value })}
                      style={{ flex: 3 }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <td style={{ width: "45%", verticalAlign: "middle" }}>
          <PolarityDiagramImage variant={title === "CONDITION 2" ? "condition2" : "condition1"} />
        </td>
      </tr>
    </tbody>
  </table>
);

export function Stage5Form4({ onSubmit, onPrevious, initialData, companyName, projectName }) {
  const [formData, setFormData] = useState({
    // Condition 1 readings
    cond1_11_12: "",
    cond1_21_22: "",
    cond1_11_22: "",
    // Condition 1 equation result boxes
    cond1_eq_lhs: "",
    cond1_eq_rhs1: "",
    cond1_eq_rhs2: "",
    cond1_eq_check_lhs: "",
    cond1_eq_check_rhs: "",

    // Condition 2 readings
    cond2_11_12: "",
    cond2_21_22: "",
    cond2_11_21: "",
    // Condition 2 equation result boxes
    cond2_eq_lhs: "",
    cond2_eq_rhs1: "",
    cond2_eq_rhs2: "",
    cond2_eq_check_lhs: "",
    cond2_eq_check_rhs: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage5Form4`, {
          params: { companyName, projectName },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form4")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>TYPE OF TEST – POLARITY TEST</h2>
      </div>

      <PolarityConditionBlock
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
        formData={formData}
        setFormData={setFormData}
      />

      <PolarityConditionBlock
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
        formData={formData}
        setFormData={setFormData}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

export function Stage5Form5({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    appliedVoltage: "",
    date: "",
    time: "",
    meterMakeSrNo: "",

    tapReadings: Array(6)
      .fill()
      .map((_, i) => ({
        tapNo: i + 1,
        voltage: "",
        hvCurrent: "",
        lvCurrent: "",
      })),

    // Impedance calculation
    impedance_appliedVoltageHV: "",
    impedance_ratedVoltageHV: "",
    impedance_ratedCurrentLV: "",
    impedance_measuredCurrentLV: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage5Form5`, {
          params: { companyName, projectName },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form5")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleTapChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      tapReadings: prev.tapReadings.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "shortCircuitTest", label: "Short Circuit Test" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>TYPE OF TEST – SHORT CIRCUIT TEST</h2>
      </div>

      {/* Header table */}
      <table className="form-table">
        <tbody>
          <tr>
            <td style={{ width: "40%" }}>
              <strong>APPLIED VOLTAGE :</strong>
            </td>
            <td style={{ width: "25%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="text"
                  value={formData.appliedVoltage}
                  onChange={(e) => setFormData({ ...formData, appliedVoltage: e.target.value })}
                />
                <strong style={{ whiteSpace: "nowrap" }}>VOLTS</strong>
              </div>
            </td>
            <td style={{ width: "17%" }}>
              <strong>DATE:</strong>
            </td>
            <td style={{ width: "18%" }}>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td style={{ width: "12%" }}>
              <strong>TIME :</strong>
            </td>
            <td style={{ width: "18%" }}>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td colSpan={4}>
              <input
                type="text"
                value={formData.meterMakeSrNo}
                onChange={(e) => setFormData({ ...formData, meterMakeSrNo: e.target.value })}
                style={{ width: "100%" }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Main readings table */}
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
          {formData.tapReadings.map((row, idx) => (
            <tr key={row.tapNo}>
              <td style={{ textAlign: "center" }}>
                <strong>{row.tapNo}</strong>
              </td>
              <td>
                <input
                  type="text"
                  value={row.voltage}
                  onChange={(e) => handleTapChange(idx, "voltage", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.hvCurrent}
                  onChange={(e) => handleTapChange(idx, "hvCurrent", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.lvCurrent}
                  onChange={(e) => handleTapChange(idx, "lvCurrent", e.target.value)}
                />
              </td>
            </tr>
          ))}

          {/* Impedance calculation block (as in reference image) */}
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
                        value={formData.impedance_appliedVoltageHV}
                        onChange={(e) => setFormData({ ...formData, impedance_appliedVoltageHV: e.target.value })}
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>Rated voltage HV</div>
                      <input
                        type="text"
                        value={formData.impedance_ratedVoltageHV}
                        onChange={(e) => setFormData({ ...formData, impedance_ratedVoltageHV: e.target.value })}
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
                        value={formData.impedance_ratedCurrentLV}
                        onChange={(e) => setFormData({ ...formData, impedance_ratedCurrentLV: e.target.value })}
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>Measured current LV</div>
                      <input
                        type="text"
                        value={formData.impedance_measuredCurrentLV}
                        onChange={(e) => setFormData({ ...formData, impedance_measuredCurrentLV: e.target.value })}
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

      <PhotoUploadSection title="Short Circuit Test" photos={photoRequirements} onPhotoChange={handlePhotoChange} />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          {isLastFormOfStage ? "Submit Stage 5" : "Next Form"}
        </button>
      </div>
    </form>
  )
}

export function Stage5Form6({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    meterUsed: "",
    meterMakeSrNo: "",
    range1: "",
    range2: "",
    date: "",
    time: "",
    wti: "",
    oti: "",
    ambient: "",

    // HV side
    hvHeader: "2.1 – 2.2 (Ω)",
    hvTapReadings: Array(6)
      .fill()
      .map((_, i) => ({
        tapNo: i + 1,
        value: "",
      })),

    // LV side
    lvHeader: "1.1 – 1.2 ((Ω)",
    lvValue: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage5Form6`, {
          params: { companyName, projectName },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form6")
          setFormData(response.data.data)
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleHvTapChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      hvTapReadings: prev.hvTapReadings.map((row, i) => (i === index ? { ...row, value } : row)),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2 style={{ textDecoration: "underline", textUnderlineOffset: "6px" }}>
          TYPE OF TEST – WINDING RESISTANCE TEST
        </h2>
      </div>

      {/* Top info block (as per reference image) */}
      <table className="form-table" style={{ marginTop: "10px" }}>
        <tbody>
          <tr>
            <td style={{ width: "35%" }}>
              <strong>METER USED</strong>
            </td>
            <td style={{ width: "35%" }}>
              <input
                type="text"
                value={formData.meterUsed}
                onChange={(e) => setFormData({ ...formData, meterUsed: e.target.value })}
              />
            </td>
            <td style={{ width: "15%" }}>
              <strong>DATE:</strong>
            </td>
            <td style={{ width: "15%" }}>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td style={{ width: "15%" }}>
              <strong>TIME :</strong>
            </td>
            <td style={{ width: "15%" }}>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.meterMakeSrNo}
                onChange={(e) => setFormData({ ...formData, meterMakeSrNo: e.target.value })}
              />
            </td>
            <td>
              <strong>WTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wti}
                onChange={(e) => setFormData({ ...formData, wti: e.target.value })}
              />
            </td>
            <td>
              <strong>OTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oti}
                onChange={(e) => setFormData({ ...formData, oti: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td>
              <strong>RANGE</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.range1}
                onChange={(e) => setFormData({ ...formData, range1: e.target.value })}
              />
            </td>
            <td colSpan={2}>
              <strong>AMBIENT:</strong>
              <input
                type="text"
                value={formData.ambient}
                onChange={(e) => setFormData({ ...formData, ambient: e.target.value })}
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
                value={formData.range2}
                onChange={(e) => setFormData({ ...formData, range2: e.target.value })}
                style={{ width: "100%" }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* HV/LV tables */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 30, marginTop: 30 }}>
        <div style={{ width: "55%" }}>
          <h3 style={{ textAlign: "center", textDecoration: "underline", textUnderlineOffset: 6 }}>LV SIDE</h3>

          <table className="form-table" style={{ marginTop: 14 }}>
            <thead>
              <tr>
                <th style={{ width: "25%" }}>TAP NO.</th>
                <th>{formData.hvHeader}</th>
              </tr>
            </thead>
            <tbody>
              {formData.hvTapReadings.map((row, idx) => (
                <tr key={row.tapNo}>
                  <td style={{ textAlign: "center" }}>
                    <strong>{row.tapNo}</strong>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => handleHvTapChange(idx, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ width: "45%" }}>
          <h3 style={{ textAlign: "center", textDecoration: "underline", textUnderlineOffset: 6 }}>HV SIDE</h3>

          <table className="form-table" style={{ marginTop: 14 }}>
            <thead>
              <tr>
                <th>{formData.lvHeader}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    value={formData.lvValue}
                    onChange={(e) => setFormData({ ...formData, lvValue: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    value={formData.lvValue2 || ""}
                    onChange={(e) => setFormData({ ...formData, lvValue2: e.target.value })}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          {isLastFormOfStage ? "Submit Stage 5" : "Next Form"}
        </button>
      </div>
    </form>
  )
}

export function Stage5Form7({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Header section
    bushingSrNoHv: "",
    bushingSrNoLv: "",
    makeHv: "",
    makeLv: "",

    meterUsed: "",
    date: "",
    time: "",
    modelAndSrNo: "",
    ambient: "",
    oti: "",
    wti: "",

    // Measurement rows
    rows: [
      { id: "hv_11", label: "HV (1.1)", voltageKv: "", testMode: "", capFactory: "", capSite: "", tdFactory: "", tdSite: "" },
      { id: "hv_12", label: "HV (1.2)", voltageKv: "", testMode: "", capFactory: "", capSite: "", tdFactory: "", tdSite: "" },
      { id: "lv_21", label: "LV (2.1)", voltageKv: "", testMode: "", capFactory: "", capSite: "", tdFactory: "", tdSite: "" },
      { id: "lv_22", label: "LV (2.2)", voltageKv: "", testMode: "", capFactory: "", capSite: "", tdFactory: "", tdSite: "" },
    ],

    // Measurement rows for second table
    rows2: [
      { id: "hv_11_2", label: "HV (1.1)", voltageKv: "", testMode: "", capFactory: "", capSite: "", tdFactory: "", tdSite: "" },
      { id: "hv_12_2", label: "HV (1.2)", voltageKv: "", testMode: "", capFactory: "", capSite: "", tdFactory: "", tdSite: "" },
      { id: "lv_21_2", label: "LV (2.1)", voltageKv: "", testMode: "", capFactory: "", capSite: "", tdFactory: "", tdSite: "" },
      { id: "lv_22_2", label: "LV (2.2)", voltageKv: "", testMode: "", capFactory: "", capSite: "", tdFactory: "", tdSite: "" },
    ],

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage5Form7`, {
          params: { companyName, projectName },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form7")
          setFormData((prev) => ({
            ...prev,
            ...response.data.data,
            // ensure rows always exist (backward compat)
            rows:
              response.data.data?.rows && Array.isArray(response.data.data.rows) && response.data.data.rows.length
                ? response.data.data.rows
                : prev.rows,
          }))
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleRowChange = (rowId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
    }))
  }

  const handleRow2Change = (rowId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      rows2: prev.rows2.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "tanDeltaKit", label: "Tan Delta Kit" },
    { key: "calibrationReport", label: "Calibration Report" },
    { key: "duringTanDelta", label: "During Tan Delta of bushing photo" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2 style={{ textAlign: "center", fontWeight: 800, marginBottom: 0 }}>TEST REPORT</h2>
        <h3 style={{ textAlign: "center", marginTop: 6, textDecoration: "underline", textUnderlineOffset: 6 }}>
          TAN DELTA AND CAPACITANCE TEST ON BUSHING
        </h3>
      </div>

      {/* Top identification table (matches reference layout) */}
      <table className="form-table" style={{ marginTop: 10 }}>
        <tbody>
          <tr>
            <td style={{ width: "25%" }}>
              <strong>BUSHING SR. NO. (HV)</strong>
            </td>
            <td style={{ width: "25%" }}>
              <input
                type="text"
                value={formData.bushingSrNoHv}
                onChange={(e) => setFormData({ ...formData, bushingSrNoHv: e.target.value })}
              />
            </td>
            <td style={{ width: "25%" }}>
              <strong></strong>
            </td>
            <td style={{ width: "25%" }}>
              <input
                type="text"
                value={formData.makeHv}
                onChange={(e) => setFormData({ ...formData, makeHv: e.target.value })}
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
                value={formData.bushingSrNoLv}
                onChange={(e) => setFormData({ ...formData, bushingSrNoLv: e.target.value })}
              />
            </td>
            <td>
              <strong></strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.makeLv}
                onChange={(e) => setFormData({ ...formData, makeLv: e.target.value })}
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
              <input
                type="text"
                value={formData.meterUsed}
                onChange={(e) => setFormData({ ...formData, meterUsed: e.target.value })}
              />
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
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
                value={formData.modelAndSrNo}
                onChange={(e) => setFormData({ ...formData, modelAndSrNo: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ambient}
                onChange={(e) => setFormData({ ...formData, ambient: e.target.value })}
              />
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
              <input
                type="text"
                value={formData.oti}
                onChange={(e) => setFormData({ ...formData, oti: e.target.value })}
              />
            </td>
            <td colSpan={2}>
              <input
                type="text"
                value={formData.wti}
                onChange={(e) => setFormData({ ...formData, wti: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Main measurement table */}
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
          {formData.rows.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="text"
                  value={row.voltageKv}
                  onChange={(e) => handleRowChange(row.id, "voltageKv", e.target.value)}
                />
              </td>
              <td style={{ fontWeight: 700, textAlign: "center" }}>{row.label}</td>
              <td>
                <input
                  type="text"
                  value={row.testMode}
                  onChange={(e) => handleRowChange(row.id, "testMode", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.capFactory}
                  onChange={(e) => handleRowChange(row.id, "capFactory", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.capSite}
                  onChange={(e) => handleRowChange(row.id, "capSite", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.tdFactory}
                  onChange={(e) => handleRowChange(row.id, "tdFactory", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.tdSite}
                  onChange={(e) => handleRowChange(row.id, "tdSite", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Replicated measurement table */}
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
          {formData.rows2 && formData.rows2.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="text"
                  value={row.voltageKv}
                  onChange={(e) => handleRow2Change(row.id, "voltageKv", e.target.value)}
                />
              </td>
              <td style={{ fontWeight: 700, textAlign: "center" }}>{row.label}</td>
              <td>
                <input
                  type="text"
                  value={row.testMode}
                  onChange={(e) => handleRow2Change(row.id, "testMode", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.capFactory}
                  onChange={(e) => handleRow2Change(row.id, "capFactory", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.capSite}
                  onChange={(e) => handleRow2Change(row.id, "capSite", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.tdFactory}
                  onChange={(e) => handleRow2Change(row.id, "tdFactory", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.tdSite}
                  onChange={(e) => handleRow2Change(row.id, "tdSite", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection title="Tan Delta Kit" photos={[photoRequirements[0]]} onPhotoChange={handlePhotoChange} />
      <PhotoUploadSection title="Calibration Report" photos={[photoRequirements[1]]} onPhotoChange={handlePhotoChange} />
      <PhotoUploadSection
        title="During Tan Delta of bushing photo"
        photos={[photoRequirements[2]]}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          {isLastFormOfStage ? "Submit Stage 5" : "Next Form"}
        </button>
      </div>
    </form>
  )
}

export function Stage5Form8({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    // Header section
    meterUsed: "",
    date: "",
    time: "",
    modelAndSrNo: "",
    ambient: "",
    oti: "",
    wti: "",

    // 05 KV table rows
    kv5_rows: [
      {
        id: "hv_g",
        between: "HV – G",
        mode: "GST-GND",
        tanDelta: "",
        capacitance: "",
        excitationCurrent: "",
        dielectricLoss: "",
      },
      {
        id: "lv_g",
        between: "LV – G",
        mode: "GST-GND",
        tanDelta: "",
        capacitance: "",
        excitationCurrent: "",
        dielectricLoss: "",
      },
      {
        id: "hv_lv",
        between: "HV – LV",
        mode: "UST-R",
        tanDelta: "",
        capacitance: "",
        excitationCurrent: "",
        dielectricLoss: "",
      },
    ],

    // 10 KV table rows
    kv10_rows: [
      {
        id: "hv_g",
        between: "HV – G",
        mode: "GST-GND",
        tanDelta: "",
        capacitance: "",
        excitationCurrent: "",
        dielectricLoss: "",
      },
      {
        id: "lv_g",
        between: "LV – G",
        mode: "GST-GND",
        tanDelta: "",
        capacitance: "",
        excitationCurrent: "",
        dielectricLoss: "",
      },
      {
        id: "hv_lv",
        between: "HV – LV",
        mode: "UST-R",
        tanDelta: "",
        capacitance: "",
        excitationCurrent: "",
        dielectricLoss: "",
      },
    ],

    // "IR VALUES OF TRANSFORMER" section
    ir: {
      date: "",
      time: "",
      ambTemp: "",
      make: "",
      oilTemp: "",
      srNo: "",
      wdgTemp: "",
      range: "",
      relativeHumidity: "",
      voltageLevel: "",

      rows: [
        {
          id: "hv_earth",
          label: "HV-Earth",
          sec15: "",
          sec60: "",
          sec600: "",
          ratio60_15: "",
          ratio600_60: "",
        },
        {
          id: "lv_earth",
          label: "LV-Earth",
          sec15: "",
          sec60: "",
          sec600: "",
          ratio60_15: "",
          ratio600_60: "",
        },
        {
          id: "hv_lv",
          label: "HV-LV",
          sec15: "",
          sec60: "",
          sec600: "",
          ratio60_15: "",
          ratio600_60: "",
        },
      ],
    },

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage5Form8`, {
          params: { companyName, projectName },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form8")
          setFormData((prev) => {
            const incoming = response.data.data || {}
            return {
              ...prev,
              ...incoming,
              kv5_rows:
                incoming?.kv5_rows && Array.isArray(incoming.kv5_rows) && incoming.kv5_rows.length
                  ? incoming.kv5_rows
                  : prev.kv5_rows,
              kv10_rows:
                incoming?.kv10_rows && Array.isArray(incoming.kv10_rows) && incoming.kv10_rows.length
                  ? incoming.kv10_rows
                  : prev.kv10_rows,
              ir: {
                ...prev.ir,
                ...(incoming.ir || {}),
                rows:
                  incoming?.ir?.rows && Array.isArray(incoming.ir.rows) && incoming.ir.rows.length
                    ? incoming.ir.rows
                    : prev.ir.rows,
              },
            }
          })
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleKvRowChange = (tableKey, rowId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [tableKey]: prev[tableKey].map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
    }))
  }

  const handleIrHeaderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      ir: { ...prev.ir, [field]: value },
    }))
  }

  const handleIrRowChange = (rowId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      ir: {
        ...prev.ir,
        rows: prev.ir.rows.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
      },
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "sfraKitCalibration", label: "SFRA kit calibration" },
    { key: "tanDeltaKitCalibration", label: "Ten delta kit calibration" },
    { key: "multimeter", label: "Multimeter" },
    { key: "megger", label: "Megger" },
    { key: "windingResistanceKit", label: "Winding resistance kit" },
    { key: "clampMeter", label: "Clamp meter" },
  ]

  const TanDeltaTable = ({ title, currentUnit, rowsKey }) => (
    <table className="form-table" style={{ marginTop: 18 }}>
      <thead>
        <tr>
          <th style={{ width: "14%" }}>{title}</th>
          <th style={{ width: "12%" }}>MODE</th>
          <th style={{ width: "16%" }}>TAN DELTA %</th>
          <th style={{ width: "16%" }}>
            CAPACITANCE
            <br />
            (Pf)
          </th>
          <th style={{ width: "20%" }}>
            EXCITATION CURRENT (mA)
            <br />({currentUnit})
          </th>
          <th style={{ width: "22%" }}>DIELECTRIC LOSS</th>
        </tr>
      </thead>
      <tbody>
        {formData[rowsKey].map((r) => (
          <tr key={r.id}>
            <td style={{ fontWeight: 700, textAlign: "center" }}>{r.between}</td>
            <td style={{ fontWeight: 700, textAlign: "center" }}>{r.mode}</td>
            <td>
              <input
                type="text"
                value={r.tanDelta}
                onChange={(e) => handleKvRowChange(rowsKey, r.id, "tanDelta", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={r.capacitance}
                onChange={(e) => handleKvRowChange(rowsKey, r.id, "capacitance", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={r.excitationCurrent}
                onChange={(e) => handleKvRowChange(rowsKey, r.id, "excitationCurrent", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={r.dielectricLoss}
                onChange={(e) => handleKvRowChange(rowsKey, r.id, "dielectricLoss", e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2 style={{ textAlign: "center", fontWeight: 800 }}>TAN DELTA AND CAPACITANCE MEASUREMENT OF WINDING</h2>
      </div>

      {/* Header block (as per image) */}
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
              <input
                type="text"
                value={formData.meterUsed}
                onChange={(e) => setFormData({ ...formData, meterUsed: e.target.value })}
              />
            </td>
            <td>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </td>
            <td>
              <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
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
                value={formData.modelAndSrNo}
                onChange={(e) => setFormData({ ...formData, modelAndSrNo: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ambient}
                onChange={(e) => setFormData({ ...formData, ambient: e.target.value })}
              />
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
              <input type="text" value={formData.oti} onChange={(e) => setFormData({ ...formData, oti: e.target.value })} />
            </td>
            <td colSpan={2}>
              <input type="text" value={formData.wti} onChange={(e) => setFormData({ ...formData, wti: e.target.value })} />
            </td>
          </tr>
        </tbody>
      </table>

      <TanDeltaTable title="AT 05 KV IN BETWEEN" currentUnit="A" rowsKey="kv5_rows" />
      <TanDeltaTable title="AT 10 KV IN BETWEEN" currentUnit="mA" rowsKey="kv10_rows" />

      {/* IR VALUES section */}
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
              <input
                type="date"
                value={formData.ir.date}
                onChange={(e) => handleIrHeaderChange("date", e.target.value)}
              />
            </td>
            <td style={{ width: "25%" }}>
              <strong>Time:</strong>
            </td>
            <td style={{ width: "25%" }}>
              <input
                type="time"
                value={formData.ir.time}
                onChange={(e) => handleIrHeaderChange("time", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Amb. Temp :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ir.ambTemp}
                onChange={(e) => handleIrHeaderChange("ambTemp", e.target.value)}
              />
            </td>
            <td>
              <strong>Make :</strong>
            </td>
            <td>
              <input type="text" value={formData.ir.make} onChange={(e) => handleIrHeaderChange("make", e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Oil Temp. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ir.oilTemp}
                onChange={(e) => handleIrHeaderChange("oilTemp", e.target.value)}
              />
            </td>
            <td>
              <strong>Sr. No. :</strong>
            </td>
            <td>
              <input type="text" value={formData.ir.srNo} onChange={(e) => handleIrHeaderChange("srNo", e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Wdg. Temp. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ir.wdgTemp}
                onChange={(e) => handleIrHeaderChange("wdgTemp", e.target.value)}
              />
            </td>
            <td>
              <strong>Range :</strong>
            </td>
            <td>
              <input type="text" value={formData.ir.range} onChange={(e) => handleIrHeaderChange("range", e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Relative Humidity :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ir.relativeHumidity}
                onChange={(e) => handleIrHeaderChange("relativeHumidity", e.target.value)}
              />
            </td>
            <td>
              <strong>Voltage Level :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ir.voltageLevel}
                onChange={(e) => handleIrHeaderChange("voltageLevel", e.target.value)}
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
          {formData.ir.rows.map((r) => (
            <tr key={r.id}>
              <td style={{ fontWeight: 700 }}>{r.label}</td>
              <td>
                <input type="text" value={r.sec15} onChange={(e) => handleIrRowChange(r.id, "sec15", e.target.value)} />
              </td>
              <td>
                <input type="text" value={r.sec60} onChange={(e) => handleIrRowChange(r.id, "sec60", e.target.value)} />
              </td>
              <td>
                <input
                  type="text"
                  value={r.sec600}
                  onChange={(e) => handleIrRowChange(r.id, "sec600", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={r.ratio60_15}
                  onChange={(e) => handleIrRowChange(r.id, "ratio60_15", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={r.ratio600_60}
                  onChange={(e) => handleIrRowChange(r.id, "ratio600_60", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Photographs to be added"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
        allowMultiple={false}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          {isLastFormOfStage ? "Submit Stage 5" : "Next Form"}
        </button>
      </div>
    </form>
  )
}

export function Stage6Form1({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Section 1: Valve Status (A, B, C, D, F, G, H, K, L, M)
    valveStatus: {
      A: { open: "", shut: "", na: "" }, // Bucholz to Conservator
      B: { open: "", shut: "", na: "" }, // Main Tank to Bucholz
      C: { open: "", shut: "", na: "" }, // Radiator Top Valves
      D: { open: "", shut: "", na: "" }, // Radiator Bottom Valves
      F: { open: "", shut: "", na: "" }, // Top Header
      G: { open: "", shut: "", na: "" }, // Bottom Header
      H: { open: "", shut: "", na: "" }, // Main Tank to Radiator Bank
      K: { open: "", shut: "", na: "" }, // Top Filter Valve
      L: { open: "", shut: "", na: "" }, // Bottom Filter Valve
      M: { open: "", shut: "", na: "" }, // Drain Valve
    },

    // Section 2: Air Venting (with qty column like reference)
    airVenting: {
      A: { qty: "", open: "", shut: "", na: "" }, // Main Tank
      B: { qty: "", open: "", shut: "", na: "" }, // Bucholz Relay
      C: { qty: "", open: "", shut: "", na: "" }, // HV Bushing
      D: { qty: "", open: "", shut: "", na: "" }, // LV Bushing
      G: { qty: "", open: "", shut: "", na: "" }, // Header – Top
      H: { qty: "", open: "", shut: "", na: "" }, // Header – Bottom
      I: { qty: "", open: "", shut: "", na: "" }, // Radiator – Top
      L: { qty: "", open: "", shut: "", na: "" }, // Diverter Switch
    },

    // Protection Trials (checked column)
    protectionTrials: {
      buchholzAlarm: "",
      buchholzTrip: "",
      mogAlarm: "",
      prvTrip: "",
      otiAlarm: "",
      otiTrip: "",
      wtiAlarm: "",
      wtiTrip: "",
      setTemperature: "",
    },

    photos: {},
    ...initialData,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const setNested = (section, key, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: {
          ...(prev[section]?.[key] || {}),
          [field]: value,
        },
      },
    }))
  }

  const statusInput = (section, key, field) => (
    <input
      type="text"
      value={formData?.[section]?.[key]?.[field] || ""}
      onChange={(e) => setNested(section, key, field, e.target.value)}
      style={{ width: "100%", minWidth: 70 }}
    />
  )

  const photoRequirements = [
    {
      key: "preCommissioningChecklist",
      label: "Pre-commissioning checklist photo",
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
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
            <th colSpan={3} style={{ width: "40%" }}>
              Status
            </th>
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
              <td>{statusInput("valveStatus", row.code, "open")}</td>
              <td>{statusInput("valveStatus", row.code, "shut")}</td>
              <td>{statusInput("valveStatus", row.code, "na")}</td>
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
                  onChange={(e) => setNested("airVenting", row.code, "qty", e.target.value)}
                  style={{ width: "100%", minWidth: 60 }}
                />
              </td>
              <td>{statusInput("airVenting", row.code, "open")}</td>
              <td>{statusInput("airVenting", row.code, "shut")}</td>
              <td>{statusInput("airVenting", row.code, "na")}</td>
            </tr>
          ))}

          {/* III - Protection Trails */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>III</td>
            <td style={{ fontWeight: 700 }}>Protection Trails</td>
            <td></td>
            <td colSpan={3} style={{ textAlign: "center", fontWeight: 700 }}>
              Checked
            </td>
          </tr>

          {/* Buchholz */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>A</td>
            <td style={{ fontWeight: 700 }}>BUCHHOLZ</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>ALARM</td>
            <td colSpan={3}>
              <input
                type="text"
                value={formData.protectionTrials.buchholzAlarm}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    protectionTrials: { ...prev.protectionTrials, buchholzAlarm: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>TRIP</td>
            <td colSpan={3}>
              <input
                type="text"
                value={formData.protectionTrials.buchholzTrip}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    protectionTrials: { ...prev.protectionTrials, buchholzTrip: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </td>
          </tr>

          {/* MOG */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>B</td>
            <td style={{ fontWeight: 700 }}>MOG</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>ALARM</td>
            <td colSpan={3}>
              <input
                type="text"
                value={formData.protectionTrials.mogAlarm}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    protectionTrials: { ...prev.protectionTrials, mogAlarm: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </td>
          </tr>

          {/* PRV */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>C</td>
            <td style={{ fontWeight: 700 }}>PRV</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>TRIP</td>
            <td colSpan={3}>
              <input
                type="text"
                value={formData.protectionTrials.prvTrip}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    protectionTrials: { ...prev.protectionTrials, prvTrip: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </td>
          </tr>

          {/* OTI */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>D</td>
            <td style={{ fontWeight: 700 }}>OTI</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>ALARM</td>
            <td colSpan={3} style={{ textAlign: "center" }}>
              <strong>Set Temperature</strong>
              <input
                type="text"
                value={formData.protectionTrials.setTemperature}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    protectionTrials: { ...prev.protectionTrials, setTemperature: e.target.value },
                  }))
                }
                style={{ width: "100%", marginTop: 6 }}
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>TRIP</td>
            <td colSpan={3}>
              <input
                type="text"
                value={formData.protectionTrials.otiTrip}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    protectionTrials: { ...prev.protectionTrials, otiTrip: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </td>
          </tr>

          {/* WTI */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>E</td>
            <td style={{ fontWeight: 700 }}>WTI</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>ALARM</td>
            <td colSpan={3}>
              <input
                type="text"
                value={formData.protectionTrials.wtiAlarm}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    protectionTrials: { ...prev.protectionTrials, wtiAlarm: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>TRIP</td>
            <td colSpan={3}>
              <input
                type="text"
                value={formData.protectionTrials.wtiTrip}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    protectionTrials: { ...prev.protectionTrials, wtiTrip: e.target.value },
                  }))
                }
                style={{ width: "100%" }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <PhotoUploadSection
        title="Pre-Commissioning Checklist"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

export function Stage6Form2({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    protectionRelay: {},
    accessoriesChecking: {},
    octcTapPosition: {},
    bushingTestTapEarthed: {},
    oilValues: {},
    finalIR: {},
    oilLevelInConservator: "",
    connectors: {},

    // Additional tables (as per reference image)
    connectorsLvJumpers: { "2.1": "", "2.2": "" }, // XI - LV Jumpers
    ctCableAndGlandsSealed: "", // XII
    anabondAppliedHvBushings: "", // 1
    allJointsSealedAgainstWaterIngress: "", // 2
    foreignMaterialCleared: "", // 3
    temperature: { wti: "", oti: "" },
    remarksChargingAsOn: "",
    remarksText:
      "All the necessary pre-commissioning checks and protection trials have been found satisfactory. Transformer has been cleared from all foreign material and is ready for charging.",
    checkedBy: { name: "", signature: "", date: "" },
    witnessedBy: { name: "", signature: "", date: "" },
    reviewedBy: { name: "", signature: "", date: "" },
    witnessedBy2: { name: "", signature: "", date: "" },

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/table/getTable/Stage6Form2`, {
          params: { companyName, projectName },
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage6Form2")
          setFormData((prev) => ({ ...prev, ...response.data.data }))
        } else {
          console.log("There is no data in DB.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  // generic nested setter (path array)
  const setByPath = (path, value) => {
    setFormData((prev) => {
      const next = { ...prev }
      let cur = next
      for (let i = 0; i < path.length - 1; i++) {
        const k = path[i]
        cur[k] = typeof cur[k] === "object" && cur[k] !== null ? { ...cur[k] } : {}
        cur = cur[k]
      }
      cur[path[path.length - 1]] = value
      return next
    })
  }

  const stage6Form2Input = (path, style = {}) => (
    <input
      type="text"
      value={path.reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : ""), formData) || ""}
      onChange={(e) => setByPath(path, e.target.value)}
      style={{ width: "100%", minWidth: 70, ...style }}
    />
  )

  const photoRequirements = [{ key: "stage6Form2", label: "Stage 6 Form 2 photo" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header" style={{ marginBottom: 10 }}>
        <h2 style={{ textAlign: "left", textDecoration: "underline", textUnderlineOffset: 6 }}>
          PRE-COMMISSIONING CHECKLIST (CONT.)
        </h2>
      </div>

      <table className="form-table" style={{ marginTop: 22 }}>
        <tbody>
          {/* IV Transformer Protection relay */}
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
              <td>{stage6Form2Input(["protectionRelay", r.code, "make"])}</td>
              <td>{stage6Form2Input(["protectionRelay", r.code, "srNo"])}</td>
              <td>{stage6Form2Input(["protectionRelay", r.code, "lastTested"])}</td>
              <td>{stage6Form2Input(["protectionRelay", r.code, "remark"])}</td>
            </tr>
          ))}

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>E</td>
            <td style={{ fontWeight: 700 }}>Separate earth pit for neutral earthling</td>
            <td></td>
            <td>{stage6Form2Input(["protectionRelay", "E", "yesNo"], { minWidth: 90 })}</td>
            <td>{stage6Form2Input(["protectionRelay", "E", "lastTested"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "E", "remark"])}</td>
          </tr>

          {[
            { code: "F", label: "Neutral earth pit resistance values" },
            { code: "G", label: "Grid earth resistance values" },
            { code: "H", label: "Cleaning & Checking for the main tank Earthing" },
          ].map((r) => (
            <tr key={`pr-${r.code}`}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{r.code}</td>
              <td style={{ fontWeight: 700 }}>{r.label}</td>
              <td>{stage6Form2Input(["protectionRelay", r.code, "make"])}</td>
              <td>{stage6Form2Input(["protectionRelay", r.code, "srNo"])}</td>
              <td>{stage6Form2Input(["protectionRelay", r.code, "lastTested"])}</td>
              <td>{stage6Form2Input(["protectionRelay", r.code, "remark"])}</td>
            </tr>
          ))}

          {/* LA Counter reading */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }} rowSpan={2}>
              I
            </td>
            <td style={{ fontWeight: 700 }} rowSpan={2}>
              LA Counter reading
            </td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>1.1</td>
            <td>{stage6Form2Input(["protectionRelay", "I", "srNo", "1.1"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "I", "lastTested", "1.1"])}</td>
            <td rowSpan={2}>{stage6Form2Input(["protectionRelay", "I", "remark"])}</td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>1.2</td>
            <td>{stage6Form2Input(["protectionRelay", "I", "srNo", "1.2"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "I", "lastTested", "1.2"])}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>2.1</td>
            <td>{stage6Form2Input(["protectionRelay", "I", "srNo", "2.1"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "I", "lastTested", "2.1"])}</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>2.2</td>
            <td>{stage6Form2Input(["protectionRelay", "I", "srNo", "2.2"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "I", "lastTested", "2.2"])}</td>
            <td></td>
          </tr>

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>J</td>
            <td style={{ fontWeight: 700 }}>Whether LA Earthing checked</td>
            <td>{stage6Form2Input(["protectionRelay", "J", "make"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "J", "srNo"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "J", "lastTested"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "J", "remark"])}</td>
          </tr>

          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>K</td>
            <td style={{ fontWeight: 700 }}>IR Value of LA</td>
            <td>{stage6Form2Input(["protectionRelay", "K", "make"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "K", "srNo"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "K", "lastTested"])}</td>
            <td>{stage6Form2Input(["protectionRelay", "K", "remark"])}</td>
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
              <td>{stage6Form2Input(["protectionRelay", r.code, "make"])}</td>
              <td>{stage6Form2Input(["protectionRelay", r.code, "srNo"])}</td>
              <td>{stage6Form2Input(["protectionRelay", r.code, "lastTested"])}</td>
              <td>{stage6Form2Input(["protectionRelay", r.code, "remark"])}</td>
            </tr>
          ))}

          {/* IV Accessories Checking */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>IV</td>
            <td style={{ fontWeight: 700 }}>Accessories&nbsp;&nbsp;Checking</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>SET Temp.</td>
            <td style={{ textAlign: "center", fontWeight: 700 }} colSpan={2}>
              Checked
            </td>
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
              <td>{stage6Form2Input(["accessoriesChecking", r.code, "setTemp"])}</td>
              <td colSpan={2}>{stage6Form2Input(["accessoriesChecking", r.code, "checked"])}</td>
              <td>{stage6Form2Input(["accessoriesChecking", r.code, "hrsRun"])}</td>
            </tr>
          ))}

          {/* V OCTC TAP Position */}
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
              <td colSpan={4}>{stage6Form2Input(["octcTapPosition", r.code])}</td>
            </tr>
          ))}

          {/* VI Bushing Test Tap Earthed */}
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
            <td>{stage6Form2Input(["bushingTestTapEarthed", "hvChecked", "1.1"])}</td>
            <td>{stage6Form2Input(["bushingTestTapEarthed", "hvChecked", "1.2"])}</td>
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
            <td>{stage6Form2Input(["bushingTestTapEarthed", "lvChecked", "2.1"])}</td>
            <td>{stage6Form2Input(["bushingTestTapEarthed", "lvChecked", "2.2"])}</td>
            <td></td>
          </tr>

          {/* VII Oil Values */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>VII</td>
            <td style={{ fontWeight: 700 }}>Oil Values</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>BDV</td>
            <td colSpan={2} style={{ textAlign: "center", fontWeight: 700 }}>
              KV
            </td>
            <td></td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>A</td>
            <td style={{ fontWeight: 700 }}>BDV</td>
            <td colSpan={3}>{stage6Form2Input(["oilValues", "bdvKV"])}</td>
            <td></td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>B</td>
            <td style={{ fontWeight: 700 }}>Moisture Content</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>PPM</td>
            <td colSpan={2}>{stage6Form2Input(["oilValues", "moisturePPM"])}</td>
            <td></td>
          </tr>

          {/* VIII Final IR Values */}
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
              <td>{stage6Form2Input(["finalIR", r.key, "10"])}</td>
              <td>{stage6Form2Input(["finalIR", r.key, "60"])}</td>
              <td>{stage6Form2Input(["finalIR", r.key, "600"])}</td>
              <td>{stage6Form2Input(["finalIR", r.key, "pi"])}</td>
            </tr>
          ))}

          <tr>
            <td></td>
            <td style={{ fontWeight: 700 }}>Core to frame</td>
            <td colSpan={4}>{stage6Form2Input(["finalIR", "coreToFrame"])}</td>
          </tr>
          <tr>
            <td></td>
            <td style={{ fontWeight: 700 }}>Frame to Tank</td>
            <td colSpan={4}>{stage6Form2Input(["finalIR", "frameToTank"])}</td>
          </tr>
          <tr>
            <td></td>
            <td style={{ fontWeight: 700 }}>Removal link again tightens and check zero megger</td>
            <td colSpan={4}>{stage6Form2Input(["finalIR", "removalLinkTightensAndCheckZeroMegger"])}</td>
          </tr>

          {/* IX */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>IX</td>
            <td style={{ fontWeight: 700 }}>Oil Level in Conservator</td>
            <td colSpan={4}>{stage6Form2Input(["oilLevelInConservator"])}</td>
          </tr>

          {/* X */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>X</td>
            <td style={{ fontWeight: 700 }}>Connectors</td>
            <td style={{ textAlign: "center", fontWeight: 700 }} colSpan={2}>
              Conditions
            </td>
            <td colSpan={2} style={{ fontWeight: 700 }}>
              HV Jumpers
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td colSpan={2}>{stage6Form2Input(["connectors", "conditions"])}</td>
            <td colSpan={2}>{stage6Form2Input(["connectors", "hvJumpers", "1.1"])}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td colSpan={2}></td>
            <td colSpan={2}>{stage6Form2Input(["connectors", "hvJumpers", "1.2"])}</td>
          </tr>

          {/* XI (as per reference image): Connectors + LV Jumpers 2.1/2.2 */}
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
                  {stage6Form2Input(["connectorsLvJumpers", "2.1"])}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8, alignItems: "center" }}>
                  <strong>2.2</strong>
                  {stage6Form2Input(["connectorsLvJumpers", "2.2"])}
                </div>
              </div>
            </td>
          </tr>

          {/* XII + 1/2/3 rows */}
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>XII</td>
            <td style={{ fontWeight: 700 }} colSpan={5}>
              All CT Cable Terminated and Glands Sealed
              {stage6Form2Input(["ctCableAndGlandsSealed"], { marginTop: 6 })}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>1</td>
            <td style={{ fontWeight: 700 }} colSpan={5}>
              Anabond applied to HV Bushings
              {stage6Form2Input(["anabondAppliedHvBushings"], { marginTop: 6 })}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>2</td>
            <td style={{ fontWeight: 700 }} colSpan={5}>
              All joints properly sealed against Water Ingress
              {stage6Form2Input(["allJointsSealedAgainstWaterIngress"], { marginTop: 6 })}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", fontWeight: 700 }}>3</td>
            <td style={{ fontWeight: 700 }} colSpan={5}>
              All Foreign material cleared from Transformer
              {stage6Form2Input(["foreignMaterialCleared"], { marginTop: 6 })}
            </td>
          </tr>

          {/* Temperature row */}
          <tr>
            <td style={{ fontWeight: 700 }} colSpan={2}>
              Temperature of&nbsp;&nbsp;&nbsp;&nbsp;°C
            </td>
            <td style={{ fontWeight: 700, textAlign: "center" }}>WTI</td>
            <td>{stage6Form2Input(["temperature", "wti"])}</td>
            <td style={{ fontWeight: 700, textAlign: "center" }}>OTI</td>
            <td>{stage6Form2Input(["temperature", "oti"])}</td>
          </tr>

          {/* Remarks box */}
          <tr>
            <td colSpan={6} style={{ padding: 14, lineHeight: 1.6 }}>
              <strong>Remarks:</strong>{" "}
              The Transformer as mentioned above has been jointly cleared for charging as on{" "}
              {stage6Form2Input(["remarksChargingAsOn"], { minWidth: 140 })}
              . {stage6Form2Input(["remarksText"])}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signature blocks */}
      <div style={{ display: "flex", gap: 18, marginTop: 18, justifyContent: "space-between" }}>
        <table className="form-table" style={{ width: "50%", margin: 0 }}>
          <tbody>
            <tr>
              <td style={{ width: "45%", fontWeight: 700 }}>Checked By :</td>
              <td>{stage6Form2Input(["checkedBy", "name"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Signature :</td>
              <td>{stage6Form2Input(["checkedBy", "signature"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Date :</td>
              <td>{stage6Form2Input(["checkedBy", "date"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Reviewed By :</td>
              <td>{stage6Form2Input(["reviewedBy", "name"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Signature :</td>
              <td>{stage6Form2Input(["reviewedBy", "signature"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Date :</td>
              <td>{stage6Form2Input(["reviewedBy", "date"])}</td>
            </tr>
          </tbody>
        </table>

        <table className="form-table" style={{ width: "50%", margin: 0 }}>
          <tbody>
            <tr>
              <td style={{ width: "45%", fontWeight: 700 }}>Witnessed By :</td>
              <td>{stage6Form2Input(["witnessedBy", "name"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Signature :</td>
              <td>{stage6Form2Input(["witnessedBy", "signature"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Date :</td>
              <td>{stage6Form2Input(["witnessedBy", "date"])}</td>
            </tr>
            <tr>
              <td style={{ width: "45%", fontWeight: 700 }}>Witnessed By :</td>
              <td>{stage6Form2Input(["witnessedBy2", "name"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Signature :</td>
              <td>{stage6Form2Input(["witnessedBy2", "signature"])}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Date :</td>
              <td>{stage6Form2Input(["witnessedBy2", "date"])}</td>
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

      <PhotoUploadSection title="Stage 6 Form 2" photos={photoRequirements} onPhotoChange={handlePhotoChange} />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          {isLastFormOfStage ? "Submit Stage 6" : "Next Form"}
        </button>
      </div>
    </form>
  )
}

// Stage 7 Form: Work Completion Report
export function WorkCompletionReportForm({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Project Information
    customerName: "",
    orderNumber: "",
    location: "",

    // Transformer Details
    type: "V-Connected Transformer",
    capacity: "",
    voltageRating: "",
    make: "",
    serialNumber: "",

    // Completion details
    completionDate: "",
    chargingDate: "",
    commissioningDate: "",

    // Signatures
    signatures: {
      vpesName: "",
      vpesDesignation: "",
      vpesSignature: "",
      vpesDate: "",
      customerName: "",
      customerDesignation: "",
      customerSignature: "",
      customerDate: "",
    },

    ...initialData,
  })

  // useCallback prevents new function references on every render,
  // which would trigger the SignatureBox useEffect infinitely
  const handleSignatureChange = useCallback((key, type, value) => {
    setFormData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [`${key}${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
      },
    }))
  }, [])

  // Stable callbacks for each SignatureBox to prevent infinite re-render loop
  const handleVpesSignatureChange = useCallback(
    (signature) => handleSignatureChange("vpes", "signature", signature),
    [handleSignatureChange]
  )

  const handleCustomerSignatureChange = useCallback(
    (signature) => handleSignatureChange("customer", "signature", signature),
    [handleSignatureChange]
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
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
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#C41E3A" }}>V</div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>VISHVAS</div>
            <div
              style={{
                fontSize: "1.2rem",
                color: "#666",
                letterSpacing: "2px",
              }}
            >
              POWER
            </div>
            <div style={{ fontSize: "0.8rem", color: "#666" }}>
              (A unit of M/s Vishvas Power Engineering Services Pvt Ltd)
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              background: "#C41E3A",
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
              <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>25</div>
              <div style={{ fontSize: "0.7rem" }}>YEARS</div>
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
        <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>Transformers upto 220 kV 250 MVA</div>
      </div>

      <form onSubmit={handleSubmit}>
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
              value={formData.completionDate}
              onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
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
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
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
              value={formData.orderNumber}
              onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
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
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
            <strong>Type: – V-Connected Transformer</strong>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Capacity: </strong>
            <input
              type="text"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
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
              value={formData.voltageRating}
              onChange={(e) => setFormData({ ...formData, voltageRating: e.target.value })}
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
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
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
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
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
            Subject: <em>Completion of Transformer Erection, Testing and Commissioning Work</em>
          </h3>

          <p style={{ lineHeight: "1.6", marginBottom: "15px" }}>
            This is to certify that the erection, Testing and commissioning of the above-mentioned transformer has been
            completed in accordance with the terms and conditions of the referenced order.
          </p>

          <p style={{ lineHeight: "1.6", marginBottom: "15px" }}>
            The installation work has been jointly inspected and found satisfactory by the undersigned representatives.
            The transformer was successfully charged/commissioned on no-load at
            <input
              type="time"
              value={formData.chargingDate}
              onChange={(e) => setFormData({ ...formData, chargingDate: e.target.value })}
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
              value={formData.commissioningDate}
              onChange={(e) => setFormData({ ...formData, commissioningDate: e.target.value })}
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
                value={formData.signatures.vpesName}
                onChange={(e) => handleSignatureChange("vpes", "name", e.target.value)}
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
                value={formData.signatures.vpesDesignation}
                onChange={(e) => handleSignatureChange("vpes", "designation", e.target.value)}
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
              <SignatureBox
                label=""
                nameValue=""
                onNameChange={() => {}}
                onSignatureChange={handleVpesSignatureChange}
                initialSignature={formData.signatures.vpesSignature}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>Date: </strong>
              <input
                type="date"
                value={formData.signatures.vpesDate}
                onChange={(e) => handleSignatureChange("vpes", "date", e.target.value)}
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
                value={formData.signatures.customerName}
                onChange={(e) => handleSignatureChange("customer", "name", e.target.value)}
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
                value={formData.signatures.customerDesignation}
                onChange={(e) => handleSignatureChange("customer", "designation", e.target.value)}
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
              <SignatureBox
                label=""
                nameValue=""
                onNameChange={() => {}}
                onSignatureChange={handleCustomerSignatureChange}
                initialSignature={formData.signatures.customerSignature}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>Date: </strong>
              <input
                type="date"
                value={formData.signatures.customerDate}
                onChange={(e) => handleSignatureChange("customer", "date", e.target.value)}
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

        <div className="form-actions" style={{ marginTop: "50px" }}>
          {onPrevious && (
            <button type="button" onClick={onPrevious} className="prev-btn">
              Previous Form
            </button>
          )}
          <button type="submit" className="submit-btn">
            Submit Stage 7
          </button>
        </div>
      </form>
    </div>
  )
}

// Main V Connected 63 MVA Transformer Forms Component
const TractionTransformerForms = ({
  firstFormDataFromDB,
  projectName,
  companyName,
  stage,
  onFormSubmit,
  onBack,
  ProjectData,
  setSelectedMainCompany,
  selectedProjectForReview,
}) => {
  const [currentFormIndex, setCurrentFormIndex] = useState(0)
  const [formData, setFormData] = useState({})

  // Define stage forms mapping
  const stageFormsMapping = {
    1: [
      { component: Stage1Form1, name: "Name Plate Details Transformer/Reactor" },
      { component: Stage1Form2, name: "PROTOCOL FOR ACCESSORIES CHECKING" },
      { component: Stage1Form3, name: "CORE INSULATION CHECK: At 1 KV > 500 MΩ" },
      { component: Stage1Form4, name: "Pre erection Ratio test of turret CTs" },
      { component: Stage1Form5, name: "Pre erection Ratio test of turret CTs 2" },
      { component: Stage1Form6, name: "Pre erection Ratio test of turret CTs 3" },
      { component: Stage1Form7, name: "TAN DELTA AND CAPACITANCE TEST ON BUSHING" }
      ],
    2: [
      { component: Stage2Form1, name: "Record of Oil Handling" },
      { component: Stage2Form2, name: "IR After Erection" },
    ],
    3: [
      { component: Stage3Form1, name: "Vacuum Cycle Recording" },
    ],
    4: [
      { component: Stage4Form1, name: "Record Oil Filtration Main Tank" },
      { component: Stage4Form2, name: "IR Value Before Radiator Filtration" },
      { component: Stage4Form3, name: "Oil Filtration Combine" },
      { component: Stage4Form4, name: "IR & PI Value After Filtration" },
    ],
    5: [
      { component: Stage5Form1, name: "Magnetizing Current Test" },
      { component: Stage5Form2, name: "Polarity Test" },
      { component: Stage5Form3, name: "MAGNETISING CURRENT TEST" },
      { component: Stage5Form4, name: "Type of Test - Polarity Test" },
      { component: Stage5Form5, name: "IR Values of Transformer" },
      { component: Stage5Form6, name: "IR Values of Transformer" },
      { component: Stage5Form7, name: "IR Values of Transformer" },
      { component: Stage5Form8, name: "IR Values of Transformer" },
    ],
    6: [
      { component: Stage6Form1, name: "Pre-Commissioning Checklist" },
      { component: Stage6Form2, name: "Pre-Commissioning Checklist (Cont.)" }
    ],
    7: [
      { component: WorkCompletionReportForm, name: "Work Completion Report" }
    ]
  }

  const currentStageForms = stageFormsMapping[stage] || []
  const CurrentFormComponent = currentStageForms[currentFormIndex]?.component

  const handleFormSubmit = async (data) => {
    console.log("VConnected63MVA: handleFormSubmit → saving form data", data);

    try {
      // Build FormData for API submission
      const formDataToSend = new FormData();
      formDataToSend.append("projectName", projectName);
      formDataToSend.append("companyName", companyName);
      formDataToSend.append("stage", stage);
      formDataToSend.append("formNumber", currentFormIndex + 1);

      // Process form data
      Object.entries(data).forEach(([key, value]) => {
        if (key === "photos" && typeof value === "object") {
          Object.entries(value).forEach(([photoKey, file]) => {
            if (file instanceof File) {
              formDataToSend.append(`photos[${photoKey}]`, file);
            }
          });
        } else if (typeof value === "object") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value ?? "");
        }
      });

      //Submit to API
      await axios.post(
        `${BACKEND_API_BASE_URL}/api/tractionData/setTable`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update form completion status
      const isLastFormOfStage = currentFormIndex === currentStageForms.length - 1;
      
      if (isLastFormOfStage) {
        await axios.post(
          `${BACKEND_API_BASE_URL}/api/tractioncompany/updateFormsCompleted`,
          {
            projectName,
            companyName,
            formsCompleted: currentFormIndex + 1,
            status: "pending-approval",
            stage,
          }
        );

        // Update local state
        if (setSelectedMainCompany) {
          setSelectedMainCompany((prevCompany) => {
            if (prevCompany.companyName === companyName) {
              return {
                ...prevCompany,
                companyProjects: prevCompany.companyProjects.map((project) => {
                  if (project.name === projectName) {
                    const submittedStagesMap = {};
                    for (let i = 1; i <= 7; i++) {
                      submittedStagesMap[i.toString()] = i <= stage;
                    }
                    return {
                      ...project,
                      submittedStages: submittedStagesMap,
                      status: "pending-approval",
                    };
                  }
                  return project;
                }),
              };
            }
            return prevCompany;
          });
        }
      } else {
        await axios.post(
          `${BACKEND_API_BASE_URL}/api/tractioncompany/updateFormsCompleted`,
          {
            projectName,
            companyName,
            formsCompleted: currentFormIndex + 1,
          }
        );
      }

      // Update local form data
      const updatedFormData = { ...formData, [`form${currentFormIndex + 1}`]: data }
      setFormData(updatedFormData)

      // Navigate to next form or complete stage
      if (currentFormIndex < currentStageForms.length - 1) {
        setCurrentFormIndex(currentFormIndex + 1)
      } else {
        // All forms completed for this stage
        onFormSubmit(stage, updatedFormData, selectedProjectForReview)
      }

    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form. Please try again.");
    }
  }

  const handlePreviousForm = () => {
    if (currentFormIndex > 0) {
      setCurrentFormIndex(currentFormIndex - 1)
    } else {
      onBack()
    }
  }

  if (!CurrentFormComponent) {
    return (
      <div className="form-stage-container">
        <div className="form-header">
          <h2>No forms available for Stage {stage}</h2>
          <button onClick={onBack} className="back-btn">
            ← Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="form-stage-container">
      <div className="form-header">
        <div className="form-progress">
          <h2>
            Stage {stage} - Form {currentFormIndex + 1} of {currentStageForms.length}
          </h2>
          <p>{currentStageForms[currentFormIndex]?.name}</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentFormIndex + 1) / currentStageForms.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
         <button onClick={onBack} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <CurrentFormComponent
        onSubmit={handleFormSubmit}
        onPrevious={handlePreviousForm}
        initialData={formData[`form${currentFormIndex + 1}`] || {}}
        isLastFormOfStage={currentFormIndex === currentStageForms.length - 1}
        companyData={ProjectData}
        stage={stage}
        companyName={companyName}
        projectName={projectName}
      />
    </div>
  )
}


export default TractionTransformerForms
