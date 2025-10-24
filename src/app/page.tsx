import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, Facebook, Instagram, Youtube, Globe, Code, Palette, Smartphone, Server, Cloud, MessageSquare, Briefcase, Layers, Lightbulb, Zap } from "lucide-react";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CarouselNavigation } from "@/components/carousel-navigation";
import * as LucideIcons from "lucide-react";

// Icon mapping for social media and services
const iconMap = {
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Mail,
  Code,
  Palette,
  Smartphone,
  Server,
  Cloud,
  MessageSquare,
  Briefcase,
  Layers,
  Lightbulb,
  Zap,
};

async function ContactForm() {
  return (
    <form action="/api/contact" method="post" className="grid gap-4">
      <div className="grid gap-2">
        <Input name="name" placeholder="Your Name" required />
      </div>
      <div className="grid gap-2">
        <Input name="email" type="email" placeholder="your@email.com" required />
      </div>
      <div className="grid gap-2">
        <Textarea name="message" placeholder="Your message..." rows={5} required />
      </div>
      <Button type="submit">Send Message</Button>
    </form>
  );
}

export default async function HomePage() {
  const [
    { data: stats }, 
    { data: about }, 
    { data: services }, 
    { data: skills }, 
    { data: projects }, 
    { data: platforms }, 
    { data: cta }, 
    { data: contact }, 
    { data: socials }
  ] = await Promise.all([
    supabase.from("Stat").select("*").order("order"),
    supabase.from("About").select("*").limit(1).single(),
    supabase.from("Service").select("*").order("order"),
    supabase.from("SkillGroup").select("*").order("order"),
    supabase.from("Project").select("*").order("createdAt", { ascending: false }).limit(6),
    supabase.from("Platform").select("*").order("order"),
    supabase.from("CTA").select("*").limit(1).single(),
    supabase.from("ContactInfo").select("*").limit(1).single(),
    supabase.from("SocialMedia").select("*").order("order"),
  ]);

  return (
    <div className="min-h-screen">
      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">Portfolio</Link>
            <div className="flex items-center gap-6">
              <a href="#hero" className="text-sm hover:text-[#ff6b00] transition-colors">About</a>
              <a href="#services" className="text-sm hover:text-[#ff6b00] transition-colors">Services</a>
              <a href="#skills" className="text-sm hover:text-[#ff6b00] transition-colors">Skills</a>
              <a href="#projects" className="text-sm hover:text-[#ff6b00] transition-colors">Projects</a>
              <a href="#contact" className="text-sm hover:text-[#ff6b00] transition-colors">Contact</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 pt-8 pb-12 space-y-16">
        {/* Hero Section */}
        <section id="hero" className="grid md:grid-cols-2 gap-12 items-center min-h-[75vh]">
          <div className="space-y-6">
            {/* Let's Talk Badge */}
            <div>
              <a 
                href="#contact"
                className="inline-block bg-[#ff6b00] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#e55f00] transition-colors"
              >
                Let&apos;s Talk
              </a>
            </div>

            {/* Main Heading with Name in Orange */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Hi, I&apos;m <span className="text-[#ff6b00]">{about?.title?.split(' ').slice(0, 2).join(' ') || "Ilham Gusnul"}</span> {about?.title?.split(' ').slice(2).join(' ') || "Romadhon"}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl font-semibold text-gray-700">
              {about?.subtitle || "Full Stack Developer & Designer"}
            </p>

            {/* Orange Tagline */}
            <p className="text-lg md:text-xl font-medium text-[#ff6b00]">
              {about?.tagline || "Code by Logic, Design with Passion"}
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
              {about?.content || "Developing digital solutions through a combination of expertise in web & mobile development, UI/UX design, and graphic design. Focused on delivering optimal, efficient results with a strong emphasis on user experience. A commitment to detail and quality is the top priority in every project."}
            </p>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-3 gap-8 pt-4">
                {stats.map((stat) => (
                  <div key={stat.id}>
                    <div className="text-3xl md:text-4xl font-bold">{stat.value}+</div>
                    <div className="text-sm md:text-base text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#projects">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8">
                  View My Work
                </Button>
              </a>
              <a href="#contact">
                <Button size="lg" variant="outline" className="border-2 border-black text-black hover:bg-gray-50 px-8">
                  Get In Touch
                </Button>
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center md:justify-end">
            {about?.avatarUrl ? (
              <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
                <Image
                  src={about.avatarUrl}
                  alt="Profile"
                  fill
                  className="object-cover rounded-full shadow-2xl"
                  priority
                />
              </div>
            ) : (
              <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 via-purple-600 to-purple-800 shadow-2xl" />
              </div>
            )}
          </div>
        </section>

        {/* Services Section - What I Do */}
        {services && services.length > 0 && (
          <section id="services" className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">What I Do</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                My expertise spans across various technologies and design tools
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Briefcase;
                return (
                  <Card 
                    key={service.id} 
                    className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-none bg-white"
                  >
                    <CardContent className="p-8 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#ff6b00]/10 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-[#ff6b00]" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-bold">{service.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <section id="skills" className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">Let&apos;s Explore My Skills</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                My expertise spans across various technologies and design tools
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill) => (
                <Card 
                  key={skill.id} 
                  className="hover:shadow-xl transition-all duration-300 border-none bg-white"
                >
                  <CardContent className="p-8 space-y-6">
                    <h3 className="text-xl font-bold">{skill.title}</h3>
                    
                    {/* Proficiency Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Proficiency</span>
                        <span className="font-bold">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#ff6b00] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>

                    {/* Tools */}
                    <div className="flex flex-wrap gap-2">
                      {skill.tools.map((tool: string) => (
                        <span
                          key={tool}
                          className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section with Carousel */}
        {projects && projects.length > 0 && (
          <section id="projects" className="py-20">
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-gray-600">Check out some of my recent work</p>
            </div>

            <CarouselNavigation items={projects}>
              <div className="relative -mx-4 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                <div className="flex gap-6 pb-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex-none w-[350px] snap-start">
                      <Card className="h-full hover:shadow-xl transition-shadow">
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={project.imageUrl || "/placeholder.jpg"}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                          <div className="flex gap-2 mb-4 flex-wrap">
                            {project.technologies?.slice(0, 3).map((tech: string, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-gray-100 text-xs rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            {project.demoUrl && (
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" className="bg-[#ff6b00] hover:bg-[#e55f00]">
                                  Live Demo
                                </Button>
                              </a>
                            )}
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline">
                                  Source Code
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </CarouselNavigation>
          </section>
        )}

        {/* CTA Section - Let's Work Together */}
        {cta && (
          <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 md:p-16 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Let&apos;s Work Together</h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              {cta.subheading || "Have a project in mind? Let&apos;s discuss how I can help bring your ideas to life."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a href={cta.primaryHref || "#contact"}>
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-base font-semibold">
                  {cta.primaryText || "Start a Project"}
                </Button>
              </a>
              {cta.secondaryText && cta.secondaryHref && (
                <a href={cta.secondaryHref}>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-base font-semibold">
                    {cta.secondaryText}
                  </Button>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Platforms Section */}
        {platforms && platforms.length > 0 && (
          <section id="platforms" className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Find Me On</h2>
              <p className="text-muted-foreground">Connect with me on these platforms</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {platforms.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center space-y-2">
                      <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {platform.name}
                      </div>
                      {platform.tagline && (
                        <p className="text-sm text-muted-foreground">{platform.tagline}</p>
                      )}
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Get In Touch</h2>
            <p className="text-muted-foreground">Let&apos;s discuss your next project</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Contact Information</h3>
              
              {contact?.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{contact.location}</div>
                  </div>
                </div>
              )}

              {contact?.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {contact?.whatsapp && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {contact.whatsapp}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            {/* Name */}
            <h3 className="text-2xl md:text-3xl font-bold">
              {about?.title || "Ilham Gusnul Romadhon"}
            </h3>
            
            {/* Subtitle */}
            <p className="text-gray-400 text-sm md:text-base">
              {about?.subtitle || "Fullstack Web Developer & UI/UX Designer"}
            </p>

            {/* Copyright */}
            <p className="text-gray-500 text-xs md:text-sm pt-4">
              © {new Date().getFullYear()} {about?.title || "Ilham Gusnul Romadhon"}. All rights reserved.<br />
              {about?.subtitle || "Fullstack Web Developer & UI/UX Designer"}
            </p>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {socials?.map((social) => {
                const IconComponent = iconMap[social.icon as keyof typeof iconMap];
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    title={social.name}
                  >
                    {IconComponent && <IconComponent className="h-5 w-5" />}
                  </a>
                );
              })}
            </div>

            {/* Contact Link */}
            <div className="pt-4">
              <a 
                href="#contact" 
                className="text-[#ff6b00] hover:text-[#e55f00] transition-colors font-medium"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
