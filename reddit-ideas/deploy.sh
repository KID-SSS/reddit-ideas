#!/bin/bash

# 创意广场 - 部署脚本
# 部署到 GitHub Pages

set -e

SCRIPT_DIR="/home/clawdbot/workspace/reddit-ideas"
WEB_DIR="$SCRIPT_DIR/web"

cd "$SCRIPT_DIR"

echo "🚀 开始部署到 GitHub Pages..."
echo "📁 工作目录: $WEB_DIR"

# 检查是否安装了 gh CLI
if ! command -v gh &> /dev/null; then
    echo "❌ 未安装 GitHub CLI"
    echo "请运行: npm install -g @cli/cli"
    exit 1
fi

# 检查是否已登录
if ! gh auth status &> /dev/null; then
    echo "🔐 请先登录 GitHub:"
    gh auth login
fi

echo "📤 推送到 GitHub..."
git config user.name "Clawdbot"
git config user.email "bot@clawdbot.com"

# 添加所有文件
git add .

# 提交
git commit -m "🚀 更新创意广场 - $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到 GitHub
git push origin main

echo ""
echo "✅ 部署完成！"
echo ""
echo "📋 GitHub Pages 地址："
echo "   - 广场中心: https://kid-sss.github.io/reddit-ideas/"
echo "   - 今日创意: https://kid-sss.github.io/reddit-ideas/ideas.html"
echo "   - 今日需求: https://kid-sss.github.io/reddit-ideas/demands.html"
echo "   - 全部创意: https://kid-sss.github.io/reddit-ideas/all-ideas.html"
echo "   - 全部需求: https://kid-sss.github.io/reddit-ideas/all-demands.html"
echo ""
echo "📌 GitHub 仓库: https://github.com/KID-SSS/reddit-ideas"
echo ""
echo "⚙️  设置 GitHub Pages："
echo "   1. 进入仓库 Settings > Pages"
echo "   2. Source: Deploy from a branch"
echo "   3. Branch: main, / (root)"
echo "   4. Save"
echo ""
