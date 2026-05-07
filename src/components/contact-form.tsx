"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowUpRight } from "lucide-react";

const SUBJECTS = [
  "Web Development",
  "UI/UX Design",
  "Branding & Visual Design",
  "Mobile App Development",
  "General Inquiry",
];

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name:    String(formData.get("name")    || ""),
      email:   String(formData.get("email")   || ""),
      subject: String(formData.get("subject") || "General Inquiry"),
      message: String(formData.get("message") || ""),
    };

    try {
      const { error } = await supabase.from("Message").insert([data]);
      if (error) throw error;
      setMessage({ type: "success", text: "Message sent! I'll get back to you soon." });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error("Contact form error:", err);
      setMessage({ type: "error", text: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = "w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Your Name"
          required
          disabled={isSubmitting}
          className={inputClass}
        />
        <input
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>
      <div>
        <select
          name="subject"
          disabled={isSubmitting}
          defaultValue="General Inquiry"
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <textarea
          name="message"
          placeholder="Tell me about your project..."
          rows={4}
          required
          disabled={isSubmitting}
          className={`${inputClass} resize-y`}
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-sm font-semibold ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#111111] text-white font-semibold hover:bg-[#333333] transition-colors disabled:opacity-70 mx-auto mt-6"
      >
        {isSubmitting ? "Sending..." : "Contact Me"} <ArrowUpRight className="w-5 h-5" />
      </button>
    </form>
  );
}
