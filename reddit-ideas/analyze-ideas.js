#!/usr/bin/env node

/**
 * AI Analyzer for Reddit Ideas
 * 使用 AI 分析创意并评分
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

/**
 * 使用 Clawdbot 的 LLM 分析创意
 */
async function analyzeIdea(idea) {
  const prompt = `分析以下 Reddit 创意/需求，评估其作为网站产品的可行性：

标题: ${idea.title}
描述: ${idea.selftext || '无详细描述'}
来源: r/${idea.subreddit}
热度: ${idea.score} 分，${idea.num_comments} 评论

请从以下维度分析并打分（0-10分）：

1. **商业价值** (0-10): 市场需求、变现潜力
2. **技术难度** (0-10): 实现复杂度（分数越低越容易）
3. **市场竞争** (0-10): 竞争激烈程度（分数越低竞争越小）
4. **创新性** (0-10): 创意独特性
5. **用户需求** (0-10): 真实用户痛点

请以 JSON 格式返回：
{
  "scores": {
    "business_value": 数字,
    "technical_difficulty": 数字,
    "market_competition": 数字,
    "innovation": 数字,
    "user_demand": 数字
  },
  "total_score": 总分(0-50),
  "recommendation": "推荐度(强烈推荐/推荐/考虑/不推荐)",
  "product_concept": "产品概念(一句话)",
  "key_features": ["核心功能1", "核心功能2", "核心功能3"],
  "target_users": "目标用户群",
  "monetization": "变现方式建议",
  "risks": ["风险1", "风险2"],
  "summary": "简短分析总结(50字内)"
}

只返回 JSON，不要其他内容。`;

  try {
    // 使用 Clawdbot 的模型进行分析
    const { stdout } = await execAsync(
      `echo ${JSON.stringify(prompt)} | clawdbot chat --model openai/qwen3-max --json 2>/dev/null`,
      { maxBuffer: 1024 * 1024 }
    );
    
    const result = JSON.parse(stdout.trim());
    return result;
  } catch (error) {
    console.error(`分析失败: ${idea.title}`, error.message);
    // 返回默认评分
    return {
      scores: {
        business_value: 5,
        technical_difficulty: 5,
        market_competition: 5,
        innovation: 5,
        user_demand: 5
      },
      total_score: 25,
      recommendation: "需要进一步分析",
      product_concept: idea.title,
      key_features: ["待分析"],
      target_users: "待确定",
      monetization: "待评估",
      risks: ["分析失败"],
      summary: "AI 分析暂时不可用"
    };
  }
}

/**
 * 批量分析创意
 */
async function analyzeIdeas(ideas) {
  console.log(`🤖 开始 AI 分析 ${ideas.length} 个创意...\n`);
  
  const results = [];
  
  for (let i = 0; i < ideas.length; i++) {
    const idea = ideas[i];
    console.log(`[${i + 1}/${ideas.length}] 分析: ${idea.title.substring(0, 50)}...`);
    
    try {
      const analysis = await analyzeIdea(idea);
      results.push({
        ...idea,
        analysis
      });
      
      // 避免 API 限流
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ 分析失败:`, error.message);
      results.push({
        ...idea,
        analysis: null
      });
    }
  }
  
  console.log(`\n✅ 分析完成！`);
  return results;
}

/**
 * 生成 Markdown 报告
 */
function generateReport(analyzedIdeas) {
  const date = new Date().toISOString().split('T')[0];
  
  let report = `# 🚀 Reddit 创意广场 - ${date}\n\n`;
  report += `> 每日精选 ${analyzedIdeas.length} 个创意，AI 智能分析评分\n\n`;
  
  // 按总分排序
  const sorted = analyzedIdeas
    .filter(item => item.analysis)
    .sort((a, b) => (b.analysis.total_score || 0) - (a.analysis.total_score || 0));
  
  // 生成表格
  report += `## 📊 创意排行榜\n\n`;
  report += `| 排名 | 创意标题 | 总分 | 推荐度 | 商业 | 技术 | 竞争 | 创新 | 需求 | 来源 |\n`;
  report += `|------|---------|------|--------|------|------|------|------|------|------|\n`;
  
  sorted.forEach((item, index) => {
    const a = item.analysis;
    const scores = a.scores || {};
    report += `| ${index + 1} | [${item.title.substring(0, 40)}...](${item.url}) | `;
    report += `**${a.total_score || 0}** | ${a.recommendation || 'N/A'} | `;
    report += `${scores.business_value || 0} | ${scores.technical_difficulty || 0} | `;
    report += `${scores.market_competition || 0} | ${scores.innovation || 0} | `;
    report += `${scores.user_demand || 0} | r/${item.subreddit} |\n`;
  });
  
  // 详细分析
  report += `\n## 📝 详细分析\n\n`;
  
  sorted.slice(0, 10).forEach((item, index) => {
    const a = item.analysis;
    report += `### ${index + 1}. ${item.title}\n\n`;
    report += `**产品概念**: ${a.product_concept || 'N/A'}\n\n`;
    report += `**总分**: ${a.total_score}/50 | **推荐度**: ${a.recommendation}\n\n`;
    report += `**核心功能**:\n`;
    (a.key_features || []).forEach(f => report += `- ${f}\n`);
    report += `\n**目标用户**: ${a.target_users || 'N/A'}\n\n`;
    report += `**变现方式**: ${a.monetization || 'N/A'}\n\n`;
    report += `**风险提示**:\n`;
    (a.risks || []).forEach(r => report += `- ⚠️ ${r}\n`);
    report += `\n**分析总结**: ${a.summary || 'N/A'}\n\n`;
    report += `**原帖链接**: ${item.url}\n\n`;
    report += `---\n\n`;
  });
  
  return report;
}

// CLI 模式
if (require.main === module) {
  const inputFile = process.argv[2];
  
  if (!inputFile) {
    console.error('Usage: node analyze-ideas.js <input-json-file>');
    process.exit(1);
  }
  
  const ideas = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  analyzeIdeas(ideas)
    .then(results => {
      // 保存分析结果
      const timestamp = new Date().toISOString().split('T')[0];
      const outputFile = path.join(__dirname, 'data', `analyzed-${timestamp}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
      console.log(`\n💾 分析结果已保存: ${outputFile}`);
      
      // 生成报告
      const report = generateReport(results);
      const reportFile = path.join(__dirname, 'data', `report-${timestamp}.md`);
      fs.writeFileSync(reportFile, report);
      console.log(`📄 报告已生成: ${reportFile}`);
      
      return reportFile;
    })
    .catch(error => {
      console.error('❌ 分析失败:', error);
      process.exit(1);
    });
}

module.exports = { analyzeIdeas, generateReport };
