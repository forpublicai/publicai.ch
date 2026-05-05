# Contributing to Public AI Switzerland Website

Thank you for your interest in contributing to the Public AI Switzerland website! This is the source code for [publicai.ch](https://publicai.ch), the website of a customer-owned cooperative that distributes Swiss-made AI.

## Project Overview

This is a **static website** with no build system or framework. It uses:

- **HTML5** for structure
- **[Picnic CSS](https://picnicss.com/)** as a lightweight CSS framework (loaded via CDN)
- **Custom CSS** in `assets/style.css`
- **Vanilla JavaScript** (minimal, inline in HTML)

## How to Contribute

### 1. Set Up Locally

Clone the repository and open `index.html` in your browser -- no build step required:

```bash
git clone https://github.com/forpublicai/publicai.ch.git
cd publicai.ch
open index.html        # macOS
# or: xdg-open index.html   # Linux
# or: start index.html      # Windows
```

You can also use any local HTTP server for a more realistic preview:

```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### 2. Make Changes

Create a new branch for your work:

```bash
git checkout -b your-feature-name
```

### 3. Submit a Pull Request

Push your branch and open a pull request against `main`. Describe what you changed and why. The site auto-deploys to GitHub Pages when changes are merged to `main`.

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Use 2-space indentation
- Use lowercase for all tags and attributes
- Include `alt` text for all images
- Use relative URLs for internal links

### CSS
- Follow BEM naming convention for custom classes (e.g., `timeline__item--highlight`)
- Use Picnic CSS framework classes where possible
- Keep custom CSS in `assets/style.css`, organized by component/section
- Use CSS custom properties defined in `:root` for colors, spacing, and shadows
- Use responsive design principles -- the site uses media queries at `60em` and `38em` breakpoints

### JavaScript
- No JavaScript framework is used; keep it vanilla
- Use ES6+ syntax (`const`/`let`, arrow functions, etc.)
- Only add JS when strictly necessary

### General
- Use UTF-8 encoding
- Use HTTPS for all external resource links
- Keep images optimized for web

## What to Contribute

Here are some ways you can help:

- **Content improvements**: Fix typos, improve wording, update outdated information
- **Accessibility**: Improve ARIA labels, color contrast, keyboard navigation
- **Responsive design**: Fix layout issues on specific screen sizes
- **New pages**: Add content pages that support the cooperative's mission
- **Translations**: Help translate the site into other Swiss languages (German, French, Italian, Romansh)
- **Bug fixes**: Fix rendering issues across browsers
- **Documentation**: Improve this guide or other project docs

## Deployment

The site is deployed automatically via GitHub Actions. Every push to `main` triggers the workflow in `.github/workflows/static.yml`, which uploads the repository contents to GitHub Pages. No manual deployment is needed.

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).
