# Photo A Day - Cloudflare Migration

This is the migrated version of the Photo A Day site, converted from PHP/MySQL on Hostinger to Cloudflare Pages with D1 database and R2 storage.

## Architecture

- **Frontend**: Static HTML/CSS/JS hosted on Cloudflare Pages
- **Database**: Cloudflare D1 (SQLite) - Free tier: 5GB storage, 5M reads/day
- **Storage**: Cloudflare R2 - Free tier: 10GB storage, 1M requests/month
- **API**: Cloudflare Workers for photo uploads and data fetching

## Setup Instructions

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
wrangler d1 create photo-a-day-db
```

Copy the database ID from the output and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "photo-a-day-db"
database_id = "your-actual-database-id"
```

### 4. Create R2 Bucket

```bash
wrangler r2 bucket create photo-a-day-images
```

### 5. Set up R2 Public Access

1. Go to Cloudflare Dashboard > R2 Object Storage
2. Select your bucket
3. Go to Settings > Public access
4. Enable public access and note the public URL
5. Update `R2_PUBLIC_URL` in `wrangler.toml`

### 6. Run Database Migrations

```bash
wrangler d1 migrations apply photo-a-day-db
```

### 7. Deploy to Cloudflare Pages

```bash
wrangler pages deploy
```

## Migration from Original Site

### Database Migration

1. Export your existing MySQL data:
```sql
SELECT datePhotos, fileFullNamePhotos, orderPhotos, titlePhotos FROM photos ORDER BY orderPhotos;
```

2. Upload all images from `/uploads/` to your R2 bucket

3. Update the migration script in `database/migrate.sql` with your actual data

4. Run the migration:
```bash
wrangler d1 execute photo-a-day-db --file=./database/migrate.sql
```

### File Structure

```
photoDaily-cloudflare/
├── index.html              # Main gallery page
├── upload.html             # Upload form
├── styles/                 # CSS files
│   ├── main.css            # Consolidated styles
│   ├── gallery.css         # Gallery-specific styles
│   ├── slick.css           # Slick carousel styles
│   ├── slick-theme.css     # Slick theme
│   └── lightbox.min.css    # Lightbox styles
├── js/                     # JavaScript files
│   ├── lightbox.min.js     # Lightbox functionality
│   └── slick.js            # Slick carousel
├── functions/
│   └── api.js              # Cloudflare Worker API
├── database/
│   ├── schema.sql          # Database schema
│   └── migrate.sql         # Data migration script
├── wrangler.toml           # Cloudflare configuration
└── package.json            # Project dependencies
```

## API Endpoints

- `GET /api/photos` - Fetch all photos
- `POST /api/upload` - Upload a new photo

## Features

- ✅ Responsive photo gallery with Bootstrap
- ✅ Slick carousel for featured photos
- ✅ Lightbox for full-screen viewing
- ✅ Photo upload with validation
- ✅ Automatic image optimization via R2
- ✅ CORS-enabled API endpoints
- ✅ Mobile-responsive design

## Cost Analysis

With Cloudflare's free tier:
- **D1 Database**: 5GB storage, 5M reads/day (sufficient for personal use)
- **R2 Storage**: 10GB storage, 1M requests/month (plenty for photo gallery)
- **Pages**: Unlimited static hosting
- **Workers**: 100K requests/day (more than enough for uploads)

Total monthly cost: **$0** (within free tier limits)

## Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Deploy to production
npm run deploy
```

## Environment Variables

Update these in `wrangler.toml`:
- `R2_PUBLIC_URL`: Your R2 bucket's public URL
- Database ID: From `wrangler d1 create` command
- Domain: Your actual domain name

## Troubleshooting

1. **CORS Issues**: Ensure `corsHeaders` are properly set in the Worker
2. **Database Connection**: Verify database ID in `wrangler.toml`
3. **R2 Access**: Check bucket permissions and public URL configuration
4. **File Upload**: Ensure file size limits and MIME type validation

## Support

For issues or questions, contact: michaelbourlotos@gmail.com
