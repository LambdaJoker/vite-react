/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-06-19 10:13:58
 * @LastEditTime: 2025-06-19 10:14:13
 */
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import { Skill, NotificationItem } from './types';

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    try {
      const skillsResponse = await apiClient.get<any[]>('/skills');

      if (!skillsResponse.data || !Array.isArray(skillsResponse.data)) {
        console.error('Invalid skills data:', skillsResponse.data);
        throw new Error('无效的API响应格式');
      }

      const categoriesResponse = await apiClient.get<string[]>('/skills/categories');

      if (!categoriesResponse.data || !Array.isArray(categoriesResponse.data)) {
        console.error('Invalid categories data:', categoriesResponse.data);
        throw new Error('无效的分类数据格式');
      }

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
    } catch (error) {
      console.error('获取技能数据失败:', error);
      const errorMessage = (error as any)?.message || '技能数据加载失败，请稍后重试';
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: errorMessage,
        type: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  };

  const deleteSkill = async (id: number) => {
    try {
      await apiClient.delete(`/skills/${id}`);
      await fetchSkills();
      addNotification('技能删除成功', 'success');
    } catch (error) {
      console.error('删除技能失败:', error);
      const errorMessage = (error as any)?.message || '删除失败，请重试';
      addNotification(errorMessage, 'error');
    }
  };

  return { skills, isLoading, notifications, categories, fetchSkills, deleteSkill, addNotification, setNotifications };
}; 