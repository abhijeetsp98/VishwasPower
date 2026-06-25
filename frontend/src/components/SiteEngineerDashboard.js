"use client"

import { useState, useEffect } from "react"
import FormStage from "./FormStage" // Import FormStage for form submission

const SiteEngineerDashboard = ({ user, selectedProject, onLogout, onProjectSelect, onCompanySelect }) => {
  const [projects, setProjects] = useState([])
  const [companies, setCompanies] = useState([])
  const [submittedForms, setSubmittedForms] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [selectedMainProject, setSelectedMainProject] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)

  // State for showing and managing FormStage
  const [showFormStage, setShowFormStage] = useState(false)
  const [formStageCompany, setFormStageCompany] = useState(null)
  const [formStageStage, setFormStageStage] = useState(1)

  useEffect(() => {
    console.log("SiteEngineerDashboard: Loading data...")

    // Initialize departments
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
        description: "V Connected 63 MVA transformer department for high voltage systems",
        icon: "🔌",
        color: "#047857",
      },
    ]
    setDepartments(defaultDepartments)

    // Load data from localStorage - Updated to use new structure
    const savedProjects = JSON.parse(localStorage.getItem("etc_projects") || "[]")
    const savedCompanies = JSON.parse(localStorage.getItem("etc_companies") || "[]")
    const savedSubmittedForms = JSON.parse(localStorage.getItem("etc_submitted_forms") || "[]")

    console.log("Site Engineer loaded data:", {
      projects: savedProjects.length,
      companies: savedCompanies.length,
      submittedForms: savedSubmittedForms.length,
    })

    setProjects(savedProjects)
    setCompanies(savedCompanies)
    setSubmittedForms(savedSubmittedForms)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("etc_companies", JSON.stringify(companies))
  }, [companies])

  useEffect(() => {
    localStorage.setItem("etc_submitted_forms", JSON.stringify(submittedForms))
  }, [submittedForms])

  const getDepartmentProjects = (departmentId) => {
    return projects.filter((project) => project.departmentId === departmentId)
  }

  const getProjectCompanies = (projectId) => {
    return companies.filter((company) => company.projectId === projectId)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed"
      case "in-progress":
        return "status-progress"
      case "pending-approval":
        return "status-pending"
      default:
        return "status-default"
    }
  }

  const canSubmitForms = (company) => {
    const currentStage = company.stage
    // Can submit if stage 1 or previous stage is approved and current stage not submitted
    return (currentStage === 1 || company.stageApprovals[currentStage - 1]) && !company.submittedStages[currentStage]
  }

  // Helper function to get form count for each stage
  const getStageFormCount = (stage) => {
    const stageForms = {
      1: 5, // Stage 1 has 5 forms
      2: 1, // Stage 2 has 1 form
      3: 7, // Stage 3 has 7 forms
      4: 6, // Stage 4 has 6 forms
      5: 1, // Stage 5 has 1 form
      6: 1, // Stage 6 has 1 form
    }
    return stageForms[stage] || 1
  }

  // Function to handle form submission from FormStage
  const handleFormStageSubmit = (stage, submittedData) => {
    console.log(`Site Engineer submitting forms for stage ${stage}:`, submittedData)

    const newFormEntry = {
      id: Math.max(...submittedForms.map((f) => f.id), 0) + 1,
      companyId: formStageCompany.id,
      stage: stage,
      formName: `Stage ${stage} Forms`,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "pending-review",
      data: submittedData,
    }

    setSubmittedForms((prev) => [...prev, newFormEntry])

    // Update company to show forms submitted and pending approval
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === formStageCompany.id
          ? {
              ...company,
              status: "pending-approval",
              submittedStages: { ...company.submittedStages, [stage]: true },
              formsCompleted: getStageFormCount(stage),
              lastActivity: new Date().toISOString().split("T")[0],
            }
          : company,
      ),
    )

    alert(`Forms for Stage ${stage} submitted successfully! Waiting for ETC Admin approval.`)
    setShowFormStage(false)
    setFormStageCompany(null)
    setFormStageStage(1)
  }

  // Function to go back from FormStage
  const handleBackFromFormStage = () => {
    setShowFormStage(false)
    setFormStageCompany(null)
    setFormStageStage(1)
  }

  const handleCompanySelect = (company) => {
    const nextStage = company.stage
    const canSubmit = nextStage === 1 || company.stageApprovals[nextStage - 1]

    if (canSubmit && !company.submittedStages[nextStage]) {
      setFormStageCompany(company)
      setFormStageStage(nextStage)
      setShowFormStage(true)
    } else if (company.submittedStages[nextStage]) {
      alert(`Stage ${nextStage} forms already submitted for ${company.name}!`)
    } else {
      alert(`Stage ${nextStage - 1} must be approved first for ${company.name}!`)
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            {showFormStage && (
              <button onClick={handleBackFromFormStage} className="back-btn">
                ← Back to Companies
              </button>
            )}
            {selectedMainProject && !showFormStage && (
              <button onClick={() => setSelectedMainProject(null)} className="back-btn">
                ← Back to Projects
              </button>
            )}
            {selectedDepartment && !selectedMainProject && !showFormStage && (
              <button onClick={() => setSelectedDepartment(null)} className="back-btn">
                ← Back to Departments
              </button>
            )}
            <div className="logo">⚡</div>
            <div className="header-title">
              <h1>
                {showFormStage
                  ? `Submit Forms - ${formStageCompany?.name} (Stage ${formStageStage})`
                  : selectedMainProject
                    ? `${selectedMainProject.name} - Companies`
                    : selectedDepartment
                      ? `${selectedDepartment.name} - Projects`
                      : "Site Engineer Dashboard"}
              </h1>
              <p>
                {showFormStage
                  ? "Fill out and submit the required forms for this stage."
                  : selectedMainProject
                    ? "Select a company to work on forms"
                    : selectedDepartment
                      ? "Select a project to view companies"
                      : "Select a department to view projects"}
              </p>
            </div>
          </div>
          <div className="header-right">
            <span className="user-badge">Site Engineer</span>
            <button onClick={onLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {showFormStage && formStageCompany ? (
          <FormStage
            stage={formStageStage}
            onFormSubmit={handleFormStageSubmit}
            onBack={handleBackFromFormStage}
            companyData={formStageCompany}
          />
        ) : !selectedDepartment ? (
          // Department Selection
          <>
            <div className="section-header">
              <h2>Transformer Departments</h2>
              <p>Select a department to view available projects</p>
            </div>

            <div className="departments-grid">
              {departments.map((department) => {
                const departmentProjects = getDepartmentProjects(department.id)
                const totalCompanies = departmentProjects.reduce((acc, proj) => {
                  return acc + getProjectCompanies(proj.id).length
                }, 0)

                return (
                  <div
                    key={department.id}
                    className="department-card"
                    onClick={() => setSelectedDepartment(department)}
                  >
                    <div className="department-header">
                      <div className="department-icon" style={{ backgroundColor: department.color }}>
                        {department.icon}
                      </div>
                      <span className="status-badge status-completed">Active</span>
                    </div>
                    <h3>{department.name}</h3>
                    <p>{department.description}</p>
                    <div className="department-footer">
                      <span>📁 {departmentProjects.length} projects</span>
                      <span>🏢 {totalCompanies} companies</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : !selectedMainProject ? (
          // Projects View
          <>
            <div className="section-header">
              <div>
                <h2>Projects in {selectedDepartment.name}</h2>
                <p>Select a project to view companies</p>
              </div>
            </div>

            <div className="projects-grid">
              {getDepartmentProjects(selectedDepartment.id).map((project) => {
                const projectCompanies = getProjectCompanies(project.id)

                return (
                  <div key={project.id} className="project-card" onClick={() => setSelectedMainProject(project)}>
                    <div className="project-header">
                      <div className="project-icon" style={{ backgroundColor: selectedDepartment.color }}>
                        📁
                      </div>
                      <span className={`status-badge ${getStatusClass(project.status)}`}>{project.status}</span>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="project-footer">
                      <span>🏢 {projectCompanies.length} companies</span>
                      <span>📅 {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                          })
                        : "N/A"
                      }</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          // Companies View - Updated to work with new structure
          <>
            <div className="section-header">
              <h2>Companies in {selectedMainProject.name}</h2>
              <p>Select a company to work on their forms</p>
            </div>

            <div className="companies-grid">
              {getProjectCompanies(selectedMainProject.id).length === 0 ? (
                <div className="no-data-message">
                  <h3>No Companies Available</h3>
                  <p>
                    No companies have been added to this project yet. Please contact the ETC Admin to add companies.
                  </p>
                </div>
              ) : (
                getProjectCompanies(selectedMainProject.id).map((company) => (
                  <div key={company.id} className="company-card">
                    <div className="company-header">
                      <div className="company-icon">🏢</div>
                      <span className={`status-badge ${getStatusClass(company.status)}`}>
                        {company.status === "pending-approval" && "⏳"}
                        {company.status === "in-progress" && "🔄"}
                        {company.status === "completed" && "✅"}
                        {company.status}
                      </span>
                    </div>
                    <h3>{company.name}</h3>
                    <p>
                      Stage {company.stage} • {company.formsCompleted}/{company.totalForms} forms completed
                    </p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${(company.formsCompleted / company.totalForms) * 100}%` }}
                      />
                    </div>
                    <div className="company-footer">
                      <span>📊 {Math.round((company.formsCompleted / company.totalForms) * 100)}% complete</span>
                      <span>📅 {company.lastActivity
                        ? new Date(company.lastActivity).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                          })
                        : "N/A"
                      }</span>
                    </div>

                    <div className="company-actions" style={{ marginTop: "15px", textAlign: "center" }}>
                      {canSubmitForms(company) ? (
                        <button
                          onClick={() => handleCompanySelect(company)}
                          className="submit-btn"
                          style={{
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          📝 Submit Stage {company.stage} Forms
                        </button>
                      ) : company.submittedStages[company.stage] ? (
                        <div className="status-info">
                          <p style={{ color: "#f59e0b", fontWeight: "600", margin: 0 }}>
                            ⏳ Stage {company.stage} forms submitted
                          </p>
                          <p style={{ color: "#6b7280", fontSize: "0.8rem", margin: "5px 0 0 0" }}>
                            Waiting for ETC Admin approval
                          </p>
                        </div>
                      ) : (
                        <div className="status-info">
                          <p style={{ color: "#ef4444", fontWeight: "600", margin: 0 }}>
                            🔒 Stage {company.stage} locked
                          </p>
                          <p style={{ color: "#6b7280", fontSize: "0.8rem", margin: "5px 0 0 0" }}>
                            Previous stage must be approved first
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default SiteEngineerDashboard
