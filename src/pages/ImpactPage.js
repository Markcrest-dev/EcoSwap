import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ImpactStats from '../components/impact/ImpactStats';
import ImpactChart from '../components/impact/ImpactChart';
import ImpactGoals from '../components/impact/ImpactGoals';
import ImpactService from '../services/impactService';

function ImpactPage({ items }) {
  const { user } = useAuth();
  const [impactData, setImpactData] = useState(null);
  const [userImpact, setUserImpact] = useState(null);
  const [platformImpact, setPlatformImpact] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadImpactData();
  }, [user, items]);

  const loadImpactData = async () => {
    setIsLoading(true);
    try {
      const impactService = new ImpactService();
      
      // Calculate user impact
      const userItems = items.filter(item => item.contact?.email === user.email);
      const userImpactData = await impactService.calculateUserImpact(userItems);
      setUserImpact(userImpactData);
      
      // Calculate platform impact
      const platformImpactData = await impactService.calculatePlatformImpact(items);
      setPlatformImpact(platformImpactData);
      
      // Get detailed impact data
      const detailedData = await impactService.getDetailedImpactData(items, user.email);
      setImpactData(detailedData);
      
    } catch (error) {
      console.error('Error loading impact data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Impact Overview', icon: '🌍' },
    { id: 'personal', label: 'My Impact', icon: '👤' },
    { id: 'community', label: 'Community Impact', icon: '🏘️' },
    { id: 'goals', label: 'Impact Goals', icon: '🎯' }
  ];

  if (isLoading) {
    return (
      <div className="impact-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Calculating environmental impact...</h2>
          <p>Please wait while we analyze the data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="impact-page">
      <div className="impact-header">
        <div className="impact-title">
          <h1>Environmental Impact</h1>
          <p>Track the positive environmental impact of our sharing community</p>
        </div>
        <div className="impact-summary">
          <div className="summary-stat">
            <span className="stat-value">{userImpact?.co2Saved || 0} kg</span>
            <span className="stat-label">CO₂ You've Saved</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{userImpact?.wasteReduced || 0} kg</span>
            <span className="stat-label">Waste You've Reduced</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{platformImpact?.totalCO2Saved || 0} kg</span>
            <span className="stat-label">Community CO₂ Saved</span>
          </div>
        </div>
      </div>

      <div className="impact-content">
        <div className="impact-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`impact-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="impact-tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <ImpactStats 
                userImpact={userImpact}
                platformImpact={platformImpact}
                items={items}
                currentUser={user}
              />
              
              <div className="impact-highlights">
                <div className="highlight-card">
                  <div className="highlight-icon">🌱</div>
                  <div className="highlight-content">
                    <h3>Carbon Footprint Reduction</h3>
                    <p>
                      By sharing {userImpact?.itemsShared || 0} items, you've prevented 
                      {userImpact?.co2Saved || 0} kg of CO₂ from entering the atmosphere.
                    </p>
                  </div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-icon">♻️</div>
                  <div className="highlight-content">
                    <h3>Waste Diversion</h3>
                    <p>
                      Your shared items have diverted {userImpact?.wasteReduced || 0} kg 
                      of waste from landfills, giving them a second life.
                    </p>
                  </div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-icon">💧</div>
                  <div className="highlight-content">
                    <h3>Water Conservation</h3>
                    <p>
                      Sharing instead of buying new has saved approximately 
                      {userImpact?.waterSaved || 0} liters of water in manufacturing.
                    </p>
                  </div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-icon">⚡</div>
                  <div className="highlight-content">
                    <h3>Energy Savings</h3>
                    <p>
                      You've helped save {userImpact?.energySaved || 0} kWh of energy 
                      by extending the lifecycle of existing items.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="personal-content">
              <ImpactChart 
                data={impactData?.userTimeline || []}
                type="personal"
                title="Your Environmental Impact Over Time"
              />
              
              <div className="personal-breakdown">
                <h3>Your Impact by Category</h3>
                <div className="category-impact-grid">
                  {Object.entries(impactData?.userByCategory || {}).map(([category, impact]) => (
                    <div key={category} className="category-impact-card">
                      <div className="category-header">
                        <span className="category-name">{category}</span>
                        <span className="category-count">{impact.itemCount} items</span>
                      </div>
                      <div className="category-metrics">
                        <div className="metric">
                          <span className="metric-label">CO₂ Saved:</span>
                          <span className="metric-value">{impact.co2Saved} kg</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Waste Reduced:</span>
                          <span className="metric-value">{impact.wasteReduced} kg</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="community-content">
              <ImpactChart 
                data={impactData?.platformTimeline || []}
                type="community"
                title="Community Environmental Impact"
              />
              
              <div className="community-stats">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🌍</div>
                    <div className="stat-content">
                      <h4>Total Items Shared</h4>
                      <div className="stat-value">{platformImpact?.totalItems || 0}</div>
                      <div className="stat-detail">Across all categories</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <h4>Active Contributors</h4>
                      <div className="stat-value">{platformImpact?.activeUsers || 0}</div>
                      <div className="stat-detail">Community members</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                      <h4>Top Category</h4>
                      <div className="stat-value">{platformImpact?.topCategory || 'N/A'}</div>
                      <div className="stat-detail">Most shared items</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                      <h4>Growth Rate</h4>
                      <div className="stat-value">{platformImpact?.growthRate || 0}%</div>
                      <div className="stat-detail">This month</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="leaderboard">
                <h3>Top Environmental Contributors</h3>
                <div className="leaderboard-list">
                  {(impactData?.topContributors || []).map((contributor, index) => (
                    <div key={index} className="leaderboard-item">
                      <div className="rank">#{index + 1}</div>
                      <div className="contributor-info">
                        <div className="contributor-name">{contributor.name}</div>
                        <div className="contributor-stats">
                          {contributor.itemsShared} items • {contributor.co2Saved} kg CO₂ saved
                        </div>
                      </div>
                      <div className="contributor-badge">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🌟'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <ImpactGoals 
              userImpact={userImpact}
              platformImpact={platformImpact}
              onGoalUpdate={loadImpactData}
            />
          )}
        </div>
      </div>

      <div className="impact-footer">
        <div className="impact-info">
          <h3>💡 How We Calculate Impact</h3>
          <p>
            Our impact calculations are based on research from environmental organizations 
            and lifecycle assessments. We estimate CO₂ savings, waste reduction, water conservation, 
            and energy savings based on item categories and their typical manufacturing footprints.
          </p>
        </div>

        <div className="impact-actions">
          <h3>🚀 Increase Your Impact</h3>
          <div className="action-buttons">
            <button 
              className="action-btn share-btn"
              onClick={() => window.location.href = '/share'}
            >
              📤 Share More Items
            </button>
            <button 
              className="action-btn browse-btn"
              onClick={() => window.location.href = '/home'}
            >
              🔍 Browse Items
            </button>
            <button 
              className="action-btn charity-btn"
              onClick={() => window.location.href = '/charity'}
            >
              💝 Support Charities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImpactPage;
