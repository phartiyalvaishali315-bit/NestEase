import api from './axios';

export const initiatePayment = (booking_id) =>
  api.post('/api/payments/initiate/', { booking_id });

export const payNow = (payment_id) =>
  api.post(`/api/payments/${payment_id}/pay/`);

export const getMyPayments = () =>
  api.get('/api/payments/mine/');