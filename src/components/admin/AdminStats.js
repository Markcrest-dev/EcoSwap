import { useState, useEffect } from 'react';

function AdminStats({ stats }) {
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    activeItems: 0,
    totalViews: 0,
    totalInterested: 0,
    recentSignups: 0
  });

  // Animate numbers on mount
  useEffect(() => {
    const animateNumber = (key, target, duration = 1000) => {
      const start = 0;
      const increment = target / (duration / 16); // 60fps
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, 16);
    };

    // Animate each stat with slight delays
    setTimeout(() => animateNumber('totalUsers', stats.totalUsers), 100);
    setTimeout(() => animateNumber('totalItems', stats.totalItems), 200);
    setTimeout(() => animateNumber('activeItems', stats.activeItems), 300);
    setTimeout(() => animateNumber('totalViews', stats.totalViews), 400);
    setTimeout(() => animateNumber('totalInterested', stats.totalInterested), 500);
    setTimeout(() => animateNumber('recentSignups', stats.recentSignups), 600);
  }, [stats]);

  const statCards = [
    {
      title: 'Total Users',
      value: animatedStats.totalUsers,
      icon: '👥',
      color: '#007bff',
      description: 'Registered community members',
      trend: stats.platformGrowth > 0 ? 'up' : 'down',
      trendValue: `+${stats.platformGrowth}%`
    },
    {
      title: 'Total Items',
      value: animatedStats.totalItems,
      icon: '📦',
      color: '#28a745',
      description: 'Items shared on platform',
      trend: 'up',
      trendValue: '+12%'
    },
    {
      title: 'Active Items',
      value: animatedStats.activeItems,
      icon: '✅',
      color: '#17a2b8',
      description: 'Currently available items',
      trend: 'up',
      trendValue: '+8%'
    },
    {
      title: 'Total Views',
      value: animatedStats.totalViews,
      icon: '👀',
      color: '#ffc107',
      description: 'Item page views',
      trend: 'up',
      trendValue: '+25%'
    },
    {
      title: 'Interest Generated',
      value: animatedStats.totalInterested,
      icon: '❤️',
      color: '#dc3545',
      description: 'People interested in items',
      trend: 'up',
      trendValue: '+18%'
    },
    {
      title: 'New Signups',
      value: animatedStats.recentSignups,
      icon: '🆕',
      color: '#6f42c1',
      description: 'New users this week',
      trend: 'up',
      trendValue: '+5'
    }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '📈' : '📉';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? '#28a745' : '#dc3545';
  };

  return (
    <div className="admin-stats">
      <div className="stats-header">
        <h2>Platform Overview</h2>
        <p>Real-time statistics and key performance indicators</p>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((stat, index) => (
          <div key={stat.title} className="admin-stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-header">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-trend">
                <span 
                  className="trend-indicator"
                  style={{ color: getTrendColor(stat.trend) }}
                >
                  {getTrendIcon(stat.trend)} {stat.trendValue}
                </span>
              </div>
            </div>
            
            <div className="stat-content">
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value.toLocaleString()}
              </div>
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="platform-health">
        <div className="health-header">
          <h3>Platform Health</h3>
          <div className="health-status">
            <span className="status-indicator healthy"></span>
            <span className="status-text">All Systems Operational</span>
          </div>
        </div>
        
        <div className="health-metrics">
          <div className="health-metric">
            <div className="metric-label">
              <span className="metric-icon">⚡</span>
              <span className="metric-name">System Performance</span>
            </div>
            <div className="metric-value">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '95%', backgroundColor: '#28a745' }}></div>
              </div>
              <span className="metric-percentage">95%</span>
            </div>
          </div>
          
          <div className="health-metric">
            <div className="metric-label">
              <span className="metric-icon">👥</span>
              <span className="metric-name">User Engagement</span>
            </div>
            <div className="metric-value">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '87%', backgroundColor: '#007bff' }}></div>
              </div>
              <span className="metric-percentage">87%</span>
            </div>
          </div>
          
          <div className="health-metric">
            <div className="metric-label">
              <span className="metric-icon">🔄</span>
              <span className="metric-name">Item Turnover</span>
            </div>
            <div className="metric-value">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '72%', backgroundColor: '#ffc107' }}></div>
              </div>
              <span className="metric-percentage">72%</span>
            </div>
          </div>
          
          <div className="health-metric">
            <div className="metric-label">
              <span className="metric-icon">🌱</span>
              <span className="metric-name">Environmental Impact</span>
            </div>
            <div className="metric-value">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '91%', backgroundColor: '#28a745' }}></div>
              </div>
              <span className="metric-percentage">91%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
