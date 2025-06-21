import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SharePage from './pages/SharePage';
import './styles.css';

function App() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load items from localStorage on initial render
  useEffect(() => {
    const savedItems = localStorage.getItem('ecoswap-items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ecoswap-items', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem) => {
    setItems([...items, { ...newItem, id: Date.now() }]);
  };

  return (
    <Router>
      <div className="app">
        <Header
          setActiveCategory={setActiveCategory}
          activeCategory={activeCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  items={items}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              }
            />
            <Route
              path="/share"
              element={<SharePage addItem={addItem} />}
            />
          </Routes>
        </main>
        <footer>
          <p>EcoSwap - Reducing waste one item at a time</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;