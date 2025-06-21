
import ItemCard from './ItemCard';

function ItemList({ items }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>No items found</h2>
        <p>Be the first to share something with your community!</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default ItemList;