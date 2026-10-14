import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const ROLES = ['student', 'organizer', 'admin'];
export const STATUSES = ['active', 'pending', 'suspended'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLES, default: 'student' },
    studentId: { type: String, trim: true, unique: true, sparse: true },
    department: { type: String, trim: true },
    studentCard: { type: String },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: STATUSES, default: 'active' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
