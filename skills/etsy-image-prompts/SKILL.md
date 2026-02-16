# Etsy Image Prompts Skill

Generate high-quality, print-ready digital art for Etsy listings using AI image generators. This skill provides prompt formulas, templates, and best practices for creating sellable wall art, printables, and digital products.

---

## 🎯 When to Use This Skill

- Creating wall art for Etsy shops (TheSunDaisy, WeHeartCozy, etc.)
- Generating printable digital products
- Making Frame TV art bundles
- Creating coloring pages or activity sheets
- Any AI image generation for print-on-demand

---

## 📐 The Master Prompt Formula

```
[Subject + Action] + [Style/Medium] + [Mood/Atmosphere] + [Lighting] + [Color Palette] + [Composition] + [Technical Modifiers] + [Negative Prompts]
```

### Required Elements (minimum 6 descriptive keywords):

| Element | Description | Examples |
|---------|-------------|----------|
| **Subject** | What is the main focus? | "empty tomb", "risen Christ silhouette", "Easter lilies" |
| **Style/Medium** | Art style or medium | "watercolor painting", "oil painting", "digital illustration", "line art" |
| **Mood** | Emotional tone | "peaceful", "hopeful", "dramatic", "serene", "joyful" |
| **Lighting** | Light source and quality | "soft golden morning light", "dramatic backlight", "warm sunrise glow" |
| **Color Palette** | Specific colors | "warm pastel peach pink and gold", "soft cream and sage green", "vibrant sunset oranges" |
| **Composition** | How it's arranged | "centered subject", "rule of thirds", "symmetrical design" |

---

## 🚫 Critical: Negative Prompts

**ALWAYS include these to avoid mockups and unwanted elements:**

```
--no frame --no border --no mockup --no room --no furniture --no wall --no floor --no shadow --no watermark --no signature --no text (unless text is desired)
```

### For Clean Print-Ready Art:
```
isolated artwork, clean edges for printing, solid background, no environmental elements, print-ready, no decorative borders
```

---

## 📏 Aspect Ratios & Resolutions

| Use Case | Aspect Ratio | Recommended Size |
|----------|--------------|------------------|
| Standard prints (8x10, 16x20) | 4:5 | 3200x4000px or 3712x4608px |
| Square prints | 1:1 | 4000x4000px |
| Frame TV art | 16:9 | 3840x2160px (4K) |
| Instagram/Social | 4:5 or 1:1 | 1080x1350px or 1080x1080px |
| Wide panoramic | 3:1 or 2:1 | 6000x2000px |

**Always request:** "8K resolution", "high detail", "ultra HD", "print-ready"

---

## 🎨 Style-Specific Templates

### 1. Watercolor Style
```
[Subject description], watercolor painting style, soft flowing brushstrokes, delicate color bleeds, wet-on-wet technique, [color palette], [mood] atmosphere, artistic watercolor texture, isolated on soft cream/white background, clean edges for printing, high detail, 8K resolution, print-ready wall art --no frame --no border --no mockup --no room --ar 4:5
```

**Example:**
```
Empty tomb at Easter sunrise with stone rolled away, watercolor painting style, soft flowing brushstrokes, delicate color bleeds, warm pastel palette of peach pink coral and gold, peaceful hopeful atmosphere, soft golden morning light streaming through, artistic watercolor texture, isolated on soft cream background, clean edges for printing, high detail, 8K resolution, print-ready wall art --no frame --no border --no mockup --no room --ar 4:5
```

### 2. Typography/Text Art
```
"[TEXT HERE]" elegant [font style] typography, [decorative elements around text], [color] lettering on [background color] background, [style] design, balanced composition, clean minimalist layout, isolated artwork, no environmental elements, high detail, 8K resolution, print-ready --no frame --no mockup --no room --no wall --ar 4:5
```

**Example:**
```
"He Is Risen" elegant gold calligraphy script typography, simple white Easter lilies at bottom, metallic gold lettering on soft cream background, refined minimal design, balanced centered composition, clean minimalist layout, isolated artwork, no environmental elements, high detail, 8K resolution, print-ready --no frame --no mockup --no room --no wall --ar 4:5
```

### 3. Silhouette/Dramatic
```
[Subject] silhouette, dramatic [lighting description], [color] sky background, powerful contrast, [mood] atmosphere, bold graphic composition, clean isolated artwork on gradient background, no ground elements, print-ready, 8K resolution --no frame --no border --no mockup --ar 4:5
```

**Example:**
```
Risen Christ figure silhouette with arms outstretched, dramatic golden sunrise backlight, vibrant orange and gold sky with light rays bursting outward, powerful inspiring contrast, majestic spiritual atmosphere, bold centered composition, clean isolated artwork on gradient sky background, no ground no landscape, print-ready, 8K resolution --no frame --no border --no mockup --ar 4:5
```

