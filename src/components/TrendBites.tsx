import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Star, Clock, MapPin, Loader2 } from "lucide-react";

interface TrendBitesProps {
  onBack: () => void;
}

interface SimilarMeal {
  id: string;
  name: string;
  restaurant: string;
  price: string;
  deliveryTime: string;
  emoji: string;
  description: string;
  relevance_score: number;
  match_explanation?: string;
}

interface TrendingDish {
  name: string;
  description: string;
  origin: string;
  trendScore: number;
  emoji: string;
  popularityReason: string;
  funFact: string;
}

const TrendBites = ({ onBack }: TrendBitesProps) => {
  const [currentTrend, setCurrentTrend] = useState(0);
  const [similarMeals, setSimilarMeals] = useState<SimilarMeal[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  const trendingDishes: TrendingDish[] = [
    {
      name: "Korean Corn Dogs",
      description: "Crispy, cheesy Korean-style hot dogs coated in potato cubes and panko breadcrumbs",
      origin: "South Korea 🇰🇷",
      trendScore: 98,
      emoji: "🌭",
      popularityReason: "Viral on TikTok with over 50M views this month",
      funFact: "Originally called 'hotteok' style corn dogs, they're stuffed with mozzarella and coated in cubed potatoes!"
    },
    {
      name: "Birria Tacos",
      description: "Slow-cooked beef in rich, spiced broth served with crispy tortillas and consommé for dipping",
      origin: "Mexico 🇲🇽",
      trendScore: 95,
      emoji: "🌮",
      popularityReason: "Featured in major food festivals and celebrity chef endorsements",
      funFact: "Traditionally eaten at celebrations, now the most requested taco variety in the US!"
    },
    {
      name: "Dalgona Coffee Dessert",
      description: "Whipped coffee cream over milk transformed into various dessert forms",
      origin: "South Korea 🇰🇷",
      trendScore: 92,
      emoji: "☕",
      popularityReason: "Pandemic home-cooking trend that evolved into restaurant specialty",
      funFact: "Named after Korean sponge toffee candy, it became the most searched recipe in 2020!"
    },
    {
      name: "Smash Burgers",
      description: "Ultra-thin beef patties smashed on hot griddle for maximum crispy edges and flavor",
      origin: "United States 🇺🇸",
      trendScore: 89,
      emoji: "🍔",
      popularityReason: "Championed by burger purists and food influencers for superior taste",
      funFact: "The technique creates 40% more surface area for the Maillard reaction!"
    },
    {
      name: "Ube Everything",
      description: "Purple yam from the Philippines featured in ice cream, pastries, and bubble tea",
      origin: "Philippines 🇵🇭",
      trendScore: 87,
      emoji: "🍠",
      popularityReason: "Instagram-worthy purple color driving social media engagement",
      funFact: "Ube has a nutty, vanilla-like flavor and is packed with antioxidants!"
    }
  ];

  const fetchSimilarMeals = async (description: string) => {
    setIsLoadingSimilar(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-meals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: description }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch similar meals');
      }

      const data = await response.json();
      setSimilarMeals(data.meals || []);
    } catch (error) {
      console.error('Error fetching similar meals:', error);
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  useEffect(() => {
    // Fetch similar meals when current trend changes
    const dish = trendingDishes[currentTrend];
    const searchQuery = `${dish.name} ${dish.description} ${dish.origin.split(' ')[0]} cuisine`;
    fetchSimilarMeals(searchQuery);
  }, [currentTrend]);

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

        {/* Available Near You */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Available Near You
          </h4>
          
          {isLoadingSimilar ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-gray-600" />
              <p className="text-gray-500 text-sm">Finding similar dishes...</p>
            </div>
          ) : similarMeals.length > 0 ? (
            similarMeals.map((restaurant) => (
              <Card key={restaurant.id} className="p-3 border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-800">{restaurant.name}</h5>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span className="font-bold text-green-600">{restaurant.price}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                    {restaurant.match_explanation && (
                      <p className="text-xs text-gray-500 mt-1">{restaurant.match_explanation}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{restaurant.relevance_score.toFixed(1)}</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No similar dishes found nearby</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button 
            onClick={() => setCurrentTrend((prev) => (prev - 1 + trendingDishes.length) % trendingDishes.length)} 
            variant="outline" 
            className="flex-1 mr-2"
          >
            ← Previous Trend
          </Button>
          <div className="text-sm text-gray-500 px-4">
            {currentTrend + 1} of {trendingDishes.length}
          </div>
          <Button 
            onClick={() => setCurrentTrend((prev) => (prev + 1) % trendingDishes.length)} 
            variant="outline" 
            className="flex-1 ml-2"
          >
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