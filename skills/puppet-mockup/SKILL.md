# Puppet Mockup Generator

Create Etsy listing mockups for Bible story stick puppet printables. Generates professional 1080x1080 square images with puppets, props, background scenes, and labels.

## When to Use
- Creating new Bible story puppet sets for TheSunDaisy Etsy shop
- Generating mockup images for printable puppet listings
- Replicating the approved Enoch template for other stories

## Template Location
`/projects/etsy-pipeline/output/enoch-puppets/mockup-2rows.html`

## Required Assets

### Characters (10 total)
- Transparent PNG backgrounds
- Consistent chibi/sticker art style
- Full body, front-facing
- ~156px height in mockup

### Props (3-4 items)
- Staff, scroll, pot, shield, etc.
- Story-relevant items
- Transparent backgrounds

### Background Scenes (3)
- 310x195px display size
- Story scenes for puppet theater
- High quality illustrations

### Arrow Asset
- Use existing: `curved-arrow-trans.png`
- Simple curved gray arrow, no feathers
- Already extracted with transparency

## Design Specs

### Layout
```
Canvas: 1080x1080px
Background: #FAF7F2 (warm cream)
Font: Nunito (Google Fonts)
```

### Puppet Arrangement
- **Row 1:** 5 puppets, curved arc (positions p1-p5)
- **Row 2:** 5 puppets, curved arc (positions p6-p10)
- Slight rotations (-8° to +8°) for organic feel
- Sticks overlap characters by 20-40px

### Labels
```css
.bonus-label { top: 520px; left: 60px; }
.scenes-label { top: 650px; right: 60px; }
Font: 24px Nunito, color #666
```

### Arrows
```css
.arrow-bonus {
  top: 560px; left: 130px;
  height: 55px; transform: rotate(0deg);
}
.arrow-scenes {
  top: 680px; left: 800px;
  height: 55px; transform: scaleX(-1) rotate(50deg);
}
```

### Banner
- Bottom center, 720x100px
- Green gradient (#5B8A5B → #4A7A4A)
- Title: 34px white
- Subtitle: 15px white

## Process

### Step 1: Prepare Assets
```bash
mkdir -p /projects/etsy-pipeline/output/[set-name]/extracted
# Extract character PNGs with transparent backgrounds
# Extract prop PNGs
# Create/obtain background scenes
```

### Step 2: Copy Template
```bash
cp /projects/etsy-pipeline/output/enoch-puppets/mockup-2rows.html \
   /projects/etsy-pipeline/output/[set-name]/
cp /projects/etsy-pipeline/output/enoch-puppets/curved-arrow-trans.png \
   /projects/etsy-pipeline/output/[set-name]/
```

### Step 3: Update HTML
1. Replace all image paths to point to new set
2. Update banner title and subtitle
3. Adjust stick gaps for characters with whitespace:
```css
.p[N] .stick { margin-top: -35px; }
```

### Step 4: Render
```bash
# Open in browser, take screenshot
# Crop to square:
magick screenshot.png -gravity center -crop 1080x1080+0+0 +repage mockup-square.png
```

## Arrow Regeneration (If Needed)

```bash
source ~/.clawdbot/.env
curl -X POST https://api.kie.ai/api/v1/jobs/createTask \
  -H "Authorization: Bearer $KIE_AI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/nano-banana",
    "input": {
      "prompt": "Simple curved hand-drawn arrow, gentle curve pointing down-right, medium gray color, NO feathers NO fletching just a simple curved line with arrow point, minimal doodle style, white background",
      "output_format": "png",
      "image_size": "1:1"
    }
  }'

# Extract with transparency:
magick arrow.png -fuzz 15% -transparent white -trim +repage arrow-trans.png
```

## Quality Checklist
- [ ] All characters touching sticks (no gaps)
- [ ] Sticks behind characters (z-index)
- [ ] Arrows not overlapping text
- [ ] Arrows fully visible
- [ ] Arrow color matches label gray (#666)
- [ ] Banner text correct
- [ ] Final image 1080x1080px

## Bible Story Sets Queue
- [x] Enoch & City of Zion (COMPLETE)
- [ ] Easter / Resurrection
- [ ] Noah's Ark
- [ ] David & Goliath
- [ ] Moses & Exodus
- [ ] Daniel & Lions Den
- [ ] Jonah & Whale
- [ ] Creation Story

## Files Reference
```
/projects/etsy-pipeline/output/enoch-puppets/
├── mockup-2rows.html           # Master template
├── mockup-square.png           # Final output
├── curved-arrow-trans.png      # Reusable arrow
├── README-MOCKUP-TEMPLATE.md   # Detailed guide
└── extracted/                  # Character/prop PNGs
```

## Notes
- Arrow style: Simple curve, gray, NO loops, NO feathers
- McKinzie approved Feb 5, 2026
- Generated arrows are license-free (Nano Banana = we own it)
