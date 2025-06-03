
import { Button } from "@/components/ui/button";
import { Brain, Shuffle, Gamepad2, Dice6 } from "lucide-react";

interface GameIconsProps {
  onMoodMatcherClick: () => void;
}

const GameIcons = ({ onMoodMatcherClick }: GameIconsProps) => {
  return (
    <div className="grid grid-cols-4 gap-3 px-2">
      <Button
        variant="outline"
        onClick={onMoodMatcherClick}
        className="h-16 flex flex-col items-center justify-center space-y-1 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
      >
        <Brain className="w-5 h-5 text-blue-600" />
        <span className="text-xs text-blue-700">Mood</span>
      </Button>
      
      <Button
        variant="outline"
        className="h-16 flex flex-col items-center justify-center space-y-1 border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
      >
        <Shuffle className="w-5 h-5 text-green-600" />
        <span className="text-xs text-green-700">Random</span>
      </Button>

      <Button
        variant="outline"
        className="h-16 flex flex-col items-center justify-center space-y-1 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors"
      >
        <Gamepad2 className="w-5 h-5 text-purple-600" />
        <span className="text-xs text-purple-700">Game</span>
      </Button>

      <Button
        variant="outline"
        className="h-16 flex flex-col items-center justify-center space-y-1 border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors"
      >
        <Dice6 className="w-5 h-5 text-orange-600" />
        <span className="text-xs text-orange-700">Dice</span>
      </Button>
    </div>
  );
};

export default GameIcons;
