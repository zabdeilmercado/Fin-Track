# Connect your own Supabase project

## 1. Create the project

Open https://supabase.com/dashboard and sign in. Create a project named **FinTrack** in your own organization. Choose a region near you and choose/store the database password yourself. Wait for provisioning to finish. You can use an existing active project instead.

## 2. Install the database

In that project, open **SQL Editor → New query**. Copy the contents of `supabase/schema.sql` into the editor and run it. This creates a `finance_state` table and enables policies so signed-in users can only read/write their own records. The script is safe to rerun; it does not remove financial records.

The budget and savings fields are part of the existing finance document, so no separate tables or migration are required for users who already installed the first version of this schema.

## 3. Connect FinTrack

Open the project's **Connect** dialog and find its **Project URL** and **publishable key**. A legacy public **anon** key also works. Follow the official [Vue quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/vue) if these labels change.

Edit the `.env` file in the FinTrack project:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLIC-KEY
```

Replace the example values. If using a legacy anon key, use `VITE_SUPABASE_ANON_KEY` instead of the second variable. Remove stale duplicate variables; the publishable-key variable takes precedence. Never put a database password, secret key, or service-role key in this file. `.env` is excluded from Git.

Restart the development server after changes:

```
npm run dev
```

## 4. Configure sign-in and email links

Under **Authentication**, enable the email provider and leave email confirmation enabled. Set **URL Configuration → Site URL** to your app address. During development this is usually `http://localhost:5173` (use the exact address printed by Vite).

Add the following to allowed redirect URLs, using your actual app address:

- `http://localhost:5173/reset-password`
- `https://YOUR-DEPLOYED-APP/reset-password`

Set Site URL to the deployed HTTPS app when publishing. Keep the default confirmation and reset email templates. See [redirect URL settings](https://supabase.com/docs/guides/auth/redirect-urls).

The default Supabase email sender only delivers to addresses on the project's team. For your first personal account, use the email associated with your Supabase team membership. To use another address or invite other people, configure a custom SMTP provider first. See [Supabase email delivery](https://supabase.com/docs/guides/auth/auth-smtp). Do not disable email confirmation to work around a delivery problem.

## 5. Verify your real account

1. Open FinTrack, create your account, and confirm the email. The FinTrack login account is separate from signing in to the Supabase dashboard.
2. Sign in and add an Everyday Money account with its current balance.
3. Add a Savings account with the amount already saved.
4. Set this month's spending limit in **Budgets**.
5. Record one expense and check the remaining budget.
6. Set a goal in **Savings**, then record a **Transfer** from Everyday Money to Savings. Verify the goal progresses without increasing expenses.
7. Refresh, sign out/in, then sign in on a second device after deployment. The same records should appear.
8. Use a separate test account to confirm it cannot see the first account's records. Local tests do not prove policies in a remote project have been installed.

## 6. Publish and install

Import your Git repository into Vercel using its **Vite** preset. Use `npm run build`, output directory `dist`, and add the same two environment variables in Vercel. Deploy, then use the deployed HTTPS address in Supabase URL Configuration. Redeploy after changing environment variables.

On Android/desktop, use the browser's **Install app** action, or **Settings → Install app** in FinTrack when offered. On iPhone, open the HTTPS site in Safari → Share → Add to Home Screen. See [web app installation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

FinTrack caches its app interface, not private cloud records. Reconnect to the internet before loading or saving finances. Pending forms are not silently queued for later upload.
