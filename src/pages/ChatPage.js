import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import ChatService from '../services/chatService';

function ChatPage({ items }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chatServiceRef = useRef(null);

  // Initialize chat service
  useEffect(() => {
    if (user) {
      chatServiceRef.current = new ChatService(user);
      loadConversations();
    }
  }, [user]);

  // Load conversations
  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const convos = await chatServiceRef.current.getConversations();
      setConversations(convos);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId) => {
    try {
      const msgs = await chatServiceRef.current.getMessages(conversationId);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Handle conversation selection
  const handleConversationSelect = async (conversation) => {
    setActiveConversation(conversation);
    await loadMessages(conversation.id);
    
    // Mark conversation as read
    await chatServiceRef.current.markAsRead(conversation.id);
    
    // Update conversations list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  // Send a message
  const handleSendMessage = async (content, attachments = []) => {
    if (!activeConversation || !content.trim()) return;

    try {
      const newMessage = await chatServiceRef.current.sendMessage(
        activeConversation.id,
        content,
        attachments
      );

      // Add message to current conversation
      setMessages(prev => [...prev, newMessage]);

      // Update conversation in list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id
            ? {
                ...conv,
                lastMessage: content,
                lastMessageTime: newMessage.timestamp,
                lastMessageSender: user.email
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Start a new conversation
  const handleStartConversation = async (recipientEmail, itemId = null, initialMessage = '') => {
    try {
      const conversation = await chatServiceRef.current.createConversation(
        recipientEmail,
        itemId,
        initialMessage
      );

      setConversations(prev => [conversation, ...prev]);
      setActiveConversation(conversation);
      
      if (initialMessage) {
        await handleSendMessage(initialMessage);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (conversationId) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      await chatServiceRef.current.deleteConversation(conversationId);
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  // Archive a conversation
  const handleArchiveConversation = async (conversationId) => {
    try {
      await chatServiceRef.current.archiveConversation(conversationId);
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, archived: true }
            : conv
        )
      );
    } catch (error) {
      console.error('Error archiving conversation:', error);
      alert('Failed to archive conversation. Please try again.');
    }
  };

  // Block a user
  const handleBlockUser = async (userEmail) => {
    if (!window.confirm(`Are you sure you want to block ${userEmail}?`)) {
      return;
    }

    try {
      await chatServiceRef.current.blockUser(userEmail);
      
      // Remove conversations with blocked user
      setConversations(prev => 
        prev.filter(conv => 
          conv.participants.every(p => p.email !== userEmail)
        )
      );
      
      if (activeConversation?.participants.some(p => p.email === userEmail)) {
        setActiveConversation(null);
        setMessages([]);
      }
      
      alert(`${userEmail} has been blocked.`);
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to block user. Please try again.');
    }
  };

  // Get item-related conversations
  const getItemConversations = (itemId) => {
    return conversations.filter(conv => conv.itemId === itemId);
  };

  // Get unread message count
  const getUnreadCount = () => {
    return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
  };

  if (isLoading) {
    return (
      <div className="chat-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading conversations...</h2>
          <p>Please wait while we fetch your messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-title">
          <h1>Messages</h1>
          <p>Chat with community members about shared items</p>
        </div>
        <div className="chat-stats">
          <div className="stat-item">
            <span className="stat-value">{conversations.length}</span>
            <span className="stat-label">Conversations</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{getUnreadCount()}</span>
            <span className="stat-label">Unread</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {conversations.filter(c => !c.archived).length}
            </span>
            <span className="stat-label">Active</span>
          </div>
        </div>
      </div>

      <div className="chat-content">
        <div className="chat-sidebar">
          <ChatList
            conversations={conversations}
            activeConversation={activeConversation}
            onConversationSelect={handleConversationSelect}
            onDeleteConversation={handleDeleteConversation}
            onArchiveConversation={handleArchiveConversation}
            onStartConversation={handleStartConversation}
            items={items}
            currentUser={user}
          />
        </div>

        <div className="chat-main">
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBlockUser={handleBlockUser}
              currentUser={user}
              items={items}
            />
          ) : (
            <div className="no-conversation">
              <div className="no-conversation-content">
                <div className="no-conversation-icon">💬</div>
                <h3>No conversation selected</h3>
                <p>Select a conversation from the list or start a new one</p>
                <button 
                  className="start-conversation-btn"
                  onClick={() => {
                    const email = prompt('Enter email address to start conversation:');
                    if (email) {
                      handleStartConversation(email);
                    }
                  }}
                >
                  Start New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
