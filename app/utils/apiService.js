import axios from 'axios';
import { MOCK_JOBS } from './mockData';

const BASE_URL = 'http://localhost:3000/api';

// Backup data for when API is unavailable
const BACKUP_DATA = {
  jobs: MOCK_JOBS,
  savedJobs: [],
  applications: []
};

// Initialize backup applications with sample data
BACKUP_DATA.savedJobs = MOCK_JOBS.slice(0, 2); // First 2 jobs as saved
BACKUP_DATA.applications = [
  {
    id: '1',
    jobId: '1',
    title: 'Software Engineer',
    company: 'Tech Innovations',
    status: 'Submitted',
    appliedDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: '2',
    jobId: '2',
    title: 'UX/UI Designer',
    company: 'Creative Solutions',
    status: 'Under Review',
    appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

export const apiService = {
  // Jobs
  getJobs: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs, using backup data:', error);
      return BACKUP_DATA.jobs;
    }
  },

  // Saved Jobs
  getSavedJobs: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/saved-jobs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs, using backup data:', error);
      return BACKUP_DATA.savedJobs;
    }
  },

  saveJob: async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error saving job, simulating success with backup data:', error);
      // Add to backup saved jobs if not already there
      const job = BACKUP_DATA.jobs.find(job => job.id === jobId);
      if (job && !BACKUP_DATA.savedJobs.some(savedJob => savedJob.id === jobId)) {
        BACKUP_DATA.savedJobs.push(job);
      }
      return { message: 'Job saved successfully (backup mode)' };
    }
  },

  unsaveJob: async (jobId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error removing saved job, simulating success with backup data:', error);
      // Remove from backup saved jobs
      BACKUP_DATA.savedJobs = BACKUP_DATA.savedJobs.filter(job => job.id !== jobId);
      return { message: 'Job removed from saved jobs (backup mode)' };
    }
  },

  // Applications
  getApplications: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/applications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching applications, using backup data:', error);
      return BACKUP_DATA.applications;
    }
  },

  applyForJob: async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/jobs/${jobId}/apply`);
      return response.data;
    } catch (error) {
      console.error('Error applying for job, simulating success with backup data:', error);
      // Check if already applied in backup data
      if (BACKUP_DATA.applications.some(app => app.jobId === jobId)) {
        return { message: 'Already applied to this job (backup mode)' };
      }
      
      // Add to backup applications
      const job = BACKUP_DATA.jobs.find(job => job.id === jobId);
      if (job) {
        const application = {
          id: Date.now().toString(),
          jobId,
          title: job.title,
          company: job.company,
          status: 'Submitted',
          appliedDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        BACKUP_DATA.applications.push(application);
        return { 
          message: 'Application submitted successfully (backup mode)', 
          application 
        };
      }
      return { message: 'Application simulated (backup mode)' };
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await axios.put(`${BASE_URL}/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating application status, simulating success with backup data:', error);
      // Update status in backup applications
      const application = BACKUP_DATA.applications.find(app => app.id === applicationId);
      if (application) {
        application.status = status;
        application.lastUpdated = new Date().toISOString().split('T')[0];
      }
      return { 
        message: 'Application status updated (backup mode)',
        application
      };
    }
  }
}; 