console.clear();
console.log(`\n\n-------------------- ${new Date().toISOString()} --------------------`);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const pages = require('./routes/pages');
app.use(pages);

// Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


// -------------------- CPU Monitor --------------------

function getCpuLoad() {
  const cpus = os.cpus();
  let idle = 0, total = 0;

  cpus.forEach(core => {
    for (let type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });

  return {
    idle: idle / cpus.length,
    total: total / cpus.length,
  };
}

let startMeasure = getCpuLoad();

setInterval(() => {
  const endMeasure = getCpuLoad();
  const idleDiff = endMeasure.idle - startMeasure.idle;
  const totalDiff = endMeasure.total - startMeasure.total;
  const cpuUsage = (1 - idleDiff / totalDiff) * 100;

  console.log(`🖥️ CPU Usage: ${cpuUsage.toFixed(2)}%`);

  startMeasure = endMeasure;

  if (cpuUsage > 70) {
    console.warn('⚠️ High CPU Usage Detected. Restarting server...');
    exec(`pm2 restart ${process.env.PM2_APP_NAME || 'app'}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ PM2 Restart Error: ${err.message}`);
        return;
      }
      console.log(`🔁 PM2 Restart Triggered:\n${stdout}`);
    });
  }

}, 5000);