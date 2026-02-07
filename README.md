# Reddit 创意广场 - Web 部署

## 部署方式

### 方式一：Vercel (推荐)

1. 安装 Vercel CLI:
```bash
npm install -g vercel
```

2. 登录 Vercel:
```bash
vercel login
```

3. 部署:
```bash
cd /home/clawdbot/workspace/reddit-ideas/web
vercel --prod
```

### 方式二：Cloudflare Pages

1. 安装 Wrangler:
```bash
npm install -g wrangler
```

2. 登录 Cloudflare:
```bash
wrangler login
```

3. 部署:
```bash
cd /home/clawdbot/workspace/reddit-ideas/web
npm run export
wrangler pages deploy dist
```

### 方式三：GitHub Pages (最简单)

1. 推送到 GitHub 仓库
2. 启用 GitHub Pages
3. 自动部署

## 自动更新

部署后，每天早上 8 点收集的新报告需要：
1. 更新 `data/reports.json`
2. 重新部署
