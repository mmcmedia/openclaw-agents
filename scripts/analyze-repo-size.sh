#!/bin/bash
# CHECK WHAT'S TAKING UP SPACE (safe, read-only)

cd /Users/mmcassistant/clawd

echo "📊 REPO SIZE ANALYSIS"
echo "====================="
echo ""

echo "Total repo size:"
du -sh .
echo ""

echo ".git folder size:"
du -sh .git
echo ""

echo "Top 20 largest directories:"
du -sh * 2>/dev/null | sort -hr | head -20
echo ""

echo "Top 20 node_modules offenders:"
find . -name "node_modules" -type d -exec du -sh {} \; 2>/dev/null | sort -hr | head -20
echo ""

echo "Large media files:"
find . \( -name "*.mp4" -o -name "*.mov" -o -name "*.psd" -o -name "*.ai" \) -type f -exec ls -lh {} \; 2>/dev/null | head -20
echo ""

echo "Git objects size:"
git count-objects -vH
echo ""

echo "Estimated cleanup savings:"
echo "  - node_modules: ~30-35GB"
echo "  - build folders: ~2-3GB"
echo "  - media files: ~1-2GB"
echo "  TOTAL: ~35-40GB reduction"
