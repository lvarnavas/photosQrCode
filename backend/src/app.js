require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'src/uploads';
const PUBLIC_DIR = path.resolve(__dirname, '../../public');

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
const pathToUploads = path.resolve(__dirname, '..', UPLOAD_DIR);
app.use('/uploads', express.static(pathToUploads));

// Serve static files from the public directory
app.use(express.static(PUBLIC_DIR));

// SPA fallback: serve index.html for any unknown route (except API and uploads)
app.get(/^\/(?!api|uploads).*/, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Upload endpoint
app.use('/api/upload', uploadRouter);

app.get('/', (req, res) => {
  res.send('Wedding Media Upload Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
