"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "Fullstack Web Developer", label: "Fullstack" },
  { value: "UI/UX Design", label: "UI/UX" },
  { value: "Visual & Brand Design", label: "Branding" },
  { value: "Mobile Apps Developer", label: "Mobile" },
];

const PER_PAGE = 4;

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);

  const filtered =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleCategory(cat: string) {
    setSelectedCategory(cat);
    setPage(1);
  }

  return (
    <div className="space-y-12">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={`text-sm md:text-base font-semibold transition-colors duration-200 ${
                selectedCategory === cat.value
                  ? "text-[#111111] border-b-2 border-[#111111] pb-0.5"
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <span className="text-sm text-gray-400 font-medium">
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {paginated.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-lg text-gray-400 font-medium">No projects in this category.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-[#111111] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                page === n
                  ? "bg-[#111111] text-white"
                  : "border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-[#111111]"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-[#111111] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next page"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
