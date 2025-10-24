# Vercel Deployment Guide

## 🚀 Deploy ke Vercel

### Step 1: Setup Environment Variables di Vercel

Sebelum deploy, **WAJIB** set environment variables berikut di Vercel Dashboard:

1. Buka **Vercel Dashboard** → Project Anda → **Settings** → **Environment Variables**

2. Tambahkan variable berikut:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fmwvuxlnaifkphzaxypo.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Generate dengan `openssl rand -base64 32` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Production |
| `NEXTAUTH_URL` | Auto (tidak perlu set) | Preview, Development |

**Cara mendapatkan Supabase Keys:**

1. Buka **Supabase Dashboard** → Project Settings → API
2. Copy **Project URL** untuk `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role** key untuk `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (RAHASIA!)

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### Step 2: Push Code ke GitHub

```bash
# Pastikan semua perubahan sudah di-commit
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 3: Deploy di Vercel

**Opsi A: Via Vercel Dashboard (Recommended)**

1. Login ke [Vercel](https://vercel.com)
2. Klik **Add New** → **Project**
3. Import repository GitHub Anda
4. Framework Preset: **Next.js** (otomatis terdeteksi)
5. **Root Directory:** Leave empty (default)
6. **Build Command:** `npm run build` (default)
7. **Output Directory:** `.next` (default)
8. Klik **Deploy**

**Opsi B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Step 4: Set Environment Variables (Jika belum)

Jika lupa set di step 1, bisa set sekarang:

```bash
# Via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Redeploy setelah set env vars
vercel --prod
```

### Step 5: Update NEXTAUTH_URL

Setelah deploy, dapatkan production URL (contoh: `https://your-site.vercel.app`)

1. Buka Vercel Dashboard → Settings → Environment Variables
2. Edit `NEXTAUTH_URL` untuk **Production**
3. Set value: `https://your-site.vercel.app`
4. Redeploy (Deployments → ... → Redeploy)

### Step 6: Test Production

1. **Test Homepage:**
   - Buka `https://your-site.vercel.app`
   - Harus menampilkan homepage (meski data kosong)

2. **Test Login:**
   - Buka `https://your-site.vercel.app/login`
   - Login dengan admin credentials
   - Harus redirect ke `/admin`

3. **Test Admin Panel:**
   - Test add/edit/delete data di semua section
   - Test upload image

## 🔧 Troubleshooting

### Error: "supabaseUrl is required"

**Penyebab:** Environment variables tidak diset

**Solusi:**
1. Cek di Vercel Dashboard → Settings → Environment Variables
2. Pastikan semua variable sudah ada
3. Pastikan apply ke environment yang benar (Production/Preview/Development)
4. Redeploy

### Error: "Invalid login credentials"

**Penyebab:** Admin user belum dibuat atau credentials salah

**Solusi:**
1. Cek di Supabase Dashboard → Authentication → Users
2. Pastikan user sudah ada dan `email_confirmed_at` tidak null
3. Cek role di table Profile:
```sql
SELECT * FROM public."Profile" WHERE email = 'admin@example.com';
```

### Error: "Failed to fetch" saat CRUD operations

**Penyebab:** RLS policies atau service role key salah

**Solusi:**
1. Cek `SUPABASE_SERVICE_ROLE_KEY` di Vercel env vars
2. Pastikan sama dengan yang di Supabase Dashboard
3. Cek RLS policies sudah dibuat:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### Build Error: "Module not found"

**Penyebab:** Dependencies tidak ter-install

**Solusi:**
```bash
# Hapus node_modules dan lock file
rm -rf node_modules package-lock.json

# Install ulang
npm install

# Test build lokal
npm run build

# Push
git add .
git commit -m "Fix dependencies"
git push
```

### Error: Cannot read property of null

**Penyebab:** Data belum ada di database

**Solusi:**
1. Login ke admin panel
2. Tambahkan data untuk semua section
3. Atau hide section yang kosong di homepage

## 📊 Monitoring

### Vercel Analytics

1. Enable Analytics di Vercel Dashboard
2. Monitor traffic, page views, errors

### Supabase Logs

1. Buka Supabase Dashboard → Logs
2. Monitor database queries
3. Check for errors

### Error Tracking

Di Vercel Dashboard → Project → Logs:
- Real-time logs
- Runtime logs
- Build logs

## 🔄 Continuous Deployment

Setelah setup awal, setiap `git push` ke branch `main` akan otomatis:
1. Trigger build di Vercel
2. Run `npm install`
3. Run `npm run build`
4. Deploy jika build sukses

**Untuk disable auto-deploy:**
1. Vercel Dashboard → Settings → Git
2. Toggle off "Auto Deploy"

## 🌐 Custom Domain

### Setup Custom Domain

1. Buka Vercel Dashboard → Settings → Domains
2. Klik **Add Domain**
3. Masukkan domain Anda (contoh: `myportfolio.com`)
4. Ikuti instruksi untuk update DNS:
   - **A Record:** Point to Vercel IP
   - **CNAME Record:** Point to `cname.vercel-dns.com`

5. Update `NEXTAUTH_URL` dengan custom domain:
   - Production: `https://myportfolio.com`

### DNS Settings Example

**Untuk domain apex (myportfolio.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Untuk subdomain (www.myportfolio.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Vercel akan otomatis generate SSL certificate.

## 🔒 Security Checklist

- [x] `SUPABASE_SERVICE_ROLE_KEY` tidak exposed ke client
- [x] RLS policies enabled di semua tables
- [x] Environment variables set dengan benar
- [x] NEXTAUTH_SECRET unique dan rahasia
- [x] Admin password strong (min 8 karakter)
- [x] CORS configured di Supabase jika perlu
- [x] Rate limiting enabled (optional)

## 📝 Post-Deployment Checklist

- [ ] Homepage load dengan benar
- [ ] Admin login berhasil
- [ ] CRUD operations bekerja
- [ ] Image upload berfungsi
- [ ] Contact form submit berhasil
- [ ] Responsive di mobile
- [ ] SEO meta tags correct
- [ ] Favicon ditampilkan
- [ ] Performance score baik (Lighthouse)
- [ ] No console errors
- [ ] Analytics tracking aktif

## 🎉 Production Ready!

Setelah semua step selesai dan checklist terpenuhi, aplikasi Anda sudah LIVE dan siap digunakan!

**Next Steps:**
1. Populate data portfolio
2. Upload projects & images
3. Share link ke social media
4. Monitor traffic & errors
5. Iterate & improve

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Environment Variables Best Practices](https://vercel.com/docs/concepts/projects/environment-variables)
