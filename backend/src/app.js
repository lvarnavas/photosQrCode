require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'src/uploads';

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
const pathToUploads = path.resolve(__dirname, '..', UPLOAD_DIR);
app.use('/uploads', express.static(pathToUploads));

// Upload endpoint
app.use('/api/upload', uploadRouter);

app.get('/', (req, res) => {
  res.send('Wedding Media Upload Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
