
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Star, ShoppingCart } from "lucide-react";

interface SimpleGameProps {
  onBack: () => void;
}

const SimpleGame = ({ onBack }: SimpleGameProps) => {
  const [score, setScore] = useState(0);
  const [currentFood, setCurrentFood] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [likedFoods, setLikedFoods] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const foods = [
    "🍕 Pizza", "🍔 Burger", "🍜 Ramen", "🌮 Taco", "🍣 Sushi",
    "🥗 Salad", "🍝 Pasta", "🍲 Stew", "🥪 Sandwich", "🍱 Bento",
    "🍛 Curry", "🥘 Paella", "🍖 BBQ", "🍤 Shrimp", "🥙 Wrap"
  ];

  // Mock meal data based on liked foods
  const getMealRecommendations = (likedFoods: string[]) => {
    const meals = [
      { 
        id: 1, 
        name: "Margherita Pizza", 
        restaurant: "Tony's Pizzeria", 
        price: "$14.50", 
        time: "25 min", 
        emoji: "🍕",
        match: "95%",
        reason: "Perfect match for pizza lovers"
      },
      { 
        id: 2, 
        name: "Classic Cheeseburger", 
        restaurant: "Burger House", 
        price: "$12.99", 
        time: "20 min", 
        emoji: "🍔",
        match: "92%",
        reason: "Great choice for burger fans"
      },
      { 
        id: 3, 
        name: "Chicken Ramen Bowl", 
        restaurant: "Noodle Bar", 
        price: "$13.75", 
        time: "15 min", 
        emoji: "🍜",
        match: "90%",
        reason: "Authentic ramen experience"
      },
      { 
        id: 4, 
        name: "Fish Taco Trio", 
        restaurant: "Mexican Grill", 
        price: "$11.50", 
        time: "18 min", 
        emoji: "🌮",
        match: "88%",
        reason: "Fresh and flavorful tacos"
      },
      { 
        id: 5, 
        name: "Salmon Sushi Set", 
        restaurant: "Sushi Master", 
        price: "$18.99", 
        time: "12 min", 
        emoji: "🍣",
        match: "94%",
        reason: "Premium sushi selection"
      },
      { 
        id: 6, 
        name: "Caesar Salad Deluxe", 
        restaurant: "Fresh Garden", 
        price: "$9.99", 
        time: "10 min", 
        emoji: "🥗",
        match: "85%",
        reason: "Healthy and satisfying"
      },
      { 
        id: 7, 
        name: "Creamy Alfredo Pasta", 
        restaurant: "Pasta Corner", 
        price: "$15.25", 
        time: "22 min", 
        emoji: "🍝",
        match: "91%",
        reason: "Rich and comforting pasta"
      }
    ];

    // Filter meals based on liked foods and return top 5
    const matchedMeals = meals.filter(meal => 
      likedFoods.some(food => food.includes(meal.emoji))
    );
    
    // If we don't have enough matches, add some random recommendations
    const additionalMeals = meals.filter(meal => 
      !likedFoods.some(food => food.includes(meal.emoji))
    );
    
    return [...matchedMeals, ...additionalMeals].slice(0, 5);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameWon(false);
    setLikedFoods([]);
    setRecommendations([]);
    nextFood();
  };

  const nextFood = () => {
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    setCurrentFood(randomFood);
  };

  const makeChoice = (liked: boolean) => {
    if (liked) {
      const newLikedFoods = [...likedFoods, currentFood];
      setLikedFoods(newLikedFoods);
      setScore(score + 1);
      
      if (score + 1 >= 5) {
        const recs = getMealRecommendations(newLikedFoods);
        setRecommendations(recs);
        setGameWon(true);
        setGameStarted(false);
      } else {
        nextFood();
      }
    } else {
      nextFood();
    }
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

      {!gameStarted && !gameWon && (
        <div className="text-center space-y-6 py-8">
          <div className="text-6xl">🎮</div>
          <div>
            <h3 className="text-lg font-medium mb-2">Ready to Play?</h3>
            <p className="text-gray-600 mb-6">Tap ❤️ for foods you like, ❌ for foods you don't. Get 5 likes to discover your perfect meals!</p>
            <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
              Start Game
            </Button>
          </div>
        </div>
      )}

      {gameStarted && (
        <div className="text-center space-y-6 py-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Score: {score}/5</span>
          </div>
          
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
        </div>
      )}

      {gameWon && (
        <div className="space-y-6">
          <div className="text-center py-4">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Perfect Matches Found! 🎉</h3>
            <p className="text-gray-600">Based on your preferences, here are 5 meals you'll love:</p>
          </div>

          <div className="space-y-3">
            {recommendations.map((meal, index) => (
              <Card key={meal.id} className="p-4 border-2 border-green-200 hover:border-green-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{meal.emoji}</div>
                    <div>
                      <h4 className="font-bold text-gray-800">{meal.name}</h4>
                      <p className="text-sm text-gray-600">{meal.restaurant}</p>
                      <p className="text-xs text-green-600">{meal.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-bold text-sm">{meal.match}</div>
                    <div className="text-gray-600 text-sm">{meal.price} • {meal.time}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={startGame}
              variant="outline" 
              className="flex-1"
            >
              Play Again
            </Button>
            <Button className="flex-1 bg-green-500 hover:bg-green-600">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Order Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleGame;
