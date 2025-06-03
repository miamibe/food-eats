import { Button } from "@/components/ui/button";
import { Brain, MapPin, Gamepad2, TrendingUp } from "lucide-react";

interface GameIconsProps {
  onMoodMatcherClick: () => void;
  onCuisineMapClick: () => void;
  onGameClick: () => void;
  onTrendBitesClick: () => void;
}

const GameIcons = ({ onMoodMatcherClick, onCuisineMapClick, onGameClick, onTrendBitesClick }: GameIconsProps) => {
  return (
    <div className="grid grid-cols-4 gap-3 px-2">
      <Button
        variant="outline"
        onClick={onMoodMatcherClick}
        className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-lg group"
        style={{
          background: "linear-gradient(135deg, rgb(147, 197, 253, 0.9), rgb(167, 139, 250, 0.9))"
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300')] bg-cover opacity-20 group-hover:opacity-30 transition-opacity" />
        <Brain className="w-8 h-8 text-white relative z-10" />
        <span className="text-sm text-white font-medium relative z-10">Mood</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={onCuisineMapClick}
        className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-lg group"
        style={{
          background: "linear-gradient(135deg, rgb(110, 231, 183, 0.9), rgb(16, 185, 129, 0.9))"
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=300')] bg-cover opacity-20 group-hover:opacity-30 transition-opacity" />
        <MapPin className="w-8 h-8 text-white relative z-10" />
        <span className="text-sm text-white font-medium relative z-10">Map</span>
      </Button>

      <Button
        variant="outline"
        onClick={onGameClick}
        className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-lg group"
        style={{
          background: "linear-gradient(135deg, rgb(192, 132, 252, 0.9), rgb(244, 114, 182, 0.9))"
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300')] bg-cover opacity-20 group-hover:opacity-30 transition-opacity" />
        <Gamepad2 className="w-8 h-8 text-white relative z-10" />
        <span className="text-sm text-white font-medium relative z-10">Game</span>
      </Button>

      <Button
        variant="outline"
        onClick={onTrendBitesClick}
        className="h-24 flex flex-col items-center justify-center space-y-1 border-none relative overflow-hidden shadow-lg group"
        style={{
          background: "linear-gradient(135deg, rgb(251, 146, 60, 0.9), rgb(239, 68, 68, 0.9))"
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=300')] bg-cover opacity-20 group-hover:opacity-30 transition-opacity" />
        <TrendingUp className="w-8 h-8 text-white relative z-10" />
        <span className="text-sm text-white font-medium relative z-10">Trends</span>
      </Button>
    </div>
  );
};

export default GameIcons;