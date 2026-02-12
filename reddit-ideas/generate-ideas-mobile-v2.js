#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read data
const dataFile = process.argv[2] || 'data/reddit-ideas-2026-02-12.json';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('✅ 数据读取成功:', data.length, '条');

// Generate today's date string
const today = new Date();
const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
});

/**
 * 简单翻译函数 - 根据关键词翻译英文标题
 */
function translateTitle(title) {
    if (!title) return title;

    // 常见英文关键词及其中文翻译
    const translations = {
        'app': '应用',
        'idea': '创意',
        'software': '软件',
        'website': '网站',
        'tool': '工具',
        'platform': '平台',
        'service': '服务',
        'product': '产品',
        'startup': '创业',
        'business': '商业',
        'market': '市场',
        'user': '用户',
        'feature': '功能',
        'simple': '简单',
        'easy': '容易',
        'quick': '快速',
        'need': '需要',
        'want': '想要',
        'wish there was': '希望有',
        'should exist': '应该存在',
        'looking for': '寻找',
        'someone should make': '应该有人做',
        'adhd': '注意力缺陷',
        'brain dump': '思维倾倒',
        'capture': '捕捉',
        'organize': '整理',
        'random': '随机',
        'thoughts': '想法',
        'tips': '建议',
        'coding': '编程',
        'mobile': '移动端',
        'android': '安卓',
        'iphone': 'iPhone',
        'ios': 'iOS',
        'web app': '网页应用',
        'web-based': '基于网页',
        'location-based': '基于位置',
        'reminder': '提醒',
        'note': '笔记',
        'journal': '日记',
        'habit': '习惯',
        'tracking': '追踪',
        'analytics': '分析',
        'dashboard': '仪表盘',
        'planner': '计划',
        'scheduler': '日程安排',
        'calendar': '日历',
        'task': '任务',
        'to-do': '待办',
        'checklist': '清单',
        'productivity': '生产力',
        'productivity app': '生产力应用',
        'productivity tool': '生产力工具',
        'time management': '时间管理',
        'focus': '专注',
        'mindfulness': '正念',
        'meditation': '冥想',
        'health': '健康',
        'fitness': '健身',
        'workout': '锻炼',
        'nutrition': '营养',
        'sleep': '睡眠',
        'mood': '情绪',
        'mood tracker': '情绪追踪',
        'social': '社交',
        'community': '社区',
        'forum': '论坛',
        'chat': '聊天',
        'message': '消息',
        'message app': '消息应用',
        'email': '邮件',
        'email app': '邮件应用',
        'file': '文件',
        'file manager': '文件管理器',
        'cloud': '云存储',
        'storage': '存储',
        'backup': '备份',
        'sync': '同步',
        'share': '分享',
        'collaboration': '协作',
        'team': '团队',
        'project': '项目',
        'project management': '项目管理',
        'kanban': '看板',
        'agile': '敏捷',
        'scrum': 'Scrum',
        'meeting': '会议',
        'meeting notes': '会议记录',
        'minutes': '记录',
        'report': '报告',
        'analytics': '分析',
        'statistics': '统计',
        'data': '数据',
        'data visualization': '数据可视化',
        'chart': '图表',
        'graph': '图形',
        'number': '数字',
        'calculator': '计算器',
        'converter': '转换器',
        'unit converter': '单位转换器',
        'currency converter': '货币转换器',
        'password': '密码',
        'password manager': '密码管理器',
        'security': '安全',
        'privacy': '隐私',
        'encryption': '加密',
        'vpn': 'VPN',
        'proxy': '代理',
        'browser': '浏览器',
        'extension': '扩展',
        'plugin': '插件',
        'add-on': '附加组件',
        'widget': '小组件',
        'theme': '主题',
        'template': '模板',
        'background': '背景',
        'wallpaper': '壁纸',
        'font': '字体',
        'icon': '图标',
        'logo': '标志',
        'design': '设计',
        'ui': '用户界面',
        'ux': '用户体验',
        'interface': '界面',
        'dashboard': '仪表盘',
        'home screen': '主屏幕',
        'lock screen': '锁屏',
        'notification': '通知',
        'alert': '提醒',
        'alert app': '提醒应用',
        'alarm': '闹钟',
        'timer': '计时器',
        'stopwatch': '秒表',
        'countdown': '倒计时',
        'camera': '相机',
        'camera app': '相机应用',
        'photo': '照片',
        'photo album': '相册',
        'gallery': '画廊',
        'music': '音乐',
        'music player': '音乐播放器',
        'audio': '音频',
        'video': '视频',
        'video player': '视频播放器',
        'movie': '电影',
        'movie app': '电影应用',
        'tv': '电视',
        'tv app': '电视应用',
        'radio': '收音机',
        'news': '新闻',
        'news app': '新闻应用',
        'weather': '天气',
        'weather app': '天气应用',
        'maps': '地图',
        'map app': '地图应用',
        'navigation': '导航',
        'directions': '路线',
        'traffic': '交通',
        'gas': '汽油',
        'gas station': '加油站',
        'parking': '停车',
        'car': '汽车',
        'car app': '汽车应用',
        'bike': '自行车',
        'bike sharing': '共享单车',
        'taxi': '出租车',
        'rideshare': '拼车',
        'delivery': '配送',
        'food': '食物',
        'food delivery': '外卖',
        'grocery': '杂货',
        'shopping': '购物',
        'shopping app': '购物应用',
        'e-commerce': '电子商务',
        'online shopping': '在线购物',
        'retail': '零售',
        'banking': '银行',
        'banking app': '银行应用',
        'finance': '金融',
        'finance app': '金融应用',
        'investment': '投资',
        'investment app': '投资应用',
        'trading': '交易',
        'trading app': '交易应用',
        'crypto': '加密货币',
        'crypto wallet': '加密货币钱包',
        'game': '游戏',
        'game app': '游戏应用',
        'gaming': '游戏',
        'puzzle': '益智',
        'brain': '大脑',
        'brain training': '大脑训练',
        'puzzle game': '益智游戏',
        'memory': '记忆',
        'memory game': '记忆游戏',
        'skill': '技能',
        'skill game': '技能游戏',
        'word': '单词',
        'word game': '单词游戏',
        'trivia': '问答',
        'trivia game': '问答游戏',
        'quiz': '测验',
        'quiz app': '测验应用',
        'education': '教育',
        'education app': '教育应用',
        'learning': '学习',
        'learning app': '学习应用',
        'course': '课程',
        'course app': '课程应用',
        'tutorial': '教程',
        'tutorial app': '教程应用',
        'practice': '练习',
        'practice app': '练习应用',
        'exam': '考试',
        'exam app': '考试应用',
        'homework': '作业',
        'homework app': '作业应用',
        'school': '学校',
        'school app': '学校应用',
        'university': '大学',
        'university app': '大学应用',
        'teacher': '老师',
        'teacher app': '老师应用',
        'student': '学生',
        'student app': '学生应用',
        'parent': '家长',
        'parent app': '家长应用',
        'family': '家庭',
        'family app': '家庭应用',
        'friend': '朋友',
        'friend app': '朋友应用',
        'social network': '社交网络',
        'social media': '社交媒体',
        'social media app': '社交媒体应用',
        'facebook': 'Facebook',
        'twitter': 'Twitter',
        'instagram': 'Instagram',
        'tiktok': 'TikTok',
        'youtube': 'YouTube',
        'snapchat': 'Snapchat',
        'linkedin': 'LinkedIn',
        'reddit': 'Reddit',
        'pinterest': 'Pinterest',
        'tumblr': 'Tumblr',
        'whatsapp': 'WhatsApp',
        'telegram': 'Telegram',
        'discord': 'Discord',
        'slack': 'Slack',
        'zoom': 'Zoom',
        'meet': 'Meet',
        'teams': 'Teams',
        'google': 'Google',
        'google app': 'Google应用',
        'microsoft': 'Microsoft',
        'microsoft app': 'Microsoft应用',
        'apple': 'Apple',
        'apple app': 'Apple应用',
        'amazon': 'Amazon',
        'amazon app': 'Amazon应用',
        'ebay': 'eBay',
        'ebay app': 'eBay应用',
        'aliexpress': 'AliExpress',
        'aliexpress app': 'AliExpress应用',
        'alibaba': '阿里巴巴',
        'alibaba app': '阿里巴巴应用',
        'taobao': '淘宝',
        'taobao app': '淘宝应用',
        'jd': '京东',
        'jd app': '京东应用',
        'pdd': '拼多多',
        'pdd app': '拼多多应用',
        'douyin': '抖音',
        'douyin app': '抖音应用',
        'kuaishou': '快手',
        'kuaishou app': '快手应用',
        'bilibili': 'Bilibili',
        'bilibili app': 'Bilibili应用',
        'netflix': 'Netflix',
        'netflix app': 'Netflix应用',
        'spotify': 'Spotify',
        'spotify app': 'Spotify应用',
        'apple music': 'Apple Music',
        'apple music app': 'Apple Music应用',
        'google play music': 'Google Play音乐',
        'google play music app': 'Google Play音乐应用',
        'youtube music': 'YouTube音乐',
        'youtube music app': 'YouTube音乐应用',
        'soundcloud': 'SoundCloud',
        'soundcloud app': 'SoundCloud应用',
        'twitch': 'Twitch',
        'twitch app': 'Twitch应用',
        'pocket': 'Pocket',
        'pocket app': 'Pocket应用',
        'instapaper': 'Instapaper',
        'instapaper app': 'Instapaper应用',
        'evernote': 'Evernote',
        'evernote app': 'Evernote应用',
        'notion': 'Notion',
        'notion app': 'Notion应用',
        'obsidian': 'Obsidian',
        'obsidian app': 'Obsidian应用',
        'bear': 'Bear',
        'bear app': 'Bear应用',
        'goodnotes': 'GoodNotes',
        'goodnotes app': 'GoodNotes应用',
        'notability': 'Notability',
        'notability app': 'Notability应用',
        'onenote': 'OneNote',
        'onenote app': 'OneNote应用',
        'pages': 'Pages',
        'pages app': 'Pages应用',
        'word': 'Word',
        'word app': 'Word应用',
        'excel': 'Excel',
        'excel app': 'Excel应用',
        'powerpoint': 'PowerPoint',
        'powerpoint app': 'PowerPoint应用',
        'keynote': 'Keynote',
        'keynote app': 'Keynote应用',
        'numbers': 'Numbers',
        'numbers app': 'Numbers应用',
    };

    let translated = title;
    for (const [en, zh] of Object.entries(translations)) {
        const regex = new RegExp(en, 'gi');
        translated = translated.replace(regex, zh);
    }

    // 移除多余的括号和空格
    translated = translated.replace(/\s+/g, ' ').trim();
    translated = translated.replace(/\[.*?\]/g, '').trim();

    return translated;
}

