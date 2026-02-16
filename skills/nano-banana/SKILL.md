# Nano Banana — Image Generation Skill

## When to Use
Generating images for Etsy prints, Frame TV art, or any AI image generation task using kie.ai API.

## API Details
- **API:** kie.ai (wrapper for Google's Gemini image model)
- **Key:** `~/.clawdbot/.env` → `KIE_AI_API_KEY`
- **Models:**
  - `google/nano-banana` — 2¢/image (DEFAULT)
  - `google/nano-banana-pro` — 12¢/image (tricky text/scripture art only)

## Async Workflow

### Step 1: Create Task
```bash
TASK_ID=$(curl -s -X POST https://api.kie.ai/api/v1/jobs/createTask \
  -H "Authorization: Bearer $KIE_AI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/nano-banana",
    "input": {
      "prompt": "Your prompt here...",
      "output_format": "png",
      "image_size": "3:4"
    }
  }' | jq -r '.data.taskId')
```

### Step 2: Poll (~10-15 sec, then poll)
```bash
curl -s "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=$TASK_ID" \
  -H "Authorization: Bearer $KIE_AI_API_KEY" | jq '{state: .data.state, result: .data.resultJson}'
```
States: `generating` → `success` or `failed`

### Step 3: Download
```bash
IMAGE_URL=$(curl -s "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=$TASK_ID" \
  -H "Authorization: Bearer $KIE_AI_API_KEY" | jq -r '.data.resultJson | fromjson | .resultUrls[0]')
curl -s -o output.png "$IMAGE_URL"
```

## ⚠️ CRITICAL Parameter Differences

| Model | Size param | Values |
|-------|-----------|--------|
| `google/nano-banana` | `image_size` | "1:1", "3:4", "4:3", "9:16", "16:9" |
| `google/nano-banana-pro` | `aspect_ratio` | "1:1", "3:4", "4:3", "9:16", "16:9" |

Pro also supports: `resolution`: "1K", "2K"

## Aspect Ratio Guide
- **3:4** = PORTRAIT (8.5x11") — USE FOR PRINTABLES
- **4:3** = LANDSCAPE (11x8.5") — USE FOR PRINTABLES
- **4:5** = Instagram portrait
- **9:16** = Frame TV / stories
- **16:9** = Wide banner
- **1:1** = Square (NOT for printables!)

⚠️ PRINTABLE PUPPET SHEETS: Always 3:4 or 4:3 — NEVER 1:1!

## Style Transfer Rules
- `google/nano-banana` = text-to-image (from scratch)
- `google/nano-banana-edit` = image-to-image (transforms ONE input)
- **DO NOT pass multiple images** — model will MERGE them!
- For style transfer: ONE content image + describe style IN THE PROMPT
- Example: "Transform into impressionistic oil painting with visible brushstrokes, warm cream/gold palette..."

## Pipeline Location
`/projects/etsy-pipeline/`
