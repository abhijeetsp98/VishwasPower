"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import "./form-styles.css"
import axios from "axios"
import { BACKEND_API_BASE_URL, ENABLE_IMAGE_COMPRESSION, IMAGE_COMPRESSION_MAX_WIDTH, IMAGE_COMPRESSION_QUALITY } from "./constant"
import { getUserInfo } from "../utils/auth"

// ─── Image compression utility (same as FormStage.js) ────────────────────────
const compressImage = (file, maxWidth, quality) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".jpg"),
            { type: "image/jpeg" }
          );
          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => resolve(file); // fallback: use original if compression fails
    img.src = URL.createObjectURL(file);
  });
};

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
    [isDrawing],
  )

  const startDrawing = useCallback((e) => {
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
    e.preventDefault()
  }, [])

  const stopDrawing = useCallback(() => {
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

  return {
    canvasRef,
    signatureDataUrl,
    clearCanvas,
    startDrawing,
    draw,
    stopDrawing,
  }
}

// Enhanced Photo Upload Component — matches FormStage.js implementation
const PhotoUploadSection = ({ title, photos, onPhotoChange, allowMultiple = false, initialPhotos = {} }) => {
  const [cameraStream, setCameraStream] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [currentPhotoKey, setCurrentPhotoKey] = useState(null)
  const [capturedPhotos, setCapturedPhotos] = useState({})
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Pre-populate previews from DB-loaded photo URLs
  useEffect(() => {
    if (initialPhotos && Object.keys(initialPhotos).length > 0) {
      setCapturedPhotos((prev) => {
        const merged = { ...prev }
        Object.keys(initialPhotos).forEach((key) => {
          if (!merged[key]) merged[key] = initialPhotos[key]
        })
        return merged
      })
    }
  }, [initialPhotos])

  // ✅ Assign srcObject + call play() AFTER the video element is rendered in the DOM
  useEffect(() => {
    if (showCamera && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play().catch((err) => console.error("Error playing video:", err))
    }
    return () => {
      stopCamera()
      Object.values(capturedPhotos).forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url)
      })
    }
  }, [showCamera, cameraStream])

  const startCamera = async (photoKey) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setCameraStream(stream)
      setShowCamera(true)
      setCurrentPhotoKey(photoKey)
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
      setCurrentPhotoKey(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && currentPhotoKey) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" })
            const previewUrl = URL.createObjectURL(blob)
            setCapturedPhotos((prev) => ({ ...prev, [currentPhotoKey]: previewUrl }))
            onPhotoChange(currentPhotoKey, file)
            stopCamera()
          }
        },
        "image/jpeg",
        0.8,
      )
    }
  }

  const removePhoto = (photoKey) => {
    setCapturedPhotos((prev) => {
      const next = { ...prev }
      if (next[photoKey] && next[photoKey].startsWith("blob:")) URL.revokeObjectURL(next[photoKey])
      delete next[photoKey]
      return next
    })
    onPhotoChange(photoKey, null)
  }

  const handleFileSelect = (photoKey, files) => {
    if (allowMultiple && files.length > 1) {
      Array.from(files).forEach((file, index) => {
        const key = `${photoKey}_${index}`
        const previewUrl = URL.createObjectURL(file)
        setCapturedPhotos((prev) => ({ ...prev, [key]: previewUrl }))
        onPhotoChange(key, file)
      })
    } else {
      const file = files[0]
      if (file) {
        const previewUrl = URL.createObjectURL(file)
        setCapturedPhotos((prev) => ({ ...prev, [photoKey]: previewUrl }))
        onPhotoChange(photoKey, file)
      }
    }
  }

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
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                capturePhoto()
              }}
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
              type="button"
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

            {/* ✅ Image preview with remove button — same as Auto Transformer */}
            {capturedPhotos[photo.key] && (
              <div style={{ marginTop: "10px", position: "relative" }}>
                <img
                  src={capturedPhotos[photo.key]}
                  alt={`Preview for ${photo.label}`}
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "2px solid #4CAF50",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.key)}
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>
            )}

            <div className="upload-options" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  startCamera(photo.key)
                }}
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
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  const previewUrl = URL.createObjectURL(file)
                  setCapturedPhotos((prev) => ({ ...prev, [photo.key]: previewUrl }))
                  onPhotoChange(photo.key, file)
                }
              }}
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
  const { canvasRef, signatureDataUrl, clearCanvas, startDrawing, draw, stopDrawing } = useSignatureCanvas(initialSignature)

  useEffect(() => {
    if (signatureDataUrl) {
      onSignatureChange(signatureDataUrl)
    }
  }, [signatureDataUrl, onSignatureChange])

  return (
    <div className="signature-box">
      <label>{label}</label>
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
          msUserSelect: "none",
        }}
      />
      <button type="button" onClick={clearCanvas} className="clear-signature-btn">
        Clear Signature
      </button>
      <small>Sign above</small>
    </div>
  )
}

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
    noOfOilPump: "",
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
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 1,
          formNumber: 1,
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
              <strong>CURRENT HV</strong>
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
              <strong>LV</strong>
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
              <strong>Temp. Rise over amb. Oil (°C)</strong>
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
              <strong>Winding (°C)</strong>
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
              <strong>NO OF OIL PUMP</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.noOfOilPump}
                onChange={(e) => setFormData({ ...formData, noOfOilPump: e.target.value })}
              />
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

