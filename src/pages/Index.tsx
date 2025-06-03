
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Search, Grid2x2, List, Send } from "lucide-react";
import QuickGames from "@/components/QuickGames";
import QuizFlow from "@/components/QuizFlow";
import RandomPick from "@/components/RandomPick";
import BrowseSection from "@/components/BrowseSection";
import MealSearch from "@/components/MealSearch";

const Index = () => {
  const [activeView, setActiveView] = useState("home");
  const [browseMode, setBrowseMode] = useState<"restaurants" | "categories">("restaurants");

  const handleMoodMatcherClick = () => {
    setActiveView("quiz");
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "quiz":
        return <QuizFlow onBack={() => setActiveView("home")} />;
      case "random":
        return <RandomPick onBack={() => setActiveView("home")} />;
      case "browse":
        return (
          <BrowseSection
            mode={browseMode}
            onBack={() => setActiveView("home")}
          />
        );
      case "search":
        return <MealSearch onBack={() => setActiveView("home")} />;
      default:
        return (
          <div className="space-y-6">
            {/* Quick Games Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🎮 Quick Games
              </h2>
              <QuickGames onMoodMatcherClick={handleMoodMatcherClick} />
            </div>

            {/* Main Search Input */}
            <div className="space-y-4">
              <MealSearch onBack={() => setActiveView("home")} isInline={true} />
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for food or restaurants..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EB</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">EasyBite</h1>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full p-2">
            <User className="w-6 h-6 text-gray-600" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-md mx-auto">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default Index;
