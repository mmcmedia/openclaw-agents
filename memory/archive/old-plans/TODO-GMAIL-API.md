# TODO: Gmail API Attachment Access

**Priority:** Medium  
**Assigned:** Fitz  
**Status:** Not Started

## Problem
Currently cannot programmatically download email attachments from mmcaiassistant@gmail.com. When McKinzie sends PDFs or documents via email, I can view them in the browser but lack automated download capability.

## Current Workaround
- Open Gmail in browser manually
- Click email → attachment → right-click → save
- OR ask McKinzie to paste text content

## Solution: Implement Gmail API

### Steps:
1. **Enable Gmail API**
   - Go to Google Cloud Console
   - Create/select project for mmcaiassistant@gmail.com
   - Enable Gmail API

2. **Get OAuth Credentials**
   - Create OAuth 2.0 credentials
   - Set up authorized redirect URIs
   - Download credentials JSON

3. **Install Client Library**
   ```bash
   npm install googleapis
   ```

4. **Create Helper Script**
   ```javascript
   // scripts/gmail-download-attachment.js
   const {google} = require('googleapis');
   
   async function downloadAttachment(messageId, attachmentId, outputPath) {
     // Authenticate with OAuth
     // Fetch attachment
     // Save to file
   }
   ```

5. **Add to Workflow**
   - Check email periodically
   - Download new attachments automatically
   - Notify McKinzie when processed

### Resources
- [Gmail API Node.js Quickstart](https://developers.google.com/gmail/api/quickstart/nodejs)
- [Attachments Guide](https://developers.google.com/gmail/api/guides/uploads)

## Acceptance Criteria
- [ ] Can authenticate to Gmail API as mmcaiassistant@gmail.com
- [ ] Can list emails with attachments
- [ ] Can download PDF attachments to workspace
- [ ] Process documented in TOOLS.md
- [ ] Script added to workspace for future use

## Notes
McKinzie expects this to work automatically next time she sends attachments. This is a recurring workflow that needs to be solved properly.

**Created:** 2026-01-29  
**Due:** Before next PDF email
