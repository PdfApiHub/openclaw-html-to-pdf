---
name: html-to-pdf
description: "Generate PDFs from HTML content or URLs. Supports page sizes, Google Fonts, margins, dynamic placeholders, and reusable templates. Powered by PDFAPIHub."
---

# HTML to PDF

Generate PDF documents from HTML content or public URLs via the PDFAPIHub API.

## Tools

| Tool | Description |
|------|-------------|
| `html_to_pdf` | Generate a PDF from HTML or URL with full customization |
| `url_to_html` | Fetch rendered HTML from a URL (pre-step for PDF conversion) |
| `create_pdf_template` | Save reusable HTML/CSS templates with placeholders |
| `list_pdf_templates` | List all saved templates |
| `get_pdf_template` | Get full template details by ID |
| `update_pdf_template` | Update an existing template |
| `delete_pdf_template` | Delete a template |

## Setup

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

Configure in `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "html-to-pdf": {
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
> Create a template for invoices with placeholders for customer name and amount, then generate a PDF using it with html_to_pdf

## Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)
