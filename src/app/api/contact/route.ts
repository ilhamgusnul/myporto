import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const data = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      message: String(form.get("message") || "").trim(),
    };

    // Validate with Zod
    const validated = messageSchema.safeParse(data);

    if (!validated.success) {
      return NextResponse.json(
        { ok: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Save to database
    await prisma.message.create({
      data: validated.data,
    });

    return NextResponse.json({ ok: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
