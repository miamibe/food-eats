
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface CuisineAdventureMapProps {
  onBack: () => void;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string;
  delivery_time_min: number;
  delivery_time_max: number;
  rating: number;
  image_url: string;
  description: string;
}

const CuisineAdventureMap = ({ onBack }: CuisineAdventureMapProps) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState("");
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Mock coordinates for restaurants (in a real app, these would be in the database)
  const restaurantLocations = [
    { id: "1", lat: 40.7128, lng: -74.0060 }, // New York
    { id: "2", lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { id: "3", lat: 41.8781, lng: -87.6298 }, // Chicago
    { id: "4", lat: 29.7604, lng: -95.3698 }, // Houston
    { id: "5", lat: 33.4484, lng: -112.0740 }, // Phoenix
    { id: "6", lat: 39.9526, lng: -75.1652 }, // Philadelphia
  ];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (mapboxToken && restaurants.length > 0) {
      initializeMap();
    }
  }, [mapboxToken, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .limit(6);

      if (error) {
        console.error('Error fetching restaurants:', error);
        // Use fallback data if database fails
        setRestaurants([
          {
            id: "1",
            name: "Spice Garden",
            cuisine_type: "Indian",
            delivery_time_min: 20,
            delivery_time_max: 35,
            rating: 4.5,
            image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
            description: "Authentic Indian cuisine with traditional spices"
          },
          {
            id: "2",
            name: "Mario's Pizza",
            cuisine_type: "Italian",
            delivery_time_min: 15,
            delivery_time_max: 30,
            rating: 4.3,
            image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
            description: "Wood-fired pizza and fresh pasta"
          },
          {
            id: "3",
            name: "Sushi Express",
            cuisine_type: "Japanese",
            delivery_time_min: 25,
            delivery_time_max: 40,
            rating: 4.7,
            image_url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
            description: "Fresh sushi and traditional Japanese dishes"
          },
          {
            id: "4",
            name: "Fresh & Green",
            cuisine_type: "Healthy",
            delivery_time_min: 10,
            delivery_time_max: 25,
            rating: 4.4,
            image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
            description: "Organic salads and healthy bowls"
          },
          {
            id: "5",
            name: "Burger House",
            cuisine_type: "American",
            delivery_time_min: 15,
            delivery_time_max: 30,
            rating: 4.2,
            image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
            description: "Gourmet burgers and crispy fries"
          },
          {
            id: "6",
            name: "Taco Fiesta",
            cuisine_type: "Mexican",
            delivery_time_min: 10,
            delivery_time_max: 20,
            rating: 4.0,
            image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
            description: "Authentic Mexican tacos and burritos"
          }
        ]);
      } else {
        setRestaurants(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load restaurants");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-95.7129, 37.0902], // Center of USA
      zoom: 3
    });

    // Add markers for restaurants
    restaurants.forEach((restaurant, index) => {
      const location = restaurantLocations[index];
      if (location && restaurant.id === location.id) {
        // Create a custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'restaurant-marker';
        markerElement.style.cssText = `
          width: 40px;
          height: 40px;
          background-color: #ef4444;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        `;
        markerElement.innerHTML = '🍽️';
        
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.1)';
        });
        
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
        });

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([location.lng, location.lat])
          .addTo(map.current!);

        // Add click event to marker
        markerElement.addEventListener('click', () => {
          setSelectedRestaurant(restaurant);
        });

        markers.current.push(marker);
      }
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  };

  const formatDeliveryTime = (min: number, max: number) => {
    if (min === max) return `${min} min`;
    return `${min}-${max} min`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-800">Cuisine Adventure Map</h2>
        </div>
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500 text-sm">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Cuisine Adventure Map</h2>
      </div>

      {!selectedRestaurant ? (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-gray-700">
              🗺️ Discover Local Restaurants
            </h3>
            <p className="text-sm text-gray-500">
              Click on restaurant markers to explore delicious dishes available for delivery!
            </p>
          </div>

          {/* Mapbox Token Input */}
          {!mapboxToken && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="space-y-3">
                <h4 className="font-medium text-blue-800">Setup Required</h4>
                <p className="text-sm text-blue-700">
                  Enter your Mapbox public token to view the interactive map. 
                  Get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
                </p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    onChange={(e) => setMapboxToken(e.target.value)}
                  />
                  <Button 
                    onClick={() => mapboxToken && initializeMap()}
                    disabled={!mapboxToken}
                    size="sm"
                  >
                    Load Map
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Map Container */}
          {mapboxToken && (
            <div className="relative bg-gray-100 rounded-xl h-80 overflow-hidden border-2 border-gray-200">
              <div ref={mapContainer} className="absolute inset-0" />
            </div>
          )}

          {/* Restaurant Grid (fallback when no map) */}
          {!mapboxToken && (
            <div className="grid grid-cols-2 gap-3">
              {restaurants.map((restaurant) => (
                <Card 
                  key={restaurant.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-800 mb-1">{restaurant.name}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{restaurant.cuisine_type}</span>
                      <span>{formatDeliveryTime(restaurant.delivery_time_min, restaurant.delivery_time_max)}</span>
                    </div>
                    {restaurant.rating && (
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-xs text-gray-600 ml-1">{restaurant.rating}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-orange-200">
              <img
                src={selectedRestaurant.image_url}
                alt={selectedRestaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop';
                }}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{selectedRestaurant.name}</h3>
            <p className="text-gray-600">{selectedRestaurant.description}</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">★</span>
                <span>{selectedRestaurant.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDeliveryTime(selectedRestaurant.delivery_time_min, selectedRestaurant.delivery_time_max)}</span>
              </div>
            </div>
          </div>

          <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-2">🍽️ Cuisine Adventure Unlocked!</h4>
              <p className="text-sm text-gray-600 mb-3">
                You've discovered {selectedRestaurant.cuisine_type} cuisine! Ready to explore their delicious menu?
              </p>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setSelectedRestaurant(null)}
                  variant="outline" 
                  className="flex-1"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Back to Map
                </Button>
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                  View Menu
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CuisineAdventureMap;
