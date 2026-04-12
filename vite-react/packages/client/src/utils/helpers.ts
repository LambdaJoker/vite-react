import defaultCover from '../assets/default-cover.svg';

export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return defaultCover;
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