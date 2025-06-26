import { useState } from 'react';

function SystemControls() {
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    newUserRegistration: true,
    itemModeration: true,
    emailNotifications: true,
    autoBackup: true,
    debugMode: false
  });

  const [backupStatus, setBackupStatus] = useState({
    lastBackup: '2024-01-21T10:30:00Z',
    nextBackup: '2024-01-22T02:00:00Z',
    backupSize: '2.3 GB',
    status: 'healthy'
  });

  const [systemHealth, setSystemHealth] = useState({
    database: 'healthy',
    storage: 'healthy',
    email: 'healthy',
    api: 'healthy',
    uptime: '99.9%'
  });

  const handleSettingChange = (setting, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Simulate API call
    console.log(`Setting ${setting} changed to ${value}`);
    alert(`${setting} has been ${value ? 'enabled' : 'disabled'}`);
  };

  const performSystemAction = (action) => {
    switch (action) {
      case 'backup':
        alert('Manual backup initiated. This may take several minutes.');
        break;
      case 'clearCache':
        alert('System cache cleared successfully.');
        break;
      case 'restartServices':
        alert('System services restarted. Users may experience brief interruption.');
        break;
      case 'exportData':
        alert('Data export initiated. You will receive an email when complete.');
        break;
      case 'runDiagnostics':
        alert('System diagnostics running. Results will be available in the logs.');
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy':
        return '#28a745';
      case 'warning':
        return '#ffc107';
      case 'error':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="system-controls">
      <div className="controls-header">
        <h2>System Controls</h2>
        <p>Manage platform settings, monitoring, and maintenance</p>
      </div>

      <div className="controls-grid">
        {/* System Health */}
        <div className="control-section">
          <h3>System Health</h3>
          <div className="health-overview">
            <div className="health-item">
              <span className="health-icon">{getHealthIcon(systemHealth.database)}</span>
              <div className="health-info">
                <span className="health-label">Database</span>
                <span 
                  className="health-status"
                  style={{ color: getHealthColor(systemHealth.database) }}
                >
                  {systemHealth.database}
                </span>
              </div>
            </div>
            
            <div className="health-item">
              <span className="health-icon">{getHealthIcon(systemHealth.storage)}</span>
              <div className="health-info">
                <span className="health-label">Storage</span>
                <span 
                  className="health-status"
                  style={{ color: getHealthColor(systemHealth.storage) }}
                >
                  {systemHealth.storage}
                </span>
              </div>
            </div>
            
            <div className="health-item">
              <span className="health-icon">{getHealthIcon(systemHealth.email)}</span>
              <div className="health-info">
                <span className="health-label">Email Service</span>
                <span 
                  className="health-status"
                  style={{ color: getHealthColor(systemHealth.email) }}
                >
                  {systemHealth.email}
                </span>
              </div>
            </div>
            
            <div className="health-item">
              <span className="health-icon">{getHealthIcon(systemHealth.api)}</span>
              <div className="health-info">
                <span className="health-label">API</span>
                <span 
                  className="health-status"
                  style={{ color: getHealthColor(systemHealth.api) }}
                >
                  {systemHealth.api}
                </span>
              </div>
            </div>
          </div>
          
          <div className="uptime-info">
            <span className="uptime-label">System Uptime:</span>
            <span className="uptime-value">{systemHealth.uptime}</span>
          </div>
        </div>

        {/* System Settings */}
        <div className="control-section">
          <h3>System Settings</h3>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-icon">🔧</span>
                <div className="setting-details">
                  <span className="setting-name">Maintenance Mode</span>
                  <span className="setting-description">
                    Temporarily disable public access for maintenance
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={systemSettings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-icon">👥</span>
                <div className="setting-details">
                  <span className="setting-name">New User Registration</span>
                  <span className="setting-description">
                    Allow new users to register for the platform
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={systemSettings.newUserRegistration}
                  onChange={(e) => handleSettingChange('newUserRegistration', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-icon">🛡️</span>
                <div className="setting-details">
                  <span className="setting-name">Item Moderation</span>
                  <span className="setting-description">
                    Require admin approval for new items
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={systemSettings.itemModeration}
                  onChange={(e) => handleSettingChange('itemModeration', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-icon">📧</span>
                <div className="setting-details">
                  <span className="setting-name">Email Notifications</span>
                  <span className="setting-description">
                    Send email notifications to users
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={systemSettings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-icon">💾</span>
                <div className="setting-details">
                  <span className="setting-name">Auto Backup</span>
                  <span className="setting-description">
                    Automatically backup data daily
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={systemSettings.autoBackup}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-icon">🐛</span>
                <div className="setting-details">
                  <span className="setting-name">Debug Mode</span>
                  <span className="setting-description">
                    Enable detailed logging for troubleshooting
                  </span>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={systemSettings.debugMode}
                  onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Backup & Maintenance */}
        <div className="control-section">
          <h3>Backup & Maintenance</h3>
          <div className="backup-info">
            <div className="backup-status">
              <div className="status-item">
                <span className="status-label">Last Backup:</span>
                <span className="status-value">{formatDate(backupStatus.lastBackup)}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Next Backup:</span>
                <span className="status-value">{formatDate(backupStatus.nextBackup)}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Backup Size:</span>
                <span className="status-value">{backupStatus.backupSize}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Status:</span>
                <span 
                  className="status-value"
                  style={{ color: getHealthColor(backupStatus.status) }}
                >
                  {getHealthIcon(backupStatus.status)} {backupStatus.status}
                </span>
              </div>
            </div>
          </div>

          <div className="maintenance-actions">
            <button
              className="action-btn backup-btn"
              onClick={() => performSystemAction('backup')}
            >
              💾 Manual Backup
            </button>
            <button
              className="action-btn cache-btn"
              onClick={() => performSystemAction('clearCache')}
            >
              🗑️ Clear Cache
            </button>
            <button
              className="action-btn restart-btn"
              onClick={() => performSystemAction('restartServices')}
            >
              🔄 Restart Services
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="control-section">
          <h3>Data Management</h3>
          <div className="data-actions">
            <button
              className="action-btn export-btn"
              onClick={() => performSystemAction('exportData')}
            >
              📤 Export Data
            </button>
            <button
              className="action-btn diagnostics-btn"
              onClick={() => performSystemAction('runDiagnostics')}
            >
              🔍 Run Diagnostics
            </button>
            <button
              className="action-btn logs-btn"
              onClick={() => alert('System logs viewer would open here')}
            >
              📋 View Logs
            </button>
          </div>
          
          <div className="data-info">
            <div className="info-item">
              <span className="info-label">Database Size:</span>
              <span className="info-value">1.2 GB</span>
            </div>
            <div className="info-item">
              <span className="info-label">Storage Used:</span>
              <span className="info-value">3.7 GB / 10 GB</span>
            </div>
            <div className="info-item">
              <span className="info-label">Active Connections:</span>
              <span className="info-value">47</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemControls;
