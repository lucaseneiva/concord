import api from '../utils/axiosConfig';

export interface Room {
  id: string;
  name: string;
  is_group: boolean;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
  };
}

export const roomService = {
  getRooms: async () => {
    const response = await api.get('/rooms');
    return response.data.data;
  },

  createRoom: async (name: string) => {
    const response = await api.post('/rooms', { name });
    return response.data.data;
  },

  getMessages: async (roomId: string) => {
    const response = await api.get(`/rooms/${roomId}/messages`);
    return response.data.data;
  },
  
  joinRoom: async (roomId: string) => {
      const response = await api.post(`/rooms/${roomId}/join`);
      return response.data;
  }
};