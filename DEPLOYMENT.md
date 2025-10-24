# Deployment Guide - GitHub Pages

This guide will help you deploy your portfolio to `balavoffici.github.io` using GitHub Actions.

## Prerequisites

1. A GitHub account
2. Git installed on your local machine
3. Your portfolio code ready to deploy

## Step-by-Step Deployment Instructions

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in with username: `balavoffici`
2. Click the **"+"** icon in the top right corner and select **"New repository"**
3. Name your repository: `balavoffici.github.io`
   - **Important**: For a user site, the repository name MUST be `yourusername.github.io`
4. Set the repository to **Public**
5. Do NOT initialize with README (we already have one)
6. Click **"Create repository"**

### 2. Initialize Git and Push Your Code

Open your terminal in the project directory and run:

```bash
# Initialize git repository (if not already initialized)
git init

# Add all files to git
git add .

# Commit your files
git commit -m "Initial commit: Portfolio website"

# Add your GitHub repository as remote origin
git remote add origin https://github.com/balavoffici/balavoffici.github.io.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

### 3. Configure GitHub Pages

1. Go to your repository on GitHub: `https://github.com/balavoffici/balavoffici.github.io`
2. Click on **"Settings"** tab
3. In the left sidebar, click on **"Pages"**
4. Under **"Build and deployment"**:
   - **Source**: Select **"GitHub Actions"**
5. Save the settings

### 4. Enable GitHub Actions Workflow

The GitHub Actions workflow file is already created at `.github/workflows/deploy.yml`.

When you push your code to GitHub, the workflow will automatically:

- Install dependencies
- Build your Angular application
- Deploy to GitHub Pages

### 5. Monitor Deployment

1. Go to the **"Actions"** tab in your GitHub repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Click on it to see the deployment progress
4. Once it's complete (green checkmark ✓), your site will be live!

### 6. Access Your Website

Your portfolio will be available at:

```
https://balavoffici.github.io
```

It may take a few minutes for the site to be available after the first deployment.

## Automatic Deployments

Once set up, any push to the `main` branch will automatically trigger a new deployment. You can also manually trigger a deployment from the Actions tab by clicking "Run workflow".

## Troubleshooting

### Workflow Permissions Error

If you see a permissions error in the Actions tab:

1. Go to **Settings** > **Actions** > **General**
2. Scroll down to **"Workflow permissions"**
3. Select **"Read and write permissions"**
4. Check **"Allow GitHub Actions to create and approve pull requests"**
5. Click **"Save"**
6. Re-run the failed workflow

### 404 Error After Deployment

If you see a 404 error:

1. Check that the repository name is exactly `balavoffici.github.io`
2. Verify that GitHub Pages source is set to "GitHub Actions"
3. Check the Actions tab to ensure the deployment completed successfully
4. Wait a few minutes and try clearing your browser cache

### Build Errors

If the build fails in the Actions workflow:

1. Check the error message in the Actions tab
2. Test the build locally by running: `npm run build`
3. Fix any errors and commit the changes
4. Push to GitHub to trigger a new deployment

## Local Testing

To test your site locally before deploying:

```bash
# Install dependencies
npm install

# Run development server
npm start

# Access at http://localhost:4200
```

To test the production build locally:

```bash
# Build for production
npm run build

# The output will be in dist/profile_2.0/browser
# You can serve it with any static file server
```

## Updating Your Portfolio

To make changes and redeploy:

```bash
# Make your changes to the code

# Add and commit changes
git add .
git commit -m "Update portfolio content"

# Push to GitHub
git push

# GitHub Actions will automatically deploy the changes
```

## Custom Domain (Optional)

If you want to use a custom domain instead of `balavoffici.github.io`:

1. Add a `CNAME` file in the `public` folder with your domain name
2. Configure your domain's DNS settings to point to GitHub Pages
3. Enable HTTPS in GitHub Pages settings

For detailed instructions, see: [GitHub Pages Custom Domain Documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Support

For more information about GitHub Pages and GitHub Actions, visit:

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
