import React, { useState, useEffect, useCallback } from 'react';
import './volttrack.css';
import { mapRoleToVoltTrack, TEST_NAMES, getStageIcon, getStageColor } from './config/voltTrackTypes';
import { voltTrackApi } from './voltTrackApi';
import VoltTrackTestForm from './VoltTrackTestForm';

const TRANSFORMER_TYPES = ['Auto', 'Traction', 'V Connect'];
const TRANSFORMER_CAPACITIES = ['8MVA', '12.3MVA', '16.5MVA'];

// ── Rating defaults ───────────────────────────────────────────────────────────
const AUTO_8MVA_RATING_DEFAULTS = {
  rating_sr_no: 'V/M/ 2061', rating_comm_year: '2026',
  rating_hv_v: '55', rating_lv_v: '27.5',
  rating_hv_a: '145.45', rating_lv_a: '290.91',
  rating_oil_ltrs: '2500 Ltrs', rating_oil_kg: '2225 kG',
  rating_core_wdg: '7350 kG', rating_taps: 'NA',
  rating_impedance: '0.49 %', rating_temp_rise: '40/50 °C',
  rating_transport_wt: '13375 KG (WITH OIL)', rating_radiators: '4 NOS',
};
const AUTO_12_3MVA_RATING_DEFAULTS = {
  rating_sr_no: 'V/M/ 2061', rating_comm_year: '2026',
  rating_hv_v: '55', rating_lv_v: '27.5',
  rating_hv_a: '223.64', rating_lv_a: '447.27',
  rating_oil_ltrs: '3100 Ltrs', rating_oil_kg: '2759 kG',
  rating_core_wdg: '10200 kG', rating_taps: 'NA',
  rating_impedance: '0.49 %', rating_temp_rise: '40/50 °C',
  rating_transport_wt: '17259 KG (WITH OIL)', rating_radiators: '4 NOS',
};
const AUTO_16_5MVA_RATING_DEFAULTS = {
  rating_sr_no: 'V/M/ 3260', rating_comm_year: '2026',
  rating_hv_v: '55', rating_lv_v: '27.5',
  rating_hv_a: '300.00', rating_lv_a: '600.00',
  rating_oil_ltrs: '3450 Ltrs', rating_oil_kg: '3070 kG',
  rating_core_wdg: '12275 kG', rating_taps: 'NA',
  rating_impedance: '0.55 %', rating_temp_rise: '40/50 °C',
  rating_transport_wt: '19845 KG (WITH OIL)', rating_radiators: '4 NOS',
};

const getRatingDefaults = (type, capacity) => {
  if (type === 'Auto' && capacity === '8MVA') return AUTO_8MVA_RATING_DEFAULTS;
  if (type === 'Auto' && capacity === '12.3MVA') return AUTO_12_3MVA_RATING_DEFAULTS;
  if (type === 'Auto' && capacity === '16.5MVA') return AUTO_16_5MVA_RATING_DEFAULTS;
  return {};
};

