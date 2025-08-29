# 🚀 Vercel Deployment Guide

## Prerequisites
- [Vercel Account](https://vercel.com/signup)
- [GitHub Repository](https://github.com/Anupkumarpandey1/B.git)
- Node.js 18+ installed locally

## Step 1: Prepare Your Project

### 1.1 Build the Project Locally
```bash
npm run build
```

### 1.2 Test the Build
```bash
npm run preview
```

## Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI
```bash
npm i -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
```

### 2.3 Deploy
```bash
vercel
```

### 2.4 Follow the Prompts:
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N`
- Project name: `your-project-name` (or press Enter for default)
- In which directory: `.` (current directory)
- Override settings: `N`

## Step 3: Configure Environment Variables

### 3.1 In Vercel Dashboard:
1. Go to your project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add the following variables:

```
VITE_GEMINI_API_KEY=AIzaSyAWFGHhI3vjvkjpzM70sDOBQsW_L5w5QdY
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_SUPABASE_URL=https://wgyzldjujhebaezncefi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndneXpsZGp1amhlYmFlem5jZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTMwODcsImV4cCI6MjA1OTA4OTA4N30.g5gKcsHmPlABZlJKe7A8Es2IqvHIOauEaZHYAMG9NsI
VITE_APP_ENV=production
```

### 3.2 Redeploy After Adding Environment Variables:
```bash
vercel --prod
```

## Step 4: Configure Custom Domain (Optional)

### 4.1 In Vercel Dashboard:
1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

## Step 5: Test Dynamic Routes

### 5.1 Test These URLs:
- Home: `https://your-domain.vercel.app/`
- Auth: `https://your-domain.vercel.app/auth`
- Quiz Creator: `https://your-domain.vercel.app/quiz-creator`
- Dynamic Quiz: `https://your-domain.vercel.app/quiz/123`
- User Profile: `https://your-domain.vercel.app/profile`
- 404: `https://your-domain.vercel.app/non-existent-page`

## Step 6: Verify Features

### 6.1 Test These Features:
- ✅ Quiz Generation (Gemini API)
- ✅ User Authentication (Supabase)
- ✅ Dynamic Routing
- ✅ PDF Upload & Processing
- ✅ YouTube Video Processing
- ✅ Multi-language Support
- ✅ Responsive Design

## Troubleshooting

### Common Issues:

1. **Build Errors**: Check Node.js version (18+ required)
2. **API Errors**: Verify environment variables are set correctly
3. **Routing Issues**: Ensure vercel.json is properly configured
4. **CORS Issues**: Check Supabase CORS settings

### Debug Commands:
```bash
# Check build locally
npm run build

# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs

# Redeploy
vercel --prod
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Build successful locally
- [ ] All dynamic routes working
- [ ] API integrations functional
- [ ] Authentication working
- [ ] File uploads working
- [ ] Mobile responsive
- [ ] Performance optimized

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Check browser console for errors
