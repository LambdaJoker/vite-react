/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: Do not edit
 * @Date: 2025-02-15 13:21:42
 * @LastEditTime: 2025-06-19 10:40:00
 */
/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: Do not edit
 * @Date: 2025-04-28 20:45:53
 * @LastEditTime: 2025-06-18 23:07:40
 */
import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useArticleStore from '../../store/articleStore'; // 修正路径
import useAppStore from '../../store/appStore'; // 修正路径
import MarkdownRenderer from '../../common/MarkdownRenderer'; // 导入新的渲染器
import './index.css';
import 'github-markdown-css/github-markdown.css';
import SEO from '../../common/SEO';
import SkeletonLoader from '../../skeletonLoader'; // 引入骨架加载器
import { getImageUrl } from '../../../utils/helpers';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';

const ArticleDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isReadOnly } = useAppStore(); // 获取只读状态
  const {
    currentArticle: article,
    comments,
    isLoading,
    error,
    fetchArticle,
    deleteArticle,
    clearCurrentArticle,
    likeArticle,
    fetchComments,
    addComment,
    deleteComment,
    likeComment
  } = useArticleStore();

  const [hasLiked, setHasLiked] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: number; author: string } | null>(null);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (id) {
      setIsInitialLoad(true);
      Promise.all([
        fetchArticle(id),
        fetchComments(id)
      ]).finally(() => {
        setIsInitialLoad(false);
      });
      // 检查本地存储中是否已经点过赞
      const liked = localStorage.getItem(`liked_article_${id}`);
      if (liked) {
        setHasLiked(true);
      }
    }
    // 组件卸载时清除当前文章数据
    return () => {
      clearCurrentArticle();
    };
  }, [id, fetchArticle, fetchComments, clearCurrentArticle]);

  const handleDelete = async () => {
    if (id && window.confirm('你确定要删除这篇文章吗？')) {
      await deleteArticle(id);
      navigate('/articles');
    }
  };

  const handleLike = async () => {
    if (id && !hasLiked) {
      await likeArticle(id);
      setHasLiked(true);
      localStorage.setItem(`liked_article_${id}`, 'true');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentContent.trim() || !commentAuthor.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(id, commentContent, commentAuthor, replyTo?.id);
      setCommentContent('');
      setReplyTo(null);
      // 可选：保留作者名以便下次评论
    } catch (err) {
      alert('评论失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('确定要删除这条评论吗？')) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        alert('删除评论失败');
      }
    }
  };

  const handleLikeComment = async (commentId: number) => {
    const liked = localStorage.getItem(`liked_comment_${commentId}`);
    if (!liked) {
      await likeComment(commentId);
      localStorage.setItem(`liked_comment_${commentId}`, 'true');
    }
  };

  // 组织评论树结构
  const commentTree = comments.filter(c => !c.parent_id).map(c => ({
    ...c,
    replies: comments.filter(reply => reply.parent_id === c.id)
  }));

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (isInitialLoad || isLoading) {
    return (
      <div className="article-detail-container">
        <SkeletonLoader type="title" />
        <SkeletonLoader type="text" count={5} />
      </div>
    );
  }

  if (!article || article.id.toString() !== id) {
    return <div className="article-not-found">文章未找到</div>;
  }

  const seoDescription = article.content ? article.content.replace(/<[^>]+>/g, '').slice(0, 200) : '';

  return (
    <>
      <SEO
        title={`${article.title} - 我的博客`}
        description={seoDescription}
        keywords={article.category}
        type="article"
        image={getImageUrl(article.image)}
      />
      <div className="article-detail-container">
        <div className="article-cover" style={{ backgroundImage: `url(${getImageUrl(article.image)})` }}></div>
        <div className="article-header">
          <div className="article-info">
            <h1>{article.title}</h1>
            <div className="article-meta">
              <span className="author">作者：{article.author}</span>
              <span className="date">发布于：{article.date}</span>
              <span className="category">{article.category}</span>
              <span className="read-count">阅读次数：{article.read_count}</span>
            </div>
          </div>
        </div>

        <div className="article-content markdown-body">
          <MarkdownRenderer>{article.content}</MarkdownRenderer>
        </div>

        {/* 目录栏：自动提取 Markdown 中的 h2 和 h3 */}
        {article.content && (
          <div className="table-of-contents">
            <h4 className="toc-title">目录</h4>
            <ul className="toc-list">
              {Array.from(article.content.matchAll(/^(##|###)\s+([^\r\n]+)/gm)).map((match, index) => {
                const level = match[1].length; // 2 for h2, 3 for h3
                const title = match[2].trim();
                // 简单的 hash 生成（需要与渲染出的 id 对应，如果有的话，这里做简单锚点或仅展示）
                return (
                  <li key={index} className={`toc-item level-${level}`}>
                    <a 
                      href={`#${title.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={(e) => {
                        e.preventDefault();
                        // 寻找匹配的标题元素并平滑滚动
                        const headings = document.querySelectorAll('.markdown-body h2, .markdown-body h3');
                        for (const heading of headings) {
                          if (heading.textContent?.trim() === title) {
                            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            break;
                          }
                        }
                      }}
                    >
                      {title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="article-footer">
          <div className="tags">
            {article.tags?.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          {/* 只有在非只读模式下才显示操作按钮 */}
          {!isReadOnly && (
            <div className="action-buttons">
              <Link to={`/articles/${id}/edit`} className="action-button edit-button">
                编辑
              </Link>
              <button onClick={handleDelete} className="action-button delete-button">
                删除
              </button>
            </div>
          )}
        </div>

        {/* 文章底部导航 */}
        <div className="article-navigation">
          <div className="nav-item prev">
            {article.prevArticle ? (
              <Link to={`/articles/${article.prevArticle.id}`} className="nav-link">
                <span className="nav-label">← 上一篇</span>
                <span className="nav-title">{article.prevArticle.title}</span>
              </Link>
            ) : (
              <div className="nav-empty">
                <span className="nav-label">← 上一篇</span>
                <span className="nav-title">已经是第一篇了</span>
              </div>
            )}
          </div>
          <div className="nav-item next">
            {article.nextArticle ? (
              <Link to={`/articles/${article.nextArticle.id}`} className="nav-link">
                <span className="nav-label">下一篇 →</span>
                <span className="nav-title">{article.nextArticle.title}</span>
              </Link>
            ) : (
              <div className="nav-empty">
                <span className="nav-label">下一篇 →</span>
                <span className="nav-title">已经是最后一篇了</span>
              </div>
            )}
          </div>
        </div>

        {/* 评论区 */}
        <div className="comments-section">
          <h3>评论 ({comments.length})</h3>
          
          {/* 评论列表 */}
          <div className="comments-list">
            {commentTree.length > 0 ? (
              commentTree.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <img 
                      src={`https://api.dicebear.com/7.x/identicon/svg?seed=${comment.author}`} 
                      alt="avatar" 
                      className="comment-avatar" 
                    />
                    <div className="comment-info-top">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-date">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="comment-content">
                    <MarkdownRenderer>{comment.content}</MarkdownRenderer>
                  </div>
                  <div className="comment-actions">
                    <button 
                      className="comment-action-btn"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <FaHeart className={localStorage.getItem(`liked_comment_${comment.id}`) ? 'liked' : ''} /> 
                      {comment.likes > 0 && <span>{comment.likes}</span>}
                    </button>
                    <button 
                      className="comment-action-btn"
                      onClick={() => setReplyTo({ id: comment.id, author: comment.author })}
                    >
                      回复
                    </button>
                    {!isReadOnly && (
                      <button 
                        className="comment-action-btn delete"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        删除
                      </button>
                    )}
                  </div>

                  {/* 回复列表 */}
                  {comment.replies.length > 0 && (
                    <div className="comment-replies">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="reply-item">
                          <div className="comment-header">
                            <img 
                              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${reply.author}`} 
                              alt="avatar" 
                              className="comment-avatar small" 
                            />
                            <div className="comment-info-top">
                              <span className="comment-author">{reply.author}</span>
                              <span className="reply-badge">回复了 {comment.author}</span>
                              <span className="comment-date">
                                {new Date(reply.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="comment-content">
                            <MarkdownRenderer>{reply.content}</MarkdownRenderer>
                          </div>
                          <div className="comment-actions">
                            <button 
                              className="comment-action-btn"
                              onClick={() => handleLikeComment(reply.id)}
                            >
                              <FaHeart className={localStorage.getItem(`liked_comment_${reply.id}`) ? 'liked' : ''} /> 
                              {reply.likes > 0 && <span>{reply.likes}</span>}
                            </button>
                            {!isReadOnly && (
                              <button 
                                className="comment-action-btn delete"
                                onClick={() => handleDeleteComment(reply.id)}
                              >
                                删除
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-comments">暂无评论，快来抢沙发吧！</div>
            )}
          </div>

          {/* 评论表单 */}
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            {replyTo && (
              <div className="reply-to-banner">
                <span>回复 @{replyTo.author}</span>
                <button type="button" onClick={() => setReplyTo(null)}>取消回复</button>
              </div>
            )}
            <input
              type="text"
              placeholder="你的昵称"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              required
              className="comment-input"
            />
            <textarea
              placeholder={replyTo ? "写下你的回复..." : "写下你的评论..."}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
              className="comment-textarea"
              rows={4}
            />
            <button type="submit" disabled={isSubmitting} className="comment-submit-btn">
              {isSubmitting ? '提交中...' : '发表评论'}
            </button>
          </form>
        </div>

      </div>
    </>
  );
};

export default ArticleDetail; 