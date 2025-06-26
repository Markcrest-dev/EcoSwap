import { useState } from 'react';

function ReportGenerator({ reportData, onReportGenerated }) {
  const [reportConfig, setReportConfig] = useState({
    type: 'summary',
    format: 'pdf',
    dateRange: '30days',
    includeCharts: true,
    includeDetails: true,
    includeEnvironmentalImpact: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'summary',
      name: 'Summary Report',
      description: 'High-level overview of platform activity and key metrics',
      icon: '📋'
    },
    {
      id: 'detailed',
      name: 'Detailed Analytics',
      description: 'Comprehensive analysis with charts and breakdowns',
      icon: '📊'
    },
    {
      id: 'environmental',
      name: 'Environmental Impact',
      description: 'Focus on sustainability metrics and environmental benefits',
      icon: '🌱'
    },
    {
      id: 'user',
      name: 'User Activity Report',
      description: 'User engagement and behavior analysis',
      icon: '👥'
    },
    {
      id: 'items',
      name: 'Items Analysis',
      description: 'Detailed breakdown of shared items and categories',
      icon: '📦'
    }
  ];

  const formatOptions = [
    { id: 'pdf', name: 'PDF Document', icon: '📄' },
    { id: 'excel', name: 'Excel Spreadsheet', icon: '📊' },
    { id: 'csv', name: 'CSV Data', icon: '📈' },
    { id: 'json', name: 'JSON Data', icon: '🔧' }
  ];

  const dateRanges = [
    { id: '7days', name: 'Last 7 Days' },
    { id: '30days', name: 'Last 30 Days' },
    { id: '90days', name: 'Last 90 Days' },
    { id: '1year', name: 'Last Year' },
    { id: 'all', name: 'All Time' }
  ];

  const handleConfigChange = (key, value) => {
    setReportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateReport = async () => {
    setIsGenerating(true);

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const report = {
      id: Date.now(),
      type: reportConfig.type,
      format: reportConfig.format,
      dateRange: reportConfig.dateRange,
      generatedAt: new Date().toISOString(),
      data: getReportContent(),
      config: reportConfig
    };

    // Trigger download based on format
    downloadReport(report);
    
    // Notify parent component
    onReportGenerated(report);
    
    setIsGenerating(false);
  };

  const getReportContent = () => {
    const { summary, categoryStats, locationStats, environmentalImpact, monthlyData } = reportData;
    
    switch (reportConfig.type) {
      case 'summary':
        return {
          title: 'EcoSwap Platform Summary Report',
          sections: [
            {
              title: 'Key Metrics',
              data: summary
            },
            {
              title: 'Category Distribution',
              data: categoryStats
            },
            {
              title: 'Environmental Impact',
              data: environmentalImpact
            }
          ]
        };
      
      case 'detailed':
        return {
          title: 'EcoSwap Detailed Analytics Report',
          sections: [
            {
              title: 'Platform Overview',
              data: summary
            },
            {
              title: 'Category Analysis',
              data: categoryStats
            },
            {
              title: 'Geographic Distribution',
              data: locationStats
            },
            {
              title: 'Monthly Trends',
              data: monthlyData
            },
            {
              title: 'Environmental Impact',
              data: environmentalImpact
            }
          ]
        };
      
      case 'environmental':
        return {
          title: 'Environmental Impact Report',
          sections: [
            {
              title: 'Sustainability Metrics',
              data: {
                ...environmentalImpact,
                itemsShared: summary.totalItems,
                wasteReductionRate: '85%',
                carbonFootprintReduction: '12.5 tons CO₂'
              }
            }
          ]
        };
      
      case 'user':
        return {
          title: 'User Activity Report',
          sections: [
            {
              title: 'Engagement Metrics',
              data: {
                totalViews: summary.totalViews,
                totalInterested: summary.totalInterested,
                engagementRate: summary.engagementRate,
                avgViewsPerItem: summary.avgViewsPerItem
              }
            }
          ]
        };
      
      case 'items':
        return {
          title: 'Items Analysis Report',
          sections: [
            {
              title: 'Item Statistics',
              data: {
                totalItems: summary.totalItems,
                activeItems: summary.activeItems,
                completedItems: summary.completedItems,
                recentItems: summary.recentItems
              }
            },
            {
              title: 'Category Breakdown',
              data: categoryStats
            }
          ]
        };
      
      default:
        return { title: 'Report', sections: [] };
    }
  };

  const downloadReport = (report) => {
    const content = formatReportContent(report);
    const filename = `ecoswap-${report.type}-report-${new Date().toISOString().split('T')[0]}.${report.format}`;
    
    const blob = new Blob([content], { 
      type: getContentType(report.format) 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatReportContent = (report) => {
    switch (report.format) {
      case 'pdf':
      case 'txt':
        return formatAsText(report);
      case 'csv':
        return formatAsCSV(report);
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'excel':
        return formatAsText(report); // In real app, would use Excel library
      default:
        return formatAsText(report);
    }
  };

  const formatAsText = (report) => {
    let content = `${report.data.title}\n`;
    content += `Generated: ${new Date(report.generatedAt).toLocaleString()}\n`;
    content += `Date Range: ${dateRanges.find(r => r.id === report.dateRange)?.name}\n\n`;
    
    report.data.sections.forEach(section => {
      content += `${section.title.toUpperCase()}\n`;
      content += '='.repeat(section.title.length) + '\n';
      
      if (typeof section.data === 'object') {
        Object.entries(section.data).forEach(([key, value]) => {
          content += `${key}: ${value}\n`;
        });
      } else {
        content += `${section.data}\n`;
      }
      content += '\n';
    });
    
    content += '\n---\nGenerated by EcoSwap Platform\n';
    return content;
  };

  const formatAsCSV = (report) => {
    let csv = 'Section,Metric,Value\n';
    
    report.data.sections.forEach(section => {
      if (typeof section.data === 'object') {
        Object.entries(section.data).forEach(([key, value]) => {
          csv += `"${section.title}","${key}","${value}"\n`;
        });
      }
    });
    
    return csv;
  };

  const getContentType = (format) => {
    switch (format) {
      case 'pdf':
        return 'application/pdf';
      case 'csv':
        return 'text/csv';
      case 'json':
        return 'application/json';
      case 'excel':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        return 'text/plain';
    }
  };

  const previewReport = () => {
    const report = {
      type: reportConfig.type,
      format: 'preview',
      data: getReportContent(),
      config: reportConfig
    };
    
    onReportGenerated(report);
    alert('Report preview generated! Check the Report Viewer tab.');
  };

  return (
    <div className="report-generator">
      <div className="generator-header">
        <h2>Generate Custom Report</h2>
        <p>Configure and generate detailed reports for analysis and sharing</p>
      </div>

      <div className="report-configuration">
        <div className="config-section">
          <h3>Report Type</h3>
          <div className="report-types-grid">
            {reportTypes.map(type => (
              <div
                key={type.id}
                className={`report-type-card ${reportConfig.type === type.id ? 'selected' : ''}`}
                onClick={() => handleConfigChange('type', type.id)}
              >
                <div className="type-icon">{type.icon}</div>
                <h4>{type.name}</h4>
                <p>{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="config-section">
          <h3>Export Settings</h3>
          <div className="config-grid">
            <div className="config-group">
              <label htmlFor="format">Output Format:</label>
              <select
                id="format"
                value={reportConfig.format}
                onChange={(e) => handleConfigChange('format', e.target.value)}
              >
                {formatOptions.map(format => (
                  <option key={format.id} value={format.id}>
                    {format.icon} {format.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="config-group">
              <label htmlFor="dateRange">Date Range:</label>
              <select
                id="dateRange"
                value={reportConfig.dateRange}
                onChange={(e) => handleConfigChange('dateRange', e.target.value)}
              >
                {dateRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="config-options">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={reportConfig.includeCharts}
                onChange={(e) => handleConfigChange('includeCharts', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Include Charts and Visualizations
            </label>

            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={reportConfig.includeDetails}
                onChange={(e) => handleConfigChange('includeDetails', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Include Detailed Breakdowns
            </label>

            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={reportConfig.includeEnvironmentalImpact}
                onChange={(e) => handleConfigChange('includeEnvironmentalImpact', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Include Environmental Impact Analysis
            </label>
          </div>
        </div>

        <div className="generation-actions">
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
                📊 Generate & Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportGenerator;
