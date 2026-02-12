#!/usr/bin/env node

/**
 * Reddit Ideas Collector (使用 Serper 搜索)
 * 通过 Google 搜索 Reddit 内容来收集创意
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SERPER_API_KEY = 'f94aa43a02ef40e2fb90120e27207a04f15042ef';

// 搜索查询列表
const SEARCH_QUERIES = [
  'site:reddit.com/r/SomebodyMakeThis "app idea"',
  'site:reddit.com/r/AppIdeas',
  'site:reddit.com/r/Entrepreneur "startup idea"',
  'site:reddit.com/r/SideProject "looking for"',
  'site:reddit.com "need an app for"',
  'site:reddit.com "someone should make"',
  'site:reddit.com "wish there was an app"',
  'site:reddit.com/r/indiehackers "project idea"'
];

/**
 * 使用 Serper 搜索
 */
async function serperSearch(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ q: query, num: 10 });
    
    const options = {
      hostname: 'google.serper.dev',
      path: '/search',
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * 从搜索结果提取 Reddit 帖子信息
 */
function extractRedditPosts(searchResults) {
  if (!searchResults.organic) return [];
  
  return searchResults.organic
    .filter(item => item.link.includes('reddit.com/r/'))
    .map(item => {
      const match = item.link.match(/reddit\.com\/r\/(\w+)\/comments\/(\w+)\//);
      const subreddit = match ? match[1] : 'unknown';
      
      return {
        title: item.title,
        snippet: item.snippet || '',
        url: item.link,
        subreddit: subreddit,
        position: item.position,
        date: item.date || 'unknown'
      };
    });
}

/**
 * 收集创意
 */
async function collectIdeas(targetCount = 20) {
  console.log(`🔍 开始通过 Serper 收集 Reddit 创意，目标: ${targetCount} 个...\n`);
  
  const allPosts = [];
  
  for (const query of SEARCH_QUERIES) {
    try {
      console.log(`📡 搜索: ${query.substring(0, 50)}...`);
      const results = await serperSearch(query);
      const posts = extractRedditPosts(results);
      allPosts.push(...posts);
      
      console.log(`   ✅ 找到 ${posts.length} 个帖子`);
      
      // 避免 API 限流
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (allPosts.length >= targetCount) break;
    } catch (error) {
      console.error(`❌ 搜索失败:`, error.message);
    }
  }
  
  // 去重并限制数量
  const uniquePosts = Array.from(
    new Map(allPosts.map(post => [post.url, post])).values()
  ).slice(0, targetCount);
  
  console.log(`\n✅ 成功收集 ${uniquePosts.length} 个创意\n`);
  
  return uniquePosts;
}

/**
 * 保存数据
 */
function saveData(posts, filename) {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filepath = path.join(dataDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(posts, null, 2));
  console.log(`💾 数据已保存到: ${filepath}`);
  
  return filepath;
}

// CLI 模式
if (require.main === module) {
  const targetCount = parseInt(process.argv[2]) || 20;
  
  collectIdeas(targetCount)
    .then(posts => {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `reddit-ideas-${timestamp}.json`;
      const filepath = saveData(posts, filename);
      
      console.log('\n📊 收集统计:');
      console.log(`   总数: ${posts.length}`);
      console.log(`   来源 subreddits: ${[...new Set(posts.map(p => p.subreddit))].join(', ')}`);
      
      // 输出前3个标题预览
      console.log('\n📝 示例创意:');
      posts.slice(0, 3).forEach((post, i) => {
        console.log(`   ${i + 1}. [${post.subreddit}] ${post.title.substring(0, 60)}...`);
      });
      
      console.log(`\n✅ 完成！数据文件: ${filepath}`);
    })
    .catch(error => {
      console.error('❌ 收集失败:', error);
      process.exit(1);
    });
}

module.exports = { collectIdeas, saveData };
