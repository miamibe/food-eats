
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Search, Grid2x2, List, Send, Plus } from "lucide-react";
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

            {/* Welcome Message */}
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                What are you craving? 🍽️
              </h3>
              <p className="text-gray-600">
                Use the search button below to tell us what you want
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 relative">
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
      <main className="px-4 py-6 max-w-md mx-auto pb-24">
        {renderMainContent()}
      </main>

      {/* Floating Action Button */}
      {activeView === "home" && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={() => setActiveView("search")}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200"
            size="icon"
          >
            <Search className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
