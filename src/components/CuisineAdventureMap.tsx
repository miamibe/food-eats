
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  // Mock coordinates for restaurants positioned on the illustrated map
  const restaurantPositions = [
    { id: "1", top: "45%", left: "20%" }, // Europe
    { id: "2", top: "55%", left: "15%" }, // Europe
    { id: "3", top: "35%", left: "75%" }, // Asia
    { id: "4", top: "25%", left: "70%" }, // Asia
    { id: "5", top: "40%", left: "12%" }, // North America
    { id: "6", top: "65%", left: "25%" }, // Africa
  ];

  useEffect(() => {
    fetchRestaurants();
  }, []);

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
              🗺️ Discover Global Cuisines
            </h3>
            <p className="text-sm text-gray-500">
              Tap on restaurant markers around the world to explore delicious dishes!
            </p>
          </div>

          {/* Illustrated World Map */}
          <div className="relative bg-gradient-to-b from-blue-100 to-green-100 rounded-xl h-80 overflow-hidden border-2 border-gray-200">
            {/* World Map Illustration */}
            <svg 
              viewBox="0 0 400 200" 
              className="absolute inset-0 w-full h-full"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
            >
              {/* Continents */}
              {/* North America */}
              <path 
                d="M20 40 L80 35 L85 50 L90 70 L85 80 L75 85 L60 80 L45 75 L25 65 Z" 
                fill="#86efac" 
                stroke="#22c55e" 
                strokeWidth="1"
              />
              {/* South America */}
              <path 
                d="M70 100 L85 95 L90 120 L85 150 L75 155 L65 150 L60 130 L65 110 Z" 
                fill="#86efac" 
                stroke="#22c55e" 
                strokeWidth="1"
              />
              {/* Europe */}
              <path 
                d="M140 30 L180 35 L185 50 L175 60 L160 55 L145 50 Z" 
                fill="#86efac" 
                stroke="#22c55e" 
                strokeWidth="1"
              />
              {/* Africa */}
              <path 
                d="M150 70 L190 75 L195 120 L185 140 L170 145 L155 140 L145 120 L148 90 Z" 
                fill="#86efac" 
                stroke="#22c55e" 
                strokeWidth="1"
              />
              {/* Asia */}
              <path 
                d="M200 25 L320 30 L340 45 L345 70 L335 85 L310 90 L280 85 L250 80 L220 75 L205 60 L195 45 Z" 
                fill="#86efac" 
                stroke="#22c55e" 
                strokeWidth="1"
              />
              {/* Australia */}
              <path 
                d="M290 140 L330 145 L335 160 L320 165 L295 160 Z" 
                fill="#86efac" 
                stroke="#22c55e" 
                strokeWidth="1"
              />
            </svg>

            {/* Restaurant Markers */}
            {restaurants.map((restaurant, index) => {
              const position = restaurantPositions[index];
              if (!position || restaurant.id !== position.id) return null;

              return (
                <button
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(restaurant)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500 border-3 border-white rounded-full cursor-pointer flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform z-10 animate-pulse"
                  style={{ 
                    top: position.top, 
                    left: position.left,
                    animationDelay: `${index * 0.3}s`
                  }}
                >
                  🍽️
                </button>
              );
            })}

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-2xl animate-bounce">☀️</div>
            <div className="absolute bottom-4 left-4 text-xl animate-pulse">🌊</div>
            <div className="absolute top-1/3 left-1/3 text-lg animate-pulse opacity-70">⛵</div>
            <div className="absolute bottom-1/3 right-1/4 text-lg animate-pulse opacity-70">✈️</div>
          </div>

          {/* Restaurant Grid (fallback) */}
          <div className="grid grid-cols-2 gap-3 mt-6">
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