// Stage 2 Forms
export function Stage1Form2({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
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
  ]

  const [formData, setFormData] = useState({
    accessoriesRows: defaultRows.map((r) => ({
      packingCaseNumber: "",
      materialDescription: r.materialDescription,
      qtyAsPerPL: "",
      qtyReceived: "",
      shortQty: "",
      damagedQty: "",
    })),
    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 1,
          formNumber: 2,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage1Form2")
          setFormData((prev) => {
            const incoming = response.data.data || {}
            const incomingRows =
              incoming.accessoriesRows && Array.isArray(incoming.accessoriesRows) && incoming.accessoriesRows.length
                ? incoming.accessoriesRows
                : prev.accessoriesRows

            // Ensure we always have the default 13 lines and the fixed descriptions
            const mergedRows = defaultRows.map((r, idx) => {
              const src = incomingRows[idx] || {}
              return {
                packingCaseNumber: src.packingCaseNumber || "",
                materialDescription: r.materialDescription,
                qtyAsPerPL: src.qtyAsPerPL || "",
                qtyReceived: src.qtyReceived || "",
                shortQty: src.shortQty || "",
                damagedQty: src.damagedQty || "",
              }
            })

            return { ...prev, ...incoming, accessoriesRows: mergedRows }
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

  const setRow = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      accessoriesRows: (prev.accessoriesRows || []).map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "accessories", label: "Accessories" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>ACCESSORIES CHECKING</h2>
      </div>

      <table className="form-table" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "6%" }}>No</th>
            <th style={{ width: "19%" }}>Packing case Number</th>
            <th style={{ width: "20%" }}>Material Description</th>
            <th style={{ width: "13%" }}>Qty as per P. L</th>
            <th style={{ width: "13%" }}>Qty. Received</th>
            <th style={{ width: "13%" }}>Short Qty</th>
            <th style={{ width: "16%" }}>Damaged Qty.</th>
          </tr>
        </thead>
        <tbody>
          {(formData.accessoriesRows || []).map((row, idx) => (
            <tr key={idx}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{idx + 1}</td>
              <td>
                <input
                  type="text"
                  value={row.packingCaseNumber || ""}
                  onChange={(e) => setRow(idx, "packingCaseNumber", e.target.value)}
                />
              </td>
              <td style={{ fontWeight: 700, padding: "10px 12px" }}>{row.materialDescription}</td>
              <td>
                <input type="text" value={row.qtyAsPerPL || ""} onChange={(e) => setRow(idx, "qtyAsPerPL", e.target.value)} />
              </td>
              <td>
                <input type="text" value={row.qtyReceived || ""} onChange={(e) => setRow(idx, "qtyReceived", e.target.value)} />
              </td>
              <td>
                <input type="text" value={row.shortQty || ""} onChange={(e) => setRow(idx, "shortQty", e.target.value)} />
              </td>
              <td>
                <input type="text" value={row.damagedQty || ""} onChange={(e) => setRow(idx, "damagedQty", e.target.value)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection title="Accessories" photos={photoRequirements} onPhotoChange={handlePhotoChange} />

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

export function Stage1Form3({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
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
  ]

  const defaultSafetyItems = [
    { description: "Fire extinguisher/ Fire sand bucket" },
    { description: "First aid kit" },
    { description: "PPE for the working team of ETC agency, like- Safety shoes, Helmet, etc..." },
  ]

  const [formData, setFormData] = useState({
    coreInsulation: {
      coreToFrame: { obtainedValue: "", remarks: "" },
      frameToTank: { obtainedValue: "", remarks: "" },
      coreToTank: { obtainedValue: "", remarks: "" },
    },

    equipment: defaultEquipmentItems.map((it) => ({
      srNo: it.srNo,
      description: it.description,
      ratingCapacity: "",
      checkedBy: "",
      ratingHint: it.ratingHint || "",
    })),

    safety: defaultSafetyItems.map((it) => ({
      description: it.description,
      confirmation: "",
    })),

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 1,
          formNumber: 3,
        })

        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage1Form3")
          setFormData((prev) => {
            const incoming = response.data.data || {}

            const incomingEquipment =
              incoming.equipment && Array.isArray(incoming.equipment) && incoming.equipment.length
                ? incoming.equipment
                : prev.equipment

            const mergedEquipment = defaultEquipmentItems.map((it, idx) => {
              const src = incomingEquipment[idx] || {}
              return {
                srNo: it.srNo,
                description: it.description,
                ratingCapacity: src.ratingCapacity || "",
                checkedBy: src.checkedBy || "",
                ratingHint: it.ratingHint || "",
              }
            })

            const incomingSafety =
              incoming.safety && Array.isArray(incoming.safety) && incoming.safety.length ? incoming.safety : prev.safety

            const mergedSafety = defaultSafetyItems.map((it, idx) => {
              const src = incomingSafety[idx] || {}
              return {
                description: it.description,
                confirmation: src.confirmation || "",
              }
            })

            return {
              ...prev,
              ...incoming,
              coreInsulation: incoming.coreInsulation ? incoming.coreInsulation : prev.coreInsulation,
              equipment: mergedEquipment,
              safety: mergedSafety,
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

  const setCoreInsulation = (rowKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      coreInsulation: {
        ...(prev.coreInsulation || {}),
        [rowKey]: {
          ...((prev.coreInsulation || {})[rowKey] || {}),
          [field]: value,
        },
      },
    }))
  }

  const setEquipment = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      equipment: (prev.equipment || []).map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
  }

  const setSafety = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      safety: (prev.safety || []).map((row, i) => (i === index ? { ...row, confirmation: value } : row)),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "dryAirArrangement", label: "Dry Air Arrangement" },
    { key: "dewPointMeter", label: "Dew point meter" },
    { key: "mecLeodGauge", label: "Mec Leod gauge" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div style={{ marginTop: "10px", textAlign: "center", fontWeight: 900, fontSize: "18px" }}>
        CORE INSULATION CHECK:&nbsp;&nbsp; At 1 KV {"\u003E"} 500 MΩ
      </div>

      <table className="form-table" style={{ marginTop: "12px", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "38%" }}></th>
            <th style={{ width: "31%" }}>Obtained Value (MΩ)</th>
            <th style={{ width: "31%" }}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 800 }}>Between Core – frame</td>
            <td>
              <input
                type="text"
                value={formData.coreInsulation?.coreToFrame?.obtainedValue || ""}
                onChange={(e) => setCoreInsulation("coreToFrame", "obtainedValue", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.coreInsulation?.coreToFrame?.remarks || ""}
                onChange={(e) => setCoreInsulation("coreToFrame", "remarks", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Between Frame – tank</td>
            <td>
              <input
                type="text"
                value={formData.coreInsulation?.frameToTank?.obtainedValue || ""}
                onChange={(e) => setCoreInsulation("frameToTank", "obtainedValue", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.coreInsulation?.frameToTank?.remarks || ""}
                onChange={(e) => setCoreInsulation("frameToTank", "remarks", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Between core – tank</td>
            <td>
              <input
                type="text"
                value={formData.coreInsulation?.coreToTank?.obtainedValue || ""}
                onChange={(e) => setCoreInsulation("coreToTank", "obtainedValue", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.coreInsulation?.coreToTank?.remarks || ""}
                onChange={(e) => setCoreInsulation("coreToTank", "remarks", e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "28px", textAlign: "center", fontWeight: 900, fontSize: "16px" }}>
        CHECKLIST FOR CONFORMING AVAILABILITY OF EQUIPMENT AT SITE
      </div>

      <table className="form-table" style={{ marginTop: "12px", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "7%" }}></th>
            <th style={{ width: "48%" }}>Description</th>
            <th style={{ width: "25%" }}>Rating/capacity</th>
            <th style={{ width: "20%" }}>Checked by</th>
          </tr>
        </thead>
        <tbody>
          {(formData.equipment || []).map((row, idx) => (
            <tr key={row.srNo || idx}>
              <td style={{ textAlign: "center", fontWeight: 800 }}>{row.srNo}.</td>
              <td style={{ fontWeight: 800, padding: "10px 12px" }}>{row.description}</td>
              <td>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {row.ratingHint ? <div style={{ fontWeight: 700, color: "#111" }}>{row.ratingHint}</div> : null}
                  <input
                    type="text"
                    value={row.ratingCapacity || ""}
                    onChange={(e) => setEquipment(idx, "ratingCapacity", e.target.value)}
                  />
                </div>
              </td>
              <td>
                <input type="text" value={row.checkedBy || ""} onChange={(e) => setEquipment(idx, "checkedBy", e.target.value)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "18px", textAlign: "center", fontWeight: 900 }}>SAFETY EQUIPMENT</div>

      <table className="form-table" style={{ marginTop: "10px", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "70%" }}>Descriptions</th>
            <th style={{ width: "30%" }}>Confirmation</th>
          </tr>
        </thead>
        <tbody>
          {(formData.safety || []).map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 800, padding: "10px 12px" }}>{row.description}</td>
              <td>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontWeight: 700 }}>(Yes/No)</div>
                  <input type="text" value={row.confirmation || ""} onChange={(e) => setSafety(idx, e.target.value)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Note: - Photographs to be added of Above-mentioned point. Dry Air Arrangement, dew point meter, Mec Leod gauge"
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

export function Stage1Form4({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const currentPercentRows = [20, 40, 60, 80, 100]
  const kneePercentRows = [20, 40, 60, 80, 100, 110]

  const [formData, setFormData] = useState({
    phase11: {
      ctRatioCoreS1S2: currentPercentRows.reduce((acc, p) => {
        acc[p] = { appliedPrimaryCurrentA: "", measuredSecondaryCurrentA: "" }
        return acc
      }, {}),
      kneePointVoltage: kneePercentRows.reduce((acc, p) => {
        acc[p] = { appliedVoltage: "", measuredCurrentA: "" }
        return acc
      }, {}),
    },

    phase12: {
      ctRatioCoreS1S2: currentPercentRows.reduce((acc, p) => {
        acc[p] = { appliedPrimaryCurrentA: "", measuredSecondaryCurrentA: "" }
        return acc
      }, {}),
      kneePointVoltage: kneePercentRows.reduce((acc, p) => {
        acc[p] = { appliedVoltage: "", measuredCurrentA: "" }
        return acc
      }, {}),
    },

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 1,
          formNumber: 4,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage1Form4")
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

  const setCTRatioValue = (phaseKey, percent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [phaseKey]: {
        ...(prev[phaseKey] || {}),
        ctRatioCoreS1S2: {
          ...((prev[phaseKey] || {}).ctRatioCoreS1S2 || {}),
          [percent]: { ...(((prev[phaseKey] || {}).ctRatioCoreS1S2 || {})[percent] || {}), [field]: value },
        },
      },
    }))
  }

  const setKneeValue = (phaseKey, percent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [phaseKey]: {
        ...(prev[phaseKey] || {}),
        kneePointVoltage: {
          ...((prev[phaseKey] || {}).kneePointVoltage || {}),
          [percent]: { ...(((prev[phaseKey] || {}).kneePointVoltage || {})[percent] || {}), [field]: value },
        },
      },
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "ctRatioKit", label: "CT Ratio kit calibration" }]

  const renderPhaseBlock = (title, phaseKey) => (
    <div style={{ marginTop: "26px" }}>
      <table className="form-table">
        <thead>
          <tr>
            <th style={{ width: "40%", textAlign: "left" }}>CT Ratio CORE – S1-S2</th>
            <th style={{ width: "60%", textAlign: "center", fontSize: "18px", fontWeight: 900 }}>{title}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="2" style={{ padding: 0 }}>
              <table className="form-table" style={{ marginTop: 0, border: "none" }}>
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Current %</th>
                    <th style={{ width: "40%" }}>Applied primary Current (A)</th>
                    <th style={{ width: "40%" }}>Measured secondary current (A)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPercentRows.map((p) => (
                    <tr key={`${phaseKey}-ct-${p}`}>
                      <td style={{ fontWeight: 700, textAlign: "center" }}>{p}%</td>
                      <td>
                        <input
                          type="text"
                          value={formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.appliedPrimaryCurrentA || ""}
                          onChange={(e) => setCTRatioValue(phaseKey, p, "appliedPrimaryCurrentA", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.measuredSecondaryCurrentA || ""}
                          onChange={(e) => setCTRatioValue(phaseKey, p, "measuredSecondaryCurrentA", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ fontWeight: 900, fontSize: "18px", marginTop: "10px", marginBottom: "6px" }}>Knee point Voltage</div>

      <table className="form-table">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Voltage %</th>
            <th style={{ width: "35%" }}>Applied voltage</th>
            <th style={{ width: "35%" }}>Measured current (mA)</th>
          </tr>
        </thead>
        <tbody>
          {kneePercentRows.map((p) => (
            <tr key={`${phaseKey}-knee-${p}`}>
              <td style={{ fontWeight: 700, textAlign: "center" }}>{p}%</td>
              <td>
                <input
                  type="text"
                  value={formData?.[phaseKey]?.kneePointVoltage?.[p]?.appliedVoltage || ""}
                  onChange={(e) => setKneeValue(phaseKey, p, "appliedVoltage", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.[phaseKey]?.kneePointVoltage?.[p]?.measuredCurrentA || ""}
                  onChange={(e) => setKneeValue(phaseKey, p, "measuredCurrentA", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2 style={{ fontWeight: 900 }}>Pre erection Ratio test of turret CTs</h2>
      </div>

      {renderPhaseBlock("Phase 1.1", "phase11")}

      {renderPhaseBlock("Phase 1.2", "phase12")}

      <PhotoUploadSection title="CT Ratio kit calibration." photos={photoRequirements} onPhotoChange={handlePhotoChange} />

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

export function Stage1Form5({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const currentPercentRows = [20, 40, 60, 80, 100]
  const kneePercentRows = [20, 40, 60, 80, 100, 110]

  const [formData, setFormData] = useState({
    phase21: {
      ctRatioCoreS1S2: currentPercentRows.reduce((acc, p) => {
        acc[p] = { appliedPrimaryCurrentA: "", measuredSecondaryCurrentA: "" }
        return acc
      }, {}),
      kneePointVoltage: kneePercentRows.reduce((acc, p) => {
        acc[p] = { appliedVoltage: "", measuredCurrentA: "" }
        return acc
      }, {}),
    },

    phase22: {
      ctRatioCoreS1S2: currentPercentRows.reduce((acc, p) => {
        acc[p] = { appliedPrimaryCurrentA: "", measuredSecondaryCurrentA: "" }
        return acc
      }, {}),
      kneePointVoltage: kneePercentRows.reduce((acc, p) => {
        acc[p] = { appliedVoltage: "", measuredCurrentA: "" }
        return acc
      }, {}),
    },

    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 1,
          formNumber: 5,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage1Form5")
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

  const setCTRatioValue = (phaseKey, percent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [phaseKey]: {
        ...(prev[phaseKey] || {}),
        ctRatioCoreS1S2: {
          ...((prev[phaseKey] || {}).ctRatioCoreS1S2 || {}),
          [percent]: { ...(((prev[phaseKey] || {}).ctRatioCoreS1S2 || {})[percent] || {}), [field]: value },
        },
      },
    }))
  }

  const setKneeValue = (phaseKey, percent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [phaseKey]: {
        ...(prev[phaseKey] || {}),
        kneePointVoltage: {
          ...((prev[phaseKey] || {}).kneePointVoltage || {}),
          [percent]: { ...(((prev[phaseKey] || {}).kneePointVoltage || {})[percent] || {}), [field]: value },
        },
      },
    }))
  }

  const renderPhaseBlock = (title, phaseKey) => (
    <div style={{ marginTop: "26px" }}>
      <table className="form-table">
        <thead>
          <tr>
            <th style={{ width: "40%", textAlign: "left" }}>CT Ratio CORE – S1-S2</th>
            <th style={{ width: "60%", textAlign: "center", fontSize: "18px", fontWeight: 900 }}>{title}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="2" style={{ padding: 0 }}>
              <table className="form-table" style={{ marginTop: 0, border: "none" }}>
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Current %</th>
                    <th style={{ width: "40%" }}>Applied primary Current (A)</th>
                    <th style={{ width: "40%" }}>Measured secondary current (A)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPercentRows.map((p) => (
                    <tr key={`${phaseKey}-ct-${p}`}>
                      <td style={{ fontWeight: 700, textAlign: "center" }}>{p}%</td>
                      <td>
                        <input
                          type="text"
                          value={formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.appliedPrimaryCurrentA || ""}
                          onChange={(e) => setCTRatioValue(phaseKey, p, "appliedPrimaryCurrentA", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.measuredSecondaryCurrentA || ""}
                          onChange={(e) => setCTRatioValue(phaseKey, p, "measuredSecondaryCurrentA", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ fontWeight: 900, fontSize: "18px", marginTop: "10px", marginBottom: "6px" }}>Knee point Voltage</div>

      <table className="form-table">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Voltage %</th>
            <th style={{ width: "35%" }}>Applied voltage</th>
            <th style={{ width: "35%" }}>Measured current (mA)</th>
          </tr>
        </thead>
        <tbody>
          {kneePercentRows.map((p) => (
            <tr key={`${phaseKey}-knee-${p}`}>
              <td style={{ fontWeight: 700, textAlign: "center" }}>{p}%</td>
              <td>
                <input
                  type="text"
                  value={formData?.[phaseKey]?.kneePointVoltage?.[p]?.appliedVoltage || ""}
                  onChange={(e) => setKneeValue(phaseKey, p, "appliedVoltage", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.[phaseKey]?.kneePointVoltage?.[p]?.measuredCurrentA || ""}
                  onChange={(e) => setKneeValue(phaseKey, p, "measuredCurrentA", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2 style={{ fontWeight: 900 }}>Pre erection Ratio test of turret CTs</h2>
      </div>

      {renderPhaseBlock("Phase 2.1", "phase21")}

      {renderPhaseBlock("Phase 2.2", "phase22")}

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

export function Stage1Form6({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const currentPercentRows = [20, 40, 60, 80, 100]
  const kneePercentRows = [20, 40, 60, 80, 100, 110]

  const [formData, setFormData] = useState({
    phase31: {
      ctRatioCoreS1S2: currentPercentRows.reduce((acc, p) => {
        acc[p] = { appliedPrimaryCurrentA: "", measuredSecondaryCurrentA: "" }
        return acc
      }, {}),
      kneePointVoltage: kneePercentRows.reduce((acc, p) => {
        acc[p] = { appliedVoltage: "", measuredCurrentA: "" }
        return acc
      }, {}),
    },

    phase32: {
      ctRatioCoreS1S2: currentPercentRows.reduce((acc, p) => {
        acc[p] = { appliedPrimaryCurrentA: "", measuredSecondaryCurrentA: "" }
        return acc
      }, {}),
      kneePointVoltage: kneePercentRows.reduce((acc, p) => {
        acc[p] = { appliedVoltage: "", measuredCurrentA: "" }
        return acc
      }, {}),
    },

    wti: currentPercentRows.reduce((acc, p) => {
      acc[p] = {
        appliedPrimaryCurrentA: "",
        measuredSecondaryCurrentS1S2A: "",
        measuredSecondaryCurrentS1S3A: "",
        measuredSecondaryCurrentS1S4A: "",
      }
      return acc
    }, {}),

    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 1,
          formNumber: 6,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage1Form6")
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

  const setCTRatioValue = (phaseKey, percent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [phaseKey]: {
        ...(prev[phaseKey] || {}),
        ctRatioCoreS1S2: {
          ...((prev[phaseKey] || {}).ctRatioCoreS1S2 || {}),
          [percent]: { ...(((prev[phaseKey] || {}).ctRatioCoreS1S2 || {})[percent] || {}), [field]: value },
        },
      },
    }))
  }

  const setKneeValue = (phaseKey, percent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [phaseKey]: {
        ...(prev[phaseKey] || {}),
        kneePointVoltage: {
          ...((prev[phaseKey] || {}).kneePointVoltage || {}),
          [percent]: { ...(((prev[phaseKey] || {}).kneePointVoltage || {})[percent] || {}), [field]: value },
        },
      },
    }))
  }

  const setWTIValue = (percent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      wti: {
        ...(prev.wti || {}),
        [percent]: { ...((prev.wti || {})[percent] || {}), [field]: value },
      },
    }))
  }

  const renderPhaseBlock = (title, phaseKey) => (
    <div style={{ marginTop: "18px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "8px", fontWeight: 800 }}>{title}</h3>

      <div style={{ fontWeight: 800, marginTop: "10px", marginBottom: "6px" }}>Ratio test</div>

      <table className="form-table" style={{ marginTop: "8px" }}>
        <thead>
          <tr>
            <th colSpan="3" style={{ textAlign: "left" }}>
              <span style={{ fontWeight: 800 }}>CT Ratio CORE – S1-S2</span>
            </th>
          </tr>
          <tr>
            <th style={{ width: "20%" }}>Current %</th>
            <th style={{ width: "40%" }}>Applied primary Current (A)</th>
            <th style={{ width: "40%" }}>Measured secondary current (A)</th>
          </tr>
        </thead>
        <tbody>
          {currentPercentRows.map((p) => (
            <tr key={`${phaseKey}-ct-${p}`}>
              <td style={{ fontWeight: 700, textAlign: "center" }}>{p}%</td>
              <td>
                <input
                  type="text"
                  value={formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.appliedPrimaryCurrentA || ""}
                  onChange={(e) => setCTRatioValue(phaseKey, p, "appliedPrimaryCurrentA", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.[phaseKey]?.ctRatioCoreS1S2?.[p]?.measuredSecondaryCurrentA || ""}
                  onChange={(e) => setCTRatioValue(phaseKey, p, "measuredSecondaryCurrentA", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ fontWeight: 900, fontSize: "18px", marginTop: "10px", marginBottom: "6px" }}>Knee point Voltage</div>

      <table className="form-table">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Voltage %</th>
            <th style={{ width: "35%" }}>Applied voltage</th>
            <th style={{ width: "35%" }}>Measured current (mA)</th>
          </tr>
        </thead>
        <tbody>
          {kneePercentRows.map((p) => (
            <tr key={`${phaseKey}-knee-${p}`}>
              <td style={{ fontWeight: 700, textAlign: "center" }}>{p}%</td>
              <td>
                <input
                  type="text"
                  value={formData?.[phaseKey]?.kneePointVoltage?.[p]?.appliedVoltage || ""}
                  onChange={(e) => setKneeValue(phaseKey, p, "appliedVoltage", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.[phaseKey]?.kneePointVoltage?.[p]?.measuredCurrentA || ""}
                  onChange={(e) => setKneeValue(phaseKey, p, "measuredCurrentA", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderWTIBlock = () => (
    <div style={{ marginTop: "18px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "8px", fontWeight: 900 }}>WTI</h3>

      <table className="form-table" style={{ marginTop: "8px" }}>
        <thead>
          <tr>
            <th colSpan="5" style={{ textAlign: "left" }}>
              <span style={{ fontWeight: 800 }}>CT Ratio CORE - S1-S2, S1-S3, S1-S4</span>
            </th>
          </tr>
          <tr>
            <th style={{ width: "15%" }}>Current %</th>
            <th style={{ width: "30%" }}>Applied primary Current (A)</th>
            <th colSpan="3" style={{ width: "55%" }}>
              Measured secondary current (A)
            </th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th style={{ width: "18%" }}>S1-S2</th>
            <th style={{ width: "18%" }}>S1-S3</th>
            <th style={{ width: "19%" }}>S1-S4</th>
          </tr>
        </thead>
        <tbody>
          {currentPercentRows.map((p) => (
            <tr key={`wti-${p}`}>
              <td style={{ fontWeight: 700, textAlign: "center" }}>{p}%</td>
              <td>
                <input
                  type="text"
                  value={formData?.wti?.[p]?.appliedPrimaryCurrentA || ""}
                  onChange={(e) => setWTIValue(p, "appliedPrimaryCurrentA", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.wti?.[p]?.measuredSecondaryCurrentS1S2A || ""}
                  onChange={(e) => setWTIValue(p, "measuredSecondaryCurrentS1S2A", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.wti?.[p]?.measuredSecondaryCurrentS1S3A || ""}
                  onChange={(e) => setWTIValue(p, "measuredSecondaryCurrentS1S3A", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData?.wti?.[p]?.measuredSecondaryCurrentS1S4A || ""}
                  onChange={(e) => setWTIValue(p, "measuredSecondaryCurrentS1S4A", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2 style={{ fontWeight: 900 }}>Pre erection Ratio test of turret CTs</h2>
      </div>

      {renderPhaseBlock("Phase 3.1", "phase31")}
      {renderPhaseBlock("Phase 3.2", "phase32")}
      {renderWTIBlock()}

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

export function Stage1Form7({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const hvPhases = ["1.1", "1.2"]
  const lvPhases = ["2.1", "2.2", "3.1", "3.2"]

  const makeStatusRow = (phase) => ({
    phase,
    tanDeltaPercent: "",
    capacitancePf: "",
    excitationCurrent: "",
    dielectricLoss: "",
  })

  const [formData, setFormData] = useState({
    meterUsed: "",
    modelAndSerialNo: "",
    date: "",
    time: "",
    wti: "",
    oti: "",

    bushingSrNoHv: "",
    hvAt5kv: hvPhases.map(makeStatusRow),
    hvAt10kv: hvPhases.map(makeStatusRow),

    bushingSrNoLv: "",
    lvAt5kv: lvPhases.map(makeStatusRow),
    lvAt10kv: lvPhases.map(makeStatusRow),

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 1,
          formNumber: 7,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage1Form7")

          setFormData((prev) => {
            const incoming = response.data.data || {}

            const normRows = (rows, phases) => {
              const inRows = Array.isArray(rows) ? rows : []
              return phases.map((phase, idx) => {
                const src = inRows[idx] || {}
                return {
                  phase,
                  tanDeltaPercent: src.tanDeltaPercent || "",
                  capacitancePf: src.capacitancePf || "",
                  excitationCurrent: src.excitationCurrent || "",
                  dielectricLoss: src.dielectricLoss || "",
                }
              })
            }

            return {
              ...prev,
              ...incoming,
              hvAt5kv: normRows(incoming.hvAt5kv, hvPhases),
              hvAt10kv: normRows(incoming.hvAt10kv, hvPhases),
              lvAt5kv: normRows(incoming.lvAt5kv, lvPhases),
              lvAt10kv: normRows(incoming.lvAt10kv, lvPhases),
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

  const setRowValue = (tableKey, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [tableKey]: (prev[tableKey] || []).map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "tenDeltaKit", label: "Ten delta kit" },
    { key: "calibrationReport", label: "Calibration report" },
    { key: "tandeltaBushingPhoto", label: "During tendelta of bushing photo" },
  ]

  const renderStatusTable = (title, tableKey) => (
    <table className="form-table" style={{ marginTop: "10px" }}>
      <thead>
        <tr>
          <th style={{ width: "16%" }}>{title}</th>
          <th style={{ width: "21%" }}>TAN DELTA in %</th>
          <th style={{ width: "21%" }}>CAPACITANCE (pF)</th>
          <th style={{ width: "21%" }}>EXCITATION CURRENT (mA)</th>
          <th style={{ width: "21%" }}>DIELECTRIC LOSS</th>
        </tr>
      </thead>
      <tbody>
        {(formData[tableKey] || []).map((row, idx) => (
          <tr key={`${tableKey}-${row.phase}-${idx}`}>
            <td style={{ textAlign: "center", fontWeight: 800 }}>{row.phase}</td>
            <td>
              <input
                type="text"
                value={row.tanDeltaPercent || ""}
                onChange={(e) => setRowValue(tableKey, idx, "tanDeltaPercent", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={row.capacitancePf || ""}
                onChange={(e) => setRowValue(tableKey, idx, "capacitancePf", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={row.excitationCurrent || ""}
                onChange={(e) => setRowValue(tableKey, idx, "excitationCurrent", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={row.dielectricLoss || ""}
                onChange={(e) => setRowValue(tableKey, idx, "dielectricLoss", e.target.value)}
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
        <h2>TEST REPORT</h2>
        <h3 style={{ marginTop: "6px", fontWeight: 900 }}>TAN DELTA AND CAPACITANCE TEST ON BUSHING</h3>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td style={{ width: "25%", fontWeight: 800 }}>METER USED</td>
            <td style={{ width: "25%" }}>
              <input type="text" value={formData.meterUsed || ""} onChange={(e) => setFormData({ ...formData, meterUsed: e.target.value })} />
            </td>
            <td style={{ width: "25%", fontWeight: 800 }}>DATE:</td>
            <td style={{ width: "25%" }}>
              <input type="date" value={formData.date || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>MODEL & S. NO.</td>
            <td>
              <input
                type="text"
                value={formData.modelAndSerialNo || ""}
                onChange={(e) => setFormData({ ...formData, modelAndSerialNo: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>TIME :</td>
            <td>
              <input type="time" value={formData.time || ""} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}></td>
            <td></td>
            <td style={{ fontWeight: 800 }}>WTI:</td>
            <td>
              <input type="text" value={formData.wti || ""} onChange={(e) => setFormData({ ...formData, wti: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}></td>
            <td></td>
            <td style={{ fontWeight: 800 }}>OTI:</td>
            <td>
              <input type="text" value={formData.oti || ""} onChange={(e) => setFormData({ ...formData, oti: e.target.value })} />
            </td>
          </tr>

          {/* Bushing details (HV/LV) merged into the header table */}
          <tr>
            <td style={{ width: "25%", fontWeight: 800 }}>BUSHING SR. NO. (HV)</td>
            <td style={{ width: "25%" }}>
              <input
                type="text"
                value={formData.hvBushingSrNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hvBushingSrNo: e.target.value })
                }
              />
            </td>
            <td style={{ width: "25%", fontWeight: 800 }}>MAKE</td>
            <td style={{ width: "25%" }}>
              <input
                type="text"
                value={formData.hvBushingMake || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hvBushingMake: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>BUSHING SR. NO. (LV)</td>
            <td>
              <input
                type="text"
                value={formData.lvBushingSrNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lvBushingSrNo: e.target.value })
                }
              />
            </td>
            <td>{/* MAKE label intentionally omitted to avoid duplicate */}</td>
            <td>
              <input
                type="text"
                value={formData.lvBushingMake || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lvBushingMake: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "14px" }}>
        <thead>
          <tr>
            <th style={{ width: "34%", textAlign: "left" }}>BUSHING SR. NO.HV</th>
            <th style={{ width: "33%" }}>1.1</th>
            <th style={{ width: "33%" }}>1.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                value={formData.bushingSrNoHv || ""}
                onChange={(e) => setFormData({ ...formData, bushingSrNoHv: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingSrNoHv_11 || ""}
                onChange={(e) => setFormData({ ...formData, bushingSrNoHv_11: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingSrNoHv_12 || ""}
                onChange={(e) => setFormData({ ...formData, bushingSrNoHv_12: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "12px", fontWeight: 900 }}>STATUS:</div>
      {renderStatusTable("AT 05 KV PHASE", "hvAt5kv")}
      {renderStatusTable("AT 10 KV PHASE", "hvAt10kv")}

      <div style={{ marginTop: "26px", textAlign: "center", fontWeight: 900, fontSize: "16px" }}>
        TYPE OF TEST – TAN DELTA AND CAPACITANCE TEST ON LV BUSHING
      </div>

      <table className="form-table" style={{ marginTop: "14px" }}>
        <thead>
          <tr>
            <th style={{ width: "34%", textAlign: "left" }}>BUSHING SR. NO.LV</th>
            <th style={{ width: "16.5%" }}>2.1</th>
            <th style={{ width: "16.5%" }}>2.2</th>
            <th style={{ width: "16.5%" }}>3.1</th>
            <th style={{ width: "16.5%" }}>3.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                value={formData.bushingSrNoLv || ""}
                onChange={(e) => setFormData({ ...formData, bushingSrNoLv: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingSrNoLv_21 || ""}
                onChange={(e) => setFormData({ ...formData, bushingSrNoLv_21: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingSrNoLv_22 || ""}
                onChange={(e) => setFormData({ ...formData, bushingSrNoLv_22: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingSrNoLv_31 || ""}
                onChange={(e) => setFormData({ ...formData, bushingSrNoLv_31: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingSrNoLv_32 || ""}
                onChange={(e) => setFormData({ ...formData, bushingSrNoLv_32: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "12px", fontWeight: 900 }}>STATUS:</div>
      {renderStatusTable("AT 05 KV PHASE", "lvAt5kv")}
      {renderStatusTable("AT 10 KV PHASE", "lvAt10kv")}

      <PhotoUploadSection
        title="Ten delta kit, calibration report, during tendelta of bushing photo"
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

export function Stage1Form8({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    // Header fields (as per image: Record of Measurement of IR Values - Before Erection)
    date: "",
    time: "",
    ambTemp: "",
    oilTemp: "",
    wdgTemp: "",
    relativeHumidity: "",

    make: "",
    srNo: "",
    range: "",
    voltageLevel: "",

    // IR table fields (10 sec / 60 sec / ratio)
    hvEarth_10sec: "",
    hvEarth_60sec: "",
    hvEarth_ratio: "",

    lv1Earth_10sec: "",
    lv1Earth_60sec: "",
    lv1Earth_ratio: "",

    lv2Earth_10sec: "",
    lv2Earth_60sec: "",
    lv2Earth_ratio: "",

    hvLv1_10sec: "",
    hvLv1_60sec: "",
    hvLv1_ratio: "",

    hvLv2_10sec: "",
    hvLv2_60sec: "",
    hvLv2_ratio: "",

    lv1Lv2_10sec: "",
    lv1Lv2_60sec: "",
    lv1Lv2_ratio: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 1,
          formNumber: 8,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage1Form8")
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

  const photoRequirements = [
    { key: "irTester", label: "IR tester" },
    { key: "calibrationReport", label: "calibration report" },
    { key: "ir60SecValue", label: "60 sec IR value" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>RECORD OF MEASUREMENT OF IR VALUES</h2>
        <h3 style={{ marginTop: "6px", fontWeight: 900 }}>Before Erection</h3>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td style={{ width: "12%", fontWeight: 800 }}>Date :</td>
            <td style={{ width: "20%" }}>
              <input type="date" value={formData.date || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </td>
            <td style={{ width: "12%", fontWeight: 800 }}>Time :</td>
            <td style={{ width: "20%" }}>
              <input type="time" value={formData.time || ""} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
            </td>
            <td style={{ width: "36%", fontWeight: 800, textAlign: "center" }}></td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Amb. Temp :</td>
            <td>
              <input type="text" value={formData.ambTemp || ""} onChange={(e) => setFormData({ ...formData, ambTemp: e.target.value })} />
            </td>
            <td style={{ fontWeight: 800 }}>Make :</td>
            <td>
              <input type="text" value={formData.make || ""} onChange={(e) => setFormData({ ...formData, make: e.target.value })} />
            </td>
            <td rowSpan="4"></td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Oil Temp. :</td>
            <td>
              <input type="text" value={formData.oilTemp || ""} onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })} />
            </td>
            <td style={{ fontWeight: 800 }}>Sr. No. :</td>
            <td>
              <input type="text" value={formData.srNo || ""} onChange={(e) => setFormData({ ...formData, srNo: e.target.value })} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Wdg. Temp. :</td>
            <td>
              <input type="text" value={formData.wdgTemp || ""} onChange={(e) => setFormData({ ...formData, wdgTemp: e.target.value })} />
            </td>
            <td style={{ fontWeight: 800 }}>Range :</td>
            <td>
              <input type="text" value={formData.range || ""} onChange={(e) => setFormData({ ...formData, range: e.target.value })} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Relative Humidity :</td>
            <td>
              <input
                type="text"
                value={formData.relativeHumidity || ""}
                onChange={(e) => setFormData({ ...formData, relativeHumidity: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>Voltage Level :</td>
            <td>
              <input type="text" value={formData.voltageLevel || ""} onChange={(e) => setFormData({ ...formData, voltageLevel: e.target.value })} />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "26px" }}>
        <thead>
          <tr>
            <th style={{ width: "26%" }}></th>
            <th style={{ width: "18%" }}>
              10 Sec <br />
              (MΩ)
            </th>
            <th style={{ width: "18%" }}>
              60 Sec <br />
              (MΩ)
            </th>
            <th style={{ width: "38%" }}>Ratio of IR 60/IR 10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 800 }}>HV-Earth</td>
            <td>
              <input type="text" value={formData.hvEarth_10sec || ""} onChange={(e) => setFormData({ ...formData, hvEarth_10sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.hvEarth_60sec || ""} onChange={(e) => setFormData({ ...formData, hvEarth_60sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.hvEarth_ratio || ""} onChange={(e) => setFormData({ ...formData, hvEarth_ratio: e.target.value })} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>LV1-Earth</td>
            <td>
              <input type="text" value={formData.lv1Earth_10sec || ""} onChange={(e) => setFormData({ ...formData, lv1Earth_10sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.lv1Earth_60sec || ""} onChange={(e) => setFormData({ ...formData, lv1Earth_60sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.lv1Earth_ratio || ""} onChange={(e) => setFormData({ ...formData, lv1Earth_ratio: e.target.value })} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>LV2-Earth</td>
            <td>
              <input type="text" value={formData.lv2Earth_10sec || ""} onChange={(e) => setFormData({ ...formData, lv2Earth_10sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.lv2Earth_60sec || ""} onChange={(e) => setFormData({ ...formData, lv2Earth_60sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.lv2Earth_ratio || ""} onChange={(e) => setFormData({ ...formData, lv2Earth_ratio: e.target.value })} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>HV-LV1</td>
            <td>
              <input type="text" value={formData.hvLv1_10sec || ""} onChange={(e) => setFormData({ ...formData, hvLv1_10sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.hvLv1_60sec || ""} onChange={(e) => setFormData({ ...formData, hvLv1_60sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.hvLv1_ratio || ""} onChange={(e) => setFormData({ ...formData, hvLv1_ratio: e.target.value })} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>HV-LV2</td>
            <td>
              <input type="text" value={formData.hvLv2_10sec || ""} onChange={(e) => setFormData({ ...formData, hvLv2_10sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.hvLv2_60sec || ""} onChange={(e) => setFormData({ ...formData, hvLv2_60sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.hvLv2_ratio || ""} onChange={(e) => setFormData({ ...formData, hvLv2_ratio: e.target.value })} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>LV1-LV2</td>
            <td>
              <input type="text" value={formData.lv1Lv2_10sec || ""} onChange={(e) => setFormData({ ...formData, lv1Lv2_10sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.lv1Lv2_60sec || ""} onChange={(e) => setFormData({ ...formData, lv1Lv2_60sec: e.target.value })} />
            </td>
            <td>
              <input type="text" value={formData.lv1Lv2_ratio || ""} onChange={(e) => setFormData({ ...formData, lv1Lv2_ratio: e.target.value })} />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection title="IR tester, calibration report, 60 sec IR value." photos={photoRequirements} onPhotoChange={handlePhotoChange} />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 1
        </button>
      </div>
    </form>
  )
}

export function Stage2Form1({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Record of Oil Filling in the Reservoirs Tank
    reservoirTanks: {
      tank1: { noOfBarrels: "", startedOn: "", completedOn: "", bdv: "", ppm: "" },
      tank2: { noOfBarrels: "", startedOn: "", completedOn: "", bdv: "", ppm: "" },
      tank3: { noOfBarrels: "", startedOn: "", completedOn: "", bdv: "", ppm: "" },
    },

    // Reservoir Tank Filtration records
    filtrationRecords: Array(25)
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
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 2,
          formNumber: 1,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage2Form1")
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

  const handleReservoirChange = (tankKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      reservoirTanks: {
        ...prev.reservoirTanks,
        [tankKey]: {
          ...(prev.reservoirTanks?.[tankKey] || {}),
          [field]: value,
        },
      },
    }))
  }

  const handleFiltrationRecordChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      filtrationRecords: prev.filtrationRecords.map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
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
    { key: "reservoirInternal", label: "Internal condition of reservoir tank" },
    { key: "bdvPpmCalibration", label: "Calibration report of BDV & PPM kit" },
    { key: "oilBarrelsCheck", label: "Oil barrels checking by water pest" },
    { key: "ppmPhoto", label: "PPM Photo" },
    { key: "bdvReading", label: "Reading of BDV value" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>TEST VALUES PRIOR TO FILTERATION</h2>
        <h3 style={{ marginTop: "6px", fontWeight: 900 }}>
          Record of Oil Filling in the Reservoirs Tank
        </h3>
      </div>

      {/* Record of Oil Filling in the Reservoirs Tank */}
      <table className="form-table">
        <thead>
          <tr>
            <th style={{ width: "16%" }}></th>
            <th style={{ width: "17%" }}>No of barrels</th>
            <th style={{ width: "22%" }}>Started on Date & time</th>
            <th style={{ width: "22%" }}>Completed on Date & time</th>
            <th style={{ width: "11%" }}>BDV</th>
            <th style={{ width: "12%" }}>PPM</th>
          </tr>
        </thead>
        <tbody>
          {["tank1", "tank2", "tank3"].map((tankKey, idx) => {
            const label = idx === 0 ? "Tank1" : idx === 1 ? "Tank2" : "Tank3"
            const tank = formData.reservoirTanks?.[tankKey] || {}
            return (
              <tr key={tankKey}>
                <td style={{ fontWeight: 800 }}>{label}</td>
                <td>
                  <input
                    type="text"
                    value={tank.noOfBarrels || ""}
                    onChange={(e) =>
                      handleReservoirChange(tankKey, "noOfBarrels", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="datetime-local"
                    value={tank.startedOn || ""}
                    onChange={(e) =>
                      handleReservoirChange(tankKey, "startedOn", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="datetime-local"
                    value={tank.completedOn || ""}
                    onChange={(e) =>
                      handleReservoirChange(tankKey, "completedOn", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={tank.bdv || ""}
                    onChange={(e) => handleReservoirChange(tankKey, "bdv", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={tank.ppm || ""}
                    onChange={(e) => handleReservoirChange(tankKey, "ppm", e.target.value)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          fontWeight: 900,
          fontSize: "18px",
        }}
      >
        Reservoir Tank Filtration
      </div>

      {/* Reservoir Tank Filtration table */}
      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th style={{ width: "18%" }}>Date</th>
            <th style={{ width: "18%" }}>Time</th>
            <th style={{ width: "24%" }}>Vacuum Level (mmHg or torr)</th>
            <th style={{ width: "20%" }}>Inlet Temp °C</th>
            <th style={{ width: "20%" }}>Outlet Temp °C</th>
          </tr>
        </thead>
        <tbody>
          {formData.filtrationRecords.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={row.date || ""}
                  onChange={(e) =>
                    handleFiltrationRecordChange(index, "date", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="time"
                  value={row.time || ""}
                  onChange={(e) =>
                    handleFiltrationRecordChange(index, "time", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.vacuumLevel || ""}
                  onChange={(e) =>
                    handleFiltrationRecordChange(index, "vacuumLevel", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.inletTemp || ""}
                  onChange={(e) =>
                    handleFiltrationRecordChange(index, "inletTemp", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.outletTemp || ""}
                  onChange={(e) =>
                    handleFiltrationRecordChange(index, "outletTemp", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", fontWeight: 600 }}>
        Note: - Photographs to be added: - Internal condition of reservoir tank,
        Calibration report of BDV & PPM kit, Oil barrels checking by water pest,
        PPM Photo, Reading of BDV value.
      </div>

      <PhotoUploadSection
        title="Internal condition of reservoir tank, calibration report of BDV & PPM kit, oil barrels checking by water pest, PPM Photo, Reading of BDV value."
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

    // IR Values After erection
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

    // IR measurements
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
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 2,
          formNumber: 2,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage2Form2")
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
                value={formData.hv_earth_11}
                onChange={(e) => setFormData({ ...formData, hv_earth_11: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hv_earth_12}
                onChange={(e) => setFormData({ ...formData, hv_earth_12: e.target.value })}
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
                value={formData.lv1_earth_21}
                onChange={(e) => setFormData({ ...formData, lv1_earth_21: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1_earth_22}
                onChange={(e) => setFormData({ ...formData, lv1_earth_22: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV 2 with respect to earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2_earth_31}
                onChange={(e) => setFormData({ ...formData, lv2_earth_31: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2_earth_32}
                onChange={(e) => setFormData({ ...formData, lv2_earth_32: e.target.value })}
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
              <strong>Date :</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td>
              <strong>Time:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
            <td>
              <strong>Details of Insulation tester</strong>
            </td>
          </tr>
          <tr>
            <td>
              <strong>Amb. Temp :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ambTemp}
                onChange={(e) => setFormData({ ...formData, ambTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Make :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </td>
            <td rowSpan="4"></td>
          </tr>
          <tr>
            <td>
              <strong>Oil Temp. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oilTemp}
                onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Sr. No. :</strong>
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
              <strong>Wdg. Temp. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wdgTemp}
                onChange={(e) => setFormData({ ...formData, wdgTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Range :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.range}
                onChange={(e) => setFormData({ ...formData, range: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Relative Humidity :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.relativeHumidity}
                onChange={(e) => setFormData({ ...formData, relativeHumidity: e.target.value })}
              />
            </td>
            <td>
              <strong>Voltage Level :</strong>
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
              <strong>LV1-Earth</strong>
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
              <strong>LV2-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_15sec}
                onChange={(e) => setFormData({ ...formData, lv2Earth_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_60sec}
                onChange={(e) => setFormData({ ...formData, lv2Earth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_ratio}
                onChange={(e) => setFormData({ ...formData, lv2Earth_ratio: e.target.value })}
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
          <tr>
            <td>
              <strong>HV-LV2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_15sec}
                onChange={(e) => setFormData({ ...formData, hvLv2_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_60sec}
                onChange={(e) => setFormData({ ...formData, hvLv2_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_ratio}
                onChange={(e) => setFormData({ ...formData, hvLv2_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV1-LV2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_15sec}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_60sec}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_ratio}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_ratio: e.target.value })}
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
              <strong>BDV: _______ KV</strong>
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
              <strong>Water Content: _______ PPM</strong>
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

    // IR After oil Topping up To Conservator
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

    // IR measurements
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
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 3,
          formNumber: 1,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage3Form1")
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
            <td>
              <strong>Vacuum hose Checked By</strong>
            </td>
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
            <td>
              <strong>Vacuum hose Connected To</strong>
            </td>
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
            <td>
              <strong>Evacuation Started At</strong>
            </td>
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
        IR After oil Topping up To Conservator Temp OTI .......°C WTI.............°C, AMB .............°C RANGE ONLY 1
        KV
      </h3>

      <table className="form-table" style={{ marginTop: "30px" }}>
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
              <strong>LV1-Earth</strong>
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
              <strong>LV2-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_15sec}
                onChange={(e) => setFormData({ ...formData, lv2Earth_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_60sec}
                onChange={(e) => setFormData({ ...formData, lv2Earth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_ratio}
                onChange={(e) => setFormData({ ...formData, lv2Earth_ratio: e.target.value })}
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
          <tr>
            <td>
              <strong>HV-LV2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_15sec}
                onChange={(e) => setFormData({ ...formData, hvLv2_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_60sec}
                onChange={(e) => setFormData({ ...formData, hvLv2_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_ratio}
                onChange={(e) => setFormData({ ...formData, hvLv2_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV1-LV2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_15sec}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_60sec}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_ratio}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_ratio: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px", textAlign: "center" }}>PRESSURE TEST REPORT</h4>

      <div style={{ textAlign: "right", marginBottom: "8px" }}>
        <strong>DATE :- </strong>
        <input
          type="date"
          value={formData.pressureTestDate || ""}
          onChange={(e) => setFormData({ ...formData, pressureTestDate: e.target.value })}
          style={{ marginLeft: "8px" }}
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
              <td>
                <strong>{index + 1}</strong>
              </td>
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
          Submit Stage 3
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
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 4,
          formNumber: 1,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage4Form1")
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

    // IR measurements
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
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 4,
          formNumber: 2,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage4Form2")
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
                value={formData.lv1Earth_ratio}
                onChange={(e) => setFormData({ ...formData, lv1Earth_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV2-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_10sec}
                onChange={(e) => setFormData({ ...formData, lv2Earth_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_60sec}
                onChange={(e) => setFormData({ ...formData, lv2Earth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_ratio}
                onChange={(e) => setFormData({ ...formData, lv2Earth_ratio: e.target.value })}
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
                value={formData.hvLv1_ratio}
                onChange={(e) => setFormData({ ...formData, hvLv1_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>HV-LV2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_10sec}
                onChange={(e) => setFormData({ ...formData, hvLv2_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_60sec}
                onChange={(e) => setFormData({ ...formData, hvLv2_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_ratio}
                onChange={(e) => setFormData({ ...formData, hvLv2_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV1-LV2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_10sec}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_60sec}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_ratio}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_ratio: e.target.value })}
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
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 4,
          formNumber: 3,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage4Form3")
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

    // IR & PI measurements (10 / 60 / 600 sec)
    hvEarth_10sec: "",
    hvEarth_60sec: "",
    hvEarth_600sec: "",
    hvEarth_ratio: "",
    lv1Earth_10sec: "",
    lv1Earth_60sec: "",
    lv1Earth_600sec: "",
    lv1Earth_ratio: "",
    lv2Earth_10sec: "",
    lv2Earth_60sec: "",
    lv2Earth_600sec: "",
    lv2Earth_ratio: "",
    hvLv1_10sec: "",
    hvLv1_60sec: "",
    hvLv1_600sec: "",
    hvLv1_ratio: "",
    hvLv2_10sec: "",
    hvLv2_60sec: "",
    hvLv2_600sec: "",
    hvLv2_ratio: "",
    lv1Lv2_10sec: "",
    lv1Lv2_60sec: "",
    lv1Lv2_600sec: "",
    lv1Lv2_ratio: "",

    // After Oil Filtration of main tank
    bdv: "",
    waterContent: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 4,
          formNumber: 4,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage4Form4")
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

      <table className="form-table" style={{ marginTop: "30px" }}>
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
                value={formData.hvEarth_ratio}
                onChange={(e) => setFormData({ ...formData, hvEarth_ratio: e.target.value })}
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
                value={formData.lv1Earth_ratio}
                onChange={(e) => setFormData({ ...formData, lv1Earth_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV2-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_10sec}
                onChange={(e) => setFormData({ ...formData, lv2Earth_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_60sec}
                onChange={(e) => setFormData({ ...formData, lv2Earth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_600sec}
                onChange={(e) => setFormData({ ...formData, lv2Earth_600sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_ratio}
                onChange={(e) => setFormData({ ...formData, lv2Earth_ratio: e.target.value })}
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
                value={formData.hvLv1_ratio}
                onChange={(e) => setFormData({ ...formData, hvLv1_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>HV-LV2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_10sec}
                onChange={(e) => setFormData({ ...formData, hvLv2_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_60sec}
                onChange={(e) => setFormData({ ...formData, hvLv2_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_600sec}
                onChange={(e) => setFormData({ ...formData, hvLv2_600sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_ratio}
                onChange={(e) => setFormData({ ...formData, hvLv2_ratio: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV1-LV2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_10sec}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_10sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_60sec}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_600sec}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_600sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_ratio}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_ratio: e.target.value })}
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
              <strong>BDV: _______ KV</strong>
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
              <strong>Water Content: _______ PPM</strong>
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

// Stage 5 Forms - Based on provided images
export function Stage5Form1({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    makeOfMeter: "",
    modelSrNo: "",
    date: "",
    ambient: "",
    otiTemp: "",
    wtiTemp: "",
    testReportReviewedBy: "",
    acceptanceOfTest: "",

    // IR Values measurements header
    irDate: "",
    irTime: "",
    irAmbTemp: "",
    irOilTemp: "",
    irWdgTemp: "",
    irRelativeHumidity: "",
    irMake: "",
    irSrNo: "",
    irRange: "",
    irVoltageLevel: "",
    insulationTesterDetails: "",

    // IR measurements (15 / 60 sec and ratio)
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

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 1,
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

  const photoRequirements = [
    { key: "irTester", label: "IR tester" },
    { key: "calibrationReport", label: "Calibration report" },
    { key: "ir60SecValue", label: "60 sec IR value" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* SFRA TEST RECORD HEADER */}
      <div className="company-header">
        <h2>SFRA TEST RECORD</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>MAKE OF METER</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.makeOfMeter || ""}
                onChange={(e) => setFormData({ ...formData, makeOfMeter: e.target.value })}
              />
            </td>
            <td>
              <strong>DATE</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td>
              <strong>MODEL & S. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.modelSrNo || ""}
                onChange={(e) => setFormData({ ...formData, modelSrNo: e.target.value })}
              />
            </td>
            <td>
              <strong>AMBIENT:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ambient || ""}
                onChange={(e) => setFormData({ ...formData, ambient: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td>
              <strong>OTI in °C</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.otiTemp || ""}
                onChange={(e) => setFormData({ ...formData, otiTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>WTI in °C</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wtiTemp || ""}
                onChange={(e) => setFormData({ ...formData, wtiTemp: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, testReportReviewedBy: e.target.value })}
              />
            </td>
            <td>
              <strong>Acceptance of the test</strong>
            </td>
            <td>
              <input
                type="text"
                placeholder="Yes / No"
                value={formData.acceptanceOfTest || ""}
                onChange={(e) => setFormData({ ...formData, acceptanceOfTest: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* RECORD OF MEASUREMENT OF IR VALUES */}
      <div style={{ marginTop: "40px", textAlign: "center", fontWeight: 900 }}>
        RECORD OF MEASUREMENT OF IR VALUES
      </div>

      <table className="form-table" style={{ marginTop: "12px" }}>
        <tbody>
          <tr>
            <td style={{ width: "15%", fontWeight: 800 }}>Date :</td>
            <td style={{ width: "20%" }}>
              <input
                type="date"
                value={formData.irDate || ""}
                onChange={(e) => setFormData({ ...formData, irDate: e.target.value })}
              />
            </td>
            <td style={{ width: "15%", fontWeight: 800 }}>Time:</td>
            <td style={{ width: "20%" }}>
              <input
                type="time"
                value={formData.irTime || ""}
                onChange={(e) => setFormData({ ...formData, irTime: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Amb. Temp :</td>
            <td>
              <input
                type="text"
                value={formData.irAmbTemp || ""}
                onChange={(e) => setFormData({ ...formData, irAmbTemp: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>Make :</td>
            <td>
              <input
                type="text"
                value={formData.irMake || ""}
                onChange={(e) => setFormData({ ...formData, irMake: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Oil Temp. :</td>
            <td>
              <input
                type="text"
                value={formData.irOilTemp || ""}
                onChange={(e) => setFormData({ ...formData, irOilTemp: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>Sr. No. :</td>
            <td>
              <input
                type="text"
                value={formData.irSrNo || ""}
                onChange={(e) => setFormData({ ...formData, irSrNo: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Wdg. Temp. :</td>
            <td>
              <input
                type="text"
                value={formData.irWdgTemp || ""}
                onChange={(e) => setFormData({ ...formData, irWdgTemp: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>Range :</td>
            <td>
              <input
                type="text"
                value={formData.irRange || ""}
                onChange={(e) => setFormData({ ...formData, irRange: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Relative Humidity :</td>
            <td>
              <input
                type="text"
                value={formData.irRelativeHumidity || ""}
                onChange={(e) =>
                  setFormData({ ...formData, irRelativeHumidity: e.target.value })
                }
              />
            </td>
            <td style={{ fontWeight: 800 }}>Voltage Level :</td>
            <td>
              <input
                type="text"
                value={formData.irVoltageLevel || ""}
                onChange={(e) => setFormData({ ...formData, irVoltageLevel: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* IR VALUES TABLE */}
      <table className="form-table" style={{ marginTop: "26px" }}>
        <thead>
          <tr>
            <th style={{ width: "26%" }}></th>
            <th style={{ width: "18%" }}>15 Sec (MΩ)</th>
            <th style={{ width: "18%" }}>60 Sec (MΩ)</th>
            <th style={{ width: "38%" }}>Ratio of IR 60/IR 15</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 800 }}>HV-Earth</td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_15sec || ""}
                onChange={(e) => setFormData({ ...formData, hvEarth_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_60sec || ""}
                onChange={(e) => setFormData({ ...formData, hvEarth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth_ratio || ""}
                onChange={(e) => setFormData({ ...formData, hvEarth_ratio: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>LV1-Earth</td>
            <td>
              <input
                type="text"
                value={formData.lv1Earth_15sec || ""}
                onChange={(e) => setFormData({ ...formData, lv1Earth_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Earth_60sec || ""}
                onChange={(e) => setFormData({ ...formData, lv1Earth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Earth_ratio || ""}
                onChange={(e) => setFormData({ ...formData, lv1Earth_ratio: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>LV2-Earth</td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_15sec || ""}
                onChange={(e) => setFormData({ ...formData, lv2Earth_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_60sec || ""}
                onChange={(e) => setFormData({ ...formData, lv2Earth_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Earth_ratio || ""}
                onChange={(e) => setFormData({ ...formData, lv2Earth_ratio: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>HV-LV1</td>
            <td>
              <input
                type="text"
                value={formData.hvLv1_15sec || ""}
                onChange={(e) => setFormData({ ...formData, hvLv1_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv1_60sec || ""}
                onChange={(e) => setFormData({ ...formData, hvLv1_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv1_ratio || ""}
                onChange={(e) => setFormData({ ...formData, hvLv1_ratio: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>HV-LV2</td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_15sec || ""}
                onChange={(e) => setFormData({ ...formData, hvLv2_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_60sec || ""}
                onChange={(e) => setFormData({ ...formData, hvLv2_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvLv2_ratio || ""}
                onChange={(e) => setFormData({ ...formData, hvLv2_ratio: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>LV1-LV2</td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_15sec || ""}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_15sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_60sec || ""}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_60sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Lv2_ratio || ""}
                onChange={(e) => setFormData({ ...formData, lv1Lv2_ratio: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="IR tester, calibration report, 60 sec IR value."
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

export function Stage5Form2({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Header fields
    meterUsed: "",
    modelSrNo: "",
    date: "",
    time: "",
    ambient: "",
    oti: "",
    wti: "",
    vectorGroup: "",
    mf: "",

    // First ratio set: 1.1 – 1.2 in between 2.1 -2.2
    ratioSet1: {
      namePlateText: "1.1 – 1.2 in between 2.1 -2.2",
      measuredText: "1.1 – 1.2 in between 2.1 -2.2",
      taps: [
        { tapNo: 1, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
        { tapNo: 2, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
        { tapNo: 3, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
        { tapNo: 4, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
        { tapNo: 5, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
        { tapNo: 6, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
      ],
    },

    // Second ratio set: 1.1 – 1.2 in between 3.1 -3.2
    ratioSet2: {
      namePlateText: "1.1 – 1.2 in between 3.1 -3.2",
      measuredText: "1.1 – 1.2 in between 3.1 -3.2",
      taps: [
        { tapNo: 1, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
        { tapNo: 2, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
        { tapNo: 3, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
        { tapNo: 4, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
        { tapNo: 5, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
        { tapNo: 6, namePlateRatio: "", measuredRatio: "", deviationPercent: "" },
      ],
    },

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 2,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form2")
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

  const setTapValue = (setKey, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [setKey]: {
        ...(prev[setKey] || {}),
        taps: (prev[setKey]?.taps || []).map((row, i) =>
          i === index ? { ...row, [field]: value } : row,
        ),
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
    { key: "ratioTestSetup", label: "Ratio test setup" },
    { key: "ratioTestReadings", label: "Ratio test meter readings" },
  ]

  const renderRatioBlock = (setKey, index) => {
    const set = formData[setKey] || {}
    const defaultNameText =
      index === 0
        ? "1.1 – 1.2 in between 2.1 -2.2"
        : "1.1 – 1.2 in between 3.1 -3.2"

    return (
      <div key={setKey} style={{ marginTop: index === 0 ? "24px" : "32px" }}>
        <table className="form-table">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>TAP NO</th>
              <th style={{ width: "30%" }}>Name Plate Ratio</th>
              <th style={{ width: "30%" }}>Measured ratio</th>
              <th style={{ width: "30%" }}>Deviation %</th>
            </tr>
          <tr>
             <th></th>
              <th style={{ fontWeight: 700 }}>
                {set.namePlateText || defaultNameText}
              </th>
              <th style={{ fontWeight: 700 }}>
                {set.measuredText || defaultNameText}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(set.taps || []).map((row, idx) => (
              <tr key={`${setKey}-tap-${row.tapNo || idx + 1}`}>
                <td style={{ textAlign: "center", fontWeight: 700 }}>
                  {row.tapNo || idx + 1}
                </td>
                <td>
                  <input
                    type="text"
                    value={row.namePlateRatio || ""}
                    onChange={(e) =>
                      setTapValue(setKey, idx, "namePlateRatio", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.measuredRatio || ""}
                    onChange={(e) =>
                      setTapValue(setKey, idx, "measuredRatio", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.deviationPercent || ""}
                    onChange={(e) =>
                      setTapValue(setKey, idx, "deviationPercent", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>RATIO TEST</h2>
      </div>

      {/* Header section */}
      <table className="form-table">
        <tbody>
          <tr>
            <td style={{ width: "20%", fontWeight: 800 }}>METER USED</td>
            <td style={{ width: "30%" }}>
              <input
                type="text"
                value={formData.meterUsed || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meterUsed: e.target.value })
                }
              />
            </td>
            <td style={{ width: "20%", fontWeight: 800 }}>DATE:</td>
            <td style={{ width: "30%" }}>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>MODEL & S. NO.</td>
            <td>
              <input
                type="text"
                value={formData.modelSrNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, modelSrNo: e.target.value })
                }
              />
            </td>
            <td style={{ fontWeight: 800 }}>TIME :</td>
            <td>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>OTI (°C)</td>
            <td>
              <input
                type="text"
                value={formData.oti || ""}
                onChange={(e) =>
                  setFormData({ ...formData, oti: e.target.value })
                }
              />
            </td>
            <td style={{ fontWeight: 800 }}>WTI (°C)</td>
            <td>
              <input
                type="text"
                value={formData.wti || ""}
                onChange={(e) =>
                  setFormData({ ...formData, wti: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>AMBIENT:</td>
            <td>
              <input
                type="text"
                value={formData.ambient || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ambient: e.target.value })
                }
              />
            </td>
            <td colSpan={2} style={{ textAlign: "center", fontWeight: 800 }}>
              VECTOR GROUP
              <input
                type="text"
                value={formData.vectorGroup || ""}
                onChange={(e) =>
                  setFormData({ ...formData, vectorGroup: e.target.value })
                }
                style={{ marginLeft: "8px", width: "120px" }}
              />
              &nbsp; M.F.
              <input
                type="text"
                value={formData.mf || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mf: e.target.value })
                }
                style={{ marginLeft: "8px", width: "80px" }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Two ratio blocks */}
      {renderRatioBlock("ratioSet1", 0)}
      {renderRatioBlock("ratioSet2", 1)}

      <PhotoUploadSection
        title="Ratio test – tap wise readings and setup."
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

export function Stage5Form3({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  // Rows for HV side (TAP 1–6)
  const hvTapRows = [1, 2, 3, 4, 5, 6]

  const [formData, setFormData] = useState({
    appliedVoltage: "",
    date: "",
    time: "",
    meterMakeSrNo: "",

    // Magnetizing current measurement in milliampere
    hvMeasurements: hvTapRows.map((tapNo) => ({
      tapNo,
      hvVoltage: "",
      hvCurrent: "",
    })),

    lv1Voltage: "",
    lv1Current: "",
    lv2Voltage: "",
    lv2Current: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 3,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage5Form3")
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

  const setHvMeasurement = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      hvMeasurements: (prev.hvMeasurements || []).map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      ),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "magnetizingCurrentTest", label: "Magnetizing Current Test" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>TYPE OF TEST – MAGNETISING CURRENT TEST LV and HV</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td style={{ width: "18%" }}>
              <strong>APPLIED VOLTAGE :</strong>
            </td>
            <td style={{ width: "18%" }}>
              <input
                type="text"
                value={formData.appliedVoltage || ""}
                onChange={(e) =>
                  setFormData({ ...formData, appliedVoltage: e.target.value })
                }
                placeholder="VOLTS"
              />
            </td>
            <td style={{ width: "14%" }}>
              <strong>VOLTS</strong>
            </td>
            <td style={{ width: "18%" }}>
              <strong>DATE:</strong>
            </td>
            <td style={{ width: "16%" }}>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </td>
            <td style={{ width: "8%" }}>
              <strong>TIME :</strong>
            </td>
            <td style={{ width: "18%" }}>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td colSpan={6}>
              <input
                type="text"
                value={formData.meterMakeSrNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meterMakeSrNo: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          marginTop: "16px",
          fontWeight: 900,
          padding: "6px 8px",
          border: "1px solid #000",
        }}
      >
        Magnetizing current measurement in milliampere
      </div>

      {/* HV SIDE TABLE */}
      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th style={{ width: "15%" }}>TAP NO.</th>
            <th style={{ width: "45%" }}>VOLTAGE APPLIED ON HV SIDE</th>
            <th style={{ width: "40%" }}>CURRENT MEASURED ON HV SIDE (mA)</th>
          </tr>
        </thead>
        <tbody>
          {(formData.hvMeasurements || hvTapRows.map((tap) => ({ tapNo: tap }))).map(
            (row, idx) => (
              <tr key={row.tapNo ?? idx + 1}>
                <td style={{ textAlign: "center", fontWeight: 700 }}>
                  {row.tapNo}
                </td>
                <td>
                  <input
                    type="text"
                    value={row.hvVoltage || ""}
                    onChange={(e) =>
                      setHvMeasurement(idx, "hvVoltage", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.hvCurrent || ""}
                    onChange={(e) =>
                      setHvMeasurement(idx, "hvCurrent", e.target.value)
                    }
                  />
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>

      {/* LV1 SIDE */}
      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ width: "50%" }}>VOLTAGE APPLIED ON LV1 SIDE</th>
            <th style={{ width: "50%" }}>CURRENT MEASURED ON LV1 SIDE (mA)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                value={formData.lv1Voltage || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lv1Voltage: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv1Current || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lv1Current: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* LV2 SIDE */}
      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th style={{ width: "50%" }}>VOLTAGE APPLIED ON LV2 SIDE</th>
            <th style={{ width: "50%" }}>CURRENT MEASURED ON LV2 SIDE (mA)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                value={formData.lv2Voltage || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lv2Voltage: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.lv2Current || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lv2Current: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="Magnetizing Current Test"
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

export function Stage5Form4({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    // Polarity Test – Condition 1 (2.1/2.2)
    condition1_11_12_22: "",
    condition1_21_22_22: "",
    condition1_11_22_22: "",
    condition1_calc_22: "",
    // Polarity Test – Condition 2 (2.1/2.2)
    condition2_11_12_22: "",
    condition2_21_22_22: "",
    condition2_11_21_22: "",
    condition2_calc_22: "",
    // Polarity Test – Condition 1 (3.1/3.2)
    condition1_11_12_32: "",
    condition1_31_32_32: "",
    condition1_11_32_32: "",
    condition1_calc_32: "",
    // Polarity Test – Condition 2 (3.1/3.2)
    condition2_11_12_32: "",
    condition2_31_32_32: "",
    condition2_11_31_32: "",
    condition2_calc_32: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 4,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage5Form4")
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

  const photoRequirements = [{ key: "polarityTest", label: "Polarity Test" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>TYPE OF TEST – POLARITY TEST</h2>
      </div>

      {/* CONDITION 1 – 2.1 / 2.2 */}
      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th colSpan={2} style={{ textAlign: "center", fontWeight: 900 }}>
              CONDITION 1
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* Left section with expressions & inputs */}
            <td style={{ width: "55%", padding: 0, verticalAlign: "top" }}>
              <table className="form-table" style={{ marginTop: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "55%", fontWeight: 700 }}>1.1 – 1.2 =</td>
                    <td style={{ width: "45%" }}>
                      <input
                        type="text"
                        value={formData.condition1_11_12_22 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition1_11_12_22: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>2.1 – 2.2 =</td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition1_21_22_22 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition1_21_22_22: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>1.1 – 2.2 =</td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition1_11_22_22 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition1_11_22_22: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>
                      (1.1 – 2.2) = (1.1 – 1.2) + (2.1 – 2.2)
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition1_calc_22 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition1_calc_22: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Right section left blank for diagram as in format */}
            <td style={{ width: "45%", minHeight: "160px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* CONDITION 2 – 2.1 / 2.2 */}
      <table className="form-table" style={{ marginTop: "30px" }}>
        <thead>
          <tr>
            <th colSpan={2} style={{ textAlign: "center", fontWeight: 900 }}>
              CONDITION 2
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* Left section with expressions & inputs */}
            <td style={{ width: "55%", padding: 0, verticalAlign: "top" }}>
              <table className="form-table" style={{ marginTop: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "55%", fontWeight: 700 }}>1.1 – 1.2 =</td>
                    <td style={{ width: "45%" }}>
                      <input
                        type="text"
                        value={formData.condition2_11_12_22 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition2_11_12_22: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>2.1 – 2.2 =</td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition2_21_22_22 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition2_21_22_22: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>1.1 – 2.1 =</td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition2_11_21_22 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition2_11_21_22: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>
                      (1.1 – 2.1) = (1.1 – 1.2) - (2.1 – 2.2)
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition2_calc_22 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition2_calc_22: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Right section blank for diagram */}
            <td style={{ width: "45%", minHeight: "160px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* CONDITION 1 – 3.1 / 3.2 */}
      <table className="form-table" style={{ marginTop: "40px" }}>
        <thead>
          <tr>
            <th colSpan={2} style={{ textAlign: "center", fontWeight: 900 }}>
              CONDITION 1
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ width: "55%", padding: 0, verticalAlign: "top" }}>
              <table className="form-table" style={{ marginTop: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "55%", fontWeight: 700 }}>1.1 – 1.2 =</td>
                    <td style={{ width: "45%" }}>
                      <input
                        type="text"
                        value={formData.condition1_11_12_32 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition1_11_12_32: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>3.1 – 3.2 =</td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition1_31_32_32 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition1_31_32_32: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>1.1 – 3.2 =</td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition1_11_32_32 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition1_11_32_32: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>
                      (1.1 – 3.2) = (1.1 – 1.2) + (3.1 – 3.2)
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition1_calc_32 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition1_calc_32: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style={{ width: "45%", minHeight: "160px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* CONDITION 2 – 3.1 / 3.2 */}
      <table className="form-table" style={{ marginTop: "30px" }}>
        <thead>
          <tr>
            <th colSpan={2} style={{ textAlign: "center", fontWeight: 900 }}>
              CONDITION 2
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ width: "55%", padding: 0, verticalAlign: "top" }}>
              <table className="form-table" style={{ marginTop: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "55%", fontWeight: 700 }}>1.1 – 1.2 =</td>
                    <td style={{ width: "45%" }}>
                      <input
                        type="text"
                        value={formData.condition2_11_12_32 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition2_11_12_32: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>3.1 – 3.2 =</td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition2_31_32_32 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition2_31_32_32: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>1.1 – 3.1 =</td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition2_11_31_32 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition2_11_31_32: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>
                      (1.1 – 3.1) = (1.1 – 1.2) - (3.1 – 3.2)
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.condition2_calc_32 || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, condition2_calc_32: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style={{ width: "45%", minHeight: "160px" }}></td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection title="Polarity Test" photos={photoRequirements} onPhotoChange={handlePhotoChange} />

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

export function Stage5Form5({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    appliedVoltage: "",
    date: "",
    time: "",
    meterMakeSrNo: "",

    // Short circuit test measurements by tap (1–6)
    taps: [
      { tapNo: 1, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 2, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 3, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 4, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 5, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 6, voltage: "", hvCurrent: "", lvCurrent: "" },
    ],

    // Impedance calculation
    appliedVoltageHV: "",
    ratedCurrentLV: "",
    percentZ: "",
    ratedVoltageHV: "",
    measuredCurrentLV: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 5,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage5Form5")
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

  const setTapRow = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      taps: (prev.taps || []).map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
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
        <h2>
          TYPE OF TEST – SHORT CIRCUIT TEST&nbsp;<span>I</span>
        </h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>APPLIED VOLTAGE:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.appliedVoltage}
                onChange={(e) => setFormData({ ...formData, appliedVoltage: e.target.value })}
                placeholder="VOLTS"
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td>
              <strong>TIME :</strong>
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
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td colSpan="5">
              <input
                type="text"
                value={formData.meterMakeSrNo}
                onChange={(e) => setFormData({ ...formData, meterMakeSrNo: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td>
              <strong>LV 1 SHORT, LV2 OPEN</strong>
            </td>
            <td colSpan="5">
              <input
                type="text"
                value={formData.lv1ShortLv2Open || ""}
                onChange={(e) => setFormData({ ...formData, lv1ShortLv2Open: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ width: "15%" }}>TAP NO.</th>
            <th style={{ width: "25%" }}>VOLTAGE</th>
            <th style={{ width: "30%" }}>HV CURRENT (Amp)</th>
            <th style={{ width: "30%" }}>LV CURRENT (Amp)</th>
          </tr>
        </thead>
        <tbody>
          {(formData.taps || []).map((row, idx) => (
            <tr key={row.tapNo || idx + 1}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{row.tapNo || idx + 1}</td>
              <td>
                <input
                  type="text"
                  value={row.voltage || ""}
                  onChange={(e) => setTapRow(idx, "voltage", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.hvCurrent || ""}
                  onChange={(e) => setTapRow(idx, "hvCurrent", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.lvCurrent || ""}
                  onChange={(e) => setTapRow(idx, "lvCurrent", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td rowSpan="4">
              <strong>Impedance calculation</strong>
            </td>
            <td>
              <strong>Applied Voltage HV</strong>
            </td>
            <td>
              <strong>Rated Current LV</strong>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                value={formData.appliedVoltageHV}
                onChange={(e) => setFormData({ ...formData, appliedVoltageHV: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratedCurrentLV}
                onChange={(e) => setFormData({ ...formData, ratedCurrentLV: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>%Z = _____________ X _____________ X 100</strong>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  value={formData.percentZ}
                  onChange={(e) => setFormData({ ...formData, percentZ: e.target.value })}
                  placeholder="%Z ="
                  style={{ width: "80px" }}
                />
                <span>
                  <strong>Rated voltage HV</strong>
                </span>
                <input
                  type="text"
                  value={formData.ratedVoltageHV}
                  onChange={(e) => setFormData({ ...formData, ratedVoltageHV: e.target.value })}
                  style={{ width: "120px" }}
                />
                <span>
                  <strong>Measured current LV</strong>
                </span>
                <input
                  type="text"
                  value={formData.measuredCurrentLV}
                  onChange={(e) => setFormData({ ...formData, measuredCurrentLV: e.target.value })}
                  style={{ width: "120px" }}
                />
              </div>
            </td>
            <td></td>
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
          Next Form
        </button>
      </div>
    </form>
    
  )
}

export function Stage5Form6({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    appliedVoltage: "",
    date: "",
    time: "",
    meterMakeSrNo: "",

    // Short circuit test measurements by tap (1–6)
    taps: [
      { tapNo: 1, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 2, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 3, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 4, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 5, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 6, voltage: "", hvCurrent: "", lvCurrent: "" },
    ],

    // Impedance calculation
    appliedVoltageHV: "",
    ratedCurrentLV: "",
    percentZ: "",
    ratedVoltageHV: "",
    measuredCurrentLV: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 6,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage5Form6")
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

  const setTapRow = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      taps: (prev.taps || []).map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
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
        <h2>
          TYPE OF TEST – SHORT CIRCUIT TEST&nbsp;<span>II</span>
        </h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>APPLIED VOLTAGE:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.appliedVoltage}
                onChange={(e) => setFormData({ ...formData, appliedVoltage: e.target.value })}
                placeholder="VOLTS"
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td>
              <strong>TIME :</strong>
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
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td colSpan="5">
              <input
                type="text"
                value={formData.meterMakeSrNo}
                onChange={(e) => setFormData({ ...formData, meterMakeSrNo: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td>
              <strong>LV 1 OPEN, LV2 SHORT</strong>
            </td>
            <td colSpan="5">
              <input
                type="text"
                value={formData.lv1OpenLv2Short || ""}
                onChange={(e) => setFormData({ ...formData, lv1OpenLv2Short: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ width: "15%" }}>TAP NO.</th>
            <th style={{ width: "25%" }}>VOLTAGE</th>
            <th style={{ width: "30%" }}>HV CURRENT (Amp)</th>
            <th style={{ width: "30%" }}>LV CURRENT (Amp)</th>
          </tr>
        </thead>
        <tbody>
          {(formData.taps || []).map((row, idx) => (
            <tr key={row.tapNo || idx + 1}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{row.tapNo || idx + 1}</td>
              <td>
                <input
                  type="text"
                  value={row.voltage || ""}
                  onChange={(e) => setTapRow(idx, "voltage", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.hvCurrent || ""}
                  onChange={(e) => setTapRow(idx, "hvCurrent", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.lvCurrent || ""}
                  onChange={(e) => setTapRow(idx, "lvCurrent", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td rowSpan="4">
              <strong>Impedance calculation</strong>
            </td>
            <td>
              <strong>Applied Voltage HV</strong>
            </td>
            <td>
              <strong>Rated Current LV</strong>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                value={formData.appliedVoltageHV}
                onChange={(e) => setFormData({ ...formData, appliedVoltageHV: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratedCurrentLV}
                onChange={(e) => setFormData({ ...formData, ratedCurrentLV: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>%Z = _____________ X _____________ X 100</strong>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  value={formData.percentZ}
                  onChange={(e) => setFormData({ ...formData, percentZ: e.target.value })}
                  placeholder="%Z ="
                  style={{ width: "80px" }}
                />
                <span>
                  <strong>Rated voltage HV</strong>
                </span>
                <input
                  type="text"
                  value={formData.ratedVoltageHV}
                  onChange={(e) => setFormData({ ...formData, ratedVoltageHV: e.target.value })}
                  style={{ width: "120px" }}
                />
                <span>
                  <strong>Measured current LV</strong>
                </span>
                <input
                  type="text"
                  value={formData.measuredCurrentLV}
                  onChange={(e) => setFormData({ ...formData, measuredCurrentLV: e.target.value })}
                  style={{ width: "120px" }}
                />
              </div>
            </td>
            <td></td>
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
          Next Form
        </button>
      </div>
    </form>
    
  )
}

export function Stage5Form7({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    appliedVoltage: "",
    date: "",
    time: "",
    meterMakeSrNo: "",

    // Short circuit test measurements by tap (1–6)
    taps: [
      { tapNo: 1, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 2, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 3, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 4, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 5, voltage: "", hvCurrent: "", lvCurrent: "" },
      { tapNo: 6, voltage: "", hvCurrent: "", lvCurrent: "" },
    ],

    // Impedance calculation
    appliedVoltageHV: "",
    ratedCurrentLV: "",
    percentZ: "",
    ratedVoltageHV: "",
    measuredCurrentLV: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 7,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage5Form7")
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

  const setTapRow = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      taps: (prev.taps || []).map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
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
        <h2>
          TYPE OF TEST – SHORT CIRCUIT TEST&nbsp;<span>III</span>
        </h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>APPLIED VOLTAGE:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.appliedVoltage}
                onChange={(e) => setFormData({ ...formData, appliedVoltage: e.target.value })}
                placeholder="VOLTS"
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td>
              <strong>TIME :</strong>
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
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td colSpan="5">
              <input
                type="text"
                value={formData.meterMakeSrNo}
                onChange={(e) => setFormData({ ...formData, meterMakeSrNo: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV1 AND LV2 SHORT</strong>
            </td>
            <td colSpan="5">
              <input
                type="text"
                value={formData.lv1AndLv2Short || ""}
                onChange={(e) => setFormData({ ...formData, lv1AndLv2Short: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ width: "15%" }}>TAP NO.</th>
            <th style={{ width: "25%" }}>VOLTAGE</th>
            <th style={{ width: "30%" }}>HV CURRENT (Amp)</th>
            <th style={{ width: "30%" }}>LV CURRENT (Amp)</th>
          </tr>
        </thead>
        <tbody>
          {(formData.taps || []).map((row, idx) => (
            <tr key={row.tapNo || idx + 1}>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{row.tapNo || idx + 1}</td>
              <td>
                <input
                  type="text"
                  value={row.voltage || ""}
                  onChange={(e) => setTapRow(idx, "voltage", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.hvCurrent || ""}
                  onChange={(e) => setTapRow(idx, "hvCurrent", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.lvCurrent || ""}
                  onChange={(e) => setTapRow(idx, "lvCurrent", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td rowSpan="4">
              <strong>Impedance calculation</strong>
            </td>
            <td>
              <strong>Applied Voltage HV</strong>
            </td>
            <td>
              <strong>Rated Current LV</strong>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                value={formData.appliedVoltageHV}
                onChange={(e) => setFormData({ ...formData, appliedVoltageHV: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratedCurrentLV}
                onChange={(e) => setFormData({ ...formData, ratedCurrentLV: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>%Z = _____________ X _____________ X 100</strong>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  value={formData.percentZ}
                  onChange={(e) => setFormData({ ...formData, percentZ: e.target.value })}
                  placeholder="%Z ="
                  style={{ width: "80px" }}
                />
                <span>
                  <strong>Rated voltage HV</strong>
                </span>
                <input
                  type="text"
                  value={formData.ratedVoltageHV}
                  onChange={(e) => setFormData({ ...formData, ratedVoltageHV: e.target.value })}
                  style={{ width: "120px" }}
                />
                <span>
                  <strong>Measured current LV</strong>
                </span>
                <input
                  type="text"
                  value={formData.measuredCurrentLV}
                  onChange={(e) => setFormData({ ...formData, measuredCurrentLV: e.target.value })}
                  style={{ width: "120px" }}
                />
              </div>
            </td>
            <td></td>
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
          Next Form
        </button>
      </div>
    </form>
    
  )
}

export function Stage5Form8({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    meterUsed: "",
    date: "",
    time: "",
    meterMakeSrNo: "",
    wti: "",
    oti: "",
    range: "",
    ambient: "",

    hvSide: [
      { tapNo: 1, resistance_11_12: "" },
      { tapNo: 2, resistance_11_12: "" },
      { tapNo: 3, resistance_11_12: "" },
      { tapNo: 4, resistance_11_12: "" },
      { tapNo: 5, resistance_11_12: "" },
      { tapNo: 6, resistance_11_12: "" },
    ],

    lvSide21_22: [
      { rowNo: 1, resistance_21_22: "" },
      { rowNo: 2, resistance_21_22: "" },
      { rowNo: 3, resistance_21_22: "" },
    ],

    lvSide31_32: [
      { rowNo: 1, resistance_31_32: "" },
      { rowNo: 2, resistance_31_32: "" },
      { rowNo: 3, resistance_31_32: "" },
    ],

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 8,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form6")
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

  const setHvRow = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      hvSide: (prev.hvSide || []).map((row, i) =>
        i === index ? { ...row, resistance_11_12: value } : row,
      ),
    }))
  }

  const setLv21Row = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      lvSide21_22: (prev.lvSide21_22 || []).map((row, i) =>
        i === index ? { ...row, resistance_21_22: value } : row,
      ),
    }))
  }

  const setLv31Row = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      lvSide31_32: (prev.lvSide31_32 || []).map((row, i) =>
        i === index ? { ...row, resistance_31_32: value } : row,
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
    { key: "windingResistanceSetup", label: "Winding resistance kit & test setup" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>TYPE OF TEST – WINDING RESISTANCE TEST</h2>
      </div>

      {/* Header block */}
      <table className="form-table">
        <tbody>
          <tr>
            <td style={{ width: "20%", fontWeight: 800 }}>METER USED</td>
            <td style={{ width: "30%" }}>
              <input
                type="text"
                value={formData.meterUsed || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meterUsed: e.target.value })
                }
              />
            </td>
            <td style={{ width: "20%", fontWeight: 800 }}>DATE:</td>
            <td style={{ width: "30%" }}>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>METER MAKE SR. NO.</td>
            <td>
              <input
                type="text"
                value={formData.meterMakeSrNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meterMakeSrNo: e.target.value })
                }
              />
            </td>
            <td style={{ fontWeight: 800 }}>TIME :</td>
            <td>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>RANGE</td>
            <td>
              <input
                type="text"
                value={formData.range || ""}
                onChange={(e) =>
                  setFormData({ ...formData, range: e.target.value })
                }
              />
            </td>
            <td style={{ fontWeight: 800 }}>WTI:</td>
            <td>
              <input
                type="text"
                value={formData.wti || ""}
                onChange={(e) =>
                  setFormData({ ...formData, wti: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>AMBIENT:</td>
            <td>
              <input
                type="text"
                value={formData.ambient || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ambient: e.target.value })
                }
              />
            </td>
            <td style={{ fontWeight: 800 }}>OTI:</td>
            <td>
              <input
                type="text"
                value={formData.oti || ""}
                onChange={(e) =>
                  setFormData({ ...formData, oti: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* HV / LV layout */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: "30px",
          alignItems: "flex-start",
        }}
      >
        {/* HV SIDE */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              textAlign: "center",
              fontWeight: 900,
              marginBottom: "8px",
            }}
          >
            HV SIDE
          </div>
          <table className="form-table">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>TAP NO.</th>
                <th style={{ width: "70%" }}>1.1 – 1.2 (Ω)</th>
              </tr>
            </thead>
            <tbody>
              {(formData.hvSide || []).map((row, idx) => (
                <tr key={row.tapNo || idx + 1}>
                  <td style={{ textAlign: "center", fontWeight: 700 }}>
                    {row.tapNo}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.resistance_11_12 || ""}
                      onChange={(e) => setHvRow(idx, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LV SIDE */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              textAlign: "center",
              fontWeight: 900,
              marginBottom: "8px",
            }}
          >
            LV SIDE
          </div>

          {/* 2.1 – 2.2 */}
          <table className="form-table">
            <thead>
              <tr>
                <th style={{ width: "40%" }}>ROW</th>
                <th style={{ width: "60%" }}>2.1 – 2.2 (Ω)</th>
              </tr>
            </thead>
            <tbody>
              {(formData.lvSide21_22 || []).map((row, idx) => (
                <tr key={`21-22-${idx}`}>
                  <td style={{ textAlign: "center", fontWeight: 700 }}>
                    {row.rowNo}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.resistance_21_22 || ""}
                      onChange={(e) => setLv21Row(idx, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 3.1 – 3.2 */}
          <table className="form-table" style={{ marginTop: "16px" }}>
            <thead>
              <tr>
                <th style={{ width: "40%" }}>ROW</th>
                <th style={{ width: "60%" }}>3.1 – 3.2 (Ω)</th>
              </tr>
            </thead>
            <tbody>
              {(formData.lvSide31_32 || []).map((row, idx) => (
                <tr key={`31-32-${idx}`}>
                  <td style={{ textAlign: "center", fontWeight: 700 }}>
                    {row.rowNo}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.resistance_31_32 || ""}
                      onChange={(e) => setLv31Row(idx, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PhotoUploadSection
        title="Winding resistance test – HV and LV side"
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

export function Stage5Form9({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const bushingRows = [
    { key: "hv11", labelVoltage: "HV (1.1)" },
    { key: "hv12", labelVoltage: "HV (1.2)" },
    { key: "lv21", labelVoltage: "LV (2.1)" },
    { key: "lv22", labelVoltage: "LV (2.2)" },
    { key: "lv31", labelVoltage: "LV (3.1)" },
    { key: "lv32", labelVoltage: "LV (3.2)" },
  ]

  const makeEmptyRow = () => ({
    voltageKv: "",
    bushingSerialNo: "",
    testMode: "",
    capacitanceFactory: "",
    capacitanceSite: "",
    tanDeltaFactory: "",
    tanDeltaSite: "",
    remark: "",
  })

  const [formData, setFormData] = useState({
    meterUsed: "",
    date: "",
    time: "",
    modelAndSerialNo: "",
    ambient: "",
    oti: "",
    wti: "",

    hvBushingSrNo: "",
    hvBushingMake: "",
    lvBushingSrNo: "",
    lvBushingMake: "",

    rows: {
      hv11: makeEmptyRow(),
      hv12: makeEmptyRow(),
      lv21: makeEmptyRow(),
      lv22: makeEmptyRow(),
      lv31: makeEmptyRow(),
      lv32: makeEmptyRow(),
    },

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 9,
        })
        if (response.data && response.data.data) {
          console.log("Data fetched from DB for stage5Form9")
          const incoming = response.data.data || {}

          const normalizeRows = (srcRows = {}) => {
            const result = {}
            bushingRows.forEach(({ key }) => {
              const src = srcRows[key] || {}
              result[key] = {
                voltageKv: src.voltageKv || "",
                bushingSerialNo: src.bushingSerialNo || "",
                testMode: src.testMode || "",
                capacitanceFactory: src.capacitanceFactory || "",
                capacitanceSite: src.capacitanceSite || "",
                tanDeltaFactory: src.tanDeltaFactory || "",
                tanDeltaSite: src.tanDeltaSite || "",
                remark: src.remark || "",
              }
            })
            return result
          }

          setFormData((prev) => ({
            ...prev,
            ...incoming,
            rows: normalizeRows(incoming.rows),
          }))
        } else {
          console.log("There is no data in DB for Stage5Form7.")
        }
      } catch (error) {
        console.error("Error fetching Stage5Form7:", error)
      }
    }
    fetchFormData()
  }, [projectName, companyName])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const setRowValue = (rowKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      rows: {
        ...(prev.rows || {}),
        [rowKey]: {
          ...((prev.rows || {})[rowKey] || makeEmptyRow()),
          [field]: value,
        },
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
    { key: "tanDeltaKit", label: "Tan delta kit" },
    { key: "calibrationReport", label: "Calibration report" },
    { key: "bushingDuringTest", label: "Bushing photograph during test" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>TAN DELTA AND CAPACITANCE TEST ON BUSHING</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td style={{ width: "20%", fontWeight: 800 }}>Bushing Sr No. (HV)</td>
            <td style={{ width: "30%" }}>
              <input
                type="text"
                value={formData.hvBushingSrNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hvBushingSrNo: e.target.value })
                }
              />
            </td>
            <td style={{ width: "20%", fontWeight: 800 }}>Bushing Make (HV)</td>
            <td style={{ width: "30%" }}>
              <input
                type="text"
                value={formData.hvBushingMake || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hvBushingMake: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ width: "20%", fontWeight: 800 }}>Bushing Sr No. (LV)</td>
            <td style={{ width: "30%" }}>
              <input
                type="text"
                value={formData.lvBushingSrNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lvBushingSrNo: e.target.value })
                }
              />
            </td>
            <td style={{ width: "20%", fontWeight: 800 }}>Bushing Make (LV)</td>
            <td style={{ width: "30%" }}>
              <input
                type="text"
                value={formData.lvBushingMake || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lvBushingMake: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ width: "20%", fontWeight: 800 }}>METER USED</td>
            <td style={{ width: "30%" }}>
              <input
                type="text"
                value={formData.meterUsed || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meterUsed: e.target.value })
                }
              />
            </td>
            <td style={{ width: "20%", fontWeight: 800 }}>DATE:</td>
            <td style={{ width: "30%" }}>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>MODEL & S. NO.</td>
            <td>
              <input
                type="text"
                value={formData.modelAndSerialNo || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    modelAndSerialNo: e.target.value,
                  })
                }
              />
            </td>
            <td style={{ fontWeight: 800 }}>TIME :</td>
            <td>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>AMBIENT:</td>
            <td>
              <input
                type="text"
                value={formData.ambient || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ambient: e.target.value })
                }
              />
            </td>
            <td style={{ fontWeight: 800 }}>OTI (°C)</td>
            <td>
              <input
                type="text"
                value={formData.oti || ""}
                onChange={(e) =>
                  setFormData({ ...formData, oti: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>WTI (°C)</td>
            <td>
              <input
                type="text"
                value={formData.wti || ""}
                onChange={(e) =>
                  setFormData({ ...formData, wti: e.target.value })
                }
              />
            </td>
            <td style={{ fontWeight: 800 }}></td>
            <td></td>
          </tr>
        </tbody>
      </table>


      {/* Main Tan Delta / Capacitance table as per format image */}
      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ width: "10%" }}>VOLTAGE (KV)</th>
            <th style={{ width: "18%" }}>BUSHING & SERIAL NO.</th>
            <th style={{ width: "10%" }}>TEST MODE</th>
            <th colSpan={2} style={{ width: "24%" }}>CAPACITANCE</th>
            <th colSpan={2} style={{ width: "24%" }}>TAN DELTA</th>
            <th style={{ width: "14%" }}>REMARK</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th style={{ fontWeight: 700 }}>FACTORY</th>
            <th style={{ fontWeight: 700 }}>SITE</th>
            <th style={{ fontWeight: 700 }}>FACTORY</th>
            <th style={{ fontWeight: 700 }}>SITE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bushingRows.map(({ key, labelVoltage }) => {
            const row = formData.rows?.[key] || makeEmptyRow()
            return (
              <tr key={key}>
                {/* VOLTAGE (KV) column – user input */}
                <td>
                  <input
                    type="text"
                    value={row.voltageKv || ""}
                    onChange={(e) =>
                      setRowValue(key, "voltageKv", e.target.value)
                    }
                  />
                </td>
                {/* BUSHING & SERIAL NO. holds HV/LV identifiers */}
                <td style={{ fontWeight: 700 }}>{labelVoltage}</td>
                <td>
                  <input
                    type="text"
                    value={row.testMode || ""}
                    onChange={(e) =>
                      setRowValue(key, "testMode", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.capacitanceFactory || ""}
                    onChange={(e) =>
                      setRowValue(key, "capacitanceFactory", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.capacitanceSite || ""}
                    onChange={(e) =>
                      setRowValue(key, "capacitanceSite", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.tanDeltaFactory || ""}
                    onChange={(e) =>
                      setRowValue(key, "tanDeltaFactory", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.tanDeltaSite || ""}
                    onChange={(e) =>
                      setRowValue(key, "tanDeltaSite", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.remark || ""}
                    onChange={(e) =>
                      setRowValue(key, "remark", e.target.value)
                    }
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Tan delta kit, calibration report, and bushing photographs during tan delta test."
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="prev-btn"
          >
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

export function Stage5Form10({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const defaultAt05kvRows = [
    { between: "HV – G", mode: "GST-GND", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "HV – G", mode: "GSTg", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "LV 1 – G", mode: "GSTg", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "LV 1 – G", mode: "GST-GND", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "HV – LV 1", mode: "UST-R", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "HV – LV 2", mode: "UST-R", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "LV 2 – G", mode: "GST-GND", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "LV 2 – G", mode: "GSTg", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "LV1-LV2", mode: "UST-R", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
  ]

  const defaultAt10kvRows = [
    { between: "HV – G", mode: "GST-GND", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "HV – G", mode: "GSTg", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "LV 1 – G", mode: "GSTg", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "LV 1 – G", mode: "GST-GND", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "HV – LV 1", mode: "UST-R", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "HV – LV 2", mode: "UST-R", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "LV 2 – G", mode: "GST-GND", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "LV 2 – G", mode: "GSTg", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
    { between: "LV1-LV2", mode: "UST-R", tanDelta: "", capacitance: "", excitationCurrent: "", dielectricLoss: "" },
  ]

  const [formData, setFormData] = useState({
    meterUsed: "",
    modelAndSerialNo: "",
    date: "",
    time: "",
    ambient: "",
    oti: "",
    wti: "",

    at05kvRows: defaultAt05kvRows,
    at10kvRows: defaultAt10kvRows,

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 10,
        })

        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form8")

          setFormData((prev) => {
            const incoming = response.data.data || {}

            const normalize = (incomingRows, defaults) => {
              const rows = Array.isArray(incomingRows) ? incomingRows : []
              return defaults.map((def, idx) => {
                const src = rows[idx] || {}
                return {
                  between: def.between,
                  mode: def.mode,
                  tanDelta: src.tanDelta ?? "",
                  capacitance: src.capacitance ?? "",
                  excitationCurrent: src.excitationCurrent ?? "",
                  dielectricLoss: src.dielectricLoss ?? "",
                }
              })
            }

            return {
              ...prev,
              ...incoming,
              at05kvRows: normalize(incoming.at05kvRows, defaultAt05kvRows),
              at10kvRows: normalize(incoming.at10kvRows, defaultAt10kvRows),
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

  const setRowValue = (tableKey, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [tableKey]: (prev[tableKey] || []).map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "tenDeltaKit", label: "Ten delta kit" },
    { key: "calibrationReport", label: "Calibration report" },
    { key: "tandeltaDuringTest", label: "During tendelta of winding photo" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>TAN DELTA AND CAPACITANCE MEASUREMENT OF WINDING</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td style={{ width: "22%", fontWeight: 800 }}>METER USED</td>
            <td style={{ width: "28%" }}>
              <input
                type="text"
                value={formData.meterUsed || ""}
                onChange={(e) => setFormData({ ...formData, meterUsed: e.target.value })}
              />
            </td>
            <td style={{ width: "22%", fontWeight: 800 }}>DATE:</td>
            <td style={{ width: "28%" }}>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>MODEL & S. NO.</td>
            <td>
              <input
                type="text"
                value={formData.modelAndSerialNo || ""}
                onChange={(e) => setFormData({ ...formData, modelAndSerialNo: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>TIME :</td>
            <td>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>OTI..................°C</td>
            <td>
              <input type="text" value={formData.oti || ""} onChange={(e) => setFormData({ ...formData, oti: e.target.value })} />
            </td>
            <td style={{ fontWeight: 800 }}>AMBIENT:</td>
            <td>
              <input
                type="text"
                value={formData.ambient || ""}
                onChange={(e) => setFormData({ ...formData, ambient: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>WTI..................°C</td>
            <td>
              <input type="text" value={formData.wti || ""} onChange={(e) => setFormData({ ...formData, wti: e.target.value })} />
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "16px" }}>
        <thead>
          <tr>
            <th style={{ width: "18%" }}>AT 05 KV IN BETWEEN</th>
            <th style={{ width: "12%" }}>MODE</th>
            <th style={{ width: "17%" }}>TAN DELTA %</th>
            <th style={{ width: "16%" }}>CAPACITANCE (pF)</th>
            <th style={{ width: "19%" }}>EXCITATION CURRENT (mA)</th>
            <th style={{ width: "18%" }}>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          {(formData.at05kvRows || []).map((row, idx) => (
            <tr key={`at05-${row.between}-${row.mode}-${idx}`}>
              <td style={{ fontWeight: 800, textAlign: "center" }}>{row.between}</td>
              <td style={{ fontWeight: 800, textAlign: "center" }}>{row.mode}</td>
              <td>
                <input
                  type="text"
                  value={row.tanDelta || ""}
                  onChange={(e) => setRowValue("at05kvRows", idx, "tanDelta", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.capacitance || ""}
                  onChange={(e) => setRowValue("at05kvRows", idx, "capacitance", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.excitationCurrent || ""}
                  onChange={(e) => setRowValue("at05kvRows", idx, "excitationCurrent", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.dielectricLoss || ""}
                  onChange={(e) => setRowValue("at05kvRows", idx, "dielectricLoss", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "18px" }}>
        <thead>
          <tr>
            <th style={{ width: "18%" }}>AT 10 KV IN BETWEEN</th>
            <th style={{ width: "12%" }}>MODE</th>
            <th style={{ width: "17%" }}>TAN DELTA %</th>
            <th style={{ width: "16%" }}>CAPACITANCE (pF)</th>
            <th style={{ width: "19%" }}>EXCITATION CURRENT (mA)</th>
            <th style={{ width: "18%" }}>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          {(formData.at10kvRows || []).map((row, idx) => (
            <tr key={`at10-${row.between}-${row.mode}-${idx}`}>
              <td style={{ fontWeight: 800, textAlign: "center" }}>{row.between}</td>
              <td style={{ fontWeight: 800, textAlign: "center" }}>{row.mode}</td>
              <td>
                <input
                  type="text"
                  value={row.tanDelta || ""}
                  onChange={(e) => setRowValue("at10kvRows", idx, "tanDelta", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.capacitance || ""}
                  onChange={(e) => setRowValue("at10kvRows", idx, "capacitance", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.excitationCurrent || ""}
                  onChange={(e) => setRowValue("at10kvRows", idx, "excitationCurrent", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.dielectricLoss || ""}
                  onChange={(e) => setRowValue("at10kvRows", idx, "dielectricLoss", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Ten delta kit, calibration report, during tendelta of winding photo"
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

export function Stage5Form11({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    ambTemp: "",
    oilTemp: "",
    wdgTemp: "",
    relativeHumidity: "",

    make: "",
    srNo: "",
    range: "",
    voltageLevel: "",

    hvEarth_15sec: "",
    hvEarth_60sec: "",
    hvEarth_600sec: "",
    hvEarth_ratio_ir60: "",
    hvEarth_ratio_ir600: "",

    lv1Earth_15sec: "",
    lv1Earth_60sec: "",
    lv1Earth_600sec: "",
    lv1Earth_ratio_ir60: "",
    lv1Earth_ratio_ir600: "",

    lv2Earth_15sec: "",
    lv2Earth_60sec: "",
    lv2Earth_600sec: "",
    lv2Earth_ratio_ir60: "",
    lv2Earth_ratio_ir600: "",

    hvLv1_15sec: "",
    hvLv1_60sec: "",
    hvLv1_600sec: "",
    hvLv1_ratio_ir60: "",
    hvLv1_ratio_ir600: "",

    hvLv2_15sec: "",
    hvLv2_60sec: "",
    hvLv2_600sec: "",
    hvLv2_ratio_ir60: "",
    hvLv2_ratio_ir600: "",

    lv1Lv2_15sec: "",
    lv1Lv2_60sec: "",
    lv1Lv2_600sec: "",
    lv1Lv2_ratio_ir60: "",
    lv1Lv2_ratio_ir600: "",

    checkedByVPES_signature: "",
    checkedByVPES_date: "",
    witnessedByCustomer_signature: "",
    witnessedByCustomer_date: "",

    photos: {},
    ...initialData,
  })

  const irRows = [
    { label: "HV-Earth", key: "hvEarth" },
    { label: "LV1-Earth", key: "lv1Earth" },
    { label: "LV2-Earth", key: "lv2Earth" },
    { label: "HV-LV1", key: "hvLv1" },
    { label: "HV-LV2", key: "hvLv2" },
    { label: "LV1-LV2", key: "lv1Lv2" },
  ]

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 5,
          formNumber: 11,
        })

        if (response.data && response.data.data) {
          console.log("Data fetched from DB for Stage5Form11")
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

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>IR VALUES OF TRANSFORMER</h2>
      </div>

      {/* Header table (exactly as image) */}
      <table className="form-table">
        <tbody>
          <tr>
            <td style={{ width: "12%", fontWeight: 800 }}>Date :</td>
            <td style={{ width: "20%" }}>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td style={{ width: "12%", fontWeight: 800 }}>Time:</td>
            <td style={{ width: "20%" }}>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
            <td style={{ width: "36%", fontWeight: 900, textAlign: "center" }}>Details of Insulation tester</td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Amb. Temp :</td>
            <td>
              <input
                type="text"
                value={formData.ambTemp || ""}
                onChange={(e) => setFormData({ ...formData, ambTemp: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>Make :</td>
            <td>
              <input
                type="text"
                value={formData.make || ""}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </td>
            <td rowSpan="4"></td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Oil Temp. :</td>
            <td>
              <input
                type="text"
                value={formData.oilTemp || ""}
                onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>Sr. No. :</td>
            <td>
              <input
                type="text"
                value={formData.srNo || ""}
                onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Wdg. Temp. :</td>
            <td>
              <input
                type="text"
                value={formData.wdgTemp || ""}
                onChange={(e) => setFormData({ ...formData, wdgTemp: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>Range :</td>
            <td>
              <input
                type="text"
                value={formData.range || ""}
                onChange={(e) => setFormData({ ...formData, range: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Relative Humidity :</td>
            <td>
              <input
                type="text"
                value={formData.relativeHumidity || ""}
                onChange={(e) => setFormData({ ...formData, relativeHumidity: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>Voltage Level :</td>
            <td>
              <input
                type="text"
                value={formData.voltageLevel || ""}
                onChange={(e) => setFormData({ ...formData, voltageLevel: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* IR values table (exactly as image) */}
      <table className="form-table" style={{ marginTop: "26px" }}>
        <thead>
          <tr>
            <th style={{ width: "24%" }}></th>
            <th style={{ width: "15%" }}>
              15 Sec <br />
              (MΩ)
            </th>
            <th style={{ width: "15%" }}>
              60 Sec <br />
              (MΩ)
            </th>
            <th style={{ width: "14%" }}>
              600 Sec <br />
              (MΩ)
            </th>
            <th style={{ width: "16%" }}>
              Ratio of IR 60 <br />
              IR 15
            </th>
            <th style={{ width: "16%" }}>
              Ratio of IR 600 <br />
              IR 60
            </th>
          </tr>
        </thead>
        <tbody>
          {irRows.map(({ label, key }) => (
            <tr key={key}>
              <td style={{ fontWeight: 800 }}>{label}</td>
              <td>
                <input
                  type="text"
                  value={formData[`${key}_15sec`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`${key}_15sec`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`${key}_60sec`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`${key}_60sec`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`${key}_600sec`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`${key}_600sec`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`${key}_ratio_ir60`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`${key}_ratio_ir60`]: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData[`${key}_ratio_ir600`] || ""}
                  onChange={(e) => setFormData({ ...formData, [`${key}_ratio_ir600`]: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Note line (exactly as image) */}
      <div style={{ marginTop: "24px", fontWeight: 800, fontSize: "16px" }}>Note: - Photographs to be added: -</div>
      <div style={{ marginTop: "6px", fontWeight: 800, fontSize: "16px" }}>
        SFRA kit calibration, ten delta kit calibration, multimeter, megger, winding resistance kit, clamp meter.
      </div>

      {/* Signature table (exactly as image) */}
      <table className="form-table" style={{ marginTop: "26px" }}>
        <tbody>
          <tr>
            <td style={{ width: "50%", fontWeight: 900 }}>Checked By VPES :</td>
            <td style={{ width: "50%", fontWeight: 900 }}>Witnessed By Customer :</td>
          </tr>
          <tr>
            <td style={{ padding: 0 }}>
              <table className="form-table" style={{ marginTop: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "25%", fontWeight: 800 }}>Signature</td>
                    <td style={{ width: "75%" }}>
                      <SignatureBox
                        label=""
                        nameValue=""
                        onNameChange={() => {}}
                        onSignatureChange={(signature) => setFormData({ ...formData, checkedByVPES_signature: signature })}
                        initialSignature={formData.checkedByVPES_signature}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>Date</td>
                    <td>
                      <input
                        type="date"
                        value={formData.checkedByVPES_date || ""}
                        onChange={(e) => setFormData({ ...formData, checkedByVPES_date: e.target.value })}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            <td style={{ padding: 0 }}>
              <table className="form-table" style={{ marginTop: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "25%", fontWeight: 800 }}>Signature</td>
                    <td style={{ width: "75%" }}>
                      <SignatureBox
                        label=""
                        nameValue=""
                        onNameChange={() => {}}
                        onSignatureChange={(signature) => setFormData({ ...formData, witnessedByCustomer_signature: signature })}
                        initialSignature={formData.witnessedByCustomer_signature}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>Date</td>
                    <td>
                      <input
                        type="date"
                        value={formData.witnessedByCustomer_date || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, witnessedByCustomer_date: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="SFRA kit calibration, ten delta kit calibration, multimeter, megger, winding resistance kit, clamp meter."
        photos={[
          { key: "sfraKitCalibration", label: "SFRA kit calibration" },
          { key: "tenDeltaKitCalibration", label: "Ten delta kit calibration" },
          { key: "multimeter", label: "Multimeter" },
          { key: "megger", label: "Megger" },
          { key: "windingResistanceKit", label: "Winding resistance kit" },
          { key: "clampMeter", label: "Clamp meter" },
        ]}
        onPhotoChange={(key, file) =>
          setFormData((prev) => ({
            ...prev,
            photos: { ...(prev.photos || {}), [key]: file },
          }))
        }
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 5
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
  const valveRows = [
    { sr: "A", particulars: "Bucholz to Conservator", key: "bucholzToConservator", qtyLabel: "" },
    { sr: "B", particulars: "Main Tank to Bucholz", key: "mainTankToBucholz", qtyLabel: "" },
    { sr: "C", particulars: "Radiator Top Valves", key: "radiatorTopValves", qtyLabel: "" },
    { sr: "D", particulars: "Radiator Bottom Valves", key: "radiatorBottomValves", qtyLabel: "" },
    { sr: "E", particulars: "Top 200mm Pipeline", key: "top200mmPipeline", qtyLabel: "" },
    { sr: "F", particulars: "Top Header", key: "topHeader", qtyLabel: "" },
    { sr: "G", particulars: "Bottom Header", key: "bottomHeader", qtyLabel: "" },
    { sr: "H", particulars: "Main Tank to Radiator Bank", key: "mainTankToRadiatorBank", qtyLabel: "" },
    { sr: "I", particulars: "Oil Pump to R.F.B.D.", key: "oilPumpToRFBD", qtyLabel: "" },
    { sr: "J", particulars: "Oil Pump to Radiator Bank", key: "oilPumpToRadiatorBank", qtyLabel: "" },
    { sr: "K", particulars: "Top Filter Valve", key: "topFilterValve", qtyLabel: "" },
    { sr: "L", particulars: "Bottom Filter Valve", key: "bottomFilterValve", qtyLabel: "" },
    { sr: "M", particulars: "Drain Valve", key: "drainValve", qtyLabel: "" },
  ]

  const airVentingSimpleRows = [
    { sr: "A", particulars: "Main Tank", key: "mainTank" },
    { sr: "E", particulars: "Pipe Line Top", key: "pipeLineTop" },
    { sr: "F", particulars: "Pipe Line Bottom", key: "pipeLineBottom" },
    { sr: "I", particulars: "Radiator – Top", key: "radiatorTop" },
    { sr: "J", particulars: "RFBD", key: "rfbd" },
    { sr: "L", particulars: "Diverter Switch", key: "diverterSwitch" },
  ]

  const protectionRows = [
    { sr: "A", particulars: "BUCHHOLZ", label: "ALARM", key: "buchholzAlarm" },
    { sr: "", particulars: "", label: "TRIP", key: "buchholzTrip" },
    { sr: "B", particulars: "MOG", label: "ALARM", key: "mogAlarm" },
    { sr: "C", particulars: "PRV", label: "TRIP", key: "prvTrip" },
    { sr: "D", particulars: "OTI", label: "ALARM", key: "otiAlarm" },
    { sr: "", particulars: "", label: "TRIP", key: "otiTrip" },
    { sr: "E", particulars: "WTI", label: "ALARM", key: "wtiAlarm" },
    { sr: "", particulars: "", label: "TRIP", key: "wtiTrip" },
  ]

  const [formData, setFormData] = useState({
    customerName: "",
    projectCompanyName: "",
    nameOfTSS: "",
    ratingMVA: "",
    ratingVoltage: "",
    srNo: "",
    manufacturerName: "",

    valveStatus: valveRows.reduce((acc, r) => {
      acc[r.key] = { qty: "", open: "", shut: "", na: "" }
      return acc
    }, {}),

    airVenting: {
      mainTank: "",
      pipeLineTop: "",
      pipeLineBottom: "",
      radiatorTop: "",
      rfbd: "",
      diverterSwitch: "",
      bucholzRelay: { location1: "", location2: "" },
      hvBushing: { location11: "", location12: "" },
      lvBushing: { location21: "", location22: "", location31: "", location32: "" },
      headerTop: { location1: "", location2: "" },
      headerBottom: { location1: "", location2: "" },
      oilPump: { location1: "", location2: "", location3: "", location4: "" },
    },

    protectionTrails: protectionRows.reduce((acc, r) => {
      acc[r.key] = ""
      return acc
    }, {}),
    otiSetTemperature: "",

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 6,
          formNumber: 1,
        })
        if (response.data && response.data.data) {
          const incoming = response.data.data || {}
          setFormData((prev) => {
            const mergedValveStatus = valveRows.reduce((acc, r) => {
              const src = (incoming.valveStatus || {})[r.key] || {}
              acc[r.key] = {
                qty: src.qty ?? "",
                open: src.open ?? "",
                shut: src.shut ?? "",
                na: src.na ?? "",
              }
              return acc
            }, {})

            const mergedAirVenting = {
              ...prev.airVenting,
              ...(incoming.airVenting || {}),
              bucholzRelay: { ...(prev.airVenting?.bucholzRelay || {}), ...((incoming.airVenting || {}).bucholzRelay || {}) },
              hvBushing: { ...(prev.airVenting?.hvBushing || {}), ...((incoming.airVenting || {}).hvBushing || {}) },
              lvBushing: { ...(prev.airVenting?.lvBushing || {}), ...((incoming.airVenting || {}).lvBushing || {}) },
              headerTop: { ...(prev.airVenting?.headerTop || {}), ...((incoming.airVenting || {}).headerTop || {}) },
              headerBottom: { ...(prev.airVenting?.headerBottom || {}), ...((incoming.airVenting || {}).headerBottom || {}) },
              oilPump: { ...(prev.airVenting?.oilPump || {}), ...((incoming.airVenting || {}).oilPump || {}) },
            }

            const mergedProtectionTrails = protectionRows.reduce((acc, r) => {
              acc[r.key] = (incoming.protectionTrails || {})[r.key] ?? prev.protectionTrails?.[r.key] ?? ""
              return acc
            }, {})

            return {
              ...prev,
              ...incoming,
              valveStatus: mergedValveStatus,
              airVenting: mergedAirVenting,
              protectionTrails: mergedProtectionTrails,
              otiSetTemperature: incoming.otiSetTemperature ?? prev.otiSetTemperature ?? "",
            }
          })
        } else {
          console.log("There is no data in DB for Stage6Form1.")
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

  const setValveCell = (rowKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      valveStatus: {
        ...(prev.valveStatus || {}),
        [rowKey]: { ...((prev.valveStatus || {})[rowKey] || {}), [field]: value },
      },
    }))
  }

  const setAirVentingSimple = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      airVenting: { ...(prev.airVenting || {}), [key]: value },
    }))
  }

  const setAirVentingNested = (group, field, value) => {
    setFormData((prev) => ({
      ...prev,
      airVenting: {
        ...(prev.airVenting || {}),
        [group]: { ...((prev.airVenting || {})[group] || {}), [field]: value },
      },
    }))
  }

  const setProtection = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      protectionTrails: { ...(prev.protectionTrails || {}), [key]: value },
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    {
      key: "preCommissioningChecklist",
      label: "Pre-commissioning checklist / site condition photograph",
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>PRE-COMMISSIONING CHECKLIST</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td style={{ width: "25%", fontWeight: 800 }}>Name of end customer</td>
            <td style={{ width: "25%" }}>
              <input
                type="text"
                value={formData.customerName || ""}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </td>
            <td style={{ width: "25%", fontWeight: 800 }}>Rating MVA</td>
            <td style={{ width: "25%" }}>
              <input
                type="text"
                value={formData.ratingMVA || ""}
                onChange={(e) => setFormData({ ...formData, ratingMVA: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Name of project company</td>
            <td>
              <input
                type="text"
                value={formData.projectCompanyName || ""}
                onChange={(e) => setFormData({ ...formData, projectCompanyName: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>Rating Voltage</td>
            <td>
              <input
                type="text"
                value={formData.ratingVoltage || ""}
                onChange={(e) => setFormData({ ...formData, ratingVoltage: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Name of TSS</td>
            <td>
              <input
                type="text"
                value={formData.nameOfTSS || ""}
                onChange={(e) => setFormData({ ...formData, nameOfTSS: e.target.value })}
              />
            </td>
            <td style={{ fontWeight: 800 }}>Sr. no.</td>
            <td>
              <input
                type="text"
                value={formData.srNo || ""}
                onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800 }}>Manufacturer name</td>
            <td colSpan={3}>
              <input
                type="text"
                value={formData.manufacturerName || ""}
                onChange={(e) => setFormData({ ...formData, manufacturerName: e.target.value })}
                style={{ width: "100%" }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ width: "8%" }}>Sr.No.</th>
            <th style={{ width: "36%" }}>Particulars</th>
            <th style={{ width: "10%" }}>Qty</th>
            <th colSpan={3} style={{ width: "46%" }}>
              Status
              <div style={{ display: "flex" }}>
                <div style={{ width: "33.33%", textAlign: "center", fontWeight: 800 }}>Open</div>
                <div style={{ width: "33.33%", textAlign: "center", fontWeight: 800 }}>Shut</div>
                <div style={{ width: "33.33%", textAlign: "center", fontWeight: 800 }}>N/A</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 900, textAlign: "center" }}>I</td>
            <td style={{ fontWeight: 900 }}>Valve Status</td>
            <td>
              <input
                type="text"
                value={formData.valveStatusSectionQty || ""}
                onChange={(e) => setFormData({ ...formData, valveStatusSectionQty: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.valveStatusSectionOpen || ""}
                onChange={(e) => setFormData({ ...formData, valveStatusSectionOpen: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.valveStatusSectionShut || ""}
                onChange={(e) => setFormData({ ...formData, valveStatusSectionShut: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.valveStatusSectionNa || ""}
                onChange={(e) => setFormData({ ...formData, valveStatusSectionNa: e.target.value })}
              />
            </td>
          </tr>

          {valveRows.map((r) => (
            <tr key={r.key}>
              <td style={{ fontWeight: 800, textAlign: "center" }}>{r.sr}</td>
              <td style={{ fontWeight: 800 }}>{r.particulars}</td>

              {/* Qty column (editable). If you later want fixed labels like 1/2, set r.qtyLabel and render it instead */}
              <td>
                <input
                  type="text"
                  value={formData.valveStatus?.[r.key]?.qty || ""}
                  onChange={(e) => setValveCell(r.key, "qty", e.target.value)}
                  placeholder={r.qtyLabel || ""}
                />
              </td>

              <td>
                <input
                  type="text"
                  value={formData.valveStatus?.[r.key]?.open || ""}
                  onChange={(e) => setValveCell(r.key, "open", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData.valveStatus?.[r.key]?.shut || ""}
                  onChange={(e) => setValveCell(r.key, "shut", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData.valveStatus?.[r.key]?.na || ""}
                  onChange={(e) => setValveCell(r.key, "na", e.target.value)}
                />
              </td>
            </tr>
          ))}

          <tr>
            <td style={{ fontWeight: 900, textAlign: "center" }}>II</td>
            <td style={{ fontWeight: 900 }}>Air Venting</td>
            <td colSpan={3} style={{ fontWeight: 900 }}>
              Done from the Following Locations:
            </td>
            <td></td>
          </tr>

          {airVentingSimpleRows.map((r) => (
            <tr key={r.key}>
              <td style={{ fontWeight: 800, textAlign: "center" }}>{r.sr}</td>
              <td style={{ fontWeight: 800 }}>{r.particulars}</td>
              <td></td>
              <td colSpan={3}>
                <input
                  type="text"
                  value={formData.airVenting?.[r.key] || ""}
                  onChange={(e) => setAirVentingSimple(r.key, e.target.value)}
                />
              </td>
            </tr>
          ))}

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>B</td>
            <td style={{ fontWeight: 800 }}>Bucholz Relay</td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>1</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.bucholzRelay?.location1 || ""}
                onChange={(e) => setAirVentingNested("bucholzRelay", "location1", e.target.value)}
              />
            </td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>2</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.bucholzRelay?.location2 || ""}
                onChange={(e) => setAirVentingNested("bucholzRelay", "location2", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>C</td>
            <td style={{ fontWeight: 800 }}>HV Bushing</td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>1.1</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.hvBushing?.location11 || ""}
                onChange={(e) => setAirVentingNested("hvBushing", "location11", e.target.value)}
              />
            </td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>1.2</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.hvBushing?.location12 || ""}
                onChange={(e) => setAirVentingNested("hvBushing", "location12", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>D</td>
            <td style={{ fontWeight: 800 }}>LV Bushing</td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>2.1</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.lvBushing?.location21 || ""}
                onChange={(e) => setAirVentingNested("lvBushing", "location21", e.target.value)}
              />
            </td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>2.2</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.lvBushing?.location22 || ""}
                onChange={(e) => setAirVentingNested("lvBushing", "location22", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td></td>
            <td></td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>3.1</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.lvBushing?.location31 || ""}
                onChange={(e) => setAirVentingNested("lvBushing", "location31", e.target.value)}
              />
            </td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>3.2</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.lvBushing?.location32 || ""}
                onChange={(e) => setAirVentingNested("lvBushing", "location32", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>G</td>
            <td style={{ fontWeight: 800 }}>Header – Top</td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>1</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.headerTop?.location1 || ""}
                onChange={(e) => setAirVentingNested("headerTop", "location1", e.target.value)}
              />
            </td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>2</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.headerTop?.location2 || ""}
                onChange={(e) => setAirVentingNested("headerTop", "location2", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>H</td>
            <td style={{ fontWeight: 800 }}>Header – Bottom</td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>1</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.headerBottom?.location1 || ""}
                onChange={(e) => setAirVentingNested("headerBottom", "location1", e.target.value)}
              />
            </td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>2</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.headerBottom?.location2 || ""}
                onChange={(e) => setAirVentingNested("headerBottom", "location2", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>K</td>
            <td style={{ fontWeight: 800 }}>Oil Pump</td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>1</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.oilPump?.location1 || ""}
                onChange={(e) => setAirVentingNested("oilPump", "location1", e.target.value)}
              />
            </td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>2</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.oilPump?.location2 || ""}
                onChange={(e) => setAirVentingNested("oilPump", "location2", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td></td>
            <td></td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>3</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.oilPump?.location3 || ""}
                onChange={(e) => setAirVentingNested("oilPump", "location3", e.target.value)}
              />
            </td>
            <td style={{ fontWeight: 800, textAlign: "center" }}>4</td>
            <td>
              <input
                type="text"
                value={formData.airVenting?.oilPump?.location4 || ""}
                onChange={(e) => setAirVentingNested("oilPump", "location4", e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 900, textAlign: "center" }}>III</td>
            <td style={{ fontWeight: 900 }}>Protection Trails</td>
            <td colSpan={3} style={{ fontWeight: 900, textAlign: "center" }}>
              Checked
            </td>
            <td></td>
          </tr>

          {protectionRows.map((r) => (
            <tr key={r.key}>
              <td style={{ fontWeight: 800, textAlign: "center" }}>{r.sr}</td>
              <td style={{ fontWeight: 800 }}>{r.particulars}</td>
              <td style={{ fontWeight: 800, textAlign: "center" }}>{r.label}</td>
              <td colSpan={r.key === "otiAlarm" ? 1 : 3}>
                <input
                  type="text"
                  value={formData.protectionTrails?.[r.key] || ""}
                  onChange={(e) => setProtection(r.key, e.target.value)}
                />
              </td>
              {r.key === "otiAlarm" ? (
                <>
                  <td style={{ fontWeight: 800, textAlign: "center" }}>Set Temperature</td>
                  <td>
                    <input
                      type="text"
                      value={formData.otiSetTemperature || ""}
                      onChange={(e) => setFormData({ ...formData, otiSetTemperature: e.target.value })}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td></td>
                  <td></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Pre-commissioning checklist photographs"
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
// Stage 6 Form Components - Based on provided images
// Stage 6 Form 1: Pre-Commissioning Checklist
export function PreCommissioningChecklistForm({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    projectName: "",
    ratingMVA: "63 MVA",
    ratingVoltage: "132KV±7.5 KV",
    srNo: "",
    manufacturerName: "Vishvas Power Engg. Services Pvt. Ltd.",

    // Checklist items
    valveStatus: "",
    bushingToConservator: "",
    bushingToRadiator: "",
    radiatorTopValves: "",
    radiatorBottomValves: "",
    mainTankToRadiator: "",
    topHeader: "",
    bottomHeader: "",
    mainTankToRadiatorBank: "",
    oilPumpToRFRD: "",
    oilPumpToRadiatorBank: "",
    topFilterValve: "",
    bottomFilterValve: "",
    drainValve: "",
    samplingValve: "",

    // Air venting from following locations
    mainTank: "",
    conservator: "",
    hvBushing: { 1.1: "", 1.2: "" },
    lvBushing: { 2.1: "", 2.2: "", 3.1: "", 3.2: "" },
    pipeLineTop: "",
    pipeLineBottom: "",
    headerTop: "",
    headerBottom: "",
    radiatorTop: "",
    nfrd: "",
    oilPump: "",
    diverseSwitch: "",
    protectionTrails: "",
    buchholz: "",

    // MOG
    mog: "",
    prv: "",

    // OTI
    oti: "",
    wti: "",

    // Connectors
    connectors: {
      lv21: "",
      lv22: "",
      lv31: "",
      lv32: "",
    },

    // Final checks
    anabondApplied: "",
    jointsSealed: "",
    foreignMaterialCleared: "",
    temperatureWTI: "",
    temperatureOTI: "",

    // Signatures
    signatures: {
      vpesName: "",
      vpesSignature: "",
      vpesDate: "",
      customerName: "",
      customerSignature: "",
      customerDate: "",
    },

    photos: {},
    ...initialData,
  })

  const handleSignatureChange = (key, type, value) => {
    setFormData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [`${key}${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
      },
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

  const photoRequirements = [
    {
      key: "earthingMainTank",
      label:
        "Earthing's of main tank & bushing, sealing of Cable gland, bushing test tap & thimble, Buchholz terminal plate, etc...., Full Photo of transformer",
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>VISHVAS POWER ENGINEERING SERVICES PVT. LTD. NAGPUR</h2>
        <h3>PRE-COMMISSIONING CHECKLIST</h3>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>Name of end customer</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </td>
            <td>
              <strong>Rating MVA</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ratingMVA}
                onChange={(e) => setFormData({ ...formData, ratingMVA: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Name of project company</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              />
            </td>
            <td>
              <strong>Rating Voltage</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ratingVoltage}
                onChange={(e) => setFormData({ ...formData, ratingVoltage: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Name of TSS</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.nameTSS}
                onChange={(e) => setFormData({ ...formData, nameTSS: e.target.value })}
              />
            </td>
            <td>
              <strong>Sr. no.</strong>
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
              <strong>Manufacturer name</strong>
            </td>
            <td colSpan="3">
              <input
                type="text"
                value={formData.manufacturerName}
                onChange={(e) => setFormData({ ...formData, manufacturerName: e.target.value })}
                style={{ width: "100%" }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Sr.No.</th>
            <th>Particulars</th>
            <th>Qty</th>
            <th>Open</th>
            <th>Status Closed</th>
            <th>N/A</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>A</strong>
            </td>
            <td>Valve Status</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>B</strong>
            </td>
            <td>Bushing to Conservator</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>C</strong>
            </td>
            <td>Bushing to Radiator</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>D</strong>
            </td>
            <td>Radiator Top Valves</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>E</strong>
            </td>
            <td>Radiator Bottom Valves</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>F</strong>
            </td>
            <td>Main Tank to Radiator</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>G</strong>
            </td>
            <td>Top Header</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>H</strong>
            </td>
            <td>Bottom Header</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>I</strong>
            </td>
            <td>Main Tank to Radiator Bank</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>J</strong>
            </td>
            <td>Oil Pump to R.F.R.D</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>K</strong>
            </td>
            <td>Oil Pump to Radiator Bank</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>L</strong>
            </td>
            <td>Top Filter Valve</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>M</strong>
            </td>
            <td>Bottom Filter Valve</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>N</strong>
            </td>
            <td>Drain Valve</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>O</strong>
            </td>
            <td>Sampling Valve</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "30px" }}>Air venting from the Following Locations:</h4>
      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>A</strong>
            </td>
            <td>Main Tank</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>B</strong>
            </td>
            <td>Conservator</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>C</strong>
            </td>
            <td>HV Bushing</td>
            <td>1.1</td>
            <td>1.2</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>D</strong>
            </td>
            <td>LV Bushing</td>
            <td>2.1</td>
            <td>2.2</td>
            <td>3.1</td>
            <td>3.2</td>
          </tr>
          <tr>
            <td>
              <strong>E</strong>
            </td>
            <td>Pipe Line Top</td>
            <td>1</td>
            <td>2</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>F</strong>
            </td>
            <td>Pipe Line Bottom</td>
            <td>1</td>
            <td>2</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>G</strong>
            </td>
            <td>Header - Top</td>
            <td>1</td>
            <td>2</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>H</strong>
            </td>
            <td>Header - Bottom</td>
            <td>1</td>
            <td>2</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>I</strong>
            </td>
            <td>Radiator - Top</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>J</strong>
            </td>
            <td>NFRD</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
          <tr>
            <td>
              <strong>K</strong>
            </td>
            <td>Oil Pump</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>L</strong>
            </td>
            <td>Diverse Switch</td>
            <td></td>
            <td></td>
            <td>Checked</td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>M</strong>
            </td>
            <td>Protection Trails</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>N</strong>
            </td>
            <td>BUCHHOLZ</td>
            <td>ALARM</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td>
              <strong>B</strong>
            </td>
            <td>MOG</td>
            <td>ALARM</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>C</strong>
            </td>
            <td>PRV</td>
            <td>TRIP</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>D</strong>
            </td>
            <td>OTI</td>
            <td>ALARM</td>
            <td>Set Temperature</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>TRIP</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>E</strong>
            </td>
            <td>WTI</td>
            <td>ALARM</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>TRIP</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td>
              <strong>XI</strong>
            </td>
            <td>Connectors</td>
            <td>LV Jumpers</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>2.1</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>2.2</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>3.1</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>3.2</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td>
              <strong>XII</strong>
            </td>
            <td>Anabond applied to HV Bushing thimble Sealed</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>1</strong>
            </td>
            <td>Anabond applied to HV Bushing</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>2</strong>
            </td>
            <td>All joints properly sealed against Water Ingress</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>3</strong>
            </td>
            <td>All Foreign material cleared from Transformer</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Temperature of °C WTI</strong>
          <input
            type="text"
            value={formData.temperatureWTI}
            onChange={(e) => setFormData({ ...formData, temperatureWTI: e.target.value })}
            style={{ marginLeft: "10px", width: "100px" }}
          />
        </p>
        <p>
          <strong>OTI</strong>
          <input
            type="text"
            value={formData.temperatureOTI}
            onChange={(e) => setFormData({ ...formData, temperatureOTI: e.target.value })}
            style={{ marginLeft: "10px", width: "100px" }}
          />
        </p>
      </div>

      <div style={{ marginTop: "30px" }}>
        <p>
          <strong>
            Remarks: The Transformer as mentioned above has been jointly cleared for charging as on _____. All the
            necessary pre-commissioning checks and protection trials have been found satisfactory. Transformer has been
            cleared from all foreign material and is ready for charging.
          </strong>
        </p>
      </div>

      <PhotoUploadSection
        title="Earthing's of main tank & bushing, sealing of Cable gland, bushing test tap & thimble, Buchholz terminal plate, etc...., Full Photo of transformer"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="signature-section">
        <div className="signature-box">
          <label>Checked by VPES :</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.signatures.vpesName}
            onChange={(e) => handleSignatureChange("vpes", "name", e.target.value)}
          />
          <SignatureBox
            label=""
            nameValue=""
            onNameChange={() => {}}
            onSignatureChange={(signature) => handleSignatureChange("vpes", "signature", signature)}
            initialSignature={formData.signatures.vpesSignature}
          />
          <input
            type="date"
            value={formData.signatures.vpesDate}
            onChange={(e) => handleSignatureChange("vpes", "date", e.target.value)}
          />
        </div>

        <div className="signature-box">
          <label>Witnessed By Customer :</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.signatures.customerName}
            onChange={(e) => handleSignatureChange("customer", "name", e.target.value)}
          />
          <SignatureBox
            label=""
            nameValue=""
            onNameChange={() => {}}
            onSignatureChange={(signature) => handleSignatureChange("customer", "signature", signature)}
            initialSignature={formData.signatures.customerSignature}
          />
          <input
            type="date"
            value={formData.signatures.customerDate}
            onChange={(e) => handleSignatureChange("customer", "date", e.target.value)}
          />
        </div>
      </div>

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

export function Stage6Form2({ onSubmit, onPrevious, initialData, isLastFormOfStage, companyName, projectName }) {
  const [formData, setFormData] = useState({
    // IV Transformer Protection relay (as per format image)
    overCurrentRelay: { make: "", srNo: "", lastTestedDate: "", remark: "" }, // A
    restrictedEarthFaultRelay: { make: "", srNo: "", lastTestedDate: "", remark: "" }, // B
    differentialRelay: { make: "", srNo: "", lastTestedDate: "", remark: "" }, // C
    masterTripRelay: { make: "", srNo: "", lastTestedDate: "", remark: "" }, // D
    separateEarthPit: "", // E yes/no

    // F/G/H simple text fields (single cell)
    neutralEarthPitResistanceValues: "",
    gridEarthResistanceValues: "",
    cleaningCheckingMainTankEarthing: "",

    // I LA Counter reading (3 columns: 1.1/2.1/3.1 and 1.2/2.2/3.2)
    laCounterReading: {
      1.1: "",
      2.1: "",
      3.1: "",
      1.2: "",
      2.2: "",
      3.2: "",
    },

    // J/K simple
    whetherLaEarthingChecked: "",
    irValueOfLa: "",

    // L-M-N-O-P-Q phases
    phases: {
      1.1: "",
      1.2: "",
      2.1: "",
      2.2: "",
      3.1: "",
      3.2: "",
    },

    // IV Accessories Checking
    accessories: {
      fanStart: { setTemp: "", checked: "", noOfHrsRun: "" },
      fanStop: { setTemp: "", checked: "", noOfHrsRun: "" },
      pumpStart1: { setTemp: "", checked: "", noOfHrsRun: "" }, // C
      pumpStart2: { setTemp: "", checked: "", noOfHrsRun: "" }, // D (as per image duplicate)
      octcTapPosition: { setTemp: "", checked: "", noOfHrsRun: "" }, // V
      diverterSwitch: { setTemp: "", checked: "", noOfHrsRun: "" }, // A
      driveMechanism: { setTemp: "", checked: "", noOfHrsRun: "" }, // B
      tpiRtcc: { setTemp: "", checked: "", noOfHrsRun: "" }, // C
    },

    // VI Bushing Test Tap Earthed
    bushingTestTapEarthed: {
      hvChecked: { 1.1: "", 1.2: "" },
      lvChecked: { 2.1: "", 2.2: "", 3.1: "", 3.2: "" },
    },

    // VII Oil Values
    oilValues: {
      bdvKv: "",
      moistureContentPpm: "",
    },

    // VIII Final IR Values (10/60/600/PI)
    finalIrValues: {
      hvEarth: { at10: "", at60: "", at600: "", pi: "" },
      lv1Earth: { at10: "", at60: "", at600: "", pi: "" },
      lv2Earth: { at10: "", at60: "", at600: "", pi: "" },
      hvLv1: { at10: "", at60: "", at600: "", pi: "" },
      hvLv2: { at10: "", at60: "", at600: "", pi: "" },
      lv1Lv2: { at10: "", at60: "", at600: "", pi: "" },
      coreToFrame: { at10: "", at60: "", at600: "", pi: "" },
      frameToTank: { at10: "", at60: "", at600: "", pi: "" },
      removalLinkAgainTightensAndCheckZeroMegger: { at10: "", at60: "", at600: "", pi: "" },
    },

    // IX
    oilLevelInConservator: "",

    // X Connectors - HV Jumpers 1.1/1.2
    connectorsHvJumpers: { 1.1: "", 1.2: "" },

    photos: {},
    ...initialData,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.post(`${BACKEND_API_BASE_URL}/api/vconnectData/getTable`, {
          companyName,
          projectName,
          stage: 6,
          formNumber: 2,
        })
        if (response.data && response.data.data) {
          setFormData((prev) => ({ ...prev, ...response.data.data }))
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

  const setRelayField = (relayKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [relayKey]: { ...(prev[relayKey] || {}), [field]: value },
    }))
  }

  const setAccessoryField = (rowKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      accessories: {
        ...(prev.accessories || {}),
        [rowKey]: { ...((prev.accessories || {})[rowKey] || {}), [field]: value },
      },
    }))
  }

  const setBushingTapEarthed = (group, key, value) => {
    setFormData((prev) => ({
      ...prev,
      bushingTestTapEarthed: {
        ...(prev.bushingTestTapEarthed || {}),
        [group]: { ...((prev.bushingTestTapEarthed || {})[group] || {}), [key]: value },
      },
    }))
  }

  const setFinalIr = (rowKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      finalIrValues: {
        ...(prev.finalIrValues || {}),
        [rowKey]: { ...((prev.finalIrValues || {})[rowKey] || {}), [field]: value },
      },
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  // Keep only the photo label from the requirement image
  const photoRequirements = [{ key: "stage6Form2", label: "Transformer Protection relay / Accessories / IR values" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>Transformer Protection relay / Accessories Checking / IR Values</h2>
      </div>

      {/* IV Transformer Protection relay */}
      <table className="form-table">
        <thead>
          <tr>
            <th style={{ width: "6%" }}>IV</th>
            <th style={{ width: "44%" }}>Transformer Protection relay</th>
            <th style={{ width: "12%" }}>Make</th>
            <th style={{ width: "12%" }}>sr.no.</th>
            <th style={{ width: "14%" }}>last tested date.</th>
            <th style={{ width: "12%" }}>Remark</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>A</td>
            <td style={{ fontWeight: 800 }}>Over-current relay</td>
            <td>
              <input type="text" value={formData.overCurrentRelay?.make || ""} onChange={(e) => setRelayField("overCurrentRelay", "make", e.target.value)} />
            </td>
            <td>
              <input type="text" value={formData.overCurrentRelay?.srNo || ""} onChange={(e) => setRelayField("overCurrentRelay", "srNo", e.target.value)} />
            </td>
            <td>
              <input type="date" value={formData.overCurrentRelay?.lastTestedDate || ""} onChange={(e) => setRelayField("overCurrentRelay", "lastTestedDate", e.target.value)} />
            </td>
            <td>
              <input type="text" value={formData.overCurrentRelay?.remark || ""} onChange={(e) => setRelayField("overCurrentRelay", "remark", e.target.value)} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>B</td>
            <td style={{ fontWeight: 800 }}>Restricted Earth fault Relay</td>
            <td>
              <input type="text" value={formData.restrictedEarthFaultRelay?.make || ""} onChange={(e) => setRelayField("restrictedEarthFaultRelay", "make", e.target.value)} />
            </td>
            <td>
              <input type="text" value={formData.restrictedEarthFaultRelay?.srNo || ""} onChange={(e) => setRelayField("restrictedEarthFaultRelay", "srNo", e.target.value)} />
            </td>
            <td>
              <input type="date" value={formData.restrictedEarthFaultRelay?.lastTestedDate || ""} onChange={(e) => setRelayField("restrictedEarthFaultRelay", "lastTestedDate", e.target.value)} />
            </td>
            <td>
              <input type="text" value={formData.restrictedEarthFaultRelay?.remark || ""} onChange={(e) => setRelayField("restrictedEarthFaultRelay", "remark", e.target.value)} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>C</td>
            <td style={{ fontWeight: 800 }}>Differential Relay</td>
            <td>
              <input type="text" value={formData.differentialRelay?.make || ""} onChange={(e) => setRelayField("differentialRelay", "make", e.target.value)} />
            </td>
            <td>
              <input type="text" value={formData.differentialRelay?.srNo || ""} onChange={(e) => setRelayField("differentialRelay", "srNo", e.target.value)} />
            </td>
            <td>
              <input type="date" value={formData.differentialRelay?.lastTestedDate || ""} onChange={(e) => setRelayField("differentialRelay", "lastTestedDate", e.target.value)} />
            </td>
            <td>
              <input type="text" value={formData.differentialRelay?.remark || ""} onChange={(e) => setRelayField("differentialRelay", "remark", e.target.value)} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>D</td>
            <td style={{ fontWeight: 800 }}>Master Trip Relay</td>
            <td>
              <input type="text" value={formData.masterTripRelay?.make || ""} onChange={(e) => setRelayField("masterTripRelay", "make", e.target.value)} />
            </td>
            <td>
              <input type="text" value={formData.masterTripRelay?.srNo || ""} onChange={(e) => setRelayField("masterTripRelay", "srNo", e.target.value)} />
            </td>
            <td>
              <input type="date" value={formData.masterTripRelay?.lastTestedDate || ""} onChange={(e) => setRelayField("masterTripRelay", "lastTestedDate", e.target.value)} />
            </td>
            <td>
              <input type="text" value={formData.masterTripRelay?.remark || ""} onChange={(e) => setRelayField("masterTripRelay", "remark", e.target.value)} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>E</td>
            <td style={{ fontWeight: 800 }}>Separate earth pit for neutral earthing</td>
            <td style={{ textAlign: "center", fontWeight: 700 }}>yes/no</td>
            <td colSpan={3}>
              <input type="text" value={formData.separateEarthPit || ""} onChange={(e) => setFormData({ ...formData, separateEarthPit: e.target.value })} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>F</td>
            <td style={{ fontWeight: 800 }}>Neutral earth pit resistance values</td>
            <td colSpan={4}>
              <input
                type="text"
                value={formData.neutralEarthPitResistanceValues || ""}
                onChange={(e) => setFormData({ ...formData, neutralEarthPitResistanceValues: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>G</td>
            <td style={{ fontWeight: 800 }}>Grid earth resistance values</td>
            <td colSpan={4}>
              <input
                type="text"
                value={formData.gridEarthResistanceValues || ""}
                onChange={(e) => setFormData({ ...formData, gridEarthResistanceValues: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>H</td>
            <td style={{ fontWeight: 800 }}>Cleaning & Checking for the main tank Earthling</td>
            <td colSpan={4}>
              <input
                type="text"
                value={formData.cleaningCheckingMainTankEarthing || ""}
                onChange={(e) => setFormData({ ...formData, cleaningCheckingMainTankEarthing: e.target.value })}
              />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>I</td>
            <td style={{ fontWeight: 800 }}>LA Counter reading</td>
            <td colSpan={4} style={{ padding: 0 }}>
              <table className="form-table" style={{ marginTop: 0 }}>
                <thead>
                  <tr>
                    <th style={{ width: "33.33%" }}>1.1</th>
                    <th style={{ width: "33.33%" }}>2.1</th>
                    <th style={{ width: "33.33%" }}>3.1</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" value={formData.laCounterReading?.["1.1"] || ""} onChange={(e) => setFormData({ ...formData, laCounterReading: { ...(formData.laCounterReading || {}), 1.1: e.target.value } })} /></td>
                    <td><input type="text" value={formData.laCounterReading?.["2.1"] || ""} onChange={(e) => setFormData({ ...formData, laCounterReading: { ...(formData.laCounterReading || {}), 2.1: e.target.value } })} /></td>
                    <td><input type="text" value={formData.laCounterReading?.["3.1"] || ""} onChange={(e) => setFormData({ ...formData, laCounterReading: { ...(formData.laCounterReading || {}), 3.1: e.target.value } })} /></td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <th>1.2</th>
                    <th>2.2</th>
                    <th>3.2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" value={formData.laCounterReading?.["1.2"] || ""} onChange={(e) => setFormData({ ...formData, laCounterReading: { ...(formData.laCounterReading || {}), 1.2: e.target.value } })} /></td>
                    <td><input type="text" value={formData.laCounterReading?.["2.2"] || ""} onChange={(e) => setFormData({ ...formData, laCounterReading: { ...(formData.laCounterReading || {}), 2.2: e.target.value } })} /></td>
                    <td><input type="text" value={formData.laCounterReading?.["3.2"] || ""} onChange={(e) => setFormData({ ...formData, laCounterReading: { ...(formData.laCounterReading || {}), 3.2: e.target.value } })} /></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>J</td>
            <td style={{ fontWeight: 800 }}>Whether LA Earthling checked</td>
            <td colSpan={4}>
              <input type="text" value={formData.whetherLaEarthingChecked || ""} onChange={(e) => setFormData({ ...formData, whetherLaEarthingChecked: e.target.value })} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>K</td>
            <td style={{ fontWeight: 800 }}>IR Value of LA</td>
            <td colSpan={4}>
              <input type="text" value={formData.irValueOfLa || ""} onChange={(e) => setFormData({ ...formData, irValueOfLa: e.target.value })} />
            </td>
          </tr>

          {[
            ["L", "Phase 1.1", "1.1"],
            ["M", "Phase 1.2", "1.2"],
            ["N", "Phase 2.1", "2.1"],
            ["O", "Phase 2.2", "2.2"],
            ["P", "Phase 3.1", "3.1"],
            ["Q", "Phase 3.2", "3.2"],
          ].map(([sr, label, key]) => (
            <tr key={key}>
              <td style={{ fontWeight: 800, textAlign: "center" }}>{sr}</td>
              <td style={{ fontWeight: 800 }}>{label}</td>
              <td colSpan={4}>
                <input type="text" value={formData.phases?.[key] || ""} onChange={(e) => setFormData({ ...formData, phases: { ...(formData.phases || {}), [key]: e.target.value } })} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* IV Accessories Checking */}
      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ width: "6%" }}>IV</th>
            <th style={{ width: "44%" }}>Accessories Checking</th>
            <th style={{ width: "16%" }}>SET Temp.</th>
            <th style={{ width: "16%" }}>Checked</th>
            <th style={{ width: "18%" }}>No. of Hrs. RUN</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["A", "FAN START", "fanStart"],
            ["B", "FAN STOP", "fanStop"],
            ["C", "PUMP START", "pumpStart1"],
            ["D", "PUMP START", "pumpStart2"],
          ].map(([sr, label, key]) => (
            <tr key={key}>
              <td style={{ fontWeight: 800, textAlign: "center" }}>{sr}</td>
              <td style={{ fontWeight: 800 }}>{label}</td>
              <td><input type="text" value={formData.accessories?.[key]?.setTemp || ""} onChange={(e) => setAccessoryField(key, "setTemp", e.target.value)} /></td>
              <td><input type="text" value={formData.accessories?.[key]?.checked || ""} onChange={(e) => setAccessoryField(key, "checked", e.target.value)} /></td>
              <td><input type="text" value={formData.accessories?.[key]?.noOfHrsRun || ""} onChange={(e) => setAccessoryField(key, "noOfHrsRun", e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* V OCTC TAP Position */}
      <table className="form-table" style={{ marginTop: "10px" }}>
        <tbody>
          <tr>
            <td style={{ width: "6%", fontWeight: 900, textAlign: "center" }}>V</td>
            <td style={{ width: "44%", fontWeight: 900 }}>OCTC TAP Position</td>
            <td style={{ width: "16%" }}>
              <input type="text" value={formData.accessories?.octcTapPosition?.setTemp || ""} onChange={(e) => setAccessoryField("octcTapPosition", "setTemp", e.target.value)} />
            </td>
            <td style={{ width: "16%" }}>
              <input type="text" value={formData.accessories?.octcTapPosition?.checked || ""} onChange={(e) => setAccessoryField("octcTapPosition", "checked", e.target.value)} />
            </td>
            <td style={{ width: "18%" }}>
              <input type="text" value={formData.accessories?.octcTapPosition?.noOfHrsRun || ""} onChange={(e) => setAccessoryField("octcTapPosition", "noOfHrsRun", e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* A/B/C under V (as per image) */}
      <table className="form-table" style={{ marginTop: "0px" }}>
        <tbody>
          {[
            ["A", "DIVERTER SWITCH", "diverterSwitch"],
            ["B", "DRIVE MECHANISM", "driveMechanism"],
            ["C", "TPI - (RTCC)", "tpiRtcc"],
          ].map(([sr, label, key]) => (
            <tr key={key}>
              <td style={{ width: "6%", fontWeight: 800, textAlign: "center" }}>{sr}</td>
              <td style={{ width: "44%", fontWeight: 800 }}>{label}</td>
              <td style={{ width: "16%" }}>
                <input type="text" value={formData.accessories?.[key]?.setTemp || ""} onChange={(e) => setAccessoryField(key, "setTemp", e.target.value)} />
              </td>
              <td style={{ width: "16%" }}>
                <input type="text" value={formData.accessories?.[key]?.checked || ""} onChange={(e) => setAccessoryField(key, "checked", e.target.value)} />
              </td>
              <td style={{ width: "18%" }}>
                <input type="text" value={formData.accessories?.[key]?.noOfHrsRun || ""} onChange={(e) => setAccessoryField(key, "noOfHrsRun", e.target.value)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* VI Bushing Test Tap Earthed */}
      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th style={{ width: "50%" }}>VI &nbsp; Bushing Test Tap Earthed</th>
            <th style={{ width: "25%" }}>1.1</th>
            <th style={{ width: "25%" }}>1.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 800 }}>HV Checked</td>
            <td><input type="text" value={formData.bushingTestTapEarthed?.hvChecked?.["1.1"] || ""} onChange={(e) => setBushingTapEarthed("hvChecked", "1.1", e.target.value)} /></td>
            <td><input type="text" value={formData.bushingTestTapEarthed?.hvChecked?.["1.2"] || ""} onChange={(e) => setBushingTapEarthed("hvChecked", "1.2", e.target.value)} /></td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800 }}>LV Checked</td>
            <td colSpan={2} style={{ padding: 0 }}>
              <table className="form-table" style={{ marginTop: 0 }}>
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>2.1</th>
                    <th style={{ width: "25%" }}>2.2</th>
                    <th style={{ width: "25%" }}>3.1</th>
                    <th style={{ width: "25%" }}>3.2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" value={formData.bushingTestTapEarthed?.lvChecked?.["2.1"] || ""} onChange={(e) => setBushingTapEarthed("lvChecked", "2.1", e.target.value)} /></td>
                    <td><input type="text" value={formData.bushingTestTapEarthed?.lvChecked?.["2.2"] || ""} onChange={(e) => setBushingTapEarthed("lvChecked", "2.2", e.target.value)} /></td>
                    <td><input type="text" value={formData.bushingTestTapEarthed?.lvChecked?.["3.1"] || ""} onChange={(e) => setBushingTapEarthed("lvChecked", "3.1", e.target.value)} /></td>
                    <td><input type="text" value={formData.bushingTestTapEarthed?.lvChecked?.["3.2"] || ""} onChange={(e) => setBushingTapEarthed("lvChecked", "3.2", e.target.value)} /></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* VII Oil Values */}
      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th style={{ width: "8%" }}>VII</th>
            <th style={{ width: "62%" }}>Oil Values</th>
            <th style={{ width: "30%" }}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>A</td>
            <td style={{ fontWeight: 800 }}>BDV</td>
            <td style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <strong>KV</strong>
              <input type="text" value={formData.oilValues?.bdvKv || ""} onChange={(e) => setFormData({ ...formData, oilValues: { ...(formData.oilValues || {}), bdvKv: e.target.value } })} />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 800, textAlign: "center" }}>B</td>
            <td style={{ fontWeight: 800 }}>Moisture Content</td>
            <td style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <strong>PPM</strong>
              <input type="text" value={formData.oilValues?.moistureContentPpm || ""} onChange={(e) => setFormData({ ...formData, oilValues: { ...(formData.oilValues || {}), moistureContentPpm: e.target.value } })} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* VIII Final IR Values */}
      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th style={{ width: "8%" }}>VIII</th>
            <th style={{ width: "42%" }}>Final IR Values</th>
            <th style={{ width: "12%" }}>10</th>
            <th style={{ width: "12%" }}>60</th>
            <th style={{ width: "12%" }}>600</th>
            <th style={{ width: "14%" }}>P.I</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["HV-Earth", "hvEarth"],
            ["LV1-Earth", "lv1Earth"],
            ["LV2-Earth", "lv2Earth"],
            ["HV-LV1", "hvLv1"],
            ["HV-LV2", "hvLv2"],
            ["LV1-LV2", "lv1Lv2"],
            ["Core to frame", "coreToFrame"],
            ["Frame to Tank", "frameToTank"],
            ["Removal link again tightens and check zero megger", "removalLinkAgainTightensAndCheckZeroMegger"],
          ].map(([label, key]) => (
            <tr key={key}>
              <td></td>
              <td style={{ fontWeight: 800 }}>{label}</td>
              <td><input type="text" value={formData.finalIrValues?.[key]?.at10 || ""} onChange={(e) => setFinalIr(key, "at10", e.target.value)} /></td>
              <td><input type="text" value={formData.finalIrValues?.[key]?.at60 || ""} onChange={(e) => setFinalIr(key, "at60", e.target.value)} /></td>
              <td><input type="text" value={formData.finalIrValues?.[key]?.at600 || ""} onChange={(e) => setFinalIr(key, "at600", e.target.value)} /></td>
              <td><input type="text" value={formData.finalIrValues?.[key]?.pi || ""} onChange={(e) => setFinalIr(key, "pi", e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* IX Oil Level in Conservator */}
      <table className="form-table" style={{ marginTop: "10px" }}>
        <tbody>
          <tr>
            <td style={{ width: "8%", fontWeight: 900, textAlign: "center" }}>IX</td>
            <td style={{ width: "42%", fontWeight: 900 }}>Oil Level in Conservator</td>
            <td colSpan={4}>
              <input type="text" value={formData.oilLevelInConservator || ""} onChange={(e) => setFormData({ ...formData, oilLevelInConservator: e.target.value })} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* X Connectors */}
      <table className="form-table" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th style={{ width: "8%" }}>X</th>
            <th style={{ width: "42%", textAlign: "left" }}>Connectors</th>
            <th style={{ width: "50%" }}>Conditions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td style={{ fontWeight: 800 }}>HV Jumpers</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800 }}>1.1</div>
                  <input type="text" value={formData.connectorsHvJumpers?.["1.1"] || ""} onChange={(e) => setFormData({ ...formData, connectorsHvJumpers: { ...(formData.connectorsHvJumpers || {}), 1.1: e.target.value } })} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800 }}>1.2</div>
                  <input type="text" value={formData.connectorsHvJumpers?.["1.2"] || ""} onChange={(e) => setFormData({ ...formData, connectorsHvJumpers: { ...(formData.connectorsHvJumpers || {}), 1.2: e.target.value } })} />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection title="Transformer Protection relay / Accessories / IR values" photos={photoRequirements} onPhotoChange={handlePhotoChange} />

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


// Stage 6 Form 3: Final Checklist and Clearance
export function Stage6Form3({
  onSubmit,
  onPrevious,
  initialData,
  isLastFormOfStage,
  companyName,
  projectName,
}) {
  const [formData, setFormData] = useState({
    // Connectors
    connectors: {
      lv21: "",
      lv22: "",
      lv31: "",
      lv32: "",
    },

    // Final checks
    anabondApplied: "",
    jointsSealed: "",
    foreignMaterialCleared: "",
    temperatureWTI: "",
    temperatureOTI: "",

    // Remarks
    remarks: "",

    // Signatures
    signatures: {
      vpesName: "",
      vpesSignature: "",
      vpesDate: "",
      customerName: "",
      customerSignature: "",
      customerDate: "",
    },

    photos: {},
    ...initialData,
  })

  const handleSignatureChange = (key, type, value) => {
    setFormData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [`${key}${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
      },
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

  const photoRequirements = [{ key: "finalTransformer", label: "Full Photo of transformer" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>Final Checklist and Clearance</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>XI</strong>
            </td>
            <td>Connectors</td>
            <td>LV Jumpers</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>2.1</td>
            <td>
              <input
                type="text"
                value={formData.connectors.lv21}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    connectors: { ...formData.connectors, lv21: e.target.value },
                  })
                }
              />
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>2.2</td>
            <td>
              <input
                type="text"
                value={formData.connectors.lv22}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    connectors: { ...formData.connectors, lv22: e.target.value },
                  })
                }
              />
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>3.1</td>
            <td>
              <input
                type="text"
                value={formData.connectors.lv31}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    connectors: { ...formData.connectors, lv31: e.target.value },
                  })
                }
              />
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>3.2</td>
            <td>
              <input
                type="text"
                value={formData.connectors.lv32}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    connectors: { ...formData.connectors, lv32: e.target.value },
                  })
                }
              />
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td>
              <strong>XII</strong>
            </td>
            <td>Anabond applied to HV Bushing thimble Sealed</td>
            <td>
              <input
                type="text"
                value={formData.anabondApplied}
                onChange={(e) => setFormData({ ...formData, anabondApplied: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>1</strong>
            </td>
            <td>Anabond applied to HV Bushing</td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>2</strong>
            </td>
            <td>All joints properly sealed against Water Ingress</td>
            <td>
              <input
                type="text"
                value={formData.jointsSealed}
                onChange={(e) => setFormData({ ...formData, jointsSealed: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>3</strong>
            </td>
            <td>All Foreign material cleared from Transformer</td>
            <td>
              <input
                type="text"
                value={formData.foreignMaterialCleared}
                onChange={(e) => setFormData({ ...formData, foreignMaterialCleared: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Temperature of °C WTI</strong>
          <input
            type="text"
            value={formData.temperatureWTI}
            onChange={(e) => setFormData({ ...formData, temperatureWTI: e.target.value })}
            style={{ marginLeft: "10px", width: "100px" }}
          />
        </p>
        <p>
          <strong>OTI</strong>
          <input
            type="text"
            value={formData.temperatureOTI}
            onChange={(e) => setFormData({ ...formData, temperatureOTI: e.target.value })}
            style={{ marginLeft: "10px", width: "100px" }}
          />
        </p>
      </div>

      <div style={{ marginTop: "30px" }}>
        <p>
          <strong>
            Remarks: The Transformer as mentioned above has been jointly cleared for charging as on _____. All the
            necessary pre-commissioning checks and protection trials have been found satisfactory. Transformer has been
            cleared from all foreign material and is ready for charging.
          </strong>
        </p>
        <textarea
          rows="4"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          placeholder="Enter any additional remarks..."
          style={{ width: "100%", marginTop: "10px" }}
        />
      </div>

      <PhotoUploadSection
        title="Full Photo of transformer"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="signature-section">
        <div className="signature-box">
          <label>Checked by VPES :</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.signatures.vpesName}
            onChange={(e) => handleSignatureChange("vpes", "name", e.target.value)}
          />
          <SignatureBox
            label=""
            nameValue=""
            onNameChange={() => {}}
            onSignatureChange={(signature) => handleSignatureChange("vpes", "signature", signature)}
            initialSignature={formData.signatures.vpesSignature}
          />
          <input
            type="date"
            value={formData.signatures.vpesDate}
            onChange={(e) => handleSignatureChange("vpes", "date", e.target.value)}
          />
        </div>

        <div className="signature-box">
          <label>Witnessed By Customer :</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.signatures.customerName}
            onChange={(e) => handleSignatureChange("customer", "name", e.target.value)}
          />
          <SignatureBox
            label=""
            nameValue=""
            onNameChange={() => {}}
            onSignatureChange={(signature) => handleSignatureChange("customer", "signature", signature)}
            initialSignature={formData.signatures.customerSignature}
          />
          <input
            type="date"
            value={formData.signatures.customerDate}
            onChange={(e) => handleSignatureChange("customer", "date", e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 6
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

  const handleSignatureChange = (key, type, value) => {
    setFormData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [`${key}${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
      },
    }))
  }

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
                onSignatureChange={(signature) => handleSignatureChange("vpes", "signature", signature)}
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
                onSignatureChange={(signature) => handleSignatureChange("customer", "signature", signature)}
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
const VConnected63MVATransformerForms = ({
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
      { component: Stage1Form2, name: "Pre Erection Ratio Test of Turret CTs - Phase 3" },
      { component: Stage1Form3, name: "Protocol for Accessories Checking" },
      { component: Stage1Form4, name: "Pre-Erection Checklist (A) + Equipment Checklist + Safety Equipment" },
      { component: Stage1Form5, name: "Pre-Erection Checklist (A) + Equipment Checklist + Safety Equipment" },
      { component: Stage1Form6, name: "Pre-Erection Checklist (A) + Equipment Checklist + Safety Equipment" },
      { component: Stage1Form7, name: "Pre-Erection Checklist (A) + Equipment Checklist + Safety Equipment" },
      { component: Stage1Form8, name: "Pre-Erection Checklist (A) + Equipment Checklist + Safety Equipment" },
    ],
    2: [
      { component: Stage2Form1, name: "IR After Erection" },
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
      { component: Stage5Form1, name: "SFRA Test Record" },
      { component: Stage5Form2, name: "Magnetizing Current Test" },
      { component: Stage5Form3, name: "Polarity Test" },
      { component: Stage5Form4, name: "Short Circuit Test" },
      { component: Stage5Form5, name: "Short Circuit and Winding Resistance Test" },
      { component: Stage5Form6, name: "Short Circuit and Winding Resistance Test" },
      { component: Stage5Form7, name: "Short Circuit and Winding Resistance Test" },
      { component: Stage5Form8, name: "Short Circuit and Winding Resistance Test" },
      { component: Stage5Form9, name: "Short Circuit and Winding Resistance Test" },
      { component: Stage5Form10, name: "Short Circuit and Winding Resistance Test" },
      { component: Stage5Form11, name: "Pre-Commissioning Checklist" },
    ],
    6: [
      { component: Stage6Form1, name: "Pre-Commissioning Checklist" },
      { component: Stage6Form2, name: "Transformer Protection and Accessories" },
      { component: Stage6Form3, name: "Final Checklist and Clearance" },
    ],
    7: [
      { component: WorkCompletionReportForm, name: "Work Completion Report" },
    ],
  }

  const currentStageForms = stageFormsMapping[stage] || []
  const CurrentFormComponent = currentStageForms[currentFormIndex]?.component

  const handleFormSubmit = async (data) => {
    console.log("VConnected63MVA: handleFormSubmit → saving form data", data);

    const updatedFormData = { ...formData, [`form${currentFormIndex + 1}`]: data };

    try {
      // 🔹 Always build FormData
      const formDataToSend = new FormData();
      // Normalize in case some upstream component passes these as arrays (which breaks backend string casting)
      const normalizeScalar = (v) => (Array.isArray(v) ? v[v.length - 1] : v);

      formDataToSend.append("projectName", normalizeScalar(projectName) ?? "");
      formDataToSend.append("companyName", normalizeScalar(companyName) ?? "");
      formDataToSend.append("stage", normalizeScalar(stage) ?? "");
      formDataToSend.append("formNumber", String(currentFormIndex + 1));

      // loop through keys of `data` — use for...of to support await inside
      for (const [key, value] of Object.entries(data)) {
        if (key === "photos" && typeof value === "object") {
          for (const [photoKey, file] of Object.entries(value)) {
            if (file instanceof File) {
              // ✅ Compress image before upload (same as Auto Transformer)
              const fileToUpload = ENABLE_IMAGE_COMPRESSION
                ? await compressImage(file, IMAGE_COMPRESSION_MAX_WIDTH, IMAGE_COMPRESSION_QUALITY)
                : file;
              formDataToSend.append(`photos[${photoKey}]`, fileToUpload);
            }
          }
        } else if (typeof value === "object") {
          // 🔹 make sure objects are stringified before sending
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value ?? "");
        }
      }

      // 🔹 POST request
      await axios.post(
        `${BACKEND_API_BASE_URL}/api/vconnectData/setTable`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // 🔹 formsCompleted + project status logic
      const isLastFormOfStage = currentFormIndex === currentStageForms.length - 1;
      
      if (isLastFormOfStage) {
        await axios.post(
          `${BACKEND_API_BASE_URL}/api/vconnectcompany/updateFormsCompleted`,
          {
            projectName,
            companyName,
            formsCompleted: currentFormIndex + 1,
            status: "pending-approval",
            stage,
          }
        );

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
                      lastSubmittedUser: getUserInfo()?.name || "",
                      lastSubmittedTimestamp: new Date().toISOString(),
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
          `${BACKEND_API_BASE_URL}/api/vconnectcompany/updateFormsCompleted`,
          {
            projectName,
            companyName,
            formsCompleted: currentFormIndex + 1,
          }
        );

        // Update lastSubmittedUser for individual form saves
        if (setSelectedMainCompany) {
          setSelectedMainCompany((prevCompany) => {
            if (prevCompany.companyName === companyName) {
              return {
                ...prevCompany,
                companyProjects: prevCompany.companyProjects.map((project) => {
                  if (project.name === projectName) {
                    return {
                      ...project,
                      lastSubmittedUser: getUserInfo()?.name || "",
                      lastSubmittedTimestamp: new Date().toISOString(),
                    };
                  }
                  return project;
                }),
              };
            }
            return prevCompany;
          });
        }
      }
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form. Please try again.");
      return;
    }

    // 🔹 Local update + move forward
    setFormData(updatedFormData);

    if (currentFormIndex < currentStageForms.length - 1) {
      setCurrentFormIndex(currentFormIndex + 1);
    } else {
      onFormSubmit(stage, updatedFormData, selectedProjectForReview);
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

// Export all forms for V Connected 63 MVA Transformer department
export const VConnected63MVATransformerFormsConfig = {
  // Stage 7 forms
  7: [
    {
      id: 1,
      name: "Work Completion Report",
      component: WorkCompletionReportForm,
    },
  ],
}

export default VConnected63MVATransformerForms
