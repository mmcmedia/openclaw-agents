# GetLate API Skill

Fetch social media analytics and scheduling data from GetLate (getlate.dev).

## When to Use

- Checking social media follower counts across platforms
- Monitoring social growth metrics
- Analyzing scheduled posts
- Pulling engagement data

## Prerequisites

- [x] API key stored in `~/.clawdbot/.env` as `GETLATE_API_KEY`
- [x] Team member access (mmcaiassistant@gmail.com)

## ⚠️ IMPORTANT RULES

- **ANALYZE ONLY** - Never create, modify, or delete posts
- **READ ONLY** - This is McKinzie's scheduling system, don't touch it
- URL is one word: `getlate.dev` (not "get late")

## API Reference

**Base URL:** `https://api.getlate.dev/v1`

**Auth Header:** `Authorization: Bearer $GETLATE_API_KEY`

### Endpoints

#### Get All Accounts
```bash
curl -H "Authorization: Bearer $GETLATE_API_KEY" \
  "https://api.getlate.dev/v1/accounts"
```

Returns: List of connected social accounts with IDs, platform, username, follower counts.

#### Get Account Details
```bash
curl -H "Authorization: Bearer $GETLATE_API_KEY" \
  "https://api.getlate.dev/v1/accounts/{account_id}"
```

#### Get Scheduled Posts
```bash
curl -H "Authorization: Bearer $GETLATE_API_KEY" \
  "https://api.getlate.dev/v1/posts?status=scheduled"
```

#### Get Analytics
```bash
curl -H "Authorization: Bearer $GETLATE_API_KEY" \
  "https://api.getlate.dev/v1/accounts/{account_id}/analytics"
```

## Common Use Cases

### 1. Get All Follower Counts

```bash
# Load API key
source ~/.clawdbot/.env

# Fetch all accounts
curl -s -H "Authorization: Bearer $GETLATE_API_KEY" \
  "https://api.getlate.dev/v1/accounts" | jq '.data[] | {platform, username, followers}'
```

### 2. Check Specific Account Growth

```bash
# Get Hello Hayley FB account
curl -s -H "Authorization: Bearer $GETLATE_API_KEY" \
  "https://api.getlate.dev/v1/accounts" | jq '.data[] | select(.username == "TheHelloHayleyBlog")'
```

### 3. Count Scheduled Posts

```bash
curl -s -H "Authorization: Bearer $GETLATE_API_KEY" \
  "https://api.getlate.dev/v1/posts?status=scheduled" | jq '.data | length'
```

## Response Parsing

**Account object:**
```json
{
  "id": "abc123",
  "platform": "facebook",
  "username": "TheHelloHayleyBlog",
  "followers": 17733,
  "following": 0,
  "created_at": "2024-01-15T..."
}
```

**Post object:**
```json
{
  "id": "post123",
  "account_id": "abc123",
  "content": "...",
  "scheduled_at": "2026-02-03T10:00:00Z",
  "status": "scheduled"
}
```

## Error Handling

| Status | Meaning | Action |
|--------|---------|--------|
| 401 | Invalid API key | Check `~/.clawdbot/.env` |
| 403 | Not authorized | Verify team member access |
| 429 | Rate limited | Wait and retry |
| 500 | Server error | Retry after delay |

## Integration Notes

- Detailed API docs at: `/projects/analytics-dashboard/GETLATE-API.md`
- Used by: Dashboard backend, weekly FB monitor cron
- Data syncs to: `/projects/analytics-dashboard/backend/data/social.json`

## Last Updated

Feb 2, 2026 - Initial skill creation
