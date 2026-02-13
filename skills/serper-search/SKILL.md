# Serper Search Skill

使用 Google Serper API 进行网络搜索。

## 功能

- 通过 Serper API 搜索 Google 结果
- 返回标题、链接、摘要等结构化数据
- 支持自定义搜索参数

## 配置

在 `~/.clawdbot/clawdbot.json` 中配置 API Key：

```json
{
  "skills": {
    "entries": {
      "serper-search": {
        "enabled": true,
        "config": {
          "apiKey": "YOUR_SERPER_API_KEY"
        }
      }
    }
  }
}
```

或者设置环境变量：
```bash
export SERPER_API_KEY="your_api_key_here"
```

## 使用方法

### 命令行测试
```bash
node serper-search.js "搜索关键词"
```

### 在对话中使用
直接告诉我搜索内容，我会自动调用这个 skill。

## API 参数

- `q`: 搜索查询（必需）
- `num`: 返回结果数量（默认 10）
- `gl`: 国家代码（如 "us", "cn"）
- `hl`: 语言代码（如 "en", "zh-cn"）

## 示例

```javascript
// 基础搜索
await serperSearch("OpenAI GPT-4");

// 带参数搜索
await serperSearch("人工智能", { num: 5, gl: "cn", hl: "zh-cn" });
```

## 返回格式

```json
{
  "organic": [
    {
      "title": "结果标题",
      "link": "https://example.com",
      "snippet": "结果摘要",
      "position": 1
    }
  ],
  "searchParameters": {
    "q": "搜索词",
    "type": "search"
  }
}
```

## 注意事项

- 需要有效的 Serper API Key
- API 有调用次数限制，请查看 https://serper.dev 的定价
- 搜索结果来自 Google，受 Google 搜索限制
