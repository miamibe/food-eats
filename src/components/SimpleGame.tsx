
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Star } from "lucide-react";

interface SimpleGameProps {
  onBack: () => void;
}

const SimpleGame = ({ onBack }: SimpleGameProps) => {
  const [score, setScore] = useState(0);
  const [currentFood, setCurrentFood] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const foods = [
    "🍕 Pizza", "🍔 Burger", "🍜 Ramen", "🌮 Taco", "🍣 Sushi",
    "🥗 Salad", "🍝 Pasta", "🍲 Stew", "🥪 Sandwich", "🍱 Bento"
  ];

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameWon(false);
    nextFood();
  };

  const nextFood = () => {
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    setCurrentFood(randomFood);
  };

  const makeChoice = (liked: boolean) => {
    if (liked) {
      setScore(score + 1);
      if (score + 1 >= 5) {
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
            <p className="text-gray-600 mb-6">Tap ❤️ for foods you like, ❌ for foods you don't. Get 5 likes to win!</p>
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
        <div className="text-center space-y-6 py-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
          <h3 className="text-2xl font-bold text-gray-800">You Won! 🎉</h3>
          <p className="text-gray-600">You found 5 foods you love!</p>
          <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleGame;
