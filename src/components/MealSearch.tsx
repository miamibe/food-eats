
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MealSearchProps {
  onBack: () => void;
  isInline?: boolean;
}

interface Meal {
  id: string;
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

  const searchMealsWithSupabase = async () => {
    if (!query.trim()) {
      toast.error("Please enter what you're craving!");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      console.log('Searching for meals with query:', query);
      
      const { data, error } = await supabase.functions.invoke('search-meals', {
        body: { query }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.meals) {
        setMeals(data.meals);
        toast.success(`Found ${data.meals.length} great options for you!`);
      } else {
        setMeals([]);
        toast.info("No matches found. Try describing what you're craving differently!");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Something went wrong. Please try again.");
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      searchMealsWithSupabase();
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

        {/* Search Input */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              🎯 What are you craving?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Describe what you want and we'll find perfect matches from our partner restaurants!
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
              onClick={searchMealsWithSupabase}
              disabled={isLoading || !query.trim()}
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
              <Card key={meal.id || index} className="p-4 border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
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
