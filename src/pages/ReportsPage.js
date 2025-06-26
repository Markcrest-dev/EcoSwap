import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ReportGenerator from '../components/reports/ReportGenerator';
import ReportViewer from '../components/reports/ReportViewer';
import ReportAnalytics from '../components/reports/ReportAnalytics';

function ReportsPage({ items }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedReport, setSelectedReport] = useState(null);

  // Check if user has access to reports (admin or item owner)
  const hasReportAccess = user?.email === 'demo@ecoswap.com' || user?.email?.includes('admin');

  // Calculate report data
  const reportData = useMemo(() => {
    if (!items) return {};

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    // Filter items by user if not admin
    const userItems = hasReportAccess 
      ? items 
      : items.filter(item => item.contact && item.contact.email === user?.email);

    // Basic statistics
    const totalItems = userItems.length;
    const activeItems = userItems.filter(item => item.status !== 'completed').length;
    const completedItems = userItems.filter(item => item.status === 'completed').length;
    const recentItems = userItems.filter(item => new Date(item.date) >= sevenDaysAgo).length;

    // Category breakdown
    const categoryStats = userItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    // Location analysis
    const locationStats = userItems.reduce((acc, item) => {
      const location = item.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    // Engagement metrics
    const totalViews = userItems.reduce((sum, item) => sum + (item.views || 0), 0);
    const totalInterested = userItems.reduce((sum, item) => sum + (item.interested || 0), 0);
    const avgViewsPerItem = totalItems > 0 ? (totalViews / totalItems).toFixed(1) : 0;
    const engagementRate = totalViews > 0 ? ((totalInterested / totalViews) * 100).toFixed(1) : 0;

    // Time-based analysis
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthItems = userItems.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= monthStart && itemDate <= monthEnd;
      });
      
      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        items: monthItems.length,
        views: monthItems.reduce((sum, item) => sum + (item.views || 0), 0),
        interested: monthItems.reduce((sum, item) => sum + (item.interested || 0), 0)
      });
    }

    // Environmental impact
    const wasteReduced = (totalItems * 2.5).toFixed(1);
    const co2Saved = (totalItems * 1.2).toFixed(1);
    const communitySavings = (totalItems * 25).toLocaleString();

    return {
      summary: {
        totalItems,
        activeItems,
        completedItems,
        recentItems,
        totalViews,
        totalInterested,
        avgViewsPerItem,
        engagementRate
      },
      categoryStats,
      locationStats,
      monthlyData,
      environmentalImpact: {
        wasteReduced,
        co2Saved,
        communitySavings
      },
      items: userItems
    };
  }, [items, user, hasReportAccess]);

  if (!hasReportAccess) {
    return (
      <div className="reports-access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">📊</div>
          <h2>Reports Access</h2>
          <p>Advanced reporting features are available for administrators and premium users.</p>
          <div className="access-options">
            <button 
              className="basic-report-btn"
              onClick={() => setActiveTab('basic')}
            >
              View Basic Report
            </button>
            <button 
              className="upgrade-btn"
              onClick={() => alert('Upgrade feature would be implemented here')}
            >
              Upgrade Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'generate', label: 'Generate Reports', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'viewer', label: 'Report Viewer', icon: '👁️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate':
        return (
          <ReportGenerator 
            reportData={reportData} 
            onReportGenerated={setSelectedReport}
          />
        );
      case 'analytics':
        return <ReportAnalytics reportData={reportData} />;
      case 'viewer':
        return (
          <ReportViewer 
            selectedReport={selectedReport}
            reportData={reportData}
          />
        );
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div className="reports-title">
          <h1>Reports & Analytics</h1>
          <p>Generate comprehensive reports and analyze platform performance</p>
        </div>
        <div className="reports-summary">
          <div className="summary-stat">
            <span className="stat-value">{reportData.summary?.totalItems || 0}</span>
            <span className="stat-label">Total Items</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{reportData.summary?.totalViews || 0}</span>
            <span className="stat-label">Total Views</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{reportData.summary?.engagementRate || 0}%</span>
            <span className="stat-label">Engagement</span>
          </div>
        </div>
      </div>

      <div className="reports-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`reports-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="reports-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default ReportsPage;
