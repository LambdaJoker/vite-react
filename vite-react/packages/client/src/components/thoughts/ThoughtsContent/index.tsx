import { FC, useState, useMemo, useEffect } from 'react';
import './index.css';
import SEO from '../../common/SEO';
import ScrollToTopButton from '../../common/ScrollToTopButton';
import { thoughtsData } from '../data';

const ThoughtsContent: FC = () => {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [isAnimated, setIsAnimated] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const categories = useMemo(() => {
    return ['全部', ...new Set(thoughtsData.map(t => t.category))];
  }, []);

  const filteredThoughts = useMemo(() => {
    return thoughtsData.filter(thought => {
      return activeCategory === '全部' || thought.category === activeCategory;
    });
  }, [activeCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <>
      <SEO 
        title="观点与思考 | Random Glow" 
        description="记录我在软件开发、架构设计以及个人成长过程中的思考与沉淀。" 
      />
      <div className={`thoughts-container ${isAnimated ? 'animated' : ''}`}>
        <div className="thoughts-header">
          <h1>观点与思考</h1>
          <p className="subtitle">代码之外的沉淀，关于技术、设计与生活的备忘录</p>
        </div>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="thoughts-timeline">
          {filteredThoughts.map((thought, index) => (
            <div 
              key={thought.id} 
              className={`thought-card ${expandedId === thought.id ? 'expanded' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="thought-meta">
                <span className="thought-date">{thought.date}</span>
                <span className="thought-category-badge">{thought.category}</span>
              </div>
              
              <div className="thought-content-wrapper" onClick={() => toggleExpand(thought.id)}>
                <h2>{thought.title}</h2>
                <p className="thought-summary">{thought.summary}</p>
                
                <div className="thought-full-content">
                  {thought.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                
                <button className="expand-btn">
                  {expandedId === thought.id ? '收起 ↑' : '阅读全文 ↓'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <ScrollToTopButton />
      </div>
    </>
  );
};

export default ThoughtsContent;