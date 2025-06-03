import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart, addToCart } from "@/lib/cart";

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  image_url: string;
  preparation_time: number;
  category: string;
}

interface RestaurantMealsProps {
  restaurantId: string;
  restaurantName: string;
  onBack: () => void;
}

const RestaurantMeals = ({ restaurantId, restaurantName, onBack }: RestaurantMealsProps) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    fetchMeals();
  }, [restaurantId]);

  const fetchMeals = async () => {
    try {
      console.log('Fetching meals for restaurant:', restaurantId);
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true);

      if (error) {
        console.error('Error fetching meals:', error);
        toast.error("Failed to load meals");
        return;
      }

      setMeals(data || []);
      console.log('Fetched meals:', data);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatTime = (minutes: number) => {
    return `${minutes} min`;
  };

  const handleAddToCart = (meal: Meal) => {
    addToCart(dispatch, {
      id: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1,
      restaurant: restaurantName,
      emoji: meal.emoji || '🍽️'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost\" onClick={onBack} className="p-2 hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <h2 className="text-lg font-medium text-gray-800">{restaurantName}</h2>
        </div>
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500 text-sm">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-gray-50">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
        <h2 className="text-lg font-medium text-gray-800">{restaurantName}</h2>
      </div>

      {/* Meals Grid */}
      {meals.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-700">Available Meals</h3>
          <div className="space-y-3">
            {meals.map((meal) => (
              <Card 
                key={meal.id} 
                className="p-4 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => handleAddToCart(meal)}
              >
                <div className="flex space-x-4">
                  {/* Meal Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {meal.image_url ? (
                      <img
                        src={meal.image_url}
                        alt={meal.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {meal.emoji || '🍽️'}
                      </div>
                    )}
                  </div>

                  {/* Meal Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{meal.name}</h4>
                        {meal.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{meal.description}</p>
                        )}
                        {meal.category && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mt-2">
                            {meal.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-gray-800 font-medium text-sm">{formatPrice(meal.price)}</div>
                        <div className="text-gray-500 text-xs">{formatTime(meal.preparation_time)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 border border-gray-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No meals available at this restaurant.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantMeals;

export default RestaurantMeals