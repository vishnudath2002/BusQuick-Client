import React, {  } from 'react';
import { Check, X } from 'lucide-react';

interface SeatProps {
  seatNumber: string;
  isBooked: boolean;
  isSelected: boolean;
  onSelect: (seatNumber: string) => void;
}

export const Seat: React.FC<SeatProps> = ({
  seatNumber,
  isBooked,
  isSelected,
  onSelect,
}) => {
  const getSeatColor = () => {
    if (isBooked) return'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-200';
    if (isSelected) return 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200';
    return  'bg-gray-400 cursor-not-allowed opacity-50';
  };
  

  return (
    <button
  onClick={() => isBooked && onSelect(seatNumber)}
  disabled={!isBooked} 
  className={`
    ${getSeatColor()} 
    w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center 
    text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl
  `}
>
  {!isBooked ? <X size={30} className="text-gray-600" /> : isSelected ? <Check size={30} /> : seatNumber}
</button>
  );
};