#!/usr/bin/env node

/**
 * Serper Search Skill
 * 使用 Google Serper API 进行网络搜索
 */

const https = require('https');

/**
 * 执行 Serper 搜索
 * @param {string} query - 搜索查询
 * @param {object} options - 搜索选项
 * @returns {Promise<object>} 搜索结果
 */
async function serperSearch(query, options = {}) {
  // 从环境变量或配置获取 API Key
  const apiKey = process.env.SERPER_API_KEY || options.apiKey || 'f94aa43a02ef40e2fb90120e27207a04f15042ef';
  
  if (!apiKey) {
    throw new Error('SERPER_API_KEY not found. Please set it in environment or config.');
  }

  const payload = {
    q: query,
    num: options.num || 10,
    ...(options.gl && { gl: options.gl }),
    ...(options.hl && { hl: options.hl })
  };

  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    
    const requestOptions = {
      hostname: 'google.serper.dev',
      path: '/search',
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(requestOptions, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          
          if (res.statusCode === 200) {
            resolve(result);
          } else {
            reject(new Error(`Serper API error: ${res.statusCode} - ${body}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(data);
    req.end();
  });
}

/**
 * 格式化搜索结果为可读文本
 * @param {object} results - Serper API 返回的结果
 * @returns {string} 格式化的文本
 */
function formatResults(results) {
  if (!results.organic || results.organic.length === 0) {
    return '没有找到搜索结果。';
  }

  let output = `🔍 搜索: "${results.searchParameters.q}"\n`;
  output += `📊 找到 ${results.organic.length} 条结果\n\n`;

  results.organic.forEach((item, index) => {
    output += `${index + 1}. **${item.title}**\n`;
    output += `   🔗 ${item.link}\n`;
    if (item.snippet) {
      output += `   📝 ${item.snippet}\n`;
    }
    if (item.date) {
      output += `   📅 ${item.date}\n`;
    }
    output += '\n';
  });

  return output;
}

// CLI 模式
if (require.main === module) {
  const query = process.argv[2];
  
  if (!query) {
    console.error('Usage: node serper-search.js "search query"');
    console.error('Example: node serper-search.js "OpenAI GPT-4"');
    process.exit(1);
  }

  console.log(`🔍 正在搜索: "${query}"...\n`);
  
  serperSearch(query)
    .then(results => {
      console.log(formatResults(results));
      
      // 输出原始 JSON（用于调试）
      if (process.env.DEBUG) {
        console.log('\n--- Raw JSON ---');
        console.log(JSON.stringify(results, null, 2));
      }
    })
    .catch(error => {
      console.error('❌ 搜索失败:', error.message);
      process.exit(1);
    });
}

// 导出供 Clawdbot 使用
module.exports = {
  serperSearch,
  formatResults
};
