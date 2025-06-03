
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface BrowseSectionProps {
  mode: "restaurants" | "categories";
  onBack: () => void;
}

const BrowseSection = ({ mode, onBack }: BrowseSectionProps) => {
  const restaurants = [
    {
      name: "Spice Garden",
      cuisine: "Indian",
      rating: 4.8,
      time: "25-35 min",
      fee: "$1.99",
      emoji: "🍛",
    },
    {
      name: "Mario's Pizzeria",
      cuisine: "Italian",
      rating: 4.6,
      time: "30-40 min",
      fee: "Free",
      emoji: "🍕",
    },
    {
      name: "Sushi Express",
      cuisine: "Japanese",
      rating: 4.9,
      time: "20-30 min",
      fee: "$2.49",
      emoji: "🍣",
    },
    {
      name: "Fresh & Green",
      cuisine: "Healthy",
      rating: 4.7,
      time: "15-25 min",
      fee: "$1.49",
      emoji: "🥗",
    },
  ];

  const categories = [
    { name: "Pizza", emoji: "🍕", count: "12 restaurants" },
    { name: "Asian", emoji: "🍜", count: "18 restaurants" },
    { name: "Burgers", emoji: "🍔", count: "8 restaurants" },
    { name: "Mexican", emoji: "🌮", count: "10 restaurants" },
    { name: "Healthy", emoji: "🥗", count: "15 restaurants" },
    { name: "Italian", emoji: "🍝", count: "9 restaurants" },
    { name: "Desserts", emoji: "🍰", count: "6 restaurants" },
    { name: "Coffee", emoji: "☕", count: "14 restaurants" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold text-gray-800">
          Browse {mode === "restaurants" ? "Restaurants" : "Categories"}
        </h2>
      </div>

      {mode === "restaurants" ? (
        <div className="space-y-4">
          {restaurants.map((restaurant, index) => (
            <Card key={index} className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{restaurant.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm font-semibold text-green-600">
                      ⭐ {restaurant.rating}
                    </span>
                    <span className="text-sm text-gray-600">{restaurant.time}</span>
                    <span className="text-sm text-gray-600">
                      {restaurant.fee === "Free" ? "🆓 Free delivery" : `💳 ${restaurant.fee} fee`}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <Card key={index} className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 text-center">
              <div className="text-4xl mb-2">{category.emoji}</div>
              <h3 className="font-bold text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{category.count}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseSection;
