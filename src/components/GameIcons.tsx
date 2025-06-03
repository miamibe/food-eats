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
    <div className="grid grid-cols-4 gap-3 px-2">
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={onMoodMatcherClick}
            className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-lg group transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgb(147, 197, 253), rgb(167, 139, 250))"
            }}
          >
            <Brain className="w-8 h-8 text-white relative z-10" />
            <span className="text-sm text-white font-medium relative z-10">Mood</span>
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
            className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-lg group transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgb(110, 231, 183), rgb(16, 185, 129))"
            }}
          >
            <MapPin className="w-8 h-8 text-white relative z-10" />
            <span className="text-sm text-white font-medium relative z-10">Map</span>
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
            className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-lg group transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgb(192, 132, 252), rgb(244, 114, 182))"
            }}
          >
            <Gamepad2 className="w-8 h-8 text-white relative z-10" />
            <span className="text-sm text-white font-medium relative z-10">Game</span>
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
            className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-lg group transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgb(251, 146, 60), rgb(239, 68, 68))"
            }}
          >
            <TrendingUp className="w-8 h-8 text-white relative z-10" />
            <span className="text-sm text-white font-medium relative z-10">Trends</span>
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