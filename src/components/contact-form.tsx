"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || "General Inquiry"),
      message: String(formData.get("message") || ""),
    };

    try {
      const { error } = await supabase.from("Message").insert([data]);

      if (error) throw error;

      setMessage({ type: "success", text: "Message sent successfully! We'll get back to you soon." });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setMessage({ type: "error", text: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Input name="name" placeholder="Your Name" required disabled={isSubmitting} />
      </div>
      <div className="grid gap-2">
        <Input name="email" type="email" placeholder="your@email.com" required disabled={isSubmitting} />
      </div>
      <div className="grid gap-2">
        <Input name="subject" placeholder="Subject" defaultValue="General Inquiry" disabled={isSubmitting} />
      </div>
      <div className="grid gap-2">
        <Textarea name="message" placeholder="Your message..." rows={5} required disabled={isSubmitting} />
      </div>
      
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" className="bg-[#ff6b00] hover:bg-[#e55f00]" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
