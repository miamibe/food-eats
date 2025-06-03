import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, DollarSign, Loader2, Star } from "lucide-react";
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
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllRestaurants();
  }, []);

  const fetchAllRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error("Failed to load restaurants");
    } finally {
      setIsLoading(false);
    }
  };

  const getRegionForCuisine = (cuisineType: string): { top: string; left: string } => {
    const cuisineMap: Record<string, { top: string; left: string }> = {
      'Italian': { top: '35%', left: '45%' },
      'Greek': { top: '38%', left: '48%' },
      'Spanish': { top: '36%', left: '42%' },
      'Mexican': { top: '45%', left: '20%' },
      'American': { top: '40%', left: '25%' },
      'Japanese': { top: '40%', left: '85%' },
      'Chinese': { top: '42%', left: '80%' },
      'Korean': { top: '38%', left: '82%' },
      'Thai': { top: '48%', left: '75%' },
      'Indian': { top: '45%', left: '65%' },
      'Vietnamese': { top: '50%', left: '78%' },
      'Ethiopian': { top: '55%', left: '55%' },
      'Moroccan': { top: '45%', left: '42%' },
      'Nigerian': { top: '52%', left: '45%' }
    };
    
    return cuisineMap[cuisineType] || { top: '50%', left: '50%' };
  };

  const formatDeliveryTime = (min: number, max: number) => {
    return `${min}-${max} min`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Cuisine Adventure Map</h2>
      </div>

      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-gray-700">
            🗺️ Explore World Cuisines
          </h3>
          <p className="text-sm text-gray-500">
            Click on restaurant pins to discover authentic dishes from around the world!
          </p>
        </div>

        {/* Game-like World Map with Restaurant Pins */}
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
          {/* Base Map Image */}
          <img 
            src="/game-like-map.png" 
            alt="World Map" 
            className="w-full h-full object-cover"
          />

          {/* Restaurant Pins */}
          {!isLoading && restaurants.map((restaurant) => {
            const position = getRegionForCuisine(restaurant.cuisine_type);
            return (
              <button
                key={restaurant.id}
                onClick={() => setSelectedRegion(restaurant.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  top: position.top,
                  left: position.left,
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                    🍽️
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded-lg shadow-lg mt-2 text-sm whitespace-nowrap">
                    {restaurant.name}
                    <br />
                    <span className="text-xs text-gray-600">{restaurant.cuisine_type}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
              <p className="text-gray-600">Loading restaurants...</p>
            </div>
          </div>
        )}

        {/* Selected Restaurant Details */}
        {selectedRegion && (
          <Card className="p-4">
            {restaurants.filter(r => r.id === selectedRegion).map(restaurant => (
              <div key={restaurant.id} className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{restaurant.name}</h3>
                    <p className="text-gray-600">{restaurant.cuisine_type} Cuisine</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedRegion(null)}
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDeliveryTime(restaurant.delivery_time_min, restaurant.delivery_time_max)}
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    {restaurant.rating}
                  </span>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  View Menu
                </Button>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};

export default CuisineAdventureMap;