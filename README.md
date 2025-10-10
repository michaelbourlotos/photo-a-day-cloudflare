# Photo A Day

A personal photo gallery built with Cloudflare Pages, D1 database, and R2 storage.

## Features

- 📸 Responsive photo gallery with Bootstrap
- 🎠 Slick carousel for featured photos
- 🔍 Lightbox for full-screen viewing
- ⬆️ Photo upload with password protection
- 📱 Mobile-responsive design
- 🚀 Automatic deployments from GitHub

## Tech Stack

- **Frontend**: Static HTML/CSS/JS hosted on Cloudflare Pages
- **Database**: Cloudflare D1 (SQLite) - Free tier: 5GB storage, 5M reads/day
- **Storage**: Cloudflare R2 - Free tier: 10GB storage, 1M requests/month
- **API**: Cloudflare Pages Functions for photo uploads and data fetching
- **Deployment**: Automatic via GitHub integration

## Local Development

### Prerequisites
- Node.js and npm installed
- Wrangler CLI: `npm install -g wrangler`
- Cloudflare account with Pages, D1, and R2 access

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/yourusername/photo-a-day-cloudflare.git
   cd photo-a-day-cloudflare
   npm install
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Start local development server**
   ```bash
   wrangler pages dev
   ```

4. **Visit your local site**
   - Main gallery: `http://localhost:8788`
   - Upload page: `http://localhost:8788/upload.html`

### Environment Variables

Set these in Cloudflare Pages dashboard (Settings → Environment variables):
- `UPLOAD_PASSWORD`: Password for photo uploads
- `R2_PUBLIC_URL`: Your R2 bucket's public URL

## API Endpoints

- `GET /api/photos` - Fetch all photos
- `POST /api/upload` - Upload a new photo (requires password)


## Deployment

The site automatically deploys when changes are pushed to the `main` branch on GitHub.
