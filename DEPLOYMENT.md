# 🚀 Deployment Guide - Netlify + Supabase

This guide will help you deploy your Kamer Tech Mall authentication system to Netlify with Supabase as your production database.

## Prerequisites

- [ ] GitHub account (to connect with Netlify)
- [ ] Netlify account ([netlify.com](https://netlify.com))
- [ ] Supabase account ([supabase.com](https://supabase.com))
- [ ] Your code pushed to a GitHub repository

## Part 1: Set Up Supabase Database

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose a name (e.g., "kamer-tech-mall")
4. Set a strong database password (save this!)
5. Select a region close to your users (e.g., West Europe for Cameroon)
6. Click "Create new project" and wait for setup to complete

### Step 2: Run Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Open the file `supabase-schema.sql` from your project
3. Copy all the SQL code
4. Paste it into the Supabase SQL Editor
5. Click "Run" to execute the schema
6. Verify tables were created by checking the Table Editor

### Step 3: Get Supabase Credentials

1. Go to Project Settings → API
2. Copy these values (you'll need them later):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - Go to Settings → Database → Connection String
   - Copy the **Service Role key** (keep this secret!)

## Part 2: Deploy to Netlify

### Method A: Deploy via Netlify UI (Easiest)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "Add new site" → "Import an existing project"
4. Choose "GitHub" and authorize Netlify
5. Select your repository
6. Configure build settings:
   - **Build command**: `npm install`
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`
7. Click "Show advanced" → "Add environment variables"
8. Add these environment variables:

```
NODE_ENV=production
DB_TYPE=supabase
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SESSION_SECRET=generate-a-strong-random-string-here
```

9. Click "Deploy site"
10. Wait for deployment to complete (2-3 minutes)

### Method B: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize your site:
```bash
netlify init
```

4. Add environment variables:
```bash
netlify env:set NODE_ENV production
netlify env:set DB_TYPE supabase
netlify env:set SUPABASE_URL "your-url"
netlify env:set SUPABASE_ANON_KEY "your-key"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your-key"
netlify env:set SESSION_SECRET "your-secret"
```

5. Deploy:
```bash
netlify deploy --prod
```

## Part 3: Test Your Deployment

1. Go to your Netlify site URL (e.g., `https://your-site.netlify.app`)
2. Test registration:
   - Click "Register"
   - Create a test seller account
   - Verify you receive success message
3. Test login:
   - Login with your test account
   - Verify redirect to dashboard
4. Test profile update:
   - Go to Profile
   - Update business information
   - Save and verify changes

## Part 4: Custom Domain (Optional)

1. In Netlify, go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `sellers.kamertechmall.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)
6. Netlify will automatically provision SSL certificate

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `DB_TYPE` | Database type | `supabase` |
| `SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGci...` |
| `SESSION_SECRET` | Session encryption secret | Random 32+ character string |

## Security Checklist

Before going live, ensure:

- [ ] Strong `SESSION_SECRET` is set (use a random generator)
- [ ] Supabase Row Level Security (RLS) policies are enabled
- [ ] Service role key is kept secret (never commit to Git)
- [ ] HTTPS is enabled (Netlify provides this automatically)
- [ ] Environment variables are set in Netlify (not in code)
- [ ] Database backups are enabled in Supabase
- [ ] Test all authentication flows in production

## Monitoring & Maintenance

### Netlify Logs
- Go to Netlify Dashboard → Functions → server
- View function logs for errors and debugging

### Supabase Monitoring
- Go to Supabase Dashboard → Database → Logs
- Monitor query performance and errors
- Set up alerts for downtime

### Regular Backups
Supabase automatically backs up your database, but you can also:
1. Go to Database → Backups
2. Download manual backups regularly
3. Store in secure location

## Troubleshooting

### "Cannot find module" errors
- Ensure all dependencies are in `package.json` dependencies (not devDependencies)
- Check Netlify build logs for specific missing packages

### Database connection fails
- Verify Supabase credentials are correct
- Check Supabase project is not paused (free tier auto-pauses after inactivity)
- Verify DB_TYPE is set to "supabase"

### Session not persisting
- Check SESSION_SECRET is set
- Verify cookies are enabled in browser
- For custom domain, ensure cookie settings match domain

### 502 Bad Gateway
- Check Netlify function logs for errors
- Verify environment variables are set correctly
- Check Supabase connection is working

## Performance Optimization

### Netlify
- Enable asset optimization in Site settings
- Use Netlify CDN for static assets
- Enable function caching where appropriate

### Supabase
- Add database indexes (already included in schema)
- Monitor slow queries in Dashboard
- Consider upgrading to Pro plan for better performance

## Cost Estimation

### Free Tier Limits
- **Netlify**: 100GB bandwidth, 300 build minutes/month
- **Supabase**: 500MB database, 2GB bandwidth, 50MB file storage

### When to Upgrade
Consider paid plans when you reach:
- 1000+ active sellers
- 10GB+ database size
- High traffic volumes

## Support

- **Netlify Support**: [answers.netlify.com](https://answers.netlify.com)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Documentation**: See `README-AUTH.md` for application-specific help

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Configure email service for notifications
3. Implement password reset functionality
4. Add product management features
5. Set up payment processing
6. Create admin panel

---

🎉 **Congratulations!** Your authentication system is now live in production!

