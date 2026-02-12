#!/usr/bin/env node

/**
 * Reddit Ideas Collector
 * 从 Reddit 收集创意和需求
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Reddit 相关 subreddits（创意、需求、产品相关）
const SUBREDDITS = [
  'SomebodyMakeThis',
  'AppIdeas',
  'Entrepreneur',
  'startups',
  'SideProject',
  'indiehackers',
  'ProductManagement',
  'webdev',
  'technology',
  'Futurology'
];

/**
 * 从 Reddit 获取帖子
 */
async function fetchRedditPosts(subreddit, limit = 10) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'old.reddit.com',
      path: `/r/${subreddit}/hot.json?limit=${limit}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const posts = json.data.children.map(child => ({
            title: child.data.title,
            selftext: child.data.selftext,
            url: `https://reddit.com${child.data.permalink}`,
            subreddit: child.data.subreddit,
            score: child.data.score,
            num_comments: child.data.num_comments,
            created_utc: child.data.created_utc,
            author: child.data.author
          }));
          resolve(posts);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

/**
 * 收集多个 subreddit 的帖子
 */
async function collectIdeas(targetCount = 20) {
  console.log(`🔍 开始收集 Reddit 创意，目标: ${targetCount} 个...\n`);
  
  const allPosts = [];
  const postsPerSubreddit = Math.ceil(targetCount / SUBREDDITS.length) + 2;
  
  for (const subreddit of SUBREDDITS) {
    try {
      console.log(`📡 正在获取 r/${subreddit}...`);
      const posts = await fetchRedditPosts(subreddit, postsPerSubreddit);
      allPosts.push(...posts);
      
      // 避免 Reddit API 限流
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ 获取 r/${subreddit} 失败:`, error.message);
    }
  }
  
  // 按分数排序并去重
  const uniquePosts = Array.from(
    new Map(allPosts.map(post => [post.url, post])).values()
  );
  
  const sortedPosts = uniquePosts
    .sort((a, b) => b.score - a.score)
    .slice(0, targetCount);
  
  console.log(`\n✅ 成功收集 ${sortedPosts.length} 个创意\n`);
  
  return sortedPosts;
}

/**
 * 保存收集的数据
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
      console.log(`   平均分数: ${Math.round(posts.reduce((sum, p) => sum + p.score, 0) / posts.length)}`);
      console.log(`   平均评论: ${Math.round(posts.reduce((sum, p) => sum + p.num_comments, 0) / posts.length)}`);
      
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
