#!/usr/bin/env node

/**
 * 生成 HTML 格式的报告
 */

const fs = require('fs');
const path = require('path');

function generateHTML(ideas) {
  const date = new Date().toISOString().split('T')[0];
  
  // 为每个创意评分
  const analyzed = ideas.map(idea => ({
    ...idea,
    scores: quickScore(idea),
    concept: idea.title.replace(/\[.*?\]/g, '').trim()
  }));
  
  // 按总分排序
  const sorted = analyzed.sort((a, b) => b.scores.total - a.scores.total);
  
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Reddit 创意广场 - ${date}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .content {
            padding: 40px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
        }
        .stat-card h3 {
            font-size: 2em;
            margin-bottom: 5px;
        }
        .stat-card p {
            opacity: 0.9;
        }
        .table-container {
            overflow-x: auto;
            margin-bottom: 40px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .score {
            font-weight: bold;
            font-size: 1.2em;
            color: #667eea;
        }
        .badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }
        .badge-hot { background: #ff6b6b; color: white; }
        .badge-good { background: #51cf66; color: white; }
        .badge-ok { background: #ffd43b; color: #333; }
        .badge-low { background: #adb5bd; color: white; }
        .idea-card {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            border-left: 5px solid #667eea;
        }
        .idea-card h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        .idea-card .meta {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .idea-card .meta span {
            background: white;
            padding: 5px 12px;
            border-radius: 8px;
            font-size: 0.9em;
        }
        .idea-card .description {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.8;
        }
        .idea-card a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        .idea-card a:hover {
            text-decoration: underline;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
        }
        .score-bar {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        .score-item {
            flex: 1;
            text-align: center;
            padding: 8px;
            background: white;
            border-radius: 8px;
        }
        .score-item .label {
            font-size: 0.8em;
            color: #666;
        }
        .score-item .value {
            font-size: 1.2em;
            font-weight: bold;
            color: #667eea;
        }
        @media (max-width: 768px) {
            .header h1 { font-size: 1.8em; }
            .content { padding: 20px; }
            th, td { padding: 10px; font-size: 0.9em; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Reddit 创意广场</h1>
            <p>每日精选 ${sorted.length} 个创意 · ${date}</p>
        </div>
        
        <div class="content">
            <div class="stats">
                <div class="stat-card">
                    <h3>${sorted.length}</h3>
                    <p>📊 收集创意</p>
                </div>
                <div class="stat-card">
                    <h3>${sorted.filter(i => i.scores.total >= 35).length}</h3>
                    <p>✅ 推荐项目</p>
                </div>
                <div class="stat-card">
                    <h3>${Math.round(sorted.reduce((sum, i) => sum + i.scores.total, 0) / sorted.length)}</h3>
                    <p>📈 平均分数</p>
                </div>
            </div>

            <h2 style="margin-bottom: 20px;">📊 创意排行榜</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>排名</th>
                            <th>创意标题</th>
                            <th>总分</th>
                            <th>推荐度</th>
                            <th>商业</th>
                            <th>技术</th>
                            <th>需求</th>
                            <th>创新</th>
                            <th>竞争</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sorted.map((item, index) => {
                            const s = item.scores;
                            const badge = s.total >= 40 ? 'badge-hot' : s.total >= 35 ? 'badge-good' : s.total >= 30 ? 'badge-ok' : 'badge-low';
                            const rec = s.total >= 40 ? '🔥 强推' : s.total >= 35 ? '✅ 推荐' : s.total >= 30 ? '🤔 考虑' : '⚠️ 评估';
                            return `
                        <tr>
                            <td><strong>${index + 1}</strong></td>
                            <td><a href="${item.url}" target="_blank">${item.concept.substring(0, 50)}${item.concept.length > 50 ? '...' : ''}</a></td>
                            <td><span class="score">${s.total}</span></td>
                            <td><span class="badge ${badge}">${rec}</span></td>
                            <td>${s.business_value}</td>
                            <td>${s.technical_difficulty}</td>
                            <td>${s.user_demand}</td>
                            <td>${s.innovation}</td>
                            <td>${s.market_competition}</td>
                        </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <h2 style="margin-bottom: 20px;">📝 Top 5 详细分析</h2>
            ${sorted.slice(0, 5).map((item, index) => {
                const s = item.scores;
                const rec = s.total >= 40 ? '🔥 强烈推荐' : s.total >= 35 ? '✅ 推荐' : s.total >= 30 ? '🤔 考虑' : '⚠️ 需评估';
                return `
            <div class="idea-card">
                <h3>${index + 1}. ${item.concept}</h3>
                <div class="meta">
                    <span><strong>总分:</strong> ${s.total}/50</span>
                    <span><strong>推荐度:</strong> ${rec}</span>
                    <span><strong>来源:</strong> r/${item.subreddit}</span>
                </div>
                <div class="score-bar">
                    <div class="score-item">
                        <div class="label">💰 商业</div>
                        <div class="value">${s.business_value}</div>
                    </div>
                    <div class="score-item">
                        <div class="label">🔧 技术</div>
                        <div class="value">${s.technical_difficulty}</div>
                    </div>
                    <div class="score-item">
                        <div class="label">👥 需求</div>
                        <div class="value">${s.user_demand}</div>
                    </div>
                    <div class="score-item">
                        <div class="label">💡 创新</div>
                        <div class="value">${s.innovation}</div>
                    </div>
                    <div class="score-item">
                        <div class="label">🏆 竞争</div>
                        <div class="value">${s.market_competition}</div>
                    </div>
                </div>
                <div class="description">${item.snippet}</div>
                <a href="${item.url}" target="_blank">查看原帖 →</a>
            </div>
                `;
            }).join('')}
        </div>

        <div class="footer">
            <p>📌 评分说明：总分 0-50 分 | 🔥强推(40+) ✅推荐(35+) 🤔考虑(30+) ⚠️评估(&lt;30)</p>
            <p>数据来源：Reddit 多个创意相关 subreddit</p>
            <p style="margin-top: 10px; opacity: 0.7;">生成时间：${new Date().toLocaleString('zh-CN')}</p>
        </div>
    </div>
</body>
</html>`;

  return html;
}

function quickScore(idea) {
  const text = (idea.title + ' ' + idea.snippet).toLowerCase();
  
  const businessKeywords = ['monetize', 'revenue', 'business', 'market', 'sell', 'profit', 'startup'];
  const businessScore = businessKeywords.filter(k => text.includes(k)).length + 5;
  
  const simpleKeywords = ['simple', 'basic', 'easy', 'quick', 'minimal'];
  const complexKeywords = ['ai', 'ml', 'blockchain', 'complex', 'advanced'];
  const techScore = 8 - complexKeywords.filter(k => text.includes(k)).length + 
                    simpleKeywords.filter(k => text.includes(k)).length;
  
  const demandKeywords = ['need', 'want', 'wish', 'looking for', 'should exist', 'missing'];
  const demandScore = demandKeywords.filter(k => text.includes(k)).length + 6;
  
  const innovationKeywords = ['new', 'innovative', 'unique', 'novel', 'different'];
  const innovationScore = innovationKeywords.filter(k => text.includes(k)).length + 5;
  
  const competitionScore = 7;
  
  const total = Math.min(businessScore, 10) + 
                Math.min(techScore, 10) + 
                Math.min(demandScore, 10) + 
                Math.min(innovationScore, 10) + 
                Math.min(competitionScore, 10);
  
  return {
    business_value: Math.min(businessScore, 10),
    technical_difficulty: Math.min(techScore, 10),
    user_demand: Math.min(demandScore, 10),
    innovation: Math.min(innovationScore, 10),
    market_competition: Math.min(competitionScore, 10),
    total: total
  };
}

// CLI 模式
if (require.main === module) {
  const inputFile = process.argv[2];
  
  if (!inputFile) {
    console.error('Usage: node generate-html.js <input-json-file>');
    process.exit(1);
  }
  
  console.log('🎨 生成 HTML 报告...\n');
  
  const ideas = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const html = generateHTML(ideas);
  
  const timestamp = new Date().toISOString().split('T')[0];
  const outputFile = path.join(path.dirname(inputFile), `report-${timestamp}.html`);
  fs.writeFileSync(outputFile, html);
  
  console.log(`✅ HTML 报告已生成: ${outputFile}\n`);
}

module.exports = { generateHTML };
