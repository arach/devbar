# GitHub Pages Deployment

This project automatically deploys to GitHub Pages using GitHub Actions.

## Quick Start

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository → Settings → Pages
   - Under "Source", select **"GitHub Actions"**

3. **Done!** The workflow will automatically deploy your sites:
   - Demo: `https://[your-username].github.io/devbar`
   - Docs: `https://[your-username].github.io/devbar/docs`

## How It Works

The `.github/workflows/deploy.yml` workflow:
1. Triggers on pushes to main/master branch
2. Builds the @arach/devbar library
3. Builds the demo app with production settings
4. Builds the docs site with production settings
5. Combines both into a single deployment
6. Deploys to GitHub Pages

## URLs Configuration

The deployment automatically configures the correct URLs based on your GitHub username:

- Demo app knows where to find docs
- Docs site knows where to find the demo
- All paths are properly configured for GitHub Pages

## First-Time Setup

1. **Repository Settings**:
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"
   - Wait for first deployment (check Actions tab)

2. **Verify Deployment**:
   - Check the Actions tab for deployment status
   - Green checkmark = successfully deployed
   - Click the deployment URL to view your site

## Customization

### Custom Domain

To use a custom domain (e.g., `devbar.yourdomain.com`):

1. Add a `CNAME` file to `demo-app/public/`:
   ```
   devbar.yourdomain.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `[username].github.io`
   - Or A records to GitHub's IPs

3. Update Settings → Pages → Custom domain

### Different Repository Name

If your repository isn't named "devbar", update the workflow:

```yaml
# In .github/workflows/deploy.yml
env:
  NEXT_PUBLIC_BASE_PATH: /your-repo-name
```

## Troubleshooting

**Site not appearing?**
- Check Actions tab for build errors
- Ensure GitHub Pages is enabled
- Wait 5-10 minutes for initial deployment

**404 errors?**
- Verify the repository name matches base path
- Check that workflow completed successfully
- Ensure "GitHub Actions" is selected as source

**Broken links between demo/docs?**
- URLs are automatically configured
- Check the workflow ran successfully
- Clear browser cache and try again

## Local Testing

To test the production build locally:

```bash
# Use the provided script
./scripts/deploy.sh

# Serve locally
npx serve public-deploy -p 8080
```

Visit `http://localhost:8080/devbar`