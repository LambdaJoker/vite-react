import { create } from 'zustand';
import apiClient from '../../api/apiClient'; // 确认路径为 ../../api/apiClient

// 定义文章和 Store 的类型
// 合并后的 Article 类型
export interface Article {
  id: number;
  title: string;
  content: string; // 详情使用
  excerpt?: string; // 列表使用
  date: string;
  category: string;
  image: string;
  read_count: number;
  author: string;
  tags: string[];
}

interface ArticleState {
  articles: Article[];
  currentArticle: Article | null;
  isLoading: boolean;
  error: string | null;
  fetchArticles: () => Promise<void>;
  fetchArticle: (id: string) => Promise<void>;
  createArticle: (articleData: FormData) => Promise<Article | undefined>;
  updateArticle: (id: string, articleData: FormData) => Promise<Article | undefined>;
  deleteArticle: (id: string) => Promise<void>;
  clearCurrentArticle: () => void;
}

// 创建 Store
const useArticleStore = create<ArticleState>((set) => ({
  articles: [],
  currentArticle: null,
  isLoading: false,
  error: null,

  // 异步获取文章数据的 action
  fetchArticles: async () => {
    set({ isLoading: true, error: null });
    try {
      // 使用 apiClient 发起请求
      const response = await apiClient.get<Article[]>('/articles');
      // 确保返回的是数组
      const articles = Array.isArray(response.data) ? response.data : [];
      set({ articles, isLoading: false });
    } catch (err: any) {
      const errorMessage = err.message || '获取文章列表失败';
      set({ error: errorMessage, isLoading: false, articles: [] });
    }
  },

  // 获取单篇文章
  fetchArticle: async (id: string) => {
    set({ isLoading: true, error: null, currentArticle: null });
    try {
      // 检查当前会话是否已经查看过该文章，避免重复增加阅读量
      const viewedKey = `viewed_article_${id}`;
      const hasViewed = sessionStorage.getItem(viewedKey);
      const increment = !hasViewed;
      
      // 立即设置标记，防止 StrictMode 或并发请求导致重复增加
      if (increment) {
        sessionStorage.setItem(viewedKey, 'true');
      }
      
      const response = await apiClient.get<Article>(`/articles/${id}?increment=${increment}`);
      
      set({ currentArticle: response.data, isLoading: false });
    } catch (err: any) {
      // 如果请求失败，清除标记，允许重试增加阅读量
      sessionStorage.removeItem(`viewed_article_${id}`);
      const errorMessage = err.message || '获取文章详情失败';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // 创建文章
  createArticle: async (articleData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<Article>('/articles', articleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state) => ({
        articles: [...state.articles, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || '创建文章失败';
      set({ error: errorMessage, isLoading: false });
      return undefined;
    }
  },

  // 更新文章
  updateArticle: async (id: string, articleData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put<Article>(`/articles/${id}`, articleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state) => ({
        articles: state.articles.map((a) => (a.id.toString() === id ? response.data : a)),
        currentArticle: response.data,
        isLoading: false,
      }));
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || '更新文章失败';
      set({ error: errorMessage, isLoading: false });
      return undefined;
    }
  },

  // 删除文章
  deleteArticle: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/articles/${id}`);
      set((state) => ({
        articles: state.articles.filter((a) => a.id.toString() !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      const errorMessage = err.message || '删除文章失败';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearCurrentArticle: () => {
    set({ currentArticle: null });
  }
}));

export default useArticleStore; 