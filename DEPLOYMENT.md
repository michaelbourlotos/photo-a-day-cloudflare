# Deployment Checklist

## Pre-Deployment Setup

### 1. Cloudflare Account Setup
- [ ] Create Cloudflare account
- [ ] Add your domain to Cloudflare
- [ ] Update nameservers if needed

### 2. Install Required Tools
- [ ] Install Node.js and npm
- [ ] Install Wrangler CLI: `npm install -g wrangler`
- [ ] Login to Cloudflare: `wrangler login`

### 3. Database Setup
- [ ] Run migration script: `./migrate.sh`
- [ ] Note the database ID from output
- [ ] Update `wrangler.toml` with correct database ID

### 4. R2 Storage Setup
- [ ] Create R2 bucket (done by migrate.sh)
- [ ] Enable public access in Cloudflare dashboard
- [ ] Note the public URL
- [ ] Update `R2_PUBLIC_URL` in `wrangler.toml`

### 5. Data Migration
- [ ] Run `export-data.php` on your Hostinger server
- [ ] Copy the SQL output to `database/migrate.sql`
- [ ] Upload all images from `/uploads/` to R2 bucket
- [ ] Run: `wrangler d1 execute photo-a-day-db --file=./database/migrate.sql`

### 6. Configuration Updates
- [ ] Update domain name in `wrangler.toml`
- [ ] Update `R2_PUBLIC_URL` with actual bucket URL
- [ ] Test API endpoints locally

## Deployment Steps

### 1. Deploy to Cloudflare Pages
```bash
wrangler pages deploy
```

### 2. Configure Custom Domain
- [ ] Go to Cloudflare Pages dashboard
- [ ] Add custom domain
- [ ] Update DNS records

### 3. Test Everything
- [ ] Visit main gallery page
- [ ] Test photo upload functionality
- [ ] Verify carousel works
- [ ] Test lightbox functionality
- [ ] Check mobile responsiveness

## Post-Deployment

### 1. Update DNS
- [ ] Point subdomain to Cloudflare Pages
- [ ] Remove old Hostinger hosting

### 2. Monitor Performance
- [ ] Check Cloudflare analytics
- [ ] Monitor D1 database usage
- [ ] Monitor R2 storage usage

### 3. Backup Strategy
- [ ] Export D1 database regularly
- [ ] Keep R2 bucket backed up
- [ ] Document configuration

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check Worker CORS headers
2. **Database Connection**: Verify database ID in wrangler.toml
3. **Image Upload Fails**: Check R2 bucket permissions
4. **Images Not Loading**: Verify R2_PUBLIC_URL

### Support Commands
```bash
# Check database status
wrangler d1 list

# View database contents
wrangler d1 execute photo-a-day-db --command="SELECT * FROM photos LIMIT 5"

# Check R2 bucket
wrangler r2 bucket list

# View Worker logs
wrangler tail
```

## Cost Monitoring

### Free Tier Limits
- **D1**: 5GB storage, 5M reads/day
- **R2**: 10GB storage, 1M requests/month
- **Pages**: Unlimited static hosting
- **Workers**: 100K requests/day

### Monitoring
- [ ] Set up Cloudflare analytics
- [ ] Monitor usage in dashboard
- [ ] Set up alerts if approaching limits
