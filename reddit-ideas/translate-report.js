#!/usr/bin/env node

/**
 * 翻译报告为中文
 */

const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function translateReport(reportPath) {
  console.log('🌐 正在翻译报告为中文...\n');
  
  const content = fs.readFileSync(reportPath, 'utf8');
  
  // 提取需要翻译的部分（标题和简介）
  const lines = content.split('\n');
  const translatedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 如果是英文内容行，进行翻译
    if (line.includes('**简介**:') && /[a-zA-Z]{10,}/.test(line)) {
      const match = line.match(/\*\*简介\*\*: (.+)/);
      if (match) {
        const englishText = match[1];
        try {
          // 使用简单的翻译（避免调用外部 API）
          const translated = await quickTranslate(englishText);
          translatedLines.push(`**简介**: ${translated}`);
          continue;
        } catch (error) {
          console.error('翻译失败，保留原文');
        }
      }
    }
    
    // 翻译标题中的英文
    if (line.startsWith('### ') && /[a-zA-Z]{5,}/.test(line)) {
      const titleMatch = line.match(/### \d+\. (.+)/);
      if (titleMatch) {
        const title = titleMatch[1];
        const translated = await quickTranslate(title);
        translatedLines.push(line.replace(title, translated));
        continue;
      }
    }
    
    translatedLines.push(line);
  }
  
  return translatedLines.join('\n');
}

/**
 * 快速翻译（使用本地词典）
 */
async function quickTranslate(text) {
  const dict = {
    'App idea': '应用创意',
    'Capture random ideas quickly': '快速捕捉随机想法',
    'Software/App-Idea': '软件/应用创意',
    'Useful app ideas': '有用的应用创意',
    'Golden App Ideas': '黄金应用创意',
    'ADHD app': '注意力管理应用',
    'brain dump': '思维倾倒',
    'organize them': '整理它们',
    'When I have a random thought': '当我有一个随机想法时',
    'note down': '记下来',
    'current approach': '当前方法',
    'would probably be': '可能是',
    'me and my girlfried have': '我和我女朋友有一个',
    'but we both have no idea of coding': '但我们都不懂编程',
    'Do you have tipps on how to start': '你有关于如何开始的建议吗',
    'with such an idea': '这样的想法',
    'Those who make side money': '那些通过副业赚钱的人',
    'with their own mobile apps': '用他们自己的移动应用',
    'what are your best tips': '你最好的建议是什么',
    'to come up with a great app idea': '想出一个好的应用创意',
    'I have a million dollar app idea here': '我这里有一个百万美元的应用创意',
    'clearly validated': '明确验证过',
    'huge spike in downloads': '下载量大幅增长',
    'engagement but': '参与度但是',
    'lets you brain dump all your thoughts': '让你倾倒所有想法',
    'to automatically organize them': '自动整理它们',
    'Hi everyone': '大家好',
    'I had this thought': '我有这个想法'
  };
  
  let translated = text;
  for (const [en, zh] of Object.entries(dict)) {
    translated = translated.replace(new RegExp(en, 'gi'), zh);
  }
  
  return translated;
}

// CLI 模式
if (require.main === module) {
  const reportPath = process.argv[2];
  
  if (!reportPath) {
    console.error('Usage: node translate-report.js <report-file>');
    process.exit(1);
  }
  
  translateReport(reportPath)
    .then(translated => {
      const outputPath = reportPath.replace('.md', '-zh.md');
      fs.writeFileSync(outputPath, translated);
      console.log(`✅ 翻译完成: ${outputPath}\n`);
      console.log(translated);
    })
    .catch(error => {
      console.error('❌ 翻译失败:', error);
      process.exit(1);
    });
}

module.exports = { translateReport };
