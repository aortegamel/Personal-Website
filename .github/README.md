# GitHub Actions Workflow for Next.js Portfolio

## Deployment Workflow

This workflow automates the build and deployment process for the Next.js portfolio site.

### Workflow Details

- **Trigger**: Automatically runs on pushes to the main branch
- **Node.js Version**: 20.x
- **Build Steps**:
  - Install dependencies
  - Generate search data
  - Build Contentlayer
  - Lint code
  - Type checking
  - Build Next.js application
- **Deployment**: GitHub Pages

### Prerequisites

- Ensure GitHub Pages is enabled in repository settings
- Repository must have GitHub Actions enabled

### Customization

Modify the `.github/workflows/deploy.yml` file to adjust:
- Node.js version
- Build steps
- Deployment configuration

### Troubleshooting

- Check GitHub Actions tab for build logs
- Verify GitHub Pages settings in repository configuration
- Ensure all dependencies are correctly specified in `package.json`