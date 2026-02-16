# Browser PDF Generation Skill

## When to Use
Generating PDFs from web pages using the browser tool.

## ⚠️ Critical Lesson (Jan 30, 2026)
`browser pdf` with `targetUrl` may capture the WRONG tab if multiple tabs are open.

## Correct Process
1. **ALWAYS open the URL first** with `browser open` → save `targetId`
2. **Screenshot to VERIFY** you're on the correct page
3. **Generate PDF using the specific `targetId`** (not just targetUrl)
4. Send the file

## Example
```
1. browser open profile=clawd targetUrl=file:///path/to/report.html → get targetId
2. browser screenshot targetId=<id> → verify content visually
3. browser pdf targetId=<id> → generate from verified tab
4. message send with filePath
```

**Never trust targetUrl alone — always verify with screenshot first!**
