// app.js
console.clear();
console.log(`\n\n-------------------- ${new Date().toISOString()} --------------------`);

require('dotenv').config();
const express   = require('express');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const cors      = require('cors');
const mongoose  = require('mongoose');
const PORT      = process.env.PORT || 3000;
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

// Security Middleware
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors(corsOptions));

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const pages = require('./routes/pages');
app.use(pages);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Start CPU Monitor (separate file)
require('./cpuMonitor');
