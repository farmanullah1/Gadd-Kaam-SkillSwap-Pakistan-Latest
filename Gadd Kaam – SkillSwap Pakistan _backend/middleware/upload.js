// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create 'uploads' directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Sanitize filename to remove spaces
    const cleanName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${file.fieldname}-${Date.now()}-${cleanName}`);
  },
});

// ✅ UPDATE: File filter to allow ANY image mimetype
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // ✅ Global Max Limit: 10MB (We enforce stricter 6MB for CNIC in routes)
  },
});

module.exports = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'cnicFrontPicture', maxCount: 1 },
  { name: 'cnicBackPicture', maxCount: 1 },
]);