const fs = require('fs');
const path = require('path');

/**
 * 创意广场 HTML 生成器 - 完整版
 * 参考: idea-plaza.vercel.app
 */

function translateToSimpleChinese(text) {
  if (!text) return text;

  const translations = {
    'app': '应用',
    'idea': '创意',
    'software': '软件',
    'website': '网站',
    'tool': '工具',
    'platform': '平台',
    'service': '服务',
    'product': '产品',
    'startup': '创业',
    'business': '商业',
    'market': '市场',
    'user': '用户',
    'feature': '功能',
    'simple': '简单',
    'easy': '容易',
    'quick': '快速',
    'need': '需要',
    'want': '想要',
    'looking for': '寻找',
    'someone should make': '应该有人做',
    'wish there was': '希望有',
    'adhd': '注意力缺陷',
    'brain dump': '思维倾倒',
    'capture': '捕捉',
    'organize': '整理',
    'random': '随机',
    'thoughts': '想法',
    'tips': '建议',
    'coding': '编程',
    'mobile': '移动端',
    'android': '安卓',
    'golden': '黄金',
    'useful': '有用的',
    'million dollar': '百万美元',
    'validated': '验证过的',
    'engagement': '参与度',
    'downloads': '下载量',
    'dating': '约会',
    'competition': '竞争',
    'validate': '验证',
    'reminder': '提醒',
    'location': '位置',
    'based': '基于',
    'reminder app': '提醒应用',
    'location-based reminder': '基于位置的提醒',
    'spending': '消费',
    'friction': '摩擦',
    'behavioral': '行为',
    'spam': '垃圾邮件',
    'scam': '诈骗',
    'communication': '通讯',
    'inbound': '入站',
    'founder': '创始人',
    'solo developer': '独立开发者',
    'millionaire': '百万富翁',
    'notes': '笔记',
    'work': '工作',
    'name is': '名称是',
    'havel': 'havel',
    'notes that work': '有效笔记',
    'should exist': '应该存在',
    'wish existed': '希望存在',
    'make this': '做这个',
    'somebody make': '有人做',
    'make this app': '做这个应用',
    'make this idea': '做这个创意',
    'make this platform': '做这个平台',
    'make this service': '做这个服务',
    'make this tool': '做这个工具',
    'make this website': '做这个网站',
    'make this software': '做这个软件'
  };

  let translated = text;
  for (const [en, zh] of Object.entries(translations)) {
    const regex = new RegExp(en, 'gi');
    translated = translated.replace(regex, zh);
  }

  return translated;
}

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
    items = data.slice(0, 20);
  } else {
    title = `创意广场 - 今日需求 (${dateStr})`;
    filename = `demands-${today}.html`;
    items = data.slice(0, 20);
  }

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
        .tags {
            font-size: 11px;
            color: #666;
        }
        .tag {
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
            margin-right: 4px;
        }
        .deployment {
            font-size: 11px;
            color: #1e8e3e;
            margin-top: 4px;
        }
        .deployment-icon {
            margin-right: 2px;
        }
        .source {
            font-size: 11px;
            color: #666;
            margin-top: 4px;
        }
        .source a {
            color: #666;
        }
        .source a:hover {
            color: #1a73e8;
        }
        .target-users {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .business-model {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .reason {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .mvp {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .ratings {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .rating-item {
            margin-bottom: 2px;
        }
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
        const directDeployIcon = item.directDeploy ? '⚡' : '';

        html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <strong>${translateToSimpleChinese(item.title)}</strong>
                        <div style="margin-top: 4px;">
                            <a href="${item.url}" target="_blank" style="color: #666; font-size: 12px;">查看原帖 →</a>
                        </div>
                        <div class="tags">
                            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            ${directDeployIcon ? `<span class="tag" style="background: #e6f4ea; color: #1e8e3e;">⚡可直接部署</span>` : ''}
                        </div>
                        <div class="deployment">${item.deployment || ''}</div>
                        <div class="target-users">👥 ${item.targetUsers || '相关用户'}</div>
                        <div class="business-model">💰 ${item.businessModel || '免费+订阅制'}</div>
                        <div class="reason">✅ ${item.reason || '市场需求明确'}</div>
                        <div class="mvp">🛠️ ${item.mvp || '核心功能→基础UI→测试 | 2-3周'}</div>
                        <div class="source">🌐 来源: ${item.source || 'Reddit'}</div>
                    </td>
                    <td class="score" style="font-size: 18px;">${score}</td>
                    <td><span class="recommendation ${recClass}">${recText}</span></td>
                    <td style="font-size: 12px;">
                        <div class="rating-item">💰 商业: ${item.ratings?.marketDemand || 0}/10</div>
                        <div class="rating-item">🔧 技术: ${item.ratings?.technicalFeasibility || 0}/10</div>
                        <div class="rating-item">👥 需求: ${item.ratings?.monetization || 0}/10</div>
                        <div class="rating-item">💡 创新: ${item.ratings?.competitiveAdvantage || 0}/10</div>
                        <div class="rating-item">🏆 竞品: ${item.ratings?.growthPotential || 0}/10</div>
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
        .tags {
            font-size: 11px;
            color: #666;
        }
        .tag {
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
            margin-right: 4px;
        }
        .deployment {
            font-size: 11px;
            color: #1e8e3e;
            margin-top: 4px;
        }
        .source {
            font-size: 11px;
            color: #666;
            margin-top: 4px;
        }
        .source a {
            color: #666;
        }
        .source a:hover {
            color: #1a73e8;
        }
        .target-users {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .business-model {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .reason {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .mvp {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .ratings {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .rating-item {
            margin-bottom: 2px;
        }
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
        const directDeployIcon = item.directDeploy ? '⚡' : '';

        html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <strong>${translateToSimpleChinese(item.title)}</strong>
                        <div style="margin-top: 4px;">
                            <a href="${item.url}" target="_blank" style="color: #666; font-size: 12px;">查看原帖 →</a>
                        </div>
                        <div class="tags">
                            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            ${directDeployIcon ? `<span class="tag" style="background: #e6f4ea; color: #1e8e3e;">⚡可直接部署</span>` : ''}
                        </div>
                        <div class="deployment">${item.deployment || ''}</div>
                        <div class="target-users">👥 ${item.targetUsers || '相关用户'}</div>
                        <div class="business-model">💰 ${item.businessModel || '免费+订阅制'}</div>
                        <div class="reason">✅ ${item.reason || '市场需求明确'}</div>
                        <div class="mvp">🛠️ ${item.mvp || '核心功能→基础UI→测试 | 2-3周'}</div>
                        <div class="source">🌐 来源: ${item.source || 'Reddit'}</div>
                    </td>
                    <td class="score" style="font-size: 18px;">${score}</td>
                    <td><span class="recommendation ${recClass}">${recText}</span></td>
                    <td style="font-size: 12px;">
                        <div class="rating-item">💰 商业: ${item.ratings?.marketDemand || 0}/10</div>
                        <div class="rating-item">🔧 技术: ${item.ratings?.technicalFeasibility || 0}/10</div>
                        <div class="rating-item">👥 需求: ${item.ratings?.monetization || 0}/10</div>
                        <div class="rating-item">💡 创新: ${item.ratings?.competitiveAdvantage || 0}/10</div>
                        <div class="rating-item">🏆 竞品: ${item.ratings?.growthPotential || 0}/10</div>
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
        }
        .stat-number {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 8px;
        }
        .stat-label {
            font-size: 14px;
            color: #666;
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
        }
        .action-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .action-card h3 {
            font-size: 24px;
            margin-bottom: 10px;
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
            line-height: 1.8;
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

    return { html, filename: 'index.html' };
}

// Main execution
const args = process.argv.slice(2);
const collectedFile = args[0] || process.env.COLLECTED_FILE || 'data/reddit-ideas-2026-02-13-complete.json';
const isDemands = args.includes('--demands');

try {
    const data = JSON.parse(fs.readFileSync(collectedFile, 'utf8'));

    console.log('✅ 数据读取成功:', data.length, '条');

    // Generate pages
    const ideasResult = generateHTML(data, 'ideas');
    const allIdeasResult = generateAllHTML(data, 'ideas');

    const demandsResult = generateHTML(data, 'demands');
    const allDemandsResult = generateAllHTML(data, 'demands');

    const indexResult = updateIndex(data);

    // Write files
    const webDir = path.join(__dirname, 'data');

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
