
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dice6, RotateCcw } from "lucide-react";

interface DicePickerProps {
  onBack: () => void;
}

const DicePicker = ({ onBack }: DicePickerProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [diceValue, setDiceValue] = useState(1);

  const cuisines = ["Italian", "Chinese", "Mexican", "Indian", "Japanese", "American"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Appetizer"];
  const moods = ["Comfort Food", "Healthy", "Spicy", "Sweet", "Savory", "Light"];

  const rollDice = async () => {
    setIsRolling(true);
    setResult(null);

    // Animate dice rolling
    const rollAnimation = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    // Stop after 2 seconds and show result
    setTimeout(() => {
      clearInterval(rollAnimation);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalValue);
      
      const selectedCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
      const selectedMealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];
      const selectedMood = moods[Math.floor(Math.random() * moods.length)];
      
      setResult(`${selectedMood} ${selectedCuisine} ${selectedMealType}`);
      setIsRolling(false);
    }, 2000);
  };

  const getDiceEmoji = (value: number) => {
    const diceEmojis = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    return diceEmojis[value - 1];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Dice Meal Picker</h2>
      </div>

      <div className="text-center space-y-8 py-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Roll the dice to discover your next meal!
          </h3>
          <p className="text-sm text-gray-500">
            Let fate decide what you should eat today
          </p>
        </div>

        {/* Dice Display */}
        <div className="flex justify-center">
          <div className={`text-8xl transition-transform duration-150 ${isRolling ? 'animate-bounce' : ''}`}>
            {getDiceEmoji(diceValue)}
          </div>
        </div>

        {/* Roll Button */}
        <Button
          onClick={rollDice}
          disabled={isRolling}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg disabled:opacity-50"
        >
          {isRolling ? (
            <>
              <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
              Rolling...
            </>
          ) : (
            <>
              <Dice6 className="w-5 h-5 mr-2" />
              Roll the Dice
            </>
          )}
        </Button>

        {/* Result */}
        {result && !isRolling && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 space-y-3 animate-fade-in">
            <h4 className="text-lg font-semibold text-gray-800">🎯 Your Meal Destiny:</h4>
            <p className="text-xl font-bold text-orange-700">{result}</p>
            <p className="text-sm text-gray-600">
              Time to find the perfect {result.toLowerCase()}!
            </p>
          </div>
        )}

        {result && (
          <Button
            onClick={() => setResult(null)}
            variant="outline"
            className="mt-4"
          >
            Roll Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default DicePicker;
