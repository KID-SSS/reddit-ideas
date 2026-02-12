#!/usr/bin/env node

/**
 * 简化版 AI 分析器
 * 直接生成报告，不需要复杂的 AI 调用
 */

const fs = require('fs');
const path = require('path');

/**
 * 简单评分算法（基于标题和描述关键词）
 */
function quickScore(idea) {
  const text = (idea.title + ' ' + idea.snippet).toLowerCase();
  
  // 商业价值关键词
  const businessKeywords = ['monetize', 'revenue', 'business', 'market', 'sell', 'profit', 'startup'];
  const businessScore = businessKeywords.filter(k => text.includes(k)).length + 5;
  
  // 技术难度（简单 = 高分）
  const simpleKeywords = ['simple', 'basic', 'easy', 'quick', 'minimal'];
  const complexKeywords = ['ai', 'ml', 'blockchain', 'complex', 'advanced'];
  const techScore = 8 - complexKeywords.filter(k => text.includes(k)).length + 
                    simpleKeywords.filter(k => text.includes(k)).length;
  
  // 用户需求
  const demandKeywords = ['need', 'want', 'wish', 'looking for', 'should exist', 'missing'];
  const demandScore = demandKeywords.filter(k => text.includes(k)).length + 6;
  
  // 创新性
  const innovationKeywords = ['new', 'innovative', 'unique', 'novel', 'different'];
  const innovationScore = innovationKeywords.filter(k => text.includes(k)).length + 5;
  
  // 市场竞争（低竞争 = 高分）
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

/**
 * 生成推荐度
 */
function getRecommendation(totalScore) {
  if (totalScore >= 40) return '🔥 强烈推荐';
  if (totalScore >= 35) return '✅ 推荐';
  if (totalScore >= 30) return '🤔 考虑';
  return '⚠️ 需评估';
}

/**
 * 生成产品概念
 */
function generateConcept(idea) {
  const title = idea.title.replace(/\[.*?\]/g, '').trim();
  return title.length > 80 ? title.substring(0, 77) + '...' : title;
}

/**
 * 简单翻译函数（关键词替换）
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
    'ADHD': '注意力缺陷',
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
    'downloads': '下载量'
  };
  
  let translated = text;
  for (const [en, zh] of Object.entries(translations)) {
    const regex = new RegExp(en, 'gi');
    translated = translated.replace(regex, zh);
  }
  
  return translated;
}

/**
 * 生成 Markdown 报告
 */
function generateReport(ideas) {
  const date = new Date().toISOString().split('T')[0];
  
  // 为每个创意评分并翻译
  const analyzed = ideas.map(idea => ({
    ...idea,
    scores: quickScore(idea),
    concept: translateToSimpleChinese(generateConcept(idea)),
    translatedSnippet: translateToSimpleChinese(idea.snippet)
  }));
  
  // 按总分排序
  const sorted = analyzed.sort((a, b) => b.scores.total - a.scores.total);
  
  let report = `# 🚀 Reddit 创意广场 - ${date}\n\n`;
  report += `> 每日精选 ${sorted.length} 个创意，智能评分分析\n\n`;
  
  // 生成表格
  report += `## 📊 创意排行榜\n\n`;
  report += `| 排名 | 创意标题 | 总分 | 推荐 | 商业 | 技术 | 需求 | 创新 | 竞争 | 来源 |\n`;
  report += `|:----:|---------|:----:|:----:|:----:|:----:|:----:|:----:|:----:|------|\n`;
  
  sorted.forEach((item, index) => {
    const s = item.scores;
    const title = item.concept.substring(0, 35);
    report += `| ${index + 1} | [${title}](${item.url}) | `;
    report += `**${s.total}** | ${getRecommendation(s.total)} | `;
    report += `${s.business_value} | ${s.technical_difficulty} | `;
    report += `${s.user_demand} | ${s.innovation} | `;
    report += `${s.market_competition} | r/${item.subreddit} |\n`;
  });
  
  // 详细分析 Top 5
  report += `\n## 📝 Top 5 详细分析\n\n`;
  
  sorted.slice(0, 5).forEach((item, index) => {
    report += `### ${index + 1}. ${item.concept}\n\n`;
    report += `**总分**: ${item.scores.total}/50 | **推荐度**: ${getRecommendation(item.scores.total)}\n\n`;
    report += `**评分明细**:\n`;
    report += `- 💰 商业价值: ${item.scores.business_value}/10\n`;
    report += `- 🔧 技术难度: ${item.scores.technical_difficulty}/10 (分数越高越简单)\n`;
    report += `- 👥 用户需求: ${item.scores.user_demand}/10\n`;
    report += `- 💡 创新性: ${item.scores.innovation}/10\n`;
    report += `- 🏆 市场竞争: ${item.scores.market_competition}/10 (分数越高竞争越小)\n\n`;
    report += `**简介**: ${item.translatedSnippet}\n\n`;
    report += `**原帖**: ${item.url}\n\n`;
    report += `---\n\n`;
  });
  
  report += `\n## 📌 说明\n\n`;
  report += `- 评分基于关键词分析和热度指标\n`;
  report += `- 总分范围: 0-50 分\n`;
  report += `- 推荐度: 🔥强烈推荐(40+) | ✅推荐(35+) | 🤔考虑(30+) | ⚠️需评估(<30)\n`;
  report += `- 数据来源: Reddit 多个创意相关 subreddit\n\n`;
  
  return report;
}

// CLI 模式
if (require.main === module) {
  const inputFile = process.argv[2];
  
  if (!inputFile) {
    console.error('Usage: node simple-analyze.js <input-json-file>');
    process.exit(1);
  }
  
  console.log('📊 开始分析创意...\n');
  
  const ideas = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const report = generateReport(ideas);
  
  // 保存报告
  const timestamp = new Date().toISOString().split('T')[0];
  const reportFile = path.join(path.dirname(inputFile), `report-${timestamp}.md`);
  fs.writeFileSync(reportFile, report);
  
  console.log(`✅ 报告已生成: ${reportFile}\n`);
  console.log(report);
}

module.exports = { generateReport };
