import React, { FC, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import apiClient from '../../../api/apiClient';
import Notification from '../../notification';
import './index.css';

interface EditSkillFormProps {
  skill: {
    id: number;
    name: string;
    level: number;
    description: string;
    categories: string[];
    icon: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface ApiSkillData {
  skill_id?: number;
  skill_name: string;
  proficiency: number;
  description: string;
  icon: string;
  projects?: string;
  created_at?: string;
  updated_at?: string;
  categories: string[];
}

const EditSkillForm: FC<EditSkillFormProps> = ({ skill, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    id: skill.id,
    name: skill.name,
    level: skill.level,
    description: skill.description,
    categories: skill.categories,
    icon: skill.icon
  });

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    setFormData(prev => ({
      ...prev,
      level: value
    }));
    // 更新进度条背景
    e.target.style.setProperty('--value', `${value}%`);
  };

  // 在组件挂载时初始化进度条值
  useEffect(() => {
    const rangeInput = document.querySelector('input[type="range"]') as HTMLInputElement;
    if (rangeInput) {
      rangeInput.style.setProperty('--value', `${formData.level}%`);
    }
  }, [formData.level]);

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
    setIsLoading(true);

    try {
      // 表单验证
      if (!formData.name.trim()) {
        throw new Error('技能名称不能为空');
      }
      if (!formData.categories || formData.categories.length === 0) {
        throw new Error('请至少选择一个分类');
      }
      if (formData.level < 0 || formData.level > 100) {
        throw new Error('熟练度必须在0-100之间');
      }

      // 转换为API格式
      const apiData = {
        skill_name: formData.name,
        proficiency: formData.level,
        description: formData.description,
        icon: formData.icon,
        categories: formData.categories
      };

      console.log('发送更新请求，数据:', apiData);
      await apiClient.put(`/skills/${formData.id}`, apiData);
      console.log('更新技能返回数据:', apiData);

      onSuccess?.();
    } catch (error) {
      console.error('更新技能失败:', error);
      let errorMessage = '更新失败，请稍后重试';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          errorMessage = '找不到要更新的技能';
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data.message || '请求数据格式错误';
        } else {
          errorMessage = error.response?.data?.message || '服务器错误，请稍后重试';
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-skill-form-container">
      <form onSubmit={handleSubmit} className="edit-skill-form">
        <h2>编辑技能</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">技能名称</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="输入技能名称"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="level">掌握程度 ({formData.level}%)</label>
          <input
            type="range"
            id="level"
            name="level"
            min="0"
            max="100"
            value={formData.level}
            onChange={handleLevelChange}
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

        <div className="form-group">
          <label htmlFor="icon">技能图标</label>
          <input
            type="text"
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleInputChange}
            placeholder="输入emoji图标"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            取消
          </button>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? '保存中...' : '保存修改'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSkillForm; 