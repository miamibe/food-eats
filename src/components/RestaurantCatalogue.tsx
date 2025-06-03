
import { Card } from "@/components/ui/card";

const RestaurantCatalogue = () => {
  const restaurants = [
    {
      name: "Spice Garden",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    },
    {
      name: "Mario's Pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    },
    {
      name: "Sushi Express",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    },
    {
      name: "Fresh & Green",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    },
    {
      name: "Burger House",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    },
    {
      name: "Taco Bell",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="px-2">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Restaurants</h3>
      <div className="grid grid-cols-2 gap-4">
        {restaurants.map((restaurant, index) => (
          <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 text-center">
              <h4 className="text-sm font-medium text-gray-800">{restaurant.name}</h4>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RestaurantCatalogue;
