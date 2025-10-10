# Photo A Day - Cloudflare Pages

A personal photo gallery built with Cloudflare Pages, D1 database, and R2 storage.

## Architecture

- **Frontend**: Static HTML/CSS/JS hosted on Cloudflare Pages
- **Database**: Cloudflare D1 (SQLite) - Free tier: 5GB storage, 5M reads/day
- **Storage**: Cloudflare R2 - Free tier: 10GB storage, 1M requests/month
- **API**: Cloudflare Pages Functions for photo uploads and data fetching
- **Deployment**: Automatic via GitHub integration

## Features

- ✅ Responsive photo gallery with Bootstrap
- ✅ Slick carousel for featured photos
- ✅ Lightbox for full-screen viewing
- ✅ Photo upload with validation
- ✅ Automatic image optimization via R2
- ✅ CORS-enabled API endpoints
- ✅ Mobile-responsive design
- ✅ Automatic deployments from GitHub

## API Endpoints

- `GET /api/photos` - Fetch all photos
- `POST /api/upload` - Upload a new photo

## Development

### Local Development
```bash
# Install dependencies
npm install

# Run local development server
npm run dev
```

### Deployment
The site automatically deploys when changes are pushed to the `main` branch on GitHub.

### Manual Deployment (if needed)
```bash
wrangler pages deploy
```

## File Structure

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
│   └── api/
│       ├── photos.js       # Photos API endpoint
│       └── upload.js       # Upload API endpoint
├── database/
│   └── schema.sql          # Database schema
├── migrations/
│   └── 0001_initial.sql    # Initial database migration
├── wrangler.toml           # Cloudflare configuration
└── package.json            # Project dependencies
```

## Cost Analysis

With Cloudflare's free tier:
- **D1 Database**: 5GB storage, 5M reads/day (sufficient for personal use)
- **R2 Storage**: 10GB storage, 1M requests/month (plenty for photo gallery)
- **Pages**: Unlimited static hosting
- **Functions**: 100K requests/day (more than enough for uploads)

Total monthly cost: **$0** (within free tier limits)

## Environment Variables

Configured in Cloudflare Pages dashboard:
- `R2_PUBLIC_URL`: Your R2 bucket's public URL

## Database Schema

```sql
CREATE TABLE photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    datePhotos TEXT NOT NULL,
    fileFullNamePhotos TEXT NOT NULL,
    orderPhotos INTEGER NOT NULL,
    titlePhotos TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Support

For issues or questions, contact: michaelbourlotos@gmail.com