# TinyLink – URL Shortener (bit.ly clone)

A beautiful, fast, and fully functional URL shortener built with **Node.js + Express + PostgreSQL** (Neon) and deployed on **Railway**.

Live Demo: https://tinylink-project.up.railway.app  
GitHub: https://github.com/MythiliAmudala/tinylink-project

## Features

- Shorten URLs with auto-generated or custom 6–8 character codes  
- Real-time click tracking & last-clicked timestamp  
- Responsive dashboard with live search/filter  
- One-click copy & delete with smooth animations  
- Stats page: `/code/:code`  
- Redirect: `/:code` → 302 + click increment  
- Delete → instantly returns 404  
- Health check: `/healthz`  
- Fully passes automated testing (exact routes, 409 on duplicate, etc.)

## Tech Stack

- **Backend**: Node.js + Express  
- **Database**: PostgreSQL (Neon.tech)  
- **Templating**: EJS  
- **Styling**: Pure CSS (no framework) – modern gradient, glassmorphism, animations  
- **Deployment**: Railway (free tier)  
- **Validation**: validator.js + nanoid  
- **Responsive**: Flexbox + Grid + mobile-first media queries

## API Endpoints (as required for autograding)

| Method | Path             | Description                  |
|--------|------------------|------------------------------|
| GET    | `/api/links`     | List all links               |
| POST   | `/api/links`     | Create link (409 if code exists) |
| GET    | `/api/links/:code` | Get single link stats      |
| DELETE | `/api/links/:code` | Delete link                |
| GET    | `/healthz`       | Health check → `{ ok: true }`|

## Environment Variables (`.env.example`)

```env
DATABASE_URL=postgresql://user:pass@host/neondb?sslmode=require
BASE_URL=https://tinylink-project.up.railway.app
