import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MapView from '../components/map/MapView';
import MapFilters from '../components/map/MapFilters';
import ItemLocationCard from '../components/map/ItemLocationCard';

function MapPage({ items, searchTerm, activeCategory }) {
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapFilters, setMapFilters] = useState({
    radius: 10, // km
    category: 'all',
    showOnlyAvailable: true,
    sortBy: 'distance'
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Seattle coordinates if geolocation fails
          setUserLocation({
            lat: 47.6062,
            lng: -122.3321
          });
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // Default location if geolocation not supported
      setUserLocation({
        lat: 47.6062,
        lng: -122.3321
      });
    }
  }, []);

  // Filter and process items for map display
  const mapItems = useMemo(() => {
    if (!items || !userLocation) return [];

    let filteredItems = items.filter(item => {
      // Filter by search term
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filter by category
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Filter by map-specific category
      if (mapFilters.category !== 'all' && item.category !== mapFilters.category) {
        return false;
      }

      // Filter by availability
      if (mapFilters.showOnlyAvailable && item.status === 'completed') {
        return false;
      }

      // Filter by radius if item has coordinates
      if (item.coordinates && mapFilters.radius) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          item.coordinates.lat,
          item.coordinates.lng
        );
        if (distance > mapFilters.radius) {
          return false;
        }
      }

      return true;
    });

    // Add distance calculation and sort
    filteredItems = filteredItems.map(item => {
      if (item.coordinates) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          item.coordinates.lat,
          item.coordinates.lng
        );
        return { ...item, distance: distance.toFixed(1) };
      }
      return { ...item, distance: null };
    });

    // Sort items
    switch (mapFilters.sortBy) {
      case 'distance':
        filteredItems.sort((a, b) => {
          if (!a.distance) return 1;
          if (!b.distance) return -1;
          return parseFloat(a.distance) - parseFloat(b.distance);
        });
        break;
      case 'date':
        filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'popularity':
        filteredItems.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    return filteredItems;
  }, [items, userLocation, searchTerm, activeCategory, mapFilters]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleFilterChange = (filterKey, value) => {
    setMapFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          alert('Unable to get your location. Please enable location services.');
          setIsLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const getLocationSummary = () => {
    const totalItems = mapItems.length;
    const nearbyItems = mapItems.filter(item => item.distance && parseFloat(item.distance) <= 5).length;
    const avgDistance = mapItems.length > 0 
      ? (mapItems.reduce((sum, item) => sum + (parseFloat(item.distance) || 0), 0) / mapItems.length).toFixed(1)
      : 0;

    return {
      totalItems,
      nearbyItems,
      avgDistance
    };
  };

  const locationSummary = getLocationSummary();

  if (isLoadingLocation) {
    return (
      <div className="map-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Getting your location...</h2>
          <p>Please allow location access to see nearby items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-page">
      <div className="map-header">
        <div className="map-title">
          <h1>Item Locations</h1>
          <p>Discover shared items near you</p>
        </div>
        <div className="location-summary">
          <div className="summary-stat">
            <span className="stat-value">{locationSummary.totalItems}</span>
            <span className="stat-label">Items Found</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{locationSummary.nearbyItems}</span>
            <span className="stat-label">Within 5km</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{locationSummary.avgDistance}km</span>
            <span className="stat-label">Avg Distance</span>
          </div>
        </div>
      </div>

      <div className="map-content">
        <div className="map-sidebar">
          <MapFilters 
            filters={mapFilters}
            onFilterChange={handleFilterChange}
            userLocation={userLocation}
            onLocationRequest={handleLocationRequest}
            isLoadingLocation={isLoadingLocation}
          />
          
          <div className="items-list">
            <h3>Nearby Items ({mapItems.length})</h3>
            <div className="items-scroll">
              {mapItems.map(item => (
                <ItemLocationCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={() => handleItemSelect(item)}
                />
              ))}
              {mapItems.length === 0 && (
                <div className="no-items-found">
                  <div className="no-items-icon">📍</div>
                  <h4>No items found</h4>
                  <p>Try adjusting your filters or expanding the search radius</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="map-container">
          <MapView
            items={mapItems}
            userLocation={userLocation}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
            radius={mapFilters.radius}
          />
        </div>
      </div>
    </div>
  );
}

export default MapPage;
