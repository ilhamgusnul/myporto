# Portfolio Next.js + Supabase

> **Full-stack portfolio website dengan admin panel lengkap**  
> Next.js 14 (App Router) · Supabase · Prisma · NextAuth · Tailwind · shadcn/ui

Demo login: `admin@example.com` / `Admin123!`

---

## ✨ Features

- 🎨 **Modern Landing Page** - Hero, Stats, Services, Skills, Projects, CTA, Platforms, Contact
- 🔐 **Authentication** - NextAuth dengan Credentials provider
- 📊 **Admin Dashboard** - Statistik ringkas & recent messages
- ✏️ **Full CRUD** - Manage About, Services, Skills, Projects, Platforms, Contact Info, Stats, CTA
- 📁 **File Upload** - Gambar ke Supabase Storage
- 💬 **Contact Form** - Menerima pesan dari visitor
- 🎯 **Type-Safe** - TypeScript + Zod validation
- 🎨 **Beautiful UI** - Tailwind CSS + shadcn/ui components

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** 18+ (recommend 20 LTS)
- **npm/pnpm/yarn**
- **Supabase Account** (gratis di https://supabase.com)

### 2. Supabase Setup

1. Buat project baru di Supabase
2. Pilih region terdekat (Singapore untuk Indonesia)
3. Copy credentials dari dashboard:

#### Database URL
```
Settings → Database → Connection string → Node.js
```
Contoh:
```
postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

#### API Keys
```
Settings → API → Project URL
Settings → API → anon public key
Settings → API → service_role key (untuk upload)
```

#### Storage Bucket
```
Storage → Create bucket
Name: assets
Public: OFF (kita akan pakai signed URLs)
```

### 3. Install & Setup

```bash
# Clone / extract project
cd portfolio-supabase

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env dengan credentials Supabase Anda
nano .env
```

#### .env Configuration

```env
# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate dengan: openssl rand -base64 32>

# Supabase
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...

# Database (dari Supabase → Settings → Database)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.YOUR-PROJECT.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

### 4. Database Migration & Seed

```bash
# Generate Prisma Client
npx prisma generate

# Run migration (buat tables)
npx prisma migrate dev --name init

# Seed database dengan data awal
npm run prisma:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

- **Landing page**: http://localhost:3000
- **Login admin**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/admin

---

## 📁 Project Structure

```
portfolio-supabase/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   └── page.tsx       # Landing page publik
│   │   ├── admin/             # Admin panel (protected)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   ├── skills/
│   │   │   ├── projects/
│   │   │   ├── platforms/
│   │   │   ├── contact/
│   │   │   ├── stats/
│   │   │   ├── cta/
│   │   │   └── messages/
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/ # NextAuth
│   │   │   ├── upload/        # Upload gambar
│   │   │   └── contact/       # Contact form submission
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── supabase.ts        # Supabase client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── validators.ts      # Zod schemas
│   │   └── utils.ts
│   └── middleware.ts          # Route protection
├── .env
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

### Models

- **Profile** - User profiles (linked to Supabase Auth)
- **About** - Personal info & bio (singleton-like)
- **Service** - Services offered
- **SkillGroup** - Skill categories dengan proficiency & tools
- **Project** - Portfolio projects dengan kategori
- **Platform** - Social media & links
- **ContactInfo** - Contact details (singleton)
- **Stat** - Homepage statistics (projects_completed, years_experience, dll)
- **CTA** - Call-to-action section
- **Message** - Messages dari contact form
- **SocialMedia** - Social media links for footer

---

## 🛠️ Admin Panel Features

### Dashboard (`/admin`)
- Total counts untuk setiap entity
- Recent messages preview

### About (`/admin/about`)
- Edit personal title, subtitle, content (markdown)
- Upload avatar image

### Services (`/admin/services`)
- CRUD services
- Title & description

### Skills (`/admin/skills`)
- CRUD skill groups
- Title, proficiency (0-100), tools (array)

### Projects (`/admin/projects`)
- CRUD projects dengan categories
- Upload project images
- Stack teknologi (array)
- Live URL & GitHub URL

### Platforms (`/admin/platforms`)
- CRUD social platforms
- Name, profile URL, tagline, logo

### Contact Info (`/admin/contact`)
- Edit contact details (location, email, WhatsApp)

### Stats (`/admin/stats`)
- Edit homepage statistics
- Key, label, value

### CTA (`/admin/cta`)
- Edit call-to-action section
- Heading, subheading, primary & secondary buttons

### Messages (`/admin/messages`)
- View messages dari contact form
- Read-only list + delete

---

## 🎨 Customization

### Colors & Theme

Edit `src/app/globals.css` untuk ubah color scheme:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

### Fonts

Edit `src/app/layout.tsx`:

```ts
import { Inter, Poppins } from "next/font/google";
```

### Landing Page Sections

Edit `src/app/(site)/page.tsx` untuk customize layout & content.

---

## 🚢 Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/portfolio.git
git push -u origin main
```

### 2. Deploy ke Vercel

1. Import project dari GitHub di [vercel.com](https://vercel.com)
2. Set Environment Variables (sama seperti `.env`):
   - `NEXTAUTH_URL` = `https://yourdomain.vercel.app`
   - `NEXTAUTH_SECRET` = (generate baru dengan `openssl rand -base64 32`)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`

3. Deploy!

### 3. Run Migration di Production (Optional)

Jika belum migration, jalankan lokal yang connect ke DB production:

```bash
# Edit .env dengan DATABASE_URL production
npx prisma migrate deploy
npm run prisma:seed
```

---

## 📝 Development Notes

### Prisma Commands

```bash
# Generate client after schema change
npx prisma generate

# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Adding New Admin Pages

Ikuti pattern di `/admin/services`:

1. Buat `actions.ts` untuk server actions (create/update/delete)
2. Buat `page.tsx` untuk list view
3. Buat `new/page.tsx` untuk create form
4. Buat `[id]/edit/page.tsx` untuk edit form
5. Tambah link di `admin/layout.tsx` navigation

### Upload Images

File upload menggunakan endpoint `/api/upload` yang simpan ke Supabase Storage bucket `assets`.

---

## 🐛 Troubleshooting

### Prisma Connection Error

```
Can't reach database server
```

**Solusi**: Check DATABASE_URL correct, pastikan include `?pgbouncer=true&connection_limit=1`

### NextAuth Session Error

```
[next-auth][error] JWT error
```

**Solusi**: Set NEXTAUTH_SECRET yang valid (32+ random characters)

### Upload gagal (401)

**Solusi**: 
- Check SUPABASE_SERVICE_ROLE_KEY set correctly
- Pastikan bucket `assets` exists di Supabase Storage

### TypeScript Errors after install

**Solusi**: 
```bash
npx prisma generate
npm run dev # restart dev server
```

---

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Validation**: Zod
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

---

## 📄 License

MIT License - bebas digunakan untuk project pribadi maupun komersial.

---

## 🤝 Support

Jika ada pertanyaan atau issue:

1. Check dokumentasi Supabase: https://supabase.com/docs
2. Next.js docs: https://nextjs.org/docs
3. Prisma docs: https://www.prisma.io/docs

---

**Happy coding! 🚀**
