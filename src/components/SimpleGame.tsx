import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCart, addToCart } from "@/lib/cart";
import { toast } from "sonner";

interface SimilarMeal {
  id: string;
  name: string;
  restaurant: string;
  price: number | string;
  deliveryTime: string;
  emoji: string;
  description: string;
  relevance_score?: number;
  match_explanation?: string;
}

interface SimpleGameProps {
  onBack: () => void;
}

const SimpleGame = ({ onBack }: SimpleGameProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [likedFoods, setLikedFoods] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<SimilarMeal[]>([]);
  const { dispatch } = useCart();

  const foods = [
    "🍕 Pizza", "🍔 Burger", "🍜 Ramen", "🌮 Taco", "🍣 Sushi",
    "🥗 Salad", "🍝 Pasta", "🍲 Stew", "🥪 Sandwich", "🍱 Bento",
    "🍛 Curry", "🥘 Paella", "🍖 BBQ", "🍤 Shrimp", "🥙 Wrap"
  ];

  const [currentFood, setCurrentFood] = useState(foods[0]);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setLikedFoods([]);
    setRecommendations([]);
    nextFood();
  };

  const nextFood = () => {
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    setCurrentFood(randomFood);
  };

  const fetchRecommendations = async (likedFoods: string[]) => {
    setIsLoading(true);
    try {
      const searchQuery = likedFoods.map(food => food.split(' ')[1]).join(' ');
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-meals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.meals || []);
      setGameStarted(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error("Failed to get recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const makeChoice = (liked: boolean) => {
    if (liked) {
      const newLikedFoods = [...likedFoods, currentFood];
      setLikedFoods(newLikedFoods);
      
      if (newLikedFoods.length >= 3) {
        fetchRecommendations(newLikedFoods);
      } else {
        nextFood();
      }
    } else {
      nextFood();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Food Matcher Game</h2>
      </div>

      {!gameStarted && recommendations.length === 0 && (
        <div className="text-center space-y-6 py-8">
          <div className="text-6xl">🎮</div>
          <div>
            <h3 className="text-lg font-medium mb-2">Ready to Play?</h3>
            <p className="text-gray-600 mb-6">Like at least 3 foods to discover your perfect meals!</p>
            <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
              Start Game
            </Button>
          </div>
        </div>
      )}

      {gameStarted && (
        <div className="text-center space-y-6 py-8">
          <div className="text-8xl mb-6">{currentFood.split(' ')[0]}</div>
          <h3 className="text-xl font-medium mb-6">{currentFood.split(' ').slice(1).join(' ')}</h3>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => makeChoice(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg"
            >
              ❌ Nope
            </Button>
            <Button
              onClick={() => makeChoice(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
            >
              ❤️ Love it!
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Liked foods: {likedFoods.length}/3
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500">Finding your perfect matches...</p>
        </div>
      )}

      {recommendations.length > 0 && !isLoading && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">
            Based on Your Likes
          </h3>
          <div className="space-y-2">
            {recommendations.map((meal) => (
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
                        <h4 className="font-medium text-gray-800">{meal.name}</h4>
                        <p className="text-sm text-gray-600">{meal.restaurant}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{meal.price}</p>
                    <p className="text-sm text-gray-500">{meal.deliveryTime}</p>
                  </div>
                </div>
                {meal.match_explanation && (
                  <p className="mt-2 text-sm text-gray-600">{meal.match_explanation}</p>
                )}
              </Card>
            ))}
          </div>

          <Button 
            onClick={startGame}
            variant="outline" 
            className="w-full mt-4"
          >
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleGame;