const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

// Initialize MongoDB Atlas
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic cors origins mapping Vercel UI safely
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ai-powered-real-estate-sales-lead-management-applica-9bmlmyein.vercel.app'
  ];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS policy.'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Root Identifier
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AI-powered Real Estate Sales Lead Management API'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Real Estate Lead Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Use routes
const leadRoutes = require('./src/routes/leads');
app.use('/api/leads', leadRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Core application operating precisely on port: ${PORT}`);
  });
}

// Ensure Vercel Serverless Functions can consume the Express instance natively
module.exports = app;
