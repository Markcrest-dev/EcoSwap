import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import CharityPage from './pages/CharityPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import ImpactPage from './pages/ImpactPage';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import RegisterPage from './pages/RegisterPage';
import ReportsPage from './pages/ReportsPage';
import RequestsPage from './pages/RequestsPage';
import ReviewsPage from './pages/ReviewsPage';
import SharePage from './pages/SharePage';
import './styles.css';

function App() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load items from localStorage on initial render and seed sample data if needed
  useEffect(() => {
    const savedItems = localStorage.getItem('ecoswap-items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      // Import and use sample data service
      import('./services/sampleDataService').then(({ default: sampleDataService }) => {
        const sampleItems = sampleDataService.seedSampleData();
        setItems(sampleItems);
      });
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
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes - authentication pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected routes - main application */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <HomePage
                      items={items}
                      activeCategory={activeCategory}
                      setActiveCategory={setActiveCategory}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                    />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/home" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/share"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <SharePage addItem={addItem} />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <DashboardPage items={items} setItems={setItems} />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <AdminDashboard items={items} setItems={setItems} />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <ReportsPage items={items} />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <MapPage
                      items={items}
                      searchTerm={searchTerm}
                      activeCategory={activeCategory}
                    />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <ChatPage items={items} />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <ReviewsPage items={items} />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <RequestsPage items={items} />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/charity"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <CharityPage items={items} />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />
            <Route
              path="/impact"
              element={
                <ProtectedRoute>
                  <Header
                    setActiveCategory={setActiveCategory}
                    activeCategory={activeCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <main>
                    <ImpactPage items={items} />
                  </main>
                  <footer>
                    <p>EcoSwap - Reducing waste one item at a time</p>
                  </footer>
                </ProtectedRoute>
              }
            />

            {/* Redirect any other path to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;