require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const contentRoutes = require('./routes/content');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory (uploads, assets, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Mantap.work API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Serve static files from public directory (for production)
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
} else {
  // Development - simple message
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Mantap.work API is running (Development Mode)',
      note: 'Frontend runs separately on port 8080'
    });
  });
}

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} (${NODE_ENV} mode)`);
  if (NODE_ENV === 'production') {
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
  }
});