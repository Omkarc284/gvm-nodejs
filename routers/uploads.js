const Router = require('express').Router;
const router = Router();
const multer = require('multer');
const path = require('path');

const fs = require('fs').promises;
try {
    fs.mkdir('./uploads/', { recursive: true }); // Create uploads dir if it doesn't exist
  } catch (err) {
    console.error('Error creating uploads directory:', err);
    // Handle directory creation error appropriately (e.g., return an error response)
  }
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
router.post('/new', upload.array('files'), async(req, res) => {
    const files = req.files.map(file => ({
        filename: file.filename,
        size: file.size
    }));
    res.status(201).json({ files });
});

module.exports = router