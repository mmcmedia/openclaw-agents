# Google Stitch — AI UI Design Generator

Generate UI mockups and export production code using Google Stitch (Gemini-powered).

## What Stitch Does
- Generates complete UI designs from text prompts
- Supports reference images (upload screenshots or provide URLs)
- Outputs multiple design variants per prompt
- Exports static HTML/CSS code AND Figma export
- Free to use (Google account required)
- Supports App (mobile) and Web (desktop) layouts

## URL
https://stitch.withgoogle.com/

## Authentication
- Logged in via Google account: mmcaiassistant@gmail.com
- Uses the `clawd` browser profile (OpenClaw managed browser)

## How to Use

### 1. Open Stitch
```
browser open profile=clawd targetUrl=https://stitch.withgoogle.com/
```

### 2. Set Layout Type
- Click "App" for mobile designs (9:16)
- Click "Web" or "Desktop" for web dashboards (16:9)

### 3. Write a Prompt
Type a detailed description in the text box. Include:
- Layout structure (sidebar, header, cards, etc.)
- Specific content/data to display
- Color palette and brand guidelines
- Style keywords (glassmorphism, minimal, feminine, corporate, etc.)
- Reference existing designs if applicable

### 4. Attach Reference Images (Optional)
- Click the "+" button → "Upload Images" to attach screenshots
- Click "+" → "Website URL" to reference a live site
- Multiple images can be attached as style references

### 5. Choose Model
- Default: Gemini 3.0 Flash (fast, good quality)
- Can switch to other Gemini versions if available

### 6. Generate
- Click "Generate designs" arrow button
- Wait 30-60 seconds for results
- Stitch produces 2-4 design variants

### 7. Iterate
- Use the chat panel on the left to refine designs
- "Make the sidebar darker", "Add more whitespace", etc.
- Each iteration generates new variants

### 8. Export
- Click "Export" button (top right)
- Options: HTML code, Figma export
- HTML export gives production-ready static code

## Best Practices

### Prompt Engineering for UI
- Be specific about layout: "4 metric cards in a row, then 2-column grid below"
- Include real data: "$10,021 revenue" is better than "show revenue"
- Mention brand colors: "deep purple (#1a1625), coral (#e88c4a), teal (#6dab6d)"
- Reference known patterns: "similar to Stripe's dashboard" or "Notion-style sidebar"
- Specify the audience: "for a busy entrepreneur who checks on mobile"

### For McKinzie's Brand
- Colors: Deep purple sidebar, coral accents, teal success indicators
- Style: Professional but warm, not corporate-cold
- Must be mobile-responsive (she checks from phone)
- Data-heavy but not overwhelming (progressive disclosure)

## Existing Projects in Account
- Analytics Hub Overview V2 (Feb 7, 2026) — Mission Control dashboard
- LateWiz Social Media Dashboard (Feb 4, 2026)
- LateWiz Dashboard Overview (Feb 4, 2026)
- PsalMix Waitlist Landing Page (Feb 3, 2026)
- Personalization - Audience (Feb 2, 2026)

## Limitations
- Generates static mockups (not interactive prototypes)
- HTML export is static — needs manual wiring to APIs
- Can't generate React/Vue components directly (outputs vanilla HTML/CSS)
- File upload requires browser interaction (can't do via API)
- Generation takes 30-60 seconds per prompt

## When to Use Stitch
✅ Creating new page layouts from scratch
✅ Redesigning existing pages (upload current screenshot + describe changes)
✅ Exploring design directions before coding
✅ Creating mockups for McKinzie's approval
✅ Landing pages, dashboards, marketing pages

## When NOT to Use Stitch
❌ Small CSS tweaks (just edit the code directly)
❌ Component-level changes (button styles, form fields)
❌ Backend/API work
❌ Real-time interactive prototypes
