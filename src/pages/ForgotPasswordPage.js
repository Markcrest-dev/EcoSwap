import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { forgotPassword } = useAuth();

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const result = await forgotPassword(email);
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setSuccessMessage(result.message);
    } else {
      setErrors({ general: result.error });
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h2>Check Your Email</h2>
            <p>We've sent password reset instructions to your email</p>
          </div>

          <div className="success-message">
            <div className="success-icon">✅</div>
            <p>{successMessage}</p>
            <p className="success-note">
              If you don't see the email in your inbox, please check your spam folder.
            </p>
          </div>

          <div className="auth-links">
            <div className="auth-switch">
              <span>Remember your password? </span>
              <Link to="/login" className="switch-link">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Forgot Password?</h2>
          <p>Enter your email address and we'll send you reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                Sending...
              </>
            ) : (
              'Send Reset Instructions'
            )}
          </button>
        </form>

        <div className="auth-links">
          <div className="auth-switch">
            <span>Remember your password? </span>
            <Link to="/login" className="switch-link">
              Sign in here
            </Link>
          </div>
          <div className="auth-switch">
            <span>Don't have an account? </span>
            <Link to="/register" className="switch-link">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
