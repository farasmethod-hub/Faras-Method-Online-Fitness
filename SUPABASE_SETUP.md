# FARAS METHOD – Supabase Backend Setup & Configuration Guide

This platform utilizes **Supabase (PostgreSQL, Auth, Storage, RLS)** for all backend services. Follow these instructions to initialize or verify your database, tables, RLS security policies, and storage buckets.

---

## 1. Connect / Create Supabase Project

1. Navigate to [https://supabase.com](https://supabase.com) and log in using your **GitHub account (`farasmethod@gmail.com`)**.
2. Click **New Project** (or select your existing `faras-method` project).
3. Set your project name: `faras-method`.
4. Set a strong database password and choose your preferred hosting region (e.g., Central India / Mumbai `ap-south-1` or closest to your primary audience).
5. Wait for the project initialization to complete.

---

## 2. Execute SQL Database Migration

1. In your Supabase dashboard, click on the **SQL Editor** tab on the left sidebar.
2. Click **New query**.
3. Copy the entire contents of:
   `supabase/migrations/00001_initial_schema.sql`
4. Paste the SQL into the editor and click **Run**.
5. This automatically configures:
   - All 15 relational tables (`admin_roles`, `trainers`, `training_programs`, `packages`, `package_features`, `syllabus_modules`, `clients`, `bookings`, `transformations`, `articles`, `testimonials`, `faqs`, `announcements`, `website_settings`, `media_assets`).
   - Foreign key cascades and generated columns.
   - High-performance query indexes.
   - **Row Level Security (RLS) policies** strictly separating public read access from admin write operations.
   - 6 Storage buckets (`trainer-photos`, `transformation-images`, `article-images`, `service-images`, `branding-assets`, `documents-pdfs`) with public read policies.

---

## 3. Configure Environment Variables

1. In Supabase, go to **Project Settings** -> **API**.
2. Copy your **Project URL** and **anon / public** API key.
3. In your local `.env.local` (and in **Vercel Project Settings -> Environment Variables**), set:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Application Settings
NEXT_PUBLIC_SITE_NAME="FARAS METHOD"
NEXT_PUBLIC_SITE_URL="https://faras-method.vercel.app"
NEXT_PUBLIC_TRAINER_NAME="Faras"
NEXT_PUBLIC_WHATSAPP_NUMBER="918138954423"
NEXT_PUBLIC_INSTAGRAM_HANDLE="itsfarasu"
NEXT_PUBLIC_CONTACT_EMAIL="contact@farasmethod.com"
ADMIN_SECRET_KEY="super-secret-admin-key"
```

> **Security Rule**: Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser-facing code or with a `NEXT_PUBLIC_` prefix.

---

## 4. Admin User Creation

1. Go to **Authentication** -> **Users** in the Supabase dashboard.
2. Click **Add User** -> **Create User**.
3. Enter email: `coach@farasmethod.com` and a secure password.
4. In the SQL Editor, grant the admin role:
   ```sql
   INSERT INTO public.admin_roles (user_id, role)
   SELECT id, 'super_admin' FROM auth.users WHERE email = 'coach@farasmethod.com';
   ```
5. Head Coach Faras can now sign in at `https://your-domain.vercel.app/admin/login` using these credentials.
