const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const dbConnection = require('../database/connection');

class UserService {
  constructor() {
    this.saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  }

  async initialize() {
    await dbConnection.initialize();
  }

  // Create a new user
  async createUser(userData) {
    try {
      const { firstName, lastName, email, password } = userData;
      
      // Check if user already exists
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      // Start transaction
      await dbConnection.beginTransaction();

      try {
        // Create user
        const userResult = await dbConnection.run(`
          INSERT INTO users (firstName, lastName, email, hashedPassword, isActive, emailVerified)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [firstName, lastName, email, hashedPassword, 1, 0]);

        // Create user profile
        await dbConnection.run(`
          INSERT INTO user_profiles (userId, preferences)
          VALUES (?, ?)
        `, [userResult.id, JSON.stringify({
          notifications: true,
          emailUpdates: true,
          theme: 'light'
        })]);

        await dbConnection.commit();

        // Return user without password
        return await this.findUserById(userResult.id);
      } catch (error) {
        await dbConnection.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by email
  async findUserByEmail(email) {
    try {
      const user = await dbConnection.get(`
        SELECT u.*, up.bio, up.location, up.phone, up.avatar, up.preferences
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.userId
        WHERE u.email = ? AND u.isActive = 1
      `, [email]);

      if (user && user.preferences) {
        try {
          user.preferences = JSON.parse(user.preferences);
        } catch (e) {
          user.preferences = {};
        }
      }

      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by ID
  async findUserById(id) {
    try {
      const user = await dbConnection.get(`
        SELECT u.id, u.firstName, u.lastName, u.email, u.isActive, u.emailVerified, 
               u.lastLogin, u.createdAt, u.updatedAt,
               up.bio, up.location, up.phone, up.avatar, up.preferences
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.userId
        WHERE u.id = ? AND u.isActive = 1
      `, [id]);

      if (user && user.preferences) {
        try {
          user.preferences = JSON.parse(user.preferences);
        } catch (e) {
          user.preferences = {};
        }
      }

      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }

  // Authenticate user
  async authenticateUser(email, password) {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await this.verifyPassword(password, user.hashedPassword);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await dbConnection.run(`
        UPDATE users SET lastLogin = CURRENT_TIMESTAMP, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [user.id]);

      // Return user without password
      const { hashedPassword, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  // Generate password reset token
  async generateResetToken(email) {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('No account found with this email address');
      }

      // Generate secure random token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      await dbConnection.run(`
        UPDATE users 
        SET resetToken = ?, resetTokenExpiry = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [resetToken, resetTokenExpiry.toISOString(), user.id]);

      return { resetToken, email: user.email };
    } catch (error) {
      console.error('Error generating reset token:', error);
      throw error;
    }
  }

  // Reset password using token
  async resetPassword(token, newPassword) {
    try {
      const user = await dbConnection.get(`
        SELECT * FROM users 
        WHERE resetToken = ? AND resetTokenExpiry > CURRENT_TIMESTAMP AND isActive = 1
      `, [token]);

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

      await dbConnection.run(`
        UPDATE users 
        SET hashedPassword = ?, resetToken = NULL, resetTokenExpiry = NULL, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [hashedPassword, user.id]);

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const { bio, location, phone, avatar, preferences } = profileData;

      await dbConnection.run(`
        UPDATE user_profiles 
        SET bio = ?, location = ?, phone = ?, avatar = ?, preferences = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE userId = ?
      `, [bio, location, phone, avatar, JSON.stringify(preferences), userId]);

      return await this.findUserById(userId);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Deactivate user (soft delete)
  async deactivateUser(userId) {
    try {
      await dbConnection.run(`
        UPDATE users 
        SET isActive = 0, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [userId]);

      return { success: true, message: 'User deactivated successfully' };
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
