# Instruksi Melengkapi Portfolio Supabase

File-file inti sudah dibuat. Berikut adalah file tambahan yang perlu Anda buat untuk melengkapi admin CRUD untuk semua entity.

---

## ✅ Yang Sudah Dibuat

### Core Setup
- ✅ `package.json` - Dependencies & scripts
- ✅ `tsconfig.json`, `next.config.js`, `tailwind.config.ts`
- ✅ `prisma/schema.prisma` - Database schema lengkap
- ✅ `prisma/seed.ts` - Seed data
- ✅ `.env.example` - Environment template
- ✅ `README.md` - Dokumentasi lengkap
- ✅ `DEPLOYMENT.md` - Panduan deployment
- ✅ `setup.sh` & `setup.ps1` - Setup scripts

### Library & Helpers
- ✅ `src/lib/prisma.ts`
- ✅ `src/lib/supabase.ts`
- ✅ `src/lib/auth.ts`
- ✅ `src/lib/validators.ts` - Zod schemas untuk semua entity
- ✅ `src/lib/utils.ts`
- ✅ `src/middleware.ts`

### UI Components (shadcn/ui)
- ✅ `src/components/ui/button.tsx`
- ✅ `src/components/ui/input.tsx`
- ✅ `src/components/ui/textarea.tsx`
- ✅ `src/components/ui/card.tsx`
- ✅ `src/components/ui/label.tsx`
- ✅ `src/components/ui/table.tsx`
- ✅ `src/components/ui/select.tsx`

### App Routes
- ✅ `src/app/layout.tsx`
- ✅ `src/app/globals.css`
- ✅ `src/app/page.tsx` - Landing page lengkap
- ✅ `src/app/login/page.tsx` - Login page
- ✅ `src/app/api/auth/[...nextauth]/route.ts` - NextAuth
- ✅ `src/app/api/upload/route.ts` - Upload ke Supabase Storage
- ✅ `src/app/api/contact/route.ts` - Contact form handler

### Admin Panel
- ✅ `src/app/admin/layout.tsx` - Admin layout dengan navigation
- ✅ `src/app/admin/page.tsx` - Dashboard
- ✅ `src/app/admin/services/` - Complete CRUD example

---

## 📝 File Yang Perlu Dibuat

Ikuti pola yang sama dengan `/admin/services` untuk entity berikut:

### 1. About Section (Singleton)

**File:**
```
src/app/admin/about/
├── page.tsx          # Edit form (singleton, tidak perlu list)
└── actions.ts        # updateAbout()
```

**Key Points:**
- Hanya 1 record (singleton pattern)
- Form untuk edit title, subtitle, content (textarea besar), avatarUrl
- Upload avatar image menggunakan `/api/upload`
- Gunakan `aboutSchema` dari validators.ts

---

### 2. Skills Section

**File:**
```
src/app/admin/skills/
├── page.tsx              # List semua skill groups
├── new/page.tsx          # Create new skill group
├── [id]/edit/page.tsx    # Edit skill group
└── actions.ts            # createSkill, updateSkill, deleteSkill
```

**Key Points:**
- `tools` adalah array of strings - gunakan input dengan comma-separated values
- `proficiency` adalah number 0-100 - gunakan `<Input type="number" min="0" max="100" />`
- Split tools: `formData.get("tools").split(",").map(s => s.trim())`

---

### 3. Projects Section

**File:**
```
src/app/admin/projects/
├── page.tsx              # List dengan filter tabs (category)
├── new/page.tsx          # Create dengan image upload
├── [id]/edit/page.tsx    # Edit dengan image upload
└── actions.ts            # createProject, updateProject, deleteProject
```

**Key Points:**
- Image upload component (lihat contoh di dokumentasi bagian 19)
- `category` select: WEB_DEV, MOBILE_APPS, DESIGN_PROJECTS
- `stack` array - input comma-separated
- `completedAt` date picker - `<Input type="date" />`

**Upload Component:**
```tsx
// src/components/admin/image-upload.tsx
"use client";
import { useState } from "react";

export default function ImageUpload({ defaultUrl, name = "imageUrl" }: { defaultUrl?: string; name?: string }) {
  const [url, setUrl] = useState(defaultUrl || "");
  const [uploading, setUploading] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      setUrl(data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <input type="file" accept="image/*" onChange={onChange} disabled={uploading} />
      <input type="hidden" name={name} value={url} />
      {url && (
        <img src={url} alt="Preview" className="max-h-48 rounded border" />
      )}
      {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
    </div>
  );
}
```

---

### 4. Platforms Section

**File:**
```
src/app/admin/platforms/
├── page.tsx
├── new/page.tsx
├── [id]/edit/page.tsx
└── actions.ts
```

