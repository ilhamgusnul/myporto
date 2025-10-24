"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  technologies?: string[];
  demoUrl?: string;
  githubUrl?: string;
};

export function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          {...project}
          expandedId={expandedId}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
