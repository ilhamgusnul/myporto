"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function NavbarScroll({ title, logoUrl }: { title?: string; logoUrl?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Logo or Availability Badge */}
          <div className="flex items-center">
            {logoUrl ? (
              /* Custom Logo */
              <div className="relative h-9 w-auto">
                <Image
                  src={logoUrl}
                  alt={title || "Logo"}
                  height={36}
                  width={120}
                  className="h-9 w-auto object-contain"
                  priority
                />
              </div>
            ) : (
              <>
                {/* Desktop: Availability Badge */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white pill-shadow border border-gray-100">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-gray-800 tracking-wide">Available for New Project</span>
                </div>
                {/* Mobile: Name Fallback */}
                <div className="sm:hidden font-display font-bold text-xl tracking-tight text-[#111111] uppercase">
                  {title || "Ilham Gusnul"}
                </div>
              </>
            )}
          </div>

          {/* Middle: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#work" className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors">
              Work <span className="text-[10px] text-gray-400 font-normal">[10]</span>
            </a>
            <a href="#service" className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors">
              Service <span className="text-[10px] text-gray-400 font-normal">[4]</span>
            </a>
            <a href="#experience" className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors">
              Experience <span className="text-[10px] text-gray-400 font-normal">[9y+]</span>
            </a>
            <a href="#contact" className="text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors">
              Contact
            </a>
          </nav>

          {/* Right: CTA Button */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden md:flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-sm font-semibold transition-all duration-300 pill-shadow"
            >
              Let&apos;s Talk <ArrowUpRight className="w-4 h-4" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden">
          <nav className="flex flex-col p-4 space-y-4">
            <a href="#work" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-gray-900">Work</a>
            <a href="#service" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-gray-900">Service</a>
            <a href="#experience" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-gray-900">Experience</a>
            <a href="#contact" onClick={() => setMobileOpen(false)} className="text-base font-semibold text-gray-900">Contact</a>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#111111] text-white font-semibold"
            >
              Let&apos;s Talk <ArrowUpRight className="w-4 h-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
