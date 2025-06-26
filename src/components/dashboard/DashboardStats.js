import { useState, useEffect } from 'react';

function DashboardStats({ stats, user }) {
  const [animatedStats, setAnimatedStats] = useState({
    itemsShared: 0,
    totalViews: 0,
    totalInterested: 0,
    impactScore: 0
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
    setTimeout(() => animateNumber('itemsShared', stats.itemsShared), 100);
    setTimeout(() => animateNumber('totalViews', stats.totalViews), 200);
    setTimeout(() => animateNumber('totalInterested', stats.totalInterested), 300);
    setTimeout(() => animateNumber('impactScore', stats.impactScore), 400);
  }, [stats]);

  const getImpactLevel = (score) => {
    if (score >= 100) return { level: 'Eco Champion', color: '#00c851', icon: '🏆' };
    if (score >= 50) return { level: 'Green Hero', color: '#00a63f', icon: '🌟' };
    if (score >= 20) return { level: 'Earth Friend', color: '#28a745', icon: '🌱' };
    return { level: 'Getting Started', color: '#6c757d', icon: '🌿' };
  };

  const impact = getImpactLevel(animatedStats.impactScore);

  const statCards = [
    {
      title: 'Items Shared',
      value: animatedStats.itemsShared,
      icon: '📦',
      color: '#007bff',
      description: 'Items you\'ve shared with the community'
    },
    {
      title: 'Total Views',
      value: animatedStats.totalViews,
      icon: '👀',
      color: '#28a745',
      description: 'Times your items have been viewed'
    },
    {
      title: 'People Interested',
      value: animatedStats.totalInterested,
      icon: '❤️',
      color: '#dc3545',
      description: 'People who showed interest in your items'
    },
    {
      title: 'Impact Score',
      value: animatedStats.impactScore,
      icon: impact.icon,
      color: impact.color,
      description: `Your environmental impact level: ${impact.level}`
    }
  ];

  return (
    <div className="dashboard-stats">
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={stat.title} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-header">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <h3 className="stat-title">{stat.title}</h3>
                <p className="stat-description">{stat.description}</p>
              </div>
            </div>
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="impact-summary">
        <div className="impact-header">
          <h3>Your Environmental Impact</h3>
          <div className="impact-badge" style={{ backgroundColor: impact.color }}>
            <span className="impact-icon">{impact.icon}</span>
            <span className="impact-level">{impact.level}</span>
          </div>
        </div>
        <div className="impact-details">
          <div className="impact-metric">
            <span className="metric-icon">♻️</span>
            <span className="metric-text">
              Estimated {animatedStats.itemsShared * 2.5}kg of waste diverted from landfills
            </span>
          </div>
          <div className="impact-metric">
            <span className="metric-icon">🌍</span>
            <span className="metric-text">
              Approximately {animatedStats.itemsShared * 1.2}kg CO₂ emissions saved
            </span>
          </div>
          <div className="impact-metric">
            <span className="metric-icon">💰</span>
            <span className="metric-text">
              Helped community save an estimated ${animatedStats.itemsShared * 25}
            </span>
          </div>
        </div>
        <div className="impact-progress">
          <div className="progress-label">
            <span>Progress to next level</span>
            <span>{animatedStats.impactScore}/100</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min((animatedStats.impactScore / 100) * 100, 100)}%`,
                backgroundColor: impact.color 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
