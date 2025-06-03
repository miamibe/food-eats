
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Search } from "lucide-react";
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
          <div className="space-y-8">
            {/* Quick Games Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-3">
                Quick Games
              </h2>
              <QuickGames onMoodMatcherClick={handleMoodMatcherClick} />
            </div>

            {/* Welcome Message */}
            <div className="text-center py-6">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                What are you craving?
              </h3>
              <p className="text-gray-500 text-sm">
                Use the search button below to tell us what you want
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-800 rounded-md flex items-center justify-center">
              <span className="text-white font-medium text-xs">EB</span>
            </div>
            <h1 className="text-lg font-medium text-gray-800">EasyBite</h1>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-gray-50">
            <User className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-md mx-auto pb-20">
        {renderMainContent()}
      </main>

      {/* Floating Action Button */}
      {activeView === "home" && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={() => setActiveView("search")}
            className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 shadow-sm transition-colors duration-200"
            size="icon"
          >
            <Search className="w-5 h-5 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
