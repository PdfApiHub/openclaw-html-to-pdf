---
name: pdfapihub-html-to-pdf
description: "Generate PDFs from HTML content or URLs using PDFAPIHub. Supports page sizes, Google Fonts, margins, dynamic placeholders, and reusable templates."
---

# PDFAPIHub HTML to PDF

Generate PDF documents from HTML content or public URLs via the PDFAPIHub API.

## Tools

| Tool | Description |
|------|-------------|
| `pdfapihub_generate_pdf` | Generate a PDF from HTML or URL with full customization |
| `pdfapihub_url_to_html` | Fetch rendered HTML from a URL (pre-step for PDF conversion) |
| `pdfapihub_create_template` | Save reusable HTML/CSS templates with placeholders |
| `pdfapihub_list_templates` | List all saved templates |
| `pdfapihub_get_template` | Get full template details by ID |
| `pdfapihub_update_template` | Update an existing template |
| `pdfapihub_delete_template` | Delete a template |

## Setup

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

Configure in `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "pdfapihub-html-to-pdf": {
        "enabled": true,
        "env": {
          "PDFAPIHUB_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

Or set the environment variable: `export PDFAPIHUB_API_KEY=your-api-key`

## Usage Examples

**Generate PDF from HTML:**
> Generate a PDF invoice for customer "Acme Corp" with total $1,249

**Convert URL to PDF:**
> Convert https://example.com to a PDF in landscape A4

**Use templates:**
> Create a template for invoices with placeholders for customer name and amount, then generate a PDF using it

## Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)
