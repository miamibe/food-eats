
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface RandomPickProps {
  onBack: () => void;
}

const RandomPick = ({ onBack }: RandomPickProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentPick, setCurrentPick] = useState<any>(null);

  const foodOptions = [
    {
      name: "Chicken Tikka Masala",
      restaurant: "Spice Garden",
      price: "$13.99",
      time: "30 min",
      emoji: "🍛",
      reason: "Comfort food with amazing flavors!",
    },
    {
      name: "Pepperoni Pizza",
      restaurant: "Mario's Pizzeria",
      price: "$16.50",
      time: "25 min",
      emoji: "🍕",
      reason: "Classic choice that never disappoints!",
    },
    {
      name: "California Roll Combo",
      restaurant: "Sushi Express",
      price: "$18.99",
      time: "20 min",
      emoji: "🍣",
      reason: "Fresh and light, perfect for today!",
    },
    {
      name: "BBQ Bacon Burger",
      restaurant: "Burger Barn",
      price: "$12.75",
      time: "35 min",
      emoji: "🍔",
      reason: "Indulgent and satisfying!",
    },
    {
      name: "Pad Thai",
      restaurant: "Bangkok Street",
      price: "$11.50",
      time: "28 min",
      emoji: "🍜",
      reason: "Sweet, tangy, and perfectly balanced!",
    },
    {
      name: "Mediterranean Bowl",
      restaurant: "Fresh & Green",
      price: "$14.25",
      time: "22 min",
      emoji: "🥗",
      reason: "Healthy and delicious combination!",
    },
  ];

  const getRandomPick = () => {
    const randomIndex = Math.floor(Math.random() * foodOptions.length);
    return foodOptions[randomIndex];
  };

  const handleRandomPick = () => {
    setIsSpinning(true);
    
    // Simulate spinning animation
    setTimeout(() => {
      setCurrentPick(getRandomPick());
      setIsSpinning(false);
    }, 2000);
  };

  useEffect(() => {
    // Auto-pick when component mounts
    handleRandomPick();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold text-gray-800">Random Pick</h2>
      </div>

      {/* Spinning Animation or Result */}
      <div className="text-center py-8">
        {isSpinning ? (
          <div className="space-y-4">
            <div className="text-6xl animate-spin">🎲</div>
            <h3 className="text-2xl font-bold text-gray-800">Picking your meal...</h3>
            <p className="text-gray-600">Let the universe decide!</p>
          </div>
        ) : currentPick ? (
          <div className="space-y-4">
            <div className="text-6xl mb-4">{currentPick.emoji}</div>
            <Card className="p-6 border-2 border-orange-200 bg-orange-50">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentPick.name}</h3>
              <p className="text-lg text-gray-600 mb-4">{currentPick.restaurant}</p>
              
              <div className="flex justify-center space-x-6 mb-4">
                <div className="text-center">
                  <div className="font-bold text-gray-800">{currentPick.price}</div>
                  <div className="text-sm text-gray-600">Price</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">{currentPick.time}</div>
                  <div className="text-sm text-gray-600">Delivery</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Why this choice?</p>
                <p className="font-semibold text-gray-800">{currentPick.reason}</p>
              </div>
            </Card>
          </div>
        ) : null}
      </div>

      {/* Action Buttons */}
      {!isSpinning && currentPick && (
        <div className="space-y-3">
          <Button
            onClick={handleRandomPick}
            variant="outline"
            className="w-full h-12 border-2 border-orange-300 hover:bg-orange-50 font-semibold"
            disabled={isSpinning}
          >
            🎲 Roll Again
          </Button>
          
          <Button
            className="w-full h-12 bg-green-500 hover:bg-green-600 font-semibold"
          >
            Order This Meal
          </Button>
        </div>
      )}

      {/* Filters Section */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          {["Under $15", "Fast Delivery", "Vegetarian", "Spicy", "Comfort Food"].map((filter) => (
            <Button
              key={filter}
              variant="outline"
              size="sm"
              className="text-xs border-gray-300 hover:bg-gray-100"
            >
              {filter}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RandomPick;
