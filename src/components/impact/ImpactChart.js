function ImpactChart({ data, type, title }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.co2Saved, d.wasteReduced)));
  
  const formatValue = (value) => {
    return value.toFixed(1);
  };

  const getBarHeight = (value) => {
    return Math.max((value / maxValue) * 200, 2); // Minimum 2px height
  };

  const getColor = (type, metric) => {
    const colors = {
      personal: {
        co2Saved: '#28a745',
        wasteReduced: '#007bff',
        itemCount: '#ffc107'
      },
      community: {
        co2Saved: '#20c997',
        wasteReduced: '#6f42c1',
        itemCount: '#fd7e14'
      }
    };
    return colors[type]?.[metric] || '#6c757d';
  };

  return (
    <div className="impact-chart">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: getColor(type, 'co2Saved') }}
            ></div>
            <span>CO₂ Saved (kg)</span>
          </div>
          <div className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: getColor(type, 'wasteReduced') }}
            ></div>
            <span>Waste Reduced (kg)</span>
          </div>
          <div className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: getColor(type, 'itemCount') }}
            ></div>
            <span>Items Shared</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-y-axis">
          <div className="y-axis-label">Impact (kg)</div>
          <div className="y-axis-ticks">
            {[0, 25, 50, 75, 100].map(tick => (
              <div key={tick} className="y-tick">
                <span className="tick-label">{tick}</span>
                <div className="tick-line"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-content">
          <div className="chart-bars">
            {data.map((month, index) => (
              <div key={index} className="month-group">
                <div className="bars-container">
                  <div 
                    className="bar co2-bar"
                    style={{ 
                      height: `${getBarHeight(month.co2Saved)}px`,
                      backgroundColor: getColor(type, 'co2Saved')
                    }}
                    title={`CO₂ Saved: ${formatValue(month.co2Saved)} kg`}
                  >
                    <div className="bar-value">{formatValue(month.co2Saved)}</div>
                  </div>
                  
                  <div 
                    className="bar waste-bar"
                    style={{ 
                      height: `${getBarHeight(month.wasteReduced)}px`,
                      backgroundColor: getColor(type, 'wasteReduced')
                    }}
                    title={`Waste Reduced: ${formatValue(month.wasteReduced)} kg`}
                  >
                    <div className="bar-value">{formatValue(month.wasteReduced)}</div>
                  </div>
                  
                  <div 
                    className="bar items-bar"
                    style={{ 
                      height: `${getBarHeight(month.itemCount * 5)}px`, // Scale items for visibility
                      backgroundColor: getColor(type, 'itemCount')
                    }}
                    title={`Items: ${month.itemCount}`}
                  >
                    <div className="bar-value">{month.itemCount}</div>
                  </div>
                </div>
                
                <div className="month-label">{month.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-summary">
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Total CO₂ Saved:</span>
            <span className="stat-value">
              {formatValue(data.reduce((sum, d) => sum + d.co2Saved, 0))} kg
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Waste Reduced:</span>
            <span className="stat-value">
              {formatValue(data.reduce((sum, d) => sum + d.wasteReduced, 0))} kg
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Items:</span>
            <span className="stat-value">
              {data.reduce((sum, d) => sum + d.itemCount, 0)}
            </span>
          </div>
        </div>

        <div className="chart-insights">
          {(() => {
            const totalCO2 = data.reduce((sum, d) => sum + d.co2Saved, 0);
            const totalItems = data.reduce((sum, d) => sum + d.itemCount, 0);
            const avgCO2PerItem = totalItems > 0 ? (totalCO2 / totalItems).toFixed(1) : 0;
            
            const bestMonth = data.reduce((best, current) => 
              current.co2Saved > best.co2Saved ? current : best, data[0] || {});
            
            return (
              <div className="insights">
                <div className="insight">
                  <span className="insight-icon">📊</span>
                  <span className="insight-text">
                    Average {avgCO2PerItem} kg CO₂ saved per item
                  </span>
                </div>
                {bestMonth && (
                  <div className="insight">
                    <span className="insight-icon">🏆</span>
                    <span className="insight-text">
                      Best month: {bestMonth.month} ({formatValue(bestMonth.co2Saved)} kg CO₂)
                    </span>
                  </div>
                )}
                <div className="insight">
                  <span className="insight-icon">📈</span>
                  <span className="insight-text">
                    {data.length > 1 && data[data.length - 1].co2Saved > data[data.length - 2].co2Saved
                      ? 'Trending upward!'
                      : 'Keep up the great work!'
                    }
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {data.length === 0 && (
        <div className="no-data">
          <div className="no-data-icon">📊</div>
          <h4>No data available</h4>
          <p>Start sharing items to see your impact over time!</p>
          <button 
            className="share-item-btn"
            onClick={() => window.location.href = '/share'}
          >
            Share Your First Item
          </button>
        </div>
      )}
    </div>
  );
}

export default ImpactChart;
