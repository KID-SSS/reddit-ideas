#!/bin/bash

# 创意广场 - 每日创意任务
# 每天 08:00 执行

set -e

SCRIPT_DIR="/home/clawdbot/workspace/reddit-ideas"
DATE=$(date +%Y-%m-%d)
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)

cd "$SCRIPT_DIR"

echo "🚀 创意广场 - 每日创意任务"
echo "📅 日期: $DATE"
echo "📋 执行步骤："
echo "  1. 归档昨日数据"
echo "  2. 抓取 Reddit 创意"
echo "  3. 筛选与评分"
echo "  4. 更新 HTML 文件"
echo ""

# Step 1: 归档昨日数据
echo "📦 Step 1: 归档昨日数据..."
if [ -f "web/data/ideas-$YESTERDAY.html" ]; then
    mkdir -p "web/data/archive"
    cp "web/data/ideas-$YESTERDAY.html" "web/data/archive/ideas-$YESTERDAY.html"
    echo "   ✅ 已归档: ideas-$YESTERDAY.html"
fi
if [ -f "web/data/all-ideas-$YESTERDAY.html" ]; then
    cp "web/data/all-ideas-$YESTERDAY.html" "web/data/archive/all-ideas-$YESTERDAY.html"
    echo "   ✅ 已归档: all-ideas-$YESTERDAY.html"
fi

# Step 2: 抓取 Reddit 创意
echo ""
echo "📡 Step 2: 抓取 Reddit 创意..."
node "$SCRIPT_DIR/collect-reddit-serper.js" 20 > /tmp/reddit-ideas-collect.log 2>&1

COLLECTED_FILE="$SCRIPT_DIR/data/reddit-ideas-$DATE.json"

if [ ! -f "$COLLECTED_FILE" ]; then
    echo "   ❌ 收集失败"
    exit 1
fi
echo "   ✅ 已收集: $(wc -l < $COLLECTED_FILE) 个创意"

# Step 3: 评分分析
echo ""
echo "📊 Step 3: 评分分析..."
node "$SCRIPT_DIR/simple-analyze.js" "$COLLECTED_FILE" > /tmp/reddit-ideas-analyze.log 2>&1

REPORT_FILE="$SCRIPT_DIR/data/report-$DATE.md"

if [ ! -f "$REPORT_FILE" ]; then
    echo "   ❌ 报告生成失败"
    exit 1
fi
echo "   ✅ 已生成: report-$DATE.md"

# Step 4: 生成 HTML
echo ""
echo "📄 Step 4: 生成 HTML 文件..."
node "$SCRIPT_DIR/generate-ideas-html.js" "$COLLECTED_FILE" "$REPORT_FILE" > /tmp/reddit-ideas-html.log 2>&1

if [ -f "$SCRIPT_DIR/web/data/ideas-$DATE.html" ]; then
    echo "   ✅ 已生成: ideas-$DATE.html"
fi
if [ -f "$SCRIPT_DIR/web/data/all-ideas-$DATE.html" ]; then
    echo "   ✅ 已生成: all-ideas-$DATE.html"
fi

# Step 5: 更新累计数据
echo ""
echo "🔄 Step 5: 更新累计数据..."
cp "$SCRIPT_DIR/web/data/ideas-$DATE.html" "$SCRIPT_DIR/web/data/all-ideas.html"

# Step 6: 发送 Telegram 通知
echo ""
echo "📱 Step 6: 发送 Telegram 通知..."
MESSAGE="✅ 创意广场 - 每日创意任务完成

📊 统计：
   - 今日创意: $(grep -c '<tr' $SCRIPT_DIR/web/data/ideas-$DATE.html) 个
   - 累计创意: $(grep -c '<tr' $SCRIPT_DIR/web/data/all-ideas.html) 个

🔗 访问地址：
   - 广场中心: https://kid-sss.github.io/reddit-ideas/
   - 今日创意: https://kid-sss.github.io/reddit-ideas/ideas.html
   - 全部创意: https://kid-sss.github.io/reddit-ideas/all-ideas.html"

curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
  -d "chat_id=7953275208" \
  -d "text=$MESSAGE" > /dev/null

echo "   ✅ Telegram 通知已发送"

echo ""
echo "✅ 创意广场 - 每日创意任务完成"
echo ""
