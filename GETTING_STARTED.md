# Getting Started Guide

Panduan step-by-step untuk setup portfolio dari nol hingga deploy.

---

## 📋 Prerequisites Checklist

Sebelum mulai, pastikan Anda punya:

- [ ] **Node.js 18+** installed ([download](https://nodejs.org/))
- [ ] **npm** atau **pnpm** atau **yarn**
- [ ] **Git** installed ([download](https://git-scm.com/))
- [ ] **Akun Supabase** (gratis di [supabase.com](https://supabase.com))
- [ ] **Akun Vercel** untuk deployment (opsional, gratis di [vercel.com](https://vercel.com))
- [ ] **Code editor** (VS Code recommended)

Cek instalasi:
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
git --version    # Any recent version
```

---

## 🚀 Part 1: Supabase Setup (10 menit)

### Step 1: Create Supabase Project

1. Login ke [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Pilih organization atau buat baru
4. Isi form:
   - **Name**: `portfolio` (atau bebas)
   - **Database Password**: Generate atau buat sendiri (SIMPAN INI!)
   - **Region**: Singapore (terdekat untuk Indonesia)
   - **Pricing Plan**: Free

5. Click **"Create new project"**
6. Tunggu ~2 menit sampai project ready

### Step 2: Get API Keys

1. Di sidebar, klik **"Settings"** → **"API"**
2. Copy credentials berikut:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1N...` (key yang panjang)
   - **service_role**: `eyJhbGciOiJIUzI1N...` (scroll ke bawah)

3. SIMPAN di notepad sementara

### Step 3: Get Database Connection String

1. Di sidebar, klik **"Settings"** → **"Database"**
2. Scroll ke **"Connection string"**
3. Pilih tab **"URI"**
4. Copy connection string
5. **PENTING**: Replace `[YOUR-PASSWORD]` dengan password database tadi

Format akhir:
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### Step 4: Create Storage Bucket

1. Di sidebar, klik **"Storage"**
2. Click **"Create a new bucket"**
3. Isi:
   - **Name**: `assets`
   - **Public bucket**: OFF (uncheck)
4. Click **"Create bucket"**

✅ Supabase setup selesai!

---

## 💻 Part 2: Local Setup (5 menit)

### Step 1: Extract Project

```bash
cd /path/to/your/projects
# Project sudah ada di folder portfolio-supabase
cd portfolio-supabase
```

### Step 2: Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit .env dengan text editor atau:
nano .env
# atau
code .env  # jika pakai VS Code
```

Isi dengan credentials Supabase tadi:

```env
# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=GANTI_DENGAN_RANDOM_STRING_32_KARAKTER_ATAU_LEBIH

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1N...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1N...

# Database
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

**Generate NEXTAUTH_SECRET:**
```bash
# Mac/Linux:
openssl rand -base64 32

# Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Atau pakai online generator: https://generate-secret.vercel.app/32
```

### Step 3: Install Dependencies

```bash
npm install
# Tunggu ~2 menit
```

Jika ada error, coba:
```bash
npm install --legacy-peer-deps
```

### Step 4: Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (create tables)
npx prisma migrate dev --name init

# Seed with sample data
npm run prisma:seed
```

Expected output:
```
✅ Admin user created: admin@example.com
✅ Stats created
✅ About created
✅ Services created
✅ Skill groups created
✅ Projects created
✅ Platforms created
✅ CTA created
✅ Contact info created
✨ Seed completed successfully!
```

### Step 5: Run Development Server

```bash
npm run dev
```

Expected output:
```
> portfolio-supabase@0.1.0 dev
> next dev

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000

 ✓ Ready in 2.5s
```

✅ Local setup selesai!

---

## 🎨 Part 3: First Look (2 menit)

### Test Landing Page

1. Buka browser: [http://localhost:3000](http://localhost:3000)
2. Anda akan melihat:
   - Hero section dengan stats
   - About section
   - Services grid (6 items)
   - Skills dengan proficiency bars
   - Projects grid (4 sample projects)
   - Platforms/social links
   - Contact form

### Test Admin Login

1. Buka: [http://localhost:3000/login](http://localhost:3000/login)
2. Login dengan:
   - **Email**: `admin@example.com`
   - **Password**: `Admin123!`
3. Anda akan redirect ke: [http://localhost:3000/admin](http://localhost:3000/admin)
4. Lihat dashboard dengan statistics

### Test CRUD (Services)

1. Di admin panel, klik **"Services"** di navigation
2. Klik **"Add Service"**
3. Isi form:
   - Title: `Test Service`
   - Description: `This is a test`
4. Click **"Create Service"**
5. Service baru muncul di list
6. Click **"Edit"** → ubah title → **"Save Changes"**
7. Click **"Delete"** → service hilang

✅ Semua working!

---

## 🛠️ Part 4: Customize Content (15 menit)

### Update About Section

1. Login ke admin panel
2. Klik **"About"** (Note: Halaman ini masih perlu dibuat, lihat INSTRUCTIONS.md)
3. Edit:
   - Title: Nama atau title Anda
   - Subtitle: Tagline Anda
   - Content: Bio singkat
   - Avatar: Upload foto profil

### Update Services

1. Klik **"Services"**
2. Edit semua services sesuai yang Anda tawarkan
3. Delete yang tidak relevan
4. Add new sesuai kebutuhan

### Update Skills

1. Klik **"Skills"** (Note: Perlu dibuat)
2. Untuk setiap skill group:
   - Title: e.g., "Frontend Development"
   - Proficiency: 0-100
   - Tools: comma-separated, e.g., "React, Next.js, TypeScript"

### Add Your Projects

1. Klik **"Projects"** (Note: Perlu dibuat)
2. Click **"Add Project"**
3. Upload gambar project
4. Isi details:
   - Title
   - Description
   - Category (Web/Mobile/Design)
   - Stack (comma-separated)
   - Live URL
   - GitHub URL
   - Completion date

### Update Contact Info

1. Klik **"Contact"** (Note: Perlu dibuat)
2. Update:
   - Location: Kota Anda
   - Email: Email valid
   - WhatsApp: Format +62...

### Update Social Links

1. Klik **"Platforms"** (Note: Perlu dibuat)
2. Add your:
   - GitHub: github.com/username
   - LinkedIn: linkedin.com/in/username
   - Twitter/X
   - Dribbble
   - etc.

---

## 📱 Part 5: Testing (5 menit)

### Checklist

- [ ] Landing page loads properly
- [ ] All sections display correctly
- [ ] Images load
- [ ] Contact form works (test submit)
- [ ] Admin login works
- [ ] Can create/edit/delete items
- [ ] Image upload works
- [ ] Navigation works
- [ ] Mobile responsive (test on small screen)

### Test Contact Form

1. Go to landing page
2. Scroll to contact section
3. Fill form dan submit
4. Go to admin → Messages
5. Your test message should appear

### Test Responsiveness

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1440px)

---

## 🚢 Part 6: Deploy to Vercel (10 menit)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Portfolio with Supabase"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repo
4. Click **"Import"**
5. **Configure**:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)

### Step 3: Add Environment Variables

Click **"Environment Variables"**, add satu per satu:

```
Name: NEXTAUTH_URL
Value: https://your-project.vercel.app (ganti setelah deploy)

Name: NEXTAUTH_SECRET
Value: <generate baru dengan openssl rand -base64 32>

Name: SUPABASE_URL
Value: https://xxxxx.supabase.co

Name: SUPABASE_ANON_KEY
Value: eyJhbGci...

Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGci...

Name: DATABASE_URL
Value: postgresql://postgres...
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait ~2 minutes
3. Click generated URL (e.g., `https://portfolio-xxxxx.vercel.app`)

### Step 5: Update NEXTAUTH_URL

1. Copy your Vercel URL
2. Go to Vercel project → Settings → Environment Variables
3. Edit `NEXTAUTH_URL` value dengan URL production
4. Redeploy: Go to **Deployments** → click **•••** → **Redeploy**

### Step 6: Test Production

1. Visit your production URL
2. Test landing page
3. Test login: https://your-url.vercel.app/login
4. Test admin panel

✅ Deployed successfully!

---

## 🎯 Part 7: Next Steps

### Complete Remaining Admin Pages

Follow `INSTRUCTIONS.md` to create:
- [ ] About edit page
- [ ] Skills CRUD
- [ ] Projects CRUD (with upload)
- [ ] Platforms CRUD
- [ ] Contact edit
- [ ] Stats CRUD
- [ ] CTA edit
- [ ] Messages list

### Customize Design

1. Edit colors in `src/app/globals.css`
2. Change fonts in `src/app/layout.tsx`
3. Adjust spacing/layout in components

### Add Features

- [ ] Dark mode toggle
- [ ] Blog section
- [ ] Resume download
- [ ] Email notifications for contact form
- [ ] Analytics (Vercel Analytics)

### SEO Optimization

- [ ] Add metadata to pages
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Optimize images (WebP)
- [ ] Add Open Graph tags

### Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. Go to Vercel project → Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to custom domain

---

## 📚 Resources

- **Documentation**: Check `README.md`
- **Quick Commands**: See `QUICK_REFERENCE.md`
- **Deployment**: Read `DEPLOYMENT.md`
- **Next Steps**: Follow `INSTRUCTIONS.md`

---

## 🆘 Need Help?

Common issues and solutions in `QUICK_REFERENCE.md` under "Common Issues & Fixes"

Or check:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel Docs](https://vercel.com/docs)

---

**Congratulations! 🎉 Your portfolio is live!**

Now go customize it and make it yours! 💪
