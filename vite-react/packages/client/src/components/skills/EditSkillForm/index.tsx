/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-04-27 18:15:13
 * @LastEditTime: 2025-06-19 09:00:49
 */
import React, { FC } from 'react';
import SkillForm from '../SkillForm';

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

const EditSkillForm: FC<EditSkillFormProps> = ({ skill, onSuccess, onCancel }) => {
  const skillData = {
    id: skill.id,
    skill_name: skill.name,
    proficiency: skill.level,
    description: skill.description,
    categories: skill.categories,
    icon: skill.icon,
  };

  return <SkillForm skill={skillData} onSuccess={onSuccess} onCancel={onCancel} />;
};

export default EditSkillForm; 