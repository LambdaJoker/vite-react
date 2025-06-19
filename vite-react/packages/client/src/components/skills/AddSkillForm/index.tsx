import React, { FC } from 'react';
import SkillForm from '../SkillForm';

interface AddSkillFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddSkillForm: FC<AddSkillFormProps> = ({ onSuccess, onCancel }) => {
  return <SkillForm onSuccess={onSuccess} onCancel={onCancel} />;
};

export default AddSkillForm; 