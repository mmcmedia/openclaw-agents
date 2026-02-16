#!/bin/bash
# EMERGENCY REPO CLEANUP SCRIPT
# Removes node_modules, build folders, and large binaries from git history

set -e

echo "🧹 EMERGENCY REPO CLEANUP"
echo "=========================="
echo ""
echo "⚠️  WARNING: This will rewrite git history!"
echo "   Make sure you have backups!"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

cd /Users/mmcassistant/clawd

echo ""
echo "Step 1: Creating comprehensive .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
**/node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.next/
out/
.output/

# Large media files
*.mp4
*.mov
*.avi
*.mkv
*.psd
*.ai
*.sketch
*.fig

# Generated content (reproducible)
projects/wholesome-library-2026/output/
projects/wholesome-library-2026/generated/
projects/wholesome-library-2026/stories/*/chapters/
projects/wholesome-library-v5/output/
projects/wholesome2.0/output/

# Backup folders
*-BACKUP-*/
*.backup
*.bak

# Logs
*.log
logs/

# Environment files (shouldn't be in git anyway)
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Temporary files
tmp/
temp/
.cache/
EOF

echo "✅ .gitignore created"

echo ""
echo "Step 2: Removing node_modules from git history..."
echo "   (This will take 10-30 minutes)"
echo ""

# Use git filter-repo if available, otherwise filter-branch
if command -v git-filter-repo &> /dev/null; then
    echo "Using git-filter-repo (faster)..."
    git filter-repo --force --path-glob '**/node_modules' --invert-paths
else
    echo "Using git filter-branch (slower)..."
    git filter-branch --force --index-filter \
        'git rm -rf --cached --ignore-unmatch */node_modules */*/node_modules */*/*/node_modules 2>/dev/null || true' \
        --prune-empty --tag-name-filter cat -- --all
fi

echo "✅ node_modules removed from history"

echo ""
echo "Step 3: Removing build/dist folders..."
if command -v git-filter-repo &> /dev/null; then
    git filter-repo --force --path-glob '**/dist' --invert-paths
    git filter-repo --force --path-glob '**/build' --invert-paths
    git filter-repo --force --path-glob '**/.next' --invert-paths
else
    git filter-branch --force --index-filter \
        'git rm -rf --cached --ignore-unmatch */dist */build */.next 2>/dev/null || true' \
        --prune-empty --tag-name-filter cat -- --all
fi

echo "✅ Build folders removed"

echo ""
echo "Step 4: Removing large media files..."
if command -v git-filter-repo &> /dev/null; then
    git filter-repo --force --path-glob '*.mp4' --invert-paths
    git filter-repo --force --path-glob '*.mov' --invert-paths
    git filter-repo --force --path-glob '*.psd' --invert-paths
else
    git filter-branch --force --index-filter \
        'git rm -rf --cached --ignore-unmatch *.mp4 *.mov *.psd 2>/dev/null || true' \
        --prune-empty --tag-name-filter cat -- --all
fi

echo "✅ Large media files removed"

echo ""
echo "Step 5: Cleaning up refs and garbage collecting..."
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "✅ Cleanup complete"

echo ""
echo "Step 6: Verifying size reduction..."
NEW_SIZE=$(du -sh .git | cut -f1)
echo "New .git size: $NEW_SIZE"

echo ""
echo "Step 7: Committing .gitignore..."
git add .gitignore
git commit -m "🧹 Add comprehensive .gitignore to prevent bloat"

echo ""
echo "=========================="
echo "🎉 CLEANUP COMPLETE!"
echo "=========================="
echo ""
echo "Next steps:"
echo "1. Review the changes: git log --oneline -10"
echo "2. Force push to GitHub: git push origin main --force"
echo "3. Tell teammates to reclone the repo"
echo ""
echo "To restore node_modules locally:"
echo "   npm install (in each project)"
