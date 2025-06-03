
import { Button } from "@/components/ui/button";
import { Brain, Shuffle, Gamepad2, Dice6 } from "lucide-react";

interface GameIconsProps {
  onMoodMatcherClick: () => void;
  onRandomPickClick: () => void;
  onGameClick: () => void;
  onDiceClick: () => void;
}

const GameIcons = ({ onMoodMatcherClick, onRandomPickClick, onGameClick, onDiceClick }: GameIconsProps) => {
  return (
    <div className="grid grid-cols-4 gap-3 px-2">
      <Button
        variant="outline"
        onClick={onMoodMatcherClick}
        className="h-20 flex flex-col items-center justify-center space-y-1 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-50"></div>
        <Brain className="w-6 h-6 text-blue-600 relative z-10" />
        <span className="text-xs text-blue-700 font-medium relative z-10">Mood</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={onRandomPickClick}
        className="h-20 flex flex-col items-center justify-center space-y-1 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-teal-500/20 opacity-50"></div>
        <Shuffle className="w-6 h-6 text-green-600 relative z-10" />
        <span className="text-xs text-green-700 font-medium relative z-10">Random</span>
      </Button>

      <Button
        variant="outline"
        onClick={onGameClick}
        className="h-20 flex flex-col items-center justify-center space-y-1 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 hover:from-purple-100 hover:to-violet-200 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-500/20 opacity-50"></div>
        <Gamepad2 className="w-6 h-6 text-purple-600 relative z-10" />
        <span className="text-xs text-purple-700 font-medium relative z-10">Game</span>
      </Button>

      <Button
        variant="outline"
        onClick={onDiceClick}
        className="h-20 flex flex-col items-center justify-center space-y-1 border-orange-200 bg-gradient-to-br from-orange-50 to-red-100 hover:from-orange-100 hover:to-red-200 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20 opacity-50"></div>
        <Dice6 className="w-6 h-6 text-orange-600 relative z-10" />
        <span className="text-xs text-orange-700 font-medium relative z-10">Dice</span>
      </Button>
    </div>
  );
};

export default GameIcons;