/**
 * 根据创意内容生成针对性的产品洞察
 */
function generateProductInsight(title, snippet) {
    const text = (title + ' ' + snippet).toLowerCase();

    // 判断产品类型
    let type = '通用工具';
    if (text.includes('app') && text.includes('capture')) type = '内容捕获';
    else if (text.includes('note') || text.includes('journal')) type = '笔记记录';
    else if (text.includes('reminder') || text.includes('alarm') || text.includes('alert')) type = '提醒管理';
    else if (text.includes('task') || text.includes('to-do') || text.includes('checklist')) type = '任务管理';
    else if (text.includes('habit') || text.includes('tracking')) type = '习惯追踪';
    else if (text.includes('focus') || text.includes('productivity')) type = '生产力提升';
    else if (text.includes('mindfulness') || text.includes('meditation')) type = '心理健康';
    else if (text.includes('social') || text.includes('community') || text.includes('forum')) type = '社交互动';
    else if (text.includes('chat') || text.includes('message') || text.includes('communication')) type = '即时通讯';
    else if (text.includes('calendar') || text.includes('scheduler') || text.includes('planner')) type = '日程安排';
    else if (text.includes('data') || text.includes('analytics') || text.includes('statistics')) type = '数据分析';
    else if (text.includes('security') || text.includes('privacy') || text.includes('encryption')) type = '安全保障';
    else if (text.includes('game') || text.includes('puzzle')) type = '娱乐休闲';
    else if (text.includes('education') || text.includes('learning') || text.includes('course')) type = '学习教育';
    else if (text.includes('finance') || text.includes('banking') || text.includes('investment')) type = '金融理财';
    else if (text.includes('health') || text.includes('fitness') || text.includes('workout')) type = '健康健身';
    else if (text.includes('location') || text.includes('navigation') || text.includes('maps')) type = '位置服务';
    else if (text.includes('file') || text.includes('cloud') || text.includes('storage')) type = '文件管理';
    else if (text.includes('design') || text.includes('ui') || text.includes('ux')) type = '设计工具';

    // 生成推荐理由
    let reason = '';
    if (text.includes('simple') || text.includes('easy') || text.includes('quick')) {
        reason = '操作简单易上手，符合用户对轻量化工具的需求，能快速解决实际问题';
    } else if (text.includes('adhd') || text.includes('focus') || text.includes('distraction')) {
        reason = '针对注意力分散问题，提供专注模式，满足特定人群的刚需';
    } else if (text.includes('brain dump') || text.includes('organize')) {
        reason = '帮助用户快速整理思维碎片，提升信息处理效率，解决知识管理痛点';
    } else if (text.includes('reminder') || text.includes('location')) {
        reason = '利用地理位置和提醒功能，解决用户生活中的遗忘问题，实用性强';
    } else if (text.includes('habit') || text.includes('tracking')) {
        reason = '通过追踪和反馈机制，帮助用户养成良好习惯，用户粘性高';
    } else if (text.includes('social') || text.includes('community')) {
        reason = '满足用户社交需求，提供归属感，容易形成用户社区';
    } else if (text.includes('productivity') || text.includes('task')) {
        reason = '帮助用户高效管理时间和任务，提升工作效率，市场需求大';
    } else if (text.includes('security') || text.includes('password')) {
        reason = '解决用户对数据安全和隐私的关注，刚需且高频使用';
    } else if (text.includes('education') || text.includes('learning')) {
        reason = '符合终身学习趋势，市场需求持续增长';
    } else {
        reason = '解决实际生活或工作痛点，用户需求明确，市场潜力大';
    }

    return { type, reason };
}

