import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Loader2, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart, addToCart } from "@/lib/cart";

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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useCart();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setShowScrollTop(containerRef.current.scrollTop > 200);
      }
    };

    containerRef.current?.addEventListener('scroll', handleScroll);
    return () => containerRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const searchMealsWithSupabase = async () => {
    if (!query.trim()) {
      toast.error("Please enter what you're craving!");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-meals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch meals');
      }

      const data = await response.json();
      if (data?.meals) {
        setMeals(data.meals);
        if (data.meals.length > 0) {
          toast.success(`Found ${data.meals.length} great options for you!`);
        } else {
          toast.info("No matches found. Try describing what you're craving differently!");
        }
      } else {
        setMeals([]);
        toast.info("No matches found. Try describing what you're craving differently!");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
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

  const handleAddToCart = (meal: Meal) => {
    addToCart(dispatch, {
      id: meal.id,
      name: meal.name,
      price: typeof meal.price === 'string' ? parseFloat(meal.price.replace('$', '')) : meal.price,
      quantity: 1,
      restaurant: meal.restaurant,
      emoji: meal.emoji
    });
  };

  return (
    <div className="w-full flex flex-col gap-6" ref={containerRef}>
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-medium text-gray-800">Find Your Meal</h2>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Hungry? Tell the AI what you're in the mood for"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pr-12 h-12 text-base"
        />
        <Button
          onClick={searchMealsWithSupabase}
          disabled={isLoading || !query.trim()}
          size="sm"
          className="absolute right-2 top-2 h-8 w-8 p-0 bg-gray-800 hover:bg-gray-700"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500 text-sm">Finding perfect matches for you...</p>
        </div>
      )}

      {/* Results */}
      {meals.length > 0 && !isLoading && (
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-700">
            Perfect matches for "{query}"
          </h3>
          <div className="space-y-2">
            {meals.map((meal) => (
              <Card 
                key={meal.id} 
                className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleAddToCart(meal)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{meal.emoji}</span>
                      <div>
                        <h4 className="font-medium text-gray-800">{meal.name}</h4>
                        <p className="text-sm text-gray-600">{meal.restaurant}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{meal.price}</p>
                    <p className="text-sm text-gray-500">{meal.deliveryTime}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No results state */}
      {hasSearched && meals.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No matches found. Try describing what you're craving differently!</p>
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MealSearch;