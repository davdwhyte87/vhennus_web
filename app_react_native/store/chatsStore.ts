import { create } from 'zustand';
import axios from 'axios';

interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  updatedAt: string;
}

interface ChatsStore {
  chats: Chat[];
  loading: boolean;
  fetchChats: () => Promise<void>;
}

const API_URL = 'https://your-api.com';

export const useChatsStore = create<ChatsStore>((set) => ({
  chats: [],
  loading: false,

  fetchChats: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/chats`);
      set({ chats: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