/**
 * 根据创意内容生成竞品分析
 */
function generateCompetitorAnalysis(title, snippet) {
    const text = (title + ' ' + snippet).toLowerCase();

    let competitors = [];

    // 通用竞品
    if (text.includes('capture') || text.includes('note') || text.includes('journal')) {
        competitors = [
            { name: 'Evernote', weakness: '界面复杂，学习成本高' },
            { name: 'Notion', weakness: '功能过多，不够专注' },
            { name: 'Apple Notes', weakness: '缺乏高级功能和同步' }
        ];
    } else if (text.includes('reminder') || text.includes('alarm') || text.includes('alert')) {
        competitors = [
            { name: 'Google Calendar', weakness: '仅支持日历提醒' },
            { name: 'Microsoft To Do', weakness: '功能较简单' },
            { name: 'Reminders App', weakness: '跨平台体验一般' }
        ];
    } else if (text.includes('task') || text.includes('to-do') || text.includes('checklist')) {
        competitors = [
            { name: 'Todoist', weakness: '免费功能有限' },
            { name: 'TickTick', weakness: '界面较拥挤' },
            { name: 'Microsoft To Do', weakness: '功能基础' }
        ];
    } else if (text.includes('habit') || text.includes('tracking')) {
        competitors = [
            { name: 'Habitica', weakness: '游戏化元素过重' },
            { name: 'Streaks', weakness: '平台限制多' },
            { name: 'Loop Habit Tracker', weakness: '界面较简陋' }
        ];
    } else if (text.includes('focus') || text.includes('productivity')) {
        competitors = [
            { name: 'Forest', weakness: '仅支持专注计时' },
            { name: 'Freedom', weakness: '价格较高' },
            { name: 'Cold Turkey', weakness: '过于强制' }
        ];
    } else if (text.includes('social') || text.includes('community') || text.includes('forum')) {
        competitors = [
            { name: 'Reddit', weakness: '信息过载，算法推荐' },
            { name: 'Discord', weakness: '主要面向游戏玩家' },
            { name: 'Slack', weakness: '主要面向企业' }
        ];
    } else if (text.includes('calendar') || text.includes('scheduler') || text.includes('planner')) {
        competitors = [
            { name: 'Google Calendar', weakness: '缺乏深度功能' },
            { name: 'Calendly', weakness: '主要面向预约' },
            { name: 'Notion Calendar', weakness: '相对较新' }
        ];
    } else if (text.includes('security') || text.includes('password') || text.includes('encryption')) {
        competitors = [
            { name: 'LastPass', weakness: '有安全争议' },
            { name: '1Password', weakness: '价格较高' },
            { name: 'Bitwarden', weakness: '用户体验一般' }
        ];
    } else if (text.includes('finance') || text.includes('banking') || text.includes('investment')) {
        competitors = [
            { name: 'Mint', weakness: '已被收购停止更新' },
            { name: 'YNAB', weakness: '价格昂贵' },
            { name: 'Personal Capital', weakness: '功能整合度一般' }
        ];
    } else if (text.includes('health') || text.includes('fitness') || text.includes('workout')) {
        competitors = [
            { name: 'MyFitnessPal', weakness: '主要关注饮食' },
            { name: 'Strava', weakness: '主要面向跑步骑行' },
            { name: 'Fitbit', weakness: '硬件依赖性强' }
        ];
    } else if (text.includes('data') || text.includes('analytics') || text.includes('statistics')) {
        competitors = [
            { name: 'Google Analytics', weakness: '主要面向网站' },
            { name: 'Mixpanel', weakness: '学习成本高' },
            { name: 'Amplitude', weakness: '价格昂贵' }
        ];
    } else if (text.includes('education') || text.includes('learning') || text.includes('course')) {
        competitors = [
            { name: 'Coursera', weakness: '偏重课程' },
            { name: 'Duolingo', weakness: '仅支持语言学习' },
            { name: 'Khan Academy', weakness: '内容较为基础' }
        ];
    } else {
        competitors = [
            { name: '通用工具', weakness: '功能单一' },
            { name: '竞品A', weakness: '用户体验一般' },
            { name: '竞品B', weakness: '定位不清晰' }
        ];
    }

    // 找出差异化点
    let differentiator = '';
    if (text.includes('adhd') || text.includes('focus')) {
        differentiator = '针对ADHD人群的专注工具，这是大多数竞品忽略的细分市场';
    } else if (text.includes('brain dump') || text.includes('organize')) {
        differentiator = '结合AI的思维倾倒工具，比传统笔记应用更智能';
    } else if (text.includes('location')) {
        differentiator = '地理位置驱动的提醒，比纯时间提醒更精准';
    } else if (text.includes('habit')) {
        differentiator = '可视化习惯追踪，提供更直观的反馈机制';
    } else if (text.includes('social')) {
        differentiator = '社区化功能，让工具更有温度';
    } else if (text.includes('productivity')) {
        differentiator = '一体化生产力工具，减少切换成本';
    } else if (text.includes('security')) {
        differentiator = '零知识加密，保护用户隐私';
    } else {
        differentiator = '专注解决某个具体场景，避免大而全';
    }

    return { competitors, differentiator };
}

