"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";

type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  technologies?: string[];
  demoUrl?: string;
  githubUrl?: string;
  expandedId: string | null;
  onToggle: (id: string) => void;
};

export function ProjectCard({
  id,
  title,
  description,
  imageUrl,
  technologies,
  demoUrl,
  githubUrl,
  expandedId,
  onToggle,
}: ProjectCardProps) {
  const isExpanded = expandedId === id;

  return (
    <Card
      className={`bg-white overflow-visible transition-all duration-300 ease-out cursor-pointer flex flex-col relative ${
        isExpanded 
          ? "shadow-2xl ring-2 ring-[#ff6b00] ring-opacity-50 z-50 min-h-[520px]" 
          : "shadow-lg hover:shadow-xl min-h-[520px]"
      }`}
      onClick={() => onToggle(id)}
    >
      {imageUrl && (
        <div className="relative h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={`object-cover transition-all duration-700 ${
              isExpanded ? "scale-110 blur-[2px]" : "scale-100"
            }`}
            style={{ objectFit: "cover" }}
          />
          {isExpanded && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          )}
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title & Description - Always Visible */}
        <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
          isExpanded ? "text-[#ff6b00]" : "text-gray-900"
        }`}>
          {title}
        </h3>
        <p className={`text-gray-600 mb-4 leading-relaxed text-sm ${
          isExpanded ? "" : "line-clamp-3"
        }`}>
          {description}
        </p>

        {/* Spacer untuk mendorong footer ke bawah - hanya saat tidak expanded */}
        {!isExpanded && <div className="flex-1" />}

        {/* Expanded Content - Tech Stack & Links */}
        <div
          className={`transition-all duration-500 ease-out ${
            isExpanded 
              ? "max-h-96 opacity-100 mt-6 translate-y-0" 
              : "max-h-0 opacity-0 -translate-y-4"
          }`}
          style={{ overflow: isExpanded ? "visible" : "hidden" }}
        >
          {/* Technologies */}
          {technologies && technologies.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Tech Stack
              </h4>
              <div className="flex gap-2 flex-wrap">
                {technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gradient-to-r from-[#ff6b00] to-[#ff8533] text-white text-xs rounded-full font-medium shadow-md hover:shadow-lg transition-shadow"
                    style={{
                      animationDelay: `${i * 50}ms`,
                      animation: isExpanded ? "fadeInUp 0.4s ease-out forwards" : "none",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              >
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] hover:from-[#e55f00] hover:to-[#ff6b00] w-full shadow-md hover:shadow-lg transition-all text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Live Demo
                </Button>
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              >
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-gray-300 hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#fff5f0] transition-all text-xs"
                >
                  <Github className="h-3 w-3 mr-2" />
                  Source Code
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Footer Hint - Untuk konsistensi tinggi card */}
        {!isExpanded && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center font-medium animate-pulse">
              ✨ Click to see details
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
}
