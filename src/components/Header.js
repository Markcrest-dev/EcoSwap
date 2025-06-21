
import { Link, useLocation } from 'react-router-dom';

function Header({ setActiveCategory, activeCategory, searchTerm, setSearchTerm }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
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
        <Link to="/share" className={`nav-link ${!isHomePage ? 'active' : ''}`}>
          Share Item
        </Link>
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