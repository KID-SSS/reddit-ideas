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

// Generate index page
const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>创意广场 - 发现创意，捕捉需求</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 60px 20px;
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
            margin-bottom: 60px;
        }
        .header h1 {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 18px;
            opacity: 0.9;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-bottom: 60px;
        }
        .stat-card {
            background: white;
            padding: 40px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .stat-number {
            font-size: 56px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        .stat-label {
            font-size: 18px;
            color: #666;
            font-weight: 500;
        }
        .section-title {
            color: white;
            font-size: 32px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section-title::before {
            content: '';
            display: block;
            width: 8px;
            height: 32px;
            background: white;
            border-radius: 4px;
        }
        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 60px;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .card-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .card-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
        }
        .tag {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        .tag.web { background: #e3f2fd; color: #1976d2; }
        .tag.app { background: #e8f5e9; color: #388e3c; }
        .tag.both { background: #fff3e0; color: #f57c00; }
        .tag.platform { background: #f5f5f5; color: #666; }
        .card-score {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }
        .card-score strong {
            color: #333;
        }
        .card-meta {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.8;
        }
        .card-meta span {
            color: #667eea;
            font-weight: 500;
        }
        .card-actions {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .card-actions a {
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
        }
        .card-actions a:hover {
            text-decoration: underline;
        }
        .footer {
            text-align: center;
            color: white;
            opacity: 0.8;
            padding: 40px 0;
            font-size: 14px;
        }
        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            .card-grid {
                grid-template-columns: 1fr;
            }
            .header h1 {
                font-size: 32px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ 创意广场</h1>
            <p>R Reddit 精选创意与真实用户需求 · 每日更新</p>
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

console.log('✅ 全部完成！');
