
import { Card } from "@/components/ui/card";

const QuickGames = () => {
  const games = [
    {
      id: "mood",
      title: "Mood Matcher",
      emoji: "😋",
      description: "Swipe through moods",
      color: "from-purple-400 to-pink-400",
    },
    {
      id: "wheel",
      title: "Spin Wheel",
      emoji: "🎡",
      description: "Restaurant roulette",
      color: "from-blue-400 to-cyan-400",
    },
    {
      id: "this-or-that",
      title: "This or That",
      emoji: "🤔",
      description: "Quick binary choices",
      color: "from-yellow-400 to-orange-400",
    },
    {
      id: "surprise",
      title: "Surprise Me",
      emoji: "✨",
      description: "Complete random",
      color: "from-green-400 to-emerald-400",
    },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {games.map((game) => (
        <Card
          key={game.id}
          className="flex-shrink-0 w-20 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg border-0"
        >
          <div className={`bg-gradient-to-br ${game.color} rounded-xl p-2 text-center`}>
            <div className="text-xl mb-1">{game.emoji}</div>
            <h3 className="font-bold text-white text-xs leading-tight">{game.title}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuickGames;
