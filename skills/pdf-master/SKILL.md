# PDF Master Skill

Generate beautifully styled PDF documents from Markdown, text, or structured data.

## Available Tools

### 1. md-to-pdf (Primary - Best for styled reports)
```bash
# Basic usage
md-to-pdf input.md

# With custom CSS styling
md-to-pdf input.md --stylesheet styles.css

# Custom output path
md-to-pdf input.md --dest output.pdf
```

### 2. Pandoc (Flexible - multiple formats)
```bash
# Markdown to PDF (requires LaTeX for direct PDF)
pandoc input.md -o output.pdf

# Markdown to styled HTML (then use browser for PDF)
pandoc input.md -o output.html --standalone --css=styles.css

# With table of contents
pandoc input.md -o output.pdf --toc
```

### 3. Browser PDF (Best visual control)
For maximum visual fidelity, create HTML and use browser:
```
1. Create styled HTML file
2. browser open profile=clawd targetUrl=file:///path/to/file.html
3. browser screenshot targetId=<id> to verify
4. browser pdf targetId=<id>
```

## Templates

### Professional Report Template
Location: `/Users/mmcassistant/clawd/skills/pdf-master/templates/report.css`

### Brief Template  
Location: `/Users/mmcassistant/clawd/skills/pdf-master/templates/brief.css`

## Workflow for Beautiful PDFs

### Option A: Quick Markdown → PDF
```bash
md-to-pdf document.md --stylesheet /Users/mmcassistant/clawd/skills/pdf-master/templates/report.css
```

### Option B: Maximum Control (HTML → PDF)
1. Convert markdown to styled HTML:
   ```bash
   pandoc document.md -o document.html --standalone --css=/path/to/styles.css
   ```
2. Open in browser, verify with screenshot
3. Generate PDF from browser

### Option C: Data → Report → PDF
1. Create report content in markdown
2. Apply template styling
3. Generate PDF

## Style Guidelines

- Use headers for clear hierarchy (H1 for title, H2 for sections)
- Include executive summary at top
- Use tables for structured data
- Add color-coded status indicators (🟢 🟡 🔴)
- Keep margins generous for readability
- Include page breaks between major sections

## Common Use Cases

1. **QA Reports** - Testing results with screenshots
2. **Business Briefs** - Executive summaries, recommendations
3. **Product Roadmaps** - Strategic planning documents
4. **Analytics Reports** - Data summaries with visualizations
5. **Meeting Notes** - Formatted meeting documentation

## CRITICAL: Verification Process

**ALWAYS verify before sending:**
1. Generate PDF
2. Open/screenshot to verify content is correct
3. Only then send to recipient

This prevents sending wrong files (see TOOLS.md lesson learned).
