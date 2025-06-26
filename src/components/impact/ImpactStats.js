import { useState, useEffect } from 'react';
import ImpactService from '../../services/impactService';

function ImpactStats({ userImpact, platformImpact, items, currentUser }) {
  const [equivalents, setEquivalents] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    if (userImpact?.co2Saved) {
      const impactService = new ImpactService();
      const equiv = impactService.getImpactEquivalents(userImpact.co2Saved);
      setEquivalents(equiv);
    }
  }, [userImpact]);

  const generateCertificate = async () => {
    try {
      const impactService = new ImpactService();
      const userItems = items.filter(item => item.contact?.email === currentUser.email);
      const cert = await impactService.getImpactCertificate(currentUser.email, userItems);
      setCertificate(cert);
      setShowCertificate(true);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getImpactLevel = (co2Saved) => {
    if (co2Saved >= 100) return { level: 'Champion', color: '#28a745', icon: '🏆' };
    if (co2Saved >= 50) return { level: 'Hero', color: '#007bff', icon: '🦸' };
    if (co2Saved >= 25) return { level: 'Advocate', color: '#ffc107', icon: '🌟' };
    if (co2Saved >= 10) return { level: 'Contributor', color: '#fd7e14', icon: '🌱' };
    return { level: 'Beginner', color: '#6c757d', icon: '🌿' };
  };

  const impactLevel = getImpactLevel(userImpact?.co2Saved || 0);

  return (
    <div className="impact-stats">
      <div className="stats-overview">
        <div className="overview-grid">
          <div className="overview-card personal">
            <div className="card-header">
              <h3>Your Environmental Impact</h3>
              <div className="impact-badge" style={{ backgroundColor: impactLevel.color }}>
                <span className="badge-icon">{impactLevel.icon}</span>
                <span className="badge-text">{impactLevel.level}</span>
              </div>
            </div>
            <div className="card-content">
              <div className="impact-metrics">
                <div className="metric">
                  <div className="metric-value">{userImpact?.co2Saved || 0} kg</div>
                  <div className="metric-label">CO₂ Saved</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{userImpact?.wasteReduced || 0} kg</div>
                  <div className="metric-label">Waste Reduced</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{formatNumber(userImpact?.waterSaved || 0)} L</div>
                  <div className="metric-label">Water Saved</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{userImpact?.energySaved || 0} kWh</div>
                  <div className="metric-label">Energy Saved</div>
                </div>
              </div>
            </div>
          </div>

          <div className="overview-card community">
            <div className="card-header">
              <h3>Community Impact</h3>
              <div className="community-badge">
                <span className="badge-icon">🌍</span>
                <span className="badge-text">Together</span>
              </div>
            </div>
            <div className="card-content">
              <div className="impact-metrics">
                <div className="metric">
                  <div className="metric-value">{platformImpact?.totalCO2Saved || 0} kg</div>
                  <div className="metric-label">Total CO₂ Saved</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{platformImpact?.totalItems || 0}</div>
                  <div className="metric-label">Items Shared</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{platformImpact?.activeUsers || 0}</div>
                  <div className="metric-label">Active Users</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{platformImpact?.growthRate || 0}%</div>
                  <div className="metric-label">Growth Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {equivalents && (
        <div className="impact-equivalents">
          <h3>Your Impact in Perspective</h3>
          <p>Your {userImpact.co2Saved} kg of CO₂ savings is equivalent to:</p>
          
          <div className="equivalents-grid">
            <div className="equivalent-item">
              <div className="equivalent-icon">🌳</div>
              <div className="equivalent-content">
                <div className="equivalent-value">{equivalents.treesPlanted}</div>
                <div className="equivalent-label">Trees planted for a year</div>
              </div>
            </div>

            <div className="equivalent-item">
              <div className="equivalent-icon">🚗</div>
              <div className="equivalent-content">
                <div className="equivalent-value">{formatNumber(equivalents.carMiles)}</div>
                <div className="equivalent-label">Miles not driven</div>
              </div>
            </div>

            <div className="equivalent-item">
              <div className="equivalent-icon">📱</div>
              <div className="equivalent-content">
                <div className="equivalent-value">{formatNumber(equivalents.phoneCharges)}</div>
                <div className="equivalent-label">Phone charges avoided</div>
              </div>
            </div>

            <div className="equivalent-item">
              <div className="equivalent-icon">💡</div>
              <div className="equivalent-content">
                <div className="equivalent-value">{formatNumber(equivalents.lightBulbHours)}</div>
                <div className="equivalent-label">LED bulb hours saved</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="impact-actions">
        <div className="actions-header">
          <h3>Celebrate Your Impact</h3>
          <p>Share your environmental achievements with others</p>
        </div>
        
        <div className="action-buttons">
          <button 
            className="action-btn certificate-btn"
            onClick={generateCertificate}
          >
            🏆 Generate Impact Certificate
          </button>
          <button 
            className="action-btn share-btn"
            onClick={() => {
              const text = `I've saved ${userImpact?.co2Saved || 0} kg of CO₂ by sharing ${userImpact?.itemsShared || 0} items on EcoSwap! 🌱 #EcoSwap #Sustainability`;
              if (navigator.share) {
                navigator.share({ text });
              } else {
                navigator.clipboard.writeText(text);
                alert('Impact message copied to clipboard!');
              }
            }}
          >
            📤 Share Your Impact
          </button>
          <button 
            className="action-btn goal-btn"
            onClick={() => {
              // Navigate to goals tab
              const event = new CustomEvent('switchTab', { detail: 'goals' });
              window.dispatchEvent(event);
            }}
          >
            🎯 Set Impact Goals
          </button>
        </div>
      </div>

      {/* Impact Certificate Modal */}
      {showCertificate && certificate && (
        <div className="certificate-modal">
          <div className="modal-overlay" onClick={() => setShowCertificate(false)}></div>
          <div className="modal-content certificate-content">
            <div className="modal-header">
              <h3>Environmental Impact Certificate</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCertificate(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="certificate">
                <div className="certificate-header">
                  <div className="certificate-logo">🌍</div>
                  <h2>EcoSwap Impact Certificate</h2>
                  <div className="certificate-id">Certificate ID: {certificate.certificateId}</div>
                </div>

                <div className="certificate-content">
                  <div className="certificate-text">
                    <p>This certifies that</p>
                    <h3 className="certificate-name">{currentUser.firstName} {currentUser.lastName}</h3>
                    <p>has made a positive environmental impact through the EcoSwap community</p>
                  </div>

                  <div className="certificate-metrics">
                    <div className="cert-metric">
                      <div className="cert-value">{certificate.itemsShared}</div>
                      <div className="cert-label">Items Shared</div>
                    </div>
                    <div className="cert-metric">
                      <div className="cert-value">{certificate.co2Saved} kg</div>
                      <div className="cert-label">CO₂ Saved</div>
                    </div>
                    <div className="cert-metric">
                      <div className="cert-value">{certificate.wasteReduced} kg</div>
                      <div className="cert-label">Waste Reduced</div>
                    </div>
                  </div>

                  <div className="certificate-equivalents">
                    <p>This impact is equivalent to:</p>
                    <div className="cert-equivalents">
                      <span>🌳 {certificate.equivalents.treesPlanted} trees planted</span>
                      <span>🚗 {formatNumber(certificate.equivalents.carMiles)} miles not driven</span>
                    </div>
                  </div>

                  <div className="certificate-footer">
                    <div className="certificate-date">
                      Generated on {new Date(certificate.generatedAt).toLocaleDateString()}
                    </div>
                    <div className="certificate-signature">
                      <div className="signature-line"></div>
                      <div className="signature-text">EcoSwap Community</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="download-btn"
                onClick={() => {
                  // In a real app, this would generate a PDF
                  alert('Certificate download functionality would be implemented here');
                }}
              >
                📄 Download PDF
              </button>
              <button 
                className="share-cert-btn"
                onClick={() => {
                  const text = `I just earned my EcoSwap Impact Certificate! I've saved ${certificate.co2Saved} kg of CO₂ by sharing ${certificate.itemsShared} items. 🌱 #EcoSwap #Sustainability`;
                  if (navigator.share) {
                    navigator.share({ text });
                  } else {
                    navigator.clipboard.writeText(text);
                    alert('Certificate message copied to clipboard!');
                  }
                }}
              >
                📤 Share Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImpactStats;
