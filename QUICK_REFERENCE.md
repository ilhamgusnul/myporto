# Quick Reference Guide

Referensi cepat untuk development dan maintenance portfolio.

---

## 🚀 Quick Commands

### Development
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm start                # Run production build
npm run lint             # Run ESLint
```

### Database (Prisma)
```bash
npx prisma studio        # Open Prisma Studio (DB GUI)
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Run migrations (dev)
npx prisma migrate deploy # Deploy migrations (prod)
npx prisma db push       # Push schema without migration
npx prisma db seed       # Seed database
```

### Useful Prisma Commands
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database schema
npx prisma db pull

# Format schema file
npx prisma format
```

---

## 📂 Project Structure Quick Map

```
portfolio-supabase/
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Public login page
│   │   ├── admin/                 # Protected admin panel
│   │   │   ├── layout.tsx         # Admin layout + nav
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── services/          # Example CRUD
│   │   │   ├── about/             # TO DO
│   │   │   ├── skills/            # TO DO
│   │   │   ├── projects/          # TO DO
│   │   │   ├── platforms/         # TO DO
│   │   │   ├── contact/           # TO DO
│   │   │   ├── stats/             # TO DO
│   │   │   ├── cta/               # TO DO
│   │   │   └── messages/          # TO DO
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/ # NextAuth routes
│   │   │   ├── upload/            # Image upload
│   │   │   └── contact/           # Contact form
│   │   ├── page.tsx               # Landing page
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/ui/             # shadcn components
│   ├── lib/
│   │   ├── prisma.ts              # DB client
│   │   ├── supabase.ts            # Storage client
│   │   ├── auth.ts                # NextAuth config
│   │   ├── validators.ts          # Zod schemas
│   │   └── utils.ts               # Utilities
│   └── middleware.ts              # Route protection
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Seed data
├── .env                           # Environment vars (gitignored)
├── README.md                      # Main docs
├── INSTRUCTIONS.md                # Setup guide
├── DEPLOYMENT.md                  # Deploy guide
└── package.json                   # Dependencies
```

---

## 🔑 Environment Variables

```env
# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<32+ random chars>

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Database
DATABASE_URL=postgresql://...
```

**Generate secret:**
```bash
openssl rand -base64 32
```

---

## 🗄️ Database Models Overview

| Model | Purpose | Singleton | Key Fields |
|-------|---------|-----------|------------|
| User | Admin auth | ❌ | email, password, role |
| About | Personal info | ✅ | title, subtitle, content, avatarUrl |
| Service | Services | ❌ | title, description |
| SkillGroup | Skills | ❌ | title, proficiency, tools[] |
| Project | Portfolio | ❌ | title, category, stack[], imageUrl |
| Platform | Social links | ❌ | name, profileUrl, tagline |
| ContactInfo | Contact | ✅ | location, email, whatsapp |
| Stat | Stats | ❌ | key, label, value |
| CTA | Call-to-action | ✅ | heading, primaryText, primaryHref |
| Message | Contact form | ❌ (read-only) | name, email, message |

---

## 📝 CRUD Pattern Template

### 1. Create `actions.ts`

```tsx
"use server";
import { prisma } from "@/lib/prisma";
import { entitySchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEntity(formData: FormData) {
  const data = {
    field: String(formData.get("field") || ""),
  };
  const validated = entitySchema.safeParse(data);
  if (!validated.success) return { ok: false, errors: validated.error.flatten() };
  
  await prisma.entity.create({ data: validated.data });
  revalidatePath("/admin/entity");
  redirect("/admin/entity");
}

export async function updateEntity(id: string, formData: FormData) {
  // Similar pattern
}

export async function deleteEntity(id: string) {
  await prisma.entity.delete({ where: { id } });
  revalidatePath("/admin/entity");
}
```

### 2. Create `page.tsx` (List)

```tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EntityPage() {
  const items = await prisma.entity.findMany();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1>Entities</h1>
        <Link href="/admin/entity/new">
          <Button>Add New</Button>
        </Link>
      </div>
      {/* List items */}
    </div>
  );
}
```

### 3. Create `new/page.tsx`

```tsx
import { createEntity } from "../actions";

export default function NewEntityPage() {
  return (
    <form action={createEntity}>
      {/* Form fields */}
      <button type="submit">Create</button>
    </form>
  );
}
```

### 4. Create `[id]/edit/page.tsx`

```tsx
import { updateEntity, deleteEntity } from "../../actions";

export default async function EditEntityPage({ params }: { params: { id: string } }) {
  const item = await prisma.entity.findUnique({ where: { id: params.id } });
  
  return (
    <>
      <form action={updateEntity.bind(null, params.id)}>
        {/* Form with defaultValue={item.field} */}
      </form>
      <form action={deleteEntity.bind(null, params.id)}>
        <button>Delete</button>
      </form>
    </>
  );
}
```

---

## 🎨 Common Form Patterns

### Text Input
```tsx
<Input name="title" defaultValue={item?.title} required />
```

### Number Input
```tsx
<Input type="number" name="proficiency" min="0" max="100" defaultValue={item?.proficiency} />
```

### Textarea
```tsx
<Textarea name="description" rows={4} defaultValue={item?.description} />
```

### Select/Dropdown
```tsx
<Select name="category" defaultValue={item?.category}>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="WEB_DEV">Web Development</SelectItem>
    <SelectItem value="MOBILE_APPS">Mobile Apps</SelectItem>
    <SelectItem value="DESIGN_PROJECTS">Design Projects</SelectItem>
  </SelectContent>
</Select>
```

### Array Input (comma-separated)
```tsx
<Input 
  name="tools" 
  placeholder="React, Next.js, TypeScript"
  defaultValue={item?.tools.join(", ")}
/>

// In actions.ts:
const tools = String(formData.get("tools"))
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
```

### Date Input
```tsx
<Input 
  type="date" 
  name="completedAt"
  defaultValue={item?.completedAt?.toISOString().split('T')[0]}
/>
```

### Image Upload
```tsx
import ImageUpload from "@/components/admin/image-upload";

<ImageUpload defaultUrl={item?.imageUrl} name="imageUrl" />
```

---

## 🔐 Default Admin Credentials

```
Email: admin@example.com
Password: Admin123!
```

**Change in production!**

---

## 🚢 Deployment Checklist

- [ ] Set all environment variables in Vercel
- [ ] Generate new `NEXTAUTH_SECRET`
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Run `npx prisma migrate deploy`
- [ ] Run seed if needed
- [ ] Create Supabase Storage bucket `assets`
- [ ] Test all CRUD operations
- [ ] Test image upload
- [ ] Test contact form
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics (optional)

---

## 🐛 Common Issues & Fixes

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### "Invalid `prisma.x.findMany()` invocation"
Check DATABASE_URL in .env is correct

### Upload fails with 401
Check SUPABASE_SERVICE_ROLE_KEY is set

### NextAuth session undefined
Check NEXTAUTH_SECRET is set (min 32 chars)

### Build fails on Vercel
Add to package.json:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## 📚 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Zod Validation](https://zod.dev)

---

## 🎯 Pro Tips

1. **Always validate on server**: Use Zod schemas in server actions
2. **Revalidate paths**: After mutations, call `revalidatePath()`
3. **Use TypeScript**: Let it catch errors early
4. **Test locally first**: Before deploying to production
5. **Backup database**: Before running migrations in prod
6. **Use Prisma Studio**: Visual DB management is easier
7. **Check logs**: Vercel logs are your friend for debugging

---

**Happy coding! 🚀**
