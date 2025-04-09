# Angleito's Portfolio

This is my personal portfolio website, showcasing my projects and technical articles.

## Features

- Responsive design
- Project showcase
- Technical blog
- GitHub Pages deployment

## Development

This site is built with Jekyll and hosted on GitHub Pages. To run it locally:

1. Install dependencies:
   ```
   bundle install
   ```

2. Run the local server:
   ```
   bundle exec jekyll serve
   ```

3. View the site at [http://localhost:4000](http://localhost:4000)

## PDF Generation

This site supports automatic PDF generation for all articles. To generate PDFs:

1. Run the PDF generation script:
   ```
   ./generate_pdfs.sh
   ```

2. PDFs will be created in the `assets/pdfs` directory

3. PDF download links are automatically added to all article pages

## Deployment

Deployment is handled automatically through GitHub Actions. Pushing to the `dev` branch will trigger a build and deploy to GitHub Pages.

## License

Content is copyright © 2023 Angleito. Code is licensed under MIT.