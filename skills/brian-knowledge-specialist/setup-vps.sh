#!/bin/bash
# Brian Agent Setup Script for VPS
# Run on: 76.13.108.6

set -euo pipefail

echo "═══════════════════════════════════════════"
echo "  Brian (Knowledge Specialist) Setup"
echo "═══════════════════════════════════════════"
echo ""

# Configuration
AGENT_NAME="brian"
AGENT_USER="openclaw"
AGENT_DIR="/home/openclaw/agents/${AGENT_NAME}"
SHARED_INBOX="/home/openclaw/shared-inbox/${AGENT_NAME}"
SKILLS_DIR="/home/openclaw/skills/${AGENT_NAME}-knowledge-specialist"
BOT_TOKEN_FILE="/etc/openclaw/brian-bot-token"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Step 1: Creating directories..."
mkdir -p "${AGENT_DIR}"
mkdir -p "${AGENT_DIR}/outputs"
mkdir -p "${SHARED_INBOX}/inputs"
mkdir -p "${SHARED_INBOX}/outputs"
mkdir -p "${SHARED_INBOX}/processed"
mkdir -p "${SKILLS_DIR}"
chown -R ${AGENT_USER}:${AGENT_USER} "${AGENT_DIR}"
chown -R ${AGENT_USER}:${AGENT_USER} "${SHARED_INBOX}"
echo -e "${GREEN}✓${NC} Directories created"

echo ""
echo "Step 2: Creating initial SESSION_STATE.md..."
cat > "${AGENT_DIR}/SESSION_STATE.md" << 'EOF'
# Brian - Session State

**Last Updated:** $(date -u +"%Y-%m-%d %H:%M UTC")  
**Status:** Ready for content analysis

## Current Analysis Queue
- [ ] Pending: None

## Recent Analyses (Last 7 Days)
- None yet

## Pending User Questions
- None

## Content Backlog
- None

## Notes
- Agent initialized. Ready to receive content.
EOF
chown ${AGENT_USER}:${AGENT_USER} "${AGENT_DIR}/SESSION_STATE.md"
echo -e "${GREEN}✓${NC} Session state initialized"

echo ""
echo "Step 3: Creating systemd service..."
cat > /etc/systemd/system/brian-agent.service << 'EOF'
[Unit]
Description=Brian (Knowledge Specialist) Agent
After=network.target openclaw-gateway.service
Wants=openclaw-gateway.service

[Service]
Type=simple
User=openclaw
Group=openclaw
WorkingDirectory=/home/openclaw/agents/brian
Environment="HOME=/home/openclaw"
Environment="AGENT_NAME=brian"
Environment="AGENT_ROLE=knowledge-specialist"

# StartLimit settings for crash protection
StartLimitIntervalSec=60
StartLimitBurst=3

# OpenClaw connection
Environment="OPENCLAW_GATEWAY_URL=http://localhost:8080"
Environment="OPENCLAW_API_KEY_FILE=/etc/openclaw/api-key"

# Telegram bot token
Environment="TELEGRAM_BOT_TOKEN_FILE=/etc/openclaw/brian-bot-token"

# Skills directory
Environment="SKILLS_DIR=/home/openclaw/skills/brian-knowledge-specialist"
Environment="SHARED_INBOX=/home/openclaw/shared-inbox/brian"

# Auto-restart on failure
Restart=on-failure
RestartSec=10

# Heartbeat every 15 minutes
ExecStart=/usr/local/bin/openclaw-agent \
    --agent-id brian \
    --model haiku \
    --skills-dir ${SKILLS_DIR} \
    --shared-inbox ${SHARED_INBOX} \
    --heartbeat 900 \
    --session-state /home/openclaw/agents/brian/SESSION_STATE.md

# Graceful shutdown
TimeoutStopSec=30
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo -e "${YELLOW}⚠️  Manual steps required:${NC}"
echo ""
echo "1. Create Brian's Telegram bot:"
echo "   - Message @BotFather on Telegram"
echo "   - Create new bot: /newbot"
echo "   - Name: MMC Brian Bot"
echo "   - Username: @MMCBrianBot"
echo "   - Save the token to: ${BOT_TOKEN_FILE}"
echo ""
echo "2. Set permissions:"
echo "   sudo chmod 600 ${BOT_TOKEN_FILE}"
echo "   sudo chown openclaw:openclaw ${BOT_TOKEN_FILE}"
echo ""
echo "3. Copy skill files:"
echo "   scp -r skills/brian-knowledge-specialist/* ${AGENT_USER}@76.13.108.6:${SKILLS_DIR}/"
echo ""
echo "4. Enable and start the service:"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl enable brian-agent"
echo "   sudo systemctl start brian-agent"
echo ""
echo "5. Verify:"
echo "   sudo systemctl status brian-agent"
echo "   sudo journalctl -u brian-agent -f"
echo ""
echo "═══════════════════════════════════════════"
echo "  Setup script complete!"
echo "═══════════════════════════════════════════"
EOF
chmod +x /Users/mmcassistant/clawd/skills/brian-knowledge-specialist/setup-vps.sh

# Create the README for deployment
cat > /Users/mmcassistant/clawd/skills/brian-knowledge-specialist/README.md << 'EOF'
# Brian — Knowledge Specialist Agent

Brian is your dedicated content analysis expert. Send him transcripts, videos, articles — he'll extract actionable insights tailored to your business.

## Quick Start

```bash
# On VPS (76.13.108.6)
sudo bash setup-vps.sh
```

## How to Use

### Via Telegram
Message @MMCBrianBot:
- "Brian, analyze this: [YouTube URL]"
- "Brian, analyze these 5 videos: [URLs]"
- "Brian, what did we learn about FB bonus last week?"

### Via Shared Inbox
Drop files in:
```
/home/openclaw/shared-inbox/brian/inputs/
```

Brian will:
1. Pick up the content
2. Analyze it
3. Save results to `/home/openclaw/shared-inbox/brian/outputs/`
4. Notify you via Telegram

## What Brian Does

1. **Extracts full transcripts** — Not just summaries
2. **Rates relevance** — HIGH / MEDIUM / LOW
3. **Connects to your business** — Applies to HH, WHT, Etsy, PsalMix
4. **Provides action items** — This week / This month / This quarter
5. **Maintains knowledge base** — All analyses searchable

## Files

- `SKILL.md` — Brian's role and capabilities
- `AGENT-CONFIG.md` — Technical configuration
- `setup-vps.sh` — VPS deployment script
- `sample-analyses/` — Example outputs

## Integration

Brian works with your other agents:
- **Maria** — Coordinates priorities
- **Sage** — Validates research
- **Scout** — Analyzes competitor intel
- **You** — Primary interface via Telegram

## Status

- [x] Skill definition created
- [x] Agent configuration written
- [ ] VPS deployment (pending bot token)
- [ ] Telegram bot registration
- [ ] First test analysis

## Next Steps

1. Register @MMCBrianBot with @BotFather
2. Run setup-vps.sh on VPS
3. Test with one video
4. Scale to daily use
EOF

echo "Files created for Brian agent!"
ls -la /Users/mmcassistant/clawd/skills/brian-knowledge-specialist/
