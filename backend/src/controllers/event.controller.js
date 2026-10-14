import Event, { PUBLIC_STATUSES } from '../models/Event.js';
import ApiError from '../utils/ApiError.js';
import { validateEvent } from '../validators/event.validator.js';
import {
  toPublicPath,
  toPublicPathMany,
  removeUploadedFile,
  removeUploadedFiles,
} from '../middlewares/upload.middleware.js';

// ─── helpers ──────────────────────────────────────────────────────────────────
const assertOwner = (event, userId) => {
  if (event.organizer._id?.toString() !== userId.toString() &&
      event.organizer.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not the organizer of this event');
  }
};

const assertEditable = (event) => {
  if (!['Draft', 'Rejected'].includes(event.status)) {
    throw new ApiError(400, `Event cannot be edited in "${event.status}" status`);
  }
};

// ─── ORGANIZER ────────────────────────────────────────────────────────────────

// POST /api/events  (organizer)
export const createEvent = async (req, res) => {
  try {
    const data = validateEvent(req.body);
    if (req.file) data.poster = toPublicPath(req.file);

    // status driven by body flag: 'draft' (default) or 'submit'
    const action = (req.body.action || 'draft').toLowerCase();
    data.status = action === 'submit' ? 'Pending Approval' : 'Draft';
    data.organizer = req.user._id;

    const event = await Event.create(data);
    res.status(201).json({ success: true, event });
  } catch (err) {
    removeUploadedFile(req.file);
    throw err;
  }
};

// PUT /api/events/:id  (organizer, own events, draft/rejected only)
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new ApiError(404, 'Event not found');
    assertOwner(event, req.user._id);
    assertEditable(event);

    const data = validateEvent(req.body, true);

    // Handle poster replacement
    if (req.file) {
      data.poster = toPublicPath(req.file);
      // Optionally clean up old poster (best-effort)
      if (event.poster) {
        const fs = await import('fs');
        const path = await import('path');
        const oldPath = path.default.resolve('uploads', ...event.poster.replace(/^\/uploads\//, '').split('/'));
        fs.default.unlink(oldPath, () => {});
      }
    }

    Object.assign(event, data);
    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    removeUploadedFile(req.file);
    throw err;
  }
};

// POST /api/events/:id/submit  (organizer, own events, draft/rejected only)
export const submitForApproval = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  assertOwner(event, req.user._id);
  assertEditable(event);

  event.status = 'Pending Approval';
  event.rejectionReason = undefined;
  await event.save();
  res.json({ success: true, event });
};

// GET /api/events/my  (organizer)
export const getMyEvents = async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, events });
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// GET /api/events/all  (admin)
export const getAllEvents = async (req, res) => {
  const { status, type, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.eventType = type;

  const skip = (Number(page) - 1) * Number(limit);
  const [events, total] = await Promise.all([
    Event.find(filter)
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Event.countDocuments(filter),
  ]);
  res.json({ success: true, events, total, page: Number(page), limit: Number(limit) });
};

// GET /api/events/pending  (admin)
export const getPendingEvents = async (req, res) => {
  const events = await Event.find({ status: 'Pending Approval' })
    .populate('organizer', 'name email')
    .sort({ updatedAt: 1 }); // oldest first
  res.json({ success: true, events });
};

// POST /api/events/:id/approve  (admin)
export const approveEvent = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', '_id');
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.status !== 'Pending Approval') {
    throw new ApiError(400, 'Only events with "Pending Approval" status can be approved');
  }
  event.status = 'Approved';
  event.rejectionReason = undefined;
  await event.save();
  res.json({ success: true, event });
};

// POST /api/events/:id/reject  (admin)
export const rejectEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.status !== 'Pending Approval') {
    throw new ApiError(400, 'Only events with "Pending Approval" status can be rejected');
  }
  const reason = typeof req.body.reason === 'string' ? req.body.reason.trim() : '';
  event.status = 'Rejected';
  event.rejectionReason = reason || 'No reason provided';
  await event.save();
  res.json({ success: true, event });
};

// POST /api/events/:id/cancel  (admin)
export const cancelEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  const cancellable = ['Approved', 'Registration Open', 'Registration Closed', 'Ongoing'];
  if (!cancellable.includes(event.status)) {
    throw new ApiError(400, `Cannot cancel an event in "${event.status}" status`);
  }
  event.status = 'Cancelled';
  await event.save();
  res.json({ success: true, event });
};

// ─── PUBLIC / STUDENT ─────────────────────────────────────────────────────────

// GET /api/events  (public – approved statuses only)
export const getPublicEvents = async (req, res) => {
  const { search, type, page = 1, limit = 12 } = req.query;
  const filter = { status: { $in: PUBLIC_STATUSES } };
  if (type) filter.eventType = type;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [events, total] = await Promise.all([
    Event.find(filter)
      .populate('organizer', 'name')
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number(limit)),
    Event.countDocuments(filter),
  ]);
  res.json({ success: true, events, total, page: Number(page), limit: Number(limit) });
};

// GET /api/events/:id  (public – only if publicly visible)
export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email');
  if (!event) throw new ApiError(404, 'Event not found');
  if (!PUBLIC_STATUSES.includes(event.status)) {
    throw new ApiError(403, 'This event is not publicly available');
  }
  res.json({ success: true, event });
};
