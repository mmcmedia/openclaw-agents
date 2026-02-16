#!/usr/bin/env python3
"""
Etsy Mockup Banner Generator
Creates listing images with tight cropping and branded sage banner.
Approved template: Feb 5, 2026
"""

from PIL import Image, ImageDraw, ImageFont
import numpy as np
import os

# Template parameters
BANNER_COLOR = '#6B7F5E'
BANNER_HEIGHT = 95
CONTENT_TOLERANCE = 245
PADDING_SIDES = 5
PADDING_TOP = 5
PADDING_BOTTOM = 25
TITLE_FONT_SIZE = 28
SUBTITLE_FONT_SIZE = 19
TITLE_COLOR = 'white'
SUBTITLE_COLOR = '#D4E0CC'
TARGET_WIDTH = 850  # Normalize all outputs to this width

# Font paths
FONT_DIR = "/Users/mmcassistant/clawd/assets/fonts"
TITLE_FONT_PATH = f"{FONT_DIR}/Poppins-Bold.ttf"
SUBTITLE_FONT_PATH = f"{FONT_DIR}/Poppins-SemiBold.ttf"


def create_etsy_mockup(source_path, output_path, title, subtitle):
    """
    Create Etsy listing mockup with sage banner.
    
    Args:
        source_path: Path to source puppet sheet PNG
        output_path: Path for output image
        title: Main title (e.g., "Old Testament Stick Puppets")
        subtitle: Subtitle (e.g., "Daniel & the Lions Den")
    
    Returns:
        tuple: (width, height) of created image
    """
    # Load image
    img = Image.open(source_path).convert('RGB')
    orig_width, orig_height = img.size
    
    # Find content bounds with tight tolerance
    arr = np.array(img)
    non_white = np.any(arr < CONTENT_TOLERANCE, axis=2)
    rows = np.any(non_white, axis=1)
    cols = np.any(non_white, axis=0)
    
    if not rows.any() or not cols.any():
        raise ValueError(f"No content found in {source_path}")
    
    top, bottom = np.where(rows)[0][[0, -1]]
    left, right = np.where(cols)[0][[0, -1]]
    
    # Crop tight on all sides
    left_crop = max(0, left - PADDING_SIDES)
    top_crop = max(0, top - PADDING_TOP)
    right_crop = min(orig_width, right + PADDING_SIDES)
    bottom_crop = min(orig_height, bottom + PADDING_BOTTOM)
    
    cropped = img.crop((left_crop, top_crop, right_crop, bottom_crop))
    crop_w, crop_h = cropped.size
    
    # Normalize: Scale to target width if too large
    if crop_w > TARGET_WIDTH:
        scale = TARGET_WIDTH / crop_w
        new_w = TARGET_WIDTH
        new_h = int(crop_h * scale)
        cropped = cropped.resize((new_w, new_h), Image.LANCZOS)
        crop_w, crop_h = new_w, new_h
    
    # Create canvas with banner
    canvas_height = crop_h + BANNER_HEIGHT
    canvas_width = crop_w
    
    new_img = Image.new('RGB', (canvas_width, canvas_height), 'white')
    new_img.paste(cropped, (0, 0))
    
    # Draw banner
    banner_y = crop_h
    draw = ImageDraw.Draw(new_img)
    draw.rectangle([0, banner_y, canvas_width, canvas_height], fill=BANNER_COLOR)
    
    # Load fonts
    title_font = ImageFont.truetype(TITLE_FONT_PATH, TITLE_FONT_SIZE)
    subtitle_font = ImageFont.truetype(SUBTITLE_FONT_PATH, SUBTITLE_FONT_SIZE)
    
    # Draw title (centered)
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (canvas_width - title_width) // 2
    title_y = banner_y + 12
    draw.text((title_x, title_y), title, fill=TITLE_COLOR, font=title_font)
    
    # Draw subtitle (centered)
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (canvas_width - subtitle_width) // 2
    subtitle_y = banner_y + 50
    draw.text((subtitle_x, subtitle_y), subtitle, fill=SUBTITLE_COLOR, font=subtitle_font)
    
    # Save
    new_img.save(output_path)
    print(f"✓ Created: {output_path} ({canvas_width}x{canvas_height})")
    return (canvas_width, canvas_height)


# Story mappings for Old Testament puppet sheets
OT_STORIES = {
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


def batch_process(source_dir, output_dir, stories=None):
    """
    Batch process multiple puppet sheets.
    
    Args:
        source_dir: Directory containing source PNGs
        output_dir: Directory for output images
        stories: Dict of {filename_stem: subtitle} or None for OT_STORIES
    """
    if stories is None:
        stories = OT_STORIES
    
    os.makedirs(output_dir, exist_ok=True)
    
    for story_id, subtitle in stories.items():
        source = os.path.join(source_dir, f"{story_id}.png")
        if not os.path.exists(source):
            print(f"⚠ Skipping {story_id} - source not found")
            continue
        
        output = os.path.join(output_dir, f"{story_id}-etsy.png")
        try:
            create_etsy_mockup(source, output, MAIN_TITLE, subtitle)
        except Exception as e:
            print(f"✗ Error processing {story_id}: {e}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 4:
        print("Usage: python create_mockup.py <source.png> <output.png> <subtitle>")
        print("       python create_mockup.py --batch <source_dir> <output_dir>")
        sys.exit(1)
    
    if sys.argv[1] == "--batch":
        batch_process(sys.argv[2], sys.argv[3])
    else:
        create_etsy_mockup(sys.argv[1], sys.argv[2], MAIN_TITLE, sys.argv[3])
