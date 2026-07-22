"use client"

import { useState, useEffect } from "react"
import "./App.css"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import MainAdminDashboard from "./components/MainAdminDashboard"
import ETCAdminPanel from "./components/ETCAdminPanel"
import CompanyWorkflow from "./components/CompanyWorkflow"
import { getUserInfo, logout, isAuthenticated, initAuth, cleanupOldData } from "./utils/auth"

const App = () => {
  const [currentView, setCurrentView] = useState("login")
  const [user, setUser] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)

  // Load data from secure storage on component mount
  useEffect(() => {
    // Initialize auth and cleanup old data
    initAuth()
    
    if (isAuthenticated()) {
      const userInfo = getUserInfo()
      setUser(userInfo)
      console.log("User already authenticated:", userInfo)
      
      // Set appropriate view based on user role
      if (userInfo.role === "admin") {
        setCurrentView("main-dashboard")
      } else if (userInfo.role === "etcadmin") {
        setCurrentView("etc-panel")
      } else {
        setCurrentView("etc-panel")
      }
    }

    // Load project and company data (these are not sensitive)
    const savedProject = localStorage.getItem("selectedProject")
    const savedCompany = localStorage.getItem("selectedCompany")
    
    if (savedProject) {
      setSelectedProject(JSON.parse(savedProject))
    }
    if (savedCompany) {
      setSelectedCompany(JSON.parse(savedCompany))
    }
  }, [])

  // Save non-sensitive data to localStorage
  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem("selectedProject", JSON.stringify(selectedProject))
    }
  }, [selectedProject])

  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem("selectedCompany", JSON.stringify(selectedCompany))
    }
  }, [selectedCompany])

  const handleLogin = (userData) => {
    setUser(userData)
    console.log("User logged in with role:", userData.role)
    
    // Route based on new role names
    if (userData.role === "admin") {
      setCurrentView("main-dashboard")
    } else if (userData.role === "etcadmin") {
      setCurrentView("etc-panel")
    } else {
      setCurrentView("etc-panel")
    }
  }

  const handleRegister = (userData) => {
    console.log("User registered:", userData)
    // Auth data is already stored securely in RegisterForm
    // Auto login after registration
    handleLogin(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setSelectedProject(null)
    setSelectedCompany(null)
    setCurrentView("login")

    // Use secure logout
    logout()
    
    // Clear non-sensitive localStorage
    localStorage.removeItem("selectedProject")
    localStorage.removeItem("selectedCompany")
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    setCurrentView("etc-panel")
  }

  const handleCompanySelect = (company) => {
    setSelectedCompany(company)
    setCurrentView("company-workflow")
  }

  const handleOpenVoltTrack = () => {
    // Open the VoltTrack Vite app served at /volttrack in a new tab
    window.open("/volttrack", "_blank")
  }

  const handleBackToETC = () => {
    setSelectedCompany(null)
    localStorage.removeItem("selectedCompany")
    setCurrentView("etc-panel")
  }

  const handleBackToMain = () => {
    setSelectedProject(null)
    setSelectedCompany(null)
    localStorage.removeItem("selectedProject")
    localStorage.removeItem("selectedCompany")
    setCurrentView("main-dashboard")
  }

  // New function to handle navigation to admin departments after workflow completion
  const handleNavigateToAdmin = (adminType) => {
    // Clear the selected company since workflow is completed
    setSelectedCompany(null)
    localStorage.removeItem("selectedCompany")

    if (adminType === "etc") {
      setCurrentView("etc-panel")
    } else if (adminType === "main") {
      setCurrentView("main-dashboard")
    }
    // Add more admin types as needed
    // else if (adminType === "finance") {
    //   setCurrentView("finance-panel")
    // }
    // else if (adminType === "hr") {
    //   setCurrentView("hr-panel")
    // }
  }

  return (
    <div className="App">
      {currentView === "login" && (
        <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setCurrentView("register")} />
      )}

      {currentView === "register" && (
        <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setCurrentView("login")} />
      )}

      {currentView === "main-dashboard" && user?.role === "admin" && (
        <MainAdminDashboard
          user={user}
          onLogout={handleLogout}
          onOpenVoltTrack={handleOpenVoltTrack}
          onSelectAdmin={(adminType) => {
            if (adminType === "etc") {
              setCurrentView("etc-panel")
            }
          }}
        />
      )}

      {currentView === "etc-panel" && (
        <ETCAdminPanel
          user={user}
          selectedProject={selectedProject}
          onLogout={handleLogout}
          onProjectSelect={handleProjectSelect}
          onCompanySelect={handleCompanySelect}
          onBackToMain={handleBackToMain}
          onOpenVoltTrack={handleOpenVoltTrack}
        />
      )}

      {currentView === "company-workflow" && selectedCompany && (
        <CompanyWorkflow
          company={selectedCompany}
          project={selectedProject}
          user={user}
          onBack={handleBackToETC}
          onLogout={handleLogout}
          onNavigateToAdmin={handleNavigateToAdmin}
        />
      )}
    </div>
  )
}

export default App
