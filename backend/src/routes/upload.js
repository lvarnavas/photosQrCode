const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const EVENT_NAME = process.env.EVENT_NAME || 'event';
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'src/uploads';

const IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.heic'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    let folder = IMAGE_TYPES.includes(ext) ? 'images' : null;
    if (!folder) return cb(new Error('Invalid file type'));
    const dest = path.resolve(UPLOAD_DIR, EVENT_NAME, folder);
    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch (err) {
      console.error('Failed to create upload directory:', dest, err);
      return cb(err);
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = IMAGE_TYPES.includes(ext);
    let folder = isImage ? 'images' : null;
    if (!folder) return cb(new Error('Invalid file type'));
    const dest = path.resolve(UPLOAD_DIR, EVENT_NAME, folder);
    // Count existing images to determine next number
    fs.readdir(dest, (err, files) => {
      let photoFiles = [];
      if (!err) {
        photoFiles = files.filter(f => f.startsWith('photo-') && IMAGE_TYPES.includes(path.extname(f).toLowerCase()));
      }
      // Find the highest number used so far
      let maxNum = 0;
      photoFiles.forEach(f => {
        const match = f.match(/^photo-(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      });
      // If uploading multiple, keep a counter in req
      if (!req.photoCounter) req.photoCounter = maxNum + 1;
      const filename = `photo-${req.photoCounter}${ext}`;
      req.photoCounter++;
      cb(null, filename);
    });
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (IMAGE_TYPES.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 1024 * 1024 * 100 } // 100MB max per file
});

// Accept multiple images
router.post('/', (req, res) => {
  console.log('Upload endpoint hit');
  upload.array('files', 20)(req, res, function (err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: err.message || 'Upload failed' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    res.json({ message: 'Files uploaded successfully', files: req.files.map(f => f.filename) });
  });
});

// New: List all images in the images upload directory
router.get('/images', (req, res) => {
  const imagesDir = path.resolve(UPLOAD_DIR, EVENT_NAME, 'images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read images directory' });
    }
    // Only return image files
    const imageFiles = files.filter(file => IMAGE_TYPES.includes(path.extname(file).toLowerCase()));
    res.json(imageFiles);
  });
});

module.exports = router;
