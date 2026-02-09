#!/bin/bash
# Git Commit Helper Script for School Directory Module
# Run this after reviewing the changes

echo "🚀 School Directory Module - Git Commit Helper"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository. Run this from project root."
    exit 1
fi

echo "📋 Files to be committed:"
echo ""

# Show new files
echo "🆕 New files:"
git status --short | grep "^??" | head -20

echo ""
echo "📝 Modified files:"
git status --short | grep "^ M" | head -20

echo ""
echo "✅ Ready to commit?"
echo ""
echo "Run these commands:"
echo ""
echo "1. Stage all changes:"
echo "   git add ."
echo ""
echo "2. Commit with message:"
echo '   git commit -m "feat: Complete School Directory module with 10,229 schools"
'
echo "3. Push to remote:"
echo "   git push origin main"
echo ""
echo "Or run all at once:"
echo "   git add . && git commit -m \"feat: Complete School Directory module with 10,229 schools\" && git push origin main"
echo ""
