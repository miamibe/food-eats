import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Loader2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart, addToCart } from "@/lib/cart";

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

interface SimilarMeal {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  deliveryTime: string;
  emoji: string;
  description: string;
  relevance_score: number;
  match_explanation?: string;
}

interface CuisineAdventureMapProps {
  onBack: () => void;
}

interface CountryInfo {
  top: string;
  left: string;
  label: string;
  dishes: string[];
}

const CuisineAdventureMap = ({ onBack }: CuisineAdventureMapProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [similarMeals, setSimilarMeals] = useState<SimilarMeal[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const { dispatch } = useCart();

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

  const fetchSimilarMeals = async (description: string) => {
    setIsLoadingSimilar(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-meals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: description }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch similar meals');
      }

      const data = await response.json();
      setSimilarMeals(data.meals || []);
    } catch (error) {
      console.error('Error fetching similar meals:', error);
      toast.error("Failed to load similar dishes");
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  const getRegionForCuisine = (cuisineType: string): CountryInfo => {
    const cuisineMap: Record<string, CountryInfo> = {
      'Russian': {
        top: '25%',
        left: '65%',
        label: 'Russia',
        dishes: ['Borscht', 'Beef Stroganoff', 'Pelmeni']
      },
      'Japanese': {
        top: '35%',
        left: '85%',
        label: 'Japan',
        dishes: ['Sushi', 'Ramen', 'Tempura']
      },
      'Thai': {
        top: '45%',
        left: '75%',
        label: 'Thailand',
        dishes: ['Pad Thai', 'Green Curry', 'Tom Yum']
      },
      'Italian': {
        top: '35%',
        left: '50%',
        label: 'Italy',
        dishes: ['Pizza', 'Pasta', 'Risotto']
      },
      'European': {
        top: '30%',
        left: '48%',
        label: 'Europe',
        dishes: ['Schnitzel', 'Paella', 'Moules-frites']
      },
      'American': {
        top: '35%',
        left: '20%',
        label: 'USA',
        dishes: ['Burger', 'Hot Dog', 'BBQ Ribs']
      }
    };
    
    return cuisineMap[cuisineType] || { 
      top: '50%', 
      left: '50%', 
      label: cuisineType,
      dishes: ['Local Specialty', 'Traditional Dish', 'Regional Favorite']
    };
  };

  const formatDeliveryTime = (min: number, max: number) => {
    return `${min}-${max} min`;
  };

  const handleRegionSelect = (restaurantId: string) => {
    setSelectedRegion(restaurantId);
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      const searchQuery = `${restaurant.name} ${restaurant.description || ''} ${restaurant.cuisine_type} cuisine`;
      fetchSimilarMeals(searchQuery);
    }
  };

  const handleAddToCart = (meal: SimilarMeal) => {
    addToCart(dispatch, {
      id: meal.id,
      name: meal.name,
      price: typeof meal.price === 'string' ? parseFloat(meal.price.replace('$', '')) : meal.price,
      quantity: 1,
      restaurant: meal.restaurant,
      emoji: meal.emoji
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Cuisine Adventure Map</h2>
          <p className="text-sm text-gray-500 mt-1">Click on pins to discover authentic dishes from around the world!</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Game-like World Map with Restaurant Pins */}
        <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden bg-blue-50">
          {/* Base Map Image */}
          <img 
            src="/map-imagen.png" 
            alt="World Map"
            className="w-full h-full object-cover"
          />

          {/* Restaurant Pins */}
          {!isLoading && restaurants.map((restaurant) => {
            const position = getRegionForCuisine(restaurant.cuisine_type);
            return (
              <button
                key={restaurant.id}
                onClick={() => handleRegionSelect(restaurant.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  top: position.top,
                  left: position.left,
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform cursor-pointer hover:bg-red-600">
                    🍽️
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1.5 rounded-lg shadow-lg mt-1 text-sm whitespace-nowrap z-10">
                    <div className="font-medium text-gray-800">{position.label}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      {position.dishes.map((dish, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <span className="text-gray-300 mx-1">•</span>}
                          {dish}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
                <p className="text-gray-600">Loading restaurants...</p>
              </div>
            </div>
          )}
        </div>

        {/* Selected Restaurant Details */}
        {selectedRegion && (
          <div className="space-y-4">
            {restaurants.filter(r => r.id === selectedRegion).map(restaurant => (
              <Card key={restaurant.id} className="p-4">
                <div className="space-y-4">
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

                  {restaurant.description && (
                    <p className="text-gray-600 text-sm">{restaurant.description}</p>
                  )}
                </div>
              </Card>
            ))}

            {/* Similar Meals Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Available Near You</h4>
              
              {isLoadingSimilar ? (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-600" />
                  <p className="text-gray-500 text-sm">Finding similar dishes...</p>
                </div>
              ) : similarMeals.length > 0 ? (
                <div className="space-y-2">
                  {similarMeals.map((meal) => (
                    <Card 
                      key={meal.id} 
                      className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleAddToCart(meal)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{meal.emoji}</span>
                            <div>
                              <h5 className="font-medium text-gray-800">{meal.name}</h5>
                              <p className="text-sm text-gray-600">{meal.restaurant}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">${meal.price}</p>
                          <p className="text-sm text-gray-500">{meal.deliveryTime}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No similar dishes found nearby
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CuisineAdventureMap;