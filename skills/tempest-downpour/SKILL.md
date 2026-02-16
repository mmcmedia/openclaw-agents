# Tempest + Downpour — Etsy Bundle Automation Pipeline

## Overview

**Tempest** is a Photoshop script (`.jsxbin`) that automates mockup generation, cropping, and upscaling for Etsy digital print listings. **Downpour** is a bulk upload tool that takes Tempest output, uploads to Google Drive, generates SEO titles/tags with AI, and creates draft Etsy listings.

Together: **Art → Tempest → Mockups + Cropped Files → Downpour → Draft Etsy Listings**

This is the production pipeline for all Etsy shops (TheSunDaisy, ShineForChrist, WeHeartCozy, QuincyMayPrints, Oakhavenprints, Flourishframeworks).

> **McKinzie's rule:** Bundles drive 10× more revenue than single prints. Top sellers' best listings are almost always bundles.

---

## The 5-Minute Quick Start

### 1. Prep Folders
- Place bundle folders (e.g. "Fruit Set of 5", "Holiday Set of 5") inside the **Input** folder
- Place frame bundle mockups inside **FrameBundles_Mockups**
- Smart object layers in mockup PSDs must be named **A, B, C…** (alphabetical)

### 2. Run Tempest
- In Photoshop: **File → Scripts → Browse** → select `Tempest.jsxbin`
- Choose **Frame Bundles** mode
- Pick assignment mode:
  - **Auto-Assign** (round-robin) — script analyzes orientations and distributes evenly. Great for fast batching.
  - **Manual-Assign** — you pick which design goes into which letter slot. Ensures consistency.
  - **Hybrid** — assign a few favorites manually, leave blanks for auto-fill

### 3. Output
- Tempest creates mockups, cropped ratios (2:3, 3:4, 4:5, 5:7, 11:14 by default), and upscaled JPEGs
- Indexed with B1, B2, etc. (bundles) or V/H (singles)

### 4. Upload with Downpour
- Drag the whole `FrameBundles_Output` folder into Downpour
- Downpour automatically:
  - Groups files into listings
  - Uploads to Google Drive (creates folder + subfolders)
  - Uses AI Vision to rename ugly filenames into clean customer-friendly names
  - Inserts PDF with shareable Drive link
  - Uploads mockups as listing images
  - Writes SEO-optimized Etsy titles & tags (130-140 chars)
- Click **"Upload to Etsy"** → listings appear as drafts, ready to publish

---

## Detailed Workflow

### Step 1: Input & Mockups

**Input folder structure:**
```
Input/
├── Fruit Set of 5/
│   ├── apple.png
│   ├── banana.png
│   ├── cherry.png
│   ├── grape.png
│   └── orange.png
├── Holiday Set of 5/
│   ├── christmas-tree.png
│   ├── snowflake.png
│   └── ...
```

Each subfolder = one bundle listing on Etsy.

**Mockups folder:**
```
FrameBundles_Mockups/
├── living-room-3-frames.psd    (layers: A, B, C)
├── bedroom-5-frames.psd        (layers: A, B, C, D, E)
└── gallery-wall.psd            (layers: A, B, C, D, E, F)
```

**Mockup prep requirements:**
- Convert art placeholder to **Smart Object**
- Rename smart object layer to the letter (A, B, C…)
- For nested mockups: script recurses into smart objects automatically
- For custom mockups: rename inner smart object to `*your design here*`

### Step 2: Running Tempest

**Assignment modes:**

| Mode | Best For | How It Works |
|------|----------|-------------|
| Auto-Assign | Fast batching, volume | Round-robin by orientation (vertical/horizontal) |
| Manual-Assign | Hero designs, curated looks | You map specific art → specific letter slots |
| Hybrid | Best of both | Assign favorites, auto-fill the rest |

**Tempest remembers manual assignments** — re-runs preserve your mappings. Perfect for adding mockups or ratios later.

### Step 3: Cropping & Upscaling

Default crop ratios: **2:3, 3:4, 4:5, 5:7, 11:14**

- Uses Photoshop Bicubic Smoother (no external tools)
- **Advanced button:** add/remove ratios, change pixel dimensions, rename outputs
- **Etsy upload limit toggle:**
  - ✅ ON: keeps files <20MB (for direct Etsy upload)
  - ❌ OFF: allows oversized ultra-high-res (for Google Drive delivery)
  - **For bundles: always OFF** (must use Google Drive)

### Step 4: Special Cases

**Frame TV Bundles:**
- Input 16:9 art
- Tempest auto-detects and short-circuits:
  - Creates one upscaled 4K JPEG per design
  - Does NOT do the 5 regular ratios
  
