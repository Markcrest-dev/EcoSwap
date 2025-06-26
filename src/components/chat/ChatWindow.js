import { useState, useRef, useEffect } from 'react';

function ChatWindow({ 
  conversation, 
  messages, 
  onSendMessage, 
  onBlockUser, 
  currentUser, 
  items 
}) {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const otherParticipant = conversation.participants.find(p => p.email !== currentUser.email);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [messageText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const addEmoji = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const commonEmojis = ['😊', '😂', '👍', '❤️', '😍', '🤔', '😢', '😮', '🎉', '🔥', '💯', '🙏'];

  const getRelatedItem = () => {
    if (conversation.itemId && items) {
      return items.find(item => item.id === conversation.itemId);
    }
    return null;
  };

  const relatedItem = getRelatedItem();

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="participant-info">
          <div className="participant-avatar">
            {otherParticipant?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="participant-details">
            <h3>{otherParticipant?.name || 'Unknown User'}</h3>
            <span className="participant-email">{otherParticipant?.email}</span>
            {relatedItem && (
              <div className="related-item">
                <span className="item-icon">📦</span>
                <span className="item-title">{relatedItem.title}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="chat-actions">
          <button 
            className="action-btn info-btn"
            title="Conversation info"
            onClick={() => alert('Conversation info feature would be implemented here')}
          >
            ℹ️
          </button>
          <button 
            className="action-btn block-btn"
            title="Block user"
            onClick={() => onBlockUser(otherParticipant?.email)}
          >
            🚫
          </button>
        </div>
      </div>

      {relatedItem && (
        <div className="item-context">
          <div className="item-preview">
            {relatedItem.image && (
              <img src={relatedItem.image} alt={relatedItem.title} className="item-image" />
            )}
            <div className="item-details">
              <h4>{relatedItem.title}</h4>
              <p>{relatedItem.description}</p>
              <div className="item-meta">
                <span className="item-category">{relatedItem.category}</span>
                <span className="item-location">📍 {relatedItem.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="messages-container">
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="no-messages">
              <div className="no-messages-icon">💬</div>
              <h4>Start the conversation</h4>
              <p>Send a message to {otherParticipant?.name || 'this user'}</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.sender === currentUser.email;
              const showAvatar = index === 0 || messages[index - 1].sender !== message.sender;
              const showTime = index === messages.length - 1 || 
                             messages[index + 1].sender !== message.sender ||
                             new Date(messages[index + 1].timestamp) - new Date(message.timestamp) > 5 * 60 * 1000;

              return (
                <div
                  key={message.id}
                  className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
                >
                  {!isOwnMessage && showAvatar && (
                    <div className="message-avatar">
                      {message.senderName?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  
                  <div className="message-content">
                    {!isOwnMessage && showAvatar && (
                      <div className="message-sender">{message.senderName}</div>
                    )}
                    
                    <div className="message-bubble">
                      <div className="message-text">{message.content}</div>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="message-attachments">
                          {message.attachments.map((attachment, idx) => (
                            <div key={idx} className="attachment">
                              <span className="attachment-icon">📎</span>
                              <span className="attachment-name">{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {showTime && (
                      <div className="message-time">
                        {formatMessageTime(message.timestamp)}
                        {isOwnMessage && (
                          <span className="message-status">
                            {message.read ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="message-input-container">
        {showEmojiPicker && (
          <div className="emoji-picker">
            <div className="emoji-grid">
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  className="emoji-btn"
                  onClick={() => addEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="message-input-wrapper">
          <button
            className="input-action-btn emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Add emoji"
          >
            😊
          </button>
          
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${otherParticipant?.name || 'user'}...`}
            className="message-input"
            rows="1"
          />
          
          <button
            className="input-action-btn attach-btn"
            onClick={() => setShowAttachments(!showAttachments)}
            title="Attach file"
          >
            📎
          </button>
          
          <button
            className="send-btn"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            title="Send message"
          >
            ➤
          </button>
        </div>

        {showAttachments && (
          <div className="attachment-options">
            <button className="attachment-option">
              📷 Photo
            </button>
            <button className="attachment-option">
              📄 Document
            </button>
            <button className="attachment-option">
              📍 Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
