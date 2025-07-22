# Cheeko Web App

This is a Next.js web application for managing Cheeko smart toys. It provides a web-based interface for toy activation and management while the mobile app is under review.

## Features

- **Google Sign-In Authentication**: Secure login using Google OAuth
- **Toy Management**: View all registered toys with their settings
- **Toy Activation**: Activate new toys using 6-digit PIN codes
- **Toy Configuration**: Edit toy settings including name, role, language, and voice
- **Parent Profile**: Manage parent account information
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Copy the Supabase credentials from your Flutter app's `.env` file to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

3. **Configure Google OAuth in Supabase**
   
   - Go to your Supabase dashboard
   - Navigate to Authentication > Providers
   - Enable Google provider
   - Add your redirect URL: `http://localhost:3000/auth/callback` (for development)
   - For production, add your production URL

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
web-app/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── toys/              # Toy management pages
│   └── profile/           # Profile pages
├── components/            # Reusable React components
├── lib/                   # Utilities and services
│   └── supabase/         # Supabase client and service
├── styles/               # Global styles
└── public/               # Static assets
```

## Technology Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Backend as a Service for auth and database
- **Lucide React**: Icon library

## Deployment

This app can be deployed to any platform that supports Next.js:

- **Vercel** (recommended): [vercel.com](https://vercel.com)
- **Netlify**: [netlify.com](https://netlify.com)
- **Railway**: [railway.app](https://railway.app)

Remember to set your environment variables in your deployment platform.

## Notes

- This web app shares the same Supabase backend as the Flutter mobile app
- All data is synchronized between web and mobile platforms
- The app follows the same color scheme and design patterns as the mobile app