// ── Job Progress ──────────────────────────────────────────────────────────────
function getJobProgress(job) {
  if (!job.tests || job.tests.length === 0) return { done: 0, total: 0, pct: 0 };
  const done = job.tests.filter((t) => t.stage === 'Authorized').length;
  const total = job.tests.length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

// ── Create Job Modal ──────────────────────────────────────────────────────────
function CreateJobModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Auto');
  const [capacity, setCapacity] = useState('8MVA');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Job name is required'); return; }
    setLoading(true);
    try {
      await onCreate({ name: name.trim(), type, capacity });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vt-modal-overlay" onClick={onClose}>
      <div className="vt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="vt-modal-header">
          <h3>Create New Job</h3>
          <button className="vt-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="vt-modal-body">
          {error && <div className="vt-error">{error}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="vt-field">
              <label>Job Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Transformer Job #2061"
                autoFocus
              />
            </div>
            <div className="vt-field">
              <label>Transformer Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {TRANSFORMER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="vt-field">
              <label>Capacity</label>
              <select value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                {TRANSFORMER_CAPACITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="vt-modal-footer">
          <button className="vt-btn vt-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="vt-btn vt-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Job List View ─────────────────────────────────────────────────────────────
function JobListView({ jobs, onSelectJob, onCreateJob, onDeleteJob, currentRole }) {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = jobs.filter((j) =>
    j.name.toLowerCase().includes(search.toLowerCase()) ||
    j.type.toLowerCase().includes(search.toLowerCase()) ||
    j.capacity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="vt-page-title">
        <h2>⚡ Testing Department — Job List</h2>
        <p>Manage transformer testing jobs. All data is saved to the server.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}
        />
        {currentRole !== 'Viewer' && (
          <button className="vt-btn vt-btn-primary" onClick={() => setShowCreate(true)}>
            + New Job
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="vt-empty">
          <div className="vt-empty-icon">🔬</div>
          <h3>{jobs.length === 0 ? 'No jobs yet' : 'No jobs match your search'}</h3>
          <p>{jobs.length === 0 ? 'Create your first testing job to get started.' : 'Try a different search term.'}</p>
        </div>
      ) : (
        <div className="vt-job-grid">
          {filtered.map((job) => {
            const { done, total, pct } = getJobProgress(job);
            return (
              <div key={job.id} className="vt-job-card" onClick={() => onSelectJob(job)}>
                <div className="vt-job-card-header">
                  <div>
                    <div className="vt-job-name">{job.name}</div>
                    <div className="vt-job-meta">{job.type} · {job.capacity}</div>
                  </div>
                  <span className={`vt-job-status ${job.status.toLowerCase()}`}>{job.status}</span>
                </div>
                <div className="vt-job-progress">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="vt-progress-text">{done}/{total} tests authorized</span>
                    <span className="vt-progress-text">{pct}%</span>
                  </div>
                  <div className="vt-progress-bar-bg">
                    <div className="vt-progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  {(currentRole === 'Admin_Authorized') && (
                    <button
                      className="vt-btn vt-btn-danger vt-btn-sm"
                      onClick={(e) => { e.stopPropagation(); onDeleteJob(job.id); }}
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <CreateJobModal
          onClose={() => setShowCreate(false)}
          onCreate={onCreateJob}
        />
      )}
    </div>
  );
}

// ── Job Detail View ───────────────────────────────────────────────────────────
function JobDetailView({ job, onBack, onUpdateJob, currentRole }) {
  const [selectedTest, setSelectedTest] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [localJob, setLocalJob] = useState(job);

  // Keep localJob in sync when parent job changes
  useEffect(() => { setLocalJob(job); }, [job]);

  const handleSaveTest = useCallback(async (observationData) => {
    if (!selectedTest) return;
    setIsSaving(true);
    setError('');
    try {
      const updatedJob = await voltTrackApi.updateTest(localJob.id, selectedTest.id, { observationData });
      setLocalJob(updatedJob);
      // Update selectedTest with fresh data
      const freshTest = updatedJob.tests.find((t) => t.id === selectedTest.id);
      if (freshTest) setSelectedTest(freshTest);
    } catch (e) {
      setError('Failed to save: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  }, [localJob.id, selectedTest]);

  const handleStageChange = useCallback(async (newStage) => {
    if (!selectedTest) return;
    setIsSaving(true);
    setError('');
    try {
      const updatedJob = await voltTrackApi.updateTest(localJob.id, selectedTest.id, { stage: newStage });
      setLocalJob(updatedJob);
      const freshTest = updatedJob.tests.find((t) => t.id === selectedTest.id);
      if (freshTest) setSelectedTest(freshTest);
      // If all tests authorized, mark job as completed
      const allAuthorized = updatedJob.tests.every((t) => t.stage === 'Authorized');
      if (allAuthorized && updatedJob.status !== 'Completed') {
        const completedJob = await voltTrackApi.updateJob(localJob.id, { status: 'Completed' });
        setLocalJob(completedJob);
        onUpdateJob(completedJob);
      } else {
        onUpdateJob(updatedJob);
      }
    } catch (e) {
      setError('Failed to update stage: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  }, [localJob.id, selectedTest, onUpdateJob]);

  const { done, total, pct } = getJobProgress(localJob);

  const getStageBadgeClass = (stage) => ({
    'Not Started': 'vt-stage-not-started',
    'Tested': 'vt-stage-tested',
    'Reviewed': 'vt-stage-reviewed',
    'Authorized': 'vt-stage-authorized',
  }[stage] || 'vt-stage-not-started');

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: '#64748b' }}>
        <button className="vt-btn vt-btn-ghost vt-btn-sm" onClick={onBack}>← Back to Jobs</button>
        <span>/</span>
        <span style={{ fontWeight: 700, color: '#0f172a' }}>{localJob.name}</span>
      </div>

      {error && <div className="vt-error">{error}</div>}

      {/* Job Header */}
      <div className="vt-card" style={{ marginBottom: 20 }}>
        <div className="vt-card-header">
          <div>
            <h3>{localJob.name}</h3>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{localJob.type} · {localJob.capacity}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>{done}/{total} Authorized</span>
            <span className={`vt-job-status ${localJob.status.toLowerCase()}`}>{localJob.status}</span>
          </div>
        </div>
        <div className="vt-card-body" style={{ padding: '12px 20px' }}>
          <div className="vt-progress-bar-bg">
            <div className="vt-progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Two-column layout: test list + form */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Test List */}
        <div className="vt-card">
          <div className="vt-card-header"><h3>Tests</h3></div>
          <div className="vt-card-body" style={{ padding: 12 }}>
            <div className="vt-test-list">
              {(localJob.tests || []).map((test) => (
                <div
                  key={test.id}
                  className={`vt-test-row ${selectedTest?.id === test.id ? 'active' : ''}`}
                  onClick={() => setSelectedTest(test)}
                >
                  <div className="vt-test-row-left">
                    <span className="vt-test-stage-icon">{getStageIcon(test.stage)}</span>
                    <div>
                      <div className="vt-test-name">{test.name}</div>
                      <div className="vt-test-updated">
                        {test.updatedAt ? new Date(test.updatedAt).toLocaleDateString() : 'Not started'}
                      </div>
                    </div>
                  </div>
                  <span className={`vt-test-stage-badge ${getStageBadgeClass(test.stage)}`}>
                    {test.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div>
          {selectedTest ? (
            <VoltTrackTestForm
              key={selectedTest.id}
              test={selectedTest}
              job={localJob}
              currentRole={currentRole}
              onSave={handleSaveTest}
              onStageChange={handleStageChange}
              isSaving={isSaving}
            />
          ) : (
            <div className="vt-empty" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12 }}>
              <div className="vt-empty-icon">👈</div>
              <h3>Select a test</h3>
              <p>Click on a test from the list to open its form.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main VoltTrackApp ─────────────────────────────────────────────────────────
export default function VoltTrackApp({ user, onBack }) {
  const currentRole = mapRoleToVoltTrack(user?.role);
  const [view, setView] = useState('list'); // 'list' | 'detail'
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load all jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await voltTrackApi.getAllJobs();
        setJobs(data);
      } catch (e) {
        setError('Failed to load jobs. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleCreateJob = useCallback(async (jobData) => {
    const newJob = await voltTrackApi.createJob(jobData);
    setJobs((prev) => [newJob, ...prev]);
  }, []);

  const handleDeleteJob = useCallback(async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This cannot be undone.')) return;
    try {
      await voltTrackApi.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
        setView('list');
      }
    } catch (e) {
      setError('Failed to delete job: ' + e.message);
    }
  }, [selectedJob]);

  const handleSelectJob = useCallback((job) => {
    setSelectedJob(job);
    setView('detail');
  }, []);

  const handleUpdateJob = useCallback((updatedJob) => {
    setJobs((prev) => prev.map((j) => j.id === updatedJob.id ? updatedJob : j));
    setSelectedJob(updatedJob);
  }, []);

  const handleBackToList = useCallback(() => {
    setView('list');
    setSelectedJob(null);
  }, []);

  const roleLabel = {
    'Admin_Authorized': 'Authorizer',
    'Admin_Reviewed': 'Reviewer',
    'Admin_Tested': 'Technician',
    'Viewer': 'Viewer',
  }[currentRole] || currentRole;

  return (
    <div className="vt-app">
      {/* Header */}
      <header className="vt-header">
        <div className="vt-header-left">
          <img src="/logo.png" alt="Vishvas Power" className="vt-header-logo" />
          <span className="vt-header-title">VoltTrack — Testing Department</span>
        </div>
        <div className="vt-header-right">
          <span className="vt-role-badge">👤 {user?.name} · {roleLabel}</span>
          <button className="vt-back-btn" onClick={onBack}>← Back to Dashboard</button>
        </div>
      </header>

      {/* Main */}
      <main className="vt-main">
        {loading ? (
          <div className="vt-loading">⏳ Loading jobs...</div>
        ) : error ? (
          <div>
            <div className="vt-error">{error}</div>
            <button className="vt-btn vt-btn-primary" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : view === 'list' ? (
          <JobListView
            jobs={jobs}
            onSelectJob={handleSelectJob}
            onCreateJob={handleCreateJob}
            onDeleteJob={handleDeleteJob}
            currentRole={currentRole}
          />
        ) : (
          <JobDetailView
            job={selectedJob}
            onBack={handleBackToList}
            onUpdateJob={handleUpdateJob}
            currentRole={currentRole}
          />
        )}
      </main>
    </div>
  );
}