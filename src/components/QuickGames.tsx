
import { Button } from "@/components/ui/button";
import { Shuffle, Brain } from "lucide-react";

interface QuickGamesProps {
  onMoodMatcherClick: () => void;
}

const QuickGames = ({ onMoodMatcherClick }: QuickGamesProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        onClick={onMoodMatcherClick}
        className="h-16 flex flex-col items-center justify-center space-y-1 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        <Brain className="w-4 h-4 text-gray-600" />
        <span className="text-xs text-gray-700 font-medium">Mood Matcher</span>
      </Button>
      
      <Button
        variant="outline"
        className="h-16 flex flex-col items-center justify-center space-y-1 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        <Shuffle className="w-4 h-4 text-gray-600" />
        <span className="text-xs text-gray-700 font-medium">Random Pick</span>
      </Button>
    </div>
  );
};

export default QuickGames;
