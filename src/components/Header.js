
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header({ setActiveCategory, activeCategory, searchTerm, setSearchTerm }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, logout, isAuthenticated } = useAuth();
  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'household', name: 'Household' },
    { id: 'other', name: 'Other' }
  ];

  return (
    <header>
      <div className="logo">
        <Link to="/" className="logo-link">
          <h1>🌱 EcoSwap</h1>
          <p>Share & find free used items in your community</p>
        </Link>
      </div>

      <nav className="main-nav">
        <Link to="/" className={`nav-link ${isHomePage ? 'active' : ''}`}>
          Browse Items
        </Link>
        <Link to="/share" className={`nav-link ${location.pathname === '/share' ? 'active' : ''}`}>
          Share Item
        </Link>
      </nav>

      <nav className="auth-nav">
        {isAuthenticated ? (
          <>
            <span className="user-greeting">
              Hello, {user.firstName}!
            </span>
            <button onClick={logout} className="auth-link logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`auth-link ${location.pathname === '/login' ? 'active' : ''}`}>
              Login
            </Link>
            <Link to="/register" className={`auth-link ${location.pathname === '/register' ? 'active' : ''}`}>
              Register
            </Link>
          </>
        )}
      </nav>

      {isHomePage && (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <nav className="categories">
            {categories.map(category => (
              <button
                key={category.id}
                className={activeCategory === category.id ? 'active' : ''}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}

export default Header;