import { FC, memo } from 'react';
import { Link } from 'react-router-dom';

const bookmarks = [
  { icon: '🌊', title: 'UI & 设计', description: 'Tailwind UI, Framer Motion, Dribbble...' },
  { icon: '⚡', title: '效率工具', description: 'Raycast, Vercel, Sentry, Transform...' },
  { icon: '⚛️', title: '开源轮子', description: 'Zustand, React Query, Vite...' },
  { icon: '📖', title: '技术沉淀', description: 'MDN, React Docs, Web.dev...' },
];

const BookmarksPreview: FC = () => {
  return (
    <section className="skills-preview bookmarks-preview">
      <h2>推荐资源</h2>
      <div className="skills-grid bookmarks-grid-preview">
        {bookmarks.map((b) => (
          <div className="skill-area bookmark-area" key={b.title}>
            <span className="skill-icon bookmark-icon-preview">{b.icon}</span>
            <h3>{b.title}</h3>
            <p>{b.description}</p>
          </div>
        ))}
      </div>
      <Link to="/bookmarks" className="view-all-button">查看完整收藏</Link>
    </section>
  );
};

export default memo(BookmarksPreview);