// Generate ideas page with mobile optimization
const ideasHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="description" content="Reddit精选产品创意，深度分析，每日更新">
    <title>创意广场 - Reddit精选产品创意</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-size: 16px; -webkit-text-size-adjust: 100%; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 15px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: clamp(24px, 5vw, 36px);
            margin-bottom: 8px;
            line-height: 1.2;
        }
        .header p {
            font-size: clamp(13px, 2.5vw, 16px);
            opacity: 0.9;
            margin-bottom: 12px;
        }
        .header-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 13px;
        }
        .header-meta span {
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 16px;
        }
        .section {
            background: white;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .section-title {
            font-size: clamp(18px, 4vw, 24px);
            color: #333;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        .score-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }
        .score-item {
            text-align: center;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .score-item span {
            display: block;
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }
        .score-item strong {
            display: block;
            font-size: 16px;
            color: #667eea;
        }
        .idea-card {
            border: 1px solid #eee;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            transition: all 0.2s;
        }
        .idea-card:active {
            transform: scale(0.98);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .idea-header {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 15px;
        }
        .idea-rank {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            min-width: 50px;
            line-height: 1;
        }
        .idea-content {
            flex: 1;
        }
        .idea-title {
            font-size: clamp(18px, 3.5vw, 24px);
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            line-height: 1.3;
        }
        .idea-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
        }
        .tag {
            padding: 2px 10px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 500;
        }
        .tag.web { background: #e3f2fd; color: #1976d2; }
        .tag.app { background: #e8f5e9; color: #388e3c; }
        .tag.both { background: #fff3e0; color: #f57c00; }
        .tag.platform { background: #f5f5f5; color: #666; }
        .tag.deployed { background: #e8f5e9; color: #388e3c; }
        .idea-score {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
            gap: 8px;
            margin-bottom: 12px;
        }
        .score-box {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        .score-box label {
            display: block;
            font-size: 11px;
            color: #666;
            margin-bottom: 3px;
        }
        .score-box strong {
            display: block;
            font-size: 16px;
            color: #667eea;
        }
        .idea-meta {
            margin-bottom: 12px;
        }
        .idea-meta p {
            font-size: 13px;
            color: #666;
            margin-bottom: 4px;
            line-height: 1.6;
        }
        .idea-meta strong {
            color: #333;
        }
        .idea-reason {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 12px;
        }
        .idea-reason strong {
            color: #667eea;
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
        }
        .idea-reason p {
            font-size: 13px;
            color: #666;
            margin-bottom: 0;
            line-height: 1.6;
        }
        .idea-competitor {
            background: #fff3e0;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 12px;
        }
        .idea-competitor strong {
            color: #f57c00;
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
        }
        .idea-competitor p {
            font-size: 13px;
            color: #666;
            margin-bottom: 0;
            line-height: 1.6;
        }
        .idea-mvp {
            background: #e3f2fd;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 12px;
        }
        .idea-mvp strong {
            color: #1976d2;
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
        }
        .idea-mvp p {
            font-size: 13px;
            color: #666;
            margin-bottom: 0;
            line-height: 1.6;
        }
        .idea-deploy {
            background: #e8f5e9;
            padding: 12px;
            border-radius: 8px;
        }
        .idea-deploy strong {
            color: #388e3c;
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
        }
        .idea-deploy p {
            font-size: 13px;
            color: #666;
            margin-bottom: 0;
            line-height: 1.6;
        }
        .idea-actions {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .idea-actions a {
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            padding: 8px 16px;
            background: #f5f5f5;
            border-radius: 8px;
            display: inline-block;
            transition: all 0.2s;
        }
        .idea-actions a:active {
            background: #e0e0e0;
        }
        .idea-actions a:hover {
            background: #667eea;
            color: white;
        }
        .footer {
            text-align: center;
            color: #666;
            padding: 30px 0;
            font-size: 13px;
            line-height: 1.8;
        }
        @media (max-width: 768px) {
            body { padding: 10px; }
            .header { padding: 15px; }
            .section { padding: 12px; }
        }
        @media (max-width: 480px) {
            body { padding: 8px; }
            .header { padding: 12px; }
            .section { padding: 10px; }
            .idea-card { padding: 12px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 创意广场</h1>
            <p>Reddit精选产品创意 · 深度分析 · 每日更新</p>
            <div class="header-meta">
                <span>📅 ${dateStr}</span>
                <span>收录${data.length}个创意</span>
                <span>🔥 优先展示可部署项目</span>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">📊 评分说明</h2>
            <div class="score-grid">
                <div class="score-item">
                    <span>市场需求</span>
                    <strong>0-10</strong>
                </div>
                <div class="score-item">
                    <span>技术可行</span>
                    <strong>0-10</strong>
                </div>
                <div class="score-item">
                    <span>变现潜力</span>
                    <strong>0-10</strong>
                </div>
                <div class="score-item">
                    <span>竞争优势</span>
                    <strong>0-10</strong>
                </div>
                <div class="score-item">
                    <span>增长潜力</span>
                    <strong>0-10</strong>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">🏆 今日 Top 10</h2>
            ${data.slice(0, 10).map((item, index) => {
                const score = item.score || 0;
                const rank = index + 1;
                const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;

                // 翻译标题
                const translatedTitle = translateTitle(item.title);

                // 生成产品洞察
                const insight = generateProductInsight(item.title, item.snippet);

                // 生成竞品分析
                const competitor = generateCompetitorAnalysis(item.title, item.snippet);

                return `
                <div class="idea-card">
                    <div class="idea-header">
                        <div class="idea-rank">${rankEmoji}</div>
                        <div class="idea-content">
                            <div class="idea-title">
                                ${translatedTitle}
                                <span class="tag platform">🔥强烈推荐</span>
                            </div>
                            <div class="idea-tags">
                                <span class="tag web">🌐 Web</span>
                                <span class="tag app">📱 App</span>
                                <span class="tag both">🌐📱 两者皆可</span>
                            </div>
                            <div class="idea-score">
                                <div class="score-box">
                                    <label>市场需求</label>
                                    <strong>${item.business || 5}</strong>
                                </div>
                                <div class="score-box">
                                    <label>技术可行</label>
                                    <strong>${item.tech || 5}</strong>
                                </div>
                                <div class="score-box">
                                    <label>变现潜力</label>
                                    <strong>${item.demand || 5}</strong>
                                </div>
                                <div class="score-box">
                                    <label>竞争优势</label>
                                    <strong>${item.innovation || 5}</strong>
                                </div>
                                <div class="score-box">
                                    <label>增长潜力</label>
                                    <strong>${item.competition || 5}</strong>
                                </div>
                            </div>
                            <div class="idea-meta">
                                <p><strong>👥 产品类型：</strong>${insight.type}</p>
                                <p><strong>💡 推荐理由：</strong>${insight.reason}</p>
                            </div>
                            <div class="idea-competitor">
                                <strong>🏷️ 竞品分析</strong>
                                <p>${competitor.differentiator}</p>
                            </div>
                            <div class="idea-mvp">
                                <strong>🛠️ MVP</strong>
                                <p>核心功能快速实现 | 2-3周</p>
                            </div>
                            <div class="idea-deploy">
                                <strong>⚡ 部署方案</strong>
                                <p>Web/小程序快速上线，验证市场需求</p>
                            </div>
                            <div class="idea-actions">
                                <a href="${item.url}" target="_blank">查看原帖 →</a>
                            </div>
                        </div>
                    </div>
                </div>
            `}).join('')}
        </div>

        <div class="footer">
            <p>💡 评分标准: 创新性(0-10) + 市场规模(0-10) + 实现难度(0-10) + 竞品(0-10) + 变现潜力(0-10)</p>
            <p>🔥 推荐度: 🔥强烈推荐(40+) | ✅推荐(35+) | 🤔考虑(30+)</p>
        </div>
    </div>
</body>
</html>`;

// Write file
const webDir = path.join(__dirname, 'web', 'data');

fs.writeFileSync(path.join(webDir, 'ideas.html'), ideasHtml);
console.log('✅ 已生成: ideas.html (v2 - 改进版)');

console.log('✅ 移动端优化完成！');
