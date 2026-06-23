# Supabase setup for Autoline

1. Create a Supabase project
   - Go to https://app.supabase.com and create a new project.

2. Create the `parts` table
   - Open the SQL editor in Supabase and run the SQL in `db/create_parts.sql`.

3. Get API keys
   - In the Supabase project settings -> API, copy the `URL` and the `Service Role` key.
   - For production use in Vercel, use the *Service Role* key so the server can write.

4. Add Vercel Environment Variables
   - In your Vercel project, add:
     - `SUPABASE_URL` = your Supabase URL
     - `SUPABASE_KEY` = your Service Role key

5. Local development (optional)
   - The app has a local-file fallback. If you don't set `SUPABASE_URL`/`SUPABASE_KEY`, the API will use `server/parts.json`.
   - To test with Supabase locally, create a `.env.local` with the same vars.

6. Deploy
   - Push the repo to GitHub (already done). Trigger a Vercel redeploy.
   - After deploy, open the public link and test add/edit/delete parts.

7. Troubleshooting
   - If deploy fails during `npm install`, ensure `@supabase/supabase-js` is present in `package.json`.
   - If parts do not appear, check Vercel function logs and the `SUPABASE_KEY` permissions.
