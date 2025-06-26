import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ImpactService from '../../services/impactService';

function ImpactGoals({ userImpact, platformImpact, onGoalUpdate }) {
  const { user } = useAuth();
  const [goals, setGoals] = useState({
    monthlyItems: 5,
    monthlyCO2: 50,
    yearlyItems: 60,
    yearlyCO2: 600
  });
  const [progress, setProgress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoals, setTempGoals] = useState(goals);

  useEffect(() => {
    loadGoalsAndProgress();
  }, [user]);

  const loadGoalsAndProgress = async () => {
    try {
      const impactService = new ImpactService();
      const userGoals = await impactService.getUserGoals(user.email);
      setGoals(userGoals);
      setTempGoals(userGoals);
      
      // Calculate progress (this would need user items data)
      // For now, we'll simulate progress based on userImpact
      const mockProgress = {
        monthly: {
          items: {
            current: Math.floor(userImpact?.itemsShared / 12) || 0,
            goal: userGoals.monthlyItems,
            percentage: Math.min(((userImpact?.itemsShared / 12) / userGoals.monthlyItems) * 100, 100) || 0
          },
          co2: {
            current: Math.floor(userImpact?.co2Saved / 12) || 0,
            goal: userGoals.monthlyCO2,
            percentage: Math.min(((userImpact?.co2Saved / 12) / userGoals.monthlyCO2) * 100, 100) || 0
          }
        },
        yearly: {
          items: {
            current: userImpact?.itemsShared || 0,
            goal: userGoals.yearlyItems,
            percentage: Math.min((userImpact?.itemsShared / userGoals.yearlyItems) * 100, 100) || 0
          },
          co2: {
            current: userImpact?.co2Saved || 0,
            goal: userGoals.yearlyCO2,
            percentage: Math.min((userImpact?.co2Saved / userGoals.yearlyCO2) * 100, 100) || 0
          }
        }
      };
      
      setProgress(mockProgress);
    } catch (error) {
      console.error('Error loading goals and progress:', error);
    }
  };

  const handleSaveGoals = async () => {
    try {
      const impactService = new ImpactService();
      await impactService.setUserGoals(user.email, tempGoals);
      setGoals(tempGoals);
      setIsEditing(false);
      await loadGoalsAndProgress();
      onGoalUpdate();
      alert('Goals updated successfully!');
    } catch (error) {
      console.error('Error saving goals:', error);
      alert('Failed to save goals. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setTempGoals(goals);
    setIsEditing(false);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#28a745';
    if (percentage >= 75) return '#20c997';
    if (percentage >= 50) return '#ffc107';
    if (percentage >= 25) return '#fd7e14';
    return '#dc3545';
  };

  const getProgressMessage = (percentage) => {
    if (percentage >= 100) return 'Goal achieved! 🎉';
    if (percentage >= 75) return 'Almost there! 💪';
    if (percentage >= 50) return 'Great progress! 👍';
    if (percentage >= 25) return 'Keep going! 🌱';
    return 'Just getting started! 🚀';
  };

  const suggestGoals = () => {
    // Suggest goals based on platform averages
    const avgMonthlyItems = Math.ceil((platformImpact?.totalItems || 60) / (platformImpact?.activeUsers || 10) / 12);
    const avgMonthlyCO2 = Math.ceil((platformImpact?.totalCO2Saved || 600) / (platformImpact?.activeUsers || 10) / 12);
    
    setTempGoals({
      monthlyItems: Math.max(avgMonthlyItems, 3),
      monthlyCO2: Math.max(avgMonthlyCO2, 30),
      yearlyItems: Math.max(avgMonthlyItems * 12, 36),
      yearlyCO2: Math.max(avgMonthlyCO2 * 12, 360)
    });
  };

  return (
    <div className="impact-goals">
      <div className="goals-header">
        <div className="goals-title">
          <h2>Your Impact Goals</h2>
          <p>Set personal targets to maximize your environmental impact</p>
        </div>
        <div className="goals-actions">
          {!isEditing ? (
            <button 
              className="edit-goals-btn"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Goals
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="suggest-btn"
                onClick={suggestGoals}
              >
                💡 Suggest Goals
              </button>
              <button 
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleSaveGoals}
              >
                Save Goals
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="goals-content">
        <div className="goals-grid">
          {/* Monthly Goals */}
          <div className="goal-section">
            <h3>Monthly Goals</h3>
            
            <div className="goal-card">
              <div className="goal-header">
                <div className="goal-icon">📦</div>
                <div className="goal-info">
                  <h4>Items to Share</h4>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempGoals.monthlyItems}
                      onChange={(e) => setTempGoals({
                        ...tempGoals,
                        monthlyItems: parseInt(e.target.value) || 0
                      })}
                      min="1"
                      className="goal-input"
                    />
                  ) : (
                    <div className="goal-target">{goals.monthlyItems} items</div>
                  )}
                </div>
              </div>
              
              {progress && (
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(progress.monthly.items.percentage, 100)}%`,
                        backgroundColor: getProgressColor(progress.monthly.items.percentage)
                      }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    <span>{progress.monthly.items.current} / {progress.monthly.items.goal}</span>
                    <span className="progress-percentage">
                      {Math.round(progress.monthly.items.percentage)}%
                    </span>
                  </div>
                  <div className="progress-message">
                    {getProgressMessage(progress.monthly.items.percentage)}
                  </div>
                </div>
              )}
            </div>

            <div className="goal-card">
              <div className="goal-header">
                <div className="goal-icon">🌱</div>
                <div className="goal-info">
                  <h4>CO₂ to Save</h4>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempGoals.monthlyCO2}
                      onChange={(e) => setTempGoals({
                        ...tempGoals,
                        monthlyCO2: parseInt(e.target.value) || 0
                      })}
                      min="1"
                      className="goal-input"
                    />
                  ) : (
                    <div className="goal-target">{goals.monthlyCO2} kg</div>
                  )}
                </div>
              </div>
              
              {progress && (
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(progress.monthly.co2.percentage, 100)}%`,
                        backgroundColor: getProgressColor(progress.monthly.co2.percentage)
                      }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    <span>{Math.round(progress.monthly.co2.current)} / {progress.monthly.co2.goal} kg</span>
                    <span className="progress-percentage">
                      {Math.round(progress.monthly.co2.percentage)}%
                    </span>
                  </div>
                  <div className="progress-message">
                    {getProgressMessage(progress.monthly.co2.percentage)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Yearly Goals */}
          <div className="goal-section">
            <h3>Yearly Goals</h3>
            
            <div className="goal-card">
              <div className="goal-header">
                <div className="goal-icon">📦</div>
                <div className="goal-info">
                  <h4>Items to Share</h4>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempGoals.yearlyItems}
                      onChange={(e) => setTempGoals({
                        ...tempGoals,
                        yearlyItems: parseInt(e.target.value) || 0
                      })}
                      min="1"
                      className="goal-input"
                    />
                  ) : (
                    <div className="goal-target">{goals.yearlyItems} items</div>
                  )}
                </div>
              </div>
              
              {progress && (
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(progress.yearly.items.percentage, 100)}%`,
                        backgroundColor: getProgressColor(progress.yearly.items.percentage)
                      }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    <span>{progress.yearly.items.current} / {progress.yearly.items.goal}</span>
                    <span className="progress-percentage">
                      {Math.round(progress.yearly.items.percentage)}%
                    </span>
                  </div>
                  <div className="progress-message">
                    {getProgressMessage(progress.yearly.items.percentage)}
                  </div>
                </div>
              )}
            </div>

            <div className="goal-card">
              <div className="goal-header">
                <div className="goal-icon">🌍</div>
                <div className="goal-info">
                  <h4>CO₂ to Save</h4>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempGoals.yearlyCO2}
                      onChange={(e) => setTempGoals({
                        ...tempGoals,
                        yearlyCO2: parseInt(e.target.value) || 0
                      })}
                      min="1"
                      className="goal-input"
                    />
                  ) : (
                    <div className="goal-target">{goals.yearlyCO2} kg</div>
                  )}
                </div>
              </div>
              
              {progress && (
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(progress.yearly.co2.percentage, 100)}%`,
                        backgroundColor: getProgressColor(progress.yearly.co2.percentage)
                      }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    <span>{Math.round(progress.yearly.co2.current)} / {progress.yearly.co2.goal} kg</span>
                    <span className="progress-percentage">
                      {Math.round(progress.yearly.co2.percentage)}%
                    </span>
                  </div>
                  <div className="progress-message">
                    {getProgressMessage(progress.yearly.co2.percentage)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="goals-insights">
          <div className="insight-card">
            <h3>🎯 Goal Setting Tips</h3>
            <ul>
              <li>Start with achievable goals and increase them over time</li>
              <li>Consider your lifestyle and available items when setting targets</li>
              <li>Monthly goals help maintain consistent impact throughout the year</li>
              <li>Celebrate when you achieve your goals and set new challenges</li>
            </ul>
          </div>

          <div className="insight-card">
            <h3>📊 Platform Averages</h3>
            <p>
              Community members typically share {Math.ceil((platformImpact?.totalItems || 60) / (platformImpact?.activeUsers || 10) / 12)} items 
              per month, saving an average of {Math.ceil((platformImpact?.totalCO2Saved || 600) / (platformImpact?.activeUsers || 10) / 12)} kg 
              of CO₂. Use these as benchmarks for your own goals!
            </p>
          </div>

          <div className="insight-card">
            <h3>🏆 Achievement Levels</h3>
            <div className="achievement-levels">
              <div className="level">🌿 Beginner: 1-10 kg CO₂/year</div>
              <div className="level">🌱 Contributor: 11-25 kg CO₂/year</div>
              <div className="level">🌟 Advocate: 26-50 kg CO₂/year</div>
              <div className="level">🦸 Hero: 51-100 kg CO₂/year</div>
              <div className="level">🏆 Champion: 100+ kg CO₂/year</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImpactGoals;
