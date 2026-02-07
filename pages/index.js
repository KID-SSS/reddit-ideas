import Head from 'next/head';
import reports from '../data/reports.json';

export default function Home() {
  const today = new Date().toISOString().split('T')[0];
  const todayReport = reports.find(r => r.date === today) || reports[0];
  
  return (
    <>
      <Head>
        <title>🚀 Reddit 创意广场</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          .header h1 { font-size: 2.5em; margin-bottom: 10px; }
          .content { padding: 40px; }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
          }
          .stat-card {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
          }
          .stat-card h3 { font-size: 2em; margin-bottom: 5px; }
          .table-container { overflow-x: auto; }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: left;
          }
          td { padding: 15px; border-bottom: 1px solid #eee; }
          tr:hover { background: #f8f9fa; }
          .score { font-weight: bold; font-size: 1.2em; color: #667eea; }
          .badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
          }
          .badge-hot { background: #ff6b6b; color: white; }
          .badge-good { background: #51cf66; color: white; }
          .badge-ok { background: #ffd43b; color: #333; }
          .idea-card {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            border-left: 5px solid #667eea;
          }
          .score-bar {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }
          .score-item {
            flex: 1;
            text-align: center;
            padding: 8px;
            background: white;
            border-radius: 8px;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
          }
          .date-nav {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          .date-nav a {
            padding: 8px 16px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 8px;
          }
          .date-nav a:hover { background: #764ba2; }
          @media (max-width: 768px) {
            .header h1 { font-size: 1.8em; }
            .content { padding: 20px; }
            th, td { padding: 10px; font-size: 0.9em; }
          }
        `}</style>
      </Head>
      
      <div className="container">
        <div className="header">
          <h1>🚀 Reddit 创意广场</h1>
          <p>每日精选 {todayReport?.total || 20} 个创意 · {today}</p>
        </div>
        
        <div className="content">
          <div className="stats">
            <div className="stat-card">
              <h3>{todayReport?.total || 20}</h3>
              <p>📊 收集创意</p>
            </div>
            <div className="stat-card">
              <h3>{todayReport?.recommended || 0}</h3>
              <p>✅ 推荐项目</p>
            </div>
            <div className="stat-card">
              <h3>{todayReport?.avgScore || 31}</h3>
              <p>📈 平均分数</p>
            </div>
          </div>

          <h2 style={{ marginBottom: 20 }}>📊 创意排行榜</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>排名</th>
                  <th>创意标题</th>
                  <th>总分</th>
                  <th>推荐度</th>
                  <th>来源</th>
                </tr>
              </thead>
              <tbody>
                {todayReport?.ideas?.map((item, index) => {
                  const badge = item.total >= 40 ? 'badge-hot' : item.total >= 35 ? 'badge-good' : 'badge-ok';
                  const rec = item.total >= 40 ? '🔥 强推' : item.total >= 35 ? '✅ 推荐' : '🤔 考虑';
                  return (
                    <tr key={index}>
                      <td><strong>{index + 1}</strong></td>
                      <td><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></td>
                      <td><span className="score">{item.total}</span></td>
                      <td><span className={`badge ${badge}`}>{rec}</span></td>
                      <td>{item.subreddit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="footer">
          <p>📌 评分说明：总分 0-50 分 | 🔥强推(40+) ✅推荐(35+) 🤔考虑(30+) ⚠️需评估(&lt;30)</p>
          <p>数据来源：Reddit 多个创意相关 subreddit</p>
          <p>自动更新 · 每日 8:00</p>
        </div>
      </div>
    </>
  );
}
