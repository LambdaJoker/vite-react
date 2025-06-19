export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/src/assets/img/article/article1.jpg'; // 提供一个默认图片
  if (imagePath.startsWith('/src/')) return imagePath;
  if (imagePath.startsWith('http')) return imagePath;
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