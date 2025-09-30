# GitHub Actions Workflows

This repository includes several GitHub Actions workflows to automate the build, test, and deployment process.

## Workflows

### 1. Build and Deploy (`build-and-deploy.yml`)
- **Triggers**: Push to `main` branch, Pull requests to `main`
- **Purpose**: Builds the application and deploys to GitHub Pages
- **Features**:
  - Runs linter and tests
  - Builds the project
  - Deploys to GitHub Pages (only on main branch)
  - Uses GitHub Pages environment for secure deployment

### 2. Pull Request Checks (`pr-checks.yml`)
- **Triggers**: Pull requests to `main` branch
- **Purpose**: Validates code quality before merging
- **Features**:
  - Runs linter
  - Executes tests with coverage
  - Builds the project
  - Checks build size

### 3. Dependency Update Check (`dependency-update.yml`)
- **Triggers**: Weekly schedule (Mondays at 9:00 AM UTC), Manual dispatch
- **Purpose**: Monitors for outdated dependencies and security vulnerabilities
- **Features**:
  - Checks for outdated packages
  - Runs security audit
  - Provides notifications for updates

### 4. Optimize Assets (`optimize-assets.yml`)
- **Triggers**: Manual dispatch, Changes to asset files
- **Purpose**: Optimizes images and assets automatically
- **Features**:
  - Runs image optimization script
  - Commits optimized assets back to repository
  - Skips CI on optimization commits

## Setup Instructions

### 1. Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Set Source to "GitHub Actions"

### 2. Required Secrets (if needed)
If your application requires environment variables for build:
1. Go to repository Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `REACT_APP_SUPABASE_URL` (if using Supabase)
   - `REACT_APP_SUPABASE_ANON_KEY` (if using Supabase)
   - Any other environment variables your app needs

### 3. Branch Protection Rules (Recommended)
1. Go to repository Settings > Branches
2. Add rule for `main` branch:
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
   - Select the "test" job from `pr-checks.yml`

## Environment Variables

The workflows use the following environment variables:
- `CI: false` - Disables CI mode for React build
- `NODE_VERSION: '18'` - Uses Node.js 18 for consistency

## Manual Triggers

Some workflows can be triggered manually:
- **Dependency Update Check**: Go to Actions tab > Dependency Update Check > Run workflow
- **Optimize Assets**: Go to Actions tab > Optimize Assets > Run workflow

## Troubleshooting

### Build Failures
- Check if all dependencies are properly installed
- Verify that all required environment variables are set
- Ensure tests are passing

### Deployment Issues
- Verify GitHub Pages is enabled
- Check if the `github-pages` environment is properly configured
- Ensure the repository has the correct permissions

### Asset Optimization Issues
- Verify the `optimize-images` script exists in package.json
- Check if the script has proper permissions to modify files