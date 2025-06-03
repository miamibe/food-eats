
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Restaurant {
  id: string;
  name: string;
  image_url: string;
  cuisine_type: string;
  delivery_time_min: number;
  delivery_time_max: number;
  rating: number;
}

interface RestaurantCatalogueProps {
  onRestaurantClick: (restaurantId: string, restaurantName: string) => void;
}

const RestaurantCatalogue = ({ onRestaurantClick }: RestaurantCatalogueProps) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      console.log('Fetching restaurants...');
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching restaurants:', error);
        toast.error("Failed to load restaurants");
        return;
      }

      // If no restaurants in database, use fallback data
      if (!data || data.length === 0) {
        console.log('No restaurants found, using fallback data');
        setRestaurants([
          {
            id: "1",
            name: "Spice Garden",
            image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
            cuisine_type: "Indian",
            delivery_time_min: 20,
            delivery_time_max: 35,
            rating: 4.5
          },
          {
            id: "2",
            name: "Mario's Pizza",
            image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
            cuisine_type: "Italian",
            delivery_time_min: 15,
            delivery_time_max: 30,
            rating: 4.3
          },
          {
            id: "3",
            name: "Sushi Express",
            image_url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
            cuisine_type: "Japanese",
            delivery_time_min: 25,
            delivery_time_max: 40,
            rating: 4.7
          },
          {
            id: "4",
            name: "Fresh & Green",
            image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
            cuisine_type: "Healthy",
            delivery_time_min: 10,
            delivery_time_max: 25,
            rating: 4.4
          },
          {
            id: "5",
            name: "Burger House",
            image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
            cuisine_type: "American",
            delivery_time_min: 15,
            delivery_time_max: 30,
            rating: 4.2
          },
          {
            id: "6",
            name: "Taco Bell",
            image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
            cuisine_type: "Mexican",
            delivery_time_min: 10,
            delivery_time_max: 20,
            rating: 4.0
          }
        ]);
      } else {
        setRestaurants(data);
        console.log('Fetched restaurants:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong");
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
      <div className="px-2">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Restaurants</h3>
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500 text-sm">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Restaurants</h3>
      <div className="grid grid-cols-2 gap-4">
        {restaurants.map((restaurant) => (
          <Card 
            key={restaurant.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onRestaurantClick(restaurant.id, restaurant.name)}
          >
            <div className="aspect-square bg-gray-100">
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className="w-full h-full object-cover"
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
  );
};

export default RestaurantCatalogue;
