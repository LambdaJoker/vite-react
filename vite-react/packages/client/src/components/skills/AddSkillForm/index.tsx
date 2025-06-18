import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '../../../api/apiClient';
import Notification from '../../notification';
import './index.css';

interface AddSkillFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddSkillForm: FC<AddSkillFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    skill_name: '',
    proficiency: 0,
    description: '',
    categories: [] as string[],
    icon: ''
  });

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewIcon, setPreviewIcon] = useState<string>('');

  // 获取可用的技能分类
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<string[]>('/skills/categories');
        setAvailableCategories(response.data);
      } catch (error) {
        console.error('获取分类失败:', error);
        setError('获取分类失败');
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'icon') {
      setPreviewIcon(value);
    }
  };

  const handleProficiencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    setFormData(prev => ({
      ...prev,
      proficiency: value
    }));
    // 更新进度条背景
    e.target.style.setProperty('--value', `${value}%`);
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 验证表单
      if (!formData.skill_name.trim()) {
        throw new Error('技能名称不能为空');
      }
      if (formData.categories.length === 0) {
        throw new Error('请至少选择一个分类');
      }
      if (formData.proficiency < 0 || formData.proficiency > 100) {
        throw new Error('掌握程度必须在0-100之间');
      }

      // 提交数据
      await apiClient.post('/skills', formData);
      onSuccess();
    } catch (error) {
      console.error('添加技能失败:', error);
      setError(error instanceof Error ? error.message : '添加技能失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 在组件挂载时初始化进度条值
  useEffect(() => {
    const rangeInput = document.querySelector('input[type="range"]') as HTMLInputElement;
    if (rangeInput) {
      rangeInput.style.setProperty('--value', `${formData.proficiency}%`);
    }
  }, [formData.proficiency]);

  return (
    <div className="add-skill-form-container">
      <form onSubmit={handleSubmit} className="add-skill-form">
        <h2>添加新技能</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="skill_name">技能名称</label>
          <input
            type="text"
            id="skill_name"
            name="skill_name"
            value={formData.skill_name}
            onChange={handleInputChange}
            placeholder="输入技能名称"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="icon">图标名称</label>
          <div className="icon-input-container">
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              placeholder="输入 Material Icons 名称 (例如: code)"
            />
            {previewIcon && (
              <div className="icon-preview">
                <i className="material-icons">{previewIcon}</i>
              </div>
            )}
          </div>
          <small className="icon-hint">
            访问 <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer">
              Material Icons
            </a> 查找图标名称
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="proficiency">掌握程度 ({formData.proficiency}%)</label>
          <input
            type="range"
            id="proficiency"
            name="proficiency"
            min="0"
            max="100"
            value={formData.proficiency}
            onChange={handleProficiencyChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">技能描述</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="描述这个技能..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>技能分类</label>
          <div className="categories-grid">
            {availableCategories.map(category => (
              <label key={category} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={formData.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            取消
          </button>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? '添加中...' : '添加技能'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSkillForm; 