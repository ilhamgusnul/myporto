"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return isVisible ? (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
      style={{
        background: "linear-gradient(135deg, #FF6B2B, #FF8C5A)",
        boxShadow: "0 0 24px rgba(255,107,43,0.5), 0 0 48px rgba(255,107,43,0.2)",
      }}
    >
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: "rgba(255,107,43,0.3)" }}
      />
      <ChevronUp className="h-5 w-5 relative z-10" />
    </button>
  ) : null;
}
