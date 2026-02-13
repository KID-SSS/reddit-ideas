#!/usr/bin/env node

/**
 * 完整版 AI 分析器
 * 包含：目标用户、商业模式、MVP、部署方案、成本分析等
 */

const fs = require('fs');
const path = require('path');

/**
 * 完整评分和分析算法
 */
function completeAnalyze(idea) {
  const text = (idea.title + ' ' + idea.snippet).toLowerCase();

  // === 维度1: 目标用户 ===
  const userKeywords = {
    general: ['everyone', 'anyone', 'all users', 'general', 'everyone needs'],
    young: ['teen', 'youth', 'college', 'student', 'young adult', 'millennial', 'gen z'],
    professional: ['professional', 'business', 'work', 'employee', 'boss', 'manager'],
    specific: ['women', 'men', 'parents', 'senior', 'elderly', 'students', 'gamers'],
    niche: ['adhd', 'autism', 'fitness', 'cooking', 'travel', 'finance', 'dating', 'fitness']
  };

  const userAnalysis = analyzeUsers(text, userKeywords);

  // === 维度2: 商业模式 ===
  const businessAnalysis = analyzeBusiness(text);

  // === 维度3: MVP 功能 ===
  const mvpAnalysis = analyzeMVP(text, userAnalysis);

  // === 维度4: 技术实现难度 ===
  const techAnalysis = analyzeTech(text);

  // === 维度5: 部署方案 ===
  const deploymentAnalysis = analyzeDeployment(text, mvpAnalysis);

  // === 维度6: 成本分析 ===
  const costAnalysis = analyzeCost(mvpAnalysis, techAnalysis);

  // === 维度7: 竞品分析 ===
  const competitionAnalysis = analyzeCompetition(text);

  // === 维度8: 市场规模 ===
  const marketAnalysis = analyzeMarket(text, userAnalysis);

  // === 综合评分 ===
  const totalScore = calculateTotalScore({
    userAnalysis,
    businessAnalysis,
    mvpAnalysis,
    techAnalysis,
    deploymentAnalysis,
    costAnalysis,
    competitionAnalysis,
    marketAnalysis
  });

  return {
    // 评分
    total: totalScore,
    user_demand: userAnalysis.score,
    business_value: businessAnalysis.score,
    technical_difficulty: techAnalysis.difficultyScore,
    innovation: mvpAnalysis.innovationScore,
    market_competition: competitionAnalysis.score,
    profitability: businessAnalysis.profitabilityScore,

    // 详细分析
    target_users: userAnalysis.users,
    business_model: businessAnalysis.model,
    mvp_features: mvpAnalysis.features,
    deployment_plan: deploymentAnalysis.plan,
    cost_analysis: costAnalysis,
    competition: competitionAnalysis.competitors,
    market_size: marketAnalysis.size,
    monetization: businessAnalysis.monetization
  };
}

/**
 * 分析目标用户
 */
function analyzeUsers(text, userKeywords) {
  let users = [];
  let score = 5; // 基础分

  // 检测用户类型
  if (userKeywords.general.some(k => text.includes(k))) {
    users.push('普通大众');
    score += 2;
  }

  if (userKeywords.young.some(k => text.includes(k))) {
    users.push('年轻人');
    score += 1;
  }

  if (userKeywords.professional.some(k => text.includes(k))) {
    users.push('专业人士');
    score += 1;
  }

  if (userKeywords.specific.some(k => text.includes(k))) {
    users.push(...userKeywords.specific.filter(k => text.includes(k)));
    score += 2;
  }

  if (userKeywords.niche.some(k => text.includes(k))) {
    users.push(...userKeywords.niche.filter(k => text.includes(k)));
    score += 1;
  }

  return { users, score };
}

/**
 * 分析商业模式
 */
