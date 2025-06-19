import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import useArticleStore from '../../store/articleStore';
import './index.css'; // 修正路径

// 这是一个针对 react-quill 和 Vite/TypeScript 常见问题的解决方法。
// 它能确保我们无论模块如何导出，都能获取到正确的组件。
const ReactQuill = (RQuill as any).default ?? RQuill;

interface ArticleFormProps {
  mode: 'create' | 'edit';
}

const ArticleForm: FC<ArticleFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // 使用 useNavigate
  const {
    createArticle,
    updateArticle,
    fetchArticle,
    currentArticle,
    isLoading,
    error,
    clearCurrentArticle
  } = useArticleStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('LambdaJoker');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchArticle(id);
    }
    // Cleanup when component unmounts or mode changes
    return () => {
      clearCurrentArticle();
    };
  }, [id, mode, fetchArticle, clearCurrentArticle]);

  useEffect(() => {
    if (mode === 'edit' && currentArticle) {
      setTitle(currentArticle.title);
      setContent(currentArticle.content);
      setCategory(currentArticle.category);
      setTags(currentArticle.tags.join(', '));
      if (currentArticle.image) {
        // Assuming the image path from backend can be directly used
        setImagePreview(`${import.meta.env.VITE_API_BASE_URL}${currentArticle.image}`);
      }
      if (currentArticle.author) {
        setAuthor(currentArticle.author);
      }
    }
  }, [currentArticle, mode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', tags); // Send as a comma-separated string
    formData.append('author', author);
    if (image) {
      formData.append('image', image);
    }

    let result;
    if (mode === 'create') {
      result = await createArticle(formData);
    } else if (id) {
      result = await updateArticle(id, formData);
    }

    if (result) {
      navigate(`/articles/${result.id}`); // 使用 navigate
    }
  };

  return (
    <div className="article-form-container">
      <h2>{mode === 'create' ? '创建新文章' : '编辑文章'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label htmlFor="title">标题</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">作者 (管理员)</label>
          <input
            id="author"
            type="text"
            value={author}
            readOnly
            className="readonly-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">分类</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">标签 (用逗号分隔)</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">封面图片</label>
          <input
            id="image"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="封面预览" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>内容</label>
          <ReactQuill value={content} onChange={setContent} theme="snow" />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? '提交中...' : (mode === 'create' ? '创建' : '更新')}
        </button>
      </form>
    </div>
  );
};

export default ArticleForm; 