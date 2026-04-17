# HTML to PDF — OpenClaw Plugin

Generate PDF documents from HTML content or public URLs using the [PDFAPIHub](https://pdfapihub.com) API. This OpenClaw plugin gives your AI agent the ability to create professional PDFs with full control over styling, layout, and dynamic content.

## What It Does

Convert any HTML template or live webpage into a downloadable PDF — perfect for invoices, reports, contracts, certificates, receipts, and more.

### Features

- **HTML to PDF** — Render raw HTML/CSS into a styled PDF document
- **URL to PDF** — Convert any public webpage to PDF with headless Chromium
- **Custom Page Sizes** — A4, A3, A5, Letter, Legal, Tabloid
- **Google Fonts** — Load any Google Font by name (pipe-separated for multiple)
- **Custom Margins** — Set top, right, bottom, left margins in mm/px
- **Landscape Mode** — Portrait or landscape orientation
- **Dynamic Placeholders** — Replace `{{name}}`, `{{date}}`, `{{amount}}` with real data at render time
- **Reusable Templates** — Save HTML/CSS templates and reference them by ID
- **Multiple Output Formats** — Download URL, base64 string, or raw PDF file
- **Viewport Control** — Set custom viewport width/height for responsive rendering
- **Wait Strategies** — Wait for JS rendering, network idle, or specific delays

## Tools

| Tool | Description |
|------|-------------|
| `html_to_pdf` | Generate a PDF from HTML content or a URL |
| `url_to_html` | Fetch fully-rendered HTML from a URL (for SPAs and JS-heavy pages) |
| `create_pdf_template` | Save a reusable HTML/CSS template with placeholders |
| `list_pdf_templates` | List all saved templates |
| `get_pdf_template` | Get full template details by ID |
| `update_pdf_template` | Update an existing template |
| `delete_pdf_template` | Delete a template |

## Installation

```bash
openclaw plugins install clawhub:html-pdf
```

## Configuration

Add your API key in `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "html-pdf": {
        "enabled": true,
        "env": {
          "PDFAPIHUB_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

## Usage Examples

Just ask your OpenClaw agent:

- *"Generate a PDF invoice for Acme Corp with total $1,249"*
- *"Convert https://example.com to a landscape A4 PDF"*
- *"Create a certificate template with placeholders for name and date"*
- *"Generate 10 personalized certificates using the template"*

## Use Cases

- **Invoice Generation** — Create branded PDF invoices from HTML templates with dynamic customer data
- **Report Export** — Convert dashboard pages into downloadable PDF reports
- **Certificate Creation** — Produce personalized certificates with dynamic name/date substitution
- **Contract Generation** — Create contracts from templates with client-specific details
- **Resume/CV Export** — Convert styled HTML resumes to PDF
- **Receipt Generation** — Auto-generate PDF receipts for e-commerce transactions
- **Webpage Archival** — Save snapshots of any public webpage as PDF

## API Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)

## License

MIT
