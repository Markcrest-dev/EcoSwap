import { useMemo } from 'react';

function CharityStats({ userStats, platformStats, charities, donations, detailed = false }) {
  const stats = useMemo(() => {
    // Calculate monthly donation trends
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthDonations = donations.filter(donation => {
        const donationDate = new Date(donation.date);
        return donationDate >= monthStart && donationDate <= monthEnd;
      });

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthDonations.reduce((sum, d) => sum + d.amount, 0),
        count: monthDonations.length
      });
    }

    // Calculate category breakdown
    const categoryBreakdown = {};
    charities.forEach(charity => {
      const charityDonations = donations.filter(d => d.charityId === charity.id);
      const totalAmount = charityDonations.reduce((sum, d) => sum + d.amount, 0);
      
      if (!categoryBreakdown[charity.category]) {
        categoryBreakdown[charity.category] = {
          amount: 0,
          count: 0,
          charities: 0
        };
      }
      
      categoryBreakdown[charity.category].amount += totalAmount;
      categoryBreakdown[charity.category].count += charityDonations.length;
      categoryBreakdown[charity.category].charities += 1;
    });

    // Top performing charities
    const topCharities = charities
      .map(charity => ({
        ...charity,
        donationAmount: donations
          .filter(d => d.charityId === charity.id)
          .reduce((sum, d) => sum + d.amount, 0)
      }))
      .sort((a, b) => b.donationAmount - a.donationAmount)
      .slice(0, 5);

    return {
      monthlyData,
      categoryBreakdown,
      topCharities
    };
  }, [charities, donations]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      environment: '🌍',
      hunger: '🍞',
      education: '📚',
      animals: '🐾',
      health: '🏥',
      community: '🤝'
    };
    return icons[category] || '🏛️';
  };

  const getCategoryColor = (category) => {
    const colors = {
      environment: '#28a745',
      hunger: '#fd7e14',
      education: '#007bff',
      animals: '#6f42c1',
      health: '#dc3545',
      community: '#20c997'
    };
    return colors[category] || '#6c757d';
  };

  if (!detailed) {
    // Compact sidebar version
    return (
      <div className="charity-stats-compact">
        <div className="stats-header">
          <h3>Your Impact</h3>
        </div>

        <div className="stats-content">
          <div className="stat-card">
            <div className="stat-header">
              <h4>💝 Total Donated</h4>
            </div>
            <div className="stat-value">{formatCurrency(userStats.totalDonated)}</div>
            <div className="stat-detail">
              {userStats.donationCount} donations
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>🏛️ Charities Supported</h4>
            </div>
            <div className="stat-value">{userStats.charitiesSupported}</div>
            <div className="stat-detail">
              Last: {formatDate(userStats.lastDonation)}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>📊 Platform Impact</h4>
            </div>
            <div className="stat-value">{formatCurrency(platformStats.totalRaised)}</div>
            <div className="stat-detail">
              {platformStats.totalDonations} total donations
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>📈 Monthly Trend</h4>
            </div>
            <div className="monthly-chart">
              {stats.monthlyData.map((month, index) => (
                <div key={index} className="month-bar">
                  <div 
                    className="bar-fill"
                    style={{ 
                      height: `${Math.max(month.amount / 100, 5)}px`,
                      backgroundColor: '#007bff'
                    }}
                    title={`${month.month}: ${formatCurrency(month.amount)}`}
                  ></div>
                  <span className="month-label">{month.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed full-page version
  return (
    <div className="charity-stats-detailed">
      <div className="stats-header">
        <h2>Impact Statistics</h2>
        <p>Comprehensive view of donation impact and trends</p>
      </div>

      <div className="stats-overview">
        <div className="overview-grid">
          <div className="overview-card">
            <div className="card-icon">💝</div>
            <div className="card-content">
              <h3>Your Donations</h3>
              <div className="card-value">{formatCurrency(userStats.totalDonated)}</div>
              <div className="card-detail">{userStats.donationCount} donations</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">🏛️</div>
            <div className="card-content">
              <h3>Charities Supported</h3>
              <div className="card-value">{userStats.charitiesSupported}</div>
              <div className="card-detail">out of {platformStats.activeCharities} active</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">🌍</div>
            <div className="card-content">
              <h3>Platform Total</h3>
              <div className="card-value">{formatCurrency(platformStats.totalRaised)}</div>
              <div className="card-detail">{platformStats.totalDonations} donations</div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Average Donation</h3>
              <div className="card-value">{formatCurrency(platformStats.avgDonation)}</div>
              <div className="card-detail">platform average</div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-charts">
        <div className="chart-section">
          <h3>Monthly Donation Trends</h3>
          <div className="monthly-chart-detailed">
            {stats.monthlyData.map((month, index) => (
              <div key={index} className="month-column">
                <div className="month-data">
                  <div 
                    className="amount-bar"
                    style={{ 
                      height: `${Math.max((month.amount / Math.max(...stats.monthlyData.map(m => m.amount))) * 100, 5)}%`,
                      backgroundColor: '#007bff'
                    }}
                  ></div>
                  <div className="month-stats">
                    <div className="amount">{formatCurrency(month.amount)}</div>
                    <div className="count">{month.count} donations</div>
                  </div>
                </div>
                <div className="month-label">{month.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-section">
          <h3>Donations by Category</h3>
          <div className="category-breakdown">
            {Object.entries(stats.categoryBreakdown).map(([category, data]) => (
              <div key={category} className="category-item">
                <div className="category-header">
                  <span className="category-icon">{getCategoryIcon(category)}</span>
                  <span className="category-name">{category}</span>
                </div>
                <div className="category-stats">
                  <div className="category-amount">{formatCurrency(data.amount)}</div>
                  <div className="category-details">
                    {data.count} donations • {data.charities} charities
                  </div>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-fill"
                    style={{ 
                      width: `${(data.amount / platformStats.totalRaised) * 100}%`,
                      backgroundColor: getCategoryColor(category)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-tables">
        <div className="table-section">
          <h3>Top Performing Charities</h3>
          <div className="top-charities-table">
            {stats.topCharities.map((charity, index) => (
              <div key={charity.id} className="charity-row">
                <div className="charity-rank">#{index + 1}</div>
                <div className="charity-info">
                  <div className="charity-name">{charity.name}</div>
                  <div className="charity-category">
                    {getCategoryIcon(charity.category)} {charity.category}
                  </div>
                </div>
                <div className="charity-stats">
                  <div className="charity-raised">{formatCurrency(charity.totalRaised)}</div>
                  <div className="charity-donors">{charity.donorCount} donors</div>
                </div>
                <div className="charity-rating">
                  <span className="rating-value">{charity.rating}</span>
                  <span className="rating-stars">⭐</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-insights">
        <div className="insight-card">
          <h3>🎯 Your Impact</h3>
          <p>
            Your {userStats.donationCount} donations have supported {userStats.charitiesSupported} different 
            charities with a total of {formatCurrency(userStats.totalDonated)}. You're making a real 
            difference in your community!
          </p>
        </div>

        <div className="insight-card">
          <h3>📈 Platform Growth</h3>
          <p>
            The EcoSwap community has raised {formatCurrency(platformStats.totalRaised)} across 
            {platformStats.activeCharities} active charities. Together, we're creating positive 
            change while reducing waste.
          </p>
        </div>

        <div className="insight-card">
          <h3>🌟 Keep Going</h3>
          <p>
            Consider setting a monthly donation goal or exploring new charity categories. 
            Every contribution, no matter the size, makes a meaningful impact.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CharityStats;
