# Prisma to Supabase Migration Guide

## Database Schema
Run `/supabase/migrations/supabase-schema.sql` in Supabase SQL Editor

## Code Changes

### 1. Import Statement
```typescript
// Before (Prisma)
import { prisma } from "@/lib/prisma";

// After (Supabase)
import { supabaseAdmin } from "@/lib/supabase";
```

### 2. Query Operations

#### Find Many
```typescript
// Before
await prisma.stat.findMany()
await prisma.stat.findMany({ orderBy: { order: "asc" } })

// After
const { data } = await supabaseAdmin.from("Stat").select("*")
const { data } = await supabaseAdmin.from("Stat").select("*").order("order", { ascending: true })
```

#### Find First / Find Unique
```typescript
// Before
await prisma.about.findFirst()
await prisma.profile.findUnique({ where: { id: userId } })

// After
const { data } = await supabaseAdmin.from("About").select("*").limit(1).single()
const { data } = await supabaseAdmin.from("Profile").select("*").eq("id", userId).single()
```

#### Create
```typescript
// Before
await prisma.service.create({ data: formData })

// After
const { data, error } = await supabaseAdmin.from("Service").insert([formData]).select().single()
if (error) throw error;
```

#### Update
```typescript
// Before
await prisma.service.update({
  where: { id },
  data: formData
})

// After
const { error } = await supabaseAdmin.from("Service").update(formData).eq("id", id)
if (error) throw error;
```

#### Delete
```typescript
// Before
await prisma.service.delete({ where: { id } })

// After
const { error } = await supabaseAdmin.from("Service").delete().eq("id", id)
if (error) throw error;
```

#### Count
```typescript
// Before
await prisma.project.count()

// After
const { count } = await supabaseAdmin.from("Project").select("*", { count: "exact", head: true })
```

### 3. Response Handling

Supabase returns `{ data, error }` instead of throwing errors by default.

```typescript
// Pattern 1: Check error
const { data, error } = await supabaseAdmin.from("Table").select("*")
if (error) throw error;

// Pattern 2: Destructure directly (for reads)
const { data: items } = await supabaseAdmin.from("Table").select("*")
// items might be null, handle accordingly
```

### 4. Server Actions Return Pattern

Since server actions must return void, always use redirect():

```typescript
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export async function createItem(formData: FormData) {
  try {
    const data = {
      // extract form data
    };
    
    const { error } = await supabaseAdmin
      .from("Table")
      .insert([data]);
    
    if (error) throw error;
    
    revalidatePath("/admin/items");
    revalidatePath("/");
  } catch (error) {
    console.error("Error:", error);
  }
  redirect("/admin/items");
}
```

### 5. Table Name Mapping

Prisma uses camelCase, Supabase uses PascalCase:

| Prisma | Supabase |
|--------|----------|
| `prisma.profile` | `supabaseAdmin.from("Profile")` |
| `prisma.stat` | `supabaseAdmin.from("Stat")` |
| `prisma.cTA` | `supabaseAdmin.from("CTA")` |
| `prisma.about` | `supabaseAdmin.from("About")` |
| `prisma.service` | `supabaseAdmin.from("Service")` |
| `prisma.skillGroup` | `supabaseAdmin.from("SkillGroup")` |
| `prisma.project` | `supabaseAdmin.from("Project")` |
| `prisma.platform` | `supabaseAdmin.from("Platform")` |
| `prisma.contactInfo` | `supabaseAdmin.from("ContactInfo")` |
| `prisma.message` | `supabaseAdmin.from("Message")` |
| `prisma.socialMedia` | `supabaseAdmin.from("SocialMedia")` |

### 6. Files to Update

- [x] src/lib/auth.ts
- [x] src/lib/supabase.ts  
- [x] src/app/page.tsx
- [x] src/app/admin/page.tsx
- [x] src/app/api/contact/route.ts
- [ ] src/app/admin/*/actions.ts (all)
- [ ] src/app/admin/*/page.tsx (all remaining)
- [ ] src/app/admin/*/[id]/edit/page.tsx (all)

### 7. Environment Variables

Update Vercel with new Supabase project:
- `DATABASE_URL` (not needed anymore, but can keep)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (production URL)

## Admin User Setup

**Note:** This project now uses **Supabase Auth** instead of custom User table.

See `SETUP_ADMIN.md` for detailed instructions on creating admin users.

Quick setup via Supabase Dashboard:
1. Go to Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Enable "Auto Confirm User"
5. Run SQL to set admin role:
```sql
UPDATE public."Profile"
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
```

## Testing Checklist

1. [ ] Homepage loads
2. [ ] Admin login works
3. [ ] Admin dashboard shows counts
4. [ ] Contact form submission works
5. [ ] Each CRUD section works (create, read, update, delete)
6. [ ] Image upload to Supabase Storage works
7. [ ] Build succeeds: `npm run build`
8. [ ] Deploy to Vercel succeeds
