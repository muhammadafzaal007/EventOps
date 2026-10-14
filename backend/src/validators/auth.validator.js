import ApiError from '../utils/ApiError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v) => (typeof v === 'string' ? v.trim() : '');

const fail = (errors) => {
  if (Object.keys(errors).length) {
    throw new ApiError(400, 'Validation failed', errors);
  }
};

export const validateRegister = (body = {}) => {
  const errors = {};
  const name = str(body.name);
  const email = str(body.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const studentId = str(body.studentId);
  const department = str(body.department);

  if (name.length < 2 || name.length > 100) errors.name = 'Name must be 2-100 characters';
  if (!EMAIL_REGEX.test(email)) errors.email = 'A valid email is required';
  if (password.length < 8) errors.password = 'Password must be at least 8 characters';
  if (!studentId) errors.studentId = 'Student ID is required';
  if (!department) errors.department = 'Department is required';

  fail(errors);
  return { name, email, password, studentId, department };
};

export const validateLogin = (body = {}) => {
  const errors = {};
  const email = str(body.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';

  if (!EMAIL_REGEX.test(email)) errors.email = 'A valid email is required';
  if (!password) errors.password = 'Password is required';

  fail(errors);
  return { email, password };
};

export const validateProfileUpdate = (body = {}) => {
  const errors = {};
  const updates = {};

  if (body.name !== undefined) {
    const name = str(body.name);
    if (name.length < 2 || name.length > 100) errors.name = 'Name must be 2-100 characters';
    else updates.name = name;
  }
  if (body.department !== undefined) {
    const department = str(body.department);
    if (!department) errors.department = 'Department cannot be empty';
    else updates.department = department;
  }

  fail(errors);
  return updates;
};
