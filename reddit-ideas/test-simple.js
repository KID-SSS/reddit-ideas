const fs = require('fs');

console.log('开始测试...');

const data = JSON.parse(fs.readFileSync('data/reddit-ideas-2026-02-13.json', 'utf8'));

console.log('数据读取成功:', data.length, '条');

console.log('测试完成！');
