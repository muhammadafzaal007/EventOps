import mongoose from 'mongoose';

export const EVENT_TYPES = [
  'Competition',
  'Seminar',
  'Workshop',
  'Webinar',
  'Conference',
  'Society Event',
  'Sports',
  'Cultural Event',
];

export const EVENT_STATUSES = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Registration Open',
  'Registration Closed',
  'Ongoing',
  'Completed',
  'Cancelled',
  'Rejected',
];

export const REGISTRATION_TYPES = ['Free', 'Paid', 'Invite Only'];

// Statuses visible to students/public
export const PUBLIC_STATUSES = [
  'Approved',
  'Registration Open',
  'Registration Closed',
  'Ongoing',
  'Completed',
];

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    eventType: { type: String, enum: EVENT_TYPES, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },   // "HH:MM" 24-hour
    endTime: { type: String, required: true },     // "HH:MM" 24-hour
    registrationDeadline: { type: Date },
    expectedParticipants: { type: Number, min: 1 },
    maximumParticipants: { type: Number, min: 1 },
    registrationType: { type: String, enum: REGISTRATION_TYPES, default: 'Free' },
    poster: { type: String },                       // single image URL
    rules: { type: String, trim: true },
    status: { type: String, enum: EVENT_STATUSES, default: 'Draft' },
    venue: { type: String, trim: true },            // plain text for now; venue allocation later
    results: { type: String, trim: true },
    gallery: [{ type: String }],                    // array of image URLs
    rejectionReason: { type: String, trim: true },  // set by admin on rejection
  },
  { timestamps: true }
);

// Text index for student search
eventSchema.index({ title: 'text', description: 'text' });

eventSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Event', eventSchema);
