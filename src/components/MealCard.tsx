import React from 'react';
import { Card } from "@/components/ui/card";
import { useCart, addToCart } from "@/lib/cart";
import { toast } from "sonner";

declare global {
  interface ImportMeta {
    env: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
    };
  }
}

export interface MealCardProps {
  id: string;
  name: string;
  restaurant: string;
  price: number | string;
  deliveryTime: string;
  emoji: string;
  description?: string;
  relevance_score?: number;
  match_explanation?: string;
  className?: string;
  showRestaurant?: boolean;
}

const MealCard: React.FC<MealCardProps> = ({
  id,
  name,
  restaurant,
  price,
  deliveryTime,
  emoji,
  description,
  match_explanation,
  className = "",
  showRestaurant = true,
}) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    addToCart(dispatch, {
      id,
      name,
      price: typeof price === 'string' ? parseFloat(price.replace('$', '')) : price,
      quantity: 1,
      restaurant,
      emoji
    });
    toast.success(`${name} added to cart!`);
  };

  return (
    <Card 
      className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${className}`}
      onClick={handleAddToCart}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-start space-x-3">
            <span className="text-2xl mt-0.5">{emoji}</span>
            <div className="min-w-0">
              <h4 className="font-medium text-gray-800 truncate">{name}</h4>
              {showRestaurant && (
                <p className="text-sm text-gray-600 truncate">{restaurant}</p>
              )}
              {description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
              )}
              {match_explanation && (
                <p className="text-xs text-gray-500 mt-1 italic">{match_explanation}</p>
              )}
            </div>
          </div>
        </div>
        <div className="text-right ml-2 flex-shrink-0">
          <p className="font-medium text-gray-800 whitespace-nowrap">
            {typeof price === 'number' ? `$${price.toFixed(2)}` : price}
          </p>
          <p className="text-sm text-gray-500 whitespace-nowrap">{deliveryTime}</p>
        </div>
      </div>
    </Card>
  );
};

export default MealCard;
