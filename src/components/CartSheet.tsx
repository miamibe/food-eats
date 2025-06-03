import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/utils";

export function CartSheet() {
  const { state, dispatch } = useCart();
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative rounded-full p-2 hover:bg-gray-50">
          <ShoppingCart className="w-5 h-5 text-gray-500" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0 w-full sm:max-w-lg">
        <div className="sticky top-0 bg-white border-b z-10 px-6 py-4">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-gray-500 p-6">
              Your cart is empty
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{item.emoji}</span>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.restaurant}</p>
                        </div>
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        {item.quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t p-6 mt-auto">
            <div className="flex justify-between text-lg font-medium mb-4">
              <span>Total</span>
              <span>{formatCurrency(state.total)}</span>
            </div>
            <Button className="w-full" size="lg">
              Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}