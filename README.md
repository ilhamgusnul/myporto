# Portfolio Next.js + Supabase

> **Full-stack portfolio website dengan admin panel lengkap**  
> Next.js 14 (App Router) · Supabase Auth · PostgreSQL · NextAuth · Tailwind CSS · shadcn/ui

🌐 **Live Demo:** [https://ilhamgusnul.vercel.app](https://ilhamgusnul.vercel.app)

---

## ✨ Features

- 🎨 **Modern Landing Page** - Hero/About, Stats, Services, Skills, Projects, CTA, Platforms, Contact
- 🔐 **Supabase Authentication** - Secure auth dengan NextAuth + Supabase Auth
- 📊 **Admin Dashboard** - Full CRUD untuk semua konten
- 📁 **Image Upload** - Upload gambar ke Supabase Storage
- 💬 **Contact Form** - Terima pesan dari visitor
- 🎯 **Type-Safe** - TypeScript + Zod validation
- 🎨 **Beautiful UI** - Tailwind CSS + shadcn/ui components
- 📱 **Responsive** - Mobile-first design

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm/pnpm/yarn**
- **Supabase Account** (gratis di [supabase.com](https://supabase.com))
- **Vercel Account** (opsional, untuk deployment)

### 1. Clone Repository

```bash
git clone https://github.com/ilhamgusnul/myporto.git
cd myporto
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. **Create Project** di [supabase.com](https://supabase.com)
2. **Get Credentials**:
   - Go to Settings → API
   - Copy `Project URL` dan `anon public key`
   - Copy `service_role key` (untuk admin operations)

3. **Run Migrations**:
   - Install Supabase CLI: `npm install -g supabase`
   - Link project: `npx supabase link --project-ref your-project-id`
   - Push migrations: `npx supabase db push`
   
   Atau jalankan SQL manual di SQL Editor:
   - Copy isi dari `supabase/migrations/20251024104840_init-schema.sql`
   - Paste dan run di Supabase SQL Editor

4. **Create Admin User**:
   - Go to Authentication → Users
   - Click "Add User"
   - Set email dan password
   - Check "Auto Confirm User"
   - Run SQL untuk set role ADMIN:
   ```sql
   UPDATE public."Profile" 
   SET role = 'ADMIN', name = 'Your Name'
   WHERE email = 'your-email@example.com';
   ```

### 4. Environment Variables

Create `.env` file:

```env
# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database (optional, untuk direct access)
DATABASE_URL=postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
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
├── supabase/
│   └── migrations/
│       └── 20251024104840_init-schema.sql  # Database schema
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Landing page
│   │   ├── login/page.tsx                  # Login page
│   │   ├── admin/                          # Admin panel (protected)
│   │   │   ├── page.tsx                    # Dashboard
│   │   │   ├── about/                      # Edit About/Hero section
│   │   │   ├── services/                   # CRUD Services
│   │   │   ├── skills/                     # CRUD Skills
│   │   │   ├── projects/                   # CRUD Projects
│   │   │   ├── platforms/                  # CRUD Platforms
│   │   │   ├── contact/                    # Edit Contact Info
│   │   │   ├── stats/                      # CRUD Stats
│   │   │   ├── cta/                        # Edit CTA section
│   │   │   ├── socials/                    # CRUD Social Media
│   │   │   ├── messages/                   # View Messages
│   │   │   └── profile/                    # Edit Profile & Password
│   │   └── api/
│   │       ├── auth/[...nextauth]/         # NextAuth API
│   │       ├── upload/                     # Image upload API
│   │       └── contact/                    # Contact form API
│   ├── components/
│   │   ├── ui/                             # shadcn/ui components
│   │   ├── admin/
│   │   │   └── image-upload.tsx            # Image upload component
│   │   ├── scroll-to-top.tsx
│   │   └── carousel-navigation.tsx
│   ├── lib/
│   │   ├── supabase.ts                     # Supabase client
│   │   ├── auth.ts                         # NextAuth config
│   │   ├── validators.ts                   # Zod schemas
│   │   └── utils.ts
│   └── middleware.ts                       # Route protection
├── .env
├── package.json
└── README.md
```

---

## 🗄️ Database Tables

- **Profile** - User profiles (auto-created from auth.users)
- **About** - Personal info & bio (Hero section)
- **Service** - Services offered
- **SkillGroup** - Skills dengan proficiency & tools list
- **Project** - Portfolio projects
- **Platform** - Social platforms/links
- **ContactInfo** - Contact details
- **Stat** - Homepage statistics
- **CTA** - Call-to-action section
- **Message** - Contact form messages
- **SocialMedia** - Social media links (footer)

---

## 🎨 Admin Panel

### Dashboard (`/admin`)
- Overview semua konten
- Recent messages

### About (`/admin/about`)
- Edit hero section (title, subtitle, tagline, content, avatar)

### Services (`/admin/services`)
- Manage services yang ditawarkan
- Icon, title, description, order

### Skills (`/admin/skills`)
- Manage skill groups
- Title, proficiency, tools array

### Projects (`/admin/projects`)
- Portfolio projects
- Image, title, description, tech stack, links, featured

### Stats (`/admin/stats`)
- Homepage statistics (years experience, projects completed, dll)

### Platforms (`/admin/platforms`)
- Social platforms & profile links

### Contact (`/admin/contact`)
- Edit contact information (email, whatsapp, location)

### Messages (`/admin/messages`)
- View & delete messages dari contact form

### Profile (`/admin/profile`)
- Edit profile name & email
- Change password

---

## 🚀 Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Import project di [vercel.com](https://vercel.com)
2. Set Environment Variables:
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=<generate new one>
   NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
3. Deploy!

### 3. Update NEXTAUTH_URL

Setelah deploy, update environment variable `NEXTAUTH_URL` dengan URL production Anda.

---

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth + NextAuth.js
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Validation**: Zod
- **Language**: TypeScript

---

## 🤝 Contributing

Feel free to fork, improve, and submit PRs!

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👤 Author

**Ilham Gusnul Romadhon**

- Website: [ilhamgusnul.vercel.app](https://ilhamgusnul.vercel.app)
- GitHub: [@ilhamgusnul](https://github.com/ilhamgusnul)

---

## 📖 Additional Documentation

- [`DEPLOYMENT.md`](DEPLOYMENT.md) - Detailed deployment guide
- [`PERBAIKAN_ABOUT.md`](PERBAIKAN_ABOUT.md) - About section integration guide
