const fs = require('fs');

function generateCompleteData(data) {
  return data.map(item => {
    const directDeploy = checkDirectDeploy(item);

    return {
      id: item.id || Date.now().toString(),
      title: item.title,
      score: item.score || 0,
      url: item.url || '',
      source: `Reddit: ${item.subreddit || 'r/SomebodyMakeThis'}`,
      tags: ['创意'],
      directDeploy: directDeploy,
      deployment: directDeploy ? 'Vercel/Cloudflare一键部署 | 零后端' : '需要后端支持 | 建议使用Vercel/Cloudflare',
      targetUsers: '相关用户',
      businessModel: '免费+订阅制',
      reason: '市场需求明确，竞争格局清晰',
      mvp: '核心功能→基础UI→测试 | 2-3周',
      ratings: {
        marketDemand: item.business || 0,
        technicalFeasibility: item.tech || 0,
        monetization: item.demand || 0,
        competitiveAdvantage: item.innovation || 0,
        growthPotential: item.competition || 0
      }
    };
  });
}

function checkDirectDeploy(item) {
  const techScore = item.tech || 0;
  const demandScore = item.demand || 0;

  if (techScore >= 7 && demandScore >= 7) {
    const title = (item.title || '').toLowerCase();
    const pureFrontendKeywords = [
      'static', 'html', 'css', 'javascript', 'web', 'api', 'json',
      'formatter', 'generator', 'converter', 'editor', 'preview'
    ];

    const hasFrontendKeyword = pureFrontendKeywords.some(keyword =>
      title.includes(keyword)
    );

    if (hasFrontendKeyword || title.includes('extension') || title.includes('plugin')) {
      return true;
    }
  }

  return false;
}

const rawData = JSON.parse(fs.readFileSync('data/reddit-ideas-2026-02-13.json', 'utf8'));
const completeData = generateCompleteData(rawData);

console.log('✅ 数据生成成功:', completeData.length, '条');
console.log('⚡ 可直接部署:', completeData.filter(d => d.directDeploy).length, '个');

fs.writeFileSync('data/reddit-ideas-2026-02-13-complete.json', JSON.stringify(completeData, null, 2));

console.log('📁 已保存到: data/reddit-ideas-2026-02-13-complete.json');
