# Etsy Tempest + Downpour Pipeline Skill

**Purpose:** End-to-end workflow for turning AI art into Etsy listings using Tempest (Photoshop automation) and Downpour (bulk Etsy uploader).

## Overview

**Tempest** = Photoshop script that takes raw AI art → creates mockups, cropped/upscaled print files, and optional videos.
**Downpour** = Web app (downpourapp.com) that takes Tempest output → builds full Etsy listings with AI-generated SEO → uploads as drafts.

**Pipeline:** Raw AI Art → Tempest (Photoshop) → Downpour (Web) → Etsy Drafts

---

## 📁 Tempest

### Location
`~/Desktop/Tempest/`

### Folder Structure
```
Tempest/
├── Backup/              # Safe archive of originals (Tempest never touches)
├── Input/               # DROP ART HERE — start of conveyor belt
├── Mockups/
│   ├── 4x5Vertical_Mockups/      # Vertical/portrait mockups
│   ├── 5x4Horizontal_Mockups/    # Horizontal/landscape mockups
│   ├── FrameTV_Mockups/          # Frame TV mockups
│   └── FrameBundlesMockups/      # Multi-frame bundle mockups
├── Output/
│   ├── 4x5Vertical_Output/       # Vertical results
│   ├── 5x4Horizontal_Output/     # Horizontal results
│   ├── FrameTV_Output/           # Frame TV results
│   └── FrameBundles/             # Bundle results
├── Videos/              # Video mockup PSDs (same subfolder structure)
├── TempestProgramFiles/ # Internal program files
└── Tempest-2.1.0.jsxbin # THE SCRIPT
```

### How to Run Tempest
1. Add art files to `Input/` folder
2. Ensure correct mockup PSDs are in the right `Mockups/` subfolder
3. Open Photoshop → File → Scripts → Browse → select `Tempest-2.1.0.jsxbin`
4. Enter monthly auth code if prompted
5. Choose orientation: Vertical / Horizontal / Frame TV / Bundles
6. (Optional) Paste Midjourney prefix if files share one
7. Set starting index (1 for first run, increment for subsequent)
8. Click OK — Tempest runs automatically

**⚠️ CANNOT be run programmatically — requires Photoshop GUI interaction.**

### Tempest Output (per design)
```
Output/4x5Vertical_Output/
└── V_01_Design Name/
    ├── mockups/
    │   ├── mockup1.jpg
    │   ├── mockup2.jpg
    │   └── video.mp4 (if video mockups exist)
    └── cropped_images/
        ├── size1.jpg  (5 proven Etsy-friendly sizes)
        ├── size2.jpg
        ├── size3.jpg
        ├── size4.jpg
        └── size5.jpg
```

### Mockup Smart Object Layer
- Layer MUST be named exactly: `YOUR DESIGN HERE`
- Founders Mockup Pack already has this set up
- Supports nested Smart Objects (frames within frames)
- Tempest auto-detects and drills into nested layers

### Seasonal Mockup Swaps
- Only root-level mockups in each folder are used
- Create subfolders for storage (e.g., `holiday_storage/`)
- Tempest ignores subfolders — easy seasonal rotation

### After Running Tempest
- Clear Input folder (move processed files to Backup or a "Posted" folder)
- Output folders are ready for Downpour

---

## 🌊 Downpour

### URL
https://downpourapp.com

### Account
Connected to McKinzie's Etsy shops. Can switch between shops.

### Workflow
1. **Bulk Upload** from left sidebar
2. **Create/select a template** (listing skeleton — images, videos, files, details, description)
3. **Quick Import** (top right) — drag ONE Tempest output folder to auto-populate template
4. **Drop folders** into Drop Area at bottom (parent folder OR multi-select individual folders)
5. **AI Auto-Generate** — writes titles, 13 tags, descriptions, alt-text from reference image
6. **Review** listings
7. **Upload to Etsy** — creates DRAFTS only (no fees until published)

### Template Sections

**Images (20 slots):**
- Dynamic: auto-loaded from Tempest mockups folder
- Static: override any slot (testimonials, size charts, sale banners) with a rank number
- Quick Import recommended

**Videos (optional):**
- Dynamic from Tempest video output
- Or static video for every listing

**Digital Files:**
- 5 cropped/upscaled files from Tempest `cropped_images/`
- Can add static files: How-to PDF, printing guide, Frame TV instructions

**Listing Details:**
- Price, Quantity, Category, Shop Section
- Show Additional Attributes: Orientation, Room, Aspect ratio

**Description (AI Wildcards):**
- Write description template with `{wildcards}` in curly braces
- Example: `"Immerse yourself in vintage charm with this rustic oil painting of {subject}."`
- Downpour auto-generates AI prompt per wildcard
- Each listing gets unique filled content
- Can customize AI prompts per wildcard

### AI Auto-Generate (Step 11)
After upload, for missing SEO fields:
1. Choose reference image (usually #1)
2. Click AI Auto-Generate
3. Downpour analyzes image with AI Vision and writes:
   - SEO-optimized title
   - 13 tags
   - All description wildcards
   - Custom SEO alt-text per image
4. Can regenerate per listing, edit individual fields, add AI guidance notes

### Google Drive Integration
- Enable in Shop Settings for large files (>20MB Etsy limit)
- Or listings with >5 digital files

### Important Notes
- Downpour ONLY creates draft listings — no fees charged
- You publish when ready inside Etsy
- Each shop has its own templates
- Run Shop Refresh on first use to load existing data

---

## 🔄 Complete Pipeline (Maria's Prep Steps)

### What Maria CAN do:
1. ✅ Organize raw AI art into properly named folders
2. ✅ Copy art into Tempest `Input/` folder
3. ✅ Move previous Input files to Backup
4. ✅ Verify mockups are in correct subfolder
5. ✅ Prepare keyword research for manual SEO review
6. ✅ Check Tempest Output after run completes

### What requires McKinzie (GUI steps):
1. 🔴 Run Tempest script in Photoshop (File → Scripts → Browse)
2. 🔴 Drag Tempest output into Downpour web app
3. 🔴 Click AI Auto-Generate in Downpour
4. 🔴 Review and publish listings on Etsy

---

## 📋 Bundle Listings (Special Case)

For bundles (multiple prints per listing):
- Use `FrameBundlesMockups` orientation in Tempest
- Or organize as folders of art within Input (advanced)
- Each bundle = one Etsy listing with all prints as digital files
- Price bundles at ~$0.50-0.75 per image (e.g., 10 prints = $5.99-7.49)

---

## Reference Docs
- Full Tempest PDF: `projects/qmp-bundles/tempest-documentation.pdf`
- Full Downpour PDF: `projects/qmp-bundles/downpour-documentation.pdf`

*Created: Feb 10, 2026*
