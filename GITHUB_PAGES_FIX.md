# 🔧 GitHub Pages - Fix README Display Issue

If your GitHub Pages is showing the README instead of your website, follow these steps:

## Step 1: Check GitHub Pages Settings

1. Go to your repository: `https://github.com/balavoffici/balavoffici.github.io`
2. Click **Settings** (top right)
3. In the left sidebar, click **Pages**
4. Under **Build and deployment**:
   - **Source** MUST be set to **"GitHub Actions"** (NOT "Deploy from a branch")
   - If it says "Deploy from a branch", change it to "GitHub Actions"

## Step 2: Enable Workflow Permissions

1. Still in **Settings**, click **Actions** → **General** (in left sidebar)
2. Scroll down to **Workflow permissions**
3. Select **"Read and write permissions"**
4. Check ✅ **"Allow GitHub Actions to create and approve pull requests"**
5. Click **Save**

## Step 3: Verify the Workflow Ran Successfully

1. Go to the **Actions** tab in your repository
2. Look for "Deploy to GitHub Pages" workflow
3. Check if it has a green checkmark ✓
   - ✅ **Green checkmark**: Build succeeded
   - ❌ **Red X**: Build failed - click on it to see errors

### If the workflow hasn't run yet:

1. Go to **Actions** tab
2. Click on "Deploy to GitHub Pages" in the left sidebar
3. Click **"Run workflow"** button on the right
4. Click the green **"Run workflow"** button

### If the workflow failed:

1. Click on the failed workflow run
2. Click on the failed job to see error details
3. Common errors and fixes:
   - **Permission denied**: Check Step 2 above
   - **Build errors**: The build should work on GitHub even if it failed locally

## Step 4: Wait and Clear Cache

After the workflow completes successfully:

1. Wait **2-5 minutes** for GitHub to process the deployment
2. Visit: `https://balavoffici.github.io`
3. If still showing README:
   - Press `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac) to hard refresh
   - Or try in an incognito/private browser window

## Step 5: Verify Deployment Details

1. Go to **Settings** → **Pages**
2. You should see a message: **"Your site is live at https://balavoffici.github.io"**
3. Under that, it should show:
   - Source: **GitHub Actions**
   - Last deployed: **[recent timestamp]**

## Common Issues & Solutions

### Issue: "404 - File not found"

**Solution**: Check that the workflow uploaded the correct folder:

- In `.github/workflows/deploy.yml`, verify: `path: ./dist/profile_2.0/browser`
- This should match your Angular build output folder

### Issue: Workflow shows "Pages not enabled"

**Solution**:

1. Go to **Settings** → **Pages**
2. Ensure Pages is enabled
3. Source must be set to "GitHub Actions"

### Issue: Workflow permissions error

**Solution**:

1. Go to **Settings** → **Actions** → **General**
2. Workflow permissions: Select "Read and write permissions"
3. Save and re-run the workflow

### Issue: Build succeeds but site shows old content

**Solution**:

1. Check the Actions tab to ensure latest commit was deployed
2. Clear browser cache: `Ctrl + Shift + R` or `Cmd + Shift + R`
3. Check deployment timestamp in Settings → Pages

## Quick Verification Checklist

- ✅ Repository name is exactly: `balavoffici.github.io`
- ✅ Repository is **Public** (not Private)
- ✅ Settings → Pages → Source is **"GitHub Actions"**
- ✅ Settings → Actions → General → Workflow permissions is **"Read and write"**
- ✅ Actions tab shows successful deployment (green ✓)
- ✅ Waited 2-5 minutes after deployment
- ✅ Hard refreshed browser (`Ctrl + Shift + R`)

## Test Locally Before Deploying

If you want to test the build locally:

```bash
# Build the project
npm run build

# The output is in: dist/profile_2.0/browser
# Serve it with any static file server
npx http-server dist/profile_2.0/browser -p 8080
```

Then visit `http://localhost:8080` to see what will be deployed.

## Still Having Issues?

1. **Delete the repository** and create it again (EXACTLY as `balavoffici.github.io`)
2. Push your code
3. Enable Pages with "GitHub Actions" source immediately
4. Enable workflow permissions
5. The workflow should run automatically on push

## Need to Force Redeploy?

If everything is set up but you need to trigger a new deployment:

```bash
# Make a small change (like adding a comment)
echo "# Force deploy" >> README.md

# Commit and push
git add .
git commit -m "Force redeploy"
git push
```

The workflow will run automatically and deploy your site.

---

**Expected Result**: After following these steps, `https://balavoffici.github.io` should show your beautiful portfolio website, not the README! 🎉
