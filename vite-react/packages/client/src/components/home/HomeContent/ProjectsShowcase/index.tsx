import { FC, memo } from 'react';
import LazyImage from '../../../lazyImage';
import { projects } from '../../../projects/data';

const ProjectsShowcase: FC = () => {
  // Take the first 2 projects or however many they want to show on homepage
  const featuredProjects = projects.slice(0, 2);

  return (
    <section className="projects-showcase">
      <h2>精选项目</h2>
      <div className="projects-grid">
        {featuredProjects.map((project) => (
          <div className="project-card" key={project.title}>
            <div className="project-image">
              <LazyImage src={project.image} alt={project.title} />
            </div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <a href={project.demoUrl || project.githubUrl} className="project-link" target="_blank" rel="noopener noreferrer">
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