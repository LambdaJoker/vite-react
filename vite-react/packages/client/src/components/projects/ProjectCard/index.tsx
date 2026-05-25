import { FC } from 'react';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import LazyImage from '../../lazyImage';
import { Project } from '../types';
import './index.css';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const hasLinks = Boolean(project.demoUrl || project.githubUrl);

  return (
    <div id={`project-${project.id}`} className="project-card">
      <div className="project-image">
        <LazyImage src={project.image} alt={project.title} />
        <div className="project-category">{project.category}</div>
      </div>
      <div className="project-content">
        <div className="project-header">
          <h3>{project.title}</h3>
          <span className="project-period">{project.period}</span>
        </div>
        <p className="project-description">{project.description}</p>
        <div className="project-role">
          <span className="role-badge">{project.role}</span>
        </div>
        <div className="project-highlights">
          <h4>项目亮点:</h4>
          <ul>
            {project.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
        <div className="project-tech">
          {project.technologies.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>
        {hasLinks && (
          <div className="project-links">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-link demo">
                <FaExternalLinkAlt aria-hidden="true" />
                <span>查看演示</span>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link github">
                <FaGithub aria-hidden="true" />
                <span>GitHub 源码</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
