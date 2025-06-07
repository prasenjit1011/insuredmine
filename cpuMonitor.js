// monitor/cpuMonitor.js
const os = require('os');
const { exec } = require('child_process');
require('dotenv').config();

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

  if (cpuUsage > 700) {
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
