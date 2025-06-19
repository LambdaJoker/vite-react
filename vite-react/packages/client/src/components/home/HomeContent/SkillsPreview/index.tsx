/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-06-19 09:38:27
 * @LastEditTime: 2025-06-19 09:45:23
 */
import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { skills, Skill } from './skillsData.ts';

const SkillsPreview: FC = () => {
  return (
    <section className="skills-preview">
      <h2>技术领域</h2>
      <div className="skills-grid">
        {skills.map((skill: Skill) => (
          <div className="skill-area" key={skill.title}>
            <span className="skill-icon">{skill.icon}</span>
            <h3>{skill.title}</h3>
            <p>{skill.description}</p>
          </div>
        ))}
      </div>
      <Link to="/skills" className="view-all-button">查看所有技能</Link>
    </section>
  );
};

export default memo(SkillsPreview); 