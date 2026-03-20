import api from './axios';

export const getProperties = (params) =>
  api.get('/api/properties/', { params });

export const getProperty = (id) =>
  api.get(`/api/properties/${id}/`);

export const createProperty = (data) => {
  return api.post('/api/properties/create/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getMyProperties = () =>
  api.get('/api/properties/mine/');

export const toggleAvailability = (id) =>
  api.patch(`/api/properties/${id}/toggle/`);

export const uploadMedia = (id, data) =>
  api.post(`/api/properties/${id}/media/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });