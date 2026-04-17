import type { PluginEntry } from "@anthropic/openclaw-plugin-sdk";

const API_BASE = "https://pdfapihub.com/api";

async function callApi(
  endpoint: string,
  body: Record<string, unknown>,
  apiKey: string
): Promise<unknown> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CLIENT-API-KEY": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`PDFAPIHub API error (${res.status}): ${text}`);
    }
    throw new Error(
      `PDFAPIHub API error (${res.status}): ${(parsed as any).error || text}`
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return { success: true, message: "Binary file returned", content_type: contentType };
}

function getApiKey(config: Record<string, unknown>): string {
  const key = (config.apiKey as string) || "";
  if (!key) {
    throw new Error(
      "PDFAPIHub API key not configured. Add your key in plugin config (plugins.entries.html-pdf.env.PDFAPIHUB_API_KEY) or set apiKey in plugin config. Get a free key at https://pdfapihub.com"
    );
  }
  return key;
}

const plugin: PluginEntry = {
  id: "html-to-pdf",
  name: "HTML to PDF",
  register(api) {
    // ─── Generate PDF ────────────────────────────────────────
    api.registerTool({
      name: "html_to_pdf",
      description:
        "Generate a PDF from HTML content or a public URL. Supports custom page sizes (A4, Letter, etc.), Google Fonts, margins, landscape mode, viewport dimensions, dynamic parameter substitution via {{placeholders}}, and template_id references. Returns a download URL or base64.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description:
              "URL of the webpage to convert to PDF. Provide either url or html_content.",
          },
          html_content: {
            type: "string",
            description:
              "HTML content to convert to PDF. Provide either url or html_content.",
          },
          css_content: {
            type: "string",
            description: "Optional CSS to apply to the HTML.",
          },
          template_id: {
            type: "string",
            description:
              "UUID of a saved template. Loads html_content and css_content from the template.",
          },
          output_format: {
            type: "string",
            enum: ["url", "base64", "file"],
            description:
              "Output format. 'url' returns a download URL (default), 'base64' returns base64-encoded PDF, 'file' returns raw PDF.",
          },
          paper_size: {
            type: "string",
            enum: ["A4", "A3", "A5", "Letter", "Legal", "Tabloid"],
            description: "Paper size for the PDF. Default: A4.",
          },
          landscape: {
            type: "boolean",
            description: "Set to true for landscape orientation.",
          },
          margin: {
            type: "object",
            properties: {
              top: { type: "string", description: "Top margin, e.g. '10mm'" },
              right: { type: "string", description: "Right margin" },
              bottom: { type: "string", description: "Bottom margin" },
              left: { type: "string", description: "Left margin" },
            },
            description: "Custom page margins.",
          },
          font: {
            type: "string",
            description:
              "Google Font name(s), pipe-separated. E.g. 'Inter|Roboto'.",
          },
          dynamic_params: {
            type: "object",
            additionalProperties: { type: "string" },
            description:
              "Key-value pairs for {{placeholder}} substitution in the HTML.",
          },
          printBackground: {
            type: "boolean",
            description: "Whether to print background graphics. Default: true.",
          },
          displayHeaderFooter: {
            type: "boolean",
            description: "Whether to display header and footer.",
          },
          preferCSSPageSize: {
            type: "boolean",
            description: "Whether to prefer CSS-defined page size.",
          },
          viewPortWidth: {
            type: "number",
            description: "Viewport width in pixels for rendering. Default: 1080.",
          },
          viewPortHeight: {
            type: "number",
            description: "Viewport height in pixels for rendering. Default: 720.",
          },
          paperWidth: {
            type: "number",
            description: "Custom paper width in pixels.",
          },
          paperHeight: {
            type: "number",
            description: "Custom paper height in pixels.",
          },
          wait_till: {
            type: "number",
            description: "Seconds to wait before generating PDF.",
          },
          output_filename: {
            type: "string",
            description: "Custom filename for the output PDF.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const body: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null) {
            body[key] = value;
          }
        }

        return callApi("/v1/generatePdf", body, apiKey);
      },
    });

    // ─── URL to HTML ─────────────────────────────────────────
    api.registerTool({
      name: "url_to_html",
      description:
        "Fetch the fully-rendered HTML of any public URL using headless Chromium. Useful for scraping SPAs or JS-rendered pages where a simple HTTP GET returns only a loading skeleton. The fetched HTML can then be passed to html_to_pdf.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The URL to fetch. https:// is auto-prepended if no protocol.",
          },
          wait_till: {
            type: "string",
            enum: ["load", "domcontentloaded", "networkidle", "commit"],
            description: "Page load strategy. Default: 'load'.",
          },
          timeout: {
            type: "number",
            description: "Navigation timeout in milliseconds. Default: 30000.",
          },
          wait_for_selector: {
            type: "string",
            description:
              "CSS selector to wait for before capturing HTML. Useful for SPAs.",
          },
          wait_for_timeout: {
            type: "number",
            description: "Extra delay in ms after page load.",
          },
          viewport_width: {
            type: "number",
            description: "Browser viewport width in pixels. Default: 1920.",
          },
          viewport_height: {
            type: "number",
            description: "Browser viewport height in pixels. Default: 1080.",
          },
          user_agent: {
            type: "string",
            description: "Custom User-Agent header for the browser.",
          },
          headers: {
            type: "object",
            additionalProperties: { type: "string" },
            description: "Additional request headers.",
          },
        },
        required: ["url"],
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const body: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null) {
            body[key] = value;
          }
        }
        return callApi("/v1/url-to-html", body, apiKey);
      },
    });

    // ─── Create Template ─────────────────────────────────────
    api.registerTool({
      name: "create_pdf_template",
      description:
        "Save a reusable HTML/CSS template for PDF generation. Templates support dynamic placeholders ({{@key}}, ${key}, {key}) and can be referenced by template_id in html_to_pdf. Includes default parameters and rendering metadata.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Friendly name for the template.",
          },
          html_content: {
            type: "string",
            description:
              "HTML content with optional placeholders for dynamic substitution.",
          },
          css_content: {
            type: "string",
            description: "Optional CSS to apply when rendering.",
          },
          default_params: {
            type: "object",
            additionalProperties: { type: "string" },
            description:
              "Default values for placeholders. Used when dynamic_params is not provided.",
          },
          metadata: {
            type: "object",
            properties: {
              page_size: { type: "string" },
              orientation: { type: "string" },
              margin: { type: "string" },
            },
            additionalProperties: true,
            description: "Default rendering settings (page_size, orientation, etc.).",
          },
        },
        required: ["html_content"],
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const body: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null) {
            body[key] = value;
          }
        }
        return callApi("/v1/templates", body, apiKey);
      },
    });

    // ─── List Templates ──────────────────────────────────────
    api.registerTool({
      name: "list_pdf_templates",
      description:
        "List all saved PDF templates owned by the authenticated API key. Returns template IDs, names, default parameters, and timestamps. Use the template_id with html_to_pdf.",
      parameters: {
        type: "object",
        properties: {},
      },
      async execute(_params, context) {
        const apiKey = getApiKey(context.config);
        const res = await fetch(`${API_BASE}/v1/templates`, {
          method: "GET",
          headers: { "CLIENT-API-KEY": apiKey },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`PDFAPIHub API error (${res.status}): ${text}`);
        }
        return res.json();
      },
    });

    // ─── Get Template ────────────────────────────────────────
    api.registerTool({
      name: "get_pdf_template",
      description:
        "Retrieve full template details including HTML content, CSS, default parameters, and metadata by template_id.",
      parameters: {
        type: "object",
        properties: {
          template_id: {
            type: "string",
            description: "The template's UUID.",
          },
        },
        required: ["template_id"],
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const res = await fetch(
          `${API_BASE}/v1/templates/${params.template_id}`,
          {
            method: "GET",
            headers: { "CLIENT-API-KEY": apiKey },
          }
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`PDFAPIHub API error (${res.status}): ${text}`);
        }
        return res.json();
      },
    });

    // ─── Update Template ─────────────────────────────────────
    api.registerTool({
      name: "update_pdf_template",
      description:
        "Update fields on an existing template: name, html_content, css_content, default_params, or metadata. Only provided fields are changed.",
      parameters: {
        type: "object",
        properties: {
          template_id: {
            type: "string",
            description: "The template's UUID.",
          },
          name: { type: "string", description: "Updated template name." },
          html_content: { type: "string", description: "Updated HTML content." },
          css_content: { type: "string", description: "Updated CSS content." },
          default_params: {
            type: "object",
            additionalProperties: { type: "string" },
            description: "Updated default parameter values.",
          },
          metadata: {
            type: "object",
            additionalProperties: true,
            description: "Updated rendering metadata.",
          },
        },
        required: ["template_id"],
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const { template_id, ...body } = params;
        const res = await fetch(`${API_BASE}/v1/templates/${template_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CLIENT-API-KEY": apiKey,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`PDFAPIHub API error (${res.status}): ${text}`);
        }
        return res.json();
      },
    });

    // ─── Delete Template ─────────────────────────────────────
    api.registerTool({
      name: "delete_pdf_template",
      description:
        "Permanently delete a saved template by its UUID. This cannot be undone.",
      parameters: {
        type: "object",
        properties: {
          template_id: {
            type: "string",
            description: "The template's UUID.",
          },
        },
        required: ["template_id"],
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const res = await fetch(
          `${API_BASE}/v1/templates/${params.template_id}`,
          {
            method: "DELETE",
            headers: { "CLIENT-API-KEY": apiKey },
          }
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`PDFAPIHub API error (${res.status}): ${text}`);
        }
        return res.json();
      },
    });
  },
};

export default plugin;
