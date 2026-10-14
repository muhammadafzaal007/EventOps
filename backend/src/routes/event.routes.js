import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { uploadPoster } from '../middlewares/upload.middleware.js';
import {
  createEvent,
  updateEvent,
  submitForApproval,
  getMyEvents,
  getAllEvents,
  getPendingEvents,
  approveEvent,
  rejectEvent,
  cancelEvent,
  getPublicEvents,
  getEventById,
} from '../controllers/event.controller.js';

const router = Router();

// ── Public – list (no auth needed) ───────────────────────────────────────────
router.get('/', getPublicEvents);

// ── Organizer routes (auth required) ─────────────────────────────────────────
router.get('/organizer/my',
  authMiddleware,
  roleMiddleware('organizer'),
  getMyEvents
);

router.post('/',
  authMiddleware,
  roleMiddleware('organizer'),
  uploadPoster,
  createEvent
);

router.put('/:id',
  authMiddleware,
  roleMiddleware('organizer'),
  uploadPoster,
  updateEvent
);

router.post('/:id/submit',
  authMiddleware,
  roleMiddleware('organizer'),
  submitForApproval
);

// ── Admin routes (auth required) ──────────────────────────────────────────────
router.get('/admin/all',
  authMiddleware,
  roleMiddleware('admin'),
  getAllEvents
);

router.get('/admin/pending',
  authMiddleware,
  roleMiddleware('admin'),
  getPendingEvents
);

router.post('/:id/approve',
  authMiddleware,
  roleMiddleware('admin'),
  approveEvent
);

router.post('/:id/reject',
  authMiddleware,
  roleMiddleware('admin'),
  rejectEvent
);

router.post('/:id/cancel',
  authMiddleware,
  roleMiddleware('admin'),
  cancelEvent
);

// ── Public – single event detail (must be LAST to avoid catching /organizer/my etc.) ──
router.get('/:id', getEventById);

export default router;
