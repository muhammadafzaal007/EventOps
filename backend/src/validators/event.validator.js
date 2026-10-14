import ApiError from '../utils/ApiError.js';
import { EVENT_TYPES, REGISTRATION_TYPES } from '../models/Event.js';

const str = (v) => (typeof v === 'string' ? v.trim() : '');
const fail = (errors) => {
  if (Object.keys(errors).length) throw new ApiError(400, 'Validation failed', errors);
};

// Parse "HH:MM" into minutes-since-midnight for comparison
const toMinutes = (t) => {
  const [h, m] = (t || '').split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return NaN;
  return h * 60 + m;
};

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Validates event creation / update body.
 * Pass `isUpdate = true` to allow partial bodies (no required-field checks).
 */
export const validateEvent = (body = {}, isUpdate = false) => {
  const errors = {};
  const data = {};

  // --- Required string fields ---
  const title = str(body.title);
  if (!isUpdate || body.title !== undefined) {
    if (!title || title.length > 200) errors.title = 'Title is required (max 200 characters)';
    else data.title = title;
  }

  const description = str(body.description);
  if (!isUpdate || body.description !== undefined) {
    if (!description) errors.description = 'Description is required';
    else data.description = description;
  }

  // --- Optional string fields ---
  if (body.category !== undefined) {
    const category = str(body.category);
    if (category) data.category = category;
  }

  if (body.venue !== undefined) {
    const venue = str(body.venue);
    if (venue) data.venue = venue;
  }

  if (body.rules !== undefined) {
    const rules = str(body.rules);
    if (rules) data.rules = rules;
  }

  // --- eventType ---
  if (!isUpdate || body.eventType !== undefined) {
    const eventType = str(body.eventType);
    if (!EVENT_TYPES.includes(eventType)) {
      errors.eventType = `Event type must be one of: ${EVENT_TYPES.join(', ')}`;
    } else {
      data.eventType = eventType;
    }
  }

  // --- registrationType ---
  if (body.registrationType !== undefined) {
    const rt = str(body.registrationType);
    if (!REGISTRATION_TYPES.includes(rt)) {
      errors.registrationType = `Registration type must be one of: ${REGISTRATION_TYPES.join(', ')}`;
    } else {
      data.registrationType = rt;
    }
  }

  // --- date ---
  let dateObj = null;
  if (!isUpdate || body.date !== undefined) {
    const rawDate = body.date;
    if (!rawDate) {
      errors.date = 'Event date is required';
    } else {
      dateObj = new Date(rawDate);
      if (isNaN(dateObj.getTime())) errors.date = 'Event date is invalid';
      else data.date = dateObj;
    }
  }

  // --- startTime / endTime ---
  let startMinutes = NaN;
  let endMinutes = NaN;
  const startTime = str(body.startTime);
  const endTime = str(body.endTime);

  if (!isUpdate || body.startTime !== undefined) {
    if (!TIME_REGEX.test(startTime)) errors.startTime = 'Start time must be in HH:MM format';
    else {
      data.startTime = startTime;
      startMinutes = toMinutes(startTime);
    }
  }

  if (!isUpdate || body.endTime !== undefined) {
    if (!TIME_REGEX.test(endTime)) errors.endTime = 'End time must be in HH:MM format';
    else {
      data.endTime = endTime;
      endMinutes = toMinutes(endTime);
    }
  }

  if (!isNaN(startMinutes) && !isNaN(endMinutes) && endMinutes <= startMinutes) {
    errors.endTime = 'End time must be after start time';
  }

  // --- registrationDeadline ---
  if (body.registrationDeadline !== undefined && body.registrationDeadline !== '') {
    const dl = new Date(body.registrationDeadline);
    if (isNaN(dl.getTime())) {
      errors.registrationDeadline = 'Registration deadline is invalid';
    } else {
      if (dateObj && dl > dateObj) {
        errors.registrationDeadline = 'Registration deadline cannot be after the event date';
      } else {
        data.registrationDeadline = dl;
      }
    }
  }

  // --- participant counts ---
  if (body.expectedParticipants !== undefined && body.expectedParticipants !== '') {
    const ep = Number(body.expectedParticipants);
    if (!Number.isInteger(ep) || ep < 1) errors.expectedParticipants = 'Expected participants must be a positive integer';
    else data.expectedParticipants = ep;
  }

  if (body.maximumParticipants !== undefined && body.maximumParticipants !== '') {
    const mp = Number(body.maximumParticipants);
    if (!Number.isInteger(mp) || mp < 1) errors.maximumParticipants = 'Maximum participants must be a positive integer';
    else {
      if (data.expectedParticipants && mp < data.expectedParticipants) {
        errors.maximumParticipants = 'Maximum participants cannot be less than expected participants';
      } else {
        data.maximumParticipants = mp;
      }
    }
  }

  fail(errors);
  return data;
};
