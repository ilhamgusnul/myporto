import React from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { ArrowUpRight, Github, Linkedin, Twitter, Facebook, Instagram, Youtube, Globe, Mail, Code, Palette, Smartphone, Server, Cloud, MessageSquare, Briefcase, Layers, Lightbulb, Zap } from "lucide-react";
import { NavbarScroll } from "@/components/navbar-scroll";
import { ProjectsGrid } from "@/components/projects-grid";
import { ContactForm } from "@/components/contact-form";
import { RevealObserver } from "@/components/reveal-observer";

// Mappings
import type { LucideProps } from "lucide-react";
type LucideIcon = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
const iconMap: Record<string, LucideIcon> = {
  Github, Linkedin, Twitter, Facebook, Instagram, Youtube, Globe, Mail,
  Code, Palette, Smartphone, Server, Cloud, MessageSquare, Briefcase, Layers, Lightbulb, Zap,
};

export const revalidate = 0;

export default async function HomePage() {
  const [
    { data: stats, error: statsErr },
    { data: about, error: aboutErr },
    { data: services, error: servicesErr },
    { data: skills, error: skillsErr },
    { data: projects, error: projectsErr },
    { data: platforms, error: platformsErr },
    { data: cta, error: ctaErr },
    { data: socials, error: socialsErr },
  ] = await Promise.all([
    supabase.from("Stat").select("*").order("order"),
    supabase.from("About").select("*").limit(1).single(),
    supabase.from("Service").select("*").order("order"),
    supabase.from("SkillGroup").select("*").order("order"),
    supabase.from("Project").select("*").order("createdAt", { ascending: false }).limit(10),
    supabase.from("Platform").select("*").order("order"),
    supabase.from("CTA").select("*").limit(1).single(),
    supabase.from("SocialMedia").select("*").order("order"),
  ]);

  if (servicesErr) console.error("Services Error:", servicesErr);
  if (skillsErr) console.error("Skills Error:", skillsErr);
  if (projectsErr) console.error("Projects Error:", projectsErr);
  if (socialsErr) console.error("Socials Error:", socialsErr);

  const firstName = about?.title?.split(" ")[0] || "ILHAM";
  const restName = about?.title?.split(" ").slice(1).join(" ") || "GUSNUL";

  return (
    <div className="min-h-screen">
      <RevealObserver />
      <NavbarScroll title={about?.title} logoUrl={about?.logoUrl} />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen pt-28 pb-0 flex flex-col overflow-hidden">
        
        {/* Big Typography Layer — right below navbar */}
        <div className="relative flex items-center justify-center pointer-events-none z-0 px-4 pt-8 pb-4">
          <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-none text-center tracking-tighter">
            <span className="text-outline block md:inline">{firstName.toUpperCase()}</span>{" "}
            <span className="text-[#111111] block md:inline">{restName.toUpperCase()}</span>
          </h1>
        </div>

        {/* Middle: Avatar + Bottom Row (3-column grid) */}
        <div className="flex-1 flex flex-col justify-end relative">
          
          {/* Three-column layout: Left info | Center avatar | Right socials */}
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_400px_1fr] items-end gap-8 pb-12">
              
              {/* Left: Role & Description */}
              <div className="reveal order-2 md:order-1">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#111111] mb-4 leading-tight">
                  {about?.subtitle || "UI/UX Designer"}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
                  {about?.tagline || "Designing digital products that are clear, usable, and conversion focused."}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-sm font-semibold transition-all duration-300 pill-shadow"
                >
                  Let&apos;s collaborate <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Center: Avatar Image */}
              <div className="relative order-1 md:order-2 flex justify-center">
                <div className="relative w-[260px] h-[340px] md:w-[380px] md:h-[480px]">
                  {about?.avatarUrl ? (
                    <Image
                      src={about.avatarUrl}
                      alt={about.title || "Profile"}
                      fill
                      sizes="(max-width: 768px) 260px, 380px"
                      className="object-contain object-bottom"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-end justify-center pb-8 font-display text-7xl font-bold text-gray-200">
                      {firstName[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Social Pills */}
              <div className="flex flex-wrap md:flex-col gap-3 reveal reveal-delay-2 order-3 md:items-end">
                {socials?.map((social) => {
                  const Icon = iconMap[social.icon];
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-100 text-sm font-semibold text-gray-700 hover:text-[#111111] hover:border-gray-300 transition-all pill-shadow"
                    >
                      {Icon && <Icon className="w-4 h-4" />} {social.name}
                    </a>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ──────────────────────────────────────────── */}
      {projects && projects.length > 0 && (
        <section id="work" className="py-24 relative">
          <div className="container mx-auto px-4 md:px-8">
            <div className="relative mb-16 md:mb-24 reveal">
              <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[12vw] font-black text-gray-100 select-none whitespace-nowrap pointer-events-none">
                PORTFOLIO
              </h2>
              <h3 className="relative z-10 text-center font-display text-4xl md:text-5xl font-bold text-[#111111] tracking-tight">
                SELECTED WORK
              </h3>
            </div>
            
            <ProjectsGrid projects={projects} />
          </div>
        </section>
      )}

      {/* ── SERVICES ───────────────────────────────────────────── */}
      {services && services.length > 0 && (
        <section id="service" className="py-24 relative">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <h3 className="font-display text-3xl font-bold text-[#111111] mb-12 tracking-tight reveal">
              SERVICE
            </h3>
            
            <div className="flex flex-col">
              {services.map((service, idx) => (
                <div
                  key={service.id}
                  className="group service-row border-b border-gray-200 py-8 px-4 cursor-default relative overflow-hidden reveal"
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h4 className="font-display text-3xl md:text-4xl font-bold mb-2 uppercase">
                        {service.title}
                      </h4>
                      <p className="text-sm max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-300">
                        {service.description}
                      </p>
                    </div>
                    <ArrowUpRight className="service-arrow w-8 h-8 text-gray-400 transition-transform duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SKILLS ─────────────────────────────────────────────── */}
      {skills && skills.length > 0 && (
        <section id="experience" className="py-24 relative">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="bg-[#111111] rounded-[2.5rem] p-8 md:p-16 text-white reveal shadow-2xl relative overflow-hidden">
              
              {/* Subtle background glow/noise */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none"></div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 relative z-10 border-b border-white/10 pb-10">
                <div>
                  <span className="text-gray-400 font-medium text-sm tracking-widest uppercase mb-3 block">
                    Capabilities
                  </span>
                  <h3 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                    SKILLS & TOOLS
                  </h3>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-4xl md:text-5xl font-display font-black text-white">
                    {stats?.find((s) => s.label.toLowerCase().includes("experience"))?.value || "5"}<span className="text-gray-500">+</span>
                  </span>
                  <span className="text-gray-400 font-medium text-sm uppercase tracking-wider mt-1">
                    Years of Experience
                  </span>
                </div>
              </div>

              <div className="flex flex-col relative z-10">
                {skills.map((group, idx) => (
                  <div key={group.id} className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-white/10 last:border-0 cursor-default">
                    
                    <div className="flex items-start gap-6 mb-6 md:mb-0 md:w-1/2">
                      <span className="text-sm font-display font-bold text-gray-600 mt-2 transition-colors duration-300 group-hover:text-white">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-2xl md:text-3xl font-display font-medium text-gray-300 transition-colors duration-300 group-hover:text-white">
                        {group.name}
                      </h4>
                    </div>

                    <div className="flex flex-wrap justify-start md:justify-end gap-3 md:w-1/2 pl-10 md:pl-0">
                      {group.skills?.map((item: string) => (
                        <span 
                          key={item} 
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400 transition-all duration-300 group-hover:border-white/30 hover:!bg-white hover:!text-black hover:scale-105 cursor-pointer"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA & CONTACT ──────────────────────────────────────── */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10 max-w-3xl reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white pill-shadow border border-gray-100 mb-8 mx-auto">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-gray-800">Available for New Project</span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl font-bold text-[#111111] mb-6 tracking-tight uppercase">
            {cta?.title || "Have a project in mind?"}
          </h2>
          
          <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-12">
            {cta?.description || "Together, we can create something clear and impactful. Let's collaborate to bring our ideas to life in a way that resonates with everyone."}
          </p>

          <ContactForm />
        </div>
      </section>

      {/* ── FOOTER ROW ─────────────────────────────────────────── */}
      <footer className="py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 reveal">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#111111] text-white pill-shadow">
              {about?.avatarUrl && (
                <div className="w-6 h-6 rounded-full overflow-hidden relative">
                  <Image src={about.avatarUrl} alt="Avatar" fill sizes="24px" className="object-cover" />
                </div>
              )}
              <span className="text-sm font-semibold">{about?.title || "Ilham Gusnul"}</span>
            </div>

            {platforms?.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-white border border-gray-100 text-sm font-semibold text-gray-700 hover:text-[#111111] hover:border-gray-300 transition-all pill-shadow flex items-center gap-2"
              >
                <Globe className="w-4 h-4" /> {p.name}
              </a>
            ))}
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} {about?.title}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
