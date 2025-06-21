import ItemList from '../components/ItemList';

function HomePage({ items, activeCategory, setActiveCategory, searchTerm, setSearchTerm }) {
  const filteredItems = items.filter(item => {
    return (activeCategory === 'all' || item.category === activeCategory) &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="home-page">
      <div className="page-header">
        <h2>Available Items</h2>
        <p>Find free items shared by your community</p>
      </div>
      <ItemList items={filteredItems} />
    </div>
  );
}

export default HomePage;
