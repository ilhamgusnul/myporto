# Vercel Deployment Guide

Complete guide untuk deploy portfolio ke Vercel dengan Supabase backend.

---

## 📋 Prerequisites

- ✅ Supabase project sudah setup dengan migrations
- ✅ Admin user sudah dibuat di Supabase Auth
- ✅ GitHub repository ready
- ✅ Vercel account (gratis di [vercel.com](https://vercel.com))

---

## 🚀 Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/your-repo.git
git push -u origin main
```

### 2. Import Project ke Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository
4. Click **Import**

### 3. Configure Environment Variables

⚠️ **PENTING**: Set semua environment variables sebelum deploy!

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

#### Required Variables:

```env
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<generate-new-with-openssl>
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_role_key
```

#### Generate NEXTAUTH_SECRET

Run locally (di terminal):
```bash
openssl rand -base64 32
```

Copy output dan paste sebagai value untuk `NEXTAUTH_SECRET`.

#### Get Supabase Keys

1. Open Supabase Dashboard
2. Go to **Settings** → **API**
3. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Deploy

1. Click **Deploy**
2. Wait untuk build selesai (~2-3 minutes)
3. Vercel akan otomatis generate URL: `https://your-project.vercel.app`

### 5. Update NEXTAUTH_URL (After First Deploy)

⚠️ **CRITICAL**: After first deployment:

1. Copy your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Go to Vercel → Settings → Environment Variables
3. Edit `NEXTAUTH_URL` value dengan URL Vercel Anda
4. Click **Save**
5. Go to Deployments → Click **Redeploy**

---

## ✅ Verify Deployment

### Test Landing Page
Visit: `https://your-project.vercel.app`

Should show:
- ✅ Hero section with About info
- ✅ Stats, Services, Skills
- ✅ Projects carousel
- ✅ Contact form

### Test Admin Login
Visit: `https://your-project.vercel.app/login`

Login dengan:
- Email: [email yang dibuat di Supabase]
- Password: [password yang di-set]

Should redirect ke: `https://your-project.vercel.app/admin`

---

## 🔧 Troubleshooting

### Error: "Configuration Error" pada login

**Problem**: `NEXTAUTH_SECRET` tidak di-set atau invalid

**Solution**:
1. Generate new secret: `openssl rand -base64 32`
2. Set di Vercel env vars
3. Redeploy

### Error: "Invalid email or password"

**Problem**: User tidak ada di Supabase atau Profile tidak dibuat

**Solution**:
1. Cek di Supabase → Authentication → Users
2. Pastikan user exists dan email confirmed
3. Run SQL untuk create/update Profile:
   ```sql
   INSERT INTO public."Profile" (id, email, name, role, "createdAt", "updatedAt")
   VALUES (
       'user-id-from-auth-users'::uuid,
       'your-email@example.com',
       'Your Name',
       'ADMIN',
       NOW(),
       NOW()
   )
   ON CONFLICT (id) DO UPDATE SET
       role = 'ADMIN',
       name = 'Your Name';
   ```

### Error: Images tidak muncul

**Problem**: Image URLs tidak accessible atau CORS issue

**Solution**:
1. Pastikan images di-upload ke Supabase Storage
2. Atau gunakan external URLs (Imgur, Cloudinary, dll)

### Error: "supabaseUrl is required"

**Problem**: Environment variables tidak ke-load

**Solution**:
1. Cek semua env vars di Vercel Dashboard
2. Pastikan tidak ada typo pada key names
3. Redeploy dengan clear cache

---

## 🎨 Custom Domain (Optional)

### Setup Custom Domain

1. Go to Vercel Dashboard → Settings → Domains
2. Click **Add Domain**
3. Enter your domain (e.g., `yourname.com`)
4. Follow DNS configuration instructions

#### For Cloudflare:
```
Type: CNAME
Name: @ (or www)
Target: cname.vercel-dns.com
```

#### For Namecheap/GoDaddy:
```
Type: CNAME
Host: @
Value: cname.vercel-dns.com
```

5. Wait for DNS propagation (~5-30 minutes)
6. Update `NEXTAUTH_URL` ke custom domain Anda
7. Redeploy

---

## 📊 Performance Tips

### Enable ISR (Incremental Static Regeneration)

Add to `src/app/page.tsx`:

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

### Optimize Images

Images akan otomatis di-optimize oleh Next.js Image component.

Untuk external images, tambahkan domain di `next.config.js`:

```javascript
module.exports = {
  images: {
    domains: ['your-project.supabase.co', 'other-domain.com'],
  },
};
```

### Database Connection Pooling

Pastikan menggunakan **Pooler connection string** dari Supabase untuk production.

---

## 🔄 Continuous Deployment

Setelah setup awal, setiap push ke GitHub akan otomatis trigger deployment baru:

```bash
git add .
git commit -m "Update homepage"
git push origin main
```

Vercel akan:
1. ✅ Build project
2. ✅ Run tests (jika ada)
3. ✅ Deploy ke production
4. ✅ Send notification

---

## 📈 Monitoring

### View Logs

Vercel Dashboard → Deployments → [Select deployment] → Logs

### View Analytics

Vercel Dashboard → Analytics

Track:
- Page views
- Unique visitors
- Top pages
- Load times

---

## 💾 Backup Strategy

### Database Backup

Supabase automatically creates backups (7 days retention on free plan).

Manual backup:
1. Supabase Dashboard → Database
2. Click **Backup**
3. Download SQL dump

### Environment Variables Backup

Save your env vars securely (1Password, BitWarden, etc):

```env
# Production Env Vars (DO NOT COMMIT)
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 🆘 Support

### Vercel Docs
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### Supabase Docs
- [Database](https://supabase.com/docs/guides/database)
- [Auth](https://supabase.com/docs/guides/auth)

### Community
- [Vercel Discord](https://discord.gg/vercel)
- [Supabase Discord](https://discord.supabase.com)

---

**Happy Deploying! 🚀**
