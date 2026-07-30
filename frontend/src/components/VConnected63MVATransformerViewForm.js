import React from 'react';
import { BACKEND_API_BASE_URL, BACKEND_IMG_API_BASE_URL } from './constant';
// Import shared form components from StageReviewPanel
import {
  Stage1Form1,
  Stage1Form2,
  Stage1Form3,
  Stage1Form4,
  Stage1Form5,
  Stage1Form6,
  Stage1Form7,
  Stage1Form8,
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
  Stage5Form9,
  Stage5Form10,
  Stage5Form11,
  Stage6Form1,
  Stage6Form2,
  Stage6Form3,
  Stage7Form1
} from './VConnected63MVATransformerStageReviewPanel';

// Utility function to render photos
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

// Stage 7 Review Renderer Component (V Connected has 7 stages)
const Stage7ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage7Forms = [
    {
      id: "work-completion-report",
      title: "Work Completion Report",
      component: Stage7Form1
    }
  ];

  return (
    <div className="stage7-review-container">
      {stage7Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        const FormComponent = form.component;
        
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
                V Connected 63 MVA Transformer - {form.title}
              </h2>
            </div>

            {FormComponent ? (
              <FormComponent formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {Object.entries(formData).filter(([key]) => key !== 'photos').map(([fieldKey, fieldValue]) => (
                  <div key={`${form.id}-${fieldKey}`} className="form-group-preview">
                    <label className="form-label-preview">
                      {formatLabel(fieldKey)}
                    </label>
                    <div className="form-input-display">
                      <input
                        type="text"
                        value={fieldValue || ""}
                        disabled
                        className="form-input disabled preview"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!FormComponent && formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

// Stage 6 Review Renderer Component
const Stage6ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage6Forms = [
    {
      id: "pre-commissioning-checklist",
      title: "Pre-Commissioning Checklist",
      component: Stage6Form1
    },
    {
      id: "transformer-protection-accessories-ir",
      title: "Transformer Protection and Accessories",
      component: Stage6Form2
    },
    {
      id: "final-checklist-clearance",
      title: "Final Checklist and Clearance",
      component: Stage6Form3
    }
  ];

  return (
    <div className="stage6-review-container">
      {stage6Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        const FormComponent = form.component;
        
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
                V Connected 63 MVA Transformer - {form.title}
              </h2>
            </div>

            {FormComponent ? (
              <FormComponent formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {Object.entries(formData).filter(([key]) => key !== 'photos').map(([fieldKey, fieldValue]) => (
                  <div key={`${form.id}-${fieldKey}`} className="form-group-preview">
                    <label className="form-label-preview">
                      {formatLabel(fieldKey)}
                    </label>
                    <div className="form-input-display">
                      <input
                        type="text"
                        value={fieldValue || ""}
                        disabled
                        className="form-input disabled preview"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!FormComponent && formData.photos && renderPhotos(formData.photos, form.id)}
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
      component: Stage3Form1
    }
  ];

  return (
    <div className="stage3-review-container">
      {stage3Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        const FormComponent = form.component;
        
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
                V Connected 63 MVA Transformer - {form.title}
              </h2>
            </div>

            {FormComponent ? (
              <FormComponent formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {Object.entries(formData).filter(([key]) => key !== 'photos').map(([fieldKey, fieldValue]) => (
                  <div key={`${form.id}-${fieldKey}`} className="form-group-preview">
                    <label className="form-label-preview">
                      {formatLabel(fieldKey)}
                    </label>
                    <div className="form-input-display">
                      <input
                        type="text"
                        value={fieldValue || ""}
                        disabled
                        className="form-input disabled preview"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!FormComponent && formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

// Stage 4 Review Renderer Component
const Stage4ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage4Forms = [
    {
      id: "sfra-test-record",
      title: "SFRA Test Record",
      component: Stage4Form1
    },
    {
      id: "ir-voltage-ratio-magnetising-test",
      title: "Record of Measurement of IR Values & Voltage Ratio Test",
      component: Stage4Form2
    },
    {
      id: "short-circuit-test",
      title: "Short Circuit Test",
      component: Stage4Form3
    },
    {
      id: "winding-resistance-ir-pi-test",
      title: "Winding Resistance Test and Record of Measurement of IR & PI Values",
      component: Stage4Form4
    }
  ];

  return (
    <div className="stage4-review-container">
      {stage4Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        const FormComponent = form.component;
        
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
                V Connected 63 MVA Transformer - {form.title}
              </h2>
            </div>

            {FormComponent ? (
              <FormComponent formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {Object.entries(formData).filter(([key]) => key !== 'photos').map(([fieldKey, fieldValue]) => (
                  <div key={`${form.id}-${fieldKey}`} className="form-group-preview">
                    <label className="form-label-preview">
                      {formatLabel(fieldKey)}
                    </label>
                    <div className="form-input-display">
                      <input
                        type="text"
                        value={fieldValue || ""}
                        disabled
                        className="form-input disabled preview"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!FormComponent && formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

// Stage 5 Review Renderer Component
const Stage5ReviewRenderer = ({ formDataFromDB, formatLabel }) => {
  const stage5Forms = [
    {
      id: "sfra-test-record",
      title: "SFRA Test Record",
      component: Stage5Form1
    },
    {
      id: "ratio-test",
      title: "Ratio Test",
      component: Stage5Form2
    },
    {
      id: "magnetising-current-test",
      title: "Magnetising Current Test",
      component: Stage5Form3
    },
    {
      id: "polarity-test",
      title: "Polarity Test",
      component: Stage5Form4
    },
    {
      id: "short-circuit-test",
      title: "Short Circuit Test",
      component: Stage5Form5
    },
    {
      id: "winding-resistance-test",
      title: "Winding Resistance Test",
      component: Stage5Form6
    },
    {
      id: "tan-delta-bushing",
      title: "Tan Delta & Capacitance Test on Bushing",
      component: Stage5Form7
    },
    {
      id: "stage5form8",
      title: "Stage 5 - Form 8",
      component: Stage5Form8
    },
    {
      id: "stage5form9",
      title: "Stage 5 - Form 9",
      component: Stage5Form9
    },
    {
      id: "stage5form10",
      title: "Stage 5 - Form 10",
      component: Stage5Form10
    },
    {
      id: "stage5form11",
      title: "Stage 5 - Form 11",
      component: Stage5Form11
    }
  ];

  return (
    <div className="stage5-review-container">
      {stage5Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        const FormComponent = form.component;
        
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
                V Connected 63 MVA Transformer - {form.title}
              </h2>
            </div>

            {FormComponent ? (
              <FormComponent formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {Object.entries(formData).filter(([key]) => key !== 'photos').map(([fieldKey, fieldValue]) => (
                  <div key={`${form.id}-${fieldKey}`} className="form-group-preview">
                    <label className="form-label-preview">
                      {formatLabel(fieldKey)}
                    </label>
                    <div className="form-input-display">
                      <input
                        type="text"
                        value={fieldValue || ""}
                        disabled
                        className="form-input disabled preview"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!FormComponent && formData.photos && renderPhotos(formData.photos, form.id)}
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
      component: Stage2Form1
    },
    {
      id: "ir-after-erection-stage2",
      title: "IR After Erection - Stage 2 End",
      component: Stage2Form2
    }
  ];

  return (
    <div className="stage2-review-container">
      {stage2Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        const FormComponent = form.component;
        
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
                V Connected 63 MVA Transformer - {form.title}
              </h2>
            </div>

            {/* Use specific component if available, otherwise generic rendering */}
            {FormComponent ? (
              <FormComponent formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {Object.entries(formData).filter(([key]) => key !== 'photos').map(([fieldKey, fieldValue]) => (
                  <div key={`${form.id}-${fieldKey}`} className="form-group-preview">
                    <label className="form-label-preview">
                      {formatLabel(fieldKey)}
                    </label>
                    <div className="form-input-display">
                      <input
                        type="text"
                        value={fieldValue || ""}
                        disabled
                        className="form-input disabled preview"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render photos if they exist */}
            {!FormComponent && formData.photos && renderPhotos(formData.photos, form.id)}
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
      component: Stage1Form1
    },
    {
      id: "protocol-accessories-checking",
      title: "Protocol for Accessories Checking",
      component: Stage1Form2
    },
    {
      id: "core-insulation-check",
      title: "Core Insulation Check",
      component: Stage1Form3
    },
    {
      id: "pre-erection-tan-delta-test",
      title: "Pre-Erection Tan Delta and Capacitance Test on Bushing",
      component: Stage1Form4
    },
    {
      id: "record-measurement-ir-values",
      title: "Record of Measurement of IR Values",
      component: Stage1Form5
    },
    {
      id: "record-measurement-ir-values",
      title: "Record of Measurement of IR Values",
      component: Stage1Form6
    },
    {
      id: "record-measurement-ir-values",
      title: "Record of Measurement of IR Values",
      component: Stage1Form7
    },
    {
      id: "record-measurement-ir-values",
      title: "Record of Measurement of IR Values",
      component: Stage1Form8
    }
  ];

  return (
    <div className="stage1-review-container">
      {stage1Forms.map((form, formIndex) => {
        const formData = formDataFromDB[`form${formIndex + 1}`] || {};
        const FormComponent = form.component;
        
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
                V Connected 63 MVA Transformer - {form.title}
              </h2>
            </div>

            {/* Use specific component if available, otherwise generic rendering */}
            {FormComponent ? (
              <FormComponent formData={formData} />
            ) : (
              <div className="form-grid-preview" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}>
                {Object.entries(formData).filter(([key]) => key !== 'photos').map(([fieldKey, fieldValue]) => (
                  <div key={`${form.id}-${fieldKey}`} className="form-group-preview">
                    <label className="form-label-preview">
                      {formatLabel(fieldKey)}
                    </label>
                    <div className="form-input-display">
                      <input
                        type="text"
                        value={fieldValue || ""}
                        disabled
                        className="form-input disabled preview"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Render photos if they exist */}
            {!FormComponent && formData.photos && renderPhotos(formData.photos, form.id)}
          </div>
        );
      })}
    </div>
  );
};

// Generic Stage Renderer for stages without specific components
const GenericStageRenderer = ({ formDataFromDB, formatLabel, stageTitle }) => {
  return (
    <div className="generic-stage-container">
      {Object.entries(formDataFromDB).map(([formKey, formData]) => (
        <div key={formKey} className="form-review-card" style={{
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
           
          </div>

          <div className="form-grid-preview" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}>
            {Object.entries(formData).filter(([key]) => key !== 'photos').map(([fieldKey, fieldValue]) => {
              // Handle nested objects
              if (typeof fieldValue === "object" && fieldValue !== null && !Array.isArray(fieldValue)) {
                return (
                  <div key={`${formKey}-${fieldKey}`} className="form-group-preview nested-object-group">
                    <label className="form-label-preview">
                      📋 {formatLabel(fieldKey)}
                    </label>
                    <div className="nested-object-display" style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "15px",
                      marginTop: "10px",
                    }}>
                      {Object.entries(fieldValue).map(([nestedKey, nestedValue]) => (
                        <div key={`${fieldKey}-${nestedKey}`} className="nested-item" style={{
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
                            {formatLabel(fieldKey)} - {nestedKey}
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

              // Handle arrays
              if (Array.isArray(fieldValue)) {
                return (
                  <div key={`${formKey}-${fieldKey}`} className="form-group-preview array-group">
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
                          <div key={`${fieldKey}-${index}`} className="array-item" style={{
                            marginBottom: "10px",
                            padding: "10px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            backgroundColor: "#f9fafb",
                          }}>
                            {typeof item === "object" && item !== null ? (
                              <div>
                                <h6 style={{ margin: "0 0 8px 0", fontSize: "0.85rem" }}>
                                  Item {index + 1}
                                </h6>
                                {Object.entries(item).map(([itemKey, itemValue]) => (
                                  <div key={itemKey} style={{ marginBottom: "5px" }}>
                                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                                      {formatLabel(itemKey)}:
                                    </span>
                                    <input
                                      type="text"
                                      value={itemValue || ""}
                                      disabled
                                      className="form-input disabled preview"
                                      style={{ marginLeft: "8px", fontSize: "0.8rem" }}
                                    />
                                  </div>
                                ))}
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

              // Handle simple values
              return (
                <div key={`${formKey}-${fieldKey}`} className="form-group-preview">
                  <label className="form-label-preview">
                    {formatLabel(fieldKey)}
                  </label>
                  <div className="form-input-display">
                    <input
                      type="text"
                      value={fieldValue || ""}
                      disabled
                      className="form-input disabled preview"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Render photos if they exist */}
          {formData.photos && renderPhotos(formData.photos, formKey)}
        </div>
      ))}
    </div>
  );
};

// Main Stage Form Renderer Component
export const VConnected63MVATransformerViewFormRenderer = ({ stageNumber, formDataFromDB, formatLabel }) => {
  const stageTitles = {
    1: "Stage 1 - Initial Inspection & Testing",
    2: "Stage 2 - Oil Handling & IR Testing",
    3: "Stage 3 - Oil Filtration & Pressure Testing",
    4: "Stage 4 - Electrical Testing",
    5: "Stage 5 - Pre-Charging Checklist",
    6: "Stage 6 - Final Pre-Charging Checklist",
    7: "Stage 7 - Work Completion Certificate"
  };

  switch(stageNumber) {
    case 1:
      return <Stage1ReviewRenderer formDataFromDB={formDataFromDB} formatLabel={formatLabel} />;
    case 2:
      return <Stage2ReviewRenderer formDataFromDB={formDataFromDB} formatLabel={formatLabel} />;
    case 3:
      return <Stage3ReviewRenderer formDataFromDB={formDataFromDB} formatLabel={formatLabel} />;
    case 4:
      return <Stage4ReviewRenderer formDataFromDB={formDataFromDB} formatLabel={formatLabel} />;
    case 5:
      return <Stage5ReviewRenderer formDataFromDB={formDataFromDB} formatLabel={formatLabel} />;
    case 6:
      return <Stage6ReviewRenderer formDataFromDB={formDataFromDB} formatLabel={formatLabel} />;
    case 7:
      return <Stage7ReviewRenderer formDataFromDB={formDataFromDB} formatLabel={formatLabel} />;
    default:
      return <GenericStageRenderer 
        formDataFromDB={formDataFromDB} 
        formatLabel={formatLabel} 
        stageTitle={stageTitles[stageNumber] || `Stage ${stageNumber}`}
      />;
  }
};

export default VConnected63MVATransformerViewFormRenderer;