**Video Mockups:**
- Uses Photoshop Timeline with smart object layers named `*your design here*`
- Script replaces every matching layer across the timeline
- Exports fully rendered MP4s (~30s per complex render)
- Great for Etsy listing videos

### Step 5: Indexing

- Bundles: **B1, B2, B3…** prefix
- Singles: **V** (vertical) or **H** (horizontal) prefix
- Keeps everything trackable from file → Etsy listing

---

## Downpour Upload

When dragging output into Downpour:

1. **Groups files into listings** automatically
2. **Creates Google Drive folders** with subfolders per bundle
3. **AI Vision renames files** — cleans up ugly Midjourney names into customer-friendly ones
4. **Generates PDF** with shareable Drive link (this is the customer's download)
5. **Uploads mockups** as listing images
6. **AI writes SEO titles & tags** — constrained to 130-140 char titles
7. **Optional SEO notes** — add keywords like "Halloween" or "Cottagecore" for targeting
8. **Creates draft Etsy listings** — images, file, PDF, SEO, price, attributes all filled
9. **Hit "Publish"** — done

---

## Tips & Best Practices

1. **Bundles > Singles** — Consistently drive biggest Etsy revenue (often 10× more)
2. **Library Indexing** — Keep B1, B2… unique to track listings back to files
3. **Hybrid Assignment** — Manual-assign "hero" designs, auto-fill the rest
4. **Tempest Memory** — Re-runs reuse previous assignments. Add mockups/ratios later without redoing work
5. **Folder Naming** — Don't worry about long AI filenames — Downpour's AI cleans them
6. **Scale** — Run 10+ bundles overnight, upload all in one drag-and-drop next morning
7. **Sandee's mockups** — Use mockups Sandee creates (she's the graphic designer). Tempest handles the automation.

---

## Where Things Live

- **Tempest script:** McKinzie's desktop `/Users/mmcassistant/Desktop/Tempest/` 
- **Downpour:** Alek's tool (AI Art Sellers Collective) — McKinzie has access
- **Sandee's mockups:** Provided by graphic designer, PSD format with smart object layers

---

## What Maria/AI Can and Cannot Do

**Can do:**
- Generate art (via Nano Banana / Midjourney)
- Organize input folders (sort by bundle, rename)
- Track which bundles have been listed
- Keyword research for SEO notes
- Monitor listing performance post-upload

