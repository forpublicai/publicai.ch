# Quick Guide for Content Contributors

Open [Quick Guide for Content Contributors (PDF)](quick-guide-for-content-contributors.pdf) for the 13-page contributor handbook. The [Markdown source](quick-guide-for-content-contributors.md) and seven original local-preview screenshots in `screenshots/` are retained for updates.

The guide is based on the existing repository docs and checked against current code and configuration on 8 October 2026. It covers the repository layout, local preview, MDX pages and translations, images and components, news, menus and footer, verification and publication.

## Rebuild the PDF

With Python, ReportLab and Pillow available, run from the repository root:

```bash
python3 docs/pdf/build-guide.py
```

The builder writes `docs/pdf/quick-guide-for-content-contributors.pdf`. Arial is used when available on macOS; otherwise it uses Helvetica. After changing the source or screenshots, render the PDF with Poppler and visually inspect every page. Each `<!-- page -->` marker in the source starts a new page; keep content within those page boundaries.