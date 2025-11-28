import { create } from 'zustand';
import axios from 'axios';

interface FeedItem {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface FeedStore {
  items: FeedItem[];
  loading: boolean;
  fetchFeed: () => Promise<void>;
}

const API_URL = 'https://your-api.com';

export const useFeedStore = create<FeedStore>((set) => ({
  items: [],
  loading: false,

  fetchFeed: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/feed`);
      set({ items: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
