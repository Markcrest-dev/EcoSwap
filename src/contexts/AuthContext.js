import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database and load user from localStorage on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Import and initialize browser database service
        const browserDbService = (await import('../services/browserDbService')).default;
        await browserDbService.initialize();
        await browserDbService.seedDemoData();

        // Check for saved user session in localStorage
        const savedUser = localStorage.getItem('ecoswap-user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);

            // Verify user still exists in database
            const dbUser = await browserDbService.getUserById(userData.id);
            if (dbUser && dbUser.isActive) {
              setUser(dbUser);
            } else {
              // User no longer exists or is inactive, clear localStorage
              localStorage.removeItem('ecoswap-user');
            }
          } catch (error) {
            console.error('Error validating saved user:', error);
            localStorage.removeItem('ecoswap-user');
          }
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('ecoswap-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ecoswap-user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Import browser database service dynamically
      const browserDbService = (await import('../services/browserDbService')).default;

      // Authenticate user with database
      const authenticatedUser = await browserDbService.authenticateUser(email, password);

      setUser(authenticatedUser);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Import browser database service dynamically
      const browserDbService = (await import('../services/browserDbService')).default;

      // Create user in database
      const newUser = await browserDbService.addUser(userData);

      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Import browser database service dynamically
      const browserDbService = (await import('../services/browserDbService')).default;

      // Generate reset token
      const result = await browserDbService.generateResetToken(email);

      // In a real app, this would send an email with the reset token
      // For demo purposes, we'll just return success and log the token
      console.log('Password reset token generated:', result.resetToken);

      return {
        success: true,
        message: 'Password reset instructions sent to your email'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
