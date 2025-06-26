import { useState } from 'react';

function ChatList({ 
  conversations, 
  activeConversation, 
  onConversationSelect, 
  onDeleteConversation,
  onArchiveConversation,
  onStartConversation,
  items,
  currentUser 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, archived
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Filter conversations based on search and filter
  const filteredConversations = conversations.filter(conv => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesParticipant = conv.participants.some(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.email.toLowerCase().includes(searchLower)
      );
      const matchesMessage = conv.lastMessage.toLowerCase().includes(searchLower);
      const matchesItem = conv.itemTitle?.toLowerCase().includes(searchLower);
      
      if (!matchesParticipant && !matchesMessage && !matchesItem) {
        return false;
      }
    }

    // Status filter
    switch (filter) {
      case 'unread':
        return conv.unreadCount > 0;
      case 'archived':
        return conv.archived;
      case 'active':
        return !conv.archived;
      default:
        return true;
    }
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor((now - date) / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p.email !== currentUser.email);
  };

  const handleNewChat = (recipientEmail, itemId = null) => {
    onStartConversation(recipientEmail, itemId);
    setShowNewChatModal(false);
  };

  const getUnreadCount = () => {
    return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <div className="header-top">
          <h3>Conversations</h3>
          <button 
            className="new-chat-btn"
            onClick={() => setShowNewChatModal(true)}
            title="Start new conversation"
          >
            ✏️
          </button>
        </div>
        
        <div className="search-section">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({conversations.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({getUnreadCount()})
          </button>
          <button 
            className={`filter-tab ${filter === 'archived' ? 'active' : ''}`}
            onClick={() => setFilter('archived')}
          >
            Archived ({conversations.filter(c => c.archived).length})
          </button>
        </div>
      </div>

      <div className="conversations-list">
        {filteredConversations.length === 0 ? (
          <div className="no-conversations">
            <div className="no-conversations-icon">💬</div>
            <h4>No conversations found</h4>
            <p>
              {searchTerm 
                ? 'Try adjusting your search terms'
                : filter === 'unread'
                ? 'No unread messages'
                : filter === 'archived'
                ? 'No archived conversations'
                : 'Start a conversation to get connected!'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <button 
                className="start-first-chat-btn"
                onClick={() => setShowNewChatModal(true)}
              >
                Start Your First Chat
              </button>
            )}
          </div>
        ) : (
          filteredConversations.map(conversation => {
            const otherParticipant = getOtherParticipant(conversation);
            const isActive = activeConversation?.id === conversation.id;
            
            return (
              <div
                key={conversation.id}
                className={`conversation-item ${isActive ? 'active' : ''} ${conversation.unreadCount > 0 ? 'unread' : ''}`}
                onClick={() => onConversationSelect(conversation)}
              >
                <div className="conversation-avatar">
                  <div className="avatar-circle">
                    {otherParticipant?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="unread-indicator">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>

                <div className="conversation-content">
                  <div className="conversation-header">
                    <h4 className="participant-name">
                      {otherParticipant?.name || 'Unknown User'}
                    </h4>
                    <span className="conversation-time">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>

                  {conversation.itemTitle && (
                    <div className="conversation-item-info">
                      <span className="item-icon">📦</span>
                      <span className="item-title">{conversation.itemTitle}</span>
                    </div>
                  )}

                  <div className="conversation-preview">
                    <span className="last-message">
                      {conversation.lastMessageSender === currentUser.email ? 'You: ' : ''}
                      {conversation.lastMessage}
                    </span>
                  </div>
                </div>

                <div className="conversation-actions">
                  <button
                    className="action-btn archive-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchiveConversation(conversation.id);
                    }}
                    title={conversation.archived ? 'Unarchive' : 'Archive'}
                  >
                    {conversation.archived ? '📤' : '📥'}
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    title="Delete conversation"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showNewChatModal && (
        <div className="new-chat-modal">
          <div className="modal-overlay" onClick={() => setShowNewChatModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Start New Conversation</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNewChatModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="new-chat-section">
                <h4>Direct Message</h4>
                <div className="email-input-section">
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    id="recipient-email"
                    className="email-input"
                  />
                  <button
                    className="start-chat-btn"
                    onClick={() => {
                      const email = document.getElementById('recipient-email').value;
                      if (email) {
                        handleNewChat(email);
                      }
                    }}
                  >
                    Start Chat
                  </button>
                </div>
              </div>

              {items && items.length > 0 && (
                <div className="new-chat-section">
                  <h4>Contact Item Owners</h4>
                  <div className="items-quick-chat">
                    {items.slice(0, 5).map(item => (
                      <div key={item.id} className="item-chat-option">
                        <div className="item-info">
                          <span className="item-title">{item.title}</span>
                          <span className="item-owner">{item.contact?.email}</span>
                        </div>
                        <button
                          className="contact-owner-btn"
                          onClick={() => handleNewChat(item.contact?.email, item.id)}
                          disabled={item.contact?.email === currentUser.email}
                        >
                          {item.contact?.email === currentUser.email ? 'Your Item' : 'Contact'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatList;
