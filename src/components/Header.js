
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header({ setActiveCategory, activeCategory, searchTerm, setSearchTerm }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const { user, logout } = useAuth();
  // const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ecoswap-theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark-theme');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem('ecoswap-theme', 'dark');
      }
    }
  }, []);

  const categories = [
    { id: 'all', name: 'All Items', icon: '📦' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
    { id: 'household', name: 'Household', icon: '🏠' },
    { id: 'other', name: 'Other', icon: '🔧' }
  ];

  const navigationItems = [
    { path: '/home', label: 'Browse', icon: '🔍', description: 'Find items to borrow' },
    { path: '/share', label: 'Share', icon: '📤', description: 'Share your items' },
    { path: '/requests', label: 'Requests', icon: '📋', description: 'Item requests' },
    { path: '/charity', label: 'Charity', icon: '💝', description: 'Support causes' },
    { path: '/impact', label: 'Impact', icon: '🌱', description: 'Environmental impact' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Your activity' },
    { path: '/map', label: 'Map', icon: '🗺️', description: 'Location view' },
    { path: '/chat', label: 'Messages', icon: '💬', description: 'Chat with users' },
    { path: '/reviews', label: 'Reviews', icon: '⭐', description: 'Ratings & feedback' },
    { path: '/reports', label: 'Reports', icon: '📄', description: 'Analytics & data' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearchDropdown = () => {
    setIsSearchDropdownOpen(!isSearchDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setIsSearchDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <Link to="/home" className="logo-link">
            <div className="logo-icon">🌱</div>
            <div className="logo-text">
              <h1>EcoSwap</h1>
              <span className="logo-tagline">Community Sharing</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <div className="nav-links">
            {navigationItems.slice(0, 5).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                title={item.description}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                {location.pathname === item.path && <div className="nav-indicator"></div>}
              </Link>
            ))}

            {/* More Menu for Additional Items */}
            <div className="nav-more-dropdown">
              <button className="nav-more-btn">
                <span className="nav-icon">⋯</span>
                <span className="nav-text">More</span>
              </button>
              <div className="nav-more-panel">
                {navigationItems.slice(5).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-more-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Search Dropdown - Only show on home page */}
          {isHomePage && (
            <div className="search-dropdown-container" ref={dropdownRef}>
              <button
                className={`search-dropdown-btn ${isSearchDropdownOpen ? 'active' : ''}`}
                onClick={toggleSearchDropdown}
              >
                <span className="search-dropdown-icon">🔍</span>
                <span className="search-dropdown-text">Search & Filter</span>
                <span className={`dropdown-arrow ${isSearchDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>

              {isSearchDropdownOpen && (
                <div className="search-dropdown-panel">
                  <div className="search-section">
                    <div className="search-input-wrapper">
                      <span className="search-icon">🔍</span>
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                      {searchTerm && (
                        <button
                          className="clear-search-btn"
                          onClick={() => setSearchTerm('')}
                          aria-label="Clear search"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="categories-section">
                    <h4 className="categories-title">Filter by Category</h4>
                    <div className="categories-dropdown-grid">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          className={`category-dropdown-btn ${activeCategory === category.id ? 'active' : ''}`}
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <span className="category-icon">{category.icon}</span>
                          <span className="category-name">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Theme Toggle Button */}
        <button
          className="theme-toggle-btn"
          onClick={() => {
            const isDark = document.documentElement.classList.contains('dark-theme');
            if (isDark) {
              document.documentElement.classList.remove('dark-theme');
              localStorage.setItem('ecoswap-theme', 'light');
            } else {
              document.documentElement.classList.add('dark-theme');
              localStorage.setItem('ecoswap-theme', 'dark');
            }
          }}
          title={document.documentElement.classList.contains('dark-theme') ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={document.documentElement.classList.contains('dark-theme') ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="theme-icon" aria-hidden="true"></span>
        </button>

        {/* User Section */}
        <div className="user-section">
          <div className="user-dropdown">
            <button className="user-dropdown-btn">
              <div className="user-avatar">
                <span className="avatar-text">{user?.firstName?.charAt(0) || 'U'}</span>
                <div className="avatar-status"></div>
              </div>
              <div className="user-details">
                <span className="user-name">{user?.firstName || 'User'}</span>
                <span className="user-role">🌟 Member</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            <div className="user-dropdown-panel">
              <div className="user-panel-header">
                <div className="user-panel-avatar">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="user-panel-info">
                  <span className="user-panel-name">{user?.firstName} {user?.lastName}</span>
                  <span className="user-panel-email">{user?.email}</span>
                </div>
              </div>

              <div className="user-panel-links">
                <Link to="/dashboard" className="user-panel-link">
                  <span className="panel-link-icon">📊</span>
                  <span className="panel-link-text">Dashboard</span>
                </Link>
                <Link to="/profile" className="user-panel-link">
                  <span className="panel-link-icon">👤</span>
                  <span className="panel-link-text">Profile Settings</span>
                </Link>
                <Link to="/impact" className="user-panel-link">
                  <span className="panel-link-icon">🌱</span>
                  <span className="panel-link-text">My Impact</span>
                </Link>
              </div>

              <div className="user-panel-footer">
                <button onClick={handleLogout} className="logout-btn">
                  <span className="logout-icon">🚪</span>
                  <span className="logout-text">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-content">
          <div className="mobile-user-info">
            <div className="mobile-user-avatar">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="mobile-user-details">
              <span className="mobile-user-name">{user?.firstName || 'User'}</span>
              <span className="mobile-user-email">{user?.email || 'user@example.com'}</span>
            </div>
          </div>

          <div className="mobile-nav-links">
            <div className="mobile-nav-section">
              <h4 className="mobile-nav-section-title">Main</h4>
              {navigationItems.slice(0, 5).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <div className="mobile-nav-content">
                    <span className="mobile-nav-text">{item.label}</span>
                    <span className="mobile-nav-description">{item.description}</span>
                  </div>
                  {location.pathname === item.path && <div className="mobile-nav-indicator"></div>}
                </Link>
              ))}
            </div>

            <div className="mobile-nav-section">
              <h4 className="mobile-nav-section-title">Tools</h4>
              {navigationItems.slice(5).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <div className="mobile-nav-content">
                    <span className="mobile-nav-text">{item.label}</span>
                    <span className="mobile-nav-description">{item.description}</span>
                  </div>
                  {location.pathname === item.path && <div className="mobile-nav-indicator"></div>}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Search and Categories - Only show on home page */}
          {isHomePage && (
            <div className="mobile-search-section">
              <div className="mobile-search-container">
                <div className="mobile-search-input-wrapper">
                  <span className="mobile-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mobile-search-input"
                  />
                  {searchTerm && (
                    <button
                      className="mobile-clear-search-btn"
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="mobile-categories-section">
                <h4 className="mobile-categories-title">Filter by Category</h4>
                <div className="mobile-categories-grid">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`mobile-category-btn ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => {
                        handleCategorySelect(category.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span className="mobile-category-icon">{category.icon}</span>
                      <span className="mobile-category-name">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mobile-nav-footer">
            <button onClick={handleLogout} className="mobile-logout-btn">
              <span className="mobile-logout-icon">🚪</span>
              <span className="mobile-logout-text">Sign Out</span>
            </button>
          </div>
        </div>
      </div>


    </header>
  );
}

export default Header;