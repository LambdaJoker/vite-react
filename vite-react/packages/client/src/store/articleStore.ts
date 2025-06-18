import { create } from 'zustand';
import apiClient from '../api/apiClient'; // 引入封装好的 apiClient

// 定义文章和 Store 的类型
interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  read_count: number;
  author: string;
  tags: string[];
}

interface ArticleState {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  fetchArticles: () => Promise<void>;
}

// 创建 Store
const useArticleStore = create<ArticleState>((set) => ({
  articles: [],
  isLoading: true,
  error: null,

  // 异步获取文章数据的 action
  fetchArticles: async () => {
    set({ isLoading: true, error: null });
    try {
      // 使用 apiClient 发起请求，现在它返回完整的 AxiosResponse
      const response = await apiClient.get<Article[]>('/articles');
      set({ articles: response.data, isLoading: false }); // 从 response.data 中获取文章数组
    } catch (err: any) {
      const errorMessage = err.message || '获取文章列表失败';
      set({ error: errorMessage, isLoading: false, articles: [] }); // 确保在出错时 articles 是空数组
    }
  },
}));

export default useArticleStore; 