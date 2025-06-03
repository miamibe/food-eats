
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, DollarSign } from "lucide-react";

interface CuisineAdventureMapProps {
  onBack: () => void;
}

const CuisineAdventureMap = ({ onBack }: CuisineAdventureMapProps) => {
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [discoveredDishes, setDiscoveredDishes] = useState<string[]>([]);

  const countries = [
    {
      name: "Italy",
      emoji: "🇮🇹",
      position: { top: "35%", left: "48%" },
      dishes: [
        { name: "Margherita Pizza", restaurant: "Tony's Pizzeria", price: "$14.50", time: "25 min", emoji: "🍕" },
        { name: "Carbonara Pasta", restaurant: "Roma Kitchen", price: "$16.99", time: "20 min", emoji: "🍝" },
        { name: "Tiramisu", restaurant: "Dolce Vita", price: "$8.50", time: "15 min", emoji: "🍰" }
      ]
    },
    {
      name: "Japan",
      emoji: "🇯🇵",
      position: { top: "40%", left: "85%" },
      dishes: [
        { name: "Salmon Sushi Set", restaurant: "Sushi Master", price: "$18.99", time: "12 min", emoji: "🍣" },
        { name: "Chicken Ramen", restaurant: "Noodle Bar", price: "$13.75", time: "15 min", emoji: "🍜" },
        { name: "Miso Soup", restaurant: "Tokyo Express", price: "$5.99", time: "10 min", emoji: "🍲" }
      ]
    },
    {
      name: "Mexico",
      emoji: "🇲🇽",
      position: { top: "45%", left: "20%" },
      dishes: [
        { name: "Fish Taco Trio", restaurant: "Mexican Grill", price: "$11.50", time: "18 min", emoji: "🌮" },
        { name: "Chicken Burrito", restaurant: "Cantina Fresh", price: "$9.99", time: "22 min", emoji: "🌯" },
        { name: "Guacamole & Chips", restaurant: "Aztec Kitchen", price: "$6.75", time: "8 min", emoji: "🥑" }
      ]
    },
    {
      name: "India",
      emoji: "🇮🇳",
      position: { top: "50%", left: "70%" },
      dishes: [
        { name: "Chicken Tikka Masala", restaurant: "Spice Garden", price: "$13.99", time: "30 min", emoji: "🍛" },
        { name: "Biryani Rice", restaurant: "Mumbai Palace", price: "$15.50", time: "35 min", emoji: "🍚" },
        { name: "Naan Bread", restaurant: "Tandoor House", price: "$4.99", time: "12 min", emoji: "🫓" }
      ]
    },
    {
      name: "Thailand",
      emoji: "🇹🇭",
      position: { top: "55%", left: "75%" },
      dishes: [
        { name: "Pad Thai", restaurant: "Bangkok Street", price: "$11.50", time: "28 min", emoji: "🍜" },
        { name: "Green Curry", restaurant: "Thai Garden", price: "$12.99", time: "25 min", emoji: "🍲" },
        { name: "Mango Sticky Rice", restaurant: "Sweet Thailand", price: "$7.50", time: "15 min", emoji: "🍚" }
      ]
    },
    {
      name: "France",
      emoji: "🇫🇷",
      position: { top: "32%", left: "45%" },
      dishes: [
        { name: "Croissant", restaurant: "Paris Café", price: "$3.50", time: "10 min", emoji: "🥐" },
        { name: "French Onion Soup", restaurant: "Bistro Lyon", price: "$9.99", time: "20 min", emoji: "🍲" },
        { name: "Crème Brûlée", restaurant: "Le Dessert", price: "$8.99", time: "15 min", emoji: "🍮" }
      ]
    }
  ];

  const handleCountryClick = (country: any) => {
    setSelectedCountry(country);
    if (!discoveredDishes.includes(country.name)) {
      setDiscoveredDishes([...discoveredDishes, country.name]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Cuisine Adventure Map</h2>
      </div>

      {!selectedCountry ? (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-gray-700">
              🗺️ Explore World Cuisines
            </h3>
            <p className="text-sm text-gray-500">
              Tap any country to discover authentic dishes available for delivery!
            </p>
          </div>

          {/* World Map */}
          <div className="relative bg-gradient-to-b from-blue-100 to-green-100 rounded-xl h-80 overflow-hidden border-2 border-gray-200">
            {/* Continents background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-200/40 to-yellow-100/40"></div>
            
            {/* Countries */}
            {countries.map((country) => (
              <Button
                key={country.name}
                onClick={() => handleCountryClick(country)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full text-2xl border-2 transition-all duration-300 hover:scale-110 ${
                  discoveredDishes.includes(country.name) 
                    ? 'border-green-400 bg-green-50 shadow-lg' 
                    : 'border-white bg-white/90 hover:bg-white shadow-md'
                }`}
                style={{ top: country.position.top, left: country.position.left }}
              >
                {country.emoji}
              </Button>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full border-2 border-white bg-white/90"></div>
                <span>Undiscovered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full border-2 border-green-400 bg-green-50"></div>
                <span>Explored</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Adventure Progress</h4>
                <p className="text-sm text-gray-600">
                  Discovered {discoveredDishes.length} of {countries.length} cuisines
                </p>
              </div>
              <div className="text-2xl">
                {discoveredDishes.length === countries.length ? "🏆" : "🗺️"}
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-6xl">{selectedCountry.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800">{selectedCountry.name}</h3>
            <p className="text-gray-600">Authentic dishes available for delivery</p>
          </div>

          <div className="space-y-3">
            {selectedCountry.dishes.map((dish: any, index: number) => (
              <Card key={index} className="p-4 border-2 border-orange-200 hover:border-orange-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{dish.emoji}</div>
                    <div>
                      <h4 className="font-bold text-gray-800">{dish.name}</h4>
                      <p className="text-sm text-gray-600">{dish.restaurant}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <DollarSign className="w-3 h-3" />
                      <span>{dish.price}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{dish.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={() => setSelectedCountry(null)}
              variant="outline" 
              className="flex-1"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Back to Map
            </Button>
            <Button className="flex-1 bg-green-500 hover:bg-green-600">
              Order Dishes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuisineAdventureMap;