function analyzeBusiness(text) {
  const modelKeywords = {
    subscription: ['subscription', 'monthly fee', 'paid', 'premium', 'freemium', 'membership'],
    advertising: ['advertising', 'ads', 'monetize', 'ad revenue', 'sponsor'],
    transaction: ['transaction', 'fee', 'commission', 'marketplace', 'sell'],
    product: ['product', 'sell', 'ecommerce', 'shop', 'store'],
    service: ['service', 'consulting', 'agency', 'help'],
    data: ['data', 'analytics', 'insights', 'report']
  };

  const foundModels = [];
  let profitability = 5;
  let monetization = [];

  for (const [type, keywords] of Object.entries(modelKeywords)) {
    if (keywords.some(k => text.includes(k))) {
      foundModels.push(type);
    }
  }

  // 评分
  if (foundModels.length >= 2) {
    profitability = 8;
    monetization = foundModels;
  } else if (foundModels.length === 1) {
    profitability = 6;
    monetization = foundModels;
  } else {
    profitability = 3;
    monetization = ['广告/免费增值'];
  }

  return {
    model: foundModels.length > 0 ? foundModels.join(', ') : '待确定',
    profitability,
    monetization
  };
}

/**
 * analyze MVP
 */
function analyzeMVP(text, userAnalysis) {
  const features = [];
  let innovationScore = 5;

  // 基础功能
  const basicFeatures = [
    { keyword: 'capture', feature: '内容捕捉' },
    { keyword: 'organize', feature: '内容整理' },
    { keyword: 'share', feature: '分享功能' },
    { keyword: 'notify', feature: '通知提醒' },
    { keyword: 'search', feature: '搜索功能' },
    { keyword: 'profile', feature: '个人资料' },
    { keyword: 'login', feature: '用户登录' }
  ];

  basicFeatures.forEach(({ keyword, feature }) => {
    if (text.includes(keyword)) {
      features.push(feature);
    }
  });

  // 创新性检测
  const innovationKeywords = ['unique', 'innovative', 'novel', 'different', 'new', 'first'];
  const innovationCount = innovationKeywords.filter(k => text.includes(k)).length;
  innovationScore = 5 + innovationCount * 2;

  // 根据用户类型建议MVP
  const mvpSuggestions = {
    'adhd': ['思维倾倒', '分类标签', '提醒功能', '简洁界面'],
    'dating': ['资料展示', '匹配算法', '即时通讯', '兴趣标签'],
    'fitness': ['运动追踪', '数据记录', '目标设置', '社交挑战'],
    'finance': ['记账功能', '分析图表', '预算设置', '提醒功能']
  };

  return {
    features,
    innovationScore: Math.min(innovationScore, 10),
    suggestion: mvpSuggestions[userAnalysis.users[0]?.toLowerCase()] || ['基础功能', '用户管理', '核心流程']
  };
}

/**
 * analyze technical difficulty
 */
function analyzeTech(text) {
  const simpleKeywords = ['simple', 'basic', 'easy', 'quick', 'minimal', 'no-code', 'low-code'];
  const complexKeywords = ['ai', 'ml', 'machine learning', 'blockchain', 'crypto', 'api integration', 'backend', 'database', 'real-time', 'live'];

  const simpleCount = simpleKeywords.filter(k => text.includes(k)).length;
  const complexCount = complexKeywords.filter(k => text.includes(k)).length;

  // 难度评分：简单 = 高分
  const difficultyScore = 10 - complexCount + simpleCount;
  const difficultyLevel = difficultyScore >= 8 ? '简单' : difficultyScore >= 6 ? '中等' : '复杂';

  return {
    difficultyScore,
    difficultyLevel,
    techStack: difficultyScore >= 8 ? ['React/Vue', 'Supabase', 'Vercel'] :
                difficultyScore >= 6 ? ['Next.js', 'Firebase', 'Vercel'] :
                ['Node.js', 'PostgreSQL', 'AWS']
  };
}

/**
 * analyze deployment
 */
function analyzeDeployment(text, mvpAnalysis) {
  const deploymentKeywords = {
    web: ['web', 'website', 'browser', 'online', 'cloud'],
    mobile: ['mobile', 'app', 'ios', 'android', 'native'],
    hybrid: ['hybrid', 'cross-platform', 'flutter', 'react native', 'capacitor'],
    ai: ['ai', 'api', 'backend', 'server', 'database']
  };

  let plan = [];
  let deploymentType = 'web';

  if (deploymentKeywords.web.some(k => text.includes(k))) {
    plan.push('Vercel/Netlify部署');
    deploymentType = 'web';
  }

  if (deploymentKeywords.mobile.some(k => text.includes(k))) {
    plan.push('App Store/Google Play');
    deploymentType = 'mobile';
  }

  if (deploymentKeywords.hybrid.some(k => text.includes(k))) {
    plan.push('跨平台打包');
    deploymentType = 'mobile';
  }

  // MVP部署建议
  if (deploymentType === 'web') {
    plan.push('Vercel + Stripe');
  } else {
    plan.push('React Native + Firebase');
  }

  return {
    plan,
    type: deploymentType,
    estimatedTime: deploymentType === 'web' ? '1-2周' : '4-6周'
  };
}

