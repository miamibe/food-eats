import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CuisineAdventureMapProps {
  onBack: () => void;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string;
  delivery_time_min: number;
  delivery_time_max: number;
  rating: number;
  image_url: string;
  description: string;
}

interface Region {
  id: string;
  name: string;
  emoji: string;
  color: string;
  position: { top: string; left: string };
  dishes: {
    name: string;
    description: string;
    image: string;
    emoji: string;
  }[];
}

const regions: Region[] = [
  {
    id: "americas",
    name: "The Americas",
    emoji: "🌮",
    color: "#FFB5BA",
    position: { top: "40%", left: "25%" },
    dishes: [
      {
        name: "Street Tacos",
        description: "Authentic Mexican tacos with salsa",
        image: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg",
        emoji: "🌮"
      },
      {
        name: "BBQ Ribs",
        description: "Slow-cooked smoky barbecue ribs",
        image: "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg",
        emoji: "🍖"
      },
      {
        name: "Poutine",
        description: "Canadian fries with gravy and cheese curds",
        image: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg",
        emoji: "🍟"
      }
    ]
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    emoji: "🫒",
    color: "#B5EAD7",
    position: { top: "35%", left: "45%" },
    dishes: [
      {
        name: "Greek Mezze",
        description: "Assorted appetizers with pita bread",
        image: "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg",
        emoji: "🥙"
      },
      {
        name: "Paella",
        description: "Saffron rice with seafood and chorizo",
        image: "https://images.pexels.com/photos/12419160/pexels-photo-12419160.jpeg",
        emoji: "🥘"
      },
      {
        name: "Italian Pasta",
        description: "Fresh pasta with authentic sauces",
        image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
        emoji: "🍝"
      }
    ]
  },
  {
    id: "south-asia",
    name: "South Asia",
    emoji: "🍛",
    color: "#E2F0CB",
    position: { top: "45%", left: "65%" },
    dishes: [
      {
        name: "Butter Chicken",
        description: "Creamy tomato curry with tender chicken",
        image: "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg",
        emoji: "🍗"
      },
      {
        name: "Biryani",
        description: "Aromatic rice with spices and meat",
        image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg",
        emoji: "🍚"
      },
      {
        name: "Masala Dosa",
        description: "Crispy crepe with spiced potato filling",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
        emoji: "🥞"
      }
    ]
  },
  {
    id: "east-asia",
    name: "East Asia",
    emoji: "🍜",
    color: "#FFE8D6",
    position: { top: "30%", left: "80%" },
    dishes: [
      {
        name: "Sushi Platter",
        description: "Fresh assorted sushi and sashimi",
        image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg",
        emoji: "🍣"
      },
      {
        name: "Korean BBQ",
        description: "Grilled marinated meats and banchan",
        image: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg",
        emoji: "🥩"
      },
      {
        name: "Dim Sum",
        description: "Variety of steamed dumplings and buns",
        image: "https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg",
        emoji: "🥟"
      }
    ]
  },
  {
    id: "africa",
    name: "Africa",
    emoji: "🍖",
    color: "#FFDAC1",
    position: { top: "55%", left: "45%" },
    dishes: [
      {
        name: "Jollof Rice",
        description: "Spiced tomato rice with vegetables",
        image: "https://images.pexels.com/photos/7438539/pexels-photo-7438539.jpeg",
        emoji: "🍚"
      },
      {
        name: "Ethiopian Platter",
        description: "Injera bread with various stews",
        image: "https://images.pexels.com/photos/5779364/pexels-photo-5779364.jpeg",
        emoji: "🥘"
      },
      {
        name: "Moroccan Tagine",
        description: "Slow-cooked aromatic stew",
        image: "https://images.pexels.com/photos/7627422/pexels-photo-7627422.jpeg",
        emoji: "🍲"
      }
    ]
  }
];

