function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="auth-loading">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