/**
 * analyze cost
 */
function analyzeCost(mvpAnalysis, techAnalysis) {
  const baseCost = 1000; // 基础成本

  // MVP功能成本
  let featureCost = 0;
  if (mvpAnalysis.features.includes('即时通讯')) featureCost += 2000;
  if (mvpAnalysis.features.includes('匹配算法')) featureCost += 5000;
  if (mvpAnalysis.features.includes('实时数据')) featureCost += 3000;

  // 技术难度成本
  const techCost = techAnalysis.difficultyScore >= 8 ? 0 :
                   techAnalysis.difficultyScore >= 6 ? 2000 : 5000;

  const totalCost = baseCost + featureCost + techCost;
  const monthlyCost = totalCost * 0.1; // 10% 月度运营成本

  return {
    mvp: totalCost,
    monthly: Math.round(monthlyCost),
    breakdown: {
      dev: techCost,
      features: featureCost,
      hosting: 500
    }
  };
}

/**
 * analyze competition
 */
function analyzeCompetition(text) {
  const existingKeywords = ['existing', 'compete', 'market', 'similar', 'already', 'competing', 'rival'];

  const hasCompetition = existingKeywords.some(k => text.includes(k));

  return {
    hasCompetition,
    competitors: hasCompetition ? ['有竞品，需差异化'] : ['市场空白'],
    score: hasCompetition ? 5 : 8
  };
}

/**
 * analyze market size
 */
function analyzeMarket(text, userAnalysis) {
  const marketKeywords = {
    global: ['global', 'world', 'international'],
    large: ['large', 'huge', 'massive', 'big'],
    specific: ['local', 'niche', 'specialized', 'specific']
  };

  let size = '小众市场';
  let score = 5;

  if (userAnalysis.users.includes('普通大众') || userAnalysis.users.includes('年轻人')) {
    size = '大众市场';
    score = 9;
  } else if (userAnalysis.users.some(u => ['专业人士', 'business', 'work'].some(k => u.includes(k)))) {
    size = '专业市场';
    score = 7;
  } else {
    size = '垂直市场';
    score = 6;
  }

  return { size, score };
}

/**
 * calculate total score
 */
function calculateTotalScore(analysis) {
  const weights = {
    user_demand: 0.20,
    business_value: 0.20,
    technical_difficulty: 0.15,
    innovation: 0.15,
    market_competition: 0.10,
    profitability: 0.10,
    market_size: 0.10
  };

  const total = (
    analysis.user_demand * weights.user_demand +
    analysis.business_value * weights.business_value +
    (10 - analysis.technical_difficulty) * weights.technical_difficulty + // 技术难度越高越好
    analysis.innovation * weights.innovation +
    analysis.market_competition * weights.market_competition +
    analysis.profitability * weights.profitability +
    analysis.market_size * weights.market_size
  ) * 10;

  return Math.min(Math.round(total) || 0, 100);
}

/**
 * generate recommendation
 */
function getRecommendation(totalScore) {
  if (totalScore >= 70) return '🔥 强烈推荐';
  if (totalScore >= 60) return '✅ 推荐';
  if (totalScore >= 50) return '🤔 考虑';
  return '⚠️ 需评估';
}

/**
 * generate markdown report
 */
