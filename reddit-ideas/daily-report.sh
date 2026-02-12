#!/bin/bash

# Reddit Ideas Daily Report
# 每日自动收集、分析并发送报告

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/data"
DATE=$(date +%Y-%m-%d)

echo "🚀 Reddit 创意广场 - 每日报告生成器"
echo "📅 日期: $DATE"
echo ""

# 创建数据目录
mkdir -p "$DATA_DIR"

# Step 1: 收集 Reddit 创意
echo "📡 Step 1: 收集 Reddit 创意..."
node "$SCRIPT_DIR/collect-reddit.js" 20

# Step 2: AI 分析
echo ""
echo "🤖 Step 2: AI 分析创意..."
COLLECTED_FILE="$DATA_DIR/reddit-ideas-$DATE.json"

if [ ! -f "$COLLECTED_FILE" ]; then
    echo "❌ 错误: 收集的数据文件不存在"
    exit 1
fi

node "$SCRIPT_DIR/analyze-ideas.js" "$COLLECTED_FILE"

# Step 3: 发送报告
echo ""
echo "📨 Step 3: 发送报告到 Telegram..."
REPORT_FILE="$DATA_DIR/report-$DATE.md"

if [ -f "$REPORT_FILE" ]; then
    # 读取报告内容并通过 Clawdbot 发送
    clawdbot message send --channel telegram --target 7953275208 --message "$(cat $REPORT_FILE)" 2>/dev/null || {
        echo "⚠️  Telegram 发送失败，报告已保存在: $REPORT_FILE"
    }
    
    echo "✅ 报告已发送！"
    echo "📄 报告文件: $REPORT_FILE"
else
    echo "❌ 错误: 报告文件不存在"
    exit 1
fi

echo ""
echo "🎉 完成！"
