import { useState, useEffect, useRef } from 'react';

function MapView({ items, userLocation, selectedItem, onItemSelect, radius }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userMarker, setUserMarker] = useState(null);
  const [radiusCircle, setRadiusCircle] = useState(null);

  // Initialize map (using a simple canvas-based map for demo)
  useEffect(() => {
    if (mapRef.current && userLocation) {
      initializeMap();
    }
  }, [userLocation]);

  // Update markers when items change
  useEffect(() => {
    if (mapInstance && items) {
      updateMarkers();
    }
  }, [mapInstance, items, selectedItem]);

  // Update radius circle
  useEffect(() => {
    if (mapInstance && userLocation && radius) {
      updateRadiusCircle();
    }
  }, [mapInstance, userLocation, radius]);

  const initializeMap = () => {
    const canvas = mapRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const map = {
      canvas,
      ctx,
      center: userLocation,
      zoom: 12,
      width: canvas.width,
      height: canvas.height
    };
    
    setMapInstance(map);
    drawMap(map);
  };

  const drawMap = (map) => {
    const { ctx, width, height, center, zoom } = map;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#e8f4f8';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#d0e8f0';
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw coordinate system
    drawCoordinateSystem(map);
  };

  const drawCoordinateSystem = (map) => {
    const { ctx, width, height } = map;
    
    // Draw center lines
    ctx.strokeStyle = '#a0c8d0';
    ctx.lineWidth = 2;
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  const latLngToPixel = (lat, lng, map) => {
    const { center, width, height, zoom } = map;
    
    // Simple projection (not geographically accurate, but good for demo)
    const scale = Math.pow(2, zoom - 10) * 100000;
    
    const x = width / 2 + (lng - center.lng) * scale;
    const y = height / 2 - (lat - center.lat) * scale;
    
    return { x, y };
  };

  const updateMarkers = () => {
    if (!mapInstance) return;
    
    drawMap(mapInstance);
    
    // Draw user location
    if (userLocation) {
      drawUserMarker(mapInstance, userLocation);
    }
    
    // Draw radius circle
    if (radiusCircle) {
      drawRadiusCircle(mapInstance, userLocation, radius);
    }
    
    // Draw item markers
    items.forEach(item => {
      if (item.coordinates) {
        drawItemMarker(mapInstance, item, selectedItem?.id === item.id);
      }
    });
  };

  const drawUserMarker = (map, location) => {
    const { ctx } = map;
    const { x, y } = latLngToPixel(location.lat, location.lng, map);
    
    // Draw user marker (blue circle with white center)
    ctx.fillStyle = '#007bff';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw pulse effect
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const drawRadiusCircle = (map, center, radiusKm) => {
    const { ctx } = map;
    const { x, y } = latLngToPixel(center.lat, center.lng, map);
    
    // Convert km to pixels (approximate)
    const radiusPixels = (radiusKm / 10) * 100; // Rough conversion for demo
    
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(x, y, radiusPixels, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  };

  const drawItemMarker = (map, item, isSelected) => {
    const { ctx } = map;
    const { x, y } = latLngToPixel(item.coordinates.lat, item.coordinates.lng, map);
    
    // Get category color
    const color = getCategoryColor(item.category);
    
    // Draw marker
    const size = isSelected ? 16 : 12;
    
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(x + 2, y + 2, size, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw marker body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw marker border
    ctx.strokeStyle = isSelected ? '#ffffff' : '#333333';
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw category icon
    ctx.fillStyle = '#ffffff';
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(getCategoryIcon(item.category), x, y);
  };

  const getCategoryColor = (category) => {
    const colors = {
      clothing: '#e74c3c',
      electronics: '#3498db',
      furniture: '#f39c12',
      household: '#2ecc71',
      other: '#9b59b6'
    };
    return colors[category] || '#95a5a6';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      clothing: '👕',
      electronics: '📱',
      furniture: '🪑',
      household: '🏠',
      other: '🔧'
    };
    return icons[category] || '📦';
  };

  const updateRadiusCircle = () => {
    // This will be handled in updateMarkers
  };

  const handleCanvasClick = (event) => {
    if (!mapInstance) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Check if click is on any item marker
    items.forEach(item => {
      if (item.coordinates) {
        const { x, y } = latLngToPixel(item.coordinates.lat, item.coordinates.lng, mapInstance);
        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
        
        if (distance <= 16) { // Click tolerance
          onItemSelect(item);
        }
      }
    });
  };

  const zoomIn = () => {
    if (mapInstance) {
      mapInstance.zoom = Math.min(mapInstance.zoom + 1, 16);
      updateMarkers();
    }
  };

  const zoomOut = () => {
    if (mapInstance) {
      mapInstance.zoom = Math.max(mapInstance.zoom - 1, 8);
      updateMarkers();
    }
  };

  const centerOnUser = () => {
    if (mapInstance && userLocation) {
      mapInstance.center = userLocation;
      updateMarkers();
    }
  };

  return (
    <div className="map-view">
      <div className="map-controls">
        <button className="map-control-btn" onClick={zoomIn} title="Zoom In">
          ➕
        </button>
        <button className="map-control-btn" onClick={zoomOut} title="Zoom Out">
          ➖
        </button>
        <button className="map-control-btn" onClick={centerOnUser} title="Center on Me">
          🎯
        </button>
      </div>
      
      <canvas
        ref={mapRef}
        className="map-canvas"
        onClick={handleCanvasClick}
        style={{ width: '100%', height: '100%' }}
      />
      
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-marker user-marker"></div>
          <span>Your Location</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker item-marker"></div>
          <span>Available Items</span>
        </div>
        <div className="legend-item">
          <div className="legend-line"></div>
          <span>Search Radius</span>
        </div>
      </div>
      
      {selectedItem && (
        <div className="map-popup">
          <div className="popup-header">
            <h4>{selectedItem.title}</h4>
            <button 
              className="popup-close"
              onClick={() => onItemSelect(null)}
            >
              ✕
            </button>
          </div>
          <div className="popup-content">
            <p>{selectedItem.description}</p>
            <div className="popup-meta">
              <span className="popup-category">
                {getCategoryIcon(selectedItem.category)} {selectedItem.category}
              </span>
              {selectedItem.distance && (
                <span className="popup-distance">
                  📍 {selectedItem.distance}km away
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;