### 4. Minimalist/Modern
```
[Subject] in minimalist style, clean lines, simple geometric shapes, [limited color palette - 2-3 colors], negative space, modern aesthetic, flat design elements, isolated on [solid color] background, ultra clean edges, contemporary wall art, 8K resolution --no texture --no frame --no border --ar 4:5
```

### 5. Botanical/Floral
```
[Flower/plant description], botanical illustration style, detailed [medium] rendering, [color palette], scientific accuracy with artistic beauty, isolated specimen on [background], clean white margins, vintage botanical print aesthetic, high detail, 8K resolution --no frame --no vase --no pot --ar 4:5
```

### 6. Line Art/Coloring Pages
```
[Subject description], black line art on white background, clean outlines, coloring book style, clear defined sections for coloring, medium line weight, no shading no fills, child-friendly design, printable coloring page, high contrast black and white only --no gray --no color --no shading --ar 4:5
```

**Example (LDS Coloring Page):**
```
Young boy Joseph kneeling in prayer in sacred grove, black line art on pure white background, clean continuous outlines, coloring book illustration style, clear defined sections for coloring, medium consistent line weight, trees and light rays with simple shapes, child-friendly wholesome design, printable coloring page, high contrast black and white only --no gray --no color --no shading --no halftone --ar 4:5
```

---

## 🖼️ Platform-Specific Tips

### GenSpark (nano-banana-pro)
- Tends to add mockup frames automatically - be VERY explicit about "isolated artwork"
- Use "clean art print" and "no environmental elements"
- Best for: painterly styles, watercolors, complex scenes
- Generates at high resolution automatically

### kie.ai API (nano-banana)
- More control over output
- Use `output_format: "png"` for transparent/clean backgrounds
- Specify exact dimensions in request
- Best for: when you need precise control

### Midjourney
- Use `--no` parameters for negative prompts
- `--ar 4:5` for aspect ratio
- `--style raw` for less stylized output
- `--q 2` for higher quality

### DALL-E
- Doesn't support negative prompts the same way
- Be more descriptive about what you DO want
- Good for: typography, specific text rendering

---

## ✅ Pre-Generation Checklist

Before generating, confirm:

- [ ] Subject clearly described (what is it?)
- [ ] Style/medium specified (watercolor, oil, digital, line art?)
- [ ] Mood/atmosphere defined (peaceful, dramatic, joyful?)
- [ ] Color palette specified (not just "colorful")
- [ ] Lighting described (golden hour, soft diffused, dramatic?)
- [ ] Composition noted (centered, rule of thirds?)
- [ ] Background explicitly stated ("isolated on cream background")
- [ ] Negative prompts included (--no frame, mockup, room)
- [ ] Resolution requested (8K, high detail)
- [ ] Aspect ratio set (4:5 for prints)

---

## 🔄 Iteration Tips

1. **First attempt rarely perfect** - plan for 2-3 iterations
2. **If getting mockups:** Add more negative prompts, specify "isolated artwork", "floating on solid background"
3. **If too busy:** Add "minimalist", "simple", "clean", "uncluttered"
4. **If colors wrong:** Be more specific ("dusty rose pink" not just "pink")
5. **If style wrong:** Reference specific artists or art movements
6. **If composition off:** Specify camera angle, framing, subject placement

---

## 📚 Quick Reference: Mood Words

| Mood | Words to Use |
|------|--------------|
| Peaceful | serene, tranquil, calm, gentle, soft, quiet |
| Hopeful | uplifting, inspiring, bright, optimistic, warm |
| Dramatic | powerful, bold, striking, intense, majestic |
| Elegant | refined, sophisticated, graceful, delicate, luxurious |
| Whimsical | playful, charming, lighthearted, magical, dreamy |
| Cozy | warm, inviting, comfortable, homey, intimate |

---

## 📚 Quick Reference: Art Styles

| Style | Description |
|-------|-------------|
| Watercolor | Soft, flowing, translucent layers, color bleeds |
| Oil painting | Rich, textured, visible brushstrokes, depth |
| Digital illustration | Clean, precise, vector-like, modern |
| Impressionist | Light-focused, visible brushwork, dreamy |
| Minimalist | Simple, clean lines, negative space, limited palette |
| Botanical | Scientific accuracy, detailed specimens, vintage feel |
| Folk art | Flat, decorative, pattern-rich, naive style |
| Art deco | Geometric, glamorous, bold lines, metallic |

---

## 🏷️ Etsy SEO Keywords to Inspire Prompts

When creating art, think about searchable terms:
- "Printable wall art"
- "Digital download"
- "Nursery decor"
- "Christian wall art"
- "LDS printable"
- "Farmhouse style"
- "Boho decor"
- "Minimalist print"
- "Watercolor art"
- "Frame TV art"

---

*Last updated: February 3, 2026*
*Created by Maria for McKinzie's Etsy shops*
