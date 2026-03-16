import api from './axios';

export const applyProperty = (data) =>
  api.post('/api/applications/', data);

export const getMyApplications = () =>
  api.get('/api/applications/mine/');

export const getReceivedApplications = () =>
  api.get('/api/applications/received/');

export const reviewApplication = (id, action, reason='') =>
  api.patch(`/api/applications/${id}/review/`, { action, reason });