**Key Points:**
- Fields: name, profileUrl, logoUrl (optional), tagline (optional)
- logoUrl bisa upload atau input URL manual
- Gunakan `platformSchema` dari validators

---

### 5. Contact Info (Singleton)

**File:**
```
src/app/admin/contact/
├── page.tsx    # Edit form
└── actions.ts  # updateContact()
```

**Key Points:**
- Singleton (id: "singleton")
- Fields: location, email, whatsapp
- Semua optional tapi minimal 1 harus ada

---

### 6. Stats Section

**File:**
```
src/app/admin/stats/
├── page.tsx
├── new/page.tsx
├── [id]/edit/page.tsx
└── actions.ts
```

**Key Points:**
- `key` select: projects_completed, years_experience, client_satisfaction
- `key` harus unique
- `value` adalah number

---

### 7. CTA Section (Singleton)

**File:**
```
src/app/admin/cta/
├── page.tsx
└── actions.ts
```

**Key Points:**
- Singleton (id: "default")
- Fields: heading, subheading, primaryText, primaryHref, secondaryText (optional), secondaryHref (optional)

---

### 8. Messages Section (Read-Only)

**File:**
```
src/app/admin/messages/
├── page.tsx    # List dengan pagination
└── actions.ts  # deleteMessage()
```

**Key Points:**
- Read-only (tidak ada create/edit)
- Hanya list dan delete
- Sort by `createdAt DESC`
- Optional: Add pagination jika banyak messages

**Example:**
```tsx
// src/app/admin/messages/page.tsx
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteMessage } from "./actions";

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 50, // Limit to 50 latest
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contact Messages</h1>
      
      <div className="grid gap-4">
        {messages.map((msg) => (
          <Card key={msg.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">{msg.name}</span>
                    <span className="text-sm text-muted-foreground">{msg.email}</span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{msg.message}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
                <form action={deleteMessage.bind(null, msg.id)}>
                  <Button variant="destructive" size="sm" type="submit">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 Menambah UI Components Tambahan

Jika ingin komponen shadcn lainnya:

```bash
npx shadcn@latest add badge
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   chmod +x setup.sh  # Make executable (Linux/Mac)
   ./setup.sh         # Run setup
   
   # Windows:
   .\setup.ps1
   ```

2. **Atau manual:**
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
   npm run dev
   ```

3. **Login:**
   - URL: http://localhost:3000/login
   - Email: admin@example.com
   - Password: Admin123!

---

## 📚 Pola Server Actions

Setiap entity mengikuti pola yang sama:

```tsx
// actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { entitySchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEntity(formData: FormData) {
  // 1. Extract data dari FormData
  const data = {
    field1: String(formData.get("field1") || ""),
    field2: Number(formData.get("field2")),
    // Array fields:
    arrayField: String(formData.get("arrayField") || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean),
  };

  // 2. Validate dengan Zod
  const validated = entitySchema.safeParse(data);
  if (!validated.success) {
    return { ok: false, errors: validated.error.flatten().fieldErrors };
  }

  // 3. Create di database
  await prisma.entity.create({ data: validated.data });

  // 4. Revalidate & redirect
  revalidatePath("/admin/entity");
  redirect("/admin/entity");
}

export async function updateEntity(id: string, formData: FormData) {
  // Same pattern
  await prisma.entity.update({ where: { id }, data: validated.data });
  revalidatePath("/admin/entity");
  redirect("/admin/entity");
}

export async function deleteEntity(id: string) {
  await prisma.entity.delete({ where: { id } });
  revalidatePath("/admin/entity");
}
```

---

## 🔧 Troubleshooting

### TypeScript Errors
Semua TypeScript errors akan hilang setelah:
```bash
npm install
npx prisma generate
```

### Database Connection
Pastikan `.env` sudah diisi dengan credentials Supabase yang benar.

### Upload Errors
1. Pastikan bucket `assets` sudah dibuat di Supabase Storage
2. Check `SUPABASE_SERVICE_ROLE_KEY` sudah di set di `.env`

---

## ✅ Checklist Completion

- [ ] About CRUD
- [ ] Skills CRUD
- [ ] Projects CRUD (dengan upload)
- [ ] Platforms CRUD
- [ ] Contact Info edit
- [ ] Stats CRUD
- [ ] CTA edit
- [ ] Messages list + delete
- [ ] Test semua CRUD operations
- [ ] Test upload images
- [ ] Test contact form di landing page
- [ ] Deploy ke Vercel

---

**Happy Coding! 🚀**

Jika ada pertanyaan atau butuh bantuan, check:
- `README.md` untuk dokumentasi lengkap
- `DEPLOYMENT.md` untuk panduan deploy
- Prisma docs: https://www.prisma.io/docs
- Next.js docs: https://nextjs.org/docs