**Cannot do (requires Photoshop on McKinzie's machine):**
- Run Tempest (Photoshop scripting environment required)
- Prep mockup PSDs (smart object layer setup)
- Run Downpour (desktop app)

**Workflow handoff:** Maria preps art + folders → McKinzie/Sandee run Tempest + Downpour → Maria monitors performance

---

## Pricing Template (from Downpour)

When creating bulk listings, Downpour uses a pricing template:
- **Quantity price:** $9.99 (example)
- **List price:** $16 (crossed out "was" price)
- **Sale price:** $8 (example)

Downpour auto-populates price, quantity, and attributes for all draft listings.

---

## Bundles by Size vs by Design (NEW — Feb 2026)

**Problem:** Bundles of 15-100+ designs create too many folders in Google Drive when organized by design (one folder per design). Customers have to dig through 100 folders to find the right size.

**Solution: Organize by Size** — Instead of folders per design, create folders per size ratio.

### By Design (Original — good for ≤12 designs):
```
Google Drive/
├── A - Fox Stalking Winter/
│   ├── 2x3.jpg, 3x4.jpg, 4x5.jpg, 5x7.jpg, 11x14.jpg
├── B - Children Ice Skating/
│   ├── 2x3.jpg, 3x4.jpg, ...
```
- AI writes customer-friendly folder names ("Fox Stalking Through Winter Snow")

### By Size (NEW — recommended for 15+ designs):
```
Google Drive/
├── 2x3 Cropped Images/
│   ├── A-2x3.jpg, B-2x3.jpg, C-2x3.jpg, D-2x3.jpg, E-2x3.jpg
├── 3x4 Cropped Images/
│   ├── A-3x4.jpg, B-3x4.jpg, ...
├── 11x14 Cropped Images/
│   ...
```
- Folder names are literal sizes (not AI-written)
- Customer picks their size folder, gets all designs in that size

### How to Use in Tempest:
1. Run script → select **Frame Bundles**
2. Choose **"Organize by Size"** radio button (new option)
3. Auto-assign or manual-assign as usual
4. Output creates size-based folders automatically

### How to Use in Downpour:
**⚠️ CRITICAL: Use wildcard asterisk `*` prefix for Google Drive filenames!**

Because files are named `A-2x3.jpg`, `B-2x3.jpg` etc. (not just `2x3.jpg`), you MUST add `*` (Shift+8) at the front of each Google Drive filename in the template:
- `*2x3.jpg` instead of `2x3.jpg`
- `*3x4.jpg` instead of `3x4.jpg`
- etc.

The asterisk acts as a wildcard to match `A-2x3.jpg`, `B-2x3.jpg`, etc.

**Rule of thumb:** Bundles by size = use asterisk. Regular bundles by design = no asterisk needed.

---

## Multifolder Drag & Drop (NEW — Feb 2026)

**In Bulk Upload AND Smart Swap**, you can now:
- **Click and drag** to select multiple folders at once
- **Ctrl+click** to select specific folders
- **Shift+click** to select a range

Drop all selected folders into the drop area at once — no need to use the parent folder method.

### Smart Swap with Multifolder:
1. Select listings to edit → Edit Selected → Smart Swap
2. Configure mockup changes in the Configure Mockups flyout
3. Drop only the specific folders you need (instead of the entire batch)
4. AI Vision matches and applies changes automatically
5. Faster because it only searches through the folders you dropped

---

## Google Drive Optimized Sizes (NEW — Feb 2026)

### Etsy Defaults (5 ratios — files attached directly to Etsy):
| Ratio | Pixels | Notes |
|-------|--------|-------|
| 2:3 | 5600×8400 | |
| 3:4 | 6300×8400 | |
| 4:5 | 6720×8400 | |
| 5:7 | 6000×8400 | |
| 11:14 | 6600×8400 | |

- Keep <20MB checkbox ON
- Max 5 files on Etsy (direct upload)

### Google Drive Defaults (8 sizes — specific dimensions):
| Size | Notes |
|------|-------|
| 5×7 | Smallest |
| 8×10 | |
| 9×12 | |
| 11×14 | |
| 16×20 | |
| 18×24 | |
| 24×36 | Largest |
| A2 (ISO) | International |

- Keep <20MB checkbox OFF (Google Drive handles large files)
- More customer-friendly (real dimensions vs ratios)
- Used by top sellers: Atlas Vintage Prints, Antique White Art, North Prints

### Recommended Protocol for Google Drive:
1. In Tempest: Click **Advanced** → **Defaults** → **Google Drive Optimized**
2. All 8 sizes auto-populate for vertical AND horizontal
3. Upload to Google Drive via Downpour
4. Attach 4 smallest files directly on Etsy (5×7, 8×10, 9×12, 11×14)
5. 5th Etsy file slot = PDF linking to Google Drive (all 8 sizes)

### Size Chart:
- New static size chart available (download from AI Art Sellers Collective classroom)
- Can be attached as a static image in Downpour at a specific rank (e.g., rank 11)
- Simpler/cleaner than the old mockup-based size chart
- Old mockup version (with designs in each slot) still works if preferred

### How to Switch in Tempest:
1. Run script → click **Advanced**
2. Click **Defaults** button
3. Choose **"Etsy Optimized"** or **"Google Drive Optimized"**
4. Resets ALL orientations. Review dimensions, click Save.

---

## Shop Refresh Speed Improvement (Feb 2026)

- New intelligent diff logic makes shop refresh **~10× faster**
- 300 listings: seconds instead of 2-3 minutes
- 1000+ listings: 1-2 minutes instead of 10+ minutes
- Especially impactful for first-time shop loads or adding new shops

---

## Auto-Incrementing Index (Feb 2026)

Tempest now **remembers your last used index** and auto-increments:
- Run batch 1 (index 1) → next run auto-fills index 2
- Run 10 designs → next run starts at 11
- No more manually tracking bundle numbers

---

## Getting Started Guides (Feb 2026)

Full step-by-step documentation available in AI Art Sellers Collective:
- **Classroom → Etsy Automation Suite → Getting Started Guides**
- Separate docs for: Tempest, Downpour, Smart Swap
- Each has a 3-minute quick start + detailed walkthrough with screenshots
- Question mark button in Tempest script links directly to docs

---

## Video Sources

- [Print Bundle Automation (37 min)](https://www.youtube.com/watch?v=YhAn_BFuw-U) — Full Tempest + Downpour bundle workflow by Alek
- [Mockup Automation (14 min)](https://www.youtube.com/watch?v=vvmTpOzK_-0) — How Tempest processes static, nested, and video mockups  
- [Downpour Upload (link)](https://www.youtube.com/watch?v=H5if9fSGkQY) — Downpour bulk upload demonstration
- [Downpour New Features (18 min)](https://www.youtube.com/watch?v=BruxB4_G1ZE) — Multifolder drag & drop, bundles by size, shop refresh speed, documentation
- [Google Drive Optimized Sizes (12 min)](https://www.youtube.com/watch?v=IsRqJPb34E8) — New Google Drive size defaults, size charts, recommended protocol

---

*Created: Feb 9, 2026 | Updated: Feb 10, 2026 | Source: McKinzie's guide + Alek's YouTube tutorials*
