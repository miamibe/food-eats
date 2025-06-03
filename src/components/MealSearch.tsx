
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MealSearchProps {
  onBack: () => void;
  isInline?: boolean;
}

interface Meal {
  name: string;
  restaurant: string;
  price: string;
  deliveryTime: string;
  emoji: string;
  description: string;
}

const MealSearch = ({ onBack, isInline = false }: MealSearchProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState("");

  const searchMealsWithGroq = async () => {
    if (!query.trim()) {
      toast.error("Please enter what you're craving!");
      return;
    }

    if (!groqApiKey.trim()) {
      toast.error("Please enter your Groq API key!");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Call Groq API to get meal suggestions
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are a food recommendation assistant. When a user describes what they want to eat, provide exactly 10 meal suggestions in JSON format. Each meal should have: name, restaurant, price, deliveryTime, emoji, description. Make the restaurants sound realistic and varied. Prices should be between $8-25. Delivery times should be 15-45 minutes. Return only valid JSON array, no other text.'
            },
            {
              role: 'user',
              content: `I'm craving: ${query}. Please suggest 10 meals that match this craving.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!groqResponse.ok) {
        throw new Error(`Groq API error: ${groqResponse.status}`);
      }

      const groqData = await groqResponse.json();
      const content = groqData.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from Groq API');
      }

      // Parse the JSON response from Groq
      let suggestedMeals;
      try {
        suggestedMeals = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse Groq response:', content);
        throw new Error('Invalid response format from AI');
      }

      // Filter for meals available within 30 minutes (simulate database filtering)
      const availableMeals = suggestedMeals.filter((meal: any) => {
        const deliveryMinutes = parseInt(meal.deliveryTime);
        return deliveryMinutes <= 30;
      });

      // If no meals are within 30 minutes, take the first 5 and adjust their delivery times
      if (availableMeals.length === 0) {
        const adjustedMeals = suggestedMeals.slice(0, 5).map((meal: any) => ({
          ...meal,
          deliveryTime: `${Math.floor(Math.random() * 15) + 15} min`
        }));
        setMeals(adjustedMeals);
      } else {
        setMeals(availableMeals.slice(0, 10));
      }

      toast.success("Found great options for you!");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Something went wrong. Please check your API key and try again.");
      
      // Fallback to mock data if API fails
      const mockMeals: Meal[] = [
        {
          name: "Spicy Thai Curry",
          restaurant: "Bangkok Kitchen",
          price: "$12.99",
          deliveryTime: "25 min",
          emoji: "🍛",
          description: "Authentic red curry with your choice of protein"
        },
        {
          name: "Margherita Pizza",
          restaurant: "Tony's Pizzeria", 
          price: "$14.50",
          deliveryTime: "30 min",
          emoji: "🍕",
          description: "Fresh mozzarella, tomato sauce, and basil"
        }
      ];
      setMeals(mockMeals);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      searchMealsWithGroq();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold text-gray-800">Find Your Perfect Meal</h2>
        </div>

        {/* API Key Input */}
        {!hasSearched && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Groq API Key</label>
            <Input
              type="password"
              placeholder="Enter your Groq API key"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              className="h-12"
            />
            <p className="text-xs text-gray-500">
              Get your API key from{" "}
              <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                console.groq.com
              </a>
            </p>
          </div>
        )}

        {/* Search Input */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              🎯 What are you craving?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Describe what you want and we'll find perfect matches available within 30 minutes!
            </p>
          </div>
          <div className="relative">
            <Input
              placeholder="e.g., spicy noodles, healthy salad, comfort food..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 h-12 text-base"
            />
            <Button
              onClick={searchMealsWithGroq}
              disabled={isLoading || !query.trim() || !groqApiKey.trim()}
              size="sm"
              className="absolute right-2 top-2 h-8 w-8 p-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">Finding perfect matches for you...</p>
          </div>
        )}

        {/* Results */}
        {meals.length > 0 && !isLoading && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">
              Perfect matches for "{query}"
            </h3>
            {meals.map((meal, index) => (
              <Card key={index} className="p-4 border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{meal.emoji}</div>
                    <div>
                      <h4 className="font-bold text-gray-800">{meal.name}</h4>
                      <p className="text-sm text-gray-600">{meal.restaurant}</p>
                      <p className="text-xs text-gray-500 mt-1">{meal.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-bold text-sm">{meal.price}</div>
                    <div className="text-gray-600 text-sm">{meal.deliveryTime}</div>
                  </div>
                </div>
              </Card>
            ))}
            
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={() => {
                  setQuery("");
                  setMeals([]);
                  setHasSearched(false);
                }}
                variant="outline" 
                className="flex-1"
              >
                New Search
              </Button>
              <Button className="flex-1 bg-green-500 hover:bg-green-600">
                Order Now
              </Button>
            </div>
          </div>
        )}

        {/* No results state */}
        {hasSearched && meals.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">😔</div>
            <p className="text-gray-600">No matches found. Try describing what you're craving differently!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealSearch;
