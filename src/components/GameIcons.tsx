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
        className="h-24 flex flex-col items-center justify-center space-y-1 border-none bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 relative overflow-hidden shadow-lg"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(96, 165, 250, 0.9), rgba(147, 51, 234, 0.9)),
            url(https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300)
          `,
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay'
        }}
      >
        <Brain className="w-8 h-8 text-white" />
        <span className="text-sm text-white font-medium">Mood</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={onCuisineMapClick}
        className="h-24 flex flex-col items-center justify-center space-y-1 border-none bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 relative overflow-hidden shadow-lg"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(52, 211, 153, 0.9), rgba(16, 185, 129, 0.9)),
            url(https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=300)
          `,
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay'
        }}
      >
        <MapPin className="w-8 h-8 text-white" />
        <span className="text-sm text-white font-medium">Map</span>
      </Button>

      <Button
        variant="outline"
        onClick={onGameClick}
        className="h-24 flex flex-col items-center justify-center space-y-1 border-none bg-gradient-to-br from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 relative overflow-hidden shadow-lg"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(192, 132, 252, 0.9), rgba(236, 72, 153, 0.9)),
            url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300)
          `,
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay'
        }}
      >
        <Gamepad2 className="w-8 h-8 text-white" />
        <span className="text-sm text-white font-medium">Game</span>
      </Button>

      <Button
        variant="outline"
        onClick={onTrendBitesClick}
        className="h-24 flex flex-col items-center justify-center space-y-1 border-none bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 relative overflow-hidden shadow-lg"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(251, 146, 60, 0.9), rgba(239, 68, 68, 0.9)),
            url(https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=300)
          `,
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay'
        }}
      >
        <TrendingUp className="w-8 h-8 text-white" />
        <span className="text-sm text-white font-medium">Trends</span>
      </Button>
    </div>
  );
};

export default GameIcons;