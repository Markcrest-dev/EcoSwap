import { useState, useMemo } from 'react';

function ReportAnalytics({ reportData }) {
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [timeframe, setTimeframe] = useState('30days');

  const analyticsData = useMemo(() => {
    if (!reportData) return {};

    const { summary, categoryStats, locationStats, monthlyData, environmentalImpact } = reportData;

    // Calculate growth rates and trends
    const calculateGrowthRate = (data) => {
      if (!data || data.length < 2) return 0;
      const current = data[data.length - 1]?.items || 0;
      const previous = data[data.length - 2]?.items || 0;
      return previous > 0 ? (((current - previous) / previous) * 100).toFixed(1) : 0;
    };

    const growthRate = calculateGrowthRate(monthlyData);

    // Performance indicators
    const performanceScore = calculatePerformanceScore(summary);
    
    // Engagement analysis
    const engagementTrends = analyzeEngagement(monthlyData);
    
    // Category performance
    const categoryPerformance = analyzeCategoryPerformance(categoryStats, summary);

    return {
      overview: {
        performanceScore,
        growthRate,
        totalItems: summary?.totalItems || 0,
        engagementRate: summary?.engagementRate || 0,
        trend: growthRate > 0 ? 'up' : growthRate < 0 ? 'down' : 'stable'
      },
      engagement: engagementTrends,
      categories: categoryPerformance,
      environmental: environmentalImpact,
      geographic: locationStats
    };
  }, [reportData]);

  const calculatePerformanceScore = (summary) => {
    if (!summary) return 0;
    
    // Weighted scoring based on various metrics
    const itemsScore = Math.min((summary.totalItems / 50) * 25, 25); // Max 25 points
    const viewsScore = Math.min((summary.avgViewsPerItem / 10) * 25, 25); // Max 25 points
    const engagementScore = Math.min((summary.engagementRate / 100) * 25, 25); // Max 25 points
    const activityScore = Math.min((summary.recentItems / 10) * 25, 25); // Max 25 points
    
    return Math.round(itemsScore + viewsScore + engagementScore + activityScore);
  };

  const analyzeEngagement = (monthlyData) => {
    if (!monthlyData || monthlyData.length === 0) return {};
    
    const totalViews = monthlyData.reduce((sum, month) => sum + month.views, 0);
    const totalInterested = monthlyData.reduce((sum, month) => sum + month.interested, 0);
    const avgEngagement = totalViews > 0 ? ((totalInterested / totalViews) * 100).toFixed(1) : 0;
    
    return {
      totalViews,
      totalInterested,
      avgEngagement,
      trend: monthlyData.length > 1 ? 
        (monthlyData[monthlyData.length - 1].views > monthlyData[monthlyData.length - 2].views ? 'up' : 'down') : 'stable'
    };
  };

  const analyzeCategoryPerformance = (categoryStats, summary) => {
    if (!categoryStats) return {};
    
    const total = summary?.totalItems || 1;
    return Object.entries(categoryStats).map(([category, count]) => ({
      category,
      count,
      percentage: ((count / total) * 100).toFixed(1),
      performance: count > (total / Object.keys(categoryStats).length) ? 'above' : 'below'
    }));
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    if (score >= 40) return '#fd7e14';
    return '#dc3545';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const renderOverview = () => (
    <div className="analytics-overview">
      <div className="performance-score">
        <div className="score-circle">
          <div 
            className="score-fill"
            style={{ 
              background: `conic-gradient(${getPerformanceColor(analyticsData.overview.performanceScore)} ${analyticsData.overview.performanceScore * 3.6}deg, #e9ecef 0deg)`
            }}
          >
            <div className="score-inner">
              <span className="score-value">{analyticsData.overview.performanceScore}</span>
              <span className="score-label">Performance Score</span>
            </div>
          </div>
        </div>
        <div className="score-details">
          <h3>Platform Performance</h3>
          <p>Overall health and engagement metrics</p>
          <div className="score-breakdown">
            <div className="breakdown-item">
              <span>Items Shared</span>
              <span>{analyticsData.overview.totalItems}</span>
            </div>
            <div className="breakdown-item">
              <span>Engagement Rate</span>
              <span>{analyticsData.overview.engagementRate}%</span>
            </div>
            <div className="breakdown-item">
              <span>Growth Rate</span>
              <span>
                {getTrendIcon(analyticsData.overview.trend)} {analyticsData.overview.growthRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="key-insights">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Top Performing Category</h4>
              <p>{analyticsData.categories?.[0]?.category || 'N/A'}</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>Engagement Trend</h4>
              <p>{analyticsData.engagement?.trend === 'up' ? 'Increasing' : 'Stable'}</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🌱</div>
            <div className="insight-content">
              <h4>Environmental Impact</h4>
              <p>{analyticsData.environmental?.wasteReduced || 0}kg waste reduced</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEngagement = () => (
    <div className="engagement-analytics">
      <div className="engagement-metrics">
        <div className="metric-card">
          <h4>Total Views</h4>
          <div className="metric-value">{analyticsData.engagement?.totalViews || 0}</div>
          <div className="metric-trend">
            {getTrendIcon(analyticsData.engagement?.trend)} 
            {analyticsData.engagement?.trend === 'up' ? 'Increasing' : 'Stable'}
          </div>
        </div>
        <div className="metric-card">
          <h4>Total Interest</h4>
          <div className="metric-value">{analyticsData.engagement?.totalInterested || 0}</div>
          <div className="metric-trend">
            📈 Active engagement
          </div>
        </div>
        <div className="metric-card">
          <h4>Avg Engagement</h4>
          <div className="metric-value">{analyticsData.engagement?.avgEngagement || 0}%</div>
          <div className="metric-trend">
            🎯 Conversion rate
          </div>
        </div>
      </div>

      <div className="engagement-recommendations">
        <h3>Recommendations</h3>
        <div className="recommendations-list">
          <div className="recommendation">
            <span className="rec-icon">💡</span>
            <div className="rec-content">
              <h4>Improve Item Descriptions</h4>
              <p>Items with detailed descriptions get 40% more views</p>
            </div>
          </div>
          <div className="recommendation">
            <span className="rec-icon">📸</span>
            <div className="rec-content">
              <h4>Add High-Quality Images</h4>
              <p>Items with images receive 3x more interest</p>
            </div>
          </div>
          <div className="recommendation">
            <span className="rec-icon">⏰</span>
            <div className="rec-content">
              <h4>Optimal Posting Times</h4>
              <p>Post between 6-8 PM for maximum visibility</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="category-analytics">
      <div className="category-performance">
        <h3>Category Performance</h3>
        <div className="category-list">
          {analyticsData.categories?.map((cat, index) => (
            <div key={cat.category} className="category-item">
              <div className="category-info">
                <span className="category-name">{cat.category}</span>
                <span className="category-count">{cat.count} items</span>
              </div>
              <div className="category-metrics">
                <div className="percentage-bar">
                  <div 
                    className="percentage-fill"
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
                <span className="percentage-value">{cat.percentage}%</span>
              </div>
              <div className={`performance-indicator ${cat.performance}`}>
                {cat.performance === 'above' ? '📈' : '📉'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEnvironmental = () => (
    <div className="environmental-analytics">
      <div className="impact-metrics">
        <div className="impact-card">
          <div className="impact-icon">♻️</div>
          <div className="impact-content">
            <h4>Waste Reduced</h4>
            <div className="impact-value">{analyticsData.environmental?.wasteReduced || 0}kg</div>
            <p>Diverted from landfills</p>
          </div>
        </div>
        <div className="impact-card">
          <div className="impact-icon">🌍</div>
          <div className="impact-content">
            <h4>CO₂ Saved</h4>
            <div className="impact-value">{analyticsData.environmental?.co2Saved || 0}kg</div>
            <p>Carbon emissions reduced</p>
          </div>
        </div>
        <div className="impact-card">
          <div className="impact-icon">💰</div>
          <div className="impact-content">
            <h4>Community Savings</h4>
            <div className="impact-value">${analyticsData.environmental?.communitySavings || 0}</div>
            <p>Money saved by community</p>
          </div>
        </div>
      </div>

      <div className="sustainability-score">
        <h3>Sustainability Impact</h3>
        <div className="sustainability-gauge">
          <div className="gauge-container">
            <div className="gauge-fill" style={{ width: '85%' }}></div>
          </div>
          <div className="gauge-label">85% Positive Impact</div>
        </div>
        <p>Your platform is making a significant positive environmental impact!</p>
      </div>
    </div>
  );

  const metrics = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'engagement', label: 'Engagement', icon: '👥' },
    { id: 'categories', label: 'Categories', icon: '📦' },
    { id: 'environmental', label: 'Environmental', icon: '🌱' }
  ];

  return (
    <div className="report-analytics">
      <div className="analytics-header">
        <h2>Advanced Analytics</h2>
        <div className="analytics-controls">
          <div className="metric-selector">
            {metrics.map(metric => (
              <button
                key={metric.id}
                className={`metric-btn ${selectedMetric === metric.id ? 'active' : ''}`}
                onClick={() => setSelectedMetric(metric.id)}
              >
                <span className="metric-icon">{metric.icon}</span>
                <span className="metric-label">{metric.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-content">
        {selectedMetric === 'overview' && renderOverview()}
        {selectedMetric === 'engagement' && renderEngagement()}
        {selectedMetric === 'categories' && renderCategories()}
        {selectedMetric === 'environmental' && renderEnvironmental()}
      </div>
    </div>
  );
}

export default ReportAnalytics;
