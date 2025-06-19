import { create } from 'zustand';
import axios from 'axios';

interface AppState {
  isReadOnly: boolean;
  isLoading: boolean;
  error: string | null;
  fetchAppConfig: () => Promise<void>;
}

const useAppStore = create<AppState>((set) => ({
  isReadOnly: true, // 默认是只读，直到我们从后端确认模式
  isLoading: true,
  error: null,
  fetchAppConfig: async () => {
    set({ isLoading: true, error: null });
    try {
      // 注意：这里的URL需要根据您的项目结构调整
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/config`);
      const mode = response.data.mode;
      set({
        isReadOnly: mode !== 'development',
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch app config:", err);
      set({
        error: '无法加载应用配置。部分功能可能无法使用。',
        isLoading: false,
        isReadOnly: true, // 在出错的情况下，安全起见默认为只读
      });
    }
  },
}));

export default useAppStore; 