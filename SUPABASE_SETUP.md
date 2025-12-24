# Supabase Authentication Setup Guide

## Step 1: Install Dependencies

The `@supabase/supabase-js` package is already installed. If you need to reinstall:

```bash
npm install @supabase/supabase-js
```

## Step 2: Create Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project or use an existing one
3. Wait for the database to be set up

## Step 3: Run Database Schema

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase_schema.sql`
4. Click "Run" to execute the schema

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example` if available)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Get these values from: **Supabase Dashboard > Project Settings > API**

## Step 5: Create Your First Admin User

1. Go to **Authentication > Users** in your Supabase Dashboard
2. Click **"Add User"** > **"Create new user"**
3. Enter email and password for your admin account
4. Optionally uncheck **"Auto Confirm User"** if you want email verification
5. Click **"Create User"**

## Step 6: Configure Email (Optional)

If you want email confirmation for new signups:

1. Go to **Authentication > Settings > Email Templates**
2. Configure email templates as needed
3. Enable/disable email confirmation in **Authentication > Settings > Auth**

## Step 7: Test the Application

1. Start your development server: `npm run dev`
2. Navigate to `/admin/login`
3. Use the credentials you created in Step 5
4. You should be able to log in and access the admin panel

## Troubleshooting

### "Missing Supabase environment variables" error

- Make sure your `.env` file exists in the project root
- Verify the variable names are correct: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after creating/modifying `.env`

### Can't log in

- Verify the user exists in Supabase Dashboard > Authentication > Users
- Check if email confirmation is required and verify your email
- Check browser console for error messages

### RLS (Row Level Security) errors

- Make sure you've run the schema SQL script
- Verify RLS policies are created correctly
- Check that you're authenticated when making requests

