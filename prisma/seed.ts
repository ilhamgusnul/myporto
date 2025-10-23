import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const password = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { 
      email: "admin@example.com", 
      password, 
      name: "Admin",
      role: "ADMIN"
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create stats
  await prisma.stat.createMany({
    data: [
      { key: "projects_completed", label: "Projects Completed", value: 24 },
      { key: "years_experience", label: "Years Experience", value: 3 },
      { key: "client_satisfaction", label: "Client Satisfaction", value: 98 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Stats created");

  // Create about
  const about = await prisma.about.upsert({
    where: { id: "default" },
    update: {
      title: "Ilham Gusnul Romadhon",
      subtitle: "Fullstack Web Developer & UI/UX Designer",
      tagline: "Code by Logic, Design with Passion",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=IlhamGusnul&backgroundColor=b6e3f4&radius=50",
    },
    create: {
      id: "default",
      title: "Ilham Gusnul Romadhon",
      subtitle: "Fullstack Web Developer & UI/UX Designer",
      tagline: "Code by Logic, Design with Passion",
      content: `I'm a passionate full-stack developer with expertise in modern web technologies. 
      
I specialize in creating beautiful, performant, and user-friendly applications using React, Next.js, and TypeScript.

With a keen eye for design and a strong foundation in development, I bridge the gap between aesthetics and functionality.`,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=IlhamGusnul&backgroundColor=b6e3f4&radius=50"
    }
  });
  console.log("✅ About created");

  // Create services
  await prisma.service.createMany({
    data: [
      {
        title: "Web Development",
        description: "Building responsive and performant web applications using modern frameworks like React and Next.js",
        icon: "Code"
      },
      {
        title: "UI/UX Design",
        description: "Crafting intuitive and beautiful user interfaces with a focus on user experience",
        icon: "Palette"
      },
      {
        title: "Mobile Development",
        description: "Creating cross-platform mobile applications with React Native",
        icon: "Smartphone"
      },
      {
        title: "Backend Development",
        description: "Developing robust APIs and server-side applications with Node.js and databases",
        icon: "Server"
      },
      {
        title: "Cloud Solutions",
        description: "Deploying and managing applications on cloud platforms like AWS and Vercel",
        icon: "Cloud"
      },
      {
        title: "Consulting",
        description: "Providing technical guidance and architecture planning for digital projects",
        icon: "MessageSquare"
      }
    ],
    skipDuplicates: true
  });
  console.log("✅ Services created");

  // Create skill groups
  await prisma.skillGroup.createMany({
    data: [
      {
        title: "Frontend Development",
        proficiency: 95,
        tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"]
      },
      {
        title: "Backend Development",
        proficiency: 88,
        tools: ["Node.js", "Express", "Prisma", "PostgreSQL", "MongoDB"]
      },
      {
        title: "Mobile Development",
        proficiency: 82,
        tools: ["React Native", "Expo", "Flutter"]
      },
      {
        title: "Design Tools",
        proficiency: 85,
        tools: ["Figma", "Adobe XD", "Sketch", "Photoshop"]
      },
      {
        title: "DevOps",
        proficiency: 78,
        tools: ["Docker", "AWS", "Vercel", "GitHub Actions", "CI/CD"]
      }
    ],
    skipDuplicates: true
  });
  console.log("✅ Skill groups created");

  // Create projects
  await prisma.project.createMany({
    data: [
      {
        title: "E-Commerce Platform",
        completedAt: new Date("2024-01-15"),
        description: "Full-featured e-commerce platform with payment integration and admin dashboard",
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
        stack: ["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL"],
        category: "WEB_DEV",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com/example/ecommerce"
      },
      {
        title: "Mobile Fitness App",
        completedAt: new Date("2023-11-20"),
        description: "Cross-platform fitness tracking app with social features",
        imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=600&fit=crop",
        stack: ["React Native", "Expo", "Firebase", "TypeScript"],
        category: "MOBILE_APPS",
        liveUrl: "https://example.com/fitness",
      },
      {
        title: "Brand Identity System",
        completedAt: new Date("2024-02-10"),
        description: "Complete brand identity and design system for a tech startup",
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
        stack: ["Figma", "Adobe Illustrator", "Design System"],
        category: "DESIGN_PROJECTS",
      },
      {
        title: "SaaS Dashboard",
        completedAt: new Date("2023-09-05"),
        description: "Analytics dashboard with real-time data visualization",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        stack: ["React", "D3.js", "Node.js", "WebSocket", "Redis"],
        category: "WEB_DEV",
        liveUrl: "https://example.com/dashboard",
        githubUrl: "https://github.com/example/dashboard"
      }
    ],
    skipDuplicates: true
  });
  console.log("✅ Projects created");

  // Create platforms
  await prisma.platform.createMany({
    data: [
      {
        name: "GitHub",
        profileUrl: "https://github.com/yourusername",
        tagline: "Open source contributions & projects"
      },
      {
        name: "LinkedIn",
        profileUrl: "https://linkedin.com/in/yourusername",
        tagline: "Professional network & updates"
      },
      {
        name: "Dribbble",
        profileUrl: "https://dribbble.com/yourusername",
        tagline: "Design portfolio & inspiration"
      },
      {
        name: "Twitter",
        profileUrl: "https://twitter.com/yourusername",
        tagline: "Tech thoughts & insights"
      }
    ],
    skipDuplicates: true
  });
  console.log("✅ Platforms created");

  // Create CTA
  const cta = await prisma.cTA.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      heading: "Let's Work Together",
      subheading: "Have a project in mind? Let's discuss how I can help bring your ideas to life.",
      primaryText: "Start a Project",
      primaryHref: "#contact",
      secondaryText: "View Resume",
      secondaryHref: "/resume.pdf"
    }
  });
  console.log("✅ CTA created");

  // Create contact info
  const contact = await prisma.contactInfo.upsert({
    where: { id: "singleton" },
    update: {},
    create: { 
      id: "singleton", 
      location: "Bandung, Indonesia", 
      email: "hello@yourname.com", 
      whatsapp: "+62 812-3456-7890" 
    },
  });
  console.log("✅ Contact info created");

  // Create social media
  await prisma.socialMedia.createMany({
    data: [
      {
        name: "GitHub",
        url: "https://github.com/yourusername",
        icon: "Github",
        order: 1,
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/yourusername",
        icon: "Linkedin",
        order: 2,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Social media created");

  console.log("✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
