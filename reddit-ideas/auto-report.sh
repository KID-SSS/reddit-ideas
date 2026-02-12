#!/bin/bash

# Reddit Ideas Daily Report - 完整自动化版本
# 收集、分析、生成报告并通过 Clawdbot 发送

set -e

SCRIPT_DIR="/home/clawdbot/workspace/reddit-ideas"
DATA_DIR="$SCRIPT_DIR/data"
DATE=$(date +%Y-%m-%d)

cd "$SCRIPT_DIR"

echo "🚀 Reddit 创意广场 - 开始执行"
echo "📅 日期: $DATE"

# 创建数据目录
mkdir -p "$DATA_DIR"

# Step 1: 收集创意
echo "📡 收集 Reddit 创意..."
node "$SCRIPT_DIR/collect-reddit-serper.js" 20 > /tmp/reddit-collect.log 2>&1

COLLECTED_FILE="$DATA_DIR/reddit-ideas-$DATE.json"

if [ ! -f "$COLLECTED_FILE" ]; then
    echo "❌ 收集失败"
    exit 1
fi

# Step 2: 生成报告
echo "📊 生成分析报告..."
node "$SCRIPT_DIR/simple-analyze.js" "$COLLECTED_FILE" > /tmp/reddit-analyze.log 2>&1

REPORT_FILE="$DATA_DIR/report-$DATE.md"

if [ ! -f "$REPORT_FILE" ]; then
    echo "❌ 报告生成失败"
    exit 1
fi

# Step 3: 输出报告内容（让 Clawdbot 发送）
echo "✅ 报告生成完成"
echo ""
cat "$REPORT_FILE"
