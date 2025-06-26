import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

function AuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // If authenticated, redirect to home, otherwise to login
  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
}

export default AuthRedirect;