function generateReport(ideas) {
  const date = new Date().toISOString().split('T')[0];

  // 分析所有创意
  const analyzed = ideas.map(idea => ({
    ...idea,
    analysis: completeAnalyze(idea)
  }));

  // 排序
  const sorted = analyzed.sort((a, b) => b.analysis.total - a.analysis.total);

  let report = `# 🚀 Reddit 创意广场 - ${date}\n\n`;
  report += `> 每日精选 ${sorted.length} 个创意，深度分析\n\n`;

  // 表格
  report += `## 📊 创意排行榜\n\n`;
  report += `| 排名 | 创意标题 | 总分 | 推荐 | 目标用户 | 商业模式 | 技术难度 | 竞争 | 市场规模 |\n`;
  report += `|:----:|---------|:----:|:----:|---------|---------|:----:|:----:|:----:|\n`;

  sorted.forEach((item, index) => {
    const a = item.analysis;
    const title = item.title.replace(/\[.*?\]/g, '').trim().substring(0, 35);
    report += `| ${index + 1} | [${title}](${item.url}) | `;
    report += `**${a.total}** | ${getRecommendation(a.total)} | `;
    report += `${a.target_users.join(', ')} | ${a.business_model} | `;
    report += `${a.technical_difficulty} | ${a.market_competition} | ${a.market_size} |\n`;
  });

  // 详细分析 Top 5
  report += `\n## 📝 Top 5 详细分析\n\n`;

  sorted.slice(0, 5).forEach((item, index) => {
    const a = item.analysis;
    const title = item.title.replace(/\[.*?\]/g, '').trim();

    report += `### ${index + 1}. ${title}\n\n`;
    report += `**总分**: ${a.total}/100 | **推荐度**: ${getRecommendation(a.total)}\n\n`;

    // 评分详情
    report += `#### 🎯 目标用户\n`;
    report += `${a.target_users.join(' · ')}\n\n`;

    report += `#### 💰 商业模式\n`;
    report += `模式: ${a.business_model} | 利润潜力: ${a.profitability}/10 | 变现方式: ${a.monetization.join(', ')}\n\n`;

    report += `#### 🔧 技术实现\n`;
    report += `难度: ${a.technical_difficulty}/10 (${a.techStack?.join(', ') || '待确定'})\n\n`;

    report += `#### 📱 MVP建议\n`;
    report += `核心功能: ${a.mvp_features?.join(', ') || '待确定'}\n`;
    report += `创新性: ${a.innovationScore}/10\n`;
    report += `MVP功能: ${a.suggestion?.join(', ') || '待确定'}\n\n`;

    report += `#### 🚀 部署方案\n`;
    report += `部署方式: ${a.deployment?.plan?.join(', ') || '待确定'}\n`;
    report += `预计时间: ${a.deployment?.estimatedTime || '待确定'}\n\n`;

    report += `#### 💵 成本分析\n`;
    report += `MVP开发成本: $${a.cost_analysis.mvp.toLocaleString()}\n`;
    report += `月度运营成本: $${a.cost_analysis.monthly.toLocaleString()}\n`;
    report += `- 开发: $${a.cost_analysis.breakdown.dev.toLocaleString()}\n`;
    report += `- 功能: $${a.cost_analysis.breakdown.features.toLocaleString()}\n`;
    report += `- 托管: $${a.cost_analysis.breakdown.hosting.toLocaleString()}\n\n`;

    report += `#### 🏆 竞争与市场\n`;
    report += `竞争情况: ${a.competition}\n`;
    report += `市场规模: ${a.market_size}\n\n`;

    report += `**原帖**: ${item.url}\n\n`;
    report += `---\n\n`;
  });

  // 总结
  report += `## 📌 分析说明\n\n`;
  report += `- 总分范围: 0-100 分\n`;
  report += `- 推荐度: 🔥强烈推荐(70+) | ✅推荐(60+) | 🤔考虑(50+) | ⚠️需评估(<50)\n`;
  report += `- 数据来源: Reddit 多个创意相关 subreddit\n\n`;

  return report;
}

// CLI 模式
if (require.main === module) {
  const inputFile = process.argv[2];

  if (!inputFile) {
    console.error('Usage: node complete-analyze.js <input-json-file>');
    process.exit(1);
  }

  console.log('📊 开始深度分析创意...\n');

  const ideas = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const report = generateReport(ideas);

  // 保存报告
  const timestamp = new Date().toISOString().split('T')[0];
  const reportFile = path.join(path.dirname(inputFile), `report-${timestamp}.md`);
  fs.writeFileSync(reportFile, report);

  console.log(`✅ 深度报告已生成: ${reportFile}\n`);
  console.log(report);
}

module.exports = { generateReport };
