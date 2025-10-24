# 🚀 Quick Start - Deploy to GitHub Pages

Follow these commands to deploy your portfolio to `https://balavoffici.github.io`

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Repository name: `balavoffici.github.io` (EXACTLY this name)
3. Make it **Public**
4. Don't add README, .gitignore, or license (we already have them)

## Step 2: Deploy with These Commands

```bash
# Add all your files to git
git add .

# Commit your changes
git commit -m "Deploy: Portfolio website with GitHub Actions"

# Add your GitHub repository
git remote add origin https://github.com/balavoffici/balavoffici.github.io.git

# Push to GitHub
git push -u origin main
```

## Step 3: Enable GitHub Actions for Pages

1. Go to your repository: `https://github.com/balavoffici/balavoffici.github.io`
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select **"GitHub Actions"**
4. Go to **Settings** → **Actions** → **General**
5. Under "Workflow permissions":
   - Select **"Read and write permissions"**
   - Click **Save**

## Step 4: Wait for Deployment

1. Go to the **Actions** tab
2. Watch the "Deploy to GitHub Pages" workflow run
3. Once complete (✓), your site is live at: `https://balavoffici.github.io`

## That's It! 🎉

Your portfolio is now:

- ✅ Live on the internet
- ✅ Automatically deployed on every push
- ✅ Using professional CI/CD with GitHub Actions

## Future Updates

To update your portfolio:

```bash
# Make your changes
git add .
git commit -m "Update: describe your changes"
git push
```

GitHub Actions will automatically rebuild and redeploy!

---

For troubleshooting and detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)
