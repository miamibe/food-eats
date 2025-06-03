
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Star, Clock, MapPin } from "lucide-react";

interface TrendBitesProps {
  onBack: () => void;
}

const TrendBites = ({ onBack }: TrendBitesProps) => {
  const [currentTrend, setCurrentTrend] = useState(0);

  const trendingDishes = [
    {
      name: "Korean Corn Dogs",
      description: "Crispy, cheesy Korean-style hot dogs coated in potato cubes and panko breadcrumbs",
      origin: "South Korea 🇰🇷",
      trendScore: 98,
      restaurants: [
        { name: "K-Street Food", price: "$8.99", time: "15 min", rating: 4.8 },
        { name: "Seoul Kitchen", price: "$9.50", time: "20 min", rating: 4.7 },
        { name: "Kimchi Corner", price: "$7.99", time: "18 min", rating: 4.6 }
      ],
      emoji: "🌭",
      popularityReason: "Viral on TikTok with over 50M views this month",
      funFact: "Originally called 'hotteok' style corn dogs, they're stuffed with mozzarella and coated in cubed potatoes!"
    },
    {
      name: "Birria Tacos",
      description: "Slow-cooked beef in rich, spiced broth served with crispy tortillas and consommé for dipping",
      origin: "Mexico 🇲🇽",
      trendScore: 95,
      restaurants: [
        { name: "Birrieria Los Primos", price: "$12.99", time: "25 min", rating: 4.9 },
        { name: "Taco Libre", price: "$11.50", time: "22 min", rating: 4.7 },
        { name: "El Consommé", price: "$13.50", time: "30 min", rating: 4.8 }
      ],
      emoji: "🌮",
      popularityReason: "Featured in major food festivals and celebrity chef endorsements",
      funFact: "Traditionally eaten at celebrations, now the most requested taco variety in the US!"
    },
    {
      name: "Dalgona Coffee Dessert",
      description: "Whipped coffee cream over milk transformed into various dessert forms",
      origin: "South Korea 🇰🇷",
      trendScore: 92,
      restaurants: [
        { name: "Cloud Nine Café", price: "$6.99", time: "12 min", rating: 4.6 },
        { name: "Whipped Dreams", price: "$7.50", time: "15 min", rating: 4.5 },
        { name: "Seoul Sweets", price: "$5.99", time: "10 min", rating: 4.7 }
      ],
      emoji: "☕",
      popularityReason: "Pandemic home-cooking trend that evolved into restaurant specialty",
      funFact: "Named after Korean sponge toffee candy, it became the most searched recipe in 2020!"
    },
    {
      name: "Smash Burgers",
      description: "Ultra-thin beef patties smashed on hot griddle for maximum crispy edges and flavor",
      origin: "United States 🇺🇸",
      trendScore: 89,
      restaurants: [
        { name: "Smash & Grab", price: "$14.99", time: "18 min", rating: 4.8 },
        { name: "Crispy Edge", price: "$13.50", time: "20 min", rating: 4.6 },
        { name: "The Griddle", price: "$15.99", time: "22 min", rating: 4.7 }
      ],
      emoji: "🍔",
      popularityReason: "Championed by burger purists and food influencers for superior taste",
      funFact: "The technique creates 40% more surface area for the Maillard reaction!"
    },
    {
      name: "Ube Everything",
      description: "Purple yam from the Philippines featured in ice cream, pastries, and bubble tea",
      origin: "Philippines 🇵🇭",
      trendScore: 87,
      restaurants: [
        { name: "Purple Paradise", price: "$8.99", time: "15 min", rating: 4.5 },
        { name: "Manila Treats", price: "$9.50", time: "18 min", rating: 4.6 },
        { name: "Yam Yam Café", price: "$7.99", time: "12 min", rating: 4.4 }
      ],
      emoji: "🍠",
      popularityReason: "Instagram-worthy purple color driving social media engagement",
      funFact: "Ube has a nutty, vanilla-like flavor and is packed with antioxidants!"
    }
  ];

  const nextTrend = () => {
    setCurrentTrend((prev) => (prev + 1) % trendingDishes.length);
  };

  const prevTrend = () => {
    setCurrentTrend((prev) => (prev - 1 + trendingDishes.length) % trendingDishes.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTrend, 10000); // Auto-advance every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const dish = trendingDishes[currentTrend];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Trend Bites</h2>
        <div className="ml-auto flex items-center space-x-1 text-orange-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Daily Trends</span>
        </div>
      </div>

      {/* Trending Dish */}
      <div className="space-y-4">
        <div className="text-center space-y-3">
          <div className="text-6xl">{dish.emoji}</div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{dish.name}</h3>
            <p className="text-sm text-gray-600">{dish.origin}</p>
          </div>
          
          {/* Trend Score */}
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
              🔥 {dish.trendScore}% Trending
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <p className="text-gray-700 text-center">{dish.description}</p>
        </Card>

        {/* Why It's Trending */}
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
            Why It's Trending
          </h4>
          <p className="text-sm text-gray-700">{dish.popularityReason}</p>
        </Card>

        {/* Fun Fact */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Fun Fact</h4>
          <p className="text-sm text-gray-700">{dish.funFact}</p>
        </Card>

        {/* Available Restaurants */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Available Near You
          </h4>
          {dish.restaurants.map((restaurant, index) => (
            <Card key={index} className="p-3 border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-800">{restaurant.name}</h5>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span className="font-bold text-green-600">{restaurant.price}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{restaurant.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{restaurant.rating}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button onClick={prevTrend} variant="outline" className="flex-1 mr-2">
            ← Previous Trend
          </Button>
          <div className="text-sm text-gray-500 px-4">
            {currentTrend + 1} of {trendingDishes.length}
          </div>
          <Button onClick={nextTrend} variant="outline" className="flex-1 ml-2">
            Next Trend →
          </Button>
        </div>

        {/* Order Button */}
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          Order {dish.name} Now
        </Button>
      </div>
    </div>
  );
};

export default TrendBites;
