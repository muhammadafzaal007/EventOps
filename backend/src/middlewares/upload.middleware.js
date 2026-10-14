import fs from 'fs';
import path from 'path';
import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const UPLOAD_ROOT = path.resolve('uploads');

const FOLDERS = {
  studentCard: 'student-cards',
  profileImage: 'profile-images',
  poster: 'event-posters',
  gallery: 'event-gallery',
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ── Generic disk storage (works for all field names) ──────────────────────────
const makeStorage = () =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = FOLDERS[file.fieldname] || 'misc';
      const dir = path.join(UPLOAD_ROOT, folder);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });

const makeFilter = (allowedFields) => (req, file, cb) => {
  if (!allowedFields.includes(file.fieldname)) {
    return cb(new ApiError(400, `Unexpected file field: ${file.fieldname}`));
  }
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(400, 'Only JPG, PNG or WEBP images are allowed'));
  }
  cb(null, true);
};

// ── Auth uploads (2 MB) ───────────────────────────────────────────────────────
const authUpload = multer({
  storage: makeStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: makeFilter(['studentCard', 'profileImage']),
});

export const uploadStudentCard = authUpload.single('studentCard');
export const uploadProfileImage = authUpload.single('profileImage');

// ── Event poster (5 MB, single) ───────────────────────────────────────────────
const posterUpload = multer({
  storage: makeStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: makeFilter(['poster']),
});
export const uploadPoster = posterUpload.single('poster');

// ── Event gallery (3 MB each, max 10 files) ───────────────────────────────────
const galleryUpload = multer({
  storage: makeStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: makeFilter(['gallery']),
});
export const uploadGallery = galleryUpload.array('gallery', 10);

// ── Helpers ───────────────────────────────────────────────────────────────────
export const toPublicPath = (file) =>
  file ? `/uploads/${FOLDERS[file.fieldname]}/${file.filename}` : undefined;

export const toPublicPathMany = (files = []) =>
  files.map((f) => `/uploads/${FOLDERS[f.fieldname]}/${f.filename}`);

export const removeUploadedFile = (file) => {
  if (file?.path) fs.unlink(file.path, () => {});
};

export const removeUploadedFiles = (files = []) => {
  files.forEach(removeUploadedFile);
};
