# LESSONS_ARCHIVE.md

*Older lessons moved from LESSONS_LEARNED.md to keep that file lean. These are still valuable reference material.*

---

Main session gets distracted. Spawn isolated codex agent for dev work.

---

## 💡 Preferences

**McKinzie workflow:**
- Night owl - most productive 9pm-midnight
- Fragmented time blocks due to homeschool schedule
- Needs clear, concise updates (no walls of text)
- Proactive suggestions > passive questions
- Ruthless prioritization (help her say no)

**Me:**
- Do assigned kanban work first
- Suggest improvements, don't impose them
- Keep memory/docs updated religiously
- Spawn agents for complex work
- Communicate clearly when blocked

---

## 🎨 Creative Mode (Jan 30, 2026)

Activates overnight when no urgent task exists.

**Allowed:** Exploration, rabbit holes (30 min max), high-risk experiments, cross-pollination
**Required:** Document EVERYTHING, even failures

---

## Time Zones & Scheduling (Jan 28, 2026)

- McKinzie: Mountain Time (MST/MDT)
- Always schedule reminders in HER timezone
- Morning = ~9am MT, Evening = ~9pm MT, Night = 11pm+
- Heartbeats run hourly: 1am, 2am, 3am (overnight proactive work window)

---

## 📊 Mediavine CSV Downloads - LESSON LEARNED (Jan 30, 2026)

**Where to click:** In "Earnings & RPM" section (NOT top), find Download CSV in section header (top-right corner).

**EXACT LOCATION:** Two icons: 🔗 (link) and ⬇️ (download) - click DOWNLOAD ARROW!

Screenshot: `/projects/analytics-dashboard/docs/mediavine-download-location.png`

**Data format:** data: URL with CSV embedded (not traditional file download)

Files may appear in `chrome://downloads/` with GUID names, not ~/Downloads/

---

## GA4 OAuth Token Refresh (Jan 30, 2026)

Tokens expire every hour but auto-save on refresh:
```bash
cd /Users/mmcassistant/clawd/skills/ga4-analytics/scripts
node refresh-tokens.mjs
```

---

## GenSpark Image Download (Feb 2, 2026) ✅ RELIABLE METHOD

**Problem:** GenSpark API URLs require authentication; can't download directly with curl.

**Solution:** Use JavaScript injection in browser to create download links.

**Step 1:** Get all image URLs from page:
```javascript
browser.act({kind: "evaluate", fn: "() => { 
  const imgs = document.querySelectorAll('img'); 
  const urls = []; 
  imgs.forEach(img => { 
    if (img.src && img.src.includes('genspark.ai/api/files') && img.width > 200) { 
      urls.push({src: img.src, alt: img.alt || ''}); 
    }
  }); 
  return urls; 
}"})
```

**Step 2:** Download using JS-triggered anchor clicks:
```javascript
browser.act({kind: "evaluate", fn: "() => { 
  const downloads = [
    {url: 'https://www.genspark.ai/api/files/s/XXXXX', name: 'filename.png'},
  ]; 
  downloads.forEach((d, i) => { 
    setTimeout(() => { 
      const link = document.createElement('a'); 
      link.href = d.url; 
      link.download = d.name; 
      document.body.appendChild(link); 
      link.click(); 
      document.body.removeChild(link); 
    }, i * 1500); 
  }); 
  return 'Triggered downloads'; 
}"})
```

**Key insight:** Browser session has auth cookies; creating an `<a download>` link and clicking it uses those cookies automatically.

---

## Nano Banana (Etsy Print Generation) — ASYNC WORKFLOW ✅ (Feb 4, 2026)

**API:** kie.ai (wrapper for Google's Gemini image model)
**Key location:** `~/.clawdbot/.env` → `KIE_AI_API_KEY`

**Models:**
- `google/nano-banana` — 2¢/image (USE THIS by default)
- `google/nano-banana-pro` — 12¢/image (only for tricky text/scripture art)

**Input params (CRITICAL - different per model!):**

**For google/nano-banana (regular 2¢):**
- `image_size`: "1:1", "3:4", "4:3", "9:16", "16:9" ← USE THIS PARAMETER NAME!
- `output_format`: "png", "jpg"

**For google/nano-banana-pro (12¢):**
- `aspect_ratio`: "1:1", "3:4", "4:3", "9:16", "16:9" ← Different param name!
- `resolution`: "1K", "2K"
- `output_format`: "png", "jpg"

**⚠️ CRITICAL: nano-banana uses `image_size`, nano-banana-pro uses `aspect_ratio`!**

**Aspect ratios for printables:**
- **3:4** = PORTRAIT/VERTICAL (8.5x11")
- **4:3** = LANDSCAPE/HORIZONTAL (11x8.5")
- **DO NOT use 1:1 square for printables!**

**LESSON: Style Transfer (Feb 2, 2026)**
- `google/nano-banana` = text-to-image generation
- `google/nano-banana-edit` = image-to-image (transforms ONE input image)
- **DO NOT pass multiple images for style reference** - model will MERGE them!
- For style transfer: Pass ONE content image + describe target style IN THE PROMPT

---

## Browser PDF Generation - LESSON LEARNED (Jan 30, 2026)

**Problem:** When using `browser pdf` with a `targetUrl`, it may capture the wrong tab if multiple tabs are open, especially if sub-agents have been using the browser.

**Root Cause:** The browser has shared state. Sub-agents opening GenSpark pages meant those were the active tabs, and `browser pdf` captured whatever was in focus instead of navigating to the specified URL first.

**Correct Process:**
1. **ALWAYS open the target URL first** with `browser open` and save the `targetId`
2. **Take a screenshot to VERIFY** you're on the correct page
3. **Generate PDF using the specific `targetId`** (not just targetUrl)
4. Send the file

**Example:**
```
1. browser open profile=clawd targetUrl=file:///path/to/report.html → get targetId
2. browser screenshot targetId=<id> → verify content visually
3. browser pdf targetId=<id> → generate from verified tab
4. message send with filePath
```

**Never trust targetUrl alone for PDF generation — always verify with screenshot first!**

---

## Music Video App - Server Stability (Feb 1, 2026)

**Problem:** Next.js dev server was getting killed every ~30 seconds with SIGKILL.

**Root Cause:** Clawdbot's `exec` command has a default timeout (~30s) that kills background processes.

**Solution:** Start the server with `nohup` to detach it from the shell:
```bash
cd /Users/mmcassistant/clawd/projects/music-video-app
nohup npm run dev > /tmp/music-video-app.log 2>&1 &
```

**To check if running:**
```bash
ps aux | grep "next dev" | grep -v grep
```

**To view logs:**
```bash
tail -f /tmp/music-video-app.log
```

**To stop:**
```bash
pkill -f "next dev"
```

---

## PsalMix Repos (Feb 4, 2026)
- **PsalMix app**: `/projects/psalmix` → `github.com/mmcmedia/psalmix.git`
- **music-video-app**: Different project, NOT PsalMix streaming app
- Confused them and pushed to wrong repo — don't repeat this!
