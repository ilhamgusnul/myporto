"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselNavigationProps {
  children: React.ReactNode;
  items: any[];
}

export function CarouselNavigation({ children, items }: CarouselNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // width of card + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === "left" 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {items.length > 3 && (
        <div className="absolute top-0 right-0 z-10 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="bg-white hover:bg-gray-100 shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="bg-white hover:bg-gray-100 shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Carousel Container */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory pt-12"
      >
        {children}
      </div>
    </div>
  );
}
