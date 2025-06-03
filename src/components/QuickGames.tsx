
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
    <div className="grid grid-cols-2 gap-3">
      {games.map((game) => (
        <Card
          key={game.id}
          className="p-4 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg border-0"
        >
          <div className={`bg-gradient-to-br ${game.color} rounded-xl p-3 text-center`}>
            <div className="text-2xl mb-2">{game.emoji}</div>
            <h3 className="font-bold text-white text-sm mb-1">{game.title}</h3>
            <p className="text-white/80 text-xs">{game.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuickGames;
