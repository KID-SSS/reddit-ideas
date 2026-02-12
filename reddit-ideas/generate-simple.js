#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read data
const dataFile = process.argv[2] || 'data/reddit-ideas-2026-02-12.json';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('✅ 数据读取成功:', data.length, '条');

// Generate HTML
const today = new Date().toISOString().split('T')[0];
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>今日创意 (${today})</title>
</head>
<body>
    <h1>今日创意 (${today})</h1>
    <p>共 ${data.length} 个创意</p>
    <ul>
        ${data.slice(0, 5).map(item => `
            <li>
                <strong>${item.title}</strong><br>
                <a href="${item.url}" target="_blank">查看原帖</a>
            </li>
        `).join('')}
    </ul>
    <a href="index.html">返回首页</a>
</body>
</html>`;

// Write file
const webDir = path.join(__dirname, 'web', 'data');
const filename = `ideas-${today}.html`;

fs.writeFileSync(path.join(webDir, filename), html);
console.log('✅ 已生成:', filename);

// Generate index
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

fs.writeFileSync(path.join(webDir, 'index.html'), indexHtml);
console.log('✅ 已生成: index.html');

console.log('✅ 全部完成！');
