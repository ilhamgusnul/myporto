"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X, Github } from "lucide-react";

type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  technologies?: string[];
  demoUrl?: string;
  githubUrl?: string;
  category?: string;
};

export function ProjectCard({
  title,
  description,
  imageUrl,
  technologies,
  category,
  demoUrl,
  githubUrl,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      className={`group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 cursor-pointer
        transition-all duration-500 ease-in-out pill-shadow
        ${expanded ? "shadow-2xl scale-[1.02] border-gray-200" : "hover:shadow-xl hover:-translate-y-1"}`}
    >
      {/* Image */}
      {imageUrl && (
        <div className={`relative w-full overflow-hidden bg-gray-50 transition-all duration-500 ${expanded ? "h-64" : "h-56"}`}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />

          {/* Expand/Close indicator */}
          <div className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${expanded ? "bg-[#111111]" : "bg-white"}`}>
            {expanded
              ? <X className="w-4 h-4 text-white" />
              : <ArrowUpRight className="w-4 h-4 text-[#111111]" />
            }
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">

        {/* Title & Category always visible */}
        <div>
          <h3 className="font-display text-xl font-bold text-[#111111] leading-snug mb-2">
            {title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category && (
              <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 bg-gray-50">
                {category}
              </span>
            )}
            {technologies?.slice(0, 2).map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 bg-gray-50">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Expanded: Description + Links */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-4">
            {description}
          </p>

          {/* Action links */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-wrap gap-3"
          >
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-[#333333] transition-colors"
              >
                Live Demo <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gray-200 text-[#111111] text-xs font-semibold hover:border-gray-900 transition-colors"
              >
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
