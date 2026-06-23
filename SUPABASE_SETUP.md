# Supabase setup for Autoline (client-side)

1. Create a Supabase project at https://app.supabase.com.

2. Create the `parts` table
   - Open SQL editor and run the SQL in `db/create_parts.sql`.

3. Get API keys
   - In Project → Settings → API, copy the `URL` and the `anon` public key.

4. Add Vercel Environment Variables
   - In your Vercel project settings, add:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your anon/public key

5. Deploy
   - Push to GitHub and redeploy on Vercel. The frontend will use Supabase directly for shared data and realtime updates.

6. Security notes
   - Using the anon key from the frontend is standard for client-side Supabase apps. To protect your data, configure Row Level Security (RLS) and policies, or use server-side functions with a service role key.
