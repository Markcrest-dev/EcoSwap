import { useNavigate } from 'react-router-dom';
import ItemForm from '../components/ItemForm';

function SharePage({ addItem }) {
  const navigate = useNavigate();

  const handleAddItem = (newItem) => {
    addItem(newItem);
    // Show success message and redirect to home
    alert('Item shared successfully! 🌱');
    navigate('/');
  };

  return (
    <div className="share-page">
      <div className="page-header">
        <h2>Share an Item</h2>
        <p>Give your unused items a new life in the community</p>
      </div>
      <ItemForm addItem={handleAddItem} />
    </div>
  );
}

export default SharePage;
