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
            className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-sm group transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgb(191, 219, 254), rgb(199, 181, 255))"
            }}
          >
            <Brain className="w-8 h-8 text-white/90 relative z-10" />
            <span className="text-sm text-white/90 font-medium relative z-10">Mood</span>
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
            className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-sm group transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgb(167, 243, 208), rgb(52, 211, 153))"
            }}
          >
            <MapPin className="w-8 h-8 text-white/90 relative z-10" />
            <span className="text-sm text-white/90 font-medium relative z-10">Map</span>
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
            className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-sm group transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgb(216, 180, 254), rgb(251, 146, 220))"
            }}
          >
            <Gamepad2 className="w-8 h-8 text-white/90 relative z-10" />
            <span className="text-sm text-white/90 font-medium relative z-10">Game</span>
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
            className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-sm group transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgb(253, 186, 140), rgb(248, 113, 113))"
            }}
          >
            <TrendingUp className="w-8 h-8 text-white/90 relative z-10" />
            <span className="text-sm text-white/90 font-medium relative z-10">Trends</span>
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