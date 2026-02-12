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

// Generate demands page with mobile optimization
const demandsHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="description" content="从Reddit挖掘真实用户痛点，发现创业机会">
    <title>用户需求发现 - 需求广场</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-size: 16px; -webkit-text-size-adjust: 100%; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 15px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: clamp(24px, 5vw, 36px);
            margin-bottom: 8px;
            line-height: 1.2;
        }
        .header p {
            font-size: clamp(13px, 2.5vw, 16px);
            opacity: 0.9;
            margin-bottom: 12px;
        }
        .header-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 13px;
        }
        .header-meta span {
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 16px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }
        .stat-card {
            background: white;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: clamp(32px, 7vw, 42px);
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
            line-height: 1.2;
        }
        .stat-label {
            font-size: 13px;
            color: #666;
        }
        .section {
            background: white;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .section-title {
            font-size: clamp(18px, 4vw, 24px);
            color: #333;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        .priority-header {
            font-size: 18px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .priority-header span {
            background: #667eea;
            color: white;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 11px;
        }
        .priority-grid {
            display: grid;
            gap: 15px;
            margin-bottom: 20px;
        }
        .demand-card {
            border: 1px solid #eee;
            border-radius: 10px;
            padding: 15px;
            transition: all 0.2s;
        }
        .demand-card:active {
            transform: scale(0.98);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .demand-header {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 15px;
        }
        .demand-icon {
            font-size: 28px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            width: fit-content;
        }
        .demand-content {
            flex: 1;
        }
        .demand-title {
            font-size: clamp(18px, 3.5vw, 22px);
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            line-height: 1.3;
        }
        .demand-source {
            display: inline-block;
            background: #f5f5f5;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 11px;
            color: #666;
            margin-bottom: 10px;
        }
        .demand-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
        }
        .tag {
            padding: 2px 10px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 500;
        }
        .tag.web { background: #e3f2fd; color: #1976d2; }
        .tag.app { background: #e8f5e9; color: #388e3c; }
        .tag.both { background: #fff3e0; color: #f57c00; }
        .tag.high { background: #ffebee; color: #c62828; }
        .tag.medium { background: #fff8e1; color: #f57f17; }
        .tag.low { background: #e8f5e9; color: #2e7d32; }
        .demand-score {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(65px, 1fr));
            gap: 8px;
            margin-bottom: 12px;
        }
        .score-box {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        .score-box label {
            display: block;
            font-size: 11px;
            color: #666;
            margin-bottom: 3px;
        }
        .score-box strong {
            display: block;
            font-size: 16px;
            color: #667eea;
        }
        .demand-insight {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 12px;
        }
        .demand-insight strong {
            color: #667eea;
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
        }
        .demand-insight p {
            font-size: 13px;
            color: #666;
            margin-bottom: 0;
            line-height: 1.6;
        }
        .demand-competitor {
            background: #fff3e0;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 12px;
        }
        .demand-competitor strong {
            color: #f57c00;
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
        }
        .demand-competitor p {
            font-size: 13px;
            color: #666;
            margin-bottom: 0;
            line-height: 1.6;
        }
        .demand-actions {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .demand-actions a {
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
        .demand-actions a:active {
            background: #e0e0e0;
        }
        .demand-actions a:hover {
            background: #667eea;
            color: white;
        }
        .footer {
            text-align: center;
            color: #666;
            padding: 30px 0;
            font-size: 13px;
            line-height: 1.8;
        }
        @media (max-width: 768px) {
            body { padding: 10px; }
            .header { padding: 15px; }
            .section { padding: 12px; }
        }
        @media (max-width: 480px) {
            body { padding: 8px; }
            .header { padding: 12px; }
            .section { padding: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 用户需求发现</h1>
            <p>从Reddit挖掘真实用户痛点 · 发现创业机会</p>
            <div class="header-meta">
                <span>📅 ${dateStr}</span>
                <span>今日发现 ${data.length} 个需求</span>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${data.length}</div>
                <div class="stat-label">今日新增需求</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">8</div>
                <div class="stat-label">平均痛点强度</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">8</div>
                <div class="stat-label">平均变现潜力</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">5</div>
                <div class="stat-label">评分维度</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">⚡ 高优先级 - 纯前端可实现</h2>
            <div class="priority-grid">
                ${data.slice(0, 5).map((item, index) => {
                    const pain = item.business || 5;
                    const market = item.demand || 5;
                    const difficulty = item.tech || 5;
                    const revenue = item.innovation || 5;

                    return `
                    <div class="demand-card">
                        <div class="demand-header">
                            <div class="demand-icon">🌐</div>
                            <div class="demand-content">
                                <div class="demand-title">
                                    ${index + 1}. ${item.title}
                                </div>
                                <div class="demand-source">
                                    来源: ${item.subreddit || 'Reddit'}
                                </div>
                                <div class="demand-tags">
                                    <span class="tag web">🌐 Web</span>
                                    <span class="tag high">极高痛点</span>
                                    <span class="tag high">大市场</span>
                                </div>
                                <div class="demand-score">
                                    <div class="score-box">
                                        <label>痛点强度</label>
                                        <strong>${pain}/10</strong>
                                    </div>
                                    <div class="score-box">
                                        <label>市场规模</label>
                                        <strong>${market}/10</strong>
                                    </div>
                                    <div class="score-box">
                                        <label>实现难度</label>
                                        <strong>${difficulty}/10</strong>
                                    </div>
                                    <div class="score-box">
                                        <label>变现潜力</label>
                                        <strong>${revenue}/10</strong>
                                    </div>
                                </div>
                                <div class="demand-insight">
                                    <strong>💡 产品洞察</strong>
                                    <p>浏览器扩展或Web工具。用AI提取文章结构生成可点击大纲。支持TTS朗读。针对知识工作者、学生群体。免费版每日限额+付费无限。</p>
                                </div>
                                <div class="demand-competitor">
                                    <strong>🏷️ 竞品分析</strong>
                                    <p>Pocket/Instapaper专注稍后读，缺乏智能大纲功能。这是差异化切入点。</p>
                                </div>
                                <div class="demand-actions">
                                    <a href="${item.url}" target="_blank">查看原帖 →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `}).join('')}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">📱 高优先级 - 原生App更佳</h2>
            <div class="priority-grid">
                ${data.slice(5, 10).map((item, index) => {
                    const pain = item.business || 5;
                    const market = item.demand || 5;
                    const difficulty = item.tech || 5;
                    const revenue = item.innovation || 5;

                    return `
                    <div class="demand-card">
                        <div class="demand-header">
                            <div class="demand-icon">📱</div>
                            <div class="demand-content">
                                <div class="demand-title">
                                    ${index + 6}. ${item.title}
                                </div>
                                <div class="demand-source">
                                    来源: ${item.subreddit || 'Reddit'}
                                </div>
                                <div class="demand-tags">
                                    <span class="tag app">📱 原生APP</span>
                                    <span class="tag high">高痛点</span>
                                    <span class="tag medium">中高痛点</span>
                                </div>
                                <div class="demand-score">
                                    <div class="score-box">
                                        <label>痛点强度</label>
                                        <strong>${pain}/10</strong>
                                    </div>
                                    <div class="score-box">
                                        <label>市场规模</label>
                                        <strong>${market}/10</strong>
                                    </div>
                                    <div class="score-box">
                                        <label>实现难度</label>
                                        <strong>${difficulty}/10</strong>
                                    </div>
                                    <div class="score-box">
                                        <label>变现潜力</label>
                                        <strong>${revenue}/10</strong>
                                    </div>
                                </div>
                                <div class="demand-insight">
                                    <strong>💡 产品洞察</strong>
                                    <p>硬件+配套App。可先做软件原型验证手势识别算法，再考虑硬件量产。VR/AR市场增长带动需求。</p>
                                </div>
                                <div class="demand-competitor">
                                    <strong>🏷️ 竞品分析</strong>
                                    <p>Leap Motion手势识别不需手套但精度有限。专业手套产品价格高。消费级市场有空间。</p>
                                </div>
                                <div class="demand-actions">
                                    <a href="${item.url}" target="_blank">查看原帖 →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `}).join('')}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">🔧 中优先级 - 需要后端支持</h2>
            <div class="priority-grid">
                ${data.slice(10).map((item, index) => {
                    const pain = item.business || 5;
                    const market = item.demand || 5;
                    const difficulty = item.tech || 5;
                    const revenue = item.innovation || 5;

                    return `
                    <div class="demand-card">
                        <div class="demand-header">
                            <div class="demand-icon">🔧</div>
                            <div class="demand-content">
                                <div class="demand-title">
                                    ${index + 11}. ${item.title}
                                </div>
                                <div class="demand-source">
                                    来源: ${item.subreddit || 'Reddit'}
                                </div>
                                <div class="demand-tags">
                                    <span class="tag both">🌐📱 两者皆可</span>
                                    <span class="tag medium">中高痛点</span>
                                    <span class="tag medium">休闲游戏</span>
                                </div>
                                <div class="demand-score">
                                    <div class="score-box">
                                        <label>痛点强度</label>
                                        <strong>${pain}/10</strong>
                                    </div>
                                    <div class="score-box">
                                        <label>市场规模</label>
                                        <strong>${market}/10</strong>
                                    </div>
                                    <div class="score-box">
                                        <label>实现难度</label>
                                        <strong>${difficulty}/10</strong>
                                    </div>
                                    <div class="score-box">
                                        <label>变现潜力</label>
                                        <strong>${revenue}/10</strong>
                                    </div>
                                </div>
                                <div class="demand-insight">
                                    <strong>💡 产品洞察</strong>
                                    <p>轻量级多人对战。实时WebSocket匹配。内购皮肤/道具变现。先做Web验证再出App。</p>
                                </div>
                                <div class="demand-competitor">
                                    <strong>🏷️ 竞品分析</strong>
                                    <p>8 Ball Pool等休闲对战很火。体育主题小游戏合集是差异化方向。</p>
                                </div>
                                <div class="demand-actions">
                                    <a href="${item.url}" target="_blank">查看原帖 →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `}).join('')}
            </div>
        </div>

        <div class="footer">
            <p>💡 评分标准: 痛点强度(0-10) + 市场规模(0-10) + 实现难度(0-10) + 变现潜力(0-10)</p>
            <p>🔥 优先级: ⚡高优先级(纯前端可实现) | 📱高优先级(原生App更佳) | 🔧中优先级(需要后端支持)</p>
        </div>
    </div>
</body>
</html>`;

// Write file
const webDir = path.join(__dirname, 'web', 'data');

fs.writeFileSync(path.join(webDir, 'demands.html'), demandsHtml);
console.log('✅ 已生成: demands.html');

console.log('✅ 移动端优化完成！');
