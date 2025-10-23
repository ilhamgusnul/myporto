# Vercel Deployment Configuration

## Environment Variables

Set the following in Vercel Dashboard (Settings → Environment Variables):

### Required Variables

```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate-new-secret>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:password@host:5432/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

### Generate NEXTAUTH_SECRET

Run locally:
```bash
openssl rand -base64 32
```

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/portfolio.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy!

3. **Post-Deployment**

   After first deployment, you may need to run migrations:

   ```bash
   # Update .env with production DATABASE_URL
   npx prisma migrate deploy
   
   # Optional: Seed production data
   npm run prisma:seed
   ```

## Build Configuration

Vercel automatically detects Next.js projects. Default settings work fine:

- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Custom Domain

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain

## Performance Optimization

### Image Optimization

Add to `next.config.js`:

```js
images: {
  domains: ['your-supabase-project.supabase.co'],
  formats: ['image/avif', 'image/webp'],
}
```

### ISR (Incremental Static Regeneration)

For better performance on landing page:

```tsx
export const revalidate = 60; // Revalidate every 60 seconds
```

## Troubleshooting

### Build Errors

1. **Prisma Client Not Found**
   ```bash
   # Add postinstall script to package.json
   "postinstall": "prisma generate"
   ```

2. **Environment Variables**
   - Make sure all variables are set in Vercel Dashboard
   - Don't include quotes around values in Vercel UI

3. **Database Connection**
   - Use connection pooling URL from Supabase
   - Include `pgbouncer=true&connection_limit=1`

## Monitoring

- Check **Vercel Analytics** for performance insights
- Monitor **Vercel Logs** for runtime errors
- Set up **Sentry** for error tracking (optional)

## CI/CD

Vercel automatically deploys on push to main branch. For staging:

1. Create `develop` branch
2. Vercel will create preview deployments automatically
3. Merge to `main` for production

## Database Backups

Supabase automatically backs up your database. To download:

1. Go to Supabase Dashboard → Database → Backups
2. Download latest backup
3. Store securely

## Cost Optimization

- **Vercel**: Free tier includes 100GB bandwidth
- **Supabase**: Free tier includes 500MB database + 1GB storage
- **Upgrade** only when you exceed limits

---

For more details, see:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
