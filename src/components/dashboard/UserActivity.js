import { useMemo } from 'react';

function UserActivity({ items, user, limit }) {
  // Generate activity data based on user's items
  const activities = useMemo(() => {
    if (!user || !items) return [];

    const userItems = items.filter(item => 
      item.contact && item.contact.email === user.email
    );

    const activityList = [];

    // Add item sharing activities
    userItems.forEach(item => {
      activityList.push({
        id: `shared-${item.id}`,
        type: 'shared',
        title: `Shared "${item.title}"`,
        description: `You shared a ${item.category} item with the community`,
        date: item.date,
        icon: '📤',
        color: '#28a745',
        item: item
      });

      // Add view activities (simulated)
      if (item.views > 0) {
        const viewDate = new Date(item.date);
        viewDate.setHours(viewDate.getHours() + Math.random() * 24);
        
        activityList.push({
          id: `views-${item.id}`,
          type: 'views',
          title: `Your item "${item.title}" got ${item.views} views`,
          description: `Community members are interested in your ${item.category}`,
          date: viewDate.toISOString(),
          icon: '👀',
          color: '#007bff',
          item: item
        });
      }

      // Add interest activities (simulated)
      if (item.interested > 0) {
        const interestDate = new Date(item.date);
        interestDate.setHours(interestDate.getHours() + Math.random() * 48);
        
        activityList.push({
          id: `interest-${item.id}`,
          type: 'interest',
          title: `${item.interested} people interested in "${item.title}"`,
          description: `Your item is popular! Consider reaching out to interested members`,
          date: interestDate.toISOString(),
          icon: '❤️',
          color: '#dc3545',
          item: item
        });
      }
    });

    // Sort by date (newest first)
    activityList.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Apply limit if specified
    return limit ? activityList.slice(0, limit) : activityList;
  }, [items, user, limit]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const options = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  };

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'shared':
        return 'Item Shared';
      case 'views':
        return 'Views Received';
      case 'interest':
        return 'Interest Received';
      default:
        return 'Activity';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="user-activity">
        <div className="empty-activity">
          <div className="empty-icon">📈</div>
          <h3>No activity yet</h3>
          <p>Start sharing items to see your activity here!</p>
          <button 
            className="share-item-btn"
            onClick={() => window.location.href = '/share'}
          >
            Share Your First Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-activity">
      {!limit && (
        <div className="activity-header">
          <h2>Activity Timeline</h2>
          <p>Track your EcoSwap journey and community impact</p>
        </div>
      )}

      <div className="activity-timeline">
        {activities.map((activity, index) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-marker">
              <div 
                className="activity-icon"
                style={{ backgroundColor: activity.color }}
              >
                {activity.icon}
              </div>
              {index < activities.length - 1 && <div className="activity-line"></div>}
            </div>
            
            <div className="activity-content">
              <div className="activity-header">
                <h4 className="activity-title">{activity.title}</h4>
                <span className="activity-time">{formatDate(activity.date)}</span>
              </div>
              <p className="activity-description">{activity.description}</p>
              <div className="activity-meta">
                <span className="activity-type">{getActivityTypeLabel(activity.type)}</span>
                {activity.item && (
                  <span className="activity-category">
                    {activity.item.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {limit && activities.length >= limit && (
        <div className="activity-footer">
          <button 
            className="view-all-btn"
            onClick={() => {
              // This would typically navigate to the full activity tab
              const event = new CustomEvent('changeTab', { detail: 'activity' });
              window.dispatchEvent(event);
            }}
          >
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
}

export default UserActivity;
