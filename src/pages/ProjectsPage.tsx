import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

interface Project {
  id: number;
  name: string;
  description: string;
  image?: string;
  link_github?: string;
  link_demo?: string;
  link_demo_title: string;
  category: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("projects.json");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data: Project[] = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    setFilteredProjects(
      selectedCategory
        ? projects.filter((project) => project.category === selectedCategory)
        : projects
    );
  }, [selectedCategory, projects]);

  const descriptionLength = 225;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    const truncatedText = text.slice(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(" ");
    return truncatedText.slice(0, lastSpaceIndex) + "...";
  };

  const toggleExpand = (projectId: number) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const filterProjectsByCategory = (category: string | null) => {
    setSelectedCategory(category);
  };

  const animationClass = selectedCategory ? "animate__animated animate__fadeIn" : "";

  const countProjectsByCategory = (category: string) => {
    return projects.filter((project) => project.category === category).length;
  };

  const currentCategoryText =
    selectedCategory === null ? "All Projects" : `${selectedCategory} Projects`;

  return (
    <section className="container animate__animated animate__fadeIn">
      <Helmet>
        <title>Portfolio - Explore My Projects</title>
        <meta
          name="description"
          content="Explore a selection of my latest projects showcasing web development, design, and innovation. Discover my skills and expertise in creating impactful digital experiences."
        />
      </Helmet>
      <div className="projects-wrapper">
        <div className="categories-wrapper">
          <h2 className="heading animate__animated animate__fadeIn">
            {currentCategoryText} ({filteredProjects.length})
          </h2>
          <div className="categories">
            <button
              key="All"
              className={!selectedCategory ? "btn green" : "btn invisible"}
              onClick={() => filterProjectsByCategory(null)}
            >
              All ({projects.length})
            </button>
            {Array.from(new Set(projects.map((project) => project.category)))
              .sort()
              .map((category) => (
                <button
                  key={category}
                  className={category === selectedCategory ? "btn green" : "btn invisible"}
                  onClick={() => filterProjectsByCategory(category)}
                >
                  {category} ({countProjectsByCategory(category)})
                </button>
              ))}
          </div>
        </div>
        <div className={`projects-wrapper__boxes ${animationClass}`}>
          {filteredProjects.length ? (
            filteredProjects.map((project, index) => (
              <div key={project.id} className="projects-wrapper__box animate__animated animate__fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3>{project.name}</h3>
                {project.image && (
                  <a
                    href={project.link_demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={`/assets/images/projects/${project.image}`} alt={project.name} />
                  </a>
                )}
                <p>
                  {expandedProjectId === project.id
                    ? project.description
                    : truncateText(project.description, descriptionLength)}
                </p>
                <div className="project-links">
                  {project.description.length > descriptionLength && (
                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="btn yellow"
                    >
                      {expandedProjectId === project.id ? "Shrink" : "Expand"}
                    </button>
                  )}
                  {project.link_github && (
                    <a
                      href={project.link_github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn light-gray"
                    >
                      GitHub
                    </a>
                  )}
                  {project.link_demo && (
                    <a
                      href={project.link_demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn green"
                    >
                      {project.link_demo_title}
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
