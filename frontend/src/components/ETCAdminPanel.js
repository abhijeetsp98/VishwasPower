"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_API_BASE_URL, additionalLogging, TESTING_DEPARTMENT } from "./constant";
import { authenticatedFetch, getAuthToken } from "../utils/auth";
import FormStage from "./FormStage"; // Import FormStage
import VConnected63MVATransformerForms from "./VConnected63MVATransformerForms";
import TractionTransformerForms from "./TractionTransformerForms";
import AutoTransformerStageReviewPanel from "./AutoTransformerStageReviewPanel";
import TractionTransformerStageReviewPanel from "./TractionTransformerStageReviewPanel";
import VConnected63MVATransformerStageReviewPanel from "./VConnected63MVATransformerStageReviewPanel";
import { AutoTransformerViewFormRenderer } from "./AutoTransformerViewForm";
import { TractionTransformerViewFormRenderer } from "./TractionTransformerViewForm";
import { VConnected63MVATransformerViewFormRenderer } from "./VConnected63MVATransformerViewForm";
import "./stage-review-styles.css";
import "./form-styles.css";
import html2pdf from "html2pdf.js";
import TestingAutoTransformerForms from "./TestingAutoTransformerForms";

const ETCAdminPanel = ({
  user,
  selectedCompany,
  onLogout,
  onCompanySelect,
  onProjectSelect,
  onBackToMain,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [Companys, setCompanys] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [submittedForms, setSubmittedForms] = useState([]);

  const [projectName, setProjectName] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMainCompany, setSelectedMainCompany] = useState(null);

  const [newCompany, setNewCompany] = useState({ name: "", description: "" });
  const [showCreateCompanyForm, setShowCreateCompanyForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [selectedProjectForReview, setSelectedProjectForReview] =
    useState(null);
  const [currentStageReview, setCurrentStageReview] = useState(1);
  const [showSubmitterReview, setShowSubmitterReview] = useState(false);

  const [viewMode, setViewMode] = useState(false);
  const [selectedFormForView, setSelectedFormForView] = useState(null);

  // State for showing and managing FormStage
  const [formDataFromDB, setFormDataFromDB] = useState(false);
  const [showFormStage, setShowFormStage] = useState(false);
  const [formStageProject, setFormStageProject] = useState(null);
  const [formStageStage, setFormStageStage] = useState(1);

  // Modal states for showing and managing notifications, confirmations, and inputs
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info"); // info, success, error, warning

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const [showInputModal, setShowInputModal] = useState(false);
  const [inputModalTitle, setInputModalTitle] = useState("");
  const [inputModalPlaceholder, setInputModalPlaceholder] = useState("");
  const [inputModalValue, setInputModalValue] = useState("");
  const [inputModalAction, setInputModalAction] = useState(null);

  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionStage, setRejectionStage] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState("");

  const [showEditProjectNameModal, setShowEditProjectNameModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");

  // Testing department form state
  const [activeTestingButton, setActiveTestingButton] = useState(null);
  const [activeTestingProject, setActiveTestingProject] = useState(null);

  // Create Project modal state (for Testing departments — includes Job Rating)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [createProjectCompanyName, setCreateProjectCompanyName] = useState("");
  const [createProjectName, setCreateProjectName] = useState("");
  const [createProjectJobRating, setCreateProjectJobRating] = useState("8");

  const totalStageForm = [5, 2, 3, 4, 2, 1];

  const formStructures = {
    stage1: {
      forms: [
        {
          id: "name-plate-details",
          title: "Name Plate Details Transformer",
          fields: [
            {
              name: "transformerType",
              label: "Transformer Type",
              type: "text",
            },
            { name: "ratedPower", label: "Rated Power (kVA)", type: "number" },
            {
              name: "primaryVoltage",
              label: "Primary Voltage (kV)",
              type: "number",
            },
            {
              name: "secondaryVoltage",
              label: "Secondary Voltage (kV)",
              type: "number",
            },
            { name: "frequency", label: "Frequency (Hz)", type: "number" },
            { name: "serialNumber", label: "Serial Number", type: "text" },
            {
              name: "manufacturingYear",
              label: "Manufacturing Year",
              type: "number",
            },
            { name: "manufacturer", label: "Manufacturer", type: "text" },
            { name: "weight", label: "Weight (kg)", type: "number" },
            {
              name: "oilQuantity",
              label: "Oil Quantity (Liters)",
              type: "number",
            },
          ],
        },
        {
          id: "protocol-accessories-checking",
          title: "Protocol for Accessories Checking",
          fields: [
            {
              name: "bushingCondition",
              label: "Bushing Condition",
              type: "select",
              options: ["Good", "Fair", "Poor"],
            },
            {
              name: "tapChangerOperation",
              label: "Tap Changer Operation",
              type: "select",
              options: ["Smooth", "Stiff", "Not Working"],
            },
            {
              name: "coolingSystem",
              label: "Cooling System",
              type: "select",
              options: ["Working", "Not Working"],
            },
            {
              name: "oilLevel",
              label: "Oil Level",
              type: "select",
              options: ["Normal", "Low", "High"],
            },
            {
              name: "gasketCondition",
              label: "Gasket Condition",
              type: "select",
              options: ["Good", "Needs Replacement"],
            },
            {
              name: "earthingConnections",
              label: "Earthing Connections",
              type: "select",
              options: ["Tight", "Loose"],
            },
          ],
        },
      ],
    },
    stage2: {
      forms: [
        {
          id: "record-oil-handling",
          title: "Record of Oil Handling - Test Values Prior to Filteration",
          fields: [
            {
              name: "oilTemperature",
              label: "Oil Temperature (°C)",
              type: "number",
            },
            {
              name: "moistureContent",
              label: "Moisture Content (ppm)",
              type: "number",
            },
            { name: "acidity", label: "Acidity (mg KOH/g)", type: "number" },
            { name: "flashPoint", label: "Flash Point (°C)", type: "number" },
            { name: "pourPoint", label: "Pour Point (°C)", type: "number" },
            {
              name: "specificGravity",
              label: "Specific Gravity",
              type: "number",
            },
            { name: "viscosity", label: "Viscosity (cSt)", type: "number" },
          ],
        },
      ],
    },
    stage6: {
      forms: [
        {
          id: "work-completion-certificate",
          title: "Work Completion Certificate",
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
            {
              name: "commissioningDate",
              label: "Commissioning Date",
              type: "date",
            },
            { name: "vpesName", label: "VPES Name", type: "text" },
            {
              name: "vpesDesignation",
              label: "VPES Designation",
              type: "text",
            },
            { name: "vpesSignature", label: "VPES Signature", type: "text" },
            { name: "vpesDate", label: "VPES Date", type: "date" },
            {
              name: "customerRepName",
              label: "Customer Representative Name",
              type: "text",
            },
            {
              name: "customerRepDesignation",
              label: "Customer Designation",
              type: "text",
            },
            {
              name: "customerSignature",
              label: "Customer Signature",
              type: "text",
            },
            { name: "customerDate", label: "Customer Date", type: "date" },
          ],
        },
      ],
    },
  };

  const formatLabel = (label) => {
    // Handle specific cases first
    const specialCases = {
      SrNo: "Sr. No.",
      YearOfMfg: "Year Of Mfg",
      DateOfMfg: "Date Of Mfg",
      SerialNo: "Serial No.",
      ModelNo: "Model No.",
      PartNo: "Part No.",
      OrderNo: "Order No.",
      TestNo: "Test No.",
      RefNo: "Ref. No.",
      customerName: "Customer Name",
      orderNumber: "Order Number",
      voltageRating: "Voltage Rating",
      serialNumber: "Serial Number",
      completionDate: "Completion Date",
      chargingDate: "Charging Date",
    };

    if (specialCases[label]) {
      return specialCases[label];
    }

    // Add spaces before capital letters for camelCase
    return label
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const renderIndexTable = () => {
    const indexData = [
      {
        srNo: 1,
        description: "Name plate details",
        stage: "Stage 1",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 2,
        description: "Checking core insulation & accessories",
        stage: "Stage 1",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 3,
        description: "Pre-Erection Tan delta & Capacitance test on bushing",
        stage: "Stage 1",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 4,
        description: "Measurment of IR values",
        stage: "Stage 1",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 5,
        description:
          "Record of Oil handling & oil filteration in reservoir tank",
        stage: "Stage 2",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 6,
        description: "Lead clearance & after erection IR value",
        stage: "Stage 2",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 7,
        description: "Main tank after oil filling , IR value & Pressure test",
        stage: "Stage 2",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 8,
        description: "Record of Oil Filteration - Main Tank",
        stage: "Stage 3",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 9,
        description: "Oil Filteration of Radiator and Combine",
        stage: "Stage 3",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 10,
        description: "After filteration BDV, PPM & PI values",
        stage: "Stage 3",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 11,
        description: "SFRA Test Record",
        stage: "Stage 4",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 12,
        description: "Tan delta and capacitance test on bushing",
        stage: "Stage 4",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 13,
        description: "Tan delta & Capacitance test on winding",
        stage: "Stage 4",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 14,
        description: "Record of Measurement of IR Values & Voltage Ratio Test",
        stage: "Stage 4",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 15,
        description: "Short Circuit Test",
        stage: "Stage 4",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 16,
        description:
          "Winding Resistance Test and Record of Measurement of IR & PI Values",
        stage: "Stage 4",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 17,
        description: "Pre-Charging Check List",
        stage: "Stage 5",
        docNo: "ETC/APCC/01",
      },
      {
        srNo: 18,
        description: "Work Completion Report",
        stage: "Stage 6",
        docNo: "ETC/APCC/01",
      },
    ];

    return (
      <div
        style={{
          width: "100%",
          marginBottom: "30px",
          border: "2px solid #000",
          backgroundColor: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Header with company logo and name */}
        <div
          style={{
            backgroundColor: "#a8c8ec",
            padding: "8px 15px",
            textAlign: "center",
            border: "1px solid #000",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          VISHVAS POWER ENGINEERING SERVICES PVT. LTD.,NAGPUR
        </div>

        {/* Red banner */}
        <div
          style={{
            backgroundColor: "#8B0000",
            color: "white",
            padding: "8px 15px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          AUTO - PROCESS COMPLAINE CHECKLIST
        </div>

        {/* Document info row */}
        <div style={{ display: "flex", border: "1px solid #000" }}>
          <div
            style={{
              border: "1px solid #000",
              padding: "5px 10px",
              backgroundColor: "#f0f0f0",
              minWidth: "80px",
            }}
          >
            <strong>Issue No.</strong> :01
          </div>
          <div
            style={{
              border: "1px solid #000",
              padding: "5px 10px",
              backgroundColor: "#f0f0f0",
              minWidth: "120px",
            }}
          >
            <strong>Issue Date:</strong> 01.04.2025
          </div>
          <div
            style={{
              border: "1px solid #000",
              padding: "5px 10px",
              backgroundColor: "#f0f0f0",
              minWidth: "100px",
            }}
          >
            <strong>Revision No.</strong> :00
          </div>
          <div
            style={{
              border: "1px solid #000",
              padding: "5px 10px",
              backgroundColor: "#f0f0f0",
              minWidth: "120px",
            }}
          >
            <strong>Revision Date</strong> : 00.00.0000
          </div>
          <div
            style={{
              border: "1px solid #000",
              padding: "5px 10px",
              backgroundColor: "#f0f0f0",
              minWidth: "100px",
            }}
          >
            <strong>Stages No.</strong> : 1 of 6
          </div>
          <div
            style={{
              border: "1px solid #000",
              padding: "5px 10px",
              backgroundColor: "#f0f0f0",
              flex: 1,
            }}
          >
            <strong>Doc. No.</strong> : ETC/APCC/01
          </div>
        </div>

        {/* INDEX title */}
        <div
          style={{
            textAlign: "center",
            padding: "15px",
            fontSize: "18px",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          INDEX
        </div>

        {/* Index table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "center",
                  width: "80px",
                }}
              >
                Sr. No.
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Description
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "center",
                  width: "100px",
                }}
              >
                Stages
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "center",
                  width: "120px",
                }}
              >
                Doc. No.
              </th>
            </tr>
          </thead>
          <tbody>
            {indexData.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {item.srNo}
                </td>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                  {item.description}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {item.stage}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {item.docNo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleViewForm = async (project, stage, formIndex) => {
    try {
      const response = await axios.get(
        `${BACKEND_API_BASE_URL}/api/autoData/getFormData`,
        {
          params: {
            projectName: project.name,
            companyName: project.companyName,
            stage: stage,
            formNumber: formIndex + 1,
          },
        }
      );

      setSelectedFormForView({
        project,
        stage,
        formIndex,
        formData: response.data,
      });
      setViewMode(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      showNotification("Failed to load form data", "error");
    }
  };

  const generateFormPDF = () => {
    if (!selectedFormForView) return;

    const { project, stage, formIndex, formData } = selectedFormForView;
    const formStructure = formStructures[`stage${stage}`]?.forms[formIndex];

    if (!formStructure) return;

    const element = document.createElement("div");
    element.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        ${renderIndexTable()}
        
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4299e1; padding-bottom: 20px;">
          <h1 style="color: #2d3748; margin-bottom: 10px;">VISHVAS POWER ENGINEERING</h1>
          <h2 style="color: #4a5568; margin-bottom: 20px;">${
            formStructure.title
          }</h2>
          <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <div><strong>Project:</strong> ${project.name}</div>
            <div><strong>Company:</strong> ${project.companyName}</div>
            <div><strong>Stage:</strong> ${stage}</div>
          </div>
        </div>
        
        ${
          stage === 6
            ? `<div class="stage6-certificate" style="
              background: white;
              padding: 40px;
              max-width: 800px;
              margin: 20px auto;
              border: 2px solid #000;
              font-family: Arial, sans-serif
            ">
              {/* Header */}
              <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                border-bottom: 2px solid #8B0000;
                padding-bottom: 15px
              ">
                <div style="
                  width: 60px;
                  height: 60px;
                  background-color: #fff;
                  border: 2px solid #8B0000;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center
                ">
                  <span style="font-size: 24px; font-weight: bold; color: #8B0000">V</span>
                </div>
                <div style="text-align: center; flex: 1">
                  <h2 style="margin: 0; color: #8B0000; font-size: 18px">VISHVAS</h2>
                  <p style="margin: 0; font-size: 12px; color: #666">
                    A unit of M/s Vishvas Power Engineering Services Pvt. Ltd.
                  </p>
                </div>
                <div style="
                  background-color: #8B0000;
                  color: white;
                  padding: 8px 15px;
                  border-radius: 20px;
                  font-size: 14px;
                  font-weight: bold
                ">
                  25
                </div>
              </div>

              {/* Certificate badges */}
              <div style="
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-bottom: 20px
              ">
                <span style="
                  background-color: #28a745;
                  color: white;
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 10px
                ">ISO CERTIFIED</span>
                <span style="
                  background-color: #28a745;
                  color: white;
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 10px
                ">MSME CERTIFIED</span>
                <span style="
                  background-color: #28a745;
                  color: white;
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 10px
                ">NSIC CERTIFIED</span>
              </div>

              {/* Title */}
              <div style="
                background-color: #8B0000;
                color: white;
                padding: 10px;
                text-align: center;
                margin-bottom: 20px
              ">
                <h3 style="margin: 0; font-size: 16px">
                  Transformers upto 220 kV 250 MVA
                </h3>
              </div>

              <div style="
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #000;
                padding-bottom: 10px
              ">
                <h4 style="margin: 0; font-size: 16px; text-decoration: underline">
                  Work completion report
                </h4>
                <p style="margin: 5px 0; font-size: 12px">
                  Date: ${
                    formData.completionDate || new Date().toLocaleDateString()
                  }
                </p>
              </div>

              {/* Project Information */}
              <div style="margin-bottom: 20px">
                <h5 style="
                  background-color: #f0f0f0;
                  padding: 8px;
                  margin: 0 0 10px 0;
                  font-size: 14px;
                  text-align: center;
                  border: 1px solid #ccc
                ">
                  Project Information
                </h5>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
                  <div style="display: flex; border-bottom: 1px solid #000; padding: 5px 0">
                    <strong style="min-width: 120px">Customer Name:</strong>
                    <span style="border-bottom: 1px solid #000; flex: 1; padding-left: 10px">
                      ${formData.customerName || "___________________"}
                    </span>
                  </div>
                  <div style="display: flex; border-bottom: 1px solid #000; padding: 5px 0">
                    <strong style="min-width: 120px">Order Number:</strong>
                    <span style="border-bottom: 1px solid #000; flex: 1; padding-left: 10px">
                      ${formData.orderNumber || "___________________"}
                    </span>
                  </div>
                  <div style="display: flex; border-bottom: 1px solid #000; padding: 5px 0">
                    <strong style="min-width: 120px">Location:</strong>
                    <span style="border-bottom: 1px solid #000; flex: 1; padding-left: 10px">
                      ${formData.location || "___________________"} SPCSP
                    </span>
                  </div>
                </div>
              </div>

              {/* Transformer Details */}
              <div style="margin-bottom: 20px">
                <h5 style="
                  background-color: #f0f0f0;
                  padding: 8px;
                  margin: 0 0 10px 0;
                  font-size: 14px;
                  text-align: center;
                  border: 1px solid #ccc
                ">
                  Transformer Details
                </h5>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
                  <div style="display: flex; border-bottom: 1px solid #000; padding: 5px 0">
                    <strong style="min-width: 120px">Type:</strong>
                    <span style="border-bottom: 1px solid #000; flex: 1; padding-left: 10px">
                      ${formData.type || "auto Transformer"}
                    </span>
                  </div>
                  <div style="display: flex; border-bottom: 1px solid #000; padding: 5px 0">
                    <strong style="min-width: 120px">Capacity:</strong>
                    <span style="border-bottom: 1px solid #000; flex: 1; padding-left: 10px">
                      ${formData.capacity || "___________________"} MVA
                    </span>
                  </div>
                  <div style="display: flex; border-bottom: 1px solid #000; padding: 5px 0">
                    <strong style="min-width: 120px">Voltage Rating:</strong>
                    <span style="border-bottom: 1px solid #000; flex: 1; padding-left: 10px">
                      ${formData.voltageRating || "___________________"} kV
                    </span>
                  </div>
                  <div style="display: flex; border-bottom: 1px solid #000; padding: 5px 0">
                    <strong style="min-width: 120px">Make:</strong>
                    <span style="border-bottom: 1px solid #000; flex: 1; padding-left: 10px">
                      ${formData.make || "___________________"}
                    </span>
                  </div>
                  <div style="display: flex; border-bottom: 1px solid #000; padding: 5px 0; grid-column: 1 / -1">
                    <strong style="min-width: 120px">Serial Number:</strong>
                    <span style="border-bottom: 1px solid #000; flex: 1; padding-left: 10px">
                      ${formData.serialNumber || "___________________"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div style="margin-bottom: 20px">
                <p style="margin: 0; font-size: 14px; text-align: center; text-decoration: underline">
                  <strong>Subject: Completion of Transformer Erection, Testing and Commissioning Work</strong>
                </p>
              </div>

              <div style="font-size: 12px; line-height: 1.6; margin-bottom: 30px">
                <p>This is to certify that the erection, Testing and commissioning of the above-mentioned transformer have been completed in accordance with relevant IS standards and Specification.</p>
                <p>The transformer unit has been jointly inspected and found satisfactory by the undersigned on behalf of VPES, Nagpur and the customer representative. The transformer is ready for commercial operation from <strong>${
                  formData.chargingDate || "___________"
                }</strong> Hrs. Transformer is handed over to customer on <strong>${
                formData.completionDate || new Date().toLocaleDateString()
              }</strong>.</p>
                <p>We also like to place on the record that work completed and all the activities carried out smoothly.</p>
              </div>

              {/* Signatures */}
              <div style={{ display: "flex", justifyContent: "space-between", gap: "40px", marginBottom: "30px" }}>
                {/* VPES Signature */}
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: "0 0 15px 0", fontSize: "14px", textAlign: "center" }}>
                    <strong>For VPES, Nagpur</strong>
                  </h5>
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #000", padding: "5px 0" }}>
                      <strong style={{ minWidth: "80px" }}>Name:</strong>
                      <span style={{ borderBottom: "1px solid #000", flex: 1, paddingLeft: "10px" }}>
                        {formData.vpesName || "___________________"}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #000", padding: "5px 0" }}>
                      <strong style={{ minWidth: "80px" }}>Designation:</strong>
                      <span style={{ borderBottom: "1px solid #000", flex: 1, paddingLeft: "10px" }}>
                        {formData.vpesDesignation || "___________________"}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #000", padding: "5px 0" }}>
                      <strong style={{ minWidth: "80px" }}>Signature:</strong>
                      <span style={{ borderBottom: "1px solid #000", flex: 1, paddingLeft: "10px" }}>
                        {formData.vpesSignature || ""}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    border: "1px solid #ccc", 
                    height: "80px", 
                    backgroundColor: "#f9f9f9",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "#666"
                  }}>
                    {formData.vpesSignature ? (
                      <img src={formData.vpesSignature || "/placeholder.svg"} alt="VPES Signature" style={{ maxHeight: "70px", maxWidth: "100%" }} />
                    ) : (
                      "Enter name"
                    )}
                  </div>
                  
                  <button style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                    width: "100%",
                    marginBottom: "15px"
                  }}>
                    CLEAR SIGNATURE
                  </button>
                  
                  <div style={{ display: "flex", borderBottom: "1px solid #000", padding: "5px 0" }}>
                    <strong style={{ minWidth: "80px" }}>Date:</strong>
                    <span style={{ borderBottom: "1px solid #000", flex: 1, paddingLeft: "10px" }}>
                      {formData.vpesDate || new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Customer Signature */}
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: "0 0 15px 0", fontSize: "14px", textAlign: "center" }}>
                    <strong>For Customer</strong>
                  </h5>
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #000", padding: "5px 0" }}>
                      <strong style={{ minWidth: "80px" }}>Name:</strong>
                      <span style={{ borderBottom: "1px solid #000", flex: 1, paddingLeft: "10px" }}>
                        {formData.customerRepName || "___________________"}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #000", padding: "5px 0" }}>
                      <strong style={{ minWidth: "80px" }}>Designation:</strong>
                      <span style={{ borderBottom: "1px solid #000", flex: 1, paddingLeft: "10px" }}>
                        {formData.customerRepDesignation || "___________________"}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #000", padding: "5px 0" }}>
                      <strong style={{ minWidth: "80px" }}>Signature:</strong>
                      <span style={{ borderBottom: "1px solid #000", flex: 1, paddingLeft: "10px" }}>
                        {formData.customerSignature || ""}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    border: "1px solid #ccc", 
                    height: "80px", 
                    backgroundColor: "#f9f9f9",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "#666"
                  }}>
                    {formData.customerSignature ? (
                      <img src={formData.customerSignature || "/placeholder.svg"} alt="Customer Signature" style={{ maxHeight: "70px", maxWidth: "100%" }} />
                    ) : (
                      "Enter name"
                    )}
                  </div>
                  
                  <button style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                    width: "100%",
                    marginBottom: "15px"
                  }}>
                    CLEAR SIGNATURE
                  </button>
                  
                  <div style={{ display: "flex", borderBottom: "1px solid #000", padding: "5px 0" }}>
                    <strong style={{ minWidth: "80px" }}>Date:</strong>
                    <span style={{ borderBottom: "1px solid #000", flex: 1, paddingLeft: "10px" }}>
                      {formData.customerDate || new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div style="margin-top: 40px; display: flex; justify-content: space-between;">
                <div style="text-align: center; width: 30%;">
                  <div style="border-top: 2px solid #000; margin-top: 50px; padding-top: 10px;">
                    <strong>Prepared By</strong><br>
                    Date: ${new Date().toLocaleDateString()}
                  </div>
                </div>
                <div style="text-align: center; width: 30%;">
                  <div style="border-top: 2px solid #000; margin-top: 50px; padding-top: 10px;">
                    <strong>Checked By</strong><br>
                    Date: ___________
                  </div>
                </div>
                <div style="text-align: center; width: 30%;">
                  <div style="border-top: 2px solid #000; margin-top: 50px; padding-top: 10px;">
                    <strong>Approved By</strong><br>
                    Date: ___________
                  </div>
                </div>
              </div>
            </div>`
            : `
          <div style="margin-bottom: 30px;">
            ${formStructure.fields
              .map(
                (field) => `
              <div style="margin-bottom: 15px; display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                <strong style="color: #2d3748; width: 40%;">${formatLabel(
                  field.label
                )}:</strong>
                <span style="width: 55%; text-align: right;">${
                  formData[field.name] || "N/A"
                }</span>
              </div>
            `
              )
              .join("")}
          </div>
        `
        }
        
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div style="text-align: center; width: 30%;">
            <div style="border-top: 2px solid #000; margin-top: 50px; padding-top: 10px;">
              <strong>Prepared By</strong><br>
              Date: ${new Date().toLocaleDateString()}
            </div>
          </div>
          <div style="text-align: center; width: 30%;">
            <div style="border-top: 2px solid #000; margin-top: 50px; padding-top: 10px;">
              <strong>Checked By</strong><br>
              Date: ___________
            </div>
          </div>
          <div style="text-align: center; width: 30%;">
            <div style="border-top: 2px solid #000; margin-top: 50px; padding-top: 10px;">
              <strong>Approved By</strong><br>
              Date: ___________
            </div>
          </div>
        </div>
      </div>
    `;

    const opt = {
      margin: 1,
      filename: `${project.name}_Stage${stage}_Form${formIndex + 1}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const renderFormView = () => {
    if (!selectedFormForView) return null;

    const { project, stage, formIndex, formData } = selectedFormForView;
    const formStructure = formStructures[`stage${stage}`]?.forms[formIndex];

    if (!formStructure) return null;

    return (
      <div className="form-stage-container">
        <div className="form-header">
          <div className="form-progress">
            <h2>View Form - Stage {stage}</h2>
            <p>{formStructure.title}</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={generateFormPDF} className="submit-btn">
              📄 Download PDF
            </button>
            <button onClick={() => setViewMode(false)} className="back-btn">
              ← Back
            </button>
          </div>
        </div>

        <div className="form-content">
          {renderIndexTable()}

          <div className="company-header">
            <h1>VISHVAS POWER ENGINEERING</h1>
            <h2>{formStructure.title}</h2>
            <div className="project-info">
              <div className="info-item">
                <strong>Project:</strong> {project.name}
              </div>
              <div className="info-item">
                <strong>Company:</strong> {project.companyName}
              </div>
              <div className="info-item">
                <strong>Stage:</strong> {stage}
              </div>
              <div className="info-item">
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {stage === 6 ? (
            <div
              className="stage6-certificate"
              style={{
                background: "white",
                padding: "40px",
                maxWidth: "800px",
                margin: "20px auto",
                border: "2px solid #000",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  borderBottom: "2px solid #8B0000",
                  paddingBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#fff",
                    border: "2px solid #8B0000",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#8B0000",
                    }}
                  >
                    V
                  </span>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <h2
                    style={{ margin: "0", color: "#8B0000", fontSize: "18px" }}
                  >
                    VISHVAS
                  </h2>
                  <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                    A unit of M/s Vishvas Power Engineering Services Pvt. Ltd.
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: "#8B0000",
                    color: "white",
                    padding: "8px 15px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  25
                </div>
              </div>

              {/* Certificate badges */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "12px",
                  }}
                >
                  ISO CERTIFIED
                </div>
                <div
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "12px",
                  }}
                >
                  MSME Certified
                </div>
              </div>

              {/* Transformer specification */}
              <div
                style={{
                  backgroundColor: "#8B0000",
                  color: "white",
                  padding: "10px",
                  textAlign: "center",
                  marginBottom: "20px",
                  fontWeight: "bold",
                }}
              >
                Transformers upto 250 kV 250 MVA
              </div>

              {/* Work completion report title */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h3 style={{ textDecoration: "underline", margin: "10px 0" }}>
                  Work completion report
                </h3>
                <div style={{ textAlign: "right", marginTop: "10px" }}>
                  <strong>Date:</strong>{" "}
                  <input
                    type="date"
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </div>
              </div>

              {/* Project Information */}
              <div style={{ marginBottom: "20px" }}>
                <h4
                  style={{ textAlign: "center", textDecoration: "underline" }}
                >
                  Project Information
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    marginTop: "15px",
                  }}
                >
                  <div>
                    <strong>Customer Name:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "200px",
                      }}
                    >
                      {formData?.customerName || ""}
                    </span>
                  </div>
                  <div>
                    <strong>Order Number:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "200px",
                      }}
                    >
                      {formData?.orderNumber || ""}
                    </span>
                  </div>
                  <div>
                    <strong>Location:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "200px",
                      }}
                    >
                      {formData?.location || ""}
                    </span>
                    <span style={{ marginLeft: "20px" }}>
                      <strong>SPJSP</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Transformer Details */}
              <div style={{ marginBottom: "20px" }}>
                <h4
                  style={{ textAlign: "center", textDecoration: "underline" }}
                >
                  Transformer Details
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    marginTop: "15px",
                  }}
                >
                  <div>
                    <strong>Type:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "150px",
                      }}
                    >
                      {formData?.type || "auto Transformer"}
                    </span>
                  </div>
                  <div>
                    <strong>Capacity:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "100px",
                      }}
                    >
                      {formData?.capacity || ""}
                    </span>{" "}
                    <strong>MVA</strong>
                  </div>
                  <div>
                    <strong>Voltage Rating:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "100px",
                      }}
                    >
                      {formData?.voltageRating || ""}
                    </span>{" "}
                    <strong>kV</strong>
                  </div>
                  <div>
                    <strong>Make:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "150px",
                      }}
                    >
                      {formData?.make || ""}
                    </span>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <strong>Serial Number:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "200px",
                      }}
                    >
                      {formData?.serialNumber || ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: "30px" }}>
                <p>
                  <strong>
                    Subject: Completion of Transformer Erection, Testing and
                    Commissioning Work
                  </strong>
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    textAlign: "justify",
                  }}
                >
                  This is to certify that the erection, Testing and
                  commissioning of the above-mentioned transformer have been
                  completed as required in accordance with relevant
                  Indian/International Standards and found satisfactory by the
                  undersigned.
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    textAlign: "justify",
                  }}
                >
                  The installation work has been jointly inspected and found
                  satisfactory by the undersigned. The transformer commissioned
                  is handed over to customer representative and is ready for
                  commercial operation.
                </p>
                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  Date when put on the commercial operation:{" "}
                  <input
                    type="date"
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </p>
              </div>

              {/* Signature sections */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "40px",
                  marginBottom: "30px",
                }}
              >
                {/* VPES Section */}
                <div>
                  <h4 style={{ textAlign: "center", marginBottom: "20px" }}>
                    For VPES, Nagpur
                  </h4>
                  <div style={{ marginBottom: "15px" }}>
                    <strong>Name:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "150px",
                      }}
                    ></span>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <strong>Designation:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "150px",
                      }}
                    ></span>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <strong>Signature:</strong>
                  </div>
                  <div
                    style={{
                      border: "1px solid #ccc",
                      height: "80px",
                      marginBottom: "15px",
                      backgroundColor: "#f9f9f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                    }}
                  >
                    E-sign name
                  </div>
                  <button
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                  >
                    CLEAR SIGNATURE
                  </button>
                </div>

                {/* Customer Section */}
                <div>
                  <h4 style={{ textAlign: "center", marginBottom: "20px" }}>
                    For Customer
                  </h4>
                  <div style={{ marginBottom: "15px" }}>
                    <strong>Name:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "150px",
                      }}
                    ></span>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <strong>Designation:</strong>{" "}
                    <span
                      style={{
                        borderBottom: "1px solid #000",
                        display: "inline-block",
                        minWidth: "150px",
                      }}
                    ></span>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <strong>Signature:</strong>
                  </div>
                  <div
                    style={{
                      border: "1px solid #ccc",
                      height: "80px",
                      marginBottom: "15px",
                      backgroundColor: "#f9f9f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                    }}
                  >
                    E-sign name
                  </div>
                  <button
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                  >
                    CLEAR SIGNATURE
                  </button>
                </div>
              </div>

              {/* Date fields */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "40px",
                  marginBottom: "30px",
                }}
              >
                <div>
                  <strong>Date:</strong>{" "}
                  <input
                    type="date"
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  <input
                    type="date"
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </div>
              </div>

              {/* Submit button */}
              <div style={{ textAlign: "center" }}>
                <button
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "25px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  SUBMIT STAGE 6
                </button>
              </div>
            </div>
          ) : (
            <div className="form-fields">
              {formStructure.fields.map((field, index) => (
                <div key={index} className="form-field">
                  <label className="field-label">
                    {formatLabel(field.label)}:
                  </label>
                  <div className="field-value">
                    {formData?.[field.name] || "Not filled"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Default data for initialization
  const defaultDepartments = [
    {
      id: 1,
      name: "Auto Transformer",
      description: "Auto transformer department for power distribution systems",
      icon: "⚡",
      color: "#C41E3A",
    },
    {
      id: 2,
      name: "Traction Transformer",
      description: "Traction transformer department for railway systems",
      icon: "🚊",
      color: "#1E3A8A",
    },
    {
      id: 3,
      name: "V Connected 63 MVA Transformer",
      description:
        "V Connected 63 MVA transformer department for high voltage systems",
      icon: "🔌",
      color: "#047857",
    },
    {
      id: 4,
      name: "Testing Auto Transformer",
      description:
        "Testing Auto transformer department for power distribution systems",
      icon: "🗲",
      color: "#C41E3A",
    },
    {
      id: 5,
      name: "Testing Traction Transformer",
      description: "Testing Traction transformer department for railway systems",
      icon: "🗲",
      color: "#1E3A8A",
    },
    {
      id: 6,
      name: "Testing V Connected 63 MVA Transformer",
      description:
        "Testing V Connected 63 MVA transformer department for high voltage systems",
      icon: "🗲",
      color: "#047857",
    },
  ];


  // Helper functions for modals
  const showNotification = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotificationModal(true);
  };

  const showConfirmDialog = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const showInputDialog = (title, placeholder, action) => {
    setInputModalTitle(title);
    setInputModalPlaceholder(placeholder);
    setInputModalValue("");
    setInputModalAction(() => action);
    setShowInputModal(true);
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const visibleDepartments = TESTING_DEPARTMENT
      ? defaultDepartments.filter((d) => d.name.startsWith("Testing "))
      : defaultDepartments.filter((d) => !d.name.startsWith("Testing "));
    setDepartments(visibleDepartments);
  }, []);

  const handleCreateCompany = async () => {
    if (!newCompany.name || !newCompany.description || !selectedDepartment) return;

    // Check if company with same name already exists
    const existingCompany = Companys.find(
      (company) =>
        company.companyName.toLowerCase() === newCompany.name.toLowerCase()
    );

    if (existingCompany) {
      showNotification(
        `Company with name "${newCompany.name}" is already there. Please choose another name.`,
        "error"
      );
      return;
    }

    // Map each department to its POST API route
    const createCompanyApiMap = {
      "Auto Transformer":                       "/api/autocompany",
      "Traction Transformer":                   "/api/tractioncompany",
      "V Connected 63 MVA Transformer":         "/api/vconnectcompany",
      "Testing Auto Transformer":               "/api/test_autocompany",
      "Testing Traction Transformer":           "/api/test_tractioncompany",
      "Testing V Connected 63 MVA Transformer": "/api/test_vconnectcompany",
    };

    const apiRoute = createCompanyApiMap[selectedDepartment.name];

    if (!apiRoute) {
      showNotification("Unknown department. Cannot create company.", "error");
      return;
    }

    const CompanyId = Math.max(...Companys.map((p) => p.id), 0) + 1;
    const newCompanyObj = {
      id: CompanyId,
      companyName: newCompany.name,
      companyDescription: newCompany.description,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      departmentId: selectedDepartment.id,
      departmentType: selectedDepartment.name,
    };

    try {
      const response = await axios.post(
        `${BACKEND_API_BASE_URL}${apiRoute}`,
        {
          companyName: newCompany.name,
          companyDescription: newCompany.description,
          departmentType: selectedDepartment.name,
        }
      );
      console.log("Company created successfully on the backend:", response.data);
    } catch (error) {
      console.error("Error creating company on the backend:", error);
      alert("Failed to create company. Please try again.");
      return;
    }

    setCompanys([...Companys, newCompanyObj]);
    setShowCreateCompanyForm(false);
    showNotification(
      `Company "${newCompanyObj.companyName}" created successfully in ${selectedDepartment.name}!`,
      "success"
    );
  };

  // ── Core project-creation logic (shared by both modal paths) ──────────────
  const doCreateProject = async (CompanyName, ProjectName, jobRating, apiRoute) => {
    if (!ProjectName.trim()) return;

    // Check if project with same name already exists in this company
    const existingProject = selectedMainCompany.companyProjects?.find(
      (project) => project.name.toLowerCase() === ProjectName.toLowerCase()
    );

    if (existingProject) {
      showNotification(
        `Project with name "${ProjectName}" already exists in this company. Please choose a different name.`,
        "error"
      );
      return;
    }

    const sevenStageDepts = [
      "V Connected 63 MVA Transformer",
      "Testing V Connected 63 MVA Transformer",
      "Traction Transformer",
    ];
    const totalStages = sevenStageDepts.includes(selectedDepartment?.name) ? 7 : 6;

    // Build stage approvals / submitted stages dynamically
    const stageFlags = {};
    for (let i = 1; i <= totalStages; i++) stageFlags[i] = false;

    const newProject = {
      id: Math.max(...companies.map((c) => c.id), 0) + 1,
      name: ProjectName,
      companyName: CompanyName,
      stage: 1,
      formsCompleted: 0,
      totalForms: getStageFormCount(1),
      status: "in-progress",
      lastActivity: new Date().toISOString().split("T")[0],
      stageApprovals: { ...stageFlags },
      submittedStages: { ...stageFlags },
      ...(jobRating ? { jobRating } : {}),
    };

    try {
      if (additionalLogging) {
        console.log("Frontend : From doCreateProject post call to", apiRoute);
      }
      const response = await axios.post(
        `${BACKEND_API_BASE_URL}${apiRoute}`,
        {
          projectName: ProjectName,
          companyName: CompanyName,
          companyProjects: newProject,
          userName: user?.name || "",
        }
      );
      console.log("Project created successfully on the backend:", response.data);

      selectedMainCompany.companyProjects =
        selectedMainCompany.companyProjects ?? [];
      selectedMainCompany.companyProjects.push(newProject);

      setCompanies((prev) => [...prev, newProject]);
      showNotification(
        `Project "${ProjectName}" added to this Company!`,
        "success"
      );
    } catch (error) {
      console.error("Error creating project on the backend:", error);
      showNotification("Failed to create project. Please try again.", "error");
    }
  };

  const handleAddProject = (CompanyName) => {
    // Map each department to its addCompany API route
    const addProjectApiMap = {
      "Auto Transformer":                       "/api/autocompany/addCompany",
      "Traction Transformer":                   "/api/tractioncompany/addCompany",
      "V Connected 63 MVA Transformer":         "/api/vconnectcompany/addCompany",
      "Testing Auto Transformer":               "/api/test_autocompany/addCompany",
      "Testing Traction Transformer":           "/api/test_tractioncompany/addCompany",
      "Testing V Connected 63 MVA Transformer": "/api/test_vconnectcompany/addCompany",
    };

    const apiRoute = addProjectApiMap[selectedDepartment?.name];
    if (!apiRoute) {
      showNotification("Unknown department. Cannot create project.", "error");
      return;
    }

    if (selectedDepartment?.name?.startsWith("Testing ")) {
      // Testing departments → custom modal with Project Name + Job Rating
      setCreateProjectCompanyName(CompanyName);
      setCreateProjectName("");
      setCreateProjectJobRating("8");
      setShowCreateProjectModal(true);
    } else {
      // Non-testing departments → simple single-input dialog
      showInputDialog(
        "Create New Project",
        "Enter Project name...",
        async (ProjectName) => {
          await doCreateProject(CompanyName, ProjectName, null, apiRoute);
        }
      );
    }
  };

  // Submit handler for the Testing-department create-project modal
  const handleCreateProjectModalSubmit = async () => {
    if (!createProjectName.trim()) return;

    const addProjectApiMap = {
      "Testing Auto Transformer":               "/api/test_autocompany/addCompany",
      "Testing Traction Transformer":           "/api/test_tractioncompany/addCompany",
      "Testing V Connected 63 MVA Transformer": "/api/test_vconnectcompany/addCompany",
    };
    const apiRoute = addProjectApiMap[selectedDepartment?.name];
    if (!apiRoute) {
      showNotification("Unknown department. Cannot create project.", "error");
      return;
    }

    await doCreateProject(
      createProjectCompanyName,
      createProjectName.trim(),
      createProjectJobRating,
      apiRoute
    );
    setShowCreateProjectModal(false);
  };

  // Helper function to get form count for each stage
  const getStageFormCount = (stage) => {
    const stageForms = {
      1: 8, // Stage 1 has 4 forms
      2: 2, // Stage 2 has 1 form
      3: 1, // Stage 3 has 7 forms
      4: 4, // Stage 4 has 6 forms
      5: 11, // Stage 5 has 11 form
      6: 3, // Stage 6 has 3 form
      7: 1, // Stage 7 has 1 form
    };
    return stageForms[stage] || 1;
  };

  const handleReviewStage = async (Project, stage) => {
    if (Project.status !== "pending-approval") {
      showNotification(`No forms submitted for Stage ${stage} yet.`, "warning");
      return;
    }

    const reviewStageApiMap = {
      "Auto Transformer":                       "/api/autoData/getStageTable",
      "Traction Transformer":                   "/api/tractionData/getStageTable",
      "V Connected 63 MVA Transformer":         "/api/vconnectData/getStageTable",
      "Testing Auto Transformer":               "/api/test_autoData/getStageTable",
      "Testing Traction Transformer":           "/api/test_tractionData/getStageTable",
      "Testing V Connected 63 MVA Transformer": "/api/test_vconnectData/getStageTable",
    };
    const stageApiRoute = reviewStageApiMap[selectedDepartment?.name] || "/api/autoData/getStageTable";

    try {
      const response = await axios.post(
        `${BACKEND_API_BASE_URL}${stageApiRoute}`,
        {
          projectName: Project.name,
          companyName: Project.companyName,
          stage: Project.stage,
        }
      );
      console.log(
        `Complete data has been provided for ${Project.companyName} and projectName ${Project.name}`,
        response.data
      );
      setFormDataFromDB(response.data.data);
    } catch (error) {
      console.error("Error creating company on the backend:", error);
      alert("Failed to create company. Please try again.");
      return;
    }

    setSelectedProjectForReview(Project);
    setCurrentStageReview(stage);
    setReviewMode(true);
  };

  const handleApproveStage = async (stage) => {
    // Map each department to its approveCompanyStage API route
    const approveStageApiMap = {
      "Auto Transformer":                       "/api/autocompany/approveCompanyStage",
      "Traction Transformer":                   "/api/tractioncompany/approveCompanyStage",
      "V Connected 63 MVA Transformer":         "/api/vconnectcompany/approveCompanyStage",
      "Testing Auto Transformer":               "/api/test_autocompany/approveCompanyStage",
      "Testing Traction Transformer":           "/api/test_tractioncompany/approveCompanyStage",
      "Testing V Connected 63 MVA Transformer": "/api/test_vconnectcompany/approveCompanyStage",
    };

    // V Connected and Traction variants use 7 stages; all others use 6
    const sevenStageDepts = [
      "V Connected 63 MVA Transformer",
      "Testing V Connected 63 MVA Transformer",
      "Traction Transformer",
    ];
    const totalStages = sevenStageDepts.includes(selectedDepartment?.name) ? 7 : 6;

    const apiEndpoint = approveStageApiMap[selectedDepartment?.name];
    if (!apiEndpoint) {
      showNotification("Unknown department. Cannot approve stage.", "error");
      return;
    }

    try {
      if (additionalLogging) {
        console.log("Frontend : From handleApproveStage post call to", apiEndpoint);
      }

      const authToken = getAuthToken();
      if (!authToken) {
        showNotification("Authentication token not found. Please log in again.", "error");
        return;
      }

      const response = await axios.post(
        `${BACKEND_API_BASE_URL}${apiEndpoint}`,
        {
          companyName: selectedProjectForReview.companyName,
          projectName: selectedProjectForReview.name,
          stage: selectedProjectForReview.stage,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Stage approved successfully on the backend:", response.data);
    } catch (error) {
      console.error("Error approving stage:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showNotification("Authentication failed. Please log out and log in again.", "error");
        return;
      }
      if (error.response?.status === 400) {
        // Backend validation failed (already approved, not submitted, etc.)
        showNotification(
          error.response.data?.message || "Cannot approve this stage. Please check the stage status.",
          "warning"
        );
        return;
      }
      showNotification("Failed to approve stage. Please try again.", "error");
      return;
    }

    if (!selectedProjectForReview) {
      showNotification("No Project selected for review.", "error");
      return;
    }

    console.log(
      `Approving stage ${selectedProjectForReview.stage} for Project ${selectedProjectForReview.name}`
    );

    setSelectedMainCompany((prevCompany) => ({
      ...prevCompany,
      companyProjects: prevCompany.companyProjects.map((project) => {
        if (
          prevCompany.companyName === selectedProjectForReview.companyName &&
          project.name === selectedProjectForReview.name
        ) {
          const currentStage = project.stage;
          return {
            ...project,
            stage: currentStage !== totalStages ? currentStage + 1 : currentStage,
            status: currentStage === totalStages ? "completed" : "in-progress",
            stageApprovals: {
              ...project.stageApprovals,
              [currentStage]: true,
            },
          };
        }
        return project;
      }),
    }));

    const isProjectCompleted = selectedProjectForReview.stage === totalStages;

    showNotification(
      `Stage ${selectedProjectForReview.stage} approved for ${selectedProjectForReview.name}! ${
        isProjectCompleted
          ? "Project completed all stages."
          : `Stage ${selectedProjectForReview.stage + 1} is now available.`
      }`,
      "success"
    );
    setReviewMode(false);
    setSelectedProjectForReview(null);
    setCurrentStageReview(1);
  };

  const handleRejectStage = (stage) => {
    if (!selectedProjectForReview) {
      showNotification("No Project selected for review.", "error");
      return;
    }
    stage.submittedStages[stage.stage] = false;
    stage.status = "rejected";
    setRejectionStage(stage);
    setRejectionReason("");
    setShowRejectionModal(true);
  };

  const confirmRejectStage = async () => {
    if (!rejectionReason.trim()) {
      showNotification(
        "Please provide a reason for rejecting this stage.",
        "warning"
      );
      return;
    }

    const rejectStageApiMap = {
      "Auto Transformer":                       "/api/autocompany/rejectStage",
      "Traction Transformer":                   "/api/tractioncompany/rejectStage",
      "V Connected 63 MVA Transformer":         "/api/vconnectcompany/rejectStage",
      "Testing Auto Transformer":               "/api/test_autocompany/rejectStage",
      "Testing Traction Transformer":           "/api/test_tractioncompany/rejectStage",
      "Testing V Connected 63 MVA Transformer": "/api/test_vconnectcompany/rejectStage",
    };
    const rejectApiRoute = rejectStageApiMap[selectedDepartment?.name] || "/api/autocompany/rejectStage";

    try {
      const { data } = await axios.post(
        `${BACKEND_API_BASE_URL}${rejectApiRoute}`,
        {
          companyName: selectedProjectForReview.companyName,
          projectName: selectedProjectForReview.name,
          stage: rejectionStage.stage,
          rejectionReason,
          userName: user?.name || "",
        }
      );
    } catch (error) {
      console.error("Error rejecting stage:", error);
      showNotification(error.message, "error");
    }

    selectedProjectForReview.rejectionReason = rejectionReason;
    console.log(
      `Rejecting stage ${rejectionStage} for Project ${selectedProjectForReview.name}`
    );

    // Update submitted forms status
    setSubmittedForms((forms) =>
      forms.map((form) =>
        form.ProjectId === selectedProjectForReview.id &&
        form.stage === rejectionStage
          ? {
              ...form,
              status: "rejected",
              rejectionReason,
              reviewedAt: new Date().toISOString().split("T")[0],
            }
          : form
      )
    );

    showNotification(
      `Stage ${rejectionStage.stage} rejected for Project : ${selectedProjectForReview.name}. Project needs to resubmit forms.`,
      "warning"
    );
    setShowRejectionModal(false);
    setRejectionStage(null);
    setRejectionReason("");
    setReviewMode(false);
    setSelectedProjectForReview(null);
    setCurrentStageReview(1);
  };

  // Generate default empty form structure so "View Forms" always shows something
  const getDefaultEmptyFormData = () => {
    const sevenStageDepts = [
      "V Connected 63 MVA Transformer",
      "Testing V Connected 63 MVA Transformer",
      "Traction Transformer",
    ];
    const isSeven = sevenStageDepts.includes(selectedDepartment?.name);

    const stageFormCounts = isSeven
      ? { stage1: 7, stage2: 2, stage3: 1, stage4: 4, stage5: 8, stage6: 2, stage7: 1 }
      : { stage1: 7, stage2: 2, stage3: 1, stage4: 4, stage5: 8, stage6: 1 };

    const emptyData = {};
    Object.entries(stageFormCounts).forEach(([stageKey, formCount]) => {
      emptyData[stageKey] = {};
      for (let i = 1; i <= formCount; i++) {
        emptyData[stageKey][`form${i}`] = {};
      }
    });
    return emptyData;
  };

  const handleViewSubmittedForms = async (Project) => {
    console.log("Fronend : handleViewSubmittedForm ");
    if (Project.status === "rejected" && Project.rejectionReason) {
      showNotification(
        `Form got rejected due to  ${Project.rejectionReason}. Please resubmit the forms.`,
        "warning"
      );
    }

    try {
      if (additionalLogging) {
        console.log(
          "Frontend : From handleViewSubmittedForms post call to get complete table"
        );
      }

      const completeTableApiMap = {
        "Auto Transformer":                       "/api/autoData/getCompleteTable",
        "Traction Transformer":                   "/api/tractionData/getCompleteTable",
        "V Connected 63 MVA Transformer":         "/api/vconnectData/getCompleteTable",
        "Testing Auto Transformer":               "/api/test_autoData/getCompleteTable",
        "Testing Traction Transformer":           "/api/test_tractionData/getCompleteTable",
        "Testing V Connected 63 MVA Transformer": "/api/test_vconnectData/getCompleteTable",
      };
      const completeTableRoute = completeTableApiMap[selectedDepartment?.name] || "/api/autoData/getCompleteTable";

      const response = await axios.post(
        `${BACKEND_API_BASE_URL}${completeTableRoute}`,
        {
          projectName: Project.name,
          companyName: Project.companyName,
        }
      );
      console.log(
        `Complete data has been provided for ${Project.companyName} and projectName ${Project.name}`,
        response.data
      );

      // Map department to its response data key
      const formDataKeyMap = {
        "Traction Transformer":                   "TractionData",
        "Testing Traction Transformer":           "TractionData",
        "V Connected 63 MVA Transformer":         "vConnectData",
        "Testing V Connected 63 MVA Transformer": "vConnectData",
      };
      const formDataKey = formDataKeyMap[selectedDepartment?.name] || "autoTransformerData";
      let formData = response.data.data?.[formDataKey] ?? null;

      // Use fetched data if valid, otherwise fall back to empty form structure
      if (formData && typeof formData === 'object' && Object.keys(formData).length > 0) {
        setFormDataFromDB(formData);
      } else {
        console.warn('No form data found — showing empty forms:', response.data);
        setFormDataFromDB(getDefaultEmptyFormData());
      }
    } catch (error) {
      console.error("Error loading submitted forms:", error);
      // Show empty forms instead of blocking the user
      setFormDataFromDB(getDefaultEmptyFormData());
    }
    setSelectedProjectForReview(Project);
    setShowSubmitterReview(true);
  };

  const handleBackFromReview = () => {
    setReviewMode(false);
    setShowSubmitterReview(false);
    setSelectedProjectForReview(null);
    setCurrentStageReview(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "in-progress":
        return "status-progress";
      case "pending-approval":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  const getStageStatus = (project, stageNumber) => {
    if (project.stageApprovals?.[stageNumber]) {
      return "approved";
    }
    if (project.submittedStages?.[stageNumber]) {
      return "pending-review";
    }
    if (project.stage === stageNumber) {
      return "available";
    }
    return "locked";
  };

  const getDepartmentCompanys = (departmentId) => {
    return Companys.filter((Company) => Company.departmentId === departmentId);
  };

  const getCompanyCompanies = (CompanyId) => {
    return companies.filter((Project) => Project.CompanyId === CompanyId);
  };

  const currentStageForms = reviewMode
    ? submittedForms.filter(
        (form) =>
          form.ProjectId === selectedProjectForReview.id &&
          form.stage === currentStageReview
      )
    : [];

  const allProjectForms = showSubmitterReview
    ? submittedForms.filter(
        (form) => form.ProjectId === selectedProjectForReview.id
      )
    : [];

  const handleLogoutAndClearData = () => {
    localStorage.removeItem("etc_Companys");
    localStorage.removeItem("etc_companies");
    localStorage.removeItem("etc_submitted_forms");

    setCompanys([]);
    setCompanies([]);
    setSubmittedForms([]);
    setSelectedDepartment(null);
    setSelectedMainCompany(null);
    setSelectedProjectForReview(null);
    setReviewMode(false);
    setShowSubmitterReview(false);
    setShowFormStage(false);

    onLogout();
  };

  // Function to handle form submission from FormStage
  const handleFormStageSubmit = (
    stage,
    submittedData,
    selectedProjectForReview
  ) => {
    console.log(
      `Submittingsds forms for stage ${stage}:`,
      submittedData,
      selectedProjectForReview
    );

    const newFormEntry = {
      id: Math.max(...submittedForms.map((f) => f.id), 0) + 1,
      ProjectId: formStageProject.id,
      stage: stage,
      formName: `Stage ${stage} Forms`,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "pending-review",
      data: submittedData,
    };

    console.log(`Submitting forms for stagew ${stage}:`, newFormEntry);

    setSubmittedForms((prev) => [...prev, newFormEntry]);

    // Update Project to show forms submitted and pending approval

    showNotification(
      `Forms for Stage ${stage} submitted successfully! Waiting for ETC Admin approval.`,
      "success"
    );
    setShowFormStage(false);
    setFormStageProject(null);
    setFormStageStage(1);
  };

  // Function to go back from FormStage
  const handleBackFromFormStage = () => {
    setShowFormStage(false);
    setFormStageProject(null);
    setFormStageStage(1);
  };

  const capitalizeFirst = (s) =>
    typeof s === "string" && s.length
      ? s.charAt(0).toUpperCase() + s.slice(1)
      : s;

  const isObjectOfObjects = (obj) =>
    obj &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.values(obj).every(
      (v) => v && typeof v === "object" && !Array.isArray(v)
    );

  const renderPrimitiveCell = (val, labelForImg = "") => {
    if (typeof val === "string" && val.startsWith("data:image/")) {
      return (
        <img
          src={val || "/placeholder.svg"}
          alt={labelForImg || "image"}
          style={{ maxWidth: "100px", border: "1px solid #ccc" }}
        />
      );
    }
    if (Array.isArray(val)) {
      return JSON.stringify(val);
    }
    return String(val);
  };

  // ─── Testing Department Project Card ───────────────────────────────────────
  const TESTING_SPEC_ROWS = [
    { no: 1,  label: "Sr. No",                                          value: "V/M/" },
    { no: 2,  label: "Commissioning year",                              value: "" },
    { no: 3,  label: "Voltage rating (kV)",                             value: "55 / 27.5" },
    { no: 4,  label: "HV Current (Amp.)",                               value: "145.45" },
    { no: 5,  label: "LV Current (Amp.)",                               value: "290.91" },
    { no: 6,  label: "Oil Quantity (Ltrs.)",                            value: "2500 Ltrs" },
    { no: 7,  label: "Oil Quantity (kG.)",                              value: "2225 kG" },
    { no: 8,  label: "Core + Winding",                                  value: "7350 kG" },
    { no: 9,  label: "No. of Taps",                                     value: "NA" },
    { no: 10, label: "% impedance (%)",                                 value: "0.49 %" },
    { no: 11, label: "Permissible Temp rise over Amb. Oil / Winding",   value: "40/50 °C" },
    { no: 12, label: "Transport weight",                                value: "13375 KG (WITH OIL)" },
    { no: 13, label: "Length * Width * Height",                         value: "" },
    { no: 14, label: "No. of radiator",                                 value: "4 NOS" },
  ];

  const TESTING_BUTTONS = [
    // Row 1
    { label: "CT TEST",                        formName: "CTTestForm" },
    { label: "BUSHING TEST",                   formName: "BushingTestForm" },
    { label: "2 KV TEST",                      formName: "TwoKVTestForm" },
    { label: "PRE-CONNECTION TEST",            formName: "PreConnectionTestForm" },
    { label: "POST-CONNECTION TESTING",        formName: "PostConnectionTestForm" },
    { label: "PRE & POST VPD SERVICING",       formName: "PrePostVPDServicingForm" },
    // Row 2
    { label: "OIL Soaking servicing planning", formName: "OilSoakingForm" },
    { label: "POST-TANKING TEST",              formName: "PostTankingTestForm" },
    { label: "FINAL LV TEST",                  formName: "FinalLVTestForm" },
    { label: "Checklist for TFR BEFORE HV",    formName: "ChecklistTFRBeforeHVForm" },
    { label: "List of HV Test",                formName: "ListOfHVTestForm" },
  ];

  const handleTestFormSubmit = (buttonLabel) => {
    if (activeTestingProject) {
      // Find the formName for this button
      const btn = TESTING_BUTTONS.find((b) => b.label === buttonLabel);
      const formName = btn?.formName;
      if (!formName) return;

      // Optimistically update the local project's submittedForms so the tick
      // mark appears immediately without waiting for a page refresh
      setSelectedMainCompany((prevCompany) => ({
        ...prevCompany,
        companyProjects: (prevCompany.companyProjects || []).map((proj) =>
          proj.name === activeTestingProject.name &&
          proj.companyName === activeTestingProject.companyName
            ? {
                ...proj,
                submittedForms: {
                  ...(proj.submittedForms || {}),
                  [formName]: true,
                },
              }
            : proj
        ),
      }));
    }
  };

  const renderTestingProjectCard = (Project, index) => (
    <div
      key={index}
      style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#1e3a8a" }}>
          🧪 {Project.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {Project.jobRating && (
            <div style={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              borderRadius: "20px",
              padding: "5px 16px",
              fontWeight: "700",
              fontSize: "0.85rem",
              color: "#fff",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}>
              ⚡ {Project.jobRating} MVA
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); handleEditProjectName(Project); }}
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
          >
            ✏️ Edit Name
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleProjectDelete(Project); }}
            style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Specs Table */}
      <div style={{ overflowX: "auto", marginBottom: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", border: "1px solid #d1d5db" }}>
          <tbody>
            {TESTING_SPEC_ROWS.map((row) => (
              <tr key={row.no} style={{ borderBottom: "1px solid #d1d5db" }}>
                <td style={{
                  padding: "8px 12px",
                  color: "#6b7280",
                  width: "44px",
                  textAlign: "center",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#f9fafb",
                  fontSize: "0.8rem",
                }}>
                  {row.no}
                </td>
                <td style={{
                  padding: "8px 12px",
                  fontWeight: "500",
                  color: "#374151",
                  width: "260px",
                  border: "1px solid #d1d5db",
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: "8px 12px",
                  color: "#374151",
                  width: "24px",
                  textAlign: "center",
                  border: "1px solid #d1d5db",
                }}>
                  :
                </td>
                <td style={{
                  padding: "8px 16px",
                  fontWeight: "700",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  textAlign: "center",
                }}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Last Event Info */}
      {Project.lastEventAction && (
        <div style={{
          marginBottom: "16px",
          padding: "6px 10px",
          background: "#f0f9ff",
          borderLeft: "3px solid #3b82f6",
          borderRadius: "4px",
          fontSize: "0.78rem",
          color: "#374151",
          lineHeight: "1.4",
        }}>
          📝 <strong>{Project.lastEventAction}</strong>
          {Project.lastEventUser && <> by <strong>{Project.lastEventUser}</strong></>}
          {Project.lastEventTimestamp && (
            <> — {new Date(Project.lastEventTimestamp).toLocaleString("en-IN", {
              day: "2-digit", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit"
            })}</>
          )}
        </div>
      )}

      {/* Test Buttons — tick marks driven by DB-backed Project.submittedForms */}
      {(() => {
        // submittedForms comes from MongoDB Map, serialised as a plain object
        const submittedForms = Project.submittedForms || {};
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {TESTING_BUTTONS.map((btn) => {
              const isSubmitted = submittedForms[btn.formName] === true;
              return (
                <button
                  key={btn.label}
                  onClick={() => {
                    setActiveTestingButton(btn.label);
                    setActiveTestingProject(Project);
                  }}
                  style={{
                    background: isSubmitted
                      ? "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)"
                      : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    border: isSubmitted ? "2px solid #93c5fd" : "2px solid transparent",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textAlign: "center",
                    minWidth: "120px",
                    lineHeight: "1.3",
                    boxShadow: isSubmitted
                      ? "0 2px 8px rgba(37,99,235,0.4)"
                      : "0 2px 6px rgba(59,130,246,0.3)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {isSubmitted && (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                      fontSize: "10px",
                      fontWeight: "900",
                      flexShrink: 0,
                    }}>✓</span>
                  )}
                  {btn.label}
                </button>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
  // ───────────────────────────────────────────────────────────────────────────

  const handleStageSubmit = async (Project) => {
    if (Project.status === "rejected" && Project.rejectionReason) {
      showNotification(
        `Form got rejected due to  ${Project.rejectionReason}. Please resubmit the forms.`,
        "warning"
      );
    }

    const nextStage = Project.stage;
    const canSubmit = nextStage === 1 || Project.stageApprovals[nextStage - 1];
    setProjectName(Project.name);
    setCompanyName(Project.companyName);

    if (canSubmit && !Project.submittedStages[nextStage]) {
      setFormStageProject(Project);
      setFormStageStage(nextStage);
      setShowFormStage(true);
    } else if (Project.submittedStages[nextStage]) {
      showNotification(
        `Stage ${nextStage} forms already submitted!`,
        "warning"
      );
    } else {
      showNotification(
        `Stage ${nextStage - 1} must be approved first!`,
        "warning"
      );
    }
  };

  const handleProjectDelete = async (Project) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete project "${Project.name}" from company "${Project.companyName}"?`
    );

    if (!confirmDelete) {
      // User clicked "Cancel"
      return;
    }

    try {
      if (additionalLogging) {
        console.log(
          "Frontend : From handleDeleteProject delete call to api/company/deleteProject"
        );
      }

      // Map each department to its deleteProject API route
      const deleteProjectApiMap = {
        "Auto Transformer":                       "/api/autocompany/deleteProject",
        "Traction Transformer":                   "/api/tractioncompany/deleteProject",
        "V Connected 63 MVA Transformer":         "/api/vconnectcompany/deleteProject",
        "Testing Auto Transformer":               "/api/test_autocompany/deleteProject",
        "Testing Traction Transformer":           "/api/test_tractioncompany/deleteProject",
        "Testing V Connected 63 MVA Transformer": "/api/test_vconnectcompany/deleteProject",
      };
      const deleteProjectRoute = deleteProjectApiMap[selectedDepartment?.name] || "/api/autocompany/deleteProject";

      const authToken = localStorage.getItem('authToken');

      const response = await axios.delete(
        `${BACKEND_API_BASE_URL}${deleteProjectRoute}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          data: {
            projectName: Project.name,
            companyName: Project.companyName,
            department: selectedDepartment.name,
          },
        }
      );

      console.log("Project deleted successfully from backend:", response.data);

      selectedMainCompany.companyProjects = (
        selectedMainCompany.companyProjects ?? []
      ).filter(
        (proj) =>
          !(
            proj.companyName === Project.companyName &&
            proj.name === Project.name
          )
      );

      // ✅ Update frontend state by filtering out the deleted project
      setCompanies((prev) =>
        prev.map((company) =>
          company.companyName === Project.companyName
            ? {
                ...company,
                companyProjects: (company.companyProjects ?? []).filter(
                  (proj) =>
                    !(
                      proj.companyName === Project.companyName &&
                      proj.name === Project.name
                    )
                ),
              }
            : company
        )
      );

      showNotification(
        `Project "${Project.name}" deleted successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error deleting project on the backend:", error);

      // Check if the error is due to unauthorized access (401 or 403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        showNotification(
          "Please contact to ETC admin to delete the Project",
          "error"
        );
        return;
      }

      showNotification("Failed to delete project. Please try again.", "error");
    }
  };

  const handleEditProjectName = (project) => {
    setEditingProject(project);
    setNewProjectName(project.name);
    setShowEditProjectNameModal(true);
  };

  const confirmEditProjectName = async () => {
    if (!newProjectName.trim()) {
      showNotification("Project name cannot be empty", "error");
      return;
    }

    if (newProjectName.trim() === editingProject.name) {
      showNotification("Please enter a different name", "warning");
      setShowEditProjectNameModal(false);
      return;
    }

    try {
      const editProjectNameApiMap = {
        "Auto Transformer":                       "/api/autocompany/editProjectName",
        "Traction Transformer":                   "/api/tractioncompany/editProjectName",
        "V Connected 63 MVA Transformer":         "/api/vconnectcompany/editProjectName",
        "Testing Auto Transformer":               "/api/test_autocompany/editProjectName",
        "Testing Traction Transformer":           "/api/test_tractioncompany/editProjectName",
        "Testing V Connected 63 MVA Transformer": "/api/test_vconnectcompany/editProjectName",
      };
      const editProjectNameRoute = editProjectNameApiMap[selectedDepartment?.name] || "/api/autocompany/editProjectName";

      const authToken = localStorage.getItem('authToken');

      const response = await axios.put(
        `${BACKEND_API_BASE_URL}${editProjectNameRoute}`,
        {
          companyName: editingProject.companyName,
          oldProjectName: editingProject.name,
          newProjectName: newProjectName.trim(),
          userName: user?.name || "",
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update frontend state
      setSelectedMainCompany((prevCompany) => ({
        ...prevCompany,
        companyProjects: prevCompany.companyProjects.map((proj) =>
          proj.name === editingProject.name
            ? { ...proj, name: newProjectName.trim() }
            : proj
        ),
      }));

      showNotification(
        `Project name updated successfully from "${editingProject.name}" to "${newProjectName.trim()}"!`,
        "success"
      );
      setShowEditProjectNameModal(false);
      setEditingProject(null);
      setNewProjectName("");
    } catch (error) {
      console.error("Error editing project name:", error);
      
      if (error.response?.status === 400) {
        showNotification(
          error.response.data.message || "Project name already exists in this company",
          "error"
        );
      } else if (error.response?.status === 404) {
        showNotification("Company or project not found", "error");
      } else {
        showNotification("Failed to update project name. Please try again.", "error");
      }
    }
  };

  const handleEditCompanyName = (company) => {
    setEditingCompany(company);
    setNewCompanyName(company.companyName);
    setShowEditNameModal(true);
  };

  const confirmEditCompanyName = async () => {
    if (!newCompanyName.trim()) {
      showNotification("Company name cannot be empty", "error");
      return;
    }

    if (newCompanyName.trim() === editingCompany.companyName) {
      showNotification("Please enter a different name", "warning");
      setShowEditNameModal(false);
      return;
    }

    try {
      const editCompanyNameApiMap = {
        "Auto Transformer":                       "/api/autocompany/editCompanyName",
        "Traction Transformer":                   "/api/tractioncompany/editCompanyName",
        "V Connected 63 MVA Transformer":         "/api/vconnectcompany/editCompanyName",
        "Testing Auto Transformer":               "/api/test_autocompany/editCompanyName",
        "Testing Traction Transformer":           "/api/test_tractioncompany/editCompanyName",
        "Testing V Connected 63 MVA Transformer": "/api/test_vconnectcompany/editCompanyName",
      };
      const editCompanyNameRoute = editCompanyNameApiMap[selectedDepartment?.name] || "/api/autocompany/editCompanyName";

      const response = await axios.put(
        `${BACKEND_API_BASE_URL}${editCompanyNameRoute}`,
        {
          oldCompanyName: editingCompany.companyName,
          newCompanyName: newCompanyName.trim(),
        }
      );

      // Update frontend state
      setCompanys((prev) =>
        prev.map((c) =>
          c.companyName === editingCompany.companyName
            ? { ...c, companyName: newCompanyName.trim() }
            : c
        )
      );

      showNotification(
        `Company name updated successfully from "${editingCompany.companyName}" to "${newCompanyName.trim()}"!`,
        "success"
      );
      setShowEditNameModal(false);
      setEditingCompany(null);
      setNewCompanyName("");
    } catch (error) {
      console.error("Error editing company name:", error);
      
      if (error.response?.status === 400) {
        showNotification(
          error.response.data.message || "Company name already exists",
          "error"
        );
      } else if (error.response?.status === 404) {
        showNotification("Company not found", "error");
      } else {
        showNotification("Failed to update company name. Please try again.", "error");
      }
    }
  };

  const handleCompanyDelete = async (company) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete company "${company.companyName}" and all its projects?`
    );

    if (!confirmDelete) return;

    try {
      if (additionalLogging) {
        console.log(
          "Frontend : From handleDeleteProject delete call to api/company/deleteProject"
        );
      }

      const deleteCompanyApiMap = {
        "Auto Transformer":                       "/api/autocompany/deleteCompany",
        "Traction Transformer":                   "/api/tractioncompany/deleteCompany",
        "V Connected 63 MVA Transformer":         "/api/vconnectcompany/deleteCompany",
        "Testing Auto Transformer":               "/api/test_autocompany/deleteCompany",
        "Testing Traction Transformer":           "/api/test_tractioncompany/deleteCompany",
        "Testing V Connected 63 MVA Transformer": "/api/test_vconnectcompany/deleteCompany",
      };
      const deleteCompanyRoute = deleteCompanyApiMap[selectedDepartment?.name] || "/api/autocompany/deleteCompany";

      const authToken = localStorage.getItem('authToken');

      const response = await axios.delete(
        `${BACKEND_API_BASE_URL}${deleteCompanyRoute}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          data: {
            companyName: company.companyName,
            department: selectedDepartment.name,
          },
        }
      );

      console.log("Company deleted successfully from backend:", response.data);

      // ✅ Update frontend state → remove the company
      setCompanys((prev) =>
        prev.filter((c) => c.companyName !== company.companyName)
      );

      showNotification(
        `Company "${company.companyName}" deleted successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error deleting company on the backend:", error);

      // Check if the error is due to unauthorized access (401 or 403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        showNotification(
          "Please contact to ETC admin to delete the Company",
          "error"
        );
        return;
      }

      showNotification("Failed to delete company. Please try again.", "error");
    }
  };

  const [expandedStages, setExpandedStages] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleStageExpansion = (stageKey) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageKey]: !prev[stageKey],
    }));
  };

  const handleDownloadAllForms = async () => {
    try {
      const allStageKeys = Object.keys(formDataFromDB);
      if (!allStageKeys.length) {
        showNotification("No forms data available to download", "warning");
        return;
      }

      // Show loading UI
      setIsDownloading(true);

      const downloadFormsApiMap = {
        "Auto Transformer":                       "/api/autoData/download-all-forms",
        "Traction Transformer":                   "/api/tractionData/download-all-forms",
        "V Connected 63 MVA Transformer":         "/api/vconnectData/download-all-forms",
        "Testing Auto Transformer":               "/api/test_autoData/download-all-forms",
        "Testing Traction Transformer":           "/api/test_tractionData/download-all-forms",
        "Testing V Connected 63 MVA Transformer": "/api/test_vconnectData/download-all-forms",
      };
      const downloadRoute = downloadFormsApiMap[selectedDepartment?.name] || "/api/autoData/download-all-forms";

      // Send request to backend
      const response = await axios.post(
        `${BACKEND_API_BASE_URL}${downloadRoute}`,
        {
          projectName: selectedProjectForReview?.name,
          companyName: selectedProjectForReview?.companyName,
          formData: formDataFromDB,
        },
        { responseType: "blob" } // VERY IMPORTANT for PDFs
      );

      // Download the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${selectedProjectForReview?.name || "project"}_all_stages.pdf`
      );
      document.body.appendChild(link);
      link.click();

      showNotification(
        "All forms and stages downloaded successfully as PDF!",
        "success"
      );
    } catch (error) {
      console.error("Error downloading the PDF", error);
      showNotification("Failed to download PDF. Please try again.", "error");
    } finally {
      // Hide loading UI
      setIsDownloading(false);
    }
  };

  const setDepartmentData = (department) => {
    console.log(department);
    const name = department?.name;

    // Map each department name to its API route
    const departmentApiMap = {
      "Auto Transformer":                       "/api/autocompany",
      "Traction Transformer":                   "/api/tractioncompany",
      "V Connected 63 MVA Transformer":         "/api/vconnectcompany",
      "Testing Auto Transformer":               "/api/test_autocompany",
      "Testing Traction Transformer":           "/api/test_tractioncompany",
      "Testing V Connected 63 MVA Transformer": "/api/test_vconnectcompany",
    };

    const apiRoute = departmentApiMap[name];

    if (!apiRoute) {
      console.error("Unknown department:", name);
      return;
    }

    axios
      .get(`${BACKEND_API_BASE_URL}${apiRoute}`, {
        params: { departmentType: name },
      })
      .then((response) => {
        setCompanys(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching companies for ${name}:`, error);
        alert("Failed to fetch companies. Please try again.");
      });

    setSelectedDepartment(department);
  };

  return (
    <div className="dashboard-container">
      <header className="etc-header">
        <div className="header-content">
          <div className="header-left">
            {user?.role === "main-admin" && (
              <button onClick={onBackToMain} className="back-btn">
                ← Back
              </button>
            )}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

            <img src="/logo.png" alt="Vishvas Power" className="logo" />
            <div className="header-title">
              <h1>
                {showFormStage
                  ? `Submit Forms - ${formStageProject?.name} (Stage ${formStageStage})`
                  : reviewMode
                  ? `Review Stage ${currentStageReview} - ${selectedProjectForReview?.name}`
                  : showSubmitterReview
                  ? `Submitted Forms - ${selectedProjectForReview?.name}`
                  : selectedMainCompany
                  ? `${selectedMainCompany.name} - Companies`
                  : selectedDepartment
                  ? `${selectedDepartment.name} - Companys`
                  : "ETC Admin Panel"}
              </h1>
              <p>
                {showFormStage
                  ? "Fill out and submit the required forms for this stage."
                  : reviewMode
                  ? "Review and approve/reject stage forms"
                  : showSubmitterReview
                  ? "View all submitted forms by Project"
                  : selectedMainCompany
                  ? "Manage companies and their workflows"
                  : selectedDepartment
                  ? "Manage Companys in department"
                  : "Manage departments, Companys and companies"}
              </p>
            </div>
          </div>

          <div className="header-right desktop-only">
            <span className="user-badge">
              User : {user?.name || "ETC Admin"} 
            </span>
            <span className="user-badge">
              Role : {user?.role || "etcadmin"}
            </span>
            <button onClick={handleLogoutAndClearData} className="logout-btn">
              🚪 Logout
            </button>
          </div>

          {isMobileMenuOpen && (
            <div
              className="mobile-menu-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu-header">
                  <img
                    src="/logo.png"
                    alt="Vishvas Power"
                    className="logo-small"
                  />
                  <button
                    className="mobile-menu-close"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="mobile-menu-content">
                  <div className="mobile-user-info">
                    <span className="user-badge">ETC Admin</span>
                  </div>
                  <button
                    onClick={handleLogoutAndClearData}
                    className="mobile-logout-btn"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="etc-main">
        {activeTestingButton && activeTestingProject ? (
          <TestingAutoTransformerForms
            activeButton={activeTestingButton}
            projectName={activeTestingProject.name}
            companyName={activeTestingProject.companyName}
            onFormSubmit={() => handleTestFormSubmit(activeTestingButton)}
            onBack={() => {
              setActiveTestingButton(null);
              setActiveTestingProject(null);
            }}
          />
        ) : viewMode ? (
          renderFormView()
        ) : showFormStage && formStageProject ? (
          (() => {
            if (selectedDepartment?.name === "V Connected 63 MVA Transformer") {
              console.log("Load form for : ", selectedDepartment?.name);
              return (
                <VConnected63MVATransformerForms
                  firstFormDataFromDB={formDataFromDB}
                  projectName={projectName}
                  companyName={companyName}
                  stage={formStageStage}
                  onFormSubmit={handleFormStageSubmit}
                  onBack={handleBackFromFormStage}
                  ProjectData={formStageProject}
                  setSelectedMainCompany={setSelectedMainCompany}
                  selectedProjectForReview={selectedProjectForReview}
                />
              );
            } else {
              if (selectedDepartment?.name === "Traction Transformer") {
                console.log("Load form for : ", selectedDepartment?.name);
                return (
                  <TractionTransformerForms
                    firstFormDataFromDB={formDataFromDB}
                    projectName={projectName}
                    companyName={companyName}
                    stage={formStageStage}
                    onFormSubmit={handleFormStageSubmit}
                    onBack={handleBackFromFormStage}
                    ProjectData={formStageProject}
                    setSelectedMainCompany={setSelectedMainCompany}
                    selectedProjectForReview={selectedProjectForReview}
                  />
                );
              } else if (selectedDepartment?.name === "Auto Transformer") {
                console.log("Load form for : ", selectedDepartment?.name);
                return (
                  <FormStage
                    firstFormDataFromDB={formDataFromDB}
                    projectName={projectName}
                    companyName={companyName}
                    stage={formStageStage}
                    onFormSubmit={handleFormStageSubmit}
                    onBack={handleBackFromFormStage}
                    ProjectData={formStageProject}
                    setSelectedMainCompany={setSelectedMainCompany}
                    selectedProjectForReview={selectedProjectForReview}
                  />
                );
              }
            }
          })()
        ) : reviewMode ? (
          (() => {
            if (selectedDepartment?.name === "Auto Transformer") {
              return (
                <AutoTransformerStageReviewPanel
                  currentStageReview={currentStageReview}
                  selectedProjectForReview={selectedProjectForReview}
                  currentStageForms={currentStageForms}
                  formDataFromDB={formDataFromDB}
                  getStageStatus={getStageStatus}
                  formatLabel={formatLabel}
                  handleApproveStage={handleApproveStage}
                  handleRejectStage={handleRejectStage}
                  onBackToCompanies={handleBackFromReview}
                />
              );
            } else if (selectedDepartment?.name === "Traction Transformer") {
              return (
                <TractionTransformerStageReviewPanel
                  currentStageReview={currentStageReview}
                  selectedProjectForReview={selectedProjectForReview}
                  currentStageForms={currentStageForms}
                  formDataFromDB={formDataFromDB}
                  getStageStatus={getStageStatus}
                  formatLabel={formatLabel}
                  handleApproveStage={handleApproveStage}
                  handleRejectStage={handleRejectStage}
                  onBackToCompanies={handleBackFromReview}
                />
              );
            } else if (selectedDepartment?.name === "V Connected 63 MVA Transformer") {
              return (
                <VConnected63MVATransformerStageReviewPanel
                  currentStageReview={currentStageReview}
                  selectedProjectForReview={selectedProjectForReview}
                  currentStageForms={currentStageForms}
                  formDataFromDB={formDataFromDB}
                  getStageStatus={getStageStatus}
                  formatLabel={formatLabel}
                  handleApproveStage={handleApproveStage}
                  handleRejectStage={handleRejectStage}
                  onBackToCompanies={handleBackFromReview}
                />
              );
            } else {
              // Fallback to AutoTransformerStageReviewPanel for unknown departments
              return (
                <AutoTransformerStageReviewPanel
                  currentStageReview={currentStageReview}
                  selectedProjectForReview={selectedProjectForReview}
                  currentStageForms={currentStageForms}
                  formDataFromDB={formDataFromDB}
                  getStageStatus={getStageStatus}
                  formatLabel={formatLabel}
                  handleApproveStage={handleApproveStage}
                  handleRejectStage={handleRejectStage}
                  onBackToCompanies={handleBackFromReview}
                />
              );
            }
          })()
        ) : showSubmitterReview ? (
          <>
            <div className="section-header">
              <div>
                <h2>All Submitted Forms</h2>
                <p>
                  Review all forms submitted by {selectedProjectForReview?.name}
                </p>
              </div>
              <div className="header-actions">
                <button
                  onClick={handleDownloadAllForms}
                  className="download-all-btn"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginRight: "16px",
                  }}
                >
                  📥 Download All Forms & Stages
                </button>
                <button onClick={handleBackFromReview} className="back-btn">
                  ← Back to Companies
                </button>
              </div>
            </div>

            <div className="stages-review-container">
              {Object.entries(formDataFromDB).map(([stageKey, forms]) => {
                const stageNumber = parseInt(stageKey.replace('stage', ''));
                
                return (
                  <div key={stageKey} className="stage-forms-section">
                    <div
                      className="stage-header-clickable"
                      onClick={() => toggleStageExpansion(stageKey)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 20px",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "12px",
                        marginBottom: expandedStages[stageKey] ? "20px" : "0",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "white",
                          fontSize: "1.3rem",
                          fontWeight: "700",
                        }}
                      >
                        {stageKey.replace("stage", "Stage ")} (
                        {Object.keys(forms).length} forms)
                      </h3>
                      <span
                        style={{
                          color: "white",
                          fontSize: "1.2rem",
                          transform: expandedStages[stageKey]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        ▼
                      </span>
                    </div>

                    {expandedStages[stageKey] && (
                      <div
                        className="forms-dropdown-content"
                        style={{
                          animation: "slideDown 0.3s ease-out",
                        }}
                      >
                        {(() => {
                          if (selectedDepartment?.name === "Auto Transformer") {
                            return (
                              <AutoTransformerViewFormRenderer 
                                stageNumber={stageNumber}
                                formDataFromDB={forms}
                                formatLabel={formatLabel}
                              />
                            );
                          } else if (selectedDepartment?.name === "Traction Transformer") {
                            return (
                              <TractionTransformerViewFormRenderer 
                                stageNumber={stageNumber}
                                formDataFromDB={forms}
                                formatLabel={formatLabel}
                              />
                            );
                          } else if (selectedDepartment?.name === "V Connected 63 MVA Transformer") {
                            return (
                              <VConnected63MVATransformerViewFormRenderer 
                                stageNumber={stageNumber}
                                formDataFromDB={forms}
                                formatLabel={formatLabel}
                              />
                            );
                          } else {
                            // Fallback to AutoTransformerViewFormRenderer for unknown departments
                            return (
                              <AutoTransformerViewFormRenderer 
                                stageNumber={stageNumber}
                                formDataFromDB={forms}
                                formatLabel={formatLabel}
                              />
                            );
                          }
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : !selectedDepartment ? (
          <>
            <div className="section-header">
              <div>
                <h2>Transformer Categories</h2>
                <p>Select a category to manage Companys and companies</p>
              </div>
            </div>

            <div className="departments-grid">
              {departments.map((department) => {
                const departmentCompanys = getDepartmentCompanys(department.id);
                return (
                  <div
                    key={department.id}
                    className="department-card"
                    onClick={() => setDepartmentData(department)}
                  >
                    <div className="department-header">
                      <div
                        className="department-icon"
                        style={{ backgroundColor: department.color }}
                      >
                        {department.icon}
                      </div>
                      <span className="status-badge status-progress">
                        Active
                      </span>
                    </div>
                    <h3>{department.name}</h3>
                    <p>{department.description}</p>
                  </div>
                );
              })}
            </div>
          </>
        ) : !selectedMainCompany ? (
          <>
            <div className="section-header">
              <div>
                <h2>Companys in {selectedDepartment.name}</h2>
                <p>Create and manage Companys for this category</p>
              </div>
              <div className="section-actions">
                <button
                  onClick={() => setShowCreateCompanyForm(true)}
                  className="create-btn"
                >
                  ➕ Create Company
                </button>
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="back-btn"
                >
                  ← Back to Categories
                </button>
              </div>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search Companys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {showCreateCompanyForm && (
              <div
                className="modal-overlay"
                onClick={() => setShowCreateCompanyForm(false)}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <img
                      src="/logo.png"
                      alt="Vishvas Power"
                      className="logo-small"
                    />
                    <h3>Create New Company in {selectedDepartment.name}</h3>
                  </div>
                  <p>Companies will be added to this Company after creation</p>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      placeholder="Enter Company name"
                      value={newCompany.companyName}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter Company description"
                      value={newCompany.companyDescription}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      onClick={handleCreateCompany}
                      className="submit-btn"
                      disabled={!newCompany.name || !newCompany.description}
                    >
                      Create Company
                    </button>
                    <button
                      onClick={() => setShowCreateCompanyForm(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="Companys-grid">
              {Companys.map((Company) => {
                const CompanyCompanies = getCompanyCompanies(Company.id);

                return (
                  <div key={Company._id} className="Company-card">
                    <div className="Company-header">
                      <div
                        className="Company-icon"
                        style={{ backgroundColor: selectedDepartment.color }}
                      >
                        📁
                      </div>
                      <span
                        className={`status-badge ${getStatusColor(
                          Company.status
                        )}`}
                      >
                        {Company.status}
                      </span>
                    </div>
                    <h3>{Company.companyName}</h3>
                    <p>{Company.companyDescription}</p>
                    <div className="Company-footer">
                      <span>
                        🏢 {Company?.companyProjects?.length} companies
                      </span>
                      <span>📅 {Company.createdAt
                        ? new Date(Company.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                          })
                        : "N/A"
                      }</span>
                    </div>
                    <div
                      className="Company-actions"
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        gap: "10px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCompanyName(Company);
                        }}
                        className="edit-btn"
                        style={{
                          background:
                            "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        ✏️ Edit Name
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompanyDelete(Company);
                        }}
                        className="delete-btn"
                        style={{
                          background:
                            "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", // red gradient
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        🗑️ Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMainCompany(Company);
                        }}
                        className="view-btn"
                        style={{
                          background:
                            "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        🗃️ View Companies
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="section-header">
              <div>
                <h2>Companies in {selectedMainCompany.companyName}</h2>
                <p>Manage companies and their workflows</p>
              </div>
              <div className="section-actions">
                <button
                  onClick={() =>
                    handleAddProject(selectedMainCompany.companyName)
                  }
                  className="create-btn"
                >
                  ➕ Create Project
                </button>
                <button
                  onClick={() => setSelectedMainCompany(null)}
                  className="back-btn"
                >
                  ← Back to Companys
                </button>
              </div>
            </div>

            <div className="companies-grid">
              {selectedMainCompany.companyProjects === undefined ||
              selectedMainCompany.companyProjects.length === 0 ? (
                <p className="no-data-message">
                  No companies found for this Company. Click "Create Company" to
                  create one.
                </p>
              ) : (
                selectedMainCompany.companyProjects.map((Project, index) =>
                  selectedDepartment?.name?.startsWith("Testing ")
                    ? renderTestingProjectCard(Project, index)
                    : (
                  <div key={index} className="Project-card">
                    <div className="Project-header">
                      <div
                        className="Project-icon"
                        style={{ backgroundColor: "#1E3A8A" }}
                      >
                        🏢
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                        <span
                          className={`status-badge ${getStatusColor(
                            Project.status
                          )}`}
                        >
                          {Project.status === "pending-approval" && "⏳"}
                          {Project.status === "in-progress" && "🔄"}
                          {Project.status === "completed" && "✅"}
                          {Project.status}
                        </span>
                        {Project.lastSubmittedUser && (
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "2px",
                          }}>
                            <span style={{
                              fontSize: "0.72rem",
                              color: "#6b7280",
                              fontWeight: "500",
                              whiteSpace: "nowrap",
                            }}>
                              👤 Last Submitted: <strong style={{ color: "#1e3a8a" }}>{Project.lastSubmittedUser}</strong>
                            </span>
                            {Project.lastSubmittedTimestamp && (
                              <span style={{
                                fontSize: "0.68rem",
                                color: "#9ca3af",
                                whiteSpace: "nowrap",
                              }}>
                                🕐 {new Date(Project.lastSubmittedTimestamp).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        )}
                        {Project.lastApprovedUser && (
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "2px",
                            marginTop: "4px",
                          }}>
                            <span style={{
                              fontSize: "0.72rem",
                              color: "#6b7280",
                              fontWeight: "500",
                              whiteSpace: "nowrap",
                            }}>
                              ✅ Last Approved: <strong style={{ color: "#059669" }}>{Project.lastApprovedUser}</strong>
                            </span>
                            {Project.lastApprovedTimestamp && (
                              <span style={{
                                fontSize: "0.68rem",
                                color: "#9ca3af",
                                whiteSpace: "nowrap",
                              }}>
                                🕐 {new Date(Project.lastApprovedTimestamp).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <h3>{Project.name}</h3>
                    <p>
                      Stage {Project.stage} • {Project.formsCompleted}/
                      {totalStageForm[Project.stage - 1]} forms completed
                    </p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            (Project.formsCompleted / Project.totalForms) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="Project-footer">
                      <span>
                        📊{" "}
                        {Math.round(
                          (Project.formsCompleted / Project.totalForms) * 100
                        )}
                        % complete
                      </span>
                      <span>📅 {Project.lastActivity
                        ? new Date(Project.lastActivity).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                          })
                        : "N/A"
                      }</span>
                    </div>

                    {Project.lastEventAction && (
                      <div style={{
                        marginTop: "8px",
                        padding: "6px 10px",
                        background: "#f0f9ff",
                        borderLeft: "3px solid #3b82f6",
                        borderRadius: "4px",
                        fontSize: "0.78rem",
                        color: "#374151",
                        lineHeight: "1.4",
                      }}>
                        📝 <strong>{Project.lastEventAction}</strong>
                        {Project.lastEventUser && <> by <strong>{Project.lastEventUser}</strong></>}
                        {Project.lastEventTimestamp && (
                          <> — {new Date(Project.lastEventTimestamp).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}</>
                        )}
                      </div>
                    )}

                    <div className="stage-management">
                      <h4>Stage Management:</h4>
                      <div className="stages-row">
                        {(["V Connected 63 MVA Transformer", "Traction Transformer"].includes(selectedDepartment?.name)
                          ? [1, 2, 3, 4, 5, 6, 7]
                          : [1, 2, 3, 4, 5, 6]
                        ).map((stage) => {
                          const stageStatus = getStageStatus(Project, stage);
                          return (
                            <div
                              key={stage}
                              className={`stage-item ${stageStatus}`}
                            >
                              <div className="stage-number">{stage}</div>
                              <div className="stage-status-text">
                                {stageStatus === "approved" && "✅ Approved"}
                                {stageStatus === "pending-review" &&
                                  "⏳ Pending"}
                                {stageStatus === "available" && "📝 Available"}
                                {stageStatus === "locked" && "🔒 Locked"}
                              </div>
                              {stageStatus === "pending-review" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReviewStage(Project, stage);
                                  }}
                                  className="review-stage-btn"
                                >
                                  Review
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className="Project-actions"
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Edit Name */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProjectName(Project);
                        }}
                        className="edit-project-btn"
                        style={{
                          background:
                            "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        ✏️ Edit Name
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectDelete(Project);
                        }}
                        className="delete-btn"
                        style={{
                          background:
                            "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", // red gradient
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        🗑️ Delete Project
                      </button>

                      {/* View Forms */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSubmittedForms(Project);
                        }}
                        className="view-forms-btn"
                        style={{
                          background:
                            "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        📋 View Forms
                      </button>

                      {/* Submit Stage */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStageSubmit(Project);
                        }}
                        className="submit-test-btn"
                        style={{
                          background:
                            "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        📝 Submit Stage {Project.stage}
                      </button>

                      
                    </div>
                    </div>
                  ))
                )}
            </div>
          </>
        )}

        <div className="dashboard-footer">
          <div className="footer-logo">
            <img src="/logo.png" alt="Vishvas Power" className="logo" />
            <p>Powered by Vishvas Power</p>
          </div>
        </div>
      </main>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowNotificationModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {notificationType === "success" && (
                  <span style={{ fontSize: "1.5rem" }}>✅</span>
                )}
                {notificationType === "error" && (
                  <span style={{ fontSize: "1.5rem" }}>❌</span>
                )}
                {notificationType === "warning" && (
                  <span style={{ fontSize: "1.5rem" }}>⚠️</span>
                )}
                {notificationType === "info" && (
                  <span style={{ fontSize: "1.5rem" }}>ℹ️</span>
                )}
                <h3>
                  {notificationType === "success" && "Success"}
                  {notificationType === "error" && "Error"}
                  {notificationType === "warning" && "Warning"}
                  {notificationType === "info" && "Information"}
                </h3>
              </div>
            </div>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.6",
                margin: "20px 0",
              }}
            >
              {notificationMessage}
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="submit-btn"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowConfirmModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.5rem" }}>❓</span>
                <h3>Confirmation</h3>
              </div>
            </div>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.6",
                margin: "20px 0",
              }}
            >
              {confirmMessage}
            </p>
            <div className="modal-actions">
              <button
                onClick={() => {
                  if (confirmAction) confirmAction();
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                className="submit-btn"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                className="cancel-btn"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Modal */}
      {showInputModal && (
        <div className="modal-overlay" onClick={() => setShowInputModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.5rem" }}>✏️</span>
                <h3>{inputModalTitle}</h3>
              </div>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder={inputModalPlaceholder}
                value={inputModalValue}
                onChange={(e) => setInputModalValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && inputModalValue.trim()) {
                    if (inputModalAction)
                      inputModalAction(inputModalValue.trim());
                    setShowInputModal(false);
                    setInputModalAction(null);
                    setInputModalValue("");
                  }
                }}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => {
                  if (inputModalValue.trim() && inputModalAction) {
                    inputModalAction(inputModalValue.trim());
                  }
                  setShowInputModal(false);
                  setInputModalAction(null);
                  setInputModalValue("");
                }}
                className="submit-btn"
                disabled={!inputModalValue.trim()}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowInputModal(false);
                  setInputModalAction(null);
                  setInputModalValue("");
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRejectionModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.5rem" }}>❌</span>
                <h3>Reject Stage {rejectionStage.stage}</h3>
              </div>
            </div>
            <p
              style={{ fontSize: "1rem", color: "#666", marginBottom: "20px" }}
            >
              Please provide a detailed reason for rejecting this stage. This
              will help the submitter understand what needs to be corrected.
            </p>
            <div className="form-group">
              <label>Rejection Reason *</label>
              <textarea
                placeholder="Enter detailed reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                style={{ minHeight: "120px" }}
                required
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={confirmRejectStage}
                className="reject-stage-btn"
                disabled={!rejectionReason.trim()}
                style={{
                  background: rejectionReason.trim()
                    ? "linear-gradient(135deg, #f44336, #d32f2f)"
                    : "#ccc",
                  cursor: rejectionReason.trim() ? "pointer" : "not-allowed",
                }}
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionStage(null);
                  setRejectionReason("");
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Modal for PDF Download */}
      {isDownloading && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #4299e1",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                <h3 style={{ margin: 0, color: "#374151" }}>Generating PDF...</h3>
              </div>
            </div>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ fontSize: "1.1rem", color: "#6b7280", margin: "10px 0" }}>
                Please wait while we generate your PDF document.
              </p>
              <p style={{ fontSize: "0.9rem", color: "#9ca3af", margin: "5px 0" }}>
                This may take a few moments depending on the number of forms and images.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Name Modal */}
      {showEditProjectNameModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowEditProjectNameModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.5rem" }}>✏️</span>
                <h3>Edit Project Name</h3>
              </div>
            </div>
            <p style={{ fontSize: "1rem", color: "#666", marginBottom: "20px" }}>
              Current name: <strong>{editingProject?.name}</strong>
            </p>
            <div className="form-group">
              <label>New Project Name *</label>
              <input
                type="text"
                placeholder="Enter new project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newProjectName.trim()) {
                    confirmEditProjectName();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={confirmEditProjectName}
                className="submit-btn"
                disabled={!newProjectName.trim()}
                style={{
                  background: newProjectName.trim()
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "#ccc",
                  cursor: newProjectName.trim() ? "pointer" : "not-allowed",
                }}
              >
                Update Name
              </button>
              <button
                onClick={() => {
                  setShowEditProjectNameModal(false);
                  setEditingProject(null);
                  setNewProjectName("");
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Company Name Modal */}
      {showEditNameModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowEditNameModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.5rem" }}>✏️</span>
                <h3>Edit Company Name</h3>
              </div>
            </div>
            <p style={{ fontSize: "1rem", color: "#666", marginBottom: "20px" }}>
              Current name: <strong>{editingCompany?.companyName}</strong>
            </p>
            <div className="form-group">
              <label>New Company Name *</label>
              <input
                type="text"
                placeholder="Enter new company name..."
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newCompanyName.trim()) {
                    confirmEditCompanyName();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={confirmEditCompanyName}
                className="submit-btn"
                disabled={!newCompanyName.trim()}
                style={{
                  background: newCompanyName.trim()
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "#ccc",
                  cursor: newCompanyName.trim() ? "pointer" : "not-allowed",
                }}
              >
                Update Name
              </button>
              <button
                onClick={() => {
                  setShowEditNameModal(false);
                  setEditingCompany(null);
                  setNewCompanyName("");
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal — Testing departments (Project Name + Job Rating) */}
      {showCreateProjectModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateProjectModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>✏️</span>
                <h3>Create New Project</h3>
              </div>
            </div>

            {/* Project Name */}
            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
                Project Name *
              </label>
              <input
                type="text"
                placeholder="Enter Project name..."
                value={createProjectName}
                onChange={(e) => setCreateProjectName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && createProjectName.trim()) {
                    handleCreateProjectModalSubmit();
                  }
                }}
                autoFocus
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            {/* Job Rating Dropdown */}
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
                Job Rating (MVA) *
              </label>
              <select
                value={createProjectJobRating}
                onChange={(e) => setCreateProjectJobRating(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  outline: "none",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  boxSizing: "border-box",
                }}
              >
                <option value="8">8 MVA</option>
                <option value="12.3">12.3 MVA</option>
                <option value="16.5">16.5 MVA</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                onClick={handleCreateProjectModalSubmit}
                className="submit-btn"
                disabled={!createProjectName.trim()}
                style={{
                  background: createProjectName.trim()
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "#ccc",
                  cursor: createProjectName.trim() ? "pointer" : "not-allowed",
                }}
              >
                Submit
              </button>
              <button
                onClick={() => setShowCreateProjectModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ETCAdminPanel;
