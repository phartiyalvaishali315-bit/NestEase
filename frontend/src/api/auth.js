import api from './axios';

export const sendOTP = (mobile, purpose) =>
  api.post('/api/auth/send-otp/', { mobile, purpose });

export const verifyOTP = (mobile, otp, purpose, role) =>
  api.post('/api/auth/verify-otp/', { mobile, otp, purpose, role });

export const getProfile = () =>
  api.get('/api/auth/me/');

export const updateProfile = (data) =>
  api.patch('/api/auth/me/', data);