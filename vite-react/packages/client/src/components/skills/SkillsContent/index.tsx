/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: 技能栈
 * @Date: 2025-02-15 13:43:50
 * @LastEditTime: 2025-06-18 20:05:29
 */
import { FC, useState, useEffect, useRef } from 'react';
import './index.css';
import Notification from '../../notification';
import SEO from '../../common/SEO';
import SkeletonLoader from '../../skeletonLoader';
import apiClient from '../../../api/apiClient'; // 修正路径
import AddSkillForm from '../AddSkillForm';
import EditSkillForm from '../EditSkillForm';
import ScrollToTopButton from '../../common/ScrollToTopButton';

interface Skill {
  // 技能ID
  id: number;
  // 技能所属分类
  categories: string[];
  // 技能名称
  name: string;
  // 掌握程度 (0-100)
  level: number;
  // 技能图标
  icon: string;
  // 技能描述
  description: string;
  // 相关项目列表
  projects?: string[];
}

interface NotificationItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ApiSkillData {
  skill_id: number;
  skill_name: string;
  proficiency: number;
  description: string;
  icon: string;
  projects?: string;
  categories: string; // 从API返回的分类字符串
}

const SkillsContent: FC = () => {
  // 状态管理
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [categories, setCategories] = useState<string[]>([]);
  const [skillStats, setSkillStats] = useState({
    totalSkills: 0,
    averageLevel: 0,
    expertiseAreas: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // 获取技能数据
  const fetchSkills = async () => {
    try {
      const skillsResponse = await apiClient.get<any[]>('/skills');
      if (!skillsResponse.data || !Array.isArray(skillsResponse.data)) {
        throw new Error('无效的API响应格式');
      }

      const categoriesResponse = await apiClient.get<string[]>('/skills/categories');
      if (!categoriesResponse.data || !Array.isArray(categoriesResponse.data)) {
        throw new Error('无效的分类数据格式');
      }

      // 转换数据格式
      const transformedSkills: Skill[] = skillsResponse.data.map((skill: any) => ({
        id: skill.skill_id,
        name: skill.skill_name,
        level: skill.proficiency,
        icon: skill.icon,
        description: skill.description,
        projects: skill.projects,
        categories: Array.isArray(skill.categories) ? skill.categories : []
      }));

      setSkills(transformedSkills);
      setCategories(['全部', ...categoriesResponse.data]);
      setIsLoading(false);
    } catch (error) {
      console.error('获取技能数据失败:', error);
      const errorMessage = (error as any)?.message || '技能数据加载失败，请稍后重试';
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: errorMessage,
        type: 'error'
      }]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // 计算统计数据
  useEffect(() => {
    if (skills.length > 0) {
      const total = skills.length;
      const average = Math.round(skills.reduce((acc, curr) => acc + curr.level, 0) / total);
      const expertise = new Set(skills.flatMap(skill => skill.categories)).size;

      setSkillStats({
        totalSkills: total,
        averageLevel: average,
        expertiseAreas: expertise
      });
    }
  }, [skills]);

  // 处理分类点击
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);

    // 重置搜索词
    setSearchTerm('');
    // 清空搜索输入框
    const searchInput = document.querySelector('input[name="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }

    // 添加切换通知
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `已切换到${category === '全部' ? '所有技能' : category}分类`,
      type: 'success'
    }]);
  };

  // 过滤并排序技能列表
  const filteredSkills = skills
    .filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === '全部' || skill.categories.includes(activeCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.level - a.level);

  // 4. useEffect hooks
  useEffect(() => {
    setIsAnimated(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // 处理搜索输入，使用防抖优化
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // 只更新输入框的值，不触发搜索
    event.target.value = value;
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
  };

  // 处理搜索提交
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = (event.currentTarget.elements.namedItem('search') as HTMLInputElement).value;

    // 更新搜索词
    setSearchTerm(value);

    // 添加搜索通知
    if (value) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `正在搜索: ${value}`,
        type: 'info'
      }]);
    }
  };

  // 2. useRef hooks
  const searchTimeout = useRef<number | undefined>(undefined);

  // 处理添加技能成功
  const handleAddSuccess = () => {
    setShowAddForm(false);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: '技能添加成功',
      type: 'success'
    }]);
    // 重新获取技能列表
    fetchSkills();
  };

  // 处理取消添加
  const handleAddCancel = () => {
    setShowAddForm(false);
  };

  // 处理编辑技能
  const handleEdit = (skill: Skill) => {
    console.log('准备编辑技能:', skill);
    setEditingSkill(skill); // 直接设置要编辑的技能
  };

  // 处理编辑技能成功
  const handleEditSuccess = async () => {
    setEditingSkill(null);
    await fetchSkills();
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: '技能更新成功！',
      type: 'success'
    }]);
  };

  // 处理取消编辑
  const handleEditCancel = () => {
    setEditingSkill(null);
  };

  // 处理删除技能
  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/skills/${id}`);
      await fetchSkills();
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: '技能删除成功',
        type: 'success'
      }]);
    } catch (error) {
      console.error('删除技能失败:', error);
      const errorMessage = (error as any)?.message || '删除失败，请重试';
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: errorMessage,
        type: 'error'
      }]);
    }
  };

  // 加载状态的骨架屏渲染
  if (isLoading) {
    return (
      <div className={`skills-container ${isAnimated ? 'animated' : ''}`}>
        <div className="skills-header">
          <SkeletonLoader type="title" />
          <div className="skill-stats">
            {/* 统计数据的骨架屏 */}
            <div className="stat-item">
              <SkeletonLoader type="text" width="80px" height="40px" />
              <SkeletonLoader type="text" width="60px" height="20px" />
            </div>
            {/* ... 其他统计项的骨架屏 ... */}
          </div>
        </div>
        <div className="skills-grid">
          <SkeletonLoader type="card" count={6} />
        </div>
      </div>
    );
  }

  // 技能卡片渲染函数
  const renderSkillCard = (skill: Skill) => (
    <div key={skill.id} className="skill-card" data-level={skill.level >= 85 ? 'expert' : skill.level >= 70 ? 'advanced' : 'intermediate'}>
      {/* 技能头部：图标和名称 */}
      <div className="skill-header">
        <span className="skill-icon">{skill.icon}</span>
        <h3>{skill.name}</h3>
        {/* 技能掌握度进度条 */}
        <div className="skill-level">
          <div
            className="level-bar"
            style={{ width: `${skill.level}%` }}
          >
            <span className="level-text">{skill.level}%</span>
          </div>
        </div>
      </div>
      {/* 技能描述 */}
      <p className="skill-description">{skill.description}</p>
      {/* 相关项目列表（如果有） */}
      {Array.isArray(skill.projects) && skill.projects.length > 0 && (
        <div className="skill-projects">
          <h4>相关项目:</h4>
          <ul>
            {skill.projects.map((project, index) => (
              <li key={index}>{project}</li>
            ))}
          </ul>
        </div>
      )}
      {/* 技能等级标签 */}
      <div className="skill-level-badge">
        {skill.level >= 85 ? '熟练' : skill.level >= 70 ? '进阶' : '了解'}
      </div>
      <div className="skill-actions">
        <button
          onClick={() => handleEdit(skill)}
          className="edit-button"
        >
          编辑
        </button>
        <button
          onClick={() => handleDelete(skill.id)}
          className="delete-button"
        >
          删除
        </button>
      </div>
    </div>
  );

  // 页脚区域渲染函数
  const renderFooter = () => (
    <div className="skills-footer">
      <div className="experience-summary">
        <h2>技术经验总结</h2>
        <p>3年+前端开发经验，专注于现代Web技术和大数据处理。持续学习新技术，追求代码质量和性能优化。</p>
        {/* 当前学习状态展示 */}
        <div className="learning-status">
          <h3>当前学习中</h3>
          <div className="learning-tags">
            <span className="learning-tag">Docker</span>
            <span className="learning-tag">MongoDB</span>
            <span className="learning-tag">GraphQL</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* SEO 优化组件，设置页面元数据 */}
      <SEO
        title="技能栈 - 我的个人博客"
        description="查看我的技术栈和专业技能"
        keywords="技术栈,前端开发,后端开发,全栈开发"
      />

      {/* 通知消息容器，显示分类切换等操作的反馈 */}
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            style={{ top: `${70 + index * 70}px` }}
            onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
          />
        ))}
      </div>

      {/* 添加技能表单 */}
      {showAddForm && (
        <AddSkillForm
          onSuccess={handleAddSuccess}
          onCancel={handleAddCancel}
        />
      )}

      {/* 编辑技能表单 */}
      {editingSkill && (
        <EditSkillForm
          skill={editingSkill}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      )}

      {/* 主要内容容器，支持动画效果 */}
      <div className={`skills-container ${isAnimated ? 'animated' : ''}`}>
        {/* 页面头部：标题和统计信息 */}
        <div className="skills-header">
          <h1>技术栈</h1>
          <p className="subtitle">探索我的技术领域和专长</p>
          {/* 添加技能按钮 */}
          <button
            className="add-skill-button"
            onClick={() => setShowAddForm(true)}
          >
            添加新技能
          </button>
          {/* 技能统计数据展示区域 */}
          <div className="skill-stats">
            {/* 总技能数量统计 */}
            <div className="stat-item">
              <span className="stat-number">{skillStats.totalSkills}</span>
              <span className="stat-label">技能总数</span>
            </div>
            {/* 平均掌握度统计 */}
            <div className="stat-item">
              <span className="stat-number">{skillStats.averageLevel}%</span>
              <span className="stat-label">平均掌握度</span>
            </div>
            {/* 专业领域数量统计 */}
            <div className="stat-item">
              <span className="stat-number">{skillStats.expertiseAreas}</span>
              <span className="stat-label">专业领域</span>
            </div>
          </div>
        </div>

        {/* 搜索和过滤区域 */}
        <div className="search-filter-container">
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              name="search"
              placeholder="搜索技能..."
              onChange={handleSearchInput}
              className="search-input"
              aria-label="搜索技能"
            />
            <button type="submit" className="search-button">
              搜索
            </button>
          </form>
          {/* 分类过滤按钮组 */}
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-button ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
                aria-pressed={activeCategory === category}
                aria-label={`过滤${category}类别的技能`}
              >
                {category}
                {/* 显示该分类下的技能数量 */}
                <span className="category-count" aria-hidden="true">
                  {category === "全部" ? skills.length :
                    skills.filter(skill => skill.categories.includes(category)).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 技能卡片网格展示区域 */}
        <div className="skills-grid">
          {filteredSkills.map(skill => renderSkillCard(skill))}
        </div>

        {/* 页脚：经验总结和学习状态 */}
        {renderFooter()}
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default SkillsContent;