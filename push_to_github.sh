#!/bin/bash
# ============================================================
# push_to_github.sh – Đẩy toàn bộ workspace lên GitHub
# Sử dụng: bash push_to_github.sh
# ============================================================

set -e  # Dừng ngay nếu có lỗi

# ─── CẤU HÌNH – Chỉnh sửa 3 dòng này ─────────────────────
 GITHUB_USER="iahrung"
REPO_NAME="example"
BRANCH="main"
# ─────────────────────────────────────────────────────────────

REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
WORKSPACE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=================================================="
echo "  Workspace : $WORKSPACE_DIR"
echo "  GitHub    : $REPO_URL"
echo "  Branch    : $BRANCH"
echo "=================================================="

# 1. Kiểm tra git đã cài chưa
if ! command -v git &>/dev/null; then
  echo "❌ git chưa được cài đặt. Vui lòng cài git trước."
  exit 1
fi

cd "$WORKSPACE_DIR"

# 2. Khởi tạo repo nếu chưa có
if [ ! -d ".git" ]; then
  echo "📁 Khởi tạo git repo..."
  git init
  git checkout -b "$BRANCH" 2>/dev/null || git branch -M "$BRANCH"
fi

# 3. Tạo .gitignore nếu chưa có
if [ ! -f ".gitignore" ]; then
  echo "📝 Tạo .gitignore..."
  cat > .gitignore << 'EOF'
# Node
node_modules/
dist/
.cache/

# PHP
vendor/
*.log

# Env
.env
.env.local
.env.*.local

# Build
*.map

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
EOF
fi

# 4. Stage toàn bộ
echo ""
echo "📦 Staging files..."
git add .

# 5. Commit
COMMIT_MSG="chore: initial commit – $(date '+%Y-%m-%d %H:%M:%S')"
echo "💬 Commit: $COMMIT_MSG"
git commit -m "$COMMIT_MSG" || echo "ℹ️  Không có thay đổi mới để commit."

# 6. Thêm remote nếu chưa có
if ! git remote get-url origin &>/dev/null; then
  echo "🔗 Thêm remote origin: $REPO_URL"
  git remote add origin "$REPO_URL"
else
  echo "🔗 Remote origin đã tồn tại: $(git remote get-url origin)"
fi

# 7. Push
echo ""
echo "🚀 Đang đẩy lên GitHub..."
git push -u origin "$BRANCH"

echo ""
echo "✅ Hoàn thành! Xem tại: https://github.com/${GITHUB_USER}/${REPO_NAME}"