const CuisineAdventureMap = ({ onBack }: CuisineAdventureMapProps) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animatingRegion, setAnimatingRegion] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRegion) {
      fetchRestaurants(selectedRegion);
    }
  }, [selectedRegion]);

  const fetchRestaurants = async (region: Region) => {
    setIsLoading(true);
    try {
      const cuisineMap = {
        "east-asia": ["Japanese", "Korean", "Chinese"],
        "south-asia": ["Indian", "Thai", "Vietnamese"],
        "mediterranean": ["Italian", "Greek", "Spanish"],
        "americas": ["Mexican", "American", "Canadian"],
        "africa": ["Ethiopian", "Moroccan", "Nigerian"]
      };

      const cuisineTypes = cuisineMap[region.id as keyof typeof cuisineMap];
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .in('cuisine_type', cuisineTypes)
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error("Failed to load restaurants");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionClick = (region: Region) => {
    setAnimatingRegion(region.id);
    setShowAnimation(true);
    
    setTimeout(() => {
      setSelectedRegion(region);
      setShowAnimation(false);
      setAnimatingRegion(null);
    }, 1000);
  };

  const formatDeliveryTime = (min: number, max: number) => {
    return `${min}-${max} min`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Cuisine Adventure Map</h2>
      </div>

      {!selectedRegion ? (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-gray-700">
              🗺️ Explore World Cuisines
            </h3>
            <p className="text-sm text-gray-500">
              Click on regions to discover authentic dishes from around the world!
            </p>
          </div>

          {/* Stylized World Map */}
          <div className="relative bg-[#4A90A7] rounded-xl h-[500px] overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 text-2xl">🧭</div>
            <div className="absolute top-4 right-4 text-2xl">☀️</div>
            <div className="absolute bottom-4 left-4 text-2xl">🌊</div>
            <div className="absolute bottom-4 right-4 text-2xl">🗺️</div>
            <div className="absolute top-1/2 right-1/4 text-xl opacity-50">✈️</div>
            <div className="absolute bottom-1/3 left-1/3 text-xl opacity-50">⛵</div>

            {/* Region Circles */}
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => handleRegionClick(region)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500
                  ${animatingRegion === region.id ? 'scale-110' : 'hover:scale-105'}`}
                style={{
                  top: region.position.top,
                  left: region.position.left,
                  width: "200px",
                  height: "200px",
                }}
              >
                <div
                  className="w-full h-full rounded-full flex flex-col items-center justify-center text-center p-4"
                  style={{
                    backgroundColor: region.color,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <span className="text-4xl mb-2">{region.emoji}</span>
                  <span className="text-lg font-medium text-gray-800">{region.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Region Details */}
          <div className="text-center space-y-2">
            <div className="text-4xl mb-2">{selectedRegion.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800">{selectedRegion.name}</h3>
            <p className="text-gray-600">Discover authentic {selectedRegion.name} cuisine</p>
          </div>

          {/* Signature Dishes */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Signature Dishes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedRegion.dishes.map((dish, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 text-2xl">
                      {dish.emoji}
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-800">{dish.name}</h5>
                    <p className="text-sm text-gray-600">{dish.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Restaurants */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Available Nearby
            </h4>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-gray-600" />
                <p className="text-gray-500 text-sm">Finding local restaurants...</p>
              </div>
            ) : restaurants.length > 0 ? (
              <div className="space-y-3">
                {restaurants.map((restaurant) => (
                  <Card 
                    key={restaurant.id} 
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-800">{restaurant.name}</h5>
                        <div className="text-sm text-gray-600">{restaurant.cuisine_type}</div>
                        <div className="flex items-center space-x-3 mt-1 text-sm">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDeliveryTime(restaurant.delivery_time_min, restaurant.delivery_time_max)}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Delivery Fee: $2.99
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-500 font-medium">★ {restaurant.rating}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No restaurants available in your area</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex space-x-3">
            <Button 
              onClick={() => setSelectedRegion(null)} 
              variant="outline" 
              className="flex-1"
            >
              Back to Map
            </Button>
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
              View All Restaurants
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuisineAdventureMap;