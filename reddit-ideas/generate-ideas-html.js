const fs = require('fs');
const path = require('path');

/**
 * 创意广场 HTML 生成器
 * 生成今日创意、累计创意、今日需求、累计需求页面
 */

function generateHTML(data, type = 'ideas') {
    const today = new Date().toISOString().split('T')[0];
    const dateStr = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let title, filename, items;

    if (type === 'ideas') {
        title = `创意广场 - 今日创意 (${dateStr})`;
        filename = `ideas-${today}.html`;
        items = data.slice(0, 20); // 只显示前20个
    } else {
        title = `创意广场 - 今日需求 (${dateStr})`;
        filename = `demands-${today}.html`;
        items = data.slice(0, 20);
    }

    // 排序：总分从高到低
    items.sort((a, b) => (b.score || 0) - (a.score || 0));

    let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 { color: #333; margin-bottom: 20px; }
        .meta {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f8f8;
            font-weight: 600;
            color: #333;
        }
        tr:hover { background: #fafafa; }
        .score { font-weight: bold; }
        .recommendation {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
            margin-left: 8px;
        }
        .recommendation.high { background: #e6f4ea; color: #1e8e3e; }
        .recommendation.medium { background: #fef7e0; color: #f9ab00; }
        .recommendation.low { background: #fce8e6; color: #d93025; }
        .back {
            display: inline-block;
            margin-bottom: 20px;
            color: #666;
            text-decoration: none;
        }
        .back:hover { color: #333; }
    </style>
</head>
<body>
    <div class="container">
        <a href="index.html" class="back">← 返回广场中心</a>
        <h1>${title}</h1>
        <p class="meta">
            共 ${items.length} 个创意 | 数据来源: Reddit | 评分标准: 创新性(0-10) + 市场规模(0-10) + 实现难度(0-10) + 竞品(0-10) + 变现潜力(0-10)
        </p>
        <table>
            <thead>
                <tr>
                    <th width="10%">排名</th>
                    <th width="35%">创意/需求</th>
                    <th width="15%">总分</th>
                    <th width="15%">推荐度</th>
                    <th width="25%">评分详情</th>
                </tr>
            </thead>
            <tbody>
`;

    items.forEach((item, index) => {
        const score = item.score || 0;
        const recClass = score >= 40 ? 'high' : score >= 35 ? 'medium' : 'low';
        const recText = score >= 40 ? '🔥强烈推荐' : score >= 35 ? '✅推荐' : '🤔考虑';

        html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <strong>${item.title}</strong>
                        <div style="margin-top: 4px;">
                            <a href="${item.url}" target="_blank" style="color: #666; font-size: 12px;">查看原帖 →</a>
                        </div>
                    </td>
                    <td class="score" style="font-size: 18px;">${score}</td>
                    <td><span class="recommendation ${recClass}">${recText}</span></td>
                    <td style="font-size: 12px;">
                        <div>💰 商业: ${item.business || 0}/10</div>
                        <div>🔧 技术: ${item.tech || 0}/10</div>
                        <div>👥 需求: ${item.demand || 0}/10</div>
                        <div>💡 创新: ${item.innovation || 0}/10</div>
                        <div>🏆 竞品: ${item.competition || 0}/10</div>
                    </td>
                </tr>
`;
    });

    html += `
            </tbody>
        </table>
        <p style="margin-top: 30px; color: #999; font-size: 12px;">
            * 评分基于关键词分析和热度指标 | 数据来源: Reddit 多个相关 subreddit
        </p>
    </div>
</body>
</html>`;

    return { html, filename };
}

function generateAllHTML(data, type = 'ideas') {
    const today = new Date().toISOString().split('T')[0];
    const dateStr = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let title, filename;

    if (type === 'ideas') {
        title = `创意广场 - 全部创意 (${dateStr})`;
        filename = `all-ideas-${today}.html`;
    } else {
        title = `创意广场 - 全部需求 (${dateStr})`;
        filename = `all-demands-${today}.html`;
    }

    const items = data.slice(0, 50);
    items.sort((a, b) => (b.score || 0) - (a.score || 0));

    let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 { color: #333; margin-bottom: 20px; }
        .meta {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f8f8;
            font-weight: 600;
            color: #333;
        }
        tr:hover { background: #fafafa; }
        .score { font-weight: bold; }
        .recommendation {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
            margin-left: 8px;
        }
        .recommendation.high { background: #e6f4ea; color: #1e8e3e; }
        .recommendation.medium { background: #fef7e0; color: #f9ab00; }
        .recommendation.low { background: #fce8e6; color: #d93025; }
        .back {
            display: inline-block;
            margin-bottom: 20px;
            color: #666;
            text-decoration: none;
        }
        .back:hover { color: #333; }
    </style>
</head>
<body>
    <div class="container">
        <a href="index.html" class="back">← 返回广场中心</a>
        <h1>${title}</h1>
        <p class="meta">
            共 ${items.length} 个创意/需求 | 数据来源: Reddit | 评分标准: 创新性(0-10) + 市场规模(0-10) + 实现难度(0-10) + 竞品(0-10) + 变现潜力(0-10)
        </p>
        <table>
            <thead>
                <tr>
                    <th width="10%">排名</th>
                    <th width="35%">创意/需求</th>
                    <th width="15%">总分</th>
                    <th width="15%">推荐度</th>
                    <th width="25%">评分详情</th>
                </tr>
            </thead>
            <tbody>
`;

    items.forEach((item, index) => {
        const score = item.score || 0;
        const recClass = score >= 40 ? 'high' : score >= 35 ? 'medium' : 'low';
        const recText = score >= 40 ? '🔥强烈推荐' : score >= 35 ? '✅推荐' : '🤔考虑';

        html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <strong>${item.title}</strong>
                        <div style="margin-top: 4px;">
                            <a href="${item.url}" target="_blank" style="color: #666; font-size: 12px;">查看原帖 →</a>
                        </div>
                    </td>
                    <td class="score" style="font-size: 18px;">${score}</td>
                    <td><span class="recommendation ${recClass}">${recText}</span></td>
                    <td style="font-size: 12px;">
                        <div>💰 商业: ${item.business || 0}/10</div>
                        <div>🔧 技术: ${item.tech || 0}/10</div>
                        <div>👥 需求: ${item.demand || 0}/10</div>
                        <div>💡 创新: ${item.innovation || 0}/10</div>
                        <div>🏆 竞品: ${item.competition || 0}/10</div>
                    </td>
                </tr>
`;
    });

    html += `
            </tbody>
        </table>
        <p style="margin-top: 30px; color: #999; font-size: 12px;">
            * 评分基于关键词分析和热度指标 | 数据来源: Reddit 多个相关 subreddit
        </p>
    </div>
</body>
</html>`;

    return { html, filename };
}

function updateIndex(data) {
    const ideasCount = data.length;
    const demandsCount = data.length;
    const totalScore = data.reduce((sum, item) => sum + (item.score || 0), 0);
    const avgScore = data.length > 0 ? Math.round(totalScore / data.length) : 0;

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>创意广场 - 创意与需求收集站</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            line-height: 1.6;
            min-height: 100vh;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 40px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 24px;
            border-radius: 12px;
            text-align: center;
            transition: transform 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
        }
        .stat-number {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 8px;
        }
        .stat-label {
            color: #666;
            font-size: 14px;
        }
        .actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        .action-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            border-radius: 12px;
            color: white;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
        }
        .action-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .action-card h3 {
            font-size: 20px;
            margin-bottom: 8px;
        }
        .action-card p {
            font-size: 14px;
            opacity: 0.9;
        }
        .info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            font-size: 14px;
            color: #666;
        }
        .info strong {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 创意广场</h1>
        <p class="subtitle">每日精选 Reddit 创意与需求，智能评分分析</p>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${ideasCount}</div>
                <div class="stat-label">创意累计</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${demandsCount}</div>
                <div class="stat-label">需求累计</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.length}</div>
                <div class="stat-label">今日总数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${avgScore}</div>
                <div class="stat-label">平均分</div>
            </div>
        </div>

        <div class="actions">
            <a href="ideas.html" class="action-card">
                <h3>💡 今日创意</h3>
                <p>查看今日精选的 20 个 Reddit 创意</p>
            </a>
            <a href="demands.html" class="action-card">
                <h3>🎯 今日需求</h3>
                <p>查看今日收集的用户需求</p>
            </a>
        </div>

        <div class="info">
            <strong>📊 评分标准：</strong><br>
            创新性(0-10) + 市场规模(0-10) + 实现难度(0-10) + 竞品(0-10) + 变现潜力(0-10)<br>
            <strong>🔥 推荐度：</strong><br>
            🔥强烈推荐(40+) | ✅推荐(35+) | 🤔考虑(30+) | ⚠️需评估(<30)
        </div>
    </div>
</body>
</html>`;

    return html;
}

// Main execution
const args = process.argv.slice(2);
const collectedFile = args[0] || process.env.COLLECTED_FILE || 'data/reddit-ideas-2026-02-12.json';
const isDemands = args.includes('--demands');

try {
    // Read data from JSON file
    const data = JSON.parse(fs.readFileSync(collectedFile, 'utf8'));

    console.log('✅ 数据读取成功:', data.length, '条');

    // Generate pages
    const ideasResult = generateHTML(data, 'ideas');
    const allIdeasResult = generateAllHTML(data, 'ideas');

    const demandsResult = generateHTML(data, 'demands');
    const allDemandsResult = generateAllHTML(data, 'demands');

    const indexResult = updateIndex(data);

    // Write files
    const webDir = path.join(__dirname, 'web', 'data');

    fs.writeFileSync(path.join(webDir, ideasResult.filename), ideasResult.html);
    fs.writeFileSync(path.join(webDir, allIdeasResult.filename), allIdeasResult.html);
    fs.writeFileSync(path.join(webDir, demandsResult.filename), demandsResult.html);
    fs.writeFileSync(path.join(webDir, allDemandsResult.filename), allDemandsResult.html);
    fs.writeFileSync(path.join(webDir, 'index.html'), indexResult.html);

    console.log('✅ HTML 文件生成完成');
    console.log(`   - ${ideasResult.filename}`);
    console.log(`   - ${allIdeasResult.filename}`);
    console.log(`   - ${demandsResult.filename}`);
    console.log(`   - ${allDemandsResult.filename}`);
    console.log(`   - index.html`);
    console.log(`   - 今日创意: ${ideasResult.html.match(/<tr>/g).length} 个`);
    console.log(`   - 今日需求: ${demandsResult.html.match(/<tr>/g).length} 个`);

} catch (error) {
    console.error('❌ 生成失败:', error.message);
    process.exit(1);
}
