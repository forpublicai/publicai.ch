# Quick Guide for Content Contributors

Open [Quick Guide for Content Contributors (PDF)](quick-guide-for-content-contributors.pdf) for the 14-page contributor handbook. The [Markdown source](quick-guide-for-content-contributors.md) and the original local-preview screenshots in `screenshots/` are kept so the guide can be updated.

The guide is based on the repository docs and was fact-checked against the current code and configuration on 2 November 2026. It covers the repository layout, local preview, MDX pages and translations, images and components, news, menus and footer, the newsletter and members placeholder pages, verification, and publishing. The PDF is set in Public Sans, the same typeface as the website; the font is embedded in the PDF file.

## Rebuild the PDF

With Python, ReportLab, and Pillow in a virtual environment, run from the repository root:

```bash
python3 -m venv .venv-pdf && .venv-pdf/bin/pip install reportlab pillow
.venv-pdf/bin/python docs/pdf/build-guide.py
```

The builder writes `docs/pdf/quick-guide-for-content-contributors.pdf` and embeds the Public Sans variable fonts from `~/Library/Fonts/` (falling back to Helvetica if they are absent, in which case nothing is embedded). After changing the source or screenshots, render the PDF with Poppler and visually inspect every page. Each `<!-- page -->` marker in the source starts a new page; keep content within those page boundaries.