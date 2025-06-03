import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
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
          <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-gray-50">
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
          <div className="space-y-2">
            {meals.map((meal) => (
              <Card 
                key={meal.id} 
                className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleAddToCart(meal)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{meal.emoji || '🍽️'}</span>
                      <div>
                        <h5 className="font-medium text-gray-800">{meal.name}</h5>
                        {meal.description && (
                          <p className="text-sm text-gray-600">{meal.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{formatPrice(meal.price)}</p>
                    <p className="text-sm text-gray-500">{formatTime(meal.preparation_time)}</p>
                  </div>
                </div>
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