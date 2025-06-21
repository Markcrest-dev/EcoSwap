import { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);

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
    <div className="app">
      <header>
        <h1>🌱 EcoSwap</h1>
        <p>Testing - Routing will be added back</p>
      </header>
      <main>
        <div>
          <h2>Items: {items.length}</h2>
          <button onClick={() => addItem({ title: 'Test Item', description: 'Test' })}>
            Add Test Item
          </button>
        </div>
      </main>
      <footer>
        <p>EcoSwap - Reducing waste one item at a time</p>
      </footer>
    </div>
  );
}

export default App;
