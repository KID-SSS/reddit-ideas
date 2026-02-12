#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取数据
const dataFile = process.argv[2] || 'data/reddit-ideas-2026-02-12.json';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('✅ 数据读取成功:', data.length, '条');

// 生成今日创意页面
const today = new Date().toISOString().split('T')[0];
const ideasHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>创意广场 - 今日创意 (${today})</title>
</head>
<body>
    <h1>今日创意 (${today})</h1>
    <p>共 ${data.length} 个创意</p>
    <ul>
        ${data.slice(0, 5).map(item => `<li><a href="${item.url}" target="_blank">${item.title}</a></li>`).join('')}
    </ul>
</body>
</html>`;

fs.writeFileSync(`web/data/ideas-${today}.html`, ideasHtml);
console.log('✅ 已生成: ideas-${today}.html');

// 生成index.html
const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>创意广场</title>
</head>
<body>
    <h1>创意广场</h1>
    <p>今日创意: ${data.length} 个</p>
    <a href="ideas-${today}.html">查看今日创意</a>
</body>
</html>`;

fs.writeFileSync('web/data/index.html', indexHtml);
console.log('✅ 已生成: index.html');

console.log('✅ 全部完成！');
