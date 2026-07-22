// VoltTrack API utility — all calls go to the existing backend
import { BACKEND_API_BASE_URL } from '../constant';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const BASE = `${BACKEND_API_BASE_URL}/api/volttrack`;

export const voltTrackApi = {
  // Fetch all jobs
  getAllJobs: async () => {
    const res = await fetch(`${BASE}/jobs`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  // Create a new job
  createJob: async (jobData) => {
    const res = await fetch(`${BASE}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create job');
    }
    return res.json();
  },

  // Get a single job
  getJob: async (id) => {
    const res = await fetch(`${BASE}/jobs/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch job');
    return res.json();
  },

  // Update a job (name, status, ratingData, tests)
  updateJob: async (id, updates) => {
    const res = await fetch(`${BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update job');
    }
    return res.json();
  },

  // Delete a job
  deleteJob: async (id) => {
    const res = await fetch(`${BASE}/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete job');
    return res.json();
  },

  // Update a specific test within a job
  updateTest: async (jobId, testId, updates) => {
    const res = await fetch(`${BASE}/jobs/${jobId}/tests/${testId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update test');
    }
    return res.json();
  },
};