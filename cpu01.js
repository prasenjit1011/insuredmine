const os = require('os');

function getCpuLoad() {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach((core) => {
    for (type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });

  return ((1 - idle / total) * 100).toFixed(2);
}

console.log(`CPU Usage: ${getCpuLoad()}%`);
