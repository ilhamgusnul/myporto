"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  technologies?: string[];
  demoUrl?: string;
  githubUrl?: string;
  category?: string;
};

const categories = [
  { value: "all", label: "All Projects" },
  { value: "Fullstack Web Developer", label: "Fullstack Web" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Visual & Brand Design", label: "Visual & Brand" },
  { value: "Mobile Apps Developer", label: "Mobile Apps" },
];

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter projects based on selected category
  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((category) => (
          <Button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            variant={selectedCategory === category.value ? "default" : "outline"}
            className={
              selectedCategory === category.value
                ? "bg-[#ff6b00] hover:bg-[#e55f00] text-white"
                : "hover:bg-gray-100"
            }
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id}>
              <ProjectCard
                {...project}
                expandedId={expandedId}
                onToggle={handleToggle}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No projects found in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}
