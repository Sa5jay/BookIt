import React from 'react';
import { Minus, Plus } from 'lucide-react';

// Define the component's props
type BookingCardProps = {
  basePrice: number;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onSubmit: () => void;
  isSlotSelected: boolean;
};

const BookingCard: React.FC<BookingCardProps> = ({
  basePrice,
  quantity,
  onQuantityChange,
  onSubmit,
  isSlotSelected,
}) => {
  const subtotal = basePrice * quantity;
  const taxes = 50 * quantity; // Assuming 50 per person from image
  const total = subtotal + taxes;

  const handleIncrement = () => onQuantityChange(quantity + 1);
  const handleDecrement = () => onQuantityChange(Math.max(1, quantity - 1));

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 sticky top-8">
      {/* Price Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Starts at</span>
          <span className="font-semibold text-lg">₹{basePrice}</span>
        </div>

        {/* Quantity Selector */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Quantity</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDecrement}
              disabled={quantity === 1}
              className="p-1 rounded-full bg-gray-100 disabled:opacity-50"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold w-8 text-center">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="p-1 rounded-full bg-gray-100"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <hr />

        {/* Price Breakdown */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">₹{subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Taxes</span>
          <span className="font-semibold">₹{taxes}</span>
        </div>
        
        <hr />

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Total</span>
          <span className="text-xl font-bold text-red-600">₹{total}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onSubmit}
        disabled={!isSlotSelected}
        className="mt-6 w-full bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors
                   disabled:opacity-70 disabled:cursor-not-allowed
                   enabled:bg-purple-600 enabled:hover:bg-purple-700"
      >
        Confirm
      </button>
    </div>
  );
};

export default BookingCard;