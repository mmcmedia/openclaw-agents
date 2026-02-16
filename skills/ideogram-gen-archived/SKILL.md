# Ideogram Image Generation Skill

Generate high-quality images using Ideogram AI API, optimized for Etsy digital products.

## Purpose
Create wall art, printables, and digital products for Etsy shops (TheSunDaisy, WeHeartCozy, etc.)

## API Configuration

API Key stored in: `~/.clawdbot/.env` as `IDEOGRAM_API_KEY`

**Base URL:** `https://api.ideogram.ai`

## Endpoints

### Generate Image (v3)
```bash
curl -X POST "https://api.ideogram.ai/generate" \
  -H "Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "image_request": {
      "prompt": "Your detailed prompt",
      "model": "V_3",
      "magic_prompt_option": "AUTO",
      "aspect_ratio": "ASPECT_16_9",
      "style_type": "REALISTIC"
    }
  }'
```

## Aspect Ratios for Etsy Products (V3 API)

| Product Type | Ratio | Ideogram Value |
|--------------|-------|----------------|
| Standard Print (8x10) | 4:5 | `4x5` |
| Portrait Print | 3:4 | `3x4` |
| Poster (11x17) | 2:3 | `2x3` |
| Square Art | 1:1 | `1x1` |
| Frame TV (16:9) | 16:9 | `16x9` |
| Panoramic | 3:1 | `3x1` |

**All V3 Ratios:** `1x3`, `3x1`, `1x2`, `2x1`, `9x16`, `16x9`, `10x16`, `16x10`, `2x3`, `3x2`, `3x4`, `4x3`, `4x5`, `5x4`, `1x1`

## Style Types

- `REALISTIC` - Photorealistic images
- `DESIGN` - Clean graphic design style
- `RENDER_3D` - 3D rendered look
- `ANIME` - Anime/illustration style
- `GENERAL` - Let AI decide

## Best Practices for Etsy Products

### LDS Products (TheSunDaisy)
- Include specific scripture references
- Use reverent, uplifting imagery
- Soft, warm color palettes
- Clean typography for text-based art

### Frame TV Art (WeHeartCozy)
- 16:9 aspect ratio required
- Samsung Frame TV aesthetic
- Muted, sophisticated colors
- No people/faces (licensing concerns)

### General Wall Art
- High resolution prompts
- Specify "printable wall art" in prompt
- Include style keywords (watercolor, minimalist, etc.)

## Script Usage

```bash
# Generate a single image
node scripts/generate.js "LDS temple watercolor art Salt Lake City, soft pastels, printable wall art"

# Batch generate from prompts file
node scripts/batch-generate.js prompts.txt --output ./generated/
```

## Integration with Etsy Pipeline

1. Generate image with this skill
2. Download to local folder
3. Create mockup (via Tempest or manual)
4. Draft listing via Etsy API or Downpour

## Rate Limits

- Standard: 25 generations per hour
- Check your plan at ideogram.ai/account
