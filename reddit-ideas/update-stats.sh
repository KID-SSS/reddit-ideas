#!/bin/bash

# 统计更新脚本
# 更新 index.html 的四个统计数字

SCRIPT_DIR="/home/clawdbot/workspace/reddit-ideas"
WEB_DIR="$SCRIPT_DIR/web"
DATA_DIR="$WEB_DIR/data"

cd "$SCRIPT_DIR"

echo "📊 更新广场中心首页统计..."

# 读取 today.html 获取统计数据
if [ -f "$DATA_DIR/ideas-$(date +%Y-%m-%d).html" ]; then
    IDEAS_COUNT=$(grep -o '<tr' "$DATA_DIR/ideas-$(date +%Y-%m-%d).html" | wc -l)
    echo "✅ 今日创意: $IDEAS_COUNT 个"
else
    IDEAS_COUNT=0
    echo "⚠️  今日创意文件不存在"
fi

if [ -f "$DATA_DIR/demands-$(date +%Y-%m-%d).html" ]; then
    DEMANDS_COUNT=$(grep -o '<tr' "$DATA_DIR/demands-$(date +%Y-%m-%d).html" | wc -l)
    echo "✅ 今日需求: $DEMANDS_COUNT 个"
else
    DEMANDS_COUNT=0
    echo "⚠️  今日需求文件不存在"
fi

if [ -f "$DATA_DIR/all-ideas.html" ]; then
    ALL_IDEAS_COUNT=$(grep -o '<tr' "$DATA_DIR/all-ideas.html" | wc -l)
    echo "✅ 累计创意: $ALL_IDEAS_COUNT 个"
else
    ALL_IDEAS_COUNT=0
    echo "⚠️  累计创意文件不存在"
fi

if [ -f "$DATA_DIR/all-demands.html" ]; then
    ALL_DEMANDS_COUNT=$(grep -o '<tr' "$DATA_DIR/all-demands.html" | wc -l)
    echo "✅ 累计需求: $ALL_DEMANDS_COUNT 个"
else
    ALL_DEMANDS_COUNT=0
    echo "⚠️  累计需求文件不存在"
fi

echo ""
echo "✅ 统计更新完成"
