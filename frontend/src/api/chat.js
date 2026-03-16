import api from './axios';

export const getChatRoom = (app_id) =>
  api.get(`/api/chat/room/${app_id}/`);

export const sendMessage = (room_id, text) =>
  api.post(`/api/chat/${room_id}/send/`, { text });

export const markRead = (room_id) =>
  api.patch(`/api/chat/${room_id}/read/`);