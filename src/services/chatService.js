class ChatService {
  constructor(user) {
    this.user = user;
    this.storageKey = 'ecoswap-chat';
    this.conversationsKey = 'ecoswap-conversations';
    this.messagesKey = 'ecoswap-messages';
    this.blockedUsersKey = 'ecoswap-blocked-users';
    
    // Initialize storage if needed
    this.initializeStorage();
    
    // Generate sample conversations for demo
    this.generateSampleData();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.conversationsKey)) {
      localStorage.setItem(this.conversationsKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.messagesKey)) {
      localStorage.setItem(this.messagesKey, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.blockedUsersKey)) {
      localStorage.setItem(this.blockedUsersKey, JSON.stringify([]));
    }
  }

  generateSampleData() {
    const conversations = this.getStoredConversations();
    if (conversations.length === 0) {
      // Create sample conversations for demo
      const sampleConversations = [
        {
          id: 'conv-1',
          participants: [
            { email: this.user.email, name: `${this.user.firstName} ${this.user.lastName}` },
            { email: 'sarah.j@email.com', name: 'Sarah Johnson' }
          ],
          itemId: null,
          itemTitle: 'Vintage Leather Armchair',
          lastMessage: 'Hi! Is the armchair still available?',
          lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          lastMessageSender: 'sarah.j@email.com',
          unreadCount: 1,
          archived: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'conv-2',
          participants: [
            { email: this.user.email, name: `${this.user.firstName} ${this.user.lastName}` },
            { email: 'mike.chen.tech@gmail.com', name: 'Mike Chen' }
          ],
          itemId: null,
          itemTitle: 'iPhone 12 Pro',
          lastMessage: 'Perfect! When can I pick it up?',
          lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          lastMessageSender: this.user.email,
          unreadCount: 0,
          archived: false,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        }
      ];

      const sampleMessages = {
        'conv-1': [
          {
            id: 'msg-1',
            conversationId: 'conv-1',
            sender: 'sarah.j@email.com',
            senderName: 'Sarah Johnson',
            content: 'Hi! I saw your vintage leather armchair listing. Is it still available?',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            type: 'text',
            read: true
          },
          {
            id: 'msg-2',
            conversationId: 'conv-1',
            sender: this.user.email,
            senderName: `${this.user.firstName} ${this.user.lastName}`,
            content: 'Yes, it\'s still available! It\'s in great condition.',
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
            type: 'text',
            read: true
          },
          {
            id: 'msg-3',
            conversationId: 'conv-1',
            sender: 'sarah.j@email.com',
            senderName: 'Sarah Johnson',
            content: 'Hi! Is the armchair still available?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            type: 'text',
            read: false
          }
        ],
        'conv-2': [
          {
            id: 'msg-4',
            conversationId: 'conv-2',
            sender: 'mike.chen.tech@gmail.com',
            senderName: 'Mike Chen',
            content: 'Hi! I\'m interested in your iPhone 12 Pro. Is it unlocked?',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            type: 'text',
            read: true
          },
          {
            id: 'msg-5',
            conversationId: 'conv-2',
            sender: this.user.email,
            senderName: `${this.user.firstName} ${this.user.lastName}`,
            content: 'Yes, it\'s completely unlocked and works with all carriers.',
            timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
            type: 'text',
            read: true
          },
          {
            id: 'msg-6',
            conversationId: 'conv-2',
            sender: this.user.email,
            senderName: `${this.user.firstName} ${this.user.lastName}`,
            content: 'Perfect! When can I pick it up?',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            type: 'text',
            read: true
          }
        ]
      };

      localStorage.setItem(this.conversationsKey, JSON.stringify(sampleConversations));
      localStorage.setItem(this.messagesKey, JSON.stringify(sampleMessages));
    }
  }

  getStoredConversations() {
    return JSON.parse(localStorage.getItem(this.conversationsKey) || '[]');
  }

  getStoredMessages() {
    return JSON.parse(localStorage.getItem(this.messagesKey) || '{}');
  }

  getStoredBlockedUsers() {
    return JSON.parse(localStorage.getItem(this.blockedUsersKey) || '[]');
  }

  async getConversations() {
    const conversations = this.getStoredConversations();
    const blockedUsers = this.getStoredBlockedUsers();
    
    // Filter out conversations with blocked users
    return conversations
      .filter(conv => 
        !conv.participants.some(p => 
          blockedUsers.includes(p.email) && p.email !== this.user.email
        )
      )
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  }

  async getMessages(conversationId) {
    const allMessages = this.getStoredMessages();
    return allMessages[conversationId] || [];
  }

  async sendMessage(conversationId, content, attachments = []) {
    const message = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender: this.user.email,
      senderName: `${this.user.firstName} ${this.user.lastName}`,
      content,
      attachments,
      timestamp: new Date().toISOString(),
      type: 'text',
      read: false
    };

    // Store message
    const allMessages = this.getStoredMessages();
    if (!allMessages[conversationId]) {
      allMessages[conversationId] = [];
    }
    allMessages[conversationId].push(message);
    localStorage.setItem(this.messagesKey, JSON.stringify(allMessages));

    // Update conversation
    const conversations = this.getStoredConversations();
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: content,
          lastMessageTime: message.timestamp,
          lastMessageSender: this.user.email
        };
      }
      return conv;
    });
    localStorage.setItem(this.conversationsKey, JSON.stringify(updatedConversations));

    return message;
  }

  async createConversation(recipientEmail, itemId = null, initialMessage = '') {
    const conversations = this.getStoredConversations();
    
    // Check if conversation already exists
    const existingConv = conversations.find(conv =>
      conv.participants.some(p => p.email === recipientEmail) &&
      conv.participants.some(p => p.email === this.user.email) &&
      conv.itemId === itemId
    );

    if (existingConv) {
      return existingConv;
    }

    const conversation = {
      id: `conv-${Date.now()}`,
      participants: [
        { email: this.user.email, name: `${this.user.firstName} ${this.user.lastName}` },
        { email: recipientEmail, name: recipientEmail.split('@')[0] } // Simplified name
      ],
      itemId,
      itemTitle: itemId ? 'Item Discussion' : null,
      lastMessage: initialMessage || '',
      lastMessageTime: new Date().toISOString(),
      lastMessageSender: this.user.email,
      unreadCount: 0,
      archived: false,
      createdAt: new Date().toISOString()
    };

    conversations.unshift(conversation);
    localStorage.setItem(this.conversationsKey, JSON.stringify(conversations));

    return conversation;
  }

  async markAsRead(conversationId) {
    const conversations = this.getStoredConversations();
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    });
    localStorage.setItem(this.conversationsKey, JSON.stringify(updatedConversations));

    // Mark messages as read
    const allMessages = this.getStoredMessages();
    if (allMessages[conversationId]) {
      allMessages[conversationId] = allMessages[conversationId].map(msg => ({
        ...msg,
        read: true
      }));
      localStorage.setItem(this.messagesKey, JSON.stringify(allMessages));
    }
  }

  async deleteConversation(conversationId) {
    // Remove conversation
    const conversations = this.getStoredConversations();
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
    localStorage.setItem(this.conversationsKey, JSON.stringify(updatedConversations));

    // Remove messages
    const allMessages = this.getStoredMessages();
    delete allMessages[conversationId];
    localStorage.setItem(this.messagesKey, JSON.stringify(allMessages));
  }

  async archiveConversation(conversationId) {
    const conversations = this.getStoredConversations();
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, archived: true };
      }
      return conv;
    });
    localStorage.setItem(this.conversationsKey, JSON.stringify(updatedConversations));
  }

  async blockUser(userEmail) {
    const blockedUsers = this.getStoredBlockedUsers();
    if (!blockedUsers.includes(userEmail)) {
      blockedUsers.push(userEmail);
      localStorage.setItem(this.blockedUsersKey, JSON.stringify(blockedUsers));
    }
  }

  async unblockUser(userEmail) {
    const blockedUsers = this.getStoredBlockedUsers();
    const updatedBlockedUsers = blockedUsers.filter(email => email !== userEmail);
    localStorage.setItem(this.blockedUsersKey, JSON.stringify(updatedBlockedUsers));
  }

  isUserBlocked(userEmail) {
    const blockedUsers = this.getStoredBlockedUsers();
    return blockedUsers.includes(userEmail);
  }
}

export default ChatService;
