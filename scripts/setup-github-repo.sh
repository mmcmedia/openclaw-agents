#!/bin/bash
# Create and push to new GitHub repo for OpenClaw agents

REPO_NAME="openclaw-agents"
REPO_DESC="MMC Media OpenClaw Agent Infrastructure - CI/CD, quality gates, cost tracking, swarm orchestration"

echo "🚀 Setting up GitHub repository: mmcmedia/$REPO_NAME"
echo ""

# Create repo via GitHub CLI (if available) or provide manual instructions
if command -v gh &> /dev/null; then
    echo "Creating repo with GitHub CLI..."
    gh repo create "mmcmedia/$REPO_NAME" \
        --description "$REPO_DESC" \
        --private \
        --source=. \
        --remote=origin \
        --push
    echo "✅ Repo created and code pushed!"
else
    echo "GitHub CLI not available. Manual steps:"
    echo ""
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: $REPO_DESC"
    echo "4. Make it PRIVATE"
    echo "5. Click 'Create repository'"
    echo ""
    echo "Then run these commands:"
    echo "   cd /Users/mmcassistant/clawd"
    echo "   git remote remove origin"
    echo "   git remote add origin https://github.com/mmcmedia/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi
