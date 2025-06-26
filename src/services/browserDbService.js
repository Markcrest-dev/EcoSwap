// Browser-compatible database service using IndexedDB
class BrowserDbService {
  constructor() {
    this.dbName = 'EcoSwapDB';
    this.version = 1;
    this.db = null;
  }

  async initialize() {
    if (this.db) {
      console.log('Database already initialized');
      return this.db;
    }

    return new Promise((resolve, reject) => {
      console.log('Initializing IndexedDB...');
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open database:', request.error);
        reject(new Error('Failed to open database: ' + request.error?.message));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('Database initialized successfully');

        // Add error handler for the database connection
        this.db.onerror = (event) => {
          console.error('Database error:', event.target.error);
        };

        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        console.log('Upgrading database schema...');
        const db = event.target.result;

        // Create users store
        if (!db.objectStoreNames.contains('users')) {
          console.log('Creating users store...');
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('resetToken', 'resetToken', { unique: false });
        }

        // Create user profiles store
        if (!db.objectStoreNames.contains('userProfiles')) {
          console.log('Creating userProfiles store...');
          const profileStore = db.createObjectStore('userProfiles', { keyPath: 'id', autoIncrement: true });
          profileStore.createIndex('userId', 'userId', { unique: true });
        }

        console.log('Database schema upgrade completed');
      };
    });
  }

  async addUser(userData) {
    try {
      // Check if user already exists BEFORE starting transaction
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password BEFORE starting transaction
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

      // Now start the transaction for the actual database operations
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['users', 'userProfiles'], 'readwrite');
        const userStore = transaction.objectStore('users');
        const profileStore = transaction.objectStore('userProfiles');

        // Handle transaction completion
        transaction.oncomplete = async () => {
          try {
            // Fetch the complete user data after transaction completes
            const fullUser = await this.getUserById(userId);
            resolve(fullUser);
          } catch (error) {
            reject(new Error('Failed to retrieve created user: ' + error.message));
          }
        };

        transaction.onerror = () => {
          reject(new Error('Transaction failed: ' + transaction.error?.message));
        };

        transaction.onabort = () => {
          reject(new Error('Transaction was aborted'));
        };

        let userId;

        const userRequest = userStore.add(user);

        userRequest.onsuccess = (event) => {
          userId = event.target.result;

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

          profileRequest.onerror = () => {
            transaction.abort();
          };
        };

        userRequest.onerror = () => {
          transaction.abort();
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');

      transaction.onerror = () => {
        reject(new Error('Transaction failed: ' + transaction.error?.message));
      };

      const request = index.get(email);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get user by email: ' + request.error?.message));
      };
    });
  }

  async getUserById(id) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users', 'userProfiles'], 'readonly');
      const userStore = transaction.objectStore('users');
      const profileStore = transaction.objectStore('userProfiles');

      transaction.onerror = () => {
        reject(new Error('Transaction failed: ' + transaction.error?.message));
      };

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
        reject(new Error('Failed to get user by ID: ' + userRequest.error?.message));
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
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');

      transaction.onerror = () => {
        reject(new Error('Transaction failed: ' + transaction.error?.message));
      };

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
          reject(new Error('Failed to update user: ' + putRequest.error?.message));
        };
      };

      getRequest.onerror = () => {
        reject(new Error('Failed to get user for update: ' + getRequest.error?.message));
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
      // Ensure database is ready before seeding
      if (!this.db) {
        throw new Error('Database not initialized');
      }

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
      // Don't throw the error to prevent app initialization failure
    }
  }
}

export default new BrowserDbService();
