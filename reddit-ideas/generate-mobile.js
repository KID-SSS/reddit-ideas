#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read data
const dataFile = process.argv[2] || 'data/reddit-ideas-2026-02-12.json';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('✅ 数据读取成功:', data.length, '条');

// Generate today's date string
const today = new Date();
const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
});

// Generate index page with mobile optimization
const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="description" content="Reddit精选创意与需求，每日更新，智能评分分析">
    <title>创意广场 - 发现创意，捕捉需求</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-size: 16px; -webkit-text-size-adjust: 100%; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            line-height: 1.6;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: clamp(24px, 5vw, 48px);
            margin-bottom: 10px;
            line-height: 1.2;
        }
        .header p {
            font-size: clamp(14px, 3vw, 18px);
            opacity: 0.9;
            margin-bottom: 20px;
        }
        .header-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            font-size: clamp(12px, 2vw, 14px);
        }
        .header-meta span {
            background: rgba(255,255,255,0.2);
            padding: 6px 16px;
            border-radius: 20px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .stat-card:active {
            transform: scale(0.98);
        }
        .stat-number {
            font-size: clamp(28px, 6vw, 56px);
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
            line-height: 1.2;
        }
        .stat-label {
            font-size: clamp(12px, 2.5vw, 18px);
            color: #666;
            font-weight: 500;
        }
        .section-title {
            color: white;
            font-size: clamp(20px, 4vw, 32px);
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid white;
        }
        .section-title::before {
            content: '';
            display: block;
            width: 8px;
            height: clamp(24px, 5vw, 32px);
            background: white;
            border-radius: 4px;
        }
        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.2s;
        }
        .card:active {
            transform: scale(0.98);
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        .card-title {
            font-size: clamp(16px, 3vw, 24px);
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            line-height: 1.3;
        }
        .card-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 12px;
        }
        .tag {
            padding: 3px 10px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 500;
            white-space: nowrap;
        }
        .tag.web { background: #e3f2fd; color: #1976d2; }
        .tag.app { background: #e8f5e9; color: #388e3c; }
        .tag.both { background: #fff3e0; color: #f57c00; }
        .tag.platform { background: #f5f5f5; color: #666; }
        .card-score {
            font-size: 13px;
            color: #666;
            margin-bottom: 12px;
            line-height: 1.6;
        }
        .card-score strong {
            color: #333;
        }
        .card-meta {
            font-size: 13px;
            color: #666;
            margin-bottom: 12px;
            line-height: 1.8;
        }
        .card-meta span {
            color: #667eea;
            font-weight: 500;
        }
        .card-actions {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .card-actions a {
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            padding: 8px 16px;
            background: #f5f5f5;
            border-radius: 8px;
            display: inline-block;
            transition: all 0.2s;
        }
        .card-actions a:active {
            background: #e0e0e0;
        }
        .card-actions a:hover {
            background: #667eea;
            color: white;
        }
        .footer {
            text-align: center;
            color: white;
            opacity: 0.8;
            padding: 30px 0;
            font-size: clamp(12px, 2vw, 14px);
            line-height: 1.8;
        }
        .footer strong {
            color: white;
        }
        @media (max-width: 768px) {
            body { padding: 15px; }
            .header { margin-bottom: 20px; }
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
            .card-grid { grid-template-columns: 1fr; }
            .header-meta { justify-content: center; }
        }
        @media (max-width: 480px) {
            body { padding: 10px; }
            .stats-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ 创意广场</h1>
            <p>R Reddit 精选创意与真实用户需求 · 每日更新</p>
            <div class="header-meta">
                <span>📅 ${dateStr}</span>
                <span>创意 ${data.length} 个</span>
                <span>需求 ${data.length} 个</span>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${data.length}</div>
                <div class="stat-label">今日创意</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.length}</div>
                <div class="stat-label">今日需求</div>
            </div>
        </div>

        <h2 class="section-title">🚀 创意广场</h2>
        <div class="card-grid">
            ${data.slice(0, 10).map((item, index) => {
                const score = item.score || 0;
                const recClass = score >= 40 ? 'high' : score >= 35 ? 'medium' : 'low';
                const recText = score >= 40 ? '🔥强烈推荐' : score >= 35 ? '✅推荐' : '🤔考虑';

                return `
                <div class="card">
                    <div class="card-title">
                        ${index + 1}. ${item.title}
                        <span class="tag platform">${recText}</span>
                    </div>
                    <div class="card-tags">
                        <span class="tag web">🌐 Web</span>
                        <span class="tag app">📱 App</span>
                        <span class="tag both">🌐📱 两者皆可</span>
                    </div>
                    <div class="card-score">
                        <strong>总分: ${score}/50</strong> | 市场需求: ${(item.business || 5)}/10 | 技术可行: ${(item.tech || 5)}/10
                    </div>
                    <div class="card-meta">
                        <span>👥 前端开发</span> | <span>🔌 浏览器插件</span> | <span>🚀 Chrome商店</span>
                    </div>
                    <div class="card-actions">
                        <a href="${item.url}" target="_blank">查看原帖 →</a>
                    </div>
                </div>
            `}).join('')}
        </div>

        <h2 class="section-title">🎯 需求广场</h2>
        <div class="card-grid">
            ${data.slice(0, 10).map((item, index) => {
                const score = item.score || 0;
                const recClass = score >= 40 ? 'high' : score >= 35 ? 'medium' : 'low';
                const recText = score >= 40 ? '🔥强烈推荐' : score >= 35 ? '✅推荐' : '🤔考虑';

                return `
                <div class="card">
                    <div class="card-title">
                        ${index + 1}. ${item.title}
                        <span class="tag platform">${recText}</span>
                    </div>
                    <div class="card-tags">
                        <span class="tag web">🌐 Web</span>
                        <span class="tag app">📱 App</span>
                        <span class="tag both">🌐📱 两者皆可</span>
                    </div>
                    <div class="card-score">
                        <strong>总分: ${score}/50</strong> | 痛点强度: ${(item.business || 5)}/10 | 实现难度: ${(item.tech || 5)}/10
                    </div>
                    <div class="card-meta">
                        <span>👥 用户痛点</span> | <span>💰 变现潜力</span> | <span>🎯 市场规模</span>
                    </div>
                    <div class="card-actions">
                        <a href="${item.url}" target="_blank">查看原帖 →</a>
                    </div>
                </div>
            `}).join('')}
        </div>

        <div class="footer">
            <p>📅 ${dateStr} · 收录 ${data.length} 个创意/需求</p>
            <p>💡 评分标准: 创新性(0-10) + 市场规模(0-10) + 实现难度(0-10) + 竞品(0-10) + 变现潜力(0-10)</p>
            <p>🔥 推荐度: 🔥强烈推荐(40+) | ✅推荐(35+) | 🤔考虑(30+)</p>
        </div>
    </div>
</body>
</html>`;

// Write files
const webDir = path.join(__dirname, 'web', 'data');

fs.writeFileSync(path.join(webDir, 'index.html'), indexHtml);
console.log('✅ 已生成: index.html');

console.log('✅ 移动端优化完成！');
