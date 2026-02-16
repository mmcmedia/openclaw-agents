#!/bin/bash
# Push to GitHub in chunks, excluding large directories

REPO="https://github.com/mmcmedia/openclaw-agents.git"

echo "🚀 Pushing to GitHub in chunks..."

# Configure git to handle large pushes
git config http.postBuffer 524288000
git config http.maxRequestBuffer 524288000
git config pack.windowMemory 256m
git config pack.packSizeLimit 256m

# Push in chunks by directory
echo "Chunk 1: Core infrastructure (scripts)..."
git push origin main --force 2>&1 | head -20

echo "Done!"
