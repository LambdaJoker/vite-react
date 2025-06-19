import { FC, memo } from 'react';
import { projects } from './projectsData.ts';

const ProjectsShowcase: FC = () => {
  return (
    <section className="projects-showcase">
      <h2>精选项目</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div className="project-card" key={project.title}>
            <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}></div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                查看项目 →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(ProjectsShowcase); 