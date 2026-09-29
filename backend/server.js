const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic cors origins mapping Vercel UI safely
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy. Check environmental limits.'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running securely.' });
});

// Use routes
const leadRoutes = require('./src/routes/leads');
app.use('/api/leads', leadRoutes);

app.listen(PORT, () => {
  console.log(`Core application operating precisely on port: ${PORT}`);
});
