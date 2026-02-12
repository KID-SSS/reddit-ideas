#!/bin/bash

# 创意广场 - 每日需求任务
# 每天 08:30 执行

set -e

SCRIPT_DIR="/home/clawdbot/workspace/reddit-ideas"
DATE=$(date +%Y-%m-%d)
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)

cd "$SCRIPT_DIR"

echo "🚀 创意广场 - 每日需求任务"
echo "📅 日期: $DATE"
echo "📋 执行步骤："
echo "  1. 归档昨日数据"
echo "  2. 抓取 Reddit 需求"
echo "  3. 筛选与评分"
echo "  4. 更新 HTML 文件"
echo ""

# Step 1: 归档昨日数据
echo "📦 Step 1: 归档昨日数据..."
if [ -f "web/data/demands-$YESTERDAY.html" ]; then
    mkdir -p "web/data/archive"
    cp "web/data/demands-$YESTERDAY.html" "web/data/archive/demands-$YESTERDAY.html"
    echo "   ✅ 已归档: demands-$YESTERDAY.html"
fi
if [ -f "web/data/all-demands-$YESTERDAY.html" ]; then
    cp "web/data/all-demands-$YESTERDAY.html" "web/data/archive/all-demands-$YESTERDAY.html"
    echo "   ✅ 已归档: all-demands-$YESTERDAY.html"
fi

# Step 2: 抓取 Reddit 需求
echo ""
echo "📡 Step 2: 抓取 Reddit 需求..."
# 需求从创意中筛选，或者单独抓取
# 这里复用创意收集，稍后通过评分筛选
node "$SCRIPT_DIR/collect-reddit-serper.js" 20 > /tmp/reddit-demands-collect.log 2>&1

COLLECTED_FILE="$SCRIPT_DIR/data/reddit-ideas-$DATE.json"

if [ ! -f "$COLLECTED_FILE" ]; then
    echo "   ❌ 收集失败"
    exit 1
fi
echo "   ✅ 已收集: $(wc -l < $COLLECTED_FILE) 个创意"

# Step 3: 评分分析
echo ""
echo "📊 Step 3: 评分分析..."
node "$SCRIPT_DIR/simple-analyze.js" "$COLLECTED_FILE" > /tmp/reddit-demands-analyze.log 2>&1

REPORT_FILE="$SCRIPT_DIR/data/report-$DATE.md"

if [ ! -f "$REPORT_FILE" ]; then
    echo "   ❌ 报告生成失败"
    exit 1
fi
echo "   ✅ 已生成: report-$DATE.md"

# Step 4: 生成 HTML
echo ""
echo "📄 Step 4: 生成 HTML 文件..."
node "$SCRIPT_DIR/generate-ideas-html.js" "$COLLECTED_FILE" "$REPORT_FILE" --demands > /tmp/reddit-demands-html.log 2>&1

if [ -f "$SCRIPT_DIR/web/data/demands-$DATE.html" ]; then
    echo "   ✅ 已生成: demands-$DATE.html"
fi
if [ -f "$SCRIPT_DIR/web/data/all-demands-$DATE.html" ]; then
    echo "   ✅ 已生成: all-demands-$DATE.html"
fi

# Step 5: 更新累计数据
echo ""
echo "🔄 Step 5: 更新累计数据..."
cp "$SCRIPT_DIR/web/data/demands-$DATE.html" "$SCRIPT_DIR/web/data/all-demands.html"

# Step 6: 更新广场中心首页统计
echo ""
echo "📊 Step 6: 更新广场中心首页统计..."
bash "$SCRIPT_DIR/update-stats.sh"

# Step 7: 部署到 GitHub
echo ""
echo "🚀 Step 7: 部署到 GitHub Pages..."
bash "$SCRIPT_DIR/deploy.sh"

# Step 8: 发送 Telegram 通知
echo ""
echo "📱 Step 8: 发送 Telegram 通知..."
MESSAGE="✅ 创意广场 - 每日需求任务完成

📊 统计：
   - 今日需求: $(grep -c '<tr' $SCRIPT_DIR/web/data/demands-$DATE.html) 个
   - 累计需求: $(grep -c '<tr' $SCRIPT_DIR/web/data/all-demands.html) 个

🔗 访问地址：
   - 广场中心: https://kid-sss.github.io/reddit-ideas/
   - 今日需求: https://kid-sss.github.io/reddit-ideas/demands.html
   - 全部需求: https://kid-sss.github.io/reddit-ideas/all-demands.html"

curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
  -d "chat_id=7953275208" \
  -d "text=$MESSAGE" > /dev/null

echo "   ✅ Telegram 通知已发送"

echo ""
echo "✅ 创意广场 - 每日需求任务完成"
echo ""
