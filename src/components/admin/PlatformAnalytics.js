import { useState, useMemo } from 'react';

function PlatformAnalytics({ items, stats }) {
  const [timeRange, setTimeRange] = useState('7days');

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (!items) return {};

    const now = new Date();
    const timeRanges = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '1year': 365
    };

    const daysBack = timeRanges[timeRange];
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    const recentItems = items.filter(item => new Date(item.date) >= cutoffDate);

    // Category distribution
    const categoryStats = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    // Daily activity (last 7 days)
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayItems = items.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === date.toDateString();
      });
      
      dailyActivity.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        items: dayItems.length,
        views: dayItems.reduce((sum, item) => sum + (item.views || 0), 0),
        interested: dayItems.reduce((sum, item) => sum + (item.interested || 0), 0)
      });
    }

    // Location distribution (mock data based on sample items)
    const locationStats = {
      'Seattle, WA': 4,
      'Portland, OR': 2,
      'San Francisco, CA': 2,
      'Other': 2
    };

    // Engagement metrics
    const totalViews = items.reduce((sum, item) => sum + (item.views || 0), 0);
    const totalInterested = items.reduce((sum, item) => sum + (item.interested || 0), 0);
    const avgViewsPerItem = items.length > 0 ? (totalViews / items.length).toFixed(1) : 0;
    const engagementRate = totalViews > 0 ? ((totalInterested / totalViews) * 100).toFixed(1) : 0;

    return {
      categoryStats,
      dailyActivity,
      locationStats,
      recentItems: recentItems.length,
      totalViews,
      totalInterested,
      avgViewsPerItem,
      engagementRate
    };
  }, [items, timeRange]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'clothing': return '👕';
      case 'electronics': return '📱';
      case 'furniture': return '🪑';
      case 'household': return '🏠';
      case 'other': return '🔧';
      default: return '📦';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'clothing': return '#e74c3c';
      case 'electronics': return '#3498db';
      case 'furniture': return '#f39c12';
      case 'household': return '#2ecc71';
      case 'other': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="platform-analytics">
      <div className="analytics-header">
        <h2>Platform Analytics</h2>
        <div className="time-range-selector">
          <label htmlFor="time-range">Time Range:</label>
          <select
            id="time-range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Key Metrics */}
        <div className="analytics-card">
          <h3>Key Metrics</h3>
          <div className="metrics-grid">
            <div className="metric">
              <div className="metric-value">{analyticsData.totalViews?.toLocaleString()}</div>
              <div className="metric-label">Total Views</div>
            </div>
            <div className="metric">
              <div className="metric-value">{analyticsData.totalInterested?.toLocaleString()}</div>
              <div className="metric-label">Total Interest</div>
            </div>
            <div className="metric">
              <div className="metric-value">{analyticsData.avgViewsPerItem}</div>
              <div className="metric-label">Avg Views/Item</div>
            </div>
            <div className="metric">
              <div className="metric-value">{analyticsData.engagementRate}%</div>
              <div className="metric-label">Engagement Rate</div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="analytics-card">
          <h3>Category Distribution</h3>
          <div className="category-chart">
            {Object.entries(analyticsData.categoryStats || {}).map(([category, count]) => {
              const percentage = ((count / (items?.length || 1)) * 100).toFixed(1);
              return (
                <div key={category} className="category-bar">
                  <div className="category-info">
                    <span className="category-icon">{getCategoryIcon(category)}</span>
                    <span className="category-name">{category}</span>
                    <span className="category-count">({count})</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getCategoryColor(category)
                      }}
                    ></div>
                  </div>
                  <span className="category-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Activity */}
        <div className="analytics-card daily-activity">
          <h3>Daily Activity (Last 7 Days)</h3>
          <div className="activity-chart">
            {analyticsData.dailyActivity?.map((day, index) => (
              <div key={index} className="activity-day">
                <div className="day-label">{day.date}</div>
                <div className="activity-bars">
                  <div className="activity-bar">
                    <div 
                      className="bar-fill items-bar"
                      style={{ height: `${Math.max(day.items * 10, 5)}px` }}
                      title={`${day.items} items`}
                    ></div>
                  </div>
                  <div className="activity-bar">
                    <div 
                      className="bar-fill views-bar"
                      style={{ height: `${Math.max(day.views * 2, 5)}px` }}
                      title={`${day.views} views`}
                    ></div>
                  </div>
                  <div className="activity-bar">
                    <div 
                      className="bar-fill interested-bar"
                      style={{ height: `${Math.max(day.interested * 5, 5)}px` }}
                      title={`${day.interested} interested`}
                    ></div>
                  </div>
                </div>
                <div className="day-stats">
                  <div className="stat-item">📦 {day.items}</div>
                  <div className="stat-item">👀 {day.views}</div>
                  <div className="stat-item">❤️ {day.interested}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color items-color"></span>
              <span>Items Shared</span>
            </div>
            <div className="legend-item">
              <span className="legend-color views-color"></span>
              <span>Views</span>
            </div>
            <div className="legend-item">
              <span className="legend-color interested-color"></span>
              <span>Interest</span>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="analytics-card">
          <h3>Geographic Distribution</h3>
          <div className="location-chart">
            {Object.entries(analyticsData.locationStats || {}).map(([location, count]) => {
              const total = Object.values(analyticsData.locationStats || {}).reduce((sum, val) => sum + val, 0);
              const percentage = ((count / total) * 100).toFixed(1);
              return (
                <div key={location} className="location-item">
                  <div className="location-info">
                    <span className="location-icon">📍</span>
                    <span className="location-name">{location}</span>
                  </div>
                  <div className="location-stats">
                    <span className="location-count">{count} users</span>
                    <span className="location-percentage">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth Trends */}
        <div className="analytics-card">
          <h3>Growth Trends</h3>
          <div className="growth-metrics">
            <div className="growth-item">
              <div className="growth-icon">📈</div>
              <div className="growth-info">
                <div className="growth-title">User Growth</div>
                <div className="growth-value">+{stats.platformGrowth}%</div>
                <div className="growth-period">This month</div>
              </div>
            </div>
            <div className="growth-item">
              <div className="growth-icon">📦</div>
              <div className="growth-info">
                <div className="growth-title">Item Growth</div>
                <div className="growth-value">+12%</div>
                <div className="growth-period">This month</div>
              </div>
            </div>
            <div className="growth-item">
              <div className="growth-icon">👀</div>
              <div className="growth-info">
                <div className="growth-title">Engagement</div>
                <div className="growth-value">+25%</div>
                <div className="growth-period">This month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="analytics-card">
          <h3>Environmental Impact</h3>
          <div className="impact-metrics">
            <div className="impact-item">
              <span className="impact-icon">♻️</span>
              <div className="impact-info">
                <div className="impact-value">{((items?.length || 0) * 2.5).toFixed(1)}kg</div>
                <div className="impact-label">Waste Diverted</div>
              </div>
            </div>
            <div className="impact-item">
              <span className="impact-icon">🌍</span>
              <div className="impact-info">
                <div className="impact-value">{((items?.length || 0) * 1.2).toFixed(1)}kg</div>
                <div className="impact-label">CO₂ Saved</div>
              </div>
            </div>
            <div className="impact-item">
              <span className="impact-icon">💰</span>
              <div className="impact-info">
                <div className="impact-value">${((items?.length || 0) * 25).toLocaleString()}</div>
                <div className="impact-label">Community Savings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlatformAnalytics;
