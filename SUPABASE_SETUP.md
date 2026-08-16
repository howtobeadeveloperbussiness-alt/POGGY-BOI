# Supabase Setup Guide for POG Portfolio

This document provides step-by-step instructions to configure your Supabase PostgreSQL database, authentication, and storage for the POG 3D Modeler Portfolio platform.

---

## 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project** and choose a name (e.g. `pog-portfolio-database`).
3. Set a secure database password and choose your preferred region.

---

## 2. Execute the Database Migration
1. In your Supabase project dashboard, open the **SQL Editor** from the left navigation.
2. Click **New query**.
3. Copy the entire contents of `supabase/schema.sql` and paste it into the editor.
4. Click **Run** to execute the script. This creates:
   - `projects` (Works showcase)
   - `current_projects` (Active games / builds such as TRIGGER)
   - `upcoming_projects` (Pipeline & concepts)
   - `services` (What POG builds, including *Studio Style Designs*)
   - `skills` (3D tools and capabilities)
   - `site_settings` (Hero, about bio, Discord/Roblox handles, SEO)
   - RLS security policies (public SELECT, authenticated admin write/update/delete)
   - Storage bucket `portfolio-assets` with public read access

---

## 3. Create the Admin User
1. Go to **Authentication** > **Users** in the Supabase dashboard.
2. Click **Add user** > **Create user**.
3. Enter your email (e.g., `admin@pog3d.dev`) and password (e.g., `LollyistheGOAT6711`).
4. Toggle **Auto Confirm Email** to true so you can log in immediately.

---

## 4. Configure Environment Variables
In your environment configuration or `.env` file, provide your project credentials:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-publishable-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
GEMINI_API_KEY="your-gemini-api-key"
```

> **Note:** The frontend only uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` through strict Row Level Security (RLS). Secret keys and the Gemini API key remain strictly server-side.

---

## 5. Storage Bucket Configuration
The SQL migration automatically initializes the `portfolio-assets` public bucket. Verify under **Storage** > **Buckets** that `portfolio-assets` is listed with **Public** access enabled.

---

## 6. Development & Deployment
- Run locally with `npm run dev`
- Build production assets with `npm run build`
- Start production server with `npm start`
