const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data (in production, this would come from a database)
const jobs = require('./app/utils/mockData').MOCK_JOBS;
const savedJobs = [];
const applications = [];

// Health check endpoint
app.get('/api/health-check', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// Routes
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.post('/api/jobs/:id/save', (req, res) => {
  const jobId = req.params.id;
  const job = jobs.find(job => job.id === jobId);
  
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  
  const alreadySaved = savedJobs.some(saved => saved.id === jobId);
  
  if (alreadySaved) {
    return res.status(400).json({ message: 'Job already saved' });
  }
  
  savedJobs.push(job);
  res.json({ message: 'Job saved successfully' });
});

app.delete('/api/jobs/:id/save', (req, res) => {
  const jobId = req.params.id;
  const index = savedJobs.findIndex(job => job.id === jobId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Saved job not found' });
  }
  
  savedJobs.splice(index, 1);
  res.json({ message: 'Job removed from saved jobs' });
});

app.get('/api/saved-jobs', (req, res) => {
  res.json(savedJobs);
});

app.post('/api/jobs/:id/apply', (req, res) => {
  const jobId = req.params.id;
  const job = jobs.find(job => job.id === jobId);
  
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  
  const alreadyApplied = applications.some(app => app.jobId === jobId);
  
  if (alreadyApplied) {
    return res.status(400).json({ message: 'Already applied to this job' });
  }
  
  const application = {
    id: Date.now().toString(),
    jobId,
    title: job.title,
    company: job.company,
    status: 'Submitted',
    appliedDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  applications.push(application);
  res.json({ message: 'Application submitted successfully', application });
});

app.get('/api/applications', (req, res) => {
  res.json(applications);
});

app.put('/api/applications/:id/status', (req, res) => {
  const applicationId = req.params.id;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  const application = applications.find(app => app.id === applicationId);
  
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }
  
  application.status = status;
  application.lastUpdated = new Date().toISOString().split('T')[0];
  
  res.json({ message: 'Application status updated', application });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 