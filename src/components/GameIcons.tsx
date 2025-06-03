import { Button } from "@/components/ui/button";
import { Brain, MapPin, Gamepad2, TrendingUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GameIconsProps {
  onMoodMatcherClick: () => void;
  onCuisineMapClick: () => void;
  onGameClick: () => void;
  onTrendBitesClick: () => void;
}

const GameIcons = ({ onMoodMatcherClick, onCuisineMapClick, onGameClick, onTrendBitesClick }: GameIconsProps) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={onMoodMatcherClick}
            className="h-24 flex flex-col items-center justify-center gap-2 border-none bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
          >
            <div className="rounded-lg p-2 bg-gradient-to-br from-blue-400 to-purple-400">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600 text-center leading-tight">Food<br />Mood</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px] text-center">
          <p>Take a quick quiz to discover meals that match your current mood and cravings</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={onCuisineMapClick}
            className="h-24 flex flex-col items-center justify-center gap-2 border-none bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300"
          >
            <div className="rounded-lg p-2 bg-gradient-to-br from-emerald-400 to-teal-400">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600 text-center leading-tight">World<br />Cuisine</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px] text-center">
          <p>Explore cuisines from around the world on an interactive food adventure map</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={onGameClick}
            className="h-24 flex flex-col items-center justify-center gap-2 border-none bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
          >
            <div className="rounded-lg p-2 bg-gradient-to-br from-purple-400 to-pink-400">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600 text-center leading-tight">Food<br />Match</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px] text-center">
          <p>Play a fun food matching game to discover new dishes you'll love</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={onTrendBitesClick}
            className="h-24 flex flex-col items-center justify-center gap-2 border-none bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300"
          >
            <div className="rounded-lg p-2 bg-gradient-to-br from-orange-400 to-red-400">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600 text-center leading-tight">Food<br />Trends</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px] text-center">
          <p>Discover the hottest food trends and most popular dishes right now</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default GameIcons;