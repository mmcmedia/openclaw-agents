# Background Grid Mockup Template

## Purpose
Create a 2x2 grid showing all 4 background options with a sage banner in the middle.

## Layout
```
[Image 1]  [Image 2]
   ─── BANNER ───
[Image 3]  [Image 4]
```

## Parameters
- **Thumbnail size:** 420px
- **Padding:** 15px
- **Banner height:** 95px
- **Banner color:** #6B7F5E (dark sage)
- **Title font:** Poppins Bold 28pt, white
- **Subtitle font:** Poppins SemiBold 19pt, #D4E0CC (light sage)
- **Background:** White

## Text
- **Title:** "Four Different Background Options!"
- **Subtitle:** "[Story Name] Play Scenes"

## Usage
```python
python3 create_backgrounds_grid.py <source_dir> <output_path> "<subtitle>"
```

## Example Output
- Total canvas: ~885x995px
- Top row: 2 images centered in cells
- Middle: Full-width sage banner with centered text
- Bottom row: 2 images centered in cells
