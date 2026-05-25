import defaultCover from '../assets/default-cover.svg';
import databaseCover from '../assets/img/article/database-cover.svg';
import aiAgentCover from '../assets/img/article/ai-agent-cover.svg';
import aiContextCover from '../assets/img/article/ai-context-cover.svg';
import aiRagCover from '../assets/img/article/ai-rag-cover.svg';
import aiSeriesCover from '../assets/img/article/ai-series-cover.svg';
import nodeCover from '../assets/img/article/node-cover.svg';
import reactCover from '../assets/img/article/react-cover.svg';
import vueCover from '../assets/img/article/vue-cover.svg';

const articleImageMap: Record<string, string> = {
  '/src/assets/article1.jpg': reactCover,
  '/src/assets/img/article/article1.jpg': reactCover,
  '/src/assets/img/article/react-cover.svg': reactCover,
  '/src/assets/img/article/vue-cover.svg': vueCover,
  '/src/assets/img/article/node-cover.svg': nodeCover,
  '/src/assets/img/article/database-cover.svg': databaseCover,
  '/src/assets/img/article/ai-series-cover.svg': aiSeriesCover,
  '/src/assets/img/article/ai-agent-cover.svg': aiAgentCover,
  '/src/assets/img/article/ai-rag-cover.svg': aiRagCover,
  '/src/assets/img/article/ai-context-cover.svg': aiContextCover
};

export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return defaultCover;
  if (articleImageMap[imagePath]) return articleImageMap[imagePath];
  if (imagePath.startsWith('/src/')) return imagePath;
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  return `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
};

export const createExcerpt = (content: string): string => {
  if (!content) {
    return '暂无简介';
  }
  // 使用临时div去除HTML标签
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const text = tempDiv.textContent || '';
  if (!text.trim()) {
    return '暂无简介';
  }

  // 将文本分割成句子
  const sentences = text.split(/(?<=[。？！.!?])\s+/).filter(Boolean);

  // 如果没有识别出句子，则直接按字数截断
  if (sentences.length === 0) {
    return text.length > 20 ? text.substring(0, 20) + '...' : text;
  }

  // 取第一句话
  let firstSentence = sentences[0];

  // 如果第一句话超过20个字，截断
  if (firstSentence.length > 20) {
    firstSentence = firstSentence.substring(0, 20) + '...';
  }
  // 如果原文还有更多句子，但第一句话没超过20字，也要加上省略号
  else if (sentences.length > 1) {
    firstSentence += '...';
  }

  return firstSentence;
};

export const plainTextExcerpt = (content: string | undefined | null, maxLength = 120): string => {
  if (!content) return '';

  const text = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_>#~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
};

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
} 
