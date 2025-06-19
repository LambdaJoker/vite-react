import React, { FC, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '../../../api/apiClient';
import './index.css';

const skillSchema = z.object({
  skill_name: z.string().min(1, '技能名称不能为空'),
  proficiency: z.number().min(0, '熟练度不能小于0').max(100, '熟练度不能大于100'),
  description: z.string().optional(),
  categories: z.array(z.string()).min(1, '请至少选择一个分类'),
  icon: z.string().optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillFormProps {
  skill?: SkillFormData & { id?: number };
  onSuccess: () => void;
  onCancel: () => void;
}

const SkillForm: FC<SkillFormProps> = ({ skill, onSuccess, onCancel }) => {
  const isEditMode = !!skill;
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill_name: skill?.skill_name || '',
      proficiency: skill?.proficiency || 0,
      description: skill?.description || '',
      categories: skill?.categories || [],
      icon: skill?.icon || '',
    },
  });

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string>('');
  const previewIcon = watch('icon');
  const proficiencyValue = watch('proficiency');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<string[]>('/skills/categories');
        setAvailableCategories(response.data);
      } catch (error) {
        console.error('获取分类失败:', error);
        setApiError('获取分类失败');
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: SkillFormData) => {
    setApiError('');
    try {
      if (isEditMode) {
        await apiClient.put(`/skills/${skill.id}`, data);
      } else {
        await apiClient.post('/skills', data);
      }
      onSuccess();
    } catch (error: any) {
      console.error('操作失败:', error);
      setApiError(error.response?.data?.message || (isEditMode ? '更新失败' : '添加失败'));
    }
  };

  return (
    <div className="skill-form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="skill-form">
        <h2>{isEditMode ? '编辑技能' : '添加新技能'}</h2>

        {apiError && <div className="error-message">{apiError}</div>}

        <div className="form-group">
          <label htmlFor="skill_name">技能名称</label>
          <Controller
            name="skill_name"
            control={control}
            render={({ field }) => (
              <input {...field} type="text" placeholder="输入技能名称" />
            )}
          />
          {errors.skill_name && <p className="error-text">{errors.skill_name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="icon">图标名称</label>
          <div className="icon-input-container">
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <input {...field} type="text" placeholder="输入 Material Icons 名称" />
              )}
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
          {errors.icon && <p className="error-text">{errors.icon.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="proficiency">掌握程度 ({proficiencyValue}%)</label>
          <Controller
            name="proficiency"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="range"
                min="0"
                max="100"
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          {errors.proficiency && <p className="error-text">{errors.proficiency.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="description">技能描述</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea {...field} placeholder="描述这个技能..." rows={4} />
            )}
          />
          {errors.description && <p className="error-text">{errors.description.message}</p>}
        </div>

        <div className="form-group">
          <label>技能分类</label>
          <div className="categories-grid">
            {availableCategories.map((category) => (
              <Controller
                key={category}
                name="categories"
                control={control}
                render={({ field }) => (
                  <label className="category-checkbox">
                    <input
                      type="checkbox"
                      checked={field.value.includes(category)}
                      onChange={() => {
                        const newCategories = field.value.includes(category)
                          ? field.value.filter((c) => c !== category)
                          : [...field.value, category];
                        field.onChange(newCategories);
                      }}
                    />
                    {category}
                  </label>
                )}
              />
            ))}
          </div>
          {errors.categories && <p className="error-text">{errors.categories.message}</p>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            取消
          </button>
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : (isEditMode ? '保存修改' : '添加技能')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm; 