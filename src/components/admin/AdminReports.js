import { useState } from 'react';

function AdminReports({ items, stats }) {
  const [reportType, setReportType] = useState('items');
  const [dateRange, setDateRange] = useState('30days');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'items', name: 'Items Report', description: 'Detailed report of all shared items' },
    { id: 'users', name: 'Users Report', description: 'User activity and engagement report' },
    { id: 'analytics', name: 'Analytics Report', description: 'Platform performance and metrics' },
    { id: 'environmental', name: 'Environmental Impact', description: 'Sustainability and impact metrics' },
    { id: 'financial', name: 'Financial Report', description: 'Platform costs and savings analysis' }
  ];

  const dateRanges = [
    { id: '7days', name: 'Last 7 Days' },
    { id: '30days', name: 'Last 30 Days' },
    { id: '90days', name: 'Last 90 Days' },
    { id: '1year', name: 'Last Year' },
    { id: 'all', name: 'All Time' }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportData = getReportData();
    downloadReport(reportData);
    
    setIsGenerating(false);
  };

  const getReportData = () => {
    const now = new Date();
    const reportDate = now.toLocaleDateString();
    
    switch (reportType) {
      case 'items':
        return generateItemsReport();
      case 'users':
        return generateUsersReport();
      case 'analytics':
        return generateAnalyticsReport();
      case 'environmental':
        return generateEnvironmentalReport();
      case 'financial':
        return generateFinancialReport();
      default:
        return {};
    }
  };

  const generateItemsReport = () => {
    const totalItems = items?.length || 0;
    const activeItems = items?.filter(item => item.status !== 'completed').length || 0;
    const completedItems = items?.filter(item => item.status === 'completed').length || 0;
    const totalViews = items?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
    const totalInterested = items?.reduce((sum, item) => sum + (item.interested || 0), 0) || 0;

    const categoryBreakdown = items?.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {}) || {};

    return {
      title: 'Items Shared Report',
      summary: {
        'Total Items': totalItems,
        'Active Items': activeItems,
        'Completed Items': completedItems,
        'Total Views': totalViews,
        'Total Interest': totalInterested,
        'Average Views per Item': totalItems > 0 ? (totalViews / totalItems).toFixed(1) : 0
      },
      categoryBreakdown,
      items: items || []
    };
  };

  const generateUsersReport = () => {
    return {
      title: 'User Activity Report',
      summary: {
        'Total Users': stats.totalUsers,
        'New Signups': stats.recentSignups,
        'Platform Growth': `${stats.platformGrowth}%`,
        'Active Users': Math.floor(stats.totalUsers * 0.75),
        'User Engagement': '87%'
      },
      details: 'Detailed user analytics would be included here in a real implementation.'
    };
  };

  const generateAnalyticsReport = () => {
    return {
      title: 'Platform Analytics Report',
      summary: {
        'Total Items': stats.totalItems,
        'Total Views': stats.totalViews,
        'Total Interest': stats.totalInterested,
        'Platform Growth': `${stats.platformGrowth}%`,
        'Engagement Rate': '72%',
        'User Retention': '68%'
      },
      details: 'Comprehensive analytics data would be included here.'
    };
  };

  const generateEnvironmentalReport = () => {
    const totalItems = items?.length || 0;
    const wasteReduced = (totalItems * 2.5).toFixed(1);
    const co2Saved = (totalItems * 1.2).toFixed(1);
    const communitySavings = (totalItems * 25).toLocaleString();

    return {
      title: 'Environmental Impact Report',
      summary: {
        'Items Diverted from Waste': totalItems,
        'Waste Reduced (kg)': wasteReduced,
        'CO₂ Emissions Saved (kg)': co2Saved,
        'Community Savings ($)': communitySavings,
        'Environmental Score': '91/100'
      },
      details: 'Detailed environmental impact calculations and methodology.'
    };
  };

  const generateFinancialReport = () => {
    const totalItems = items?.length || 0;
    const communitySavings = totalItems * 25;
    const platformCosts = 1500; // Mock monthly costs
    const costPerItem = totalItems > 0 ? (platformCosts / totalItems).toFixed(2) : 0;

    return {
      title: 'Financial Impact Report',
      summary: {
        'Community Savings ($)': communitySavings.toLocaleString(),
        'Platform Operating Costs ($)': platformCosts.toLocaleString(),
        'Cost per Item Shared ($)': costPerItem,
        'ROI for Community': `${((communitySavings / platformCosts) * 100).toFixed(0)}%`,
        'Value Created ($)': (communitySavings - platformCosts).toLocaleString()
      },
      details: 'Financial analysis and cost-benefit breakdown.'
    };
  };

  const downloadReport = (reportData) => {
    const reportContent = `
EcoSwap Platform Report
Generated: ${new Date().toLocaleString()}
Report Type: ${reportData.title}
Date Range: ${dateRanges.find(r => r.id === dateRange)?.name}

SUMMARY:
${Object.entries(reportData.summary).map(([key, value]) => `${key}: ${value}`).join('\n')}

${reportData.categoryBreakdown ? `
CATEGORY BREAKDOWN:
${Object.entries(reportData.categoryBreakdown).map(([key, value]) => `${key}: ${value} items`).join('\n')}
` : ''}

${reportData.details || 'Additional details would be included in the full report.'}

---
This report was generated by EcoSwap Admin Dashboard
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecoswap-${reportType}-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const previewReport = () => {
    const reportData = getReportData();
    alert(`Report Preview:\n\n${reportData.title}\n\nSummary:\n${Object.entries(reportData.summary).map(([key, value]) => `${key}: ${value}`).join('\n')}`);
  };

  return (
    <div className="admin-reports">
      <div className="reports-header">
        <h2>Generate Reports</h2>
        <p>Create detailed reports for platform analysis and stakeholder communication</p>
      </div>

      <div className="report-configuration">
        <div className="config-section">
          <h3>Report Configuration</h3>
          
          <div className="config-grid">
            <div className="config-group">
              <label htmlFor="report-type">Report Type:</label>
              <select
                id="report-type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <p className="config-description">
                {reportTypes.find(t => t.id === reportType)?.description}
              </p>
            </div>

            <div className="config-group">
              <label htmlFor="date-range">Date Range:</label>
              <select
                id="date-range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {dateRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="report-actions">
          <button
            className="preview-btn"
            onClick={previewReport}
            disabled={isGenerating}
          >
            👁️ Preview Report
          </button>
          <button
            className="generate-btn"
            onClick={generateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="button-spinner"></span>
                Generating...
              </>
            ) : (
              <>
                📊 Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      <div className="report-templates">
        <h3>Available Report Templates</h3>
        <div className="templates-grid">
          {reportTypes.map(type => (
            <div 
              key={type.id} 
              className={`template-card ${reportType === type.id ? 'selected' : ''}`}
              onClick={() => setReportType(type.id)}
            >
              <div className="template-icon">
                {type.id === 'items' && '📦'}
                {type.id === 'users' && '👥'}
                {type.id === 'analytics' && '📈'}
                {type.id === 'environmental' && '🌱'}
                {type.id === 'financial' && '💰'}
              </div>
              <h4>{type.name}</h4>
              <p>{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-reports">
        <h3>Recent Reports</h3>
        <div className="reports-list">
          <div className="report-item">
            <div className="report-info">
              <span className="report-icon">📦</span>
              <div className="report-details">
                <h4>Items Report - January 2024</h4>
                <p>Generated on Jan 21, 2024 • 45 KB</p>
              </div>
            </div>
            <button className="download-btn">📥 Download</button>
          </div>
          
          <div className="report-item">
            <div className="report-info">
              <span className="report-icon">🌱</span>
              <div className="report-details">
                <h4>Environmental Impact - Q4 2023</h4>
                <p>Generated on Jan 15, 2024 • 32 KB</p>
              </div>
            </div>
            <button className="download-btn">📥 Download</button>
          </div>
          
          <div className="report-item">
            <div className="report-info">
              <span className="report-icon">📈</span>
              <div className="report-details">
                <h4>Platform Analytics - December 2023</h4>
                <p>Generated on Jan 10, 2024 • 67 KB</p>
              </div>
            </div>
            <button className="download-btn">📥 Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
