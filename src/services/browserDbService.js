// Browser-compatible database service using IndexedDB
class BrowserDbService {
  constructor() {
    this.dbName = 'EcoSwapDB';
    this.version = 1;
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('resetToken', 'resetToken', { unique: false });
        }

        // Create user profiles store
        if (!db.objectStoreNames.contains('userProfiles')) {
          const profileStore = db.createObjectStore('userProfiles', { keyPath: 'id', autoIncrement: true });
          profileStore.createIndex('userId', 'userId', { unique: true });
        }
      };
    });
  }

  async addUser(userData) {
    const transaction = this.db.transaction(['users', 'userProfiles'], 'readwrite');
    const userStore = transaction.objectStore('users');
    const profileStore = transaction.objectStore('userProfiles');

    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password (simple browser-compatible hashing)
      const hashedPassword = await this.hashPassword(userData.password);

      const user = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        hashedPassword,
        isActive: true,
        emailVerified: false,
        resetToken: null,
        resetTokenExpiry: null,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return new Promise((resolve, reject) => {
        const userRequest = userStore.add(user);
        
        userRequest.onsuccess = (event) => {
          const userId = event.target.result;
          
          // Create user profile
          const profile = {
            userId,
            bio: null,
            location: null,
            phone: null,
            avatar: null,
            preferences: JSON.stringify({
              notifications: true,
              emailUpdates: true,
              theme: 'light'
            }),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const profileRequest = profileStore.add(profile);
          
          profileRequest.onsuccess = async () => {
            const fullUser = await this.getUserById(userId);
            resolve(fullUser);
          };
          
          profileRequest.onerror = () => {
            reject(new Error('Failed to create user profile'));
          };
        };
        
        userRequest.onerror = () => {
          reject(new Error('Failed to create user'));
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    const transaction = this.db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('email');

    return new Promise((resolve, reject) => {
      const request = index.get(email);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to get user by email'));
      };
    });
  }

  async getUserById(id) {
    const transaction = this.db.transaction(['users', 'userProfiles'], 'readonly');
    const userStore = transaction.objectStore('users');
    const profileStore = transaction.objectStore('userProfiles');

    return new Promise((resolve, reject) => {
      const userRequest = userStore.get(id);
      
      userRequest.onsuccess = () => {
        const user = userRequest.result;
        if (!user) {
          resolve(null);
          return;
        }

        // Get user profile
        const profileIndex = profileStore.index('userId');
        const profileRequest = profileIndex.get(id);
        
        profileRequest.onsuccess = () => {
          const profile = profileRequest.result;
          
          // Combine user and profile data
          const fullUser = {
            ...user,
            bio: profile?.bio,
            location: profile?.location,
            phone: profile?.phone,
            avatar: profile?.avatar,
            preferences: profile?.preferences ? JSON.parse(profile.preferences) : {}
          };
          
          // Remove password from response
          delete fullUser.hashedPassword;
          resolve(fullUser);
        };
        
        profileRequest.onerror = () => {
          // Return user without profile if profile fetch fails
          delete user.hashedPassword;
          resolve(user);
        };
      };
      
      userRequest.onerror = () => {
        reject(new Error('Failed to get user by ID'));
      };
    });
  }

  async authenticateUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user || !user.isActive) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await this.verifyPassword(password, user.hashedPassword);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await this.updateUser(user.id, { lastLogin: new Date().toISOString() });

    // Return user without password
    return await this.getUserById(user.id);
  }

  async updateUser(id, updates) {
    const transaction = this.db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');

    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const user = getRequest.result;
        if (!user) {
          reject(new Error('User not found'));
          return;
        }

        const updatedUser = {
          ...user,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        const putRequest = store.put(updatedUser);
        
        putRequest.onsuccess = () => {
          resolve(updatedUser);
        };
        
        putRequest.onerror = () => {
          reject(new Error('Failed to update user'));
        };
      };
      
      getRequest.onerror = () => {
        reject(new Error('Failed to get user for update'));
      };
    });
  }

  async generateResetToken(email) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error('No account found with this email address');
    }

    const resetToken = this.generateSecureToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    await this.updateUser(user.id, { resetToken, resetTokenExpiry });

    return { resetToken, email };
  }

  // Simple browser-compatible password hashing
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'ecoswap-salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async verifyPassword(password, hashedPassword) {
    const hash = await this.hashPassword(password);
    return hash === hashedPassword;
  }

  generateSecureToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async seedDemoData() {
    try {
      const existingUser = await this.getUserByEmail('demo@ecoswap.com');
      if (!existingUser) {
        await this.addUser({
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@ecoswap.com',
          password: 'demo123'
        });
        console.log('Demo user created: demo@ecoswap.com / demo123');
      }
    } catch (error) {
      console.error('Error seeding demo data:', error);
    }
  }
}

export default new BrowserDbService();
