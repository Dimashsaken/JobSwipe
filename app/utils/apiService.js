import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const apiService = {
  // Jobs
  getJobs: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Saved Jobs
  getSavedJobs: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/saved-jobs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },

  saveJob: async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  unsaveJob: async (jobId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error removing saved job:', error);
      throw error;
    }
  },

  // Applications
  getApplications: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/applications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  applyForJob: async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/jobs/${jobId}/apply`);
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await axios.put(`${BASE_URL}/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }
}; 