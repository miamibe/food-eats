import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import GameIcons from "@/components/GameIcons";
import QuizFlow from "@/components/QuizFlow";
import CuisineAdventureMap from "@/components/CuisineAdventureMap";
import SimpleGame from "@/components/SimpleGame";
import TrendBites from "@/components/TrendBites";
import BrowseSection from "@/components/BrowseSection";
import MealSearch from "@/components/MealSearch";
import RestaurantCatalogue from "@/components/RestaurantCatalogue";
import RestaurantMeals from "@/components/RestaurantMeals";
import { CartSheet } from "@/components/CartSheet";

const Index = () => {
  const [activeView, setActiveView] = useState("home");
  const [browseMode, setBrowseMode] = useState<"restaurants" | "categories">("restaurants");
  const [selectedRestaurant, setSelectedRestaurant] = useState<{id: string, name: string} | null>(null);

  const handleMoodMatcherClick = () => {
    setActiveView("quiz");
  };

  const handleCuisineMapClick = () => {
    setActiveView("cuisine-map");
  };

  const handleGameClick = () => {
    setActiveView("game");
  };

  const handleTrendBitesClick = () => {
    setActiveView("trend-bites");
  };

  const handleSearchClick = () => {
    setActiveView("search");
  };

  const handleRestaurantClick = (restaurantId: string, restaurantName: string) => {
    setSelectedRestaurant({ id: restaurantId, name: restaurantName });
    setActiveView("restaurant-meals");
  };

  const handleBackToHome = () => {
    setActiveView("home");
    setSelectedRestaurant(null);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "quiz":
        return <QuizFlow onBack={handleBackToHome} />;
      case "cuisine-map":
        return <CuisineAdventureMap onBack={handleBackToHome} />;
      case "game":
        return <SimpleGame onBack={handleBackToHome} />;
      case "trend-bites":
        return <TrendBites onBack={handleBackToHome} />;
      case "browse":
        return (
          <BrowseSection
            mode={browseMode}
            onBack={handleBackToHome}
          />
        );
      case "search":
        return <MealSearch onBack={handleBackToHome} />;
      case "restaurant-meals":
        return selectedRestaurant ? (
          <RestaurantMeals
            restaurantId={selectedRestaurant.id}
            restaurantName={selectedRestaurant.name}
            onBack={handleBackToHome}
          />
        ) : null;
      default:
        return (
          <div className="space-y-6">
            <GameIcons 
              onMoodMatcherClick={handleMoodMatcherClick}
              onCuisineMapClick={handleCuisineMapClick}
              onGameClick={handleGameClick}
              onTrendBitesClick={handleTrendBitesClick}
            />

            <div className="px-2">
              <button
                onClick={handleSearchClick}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-left text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Hungry? Tell the AI what you're in the mood for
              </button>
            </div>

            <RestaurantCatalogue onRestaurantClick={handleRestaurantClick} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">FE</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Food Eats</h1>
              <p className="text-xs text-gray-500">Delicious food delivered</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CartSheet />
            <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-gray-50">
              <User className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-md mx-auto pb-20">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default Index;