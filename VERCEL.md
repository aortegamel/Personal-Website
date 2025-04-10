# Vercel Deployment Guide

This project is configured for deployment on Vercel. Here's how to set it up:

## Deployment Steps

1. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com) and sign in with your GitHub account
   - Import this repository
   - Vercel will automatically detect the Next.js project

2. **Configure Environment Variables**:
   - No environment variables are required for basic deployment

3. **Deploy**:
   - Click "Deploy" and Vercel will build and deploy your site
   - The build process will:
     - Build the Next.js application
     - Generate the search data
     - Optimize assets for production

## Project Structure

- The main Next.js application is in the `nextjs-portfolio` directory
- The Vercel configuration is in the root `vercel.json` file
- The `.vercelignore` file excludes unnecessary files from deployment

## Custom Domain Setup

To set up a custom domain:

1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your custom domain
4. Follow Vercel's instructions to verify domain ownership

## Troubleshooting

If you encounter issues with the deployment:

1. Check the build logs in Vercel
2. Ensure all dependencies are correctly installed
3. Verify that the `vercel.json` configuration is correct
4. Make sure the `nextjs-portfolio` directory contains all necessary files

## Local Development

To develop locally:

```bash
cd nextjs-portfolio
npm install
npm run dev
```

## Building for Production

To build for production locally:

```bash
cd nextjs-portfolio
npm run build
```

This will build the Next.js application and generate the search data.
