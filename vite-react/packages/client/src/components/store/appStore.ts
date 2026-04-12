import { create } from 'zustand';
import axios from 'axios';

interface AppState {
  isReadOnly: boolean;
  isLoading: boolean;
  error: string | null;
  bgMode: 'dynamic' | 'static';
  setBgMode: (mode: 'dynamic' | 'static') => void;
  fetchAppConfig: () => Promise<void>;
  logoutAdmin: () => void;
}

const useAppStore = create<AppState>((set) => ({
  isReadOnly: true, // 默认是只读，直到我们从后端确认模式
  isLoading: true,
  error: null,
  bgMode: (localStorage.getItem('bg_mode') as 'dynamic' | 'static') || 'dynamic',
  setBgMode: (mode) => {
    localStorage.setItem('bg_mode', mode);
    set({ bgMode: mode });
  },
  logoutAdmin: () => {
    localStorage.removeItem('admin_pwd');
    set({ isReadOnly: true });
    // 强制刷新页面以确保所有状态重置并重新拉取最新数据
    window.location.href = '/';
  },
  fetchAppConfig: async () => {
    set({ isLoading: true, error: null });
    try {
      // 检查 URL 中是否有 pwd 参数，如果有则保存到 localStorage 中
      const urlParams = new URLSearchParams(window.location.search);
      const pwd = urlParams.get('pwd');
      if (pwd) {
        localStorage.setItem('admin_pwd', pwd);
        // 为了安全起见，保存后移除 URL 中的参数（使用 history.replaceState）
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      } else {
        // 如果使用了 Hash 路由，可能参数在 hash 中 (例如 #/?pwd=123)
        const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const hashPwd = hashParams.get('pwd');
        if (hashPwd) {
           localStorage.setItem('admin_pwd', hashPwd);
           const newUrl = window.location.pathname + '#' + window.location.hash.split('?')[0];
           window.history.replaceState({}, document.title, newUrl);
        }
      }

      // 注意：这里的URL需要根据您的项目结构调整
      const adminPwd = localStorage.getItem('admin_pwd');
      const configObj = adminPwd ? { headers: { 'x-admin-pwd': adminPwd } } : {};
      
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/config`, configObj);
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