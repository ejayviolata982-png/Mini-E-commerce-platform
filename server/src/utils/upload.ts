import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const valid = allowed.test(
      path.extname(file.originalname).toLowerCase()
    );
    valid ? cb(null, true) : cb(new Error('Invalid file type'));
  },
});