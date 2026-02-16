# Etsy Mockup Banner Skill

**Purpose:** Create Etsy listing images with tight cropping and branded sage banner for Bible story stick puppets (or similar products).

## Final Template Parameters

| Parameter | Value |
|-----------|-------|
| Banner Color | `#6B7F5E` (dark sage) |
| Banner Height | 95px |
| Content Tolerance | 245 (for detecting non-white pixels) |
| Content Padding | 5px sides/top, 25px bottom |
| Title Font | Poppins-Bold, 28pt |
| Subtitle Font | Poppins-SemiBold, 19pt |
| Title Color | White (`#FFFFFF`) |
| Subtitle Color | Light sage (`#D4E0CC`) |
| Title Y-offset | banner_y + 12 |
| Subtitle Y-offset | banner_y + 50 |

## Required Assets

- **Poppins fonts:** `/Users/mmcassistant/clawd/assets/fonts/Poppins-Bold.ttf` and `Poppins-SemiBold.ttf`
- **Source images:** Character sheet PNGs with white backgrounds

## Process Overview

1. Load source puppet sheet image
2. Detect actual content bounds (tolerance=245 to find non-white pixels)
3. Crop tight: 5px padding on sides/top, 25px on bottom
4. Create canvas = cropped height + banner height (95px)
5. Paste cropped content at top
6. Draw sage banner at bottom
7. Add centered Poppins text with title + subtitle

## Python Script

```python
from PIL import Image, ImageDraw, ImageFont
import numpy as np

def create_etsy_mockup(source_path, output_path, title, subtitle):
    """
    Create Etsy listing mockup with sage banner.
    
    Args:
        source_path: Path to source puppet sheet PNG
        output_path: Path for output image
        title: Main title (e.g., "Old Testament Stick Puppets")
        subtitle: Subtitle (e.g., "Daniel & the Lions Den")
    """
    # Load image
    img = Image.open(source_path).convert('RGB')
    orig_width, orig_height = img.size
    
    # Find content bounds with tight tolerance
    arr = np.array(img)
    tolerance = 245
    non_white = np.any(arr < tolerance, axis=2)
    rows = np.any(non_white, axis=1)
    cols = np.any(non_white, axis=0)
    top, bottom = np.where(rows)[0][[0, -1]]
    left, right = np.where(cols)[0][[0, -1]]
    
    # Crop tight on all sides
    left_crop = max(0, left - 5)
    top_crop = max(0, top - 5)
    right_crop = min(orig_width, right + 5)
    bottom_crop = bottom + 25  # Small padding at bottom
    
    cropped = img.crop((left_crop, top_crop, right_crop, bottom_crop))
    crop_w, crop_h = cropped.size
    
    # Create canvas with banner
    banner_height = 95
    canvas_height = crop_h + banner_height
    canvas_width = crop_w
    
    new_img = Image.new('RGB', (canvas_width, canvas_height), 'white')
    new_img.paste(cropped, (0, 0))
    
    # Draw banner
    banner_y = crop_h
    draw = ImageDraw.Draw(new_img)
    draw.rectangle([0, banner_y, canvas_width, canvas_height], fill='#6B7F5E')
    
    # Load fonts
    font_dir = "/Users/mmcassistant/clawd/assets/fonts"
    title_font = ImageFont.truetype(f"{font_dir}/Poppins-Bold.ttf", 28)
    subtitle_font = ImageFont.truetype(f"{font_dir}/Poppins-SemiBold.ttf", 19)
    
    # Draw title (centered)
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (canvas_width - title_width) // 2
    title_y = banner_y + 12
    draw.text((title_x, title_y), title, fill="white", font=title_font)
    
    # Draw subtitle (centered)
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (canvas_width - subtitle_width) // 2
    subtitle_y = banner_y + 50
    draw.text((subtitle_x, subtitle_y), subtitle, fill="#D4E0CC", font=subtitle_font)
    
    # Save
    new_img.save(output_path)
    return new_img.size

# Example usage:
# create_etsy_mockup(
#     "/path/to/daniel.png",
#     "/path/to/daniel-etsy.png", 
#     "Old Testament Stick Puppets",
#     "Daniel & the Lions Den"
# )
```

## Batch Processing

To process multiple sheets, use the story mapping:

```python
STORIES = {
    "daniel": "Daniel & the Lions Den",
    "noah": "Noah's Ark",
    "david": "David & Goliath",
    "jonah": "Jonah & the Whale",
    "moses": "Moses & the Exodus",
    "adam": "Adam & Eve",
    "joseph": "Joseph's Coat of Colors",
    "creation": "The Creation",
    "abraham": "Abraham & Isaac",
    "jacob": "Jacob & Esau",
    "ruth": "Ruth & Naomi",
    "samuel": "Samuel the Prophet",
    "elijah": "Elijah the Prophet",
    "esther": "Queen Esther",
    "furnace": "The Fiery Furnace",
    "joshua": "Joshua & Jericho",
    "gideon": "Gideon's Army",
    "solomon": "King Solomon",
    "samson": "Samson & Delilah",
    "babel": "Tower of Babel",
    "cain-abel": "Cain & Abel",
    "elisha": "Elisha's Miracles",
    "job": "Job",
    "deborah": "Deborah the Judge",
    "balaam": "Balaam's Donkey",
    "nehemiah": "Nehemiah",
    "plagues": "The Ten Plagues",
    "lot": "Lot & Sodom",
    "enoch": "City of Enoch",
}

MAIN_TITLE = "Old Testament Stick Puppets"

for story_id, subtitle in STORIES.items():
    source = f"/path/to/bible-stories/{story_id}.png"
    output = f"/path/to/etsy-mockups/{story_id}-etsy.png"
    create_etsy_mockup(source, output, MAIN_TITLE, subtitle)
```

## Design Iterations History

Started with V1 → V8 iterations:
1. V1: White bg, text at top (rejected - wanted banner at bottom)
2. V2: Sage banner at bottom (font not great)
3. V3: Added border/decorations (too busy)
4. V4: Poppins font (better!)
5. V5: Darker sage, bigger subtitle
6. V6: Zoomed in more
7. V7-V9: Trimming whitespace iterations
8. **V10-Final8: Tight crop all sides + correct banner position** ✅

## Key Lessons

- Use tolerance=245 to detect actual content (not 250-252)
- Banner goes BELOW content, not overlapping
- 25px bottom padding before banner = good breathing room
- Poppins Bold/SemiBold = friendly but professional
- Dark sage `#6B7F5E` pops well against white

---

*Created: Feb 5, 2026*
*Approved by McKinzie*
