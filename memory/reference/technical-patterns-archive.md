# Technical Patterns Archive

*Detailed technical workflows archived from LESSONS_LEARNED.md. Search via `memory_search` when needed.*

---

## GenSpark Batch Video Generation (2026-01-31)

**Task:** Generate 21 AI video clips for music video  
**Key Lesson:** Batch all prompts together in ONE submission — MUCH faster than one-by-one.

**Full Workflow:**
1. Write all prompts in numbered list format with specs at top:
   ```
   Generate 21 videos using PixVerse model, 16:9 aspect ratio, 4K resolution:
   
   1. [Detailed cinematic prompt]
   2. [Detailed cinematic prompt]
   ... etc
   ```
2. Go to https://www.genspark.ai (main homepage)
3. Paste ENTIRE list into the main textbox
4. Press Enter
5. When asked to confirm, reply: "A) Proceed with all [N] videos now. Use 8 second duration, 16:9 aspect ratio."
6. Wait 15-20 min for all to generate (~30 sec/video)
7. Download all clips

**Model:** PixVerse (official/pixverse/v5) - fast and good quality  
**Full docs:** `/skills/video-asset-manager/references/genspark-batch-workflow.md`

---

## GenSpark AI Drive Bulk Download (2026-01-31)

**Task:** Download many files from GenSpark AI Drive  
**Key Lesson:** ASK GENSPARK DIRECTLY for help — it can generate download URLs!

**Full Workflow:**
1. Go to https://www.genspark.ai
2. Type in chat: "How can I bulk download all files from a folder in AI Drive? I have 21 files in a folder called '[FOLDER NAME]'"
3. GenSpark will:
   - List the folder contents
   - Try to ZIP compress (may or may not work)
   - Generate **direct download URLs** with auth tokens
4. Copy URLs → Use download manager (JDownloader, Free Download Manager) or curl

**Download URL format:**
```
https://www.genspark.ai/api/files/s/{FILE_ID}?token={AUTH_TOKEN}
```

**Note:** Individual file downloads in AI Drive use GUID filenames. The download URLs preserve the original filename.

**Docs:** `/skills/video-asset-manager/references/genspark-download-workflow.md`

---

## Mediavine CSV Download Location (2026-01-30)

**Problem:** Couldn't find/automate Mediavine CSV export

**Exact Location:**
- Section: "Earnings & RPM" (NOT "Earnings Summary" at top!)
- Location: Top-right corner of section header
- Icons: 🔗 (link) and ⬇️ (download) - click the DOWNLOAD ARROW

**Screenshot:** `/projects/analytics-dashboard/docs/mediavine-download-location.png`

---

## TheSunDaisy Complete Handoff Package (2026-01-30)

**Every nightly product run MUST include:**
1. ✅ Generated images saved to AI Drive with shareable links
2. ✅ Competitive analysis (3-5 competitors with prices, reviews, what's included)
3. ✅ Competitor Etsy links (actual URLs)
4. ✅ Pricing recommendation with rationale
5. ✅ ALL remaining content (card backs, scripture text, etc.)
6. ✅ Complete instructions for Sandee (specs, fonts, deliverables)
7. ✅ Draft listing copy (title, all 13 tags, full description)
8. ✅ Next steps checklist with owners
9. ✅ PDF brief sent via Telegram + email

**Template:** `/projects/thesundaisy/briefs/2026-01-30-holy-week-study-cards-brief.md`

---

*Archived Feb 1, 2026*
