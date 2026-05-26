# Movie Ticket Booking Application

A full-stack movie ticket booking app built with React (frontend), FastAPI (backend), and Supabase (database).

## Project Structure

```
fn/   - Frontend (React + Vite)
bn/   - Backend (FastAPI + Supabase)
```

## Tech Stack

- **Frontend:** ReactJS, React Router, Axios, Vite → Deployed on **Vercel**
- **Backend:** Python, FastAPI, Uvicorn → Deployed on **Railway**
- **Database:** Supabase (PostgreSQL)

## Database Setup (Supabase)

1. Create a new project on [Supabase](https://supabase.com/)
2. Go to SQL Editor → New Query
3. Run the contents of `supabase-schema.sql`
4. Copy your **Project URL** and **Service Role Key** (Settings → API)

## Backend Setup

```bash
cd bn
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

Run locally:
```bash
uvicorn app.main:app --reload
```

### Deploy on Railway
1. Push the `bn` folder to a GitHub repo
2. Create a new project on [Railway](https://railway.app/)
3. Deploy from GitHub, set the root directory to `bn`
4. Add environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`)

## Frontend Setup

```bash
cd fn
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

Run locally:
```bash
npm run dev
```

### Deploy on Vercel
1. Push the `fn` folder to a GitHub repo
2. Import into [Vercel](https://vercel.com/)
3. Set framework preset to **Vite**
4. Add environment variable `VITE_API_URL` pointing to your Railway backend URL

## Features

- Search movies by name
- View movie details
- Interactive seat selection
- Booking summary with user details
- Payment simulation with success message
- Admin panel (password: `admin123`) to view:
  - All user bookings
  - Movies with booking counts and revenue

## Admin Access

Click the **Admin** button on the top navbar. Login password is `admin123`.
