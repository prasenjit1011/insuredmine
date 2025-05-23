const path = require('path');
const fs = require('fs');
const { Worker } = require('worker_threads');

exports.handleUpload = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const extension = path.extname(originalName).toLowerCase().substring(1); // e.g., 'csv', 'txt'

  const destinationDir = path.join(__dirname, '../uploads', extension);

  // Ensure destination directory exists
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  const newFilePath = path.join(destinationDir, originalName);

  // Move file to destination directory
  fs.rename(filePath, newFilePath, (err) => {
    if (err) return res.status(500).json({ error: 'File move failed: ' + err.message });

    const worker = new Worker(path.resolve(__dirname, '../workers/upload.worker.js'), {
      workerData: { filePath: newFilePath, originalName }
    });

    worker.on('message', (result) => {
      if (result.status === 'success') {
        res.json({ message: `Successfully uploaded ${result.count} records.` });
      } else {
        res.status(500).json({ error: result.message });
      }
    });

    worker.on('error', (err) => {
      res.status(500).json({ error: 'Worker thread failed: ' + err.message });
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  });
};
