import { z } from "zod";

// About Schema
export const aboutSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// Service Schema
export const serviceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(4, "Description must be at least 4 characters"),
});

// Skill Group Schema
export const skillGroupSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  proficiency: z.coerce.number().min(0).max(100, "Proficiency must be between 0-100"),
  tools: z.array(z.string().min(1)).min(1, "At least one tool is required"),
});

// Project Schema
export const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  completedAt: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  stack: z.array(z.string().min(1)).min(1, "At least one tech stack is required"),
  category: z.enum(["WEB_DEV", "MOBILE_APPS", "DESIGN_PROJECTS"]),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// Platform Schema
export const platformSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  profileUrl: z.string().url("Invalid URL"),
  tagline: z.string().optional(),
});

// Contact Info Schema
export const contactSchema = z.object({
  location: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

// Stat Schema
export const statSchema = z.object({
  key: z.enum(["projects_completed", "years_experience", "client_satisfaction"]),
  label: z.string().min(2, "Label must be at least 2 characters"),
  value: z.coerce.number().min(0, "Value must be positive"),
});

// CTA Schema
export const ctaSchema = z.object({
  heading: z.string().min(2, "Heading must be at least 2 characters"),
  subheading: z.string().min(2, "Subheading must be at least 2 characters"),
  primaryText: z.string().min(1, "Primary text is required"),
  primaryHref: z.string().min(1, "Primary link is required"),
  secondaryText: z.string().optional(),
  secondaryHref: z.string().optional(),
});

// Contact Message Schema
export const messageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Invalid email").max(160),
  message: z.string().min(10, "Message must be at least 10 characters").max(4000),
});

// Type exports
export type AboutInput = z.infer<typeof aboutSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type SkillGroupInput = z.infer<typeof skillGroupSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type PlatformInput = z.infer<typeof platformSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type StatInput = z.infer<typeof statSchema>;
export type CTAInput = z.infer<typeof ctaSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
